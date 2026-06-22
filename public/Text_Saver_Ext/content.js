// Function to show toast notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "text-saver-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Function to send selected text and URL to the background script
function sendSelection() {
  const selection = window.getSelection().toString().trim();
  if (selection) {
    chrome.runtime.sendMessage({
      type: "SAVE_SELECTION",
      text: selection,
      url: window.location.href,
    });
    showToast("Text Saved! ✨");
  }

}

// Listen for double-click
document.addEventListener("dblclick", sendSelection);

// Listen for a specific keypress (e.g., pressing "S")
document.addEventListener("keydown", (event) => {
  // Only trigger if no input/textarea is focused
  if (event.key.toLowerCase() === "s" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    sendSelection();
  }
});


  // Listen for Ctrl+C key combination to trigger text saving
  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey &&event.key.toLowerCase() === "c") {
      sendSelection();
    }
  });
  

