/**
 * ------------------------------------------------------------
 * Hook: useAnalyzer
 * 
 * Purpose:
 * Core state management and orchestration hook for the job scanning process.
 * 
 * Responsibilities:
 * • Manage loading stages and analysis state
 * • Execute scan mutation via React Query
 * • Handle error toasts and resets
 * 
 * Used By:
 * • AnalyzerInput Component
 * ------------------------------------------------------------
 */

import { useState, useEffect, useRef } from 'react';
import api from '@/core/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/core/lib/query-keys';
import { useScanLimit } from '@/features/scans/use-scan-limit';
import { useJob } from '@/core/providers/providers';
import { useToast } from "@/core/ui/use-toast";
import { useAppStore } from '@/shared/useAppStore';

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
    
    const {
        jobText, setJobText,
        uploadFiles, setUploadFiles,
        uploadPreviews, setUploadPreviews,
        activeTab, setActiveTab,
        inputError, setInputError,
        activeStage, setActiveStage,
        completedStages, setCompletedStages,
        revealStats, setRevealStats,
        resetAnalyzer
    } = useAppStore();

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
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
        // Step through initial stages (0 to loadingMessages.length - 2)
        for (let i = 0; i < loadingMessages.length - 1; i++) {
            const stageIndex = i;
            setActiveStage(stageIndex);
            await new Promise(resolve => setTimeout(resolve, 500));
            setCompletedStages([...useAppStore.getState().completedStages, stageIndex]);
        }
        // Set final stage ("Waiting for AI response...") as ACTIVE while API is pending
        setActiveStage(loadingMessages.length - 1);
    };

    const handleFileSelect = (files: File[]) => {
        if (!files || files.length === 0) return;
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
        const validFiles = files.filter(f => validTypes.includes(f.type));
        
        if (validFiles.length !== files.length) {
            toast({ title: "Invalid File Type", description: "Only JPG, PNG, WEBP, and PDF are supported.", variant: "destructive" });
        }
        
        const sizeValidFiles = validFiles.filter(f => f.size <= 10 * 1024 * 1024);
        if (sizeValidFiles.length !== validFiles.length) {
            toast({ title: "File Too Large", description: "Maximum file size is 10 MB per file.", variant: "destructive" });
        }
        
        if (sizeValidFiles.length === 0) return;
        
        const newFiles = [...uploadFiles, ...sizeValidFiles].slice(0, 5); // Max 5 files
        setUploadFiles(newFiles);
        
        Promise.all(sizeValidFiles.map(file => new Promise<string>((resolve) => {
            if (file.type === 'application/pdf') {
                resolve('pdf-icon');
            } else {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.readAsDataURL(file);
            }
        }))).then(previews => {
            setUploadPreviews([...uploadPreviews, ...previews].slice(0, 5));
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
        });
    };

    const handleFileRemove = (index: number) => {
        setUploadFiles(uploadFiles.filter((_, i) => i !== index));
        setUploadPreviews(uploadPreviews.filter((_, i) => i !== index));
    };

    const queryClient = useQueryClient();

    const analyzeMutation = useMutation({
        mutationFn: async ({ textToAnalyze, filesToAnalyze }: { textToAnalyze: string, filesToAnalyze: File[] }) => {
            const stagedPromise = runStagedLoading();
            const payload = await api.analyze(textToAnalyze, filesToAnalyze);
            
            // Wait for initial animation stages to reach "Waiting for AI response..."
            await stagedPromise;
            
            // Mark final stage ("Waiting for AI response...") as PASSED only after real API response arrives
            const finalStageIndex = loadingMessages.length - 1;
            const currentStages = useAppStore.getState().completedStages;
            setCompletedStages(Array.from(new Set([...currentStages, finalStageIndex])));
            setActiveStage(loadingMessages.length);
            
            // Brief 300ms pause so the user sees all checks passed before revealing results
            await new Promise(resolve => setTimeout(resolve, 300));
            
            return payload;
        },
        onSuccess: (payload, variables: { textToAnalyze: string, filesToAnalyze: File[] }) => {
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
                return;
            }

            incrementScan();
            setCurrentJobContext(variables.textToAnalyze || (data.posterText ? data.posterText : "Multimodal scan"));

            // Invalidate dashboard queries so they refetch the newly added scan
            queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: queryKeys.scans.history });

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
                scanType: data.scanType || (variables.filesToAnalyze?.length && variables.textToAnalyze ? 'Combined' : variables.filesToAnalyze?.length ? 'Poster' : 'Text'),
                fallbackUsed: data.fallbackUsed || false,
            });
            setShowBottomSheet(true);

            toast({
                title: "Threat Scan Complete",
                description: `Analysis finished with a TrustScore of ${data.trustScore ?? data.trust_score ?? 0}%`,
                variant: data.verdict === 'scam' ? 'destructive' : 'default',
            });
        },
        onError: (err) => {
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
    });

    const reportMutation = useMutation({
        mutationFn: async (resultId) => {
            return api.reportScam(resultId, 'Community Flagged');
        },
        onSuccess: () => {
            toast({ title: "Threat Database Updated", description: "Flagged in threat records to protect other applicants." });
            // Invalidate specific report if needed, though mostly history
            queryClient.invalidateQueries({ queryKey: queryKeys.scans.history });
        },
        onError: (err) => {
            console.error('Report failed:', err);
        }
    });

    const handleAnalyze = async (overrideText = null) => {
        const textToAnalyze = typeof overrideText === 'string' ? overrideText : (activeTab === 'text' ? jobText : '');
        const filesToAnalyze = (activeTab === 'image' && typeof overrideText !== 'string') ? uploadFiles : [];

        if (!textToAnalyze.trim() && filesToAnalyze.length === 0) {
            setInputError(true);
            toast({
                title: "Input Required",
                description: activeTab === 'text' ? "Please paste a job description first." : "Please upload at least one document or image.",
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

        setResult(null);
        setRevealStats(false);

        analyzeMutation.mutate({ textToAnalyze, filesToAnalyze });
    };

    const handleReport = async () => {
        if (!result) return;
        reportMutation.mutate(result.id);
    };

    const formatText = (text: string) => {
        return text
            .replace(/[ \t]+/g, ' ') // Normalize spaces
            .replace(/\n\s*\n/g, '\n\n') // Normalize multiple newlines
            .replace(/^[•●▪■]\s+/gm, '- ') // Normalize bullets
            .trim();
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setJobText(formatText(text));
        } catch (err) { console.error('Failed to read clipboard', err); }
    };

    const handleClear = () => {
        setJobText('');
        setUploadFiles([]);
        setUploadPreviews([]);
        setResult(null);
        setRevealStats(false);
        setShowBottomSheet(false);
    };

    const getAnalyzeButtonText = () => {
        if (analyzeMutation.isPending) return "ANALYZING...";
        if (activeTab === 'image') return "ANALYZE DOCUMENT";
        return "ANALYZE TEXT";
    };

    return {
        state: {
            jobText,
            uploadFiles,
            uploadPreviews,
            activeTab,
            loading: analyzeMutation.isPending,
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
            setUploadFiles,
            setUploadPreviews,
            setActiveTab,
            setShowBottomSheet
        },
        handlers: {
            handleSheetTouchStart,
            handleSheetTouchMove,
            handleSheetTouchEnd,
            handleFileSelect,
            handleFileRemove,
            handleAnalyze,
            handleReport,
            handlePaste,
            handleClear,
            getAnalyzeButtonText,
            formatText
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
