/**
 * JobScan Extension Content Script
 * Injects extension markers, adds floating analyze buttons, and displays analysis overlays.
 */

// 1. Set marker on document element so JobScan web app can detect the extension
document.documentElement.setAttribute('data-jobscan-extension-installed', 'true');

// 2. Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'PARSED_ACTIVE_PAGE') {
    try {
      const parsed = window.JobScanParser.extractJob();
      sendResponse({ success: true, data: parsed });
    } catch (e) {
      sendResponse({ success: false, error: e.message });
    }
    return true;
  }
});

// 3. Inject floating "Analyze Job" button
function initFloatingButton() {
  // Check if we already injected it
  if (document.getElementById('jobscan-floating-btn')) return;

  const button = document.createElement('button');
  button.id = 'jobscan-floating-btn';
  button.textContent = 'Analyze with JobScan';
  
  // Style with premium glassmorphism
  Object.assign(button.style, {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    zIndex: '99999',
    padding: '12px 20px',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    background: 'linear-gradient(135deg, rgba(3, 105, 161, 0.9) 0%, rgba(7, 89, 133, 0.9) 100%)',
    backdropFilter: 'blur(8px)',
    color: '#ffffff',
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 8px 32px rgba(3, 105, 161, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  // Simple icon
  const icon = document.createElement('span');
  icon.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`;
  button.prepend(icon);

  // Hover animations
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-3px) scale(1.03)';
    button.style.boxShadow = '0 12px 40px rgba(3, 105, 161, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'none';
    button.style.boxShadow = '0 8px 32px rgba(3, 105, 161, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
  });

  // Action
  button.addEventListener('click', triggerDirectAnalysis);

  document.body.appendChild(button);
}

// 4. Trigger Direct Analysis & Render Overlay
async function triggerDirectAnalysis() {
  // Parse active job description
  let parsedJob;
  try {
    parsedJob = window.JobScanParser.extractJob();
  } catch (error) {
    alert('Failed to extract job text: ' + error.message);
    return;
  }

  // Show loading indicator
  const overlay = createOverlay();
  overlay.innerHTML = `
    <div style="text-align: center; color: #fff; font-family: sans-serif;">
      <div class="jobscan-spinner" style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #38bdf8; border-radius: 50%; animation: jobscan-spin 1s linear infinite; margin: 0 auto 16px auto;"></div>
      <p style="margin: 0; font-size: 14px; font-weight: 600;">Analyzing Listing Security...</p>
    </div>
    <style>
      @keyframes jobscan-spin {
        to { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(overlay);

  // Call API via background service worker
  chrome.runtime.sendMessage({ action: 'ANALYZE_JOB', data: parsedJob }, (response) => {
    if (chrome.runtime.lastError || !response || !response.success) {
      const errMsg = response?.error || chrome.runtime.lastError?.message || 'Connection to server failed';
      renderErrorOverlay(overlay, errMsg);
      return;
    }
    renderResultOverlay(overlay, response.data);
  });
}

function createOverlay() {
  // Clear any existing overlay
  const existing = document.getElementById('jobscan-analysis-overlay');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.id = 'jobscan-analysis-overlay';
  Object.assign(container.style, {
    position: 'fixed',
    top: '24px',
    right: '24px',
    width: '380px',
    zIndex: '999999',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(16px)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
    color: '#f8fafc',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    animation: 'jobscan-slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
  });

  // Inject animation keyframes
  if (!document.getElementById('jobscan-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'jobscan-animation-styles';
    style.textContent = `
      @keyframes jobscan-slideIn {
        from { transform: translateX(50px) translateY(-10px); opacity: 0; }
        to { transform: none; opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  return container;
}

function renderErrorOverlay(overlay, errorMsg) {
  overlay.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; font-size: 16px; font-weight: 800; color: #f8fafc;">Analysis Failed</h3>
      <button id="jobscan-overlay-close" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
    </div>
    <div style="background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.2); padding: 12px; borderRadius: 12px; color: #f87171; font-size: 13px;">
      ${escapeHtml(errorMsg)}
    </div>
    <p style="margin: 0; font-size: 11px; color: #94a3b8;">Make sure your JobScan server is running at http://localhost:3000.</p>
  `;
  overlay.querySelector('#jobscan-overlay-close').addEventListener('click', () => overlay.remove());
}

function renderResultOverlay(overlay, data) {
  const score = data.trustScore || 0;
  const risk = (data.riskLevel || 'UNKNOWN').toUpperCase();
  const redFlags = data.redFlags || [];
  const summary = data.analysis?.summary || data.posterAnalysis?.summary || 'No summary available.';

  // Map risk level to colors
  let riskColor = '#10b981'; // LOW (Green)
  let riskBg = 'rgba(16, 185, 129, 0.15)';
  if (risk === 'MEDIUM') {
    riskColor = '#f59e0b'; // Amber
    riskBg = 'rgba(245, 158, 11, 0.15)';
  } else if (risk === 'HIGH' || risk === 'CRITICAL') {
    riskColor = '#ef4444'; // Red
    riskBg = 'rgba(239, 68, 68, 0.15)';
  }

  // Safe innerHTML bypasses: We build standard elements or sanitised blocks
  overlay.replaceChildren();

  // Header Row
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justify = 'space-between';
  header.style.alignItems = 'center';
  
  const title = document.createElement('h3');
  title.style.margin = '0';
  title.style.fontSize = '16px';
  title.style.fontWeight = '800';
  title.style.color = '#fff';
  title.textContent = 'JobScan Trust Analysis';
  
  const closeBtn = document.createElement('button');
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.color = '#94a3b8';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.padding = '4px';
  closeBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
  closeBtn.addEventListener('click', () => overlay.remove());
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  overlay.appendChild(header);

  // Score and Risk Block
  const scoreBlock = document.createElement('div');
  scoreBlock.style.display = 'flex';
  scoreBlock.style.alignItems = 'center';
  scoreBlock.style.justifyContent = 'space-between';
  scoreBlock.style.background = 'rgba(255, 255, 255, 0.03)';
  scoreBlock.style.border = '1px solid rgba(255, 255, 255, 0.05)';
  scoreBlock.style.padding = '16px';
  scoreBlock.style.borderRadius = '16px';

  const scoreLeft = document.createElement('div');
  const scoreLabel = document.createElement('div');
  scoreLabel.style.fontSize = '11px';
  scoreLabel.style.color = '#94a3b8';
  scoreLabel.style.textTransform = 'uppercase';
  scoreLabel.style.letterSpacing = '0.5px';
  scoreLabel.textContent = 'Trust Score';
  const scoreValue = document.createElement('div');
  scoreValue.style.fontSize = '32px';
  scoreValue.style.fontWeight = '900';
  scoreValue.style.color = '#fff';
  scoreValue.style.marginTop = '4px';
  scoreValue.textContent = `${score} / 100`;
  
  scoreLeft.appendChild(scoreLabel);
  scoreLeft.appendChild(scoreValue);

  const riskBadge = document.createElement('div');
  riskBadge.style.padding = '8px 16px';
  riskBadge.style.borderRadius = '12px';
  riskBadge.style.fontSize = '12px';
  riskBadge.style.fontWeight = '800';
  riskBadge.style.color = riskColor;
  riskBadge.style.background = riskBg;
  riskBadge.style.border = `1px solid rgba(${risk === 'LOW' ? '16,185,129' : risk === 'MEDIUM' ? '245,158,11' : '239,68,68'}, 0.2)`;
  riskBadge.textContent = `${risk} RISK`;

  scoreBlock.appendChild(scoreLeft);
  scoreBlock.appendChild(riskBadge);
  overlay.appendChild(scoreBlock);

  // AI Summary Block
  const summaryBlock = document.createElement('div');
  const summaryTitle = document.createElement('div');
  summaryTitle.style.fontSize = '12px';
  summaryTitle.style.fontWeight = '700';
  summaryTitle.style.color = '#cbd5e1';
  summaryTitle.style.marginBottom = '6px';
  summaryTitle.textContent = 'Security Summary';
  const summaryBody = document.createElement('p');
  summaryBody.style.margin = '0';
  summaryBody.style.fontSize = '12px';
  summaryBody.style.lineHeight = '1.5';
  summaryBody.style.color = '#94a3b8';
  summaryBody.textContent = summary;
  
  summaryBlock.appendChild(summaryTitle);
  summaryBlock.appendChild(summaryBody);
  overlay.appendChild(summaryBlock);

  // Red Flags Block (If any)
  if (redFlags && redFlags.length > 0) {
    const flagsBlock = document.createElement('div');
    const flagsTitle = document.createElement('div');
    flagsTitle.style.fontSize = '12px';
    flagsTitle.style.fontWeight = '700';
    flagsTitle.style.color = '#f87171';
    flagsTitle.style.marginBottom = '8px';
    flagsTitle.textContent = 'Detected Red Flags';
    
    const flagsList = document.createElement('div');
    flagsList.style.display = 'flex';
    flagsList.style.flexDirection = 'column';
    flagsList.style.gap = '6px';

    redFlags.forEach(flag => {
      const item = document.createElement('div');
      item.style.display = 'flex';
      item.style.gap = '8px';
      item.style.fontSize = '12px';
      item.style.color = '#f87171';
      item.style.background = 'rgba(239, 68, 68, 0.05)';
      item.style.padding = '8px 12px';
      item.style.borderRadius = '8px';
      
      const dot = document.createElement('span');
      dot.textContent = '⚠️';
      const text = document.createElement('span');
      text.textContent = flag;
      
      item.appendChild(dot);
      item.appendChild(text);
      flagsList.appendChild(item);
    });

    flagsBlock.appendChild(flagsTitle);
    flagsBlock.appendChild(flagsList);
    overlay.appendChild(flagsBlock);
  }

  // Footer Link
  const footer = document.createElement('div');
  footer.style.textAlign = 'center';
  footer.style.marginTop = '8px';
  
  const dashboardLink = document.createElement('a');
  dashboardLink.href = 'http://localhost:3000/app?tab=history';
  dashboardLink.target = '_blank';
  dashboardLink.textContent = 'View Scan History';
  Object.assign(dashboardLink.style, {
    fontSize: '12px',
    color: '#38bdf8',
    textDecoration: 'none',
    fontWeight: '700'
  });
  
  footer.appendChild(dashboardLink);
  overlay.appendChild(footer);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function isJobPage(urlStr) {
  try {
    const url = new URL(urlStr);
    const host = url.hostname;
    const path = url.pathname;
    
    if (host.includes('linkedin.com')) {
      return path.includes('/jobs/') || url.searchParams.has('currentJobId');
    }
    if (host.includes('indeed.com')) {
      return path.includes('/viewjob') || url.searchParams.has('jk');
    }
    if (host.includes('naukri.com')) {
      return path.includes('/job-listings') || path.includes('/jd/');
    }
    if (host.includes('foundit.in')) {
      return path.includes('/detail/') || path.includes('/job/');
    }
    if (host.includes('internshala.com')) {
      return path.includes('/internship/detail/') || path.includes('/job/detail/');
    }
    return false;
  } catch (e) {
    return false;
  }
}

let lastUrl = '';
function checkPage() {
  const currentUrl = window.location.href;
  if (currentUrl === lastUrl) return;
  lastUrl = currentUrl;
  
  if (isJobPage(currentUrl)) {
    initFloatingButton();
    const btn = document.getElementById('jobscan-floating-btn');
    if (btn) btn.style.display = 'flex';
  } else {
    const btn = document.getElementById('jobscan-floating-btn');
    if (btn) btn.style.display = 'none';
  }
}

// Check every 1 second
setInterval(checkPage, 1000);

// 5. Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkPage);
} else {
  checkPage();
}
