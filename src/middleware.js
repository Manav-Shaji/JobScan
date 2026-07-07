import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    const token = await getToken({ 
        req, 
        secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET 
    });
    const isLoggedIn = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAppPage = req.nextUrl.pathname.startsWith('/dashboard');

    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
        return NextResponse.next();
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

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
