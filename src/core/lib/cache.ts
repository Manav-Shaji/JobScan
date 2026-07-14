/**
 * ------------------------------------------------------------
 * File: cache.ts
 * 
 * Purpose:
 * In-memory caching utility with TTL and periodic cleanup.
 * 
 * Responsibilities:
 * • Store typed cache entries
 * • Expire stale entries automatically
 * 
 * Used By:
 * • API Routes
 * • Feature Services
 * ------------------------------------------------------------
 */

import 'server-only';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class MemoryCache<T = any> {
  private store = new Map<string, CacheEntry<T>>();
  private defaultTtlMs: number;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(defaultTtlMs = 5 * 60 * 1000) {
    this.defaultTtlMs = defaultTtlMs;
    
    // Set up periodic automatic cleanup every 60 seconds
    if (typeof setInterval !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 60 * 1000);
      
      // Prevent blocking NextJS or server process termination
      if (this.cleanupInterval && typeof this.cleanupInterval.unref === 'function') {
        this.cleanupInterval.unref();
      }
    }
  }

  set(key: string, value: T, ttlMs?: number): void {
    const ttl = ttlMs ?? this.defaultTtlMs;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Check if a valid entry exists
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete entry from cache
   */
  delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Clear all entries from cache
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Retrieve active store size
   */
  get size(): number {
    this.cleanup();
    return this.store.size;
  }

  /**
   * Manual or periodic cleanup of expired items to prevent memory leaks
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Destroys background intervals if shutting down
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Export default global cache instances for scanning and generic use
const globalCache = new MemoryCache();
