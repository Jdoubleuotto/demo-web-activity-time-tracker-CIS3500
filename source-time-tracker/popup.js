document.addEventListener('DOMContentLoaded', function() {
  const infoDiv = document.getElementById('tabInfo');
  const urlsDiv = document.getElementById('urlsList');
  const printButton = document.getElementById('printButton');
  let visitedUrls = []; // Array to store the visited URLs

  // Function to fetch and display current tab information
  function updateTabInfo() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let currentTab = tabs[0];
      if (currentTab) {
        infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;
        vistedUrls.push(currentTab.url);
      } else {
        infoDiv.textContent = 'No active tab found.';
      }
    });
  }

  // Function to fetch and display all unique URLs
  function updateURLs() {
    chrome.runtime.sendMessage({type: "getUrls"}, function(response) {
      if (response && response.urls) {
        visitedUrls = response.urls; // Store the URLs in the visitedUrls array
        displayVisitedUrls(); // Call function to display URLs
      } else {
        urlsDiv.textContent = 'Failed to retrieve URLs or no URLs present.';
      }
    });
  }

  // Function to display URLs from the visitedUrls array
  function displayVisitedUrls() {
    urlsDiv.innerHTML = ''; // Clear existing content
    if (visitedUrls.length > 0) {
      visitedUrls.forEach(url => {
        const urlElement = document.createElement('p');
        urlElement.textContent = url;
        urlsDiv.appendChild(urlElement);
      });
    } else {
      urlsDiv.textContent = 'No unique URLs tracked in this session.';
    }
  }

  // Populate info when popup is opened
  updateTabInfo();
  updateURLs();
  displayVisitedUrls();

  // Print the current tab info along with visited URLs when the button is clicked
  printButton.addEventListener('click', function() {
    window.print();
  });
});
