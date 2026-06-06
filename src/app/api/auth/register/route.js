import { createRouteHandler } from '@/backend/api/route-utils';
import { registerSchema } from '@/backend/modules/auth/auth-schema';
import { registerUser } from '@/backend/modules/auth/auth-service';
import { ApiError } from '@/backend/api/errors';

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
