/**
 * ------------------------------------------------------------
 * File: utils.ts
 * 
 * Purpose:
 * Utility functions for AI response handling and error processing.
 * 
 * Responsibilities:
 * • Provide promise race timeouts for AI requests
 * • Extract and format error messages
 * • Safely parse JSON payload responses
 * 
 * Used By:
 * • AI Core Engine
 * ------------------------------------------------------------
 */

import { ResponseSchema } from './prompts';
import { logger } from '@/core/lib/logger';

export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('AI request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

export function extractErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return String(error ?? 'Unknown AI error');
}

export function isRecoverableError(error: unknown) {
  const message = extractErrorMessage(error).toLowerCase();
  return /429|500|502|503|504|timeout|too many requests|rate limit|quota|reset|connection|service unavailable|gateway|temporary/.test(message);
}

export function safeJsonPayload(raw: string) {
  const cleaned = raw
    .replace(/```(?:json)?/gi, '')
    .replace(/\r/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  const payload = firstBrace >= 0 && lastBrace >= 0 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;
  return payload.replace(/,\s*([}\]])/g, '$1');
}

export function normalizeAnalysis(analysis: any) {
  const result = ResponseSchema.safeParse(analysis);
  let normalized;
  
  if (!result.success) {
    logger.warn('Gemini response failed Zod validation, applying fallback normalizer', { error: result.error.message });
    normalized = ResponseSchema.parse({}); // provides safe defaults
  } else {
    normalized = result.data;
  }

  const final = { ...normalized } as any;
  if (analysis?.fallbackUsed) final.fallbackUsed = true;
  if (analysis?.source) final.source = analysis.source;
  if (analysis?.fallbackReason) final.fallbackReason = analysis.fallbackReason;

  return final;
}

export function buildTrustScore(normalized: any) {
  if (Number.isFinite(normalized?.overallTrustScore) && normalized.overallTrustScore > 0) {
    return Math.max(0, Math.min(100, normalized.overallTrustScore));
  }
  
  const scores = [
    normalized.contactTrustScore,
    normalized.employerTrustScore,
    100 - normalized.salaryRiskScore,
    100 - normalized.urgencyRiskScore,
    normalized.posterCredibilityScore
  ].filter(s => s > 0);
  
  if (scores.length === 0) return 50;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function buildVerdict(score: number, riskLevel: string) {
  if (riskLevel === 'CRITICAL' || score < 45) return 'scam';
  if (score < 75) return 'caution';
  return 'safe';
}
