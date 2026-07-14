/**
 * ------------------------------------------------------------
 * Component: AnalyzerInput
 * 
 * Purpose:
 * Main orchestrator component for the job scanning interface.
 * 
 * Responsibilities:
 * • Manage tabs between Text and Image upload modes
 * • Orchestrate the scan submission process
 * • Conditionally render Mobile or Desktop results based on viewport
 * 
 * Used By:
 * • Dashboard Analyzer Page
 * ------------------------------------------------------------
 */

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/ui/navigation";
import { FileText, ImageIcon } from 'lucide-react';
import { TextInputTab } from './TextInputTab';
import dynamic from 'next/dynamic';

const ImageUploadTab = dynamic(() => import('./ImageUploadTab').then(mod => mod.ImageUploadTab), {
    ssr: false,
    loading: () => <div className="h-[220px] rounded-3xl bg-[var(--surface-elevated)] animate-pulse border border-[var(--hairline)]" />
});

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
    return (
        <div className="mb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-[var(--surface-elevated)] border border-[var(--hairline)] rounded-xl p-1 h-auto">
                    <TabsTrigger value="text" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-blue-500 data-[state=active]:text-white transition flex items-center gap-2">
                        <FileText size={14}/> Text Analysis
                    </TabsTrigger>
                    <TabsTrigger value="image" className="py-2.5 rounded-lg text-xs font-bold data-[state=active]:bg-purple-500 data-[state=active]:text-white transition flex items-center gap-2">
                        <ImageIcon size={14}/> Poster Upload
                    </TabsTrigger>
                </TabsList>
            
                <TabsContent value="text" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TextInputTab 
                        jobText={jobText} 
                        setJobText={setJobText} 
                        inputError={inputError} 
                        activeTab={activeTab} 
                        handlePaste={handlePaste} 
                    />
                </TabsContent>

                <TabsContent value="image" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <ImageUploadTab 
                        posterFile={posterFile} 
                        setPosterFile={setPosterFile} 
                        posterPreview={posterPreview} 
                        setPosterPreview={setPosterPreview} 
                        activeTab={activeTab} 
                        inputError={inputError} 
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
