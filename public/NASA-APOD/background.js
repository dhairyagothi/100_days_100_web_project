chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ lastPopupDate: null });
  });
  
  chrome.tabs.onCreated.addListener(() => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    chrome.storage.local.get("lastPopupDate", ({ lastPopupDate }) => {
      if (lastPopupDate !== today) {
        chrome.storage.local.set({ lastPopupDate: today });
        chrome.action.openPopup(); // Open the popup
      }
    });
  });
  