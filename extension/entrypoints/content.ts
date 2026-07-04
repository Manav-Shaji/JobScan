/* eslint-disable */
import { getExtractor } from '../content/extractors/registry';

export default defineContentScript({
  matches: [
    '*://*.linkedin.com/jobs/*',
    '*://*.indeed.com/*',
    '*://*.naukri.com/*'
  ],
  main() {
    console.log('JobScan Content Script Loaded');

    const injectButton = () => {
      if (!document.body) return; // Wait until body exists
      if (document.getElementById('jobscan-analyze-btn')) return; // Check DOM instead of boolean
      
      const extractor = getExtractor(window.location.href);
      if (!extractor) return;

      const btn = document.createElement('button');
      btn.id = 'jobscan-analyze-btn'; // Explicit ID to check for existence
      btn.textContent = 'Analyze with JobScan';
      btn.style.position = 'fixed';
      btn.style.bottom = '24px';
      btn.style.right = '24px';
      btn.style.zIndex = '999999';
      btn.style.backgroundColor = '#2563eb';
      btn.style.color = '#ffffff';
      btn.style.padding = '12px 24px';
      btn.style.borderRadius = '9999px';
      btn.style.fontWeight = 'bold';
      btn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
      btn.style.cursor = 'pointer';
      btn.style.border = 'none';

      btn.onclick = async () => {
        btn.textContent = 'Extracting...';
        btn.style.opacity = '0.8';
        
        // IMPORTANT: Open sidepanel IMMEDIATELY to preserve the user gesture token!
        // If we wait for extract() to finish, Chrome will block the sidepanel from opening.
        chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
        
        try {
          const data = await extractor.extract();
          if (data) {
            // Save to storage
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

      document.body.appendChild(btn);
    };

    let lastUrl = window.location.href;
    let observer: MutationObserver | null = null;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const setupScopedObserver = () => {
      if (observer) observer.disconnect();
      
      // Route-aware execution
      const isJobPage = window.location.href.includes('/jobs/') || window.location.href.includes('/job/');
      if (!isJobPage) return;

      observer = new MutationObserver(() => {
        if (throttleTimer) return;
        throttleTimer = setTimeout(() => {
          injectButton();
          throttleTimer = null;
        }, 500); // Throttling
      });

      const targetNode = document.body; // Ideally scoped to job panel, but fallback to body with throttle
      observer.observe(targetNode, { childList: true, subtree: true });
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
