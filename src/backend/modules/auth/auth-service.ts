import 'server-only';
import { pool } from '@/backend/db/db';
import bcrypt from 'bcryptjs';
import { CHECK_USER_EXISTS, INSERT_USER } from './user-queries';
import { logger } from '@/backend/logging/logger';
import { runDatabaseMigrations } from '@/backend/db/db-migrations';

/**
 * Service handling user account registration in JobScan. Enforces transactional DB operations,
 * registers records in `users` table, and logs events locally.
 */
export async function registerUser({ email, password, name }: any) {
  await runDatabaseMigrations();
  const cleanEmail = email.toLowerCase().trim();
  const client = await pool.connect();
  try {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    await client.query('BEGIN');
    
    const existing = await client.query(CHECK_USER_EXISTS, [cleanEmail]);
    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      logger.logSecurity('User registration attempted with existing email address', { email: cleanEmail });
      return { error: 'User already exists', status: 409 };
    }
    
    // Ensure name is non-empty since it is NOT NULL in the users table
    const cleanName = (name && name.trim()) || cleanEmail.split('@')[0];
    
    const userResult = await client.query(INSERT_USER, [cleanEmail, cleanName, passwordHash]);
    const newUser = userResult.rows[0];
    
    await client.query('COMMIT');
    
    logger.logApp('User registration completed successfully', { userId: newUser.id, email: cleanEmail });
    
    return { user: newUser, status: 201 };
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Database transaction failed during registration flow', error, { email: cleanEmail });
    throw error;
  } finally {
    client.release();
  }
}
