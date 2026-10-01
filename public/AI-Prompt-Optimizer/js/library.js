import { escapeHTML, safeParse } from './utils.js';

const promptInput = document.getElementById("promptInput");
const category = document.getElementById("category");
const savePromptBtn = document.getElementById("savePromptBtn");
const libraryContainer = document.getElementById("libraryContainer");
const librarySearch = document.getElementById("librarySearch");
const clearLibraryBtn = document.getElementById("clearLibraryBtn");

export function initLibrary() {
  savePromptBtn.addEventListener("click", savePromptToLibrary);

  librarySearch.addEventListener("input", e => {
    renderLibrary(e.target.value);
  });

  libraryContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("load-btn")) {
      loadPrompt(parseInt(e.target.dataset.id));
    } else if (e.target.classList.contains("delete-btn")) {
      deletePrompt(parseInt(e.target.dataset.id));
    }
  });

  clearLibraryBtn.addEventListener("click", () => {
    if (confirm("Clear entire prompt library?")) {
      localStorage.removeItem("promptLibrary");
      renderLibrary();
    }
  });

  renderLibrary();
}

function savePromptToLibrary() {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert("Enter a prompt first.");
    return;
  }

  const library = safeParse("promptLibrary");

  library.unshift({
    id: Date.now(),
    category: category.value,
    prompt: prompt,
    date: new Date().toLocaleString()
  });

  localStorage.setItem(
    "promptLibrary",
    JSON.stringify(library)
  );

  renderLibrary();
}

function renderLibrary(search = "") {
  let library = safeParse("promptLibrary");

  library = library.filter(item =>
    item.prompt
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (!library.length) {
    libraryContainer.innerHTML =
      `<div class="history-placeholder">
          No saved prompts found.
       </div>`;
    return;
  }

  libraryContainer.innerHTML = "";

  library.forEach(item => {
    const card = document.createElement("div");
    card.className = "library-item";

    card.innerHTML = `
      <h4>${escapeHTML(item.category.toUpperCase())}</h4>
      <p>${escapeHTML(item.prompt)}</p>
      <div class="history-meta">
        ${escapeHTML(item.date)}
      </div>
      <div class="library-actions">
        <button class="load-btn" data-id="${item.id}">Load</button>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      </div>
    `;

    libraryContainer.appendChild(card);
  });
}

function loadPrompt(id) {
  const library = safeParse("promptLibrary");
  const item = library.find(p => p.id === id);

  if (item) {
    promptInput.value = item.prompt;
    category.value = item.category;
  }
}

function deletePrompt(id) {
  let library = safeParse("promptLibrary");
  library = library.filter(p => p.id !== id);

  localStorage.setItem(
    "promptLibrary",
    JSON.stringify(library)
  );

  renderLibrary();
}
