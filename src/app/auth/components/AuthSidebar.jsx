import { ShieldCheck } from 'lucide-react';

export function AuthSidebar({ mode }) {
    return (
        <div className="branding-panel hidden lg:block">
            <div className="branding-content flex flex-col justify-between h-full">
                <div>
                    <div className="flex items-center gap-2 mb-10">
                        <ShieldCheck size={28} className="text-[var(--cta)]" />
                        <span className="font-black text-xl text-white tracking-wide">JobScan</span>
                    </div>
                    <h2 className="brand-headline">
                        {mode === 'login'
                            ? 'Intelligent analysis for job security.'
                            : 'Start your secure job search today.'}
                    </h2>
                    <p className="brand-subtitle">
                        {mode === 'login'
                            ? 'The ultimate analysis engine for detecting employment fraud. Powered by deterministic intelligence and linguistic verification.'
                            : 'Join thousands of professionals using JobScan to verify employment opportunities and avoid fraud.'}
                    </p>
                </div>

                <div>
                    <div className="trust-stats grid grid-cols-3 gap-3.5 my-8">
                        <div className="trust-stat p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[var(--cta)]/30 hover:shadow-[0_8px_20px_rgba(var(--cta-rgb),0.1)] transition-all duration-300 flex flex-col items-center justify-center text-center group/stat">
                            <span className="stat-num text-2xl font-black text-white leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-105 group-hover/stat:text-[var(--cta-hover)] drop-shadow-[0_2px_6px_rgba(var(--cta-rgb),0.3)]">1.2K+</span>
                            <span className="stat-text text-[9px] font-bold text-gray-400 tracking-wider uppercase transition-colors duration-300 group-hover/stat:text-gray-300">Daily Scans</span>
                        </div>
                        <div className="trust-stat p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[var(--cta)]/30 hover:shadow-[0_8px_20px_rgba(var(--cta-rgb),0.1)] transition-all duration-300 flex flex-col items-center justify-center text-center group/stat">
                            <span className="stat-num text-2xl font-black text-white leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-105 group-hover/stat:text-[var(--cta-hover)] drop-shadow-[0_2px_6px_rgba(var(--cta-rgb),0.3)]">99.2%</span>
                            <span className="stat-text text-[9px] font-bold text-gray-400 tracking-wider uppercase transition-colors duration-300 group-hover/stat:text-gray-300">Accuracy</span>
                        </div>
                        <div className="trust-stat p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[var(--cta)]/30 hover:shadow-[0_8px_20px_rgba(var(--cta-rgb),0.1)] transition-all duration-300 flex flex-col items-center justify-center text-center group/stat">
                            <span className="stat-num text-2xl font-black text-white leading-none mb-1.5 transition-transform duration-300 group-hover/stat:scale-105 group-hover/stat:text-[var(--cta-hover)] drop-shadow-[0_2px_6px_rgba(var(--cta-rgb),0.3)]">342</span>
                            <span className="stat-text text-[9px] font-bold text-gray-400 tracking-wider uppercase transition-colors duration-300 group-hover/stat:text-gray-300">Scams Caught</span>
                        </div>
                    </div>
                </div>

                <div className="text-[11px] text-gray-500 font-medium tracking-wide">
                    Secured by enterprise-grade cryptographic verification.
                </div>
            </div>
        </div>
    );
}
