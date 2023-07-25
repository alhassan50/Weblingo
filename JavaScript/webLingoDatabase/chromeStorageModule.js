// chromeStorageModule.js

export const chromeStorage = {
    getItem: (key) => {
      // Implementation to get data from Chrome storage
      return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            console.log('just got som');
            resolve(result[key]);
          }
        });
      });
    },
  
    setItem: (key, value) => {
      // Implementation to set data to Chrome storage
      return new Promise((resolve, reject) => {
        const data = { [key]: value };
        chrome.storage.local.set(data, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            console.log('ust set som');
            resolve();
          }
        });
      });
    },
  };
  