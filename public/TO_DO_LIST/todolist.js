
// 1. DOM Element References
const taskInput = document.getElementById("task");
const taskCategory = document.getElementById("task-category");
const emptyState = document.getElementById("emptyState");
const emptyDocsState = document.getElementById("emptyDocsState");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const taskForm = document.getElementById("task-form");
const savePdfBtn = document.getElementById("savepdf");
const navHome = document.getElementById("nav-home");
const navDocuments = document.getElementById("nav-documents");
const homeTab = document.getElementById("home-tab");
const documentsTab = document.getElementById("documents-tab");

let currentTheme = "theme1";

// ---------- Theme Configuration ----------
const themeConfig = {
  theme1: {
    body: "linear-gradient(135deg, #9a8cff 0%, #7c63ff 45%, #4b3bbd 100%)",
    noteColor: "rgba(255,255,255,0.95)",
  },
  theme2: {
    body: "linear-gradient(135deg, #4f8dff 0%, #6ca8ff 42%, #b8d8ff 100%)",
    noteColor: "rgba(255, 250, 253, 0.95)",
  },
  theme3: {
    body: "linear-gradient(135deg, #14b8a6 0%, #4fd1c5 45%, #99f6e4 100%)",
    noteColor: "rgba(255, 255, 255, 0.95)",
  },
  theme4: {
    body: "linear-gradient(135deg, #ffd29a 0%, #ffb86b 45%, #d17a1f 100%)",
    noteColor: "rgba(245, 241, 255, 0.92)",
  },
  theme5: {
    body: "linear-gradient(135deg, #ff7b7b 0%, #ef4444 45%, #991b1b 100%)",
    noteColor: "rgba(255, 249, 244, 0.94)",
  },
};

// ---------- Task Types (Category Colours) ----------
const taskTypes = [
  { label: "Select Type", value: "", color: "rgba(255, 255, 255, 0.95)", badgeClass: "" },
  { label: "Work", value: "Work", color: "#FFDE59", badgeClass: "💼" },
  { label: "Personal", value: "Personal", color: "#FFC0CB", badgeClass: "🧑" },
  { label: "Urgent", value: "Urgent", color: "#B0BEC5", badgeClass: "⚡" },
  { label: "Fitness", value: "Fitness", color: "#B1EE99", badgeClass: "💪" },
  { label: "Miscellaneous", value: "Miscellaneous", color: "#CAB9F5", badgeClass: "📌" },
];

// ---------- Progress Bar Update ----------
function updateProgress() {
  const notes = document.querySelectorAll(".notes");
  const total = notes.length;
  const completed = document.querySelectorAll(".notes .completed").length;
  const percent = total > 0 ? (completed / total) * 100 : 0;

  progressFill.style.width = `${percent}%`;
  progressText.value = `${completed} / ${total} done`;

  // Toggle empty state
  if (emptyState) {
    emptyState.style.display = total === 0 ? "flex" : "none";
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
}
document.querySelectorAll(".theme-btn").forEach(button => {

  button.addEventListener("click", () => {

    const theme = button.dataset.theme;

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