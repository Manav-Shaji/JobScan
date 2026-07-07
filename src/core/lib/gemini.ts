import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '@/core/lib/logger';
import { FALLBACK_CHAIN, AI_CONFIG, CHAT_AI_CONFIG } from '@/core/config/ai';
import { jobScanSystemInstruction, ResponseSchema } from './ai/prompts';
import { localFallbackAnalysis } from './ai/fallback';

const MAX_AI_TIMEOUT_MS = 30000; 

let genAI: GoogleGenerativeAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;
if (API_KEY) genAI = new GoogleGenerativeAI(API_KEY);

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('AI request timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

function extractErrorMessage(error: unknown) {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return String(error ?? 'Unknown AI error');
}

function isRecoverableError(error: unknown) {
  const message = extractErrorMessage(error).toLowerCase();
  return /429|500|502|503|504|timeout|too many requests|rate limit|quota|reset|connection|service unavailable|gateway|temporary/.test(message);
}

function safeJsonPayload(raw: string) {
  const cleaned = raw
    .replace(/```(?:json)?/gi, '')
    .replace(/\r/g, '')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  const payload = firstBrace >= 0 && lastBrace >= 0 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;
  return payload.replace(/,\s*([}\]])/g, '$1');
}

function normalizeAnalysis(analysis: any) {
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

function buildTrustScore(normalized: any) {
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

function buildVerdict(score: number, riskLevel: string) {
  if (riskLevel === 'CRITICAL' || score < 45) return 'scam';
  if (score < 75) return 'caution';
  return 'safe';
}

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
  const usage = result.response.usageMetadata;

  return { text, durationMs };
}

async function executeWithFallback(parts: any[], featureName: string) {
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

export const geminiService = {
  async analyzeJobMultimodal(jobText: string, posterBase64?: string, posterMimeType?: string) {
    const parts: any[] = [];
    const scanType = posterBase64 && jobText ? 'combined' : posterBase64 ? 'image' : 'text';
    const userPayload = {
      jobText: jobText || "",
      scanType: scanType
    };
    parts.push({ text: JSON.stringify(userPayload) });

    if (posterBase64 && posterMimeType) {
      const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
      if (!allowedMimeTypes.has(posterMimeType)) {
        throw new Error('Unsupported image format. Allowed: JPEG, PNG, WEBP');
      }
      parts.push({
        inlineData: {
          data: posterBase64,
          mimeType: posterMimeType
        }
      });
    }

    if (!genAI) {
      return normalizeAnalysis(localFallbackAnalysis(jobText, 'AI service configuration missing (Invalid API Key)'));
    }

    const response = await executeWithFallback(parts, 'Job Analysis');
    
    if (!response.success) {
       return normalizeAnalysis(localFallbackAnalysis(jobText, response.details || response.error));
    }
    
    return normalizeAnalysis(response.analysis);
  },

  async generateChatResponse(history: any[], message: string, jobContext: any = null) {
    if (!genAI) return 'Error: Gemini API Key is missing or not loaded.';

    const session = history.map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] }));
    const chatPrompt = jobContext ? `${jobContext}\nUser: ${message}` : message;

    let lastErrorMsg = 'Unknown Error';
    
    for (let i = 0; i < FALLBACK_CHAIN.length; i++) {
      const modelName = FALLBACK_CHAIN[i];
      const startTime = Date.now();
      
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: CHAT_AI_CONFIG
        });
        const chat = model.startChat({ history: session });
        const response = await withTimeout(chat.sendMessage(chatPrompt), MAX_AI_TIMEOUT_MS);
        
        logger.logApp('AI Request Success', {
          request_id: crypto.randomUUID(),
          feature: 'AI Chat',
          primary_model: FALLBACK_CHAIN[0],
          actual_model: modelName,
          fallback_used: i > 0,
          duration_ms: Date.now() - startTime
        });
        
        return response.response.text();
      } catch (error: unknown) {
        const message = extractErrorMessage(error);
        const shouldRetry = isRecoverableError(error);
        
        if (!shouldRetry || i === FALLBACK_CHAIN.length - 1) {
          logger.error('AI Request Failed Terminal', {
            feature: 'AI Chat',
            model: modelName,
            error: message,
            duration_ms: Date.now() - startTime
          });
          return 'AI Chat service is temporarily unavailable. Please try again later.';
        }
        
        logger.warn('AI Model Fallback', {
          feature: 'AI Chat',
          failedModel: modelName,
          fallbackModel: FALLBACK_CHAIN[i+1],
          reason: message
        });
        lastErrorMsg = message;
      }
    }
    
    return 'AI Chat service is temporarily unavailable. Please try again later.';
  },

  evaluateTrustScore(aiScores: any) {
    const normalized = normalizeAnalysis(aiScores);
    const score = buildTrustScore(normalized);
    const verdict = buildVerdict(score, normalized.riskLevel);
    
    const breakdown = {
      linguistic: normalized.posterCredibilityScore || 50,
      employer: normalized.employerTrustScore || 50,
      contact: normalized.contactTrustScore || 50,
      salary: 100 - (normalized.salaryRiskScore || 50),
      temporal: 100 - (normalized.urgencyRiskScore || 50)
    };
    
    return { score, verdict, breakdown, riskLevel: normalized.riskLevel };
  }
};
