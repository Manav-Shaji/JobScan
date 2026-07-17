/**
 * ------------------------------------------------------------
 * File: api-client.ts
 * 
 * Purpose:
 * Frontend API client wrapper.
 * 
 * Responsibilities:
 * • Wraps fetch for API communication
 * • Handles standard error parsing
 * 
 * Used By:
 * • React Query Hooks
 * ------------------------------------------------------------
 */

import ky from 'ky';
import { AnalyzeResponse, HistoryResponse, ChatResponse, DashboardStats } from '@/types/api';

// --- API Client ---
const apiClient = ky.create({
  prefix: '/api',
  timeout: 60000
});

async function analyzeJobDescription(jobDescription: string, uploadFiles: File[] = []): Promise<AnalyzeResponse> {
  try {
    if (uploadFiles && uploadFiles.length > 0) {
      const formData = new FormData();
      formData.append('jobDescription', jobDescription || '');
      uploadFiles.forEach(file => {
        formData.append('files', file);
      });
      return await apiClient.post('analyze', { body: formData }).json();
    } else {
      return await apiClient.post('analyze', { json: { jobDescription } }).json();
    }
  } catch (error: any) {
    if (error.name === 'HTTPError') {
      const payload = await error.response.json().catch(() => null);
      throw new Error(payload?.message || 'Failed to analyze job description.');
    }
    throw error;
  }
}

async function getAnalysisHistory(): Promise<HistoryResponse[]> {
  try {
    return await apiClient.get('history').json();
  } catch (err) {
    return [];
  }
}

async function getAnalysisStats(): Promise<DashboardStats> {
  const defaultStats = { totalScans: 0, scamsDetected: 0, avgTrustScore: 0 };
  try {
    return await apiClient.get('stats').json();
  } catch (err) {
    return defaultStats;
  }
}

async function sendChatMessage(message: string, context: any): Promise<any> {
  const data: any = await apiClient.post('chat', { json: { message, context } }).json();
  return data?.success ? data.data : data;
}

async function getChatHistory(): Promise<any[]> {
  try {
    const data: any = await apiClient.get('chat').json();
    return data?.success ? data.data : data;
  } catch (err) {
    return [];
  }
}

async function clearChatHistory(): Promise<any> {
  return await apiClient.delete('chat').json();
}

async function reportScam(scanId: any, reason: string): Promise<any> {
  const body = {
    scanId: typeof scanId === 'object' && scanId !== null ? (scanId.scanId || scanId.id) : scanId,
    reason: reason || 'Community Flagged'
  };
  return await apiClient.post('reports', { json: body }).json();
}

async function deleteScan(scanId: string): Promise<any> {
  return await apiClient.delete(`history/${scanId}`).json();
}

/**
 * ------------------------------------------------------------
 * File: api-client.ts
 * 
 * Purpose:
 * Centralized API client for frontend requests.
 * 
 * Responsibilities:
 * • Wrapper around native fetch API for consistent usage
 * • Handle JSON serialization, request headers, and error parsing
 * 
 * Used By:
 * • React Query Mutations and Queries
 * ------------------------------------------------------------
 */

const api = {
  analyze: analyzeJobDescription,
  getHistory: getAnalysisHistory,
  getStats: getAnalysisStats,
  sendMessage: sendChatMessage,
  getChatHistory: getChatHistory,
  clearChatHistory: clearChatHistory,
  reportScam: reportScam,
  deleteScan: deleteScan,
};

export default api;
