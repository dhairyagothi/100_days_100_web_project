// ── State ──────────────────────────────────────────────────────────────────
let tasks = [];
let currentFilter = "all";

// ── LocalStorage helpers ───────────────────────────────────────────────────
const STORAGE_KEY  = "taskflow_tasks";
const THEME_KEY    = "taskflow_theme";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    tasks = raw ? JSON.parse(raw) : [];
  } catch (e) {
    tasks = [];
  }
}

const themes = {
  sunset:   { bg: "linear-gradient(135deg,#ff6b6b 0%,#feca57 100%)", accent: "#ff6b6b" },
  ocean:    { bg: "linear-gradient(135deg,#0652DD 0%,#1289A7 100%)",  accent: "#1289A7" },
  forest:   { bg: "linear-gradient(135deg,#11998e 0%,#38ef7d 100%)", accent: "#11998e" },
  midnight: { bg: "linear-gradient(135deg,#141E30 0%,#243B55 100%)", accent: "#4fc3f7" },
  aurora:   { bg: "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)", accent: "#a18cd1" },
};

// ── Core: Add Task ─────────────────────────────────────────────────────────
function addTask() {
  const input    = document.getElementById("task-input");
  const select   = document.getElementById("task-type-select");
  const text     = input.value.trim();
  const category = select.value;

  if (!text) {
    showToast("Please enter a task first! ✏️");
    input.focus();
    return;
  }

  const task = {
    id:       Date.now(),
    text,
    category,
    done:     false,
    created:  new Date().toLocaleString(),
  };

  tasks.push(task);
  saveTasks();
  input.value = "";
  select.selectedIndex = 0;

  renderTasks();
  updateStats();
  showToast("Task added! 🎉");
}

// ── Render ─────────────────────────────────────────────────────────────────
function renderTasks() {
  const list       = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");

  // Filter tasks
  const filtered = tasks.filter(t => {
    if (currentFilter === "all")     return true;
    if (currentFilter === "done")    return t.done;
    if (currentFilter === "pending") return !t.done;
    return t.category === currentFilter;
  });

  // Clear existing task cards (keep empty-state element)
  [...list.children].forEach(el => {
    if (!el.id || el.id !== "empty-state") el.remove();
  });

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    return;
  }
  emptyState.style.display = "none";

  filtered.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card" + (task.done ? " done" : "");
    card.dataset.id = task.id;

    const categoryColors = {
      Work:     "#FFDE59",
      Personal: "#FFC0CB",
      Urgent:   "#FF6B6B",
      Fitness:  "#B1EE99",
      Misc:     "#CAB9F5",
    };
    const accent = categoryColors[task.category] || "var(--accent, #a18cd1)";

    card.innerHTML = `
      <div class="task-left">
        <button class="task-check ${task.done ? "checked" : ""}" onclick="toggleTask(${task.id})" title="Mark complete">
          ${task.done ? "✓" : ""}
        </button>
        <div class="task-info">
          <span class="task-text ${task.done ? "struck" : ""}">${escapeHTML(task.text)}</span>
          <span class="task-meta">${task.category ? `<span class="task-tag" style="background:${accent}">${task.category}</span>` : ""} ${task.created}</span>
        </div>
      </div>
      <button class="task-delete" onclick="deleteTask(${task.id})" title="Delete">✕</button>
    `;

    list.appendChild(card);
  });
}

// ── Toggle / Delete ────────────────────────────────────────────────────────
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  saveTasks();
  renderTasks();
  updateStats();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
  updateStats();
  showToast("Task removed 🗑️");
}

function clearDone() {
  const count = tasks.filter(t => t.done).length;
  if (!count) { showToast("No completed tasks to clear."); return; }
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
  updateStats();
  showToast(`${count} completed task(s) cleared ✅`);
}

// ── Filter ─────────────────────────────────────────────────────────────────
function filterTasks(btn, filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderTasks();
}

// ── Stats ──────────────────────────────────────────────────────────────────
function updateStats() {
  const total   = tasks.length;
  const done    = tasks.filter(t => t.done).length;
  const pending = total - done;
  const pct     = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("stat-total").textContent   = total;
  document.getElementById("stat-done").textContent    = done;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("progress-fill").style.width = pct + "%";
  document.getElementById("progress-pct").textContent  = pct + "%";
}

// ── Tabs ───────────────────────────────────────────────────────────────────
function showHome() {
  document.getElementById("home-tab").style.display      = "block";
  document.getElementById("documents-tab").style.display = "none";
  document.getElementById("btn-home").classList.add("active");
  document.getElementById("btn-docs").classList.remove("active");
}

function showDocuments() {
  document.getElementById("home-tab").style.display      = "none";
  document.getElementById("documents-tab").style.display = "block";
  document.getElementById("btn-home").classList.remove("active");
  document.getElementById("btn-docs").classList.add("active");
}

// ── Themes ─────────────────────────────────────────────────────────────────
function applyTheme(name) {
  const theme = themes[name];
  if (!theme) return;
  document.body.style.background = theme.bg;
  document.documentElement.style.setProperty("--accent", theme.accent);
  localStorage.setItem(THEME_KEY, name);
}

// ── PDF Export ─────────────────────────────────────────────────────────────
function saveAsPDF() {
  if (!tasks.length) { showToast("No tasks to export!"); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("TaskFlow – To-Do List", 20, 20);
  doc.setFontSize(11);

  let y = 35;
  tasks.forEach((task, i) => {
    const status = task.done ? "[✓]" : "[ ]";
    const cat    = task.category ? ` [${task.category}]` : "";
    const line   = `${status} ${task.text}${cat}`;
    doc.text(line, 20, y);
    y += 10;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;
  doc.save(fileName);

  // Also record in documents tab
  const docsList = document.querySelector(".documents-list");
  const existing = docsList.querySelector(".empty-state");
  if (existing) existing.style.display = "none";

  const blob    = doc.output("blob");
  const fileURL = URL.createObjectURL(blob);

  const item = document.createElement("div");
  item.className = "document-item";
  item.innerHTML = `
    <span>${fileName}</span>
    <button onclick="window.open('${fileURL}','_blank')">View</button>
    <button onclick="downloadBlob('${fileURL}','${fileName}')">Download</button>
    <button onclick="this.parentElement.remove()">Delete</button>
  `;
  docsList.appendChild(item);

  showToast("PDF exported! 📄");
}

function downloadBlob(url, name) {
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
}

// ── Toast ──────────────────────────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2800);
}

// ── Keyboard shortcut: Enter to add & restore persisted state ─────────────
document.addEventListener("DOMContentLoaded", () => {
  // Restore tasks from localStorage
  loadTasks();
  renderTasks();
  updateStats();

  // Restore last theme
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) applyTheme(savedTheme);

  // Enter key shortcut
  const input = document.getElementById("task-input");
  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") addTask();
    });
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}