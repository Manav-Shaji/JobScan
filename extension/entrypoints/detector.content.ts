/**
 * ------------------------------------------------------------
 * File: detector.content.ts
 * 
 * Purpose:
 * Content script to detect the main web app installation.
 * 
 * Responsibilities:
 * • Inject DOM attribute data-jobscan-extension-installed="true" into document.documentElement
 * • Save web app origin to chrome.storage for extension API connectivity
 * 
 * Used By:
 * • Chrome Extension Runtime
 * ------------------------------------------------------------
 */

export default defineContentScript({
  matches: [
    '*://localhost/*',
    '*://localhost:*/*',
    '*://127.0.0.1/*',
    '*://127.0.0.1:*/*',
    '*://*.vercel.app/*',
    '*://*.jobscan.app/*'
  ],
  runAt: 'document_start',
  main() {
    const markExtensionInstalled = () => {
      if (document.documentElement) {
        document.documentElement.setAttribute('data-jobscan-extension-installed', 'true');
      }

      const isJobScanApp = document.querySelector('meta[name="jobscan-app"][content="true"]');
      if (isJobScanApp) {
        const appUrl = window.location.origin;
        console.log('✅ JobScan web app detected! Binding extension to:', appUrl);
        chrome.storage.local.set({ customApiUrl: appUrl });
      }
    };

    markExtensionInstalled();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', markExtensionInstalled);
    }
  },
});
