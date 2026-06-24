// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSelection",
    title: "Save to Text Saver",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSelection") {
    saveText({
      text: info.selectionText,
      url: tab.url,
      timestamp: Date.now()
    });
  }
});

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_SELECTION") {
    const { text, url } = message;
    saveText({ text, url, timestamp: Date.now() });
  }
});

// Save text and URL in Chrome storage
function saveText(data) {
  chrome.storage.local.get({ savedTexts: [] }, (result) => {
    const savedTexts = result.savedTexts;
    // Prevent duplicates within a short time frame
    const isDuplicate = savedTexts.some(item => item.text === data.text && item.url === data.url);
    if (!isDuplicate) {
      savedTexts.unshift(data); // Add to beginning of list
      chrome.storage.local.set({ savedTexts }, () => {
        console.log("Text saved:", data);
        // Optional: Send feedback to content script
      });
    }
  });
}
