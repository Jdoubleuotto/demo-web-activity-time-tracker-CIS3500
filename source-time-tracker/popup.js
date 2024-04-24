document.addEventListener('DOMContentLoaded', function() {
    const infoDiv = document.getElementById('tabInfo');
    const printButton = document.getElementById('printButton');
    const visitedUrlsDiv = document.getElementById('visitedUrlsList'); // Get the div for displaying visited URLs

    let lastVisited = { url: null, title: null, startTime: new Date().getTime() }; // Tracks the last visited URL and start time
    let urlDurations = {}; // Hashmap to store durations spent on each URL

    // Function to fetch and display current tab information and store it
    function updateTabInfo() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let currentTab = tabs[0];
            if (currentTab) {
                let now = new Date().getTime(); // Current time
                if (lastVisited.url) {
                    // Calculate time spent on the last visited URL
                    let duration = now - lastVisited.startTime;
                    if (lastVisited.url in urlDurations) {
                        urlDurations[lastVisited.url] += duration; // Increment existing duration
                    } else {
                        urlDurations[lastVisited.url] = duration; // Set initial duration
                    }
                }

                // Update last visited with current tab info
                lastVisited = {
                    url: currentTab.url,
                    title: currentTab.title,
                    startTime: now
                };

                infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;
                console.log(`Title: ${currentTab.title}\nURL: ${currentTab.url}`);

                // Update visited URLs display and storage
                chrome.storage.local.get({visitedUrls: []}, function(result) {
                    const visitedUrls = result.visitedUrls;
                    visitedUrls.push({title: currentTab.title, url: currentTab.url, time: new Date().toISOString()});

                    // Update the stored list
                    chrome.storage.local.set({visitedUrls: visitedUrls}, function() {
                        console.log('Updated visited URLs:', visitedUrls);
                        displayVisitedUrls(visitedUrls); 
                    });
                });
            } else {
                infoDiv.textContent = 'No active tab found.';
            }
        });
    }

    // Function to display visited URLs and their durations
    function displayVisitedUrls(visitedUrls) {
        visitedUrlsDiv.innerHTML = '<h4>Visited URLs:</h4>';
        for (let [url, duration] of Object.entries(urlDurations)) {
            visitedUrlsDiv.innerHTML += `<p>URL: ${url}<br>Time Spent: ${duration / 1000} seconds</p>`;
        }
    }

    // Call updateTabInfo to populate info when popup is opened
    updateTabInfo();

    // Print the current tab info and URL durations when the button is clicked
    printButton.addEventListener('click', function() {
        window.print();
    });

    // Initially display the visited URLs stored so far
    chrome.storage.local.get('visitedUrls', function(result) {
        console.table(result.visitedUrls);
    });
});
