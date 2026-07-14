/**
 * ------------------------------------------------------------
 * File: content.ts
 * 
 * Purpose:
 * Content script injected into supported job board pages.
 * 
 * Responsibilities:
 * • Listen for messages from the side panel
 * • Delegate DOM parsing to the appropriate extractor
 * 
 * Used By:
 * • Chrome Extension Runtime
 * ------------------------------------------------------------
 */

/* eslint-disable */
import { getExtractor } from '../extractors/registry';

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
      btn.id = 'jobscan-analyze-btn'; 
      btn.textContent = 'Analyze with AI';
      btn.style.setProperty('position', 'fixed', 'important');
      btn.style.setProperty('bottom', '24px', 'important');
      btn.style.setProperty('right', '24px', 'important');
      btn.style.setProperty('z-index', '2147483647', 'important');
      btn.style.setProperty('display', 'block', 'important');
      btn.style.backgroundColor = '#2563eb';
      btn.style.color = '#ffffff';
      btn.style.padding = '12px 24px';
      btn.style.borderRadius = '9999px';
      btn.style.fontWeight = 'bold';
      btn.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.5)'; 
      btn.style.cursor = 'pointer';
      btn.style.border = '2px solid white'; 
      btn.style.transform = 'translateZ(0)'; 

      btn.onclick = async () => {
        btn.textContent = 'Extracting...';
        btn.style.opacity = '0.8';
        
        try {
          // IMPORTANT: Open sidepanel IMMEDIATELY to preserve the user gesture token!
          chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' }).catch(() => {});
        } catch (err) {
          console.error('Extension context invalidated. Please refresh the page.', err);
          btn.textContent = 'Please Refresh Page!';
          btn.style.backgroundColor = '#dc2626';
          setTimeout(() => {
            btn.textContent = 'Analyze with JobScan';
            btn.style.backgroundColor = '#2563eb';
            btn.style.opacity = '1';
          }, 3000);
          return;
        }
        
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
          btn.innerHTML = `
        <div class="jobscan-btn-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
            <path d="M12 12 2.1 7.1"/>
            <path d="M12 12l9.9 4.9"/>
          </svg>
        </div>
        Analyze with AI
      `;
          btn.style.backgroundColor = '#2563eb';
          btn.style.opacity = '1';
        }, 3000);
      };

      if (document.body) {
        document.body.appendChild(btn);
      } else {
        document.documentElement.appendChild(btn);
      }
    };

    let lastUrl = window.location.href;
    let observer: MutationObserver | null = null;
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const setupScopedObserver = () => {
      if (observer) observer.disconnect();
      
      const targetNode = document.body || document.documentElement;
      if (targetNode) {
        observer = new MutationObserver(() => {
          if (throttleTimer) return;
          throttleTimer = setTimeout(() => {
            if (getExtractor(window.location.href)) {
              injectButton();
            }
            throttleTimer = null;
          }, 500);
        });
        observer.observe(targetNode, { childList: true, subtree: true });
      }
    };

    // Ensure it injects regardless of route changes
    setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        setupScopedObserver();
      }
      // Force check if extractor matches but button is missing
      if (getExtractor(window.location.href)) {
        injectButton();
      }
    }, 1500);
    
    setupScopedObserver();
    setTimeout(injectButton, 2000);
  }
});
