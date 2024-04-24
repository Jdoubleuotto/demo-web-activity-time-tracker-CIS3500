document.addEventListener('DOMContentLoaded', function() {
  const infoDiv = document.getElementById('tabInfo');
  const printButton = document.getElementById('printButton');
  const urlsDiv = document.getElementById('urlsList');

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
    // Function to update visited URLs
// function updateURLs() {
//     chrome.runtime.sendMessage({type: "getUrls"}, function(response) {
//         const urlsDiv = document.getElementById('urlsList');
//         urlsDiv.innerHTML = ''; // Clear previous entries
//         if (response && response.urls) {
//             response.urls.forEach(url => {
//                 let urlElement = document.createElement('p');
//                 urlElement.textContent = url;
//                 urlsDiv.appendChild(urlElement);
//             });
//         } else {
//             urlsDiv.textContent = 'No unique URLs tracked in this session.';
//         }
//     });
// }

//   // Function to display URLs from the visitedUrls array
//   function displayVisitedUrls() {
//     urlsDiv.innerHTML = ''; // Clear existing content
//     if (visitedUrls.length > 0) {
//       visitedUrls.forEach(url => {
//         const urlElement = document.createElement('p');
//         urlElement.textContent = url;
//         urlsDiv.appendChild(urlElement);
//       });
//     } else {
//       urlsDiv.textContent = 'No unique URLs tracked in this session.';
//     }
//   }

  // Call updateTabInfo to populate info when popup is opened
  updateTabInfo();

  // Print the current tab info when the button is clicked
  printButton.addEventListener('click', function() {
    window.print();
  });
});
