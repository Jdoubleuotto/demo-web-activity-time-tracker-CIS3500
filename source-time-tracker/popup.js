document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const printButton = document.getElementById('printButton');
    const visitedUrlsDiv = document.getElementById('visitedUrlsList'); // Get the div for visited URLs

    function updateTabInfo() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;
                console.log(`Title: ${currentTab.title}\nURL: ${currentTab.url}`);

                chrome.storage.local.get({visitedUrls: []}, function(result) {
                    const visitedUrls = result.visitedUrls;
                    visitedUrls.push({title: currentTab.title, url: currentTab.url, time: new Date().toISOString()});

                    chrome.storage.local.set({visitedUrls: visitedUrls}, function() {
                        console.log('Updated visited URLs:', visitedUrls);
                        updateVisitedUrlsList(visitedUrls); // Update the list on popup
                    });
                });
            } else {
                infoDiv.textContent = 'No active tab found.';
            }
        });
    }

    function updateVisitedUrlsList(visitedUrls) {
        visitedUrlsDiv.innerHTML = 'Visited URLs:<br>'; // Clear and title
        visitedUrls.forEach(function(urlInfo) {
            visitedUrlsDiv.innerHTML += `${urlInfo.url}<br>`; // Append each URL
        });
    }

    // Initially load and display the visited URLs
    chrome.storage.local.get('visitedUrls', function(result) {
        if (result.visitedUrls) {
            updateVisitedUrlsList(result.visitedUrls);
        }
    });

    printButton.addEventListener('click', function() {
        window.print();
    });
});
