/**
 * ------------------------------------------------------------
 * API Route: Registration Handler
 * 
 * Purpose:
 * Handles new user registration requests by validating input and processing account creation.
 * 
 * Responsibilities:
 * • Validates incoming request data against the registration schema.
 * • Executes user registration logic and enforces rate limiting.
 * 
 * Used By:
 * • Auth API Module
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { registerSchema } from '@/features/users/validation';
import { registerUser } from '@/features/users/auth.service';
import { ApiError } from '@/core/api/response';

export const POST = createRouteHandler({
  auth: 'none',
  rateLimit: { key: 'register', limit: 5, windowMs: 60 * 1000 },
  schema: registerSchema,
  async handler({ body }) {
    const res = await registerUser(body);
    if (res.error) {
      throw new ApiError(res.error, res.status);
    }
    return res;
  }
});
