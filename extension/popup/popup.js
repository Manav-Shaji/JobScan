/**
 * JobScan Extension Popup Logic
 * Interfaces with active tab page-parser, triggers background scanning, and coordinates UI transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnAnalyze = document.getElementById('btn-analyze');
  const btnSettings = document.getElementById('btn-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings');
  const btnSaveSettings = document.getElementById('btn-save-settings');
  
  const panelMain = document.getElementById('panel-main');
  const panelSettings = document.getElementById('panel-settings');
  
  const stateLoading = document.getElementById('state-loading');
  const stateResult = document.getElementById('state-result');
  const stateError = document.getElementById('state-error');
  
  const txtScore = document.getElementById('txt-score');
  const badgeRisk = document.getElementById('badge-risk');
  const txtSummary = document.getElementById('txt-summary');
  const cardFlags = document.getElementById('card-flags');
  const listFlags = document.getElementById('list-flags');
  const txtError = document.getElementById('txt-error');
  const inputBackendUrl = document.getElementById('input-backend-url');

  const actionsSection = document.querySelector('.actions-section');

  const fallbackUrl = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:3000';

  // Load and prefill settings
  chrome.storage.local.get(['backendUrl'], (result) => {
    if (result.backendUrl) {
      inputBackendUrl.value = result.backendUrl;
    } else {
      inputBackendUrl.value = fallbackUrl;
    }
  });

  // Event: Open Settings
  btnSettings.addEventListener('click', () => {
    panelMain.classList.add('hidden');
    panelSettings.classList.remove('hidden');
  });

  // Event: Close Settings
  btnCloseSettings.addEventListener('click', () => {
    panelSettings.classList.add('hidden');
    panelMain.classList.remove('hidden');
  });

  // Event: Save Settings
  btnSaveSettings.addEventListener('click', () => {
    const url = inputBackendUrl.value.trim() || fallbackUrl;
    chrome.storage.local.set({ backendUrl: url }, () => {
      panelSettings.classList.add('hidden');
      panelMain.classList.remove('hidden');
    });
  });

  // Event: Analyze active tab listing
  btnAnalyze.addEventListener('click', async () => {
    actionsSection.classList.add('hidden');
    stateResult.classList.add('hidden');
    stateError.classList.add('hidden');
    stateLoading.classList.remove('hidden');

    try {
      // 1. Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active window tab found.');
      }

      // 2. Query tab content script for parsed page
      chrome.tabs.sendMessage(tab.id, { action: 'PARSED_ACTIVE_PAGE' }, (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          const message = response?.error || chrome.runtime.lastError?.message || 'Could not parse listing. Ensure you are on a supported job listing website and refresh the page.';
          showError(message);
          return;
        }

        const jobData = response.data;

        // 3. Send parsed job description to background service worker for server analysis
        chrome.runtime.sendMessage({ action: 'ANALYZE_JOB', data: jobData }, (analysisResponse) => {
          if (chrome.runtime.lastError || !analysisResponse || !analysisResponse.success) {
            const message = analysisResponse?.error || chrome.runtime.lastError?.message || 'Verification server is offline or returned an invalid response.';
            showError(message);
            return;
          }

          showResults(analysisResponse.data);
        });
      });
    } catch (e) {
      showError(e.message);
    }
  });

  function showError(msg) {
    stateLoading.classList.add('hidden');
    stateResult.classList.add('hidden');
    actionsSection.classList.remove('hidden');
    txtError.textContent = msg;
    stateError.classList.remove('hidden');
  }

  function showResults(data) {
    stateLoading.classList.add('hidden');
    stateError.classList.add('hidden');

    const score = data.trustScore || 0;
    const risk = (data.riskLevel || 'UNKNOWN').toUpperCase();
    const flags = data.redFlags || [];
    const summary = data.analysis?.summary || data.posterAnalysis?.summary || 'No summary available.';

    // Populate score and risk details
    txtScore.textContent = `${score} / 100`;
    badgeRisk.textContent = `${risk} RISK`;
    
    // Clear previous risk badges
    badgeRisk.className = 'badge';
    badgeRisk.classList.add(risk.toLowerCase());

    // Populate summary
    txtSummary.textContent = summary;

    // Populate red flags
    listFlags.replaceChildren(); // Safe clearing
    if (flags && flags.length > 0) {
      flags.forEach(flag => {
        const item = document.createElement('div');
        item.className = 'flag-item';

        const icon = document.createElement('span');
        icon.className = 'flag-icon';
        icon.textContent = '⚠️';

        const text = document.createElement('span');
        text.textContent = flag;

        item.appendChild(icon);
        item.appendChild(text);
        listFlags.appendChild(item);
      });
      cardFlags.classList.remove('hidden');
    } else {
      cardFlags.classList.add('hidden');
    }

    stateResult.classList.remove('hidden');
  }
});
