function showToast(message) {
  const oldToast = document.querySelector(".text-saver-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "text-saver-toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

function sendSelection() {
  const selectedText = window
    .getSelection()
    .toString()
    .trim();

  if (!selectedText) return;

  chrome.runtime.sendMessage({
    type: "SAVE_SELECTION",
    text: selectedText,
    url: location.href
  });

  showToast("Text Saved ✨");
}

// Double click save
document.addEventListener("dblclick", () => {
  sendSelection();
});

// Press S key save
document.addEventListener("keydown", (e) => {
  const tag = document.activeElement.tagName;

  if (
    e.key.toLowerCase() === "s" &&
    tag !== "INPUT" &&
    tag !== "TEXTAREA"
  ) {
    sendSelection();
  }
});

// Ctrl + C save
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "c") {
    setTimeout(sendSelection, 100);
  }
});