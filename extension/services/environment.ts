/* eslint-disable */
export const LOCAL_API = 'http://localhost:3000/api';
export const PROD_API = 'https://job-scan-black.vercel.app/api';

// Cache configuration
const CACHE_DURATION_MS = 60 * 1000; // 60 seconds
let cachedUrl: string | null = null;
let cacheExpiry: number = 0;

/**
 * Pings the local development server to see if it's available.
 * Resolves with LOCAL_API if successful (HTTP 200) within 1000ms.
 * Otherwise resolves with PROD_API.
 */
async function detectEnvironment(): Promise<string> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1000);

    const response = await fetch(`${LOCAL_API}/stats`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If we get ANY response back (even 401 Unauthorized, 404, or 500), 
    // it means the localhost server is physically running and responding.
    // Fetch only throws if the connection is completely refused/timed out.
    if (response) {
      return LOCAL_API;
    }
  } catch (error) {
    // Ignore errors (timeout, connection refused, etc.) and fallback to PROD
  }
  
  return PROD_API;
}

/**
 * Returns the active API base URL.
 * Uses an in-memory cache to avoid repeated pinging.
 */
export async function getApiBaseUrl(): Promise<string> {
  const now = Date.now();

  // Return cached URL if valid
  if (cachedUrl && now < cacheExpiry) {
    return cachedUrl;
  }

  // Detect and cache
  const url = await detectEnvironment();
  cachedUrl = url;
  cacheExpiry = now + CACHE_DURATION_MS;

  console.log(`[JobScan Env] Active API Base: ${url} (Cached for 60s)`);
  return url;
}

/**
 * Clears the environment cache to force a re-check on the next request.
 */
export function clearEnvironmentCache(): void {
  cachedUrl = null;
  cacheExpiry = 0;
}
