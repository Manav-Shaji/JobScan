import { AnalyzeResponse, HistoryResponse, ChatResponse, DashboardStats } from '@/types/api';

// --- API Client ---
const API_BASE = '/api';

async function analyzeJobDescription(jobDescription: string, posterFile: File | null = null): Promise<AnalyzeResponse> {
  let body: BodyInit;
  let headers: HeadersInit = {};
  
  if (posterFile) {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription || '');
    formData.append('poster', posterFile);
    body = formData;
  } else {
    body = JSON.stringify({ jobDescription });
    headers = { 'Content-Type': 'application/json' };
  }

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers,
    body,
  });
  
  const payload = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(payload?.message || 'Failed to analyze job description.');
  }
  return payload;
}

async function getAnalysisHistory(): Promise<HistoryResponse[]> {
  try {
    const res = await fetch(`${API_BASE}/history`);
    return res.ok ? await res.json() : [];
  } catch (err) { return []; }
}

async function getAnalysisStats(): Promise<DashboardStats> {
  const defaultStats = { totalScans: 0, scamsDetected: 0, avgTrustScore: 0 };
  try {
    const res = await fetch(`${API_BASE}/stats`);
    return res.ok ? await res.json() : defaultStats;
  } catch (err) { return defaultStats; }
}

async function sendChatMessage(message: string, context: any): Promise<any> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  });
  const data = await res.json();
  return data?.success ? data.data : data;
}

async function getChatHistory(): Promise<any[]> {
  try {
    const res = await fetch(`${API_BASE}/chat`);
    if (res.status === 401) return [];
    const data = await res.json();
    return data?.success ? data.data : data;
  } catch (err) { return []; }
}

async function clearChatHistory(): Promise<any> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'DELETE',
  });
  return res.json();
}

async function reportScam(scanId: any, reason: string): Promise<any> {
  const body = {
    scanId: typeof scanId === 'object' && scanId !== null ? (scanId.scanId || scanId.id) : scanId,
    reason: reason || 'Community Flagged'
  };

  const res = await fetch(`${API_BASE}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

const api = {
  analyze: analyzeJobDescription,
  getHistory: getAnalysisHistory,
  getStats: getAnalysisStats,
  sendMessage: sendChatMessage,
  getChatHistory: getChatHistory,
  clearChatHistory: clearChatHistory,
  reportScam: reportScam,
};

export default api;
