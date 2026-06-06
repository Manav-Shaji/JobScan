'use client';

import { useState, useEffect } from 'react';
import { WifiOff, RotateCw, History, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setChecking(true);
    setTimeout(() => {
      setIsOnline(navigator.onLine);
      setChecking(false);
      if (navigator.onLine) {
        window.location.href = '/app?tab=analyzer';
      }
    }, 1000);
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center"
      style={{
        background: 'var(--canvas)',
        fontFamily: 'var(--font-base)',
        color: 'var(--on-dark)'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .offline-glass {
          background: var(--surface-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--hairline);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
        }
        [data-theme="dark"] .offline-glass {
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.05);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        .pulse-icon {
          animation: pulse 2s infinite ease-in-out;
        }
      ` }} />

      <div className="offline-glass p-8 md:p-12 rounded-3xl max-w-lg w-full flex flex-col items-center gap-6">
        {/* Glow Icon Header */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-blue-500 pulse-icon"
          style={{
            background: 'rgba(var(--cta-rgb), 0.1)',
            border: '1px solid rgba(var(--cta-rgb), 0.25)',
            boxShadow: '0 8px 24px rgba(var(--cta-rgb), 0.15)'
          }}
        >
          <WifiOff size={32} />
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">You are offline</h1>
          <p className="text-[var(--muted)] text-sm md:text-base leading-relaxed">
            Internet connection is currently unavailable. Previous scan history remains available in your console.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl text-xs font-semibold text-[var(--muted)]">
          <ShieldAlert size={14} className="text-amber-500" />
          <span>Offline Navigation Shell Active</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <button
            onClick={handleRetry}
            disabled={checking}
            className="flex-1 btn-glow flex items-center justify-center gap-2 text-white font-bold text-sm"
            style={{
              padding: '14px 28px',
              borderRadius: '9999px',
            }}
          >
            <RotateCw size={16} className={checking ? "animate-spin" : ""} />
            {checking ? 'Checking Link...' : 'Retry Connection'}
          </button>

          <Link
            href="/app?tab=history"
            className="flex-1 btn-premium-secondary flex items-center justify-center gap-2"
          >
            <History size={16} />
            View Scan History
          </Link>
        </div>
      </div>
    </div>
  );
}
