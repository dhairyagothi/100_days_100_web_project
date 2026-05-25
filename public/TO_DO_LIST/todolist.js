// 1. DOM Element References (match HTML ids/classes)
const taskInput = document.getElementById("task");
const taskTypeSelect = document.getElementById("task-category");
const taskList = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const emptyDocsState = document.getElementById("emptyDocsState");
const documentsList = document.querySelector('.documents-list');

// Progress / stats elements present in HTML
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Data State
const STORAGE_KEY = 'taskflow-tasks';
let tasks = [];
let currentFilter = "all";

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) tasks = parsed;
    }
  } catch (e) {
    console.warn('Could not load saved tasks:', e);
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Could not save tasks:', e);
  }
}

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  
  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  if (!category) {
    showToast("⚠️ Please select a category!");
    return;
  }

  // Find category color from the dropdown configuration (fallback)
  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = (selectedOption && selectedOption.getAttribute && selectedOption.getAttribute("data-color")) || "#ffb86b";

  // Create local task object
  const newTask = {
    id: Date.now(),
    text: text,
    category: category || "Misc",
    color: color,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = "";
  taskTypeSelect.selectedIndex = 0;

  saveTasks();
  renderTasks();
  showToast("✅ Task added successfully!");
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, completed: !task.completed };
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  const removeFromState = () => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
  };

  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = "fadeOut 0.25s ease forwards";
    setTimeout(removeFromState, 250);
  } else {
    removeFromState();
  }
}

function clearDone() {
  const previousLength = tasks.length;
  tasks = tasks.filter(task => !task.completed);
  if (tasks.length === previousLength) {
    showToast("ℹ️ No completed tasks to clear.");
  } else {
    saveTasks();
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

  if (emptyState) {
    emptyState.style.display = filteredTasks.length === 0 ? "flex" : "none";
  }

  taskList.innerHTML = "";

  if (filteredTasks.length > 0) {
    filteredTasks.forEach((task, idx) => {
      const card = document.createElement("li");
      card.className = `notes` + (task.completed ? " completed" : "");
      card.setAttribute("data-id", task.id);
      card.style.setProperty("--i", idx);

      card.innerHTML = `
        <div class="note-row">
          <textarea class="note-text" onchange="updateTaskText(${task.id}, this.value)">${task.text}</textarea>
          <div class="note-actions">
            <div class="category-badge">${task.category}</div>
            <div>
              <button class="note-check" onclick="toggleTask(${task.id})">${task.completed ? '✓' : '✔'}</button>
              <button class="note-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
          </div>
        </div>
      `;
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
  saveTasks();
}

function updateMetrics() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Update progress UI (matches HTML)
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${done} / ${total} done`;
}

// 4. Tab Navigation System
function showHome() {
  const navHome = document.getElementById("nav-home");
  const navDocs = document.getElementById("nav-documents");
  const homeTab = document.getElementById("home-tab");
  const docsTab = document.getElementById("documents-tab");

  if (navHome) navHome.setAttribute("aria-current", "page");
  if (navDocs) navDocs.removeAttribute("aria-current");
  if (homeTab) homeTab.hidden = false;
  if (docsTab) docsTab.hidden = true;
}

function showDocuments() {
  const navHome = document.getElementById("nav-home");
  const navDocs = document.getElementById("nav-documents");
  const homeTab = document.getElementById("home-tab");
  const docsTab = document.getElementById("documents-tab");

  if (navHome) navHome.removeAttribute("aria-current");
  if (navDocs) navDocs.setAttribute("aria-current", "page");
  if (homeTab) homeTab.hidden = true;
  if (docsTab) docsTab.hidden = false;
  updateDocumentsEmptyState();
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
  try { localStorage.setItem('todo-theme', themeName); } catch (e) {}
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

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TaskFlow Agenda Report", 20, 24);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);
  doc.line(20, 36, 190, 36);

  let verticalCursor = 46;
  doc.setFontSize(12);

  tasks.forEach((task, index) => {
    const status = task.completed ? "[DONE]" : "[PENDING]";
    const printLine = `${index + 1}. ${status} (${task.category}) — ${task.text}`;
    
    doc.text(20, verticalCursor, printLine);
    verticalCursor += 10;
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));
  
  appendDocumentToList(fileName, fileURL);
  showToast("📥 Exported list to Documents Tab!");
}

function updateDocumentsEmptyState() {
  if (!documentsList || !emptyDocsState) return;
  const hasDocs = documentsList.querySelectorAll('.document-item').length > 0;
  emptyDocsState.style.display = hasDocs ? 'none' : 'flex';
}

function appendDocumentToList(fileName, fileURL) {
  if (!documentsList) return;

  const docItem = document.createElement("li");
  docItem.className = "document-item";
  docItem.innerHTML = `
    <span>📄 ${fileName}</span>
    <span>${new Date().toLocaleDateString()}</span>
    <div class="doc-actions">
      <button type="button" onclick="window.open('${fileURL}', '_blank')">View</button>
      <a href="${fileURL}" download="${fileName}">Download</a>
      <button type="button" onclick="removeDocumentItem(this)">Delete</button>
    </div>
  `;
  documentsList.appendChild(docItem);
  updateDocumentsEmptyState();
}

function removeDocumentItem(button) {
  button.closest(".document-item")?.remove();
  updateDocumentsEmptyState();
}

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("pdfMessage");
  if (!toast) {
    console.log('Toast:', message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => {
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

const navHome = document.getElementById("nav-home");
const navDocs = document.getElementById("nav-documents");
const savePdfBtn = document.getElementById("savepdf");

if (navHome) {
  navHome.addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
  });
}

if (navDocs) {
  navDocs.addEventListener("click", (e) => {
    e.preventDefault();
    showDocuments();
  });
}

if (savePdfBtn) {
  savePdfBtn.addEventListener("click", saveAsPDF);
}

window.toggleTask = toggleTask;
window.deleteTask = deleteTask;
window.updateTaskText = updateTaskText;
window.removeDocumentItem = removeDocumentItem;

loadTasks();
renderTasks();
showHome();
updateDocumentsEmptyState();

try {
  const saved = localStorage.getItem('todo-theme');
  if (saved) applyTheme(saved);
} catch (e) {}