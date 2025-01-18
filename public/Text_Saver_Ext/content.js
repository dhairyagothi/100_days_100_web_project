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
  
  // Listen for double-click
  document.addEventListener("dblclick", sendSelection);
  
  // Listen for a specific keypress (e.g., pressing "S")
  document.addEventListener("keydown", (event) => {
    if (event.key === "s") {
      sendSelection();
    }
  });
  