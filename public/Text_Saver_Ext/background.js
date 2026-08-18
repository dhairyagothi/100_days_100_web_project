// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveSelection",
    title: "Save to Text Saver",
    contexts: ["selection"]
  });
});

// Context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveSelection") {
    saveText({
      text: info.selectionText,
      url: tab.url,
      timestamp: Date.now()
    });
  }
});

// Messages from content script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SAVE_SELECTION") {
    saveText({
      text: message.text,
      url: message.url,
      timestamp: Date.now()
    });
  }
});

// Save text
function saveText(data) {
  chrome.storage.local.get(
    {
      savedTexts: []
    },
    (result) => {
      const savedTexts = result.savedTexts;

      const exists = savedTexts.some(
        item =>
          item.text === data.text &&
          item.url === data.url
      );

      if (exists) return;

      savedTexts.unshift(data);

      chrome.storage.local.set(
        {
          savedTexts
        },
        () => {
          console.log("Saved:", data);
        }
      );
    }
  );
}