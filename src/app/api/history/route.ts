/**
 * ------------------------------------------------------------
 * API Route: route.ts
 * 
 * Purpose:
 * Retrieves the historical activity log for the authenticated user with support for pagination.
 * 
 * Responsibilities:
 * • Parses request parameters for limit and pagination offsets.
 * • Fetches user history records using the dedicated service layer.
 * 
 * Used By:
 * • User Dashboard Module
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { getUserHistory } from '@/features/users/service';

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
