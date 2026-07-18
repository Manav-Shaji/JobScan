/**
 * ------------------------------------------------------------
 * API Route: /api/password
 * 
 * Purpose:
 * Handles secure user password updates and validation.
 * 
 * Responsibilities:
 * • Validate old password hash
 * • Hash new password with bcrypt
 * • Rate limit change requests
 * 
 * Used By:
 * • Settings Profile View
 * ------------------------------------------------------------
 */

import bcrypt from 'bcryptjs';
import { createRouteHandler } from '@/core/api/route-utils';
import { updatePasswordSchema } from '@/features/users/validation';
import { updatePassword } from '@/features/users/service';
import { findPasswordHashById } from '@/core/db/users.repository';
import { ApiError } from '@/core/api/response';

export const POST = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'password-change', limit: 3, windowMs: 60 * 1000 },
  schema: updatePasswordSchema,
  async handler({ body, user }) {
    const currentHash = await findPasswordHashById(user.id);
    if (!currentHash) {
      throw new ApiError('User not found', 404);
    }
    const isValid = await bcrypt.compare(body.oldPassword, currentHash);
    if (!isValid) {
      throw new ApiError('Incorrect old password', 401);
    }
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(body.password, salt);
    return await updatePassword(user.id, hash);
  }
});
