/**
 * ------------------------------------------------------------
 * API Route: route.ts
 * 
 * Purpose:
 * Exposes authentication endpoints for the application by delegating 
 * request handling to the core authentication provider.
 * 
 * Responsibilities:
 * • Expose GET and POST methods for auth operations.
 * • Provide a standard interface for authentication requests.
 * 
 * Used By:
 * • Next.js App Router
 * ------------------------------------------------------------
 */

import { handlers } from '@/core/auth';

export const { GET, POST } = handlers;
