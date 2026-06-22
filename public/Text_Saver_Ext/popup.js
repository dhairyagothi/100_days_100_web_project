let allSavedTexts = [];

// Function to display saved texts
function displaySavedTexts(filter = "") {
  chrome.storage.local.get("savedTexts", (result) => {
    allSavedTexts = result.savedTexts || [];
    const textListDiv = document.getElementById("textList");
    textListDiv.innerHTML = "";

    const filteredTexts = allSavedTexts.filter(entry =>
      entry.text.toLowerCase().includes(filter.toLowerCase()) ||
      entry.url.toLowerCase().includes(filter.toLowerCase()) ||
      (entry.tag && entry.tag.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filteredTexts.length === 0) {
      textListDiv.innerHTML = `<p style="text-align:center; opacity:0.6; margin-top:20px;">
        ${filter ? "No matches found." : "No saved texts yet."}
      </p>`;
      return;
    }

    filteredTexts.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.className = "text-entry";

      // Tag Badge
      if (entry.tag) {
        const tag = document.createElement("span");
        tag.className = "tag-badge";
        tag.textContent = entry.tag;
        entryDiv.appendChild(tag);
      }

      const textPara = document.createElement("p");
      textPara.textContent = entry.text;
      entryDiv.appendChild(textPara);

      // Note Section
      const noteSection = document.createElement("div");
      noteSection.className = "note-section";

      const noteDisplay = document.createElement("div");
      noteDisplay.className = "note-text";
      noteDisplay.style.display = entry.notes ? "block" : "none";
      noteDisplay.textContent = entry.notes || "";

      const noteInput = document.createElement("input");
      noteInput.className = "note-input";
      noteInput.placeholder = "Write a note...";
      noteInput.value = entry.notes || "";

      noteSection.appendChild(noteDisplay);
      noteSection.appendChild(noteInput);
      entryDiv.appendChild(noteSection);

      // Highlight URL (using Text Fragment)
      const urlLink = document.createElement("a");
      const encodedText = encodeURIComponent(entry.text.substring(0, 50)); // Simple fragment
      urlLink.href = `${entry.url}#:~:text=${encodedText}`;
      urlLink.textContent = new URL(entry.url).hostname;
      urlLink.className = "url";
      urlLink.target = "_blank";
      urlLink.title = "Open and Highlight in Page";
      entryDiv.appendChild(urlLink);

      // Utility Bar
      const utilBar = document.createElement("div");
      utilBar.className = "utility-bar";

      const btnNote = createUtilBtn(entry.notes ? "Edit Note" : "Add Note", () => toggleNote(noteInput, noteDisplay, entry));
      const btnTag = createUtilBtn(entry.tag ? "Change Tag" : "Add Tag", () => addTag(entry));
      const btnCite = createUtilBtn("Cite", () => showCitation(entryDiv, entry));

      utilBar.appendChild(btnNote);
      utilBar.appendChild(btnTag);
      utilBar.appendChild(btnCite);
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

function createUtilBtn(text, onclick) {
  const btn = document.createElement("button");
  btn.className = "utility-btn";
  btn.textContent = text;
  btn.onclick = onclick;
  return btn;
}

function toggleNote(input, display, entry) {
  if (input.style.display === "block") {
    // Save
    entry.notes = input.value;
    saveChanges();
    input.style.display = "none";
    display.textContent = input.value;
    display.style.display = input.value ? "block" : "none";
  } else {
    input.style.display = "block";
    input.focus();
  }
}

function addTag(entry) {
  const newTag = prompt("Enter a tag/category (e.g., Research, Work, Personal):", entry.tag || "");
  if (newTag !== null) {
    entry.tag = newTag.trim();
    saveChanges();
    displaySavedTexts(document.getElementById("searchInput").value);
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
  const date = new Date(entry.timestamp || Date.now()).getFullYear();
  citeBox.textContent = `APA: (${date}). [Web Snippet]. Retrieved from ${entry.url}`;
  container.appendChild(citeBox);
}

function saveChanges() {
  chrome.storage.local.set({ savedTexts: allSavedTexts });
}

// Function to delete a single entry
function deleteEntry(index) {
  allSavedTexts.splice(index, 1);
  chrome.storage.local.set({ savedTexts: allSavedTexts }, () => {
    displaySavedTexts(document.getElementById("searchInput").value);
  });
}

// Function to clear all texts
function clearSavedTexts() {
  if (confirm("Are you sure you want to clear all saved texts?")) {
    chrome.storage.local.clear(() => {
      displaySavedTexts();
    });
  }
}

// Function to download texts
function downloadSavedTexts() {
  chrome.storage.local.get("savedTexts", (result) => {
    const textList = result.savedTexts || [];
    if (textList.length === 0) {
      alert("No texts to export!");
      return;
    }

    let fileContent = "--- TEXT SAVER PRO EXPORT ---\n\n";
    textList.forEach((entry, index) => {
      const date = entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "N/A";
      fileContent += `[ENTRY ${index + 1}]\n`;
      fileContent += `Date: ${date}\n`;
      fileContent += `Tag: ${entry.tag || "None"}\n`;
      fileContent += `Source: ${entry.url}\n`;
      fileContent += `Notes: ${entry.notes || "No notes"}\n`;
      fileContent += `Content: "${entry.text}"\n`;
      fileContent += `--------------------------------\n\n`;
    });

    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `text_saver_pro_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Event listeners
document.getElementById("downloadButton").addEventListener("click", downloadSavedTexts);
document.getElementById("clearButton").addEventListener("click", clearSavedTexts);
document.getElementById("searchInput").addEventListener("input", (e) => {
  displaySavedTexts(e.target.value);
});

// Run when popup opens
document.addEventListener("DOMContentLoaded", () => displaySavedTexts());
