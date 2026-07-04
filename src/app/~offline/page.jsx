"use client";

import Link from "next/link";
import { ShieldAlert, WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-[var(--canvas)] p-6 text-center">
      <div className="w-20 h-20 bg-[var(--surface-elevated)] rounded-full flex items-center justify-center mb-6 shadow-xl border border-[var(--hairline-strong)]">
        <WifiOff size={40} className="text-[var(--muted)]" />
      </div>
      
      <h1 className="display-sm mb-2 text-[var(--on-dark)]">No Internet Connection</h1>
      <p className="text-secondary mb-8 max-w-md">
        You are currently offline. Please check your network connection to continue analyzing job postings.
      </p>

      <button type="button" onClick={() => window.location.reload()}
        className="button-primary mb-4 w-full max-w-[280px]"
      >
        Retry Connection
      </button>

      <Link 
        href="/dashboard?tab=analyzer" 
        className="btn-premium-secondary w-full max-w-[280px] gap-2"
      >
        <ShieldAlert size={16} />
        Open Analyzer When Online
      </Link>
    </div>
  );
}
