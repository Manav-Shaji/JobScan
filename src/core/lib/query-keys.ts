/**
 * ------------------------------------------------------------
 * File: query-keys.ts
 * 
 * Purpose:
 * Centralized registry of React Query cache keys.
 * 
 * Responsibilities:
 * • Define strictly typed, predictable query keys for the application
 * • Prevent typos and ensure reliable cache invalidation
 * 
 * Used By:
 * • React Query Hooks across features
 * ------------------------------------------------------------
 */

export const queryKeys = {
  user: {
    profile: ['user', 'profile'] as const,
    settings: ['user', 'settings'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  scans: {
    history: ['scans', 'history'] as const,
    report: (id: string) => ['scans', 'report', id] as const,
  },
  chat: {
    history: ['chat', 'history'] as const,
  },
};
