document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['tabs'], function(result) {
        if (result.tabs) {
            displayTabs(Object.values(result.tabs)); // Assuming tabs data is stored as an object
        } else {
            console.log('No tabs data found.');
        }
    });

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (changes.tabs && namespace === 'local') {
            displayTabs(Object.values(changes.tabs.newValue));
        }
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    curTabID = activeInfo.tabId;  // Set the current tab ID based on the activated tab
    chrome.tabs.get(activeInfo.tabId, function(tab) {
        curWinID = tab.windowId;  // Set the window ID from the tab details

        // Logging the current tab ID and window ID to the console for debugging
        console.log("Current Tab ID: " + curTabID);
        console.log("Current Window ID: " + curWinID);
    });
});


// document.addEventListener('DOMContentLoaded', function() {
//     const tabsList = document.getElementById('tabs-list');

//     // Query all tabs and display them
//     chrome.tabs.query({}, function(tabs) {
//         tabs.forEach(tab => {
//             const tabElement = document.createElement('div');
//             tabElement.textContent = `${tab.title} - ${tab.url}`;
//             tabsList.appendChild(tabElement);
//         });
//     });
// });


function displayTabs(tabs) {
    const container = document.getElementById('tabs-list');
    container.innerHTML = '';
    tabs.forEach(tab => {
        const li = document.createElement('li');
        const urlDiv = document.createElement('div');
        const timeDiv = document.createElement('div');

        urlDiv.textContent = `URL: ${tab.url}`;
        timeDiv.textContent = `Time Spent: ${tab.timeSpent.toFixed(2)} seconds`;

        urlDiv.classList.add('url');
        timeDiv.classList.add('time');

        li.appendChild(urlDiv);
        li.appendChild(timeDiv);
        container.appendChild(li);
    });
}
