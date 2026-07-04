/* eslint-disable */
export interface HistoryItem {
  id: string;
  url: string;
  company: string;
  title: string;
  score: number;
  timestamp: number;
  riskLevel: string;
  fullAnalysis?: any;
}

export async function getHistory(): Promise<HistoryItem[]> {
  const data = await chrome.storage.local.get(['jobHistory']);
  return data.jobHistory || [];
}

export async function addHistory(item: HistoryItem) {
  const history = await getHistory();
  const filtered = history.filter(h => h.url !== item.url);
  filtered.unshift(item);
  await chrome.storage.local.set({ jobHistory: filtered.slice(0, 50) });
}

export async function clearHistory() {
  await chrome.storage.local.remove(['jobHistory']);
}

export async function getCachedAnalysis(url: string): Promise<HistoryItem | null> {
  const history = await getHistory();
  return history.find(h => h.url === url) || null;
}
