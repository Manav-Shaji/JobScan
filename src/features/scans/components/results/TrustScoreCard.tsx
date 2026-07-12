import { m } from 'motion/react';
import dynamic from 'next/dynamic';
import { slideUp } from '@/core/motion';

const TrustScore = dynamic(() => import('@/app/(landing)/features').then(mod => mod.TrustScore));

export function TrustScoreCard({ score }: { score: number }) {
    return (
        <m.div variants={slideUp} className="lg:col-span-4 flex flex-col">
            <div className="glass-card premium-card-edge rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 relative z-10 w-full text-center">OVERALL TRUST SCORE</h4>
                <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                    <TrustScore score={score} visible={true} />
                </div>
            </div>
        </m.div>
    );
}
