import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query } from '@/database/connection/db';
import { logger } from '@/backend/logging/logger';

export const credentialsProvider = CredentialsProvider({
    name: 'Credentials',
    credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' }, rememberMe: { label: 'Remember Me', type: 'text' } },
    async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            logger.logSecurity('Failed login attempt due to missing credentials');
            return null;
        }
        const cleanEmail = (credentials.email as string).toLowerCase().trim();
        try {
            const result = await query('SELECT id, email, name, password_hash FROM users WHERE email = $1', [cleanEmail]);
            const user = result.rows[0];
            
            if (!user || !user.password_hash) {
                logger.logSecurity('Failed login attempt: User email not found', { email: cleanEmail });
                return null;
            }
            
            const isValid = await bcrypt.compare(credentials.password as string, user.password_hash);
            
            if (isValid) {
                logger.logApp('Successful login', { userId: user.id, email: user.email });
                const rememberMe = credentials.rememberMe === 'true' || credentials.rememberMe === true;
                return { id: user.id, email: user.email, name: user.name, rememberMe };
            } else {
                logger.logSecurity('Failed login attempt: Incorrect password', { email: cleanEmail });
                return null;
            }
        } catch (err) {
            logger.error('Database error during credentials authorization', err, { email: cleanEmail });
            return null;
        }
    },
});
