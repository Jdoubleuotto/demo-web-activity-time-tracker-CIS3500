document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const visitedUrlsDiv = document.getElementById('visitedUrlsList'); // Get the div for displaying visited URLs
    const printButton = document.getElementById('printButton');
    const urlTimes = document.getElementById('urlTimes');

    const goodUrls = ['www.linkedin.com', 'www.tradingview.com']; // Array of good URLs
    const badUrls = ['www.instagram.com', 'www.youtube.com']; // Array of bad URLs

    // Function to fetch and display current tab information and store it
    function updateTabInfo() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                let parsedUrl = new URL(currentTab.url).hostname; // Parse and get the hostname
                console.log(`Title: ${currentTab.title}\nURL: ${currentTab.url}`);
                // Use chrome.storage.local to retrieve the current list of URLs
                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${parsedUrl}`;
                chrome.storage.local.get({visitedUrls: []}, function(result) {
                    const visitedUrls = result.visitedUrls;
                    visitedUrls.push({title: currentTab.title, url: parsedUrl, time: new Date().toISOString()});
                    
                    chrome.storage.local.set({visitedUrls: visitedUrls}, function() {
                        displayUrlTimesAndUpdateHealth(visitedUrls);
                    });
                });
            } else {
                infoDiv.textContent = 'No active tab found or URL is not trackable.';
            }
        });
    }


    function parseUrl(url) {
        let urlObject = new URL(url);
        return urlObject.hostname; // Returns the domain name without path
    }

    function displayUrlTimesAndUpdateHealth(visitedUrls) {
        let totalSeconds = 0;
        const urlMap = new Map();

        visitedUrls.forEach((urlInfo, index) => {
            if (!urlMap.has(urlInfo.url)) {
                urlMap.set(urlInfo.url, 0);
            }
            if (index < visitedUrls.length - 1) {
                const nextVisitTime = new Date(visitedUrls[index + 1].time);
                const currentVisitTime = new Date(urlInfo.time);
                const diffSeconds = (nextVisitTime - currentVisitTime) / 1000;
                urlMap.set(urlInfo.url, urlMap.get(urlInfo.url) + diffSeconds);
            }
        });

        urlMap.forEach((time, url) => {
            totalSeconds += time;
            if (goodUrls.includes(url)) {
                goodTimeSpent += time;
            } else if (badUrls.includes(url)) {
                badTimeSpent += time;
            }
        });

        updateChromagotchiHealth(totalSeconds);
        displayVisitedTimes(urlMap, goodTimeSpent, badTimeSpent);
    }

    function updateChromagotchiHealth(totalSeconds) {
        const maxHealthTime = 10000;
        let healthPercentage = (totalSeconds / maxHealthTime) * 100;
        healthBar.style.width = `${Math.min(100, healthPercentage)}%`;
        healthBar.textContent = `Health: ${Math.round(Math.min(100, healthPercentage))}%`;
    }

    function displayVisitedTimes(urlMap, goodTimeSpent, badTimeSpent) {
        urlTimes.innerHTML = `<h4>Visited URLs with Total Time Spent:</h4>`;
        urlMap.forEach((totalSeconds, url) => {
            urlTimes.innerHTML += `<p>URL: ${url}<br>Total Time Spent: ${Math.round(totalSeconds)} seconds</p>`;
        });
        urlTimes.innerHTML += `<p>Good Time Spent: ${Math.round(goodTimeSpent)} seconds</p>`;
        urlTimes.innerHTML += `<p>Bad Time Spent: ${Math.round(badTimeSpent)} seconds</p>`;
    }

    updateTabInfo();
});
