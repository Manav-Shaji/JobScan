import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '@/core/lib/logger';
import { FALLBACK_CHAIN, AI_CONFIG } from '@/core/config/ai';
import { jobScanSystemInstruction, ResponseSchema } from './prompts';
import { withTimeout, extractErrorMessage, isRecoverableError, safeJsonPayload } from './utils';

export const MAX_AI_TIMEOUT_MS = 30000;

export let genAI: GoogleGenerativeAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;
if (API_KEY) genAI = new GoogleGenerativeAI(API_KEY);

async function requestModelResponse(parts: any[], modelName: string, config: typeof AI_CONFIG) {
  if (!genAI) throw new Error('Generative AI not configured');

  const startTime = Date.now();
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: jobScanSystemInstruction,
    generationConfig: {
      temperature: config.temperature,
      topP: config.topP,
      maxOutputTokens: config.maxOutputTokens,
      responseMimeType: 'application/json'
    }
  });

  const result = await withTimeout(model.generateContent(parts), MAX_AI_TIMEOUT_MS);
  const durationMs = Date.now() - startTime;
  const text = result.response.text();

  return { text, durationMs };
}

export async function executeWithFallback(parts: any[], featureName: string) {
  let lastErrorMsg = 'Unknown error';
  let jsonRetryUsed = false;

  for (let i = 0; i < FALLBACK_CHAIN.length; i++) {
    const modelName = FALLBACK_CHAIN[i];
    const startTime = Date.now();
    try {
      const { text: raw, durationMs } = await requestModelResponse(parts, modelName, AI_CONFIG);
      const payload = safeJsonPayload(raw);
      const parsed = JSON.parse(payload);
      
      const result = ResponseSchema.safeParse(parsed);
      if (!result.success) {
        throw new Error(`Zod schema validation failed: ${result.error.message}`);
      }
      
      logger.logApp('AI Request Success', {
        request_id: crypto.randomUUID(),
        feature: featureName,
        primary_model: FALLBACK_CHAIN[0],
        actual_model: modelName,
        fallback_used: i > 0,
        duration_ms: durationMs
      });

      const analysis = result.data as any;
      if (i > 0) analysis.fallbackUsed = true;
      return { success: true, analysis };
      
    } catch (error: unknown) {
      const message = extractErrorMessage(error);
      const isJsonError = /Unexpected token|Unexpected end of JSON|Zod schema validation failed/.test(message) || error instanceof SyntaxError;
      
      let shouldRetry = false;
      let reason = message;
      
      if (isRecoverableError(error)) {
        shouldRetry = true;
      } else if (isJsonError) {
        if (!jsonRetryUsed) {
          shouldRetry = true;
          jsonRetryUsed = true; 
          reason = 'Invalid JSON or Schema';
        } else {
          shouldRetry = false; 
        }
      } else {
        shouldRetry = false;
      }

      if (!shouldRetry) {
        return {
          success: false,
          error: "AI service temporarily unavailable.",
          model: modelName,
          fallbackUsed: i > 0,
          details: message
        };
      }
      
      logger.warn('AI Model Fallback', {
        feature: featureName,
        failedModel: modelName,
        fallbackModel: FALLBACK_CHAIN[i+1],
        reason: reason
      });
      
      lastErrorMsg = message;
    }
  }
  
  return {
    success: false,
    error: "AI service temporarily unavailable.",
    model: FALLBACK_CHAIN[FALLBACK_CHAIN.length - 1],
    fallbackUsed: true,
    details: `${lastErrorMsg} (All ${FALLBACK_CHAIN.length} fallback models failed)`
  };
}
