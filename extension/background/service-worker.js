/**
 * JobScan Extension Service Worker
 * Handles network requests to the JobScan API and routes messages.
 */

// Import static configuration variables
try {
  importScripts('../config.js');
} catch (e) {
  console.error('Failed to import config.js in service worker:', e);
}

const DEFAULT_BACKEND_URL = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:3000';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['backendUrl'], (result) => {
    if (!result.backendUrl) {
      chrome.storage.local.set({ backendUrl: DEFAULT_BACKEND_URL });
    }
  });
});

// Listener for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ANALYZE_JOB') {
    handleJobAnalysis(message.data)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => {
        console.error('Analysis error:', error);
        sendResponse({ success: false, error: error.message || 'Failed to analyze job listing.' });
      });
    return true; // Keep message channel open for async response
  }
});

async function handleJobAnalysis(jobData) {
  try {
    const settings = await getLocalStorage(['backendUrl']);
    const backendUrl = settings.backendUrl || DEFAULT_BACKEND_URL;
    
    // Format body for analyze endpoint
    const requestBody = {
      jobDescription: `Title: ${jobData.title || ''}\nCompany: ${jobData.company || ''}\nLocation: ${jobData.location || ''}\nSalary: ${jobData.salary || ''}\n\nDescription:\n${jobData.description || ''}`,
      posterBase64: undefined,
      posterMimeType: undefined
    };

    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText || response.statusText}`);
    }

    const json = await response.json();
    if (!json.success) {
      throw new Error(json.message || 'API request failed');
    }

    return json.data;
  } catch (error) {
    console.error('Network analysis task failed:', error);
    throw error;
  }
}

// Utility to wrap chrome storage in promises
function getLocalStorage(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

// Track SPA navigation and notify content scripts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, { action: 'URL_CHANGED', url: changeInfo.url }).catch(() => {});
  }
});
