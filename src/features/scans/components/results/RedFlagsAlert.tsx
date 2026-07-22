/**
 * ------------------------------------------------------------
 * Component: RedFlagsAlert
 * 
 * Purpose:
 * Highlights detected scam indicators and warnings.
 * 
 * Responsibilities:
 * • Map and render a list of critical red flags
 * • Display safe fallback if no flags are present
 * 
 * Used By:
 * • Desktop & Mobile Results Components
 * ------------------------------------------------------------
 */

import { m } from 'motion/react';
import { AlertTriangle, Users } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/core/ui/Alert";
import { slideUp, staggerContainer } from '@/core/motion';

export function RedFlagsAlert({ redFlags, communityReports }: { redFlags?: string[]; communityReports?: number }) {
    const hasFlags = (redFlags && redFlags.length > 0) || (communityReports && communityReports > 0);
    const totalCount = (redFlags?.length || 0) + (communityReports && communityReports > 0 ? 1 : 0);

    return (
        <m.div variants={slideUp} className="h-full">
            <Alert variant="destructive" className="bg-red-500/5 border-red-500/10 rounded-3xl p-5 shadow-lg hover-lift transition group h-full hover:shadow-[0_8px_30px_rgba(239,68,68,0.2)] hover:border-red-500/30 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-7 h-7 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 group-hover:scale-110 transition-transform duration-300">
                            <AlertTriangle size={14} />
                        </div>
                        {hasFlags && (
                            <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">
                                {totalCount} Risk{totalCount > 1 ? 's' : ''} Detected
                            </span>
                        )}
                    </div>
                    <AlertTitle className="text-red-400 font-bold text-xs tracking-tight">
                        Detected Red Flags ({totalCount})
                    </AlertTitle>
                    <AlertDescription className="mt-2">
                        {hasFlags ? (
                            <m.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col gap-2.5">
                                {communityReports && communityReports > 0 ? (
                                    <m.div
                                        variants={slideUp}
                                        className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold leading-relaxed flex items-center gap-2.5 hover:scale-[1.01] transition-transform origin-left"
                                    >
                                        <Users size={14} className="text-amber-400 flex-shrink-0" />
                                        <div>Flagged as a scam by {communityReports} community member{communityReports > 1 ? 's' : ''}</div>
                                    </m.div>
                                ) : null}
                                {redFlags?.map((flag, i) => (
                                    <m.div
                                        key={flag || i}
                                        variants={slideUp}
                                        className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 text-xs leading-relaxed flex items-start gap-2.5 hover:scale-[1.01] transition-transform origin-left"
                                    >
                                        <span className="status-dot red mt-1.5 flex-shrink-0"></span>
                                        <div className="font-medium">{flag}</div>
                                    </m.div>
                                ))}
                            </m.div>
                        ) : (
                            <div className="text-xs text-[var(--muted)] italic p-2">No critical red flags identified.</div>
                        )}
                    </AlertDescription>
                </div>
            </Alert>
        </m.div>
    );
}
