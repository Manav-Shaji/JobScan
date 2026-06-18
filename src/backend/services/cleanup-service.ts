import 'server-only';
import { query } from '@/database/connection/db';
import { logger } from '@/backend/logging/logger';

/**
 * Service to delete expired scans securely.
 * This function respects the user's `retention_days` setting.
 * 
 * IMPORTANT: This function is currently dormant and should be invoked
 * via an external scheduler (e.g., cron job, Cloud Scheduler) hitting an
 * internal/admin secured endpoint, to avoid adding application-level infrastructure.
 */
export async function cleanupExpiredScans() {
  try {
    logger.logApp('Starting execution of cleanupExpiredScans...');

    const result = await query(`
      DELETE FROM job_scans s
      USING users u
      WHERE s.user_id = u.id
      AND s.created_at < NOW() - (u.retention_days || ' days')::interval;
    `);

    logger.logApp('Completed execution of cleanupExpiredScans.', {
      deletedRows: result.rowCount
    });

    return {
      success: true,
      deletedCount: result.rowCount
    };
  } catch (error) {
    logger.error('Failed to cleanup expired scans', error);
    throw error;
  }
}
