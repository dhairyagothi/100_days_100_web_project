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