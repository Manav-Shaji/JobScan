/* eslint-disable */

export default defineBackground(() => {
  console.log('JobScan Background Service Worker initialized.');
  chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

  // Handle messages from content scripts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'OPEN_SIDEPANEL' && sender.tab?.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id }).catch(console.error);
      sendResponse({ success: true });
    }
    return true; // Keep message channel open
  });
});
