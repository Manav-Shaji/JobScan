import 'server-only';
import { cache } from 'react';
import { query } from '@/core/db/client';
import { logger } from '@/core/lib/logger';
import {
  updateUserNameAndEmail,
  updateUserPassword,
  fetchUserStats,
  fetchUserHistory,
  updateUserRetentionDays,
  deleteUserAccount,
} from './repository';

import { deriveVerdict } from '@/features/scans/service';

export async function updateProfile(userId: string, name: string, email?: string) {
  try {
    logger.logApp('Updating user profile', { userId, name, email });
    await updateUserNameAndEmail(userId, name, email);

    return { success: true };
  } catch (error) {
    logger.error('Database error in updateProfile', error, { userId });
    throw error;
  }
}

export async function updatePassword(userId: string, passwordHash: string) {
  try {
    logger.logApp('Updating user password', { userId });
    await updateUserPassword(userId, passwordHash);

    return { success: true };
  } catch (error) {
    logger.error('Database error in updatePassword', error, { userId });
    throw error;
  }
}

export const getUserStats = cache(async function(userId: string) {
  try {
    const s = await fetchUserStats(userId);
    
    return {
      totalScans: parseInt(s.total_scans, 10) || 0,
      scamsDetected: parseInt(s.scams_detected, 10) || 0,
      avgTrustScore: s.avg_trust_score ? Math.round(parseFloat(s.avg_trust_score)) : null,
    };
  } catch (error) {
    logger.error('Database error fetching user stats', error, { userId });
    throw error;
  }
});

export const getUserHistory = cache(async function(userId: string, limit: number = 10, offset: number = 0) {
  try {
    const rows = await fetchUserHistory(userId, limit, offset);
    
    return rows.map((i: any) => ({
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
});

export async function updateRetentionDays(userId: string, days: number) {
  try {
    logger.logApp('Updating user retention days setting', { userId, days });
    await updateUserRetentionDays(userId, days);
    
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
    await deleteUserAccount(userId);

    return { success: true };
  } catch (error) {
    logger.error('Database error deleting user account', error, { userId });
    throw error;
  }
}
