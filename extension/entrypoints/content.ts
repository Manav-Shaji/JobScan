/* eslint-disable */
import { getExtractor } from '../content/extractors/registry';

export default defineContentScript({
  matches: [
    '*://*.linkedin.com/*',
    '*://*.indeed.com/*',
    '*://*.naukri.com/*'
  ],
  main() {
    console.log('🔥 JobScan Content Script Loaded on URL:', window.location.href);
    
    // Visual indicator that the script ran (flashes body red for 500ms)
    if (document.body) {
      const originalBg = document.body.style.backgroundColor;
      document.body.style.backgroundColor = '#ffcccc';
      setTimeout(() => { document.body.style.backgroundColor = originalBg; }, 500);
    }

    const injectButton = () => {
      console.log('🔥 JobScan: injectButton triggered');
      if (!document.body && !document.documentElement) {
        console.log('🔥 JobScan: document.body not ready');
        return;
      }
      if (document.getElementById('jobscan-analyze-btn')) {
        return;
      }
      
      const extractor = getExtractor(window.location.href);
      console.log('🔥 JobScan: Extractor found:', !!extractor, 'for URL:', window.location.href);
      if (!extractor) return;

      const btn = document.createElement('button');
      btn.id = 'jobscan-analyze-btn'; // Explicit ID to check for existence
      btn.textContent = 'Analyze with JobScan';
      btn.style.position = 'fixed';
      btn.style.bottom = '24px';
      btn.style.right = '24px';
      btn.style.zIndex = '2147483647'; // Max safe z-index to guarantee visibility
      btn.style.backgroundColor = '#2563eb';
      btn.style.color = '#ffffff';
      btn.style.padding = '12px 24px';
      btn.style.borderRadius = '9999px';
      btn.style.fontWeight = 'bold';
      btn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)'; // Darker shadow
      btn.style.cursor = 'pointer';
      btn.style.border = '2px solid white'; // White border to pop out
      btn.style.transform = 'translateZ(0)'; // Force hardware acceleration to bypass some hidden overflows
      btn.style.display = 'block';

      btn.onclick = async () => {
        btn.textContent = 'Extracting...';
        btn.style.opacity = '0.8';
        
        // IMPORTANT: Open sidepanel IMMEDIATELY to preserve the user gesture token!
        chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
        
        try {
          const data = await extractor.extract();
          if (data) {
            await chrome.storage.local.set({ latestJobExtraction: data });
            btn.textContent = 'Job Extracted!';
            btn.style.backgroundColor = '#16a34a';
          } else {
            btn.textContent = 'Extraction Failed';
            btn.style.backgroundColor = '#dc2626';
          }
        } catch (e) {
          console.error('Extraction error:', e);
          btn.textContent = 'Error';
          btn.style.backgroundColor = '#dc2626';
        }
        
        setTimeout(() => {
          btn.textContent = 'Analyze with JobScan';
          btn.style.backgroundColor = '#2563eb';
          btn.style.opacity = '1';
        }, 3000);
      };

      // Append directly to HTML tag (documentElement) to bypass body transforms/overflow issues
      (document.documentElement || document.body).appendChild(btn);
    };

    let lastUrl = window.location.href;
    let observer: MutationObserver | null = null;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const setupScopedObserver = () => {
      if (observer) observer.disconnect();
      
      // Route-aware execution
      const hasExtractor = getExtractor(window.location.href) !== null;
      if (!hasExtractor) return;

      observer = new MutationObserver(() => {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
          injectButton();
          throttleTimer = null;
        }, 500); // Throttling
      });

      const targetNode = document.body || document.documentElement;
      if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
      }
    };

    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setupScopedObserver();
        setTimeout(injectButton, 500);
      }
    }, 1500);
    
    setupScopedObserver();
    
    // Also try immediately
    setTimeout(injectButton, 2000);
  }
});
