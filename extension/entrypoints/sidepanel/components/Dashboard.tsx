/**
 * ------------------------------------------------------------
 * Component: Dashboard
 * 
 * Purpose:
 * Main analysis view in the extension side panel.
 * 
 * Responsibilities:
 * • Trigger content scripts to extract job postings from the active tab
 * • Display loading states and the final analysis report
 * 
 * Used By:
 * • Side Panel App Component
 * ------------------------------------------------------------
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Skeleton, Alert } from '@/extension/ui';
import { getRiskColor } from './utils';

export function Dashboard({ jobData, analysisResult, loading, error, handleScreenshotAnalysis }: any) {
  return (
    <div className="space-y-4">
      {!jobData ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground border-dashed mt-4 space-y-4">
          <div>
            <p>No job data extracted.</p>
            <p className="text-sm mt-2">Open a supported job portal or scan the screen directly.</p>
          </div>
          <button 
            onClick={handleScreenshotAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-full shadow transition-colors disabled:opacity-50"
          >
            {loading ? 'Scanning Screen...' : 'Analyze Visible Screen (OCR)'}
          </button>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm tracking-wide text-muted-foreground uppercase">Extracted Job</CardTitle>
              <button 
                onClick={handleScreenshotAnalysis}
                disabled={loading}
                title="Enhance analysis with screenshot OCR"
                className="text-xs px-2 py-1 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded font-semibold transition-colors disabled:opacity-50"
              >
                + Include Screenshot
              </button>
            </CardHeader>
            <CardContent className="space-y-1">
              <h3 className="font-bold line-clamp-2">{jobData.title || 'Unknown Title'}</h3>
              <p className="text-sm text-muted-foreground">{jobData.company || 'Unknown Company'}</p>
            </CardContent>
          </Card>

          {loading && !analysisResult && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse text-center mt-4">
                  Analyzing job through JobScan Backend...
                </p>
              </CardContent>
            </Card>
          )}

          {error && (
            <Alert className="border-red-500/50 text-red-500 bg-red-500/10">
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          {analysisResult && (
            <div className="space-y-4">
              {loading && <div className="text-xs text-center text-blue-400 animate-pulse">Refreshing analysis in background...</div>}
              <Card className="overflow-hidden border-2 border-[var(--hairline)]">
                <div className="bg-gradient-to-r from-[var(--surface-card)] to-transparent p-6 flex flex-col items-center justify-center border-b border-[var(--hairline)]">
                  <div className="relative flex items-center justify-center w-24 h-24 mb-4 shrink-0">
                    <svg viewBox="0 0 96 96" className="absolute w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
                      <circle 
                        cx="48" cy="48" r="44" 
                        stroke="currentColor" 
                        strokeWidth="8" fill="none" 
                        strokeDasharray="276"
                        strokeDashoffset={276 - (276 * (analysisResult.trustScore || 0)) / 100}
                        className={analysisResult.trustScore > 70 ? 'text-green-500' : analysisResult.trustScore > 40 ? 'text-yellow-500' : 'text-red-500'} 
                      />
                    </svg>
                    <span className="text-2xl font-black">{analysisResult.trustScore || 0}</span>
                  </div>
                  <h3 className="text-sm tracking-widest text-muted-foreground font-semibold uppercase">Trust Score</h3>
                </div>
                
                <CardContent className="p-4 grid grid-cols-2 gap-4 bg-[var(--surface-card)]">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Risk Level</span>
                    <span className={`px-2 py-1 text-xs font-bold rounded border w-fit capitalize ${getRiskColor(analysisResult.riskLevel)}`}>
                      {analysisResult.riskLevel || 'Unknown'}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Confidence</span>
                    <span className="font-semibold">{analysisResult.patternConfidence ? `${analysisResult.patternConfidence}%` : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
                <Card className="border-red-500/20 bg-red-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-red-500 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span> Why This Was Flagged
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {analysisResult.redFlags.map((flag: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Deep Analysis</h3>
                <div className="space-y-2">
                  <details className="group border rounded-lg overflow-hidden bg-card text-card-foreground">
                    <summary className="px-4 py-3 font-medium cursor-pointer bg-[var(--surface-card)] hover:bg-accent hover:text-accent-foreground flex justify-between items-center transition-colors">
                      Company Trust Analysis
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <div className="p-4 bg-background border-t text-sm space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Employer Credibility</span>
                        <span className="font-semibold">{analysisResult.breakdown?.employer || 50}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Contact Authenticity</span>
                        <span className="font-semibold">{analysisResult.breakdown?.contact || 50}/100</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Salary Realism</span>
                        <span className="font-semibold">{analysisResult.breakdown?.salary || 50}/100</span>
                      </div>
                    </div>
                  </details>

                  <details className="group border rounded-lg overflow-hidden bg-card text-card-foreground">
                    <summary className="px-4 py-3 font-medium cursor-pointer bg-[var(--surface-card)] hover:bg-accent hover:text-accent-foreground flex justify-between items-center transition-colors">
                      Analysis Timeline
                      <span className="transition group-open:rotate-180">▼</span>
                    </summary>
                    <div className="p-4 bg-background border-t text-sm">
                      <div className="relative border-l border-muted-foreground/30 ml-3 space-y-4 pb-1">
                        {['Job Extracted', 'Company Verified', 'Scam Indicators Checked', 'Content Analyzed', 'Recommendation Generated'].map((step, i) => (
                          <div key={i} className="relative pl-6">
                            <span className={`absolute -left-1.5 top-1 h-3 w-3 rounded-full ring-4 ring-background ${i === 4 ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                            <p className={`font-semibold ${i === 4 ? 'text-green-400' : 'text-blue-400'}`}>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
