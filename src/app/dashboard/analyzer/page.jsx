'use client';

import dynamic from 'next/dynamic';
const TrustScore = dynamic(() => import('@/app/(landing)/features').then(mod => mod.TrustScore));
const SignupWall = dynamic(() => import('@/app/(landing)/features').then(mod => mod.SignupWall));
import { Toaster } from "@/core/ui/toasts";
import {
    ShieldCheck,
    Cpu,
    Lock,
    Unlock,
    CheckCircle,
    Fingerprint,
    Terminal,
    Briefcase
} from 'lucide-react';
import { m, AnimatePresence } from 'motion/react';
import { scaleUp } from '@/core/motion';
import { AnalyzerInput } from '@/features/scans/components/AnalyzerInput';
import { useAnalyzer, loadingMessages } from '@/features/scans/hooks/useAnalyzer';

const AnalyzerDesktopResults = dynamic(() => import('@/features/scans/components/AnalyzerDesktopResults').then(mod => mod.AnalyzerDesktopResults));
const AnalyzerMobileResults = dynamic(() => import('@/features/scans/components/AnalyzerMobileResults').then(mod => mod.AnalyzerMobileResults));
const ChatWidget = dynamic(() => import('@/core/ui/ChatWidget').then(mod => mod.ChatWidget), { ssr: false });

export default function Analyzer() {
    const { state, setters, handlers, scanLimit } = useAnalyzer();

    const {
        jobText, posterFile, posterPreview, activeTab, loading,
        result, inputError, activeStage, completedStages, revealStats,
        showBottomSheet, sheetTranslateY, isDraggingSheet
    } = state;

    const { setJobText, setPosterFile, setPosterPreview, setActiveTab, setShowBottomSheet } = setters;

    const {
        handleSheetTouchStart, handleSheetTouchMove, handleSheetTouchEnd,
        handleAnalyze, handleReport, handlePaste, getAnalyzeButtonText
    } = handlers;

    const {
        scanCount, remainingScans, showSignupWall,
        dismissSignupWall, FREE_SCAN_LIMIT, isLoggedIn
    } = scanLimit;

    return (
        <div className="fade-in max-w-[1200px] mx-auto px-1 md:px-4 pt-0 pb-2">
            <Toaster />
            
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                        <h1 className="text-2xl font-black text-[var(--on-dark)] m-0 tracking-tight flex items-center gap-2">
                            Job Threat Analyzer
                        </h1>
                    </div>
                    <p className="text-[var(--muted)] text-sm ml-4 mb-0">Cross-reference patterns instantly with advanced multimodal AI.</p>
                </div>
            </div>

            {/* --- Premium Quota Tracker --- */}
            <div className="mb-6 p-3.5 rounded-2xl border bg-[rgba(var(--cta-rgb),0.04)] border-blue-500/10 flex items-center justify-between flex-wrap gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border \${
                        !isLoggedIn 
                            ? (remainingScans <= 1 ? 'bg-red-500/10 text-red-400 border-red-500/25' : 'bg-blue-500/10 text-blue-400 border-blue-500/25') 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    }`}>
                        {!isLoggedIn ? (remainingScans === 0 ? <Lock size={18} /> : <Unlock size={18} />) : <ShieldCheck size={18} />}
                    </div>
                    <div>
                        <div className="font-bold text-[var(--on-dark)] text-xs flex items-center gap-1.5">
                            {!isLoggedIn 
                                ? (remainingScans === 0 ? 'Demo Scans Exhausted' : `\${remainingScans} of \${FREE_SCAN_LIMIT} Free Demo Scans Available`) 
                                : 'Candidate Guard Active'}
                            {isLoggedIn && <span className="status-dot green"></span>}
                        </div>
                        <div className="text-[10px] text-[var(--muted)] mt-0.5">
                            {!isLoggedIn ? (remainingScans === 0 ? 'Create a free account to unlock unlimited access' : 'Sign up to unlock persistent history & the AI Chat assistant') : 'Real-time AI threat detection is active across all searches'}
                        </div>
                    </div>
                </div>
                {!isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        {[...Array(FREE_SCAN_LIMIT)].map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 \${
                                i < scanCount ? (remainingScans <= 1 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]') : 'bg-[var(--hairline)]'
                            }`}></div>
                        ))}
                    </div>
                ) : (
                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1 shadow-sm">SECURE SCANNER</div>
                )}
            </div>

            {/* --- Main Workspace (Input Area) --- */}
            <AnalyzerInput 
                jobText={jobText}
                setJobText={setJobText}
                posterFile={posterFile}
                setPosterFile={setPosterFile}
                posterPreview={posterPreview}
                setPosterPreview={setPosterPreview}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                inputError={inputError}
                handlePaste={handlePaste}
            />

            {/* SECTION 3: Analyze Button (Desktop Only) */}
            <div className="mb-8 hidden md:block">
                <button type="button" className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white py-4 rounded-2xl font-black text-sm tracking-widest shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.25)] hover:scale-[1.002] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? <><Cpu className="animate-spin" size={18} /> {getAnalyzeButtonText()}</> : <><ShieldCheck size={18} /> {getAnalyzeButtonText()}</>}
                    </span>
                </button>
            </div>

            {/* --- Loading State --- */}
            <AnimatePresence>
            {loading && (
                <m.div variants={scaleUp} initial="hidden" animate="visible" exit="exit" className="glass-card premium-card-edge rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden border border-blue-500/20 soft-glow mb-6">
                    <div className="text-center mb-5">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-3 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                            <Fingerprint size={24} className="animate-pulse text-blue-400" />
                        </div>
                        <h3 className="text-base font-black text-[var(--on-dark)] mb-0 tracking-tight flex items-center justify-center gap-1.5">
                            <Terminal size={14} className="text-blue-500" /> Analysis Active
                        </h3>
                    </div>
                    <div className="max-w-md mx-auto space-y-2 mb-5">
                        {loadingMessages.map((msg, i) => {
                            const isCompleted = completedStages.includes(i);
                            const isActive = activeStage === i;
                            return (
                                <div key={i} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 \${isActive ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)] scale-[1.01]' : isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/90' : 'bg-[rgba(var(--primary-rgb),0.03)] border-[var(--hairline)] text-[var(--muted)] opacity-40'}`}>
                                    <div className="flex items-center gap-2.5">
                                        {isCompleted ? <CheckCircle size={14} className="text-emerald-500" /> : isActive ? <Cpu size={14} className="animate-spin text-blue-400" /> : <Lock size={14} className="text-[var(--muted)]" />}
                                        <span className="text-[11px] font-semibold">{msg}</span>
                                    </div>
                                    <div>
                                        {isCompleted ? <span className="text-[8px] font-black uppercase tracking-wider bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-emerald-400">PASSED</span> : isActive ? <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span></span> : <span className="text-[8px] uppercase font-bold tracking-wider opacity-60">PENDING</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-48 h-1 bg-[var(--hairline)] rounded-full mx-auto overflow-hidden border border-[var(--hairline-strong)]">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 rounded-full transition-all duration-300 ease-out" style={{ width: `\${Math.min(100, ((activeStage) / loadingMessages.length) * 100)}%` }}></div>
                    </div>
                </m.div>
            )}
            </AnimatePresence>

            {/* --- Results View --- */}
            <AnalyzerDesktopResults 
                result={result} 
                revealStats={revealStats} 
                handleReport={handleReport} 
            />
            
            <AnalyzerMobileResults 
                result={result}
                showBottomSheet={showBottomSheet}
                setShowBottomSheet={setShowBottomSheet}
                sheetTranslateY={sheetTranslateY}
                handleSheetTouchStart={handleSheetTouchStart}
                handleSheetTouchMove={handleSheetTouchMove}
                handleSheetTouchEnd={handleSheetTouchEnd}
                isDraggingSheet={isDraggingSheet}
                handleReport={handleReport}
            />



            {showSignupWall && <SignupWall onClose={dismissSignupWall} />}

            {/* Sticky Pinned Mobile Analyze Button Bar */}
            <div 
                className="md:hidden fixed left-0 right-0 z-40 bg-[var(--canvas)]/80 backdrop-blur-md border-t border-[var(--hairline)] p-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
            >
                <button type="button" className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 active:scale-[0.98] text-white py-3.5 rounded-xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Cpu className="animate-spin" size={14} />
                            {getAnalyzeButtonText()}
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={14} />
                            {getAnalyzeButtonText()}
                        </>
                    )}
                </button>
            </div>

            {/* Chat Widget Container */}
            {(loading || result) && (
                <div className="hidden md:block">
                    <ChatWidget />
                </div>
            )}
        </div>
    );
}
