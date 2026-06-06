import 'server-only';
import { query } from '@/backend/db/db';
import { logger } from '@/backend/logging/logger';
import {
  UPDATE_USER_NAME_EMAIL,
  UPDATE_USER_NAME,
  UPDATE_USER_PASSWORD,
  GET_USER_STATS,
  GET_USER_HISTORY,
  UPDATE_RETENTION_DAYS,
  DELETE_USER,
} from './user-queries';

function deriveVerdict(score: number, riskLevel: string) {
  const cleanRisk = (riskLevel || '').toUpperCase();
  if (cleanRisk === 'CRITICAL' || score < 45) return 'scam';
  if (score < 75) return 'caution';
  return 'safe';
}

export async function updateProfile(userId: string, name: string, email?: string) {
  try {
    logger.logApp('Updating user profile', { userId, name, email });
    if (email) {
      await query(UPDATE_USER_NAME_EMAIL, [name, email, userId]);
    } else {
      await query(UPDATE_USER_NAME, [name, userId]);
    }

    return { success: true };
  } catch (error) {
    logger.error('Database error in updateProfile', error, { userId });
    throw error;
  }
}

export async function updatePassword(userId: string, passwordHash: string) {
  try {
    logger.logApp('Updating user password', { userId });
    await query(UPDATE_USER_PASSWORD, [passwordHash, userId]);

    return { success: true };
  } catch (error) {
    logger.error('Database error in updatePassword', error, { userId });
    throw error;
  }
}

export async function getUserStats(userId: string) {
  try {
    const res = await query(GET_USER_STATS, [userId]);
    const s = res.rows[0];
    
    return {
      totalScans: parseInt(s.total_scans, 10) || 0,
      scamsDetected: parseInt(s.scams_detected, 10) || 0,
      avgTrustScore: Math.round(parseFloat(s.avg_trust_score)) || 76,
    };
  } catch (error) {
    logger.error('Database error fetching user stats', error, { userId });
    throw error;
  }
}

export async function getUserHistory(userId: string) {
  try {
    const res = await query(GET_USER_HISTORY, [userId]);
    
    return res.rows.map(i => ({
      id: i.id,
      content: i.content,
      score: i.trust_score,
      type: deriveVerdict(i.trust_score, i.risk_level),
      createdAt: i.created_at,
    }));
  } catch (error) {
    logger.error('Database error fetching user history', error, { userId });
    throw error;
  }
}

export async function updateRetentionDays(userId: string, days: number) {
  try {
    logger.logApp('Updating user retention days setting', { userId, days });
    await query(UPDATE_RETENTION_DAYS, [days, userId]);
    
    return { success: true };
  } catch (error) {
    logger.error('Database error updating retention days', error, { userId });
    throw error;
  }
}

export async function deleteAccount(userId: string) {
  try {
    logger.logApp('Executing complete user account deletion flow', { userId });
    
    // ON DELETE CASCADE automatically cleans up scans, reports, and chat messages
    await query(DELETE_USER, [userId]);

    return { success: true };
  } catch (error) {
    logger.error('Database error deleting user account', error, { userId });
    throw error;
  }
}
