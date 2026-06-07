import 'server-only';
import crypto from 'crypto';
import { geminiService } from '@/backend/ai/gemini-provider';
import { findCachedScan, insertScanResult } from './scan-repository';
import { ApiError } from '@/backend/api/errors';
import { MemoryCache } from '@/backend/cache';
import { logger } from '@/backend/logging/logger';

const SCAN_COOLDOWN_MS = 10 * 1000;

// Reusable cache stores to replace raw Maps
const pendingScansCache = new MemoryCache<Promise<any>>(SCAN_COOLDOWN_MS);
const scanCooldownCache = new MemoryCache<number>(SCAN_COOLDOWN_MS);

function normalizeJobText(input: string) {
  return input.trim().replace(/\s+/g, ' ').toLowerCase();
}

/**
 * Core scanning orchestrator. Connects to Gemini AI service, evaluates trust scores,
 * utilizes in-memory deduplication caching, and records completed scans in SQL and local logs.
 */
export async function analyzeJob(
  jobDescription: string, 
  userId: string | null, 
  posterBase64?: string, 
  posterMimeType?: string, 
  posterUrl?: string | null
) {

  const scanType = posterBase64 && jobDescription ? 'Combined' : posterBase64 ? 'Poster' : 'Text';
  
  // Base the hash on both text and poster base64 signature with v2 prefix to invalidate older schema versions
  const normalized = normalizeJobText(jobDescription);
  const hashSource = 'v2:' + normalized + (posterBase64 ? posterBase64.substring(0, 100) : '');
  const hash = crypto.createHash('sha256').update(hashSource).digest('hex');

  // 1. Check Database cache (within 24 hours validity)
  const cached = await findCachedScan(hash);
  if (cached) {
    logger.logApp('Returning cached scan result from database', { hash });
    return cached;
  }

  // 2. Check in-memory pending scans to deduplicate concurrent scans for the same content
  const pending = pendingScansCache.get(hash);
  if (pending) {
    logger.logApp('Joining already pending scan request', { hash });
    return pending;
  }

  // 3. Enforce simple client scanning cooldown
  const lastScanAt = scanCooldownCache.get(hash);
  if (lastScanAt && Date.now() - lastScanAt < SCAN_COOLDOWN_MS) {
    logger.logSecurity('Scan request rejected due to cooldown active', { hash });
    throw new ApiError('Please wait a few seconds before retrying this scan.', 429);
  }

  const scanPromise = (async () => {
    scanCooldownCache.set(hash, Date.now(), SCAN_COOLDOWN_MS);

    try {
      logger.logApp('Forwarding job data to Gemini AI for analysis...', { userId, scanType });
      const analysis = await geminiService.analyzeJobMultimodal(jobDescription, posterBase64, posterMimeType);
      
      logger.logApp('Evaluating Gemini analysis trust score breakdown...');
      const evalRes = geminiService.evaluateTrustScore(analysis);

      let result;
      
      if (userId) {
        // Save scan result to DB for logged in users
        result = await insertScanResult(
          userId,
          jobDescription,
          hash,
          evalRes.score,
          analysis.redFlags || [],
          evalRes.breakdown,
          evalRes.riskLevel,
          {
            fallbackUsed: Boolean(analysis.fallbackUsed),
            source: analysis.source || 'remote',
          },
          {
            posterUrl: posterUrl,
            posterText: analysis.extractedText,
            posterAnalysis: { summary: analysis.summary, positiveSignals: analysis.positiveSignals },
            patternName: analysis.patternName,
            patternConfidence: analysis.patternConfidence,
            scanType: scanType
          }
        );
      } else {
        // For guest scans, build result without saving to database to satisfy user_id NOT NULL constraint
        const breakdown = evalRes.breakdown || {
          linguistic: analysis.posterCredibilityScore || 50,
          employer: 50,
          contact: 50,
          salary: 50,
          temporal: 50
        };
        
        result = {
          id: crypto.randomUUID(),
          userId: null,
          content: jobDescription,
          contentHash: hash,
          scanType: scanType,
          trustScore: evalRes.score,
          riskLevel: evalRes.riskLevel,
          verdict: evalRes.verdict,
          patternName: analysis.patternName || null,
          patternConfidence: analysis.patternConfidence || null,
          posterUrl: posterUrl || null,
          posterText: analysis.extractedText || null,
          redFlags: analysis.redFlags || [],
          positiveSignals: analysis.positiveSignals || [],
          posterAnalysis: {
            summary: analysis.summary || '',
            positiveSignals: analysis.positiveSignals || []
          },
          analysis: {
            summary: analysis.summary || '',
            breakdown,
            fallbackUsed: Boolean(analysis.fallbackUsed),
            source: analysis.source || 'remote'
          },
          breakdown,
          createdAt: new Date().toISOString(),
          communityReports: 0,
          isCached: false,
          fallbackUsed: Boolean(analysis.fallbackUsed),
          analysisSource: analysis.source || 'remote',
        };
      }

      // App log the successful scan completion
      logger.logApp('Scan completed successfully', {
        scanId: result.id,
        userId: userId,
        verdict: result.verdict,
        riskLevel: result.riskLevel,
        trustScore: result.trustScore,
        scanType: scanType,
      });

      return result;
    } catch (error) {
      logger.error('Failed to complete job description analysis flow', error, { userId });
      throw error;
    } finally {
      pendingScansCache.delete(hash);
    }
  })();

  pendingScansCache.set(hash, scanPromise, SCAN_COOLDOWN_MS);
  return scanPromise;
}
