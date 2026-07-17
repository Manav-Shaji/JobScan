/**
 * ------------------------------------------------------------
 * File: use-scan-limit.ts
 * 
 * Purpose:
 * Custom React hook for tracking and enforcing job scan rate limits.
 * 
 * Responsibilities:
 * • Interface with the global app store to track remaining scans
 * • Check if a user is allowed to perform a new scan
 * 
 * Used By:
 * • AnalyzerInput Component
 * ------------------------------------------------------------
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/core/providers/auth-provider';
const FREE_SCAN_LIMIT = 3;
const STORAGE_KEY = 'jobscan_free_scans';

export function useScanLimit() {
  const { user } = useAuth() as any;
  const [scanCount, setScanCount] = useState(0);
  const [showSignupWall, setShowSignupWall] = useState(false);
  const scanCountRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const count = parseInt(stored);
        scanCountRef.current = count;
        // Schedule state update using setTimeout to move it out of the synchronous effect execution
        const timer = setTimeout(() => setScanCount(count), 0);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    scanCountRef.current = scanCount;
  }, [scanCount]);

  const remainingScans = Math.max(0, FREE_SCAN_LIMIT - scanCount);

  const incrementScan = () => {
    if (user) return;
    setScanCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      return newCount;
    });
  };

  const checkCanScan = () => {
    if (user) return true;
    if (scanCountRef.current >= FREE_SCAN_LIMIT) {
      setShowSignupWall(true);
      return false;
    }
    return true;
  };

  const dismissSignupWall = () => {
    setShowSignupWall(false);
  };

  return {
    scanCount,
    remainingScans,
    isLimitReached: !user && scanCount >= FREE_SCAN_LIMIT,
    showSignupWall,
    incrementScan,
    checkCanScan,
    dismissSignupWall,
    FREE_SCAN_LIMIT,
    isLoggedIn: !!user,
  };
}
