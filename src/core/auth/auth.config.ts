/**
 * ------------------------------------------------------------
 * File: auth.config.ts
 * 
 * Purpose:
 * NextAuth configuration object and session callbacks.
 * 
 * Responsibilities:
 * • Define authentication pages (login, signup)
 * • Configure JWT manipulation and expiration
 * • Ensure user ID propagates into the session object
 * 
 * Used By:
 * • NextAuth Initialization
 * ------------------------------------------------------------
 */

export const authConfig = {
    pages: {
        signIn: '/auth',
        newUser: '/auth?mode=signup',
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id || token.sub;
                if (user.rememberMe === false) {
                    token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = (token.id || token.sub) as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt' as const,
    },
    trustHost: true,
    providers: [],
};
