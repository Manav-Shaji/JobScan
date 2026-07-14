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
  posterFile: File | null;
  posterPreview: string | null;
  inputError: boolean;
  revealStats: boolean;
  activeStage: number;
  completedStages: number[];

  setActiveTab: (tab: 'text' | 'image') => void;
  setJobText: (text: string) => void;
  setPosterFile: (file: File | null) => void;
  setPosterPreview: (preview: string | null) => void;
  setInputError: (error: boolean) => void;
  setRevealStats: (reveal: boolean) => void;
  setActiveStage: (stage: number) => void;
  setCompletedStages: (stages: number[]) => void;
  
  resetAnalyzer: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'text',
  jobText: '',
  posterFile: null,
  posterPreview: null,
  inputError: false,
  revealStats: false,
  activeStage: 0,
  completedStages: [],

  setActiveTab: (tab) => set({ activeTab: tab }),
  setJobText: (text) => set({ jobText: text }),
  setPosterFile: (file) => set({ posterFile: file }),
  setPosterPreview: (preview) => set({ posterPreview: preview }),
  setInputError: (error) => set({ inputError: error }),
  setRevealStats: (reveal) => set({ revealStats: reveal }),
  setActiveStage: (stage) => set({ activeStage: stage }),
  setCompletedStages: (stages) => set({ completedStages: stages }),

  resetAnalyzer: () => set({
    jobText: '',
    posterFile: null,
    posterPreview: null,
    inputError: false,
    revealStats: false,
    activeStage: 0,
    completedStages: [],
  }),
}));
