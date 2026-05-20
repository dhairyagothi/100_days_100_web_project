// Send selected text to background
function sendSelection() {
  const selectionText = window.getSelection().toString().trim();

  if (!selectionText) return;

  chrome.runtime.sendMessage(
    {
      type: "SAVE_SELECTION",
      text: selectionText,
      url: window.location.href,
    },
    () => {
      if (chrome.runtime.lastError) {
        console.warn("Text Saver: Background script not ready");
      }
    }
  );
}

//  Trigger 1: Alt + S (your original feature)
document.addEventListener("keydown", (event) => {
  if (event.altKey && event.key.toLowerCase() === "s") {
    event.preventDefault();
    sendSelection();
  });

// Trigger 2: Double click selection (IMPORTANT FIX)
document.addEventListener("dblclick", () => {
  setTimeout(() => {
    sendSelection();
  }, 50);
});

// Optional right-click shortcut (nice UX improvement)
document.addEventListener("contextmenu", () => {
  const selected = window.getSelection().toString().trim();

  if (selected.length > 0) {
    console.log("Text selected (ready to save)");
  }
});
