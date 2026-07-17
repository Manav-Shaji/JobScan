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

import { ImageIcon, UploadCloud, X, AlertCircle, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export function ImageUploadTab({ uploadFiles, uploadPreviews, handleFileRemove, handleFileSelect, activeTab, inputError }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/jpeg': [],
            'image/jpg': [],
            'image/png': [],
            'image/webp': [],
            'application/pdf': []
        },
        maxSize: 10 * 1024 * 1024, // 10MB
        multiple: true,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                handleFileSelect(acceptedFiles);
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
                    <span className="font-bold text-sm tracking-tight">Upload Documents & Images</span>
                </div>
            </div>

            {/* Upload Zone */}
            <div className="flex flex-col flex-1 relative z-10">
                {(!uploadFiles || uploadFiles.length === 0) ? (
                    <div 
                        {...getRootProps()}
                        className={`flex-1 bg-[var(--surface-elevated)] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition min-h-[220px] ${isDragActive ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--hairline-strong)] hover:border-blue-500/50 hover:bg-[rgba(var(--primary-rgb),0.02)]'} ${inputError && activeTab === 'image' ? 'animate-shake border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}
                    >
                        <input {...getInputProps()} />
                        <div className={`w-14 h-14 rounded-full bg-[var(--surface-card)] border flex items-center justify-center mb-4 shadow-sm transition-colors ${inputError && activeTab === 'image' ? 'border-red-500/30 text-red-400' : 'border-[var(--hairline)] text-[var(--muted)]'}`}>
                            <UploadCloud size={24} />
                        </div>
                        <h4 className={`font-bold text-[13px] mb-1 transition-colors ${inputError && activeTab === 'image' ? 'text-red-400' : 'text-[var(--on-dark)]'}`}>Drag & Drop Upload Area</h4>
                        <p className="text-[11px] text-[var(--muted)] px-4">Supported: PNG, JPG, WEBP, PDF<br/>Max 5 files, 10 MB each</p>
                        
                        <div className={`mt-3 text-[11px] font-bold text-red-400 transition-opacity duration-300 flex items-center gap-1 ${inputError && activeTab === 'image' ? 'opacity-100' : 'opacity-0'}`}>
                            <AlertCircle size={12} /> Please upload at least one file
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-[var(--surface-elevated)] rounded-2xl border border-[var(--hairline)] p-4 flex flex-col min-h-[220px]">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {uploadFiles.map((file, index) => (
                                <div key={index} className="relative bg-black/20 rounded-xl overflow-hidden border border-[var(--hairline)] group aspect-square flex flex-col">
                                    <div className="flex-1 flex items-center justify-center p-2 relative">
                                        {uploadPreviews[index] === 'pdf-icon' ? (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <FileText size={40} className="text-red-400 mb-2" />
                                                <span className="text-[10px] uppercase font-bold tracking-wider">PDF</span>
                                            </div>
                                        ) : (
                                            <img src={uploadPreviews[index]} alt={`Preview ${index}`} className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" className="w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-500 transition-colors transform hover:scale-110" 
                                                onClick={(e) => { e.stopPropagation(); handleFileRemove(index); }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-[var(--surface-card)] px-2 py-1.5 border-t border-[var(--hairline)]">
                                        <div className="text-[10px] font-bold text-[var(--on-dark)] truncate">{file.name}</div>
                                        <div className="text-[9px] text-[var(--muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                                    </div>
                                </div>
                            ))}
                            
                            {uploadFiles.length < 5 && (
                                <div 
                                    {...getRootProps()}
                                    className="border-2 border-dashed border-[var(--hairline-strong)] rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-[rgba(var(--primary-rgb),0.02)] transition"
                                >
                                    <input {...getInputProps()} />
                                    <UploadCloud size={24} className="text-[var(--muted)] mb-2" />
                                    <span className="text-[10px] text-[var(--muted)] font-bold">Add More</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
