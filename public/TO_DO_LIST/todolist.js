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
let currentFilter = "all";
const documentsDbName = "taskflow-documents";
const documentsStoreName = "saved-documents";
const emptyDocumentsState = document.getElementById("emptyDocsState");
let documentsDbPromise = null;

function openDocumentsDb() {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("IndexedDB is not available."));
  }

  if (!documentsDbPromise) {
    documentsDbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(documentsDbName, 1);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(documentsStoreName)) {
          db.createObjectStore(documentsStoreName, { keyPath: "id" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Unable to open the documents store."));
    });
  }

  return documentsDbPromise;
}

async function getStoredDocuments() {
  const db = await openDocumentsDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(documentsStoreName, "readonly");
    const store = transaction.objectStore(documentsStoreName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error || new Error("Unable to read saved documents."));
  });
}

async function saveStoredDocument(documentRecord) {
  const db = await openDocumentsDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(documentsStoreName, "readwrite");
    const store = transaction.objectStore(documentsStoreName);
    store.put(documentRecord);

    transaction.oncomplete = () => resolve(documentRecord);
    transaction.onerror = () => reject(transaction.error || new Error("Unable to save the document."));
  });
}

async function deleteStoredDocument(documentId) {
  const db = await openDocumentsDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(documentsStoreName, "readwrite");
    const store = transaction.objectStore(documentsStoreName);
    store.delete(documentId);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error("Unable to delete the document."));
  });
}

function updateDocumentsEmptyState() {
  if (!emptyDocumentsState) return;
  emptyDocumentsState.hidden = documentsList && documentsList.children.length > 0;
}

function createDocumentItem(documentRecord) {
  const docItem = document.createElement("div");
  docItem.className = "document-item";
  docItem.dataset.documentId = documentRecord.id;

  const fileURL = URL.createObjectURL(documentRecord.blob);
  docItem.dataset.fileUrl = fileURL;

  const fileName = documentRecord.fileName || "Saved document.pdf";
  const savedDate = new Date(documentRecord.createdAt || Date.now()).toLocaleDateString();

  docItem.innerHTML = `
    <div class="doc-icon" aria-hidden="true">📄</div>
    <span class="doc-name">${fileName}</span>
    <span class="doc-date">${savedDate}</span>
    <div class="doc-actions">
      <button class="doc-btn doc-view" type="button">View</button>
      <a class="doc-btn doc-download" href="${fileURL}" download="${fileName}">Download</a>
      <button class="doc-btn del doc-delete" type="button">Delete</button>
    </div>
  `;

  const viewButton = docItem.querySelector(".doc-view");
  const deleteButton = docItem.querySelector(".doc-delete");

  if (viewButton) {
    viewButton.addEventListener("click", () => {
      window.open(fileURL, "_blank", "noopener,noreferrer");
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      removeDocumentItem(deleteButton);
    });
  }

  return docItem;
}

async function loadSavedDocuments() {
  if (!documentsList) return;

  try {
    const storedDocuments = await getStoredDocuments();
    documentsList.innerHTML = "";

    if (!storedDocuments.length) {
      updateDocumentsEmptyState();
      return;
    }

    storedDocuments
      .sort((left, right) => (right.createdAt || 0) - (left.createdAt || 0))
      .forEach((documentRecord) => {
        documentsList.appendChild(createDocumentItem(documentRecord));
      });

    updateDocumentsEmptyState();
  } catch (error) {
    console.error("Failed to load saved documents:", error);
    updateDocumentsEmptyState();
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
  const homeLink = document.getElementById("nav-home");
  const documentsLink = document.getElementById("nav-documents");
  const homeTab = document.getElementById("home-tab");
  const documentsTab = document.getElementById("documents-tab");

  if (homeLink) homeLink.setAttribute("aria-current", "page");
  if (documentsLink) documentsLink.removeAttribute("aria-current");
  if (homeTab) homeTab.hidden = false;
  if (documentsTab) documentsTab.hidden = true;
}

function showDocuments() {
  const homeLink = document.getElementById("nav-home");
  const documentsLink = document.getElementById("nav-documents");
  const homeTab = document.getElementById("home-tab");
  const documentsTab = document.getElementById("documents-tab");

  if (homeLink) homeLink.removeAttribute("aria-current");
  if (documentsLink) documentsLink.setAttribute("aria-current", "page");
  if (homeTab) homeTab.hidden = true;
  if (documentsTab) documentsTab.hidden = false;
}

const homeNavLink = document.getElementById("nav-home");
if (homeNavLink) {
  homeNavLink.addEventListener("click", (event) => {
    event.preventDefault();
    showHome();
  });
}

const documentsNavLink = document.getElementById("nav-documents");
if (documentsNavLink) {
  documentsNavLink.addEventListener("click", (event) => {
    event.preventDefault();
    showDocuments();
  });
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

// 6. PDF System using jsPDF Global Library
async function saveAsPDF() {
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
  const fileBlob = doc.output("blob");
  const documentRecord = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    fileName,
    createdAt: Date.now(),
    blob: fileBlob
  };

  try {
    await saveStoredDocument(documentRecord);
    documentsList.appendChild(createDocumentItem(documentRecord));
    updateDocumentsEmptyState();
    showToast("📥 Exported list to Documents Tab!");
  } catch (error) {
    console.error("Failed to save the exported PDF:", error);
    documentsList.appendChild(createDocumentItem({
      ...documentRecord,
      id: `${documentRecord.id}-session`
    }));
    updateDocumentsEmptyState();
    showToast("📥 Exported list, but document history could not be saved.");
  }
}

function removeDocumentItem(button) {
  const documentItem = button.closest(".document-item");
  if (!documentItem) return;

  const documentId = documentItem.dataset.documentId;
  const fileURL = documentItem.dataset.fileUrl;

  if (fileURL) {
    URL.revokeObjectURL(fileURL);
  }

  documentItem.remove();
  updateDocumentsEmptyState();

  if (documentId && !documentId.endsWith("-session")) {
    deleteStoredDocument(documentId).catch((error) => {
      console.error("Failed to delete the saved document:", error);
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

const savePdfButton = document.getElementById("savepdf");
if (savePdfButton) {
  savePdfButton.addEventListener("click", () => {
    saveAsPDF();
  });
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTask();
  }
});

try {
  const saved = localStorage.getItem('todo-theme');
  if (saved) applyTheme(saved);
} catch (e) {}

loadSavedDocuments();
