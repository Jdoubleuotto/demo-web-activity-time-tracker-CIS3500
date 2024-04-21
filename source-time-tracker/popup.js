// Include the imports and LocalStorage class definition from the previous code

// Instantiate the LocalStorage to use for fetching the data
const storage = new LocalStorage();

// Function to render tabs data
function renderTabsData(tabsData) {
  const tabsListElement = document.getElementById('tabs-list');
  tabsListElement.innerHTML = ''; // Clear current list

  // Create list items for each tab's data and append them to the list
  tabsData.forEach(tab => {
    const listItem = document.createElement('li');
    listItem.textContent = `URL: ${tab.url}, Time Spent: ${tab.timeSpent} seconds`;
    tabsListElement.appendChild(listItem);
  });
}

// Fetch and render tabs data on popup load
document.addEventListener('DOMContentLoaded', () => {
  storage.getTabsTimeAndUrl().then(renderTabsData);
});
