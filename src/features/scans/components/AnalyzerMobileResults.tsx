'use client';

import { 
    Flag, 
    X, 
    Search, 
    Sparkles, 
    Briefcase, 
    Fingerprint, 
    AlertTriangle, 
    FileSearch, 
    CheckSquare,
    ShieldCheck
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/core/ui/Alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/core/ui/layout";
import dynamic from 'next/dynamic';

const TrustScore = dynamic(() => import('@/app/(landing)/features').then(mod => mod.TrustScore));

interface AnalyzerMobileResultsProps {
    result: any;
    showBottomSheet: boolean;
    setShowBottomSheet: (show: boolean) => void;
    sheetTranslateY: number;
    handleSheetTouchStart: (e: any) => void;
    handleSheetTouchMove: (e: any) => void;
    handleSheetTouchEnd: () => void;
    isDraggingSheet: boolean;
    handleReport: () => void;
}

export function AnalyzerMobileResults({
    result,
    showBottomSheet,
    setShowBottomSheet,
    sheetTranslateY,
    handleSheetTouchStart,
    handleSheetTouchMove,
    handleSheetTouchEnd,
    isDraggingSheet,
    handleReport
}: AnalyzerMobileResultsProps) {
    if (!result || result.error) return null;

    return (
        <>
            {/* --- Mobile Bottom Sheet Results View --- */}
            {showBottomSheet && (
                <div className="md:hidden">
                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes slideUp {
                            from { transform: translateY(100%); }
                            to { transform: translateY(0); }
                        }
                        .animate-slide-up {
                            animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        .animate-fade-in {
                            animation: fadeIn 0.25s ease-out forwards;
                        }
                    ` }} />
                    {/* Backdrop Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[90] animate-fade-in"
                        onClick={() => setShowBottomSheet(false)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowBottomSheet(false); }}
                        role="presentation"
                    />
                    {/* Bottom Sheet Card Container */}
                    <div 
                        className={`fixed bottom-0 left-0 right-0 z-[110] bg-[#081124] rounded-t-3xl border-t border-white/10 shadow-2xl flex flex-col max-h-[82vh] ${sheetTranslateY === 0 ? 'animate-slide-up' : ''}`}
                        onTouchStart={handleSheetTouchStart}
                        onTouchMove={handleSheetTouchMove}
                        onTouchEnd={handleSheetTouchEnd}
                        style={{ 
                            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
                            transform: sheetTranslateY > 0 ? `translateY(${sheetTranslateY}px)` : undefined,
                            transition: isDraggingSheet ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        {/* Drag handlebar */}
                        <div 
                            className="drag-handlebar w-12 h-1 bg-white/20 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer" 
                            onClick={() => setShowBottomSheet(false)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowBottomSheet(false); }}
                            role="presentation"
                        />
                        
                        {/* Scrollable sheet body */}
                        <div className="overflow-y-auto px-5 pb-4 flex-1 custom-scrollbar">
                            {/* Header */}
                            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                                <div className="min-w-0 pr-3">
                                    <h3 className="text-sm font-black text-white m-0 tracking-tight flex items-center gap-1.5">Trust Assessment</h3>
                                    <p className="text-[9px] text-gray-400 m-0 mt-0.5">Scan Type: <strong className="text-white uppercase">{result.scanType}</strong></p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button type="button" className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[9px] uppercase tracking-wider active:scale-95 transition" 
                                        onClick={handleReport}
                                    >
                                        <Flag size={11} /> Flag
                                    </button>
                                    <button type="button" className="p-1 rounded-lg border border-white/10 text-gray-400 hover:text-white bg-slate-900/50 flex items-center justify-center w-7 h-7 active:scale-95 transition" 
                                        onClick={() => setShowBottomSheet(false)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Assessment Score Card */}
                            <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden mb-4 border border-white/5 bg-slate-900/40">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2.5 text-center">OVERALL TRUST SCORE</h4>
                                <div className="relative z-10 flex items-center justify-center w-full min-h-[120px]">
                                    <TrustScore score={result.score} visible={true} />
                                </div>
                            </div>

                            {/* AI Summary Card */}
                            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60 mb-4 text-xs">
                                <h5 className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] mb-2 uppercase tracking-wider">
                                    <Search size={12} /> AI Summary & Verdict
                                </h5>
                                <p className="text-gray-300 text-[11px] leading-relaxed m-0 font-medium">{result.summary}</p>
                            </div>

                            {/* Toggle Details View Accordion */}
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="details" className="border-b-0">
                                    <AccordionTrigger className="w-full py-3 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors border border-white/5 data-[state=open]:rounded-b-none outline-none">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-blue-400" /> View Full Breakdown
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 animate-fade-in border border-t-0 border-white/5 bg-slate-900/40 rounded-b-xl px-4 pb-4">
                                        {/* Criteria Breakdown */}
                                        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-slate-900/40">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                                                <Briefcase size={12} className="text-emerald-400"/> Analysis Criteria
                                            </h4>
                                            <div className="flex flex-col gap-2.5">
                                                {(result.breakdown || []).map((item, i) => (
                                                    <div key={item.label || i} className="flex flex-col gap-1.5">
                                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                                            <span className="text-gray-300">{item.label}</span>
                                                            <span className={item.value < 40 ? 'text-red-400' : item.value < 75 ? 'text-amber-400' : 'text-emerald-400'}>{item.value}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                                            <div className={`h-full rounded-full transition duration-1000 ${item.value < 40 ? 'bg-red-500' : item.value < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${item.value}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Scam Pattern Match */}
                                        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-slate-900/40">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                                                <Fingerprint size={12} className="text-purple-400"/> Scam Pattern Match
                                            </h4>
                                            <div className="flex flex-col items-center justify-center py-2">
                                                <div className={`px-3 py-1.5 rounded-lg border text-xs font-black text-center mb-2 bg-[#081124] ${result.patternName && result.patternName !== 'Unknown Pattern' && result.patternName !== 'None' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                                    {result.patternName && result.patternName !== 'None' ? result.patternName : 'None Detected'}
                                                </div>
                                                {result.patternConfidence != null && (
                                                    <div className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">
                                                        Confidence: <span className="text-white">{result.patternConfidence}%</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Red Flags Alert */}
                                        <Alert variant="destructive" className="bg-red-500/5 border-red-500/10 rounded-2xl p-4 shadow-none">
                                            <AlertTitle className="flex items-center gap-1.5 text-red-400 font-bold text-xs mb-2.5 tracking-tight">
                                                <AlertTriangle size={12} /> Detected Red Flags ({result.redFlags?.length || 0})
                                            </AlertTitle>
                                            <AlertDescription className="flex flex-col gap-2">
                                                {result.redFlags?.length > 0 ? result.redFlags.map((flag, i) => (
                                                    <div key={flag || i} className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] leading-relaxed flex items-start gap-2 font-medium">
                                                        <span className="status-dot red mt-1.5"></span><div className="font-medium">{flag}</div>
                                                    </div>
                                                )) : <div className="text-[10px] text-gray-400 italic">No critical red flags identified.</div>}
                                            </AlertDescription>
                                        </Alert>

                                        {/* Extracted Information OCR */}
                                        {result.extractedText && (
                                            <div className="glass-card rounded-2xl p-4 border border-white/5 bg-slate-900/40">
                                                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                                                    <FileSearch size={12} className="text-blue-400"/> Extracted OCR Info
                                                </h4>
                                                <div className="p-3 rounded-lg bg-[#081124] border border-white/5 max-h-28 overflow-y-auto custom-scrollbar">
                                                    <p className="text-[10px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{result.extractedText}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Positive Signals */}
                                        {result.positiveSignals?.length > 0 && (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
                                                <h5 className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-2.5 tracking-tight">
                                                    <CheckSquare size={12} /> Positive Signals
                                                </h5>
                                                <div className="flex flex-col gap-1.5">
                                                    {result.positiveSignals.map((sig, i) => (
                                                        <div key={sig || i} className="text-[10px] text-gray-300 flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <span className="pt-0.5">{sig}</span></div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Mobile Floating Restore Action Button --- */}
            {!showBottomSheet && (
                <div 
                    className="md:hidden fixed left-4 right-4 z-40"
                    style={{ bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' }}
                >
                    <button type="button" className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg border border-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition"
                        onClick={() => setShowBottomSheet(true)}
                    >
                        <ShieldCheck size={14} /> View Latest Result ({result.score}%)
                    </button>
                </div>
            )}
        </>
    );
}
