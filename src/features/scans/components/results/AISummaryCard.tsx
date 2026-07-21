/**
 * ------------------------------------------------------------
 * Component: AISummaryCard
 * 
 * Purpose:
 * Displays the AI-generated natural language summary of a job scan.
 * 
 * Responsibilities:
 * • Render text summary and bulleted positive signals
 * • Handle layout and entry animations
 * 
 * Used By:
 * • Desktop & Mobile Results Components
 * ------------------------------------------------------------
 */

import { m } from 'motion/react';
import { Search, CheckSquare } from 'lucide-react';
import { slideUp, staggerContainer } from '@/core/motion';

export function AISummaryCard({ summary, positiveSignals }: { summary?: string, positiveSignals?: string[] }) {
    return (
        <m.div variants={slideUp} className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-5 shadow-lg hover-lift transition duration-300 group h-full hover:shadow-[0_8px_30px_rgba(59,130,246,0.2)] hover:border-blue-500/30 flex flex-col justify-between">
            <div>
                <h3 className="flex items-center gap-2.5 text-blue-400 font-bold text-xs mb-3 tracking-tight">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Search size={14} />
                    </div>
                    AI Summary & Consistency Check
                </h3>
                <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-3 backdrop-blur-sm">
                    <p className="text-[var(--body)] text-xs leading-relaxed m-0 font-medium">{summary}</p>
                </div>
            </div>
            {positiveSignals && positiveSignals.length > 0 && (
                <div className="border-t border-[var(--hairline)] pt-4 mt-2">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <CheckSquare size={12}/> Positive Signals ({positiveSignals.length})
                    </h4>
                    <m.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
                        {positiveSignals.map((sig, i) => (
                            <m.div key={sig || i} variants={slideUp} className="text-[11px] text-[var(--body)] flex items-start gap-2 bg-emerald-500/5 p-2 rounded-xl border border-emerald-500/10">
                                <span className="text-emerald-500 font-bold">✓</span> <span className="font-medium">{sig}</span>
                            </m.div>
                        ))}
                    </m.div>
                </div>
            )}
        </m.div>
    );
}
