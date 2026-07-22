/**
 * ------------------------------------------------------------
 * File: ai.ts
 * 
 * Purpose:
 * Configuration and validation for AI models used in the application.
 * 
 * Responsibilities:
 * • Define supported AI models and fallback chains
 * • Validate environment variables against allowed models
 * • Provide standard configurations for text and chat generation
 * 
 * Used By:
 * • AI Core Engine
 * ------------------------------------------------------------
 */

import { logger } from '@/core/lib/logger';
const SUPPORTED_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.1-flash-lite',
  'gemini-2.5-flash'
];

const AI_MODELS = {
  PRIMARY: 'gemini-3.6-flash',
  FAST: 'gemini-3.1-flash-lite',
  FALLBACK: 'gemini-2.5-flash',
};

// Validate environment models against supported whitelist
function getValidatedModel(envVar: string | undefined, defaultModel: string, role: string): string {
  if (!envVar) return defaultModel;

  if (SUPPORTED_MODELS.includes(envVar)) {
    return envVar;
  }

  logger.warn(`Unsupported model configured for ${role}`, {
    configured: envVar,
    fallbackTo: defaultModel,
    supported: SUPPORTED_MODELS.join(', ')
  });

  return defaultModel;
}

const CONFIG_MODELS = {
  PRIMARY: getValidatedModel(process.env.GEMINI_PRIMARY_MODEL, AI_MODELS.PRIMARY, 'PRIMARY'),
  SECONDARY: getValidatedModel(process.env.GEMINI_SECONDARY_MODEL, AI_MODELS.FAST, 'SECONDARY'),
  FALLBACK: getValidatedModel(process.env.GEMINI_FALLBACK_MODEL, AI_MODELS.FALLBACK, 'FALLBACK'),
};

export const FALLBACK_CHAIN = [
  CONFIG_MODELS.PRIMARY,
  CONFIG_MODELS.SECONDARY,
  CONFIG_MODELS.FALLBACK
];

export const AI_CONFIG = {
  temperature: 0.18,
  topP: 0.7,
  topK: 40,
  maxOutputTokens: 2048,
};

export const CHAT_AI_CONFIG = {
  temperature: 0.3,
  topP: 0.7,
  maxOutputTokens: 300
};
