import { createRouteHandler } from '@/backend/api/route-utils';
import { getUserStats } from '@/backend/services/user-service';

export const GET = createRouteHandler({
  auth: 'user',
  async handler({ user }) {
    return await getUserStats(user.id);
  }
});
