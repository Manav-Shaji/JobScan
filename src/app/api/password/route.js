import bcrypt from 'bcryptjs';
import { createRouteHandler } from '@/backend/api/route-utils';
import { updatePasswordSchema } from '@/backend/modules/auth/auth-schema';
import { updatePassword } from '@/backend/modules/auth/user-service';

export const POST = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'password-change', limit: 3, windowMs: 60 * 1000 },
  schema: updatePasswordSchema,
  async handler({ body, user }) {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(body.password, salt);
    return await updatePassword(user.id, hash);
  }
});
