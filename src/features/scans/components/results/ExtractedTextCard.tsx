import { m } from 'motion/react';
import { FileSearch } from 'lucide-react';
import { slideUp } from '@/core/motion';

export function ExtractedTextCard({ extractedText }: { extractedText?: string }) {
    if (!extractedText) return null;
    
    return (
        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2">
                <FileSearch size={14} className="text-blue-400"/> Extracted Information (OCR)
            </h4>
            <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--hairline)] max-h-32 overflow-y-auto custom-scrollbar">
                <p className="text-[11px] text-[var(--body)] font-mono leading-relaxed whitespace-pre-wrap">{extractedText}</p>
            </div>
        </m.div>
    );
}
