
// 1. Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-text-selection",
    title: "💾 Save Selected Text",
    contexts: ["selection"]
  });
});

// 2. Context menu click handler
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-text-selection" && info.selectionText) {
    saveText({
      text: info.selectionText.trim(),
      url: tab?.url || "Unknown Source"
    });
  }
});

// 3. Message listener (from content.js)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_SELECTION") {
    saveText({
      text: message.text?.trim() || "",
      url: message.url || "Unknown Source"
    });

    sendResponse({ status: "success" });
  }

  return true;
});

// 🔥 SAFE STORAGE FUNCTION (IMPROVED)
function saveText(data) {
  if (!data.text) return;

  chrome.storage.local.get({ savedTexts: [] }, (result) => {
    let savedTexts = result.savedTexts || [];

    // OPTIONAL: prevent duplicates (IMPORTANT IMPROVEMENT)
    const isDuplicate = savedTexts.some(
      item => item.text === data.text && item.url === data.url
    );

    if (isDuplicate) return;

    savedTexts.unshift(data);

    chrome.storage.local.set({ savedTexts }, () => {
      console.log("Saved:", data);
    });
  });
}
