import { LocalStorage } from './path/to/LocalStorage'; // Adjust path as necessary

document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const printButton = document.getElementById('printButton');
    const urlsDiv = document.getElementById('urlsList');
    const storage = new LocalStorage();
    let visitedUrls = []; // Array to store visited URLs

    // Function to fetch and display current tab information
    function updateTabInfo() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;
            } else {
                infoDiv.textContent = 'No active tab found.';
            }
        });
    }

    // Function to update visited URLs
    function updateURLs() {
        chrome.runtime.sendMessage({type: "getUrls"}, function(response) {
            urlsDiv.innerHTML = ''; // Clear previous entries
            if (response && response.urls) {
                visitedUrls = response.urls; // Update visitedUrls here
                displayVisitedUrls(); // Call display function right after updating
            } else {
                urlsDiv.textContent = 'No unique URLs tracked in this session.';
            }
        });
    }

    // Function to display URLs from the visitedUrls array
    async function displayVisitedUrls() {
        const visitedUrls = await storage.getValue('visitedUrls', []); // Fetch the stored URLs with a default empty array
        urlsDiv.innerHTML = ''; // Clear existing content

        if (visitedUrls.length > 0) {
            visitedUrls.forEach(url => {
                const urlElement = document.createElement('p');
                urlElement.textContent = url;
                urlsDiv.appendChild(urlElement);
            });
        } else {
            urlsDiv.textContent = 'No URLs visited in this session.';
        }
    }

    // Populate info when popup is opened
    updateTabInfo();
    updateURLs();

    // Print the current tab info when the button is clicked
    printButton.addEventListener('click', function() {
        window.print();
    });
});
