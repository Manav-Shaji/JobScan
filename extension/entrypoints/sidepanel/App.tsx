/**
 * ------------------------------------------------------------
 * Component: App
 * 
 * Purpose:
 * Root component for the Chrome Extension side panel.
 * 
 * Responsibilities:
 * • Manage global state for the side panel (current tab, auth state)
 * • Render the main navigation and route between Dashboard, History, Settings
 * 
 * Used By:
 * • Side Panel Entrypoint
 * ------------------------------------------------------------
 */

/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { analyzeJob } from '@/extension/services/api';
import { getHistory, addHistory, clearHistory, getCachedAnalysis, HistoryItem } from '@/extension/services/history';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { Settings } from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [jobData, setJobData] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [settings, setSettings] = useState({ autoAnalyze: true, notifications: true, theme: 'dark' });

  // Load history on mount
  useEffect(() => {
    getHistory().then(setHistory);
  }, [activeTab]);

  useEffect(() => {
    const handleNewJob = async (data: any) => {
      setJobData(data);
      setError(null);
      setAnalysisResult(null); 
      const cached = await getCachedAnalysis(data.url);
      if (cached && cached.fullAnalysis) {
        setAnalysisResult(cached.fullAnalysis);
      }

      if (!cached || settings.autoAnalyze) {
        setLoading(true);
        try {
          const result = await analyzeJob(data);
          const finalResult = result?.success ? result.data : result;
          setAnalysisResult(finalResult);

          if (finalResult && finalResult.trustScore !== undefined) {
            await addHistory({
              id: crypto.randomUUID(),
              url: data.url,
              company: data.company,
              title: data.title,
              score: finalResult.trustScore,
              riskLevel: finalResult.riskLevel || 'Unknown',
              timestamp: Date.now(),
              fullAnalysis: finalResult
            });
            getHistory().then(setHistory);
          }
        } catch (err: any) {
          if (!cached) setError(err.message || 'Analysis failed to complete.');
        } finally {
          setLoading(false);
        }
      }
    };

    chrome.storage.local.get(['latestJobExtraction'], (result: { [key: string]: any }) => {
      if (result.latestJobExtraction) {
        handleNewJob(result.latestJobExtraction);
      }
    });

    const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes.latestJobExtraction) {
        handleNewJob(changes.latestJobExtraction.newValue);
        setActiveTab('dashboard');
      }
    };
    chrome.storage.local.onChanged.addListener(listener);
    return () => chrome.storage.local.onChanged.removeListener(listener);
  }, [settings.autoAnalyze]);

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  const handleScreenshotAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      chrome.tabs.captureVisibleTab(
        // @ts-ignore
        null, 
        { format: 'jpeg', quality: 80 }, 
        async (dataUrl: string | undefined) => {
          if (chrome.runtime.lastError || !dataUrl) {
            setError(chrome.runtime.lastError?.message || 'Failed to capture screenshot');
            setLoading(false);
            return;
          }

          const mimeMatch = dataUrl.match(/^data:(image\/\w+);base64,/);
          const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
          const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');

          try {
            const result = await analyzeJob(jobData, base64, mimeType);
            const finalResult = result?.success ? result.data : result;
            setAnalysisResult(finalResult);

            if (finalResult && finalResult.trustScore !== undefined) {
              await addHistory({
                id: crypto.randomUUID(),
                url: jobData?.url || 'Screenshot Analysis',
                company: jobData?.company || 'Unknown (OCR)',
                title: jobData?.title || 'Screenshot Analysis',
                score: finalResult.trustScore,
                riskLevel: finalResult.riskLevel || 'Unknown',
                timestamp: Date.now(),
                fullAnalysis: finalResult
              });
              getHistory().then(setHistory);
            }
          } catch (err: any) {
            setError(err.message || 'OCR Analysis failed');
          } finally {
            setLoading(false);
          }
      });
    } catch (err: any) {
      setError(err.message || 'Screenshot capture failed');
      setLoading(false);
    }
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setJobData({ title: item.title, company: item.company, url: item.url });
    setAnalysisResult(item.fullAnalysis);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-4 pb-6">
        {activeTab === 'dashboard' && (
          <Dashboard 
            jobData={jobData} 
            analysisResult={analysisResult} 
            loading={loading} 
            error={error} 
            handleScreenshotAnalysis={handleScreenshotAnalysis} 
          />
        )}
        {activeTab === 'history' && (
          <History 
            history={history} 
            handleClearHistory={handleClearHistory} 
            onRestoreHistory={handleRestoreHistory}
          />
        )}
        {activeTab === 'settings' && (
          <Settings 
            settings={settings} 
            setSettings={setSettings} 
            handleClearHistory={handleClearHistory} 
          />
        )}
      </div>

      <div className="border-t bg-[var(--surface-card)] z-50 shrink-0">
        <div className="flex justify-around items-center h-14">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex-1 flex flex-col items-center justify-center h-full text-xs font-medium transition-colors ${activeTab === 'dashboard' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('history')} 
            className={`flex-1 flex flex-col items-center justify-center h-full text-xs font-medium transition-colors ${activeTab === 'history' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
          >
            History
          </button>
          <button 
            onClick={() => setActiveTab('settings')} 
            className={`flex-1 flex flex-col items-center justify-center h-full text-xs font-medium transition-colors ${activeTab === 'settings' ? 'text-blue-500' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
