// Assuming necessary imports and class definitions for LocalStorage are already integrated

// Instantiate the LocalStorage to use for fetching the data
const storage = new LocalStorage();

// Function to render tabs data from local storage directly
function renderTabsData(tabsData) {
  const tabsListElement = document.getElementById('tabs-list');
  tabsListElement.innerHTML = ''; // Clear current list

  if (tabsData && tabsData.length > 0) {
    // Create list items for each tab's data and append them to the list
    tabsData.forEach(tab => {
      const listItem = document.createElement('li');
      listItem.textContent = `URL: ${tab.url}, Time Spent: ${tab.timeSpent} seconds`;
      tabsListElement.appendChild(listItem);
    });
  } else {
    tabsListElement.textContent = "No data available";
  }
}

// Function to handle message responses for tab data
function handleTabDataMessage(response) {
  if (response && response.tabs) {
    renderTabsData(response.tabs);
  } else {
    console.error("No tab data received.");
  }
}

// Combined DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
  // Fetch and render tabs data on popup load directly from LocalStorage
  storage.getTabsTimeAndUrl().then(renderTabsData);

  // Optionally request tab data via messaging from the background script
  chrome.runtime.sendMessage({action: "getTabsData"}, handleTabDataMessage);
});

// This part of the code would be in your background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getTabsData") {
    storage.getTabsTimeAndUrl().then(tabs => {
      sendResponse({tabs: tabs});
    });
    return true; // Indicate that the response is async
  }
});
