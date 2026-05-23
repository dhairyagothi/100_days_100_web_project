
// 1. DOM Element References
const taskInput = document.getElementById("task-input");
const taskTypeSelect = document.getElementById("task-type-select");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const documentsList = document.getElementById("documents-list");

// Stats counters
const statTotal = document.getElementById("stat-total");
const statDone = document.getElementById("stat-done");
const statPending = document.getElementById("stat-pending");
const progressFill = document.getElementById("progress-fill");
const progressPct = document.getElementById("progress-pct");

// Data State
let tasks = [];
let currentFilter = "all";

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  
  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  // Find category color from the dropdown configuration
  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = selectedOption.getAttribute("data-color") || "#ffffff";

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
    taskList.appendChild(emptyState);
    emptyState.style.display = "flex";
  } else {
    emptyState.style.display = "none";
    taskList.innerHTML = "";

    filteredTasks.forEach(task => {
      const card = document.createElement("div");
      card.className = `task-card ${task.completed ? "done" : ""}`;
      card.setAttribute("data-id", task.id);
      card.style.setProperty("--tag-color", task.color);

      card.innerHTML = `
        <button class="task-check ${task.completed ? "checked" : ""}" onclick="toggleTask(${task.id})">
          ${task.completed ? "&#10003;" : ""}
        </button>
        <input type="text" class="task-text" value="${task.text}" onchange="updateTaskText(${task.id}, this.value)" />
        <span class="task-tag" style="background-color: ${task.color}">${task.category}</span>
        <button class="task-del" onclick="deleteTask(${task.id})" title="Delete Task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
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
  const pending = total - done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Set standard string numbers
  statTotal.innerText = total;
  statDone.innerText = done;
  statPending.innerText = pending;
  
  // Set styling properties for the track bar
  progressFill.style.width = `${pct}%`;
  progressPct.innerText = `${pct}%`;
}

// 4. Tab Navigation System
function showHome() {
  document.getElementById("btn-home").classList.add("active");
  document.getElementById("btn-docs").classList.remove("active");
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("btn-home").classList.remove("active");
  document.getElementById("btn-docs").classList.add("active");
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").style.display = "block";
}

// 5. Theme Customization System
function applyTheme(themeName) {
  // Clear any theme classes on body
  document.body.className = "";
  
  if (themeName !== 'sunset') {
    document.body.classList.add(`theme-${themeName}`);
  }

  // Explicitly manage layout active states
  document.querySelectorAll(".theme-swatch").forEach(swatch => swatch.classList.remove("active"));
  const mapping = { sunset: "t1", ocean: "t2", forest: "t3", midnight: "t4", aurora: "t5" };
  document.getElementById(mapping[themeName])?.classList.add("active");
}

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

function appendDocumentToList(fileName, fileURL) {
  // Clear out documents page empty layout placeholder if present
  const docEmptyState = documentsList.querySelector(".empty-state");
  if (docEmptyState) docEmptyState.remove();

  const docItem = document.createElement("div");
  docItem.className = "doc-item";
  docItem.innerHTML = `
    <div class="doc-icon">📄</div>
    <div class="doc-name">${fileName}</div>
    <div class="doc-date">${new Date().toLocaleDateString()}</div>
    <div class="doc-actions">
      <button class="doc-btn" onclick="window.open('${fileURL}', '_blank')">View</button>
      <a class="doc-btn" href="${fileURL}" download="${fileName}" style="text-decoration:none; display:inline-block; text-align:center;">Download</a>
      <button class="doc-btn del" onclick="removeDocumentItem(this)">Delete</button>
    </div>
  `;
  documentsList.appendChild(docItem);
}

function removeDocumentItem(button) {
  button.closest(".doc-item").remove();
  if (documentsList.children.length === 0) {
    documentsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗂️</div>
        <p>No documents saved yet. Export your tasks!</p>
      </div>`;
  }
}

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Listen for enter key in the input element
taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});