// Import necessary components for tab tracking
import { injectTabsRepositorySingleton } from './repository/inject-tabs-repository';
import { initTracker } from './tracker-updated';
import { isValidPage } from './utils';

// Initialize a Set to store unique URLs and the tracker
const uniqueUrls = new Set();
initTracker();

// Function to add URLs to the Set
function addUniqueUrl(url) {
    if (url && !url.startsWith('chrome://')) {
        uniqueUrls.add(url);
        console.log(`URL added: ${url}`);
    }
}

// Listen for tabs being updated to catch complete URLs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        addUniqueUrl(tab.url);
    }
});

// Listen for new tabs being activated to add their URL to the Set
chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        addUniqueUrl(tab.url);
    });
});

// Handle messages from the popup to send back unique URLs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getUrls") {
        sendResponse({urls: Array.from(uniqueUrls)});
    }
    return true; // Indicate that we wish to send a response asynchronously
});

// Function to handle tab tracking
async function trackTime() {
    const repo = await injectTabsRepositorySingleton();
    const window = await chrome.windows.getLastFocused({ populate: true });
    if (window.focused) {
        const activeTab = window.tabs.find(t => t.active);
        if (activeTab && isValidPage(activeTab.url)) {
            const activeDomain = new URL(activeTab.url).hostname;
            let tab = repo.getTab(activeDomain);
            if (!tab) {
                tab = await repo.addTab(activeDomain);
            }
            tab.updateTimeSpent(); // Assume this method tracks time spent on the tab
            repo.saveTab(tab);
        }
    }
}

// Function to save tabs data periodically
async function saveTabs() {
    const storage = chrome.storage.local;
    const repo = await injectTabsRepositorySingleton();
    const tabs = repo.getTabs();
    await storage.set({tabs: tabs}); // Save the tabs data to local storage
}

// Schedule periodic saving of tabs data
setInterval(saveTabs, 10000); // Save tabs data every 10 seconds
