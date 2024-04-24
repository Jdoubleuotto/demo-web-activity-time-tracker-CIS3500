document.addEventListener('DOMContentLoaded', function() {
  const infoDiv = document.getElementById('tabInfo');
  const urlsDiv = document.getElementById('urlsList');
  const printButton = document.getElementById('printButton');
  let visitedUrls = []; // Array to store the visited URLs

  // Function to fetch and display current tab information
  // function updateTabInfo() {
  //   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //     let currentTab = tabs[0];
  //     if (currentTab) {
  //       infoDiv.textContent = `Title: ${currentTab.title}\nURL: ${currentTab.url}`;
  //     } else {
  //       infoDiv.textContent = 'No active tab found.';
  //     }
  //   });
  // }

//   chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     if (changeInfo.status === 'complete') {
//         console.log(`Visited URL: ${tab.url}`);
//       }
//   });

// chrome.tabs.onActivated.addListener(activeInfo => {
//     chrome.tabs.get(activeInfo.tabId, function(tab) {
//         console.log(`Switched to URL: ${tab.url}`);
//       });
//   });
//   chrome.webNavigation.onCompleted.addListener(function(details) {
//     chrome.tabs.get(details.tabId, function(tab) {
//         console.log(`Navigation completed to URL: ${tab.url}`);
//       });
//   });



  // Function to update visited URLs
function updateURLs() {
    chrome.runtime.sendMessage({type: "getUrls"}, function(response) {
        const urlsDiv = document.getElementById('urlsList');
        urlsDiv.innerHTML = ''; // Clear previous entries
        if (response && response.urls) {
            response.urls.forEach(url => {
                let urlElement = document.createElement('p');
                urlElement.textContent = url;
                urlsDiv.appendChild(urlElement);
            });
        } else {
            urlsDiv.textContent = 'No unique URLs tracked in this session.';
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
  printButton.getElementById.addEventListener('click', function() {
    window.print();
  });
});
