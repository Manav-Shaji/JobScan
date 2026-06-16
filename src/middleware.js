import NextAuth from 'next-auth';
import { authConfig } from '@/backend/auth/config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAppPage = req.nextUrl.pathname.startsWith('/dashboard');

    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return null;
    }

    if (isAppPage && !isLoggedIn && req.nextUrl.pathname !== '/dashboard/analyzer') {
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            from += req.nextUrl.search;
        }
        return NextResponse.redirect(
            new URL(`/auth?callbackUrl=${encodeURIComponent(from)}`, req.url),
        );
    }

    return null;
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
