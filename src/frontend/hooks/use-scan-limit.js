'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/frontend/context/auth-context';
const FREE_SCAN_LIMIT = 3;
const STORAGE_KEY = 'jobscan_free_scans';

export function useScanLimit() {
  const { user } = useAuth();
  const [scanCount, setScanCount] = useState(0);
  const [showSignupWall, setShowSignupWall] = useState(false);
  const scanCountRef = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const count = parseInt(stored);
        setScanCount(count);
        scanCountRef.current = count;
      }
    }
  }, []);

  useEffect(() => {
    scanCountRef.current = scanCount;
  }, [scanCount]);

  const remainingScans = Math.max(0, FREE_SCAN_LIMIT - scanCount);

  const incrementScan = useCallback(() => {
    if (user) return;
    setScanCount(prev => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEY, newCount.toString());
      return newCount;
    });
  }, [user]);

  const checkCanScan = useCallback(() => {
    if (user) return true;
    if (scanCountRef.current >= FREE_SCAN_LIMIT) {
      setShowSignupWall(true);
      return false;
    }
    return true;
  }, [user]);

  const dismissSignupWall = useCallback(() => {
    setShowSignupWall(false);
  }, []);

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
