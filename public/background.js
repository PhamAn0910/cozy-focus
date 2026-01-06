// Window Seat Background Service Worker
// Handles website blocking using declarativeNetRequest

const RULE_ID_START = 1;

// Listen for alarm (session end - auto-unlock)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'sessionEnd') {
    // Auto-unlock: remove all blocking rules
    clearBlockingRules();
    
    // Update storage to reflect unlocked state
    chrome.storage.local.get(['totalFocusSeconds', 'sessionStartTime'], (result) => {
      const sessionDuration = result.sessionStartTime 
        ? Math.floor((Date.now() - result.sessionStartTime) / 1000)
        : 0;
      
      chrome.storage.local.set({
        isLocked: false,
        sessionStartTime: null,
        sessionEndTime: null,
        totalFocusSeconds: (result.totalFocusSeconds || 0) + sessionDuration,
      });
    });
  }
});

// Listen for messages from the new tab page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_BLOCKLIST') {
    updateBlockingRules(message.domains);
    sendResponse({ success: true });
  } else if (message.type === 'CLEAR_BLOCKLIST') {
    clearBlockingRules();
    sendResponse({ success: true });
  } else if (message.type === 'GET_FOCUS_STATE') {
    chrome.storage.local.get(['isLocked', 'blockedDomains', 'totalFocusSeconds'], (result) => {
      sendResponse(result);
    });
    return true; // Keep channel open for async response
  }
});

async function updateBlockingRules(domains) {
  if (!domains || domains.length === 0) {
    await clearBlockingRules();
    return;
  }

  // Remove existing rules first
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);
  
  if (existingRuleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    });
  }

  // Create new rules
  const rules = domains.map((domain, index) => ({
    id: RULE_ID_START + index,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: {
        extensionPath: '/blocked.html'
      }
    },
    condition: {
      urlFilter: `||${domain}`,
      resourceTypes: ['main_frame']
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: rules
  });

  // Store the blocked domains
  await chrome.storage.local.set({ 
    blockedDomains: domains,
    isLocked: true 
  });
}

async function clearBlockingRules() {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingRuleIds = existingRules.map(rule => rule.id);
  
  if (existingRuleIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingRuleIds
    });
  }

  await chrome.storage.local.set({ isLocked: false });
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    isLocked: false,
    blockedDomains: ['twitter.com', 'reddit.com', 'youtube.com'],
    totalFocusSeconds: 0
  });
  // Default: don't replace new tab
  chrome.storage.sync.set({ replaceNewTab: false });
});

// Open extension page when clicking the extension icon
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') });
});

// Listen for new tab setting changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_NEW_TAB_SETTING') {
    chrome.storage.sync.set({ replaceNewTab: message.replaceNewTab });
    sendResponse({ success: true });
  }
  return true;
});

// Check if we should redirect new tabs to the extension
chrome.tabs.onCreated.addListener((tab) => {
  chrome.storage.sync.get(['replaceNewTab'], (result) => {
    if (result.replaceNewTab && (tab.pendingUrl === 'chrome://newtab/' || tab.url === 'chrome://newtab/')) {
      chrome.tabs.update(tab.id, { url: chrome.runtime.getURL('index.html') });
    }
  });
});

