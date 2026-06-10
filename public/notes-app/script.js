const STORAGE_KEY = "responsive-notes-app:v2";
const THEME_KEY = "responsive-notes-app:theme";

const defaultNotes = [
  {
    id: crypto.randomUUID(),
    title: "Welcome to Notes App",
    content: "Create notes, mark favorites, archive finished ideas, and export a JSON backup. Everything is stored locally in this browser.",
    tag: "Ideas",
    color: "teal",
    favorite: true,
    archived: false,
    trashed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const state = {
  notes: loadNotes(),
  filter: "all",
  tag: "all",
  query: "",
  editingId: null,
};

const elements = {
  body: document.body,
  todayLabel: document.getElementById("todayLabel"),
  viewTitle: document.getElementById("viewTitle"),
  summaryText: document.getElementById("summaryText"),
  notesGrid: document.getElementById("notesGrid"),
  tagList: document.getElementById("tagList"),
  searchInput: document.getElementById("searchInput"),
  themeToggle: document.getElementById("themeToggle"),
  newNoteTop: document.getElementById("newNoteTop"),
  newNoteSidebar: document.getElementById("newNoteSidebar"),
  modalOverlay: document.getElementById("modalOverlay"),
  closeModal: document.getElementById("closeModal"),
  noteForm: document.getElementById("noteForm"),
  modalTitle: document.getElementById("modalTitle"),
  titleInput: document.getElementById("titleInput"),
  contentInput: document.getElementById("contentInput"),
  tagInput: document.getElementById("tagInput"),
  colorInput: document.getElementById("colorInput"),
  favoriteInput: document.getElementById("favoriteInput"),
  archivedInput: document.getElementById("archivedInput"),
  resetForm: document.getElementById("resetForm"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  toast: document.getElementById("toast"),
  allCount: document.getElementById("allCount"),
  favoriteCount: document.getElementById("favoriteCount"),
  archivedCount: document.getElementById("archivedCount"),
  trashCount: document.getElementById("trashCount"),
  statTotal: document.getElementById("statTotal"),
  statFavorites: document.getElementById("statFavorites"),
  statEdited: document.getElementById("statEdited"),
  aiEnhanceBtn: document.getElementById("aiEnhanceBtn"),
  resetKeyBtn: document.getElementById("resetKeyBtn"),
  apiKeyModal: document.getElementById("apiKeyModal"),
  closeApiKeyModal: document.getElementById("closeApiKeyModal"),
  apiKeyForm: document.getElementById("apiKeyForm"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  showKeyCheckbox: document.getElementById("showKeyCheckbox"),
  clearKeyBtn: document.getElementById("clearKeyBtn"),
};

function loadNotes() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(stored)) {
      return stored.map(normalizeNote);
    }
  } catch (error) {
    console.warn("Unable to load notes", error);
  }

  return defaultNotes;
}

function normalizeNote(note) {
  return {
    id: note.id || crypto.randomUUID(),
    title: String(note.title || "Untitled note"),
    content: String(note.content || ""),
    tag: String(note.tag || "Personal"),
    color: ["teal", "violet", "amber", "rose"].includes(note.color) ? note.color : "teal",
    favorite: Boolean(note.favorite),
    archived: Boolean(note.archived),
    trashed: Boolean(note.trashed || note.trash),
    createdAt: note.createdAt || new Date().toISOString(),
    updatedAt: note.updatedAt || note.createdAt || new Date().toISOString(),
  };
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.notes));
}

function formatDate(value, options = { month: "short", day: "numeric" }) {
  return new Intl.DateTimeFormat("en", options).format(new Date(value));
}

function getVisibleNotes() {
  return state.notes
    .filter((note) => {
      if (state.filter === "trash") return note.trashed;
      if (note.trashed) return false;
      if (state.filter === "favorites") return note.favorite;
      if (state.filter === "archived") return note.archived;
      return !note.archived;
    })
    .filter((note) => state.tag === "all" || note.tag === state.tag)
    .filter((note) => {
      const query = state.query.trim().toLowerCase();
      if (!query) return true;
      return [note.title, note.content, note.tag].some((value) => value.toLowerCase().includes(query));
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function render() {
  renderNavigation();
  renderTags();
  renderStats();
  renderNotes();
}

function renderNavigation() {
  const activeNotes = state.notes.filter((note) => !note.trashed);
  elements.allCount.textContent = activeNotes.filter((note) => !note.archived).length;
  elements.favoriteCount.textContent = activeNotes.filter((note) => note.favorite).length;
  elements.archivedCount.textContent = activeNotes.filter((note) => note.archived).length;
  elements.trashCount.textContent = state.notes.filter((note) => note.trashed).length;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === state.filter);
  });
}

function renderTags() {
  const tags = ["all", ...new Set(state.notes.filter((note) => !note.trashed).map((note) => note.tag))];
  elements.tagList.innerHTML = tags
    .map((tag) => {
      const label = tag === "all" ? "All tags" : tag;
      return `<button class="tag-chip ${state.tag === tag ? "active" : ""}" type="button" data-tag="${escapeAttribute(tag)}">${escapeHtml(label)}</button>`;
    })
    .join("");
}

function renderStats() {
  const activeNotes = state.notes.filter((note) => !note.trashed);
  const latestNote = [...activeNotes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  const viewLabel = {
    all: "All notes",
    favorites: "Favorites",
    archived: "Archived",
    trash: "Trash",
  }[state.filter];

  elements.todayLabel.textContent = formatDate(new Date(), {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  elements.viewTitle.textContent = state.tag === "all" ? viewLabel : `${state.tag} notes`;
  elements.summaryText.textContent = `${getVisibleNotes().length} note${getVisibleNotes().length === 1 ? "" : "s"} in this view. Changes save automatically to local storage.`;
  elements.statTotal.textContent = activeNotes.length;
  elements.statFavorites.textContent = activeNotes.filter((note) => note.favorite).length;
  elements.statEdited.textContent = latestNote ? formatDate(latestNote.updatedAt) : "None";
}

function renderNotes() {
  const visibleNotes = getVisibleNotes();

  if (!visibleNotes.length) {
    elements.notesGrid.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>No notes found</h3>
          <p>Create a note or clear your current filters to see more.</p>
        </div>
      </div>
    `;
    return;
  }

  elements.notesGrid.innerHTML = visibleNotes.map(createNoteCard).join("");
}

function createNoteCard(note) {
  const actionButtons = note.trashed
    ? `
      <button class="card-button" type="button" data-action="restore" data-id="${note.id}">Restore</button>
      <button class="card-button danger" type="button" data-action="delete" data-id="${note.id}">Delete</button>
    `
    : `
      <button class="card-button ${note.favorite ? "active" : ""}" type="button" data-action="favorite" data-id="${note.id}" aria-label="Toggle favorite">${note.favorite ? "Starred" : "Star"}</button>
      <button class="card-button" type="button" data-action="archive" data-id="${note.id}">${note.archived ? "Unarchive" : "Archive"}</button>
      <button class="card-button" type="button" data-action="edit" data-id="${note.id}">Edit</button>
      <button class="card-button danger" type="button" data-action="trash" data-id="${note.id}">Trash</button>
    `;

  return `
    <article class="note-card" data-color="${escapeAttribute(note.color)}">
      <div class="card-meta">
        <span>${escapeHtml(formatDate(note.updatedAt))}</span>
        <span>${note.archived ? "Archived" : "Active"}</span>
      </div>
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
      <footer>
        <span class="badge">${escapeHtml(note.tag)}</span>
        <div class="card-actions">${actionButtons}</div>
      </footer>
    </article>
  `;
}

function openEditor(note = null) {
  state.editingId = note?.id || null;
  elements.modalTitle.textContent = note ? "Edit note" : "Create note";
  elements.titleInput.value = note?.title || "";
  elements.contentInput.value = note?.content || "";
  elements.tagInput.value = note?.tag || "Work";
  elements.colorInput.value = note?.color || "teal";
  elements.favoriteInput.checked = Boolean(note?.favorite);
  elements.archivedInput.checked = Boolean(note?.archived);
  elements.modalOverlay.hidden = false;
  elements.titleInput.focus();
}

function closeEditor() {
  elements.modalOverlay.hidden = true;
  elements.noteForm.reset();
  state.editingId = null;
}

function resetEditor() {
  if (state.editingId) {
    openEditor(state.notes.find((note) => note.id === state.editingId));
  } else {
    elements.noteForm.reset();
    elements.titleInput.focus();
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const formNote = {
    title: elements.titleInput.value.trim(),
    content: elements.contentInput.value.trim(),
    tag: elements.tagInput.value,
    color: elements.colorInput.value,
    favorite: elements.favoriteInput.checked,
    archived: elements.archivedInput.checked,
  };

  if (!formNote.title || !formNote.content) {
    showToast("Add a title and note before saving.");
    return;
  }

  if (state.editingId) {
    state.notes = state.notes.map((note) =>
      note.id === state.editingId
        ? { ...note, ...formNote, updatedAt: new Date().toISOString() }
        : note,
    );
    showToast("Note updated.");
  } else {
    state.notes.unshift({
      id: crypto.randomUUID(),
      ...formNote,
      trashed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    showToast("Note created.");
  }

  saveNotes();
  closeEditor();
  render();
}

function updateNote(id, updater, message) {
  state.notes = state.notes.map((note) =>
    note.id === id ? { ...updater(note), updatedAt: new Date().toISOString() } : note,
  );
  saveNotes();
  render();
  showToast(message);
}

function handleCardAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const { action, id } = button.dataset;
  const note = state.notes.find((item) => item.id === id);
  if (!note) return;

  if (action === "edit") openEditor(note);
  if (action === "favorite") updateNote(id, (item) => ({ ...item, favorite: !item.favorite }), "Favorite updated.");
  if (action === "archive") updateNote(id, (item) => ({ ...item, archived: !item.archived }), "Archive updated.");
  if (action === "trash") updateNote(id, (item) => ({ ...item, trashed: true }), "Moved to trash.");
  if (action === "restore") updateNote(id, (item) => ({ ...item, trashed: false }), "Note restored.");
  if (action === "delete") {
    state.notes = state.notes.filter((item) => item.id !== id);
    saveNotes();
    render();
    showToast("Note deleted permanently.");
  }
}

function setTheme(theme) {
  elements.body.classList.toggle("light", theme === "light");
  elements.themeToggle.textContent = theme === "light" ? "Dark" : "Light";
  localStorage.setItem(THEME_KEY, theme);
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(state.notes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  showToast("Backup exported.");
}

function importNotes(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const imported = JSON.parse(reader.result);
      if (!Array.isArray(imported)) throw new Error("Invalid backup");
      state.notes = imported.map(normalizeNote);
      saveNotes();
      render();
      showToast("Backup imported.");
    } catch (error) {
      showToast("That JSON file is not a valid notes backup.");
    } finally {
      elements.importInput.value = "";
    }
  });
  reader.readAsText(file);
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

// ========================================
// AI Features with User-Provided API Key
// ========================================

const API_KEY_STORAGE_KEY = "gemini-api-key:v1";

function getStoredApiKey() {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

function saveApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

function clearStoredApiKey() {
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  elements.apiKeyInput.value = "";
}

function openApiKeyModal() {
  const storedKey = getStoredApiKey();
  elements.apiKeyInput.value = storedKey || "";
  elements.apiKeyModal.hidden = false;
  elements.apiKeyInput.focus();
}

function closeApiKeyModal() {
  elements.apiKeyModal.hidden = true;
}

function toggleShowKey() {
  const isPassword = elements.apiKeyInput.type === "password";
  elements.apiKeyInput.type = isPassword ? "text" : "password";
}

async function callAIAPI(text) {
  if (!text.trim()) {
    showToast("Please write some text first.");
    return null;
  }

  let apiKey = getStoredApiKey();
  const button = elements.aiEnhanceBtn;

  try {
    button.disabled = true;
    button.classList.add("loading");

    // If no client API key, try the backend API server proxy first
    if (!apiKey) {
      try {
        const response = await fetch("/api/ai-process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "enhance", text }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result) {
            showToast("✨ Note fixed and formatted!");
            return data.result;
          }
        }
      } catch (backendError) {
        console.log("Backend server proxy not available, prompting for client-side API key.", backendError);
      }

      // If backend proxy is not running or failed, ask user for their API key
      button.classList.remove("loading");
      button.disabled = false;
      openApiKeyModal();
      return null;
    }

    // Combined AI Enhance Prompt
    const prompt = `You are an expert AI note-taking assistant. Your task is to correct all spelling, grammar, and punctuation mistakes, AND transform raw, unformatted, or shorthand notes into a beautifully structured Markdown document.
You MUST:
1. Fix all typos, spelling, capitalization, and grammatical errors.
2. Add a main heading (#) and logical subheadings (##) to organize the content.
3. Use bulleted lists (-) for lists and key concepts.
4. Structure scattered thoughts into coherent paragraphs.
5. Preserve all original technical terms, names, details, and user intent.
6. DO NOT add bold formatting (**word**) to ordinary words unless they are section headings.
7. Return ONLY the final corrected and formatted Markdown. No conversational filler, no introductions, no explanations.`;

    const payload = {
      model: "sarvam-30b",
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    };

    const response = await fetch(
      "https://api.sarvam.ai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key": apiKey,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const errorMsg = error.error?.message || "API request failed";
      
      if (errorMsg.toLowerCase().includes("key") || errorMsg.toLowerCase().includes("unauthorized") || errorMsg.toLowerCase().includes("subscription") || errorMsg.toLowerCase().includes("not valid")) {
        showToast("Invalid Sarvam API key. Please try again.");
        clearStoredApiKey();
        openApiKeyModal();
      } else {
        throw new Error(errorMsg);
      }
      return null;
    }

    const data = await response.json();

    // Extract generated text from OpenAI-compatible response format
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const result = data.choices[0].message.content;
      showToast("✨ Note fixed and formatted!");
      return result;
    }

    throw new Error("Unexpected API response format");
  } catch (error) {
    console.error("AI API error:", error);
    showToast(`Error: ${error.message}`);
    return null;
  } finally {
    const button = elements.aiEnhanceBtn;
    button.classList.remove("loading");
    button.disabled = false;
  }
}

async function enhanceNote() {
  const enhancedText = await callAIAPI(elements.contentInput.value);
  if (enhancedText) {
    elements.contentInput.value = enhancedText;
  }
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    render();
  });
});

elements.tagList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-tag]");
  if (!button) return;
  state.tag = button.dataset.tag;
  render();
});

elements.searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  render();
});

elements.notesGrid.addEventListener("click", handleCardAction);
elements.newNoteTop.addEventListener("click", () => openEditor());
elements.newNoteSidebar.addEventListener("click", () => openEditor());
elements.closeModal.addEventListener("click", closeEditor);
elements.resetForm.addEventListener("click", resetEditor);
elements.noteForm.addEventListener("submit", handleSubmit);
elements.exportBtn.addEventListener("click", exportNotes);
elements.importInput.addEventListener("change", importNotes);

elements.modalOverlay.addEventListener("click", (event) => {
  if (event.target === elements.modalOverlay) closeEditor();
});

elements.themeToggle.addEventListener("click", () => {
  setTheme(elements.body.classList.contains("light") ? "dark" : "light");
});

elements.aiEnhanceBtn.addEventListener("click", enhanceNote);
elements.resetKeyBtn.addEventListener("click", openApiKeyModal);

// API Key Modal Event Listeners
elements.closeApiKeyModal.addEventListener("click", closeApiKeyModal);
elements.showKeyCheckbox.addEventListener("change", toggleShowKey);
elements.clearKeyBtn.addEventListener("click", () => {
  if (confirm("Clear your stored API key?")) {
    clearStoredApiKey();
    showToast("API key cleared.");
  }
});

elements.apiKeyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const apiKey = elements.apiKeyInput.value.trim();
  
  if (!apiKey) {
    showToast("Please enter your API key.");
    return;
  }
  
  if (apiKey.length < 20) {
    showToast("API key seems too short. Please check.");
    return;
  }
  
  saveApiKey(apiKey);
  closeApiKeyModal();
  showToast("✓ API key saved securely in your browser!");
});

elements.apiKeyModal.addEventListener("click", (event) => {
  if (event.target === elements.apiKeyModal) closeApiKeyModal();
});

document.addEventListener("keydown", (event) => {
  const modifier = event.ctrlKey || event.metaKey;
  if (modifier && event.key.toLowerCase() === "n") {
    event.preventDefault();
    openEditor();
  }
  if (modifier && event.key.toLowerCase() === "f") {
    event.preventDefault();
    elements.searchInput.focus();
  }
  if (event.key === "Escape" && !elements.modalOverlay.hidden) {
    closeEditor();
  }
});

setTheme(localStorage.getItem(THEME_KEY) || "dark");
render();
