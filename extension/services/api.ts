/* eslint-disable */

// --- Environment Detection ---

const LOCAL_API = 'http://localhost:3000/api';
const PROD_API = 'https://job-scan-black.vercel.app/api';

const CACHE_DURATION_MS = 60 * 1000;
let cachedUrl: string | null = null;
let cacheExpiry: number = 0;

async function checkUrl(apiUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(`${apiUrl}/auth/csrf`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    return response.ok || response.status === 401 || response.status === 403;
  } catch (error) {
    return false;
  }
}

async function getActiveTabUrl(): Promise<string | null> {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0]?.url || null;
  } catch (error) {
    return null;
  }
}

async function detectEnvironment(): Promise<string> {
  const activeUrl = await getActiveTabUrl();
  if (activeUrl) {
    if (activeUrl.includes('localhost:3000') || activeUrl.includes('127.0.0.1:3000')) {
      const isLocalUp = await checkUrl(LOCAL_API);
      if (isLocalUp) {
        return LOCAL_API;
      }
    }
    if (activeUrl.includes('vercel.app') || activeUrl.includes('job-scan-black.vercel.app')) {
      const isProdUp = await checkUrl(PROD_API);
      if (isProdUp) {
        return PROD_API;
      }
    }
  }

  // Fallback to probing availability
  const isLocalUp = await checkUrl(LOCAL_API);
  if (isLocalUp) {
    return LOCAL_API;
  }

  return PROD_API;
}

async function getApiBaseUrl(): Promise<string> {
  const now = Date.now();

  if (cachedUrl && now < cacheExpiry) {
    return cachedUrl;
  }

  // Check user settings / detected URL first
  const { customApiUrl } = await chrome.storage.local.get(['customApiUrl']);
  if (customApiUrl && customApiUrl.trim() !== '') {
    const url = customApiUrl.endsWith('/api') ? customApiUrl : `${customApiUrl}/api`;
    const isAvailable = await checkUrl(url);
    if (isAvailable) {
      cachedUrl = url;
      cacheExpiry = now + CACHE_DURATION_MS;
      console.log(`[JobScan Env] Active API Base (Custom/Detected): ${url}`);
      return url;
    }
  }

  const url = await detectEnvironment();
  cachedUrl = url;
  cacheExpiry = now + CACHE_DURATION_MS;

  console.log(`[JobScan Env] Active API Base (Auto): ${url} (Cached for 60s)`);
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