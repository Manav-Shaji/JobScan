export const authConfig = {
    pages: {
        signIn: '/auth',
        newUser: '/auth?mode=signup',
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
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
