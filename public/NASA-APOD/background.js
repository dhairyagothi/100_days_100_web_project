
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ lastPopupDate: null });
});
