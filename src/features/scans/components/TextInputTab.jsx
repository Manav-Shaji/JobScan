/**
 * ------------------------------------------------------------
 * Component: TextInputTab
 * 
 * Purpose:
 * Renders the text area interface for manual job description input.
 * 
 * Responsibilities:
 * • Handle text input and clipboard pasting
 * • Enforce character limits and display validation states
 * 
 * Used By:
 * • AnalyzerInput Component
 * ------------------------------------------------------------
 */

import { Textarea } from "@/core/ui/forms";
import { FileText, Clipboard, Trash2, AlertCircle } from 'lucide-react';

export function TextInputTab({ jobText, setJobText, inputError, activeTab, handlePaste, formatText }) {
    return (
        <div className="glass-card premium-card-edge rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/8 transition-colors duration-1000"></div>
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-2 text-[var(--on-dark)]">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <FileText className="text-blue-400" size={15} />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Job Description</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-blue-400 transition text-[11px] font-bold uppercase tracking-wider border border-[var(--hairline)]" onClick={handlePaste} title="Paste from Clipboard">
                        <Clipboard size={12} /> Paste
                    </button>
                    <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-red-400 transition text-[11px] font-bold uppercase tracking-wider border border-[var(--hairline)]" onClick={() => setJobText('')} title="Clear Text">
                        <Trash2 size={12} /> Clear
                    </button>
                </div>
            </div>
            <div 
                className={`relative flex-1 flex flex-col z-10 ${inputError && activeTab === 'text' ? 'animate-shake' : ''}`}
            >
                <Textarea
                    maxLength={10000}
                    className={`w-full flex-1 bg-[var(--surface-elevated)] text-[var(--on-dark)] placeholder-[var(--muted)] rounded-2xl p-4 text-sm leading-relaxed border focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition resize-none h-[180px] md:h-auto md:min-h-[220px] shadow-inner ${inputError && activeTab === 'text' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20' : 'border-[var(--hairline)]'}`}
                    placeholder="Paste job description here..."
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    onPaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text');
                        const formatted = formatText ? formatText(text) : text;
                        // Replace the entire value on paste for this simple textarea, 
                        // as job descriptions are usually pasted into an empty box.
                        setJobText(formatted);
                    }}
                />
                
                <div className="flex justify-between items-center mt-3 px-1">
                    <div className={`text-[11px] font-medium transition-colors duration-300 flex items-center gap-1.5 ${jobText.length > 9000 ? 'text-red-400' : jobText.length > 7000 ? 'text-amber-400' : 'text-[var(--muted)]'}`}>
                        <span>{jobText.length.toLocaleString()} / 10,000 characters</span>
                        {jobText.length > 9000 && <span className="animate-pulse">⚠️ Approaching limit</span>}
                    </div>
                    
                    <div className={`text-[11px] font-bold text-red-400 transition-opacity duration-300 flex items-center gap-1 ${inputError && activeTab === 'text' ? 'opacity-100' : 'opacity-0'}`}>
                        <AlertCircle size={12} /> Please enter a job description
                    </div>
                </div>
            </div>
        </div>
    );
}
