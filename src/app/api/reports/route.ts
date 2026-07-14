/**
 * ------------------------------------------------------------
 * API Route: /api/reports
 * 
 * Purpose:
 * Submits user reports for inaccurate or fraudulent job scans.
 * 
 * Responsibilities:
 * • Validates report schema payload
 * • Rate limits submissions
 * • Inserts report record into database
 * 
 * Used By:
 * • Dashboard / Scan Results UI
 * ------------------------------------------------------------
 */

import { createRouteHandler } from '@/core/api/route-utils';
import { reportSchema, createReport } from '@/features/reports/service';

export const POST = createRouteHandler({
  auth: 'user',
  rateLimit: { key: 'reports', limit: 5, windowMs: 60 * 1000 },
  schema: reportSchema,
  async handler({ body, user }) {
    const result = await createReport(user.id, body.scanId, body.reason);
    return { success: true, report: result };
  }
});
