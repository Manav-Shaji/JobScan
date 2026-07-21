/**
 * ------------------------------------------------------------
 * Component: AnalysisCriteriaCard
 * 
 * Purpose:
 * Displays the detailed scoring breakdown across multiple criteria.
 * 
 * Responsibilities:
 * • Render progress bars for Contact, Employer, Salary, and Linguistic trust
 * • Visually distinguish safe vs. risky sub-scores
 * 
 * Used By:
 * • Desktop Results Component
 * ------------------------------------------------------------
 */

import { m } from 'motion/react';
import { Briefcase } from 'lucide-react';
import { slideUp, staggerContainer } from '@/core/motion';

interface BreakdownItem {
    label: string;
    value: number;
}

export function AnalysisCriteriaCard({ breakdown, revealStats }: { breakdown: BreakdownItem[], revealStats: boolean }) {
    return (
        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-4 shadow-xl relative overflow-hidden transition duration-300 hover:shadow-2xl hover:border-emerald-500/30 group hover-lift">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2 group-hover:text-emerald-400 transition-colors duration-300">
                <Briefcase size={12} className="text-emerald-400 group-hover:scale-110 transition-transform duration-300"/> Analysis Criteria
            </h4>
            <m.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2">
                {(breakdown || []).map((item, i) => (
                    <m.div key={item.label || i} variants={slideUp} className="flex flex-col gap-1.5 group/item hover:scale-[1.02] transition-transform origin-left">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                            <span className="text-[var(--on-dark)] group-hover/item:text-[var(--cta)] transition-colors">{item.label}</span>
                            <span className={item.value < 40 ? 'text-red-400' : item.value < 75 ? 'text-amber-400' : 'text-emerald-400'}>{item.value}%</span>
                        </div>
                        <div className="h-1.5 bg-[var(--hairline)] rounded-full overflow-hidden shadow-inner group-hover/item:shadow-[0_0_8px_rgba(0,0,0,0.1)] transition">
                            <div className={`h-full rounded-full transition-all duration-1000 cubic-bezier(0.16,1,0.3,1) ${item.value < 40 ? 'bg-red-500 group-hover/item:shadow-[0_0_8px_rgba(239,68,68,0.5)]' : item.value < 75 ? 'bg-amber-500 group-hover/item:shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 group-hover/item:shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} style={{ width: `${revealStats ? item.value : 0}%` }}></div>
                        </div>
                    </m.div>
                ))}
            </m.div>
        </m.div>
    );
}
