chrome.tabs.onCreated.addListener((tab) => {
  // if (tab.url.startsWith("http")) {
  //   addUrlToStorage(tab.url);
  // }
  addUrlToStorage(tab.url);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // if (changeInfo.url && tab.url.startsWith("http")) {
  //   addUrlToStorage(tab.url);
  // }
  if (changeInfo.url)) {
    addUrlToStorage(tab.url);
  }
});

function addUrlToStorage(url) {
  chrome.storage.local.get({ urls: [] }, (result) => {
    const updatedUrls = [...result.urls, { url, timestamp: Date.now() }];
    chrome.storage.local.set({ urls: updatedUrls });
  });
}
