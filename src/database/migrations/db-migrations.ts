import 'server-only';
import { query } from '@/database/connection/db';
import { logger } from '@/backend/logging/logger';

let dbInitialized = false;

export async function runDatabaseMigrations() {
  if (dbInitialized) return;
  
  try {
    // Enable UUID extension
    await query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        retention_days INTEGER DEFAULT 90,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Create job_scans table
    await query(`
      CREATE TABLE IF NOT EXISTS job_scans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        content TEXT,
        content_hash VARCHAR(64) NOT NULL,
        scan_type VARCHAR(20) NOT NULL,
        trust_score INTEGER,
        risk_level VARCHAR(20),
        pattern_name VARCHAR(100),
        pattern_confidence INTEGER,
        poster_url TEXT,
        poster_text TEXT,
        red_flags JSONB,
        positive_signals JSONB,
        analysis JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_job_scans_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create scam_reports table
    await query(`
      CREATE TABLE IF NOT EXISTS scam_reports (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        scan_id UUID NOT NULL,
        reported_by UUID NOT NULL,
        reason TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_scam_reports_scan FOREIGN KEY(scan_id) REFERENCES job_scans(id) ON DELETE CASCADE,
        CONSTRAINT fk_scam_reports_user FOREIGN KEY(reported_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create chat_messages table
    await query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        CONSTRAINT fk_chat_messages_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create indexes
    await query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);`);
    await query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_job_scans_content_hash ON job_scans(content_hash);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_job_scans_user_id ON job_scans(user_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_job_scans_created_at_desc ON job_scans(created_at DESC);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_job_scans_user_created_at ON job_scans(user_id, created_at DESC);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_job_scans_risk_level ON job_scans(risk_level);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_job_scans_pattern_name ON job_scans(pattern_name);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_scam_reports_scan_id ON scam_reports(scan_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_scam_reports_reported_by ON scam_reports(reported_by);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created_at ON chat_messages(user_id, created_at DESC);`);

    dbInitialized = true;
    logger.info('Database initialized and verified successfully.');
  } catch (error) {
    logger.error('Failed to initialize database tables and constraints', error);
  }
}
