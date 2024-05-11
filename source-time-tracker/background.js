chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        updateUrlVisit(tab);
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        updateUrlVisit(tab);
    });
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        chrome.tabs.query({active: true, windowId: windowId}, function(tabs) {
            if (tabs[0]) {
                updateUrlVisit(tabs[0]);
            }
        });
    }
});

function updateUrlVisit(tab) {
    if (!tab.url || tab.url.startsWith('chrome://')) return;
    const parsedUrl = new URL(tab.url).hostname;

    chrome.storage.local.get({visitedUrls: []}, function(result) {
        const visitedUrls = result.visitedUrls;
        const currentTime = new Date().toISOString();

        if (visitedUrls.length === 0 || visitedUrls[visitedUrls.length - 1].url !== parsedUrl) {
            visitedUrls.push({title: tab.title, url: parsedUrl, time: currentTime});
            chrome.storage.local.set({visitedUrls});
        }
    });
}
