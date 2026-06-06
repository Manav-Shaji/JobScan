import { createRouteHandler } from '@/backend/api/route-utils';
import { getUserHistory } from '@/backend/modules/auth/user-service';

export const GET = createRouteHandler({
  auth: 'user',
  async handler({ req, user }) {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const page = parseInt(url.searchParams.get('page')) || 1;
    const offset = Math.max(0, (page - 1) * limit);
    return await getUserHistory(user.id, limit, offset);
  }
});
