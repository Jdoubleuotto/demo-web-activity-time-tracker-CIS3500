chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.active) {
        let parsedUrl = new URL(tab.url).hostname;

        chrome.storage.local.get({visitedUrls: []}, function(result) {
            const visitedUrls = result.visitedUrls;
            visitedUrls.push({title: tab.title, url: parsedUrl, time: new Date().toISOString()});

            chrome.storage.local.set({visitedUrls: visitedUrls});
        });
    }
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        let parsedUrl = new URL(tab.url).hostname;

        chrome.storage.local.get({visitedUrls: []}, function(result) {
            const visitedUrls = result.visitedUrls;
            visitedUrls.push({title: tab.title, url: parsedUrl, time: new Date().toISOString()});

            chrome.storage.local.set({visitedUrls: visitedUrls});
        });
    });
});
