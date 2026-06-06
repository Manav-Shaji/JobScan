import { NextResponse } from 'next/server';

export default function middleware(req) {
    const sessionToken = req.cookies.get('authjs.session-token')?.value || 
                         req.cookies.get('__Secure-authjs.session-token')?.value ||
                         req.cookies.get('next-auth.session-token')?.value ||
                         req.cookies.get('__Secure-next-auth.session-token')?.value;
    
    const isLoggedIn = !!sessionToken;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAppPage = req.nextUrl.pathname.startsWith('/app');

    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/app', req.url));
        }
        return null;
    }

    if (isAppPage && !isLoggedIn && req.nextUrl.pathname !== '/app/analyzer') {
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            from += req.nextUrl.search;
        }
        return NextResponse.redirect(
            new URL(`/auth?callbackUrl=${encodeURIComponent(from)}`, req.url),
        );
    }

    return null;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
