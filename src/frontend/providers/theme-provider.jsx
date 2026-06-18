'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('jobscan_theme');
    if (stored === 'dark') {
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    setMounted(true);
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

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
