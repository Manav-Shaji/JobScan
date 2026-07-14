/**
 * ------------------------------------------------------------
 * Component: PatternMatchCard
 * 
 * Purpose:
 * Displays known scam patterns matched against the job description.
 * 
 * Responsibilities:
 * • Render pattern names and confidence levels
 * • Highlight specific scam archetypes (e.g., advance fee fraud)
 * 
 * Used By:
 * • Desktop & Mobile Results Components
 * ------------------------------------------------------------
 */

import { m } from 'motion/react';
import { Fingerprint } from 'lucide-react';
import { slideUp } from '@/core/motion';

interface PatternMatchProps {
    patternName?: string;
    patternConfidence?: number;
}

export function PatternMatchCard({ patternName, patternConfidence }: PatternMatchProps) {
    return (
        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-4 shadow-xl relative overflow-hidden bg-gradient-to-br from-[rgba(var(--primary-rgb),0.02)] to-[rgba(var(--surface-elevated-rgb),1)] transition duration-300 hover:shadow-2xl hover:border-purple-500/30 group hover-lift">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2 group-hover:text-purple-400 transition-colors duration-300">
                <Fingerprint size={12} className="text-purple-400 group-hover:scale-110 transition-transform duration-300"/> Scam Pattern Match
            </h4>
            <div className="flex flex-col items-center justify-center h-full pb-3 group-hover:scale-[1.02] transition-transform duration-300">
                <div className={`px-4 py-2 rounded-xl border text-sm font-black text-center mb-3 transition-colors duration-300 ${patternName && patternName !== 'Unknown Pattern' && patternName !== 'None' ? 'bg-red-500/10 border-red-500/20 text-red-400 group-hover:bg-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20'}`}>
                    {patternName && patternName !== 'None' ? patternName : 'None Detected'}
                </div>
                {patternConfidence != null && (
                    <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest group-hover:text-[var(--on-dark)] transition-colors duration-300">
                        Confidence: <span className="text-[var(--on-dark)] group-hover:text-purple-400 transition-colors">{patternConfidence}%</span>
                    </div>
                )}
            </div>
        </m.div>
    );
}
