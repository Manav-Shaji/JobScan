import 'server-only';
import crypto from 'crypto';
import { query } from '@/database/connection/db';
import { logger } from '@/backend/logging/logger';
import { FIND_CACHED_SCAN, INSERT_SCAN_RESULT } from './scan-queries';

function deriveVerdict(score: number, riskLevel: string) {
  const cleanRisk = (riskLevel || '').toUpperCase();
  if (cleanRisk === 'CRITICAL' || score < 45) return 'scam';
  if (score < 75) return 'caution';
  return 'safe';
}

function mapRowToScan(row: any) {
  if (!row) return null;
  
  // Reconstruct breakdown from analysis if present
  const analysisObj = row.analysis || {};
  const breakdown = analysisObj.breakdown || {
    linguistic: row.poster_credibility_score || 50,
    employer: 50,
    contact: 50,
    salary: 50,
    temporal: 50
  };

  return {
    id: row.id,
    userId: row.user_id,
    content: row.content,
    contentHash: row.content_hash,
    scanType: row.scan_type,
    trustScore: row.trust_score,
    riskLevel: row.risk_level,
    verdict: deriveVerdict(row.trust_score, row.risk_level),
    patternName: row.pattern_name,
    patternConfidence: row.pattern_confidence,
    posterUrl: row.poster_url,
    posterText: row.poster_text,
    redFlags: row.red_flags || [],
    positiveSignals: row.positive_signals || [],
    posterAnalysis: {
      summary: analysisObj.summary || '',
      positiveSignals: row.positive_signals || []
    },
    analysis: analysisObj,
    breakdown,
    createdAt: row.created_at,
    communityReports: parseInt(row.community_reports, 10) || 0,
  };
}

export async function findCachedScan(hash: string) {
  try {
    const cached = await query(FIND_CACHED_SCAN, [hash]);

    if (cached.rows.length === 0) return null;
    const row = cached.rows[0];
    
    return {
      ...mapRowToScan(row),
      isCached: true,
    };
  } catch (error) {
    logger.error(`Database error finding cached scan for hash: ${hash}`, error);
    throw error;
  }
}

export async function insertScanResult(
  userId: string,
  jobDescription: string,
  hash: string,
  score: number,
  redFlags: string[],
  breakdown: any,
  riskLevel: string,
  meta: { fallbackUsed?: boolean; source?: string } = {},
  multimodalData?: {
    posterUrl?: string | null;
    posterText?: string | null;
    posterAnalysis?: any;
    patternName?: string | null;
    patternConfidence?: number | null;
    scanType?: string;
  }
) {
  try {
    const id = crypto.randomUUID();
    const positiveSignals = multimodalData?.posterAnalysis?.positiveSignals || [];
    
    const analysisObj = {
      summary: multimodalData?.posterAnalysis?.summary || '',
      breakdown,
      fallbackUsed: meta.fallbackUsed ?? false,
      source: meta.source ?? 'remote',
    };

    const ins = await query(INSERT_SCAN_RESULT, [
      id,
      userId,
      jobDescription,
      hash,
      multimodalData?.scanType || 'Text',
      score,
      riskLevel,
      multimodalData?.patternName || null,
      multimodalData?.patternConfidence || null,
      multimodalData?.posterUrl || null,
      multimodalData?.posterText || null,
      JSON.stringify(redFlags),
      JSON.stringify(positiveSignals),
      JSON.stringify(analysisObj)
    ]);

    const row = ins.rows[0];
    return {
      ...mapRowToScan(row),
      isCached: false,
      fallbackUsed: meta.fallbackUsed ?? false,
      analysisSource: meta.source ?? 'remote',
    };
  } catch (error) {
    logger.error('Database error inserting scan result', error, { userId, hash });
    throw error;
  }
}
