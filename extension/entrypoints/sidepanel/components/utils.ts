/**
 * ------------------------------------------------------------
 * File: utils.ts
 * 
 * Purpose:
 * Shared utility functions for the side panel components.
 * 
 * Responsibilities:
 * • Provide helper methods for formatting and color-coding risk levels
 * 
 * Used By:
 * • Side Panel Components
 * ------------------------------------------------------------
 */

export const getRiskColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
    case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
    default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  }
};
