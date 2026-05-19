const taskInput = document.getElementById("task-input");
const taskType = document.getElementById("task-type-select");
const taskList = document.getElementById("task-list");

const totalTasks = document.getElementById("stat-total");
const doneTasks = document.getElementById("stat-done");
const pendingTasks = document.getElementById("stat-pending");

const progressFill = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");

const documentsList = document.getElementById("documents-list");
const toast = document.getElementById("toast");

let tasks = [];
let currentFilter = "all";

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {

  const storedTasks =
    localStorage.getItem("tasks");

  if (storedTasks) {
    tasks = JSON.parse(storedTasks);

    renderTasks();
    updateStats();
  }
}

function addTask() {

  const text = taskInput.value.trim();
  const category = taskType.value;

  if (text === "") {
    taskInput.focus();
    return;
  }

  const selectedOption =
    taskType.options[taskType.selectedIndex];

  const color =
    selectedOption.getAttribute("data-color") || "#f5c842";

  const task = {
    id: Date.now(),
    text,
    category,
    color,
    done: false,
  };

  tasks.push(task);

  saveTasksToLocalStorage();

  taskInput.value = "";
  taskType.value = "";

  renderTasks();
  updateStats();
}

taskInput.addEventListener("keydown", function (e) {

  if (e.key === "Enter") {
    addTask();
  }
});

function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "done") {

    filteredTasks =
      tasks.filter(task => task.done);

  } else if (currentFilter === "pending") {

    filteredTasks =
      tasks.filter(task => !task.done);

  } else if (currentFilter !== "all") {

    filteredTasks =
      tasks.filter(task =>
        task.category === currentFilter
      );
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

  filteredTasks.forEach(task => {

    const card = document.createElement("div");

    card.className = "task-card";

    if (task.done) {
      card.classList.add("done");
    }

    card.innerHTML = `
      <button class="task-check ${task.done ? "checked" : ""}"
        onclick="toggleTask(${task.id})">
        ✓
      </button>

      <div class="task-text">
        ${task.text}
      </div>

      <span class="task-tag"
        style="background:${task.color}">
        ${task.category || "Misc"}
      </span>

      <button class="task-del"
        onclick="deleteTask(${task.id})">
        🗑
      </button>
    `;

    taskList.appendChild(card);
  });
}

function toggleTask(id) {

  tasks = tasks.map(task => {

    if (task.id === id) {
      task.done = !task.done;
    }

    return task;
  });

  saveTasksToLocalStorage();

  renderTasks();
  updateStats();
}

function deleteTask(id) {

  tasks =
    tasks.filter(task => task.id !== id);

  saveTasksToLocalStorage();

  renderTasks();
  updateStats();
}

function clearDone() {

  tasks =
    tasks.filter(task => !task.done);

  saveTasksToLocalStorage();

  renderTasks();
  updateStats();
}

function filterTasks(button, filter) {

  currentFilter = filter;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {
      btn.classList.remove("active");
    });

  button.classList.add("active");

  renderTasks();
}

function updateStats() {

  const total = tasks.length;

  const done =
    tasks.filter(task => task.done).length;

  const pending = total - done;

  totalTasks.textContent = total;
  doneTasks.textContent = done;
  pendingTasks.textContent = pending;

  const percentage =
    total === 0
      ? 0
      : Math.round((done / total) * 100);

  progressFill.style.width =
    `${percentage}%`;

  progressPct.textContent =
    `${percentage}%`;
}

function applyTheme(theme) {

  document.body.className = "";

  document.body.classList.add(`theme-${theme}`);
}
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
    .getElementById("btn-docs")
    .classList.add("active");

  document
    .getElementById("btn-home")
    .classList.remove("active");
}

function saveAsPDF() {

  if (tasks.length === 0) {
    showToast("No tasks available");
    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();

  doc.setFontSize(20);

  doc.text("TaskFlow To-Do List", 20, 20);

  doc.setFontSize(12);

  let y = 40;

  tasks.forEach((task, index) => {

    const status =
      task.done ? "[Done]" : "[Pending]";

    doc.text(
      `${index + 1}. ${task.text} (${task.category}) ${status}`,
      20,
      y
    );

    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  const fileName =
    `TaskFlow_${Date.now()}.pdf`;

  doc.save(fileName);

  saveDocument(fileName);

  showToast("PDF Downloaded Successfully");
}

function saveDocument(fileName) {

  const item = document.createElement("div");

  item.className = "doc-item";

  item.innerHTML = `
    <div class="doc-icon">📄</div>

    <div class="doc-name">
      ${fileName}
    </div>

    <div class="doc-date">
      ${new Date().toLocaleString()}
    </div>

    <div class="doc-actions">

      <button class="doc-btn">
        Saved
      </button>

      <button class="doc-btn del"
        onclick="this.parentElement.parentElement.remove()">
        Delete
      </button>

    </div>
  `;

  documentsList.appendChild(item);
}

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

loadTasksFromLocalStorage();