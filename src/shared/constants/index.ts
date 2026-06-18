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

export const CACHE_KEYS = {
  ANALYZE_RATE_LIMIT: 'analyze',
  USER_RATE_LIMIT: 'user',
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  MAX_BASE64_LENGTH: 7000000,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
} as const;
