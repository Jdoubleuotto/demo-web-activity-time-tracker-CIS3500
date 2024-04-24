document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const printButton = document.getElementById('printButton');
    const visitedUrlsList = document.getElementById('visitedUrlsList');

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
                        updateVisitedUrlsList(visitedUrls);
                    });
                });
            } else {
                infoDiv.textContent = 'No active tab found.';
            }
        });
    }

    function updateVisitedUrlsList(visitedUrls) {
        visitedUrlsList.innerHTML = ''; // Clear previous list
        visitedUrls.forEach(url => {
            let listItem = document.createElement('li');
            listItem.textContent = `Title: ${url.title}, URL: ${url.url}`;
            visitedUrlsList.appendChild(listItem);
        });
    }

    updateTabInfo();

    printButton.addEventListener('click', function() {
        window.print();
    });

    // Load and display the visited URLs upon opening the popup
    chrome.storage.local.get('visitedUrls', function(result) {
        if (result.visitedUrls) {
            updateVisitedUrlsList(result.visitedUrls);
        }
    });
});
