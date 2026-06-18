import 'server-only';
import { query } from '@/database/connection/db';
import { logger } from '@/backend/logging/logger';
export const INSERT_REPORT = `
  INSERT INTO scam_reports (scan_id, reported_by, reason) 
  VALUES ($1, $2, $3) 
  RETURNING *
`;

export async function insertReport(scanId: string, userId: string, reason: string) {
  try {
    const res = await query(INSERT_REPORT, [scanId, userId, reason]);
    return res.rows[0];
  } catch (error) {
    logger.error('Database error inserting scam report', error, { userId, scanId });
    throw error;
  }
}
