
// 1. DOM Element References (match HTML ids/classes)
const taskInput = document.getElementById("task");
const taskTypeSelect = document.getElementById("task-category");
const taskList = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const documentsList = document.querySelector('.documents-list');

// Progress / stats elements present in HTML
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

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  
  if (!text) {
    showToast("⚠️ Please enter a task description!");
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
  taskTypeSelect.value = ""; // Reset dropdown
  
  renderTasks();
  showToast("✅ Task added successfully!");
}

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, completed: !task.completed };
    return task;
  });
  renderTasks();
}

function deleteTask(id) {
  // Triggers exit animation before layout re-render
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = "fadeOut 0.25s ease forwards";
    setTimeout(() => {
      tasks = tasks.filter(task => task.id !== id);
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

  // Toggle Visibility of Empty State Element
  if (filteredTasks.length === 0) {
    taskList.innerHTML = "";
    if (emptyState) {
      taskList.appendChild(emptyState);
      emptyState.style.display = "flex";
    }
  } else {
    if (emptyState) emptyState.style.display = "none";
    taskList.innerHTML = "";

    filteredTasks.forEach((task, idx) => {
      const card = document.createElement("div");
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

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) {
    // Fallback for standalone page: simple console/log
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

// Load saved theme if present
try {
  const saved = localStorage.getItem('todo-theme');
  if (saved) applyTheme(saved);
} catch (e) {}

loadSavedDocuments();