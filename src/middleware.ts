/**
 * ------------------------------------------------------------
 * File: middleware.ts
 * 
 * Purpose:
 * Next.js Edge Middleware for request interception, authentication, and security headers.
 * 
 * Responsibilities:
 * • Protect authenticated dashboard routes
 * • Redirect unauthenticated users safely to login with callback URL
 * • Inject baseline HTTP security headers at the Edge boundary
 * 
 * Used By:
 * • Next.js App Router
 * ------------------------------------------------------------
 */

import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/core/auth/auth.config';

const { auth } = NextAuth(authConfig);
const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-XSS-Protection': '1; mode=block',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname, search } = req.nextUrl;

    const isAuthPage = pathname.startsWith('/auth');
    const isAppPage = pathname.startsWith('/dashboard');
    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
        }
        const response = NextResponse.next();
        Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
        return response;
    }
    if (isAppPage && !isLoggedIn && pathname !== '/dashboard/analyzer') {
        let from = pathname;
        if (search) from += search;
        const safeCallback = from.startsWith('/') && !from.startsWith('//') ? from : '/dashboard';

        return NextResponse.redirect(
            new URL(`/auth?callbackUrl=${encodeURIComponent(safeCallback)}`, req.nextUrl)
        );
    }
    const response = NextResponse.next();
    Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
    return response;
});

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|sw.js|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
    ],
};
