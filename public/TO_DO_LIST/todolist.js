
// 1. DOM Element References (match HTML ids/classes)
const taskInput = document.getElementById("task");
const taskTypeSelect = document.getElementById("task-category");
const taskList = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const documentsList = document.querySelector('.documents-list');

// Progress / stats elements present in HTML
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Data State — loaded from localStorage on startup (Bug 1 fix: persistence)
let tasks = [];
try {
  const stored = localStorage.getItem('todo-tasks');
  if (stored) tasks = JSON.parse(stored);
} catch (e) {
  tasks = [];
}
let currentFilter = "all";

// Persist tasks to localStorage on every mutation
function saveTasks() {
  try { localStorage.setItem('todo-tasks', JSON.stringify(tasks)); } catch (e) { }
}

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;

  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  // Bug 4 fix: require a category selection; show a clear warning if omitted
  if (!category) {
    showToast("⚠️ Please select a category!");
    taskTypeSelect.focus();
    return;
  }

  // Find category color from the dropdown configuration (fallback)
  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = (selectedOption && selectedOption.getAttribute && selectedOption.getAttribute("data-color")) || "#ffb86b";

  // Create local task object
  const newTask = {
    id: Date.now(),
    text: text,
    category: category,
    color: color,
    completed: false
  };

  tasks.push(newTask);
  saveTasks(); // Bug 1 fix: persist after add
  taskInput.value = "";
  taskTypeSelect.value = ""; // Reset dropdown

  renderTasks();
  showToast("✅ Task added successfully!");
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, completed: !task.completed };
    return task;
  });
  saveTasks(); // Bug 1 fix: persist after toggle
  renderTasks();
}

function deleteTask(id) {
  // Triggers exit animation before layout re-render
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = "fadeOut 0.25s ease forwards";
    setTimeout(() => {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks(); // Bug 1 fix: persist after delete
      renderTasks();
    }, 250);
  }
}

function clearDone() {
  const previousLength = tasks.length;
  tasks = tasks.filter(task => !task.completed);
  if (tasks.length === previousLength) {
    showToast("ℹ️ No completed tasks to clear.");
  } else {
    saveTasks(); // Bug 1 fix: persist after clear
    renderTasks();
    showToast("🧹 Cleared all finished tasks!");
  }
}

// 3. Filtering & Rendering UI
function filterTasks(buttonElement, filterValue) {
  // Update active states on filter row
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  buttonElement.classList.add("active");

  currentFilter = filterValue;
  renderTasks();
}

function renderTasks() {
  // Filter core task pool
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "done") return task.completed;
    return task.category === currentFilter; // Matches Category Strings
  });

  // Clear container safely — no innerHTML (Bug 2 fix: XSS prevention)
  taskList.replaceChildren();

  // Toggle Visibility of Empty State Element
  if (filteredTasks.length === 0) {
    if (emptyState) {
      taskList.appendChild(emptyState);
      emptyState.style.display = "flex";
    }
  } else {
    if (emptyState) emptyState.style.display = "none";

    filteredTasks.forEach((task, idx) => {
      // Bug 3 fix: use <li> instead of <div> so <ul> contains valid children
      const card = document.createElement("li");
      card.className = "notes" + (task.completed ? " completed" : "");
      card.setAttribute("data-id", task.id);
      card.style.setProperty("--i", idx);

      // Bug 2 fix: build the card entirely with safe DOM APIs — no innerHTML
      const noteRow = document.createElement("div");
      noteRow.className = "note-row";

      // Editable textarea — textContent sets value safely
      const textarea = document.createElement("textarea");
      textarea.className = "note-text";
      textarea.value = task.text; // safe assignment; no HTML parsing
      textarea.addEventListener("change", () => updateTaskText(task.id, textarea.value));

      const noteActions = document.createElement("div");
      noteActions.className = "note-actions";

      const badge = document.createElement("div");
      badge.className = "category-badge";
      if (task.completed) {
        badge.textContent = `${task.category} | ✅ Done`;
        badge.style.opacity = "0.8";
      } else {
        badge.textContent = task.category;
      }

      const btnGroup = document.createElement("div");

      const checkBtn = document.createElement("button");
      checkBtn.className = "note-check";
      checkBtn.textContent = task.completed ? "↩" : "✔";
      checkBtn.title = task.completed ? "Mark as Pending" : "Mark as Completed";
      checkBtn.addEventListener("click", () => toggleTask(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "note-delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      btnGroup.appendChild(checkBtn);
      btnGroup.appendChild(deleteBtn);
      noteActions.appendChild(badge);
      noteActions.appendChild(btnGroup);
      noteRow.appendChild(textarea);
      noteRow.appendChild(noteActions);
      card.appendChild(noteRow);

      taskList.appendChild(card);
    });
  }

  updateMetrics();
}

function updateTaskText(id, newText) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, text: newText.trim() || "Untitled Task" };
    return task;
  });
  saveTasks(); // Bug 1 fix: persist inline edits
}

function updateMetrics() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Update progress UI (matches HTML)
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${done} / ${total} done`;

  // Show ‘Clear Done’ button only when at least one task is completed
  const clearDoneBtn = document.getElementById('cleardone');
  if (clearDoneBtn) clearDoneBtn.hidden = done === 0;
}

// 4. Tab Navigation System
function showHome() {
  document.getElementById("nav-home").classList.add("active");
  document.getElementById("nav-documents").classList.remove("active");
  document.getElementById("home-tab").removeAttribute("hidden");
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").setAttribute("hidden", "");
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("nav-home").classList.remove("active");
  document.getElementById("nav-documents").classList.add("active");
  document.getElementById("home-tab").setAttribute("hidden", "");
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").removeAttribute("hidden");
  document.getElementById("documents-tab").style.display = "block";
}

// Wire up nav link click listeners
const navHome = document.getElementById("nav-home");
const navDocuments = document.getElementById("nav-documents");
if (navHome) {
  navHome.addEventListener("click", (e) => { e.preventDefault(); showHome(); });
}
if (navDocuments) {
  navDocuments.addEventListener("click", (e) => { e.preventDefault(); showDocuments(); });
}

// 5. Theme Customization System
function applyTheme(themeName) {
  document.body.classList.remove(
    "theme1",
    "theme2",
    "theme3",
    "theme4",
    "theme5"
  );

  document.body.classList.add(themeName);

  document.querySelectorAll(".theme-btn")
    .forEach(btn => btn.classList.remove("active"));

  const activeBtn = document.querySelector(
    `[data-theme="${themeName}"]`
  );

  if (activeBtn) {
    activeBtn.classList.add("active");
  }
  try { localStorage.setItem('todo-theme', themeName); } catch (e) { }
}
document.querySelectorAll(".theme-btn").forEach(button => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    if (!theme) return;
    applyTheme(theme);
  });
});

// 6. PDF System using jsPDF Global Library
function saveAsPDF() {
  if (tasks.length === 0) {
    showToast("❌ Cannot export empty list!");
    return;
  }

  // Snapshot the current task list at this exact moment
  const snapshot = [...tasks];
  const doneCount = snapshot.filter(t => t.completed).length;
  const pendingCount = snapshot.length - doneCount;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // jsPDF v2.x API: doc.text(text, x, y)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TaskFlow Agenda Report", 20, 24);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
  doc.text(`Tasks: ${snapshot.length} total  |  ${doneCount} done  |  ${pendingCount} pending`, 20, 38);
  doc.line(20, 42, 190, 42);

  let verticalCursor = 52;
  doc.setFontSize(12);

  snapshot.forEach((task, index) => {
    if (verticalCursor > 270) { doc.addPage(); verticalCursor = 20; }
    const status = task.completed ? "[DONE]" : "[PENDING]";
    const printLine = `${index + 1}. ${status} (${task.category}) — ${task.text}`;
    doc.text(printLine, 20, verticalCursor);
    verticalCursor += 10;
  });

  const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));

  appendDocumentToList(fileName, fileURL, snapshot.length, doneCount, timeLabel);
  showToast(`📥 Saved ${snapshot.length} task${snapshot.length !== 1 ? 's' : ''} to Documents!`);

  // Auto-navigate to Documents tab so the user sees the new entry
  showDocuments();
}

function appendDocumentToList(fileName, fileURL, taskCount, doneCount, timeLabel) {
  // Hide the empty-state placeholder (it is a sibling of the ul, not inside it)
  const docEmptyState = document.getElementById("emptyDocsState");
  if (docEmptyState) docEmptyState.style.display = "none";

  // Bug 3 fix: use <li> instead of <div> — <ul> must only contain <li> children
  // Bug 2 fix: build entirely with safe DOM APIs — no innerHTML
  const docItem = document.createElement("li");
  docItem.className = "doc-item";

  const iconDiv = document.createElement("div");
  iconDiv.className = "doc-icon";
  iconDiv.textContent = "📄";

  const infoDiv = document.createElement("div");
  infoDiv.className = "doc-info";

  const nameDiv = document.createElement("div");
  nameDiv.className = "doc-name";
  nameDiv.textContent = fileName; // safe: textContent never parses HTML

  const metaDiv = document.createElement("div");
  metaDiv.className = "doc-meta";

  const dateSpan = document.createElement("span");
  dateSpan.className = "doc-date";
  dateSpan.textContent = `${new Date().toLocaleDateString()} ${timeLabel || ''}`;

  const countSpan = document.createElement("span");
  countSpan.className = "doc-task-count";
  countSpan.textContent = `${taskCount} task${taskCount !== 1 ? 's' : ''} · ${doneCount} done`;

  metaDiv.appendChild(dateSpan);
  metaDiv.appendChild(countSpan);
  infoDiv.appendChild(nameDiv);
  infoDiv.appendChild(metaDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "doc-actions";

  const viewBtn = document.createElement("button");
  viewBtn.className = "doc-btn";
  viewBtn.textContent = "View";
  viewBtn.addEventListener("click", () => window.open(fileURL, "_blank"));

  const dlLink = document.createElement("a");
  dlLink.className = "doc-btn";
  dlLink.href = fileURL;
  dlLink.download = fileName; // safe attribute assignment
  dlLink.textContent = "Download";
  dlLink.style.cssText = "text-decoration:none;display:inline-block;text-align:center;";

  const delBtn = document.createElement("button");
  delBtn.className = "doc-btn del";
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => removeDocumentItem(delBtn));

  actionsDiv.appendChild(viewBtn);
  actionsDiv.appendChild(dlLink);
  actionsDiv.appendChild(delBtn);

  docItem.appendChild(iconDiv);
  docItem.appendChild(infoDiv);
  docItem.appendChild(actionsDiv);

  // PREPEND so newest document is always at the TOP — prevents users from
  // accidentally viewing an older document and thinking tasks are missing.
  documentsList.prepend(docItem);
}

function removeDocumentItem(button) {
  button.closest(".doc-item").remove();
  if (documentsList.children.length === 0) {
    // Restore the empty-state placeholder when all docs are deleted
    const docEmptyState = document.getElementById("emptyDocsState");
    if (docEmptyState) docEmptyState.style.display = "flex";
  }
}

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("pdfMessage");
  if (!toast) {
    console.log('Toast:', message);
    return;
  }
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Listen for enter key in the input element
// Form submit handler + Enter key
const taskForm = document.getElementById('task-form');
if (taskForm) {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
  });
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});
// Wire up Save as PDF button click listener
const savePdfBtn = document.getElementById('savepdf');
if (savePdfBtn) {
  savePdfBtn.addEventListener('click', () => saveAsPDF());
}

// Wire up Clear Done button click listener
const clearDoneBtn = document.getElementById('cleardone');
if (clearDoneBtn) {
  clearDoneBtn.addEventListener('click', function () {
    if (typeof clearDone === 'function') clearDone();
  });
}

// Wire up filter bar buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof filterTasks === 'function') filterTasks(btn, btn.dataset.filter);
  });
});

// --- Workspace Skin (Theme Switcher) ---
(function initTheme() {
  // Restore persisted theme on load
  const saved = localStorage.getItem('todo-workspace-theme');
  if (saved) document.body.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('todo-workspace-theme', theme);
      }
    });
  });
})();

// --- Page Initialisation ---
// Set Home tab as active and apply default/saved theme on load
showHome();

try {
  const saved = localStorage.getItem('todo-theme');
  applyTheme(saved || 'theme1'); // fallback to theme1 if nothing saved
} catch (e) {
  applyTheme('theme1');
}

// Render tasks loaded from localStorage so they appear immediately on refresh
renderTasks();
