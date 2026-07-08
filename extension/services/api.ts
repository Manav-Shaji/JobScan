/* eslint-disable */

// --- Environment Detection ---

const LOCAL_API = 'http://localhost:3000/api';
const PROD_API = 'https://job-scan-black.vercel.app/api';

const CACHE_DURATION_MS = 60 * 1000;
let cachedUrl: string | null = null;
let cacheExpiry: number = 0;

async function detectEnvironment(): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(`${LOCAL_API}/stats`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response) {
      return LOCAL_API;
    }
  } catch (error) {
    // Ignore errors (timeout, connection refused, etc.) and fallback to PROD
  }
  
  return PROD_API;
}

async function getApiBaseUrl(): Promise<string> {
  const now = Date.now();

  if (cachedUrl && now < cacheExpiry) {
    return cachedUrl;
  }

  // Check user settings first
  const { customApiUrl } = await chrome.storage.local.get(['customApiUrl']);
  if (customApiUrl && customApiUrl.trim() !== '') {
    const url = customApiUrl.endsWith('/api') ? customApiUrl : `${customApiUrl}/api`;
    cachedUrl = url;
    cacheExpiry = now + CACHE_DURATION_MS;
    console.log(`[JobScan Env] Active API Base (Custom): ${url}`);
    return url;
  }

  const url = await detectEnvironment();
  cachedUrl = url;
  cacheExpiry = now + CACHE_DURATION_MS;

  console.log(`[JobScan Env] Active API Base: ${url} (Cached for 60s)`);
  return url;
}

export function clearEnvironmentCache(): void {
  cachedUrl = null;
  cacheExpiry = 0;
}

// --- API ---

export async function analyzeJob(
  jobData: any,
  posterBase64?: string,
  posterMimeType?: string
) {
  try {
    const fullDescription = jobData
      ? `
Title: ${jobData.title || ''}
Company: ${jobData.company || ''}
Location: ${jobData.location || ''}
Salary: ${jobData.salary || ''}

Description:
${jobData.description || ''}
`
      : '';

    const API_BASE = await getApiBaseUrl();
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription: fullDescription,
        posterBase64,
        posterMimeType,
      }),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(payload?.message || 'Failed to analyze job description.');
    }

    return payload;
  } catch (error) {
    console.error('[Extension API Error]:', error);
    throw error;
  }
}