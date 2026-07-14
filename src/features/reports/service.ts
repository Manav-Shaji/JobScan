/**
 * ------------------------------------------------------------
 * File: service.ts
 * 
 * Purpose:
 * Service layer and database access for scam reports.
 * 
 * Responsibilities:
 * • Define report validation schemas
 * • Insert community scam reports into database
 * 
 * Used By:
 * • API Route: /api/reports
 * ------------------------------------------------------------
 */

import 'server-only';
import { z } from 'zod';
import { query } from '@/core/db/client';
import { logger } from '@/core/lib/logger';

// --- Validation ---

export const reportSchema = z.object({
  scanId: z.uuid('Invalid scan ID format'),
  reason: z.string().min(1, 'Reason is required'),
});

// --- Repository ---

const INSERT_REPORT = `
  INSERT INTO scam_reports (scan_id, reported_by, reason) 
  VALUES ($1, $2, $3) 
  RETURNING *
`;

async function insertReport(scanId: string, userId: string, reason: string) {
  try {
    const res = await query(INSERT_REPORT, [scanId, userId, reason]);
    return res.rows[0];
  } catch (error) {
    logger.error('Database error inserting scam report', error, { userId, scanId });
    throw error;
  }
}

// --- Service ---

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
