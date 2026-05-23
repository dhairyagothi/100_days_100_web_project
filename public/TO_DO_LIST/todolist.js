const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task");
const taskCategory = document.getElementById("task-category");
const notesContainer = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const savePdfButton = document.getElementById("savepdf");
const pdfMessage = document.getElementById("pdfMessage");
const documentsList = document.querySelector(".documents-list");
const emptyDocsState = document.getElementById("emptyDocsState");
const homeTab = document.getElementById("home-tab");
const documentsTab = document.getElementById("documents-tab");
const navHome = document.getElementById("nav-home");
const navDocuments = document.getElementById("nav-documents");
const themeButtons = document.querySelectorAll(".theme-btn");

const TASK_STORAGE_KEY = "todo-list-tasks";
const THEME_STORAGE_KEY = "todo-list-theme";
const THEME_CLASSES = ["theme-theme1", "theme-theme2", "theme-theme3", "theme-theme4", "theme-theme5"];
const CATEGORY_COLORS = {
  Work: "#4f8dff",
  Personal: "#7c63ff",
  Urgent: "#ef4444",
  Fitness: "#14b8a6",
  Miscellaneous: "#ffb86b"
};

let tasks = loadTasks();

function loadTasks() {
  try {
    const stored = localStorage.getItem(TASK_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showMessage(message) {
  pdfMessage.textContent = message;
  pdfMessage.style.display = "block";
  window.clearTimeout(showMessage.timeoutId);
  showMessage.timeoutId = window.setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 2200);
}

function addTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();
  const category = taskCategory.value || "Miscellaneous";

  if (!text) {
    showMessage("Please enter a task first.");
    taskInput.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    category,
    completed: false
  });

  taskInput.value = "";
  taskCategory.value = "";
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function updateTaskText(id, value) {
  const text = value.trim();
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, text: text || task.text } : task
  );
  saveTasks();
  renderTasks();
}

function updateTaskCategory(id, category) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, category } : task
  );
  saveTasks();
  renderTasks();
}

function renderTasks() {
  notesContainer.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.hidden = false;
    updateProgress();
    return;
  }

  emptyState.hidden = true;
  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    item.className = "notes";
    item.style.setProperty("--i", index);

    const categoryColor = CATEGORY_COLORS[task.category] || CATEGORY_COLORS.Miscellaneous;
    const completedClass = task.completed ? " completed" : "";
    const categoryOptions = Object.keys(CATEGORY_COLORS)
      .map((category) => (
        `<option value="${category}"${category === task.category ? " selected" : ""}>${category}</option>`
      ))
      .join("");

    item.innerHTML = `
      <span class="category-badge" style="background:${categoryColor}22;color:${categoryColor}">
        ${escapeHtml(task.category)}
      </span>
      <div class="note-row">
        <input
          class="note-text${completedClass}"
          value="${escapeHtml(task.text)}"
          aria-label="Task text"
          data-action="edit"
          data-id="${task.id}"
        />
      </div>
      <div class="note-actions">
        <select class="note-type" data-action="category" data-id="${task.id}" aria-label="Task category">
          ${categoryOptions}
        </select>
        <button class="note-check" type="button" data-action="toggle" data-id="${task.id}">
          ${task.completed ? "Undo" : "Done"}
        </button>
        <button class="note-delete" type="button" data-action="delete" data-id="${task.id}">
          Delete
        </button>
      </div>
    `;

    notesContainer.appendChild(item);
  });

  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${done} / ${total} done`;
}

function setTab(tabName) {
  const showDocuments = tabName === "documents";
  homeTab.hidden = showDocuments;
  documentsTab.hidden = !showDocuments;
  navHome.setAttribute("aria-current", showDocuments ? "false" : "page");
  navDocuments.setAttribute("aria-current", showDocuments ? "page" : "false");
}

function applyTheme(themeName) {
  const nextTheme = THEME_CLASSES.includes(`theme-${themeName}`) ? themeName : "theme1";

  document.body.classList.remove(...THEME_CLASSES);
  document.body.classList.add(`theme-${nextTheme}`);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

  themeButtons.forEach((button) => {
    const isActive = button.dataset.theme === nextTheme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function saveAsPdf() {
  if (tasks.length === 0) {
    showMessage("Add at least one task before exporting.");
    return;
  }

  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    showMessage("PDF library is still loading. Try again in a moment.");
    return;
  }

  const doc = new jsPDF();
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(20);
  doc.text("To-Do List", 20, 24);

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 34);

  let y = 48;
  tasks.forEach((task, index) => {
    const status = task.completed ? "Done" : "Pending";
    const line = `${index + 1}. [${status}] ${task.category}: ${task.text}`;
    doc.text(line.slice(0, 95), 20, y);
    y += 9;

    if (y > 280) {
      doc.addPage();
      y = 24;
    }
  });

  const fileName = `todo-list-${Date.now()}.pdf`;
  const blobUrl = URL.createObjectURL(doc.output("blob"));
  addDocument(fileName, blobUrl);
  showMessage("PDF created successfully.");
}

function addDocument(fileName, blobUrl) {
  emptyDocsState.hidden = true;

  const item = document.createElement("li");
  item.className = "document-item";
  item.innerHTML = `
    <span>${escapeHtml(fileName)}</span>
    <div class="doc-actions">
      <button type="button" data-action="view-doc">View</button>
      <button type="button" data-action="download-doc">Download</button>
      <button type="button" data-action="delete-doc">Delete</button>
    </div>
  `;

  item.querySelector('[data-action="view-doc"]').addEventListener("click", () => {
    window.open(blobUrl, "_blank", "noopener");
  });
  item.querySelector('[data-action="download-doc"]').addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.click();
  });
  item.querySelector('[data-action="delete-doc"]').addEventListener("click", () => {
    URL.revokeObjectURL(blobUrl);
    item.remove();
    emptyDocsState.hidden = documentsList.children.length > 0;
  });

  documentsList.appendChild(item);
}

taskForm.addEventListener("submit", addTask);
savePdfButton.addEventListener("click", saveAsPdf);

notesContainer.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) return;

  const id = Number(actionButton.dataset.id);
  if (actionButton.dataset.action === "toggle") toggleTask(id);
  if (actionButton.dataset.action === "delete") deleteTask(id);
});

notesContainer.addEventListener("change", (event) => {
  const target = event.target;
  const id = Number(target.dataset.id);

  if (target.dataset.action === "edit") updateTaskText(id, target.value);
  if (target.dataset.action === "category") updateTaskCategory(id, target.value);
});

navHome.addEventListener("click", (event) => {
  event.preventDefault();
  setTab("home");
});

navDocuments.addEventListener("click", (event) => {
  event.preventDefault();
  setTab("documents");
});

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

applyTheme(localStorage.getItem(THEME_STORAGE_KEY) || "theme1");
renderTasks();
