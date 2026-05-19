// ─────────────────────────────────────────────────────────────
// DOM REFERENCES
// ─────────────────────────────────────────────────────────────

const taskList = document.getElementById("task-list");
const documentsList = document.getElementById("documents-list");
const taskInput = document.getElementById("task-input");
const taskTypeSelect = document.getElementById("task-type-select");
const toast = document.getElementById("toast");

const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statPending = document.getElementById("stat-pending");
const progressFill = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");

// ─────────────────────────────────────────────────────────────
// THEME SYSTEM
// ─────────────────────────────────────────────────────────────

const THEMES = {
  sunset: {
    body: "linear-gradient(135deg, #e4afcb 0%, #e2c58b 50%, #7edbdc 100%)",
    card: "#ffffff",
  },

  ocean: {
    body: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    card: "#d9e8ff",
  },

  forest: {
    body: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    card: "#d8ffe2",
  },

  midnight: {
    body: "linear-gradient(135deg, #232526 0%, #414345 100%)",
    card: "#eeeeee",
  },

  aurora: {
    body: "linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)",
    card: "#ffe8ff",
  },
};

let currentTheme = "sunset";

// ─────────────────────────────────────────────────────────────
// TASK STORAGE
// ─────────────────────────────────────────────────────────────

let tasks = [];
let currentFilter = "all";

// ─────────────────────────────────────────────────────────────
// ADD TASK
// ─────────────────────────────────────────────────────────────

function addTask() {
  const text = taskInput.value.trim();
  const type = taskTypeSelect.value;

  if (!text) {
    showToast("Please enter a task");
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now(),
    text,
    type,
    completed: false,
  };

  tasks.push(task);

  taskInput.value = "";
  taskTypeSelect.value = "";

  renderTasks();
  updateStats();

  showToast("Task added successfully");
}

// ENTER KEY SUPPORT

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// ─────────────────────────────────────────────────────────────
// RENDER TASKS
// ─────────────────────────────────────────────────────────────

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((t) => !t.completed);
  }

  else if (currentFilter === "done") {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  else if (currentFilter !== "all") {
    filteredTasks = tasks.filter((t) => t.type === currentFilter);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>No tasks found.</p>
      </div>
    `;
    return;
  }

  filteredTasks.forEach((task) => {

    const card = document.createElement("div");
    card.className = "task-card";

    card.style.background = THEMES[currentTheme].card;

    card.innerHTML = `
      <div class="task-content">

        <div class="task-info">

          <p class="task-text ${task.completed ? "completed" : ""}">
            ${task.text}
          </p>

          ${
            task.type
              ? `<span class="task-badge">${task.type}</span>`
              : ""
          }

        </div>

        <div class="task-actions">

          <button class="task-btn complete-btn">
            ${task.completed ? "✓" : "○"}
          </button>

          <button class="task-btn delete-btn">
            🗑
          </button>

        </div>

      </div>
    `;

    // COMPLETE BUTTON

    card
      .querySelector(".complete-btn")
      .addEventListener("click", () => {
        toggleTask(task.id);
      });

    // DELETE BUTTON

    card
      .querySelector(".delete-btn")
      .addEventListener("click", () => {
        deleteTask(task.id);
      });

    taskList.appendChild(card);
  });
}

// ─────────────────────────────────────────────────────────────
// TOGGLE TASK
// ─────────────────────────────────────────────────────────────

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        completed: !task.completed,
      };
    }
    return task;
  });

  renderTasks();
  updateStats();
}

// ─────────────────────────────────────────────────────────────
// DELETE TASK
// ─────────────────────────────────────────────────────────────

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  renderTasks();
  updateStats();

  showToast("Task deleted");
}

// ─────────────────────────────────────────────────────────────
// FILTER TASKS
// ─────────────────────────────────────────────────────────────

function filterTasks(button, filter) {

  currentFilter = filter;

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  button.classList.add("active");

  renderTasks();
}

// ─────────────────────────────────────────────────────────────
// CLEAR COMPLETED
// ─────────────────────────────────────────────────────────────

function clearDone() {
  tasks = tasks.filter((task) => !task.completed);

  renderTasks();
  updateStats();

  showToast("Completed tasks cleared");
}

// ─────────────────────────────────────────────────────────────
// UPDATE STATS
// ─────────────────────────────────────────────────────────────

function updateStats() {

  const total = tasks.length;

  const done = tasks.filter((t) => t.completed).length;

  const pending = total - done;

  const percentage =
    total === 0
      ? 0
      : Math.round((done / total) * 100);

  statTotal.innerText = total;
  statDone.innerText = done;
  statPending.innerText = pending;

  progressFill.style.width = `${percentage}%`;
  progressPct.innerText = `${percentage}%`;
}

// ─────────────────────────────────────────────────────────────
// THEME SWITCHING
// ─────────────────────────────────────────────────────────────

function applyTheme(themeName) {

  currentTheme = themeName;

  document.body.style.background =
    THEMES[themeName].body;

  renderTasks();
}

// DEFAULT THEME

applyTheme("sunset");

// ─────────────────────────────────────────────────────────────
// PDF EXPORT
// ─────────────────────────────────────────────────────────────

function saveAsPDF() {

  if (tasks.length === 0) {
    showToast("No tasks to export");
    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(18);

  doc.text("My To-Do List", 20, 20);

  doc.setFontSize(12);

  let y = 40;

  tasks.forEach((task, index) => {

    const status = task.completed
      ? "[Done]"
      : "[Pending]";

    doc.text(
      `${index + 1}. ${task.text} ${status}`,
      20,
      y
    );

    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;

  doc.save(fileName);

  addDocument(fileName);

  showToast("PDF exported successfully");
}

// ─────────────────────────────────────────────────────────────
// DOCUMENTS SECTION
// ─────────────────────────────────────────────────────────────

function addDocument(fileName) {

  const item = document.createElement("div");

  item.className = "document-item";

  item.innerHTML = `
    <span>${fileName}</span>
    <button class="delete-doc-btn">Delete</button>
  `;

  item
    .querySelector(".delete-doc-btn")
    .addEventListener("click", () => {
      item.remove();
    });

  documentsList.appendChild(item);
}

// ─────────────────────────────────────────────────────────────
// TAB SWITCHING
// ─────────────────────────────────────────────────────────────

function showHome() {

  document.getElementById("home-tab").style.display = "block";

  document.getElementById("documents-tab").style.display = "none";

  document
    .getElementById("btn-home")
    .classList.add("active");

  document
    .getElementById("btn-docs")
    .classList.remove("active");
}

function showDocuments() {

  document.getElementById("home-tab").style.display = "none";

  document.getElementById("documents-tab").style.display = "block";

  document
    .getElementById("btn-home")
    .classList.remove("active");

  document
    .getElementById("btn-docs")
    .classList.add("active");
}

// ─────────────────────────────────────────────────────────────
// TOAST MESSAGE
// ─────────────────────────────────────────────────────────────

function showToast(message) {

  toast.innerText = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}