/**
 * ------------------------------------------------------------
 * File: utils.ts
 * 
 * Purpose:
 * Utility functions for scan data processing.
 * 
 * Responsibilities:
 * • Derive normalized verdict based on trust score and risk level
 * 
 * Used By:
 * • Scan Repository
 * ------------------------------------------------------------
 */

export function deriveVerdict(score: number, riskLevel: string) {
  const cleanRisk = (riskLevel || '').toUpperCase();
  if (cleanRisk === 'CRITICAL' || score < 45) return 'scam';
  if (score < 75) return 'caution';
  return 'safe';
}
