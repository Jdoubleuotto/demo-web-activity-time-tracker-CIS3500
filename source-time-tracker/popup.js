document.addEventListener('DOMContentLoaded', function() {
    const healthBar = document.getElementById('healthBar'); // Get the health bar for Chromagotchi
    const infoDiv = document.getElementById('tabInfo');
    const urlTimes = document.getElementById('urlTimes');
    const dogImage = document.getElementById('dogImage'); // Get the image element for displaying the dog

    document.body.style.backgroundColor = 'purple'; // Set the background color of the popup

    function updateTabInfo() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;

                chrome.storage.local.get({visitedUrls: []}, function(result) {
                    const visitedUrls = result.visitedUrls;
                    visitedUrls.push({title: currentTab.title, url: currentTab.url, time: new Date().toISOString()});

                    chrome.storage.local.set({visitedUrls: visitedUrls}, function() {
                        displayUrlTimesAndUpdateHealth(visitedUrls);
                    });
                });
            } else {
                infoDiv.textContent = 'No active tab found.';
            }
        });
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
        });

        updateChromagotchiHealth(totalSeconds);
        displayVisitedTimes(urlMap);
    }

    function updateChromagotchiHealth(seconds) {
        let health = Math.min(100, seconds / 3600);
        healthBar.style.width = `${health}%`;
        healthBar.textContent = `Health: ${Math.round(health)}%`;
    }

    function displayVisitedTimes(urlMap) {
        urlTimes.innerHTML = '<h4>Visited URLs with Total Time Spent:</h4>';
        urlMap.forEach((totalSeconds, url) => {
            urlTimes.innerHTML += `<p>URL: ${url}<br>Total Time Spent: ${Math.round(totalSeconds)} seconds</p>`;
        });
    }

    // Load the dog image
    dogImage.src = 'dog.png'; // Set the source for the dog image

    updateTabInfo();
});
