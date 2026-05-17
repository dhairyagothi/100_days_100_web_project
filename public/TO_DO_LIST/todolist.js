const STORAGE_KEY = "taskflow.tasks";
const THEME_KEY = "taskflow.theme";
const ACCENT_KEY = "taskflow.accent";

const notesContainer = document.getElementById("notes-container");
const documentsList = document.querySelector(".documents-list");
const pdfMessage = document.getElementById("pdfMessage");
const emptyState = document.getElementById("emptyState");
const emptyDocs = document.getElementById("emptyDocs");
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const navLinks = document.querySelectorAll(".nav-link");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = loadTasks();
let currentFilter = "all";

const priorityColors = {
  High: "#dc2626",
  Medium: "#d97706",
  Low: "#16a34a",
};

const accentThemes = {
  theme1: {
    bg: "radial-gradient(circle at top left, rgba(219, 166, 189, 0.34), transparent 30rem), linear-gradient(135deg, #fdf2f8 0%, #f8fafc 55%, #eef2ff 100%)",
    accent: "#be185d",
    accentStrong: "#9d174d",
  },
  theme2: {
    bg: "radial-gradient(circle at top left, rgba(126, 219, 220, 0.3), transparent 30rem), linear-gradient(135deg, #fef3c7 0%, #ecfdf5 52%, #e0f2fe 100%)",
    accent: "#0f766e",
    accentStrong: "#115e59",
  },
  theme3: {
    bg: "radial-gradient(circle at top left, rgba(57, 219, 140, 0.24), transparent 30rem), linear-gradient(135deg, #ecfdf5 0%, #fff7ed 50%, #fce7f3 100%)",
    accent: "#ea580c",
    accentStrong: "#c2410c",
  },
  theme4: {
    bg: "radial-gradient(circle at top left, rgba(120, 25, 105, 0.2), transparent 30rem), linear-gradient(135deg, #f5f3ff 0%, #f8fafc 48%, #ecfeff 100%)",
    accent: "#7e22ce",
    accentStrong: "#6b21a8",
  },
  theme5: {
    bg: "radial-gradient(circle at top left, rgba(21, 101, 192, 0.2), transparent 30rem), linear-gradient(135deg, #eff6ff 0%, #f8fafc 50%, #fff1f2 100%)",
    accent: "#1d4ed8",
    accentStrong: "#1e40af",
  },
};

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    console.error("Unable to load tasks:", error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTask(title, category, priority) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    category,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

function renderTasks() {
  const visibleTasks = getFilteredTasks();
  notesContainer.innerHTML = "";

  visibleTasks.forEach((task) => {
    notesContainer.appendChild(createTaskCard(task));
  });

  emptyState.style.display = visibleTasks.length ? "none" : "block";
  updateCounts();
}

function createTaskCard(task) {
  const card = document.createElement("article");
  card.className = `notes${task.completed ? " completed" : ""}`;
  card.style.setProperty("--priority-color", priorityColors[task.priority] || priorityColors.Medium);

  const createdDate = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(task.createdAt));

  card.innerHTML = `
    <div class="task-topline">
      <div class="badges">
        <span class="badge">${task.category}</span>
        <span class="badge priority-${task.priority.toLowerCase()}">${task.priority}</span>
      </div>
      <span class="task-date">${createdDate}</span>
    </div>
    <p class="task-title">${escapeHTML(task.title)}</p>
    <div class="task-actions">
      <button class="task-action complete" type="button" aria-label="${task.completed ? "Mark active" : "Mark complete"}">
        <span aria-hidden="true">${task.completed ? "↺" : "✓"}</span>
      </button>
      <button class="task-action delete" type="button" aria-label="Delete task">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  `;

  card.querySelector(".complete").addEventListener("click", () => toggleTask(task.id));
  card.querySelector(".delete").addEventListener("click", () => deleteTask(task.id));

  return card;
}

function getFilteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  if (currentFilter === "high") {
    return tasks.filter((task) => task.priority === "High");
  }

  return tasks;
}

function updateCounts() {
  const totalCount = document.getElementById("totalCount");
  const activeCount = document.getElementById("activeCount");
  const completedCount = document.getElementById("completedCount");

  totalCount.textContent = tasks.length;
  activeCount.textContent = tasks.filter((task) => !task.completed).length;
  completedCount.textContent = tasks.filter((task) => task.completed).length;
}

function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function saveAsPDF() {
  if (!tasks.length) {
    showPDFMessage("Add a task before exporting.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lineHeight = 9;
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TaskFlow To-Do List", 20, y);
  y += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  tasks.forEach((task, index) => {
    const status = task.completed ? "Done" : "Active";
    const text = `${index + 1}. [${status}] ${task.title} - ${task.category} - ${task.priority}`;
    const lines = doc.splitTextToSize(text, 170);

    if (y + lines.length * lineHeight > 280) {
      doc.addPage();
      y = 18;
    }

    doc.text(lines, 20, y);
    y += lines.length * lineHeight;
  });

  const fileName = `ToDoList_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));
  saveDocument(fileName, fileURL);
  showPDFMessage("PDF created successfully.");
}

function saveDocument(fileName, fileURL) {
  const docItem = document.createElement("div");
  docItem.className = "document-item";
  docItem.innerHTML = `
    <span>${fileName}</span>
    <div class="document-actions">
      <button type="button" onclick="viewPDF('${fileURL}')">View</button>
      <button type="button" onclick="downloadPDF('${fileURL}', '${fileName}')">Download</button>
      <button type="button" onclick="deletePDF(this)">Delete</button>
    </div>
  `;
  documentsList.appendChild(docItem);
  updateDocumentEmptyState();
}

function viewPDF(fileURL) {
  window.open(fileURL, "_blank");
}

function downloadPDF(fileURL, fileName) {
  const link = document.createElement("a");
  link.href = fileURL;
  link.download = fileName;
  link.click();
}

function deletePDF(button) {
  button.closest(".document-item").remove();
  updateDocumentEmptyState();
}

function updateDocumentEmptyState() {
  emptyDocs.style.display = documentsList.children.length ? "none" : "block";
}

function showPDFMessage(message) {
  pdfMessage.textContent = message;
  pdfMessage.style.display = "block";
  setTimeout(() => {
    pdfMessage.style.display = "none";
  }, 2600);
}

function showHome() {
  setActiveTab("home");
}

function showDocuments() {
  setActiveTab("documents");
}

function setActiveTab(tabName) {
  const isHome = tabName === "home";
  document.getElementById("home-tab").hidden = !isHome;
  document.getElementById("documents-tab").hidden = isHome;

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.tab === tabName);
  });
}

function setAccentTheme(themeName) {
  const theme = accentThemes[themeName];
  if (!theme || document.body.classList.contains("dark-mode")) return;

  document.documentElement.style.setProperty("--page-bg", theme.bg);
  document.documentElement.style.setProperty("--accent", theme.accent);
  document.documentElement.style.setProperty("--accent-strong", theme.accentStrong);
  localStorage.setItem(ACCENT_KEY, themeName);
}

function c1() {
  setAccentTheme("theme1");
}

function c2() {
  setAccentTheme("theme2");
}

function c3() {
  setAccentTheme("theme3");
}

function c4() {
  setAccentTheme("theme4");
}

function c5() {
  setAccentTheme("theme5");
}

function setDarkMode(isDark) {
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

  themeIcon.textContent = isDark ? "☀" : "☾";

  if (!isDark) {
    setAccentTheme(localStorage.getItem(ACCENT_KEY) || "theme5");
  }
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskInput.value.trim();
  if (!title) return;

  tasks = [createTask(title, categoryInput.value, priorityInput.value), ...tasks];
  saveTasks();
  renderTasks();
  taskForm.reset();
  priorityInput.value = "Medium";
  taskInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => filterButton.classList.remove("active"));
    button.classList.add("active");
    renderTasks();
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveTab(link.dataset.tab));
});

themeToggle.addEventListener("click", () => {
  setDarkMode(!document.body.classList.contains("dark-mode"));
});

document.addEventListener("DOMContentLoaded", () => {
  setDarkMode(localStorage.getItem(THEME_KEY) === "dark");
  if (!document.body.classList.contains("dark-mode")) {
    setAccentTheme(localStorage.getItem(ACCENT_KEY) || "theme5");
  }
  renderTasks();
  updateDocumentEmptyState();
});
