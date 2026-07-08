export default defineContentScript({
  matches: ['*://localhost/*', '*://*.vercel.app/*'],
  main() {
    // Check if the current page is the JobScan web application
    const isJobScanApp = document.querySelector('meta[name="jobscan-app"][content="true"]');
    
    if (isJobScanApp) {
      const appUrl = window.location.origin;
      console.log('✅ JobScan web app detected! Binding extension to:', appUrl);
      
      // Save the detected URL to local storage so the extension uses it for API calls
      chrome.storage.local.set({ customApiUrl: appUrl });
    }
  },
});
