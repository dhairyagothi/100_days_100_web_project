// Function to send selected text and URL to the background script
function sendSelection() {
    const selection = window.getSelection().toString();
    if (selection) {
      chrome.runtime.sendMessage({
        type: "SAVE_SELECTION",
        text: selection,
        url: window.location.href,
      });
    }
  }

  // Listen for Ctrl+C key combination to trigger text saving
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey &&event.key.toLowerCase() === "c") {
      sendSelection();
    }
  });
  