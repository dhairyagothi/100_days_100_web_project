// --- DOM Element Registrations ---
const notesGrid = document.getElementById("notesGrid");
const openModalBtn = document.getElementById("openModal");
const openCardBtn = document.getElementById("openCard");
const closeModalBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
const saveBtn = document.getElementById("saveBtn");
const searchInput = document.getElementById("searchInput");
const noteCount = document.getElementById("noteCount");
const greeting = document.getElementById("greeting");
const themeToggle = document.getElementById("themeToggle");
const themeText = document.getElementById("themeText");

// Input Form Registration References
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const tagInput = document.getElementById("tag");

// Setup overlay runtime dynamic dependencies
const overlay = document.createElement("div");
overlay.className = "modal-overlay";
document.body.appendChild(overlay);

// --- Data Core Architecture State Initialization ---
let notes = JSON.parse(localStorage.getItem("notes-app-data")) || [];
let activeFilter = "all";
let editingNoteId = null;

// --- Setup System Time-Contextual Dashboard Greeting ---
function updateGreeting() {
  const hours = new Date().getHours();
  let msg = "Good Morning 🌅";
  if (hours >= 12 && hours < 17) msg = "Good Afternoon ☀️";
  if (hours >= 17) msg = "Good Evening 🌙";
  greeting.textContent = msg;
}

// --- Local Storage Sync Engine ---
function syncStorage() {
  localStorage.setItem("notes-app-data", JSON.stringify(notes));
  renderNotes();
}

// --- System Core UI Render Framework ---
function renderNotes() {
  // Clear grid space except for the initial interactive template card
  notesGrid.innerHTML = "";
  notesGrid.appendChild(openCardBtn);

  const query = searchInput.value.toLowerCase().trim();

  // Apply active system state filters
  let filteredNotes = notes.filter(note => {
    // Search constraints configuration fallback
    const matchesSearch = note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
    if (!matchesSearch) return false;

    // View filter conditional matching blocks
    if (activeFilter === "all") return !note.isTrash;
    if (activeFilter === "favorites") return note.isFavorite && !note.isTrash;
    if (activeFilter === "locked") return note.isLocked && !note.isTrash;
    if (activeFilter === "trash") return note.isTrash;

    // Tag structural matches selection check
    return note.tag.toLowerCase() === activeFilter.toLowerCase() && !note.isTrash;
  });

  // Calculate note volumes dashboard metric tracking values
  const activeTotal = notes.filter(n => !n.isTrash).length;
  noteCount.textContent = `You have ${activeTotal} active note${activeTotal === 1 ? "" : "s"}`;

  // Process item node creation markup pipeline loop
  filteredNotes.forEach(note => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div>
        <div class="card-header">
          <div class="card-title">${escapeHTML(note.title)}</div>
          <div class="card-tag-indicator ${note.tag}">${note.tag}</div>
        </div>
        <div class="card-body">${escapeHTML(note.content)}</div>
      </div>
      <div class="card-footer">
        <div>${note.date}</div>
        <div class="card-actions">
          ${note.isTrash ? `
            <span title="Restore Note" onclick="restoreNote(${note.id})">🔄</span>
            <span title="Delete Permanently" onclick="permaDeleteNote(${note.id})">❌</span>
          ` : `
            <span title="Toggle Favorite" onclick="toggleFavorite(${note.id})">${note.isFavorite ? "❤️" : "🤍"}</span>
            <span title="Toggle Lock" onclick="toggleLock(${note.id})">${note.isLocked ? "🔒" : "🔓"}</span>
            <span title="Edit Content" onclick="openEditModal(${note.id})">✏️</span>
            <span title="Move to Trash" onclick="trashNote(${note.id})">🗑️</span>
          `}
        </div>
      </div>
    `;
    notesGrid.appendChild(card);
  });
}

// Helper to escape characters and prevent XSS injections via input text injections
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

// --- Action Logic Operations (CRUD Model Implementations) ---

function saveNote() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();
  const tag = tagInput.value;

  if (!title || !content) {
    showToast("⚠️ Title and note content fields are required!");
    return;
  }

  if (editingNoteId) {
    // Process existing record edits update routine mapping
    notes = notes.map(note => note.id === editingNoteId ? {
      ...note, title, content, tag, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } : note);
    editingNoteId = null;
    showToast("✔ Note updated successfully!");
  } else {
    // Construct fresh structural tracking record entity template definitions
    const newNote = {
      id: Date.now(),
      title,
      content,
      tag,
      isFavorite: false,
      isLocked: false,
      isTrash: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    notes.unshift(newNote);
    showToast("✔ Note added successfully!");
  }

  closeModal();
  syncStorage();
}

window.toggleFavorite = (id) => {
  notes = notes.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n);
  syncStorage();
};

window.toggleLock = (id) => {
  notes = notes.map(n => n.id === id ? { ...n, isLocked: !n.isLocked } : n);
  syncStorage();
};

window.trashNote = (id) => {
  notes = notes.map(n => n.id === id ? { ...n, isTrash: true } : n);
  showToast("🗑️ Note moved to Trash container.");
  syncStorage();
};

window.restoreNote = (id) => {
  notes = notes.map(n => n.id === id ? { ...n, isTrash: false } : n);
  showToast("🔄 Note restored back to active view.");
  syncStorage();
};

window.permaDeleteNote = (id) => {
  if (confirm("Are you sure you want to permanently delete this note? This action cannot be undone.")) {
    notes = notes.filter(n => n.id !== id);
    showToast("❌ Note purged permanently.");
    syncStorage();
  }
};

// --- Modal Transitions Control Flow Mechanics ---

function openCreateModal() {
  editingNoteId = null;
  document.querySelector(".modal h2").textContent = "Add New Note";
  titleInput.value = "";
  contentInput.value = "";
  tagInput.value = "Work";

  modal.classList.add("active");
  overlay.classList.add("active");
}

window.openEditModal = (id) => {
  const target = notes.find(n => n.id === id);
  if (!target) return;

  editingNoteId = id;
  document.querySelector(".modal h2").textContent = "Edit Note Details";
  titleInput.value = target.title;
  contentInput.value = target.content;
  tagInput.value = target.tag;

  modal.classList.add("active");
  overlay.classList.add("active");
};

function closeModal() {
  modal.classList.remove("active");
  overlay.classList.remove("active");
}

// --- Interactive Toast Engine Logic ---
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => toast.classList.remove("active"), 3000);
}

// --- Active Theme Preference Engine Rules Engine ---
function initThemeEngine() {
  const userSelectedTheme = localStorage.getItem("notes-app-theme") || "light";
  document.documentElement.setAttribute("data-theme", userSelectedTheme);
  themeText.textContent = userSelectedTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

  themeToggle.addEventListener("click", () => {
    const targetTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("notes-app-theme", targetTheme);
    themeText.textContent = targetTheme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
  });
}

// --- Navigation Layout Filter Event Listeners Setup ---
function initNavigationFilters() {
  const interactiveNavTargets = document.querySelectorAll(".menu-item, .tag");

  interactiveNavTargets.forEach(element => {
    element.addEventListener("click", (e) => {
      // Clear dynamic layout class configurations across active state nodes
      document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));

      // Setup dynamic structural navigation elements highlight loops
      const filterValue = element.getAttribute("data-filter") || element.textContent.replace(/[^\w]/g, '').trim();
      activeFilter = filterValue.toLowerCase();

      if (element.classList.contains("menu-item")) {
        element.classList.add("active");
      }

      renderNotes();
    });
  });
}

// --- Global Tracking Action Binding Register Pipeline ---
openModalBtn.addEventListener("click", openCreateModal);
openCardBtn.addEventListener("click", openCreateModal);
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
saveBtn.addEventListener("click", saveNote);
searchInput.addEventListener("input", renderNotes);

// Runtime Application Entry Point Initializations
updateGreeting();
initThemeEngine();
initNavigationFilters();
renderNotes();
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
