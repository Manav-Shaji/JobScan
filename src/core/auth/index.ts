import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query } from '@/core/db/client';
import { logger } from '@/core/lib/logger';

import { authConfig } from './auth.config';

// --- Credentials Provider ---

const credentialsProvider = CredentialsProvider({
    name: 'Credentials',
    credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Password', type: 'password' }, rememberMe: { label: 'Remember Me', type: 'text' } },
    async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
            logger.logSecurity('Failed login attempt due to missing credentials');
            return null;
        }
        const cleanEmail = (credentials.email as string).toLowerCase().trim();
        try {
            logger.debug('Auth DB connection check', {
              host: process.env.DB_HOST,
              database: process.env.DB_NAME,
              // NEVER log DB_PASSWORD or credentials.password
            });
            const result = await query('SELECT id, email, name, password_hash FROM users WHERE email = $1', [cleanEmail]);
            const user = result.rows[0];
            
            logger.debug('Auth lookup result', {
              email: cleanEmail,
              userFound: !!user,
              hashExists: !!user?.password_hash,
              hashLength: user?.password_hash?.length,
              hashPrefix: user?.password_hash?.slice(0, 4),
            });
            
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

// --- NextAuth Instance ---

const nextAuth = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [credentialsProvider],
    logger: {
        error(err: any) {
            if (err?.name === 'CredentialsSignin' || err?.message?.includes('CredentialsSignin')) {
                return; // Suppress noisy CredentialsSignin stack trace
            }
            logger.error('NextAuth Error', err);
        },
        warn(code) {
            logger.warn(`NextAuth Warning: ${code}`);
        },
        debug(code, metadata) {
            logger.debug(`NextAuth Debug: ${code}`, metadata);
        }
    }
});

export const { handlers, auth } = nextAuth;
