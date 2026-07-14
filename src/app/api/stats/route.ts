/**
 * ------------------------------------------------------------
 * API Route: /api/stats
 * 
 * Purpose:
 * Retrieves aggregated scanning statistics for the authenticated user.
 * 
 * Responsibilities:
 * • Fetch usage and scan history counts
 * • Return formatted user statistics
 * 
 * Used By:
 * • Dashboard Overview
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { getUserStats } from '@/features/users/service';

export const GET = createRouteHandler({
  auth: 'user',
  async handler({ user }) {
    return await getUserStats(user.id);
  }
});
