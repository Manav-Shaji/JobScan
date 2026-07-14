/**
 * ------------------------------------------------------------
 * File: api.ts
 * 
 * Purpose:
 * Shared TypeScript type definitions for API requests and responses.
 * 
 * Responsibilities:
 * • Define data structures for frontend/backend communication
 * 
 * Used By:
 * • API Routes
 * • Frontend Services
 * ------------------------------------------------------------
 */

export interface AnalyzeResponse {
  success: boolean;
  score?: number;
  message?: string;
  data?: any;
}

export interface HistoryResponse {
  id: string;
  jobTitle: string;
  company: string;
  score: number;
  createdAt: string;
}

export interface ChatResponse {
  success: boolean;
  data?: string;
  message?: string;
}

export interface DashboardStats {
  totalScans: number;
  scamsDetected: number;
  avgTrustScore: number;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}
