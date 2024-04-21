// Import the necessary web extension polyfill
import Browser from 'webextension-polyfill';

// Define the Tab entity with necessary properties
class Tab {
  url: string;
  timeSpent: number; // assuming timeSpent is accumulated in some unit, e.g., seconds

  constructor(url: string, timeSpent: number) {
    this.url = url;
    this.timeSpent = timeSpent;
  }
}

// Define the interfaces and types needed for deserialization and storage management
interface IStorage {
  getTabsTimeAndUrl(): Promise<Array<{url: string, timeSpent: number}>>;
}

type StorageDeserializeParam = 'TABS' | 'TIMEINTERVAL_LIST';
type StorageParams = 'INTERVAL_INACTIVITY' | 'VIEW_TIME_IN_BADGE';

// Utility function to check if an object is empty
function isEmpty(obj: any): boolean {
  return Object.keys(obj).length === 0;
}

// Implementation of the LocalStorage class
class LocalStorage implements IStorage {
  async getDeserializeList(param: StorageDeserializeParam): Promise<Tab[]> {
    return new Promise(async resolve => {
      const obj = await Browser.storage.local.get(param);
      const list: any[] = obj[param];
      if (list !== undefined) {
        let tempList: Tab[] = [];
        for (let i = 0; i < list.length; i++) {
          tempList.push(new Tab(list[i].url, list[i].timeSpent));
        }
        resolve(tempList);
      } else resolve([]);
    });
  }

  async saveTabs(value: Tab[]): Promise<void> {
    await Browser.storage.local.set({ [StorageDeserializeParam.TABS]: value });
  }

  // Additional methods would be similar to saveTabs but for different data types
  async getTabsTimeAndUrl(): Promise<Array<{url: string, timeSpent: number}>> {
    let tabsData = await this.getDeserializeList('TABS');
    if (tabsData.length === 0) {
      console.log("No data available");
      return [];
    }
    return tabsData.map(tab => ({
      url: tab.url,
      timeSpent: tab.timeSpent
    }));
  }
}

// Usage example:
const storage = new LocalStorage();
storage.getTabsTimeAndUrl().then(data => {
  console.log("Tab data:", data);
});
