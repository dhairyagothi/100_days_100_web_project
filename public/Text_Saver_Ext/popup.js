
// Count words helper (REQUIRED for issue)
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Display saved texts
function displaySavedTexts() {
   chrome.storage.local.get("savedTexts", (result) => {
    const textList = result.savedTexts || [];
    const textListDiv = document.getElementById("textList");
    const emptyState = document.getElementById("emptyState");

    textListDiv.innerHTML = "";

    // EMPTY STATE FIX
    if (textList.length === 0) {
      emptyState.style.display = "block";
      return;
    } else {
      emptyState.style.display = "none";
    }

    textList.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "text-entry";

      // TEXT
      const textPara = document.createElement("p");
      textPara.className = "saved-content";
      textPara.textContent = entry.text;

      // WORD COUNT (IMPORTANT FIX)
      const wordCount = countWords(entry.text);

      const wordSpan = document.createElement("p");
      wordSpan.style.fontSize = "12px";
      wordSpan.style.color = "#888";
      wordSpan.textContent = `📝 ${wordCount} words`;

      // URL
      const urlLink = document.createElement("a");
      urlLink.href = entry.url || "#";
      urlLink.textContent = `🔗 ${entry.url || "No URL"}`;
      urlLink.className = "url";
      urlLink.target = "_blank";

      entryDiv.appendChild(textPara);
      entryDiv.appendChild(wordSpan);
      entryDiv.appendChild(urlLink);

      textListDiv.appendChild(entryDiv);
    });
  });
}

// CLEAR FIX (better than remove)
function clearSavedTexts() {
  const clearBtn = document.getElementById("clearButton");

  if (confirm("Are you sure you want to delete all saved texts?")) {
    chrome.storage.local.set({ savedTexts: [] }, () => {
      const originalText = clearBtn.textContent;
      clearBtn.textContent = "Cleared! ❌";

      displaySavedTexts();

      setTimeout(() => {
        clearBtn.textContent = originalText;
      }, 1200);
    });
  }
}

// DOWNLOAD
function downloadSavedTexts() {
  const downloadBtn = document.getElementById("downloadButton");

  chrome.storage.local.get("savedTexts", (result) => {
    const textList = result.savedTexts || [];

    if (textList.length === 0) {
      const originalText = downloadBtn.textContent;
      downloadBtn.textContent = "No texts!";
      setTimeout(() => {
        downloadBtn.textContent = originalText;
      }, 1500);
      return;
    }

    let fileContent = "Saved Texts with URLs:\n\n";

    textList.forEach((entry, index) => {
      fileContent += `Entry ${index + 1}\n`;
      fileContent += `Text: ${entry.text}\n`;
      fileContent += `Words: ${countWords(entry.text)}\n`;
      fileContent += `URL: ${entry.url || "N/A"}\n`;
      fileContent += "-------------------------\n";
    });

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "saved_texts.txt";
    a.click();

    URL.revokeObjectURL(url);
  });
}

// EVENTS
document.getElementById("downloadButton").addEventListener("click", downloadSavedTexts);
document.getElementById("clearButton").addEventListener("click", clearSavedTexts);

// INIT
document.addEventListener("DOMContentLoaded", displaySavedTexts);
