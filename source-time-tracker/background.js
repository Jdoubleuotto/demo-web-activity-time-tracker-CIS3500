// Import necessary components for tab tracking
import { injectTabsRepositorySingleton } from './repository/inject-tabs-repository';
import { initTracker } from './tracker-updated';
import { isValidPage } from './utils';

// Initialize tab tracking and unique URLs storage
const uniqueUrls = new Set();
initTracker();

// Add URL to the unique URLs Set if valid and not already present
function addUniqueUrl(url) {
    if (url && !url.startsWith('chrome://') && !uniqueUrls.has(url)) {
        uniqueUrls.add(url);
        console.log(`URL added: ${url}`);
    }
}

// Track time spent on tabs and periodically save tab data
async function trackTimeAndSave() {
    const repo = await injectTabsRepositorySingleton();
    const storage = chrome.storage.local;

    // Track time on the active tab if it's a valid page
    const window = await chrome.windows.getLastFocused({ populate: true });
    if (window.focused) {
        const activeTab = window.tabs.find(t => t.active);
        if (activeTab && isValidPage(activeTab.url)) {
            const activeDomain = new URL(activeTab.url).hostname;
            let tab = repo.getTab(activeDomain);
            if (!tab) {
                tab = await repo.addTab(activeDomain);
            }
            tab.updateTimeSpent();
            repo.saveTab(tab);
        }
    }

    // Save the tabs data to local storage periodically
    const tabs = repo.getTabs();
    await storage.set({ tabs: tabs });
}

// Event listeners for tab creation, update, and activation
chrome.tabs.onCreated.addListener(tab => addUniqueUrl(tab.url));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        addUniqueUrl(tab.url);
    }
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, tab => addUniqueUrl(tab.url));
});

// Respond to messages from the popup requesting unique URLs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getUrls") {
        sendResponse({ urls: Array.from(uniqueUrls) });
    }
    return true;  // Indicate asynchronous response
});

// Schedule periodic tracking and saving of tab data
setInterval(trackTimeAndSave, 10000);  // Execute every 10 seconds
