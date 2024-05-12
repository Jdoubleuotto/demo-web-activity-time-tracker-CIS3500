document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const healthBar = document.getElementById('currentHealth'); // Adjusted to target the child element
    const goodTimeSpentDisplay = document.getElementById('goodTimeSpent');
    const badTimeSpentDisplay = document.getElementById('badTimeSpent');
    const urlTimes = document.getElementById('urlTimes');
    const displayTimes = document.getElementById('displayTimes');

    const goodUrls = ['www.linkedin.com', 'www.tradingview.com'];
    const badUrls = ['www.instagram.com', 'www.youtube.com'];

    function fetchTabInfoAndUpdateStorage() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                let parsedUrl = new URL(currentTab.url).hostname;
                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${parsedUrl}`;

                chrome.storage.local.get({visitedUrls: []}, function(result) {
                    const visitedUrls = result.visitedUrls;
                    const newVisit = {title: currentTab.title, url: parsedUrl, time: new Date().toISOString()};

                    if (!visitedUrls.length || visitedUrls[visitedUrls.length - 1].url !== parsedUrl) {
                        visitedUrls.push(newVisit);
                        chrome.storage.local.set({visitedUrls}, function() {
                            calculateTimeAndDisplay(visitedUrls);
                        });
                    } else {
                        calculateTimeAndDisplay(visitedUrls);
                    }
                });
            } else {
                infoDiv.textContent = 'No active tab found or URL is not trackable.';
            }
        });
    }

    function calculateTimeAndDisplay(visitedUrls) {
        let goodTimeSpent = 0;
        let badTimeSpent = 0;
        visitedUrls.forEach((visit, index) => {
            if (index > 0) {
                let currentVisitTime = new Date(visit.time);
                let previousVisitTime = new Date(visitedUrls[index - 1].time);
                let timeDiff = (currentVisitTime - previousVisitTime) / 1000;
                if (goodUrls.includes(visit.url)) {
                    goodTimeSpent += timeDiff;
                } else if (badUrls.includes(visit.url)) {
                    badTimeSpent += timeDiff;
                }
            }
        });

        updateHealth(goodTimeSpent, badTimeSpent);
        displayVisitedTimes(visitedUrls, goodTimeSpent, badTimeSpent);
    }

    function updateHealth(goodTime, badTime) {
        let baseHealth = 50;
        let healthChange = Math.floor(goodTime / 100) - Math.floor(badTime / 100);
        let currentHealth = Math.min(100, Math.max(0, baseHealth + healthChange));
        healthBar.style.width = `${currentHealth}%`;
        healthBar.textContent = `Health: ${Math.round(currentHealth)}%`;
    }

    function displayVisitedTimes(visitedUrls, goodTime, badTime) {
        urlTimes.innerHTML = '<h4>Visited URLs with Total Time Spent:</h4>';
        visitedUrls.forEach((visit) => {
            urlTimes.innerHTML += `<p>${visit.url}<br>Total Time Spent: ${Math.round(visit.time)} seconds</p>`;
        });
        displayTimes.innerHTML = `<p>Good Time Spent: ${Math.round(goodTime)} seconds</p>`;
        displayTimes.innerHTML += `<p>Bad Time Spent: ${Math.round(badTime)} seconds</p>`;
    }

    fetchTabInfoAndUpdateStorage();
});
