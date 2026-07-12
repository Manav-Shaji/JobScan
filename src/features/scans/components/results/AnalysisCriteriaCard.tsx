import { m } from 'motion/react';
import { Briefcase } from 'lucide-react';
import { slideUp } from '@/core/motion';

interface BreakdownItem {
    label: string;
    value: number;
}

export function AnalysisCriteriaCard({ breakdown, revealStats }: { breakdown: BreakdownItem[], revealStats: boolean }) {
    return (
        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2">
                <Briefcase size={14} className="text-emerald-400"/> Analysis Criteria
            </h4>
            <div className="flex flex-col gap-3">
                {(breakdown || []).map((item, i) => (
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
    );
}
