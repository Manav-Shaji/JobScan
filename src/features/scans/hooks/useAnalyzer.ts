import { useState, useEffect, useRef } from 'react';
import api from '@/core/lib/api-client';
import { useScanLimit } from '@/features/scans/use-scan-limit';
import { useJob } from '@/core/providers/providers';
import { useToast } from "@/core/ui/use-toast";

export const loadingMessages = [
    "Parsing Job Description",
    "OCR Processing",
    "Employer Verification",
    "AI Trust Analysis",
    "Waiting for AI response..."
];

export function useAnalyzer() {
    const { setCurrentJobContext } = useJob();
    const { toast } = useToast();
    
    const [jobText, setJobText] = useState('');
    const [posterFile, setPosterFile] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [activeTab, setActiveTab] = useState('text');
    
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [inputError, setInputError] = useState(false);
    const [activeStage, setActiveStage] = useState(0);
    const [completedStages, setCompletedStages] = useState([]);
    const [revealStats, setRevealStats] = useState(false);
    const [showBottomSheet, setShowBottomSheet] = useState(false);
    const [sheetTranslateY, setSheetTranslateY] = useState(0);
    const [isDraggingSheet, setIsDraggingSheet] = useState(false);
    
    const touchStartYRef = useRef(0);

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

    const handleSheetTouchStart = (e) => {
        const isHandlebar = e.target.closest('.drag-handlebar');
        const scrollContainer = e.currentTarget.querySelector('.overflow-y-auto');
        const isAtTop = scrollContainer ? scrollContainer.scrollTop === 0 : true;

        if (isHandlebar || isAtTop) {
            touchStartYRef.current = e.touches[0].clientY;
            setIsDraggingSheet(true);
        }
    };

    const handleSheetTouchMove = (e) => {
        if (!isDraggingSheet) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - touchStartYRef.current;
        if (deltaY > 0) {
            setSheetTranslateY(deltaY);
        }
    };

    const handleSheetTouchEnd = () => {
        if (!isDraggingSheet) return;
        setIsDraggingSheet(false);
        if (sheetTranslateY > 120) {
            setShowBottomSheet(false);
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(20);
            }
        }
        setSheetTranslateY(0);
        touchStartYRef.current = 0;
    };

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

    useEffect(() => {
        if (result) {
            const timer = setTimeout(() => setRevealStats(true), 150);
            return () => clearTimeout(timer);
        }
    }, [result]);

    const runStagedLoading = async () => {
        setCompletedStages([]);
        setActiveStage(0);
        for (let i = 0; i < loadingMessages.length; i++) {
            const stageIndex = i;
            setActiveStage(stageIndex);
            await new Promise(resolve => setTimeout(resolve, 600));
            setCompletedStages(prev => [...prev, stageIndex]);
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
        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "File Too Large", description: "Maximum file size is 5 MB.", variant: "destructive" });
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

    const handleAnalyze = async () => {
        const textToAnalyze = activeTab === 'text' ? jobText : '';
        const fileToAnalyze = activeTab === 'image' ? posterFile : null;

        if (!textToAnalyze.trim() && !fileToAnalyze) {
            setInputError(true);
            toast({
                title: "Input Required",
                description: activeTab === 'text' ? "Please paste a job description first." : "Please upload a poster image first.",
                variant: "destructive"
            });
            setTimeout(() => setInputError(false), 1000);
            return;
        }

        if (activeTab === 'text' && textToAnalyze.trim()) {
            const charCount = textToAnalyze.trim().length;
            if (charCount < 10) {
                setInputError(true);
                toast({ title: "Input Too Short", description: "Job description must be at least 10 characters long.", variant: "destructive" });
                setTimeout(() => setInputError(false), 1000);
                return;
            }
            if (charCount > 10000) {
                setInputError(true);
                toast({ title: "Input Too Long", description: "Job description exceeds the 10,000 character limit. Please shorten it.", variant: "destructive" });
                setTimeout(() => setInputError(false), 1000);
                return;
            }
        }

        if (!checkCanScan()) return;
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20);
        }

        setLoading(true);
        setResult(null);
        setRevealStats(false);

        try {
            const payload = await Promise.all([
                api.analyze(textToAnalyze, fileToAnalyze),
                runStagedLoading()
            ]).then(([res]) => res);

            const data = payload?.success !== undefined ? payload.data : payload;

            if (data?.success === false || data?.error) {
                let userFriendlyMessage = data?.error || "Analysis failed";
                console.warn('Analysis failed:', userFriendlyMessage);
                setResult({ score: 0, error: userFriendlyMessage });
                setShowBottomSheet(false);
                toast({
                    title: "Scan Interrupted",
                    description: userFriendlyMessage,
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

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

            toast({
                title: "Threat Scan Complete",
                description: `Analysis finished with a TrustScore of ${data.trustScore ?? data.trust_score ?? 0}%`,
                variant: data.verdict === 'scam' ? 'destructive' : 'default',
            });
        } catch (err) {
            console.warn('Analysis failed:', err.message);
            let userFriendlyMessage = err.message || "Unable to complete threat analysis at this moment.";
            setResult({ score: 0, error: userFriendlyMessage });
            setShowBottomSheet(false);
            toast({
                title: "Scan Interrupted",
                description: userFriendlyMessage,
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const handleReport = async () => {
        if (!result) return;
        try {
            await api.reportScam(result.id, 'Community Flagged');
            toast({ title: "Threat Database Updated", description: "Flagged in threat records to protect other applicants." });
        } catch (err) { console.error('Report failed:', err); }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJobText(text);
        } catch (err) { console.error('Failed to read clipboard', err); }
    };

    const handleClear = () => {
        setJobText('');
        setPosterFile(null);
        setPosterPreview(null);
        setResult(null);
        setRevealStats(false);
        setShowBottomSheet(false);
    };

    const getAnalyzeButtonText = () => {
        if (loading) return "ANALYZING...";
        if (activeTab === 'image') return "ANALYZE POSTER";
        return "ANALYZE TEXT";
    };

    return {
        state: {
            jobText,
            posterFile,
            posterPreview,
            activeTab,
            loading,
            result,
            inputError,
            activeStage,
            completedStages,
            revealStats,
            showBottomSheet,
            sheetTranslateY,
            isDraggingSheet,
        },
        setters: {
            setJobText,
            setPosterFile,
            setPosterPreview,
            setActiveTab,
            setShowBottomSheet
        },
        handlers: {
            handleSheetTouchStart,
            handleSheetTouchMove,
            handleSheetTouchEnd,
            handleFileSelect,
            handleAnalyze,
            handleReport,
            handlePaste,
            handleClear,
            getAnalyzeButtonText
        },
        scanLimit: {
            scanCount,
            remainingScans,
            showSignupWall,
            dismissSignupWall,
            FREE_SCAN_LIMIT,
            isLoggedIn,
        }
    };
}
