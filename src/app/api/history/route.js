import { createRouteHandler } from '@/backend/api/route-utils';
import { getUserHistory } from '@/backend/modules/auth/user-service';

export const GET = createRouteHandler({
  auth: 'user',
  async handler({ user }) {
    return await getUserHistory(user.id);
  }
});
