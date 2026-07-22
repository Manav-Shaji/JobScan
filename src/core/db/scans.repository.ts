/**
 * ------------------------------------------------------------
 * File: repository.ts
 * 
 * Purpose:
 * Database access layer for job scan results.
 * 
 * Responsibilities:
 * • Insert new scan results
 * • Find cached scans by content hash
 * • Delete user scan records
 * 
 * Used By:
 * • Scan Service (/api/analyze)
 * • History API Routes
 * ------------------------------------------------------------
 */

import 'server-only';
import crypto from 'crypto';
import { query } from '@/core/db/client';
import { logger } from '@/core/lib/logger';
const FIND_CACHED_SCAN = `
  SELECT s.*, 
         COALESCE(COUNT(DISTINCT r.id), 0) AS community_reports
  FROM job_scans s
  LEFT JOIN job_scans all_scans ON all_scans.content_hash = s.content_hash
  LEFT JOIN scam_reports r ON r.scan_id = all_scans.id
  WHERE s.content_hash = $1 AND s.created_at > NOW() - INTERVAL '24 hours'
  GROUP BY s.id
  ORDER BY s.created_at DESC
  LIMIT 1
`;

const INSERT_SCAN_RESULT = `
  INSERT INTO job_scans (
    id, user_id, content, content_hash, scan_type, trust_score, risk_level,
    pattern_name, pattern_confidence, poster_url, poster_text, red_flags, positive_signals, analysis
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
  RETURNING *
`;

const UPDATE_SCAN_RESULT = `
  UPDATE job_scans SET
    content = $3,
    scan_type = $4,
    trust_score = $5,
    risk_level = $6,
    pattern_name = $7,
    pattern_confidence = $8,
    poster_url = $9,
    poster_text = $10,
    red_flags = $11,
    positive_signals = $12,
    analysis = $13,
    created_at = NOW()
  WHERE user_id = $1 AND content_hash = $2
  RETURNING *
`;

import { deriveVerdict } from '@/features/scans/utils';

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
  if (jobDescription && jobDescription.length > 10000) {
    throw new Error('Repository Guard: Job description exceeds maximum length of 10,000 characters');
  }

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
  } catch (error: any) {
    if (error.code === '23505') {
      logger.warn('Duplicate scan detected, updating existing record instead', { userId, hash });
      const positiveSignals = multimodalData?.posterAnalysis?.positiveSignals || [];
      const analysisObj = {
        summary: multimodalData?.posterAnalysis?.summary || '',
        breakdown,
        fallbackUsed: meta.fallbackUsed ?? false,
        source: meta.source ?? 'remote',
      };
      
      const upd = await query(UPDATE_SCAN_RESULT, [
        userId, // $1
        hash, // $2
        jobDescription, // $3
        multimodalData?.scanType || 'Text', // $4
        score, // $5
        riskLevel, // $6
        multimodalData?.patternName || null, // $7
        multimodalData?.patternConfidence || null, // $8
        multimodalData?.posterUrl || null, // $9
        multimodalData?.posterText || null, // $10
        JSON.stringify(redFlags), // $11
        JSON.stringify(positiveSignals), // $12
        JSON.stringify(analysisObj) // $13
      ]);
      
      if (upd.rows.length > 0) {
        return {
          ...mapRowToScan(upd.rows[0]),
          isCached: true,
          fallbackUsed: meta.fallbackUsed ?? false,
          analysisSource: meta.source ?? 'remote',
        };
      }
    }
    
    logger.error('Database error inserting scan result', error, { userId, hash });
    throw error;
  }
}

export async function deleteScanResult(userId: string, scanId: string) {
  try {
    const DELETE_SCAN = `
      DELETE FROM job_scans
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    const res = await query(DELETE_SCAN, [scanId, userId]);
    return (res.rowCount ?? 0) > 0;
  } catch (error) {
    logger.error('Database error deleting scan result', error, { userId, scanId });
    throw error;
  }
}
