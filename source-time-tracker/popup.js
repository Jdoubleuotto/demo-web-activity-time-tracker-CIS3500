document.addEventListener('DOMContentLoaded', function() {
    const healthBar = document.getElementById('currentHealth'); // Ensure this ID matches the health bar div
    const infoDiv = document.getElementById('tabInfo');
    const urlTimes = document.getElementById('urlTimes');

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

    function updateChromagotchiHealth(totalSeconds) {
        const maxHealthTime = 3600; // Maximum seconds that correspond to 100% health
        let healthPercentage = Math.min(100, (totalSeconds / maxHealthTime) * 100);
        healthBar.style.width = `${healthPercentage}%`;
        healthBar.textContent = `Health: ${Math.round(healthPercentage)}%`;
    }

    function displayVisitedTimes(urlMap) {
        urlTimes.innerHTML = '<h4>Visited URLs with Total Time Spent:</h4>';
        urlMap.forEach((totalSeconds, url) => {
            urlTimes.innerHTML += `<p>URL: ${url}<br>Total Time Spent: ${Math.round(totalSeconds)} seconds</p>`;
        });
    }

    updateTabInfo();
});
