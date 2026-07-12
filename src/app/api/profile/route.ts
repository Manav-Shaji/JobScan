import { createRouteHandler } from '@/core/api/route-utils';
import { updateProfileSchema } from '@/features/users/validation';
import { updateProfile, deleteAccount, updateRetentionDays } from '@/features/users/service';

export const POST = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'profile-update', limit: 10, windowMs: 60 * 1000 },
  schema: updateProfileSchema,
  async handler({ body, user }) {
    return await updateProfile(user.id, body.name, body.email);
  }
});

export const DELETE = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'profile-delete', limit: 2, windowMs: 60 * 1000 },
  async handler({ user }) {
    return await deleteAccount(user.id);
  }
});

export const PUT = createRouteHandler({
  auth: 'user',
  async handler({ req, user }) {
    const body = await req.json().catch(() => ({}));
    const { retentionDays } = body;
    if (typeof retentionDays !== 'number') {
      throw new Error('Invalid retention days');
    }
    return await updateRetentionDays(user.id, retentionDays);
  }
});
