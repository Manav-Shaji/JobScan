
export default defineBackground(() => {
  console.log('JobScan Background Service Worker initialized.');

  // Handle side panel opening on extension icon click
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

  // Handle messages from content scripts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'OPEN_SIDEPANEL' && sender.tab?.id) {
      // The background worker needs to open the side panel for the specific tab
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch(console.error);
      sendResponse({ success: true });
    }
    return true; // Keep message channel open
  });
});
