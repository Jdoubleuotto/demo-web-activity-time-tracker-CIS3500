document.addEventListener('DOMContentLoaded', function() {
  const infoDiv = document.getElementById('tabInfo');
  const urlsDiv = document.getElementById('urlsList');
  const printButton = document.getElementById('printButton');

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

  // Function to fetch and display all unique URLs
  function updateURLs() {
    chrome.runtime.sendMessage({type: "getUrls"}, function(response) {
      if (response && response.urls) {
        if (response.urls.length > 0) {
          response.urls.forEach(url => {
            const urlElement = document.createElement('p');
            urlElement.textContent = url;
            urlsDiv.appendChild(urlElement);
          });
        } else {
          urlsDiv.textContent = 'No unique URLs tracked in this session.';
        }
      } else {
        urlsDiv.textContent = 'Failed to retrieve URLs or no URLs present.';
      }
    });
  }

  // Populate info when popup is opened
  updateTabInfo();
  updateURLs();

  // Print the current tab info when the button is clicked
  printButton.addEventListener('click', function() {
    window.print();
  });
});
