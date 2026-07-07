'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/core/ui/use-toast';

const PwaContext = createContext({
  isInstallable: false,
  isInstalled: false,
  isExtensionInstalled: false,
  installApp: async () => {},
  requestNotificationPermission: async () => {}
});

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // 1. Check Standalone Display Mode
    const checkStandalone = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      setIsInstalled(isStandalone);
    };
    checkStandalone();
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandalone);

    // 2. Register Service Worker (Client side only, browser checks)
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => { if (process.env.NODE_ENV === 'development') console.log('[PWA] Service Worker registered successfully:', reg.scope); })
          .catch((err) => { if (process.env.NODE_ENV === 'development') console.error('[PWA] Service Worker registration failed:', err); });
      });
    }

    // 3. Capture PWA Installation Prompt
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      if (process.env.NODE_ENV === 'development') console.log('[PWA] Installation prompt captured');
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // 4. Detect Extension presence
    const checkExtension = () => {
      const isPresent = document.documentElement.getAttribute('data-jobscan-extension-installed') === 'true';
      setIsExtensionInstalled(isPresent);
    };
    
    // Check immediately on mount
    checkExtension();

    // Use MutationObserver to watch for runtime extension attribute injection
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-jobscan-extension-installed') {
          checkExtension();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandalone);
      observer.disconnect();
    };
  }, []);

  // Action: Trigger Native Install Dialog
  const installApp = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation Unavailable",
        description: "Your browser does not support installation or the app is already installed.",
        variant: "destructive"
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (process.env.NODE_ENV === 'development') console.log(`[PWA] Install prompt result: ${outcome}`);

    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
      toast({
        title: "App Installing",
        description: "JobScan is installing on your device.",
        variant: "success"
      });
    }
  };

  // Action: Setup Notification Permissions Foundation (Architecture Only)
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: "Notifications Unsupported",
        description: "This browser does not support desktop notifications.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Mock push subscription registration details
        if (process.env.NODE_ENV === 'development') console.log('[PWA] Notification permission granted. Setting up push handlers.');
        
        // Retrieve push subscription (Architecture registration details only)
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          const sub = await reg.pushManager.getSubscription();
          if (process.env.NODE_ENV === 'development') console.log('[PWA Push Token Endpoint Details]:', sub ? sub.endpoint : 'No active registration token found');
        }

        toast({
          title: "Alerts Enabled",
          description: "You will receive real-time trust update warnings and scam alerts.",
          variant: "success"
        });
        return true;
      } else {
        toast({
          title: "Permission Denied",
          description: "Notification alerts were blocked.",
          variant: "warning"
        });
        return false;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('[PWA] Error requesting permission:', error);
      return false;
    }
  };

  return (
    <PwaContext.Provider value={{
      isInstallable,
      isInstalled,
      isExtensionInstalled,
      installApp,
      requestNotificationPermission
    }}>
      {children}
    </PwaContext.Provider>
  );
}

export function usePwa() {
  return useContext(PwaContext);
}
