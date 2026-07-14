/**
 * ------------------------------------------------------------
 * Component: TrustScoreCard
 * 
 * Purpose:
 * Prominently displays the overall calculated trust score.
 * 
 * Responsibilities:
 * • Render the animated TrustScore circular gauge
 * • Provide visual hierarchy for the primary metric
 * 
 * Used By:
 * • Desktop Results Component
 * ------------------------------------------------------------
 */

import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { slideUp } from '@/core/motion';

const TrustScore = dynamic(() => import('@/app/(landing)/features').then(mod => mod.TrustScore));

export function TrustScoreCard({ score }: { score: number }) {
    return (
        <m.div variants={slideUp} className="lg:col-span-4 flex flex-col">
            <div className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden transition duration-300 hover:shadow-2xl hover:border-indigo-500/30 group hover-lift">
                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-2 relative z-10 w-full text-center group-hover:text-indigo-400 transition-colors duration-300">OVERALL TRUST SCORE</h4>
                <div className="relative z-10 flex-1 flex items-center justify-center w-full group-hover:scale-105 transition-transform duration-500">
                    <TrustScore score={score} visible={true} />
                </div>
            </div>
        </m.div>
    );
}
