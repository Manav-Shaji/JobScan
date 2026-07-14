/**
 * ------------------------------------------------------------
 * Component: ImageUploadTab
 * 
 * Purpose:
 * Renders the drag-and-drop image upload interface for job scans.
 * 
 * Responsibilities:
 * • Handle file selection and drag-and-drop events
 * • Display image previews and file metadata
 * • Surface validation errors for missing or invalid images
 * 
 * Used By:
 * • AnalyzerInput Component
 * ------------------------------------------------------------
 */

import { ImageIcon, UploadCloud, X, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export function ImageUploadTab({ posterFile, setPosterFile, posterPreview, setPosterPreview, activeTab, inputError }) {
    const handleFileSelect = (file) => {
        if (!file) return;
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
            'image/webp': []
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles[0]) {
                handleFileSelect(acceptedFiles[0]);
            }
        }
    });

    return (
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
                        {...getRootProps()}
                        className={`flex-1 relative z-10 bg-[var(--surface-elevated)] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition min-h-[220px] ${isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--hairline-strong)] hover:border-blue-500/50 hover:bg-[rgba(var(--primary-rgb),0.02)]'} ${inputError && activeTab === 'image' ? 'animate-shake border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className={`w-14 h-14 rounded-full bg-[var(--surface-card)] border flex items-center justify-center mb-4 shadow-sm transition-colors ${inputError && activeTab === 'image' ? 'border-red-500/30 text-red-400' : 'border-[var(--hairline)] text-[var(--muted)]'}`}>
                            <UploadCloud size={24} />
                        </div>
                        <h4 className={`font-bold text-[13px] mb-1 transition-colors ${inputError && activeTab === 'image' ? 'text-red-400' : 'text-[var(--on-dark)]'}`}>Drag & Drop Upload Area</h4>
                        <p className="text-[11px] text-[var(--muted)] px-4">Supported: PNG, JPG, WEBP<br/>Maximum size: 10 MB</p>
                        
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
                {!posterFile ? (
                    <div {...getRootProps()} className="w-full">
                        <input {...getInputProps()} />
                        <button
                            type="button"
                            className={`w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-[var(--surface-elevated)] border-2 border-dashed rounded-2xl text-[var(--muted)] active:scale-[0.98] transition min-h-[56px] ${
                                inputError && activeTab === 'image' ? 'animate-shake border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)] text-red-400' : 'border-[var(--hairline-strong)]'
                            }`}
                        >
                            <UploadCloud size={18} className={inputError && activeTab === 'image' ? 'text-red-400' : 'text-blue-400'} />
                            <span className="text-xs font-black uppercase tracking-wider">{inputError && activeTab === 'image' ? 'Upload Required' : 'Upload Job Poster'}</span>
                        </button>
                    </div>
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
    );
}
