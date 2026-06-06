import 'server-only';
import { MemoryCache } from '@/backend/cache';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// MemoryCache specialized for Rate Limit Records (expired entries pruned automatically)
const rateLimitCache = new MemoryCache<RateLimitRecord>(1 * 60 * 1000);

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Apply a simple, lightweight rate limiting check
 * @param identifier Client identifier (IP address, User ID)
 * @param key Operation/Route key (e.g. 'analyze', 'auth-register')
 * @param limit Allowed request count in window
 * @param windowMs Window size in milliseconds
 */
export function rateLimit(
  identifier: string,
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const cacheKey = `${key}:${identifier}`;
  const now = Date.now();
  
  const record = rateLimitCache.get(cacheKey);

  if (!record) {
    // First request in the window
    const newRecord: RateLimitRecord = {
      count: 1,
      resetTime: now + windowMs,
    };
    
    // Store in cache with the window duration as TTL
    rateLimitCache.set(cacheKey, newRecord, windowMs);
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  // Window expired check (handled by MemoryCache get, but double checked here)
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    rateLimitCache.set(cacheKey, record, windowMs);
    
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetMs: windowMs,
    };
  }

  // Rate limit exceeded
  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs: Math.max(0, record.resetTime - now),
    };
  }

  // Increment request count
  record.count += 1;
  const remainingTime = Math.max(0, record.resetTime - now);
  
  // Re-save in cache with the remaining time as TTL to optimize memory
  rateLimitCache.set(cacheKey, record, remainingTime);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetMs: remainingTime,
  };
}
