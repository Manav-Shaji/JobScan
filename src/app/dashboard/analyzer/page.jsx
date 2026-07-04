'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
const TrustScore = dynamic(() => import('@/frontend/features/landing/features').then(mod => mod.TrustScore));
const SignupWall = dynamic(() => import('@/frontend/features/landing/features').then(mod => mod.SignupWall));
import api from '@/frontend/utils/api-client';
import { useScanLimit } from '@/frontend/hooks/use-scan-limit';
import { useJob } from '@/frontend/providers/job-provider';
import { useToast } from "@/frontend/hooks/use-toast";
import { Toaster } from "@/frontend/ui/feedback/toasts";
import {
    ShieldCheck,
    Cpu,
    FileText,
    AlertTriangle,
    Flag,
    Users,
    Lock,
    Unlock,
    CheckCircle,
    Clipboard,
    Trash2,
    Search,
    Fingerprint,
    Terminal,
    Sparkles,
    Briefcase,
    RefreshCw,
    UploadCloud,
    X,
    ImageIcon,
    CheckSquare,
    FileSearch
} from 'lucide-react';
import { Textarea } from "@/frontend/ui/forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/ui/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/frontend/ui/feedback/Alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/frontend/ui/layout";

export default function Analyzer() {
    const { setCurrentJobContext } = useJob();
    const { toast } = useToast();
    const [jobText, setJobText] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('text');
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [inputError, setInputError] = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [completedStages, setCompletedStages] = useState([]);
    const [revealStats, setRevealStats] = useState(false);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [viewFullReport, setViewFullReport] = useState(false);
    const [sheetTranslateY, setSheetTranslateY] = useState(0);
    const touchStartYRef = useRef(0);
    const isDraggingSheetRef = useRef(false);

    const fileInputRef = useRef(null);

    const handleSheetTouchStart = (e) => {
        const isHandlebar = e.target.closest('.drag-handlebar');
        const scrollContainer = e.currentTarget.querySelector('.overflow-y-auto');
        const isAtTop = scrollContainer ? scrollContainer.scrollTop === 0 : true;

        if (isHandlebar || isAtTop) {
            touchStartYRef.current = e.touches[0].clientY;
            isDraggingSheetRef.current = true;
        }
    };

    const handleSheetTouchMove = (e) => {
        if (!isDraggingSheetRef.current) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - touchStartYRef.current;
        if (deltaY > 0) {
            setSheetTranslateY(deltaY);
        }
    };

    const handleSheetTouchEnd = () => {
        if (!isDraggingSheetRef.current) return;
        isDraggingSheetRef.current = false;
        if (sheetTranslateY > 120) {
            setShowBottomSheet(false);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(20);
            }
        }
        setSheetTranslateY(0);
        touchStartYRef.current = 0;
    };

    // Body scroll lock on mobile bottom sheet trigger
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        
        const updateScrollLock = () => {
            if (result && !result.error && showBottomSheet && mediaQuery.matches) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        updateScrollLock();
        mediaQuery.addEventListener('change', updateScrollLock);
        
        return () => {
            document.body.style.overflow = '';
            mediaQuery.removeEventListener('change', updateScrollLock);
        };
    }, [result, showBottomSheet]);

    const {
        scanCount,
        remainingScans,
        showSignupWall,
        incrementScan,
        checkCanScan,
        dismissSignupWall,
        FREE_SCAN_LIMIT,
        isLoggedIn,
    } = useScanLimit();

    const loadingMessages = [
        "Initializing multimodal AI engine...",
        "Running OCR extraction and pattern matching...",
        "Evaluating credibility and consistency...",
        "Analyzing security and scam indicators...",
        "Generating final trust assessment..."
    ];

    useEffect(() => {
        if (result) {
            const timer = setTimeout(() => setRevealStats(true), 150);
            return () => clearTimeout(timer);
        } else {
            setRevealStats(false);
        }
    }, [result]);

    const runStagedLoading = async () => {
        setCompletedStages([]);
        setActiveStage(0);
        for (let i = 0; i < loadingMessages.length; i++) {
            setActiveStage(i);
            await new Promise(resolve => setTimeout(resolve, 600));
            setCompletedStages(prev => [...prev, i]);
        }
        setActiveStage(loadingMessages.length);
    };

    const handleFileSelect = (file) => {
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            toast({ title: "Invalid File", description: "Only JPG, PNG, and WEBP are supported.", variant: "destructive" });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast({ title: "File Too Large", description: "Maximum file size is 10 MB.", variant: "destructive" });
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

    const handleAnalyze = useCallback(async () => {
        const textToAnalyze = activeTab === 'text' ? jobText : '';
        const fileToAnalyze = activeTab === 'image' ? posterFile : null;

        if (!textToAnalyze.trim() && !fileToAnalyze) {
            setInputError(true);
            setTimeout(() => setInputError(false), 1000);
            return;
        }

        if (!checkCanScan()) return;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20);
        }

        setLoading(true);
        setResult(null);

        try {
            const [payload] = await Promise.all([
                api.analyze(textToAnalyze, fileToAnalyze),
                runStagedLoading()
            ]);

            const data = payload?.success ? payload.data : payload;

            incrementScan();
            setCurrentJobContext(jobText || (data.posterText ? data.posterText : "Multimodal scan"));

            const apiBreakdown = data?.breakdown || {};
            const uiBreakdown = [
                { label: 'Linguistic Patterns', value: apiBreakdown.linguistic || 0 },
                { label: 'Employer Legitimacy', value: apiBreakdown.employer || 0 },
                { label: 'Contact Authenticity', value: apiBreakdown.contact || 0 },
                { label: 'Salary Realism', value: apiBreakdown.salary || 0 },
                { label: 'Temporal Patterns', value: apiBreakdown.temporal || 0 }
            ];

            setResult({
                id: data.id,
                score: data.trustScore ?? data.trust_score ?? 0,
                breakdown: uiBreakdown,
                redFlags: data.redFlags || [],
                positiveSignals: data.posterAnalysis?.positiveSignals || [],
                verdict: data.verdict,
                communityReports: data.communityReports || 0,
                summary: data.posterAnalysis?.summary || data.summary || data.investigationNotes,
                extractedText: data.posterText,
                patternName: data.patternName,
                patternConfidence: data.patternConfidence,
                posterCredibilityScore: data.posterCredibilityScore,
                scanType: data.scanType || (fileToAnalyze && textToAnalyze ? 'Combined' : fileToAnalyze ? 'Poster' : 'Text'),
                fallbackUsed: data.fallbackUsed || false,
            });
            setShowBottomSheet(true);
            setViewFullReport(false);

            toast({
                title: "Threat Scan Complete",
                description: `Analysis finished with a TrustScore of ${data.trustScore ?? data.trust_score ?? 0}%`,
                variant: data.verdict === 'scam' ? 'destructive' : 'default',
            });
        } catch (err) {
            console.error('Analysis failed:', err);
            let userFriendlyMessage = "Unable to complete threat analysis at this moment.";
            setResult({ score: 0, error: userFriendlyMessage });
            setShowBottomSheet(false);
            setViewFullReport(false);
            toast({
                title: "Scan Interrupted",
                description: userFriendlyMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [activeTab, jobText, posterFile, checkCanScan, incrementScan, setCurrentJobContext, toast]);

    const handleReport = useCallback(async () => {
        if (!result) return;
        try {
            await api.reportScam(result.id, 'Community Flagged');
            toast({ title: "Threat Database Updated", description: "Flagged in threat records to protect other applicants." });
        } catch (err) { console.error('Report failed:', err); }
    }, [result, toast]);

    const handlePaste = useCallback(async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJobText(text);
        } catch (err) { console.error('Failed to read clipboard', err); }
    }, []);

    const handleClear = useCallback(() => {
        setJobText('');
        setPosterFile(null);
        setPosterPreview(null);
        setResult(null);
        setShowBottomSheet(false);
        setViewFullReport(false);
    }, []);

    const getAnalyzeButtonText = () => {
        if (loading) return "ANALYZING...";
        if (activeTab === 'image') return "ANALYZE POSTER";
        return "ANALYZE TEXT";
    };

    return (
        <div className="fade-in max-w-[1200px] mx-auto px-1 md:px-4 pt-0 pb-2">
            <Toaster />
            
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
                        <h1 className="text-2xl font-black text-[var(--on-dark)] m-0 tracking-tight flex items-center gap-2">
                            Job Threat Analyzer
                        </h1>
                    </div>
                    <p className="text-[var(--muted)] text-sm ml-4 mb-0">Cross-reference patterns instantly with advanced multimodal AI.</p>
                </div>
            </div>

            {/* --- Premium Quota Tracker --- */}
            <div className="mb-6 p-3.5 rounded-2xl border bg-[rgba(var(--cta-rgb),0.04)] border-blue-500/10 flex items-center justify-between flex-wrap gap-4 shadow-sm">
                <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        !isLoggedIn 
                            ? (remainingScans <= 1 ? 'bg-red-500/10 text-red-400 border-red-500/25' : 'bg-blue-500/10 text-blue-400 border-blue-500/25') 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    }`}>
                        {!isLoggedIn ? (remainingScans === 0 ? <Lock size={18} /> : <Unlock size={18} />) : <ShieldCheck size={18} />}
                    </div>
                    <div>
                        <div className="font-bold text-[var(--on-dark)] text-xs flex items-center gap-1.5">
                            {!isLoggedIn 
                                ? (remainingScans === 0 ? 'Demo Scans Exhausted' : `${remainingScans} of ${FREE_SCAN_LIMIT} Free Demo Scans Available`) 
                                : 'Candidate Guard Active'}
                            {isLoggedIn && <span className="status-dot green"></span>}
                        </div>
                        <div className="text-[10px] text-[var(--muted)] mt-0.5">
                            {!isLoggedIn ? (remainingScans === 0 ? 'Create a free account to unlock unlimited access' : 'Sign up to unlock persistent history & the AI Chat assistant') : 'Real-time AI threat detection is active across all searches'}
                        </div>
                    </div>
                </div>
                {!isLoggedIn ? (
                    <div className="flex items-center gap-2">
                        {[...Array(FREE_SCAN_LIMIT)].map((_, i) => (
                            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                i < scanCount ? (remainingScans <= 1 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]') : 'bg-[var(--hairline)]'
                            }`}></div>
                        ))}
                    </div>
                ) : (
                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1 shadow-sm">SECURE SCANNER</div>
                )}
            </div>

            {/* --- Main Workspace (Input Area) --- */}
            <div className="mb-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl p-1 h-auto">
                        <TabsTrigger value="text" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-all flex items-center gap-2"><FileText size={14}/> Text Analysis</TabsTrigger>
                        <TabsTrigger value="image" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-all flex items-center gap-2"><ImageIcon size={14}/> Poster Upload</TabsTrigger>
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
                            <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-blue-400 transition-all text-[11px] font-bold uppercase tracking-wider border border-[var(--hairline)]" onClick={handlePaste} title="Paste from Clipboard">
                                <Clipboard size={12} /> Paste
                            </button>
                            <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--surface-elevated)] text-[var(--muted)] hover:text-red-400 transition-all text-[11px] font-bold uppercase tracking-wider border border-[var(--hairline)]" onClick={() => setJobText('')} title="Clear Text">
                                <Trash2 size={12} /> Clear
                            </button>
                        </div>
                    </div>
                    <Textarea
                        className={`w-full flex-1 relative z-10 bg-[var(--surface-elevated)] text-[var(--on-dark)] placeholder-[var(--muted)] rounded-2xl p-4 text-sm leading-relaxed border focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/20 transition-all resize-none h-[180px] md:h-auto md:min-h-[220px] shadow-inner ${inputError && !jobText && !posterFile ? 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'border-[var(--hairline)]'}`}
                        placeholder="Paste job description here..."
                        value={jobText}
                        onChange={(e) => setJobText(e.target.value)}
                    />
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

                    {/* Desktop Upload Zone (Unchanged) */}
                    <div className="hidden md:flex flex-col flex-1">
                        {!posterFile ? (
                            <div 
                                className={`flex-1 relative z-10 bg-[var(--surface-elevated)] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all min-h-[220px] ${isDragging ? 'border-blue-500 bg-blue-500/5' : 'border-[var(--hairline-strong)] hover:border-blue-500/50 hover:bg-[rgba(var(--primary-rgb),0.02)]'} ${inputError && !jobText && !posterFile ? 'border-red-500/40 bg-red-500/5' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    ref={fileInputRef} 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    onChange={(e) => handleFileSelect(e.target.files?.[0])}
                                />
                                <div className="w-14 h-14 rounded-full bg-[var(--surface-card)] border border-[var(--hairline)] flex items-center justify-center mb-4 shadow-sm text-[var(--muted)]">
                                    <UploadCloud size={24} />
                                </div>
                                <h4 className="font-bold text-[13px] text-[var(--on-dark)] mb-1">Drag & Drop Upload Area</h4>
                                <p className="text-[11px] text-[var(--muted)] px-4">Supported: PNG, JPG, WEBP<br/>Maximum size: 10 MB</p>
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

                    {/* Mobile-Only Upload Zone (Compact) */}
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
                                className={`w-full flex items-center justify-center gap-2.5 py-4 px-4 bg-[var(--surface-elevated)] border-2 border-dashed rounded-2xl text-[var(--muted)] active:scale-[0.98] transition-all min-h-[56px] ${
                                    inputError && !jobText && !posterFile ? 'border-red-500/40 bg-red-500/5' : 'border-[var(--hairline-strong)]'
                                }`}
                                onClick={() => document.getElementById('mobile-file-input').click()}
                            >
                                <UploadCloud size={18} className="text-blue-400" />
                                <span className="text-xs font-black uppercase tracking-wider">Upload Job Poster</span>
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

            {/* SECTION 3: Analyze Button (Desktop Only) */}
            <div className="mb-8 hidden md:block">
                <button type="button" className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white py-4 rounded-2xl font-black text-sm tracking-widest shadow-[0_4px_20px_rgba(59,130,246,0.15)] hover:shadow-[0_4px_25px_rgba(59,130,246,0.25)] hover:scale-[1.002] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {loading ? <><Cpu className="animate-spin" size={18} /> {getAnalyzeButtonText()}</> : <><ShieldCheck size={18} /> {getAnalyzeButtonText()}</>}
                    </span>
                </button>
            </div>

            {/* --- Loading State --- */}
            {loading && (
                <div className="glass-card premium-card-edge rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden border border-blue-500/20 soft-glow fade-slide-up-in mb-6">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mx-auto mb-4 shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                            <Fingerprint size={32} className="animate-pulse text-blue-400" />
                        </div>
                        <h3 className="text-lg font-black text-[var(--on-dark)] mb-1 tracking-tight flex items-center justify-center gap-2">
                            <Terminal size={16} className="text-blue-500" /> Analysis Active
                        </h3>
                    </div>
                    <div className="max-w-md mx-auto space-y-3 mb-8">
                        {loadingMessages.map((msg, i) => {
                            const isCompleted = completedStages.includes(i);
                            const isActive = activeStage === i;
                            return (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${isActive ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.1)] scale-[1.01]' : isCompleted ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400/90' : 'bg-[rgba(var(--primary-rgb),0.03)] border-[var(--hairline)] text-[var(--muted)] opacity-40'}`}>
                                    <div className="flex items-center gap-3">
                                        {isCompleted ? <CheckCircle size={15} className="text-emerald-500" /> : isActive ? <Cpu size={15} className="animate-spin text-blue-400" /> : <Lock size={15} className="text-[var(--muted)]" />}
                                        <span className="text-xs font-semibold">{msg}</span>
                                    </div>
                                    <div>
                                        {isCompleted ? <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-emerald-400">PASSED</span> : isActive ? <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span> : <span className="text-[9px] uppercase font-bold tracking-wider opacity-60">PENDING</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="w-56 h-1.5 bg-[var(--hairline)] rounded-full mx-auto overflow-hidden border border-[var(--hairline-strong)]">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 rounded-full transition-all duration-300 ease-out" style={{ width: `${Math.min(100, ((activeStage) / loadingMessages.length) * 100)}%` }}></div>
                    </div>
                </div>
            )}

            {/* --- Results View --- */}
            {result && !result.error && !loading && (
                <div className="hidden md:block fade-in space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-center gap-4 p-4 bg-[rgba(var(--primary-rgb),0.03)] rounded-2xl border border-[var(--hairline)]">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                            <div>
                                <h2 className="text-xl font-black text-[var(--on-dark)] m-0 tracking-tight flex items-center gap-2">Trust Assessment</h2>
                                <p className="text-[var(--muted)] text-xs m-0 mt-1">Scan Type: <strong className="text-[var(--on-dark)] uppercase">{result.scanType}</strong></p>
                            </div>
                        </div>
                        <button type="button" className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-xs uppercase tracking-wider hover:bg-red-500/15 hover:scale-105 transition-all shadow-sm w-full md:w-auto" onClick={handleReport}>
                            <Flag size={13} /> Flag Scam
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* 1. Trust Assessment Score Card */}
                        <div className="lg:col-span-4 flex flex-col">
                            <div className="glass-card premium-card-edge rounded-3xl p-6 shadow-xl flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 relative z-10 w-full text-center">OVERALL TRUST SCORE</h4>
                                <div className="relative z-10 flex-1 flex items-center justify-center w-full">
                                    <TrustScore score={result.score} visible={true} />
                                </div>
                            </div>
                        </div>

                        {/* Analysis Grid & Extracted Text */}
                        <div className="lg:col-span-8 flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* 3. Poster Analysis or Breakdown */}
                                <div className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2"><Briefcase size={14} className="text-emerald-400"/> Analysis Criteria</h4>
                                    <div className="flex flex-col gap-3">
                                        {(result.breakdown || []).map((item, i) => (
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
                                </div>

                                {/* 4. Scam Pattern Match */}
                                <div className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden bg-gradient-to-br from-[rgba(var(--primary-rgb),0.02)] to-[rgba(var(--surface-elevated-rgb),1)]">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-4 flex items-center gap-2"><Fingerprint size={14} className="text-purple-400"/> Scam Pattern Match</h4>
                                    <div className="flex flex-col items-center justify-center h-full pb-4">
                                        <div className={`px-4 py-2 rounded-xl border text-sm font-black text-center mb-3 ${result.patternName !== 'Unknown Pattern' && result.patternName !== 'None' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                            {result.patternName}
                                        </div>
                                        <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-widest">
                                            Confidence: <span className="text-[var(--on-dark)]">{result.patternConfidence}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Extracted Information & Consistency Check */}
                            {result.extractedText && (
                                <div className="glass-card premium-card-edge rounded-3xl p-5 shadow-xl relative overflow-hidden">
                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--muted)] mb-3 flex items-center gap-2"><FileSearch size={14} className="text-blue-400"/> Extracted Information (OCR)</h4>
                                    <div className="p-4 rounded-xl bg-[var(--surface-elevated)] border border-[var(--hairline)] max-h-32 overflow-y-auto custom-scrollbar">
                                        <p className="text-[11px] text-[var(--body)] font-mono leading-relaxed whitespace-pre-wrap">{result.extractedText}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 5. Detected Red Flags */}
                        <Alert variant="destructive" className="bg-red-500/5 border-red-500/10 rounded-3xl p-6 shadow-lg hover-lift transition-all group">
                            <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-4 text-red-400"><AlertTriangle size={16} /></div>
                            <AlertTitle className="text-red-400 font-bold text-sm tracking-tight">
                                Detected Red Flags ({result.redFlags?.length || 0})
                            </AlertTitle>
                            <AlertDescription className="flex flex-col gap-2.5 mt-2">
                                {result.redFlags?.length > 0 ? result.redFlags.map((flag, i) => (
                                    <div key={flag || i} className="px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-200 text-xs leading-relaxed flex items-start gap-2.5">
                                        <span className="status-dot red mt-1.5"></span><div className="font-medium">{flag}</div>
                                    </div>
                                )) : <div className="text-xs text-[var(--muted)] italic p-2">No critical red flags identified.</div>}
                            </AlertDescription>
                        </Alert>

                        {/* 7. AI Summary */}
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-6 shadow-lg hover-lift transition-all group h-full">
                            <h5 className="flex items-center gap-2.5 text-blue-400 font-bold text-sm mb-4 tracking-tight">
                                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20"><Search size={16} /></div>
                                AI Summary & Consistency Check
                            </h5>
                            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4">
                                <p className="text-[var(--body)] text-[13px] leading-relaxed m-0 font-medium">{result.summary}</p>
                            </div>
                            {result.positiveSignals?.length > 0 && (
                                <div className="flex flex-col gap-2 border-t border-[var(--hairline)] pt-4 mt-2">
                                    <h6 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><CheckSquare size={12}/> Positive Signals</h6>
                                    {result.positiveSignals.map((sig, i) => (
                                        <div key={sig || i} className="text-[11px] text-[var(--body)] flex items-start gap-2"><span className="text-emerald-500">✓</span> {sig}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- Mobile Bottom Sheet Results View --- */}
            {result && !result.error && !loading && showBottomSheet && (
                <div className="md:hidden">
                    <style dangerouslySetInnerHTML={{ __html: `
                        @keyframes slideUp {
                            from { transform: translateY(100%); }
                            to { transform: translateY(0); }
                        }
                        .animate-slide-up {
                            animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        .animate-fade-in {
                            animation: fadeIn 0.25s ease-out forwards;
                        }
                    ` }} />
                    {/* Backdrop Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[90] animate-fade-in"
                        onClick={() => setShowBottomSheet(false)}
                    />
                    {/* Bottom Sheet Card Container */}
                    <div 
                        className={`fixed bottom-0 left-0 right-0 z-[110] bg-[#081124] rounded-t-3xl border-t border-white/10 shadow-2xl flex flex-col max-h-[82vh] ${sheetTranslateY === 0 ? 'animate-slide-up' : ''}`}
                        onTouchStart={handleSheetTouchStart}
                        onTouchMove={handleSheetTouchMove}
                        onTouchEnd={handleSheetTouchEnd}
                        style={{ 
                            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
                            transform: sheetTranslateY > 0 ? `translateY(${sheetTranslateY}px)` : undefined,
                            transition: isDraggingSheetRef.current ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                    >
                        {/* Drag handlebar */}
                        <div 
                            className="drag-handlebar w-12 h-1 bg-white/20 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer" 
                            onClick={() => setShowBottomSheet(false)}
                        />
                        
                        {/* Scrollable sheet body */}
                        <div className="overflow-y-auto px-5 pb-4 flex-1 custom-scrollbar">
                            {/* Header */}
                            <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                                <div className="min-w-0 pr-3">
                                    <h3 className="text-sm font-black text-white m-0 tracking-tight flex items-center gap-1.5">Trust Assessment</h3>
                                    <p className="text-[9px] text-gray-400 m-0 mt-0.5">Scan Type: <strong className="text-white uppercase">{result.scanType}</strong></p>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button type="button" className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 font-bold text-[9px] uppercase tracking-wider active:scale-95 transition-all" 
                                        onClick={handleReport}
                                    >
                                        <Flag size={11} /> Flag
                                    </button>
                                    <button type="button" className="p-1 rounded-lg border border-white/10 text-gray-400 hover:text-white bg-slate-900/50 flex items-center justify-center w-7 h-7 active:scale-95 transition-all" 
                                        onClick={() => setShowBottomSheet(false)}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Trust Assessment Score Card */}
                            <div className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden mb-4 border border-white/5 bg-slate-900/40">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2.5 text-center">OVERALL TRUST SCORE</h4>
                                <div className="relative z-10 flex items-center justify-center w-full min-h-[120px]">
                                    <TrustScore score={result.score} visible={true} />
                                </div>
                            </div>

                            {/* AI Summary Card */}
                            <div className="p-4 rounded-xl border border-white/5 bg-slate-900/60 mb-4 text-xs">
                                <h5 className="flex items-center gap-1.5 text-blue-400 font-bold text-[10px] mb-2 uppercase tracking-wider">
                                    <Search size={12} /> AI Summary & Verdict
                                </h5>
                                <p className="text-gray-300 text-[11px] leading-relaxed m-0 font-medium">{result.summary}</p>
                            </div>

                            {/* Toggle Details View Accordion */}
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="details" className="border-b-0">
                                    <AccordionTrigger className="w-full py-3 px-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 text-gray-300 font-bold text-xs uppercase tracking-wider transition-colors border border-white/5 data-[state=open]:rounded-b-none outline-none">
                                        <div className="flex items-center gap-2">
                                            <Sparkles size={14} className="text-blue-400" /> View Full Breakdown
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4 animate-fade-in border border-t-0 border-white/5 bg-slate-900/40 rounded-b-xl px-4 pb-4">
                                        {/* Criteria Breakdown */}
                                        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-slate-900/40">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                                                <Briefcase size={12} className="text-emerald-400"/> Analysis Criteria
                                            </h4>
                                            <div className="flex flex-col gap-2.5">
                                                {(result.breakdown || []).map((item, i) => (
                                                    <div key={item.label || i} className="flex flex-col gap-1.5">
                                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                                            <span className="text-gray-300">{item.label}</span>
                                                            <span className={item.value < 40 ? 'text-red-400' : item.value < 75 ? 'text-amber-400' : 'text-emerald-400'}>{item.value}%</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                                                            <div className={`h-full rounded-full transition-all duration-1000 ${item.value < 40 ? 'bg-red-500' : item.value < 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${item.value}%` }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Scam Pattern Match */}
                                        <div className="glass-card rounded-2xl p-4 border border-white/5 bg-slate-900/40">
                                            <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                                                <Fingerprint size={12} className="text-purple-400"/> Scam Pattern Match
                                            </h4>
                                            <div className="flex flex-col items-center justify-center py-2">
                                                <div className={`px-3 py-1.5 rounded-lg border text-xs font-black text-center mb-2 bg-[#081124] ${result.patternName !== 'Unknown Pattern' && result.patternName !== 'None' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
                                                    {result.patternName}
                                                </div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400 tracking-widest">
                                                    Confidence: <span className="text-white">{result.patternConfidence}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Red Flags Alert */}
                                        <Alert variant="destructive" className="bg-red-500/5 border-red-500/10 rounded-2xl p-4 shadow-none">
                                            <AlertTitle className="flex items-center gap-1.5 text-red-400 font-bold text-xs mb-2.5 tracking-tight">
                                                <AlertTriangle size={12} /> Detected Red Flags ({result.redFlags?.length || 0})
                                            </AlertTitle>
                                            <AlertDescription className="flex flex-col gap-2">
                                                {result.redFlags?.length > 0 ? result.redFlags.map((flag, i) => (
                                                    <div key={flag || i} className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] leading-relaxed flex items-start gap-2 font-medium">
                                                        <span className="status-dot red mt-1.5"></span><div className="font-medium">{flag}</div>
                                                    </div>
                                                )) : <div className="text-[10px] text-gray-400 italic">No critical red flags identified.</div>}
                                            </AlertDescription>
                                        </Alert>

                                        {/* Extracted Information OCR */}
                                        {result.extractedText && (
                                            <div className="glass-card rounded-2xl p-4 border border-white/5 bg-slate-900/40">
                                                <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
                                                    <FileSearch size={12} className="text-blue-400"/> Extracted OCR Info
                                                </h4>
                                                <div className="p-3 rounded-lg bg-[#081124] border border-white/5 max-h-28 overflow-y-auto custom-scrollbar">
                                                    <p className="text-[10px] text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">{result.extractedText}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Positive Signals */}
                                        {result.positiveSignals?.length > 0 && (
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4">
                                                <h5 className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs mb-2.5 tracking-tight">
                                                    <CheckSquare size={12} /> Positive Signals
                                                </h5>
                                                <div className="flex flex-col gap-1.5">
                                                    {result.positiveSignals.map((sig, i) => (
                                                        <div key={sig || i} className="text-[10px] text-gray-300 flex items-start gap-2"><span className="text-emerald-500 font-bold">✓</span> <span className="pt-0.5">{sig}</span></div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Mobile Floating Restore Action Button --- */}
            {result && !result.error && !loading && !showBottomSheet && (
                <div 
                    className="md:hidden fixed left-4 right-4 z-40"
                    style={{ bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))' }}
                >
                    <button type="button" className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-lg border border-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                        onClick={() => setShowBottomSheet(true)}
                    >
                        <ShieldCheck size={14} /> View Latest Result ({result.score}%)
                    </button>
                </div>
            )}

            {/* --- Empty State --- */}
            {!result && !loading && (
                <div className="p-8 md:p-12 text-center rounded-3xl border border-dashed border-[var(--hairline-strong)] bg-[rgba(var(--primary-rgb),0.02)] flex flex-col items-center justify-center shadow-inner">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500/50 mb-4"><Briefcase size={24} /></div>
                    <h4 className="font-bold text-sm mb-1 text-[var(--on-dark)] tracking-tight">Ready for Verification</h4>
                    <p className="text-xs text-[var(--muted)] max-w-md leading-relaxed mb-4">
                        Upload a job poster and paste the description to perform a comprehensive multimodal consistency check.
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-blue-500/50 font-bold tracking-widest uppercase"><span className="status-dot blue"></span> Multimodal Engine Active</div>
                </div>
            )}

            {showSignupWall && <SignupWall onClose={dismissSignupWall} />}

            {/* Sticky Pinned Mobile Analyze Button Bar */}
            <div 
                className="md:hidden fixed left-0 right-0 z-40 bg-[var(--canvas)]/80 backdrop-blur-md border-t border-[var(--hairline)] p-3.5 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
                style={{ bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}
            >
                <button type="button" className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 active:scale-[0.98] text-white py-3.5 rounded-xl font-black text-xs tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleAnalyze}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Cpu className="animate-spin" size={14} />
                            {getAnalyzeButtonText()}
                        </>
                    ) : (
                        <>
                            <ShieldCheck size={14} />
                            {getAnalyzeButtonText()}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
