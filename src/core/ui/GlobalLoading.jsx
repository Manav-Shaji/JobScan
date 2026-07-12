import { ShieldCheck } from 'lucide-react';
import { m } from 'motion/react';

export function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-[60vh] gap-6 fade-in">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-[30px] opacity-20 animate-pulse"></div>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[1px] relative overflow-hidden group shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-y-full animate-[scan-laser_2s_infinite]"></div>
          <div className="w-full h-full bg-[var(--surface)] rounded-2xl flex items-center justify-center backdrop-blur-xl relative z-10">
            <ShieldCheck size={36} className="text-blue-500 animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-lg font-black tracking-tight text-[var(--on-dark)]">
          JobScan<span className="text-blue-500">.</span>
        </h3>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}
