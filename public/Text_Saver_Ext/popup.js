let allSavedTexts = [];

// Function to display saved texts

function displaySavedTexts(filter = "") {
  chrome.storage.local.get("savedTexts", (result) => {
    allSavedTexts = result.savedTexts || [];
    const textListDiv = document.getElementById("textList");
    const itemCountSpan = document.getElementById("itemCount");

    textListDiv.innerHTML = "";
    if (itemCountSpan) itemCountSpan.textContent = `${allSavedTexts.length} items`;

    const filteredTexts = allSavedTexts.filter(entry =>
      entry.text.toLowerCase().includes(filter.toLowerCase()) ||
      entry.url.toLowerCase().includes(filter.toLowerCase()) ||
      (entry.tag && entry.tag.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filteredTexts.length === 0) {
      textListDiv.innerHTML = `<p style="text-align:center; opacity:0.6; margin-top:20px; font-size: 0.8rem;">
        ${filter ? "No matches found." : "No saved texts yet."}
      </p>`;
      return;
    }

    filteredTexts.forEach((entry, index) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "text-entry";

      // Tag Badge
      if (entry.tag) {
        const tag = document.createElement("span");
        tag.className = "tag-badge";
        tag.textContent = entry.tag;
        entryDiv.appendChild(tag);

function displaySavedTexts() {
    chrome.storage.local.get("savedTexts", (result) => {
      const textList = result.savedTexts || [];
      const textListDiv = document.getElementById("textList");
      textListDiv.innerHTML = "";
  
      document.getElementById("itemCount").textContent = `${textList.length} item${textList.length !== 1 ? "s" : ""}`;

      if (textList.length === 0) {
        textListDiv.innerHTML = "<p>No saved texts found.</p>";
        return;

      }

      const textPara = document.createElement("p");
      textPara.textContent = entry.text;
      entryDiv.appendChild(textPara);

      // Note Display
      if (entry.notes) {
        const noteDisplay = document.createElement("div");
        noteDisplay.className = "note-text";
        noteDisplay.textContent = `Note: ${entry.notes}`;
        entryDiv.appendChild(noteDisplay);
      }

      // URL Link with Fragment Highlighting
      const urlLink = document.createElement("a");
      const encodedText = encodeURIComponent(entry.text.substring(0, 50));
      urlLink.href = `${entry.url}#:~:text=${encodedText}`;
      urlLink.textContent = new URL(entry.url).hostname;
      urlLink.className = "url";
      urlLink.target = "_blank";
      urlLink.title = "Click to jump to original text";
      entryDiv.appendChild(urlLink);

      // Utility Buttons
      const utilBar = document.createElement("div");
      utilBar.className = "utility-bar";

      utilBar.appendChild(createBtn("Note", () => addNote(entry)));
      utilBar.appendChild(createBtn("Tag", () => addTag(entry)));
      utilBar.appendChild(createBtn("Cite", () => showCitation(entryDiv, entry)));

      entryDiv.appendChild(utilBar);

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "&times;";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => deleteEntry(allSavedTexts.indexOf(entry));
      entryDiv.appendChild(deleteBtn);

      textListDiv.appendChild(entryDiv);
    });
  });
}

function createBtn(text, onclick) {
  const btn = document.createElement("button");
  btn.className = "utility-btn";
  btn.textContent = text;
  btn.onclick = onclick;
  return btn;
}

function addNote(entry) {
  const note = prompt("Add a personal note to this snippet:", entry.notes || "");
  if (note !== null) {
    entry.notes = note.trim();
    saveChanges();
    displaySavedTexts(document.getElementById("searchInput").value);
  }

}

function addTag(entry) {
  const tag = prompt("Enter category/tag (e.g. Research, Ideas):", entry.tag || "");
  if (tag !== null) {
    entry.tag = tag.trim();
    saveChanges();
    displaySavedTexts(document.getElementById("searchInput").value);

  
  // Function to clear saved texts
  function clearSavedTexts() {
    chrome.storage.local.remove("savedTexts", () => {
      alert("All saved texts have been cleared.");
      displaySavedTexts();
    }
    );

  }
}

function showCitation(container, entry) {
  const existing = container.querySelector(".citation-box");
  if (existing) {
    existing.remove();
    return;
  }
  const citeBox = document.createElement("div");
  citeBox.className = "citation-box";
  citeBox.style.display = "block";
  citeBox.style.fontSize = "0.7rem";
  citeBox.style.background = "rgba(0,0,0,0.2)";
  citeBox.style.padding = "8px";
  citeBox.style.marginTop = "8px";
  citeBox.style.borderRadius = "4px";
  citeBox.style.borderLeft = "2px solid #10b981";

  const date = new Date(entry.timestamp || Date.now()).getFullYear();
  citeBox.textContent = `APA: (${date}). [Web Snippet]. Retrieved from ${entry.url}`;
  container.appendChild(citeBox);
}

function deleteEntry(index) {
  if (confirm("Delete this snippet?")) {
    allSavedTexts.splice(index, 1);
    saveChanges(() => displaySavedTexts(document.getElementById("searchInput").value));
  }
}

function saveChanges(callback) {
  chrome.storage.local.set({ savedTexts: allSavedTexts }, callback);
}

function clearAll() {
  if (confirm("Are you sure you want to delete EVERY saved snippet?")) {
    chrome.storage.local.set({ savedTexts: [] }, () => displaySavedTexts());
  }
}

function downloadTexts() {
  chrome.storage.local.get("savedTexts", (result) => {
    const texts = result.savedTexts || [];
    if (texts.length === 0) return alert("Nothing to export!");

    let content = "--- TEXT SAVER PRO EXPORT ---\n\n";
    texts.forEach((t, i) => {
      content += `[${i + 1}] ${new Date(t.timestamp).toLocaleString()}\n`;
      content += `URL: ${t.url}\n`;
      content += `TAG: ${t.tag || "None"}\n`;
      content += `NOTE: ${t.notes || ""}\n`;
      content += `CONTENT: ${t.text}\n`;
      content += `----------------------------\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `text_saver_export_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
  });
}

// Listeners
document.addEventListener("DOMContentLoaded", () => {
  displaySavedTexts();
  document.getElementById("downloadButton").addEventListener("click", downloadTexts);
  document.getElementById("clearButton").addEventListener("click", clearAll);
  document.getElementById("searchInput").addEventListener("input", (e) => {
    displaySavedTexts(e.target.value);
  });
});

  
  // Event listeners
  document.getElementById("downloadButton").addEventListener("click", downloadSavedTexts);
  document.getElementById("clearButton").addEventListener("click", clearSavedTexts);
  
  // Run when popup opens
  displaySavedTexts();
  
