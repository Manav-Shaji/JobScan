export const SCAN_COOLDOWN_MS = 10 * 1000;

export const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

export const VERDICTS = {
  SAFE: 'safe',
  CAUTION: 'caution',
  SCAM: 'scam',
} as const;
