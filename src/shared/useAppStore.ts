/**
 * ------------------------------------------------------------
 * File: useAppStore.ts
 * 
 * Purpose:
 * Global Zustand state management store.
 * 
 * Responsibilities:
 * • Manage global application state across components
 * 
 * Used By:
 * • Global UI Components
 * ------------------------------------------------------------
 */

import { create } from 'zustand';

interface AppState {
  activeTab: 'text' | 'image';
  jobText: string;
  uploadFiles: File[];
  uploadPreviews: string[];
  inputError: boolean;
  revealStats: boolean;
  activeStage: number;
  completedStages: number[];

  setActiveTab: (tab: 'text' | 'image') => void;
  setJobText: (text: string) => void;
  setUploadFiles: (files: File[]) => void;
  setUploadPreviews: (previews: string[]) => void;
  setInputError: (error: boolean) => void;
  setRevealStats: (reveal: boolean) => void;
  setActiveStage: (stage: number) => void;
  setCompletedStages: (stages: number[]) => void;
  
  resetAnalyzer: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'text',
  jobText: '',
  uploadFiles: [],
  uploadPreviews: [],
  inputError: false,
  revealStats: false,
  activeStage: 0,
  completedStages: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setJobText: (text) => set({ jobText: text }),
  setUploadFiles: (files) => set({ uploadFiles: files }),
  setUploadPreviews: (previews) => set({ uploadPreviews: previews }),
  setInputError: (error) => set({ inputError: error }),
  setRevealStats: (reveal) => set({ revealStats: reveal }),
  setActiveStage: (stage) => set({ activeStage: stage }),
  setCompletedStages: (stages) => set({ completedStages: stages }),

  resetAnalyzer: () => set({
    jobText: '',
    uploadFiles: [],
    uploadPreviews: [],
    inputError: false,
    revealStats: false,
    activeStage: 0,
    completedStages: [],
  }),
}));
