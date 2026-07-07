import { createRouteHandler } from '@/core/api/route-utils';
import { getUserStats } from '@/features/users/service';

export const GET = createRouteHandler({
  auth: 'user',
  async handler({ user }) {
    return await getUserStats(user.id);
  }
});
