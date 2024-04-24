document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const visitedUrlsDiv = document.getElementById('visitedUrlsList'); // Get the div for displaying visited URLs
    const printButton = document.getElementById('printButton');
    const urlTimes = document.getElementById('urlTimes');

    // Function to fetch and display current tab information and store it
    function updateTabInfo() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;
                console.log(`Title: ${currentTab.title}\nURL: ${currentTab.url}`);

                // Use chrome.storage.local to retrieve the current list of URLs
                chrome.storage.local.get({visitedUrls: []}, function(result) {
                    const visitedUrls = result.visitedUrls;
                    visitedUrls.push({title: currentTab.title, url: currentTab.url, time: new Date().toISOString()});

                    // Update the stored list and display in popup
                    chrome.storage.local.set({visitedUrls: visitedUrls}, function() {
                        console.log('Updated visited URLs:', visitedUrls);
                        // displayVisitedUrls(visitedUrls); // Display visited URLs in the popup
                        displayUrlTimes(visitedUrls);
                    });
                });
            } else {
                infoDiv.textContent = 'No active tab found.';
            }
        });
    }

    // Function to display visited URLs in the popup
    function displayUrlTimes(visitedUrls) {
        const urlMap = new Map();
        
        // Populate the map with time differences between visits
        visitedUrls.forEach((urlInfo, index) => {
            if (!urlMap.has(urlInfo.url)) {
                urlMap.set(urlInfo.url, []);
            }
            if (index < visitedUrls.length - 1) {
                const nextVisitTime = new Date(visitedUrls[index + 1].time);
                const currentVisitTime = new Date(urlInfo.time);
                // const parsedNext = nextVisitTime.slice(11,19)
                // const parsedCurrent = currentVisitTime.slice(11,19)
                const diffSeconds = (nextVisitTime - currentVisitTime) / 1000;
                urlMap.get(urlInfo.url).push(urlMap.get(urlInfo.url) + diffSeconds);
            }
        });

        // Format the display of URLs and their time differences
        urlTimes.innerHTML = '<h4>Visited URLs with Time Differences:</h4>';
        urlMap.forEach((differences, url) => {
            urlTimes.innerHTML += `<p>URL: ${url}<br>Time Differences: ${differences} </p>`;
        });
    }

    
    
    function displayVisitedUrls(visitedUrls) {
        visitedUrlsDiv.innerHTML = '<h4>Visited URLs:</h4>';
        visitedUrls.forEach(urlInfo => {
            visitedUrlsDiv.innerHTML += `<p>Title: ${urlInfo.title}<br>URL: ${urlInfo.url}<br>Time: ${urlInfo.time}</p>`;
        });
    }

    // Call updateTabInfo to populate info when popup is opened
    updateTabInfo();

    // Print the current tab info when the button is clicked
    printButton.addEventListener('click', function() {
        window.print();
    });

    // Initially display the visited URLs stored so far
    chrome.storage.local.get('visitedUrls', function(result) {
        displayVisitedUrls(result.visitedUrls);
    });
});
