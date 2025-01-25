// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SAVE_SELECTION") {
      const { text, url } = message;
      saveText({ text, url });
    }
  });
  
  // Save text and URL in Chrome storage
  function saveText(data) {
    chrome.storage.local.get({ savedTexts: [] }, (result) => {
      const savedTexts = result.savedTexts;
      savedTexts.push(data);
  
      // Update the storage
      chrome.storage.local.set({ savedTexts }, () => {
        console.log("Text saved:", data);
      });
    });
  }
  