const STORAGE_KEY = "responsive-notes-app:v3";
const THEME_KEY = "responsive-notes-app:theme";

const VALID_COLORS = [
  "teal",
  "violet",
  "amber",
  "rose",
  "blue",
  "green",
  "purple",
  "orange",
  "pink",
  "yellow",
  "indigo",
  "red",
];

function generateUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const defaultNotes = [
  {
    id: crypto.randomUUID(),
    title: "Welcome to Premium Notes",
    content: "This is your first note. Click to edit it!",
    tag: "Ideas",
    color: "teal",
    favorite: true,
    archived: false,
    trashed: false,
    pinned: true,
    locked: false,
    password: "",
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
  unlockingId: null,
};

const elements = {
  body: document.body,

  todayLabel: document.getElementById("todayLabel"),
  viewTitle: document.getElementById("viewTitle"),
  summaryText: document.getElementById("summaryText"),

  notesGrid: document.getElementById("notesGrid"),
  pinnedSection: document.getElementById("pinnedSection"),
  pinnedGrid: document.getElementById("pinnedGrid"),
  tagList: document.getElementById("tagList"),

  searchInput: document.getElementById("searchInput"),
  sortSelect: document.getElementById("sortSelect"),
  themeToggle: document.getElementById("themeToggle"),

  mobileMenuBtn: document.getElementById("mobileMenuBtn"),
  mobileOverlay: document.getElementById("mobileOverlay"),

  newNoteTop: document.getElementById("newNoteTop"),
  newNoteSidebar: document.getElementById("newNoteSidebar"),
  floatingAddBtn: document.getElementById("floatingAddBtn"),

  modalOverlay: document.getElementById("modalOverlay"),
  closeModal: document.getElementById("closeModal"),

  noteForm: document.getElementById("noteForm"),
  modalTitle: document.getElementById("modalTitle"),

  titleInput: document.getElementById("titleInput"),
  contentInput: document.getElementById("contentInput"),

  tagInput: document.getElementById("tagInput"),
  colorInput: document.getElementById("colorInput"),

  favoriteInput: document.getElementById("favoriteInput"),
  pinnedInput: document.getElementById("pinnedInput"),
  archivedInput: document.getElementById("archivedInput"),

  lockedInput: document.getElementById("lockedInput"),
  passwordField: document.getElementById("passwordField"),
  passwordInput: document.getElementById("passwordInput"),

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

  // FIX 5d: add quick-stat elements that were missing
  quickTotal: document.getElementById("quickTotal"),
  quickFavorites: document.getElementById("quickFavorites"),

  // FIX 6: charCounter existed in the HTML but was never referenced in JS
  charCounter: document.getElementById("charCounter"),

  unlockOverlay: document.getElementById("unlockOverlay"),
  unlockInput: document.getElementById("unlockInput"),
  confirmUnlock: document.getElementById("confirmUnlock"),
  cancelUnlock: document.getElementById("cancelUnlock"),
  unlockError: document.getElementById("unlockError"),
  aiEnhanceBtn: document.getElementById("aiEnhanceBtn"),
  resetKeyBtn: document.getElementById("resetKeyBtn"),
  apiKeyModal: document.getElementById("apiKeyModal"),
  closeApiKeyModal: document.getElementById("closeApiKeyModal"),
  apiKeyForm: document.getElementById("apiKeyForm"),
  apiKeyInput: document.getElementById("apiKeyInput"),
  showKeyCheckbox: document.getElementById("showKeyCheckbox"),
  clearKeyBtn: document.getElementById("clearKeyBtn"),
};

if (elements.lockedInput) {
  elements.lockedInput.addEventListener("change", () => {
  elements.passwordField.hidden = !elements.lockedInput.checked;

  if (!elements.lockedInput.checked) {
    elements.passwordInput.value = "";
  }
});
}

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

// FIX 4: Remove escapeHtml() from normalizeNote. Raw strings belong in storage;
// escaping happens only at render time inside createNoteCard (which already does it).
// Escaping here caused double-encoding on every load cycle.
function normalizeNote(note) {
  return {
    id: note.id || crypto.randomUUID(),
    title: String(note.title || "Untitled note"),
    content: String(note.content || ""),
    tag: String(note.tag || "Personal"),
    color: VALID_COLORS.includes(note.color) ? note.color : "teal",
    favorite: Boolean(note.favorite),
    archived: Boolean(note.archived),
    trashed: Boolean(note.trashed || note.trash),
    pinned: Boolean(note.pinned),
    locked: Boolean(note.locked),
    password: String(note.password || ""),
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

      return [note.title, note.content, note.tag].some((value) =>
        value.toLowerCase().includes(query)
      );
    })
    // FIX 5a: honour the sort dropdown instead of always sorting newest-first
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      const sortVal = elements.sortSelect?.value || "newest";

      if (sortVal === "oldest")
        return new Date(a.updatedAt) - new Date(b.updatedAt);

      if (sortVal === "favorites")
        return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);

      if (sortVal === "alphabetical")
        return a.title.localeCompare(b.title);

      // default: newest
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
}

// FIX 6: Update the character counter display whenever content changes.
// The counter element (#charCounter) existed in the HTML but was always frozen at "0 / 1200".
function updateCharCounter() {
  const len = elements.contentInput.value.length;
  const max = Number(elements.contentInput.getAttribute("maxlength")) || 1200;
  elements.charCounter.textContent = `${len} / ${max}`;
  elements.charCounter.style.color =
    len >= max ? "var(--danger)" : len >= max * 0.9 ? "var(--warning)" : "";
}

function render() {
  renderNavigation();
  renderTags();
  renderStats();
  renderNotes();
}

function renderNavigation() {
  const activeNotes = state.notes.filter((note) => !note.trashed);

  elements.allCount.textContent = activeNotes.filter(
    (note) => !note.archived
  ).length;

  elements.favoriteCount.textContent = activeNotes.filter(
    (note) => note.favorite
  ).length;

  elements.archivedCount.textContent = activeNotes.filter(
    (note) => note.archived
  ).length;

  elements.trashCount.textContent = state.notes.filter(
    (note) => note.trashed
  ).length;

  document.querySelectorAll(".nav-item").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.filter === state.filter
    );
  });
}

function renderTags() {
  const tags = [
    "all",
    ...new Set(
      state.notes.filter((note) => !note.trashed).map((note) => note.tag)
    ),
  ];

  elements.tagList.innerHTML = tags
    .map((tag) => {
      const label = tag === "all" ? "All tags" : tag;

      return `
        <button
          class="tag-chip ${state.tag === tag ? "active" : ""}"
          type="button"
          data-tag="${escapeAttribute(tag)}"
        >
          ${escapeHtml(label)}
        </button>
      `;
    })
    .join("");
}

function renderStats() {
  const activeNotes = state.notes.filter((note) => !note.trashed);

  const latestNote = [...activeNotes].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  )[0];

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

  elements.viewTitle.textContent =
    state.tag === "all" ? viewLabel : `${state.tag} notes`;

  elements.summaryText.textContent = `${getVisibleNotes().length} note${
    getVisibleNotes().length === 1 ? "" : "s"
  } in this view.`;

  elements.statTotal.textContent = activeNotes.length;

  elements.statFavorites.textContent = activeNotes.filter(
    (note) => note.favorite
  ).length;

  elements.statEdited.textContent = latestNote
    ? formatDate(latestNote.updatedAt)
    : "None";

  // FIX 5d: populate the quick-stat cards in the main workspace header
  elements.quickTotal.textContent = activeNotes.length;

  elements.quickFavorites.textContent = activeNotes.filter(
    (note) => note.favorite
  ).length;
}

// FIX 3: Split notes into pinned and unpinned; show/hide #pinnedSection accordingly.
// Previously all notes were dumped into #notesGrid and #pinnedSection was never touched.
function renderNotes() {
  const visibleNotes = getVisibleNotes();
  const pinnedNotes = visibleNotes.filter((n) => n.pinned);
  const unpinnedNotes = visibleNotes.filter((n) => !n.pinned);

  // Pinned section — show only when there are pinned notes in the current view
  elements.pinnedSection.hidden = pinnedNotes.length === 0;
  elements.pinnedGrid.innerHTML = pinnedNotes.map(createNoteCard).join("");

  // Regular notes section
  if (!unpinnedNotes.length) {
    elements.notesGrid.innerHTML = `
      <div class="empty-state">
        <div>
          <h3>No notes found</h3>
          <p>Create a new note to get started.</p>
        </div>
      </div>
    `;
    return;
  }

  elements.notesGrid.innerHTML = unpinnedNotes.map(createNoteCard).join("");
}

function createNoteCard(note) {
  const isLocked = note.locked && note.password;

  const noteContent = isLocked
    ? `
      <div class="locked-overlay">
        <div class="locked-message">
          <span class="lock-icon-big">🔒</span>
          <p>This note is password protected.</p>

          <button
            class="primary-action unlock-btn"
            type="button"
            data-action="unlock"
            data-id="${note.id}"
          >
            Unlock
          </button>
        </div>
      </div>
    `
    : `
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.content)}</p>
    `;

  return `
    <article
      class="note-card ${isLocked ? "is-locked" : ""}"
      data-color="${escapeAttribute(note.color)}"
    >

      ${note.pinned ? `<span class="pin-badge">📌</span>` : ""}

      ${isLocked ? `<span class="lock-badge">🔒</span>` : ""}

      <div class="card-meta">
        <span>${formatDate(note.updatedAt)}</span>

        <span>
          ${note.archived ? "Archived" : "Active"}
        </span>
      </div>

      <div class="card-body">
        ${noteContent}
      </div>

      <footer>
        <span class="badge">
          ${escapeHtml(note.tag)}
        </span>

        <div class="card-actions">

          <button
            class="card-button ${note.favorite ? "active" : ""}"
            type="button"
            data-action="favorite"
            data-id="${note.id}"
          >
            ${note.favorite ? "Starred" : "Star"}
          </button>

          <button
            class="card-button"
            type="button"
            data-action="pin"
            data-id="${note.id}"
          >
            ${note.pinned ? "Unpin" : "Pin"}
          </button>

          <button
            class="card-button"
            type="button"
            data-action="edit"
            data-id="${note.id}"
          >
            Edit
          </button>

          <button
            class="card-button danger"
            type="button"
            data-action="trash"
            data-id="${note.id}"
          >
            Trash
          </button>

        </div>
      </footer>
    </article>
  `;
}

// FIX 2: Restore pinnedInput.checked when opening the editor for an existing note.
// Previously pinnedInput was never set, so re-editing a pinned note always showed it unchecked.
function openEditor(note = null) {
  state.editingId = note?.id || null;

  elements.modalTitle.textContent = note ? "Edit note" : "Create note";

  elements.titleInput.value = note?.title || "";

  elements.contentInput.value = note?.content || "";

  // FIX 6: sync counter to the content already loaded into the textarea
  updateCharCounter();

  elements.tagInput.value = note?.tag || "Work";

  elements.colorInput.value = note?.color || "teal";

  elements.favoriteInput.checked = Boolean(note?.favorite);

  elements.pinnedInput.checked = Boolean(note?.pinned);

  elements.archivedInput.checked = Boolean(note?.archived);

  elements.lockedInput.checked = Boolean(note?.locked);

  elements.passwordInput.value = note?.password || "";

  elements.passwordField.hidden = !note?.locked;

  elements.modalOverlay.hidden = false;

  document.body.style.overflow = "hidden";

  setTimeout(() => {
    elements.titleInput.focus();
  }, 50);
}

function closeEditor() {
  elements.modalOverlay.hidden = true;

  elements.noteForm.reset();

  elements.passwordField.hidden = true;

  document.body.style.overflow = "";

  state.editingId = null;
}

function resetEditor() {
  if (state.editingId) {
    openEditor(
      state.notes.find((note) => note.id === state.editingId)
    );
  } else {
    elements.noteForm.reset();

    elements.passwordField.hidden = true;

    setTimeout(() => {
      elements.titleInput.focus();
    }, 50);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  const isLocked = elements.lockedInput.checked;

  const password = elements.passwordInput.value.trim();

  if (isLocked && !password) {
    showToast("Please enter a password.");
    return;
  }

  const formNote = {
    title: elements.titleInput.value.trim(),

    content: elements.contentInput.value.trim(),

    tag: elements.tagInput.value,

    color: elements.colorInput.value,

    favorite: elements.favoriteInput.checked,

    archived: elements.archivedInput.checked,

    // FIX 1: Read pinnedInput instead of hardcoding false.
    // Previously pinned: false here meant the checkbox was always ignored on save.
    pinned: elements.pinnedInput.checked,

    locked: isLocked,

    password: isLocked ? btoa(password) : "",
  };

  if (!formNote.title || !formNote.content) {
    showToast("Add title and content.");
    return;
  }

  if (state.editingId) {
    state.notes = state.notes.map((note) =>
      note.id === state.editingId
        ? {
            ...note,
            ...formNote,
            updatedAt: new Date().toISOString(),
          }
        : note
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
    note.id === id
      ? {
          ...updater(note),
          updatedAt: new Date().toISOString(),
        }
      : note
  );

  saveNotes();

  render();

  showToast(message);
}

function openUnlockModal(id) {
  state.unlockingId = id;

  elements.unlockInput.value = "";

  elements.unlockError.textContent = "";

  elements.unlockOverlay.hidden = false;

  elements.unlockInput.focus();
}

function closeUnlockModal() {
  elements.unlockOverlay.hidden = true;

  elements.unlockInput.value = "";

  elements.unlockError.textContent = "";

  state.unlockingId = null;
}

function handleUnlock() {
  const note = state.notes.find((n) => n.id === state.unlockingId);

  if (!note) return;

  if (
    btoa(elements.unlockInput.value) ===
    note.password
  ) {
    closeUnlockModal();

    openEditor(note);
  } else {
    elements.unlockError.textContent = "Incorrect password.";

    elements.unlockInput.value = "";
  }
}

function handleCardAction(event) {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const { action, id } = button.dataset;

  const note = state.notes.find((item) => item.id === id);

  if (!note) return;

  if (action === "unlock") {
    openUnlockModal(id);
    return;
  }

  if (action === "edit") {
    if (note.locked && note.password) {
      openUnlockModal(id);
    } else {
      openEditor(note);
    }

    return;
  }

  if (action === "favorite") {
    updateNote(
      id,
      (item) => ({
        ...item,
        favorite: !item.favorite,
      }),
      "Favorite updated."
    );
  }

  if (action === "pin") {
    updateNote(
      id,
      (item) => ({
        ...item,
        pinned: !item.pinned,
      }),
      "Pin updated."
    );
  }

  if (action === "trash") {
    updateNote(
      id,
      (item) => ({
        ...item,
        trashed: true,
      }),
      "Moved to trash."
    );
  }
}

function setTheme(theme) {
  elements.body.classList.toggle("light", theme === "light");

  elements.themeToggle.innerHTML =
    theme === "light"
      ? '<i class="ri-moon-line"></i>'
      : '<i class="ri-sun-line"></i>';

  localStorage.setItem(THEME_KEY, theme);
}

function exportNotes() {
  const blob = new Blob([JSON.stringify(state.notes, null, 2)], {
    type: "application/json",
  });

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

  reader.addEventListener(
    "load",
    () => {
      try {
        const imported = JSON.parse(
          reader.result
        );

        if (!Array.isArray(imported))
          throw new Error(
            "Invalid backup"
          );

        state.notes = imported .filter( (note) => note && typeof note === "object" ) .map(normalizeNote);

        saveNotes();

        render();

        showToast("Backup imported.");
      } catch {
        showToast(
          "Invalid JSON backup."
        );
      } finally {
        elements.importInput.value = "";
      }
    }
  );

  reader.readAsText(file);
}

function showToast(message) {
  elements.toast.textContent = message;

  elements.toast.classList.add("show");

  clearTimeout(showToast.timeout);

  showToast.timeout = setTimeout(() => {
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

// ─── Event Listeners ────────────────────────────────────────────────────────

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

elements.searchInput.addEventListener(
  "input",
  (event) => {
    state.query = event.target instanceof HTMLInputElement ? event.target.value : "";

  render();
});

// FIX 6: live-update the counter as the user types
elements.contentInput.addEventListener("input", updateCharCounter);

// FIX 5a: re-render when sort order changes
elements.sortSelect.addEventListener("change", render);

elements.notesGrid.addEventListener("click", handleCardAction);

// FIX 3: delegate card actions from the pinned grid too
elements.pinnedGrid.addEventListener("click", handleCardAction);

elements.newNoteTop.addEventListener("click", () => openEditor());

elements.newNoteSidebar.addEventListener("click", () => openEditor());

// FIX 5c: floating action button was wired to nothing
elements.floatingAddBtn.addEventListener("click", () => openEditor());

elements.closeModal.addEventListener("click", closeEditor);

elements.resetForm.addEventListener("click", resetEditor);

elements.noteForm.addEventListener("submit", handleSubmit);

elements.exportBtn.addEventListener("click", exportNotes);

elements.importInput.addEventListener("change", importNotes);

elements.modalOverlay.addEventListener("click", (event) => {
  if (event.target === elements.modalOverlay) {
    closeEditor();
  }
});

elements.confirmUnlock.addEventListener("click", handleUnlock);

elements.cancelUnlock.addEventListener("click", closeUnlockModal);

elements.unlockOverlay.addEventListener("click", (event) => {
  if (event.target === elements.unlockOverlay) {
    closeUnlockModal();
  }
});

elements.unlockInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleUnlock();
  }
});

elements.themeToggle.addEventListener("click", () => {
  setTheme(elements.body.classList.contains("light") ? "dark" : "light");
});

// FIX 5b: mobile menu button and overlay were completely unwired
elements.mobileMenuBtn.addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
  elements.mobileOverlay.classList.toggle("active");
});

elements.mobileOverlay.addEventListener("click", () => {
  document.getElementById("sidebar").classList.remove("open");
  elements.mobileOverlay.classList.remove("active");
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

  if (event.key === "Escape") {
    if (!elements.modalOverlay.hidden) {
      closeEditor();
    }

    if (!elements.unlockOverlay.hidden) {
      closeUnlockModal();
    }
  }
});

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

setTheme(localStorage.getItem(THEME_KEY) || "dark");

render();