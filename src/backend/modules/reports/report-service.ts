import 'server-only';
import { insertReport } from './report-repository';
import { logger } from '@/backend/logging/logger';

/**
 * Service to manage scam report submissions.
 * Inserts reports and writes logs locally.
 */
export async function createReport(userId: string, scanId: string, reason: string) {
  logger.logApp('Executing create scam report request...', { userId, scanId });
  
  const report = await insertReport(scanId, userId, reason);

  logger.logApp('Community scam report submitted successfully', {
    reportId: report.id,
    scanId,
    userId,
    reason,
  });

  return report;
}
