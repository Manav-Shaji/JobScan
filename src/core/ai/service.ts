/**
 * ------------------------------------------------------------
 * File: gemini.ts
 * 
 * Purpose:
 * Orchestration service for multimodal job analysis using Gemini.
 * 
 * Responsibilities:
 * • Handle both text and image payload processing
 * • Execute analysis requests and map responses
 * • Trigger local fallback analysis upon API failures
 * 
 * Used By:
 * • Scan API Route (/api/analyze)
 * ------------------------------------------------------------
 */

import 'server-only';
import { logger } from '@/core/lib/logger';
import { FALLBACK_CHAIN, CHAT_AI_CONFIG } from './config';
import { localFallbackAnalysis } from './fallback';
import { 
  normalizeAnalysis, 
  buildTrustScore, 
  buildVerdict, 
  withTimeout, 
  extractErrorMessage, 
  isRecoverableError 
} from './utils';
import { genAI, executeWithFallback, MAX_AI_TIMEOUT_MS } from './engine';

export const geminiService = {
  async analyzeJobMultimodal(jobText: string, files?: { base64: string, mimeType: string }[]) {
    const parts: any[] = [];
    const scanType = files && files.length > 0 && jobText ? 'combined' : files && files.length > 0 ? 'document' : 'text';
    const userPayload = {
      jobText: jobText || "",
      scanType: scanType
    };
    parts.push({ text: JSON.stringify(userPayload) });

    if (files && files.length > 0) {
      const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
      for (const file of files) {
        if (!allowedMimeTypes.has(file.mimeType)) {
          throw new Error('Unsupported format. Allowed: JPEG, PNG, WEBP, PDF');
        }
        parts.push({
          inlineData: {
            data: file.base64,
            mimeType: file.mimeType
          }
        });
      }
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
    
    const CHAT_FALLBACK_CHAIN = [
      'gemini-3.1-flash-lite', // Primary for chat (fast)
      'gemini-3.5-flash',      // Fallback
      'gemini-2.5-flash'       // Final fallback
    ];

    for (let i = 0; i < CHAT_FALLBACK_CHAIN.length; i++) {
      const modelName = CHAT_FALLBACK_CHAIN[i];
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
