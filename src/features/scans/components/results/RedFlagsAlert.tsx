import { m } from 'motion/react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/core/ui/Alert";
import { slideUp } from '@/core/motion';

export function RedFlagsAlert({ redFlags }: { redFlags?: string[] }) {
    return (
        <m.div variants={slideUp}>
            <Alert variant="destructive" className="bg-red-500/5 border-red-500/10 rounded-3xl p-6 shadow-lg hover-lift transition-all group h-full">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-4 text-red-400">
                    <AlertTriangle size={16} />
                </div>
                <AlertTitle className="text-red-400 font-bold text-sm tracking-tight">
                    Detected Red Flags ({redFlags?.length || 0})
                </AlertTitle>
                <AlertDescription className="flex flex-col gap-2.5 mt-2">
                    {redFlags && redFlags.length > 0 ? redFlags.map((flag, i) => (
                        <div key={flag || i} className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 text-xs leading-relaxed flex items-start gap-2.5">
                            <span className="status-dot red mt-1.5"></span><div className="font-medium">{flag}</div>
                        </div>
                    )) : <div className="text-xs text-[var(--muted)] italic p-2">No critical red flags identified.</div>}
                </AlertDescription>
            </Alert>
        </m.div>
    );
}
