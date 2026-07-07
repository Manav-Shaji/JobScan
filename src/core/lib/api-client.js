// --- API Client ---
const API_BASE = '/api';

export async function analyzeJobDescription(jobDescription, posterFile = null) {
  let body, headers = {};
  
  if (posterFile) {
    body = new FormData();
    body.append('jobDescription', jobDescription || '');
    body.append('poster', posterFile);
    // Let browser set Content-Type for FormData (includes boundary)
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

export async function getAnalysisHistory() {
  try {
    const res = await fetch(`${API_BASE}/history`);
    return res.ok ? await res.json() : [];
  } catch (err) { return []; }
}

export async function getAnalysisStats() {
  const defaultStats = { totalScans: 0, scamsDetected: 0, avgTrustScore: 0 };
  try {
    const res = await fetch(`${API_BASE}/stats`);
    return res.ok ? await res.json() : defaultStats;
  } catch (err) { return defaultStats; }
}

export async function sendChatMessage(message, context) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, context }),
  });
  const data = await res.json();
  return data?.success ? data.data : data;
}

export async function getChatHistory() {
  try {
    const res = await fetch(`${API_BASE}/chat`);
    if (res.status === 401) return [];
    const data = await res.json();
    return data?.success ? data.data : data;
  } catch (err) { return []; }
}

export async function reportScam(scanId, reason) {
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
  reportScam: reportScam,
};

export default api;
