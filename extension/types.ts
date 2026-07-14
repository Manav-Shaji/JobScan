/**
 * ------------------------------------------------------------
 * File: types.ts
 * 
 * Purpose:
 * TypeScript definitions for the Chrome Extension.
 * 
 * Responsibilities:
 * • Define data structures for extension messaging and API responses
 * 
 * Used By:
 * • Extension Background and Content Scripts
 * ------------------------------------------------------------
 */

export interface JobData {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  url: string;
}

export interface JobExtractor {
  canHandle(url: string): boolean;
  extract(): Promise<JobData | null>;
}
