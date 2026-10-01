// SnippetVault - Professional Dark Theme Code Organizer
let snippets = JSON.parse(localStorage.getItem("snippets")) || [];

let currentFilter = "all";
let currentLanguageFilter = null;
let currentTagFilter = null;
let currentSort = "newest";

// DOM Elements
const snippetsGrid = document.getElementById("snippets-grid");
const searchInput = document.getElementById("search-input");
const modal = new bootstrap.Modal(document.getElementById("snippet-modal"));
const pageTitle = document.getElementById("page-title");
const subtitle = document.getElementById("subtitle");
const noResults = document.getElementById("no-results");
const statsRow = document.getElementById("stats-row");

function saveSnippets() {
  localStorage.setItem("snippets", JSON.stringify(snippets));
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderStats() {
  const total = snippets.length;
  const favorites = snippets.filter((s) => s.favorite).length;
  const languages = new Set(snippets.map((s) => s.language)).size;
  const tags = new Set(snippets.flatMap((s) => s.tags)).size;

  statsRow.innerHTML = `
        <div class="col-6 col-md-3">
            <div class="card stats-card border-secondary text-center p-3">
                <h4 class="text-primary mb-1">${total}</h4>
                <small class="text-secondary">Total Snippets</small>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card stats-card border-secondary text-center p-3">
                <h4 class="text-warning mb-1">${favorites}</h4>
                <small class="text-secondary">Favorites</small>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card stats-card border-secondary text-center p-3">
                <h4 class="text-info mb-1">${languages}</h4>
                <small class="text-secondary">Languages</small>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="card stats-card border-secondary text-center p-3">
                <h4 class="text-success mb-1">${tags}</h4>
                <small class="text-secondary">Unique Tags</small>
            </div>
        </div>
    `;
}

function renderSnippets(filtered) {
  snippetsGrid.innerHTML = "";

  if (filtered.length === 0) {
    noResults.classList.remove("d-none");
    return;
  }
  noResults.classList.add("d-none");

  filtered.forEach((snippet) => {
    const cardHTML = `
            <div class="col">
                <div class="card snippet-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title text-truncate">${escapeHtml(snippet.title)}</h5>
                            <span class="badge language-badge bg-secondary">${snippet.language}</span>
                        </div>
                        
                        ${snippet.description ? `<p class="text-secondary small">${escapeHtml(snippet.description)}</p>` : ""}
                        
                        <div class="code-preview mb-3">${escapeHtml(snippet.code.substring(0, 155))}${snippet.code.length > 155 ? "..." : ""}</div>
                        
                        <div class="d-flex flex-wrap gap-1">
                            ${snippet.tags.map((tag) => `<span class="tag small">#${tag}</span>`).join("")}
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-top border-secondary d-flex justify-content-between align-items-center">
                        <div>
                            <button class="btn btn-sm btn-outline-primary copy-btn me-1" data-id="${snippet.id}" title="Copy">
                                <i class="bi bi-clipboard"></i>
                            </button>
                            <button class="btn btn-sm ${snippet.favorite ? "btn-warning" : "btn-outline-light"} favorite-btn" data-id="${snippet.id}">
                                <i class="bi ${snippet.favorite ? "bi-star-fill" : "bi-star"}"></i>
                            </button>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-outline-info edit-btn me-1" data-id="${snippet.id}">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${snippet.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    snippetsGrid.insertAdjacentHTML("beforeend", cardHTML);
  });

  attachListeners();
}

function attachListeners() {
  // Copy
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const snippet = snippets.find((s) => s.id === id);
      if (snippet) {
        navigator.clipboard.writeText(snippet.code);
        const icon = btn.querySelector("i");
        icon.className = "bi bi-check2";
        setTimeout(() => (icon.className = "bi bi-clipboard"), 1500);
      }
    });
  });

  // Edit
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => editSnippet(Number(btn.dataset.id)));
  });

  // Delete
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (confirm("Delete this snippet?"))
        deleteSnippet(Number(btn.dataset.id));
    });
  });

  // Favorite
  document.querySelectorAll(".favorite-btn").forEach((btn) => {
    btn.addEventListener("click", () => toggleFavorite(Number(btn.dataset.id)));
  });
}

function filterSnippets() {
  let filtered = [...snippets];

  const term = searchInput.value.toLowerCase().trim();
  if (term) {
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        (s.description && s.description.toLowerCase().includes(term)) ||
        s.code.toLowerCase().includes(term) ||
        s.tags.some((t) => t.toLowerCase().includes(term)),
    );
  }

  if (currentLanguageFilter)
    filtered = filtered.filter((s) => s.language === currentLanguageFilter);
  if (currentTagFilter)
    filtered = filtered.filter((s) => s.tags.includes(currentTagFilter));

  if (currentFilter === "favorites") {
    filtered = filtered.filter((s) => s.favorite);
  } else if (currentFilter === "recent") {
    filtered.sort((a, b) => b.id - a.id);
  }

  // Sort
  if (currentSort === "newest") filtered.sort((a, b) => b.id - a.id);
  else if (currentSort === "oldest") filtered.sort((a, b) => a.id - b.id);
  else if (currentSort === "title")
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  else if (currentSort === "language")
    filtered.sort((a, b) => a.language.localeCompare(b.language));

  renderSnippets(filtered);
  renderStats();
}

function renderLanguages() {
  const container = document.getElementById("language-list");
  const counts = {};
  snippets.forEach((s) => (counts[s.language] = (counts[s.language] || 0) + 1));

  let html = "";
  Object.keys(counts)
    .sort()
    .forEach((lang) => {
      html += `
            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center ${currentLanguageFilter === lang ? "active" : ""}" data-lang="${lang}">
                ${lang} <span class="badge bg-primary rounded-pill">${counts[lang]}</span>
            </a>`;
    });
  container.innerHTML =
    html || '<p class="text-muted small px-3">No languages yet</p>';
}

function renderTagCloud() {
  const container = document.getElementById("tag-cloud");
  const counts = {};
  snippets.forEach((s) =>
    s.tags.forEach((t) => (counts[t] = (counts[t] || 0) + 1)),
  );

  let html = "";
  Object.keys(counts)
    .sort()
    .forEach((tag) => {
      html += `<span class="tag px-3 py-1" data-tag="${tag}">#${tag} <small>(${counts[tag]})</small></span>`;
    });
  container.innerHTML = html || '<p class="text-muted small">No tags yet</p>';
}

// CRUD
function addSnippet() {
  document.getElementById("snippet-form").reset();
  document.getElementById("snippet-id").value = "";
  document.getElementById("modal-title").textContent = "New Snippet";
  modal.show();
}

function editSnippet(id) {
  const snippet = snippets.find((s) => s.id === id);
  if (!snippet) return;
  document.getElementById("snippet-id").value = snippet.id;
  document.getElementById("snippet-title").value = snippet.title;
  document.getElementById("snippet-language").value = snippet.language;
  document.getElementById("snippet-description").value =
    snippet.description || "";
  document.getElementById("snippet-tags").value = snippet.tags.join(", ");
  document.getElementById("snippet-code").value = snippet.code;
  document.getElementById("modal-title").textContent = "Edit Snippet";
  modal.show();
}

document.getElementById("save-snippet").addEventListener("click", () => {
  const id = document.getElementById("snippet-id").value;
  const title = document.getElementById("snippet-title").value.trim();
  const language = document.getElementById("snippet-language").value;
  const description = document
    .getElementById("snippet-description")
    .value.trim();
  const tags = document
    .getElementById("snippet-tags")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const code = document.getElementById("snippet-code").value.trim();

  if (!title || !language || !code)
    return alert("Title, Language & Code required");

  if (id) {
    const s = snippets.find((sn) => sn.id == id);
    if (s) Object.assign(s, { title, language, description, tags, code });
  } else {
    snippets.unshift({
      id: Date.now(),
      title,
      language,
      description,
      tags,
      code,
      favorite: false,
    });
  }

  saveSnippets();
  modal.hide();
  filterSnippets();
  renderLanguages();
  renderTagCloud();
});

function deleteSnippet(id) {
  snippets = snippets.filter((s) => s.id !== id);
  saveSnippets();
  filterSnippets();
  renderLanguages();
  renderTagCloud();
}

function toggleFavorite(id) {
  const snippet = snippets.find((s) => s.id === id);
  if (snippet) {
    snippet.favorite = !snippet.favorite;
    saveSnippets();
    filterSnippets();
  }
}

// Export / Import
document.getElementById("export-btn").addEventListener("click", () => {
  const data = JSON.stringify(snippets, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `snippets_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
});

document.getElementById("import-btn").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target.result);
        snippets = [...snippets, ...imported];
        saveSnippets();
        filterSnippets();
        renderLanguages();
        renderTagCloud();
        alert("✅ Snippets imported successfully!");
      } catch (err) {
        alert("❌ Invalid file");
      }
    };
    reader.readAsText(file);
  };
  input.click();
});

// Event Listeners
searchInput.addEventListener("input", filterSnippets);

document.querySelectorAll(".filter-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".filter-link")
      .forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    currentFilter = link.dataset.filter;
    pageTitle.textContent = link.textContent.trim();
    subtitle.textContent =
      currentFilter === "recent"
        ? "Recently added snippets"
        : "Your personal code library";
    currentLanguageFilter = null;
    currentTagFilter = null;
    filterSnippets();
  });
});

document
  .getElementById("add-snippet-btn")
  .addEventListener("click", addSnippet);

// Sort
document.querySelectorAll("#sort-options a").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll("#sort-options a")
      .forEach((a) => a.classList.remove("active"));
    item.classList.add("active");
    currentSort = item.dataset.sort;
    filterSnippets();
  });
});

// Language & Tag filters
document.getElementById("language-list").addEventListener("click", (e) => {
  const link = e.target.closest(".list-group-item");
  if (link) {
    const lang = link.dataset.lang;
    currentLanguageFilter = currentLanguageFilter === lang ? null : lang;
    currentTagFilter = null;
    filterSnippets();
    renderLanguages();
  }
});

document.getElementById("tag-cloud").addEventListener("click", (e) => {
  if (e.target.classList.contains("tag")) {
    const tag = e.target.dataset.tag;
    currentTagFilter = currentTagFilter === tag ? null : tag;
    filterSnippets();
    renderTagCloud();
  }
});

// Keyboard Shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "k") {
    e.preventDefault();
    searchInput.focus();
  }
  if (e.key === "Escape" && modal._isShown) modal.hide();
});

// Init
function init() {
  filterSnippets();
  renderLanguages();
  renderTagCloud();
}

init();
