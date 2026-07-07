'use client';

import { m } from 'motion/react';
import { staggerContainer, slideUp } from '@/core/motion';
import { Alert, AlertDescription, AlertTitle } from "@/core/ui/Alert";
import {
    Flag,
    Briefcase,
    Fingerprint,
    FileSearch,
    AlertTriangle,
    Search,
    CheckSquare
} from 'lucide-react';
import dynamic from 'next/dynamic';

const TrustScore = dynamic(() => import('@/app/(landing)/features').then(mod => mod.TrustScore));

export function AnalyzerDesktopResults({
    result,
    revealStats,
    handleReport
}) {
    if (!result || result.error) return null;

    return (
        <m.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden md:block space-y-6">
            <m.div variants={slideUp} className="flex flex-col md:flex-row justify-between items-center md:items-center gap-4 p-4 bg-[rgba(var(--primary-rgb),0.03)] rounded-2xl border border-[var(--hairline)]">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    <div>
                        <h2 className="text-xl font-black text-[var(--on-dark)] m-0 tracking-tight flex items-center gap-2">Trust Assessment</h2>
                        <p className="text-[var(--muted)] text-xs m-0 mt-1">Scan Type: <strong className="text-[var(--on-dark)] uppercase">{result.scanType}</strong></p>
                    </div>
                </div>
                <button type="button" className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs uppercase tracking-wider hover:bg-red-500/15 hover:scale-105 transition-all shadow-sm w-full md:w-auto" onClick={handleReport}>
                    <Flag size={13} /> Flag Scam
                </button>
            </m.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Trust Assessment Score Card */}
                <m.div variants={slideUp} className="lg:col-span-4 flex flex-col">
                    <div className="glass-card premium-card-edge rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 relative z-10 w-full text-center">OVERALL TRUST SCORE</h4>
                        <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                            <TrustScore score={result.score} visible={true} />
                        </div>
                    </div>
                </m.div>

                {/* Analysis Grid & Extracted Text */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 3. Poster Analysis or Breakdown */}
                        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2"><Briefcase size={14} className="text-emerald-400"/> Analysis Criteria</h4>
                            <div className="flex flex-col gap-3">
                                {(result.breakdown || []).map((item, i) => (
                                    <div key={item.label || i} className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-[11px] font-bold">
                                            <span className="text-[var(--on-dark)]">{item.label}</span>
                                            <span className={item.value < 40 ? 'text-red-400' : item.value < 75 ? 'text-amber-400' : 'text-emerald-400'}>{item.value}%</span>
                                        </div>
                                        <div className="h-1.5 bg-[var(--hairline)] rounded-full overflow-hidden shadow-inner">
                                            <div className={`h-full rounded-full transition-all duration-1000 ${item.value < 40 ? 'bg-red-500' : item.value < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${revealStats ? item.value : 0}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </m.div>

                        {/* 4. Scam Pattern Match */}
                        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-br from-[rgba(var(--primary-rgb),0.02)] to-[rgba(var(--surface-elevated-rgb),1)]">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2"><Fingerprint size={14} className="text-purple-400"/> Scam Pattern Match</h4>
                            <div className="flex flex-col items-center justify-center h-full pb-4">
                                <div className={`px-4 py-2 rounded-xl border text-sm font-black text-center mb-3 ${result.patternName !== 'Unknown Pattern' && result.patternName !== 'None' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                    {result.patternName}
                                </div>
                                <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">
                                    Confidence: <span className="text-[var(--on-dark)]">{result.patternConfidence}%</span>
                                </div>
                            </div>
                        </m.div>
                    </div>

                    {/* 2. Extracted Information & Consistency Check */}
                    {result.extractedText && (
                        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2"><FileSearch size={14} className="text-blue-400"/> Extracted Information (OCR)</h4>
                            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--hairline)] max-h-32 overflow-y-auto custom-scrollbar">
                                <p className="text-[11px] text-[var(--body)] font-mono leading-relaxed whitespace-pre-wrap">{result.extractedText}</p>
                            </div>
                        </m.div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 5. Detected Red Flags */}
                <m.div variants={slideUp}>
                    <Alert variant="destructive" className="bg-red-500/5 border-red-500/10 rounded-3xl p-6 shadow-lg hover-lift transition-all group h-full">
                        <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-4 text-red-400"><AlertTriangle size={16} /></div>
                        <AlertTitle className="text-red-400 font-bold text-sm tracking-tight">
                            Detected Red Flags ({result.redFlags?.length || 0})
                        </AlertTitle>
                        <AlertDescription className="flex flex-col gap-2.5 mt-2">
                            {result.redFlags?.length > 0 ? result.redFlags.map((flag, i) => (
                                <div key={flag || i} className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 text-xs leading-relaxed flex items-start gap-2.5">
                                    <span className="status-dot red mt-1.5"></span><div className="font-medium">{flag}</div>
                                </div>
                            )) : <div className="text-xs text-[var(--muted)] italic p-2">No critical red flags identified.</div>}
                        </AlertDescription>
                    </Alert>
                </m.div>

                {/* 7. AI Summary */}
                <m.div variants={slideUp} className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 shadow-lg hover-lift transition-all group h-full">
                    <h5 className="flex items-center gap-2.5 text-blue-400 font-bold text-sm mb-4 tracking-tight">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"><Search size={16} /></div>
                        AI Summary & Consistency Check
                    </h5>
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                        <p className="text-[var(--body)] text-[13px] leading-relaxed m-0 font-medium">{result.summary}</p>
                    </div>
                    {result.positiveSignals?.length > 0 && (
                        <div className="flex flex-col gap-2 border-t border-[var(--hairline)] pt-4 mt-2">
                            <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><CheckSquare size={12}/> Positive Signals</h6>
                            {result.positiveSignals.map((sig, i) => (
                                <div key={sig || i} className="text-[11px] text-[var(--body)] flex items-start gap-2"><span className="text-emerald-500">✓</span> {sig}</div>
                            ))}
                        </div>
                    )}
                </m.div>
            </div>
        </m.div>
    );
}
