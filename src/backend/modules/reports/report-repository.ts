import 'server-only';
import { query } from '@/backend/db/db';
import { logger } from '@/backend/logging/logger';
import { INSERT_REPORT } from './report-queries';

export async function insertReport(scanId: string, userId: string, reason: string) {
  try {
    const res = await query(INSERT_REPORT, [scanId, userId, reason]);
    return res.rows[0];
  } catch (error) {
    logger.error('Database error inserting scam report', error, { userId, scanId });
    throw error;
  }
}
