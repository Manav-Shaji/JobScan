import { defineContentScript } from 'wxt/sandbox';
import { getExtractor } from '../content/extractors/registry';

export default defineContentScript({
  matches: [
    '*://*.linkedin.com/jobs/*',
    '*://*.indeed.com/*',
    '*://*.naukri.com/*'
  ],
  main() {
    console.log('JobScan Content Script Loaded');

    let buttonInjected = false;

    const injectButton = () => {
      if (buttonInjected) return;
      const extractor = getExtractor(window.location.href);
      if (!extractor) return;

      const btn = document.createElement('button');
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
        
        try {
          const data = await extractor.extract();
          if (data) {
            // Save to storage
            await chrome.storage.local.set({ latestJobExtraction: data });
            
            // Notify background to open sidepanel
            chrome.runtime.sendMessage({ action: 'OPEN_SIDEPANEL' });
            
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
      buttonInjected = true;
    };

    // Use MutationObserver to wait for DOM stability on Single Page Apps
    // Debounced to prevent excessive CPU usage during rapid DOM mutations
    let debounceTimer: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        injectButton();
      }, 500);
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Also try immediately
    setTimeout(injectButton, 2000);
  }
});
