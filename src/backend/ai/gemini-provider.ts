import 'server-only';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { logger } from '@/backend/logging/logger';
import { jobScanSystemInstruction } from './prompts';

const PRIMARY_MODEL = 'gemini-3.1-flash-lite'; // or 'gemini-2.5-flash' for vision? wait, both support vision.
const FALLBACK_MODEL = 'gemini-2.5-flash';
const MAX_AI_TIMEOUT_MS = 15000; // Increased for image processing

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

function isQuotaError(error: unknown) {
  const message = extractErrorMessage(error).toLowerCase();
  return /429|quota|too many requests|generaterequestsperminute|rate limit|quota exceeded|over limit/.test(message);
}

function safeJsonPayload(raw: string) {
  const cleaned = raw
    .replace(/```(?:json)?/gi, '')
    .replace(/\r/g, '')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .trim();

  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  const payload = firstBrace >= 0 && lastBrace >= 0 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;
  return payload.replace(/,\s*([}\]])/g, '$1');
}

const ClampedScore = z.any().transform(v => {
    const num = Number(v);
    if (isNaN(num)) return 50;
    return Math.max(0, Math.min(100, Math.round(num)));
});

const RiskEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).catch('MEDIUM');

const ResponseSchema = z.object({
  overallTrustScore: ClampedScore,
  riskLevel: RiskEnum,
  posterCredibilityScore: ClampedScore,
  contactTrustScore: ClampedScore,
  employerTrustScore: ClampedScore,
  salaryRiskScore: ClampedScore,
  urgencyRiskScore: ClampedScore,
  patternName: z.string().catch('Unknown Pattern'),
  patternConfidence: ClampedScore,
  redFlags: z.array(z.string()).catch([]),
  positiveSignals: z.array(z.string()).catch([]),
  summary: z.string().catch(''),
  extractedText: z.string().catch('')
});

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
  
  // Calculate average of available valid scores if overall is missing
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

function localFallbackAnalysis(jobText: string, reason: string) {
  const text = jobText.toLowerCase();
  const redFlags: string[] = [];

  const suspects = [
    { regex: /\b(telegram|whatsapp|signal)\b/i, flag: 'Contacts applicants via insecure messaging apps' },
    { regex: /\b(crypto|bitcoin|ethereum|tether|payment required|transfer money|wire transfer|wallet address)\b/i, flag: 'Mentions cryptocurrency or payment transfers' },
    { regex: /\b(urgent|immediately|asap|right away|hurry up|urgent hiring)\b/i, flag: 'Uses urgent hiring pressure' },
    { regex: /\b(no experience|required no experience|entry level with high pay|easy money)\b/i, flag: 'Promises high pay with little or no experience' },
    { regex: /\b(investment|invest|investment opportunity|profit share)\b/i, flag: 'Includes suspicious investment language' },
    { regex: /\b(work from home|remote work|home-based|work at home)\b/i, flag: 'Offers remote work with unclear employer verification' }
  ];

  suspects.forEach((item) => {
    if (item.regex.test(text)) {
      redFlags.push(item.flag);
    }
  });

  if (text.length > 0 && text.length < 120) {
    redFlags.push('Job description is unusually short and lacks detail');
  }

  const signalCount = Math.max(0, 4 - redFlags.length);
  const positiveSignals = [
    'Job description provided',
    'Includes role and application details',
    'Contains some legitimate formatting'
  ].slice(0, signalCount || 1);

  const score = Math.max(15, 78 - redFlags.length * 16);
  const overallRisk = Math.min(98, Math.max(12, 100 - score));
  const riskLevel = overallRisk >= 70 ? 'HIGH' : overallRisk >= 45 ? 'MEDIUM' : 'LOW';

  return {
    overallTrustScore: score,
    riskLevel,
    posterCredibilityScore: 50,
    contactTrustScore: Math.max(35, 75 - redFlags.length * 10),
    employerTrustScore: Math.max(35, 80 - redFlags.length * 12),
    salaryRiskScore: Math.min(95, 20 + redFlags.length * 10),
    urgencyRiskScore: Math.min(95, 20 + redFlags.length * 8),
    patternName: redFlags.length > 2 ? 'Unknown Pattern' : 'None',
    patternConfidence: redFlags.length > 2 ? 60 : 0,
    redFlags: redFlags.slice(0, 8),
    positiveSignals,
    summary: `Local fallback analysis used because Gemini was unavailable (${reason}). Review suspicious terms before applying.`,
    extractedText: "",
    fallbackUsed: true,
    source: 'local',
    fallbackReason: reason
  };
}

async function requestModelResponse(parts: any[], modelName: string) {
  if (!genAI) throw new Error('Generative AI not configured');

  const startTime = Date.now();
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: jobScanSystemInstruction,
    generationConfig: {
      temperature: 0.18,
      topP: 0.7,
      maxOutputTokens: 800,
      responseMimeType: 'application/json'
    }
  });

  const result = await withTimeout(model.generateContent(parts), MAX_AI_TIMEOUT_MS);
  const durationMs = Date.now() - startTime;
  const text = result.response.text();
  const usage = result.response.usageMetadata;

  if (usage) {
    logger.logApp('Gemini token usage', {
      model: modelName,
      promptTokens: usage.promptTokenCount,
      candidateTokens: usage.candidatesTokenCount,
      totalTokens: usage.totalTokenCount,
      durationMs
    });
  }

  return text;
}

async function attemptModel(parts: any[], modelName: string) {
  try {
    const raw = await requestModelResponse(parts, modelName);
    const payload = safeJsonPayload(raw);
    const parsed = JSON.parse(payload);
    return { analysis: normalizeAnalysis(parsed), quotaError: false };
  } catch (error: unknown) {
    const message = extractErrorMessage(error);
    const quotaError = isQuotaError(message);
    return { analysis: null, quotaError, message };
  }
}

export const geminiService = {
  async analyzeJobMultimodal(jobText: string, posterBase64?: string, posterMimeType?: string) {
    // Database cache covers duplicate scans, memory cache removed.

    const parts: any[] = [];
    const scanType = posterBase64 && jobText ? 'combined' : posterBase64 ? 'image' : 'text';
    const userPayload = {
      jobText: jobText || "",
      scanType: scanType
    };
    parts.push({ text: JSON.stringify(userPayload) });

    if (posterBase64 && posterMimeType) {
      parts.push({
        inlineData: {
          data: posterBase64,
          mimeType: posterMimeType
        }
      });
    }

    if (!genAI) {
      return normalizeAnalysis(localFallbackAnalysis(jobText, 'no API key'));
    }

    const primary = await attemptModel(parts, PRIMARY_MODEL);
    if (primary.analysis) {
      return primary.analysis;
    }

    if (primary.quotaError) {
      return normalizeAnalysis(localFallbackAnalysis(jobText, 'quota error'));
    }

    const secondary = await attemptModel(parts, FALLBACK_MODEL);
    if (secondary.analysis) {
      return secondary.analysis;
    }

    if (secondary.quotaError) {
      return normalizeAnalysis(localFallbackAnalysis(jobText, 'quota error'));
    }

    return normalizeAnalysis(localFallbackAnalysis(jobText, primary.message || 'AI failure'));
  },

  async generateChatResponse(history: any[], message: string, jobContext: any = null) {
    if (!genAI) return 'Error: Gemini API Key is missing or not loaded.';

    const session = history.map(msg => ({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text: msg.content }] }));
    const chatPrompt = jobContext ? `${jobContext}\nUser: ${message}` : message;

    try {
      const model = genAI.getGenerativeModel({
        model: PRIMARY_MODEL,
        generationConfig: { temperature: 0.3, topP: 0.7, maxOutputTokens: 300 }
      });
      const chat = model.startChat({ history: session });
      const response = await withTimeout(chat.sendMessage(chatPrompt), MAX_AI_TIMEOUT_MS);
      return response.response.text();
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      if (isQuotaError(msg)) {
        try {
          const fallbackModel = genAI.getGenerativeModel({
            model: FALLBACK_MODEL,
            generationConfig: { temperature: 0.3, topP: 0.7, maxOutputTokens: 300 }
          });
          const fallbackChat = fallbackModel.startChat({ history: session });
          const response = await withTimeout(fallbackChat.sendMessage(chatPrompt), MAX_AI_TIMEOUT_MS);
          return response.response.text();
        } catch (fallbackErr: unknown) {
          return 'AI Chat service is temporarily unavailable due to capacity limits. Please try again in a minute.';
        }
      }
      return 'Error connecting to AI: ' + msg;
    }
  },

  evaluateTrustScore(aiScores: any) {
    const normalized = normalizeAnalysis(aiScores);
    const score = buildTrustScore(normalized);
    const verdict = buildVerdict(score, normalized.riskLevel);
    
    // We map the new schema to the expected generic breakdown for UI rendering backwards compatibility
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
