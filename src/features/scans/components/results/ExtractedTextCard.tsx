import { m } from 'motion/react';
import { FileSearch } from 'lucide-react';
import { slideUp } from '@/core/motion';

export function ExtractedTextCard({ extractedText }: { extractedText?: string }) {
    if (!extractedText) return null;
    
    return (
        <m.div variants={slideUp} className="glass-card premium-card-edge rounded-3xl p-4 shadow-xl relative overflow-hidden transition duration-300 hover:shadow-2xl hover:border-blue-500/30 group hover-lift">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2 group-hover:text-blue-400 transition-colors duration-300">
                <FileSearch size={12} className="text-blue-400 group-hover:scale-110 transition-transform duration-300"/> Extracted Information (OCR)
            </h4>
            <div className="p-3 rounded-xl bg-[var(--surface-elevated)] border border-[var(--hairline)] max-h-24 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] text-[var(--body)] font-mono leading-relaxed whitespace-pre-wrap">{extractedText}</p>
            </div>
        </m.div>
    );
}
