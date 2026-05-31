// 1. DOM Element References
const taskInput = document.getElementById("task");
const taskTypeSelect = document.getElementById("task-category");
const taskPrioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const statusTabsContainer = document.getElementById("statusTabs");
const documentsList = document.querySelector(".documents-list");

// Progress / Stats Elements
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Data State
let tasks = [];
let savedDocs = [];
let currentStatusFilter = "all";

// 2. Local Storage Persistence
function saveTasks() {
  try {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  } catch (e) {
    console.error("Error saving tasks:", e);
  }
}

function saveDocuments() {
  try {
    localStorage.setItem("todo-documents", JSON.stringify(savedDocs));
  } catch (e) {
    console.error("Error saving documents:", e);
  }
}

// 3. Core Task Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  const priority = taskPrioritySelect.value;

  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  // Accent Colors
  const selectedCatOption =
    taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const catColor =
    (selectedCatOption && selectedCatOption.getAttribute("data-color")) ||
    "#7c63ff";

  const selectedPriOption =
    taskPrioritySelect.options[taskPrioritySelect.selectedIndex];
  const priColor =
    (selectedPriOption && selectedPriOption.getAttribute("data-color")) ||
    "#3b82f6";

  const newTask = {
    id: Date.now(),
    text: text,
    category: category || "General",
    categoryColor: catColor,
    priority: priority || "Normal",
    priorityColor: priColor,
    status: "pending", // pending | inprogress | completed
    completed: false,
  };

  tasks.push(newTask);

  // Reset Form Inputs
  taskInput.value = "";
  taskTypeSelect.value = "";
  taskPrioritySelect.value = "";

  saveTasks();
  renderTasks();
  showToast("🚀 Task created successfully!");
}

function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const isCompleted = task.status !== "completed";
      return {
        ...task,
        completed: isCompleted,
        status: isCompleted ? "completed" : "pending",
      };
    }
    return task;
  });
  saveTasks();
  renderTasks();
  const task = tasks.find((t) => t.id === id);
  if (task.status === "completed") {
    showToast("✅ Task marked as Completed!");
  } else {
    showToast("📋 Task marked as Pending!");
  }
}

function toggleInProgress(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const isInProgress = task.status !== "inprogress";
      return {
        ...task,
        completed: false,
        status: isInProgress ? "inprogress" : "pending",
      };
    }
    return task;
  });
  saveTasks();
  renderTasks();
  const task = tasks.find((t) => t.id === id);
  if (task.status === "inprogress") {
    showToast("⚡ Task marked as In Progress!");
  } else {
    showToast("📋 Task marked as Pending!");
  }
}

function deleteTask(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = "fadeOut 0.2s ease forwards";
    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
      showToast("🧹 Task deleted successfully!");
    }, 200);
  }
}

function updateTaskText(id, newText) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, text: newText.trim() || "Untitled Task" };
    }
    return task;
  });
  saveTasks();
}

// 4. Status Filtering
function filterByStatus(status) {
  currentStatusFilter = status;

  // Toggle Active Classes on Tab Buttons
  document.querySelectorAll(".status-tab").forEach((tab) => {
    if (tab.getAttribute("data-status") === status) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  renderTasks();
}

// 5. Render Tasks Grid & Statistics
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.style.display = "flex";
    statusTabsContainer.style.display = "none";
    taskList.style.display = "none";
  } else {
    emptyState.style.display = "none";
    statusTabsContainer.style.display = "flex";
    taskList.style.display = "grid";

    // Filter Tasks dynamically
    const filteredTasks = tasks.filter((task) => {
      if (currentStatusFilter === "all") return true;
      return task.status === currentStatusFilter;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 40px 0;">
          <div class="empty-icon">📂</div>
          <p class="empty-title">No tasks in this view</p>
          <p class="empty-desc">Switch tabs or add a task to get started!</p>
        </div>
      `;
    } else {
      filteredTasks.forEach((task, idx) => {
        const card = document.createElement("li");
        card.className =
          "notes" + (task.status === "completed" ? " completed" : "");
        card.setAttribute("data-id", task.id);
        card.style.setProperty("--i", idx);

        const isCompleted = task.status === "completed";
        const isInProgress = task.status === "inprogress";

        card.innerHTML = `
          <div class="note-row">
            <textarea class="note-text" onchange="updateTaskText(${task.id}, this.value)" placeholder="Edit task...">${task.text}</textarea>
            <div class="note-badges">
              <span class="category-badge" style="border-color: ${task.categoryColor}; color: ${task.categoryColor}; background: ${task.categoryColor}12">
                📂 ${task.category}
              </span>
              <span class="priority-badge" style="border-color: ${task.priorityColor}; color: ${task.priorityColor}; background: ${task.priorityColor}12">
                ⚡ ${task.priority}
              </span>
            </div>
            <div class="note-actions">
              <button class="note-check state-btn ${isInProgress ? "active" : ""}" onclick="toggleInProgress(${task.id})" title="Toggle In Progress" style="background: ${isInProgress ? "rgba(79, 141, 255, 0.2)" : ""}; color: ${isInProgress ? "#2563eb" : ""}">
                ⚡
              </button>
              <button class="note-check state-btn ${isCompleted ? "active" : ""}" onclick="toggleComplete(${task.id})" title="Toggle Complete" style="background: ${isCompleted ? "rgba(20, 184, 166, 0.2)" : ""}; color: ${isCompleted ? "#0d9488" : ""}">
                ${isCompleted ? "↩️" : "✓"}
              </button>
              <button class="note-delete" onclick="deleteTask(${task.id})" title="Delete Task">🗑️</button>
            </div>
          </div>
        `;
        taskList.appendChild(card);
      });
    }
  }

  updateMetrics();
}

function updateMetrics() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "completed").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Update progress bar
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${done} / ${total} done`;

  // Update status tabs counts
  const pendingCount = tasks.filter(
    (t) => t.status === "pending" || !t.status,
  ).length;
  const inProgressCount = tasks.filter((t) => t.status === "inprogress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  document.getElementById("count-all").innerText = total;
  document.getElementById("count-pending").innerText = pendingCount;
  document.getElementById("count-inprogress").innerText = inProgressCount;
  document.getElementById("count-completed").innerText = completedCount;
}

// 6. Tab switching (Home vs Documents)
function showHome() {
  document.getElementById("nav-home").classList.add("active");
  document.getElementById("nav-documents").classList.remove("active");
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("nav-home").classList.remove("active");
  document.getElementById("nav-documents").classList.add("active");
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
  renderSavedDocuments();
}

// 7. Theme Customization System
function applyTheme(themeName) {
  document.body.className = ""; // Reset body theme classes
  document.body.classList.add(themeName);

  document
    .querySelectorAll(".theme-btn")
    .forEach((btn) => btn.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-theme="${themeName}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  try {
    localStorage.setItem("todo-theme", themeName);
  } catch (e) {}
}

document.querySelectorAll(".theme-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    if (theme) applyTheme(theme);
  });
});

// 8. PDF Exporter &Snapshots History
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

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  doc.text(
    `Tasks: ${tasks.length} total  |  ${completedCount} completed  |  ${tasks.length - completedCount} pending/in progress`,
    20,
    38,
  );
  doc.line(20, 42, 190, 42);

  let verticalCursor = 52;
  doc.setFontSize(12);

  tasks.forEach((task, index) => {
    if (verticalCursor > 270) {
      doc.addPage();
      verticalCursor = 20;
    }
    const status = task.status.toUpperCase();
    const printLine = `${index + 1}. [${status}] (${task.priority} Priority) [${task.category}] - ${task.text}`;
    doc.text(printLine, 20, verticalCursor);
    verticalCursor += 10;
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const pdfOutput = doc.output("blob");
  const fileURL = URL.createObjectURL(pdfOutput);

  const docItem = {
    name: fileName,
    url: fileURL,
    total: tasks.length,
    completed: completedCount,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    date: new Date().toLocaleDateString(),
  };

  savedDocs.unshift(docItem);
  saveDocuments();
  showToast(`📥 Exported PDF snapshot successfully!`);
  showDocuments();
}

function renderSavedDocuments() {
  const docEmptyState = document.getElementById("emptyDocsState");
  if (!documentsList) return;

  documentsList.innerHTML = "";

  if (savedDocs.length === 0) {
    if (docEmptyState) docEmptyState.style.display = "flex";
  } else {
    if (docEmptyState) docEmptyState.style.display = "none";
    savedDocs.forEach((doc, idx) => {
      const docItem = document.createElement("li");
      docItem.className = "doc-item";
      docItem.innerHTML = `
        <div class="doc-icon">📄</div>
        <div class="doc-info">
          <div class="doc-name">${doc.name}</div>
          <div class="doc-meta">
            <span class="doc-date">${doc.date} ${doc.time}</span>
            <span class="doc-task-count">${doc.total} tasks · ${doc.completed} completed</span>
          </div>
        </div>
        <div class="doc-actions">
          <button class="doc-btn" onclick="window.open('${doc.url}', '_blank')">View</button>
          <a class="doc-btn" href="${doc.url}" download="${doc.name}" style="text-decoration:none;display:inline-block;text-align:center;line-height:42px;padding:0 18px;">Download</a>
          <button class="doc-btn del" onclick="deleteDocument(${idx})">Delete</button>
        </div>
      `;
      documentsList.appendChild(docItem);
    });
  }
}

function deleteDocument(index) {
  savedDocs.splice(index, 1);
  saveDocuments();
  renderSavedDocuments();
  showToast("🧹 Snapshot record cleared!");
}

// 9. Toast Notifications
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.innerText = message;
  toast.className = "pdf-message show";

  const activeTheme = localStorage.getItem("todo-theme") || "theme1";
  toast.classList.add(activeTheme);

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// 10. Forms & Actions Initialisation
const taskForm = document.getElementById("task-form");
if (taskForm) {
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
  });
}

const savePdfBtn = document.getElementById("savepdf");
if (savePdfBtn) {
  savePdfBtn.addEventListener("click", () => saveAsPDF());
}

// Initial Loading Routines
showHome();

try {
  const savedTasks = localStorage.getItem("todo-tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }

  const savedDocsData = localStorage.getItem("todo-documents");
  if (savedDocsData) {
    savedDocs = JSON.parse(savedDocsData);
  }

  const savedTheme = localStorage.getItem("todo-theme");
  applyTheme(savedTheme || "theme1");
} catch (e) {
  applyTheme("theme1");
}

renderTasks();
