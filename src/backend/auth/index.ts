import NextAuth from 'next-auth';
import { authConfig } from './config';
import { credentialsProvider } from './providers/credentials';

const nextAuth = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    providers: [credentialsProvider],
});

export const { handlers, auth } = nextAuth;
const { signIn, signOut } = nextAuth;
