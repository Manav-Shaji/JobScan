"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/core/providers/auth-provider';
import { PwaProvider } from '@/core/providers/pwa-provider';

// --- Theme Context ---

const ThemeContext = createContext(null);

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('jobscan_theme');
    const timer = setTimeout(() => {
      if (stored === 'dark') {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('jobscan_theme', theme);
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = { theme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// --- Job Context ---

const JobContext = createContext();

function JobProvider({ children }) {
  const [currentJobContext, setCurrentJobContext] = useState(null);

  return (
    <JobContext.Provider value={{ currentJobContext, setCurrentJobContext }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJob() {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}

// --- Root Provider ---

import { MotionConfig, LazyMotion, domAnimation } from 'motion/react';

export default function Providers({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <SessionProvider>
          <ThemeProvider>
            <AuthProvider>
              <JobProvider>
                <PwaProvider>
                  {children}
                </PwaProvider>
              </JobProvider>
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
