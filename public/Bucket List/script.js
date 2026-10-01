// Bucket List Tracker - script.js
let goals = [];
let currentView = "grid"; // 'grid' or 'list'

// DOM Elements
const gridView = document.getElementById("grid-view");
const listView = document.getElementById("list-view");
const listContainer = document.getElementById("list-container");
const emptyState = document.getElementById("empty-state");
const overallProgress = document.getElementById("overall-progress");
const progressText = document.getElementById("progress-text");
const statsContainer = document.getElementById("stats");

// Load goals from LocalStorage
function loadGoals() {
  const saved = localStorage.getItem("bucketListGoals");
  goals = saved ? JSON.parse(saved) : [];
  renderAll();
}

// Save to LocalStorage
function saveGoals() {
  localStorage.setItem("bucketListGoals", JSON.stringify(goals));
}

// Generate unique ID
function generateId() {
  return (
    "goal-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 6)
  );
}

// Update overall progress and statistics
function updateStats() {
  const total = goals.length;
  const completed = goals.filter((g) => g.completed).length;
  const percentage = total ? Math.round((completed / total) * 100) : 0;

  overallProgress.style.width = `${percentage}%`;
  progressText.textContent = `${percentage}% (${completed}/${total})`;

  // Category breakdown
  const catStats = {};
  goals.forEach((g) => {
    catStats[g.category] = (catStats[g.category] || 0) + 1;
  });

  let html = `
        <div class="stat-card"><strong>Total Goals:</strong> ${total}</div>
        <div class="stat-card"><strong>Completed:</strong> ${completed}</div>
        <div class="stat-card"><strong>Pending:</strong> ${total - completed}</div>
    `;

  Object.keys(catStats).forEach((cat) => {
    html += `<div class="stat-card"><strong>${cat}:</strong> ${catStats[cat]}</div>`;
  });

  statsContainer.innerHTML = html;
}

// Render Grid View (main view)
function renderGrid(filteredGoals) {
  gridView.innerHTML = "";

  if (filteredGoals.length === 0) {
    emptyState.classList.remove("d-none");
    return;
  }
  emptyState.classList.add("d-none");

  filteredGoals.forEach((goal) => {
    const dueHTML = goal.dueDate
      ? `
            <div class="small text-muted mt-2">
                Due: ${new Date(goal.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>`
      : "";

    const cardHTML = `
            <div class="col">
                <div class="card h-100 ${goal.completed ? "completed" : ""}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="goal-title card-title">${goal.title}</h5>
                            <span class="priority-badge priority-${goal.priority.toLowerCase()}">${goal.priority}</span>
                        </div>
                        
                        <span class="category-tag mb-3">${goal.category}</span>
                        
                        ${goal.description ? `<p class="card-text small text-muted">${goal.description}</p>` : ""}
                        ${dueHTML}

                        <div class="mt-auto pt-3">
                            <button onclick="toggleComplete('${goal.id}')" 
                                    class="btn btn-sm ${goal.completed ? "btn-secondary" : "btn-success"} w-100 mb-2">
                                ${goal.completed ? "Mark Pending" : "Mark Complete"}
                            </button>
                            <div class="d-flex gap-2">
                                <button onclick="editGoal('${goal.id}')" class="btn btn-sm btn-outline-light flex-grow-1">Edit</button>
                                <button onclick="deleteGoal('${goal.id}')" class="btn btn-sm btn-outline-danger flex-grow-1">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    gridView.innerHTML += cardHTML;
  });
}

// Render Compact List View
function renderList(filteredGoals) {
  listContainer.innerHTML = "";

  if (filteredGoals.length === 0) {
    emptyState.classList.remove("d-none");
    return;
  }
  emptyState.classList.add("d-none");

  filteredGoals.forEach((goal) => {
    const itemHTML = `
            <div class="list-group-item d-flex justify-content-between align-items-center ${goal.completed ? "completed" : ""}">
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center gap-3">
                        <strong class="goal-title">${goal.title}</strong>
                        <span class="priority-badge priority-${goal.priority.toLowerCase()}">${goal.priority}</span>
                        <span class="category-tag">${goal.category}</span>
                    </div>
                    ${goal.description ? `<p class="small text-muted mb-1">${goal.description}</p>` : ""}
                    ${goal.dueDate ? `<small class="text-muted">Due: ${new Date(goal.dueDate).toLocaleDateString()}</small>` : ""}
                </div>
                <div class="d-flex gap-2">
                    <button onclick="toggleComplete('${goal.id}')" class="btn btn-sm ${goal.completed ? "btn-secondary" : "btn-success"}">✓</button>
                    <button onclick="editGoal('${goal.id}')" class="btn btn-sm btn-outline-light">Edit</button>
                    <button onclick="deleteGoal('${goal.id}')" class="btn btn-sm btn-outline-danger">Delete</button>
                </div>
            </div>
        `;
    listContainer.innerHTML += itemHTML;
  });
}

function renderAll(filteredGoals = null) {
  const goalsToRender = filteredGoals || goals;

  if (currentView === "grid") {
    renderGrid(goalsToRender);
  } else {
    renderList(goalsToRender);
  }
  updateStats();
}

// Filter goals
function filterGoals() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const statusFilter = document.querySelector(
    'input[name="status-filter"]:checked',
  ).value;
  const categoryFilter = document.getElementById("category-filter").value;

  const filtered = goals.filter((goal) => {
    const matchesSearch =
      !searchTerm ||
      goal.title.toLowerCase().includes(searchTerm) ||
      (goal.description && goal.description.toLowerCase().includes(searchTerm));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && goal.completed) ||
      (statusFilter === "pending" && !goal.completed);

    const matchesCategory =
      categoryFilter === "all" || goal.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  renderAll(filtered);
}

// Save Goal (including subtasks)
function saveGoal() {
  const editId = document.getElementById("edit-id").value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const priority = document.getElementById("priority").value;
  const dueDate = document.getElementById("due-date").value;

  if (!title || !category) {
    alert("Title and Category are required.");
    return;
  }

  const subtasks = [];
  document.querySelectorAll(".subtask-item").forEach((item) => {
    const text = item.querySelector(".subtask-text").value.trim();
    const checked = item.querySelector('input[type="checkbox"]').checked;
    if (text) subtasks.push({ text, completed: checked });
  });

  if (editId) {
    const goal = goals.find((g) => g.id === editId);
    if (goal) {
      goal.title = title;
      goal.description = description;
      goal.category = category;
      goal.priority = priority;
      goal.dueDate = dueDate;
      goal.subtasks = subtasks;
    }
  } else {
    goals.unshift({
      id: generateId(),
      title,
      description,
      category,
      priority,
      dueDate,
      completed: false,
      subtasks: subtasks,
      createdAt: new Date().toISOString(),
    });
  }

  saveGoals();
  renderAll();
  bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
  resetModalForm();
}

// Toggle complete
window.toggleComplete = function (id) {
  const goal = goals.find((g) => g.id === id);
  if (goal) {
    goal.completed = !goal.completed;
    saveGoals();
    renderAll();
  }
};

// Edit goal
window.editGoal = function (id) {
  const goal = goals.find((g) => g.id === id);
  if (!goal) return;

  document.getElementById("edit-id").value = goal.id;
  document.getElementById("title").value = goal.title;
  document.getElementById("description").value = goal.description || "";
  document.getElementById("category").value = goal.category;
  document.getElementById("priority").value = goal.priority;
  document.getElementById("due-date").value = goal.dueDate || "";

  document.getElementById("modalTitle").textContent = "Edit Goal";

  // Load subtasks
  renderSubtasks(goal.subtasks || []);

  new bootstrap.Modal(document.getElementById("addModal")).show();
};

// Delete goal
window.deleteGoal = function (id) {
  if (confirm("Delete this goal permanently?")) {
    goals = goals.filter((g) => g.id !== id);
    saveGoals();
    renderAll();
  }
};

// Subtasks handling
let subtaskCounter = 0;

function renderSubtasks(existingSubtasks = []) {
  const container = document.getElementById("subtasks-container");
  container.innerHTML = "";
  subtaskCounter = 0;

  existingSubtasks.forEach((sub) => {
    addSubtaskToUI(sub.text, sub.completed);
  });
}

function addSubtaskToUI(text = "", completed = false) {
  const container = document.getElementById("subtasks-container");
  const id = "subtask-" + subtaskCounter++;

  const html = `
        <div class="subtask-item" id="${id}">
            <input type="checkbox" ${completed ? "checked" : ""}>
            <input type="text" class="subtask-text flex-grow-1" value="${text}" placeholder="Subtask description">
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="this.parentElement.remove()">×</button>
        </div>
    `;
  container.insertAdjacentHTML("beforeend", html);
}

document.getElementById("add-subtask-btn").addEventListener("click", () => {
  addSubtaskToUI();
});

// Reset modal
function resetModalForm() {
  document.getElementById("goal-form").reset();
  document.getElementById("edit-id").value = "";
  document.getElementById("modalTitle").textContent = "Add New Goal";
  document.getElementById("subtasks-container").innerHTML = "";
}

// Export Data
function exportData() {
  if (goals.length === 0) {
    alert("No goals to export.");
    return;
  }
  const dataStr = JSON.stringify(goals, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
  const link = document.createElement("a");
  link.href = dataUri;
  link.download = `bucket-list-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
}

// Import Data
function importData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        if (
          confirm(
            `Import ${imported.length} goals? Current list will be replaced.`,
          )
        ) {
          goals = imported;
          saveGoals();
          renderAll();
          alert("Data imported successfully!");
        }
      }
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
}

// Setup Event Listeners
function setupEventListeners() {
  // Save button
  document.getElementById("save-goal").addEventListener("click", saveGoal);

  // Modal reset
  document
    .getElementById("addModal")
    .addEventListener("hidden.bs.modal", resetModalForm);

  // Filters
  document
    .getElementById("search-input")
    .addEventListener("input", filterGoals);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterGoals);
  document.querySelectorAll('input[name="status-filter"]').forEach((radio) => {
    radio.addEventListener("change", filterGoals);
  });

  // Clear filters
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.getElementById("search-input").value = "";
    document.getElementById("category-filter").value = "all";
    document.getElementById("status-all").checked = true;
    filterGoals();
  });

  // View Toggle
  document.getElementById("grid-view-btn").addEventListener("click", () => {
    currentView = "grid";
    gridView.classList.remove("d-none");
    listView.classList.add("d-none");
    document.getElementById("grid-view-btn").classList.add("active");
    document.getElementById("list-view-btn").classList.remove("active");
    renderAll();
  });

  document.getElementById("list-view-btn").addEventListener("click", () => {
    currentView = "list";
    gridView.classList.add("d-none");
    listView.classList.remove("d-none");
    document.getElementById("grid-view-btn").classList.remove("active");
    document.getElementById("list-view-btn").classList.add("active");
    renderAll();
  });

  // Export / Import
  document.getElementById("export-btn").addEventListener("click", exportData);
  document.getElementById("import-btn").addEventListener("click", () => {
    document.getElementById("import-input").click();
  });
  document.getElementById("import-input").addEventListener("change", (e) => {
    if (e.target.files.length > 0) importData(e.target.files[0]);
  });
}

// Keyboard shortcut Ctrl/Cmd + K
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    new bootstrap.Modal(document.getElementById("addModal")).show();
  }
});

// Initialize
function init() {
  loadGoals();
  setupEventListeners();
}

window.onload = init;
