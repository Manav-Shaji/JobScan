import { m } from 'motion/react';
import { Fingerprint } from 'lucide-react';
import { slideUp } from '@/core/motion';

interface PatternMatchProps {
    patternName?: string;
    patternConfidence?: number;
}

export function PatternMatchCard({ patternName, patternConfidence }: PatternMatchProps) {
    return (
        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-br from-[rgba(var(--primary-rgb),0.02)] to-[rgba(var(--surface-elevated-rgb),1)]">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2">
                <Fingerprint size={14} className="text-purple-400"/> Scam Pattern Match
            </h4>
            <div className="flex flex-col items-center justify-center h-full pb-4">
                <div className={`px-4 py-2 rounded-xl border text-sm font-black text-center mb-3 ${patternName && patternName !== 'Unknown Pattern' && patternName !== 'None' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                    {patternName && patternName !== 'None' ? patternName : 'None Detected'}
                </div>
                {patternConfidence != null && (
                    <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">
                        Confidence: <span className="text-[var(--on-dark)]">{patternConfidence}%</span>
                    </div>
                )}
            </div>
        </m.div>
    );
}
