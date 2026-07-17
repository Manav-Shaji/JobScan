/**
 * ------------------------------------------------------------
 * File: constants.ts
 * 
 * Purpose:
 * Application-wide constants.
 * 
 * Responsibilities:
 * • Defines standard limits, keys, and values
 * 
 * Used By:
 * • Frontend and Backend modules
 * ------------------------------------------------------------
 */

const SCAN_COOLDOWN_MS = 10 * 1000;

const RISK_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const;

const VERDICTS = {
  SAFE: 'safe',
  CAUTION: 'caution',
  SCAM: 'scam',
} as const;

const CACHE_KEYS = {
  ANALYZE_RATE_LIMIT: 'analyze',
  USER_RATE_LIMIT: 'user',
} as const;

/**
 * ------------------------------------------------------------
 * File: constants.ts
 * 
 * Purpose:
 * Global application constants and configuration values.
 * 
 * Responsibilities:
 * • Centralize static string literals and configuration numbers
 * 
 * Used By:
 * • Entire Application
 * ------------------------------------------------------------
 */

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_BASE64_LENGTH: 7000000,
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
} as const;
