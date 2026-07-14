/**
 * ------------------------------------------------------------
 * Component: ThemeProvider & AppProviders
 * 
 * Purpose:
 * Global context providers for theme, authentication, and application state.
 * 
 * Responsibilities:
 * • Manage global light/dark theme state with View Transitions API
 * • Wrap application in SessionProvider, AuthProvider, and PwaProvider
 * 
 * Used By:
 * • Root Layout
 * ------------------------------------------------------------
 */

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

  const toggleTheme = (event) => {
    const isDark = theme === 'light';
    
    if (!document.startViewTransition) {
        setTheme(isDark ? 'dark' : 'light');
        return;
    }

    // Default to center of screen if no event provided
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    
    // Capture exact mouse click coordinates if available
    if (event && event.clientX !== undefined) {
        x = event.clientX;
        y = event.clientY;
    }

    // Calculate maximum radius to ensure full screen coverage
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        setTheme(isDark ? 'dark' : 'light');
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        document.documentElement.animate(
            {
                clipPath: isDark ? clipPath : [...clipPath].reverse(),
            },
            {
                duration: 500,
                easing: 'ease-in-out',
                pseudoElement: isDark
                    ? '::view-transition-new(root)'
                    : '::view-transition-old(root)',
            }
        );
    });
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
import QueryProvider from '@/core/providers/query-provider';

export default function Providers({ children }) {
  return (
    <QueryProvider>
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
    </QueryProvider>
  );
}
