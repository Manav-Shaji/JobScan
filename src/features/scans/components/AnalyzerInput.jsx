'use client';

import { useRef, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/navigation";
import { Textarea } from "@/core/ui/forms";
import { 
    FileText, 
    ImageIcon, 
    Clipboard, 
    Trash2, 
    UploadCloud, 
    X,
    AlertCircle
} from 'lucide-react';
import { m } from 'motion/react';

export function AnalyzerInput({
    jobText,
    setJobText,
    posterFile,
    setPosterFile,
    posterPreview,
    setPosterPreview,
    activeTab,
    setActiveTab,
    inputError,
    handlePaste
}) {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (file) => {
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            return;
        }
        setPosterFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            setPosterPreview(e.target.result);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(20);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl p-1 h-auto">
                    <TabsTrigger value="text" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-blue-500 data-[state=active]:text-white transition flex items-center gap-2"><FileText size={14}/> Text Analysis</TabsTrigger>
                    <TabsTrigger value="image" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-purple-500 data-[state=active]:text-white transition flex items-center gap-2"><ImageIcon size={14}/> Poster Upload</TabsTrigger>
                </TabsList>
            
            <TabsContent value="text" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* SECTION 1: Text Input */}
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
            </TabsContent>

            <TabsContent value="image" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* SECTION 2: Image Upload */}
            <div className="glass-card premium-card-edge rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden group flex flex-col">
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-500/8 transition-colors duration-1000"></div>
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <div className="flex items-center gap-2 text-[var(--on-dark)]">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <ImageIcon className="text-purple-400" size={15} />
                        </div>
                        <span className="font-bold text-sm tracking-tight">Job Poster Upload</span>
                    </div>
                </div>

                {/* Desktop Upload Zone */}
                <div className="hidden md:flex flex-col flex-1">
                    {!posterFile ? (
                        <div 
                            className={`flex-1 relative z-10 bg-[var(--surface-elevated)] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition min-h-[220px] ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--hairline-strong)] hover:border-blue-500/50 hover:bg-[rgba(var(--primary-rgb),0.02)]'} ${inputError && activeTab === 'image' ? 'animate-shake border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                        >
                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef} 
                                accept="image/png, image/jpeg, image/jpg, image/webp" 
                                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                            />
                            <div className={`w-14 h-14 rounded-full bg-[var(--surface-card)] border flex items-center justify-center mb-4 shadow-sm transition-colors ${inputError && activeTab === 'image' ? 'border-red-500/30 text-red-400' : 'border-[var(--hairline)] text-[var(--muted)]'}`}>
                                <UploadCloud size={24} />
                            </div>
                            <h4 className={`font-bold text-[13px] mb-1 transition-colors ${inputError && activeTab === 'image' ? 'text-red-400' : 'text-[var(--on-dark)]'}`}>Drag & Drop Upload Area</h4>
                            <p className="text-[11px] text-[var(--muted)] px-4">Supported: PNG, JPG, WEBP<br/>Maximum size: 5 MB</p>
                            
                            <div className={`mt-3 text-[11px] font-bold text-red-400 transition-opacity duration-300 flex items-center gap-1 ${inputError && activeTab === 'image' ? 'opacity-100' : 'opacity-0'}`}>
                                <AlertCircle size={12} /> Please upload an image
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 relative z-10 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--hairline)] p-4 flex flex-col min-h-[220px]">
                            <div className="flex-1 rounded-xl bg-black/20 overflow-hidden mb-4 relative flex items-center justify-center border border-[var(--hairline)] p-2">
                                <img src={posterPreview} alt="Job Poster" className="max-h-36 max-w-full object-contain rounded-md shadow-sm" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="min-w-0 pr-4">
                                    <div className="text-xs font-bold text-[var(--on-dark)] truncate">{posterFile.name}</div>
                                    <div className="text-[10px] text-[var(--muted)]">{(posterFile.size / 1024 / 1024).toFixed(2)} MB</div>
                                </div>
                                <button type="button" className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" 
                                    onClick={(e) => { e.stopPropagation(); setPosterFile(null); setPosterPreview(null); }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Mobile-Only Upload Zone */}
                <div className="md:hidden flex flex-col gap-3">
                    <input 
                        type="file" 
                        className="hidden" 
                        id="mobile-file-input"
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />
                    {!posterFile ? (
                        <button
                            type="button"
                            className={`w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-[var(--surface-elevated)] border-2 border-dashed rounded-2xl text-[var(--muted)] active:scale-[0.98] transition min-h-[56px] ${
                                inputError && activeTab === 'image' ? 'animate-shake border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-400' : 'border-[var(--hairline-strong)]'
                            }`}
                            onClick={() => document.getElementById('mobile-file-input').click()}
                        >
                            <UploadCloud size={18} className={inputError && activeTab === 'image' ? 'text-red-400' : 'text-blue-400'} />
                            <span className="text-xs font-black uppercase tracking-wider">{inputError && activeTab === 'image' ? 'Upload Required' : 'Upload Job Poster'}</span>
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-2xl">
                            <img src={posterPreview} alt="Thumbnail" className="w-12 h-12 object-cover rounded-lg border border-[var(--hairline)] flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="text-xs font-bold text-[var(--on-dark)] truncate">{posterFile.name}</div>
                                <div className="text-[9px] text-[var(--muted)]">{(posterFile.size / 1024 / 1024).toFixed(2)} MB</div>
                            </div>
                            <button type="button" className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" 
                                onClick={(e) => { e.stopPropagation(); setPosterFile(null); setPosterPreview(null); }}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            </TabsContent>
            </Tabs>
        </div>
    );
}
