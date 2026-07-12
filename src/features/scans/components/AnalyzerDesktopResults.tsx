'use client';

import { m } from 'motion/react';
import { staggerContainer, slideUp } from '@/core/motion';
import { Flag } from 'lucide-react';
import { TrustScoreCard } from './results/TrustScoreCard';
import { AnalysisCriteriaCard } from './results/AnalysisCriteriaCard';
import { PatternMatchCard } from './results/PatternMatchCard';
import { ExtractedTextCard } from './results/ExtractedTextCard';
import { RedFlagsAlert } from './results/RedFlagsAlert';
import { AISummaryCard } from './results/AISummaryCard';

interface AnalyzerDesktopResultsProps {
    result: any;
    revealStats: boolean;
    handleReport: () => void;
}

export function AnalyzerDesktopResults({
    result,
    revealStats,
    handleReport
}: AnalyzerDesktopResultsProps) {
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
                <TrustScoreCard score={result.score} />

                <div className="lg:col-span-8 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnalysisCriteriaCard breakdown={result.breakdown} revealStats={revealStats} />
                        <PatternMatchCard patternName={result.patternName} patternConfidence={result.patternConfidence} />
                    </div>
                    <ExtractedTextCard extractedText={result.extractedText} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RedFlagsAlert redFlags={result.redFlags} />
                <AISummaryCard summary={result.summary} positiveSignals={result.positiveSignals} />
            </div>
        </m.div>
    );
}
