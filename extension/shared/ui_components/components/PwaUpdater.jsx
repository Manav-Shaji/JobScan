/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

export function PwaUpdater() {
  const [showReload, setShowReload] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator && window.serwist !== undefined) {
      // Register serwist to listen to updates
      window.serwist.addEventListener("sw_update_found", () => {
        setShowReload(true);
      });
    }
  }, []);

  if (!showReload) return null;

  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[9999] px-4 w-full max-w-sm">
      <div className="bg-[#0f172a] border border-[#334155] text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="font-semibold text-sm">Update Available</span>
          <span className="text-xs text-slate-400">A new version of JobScan is ready.</span>
        </div>
        <button
          onClick={() => {
            if (window.serwist) {
              window.serwist.messageSW({ type: "SKIP_WAITING" });
            }
            window.location.reload();
          }}
          className="flex items-center gap-1 bg-[#0ea5e9] hover:bg-[#38bdf8] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
        >
          <Download size={14} />
          Refresh
        </button>
      </div>
    </div>
  );
}
