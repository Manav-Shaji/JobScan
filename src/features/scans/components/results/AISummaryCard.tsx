import { m } from 'motion/react';
import { Search, CheckSquare } from 'lucide-react';
import { slideUp } from '@/core/motion';

export function AISummaryCard({ summary, positiveSignals }: { summary?: string, positiveSignals?: string[] }) {
    return (
        <m.div variants={slideUp} className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 shadow-lg hover-lift transition-all group h-full">
            <h5 className="flex items-center gap-2.5 text-blue-400 font-bold text-sm mb-4 tracking-tight">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Search size={16} />
                </div>
                AI Summary & Consistency Check
            </h5>
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                <p className="text-[var(--body)] text-[13px] leading-relaxed m-0 font-medium">{summary}</p>
            </div>
            {positiveSignals && positiveSignals.length > 0 && (
                <div className="flex flex-col gap-2 border-t border-[var(--hairline)] pt-4 mt-2">
                    <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                        <CheckSquare size={12}/> Positive Signals
                    </h6>
                    {positiveSignals.map((sig, i) => (
                        <div key={sig || i} className="text-[11px] text-[var(--body)] flex items-start gap-2">
                            <span className="text-emerald-500">✓</span> {sig}
                        </div>
                    ))}
                </div>
            )}
        </m.div>
    );
}
