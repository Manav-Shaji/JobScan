export const authConfig = {
    pages: {
        signIn: '/auth',
        newUser: '/auth?mode=signup',
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                // If user didn't check rememberMe, expire their session in 24 hours instead of 30 days
                if (user.rememberMe === false) {
                    token.exp = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id as string;
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
