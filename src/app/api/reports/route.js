import { createRouteHandler } from '@/backend/api/route-utils';
import { reportSchema } from '@/backend/modules/reports/report-schema';
import { createReport } from '@/backend/modules/reports/report-service';

export const POST = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'reports', limit: 5, windowMs: 60 * 1000 },
  schema: reportSchema,
  async handler({ body, user }) {
    const result = await createReport(user.id, body.scanId, body.reason);
    return { success: true, report: result };
  }
});
