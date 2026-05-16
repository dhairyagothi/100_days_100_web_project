const STORAGE_KEY = "taskflow.tasks";
const DOCS_KEY = "taskflow.documents";

let tasks = [];
let documents = [];
let activeFilter = "all";

const taskInput = document.getElementById("task-input");
const taskTypeSelect = document.getElementById("task-type-select");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const documentsList = document.getElementById("documents-list");
const toast = document.getElementById("toast");

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  renderTasks();
  renderDocuments();
  bindTaskInput();
  applyTheme(localStorage.getItem("taskflow.theme") || "sunset");
});

function bindTaskInput() {
  if (!taskInput) return;

  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const type = taskTypeSelect.value || "Misc";
  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = selectedOption?.dataset.color || "#CAB9F5";

  if (!text) {
    showToast("Type a task first");
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: createTaskId(),
    text,
    type,
    color,
    done: false,
    createdAt: new Date().toISOString(),
  });

  taskInput.value = "";
  taskTypeSelect.value = "";
  saveTasks();
  renderTasks();
  showToast("Task added");
  taskInput.focus();
}

function renderTasks() {
  const visibleTasks = tasks.filter(matchesActiveFilter);

  taskList.querySelectorAll(".task-card").forEach((card) => card.remove());
  emptyState.style.display = visibleTasks.length ? "none" : "flex";

  visibleTasks.forEach((task) => {
    const card = document.createElement("div");
    card.className = `task-card${task.done ? " done" : ""}`;
    card.style.setProperty("--tag-color", task.color);
    card.dataset.id = task.id;

    const checkButton = document.createElement("button");
    checkButton.className = `task-check${task.done ? " checked" : ""}`;
    checkButton.type = "button";
    checkButton.innerHTML = task.done ? "&#10003;" : "";
    checkButton.setAttribute("aria-label", task.done ? "Mark task pending" : "Mark task done");
    checkButton.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("input");
    text.className = "task-text";
    text.value = task.text;
    text.addEventListener("change", () => updateTaskText(task.id, text.value));
    text.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        text.blur();
      }
    });

    const tag = document.createElement("span");
    tag.className = "task-tag";
    tag.textContent = task.type;

    const deleteButton = document.createElement("button");
    deleteButton.className = "task-del";
    deleteButton.type = "button";
    deleteButton.innerHTML = "&times;";
    deleteButton.setAttribute("aria-label", "Delete task");
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    card.append(checkButton, text, tag, deleteButton);
    taskList.appendChild(card);
  });

  updateStats();
}

function matchesActiveFilter(task) {
  if (activeFilter === "all") return true;
  if (activeFilter === "done") return task.done;
  if (activeFilter === "pending") return !task.done;
  return task.type === activeFilter;
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  saveTasks();
  renderTasks();
}

function updateTaskText(id, text) {
  const nextText = text.trim();
  if (!nextText) {
    renderTasks();
    return;
  }

  tasks = tasks.map((task) =>
    task.id === id ? { ...task, text: nextText } : task
  );
  saveTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
  showToast("Task deleted");
}

function filterTasks(button, filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn === button);
  });
  renderTasks();
}

function clearDone() {
  const before = tasks.length;
  tasks = tasks.filter((task) => !task.done);
  saveTasks();
  renderTasks();
  showToast(before === tasks.length ? "No completed tasks" : "Completed tasks cleared");
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.done).length;
  const pending = total - done;
  const percent = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-pending").textContent = pending;
  document.getElementById("progress-fill").style.width = `${percent}%`;
  document.getElementById("progress-pct").textContent = `${percent}%`;
}

function saveAsPDF() {
  if (!tasks.length) {
    showToast("Add a task before exporting");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const fileName = `TaskFlow_${Date.now()}.pdf`;

  doc.setFontSize(18);
  doc.text("TaskFlow", 20, 20);
  doc.setFontSize(11);

  tasks.forEach((task, index) => {
    const marker = task.done ? "[x]" : "[ ]";
    doc.text(`${marker} ${task.text} (${task.type})`, 20, 35 + index * 8);
  });

  const blob = doc.output("blob");
  const fileURL = URL.createObjectURL(blob);
  documents.unshift({ fileName, fileURL, createdAt: new Date().toLocaleString() });
  saveDocuments();
  renderDocuments();
  showToast("PDF saved to documents");
}

function renderDocuments() {
  documentsList.innerHTML = "";

  if (!documents.length) {
    documentsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">DOC</div>
        <p>No documents saved yet. Export your tasks!</p>
      </div>
    `;
    return;
  }

  documents.forEach((documentItem, index) => {
    const item = document.createElement("div");
    item.className = "doc-item";
    item.innerHTML = `
      <div class="doc-icon">PDF</div>
      <div class="doc-name">${documentItem.fileName}</div>
      <div class="doc-date">${documentItem.createdAt}</div>
      <div class="doc-actions">
        <button class="doc-btn" type="button">View</button>
        <button class="doc-btn" type="button">Download</button>
        <button class="doc-btn del" type="button">Delete</button>
      </div>
    `;

    const [viewButton, downloadButton, deleteButton] = item.querySelectorAll("button");
    viewButton.addEventListener("click", () => window.open(documentItem.fileURL, "_blank"));
    downloadButton.addEventListener("click", () => downloadPDF(documentItem.fileURL, documentItem.fileName));
    deleteButton.addEventListener("click", () => deletePDF(index));
    documentsList.appendChild(item);
  });
}

function downloadPDF(fileURL, fileName) {
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = fileName;
  link.click();
}

function deletePDF(index) {
  documents.splice(index, 1);
  saveDocuments();
  renderDocuments();
}

function showHome() {
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
  document.getElementById("btn-home").classList.add("active");
  document.getElementById("btn-docs").classList.remove("active");
}

function showDocuments() {
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
  document.getElementById("btn-home").classList.remove("active");
  document.getElementById("btn-docs").classList.add("active");
}

function applyTheme(theme) {
  document.body.className = theme === "sunset" ? "" : `theme-${theme}`;
  localStorage.setItem("taskflow.theme", theme);

  document.querySelectorAll(".theme-swatch").forEach((swatch) => {
    swatch.classList.remove("active");
  });

  const activeSwatch = {
    sunset: "t1",
    ocean: "t2",
    forest: "t3",
    midnight: "t4",
    aurora: "t5",
  }[theme];

  if (activeSwatch) {
    document.getElementById(activeSwatch).classList.add("active");
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function loadState() {
  tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  documents = JSON.parse(localStorage.getItem(DOCS_KEY) || "[]");
}

function createTaskId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function saveDocuments() {
  localStorage.setItem(DOCS_KEY, JSON.stringify(documents));
}
