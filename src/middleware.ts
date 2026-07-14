/**
 * ------------------------------------------------------------
 * File: middleware.ts
 * 
 * Purpose:
 * Next.js Edge Middleware for request interception and routing.
 * 
 * Responsibilities:
 * • Protect authenticated routes
 * • Redirect unauthenticated users to the login page
 * 
 * Used By:
 * • Next.js App Router
 * ------------------------------------------------------------
 */

import NextAuth from 'next-auth';
import { authConfig } from '@/core/auth/auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAppPage = req.nextUrl.pathname.startsWith('/dashboard');

    if (isAuthPage) {
        if (isLoggedIn) {
            return Response.redirect(new URL('/dashboard', req.nextUrl));
        }
        return null;
    }

    if (isAppPage && !isLoggedIn && req.nextUrl.pathname !== '/dashboard/analyzer') {
        let from = req.nextUrl.pathname;
        if (req.nextUrl.search) {
            from += req.nextUrl.search;
        }
        return Response.redirect(
            new URL(`/auth?callbackUrl=${encodeURIComponent(from)}`, req.nextUrl)
        );
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
