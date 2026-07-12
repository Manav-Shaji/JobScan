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
