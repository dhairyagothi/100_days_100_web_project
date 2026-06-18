// DOM Element References
const taskInput = document.getElementById('task');
const taskTypeSelect = document.getElementById('task-category');
const taskPrioritySelect = document.getElementById('task-priority');
const taskList = document.getElementById('notes-container');
const emptyState = document.getElementById('emptyState');
const statusTabsContainer = document.getElementById('statusTabs');
const documentsList = document.querySelector('.documents-list');

// New Dashboard Elements
const progressPercent = document.getElementById('progressPercent');
const progressDetails = document.getElementById('progressTextSmall');
const progressRingFill = document.querySelector('.card-progress-fill');
const heroProgressFill = document.getElementById('heroProgressFill');
const heroProgressText = document.getElementById('progressText');
const currentStreakEl = document.getElementById('currentStreak');
const longestStreakEl = document.getElementById('longestStreak');
const unlockedBadgesEl = document.getElementById('unlockedBadges');
const totalTasksEl = document.getElementById('totalTasks');
const toastContainerNew = document.getElementById('toastContainer');

// Data State
let tasks = [];
let savedDocs = [];
let currentStatusFilter = 'all';
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// Productivity Stats
let productivityStats = {
  totalTasksCreated: 0,
  totalTasksCompleted: 0,
  completionPercentage: 0,
};

// Streak Data
let streakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  lastStreakCheck: null,
};

// Badges
let badges = {
  firstTask: { unlocked: false, name: 'First Task', icon: '🎯', description: 'Create your first task' },
  firstComplete: { unlocked: false, name: 'First Complete', icon: '✅', description: 'Complete your first task' },
  sevenDayStreak: { unlocked: false, name: '7-Day Streak', icon: '🔥', description: '7-day streak' },
  twentyFiveTasks: { unlocked: false, name: '25 Tasks', icon: '🏆', description: 'Create 25 tasks' },
  fiftyTasks: { unlocked: false, name: '50 Tasks', icon: '👑', description: 'Create 50 tasks' },
};

// Local Storage Persistence
function saveTasks() {
  try {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks:', e);
  }
}

function saveDocuments() {
  try {
    const metaOnly = savedDocs.map(({ url, ...rest }) => rest);
    localStorage.setItem('todo-documents', JSON.stringify(metaOnly));
  } catch (e) {
    console.error('Error saving documents:', e);
  }
}

function saveStats() {
  try {
    localStorage.setItem('todo-stats', JSON.stringify(productivityStats));
  } catch (e) {
    console.error('Error saving stats:', e);
  }
}

function saveStreak() {
  try {
    localStorage.setItem('todo-streak', JSON.stringify(streakData));
  } catch (e) {
    console.error('Error saving streak:', e);
  }
}

function saveBadges() {
  try {
    localStorage.setItem('todo-badges', JSON.stringify(badges));
  } catch (e) {
    console.error('Error saving badges:', e);
  }
}

function loadFromStorage() {
  try {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
      tasks = JSON.parse(savedTasks);
      if (!localStorage.getItem('todo-stats')) {
        productivityStats.totalTasksCreated = tasks.length;
      }
    }

    const savedDocsData = localStorage.getItem('todo-documents');
    if (savedDocsData) savedDocs = JSON.parse(savedDocsData);

let tasks = [];
let currentFilter = "all";
let currentSearch = "";
    const savedStats = localStorage.getItem('todo-stats');
    if (savedStats) productivityStats = JSON.parse(savedStats);
    productivityStats.totalTasksCreated = Math.max(productivityStats.totalTasksCreated, tasks.length);
// ─── State ────────────────────────────────────────────────────────────────
let tasks = JSON.parse(localStorage.getItem("kanban-board-tasks")) || [
  { id: "k-task-1", title: "Review Open-Source Pull Requests", category: "Work", priority: "High", status: "pending", dueDate: "" },
  { id: "k-task-2", title: "Refactor Theme Style Overlap Rules", category: "Study", priority: "Medium", status: "inprogress", dueDate: "" },
  { id: "k-task-3", title: "Verify Grid Layout Persistence", category: "Personal", priority: "Low", status: "completed", dueDate: "" },
];

let savedDocs = JSON.parse(localStorage.getItem("kanban-saved-docs-meta")) || [];

// ─── DOM refs ─────────────────────────────────────────────────────────────
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task");
const categorySelect = document.getElementById("task-category");
const prioritySelect = document.getElementById("task-priority");
const dueDateInput = document.getElementById("task-date");
const searchInput = document.getElementById("task-search");
const noResultsMsg = document.getElementById("no-results-msg");
const noResultsQuery = document.getElementById("no-results-query");
const emptyState = document.getElementById("emptyState");
const charCounter = document.getElementById("char-counter");

// Set minimum selectable date to today
dueDateInput.min = new Date().toISOString().split("T")[0];

// ─── Priority helpers ──────────────────────────────────────────────────────
function getPriorityClass(priority) {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  return "priority-low";
}

function getPriorityEmoji(priority) {
  if (priority === "High") return "🔴";
  if (priority === "Medium") return "🟡";
  return "🟢";
}

// 2. Core Task CRUD & Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  // Capture priority choice safely
  const priorityElement = document.getElementById("prioritySelect");
  const priorityValue = priorityElement ? priorityElement.value : "medium";
  const eisenhower = eisenhowerSelect ? eisenhowerSelect.value : "";
  const priority = taskPrioritySelect.value;
// ─── Render Kanban Board ───────────────────────────────────────────────────
function renderKanban(filterQuery) {
  document.querySelectorAll(".kanban-column-drop-zone").forEach(z => (z.innerHTML = ""));

  const query = (filterQuery || searchInput.value || "").trim().toLowerCase();
  const visibleTasks = query
    ? tasks.filter(t => t.title.toLowerCase().includes(query))
    : tasks;

  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const selectedCatOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const catColor = (selectedCatOption && selectedCatOption.getAttribute('data-color')) || '#7c63ff';
  // Bug 4 fix: require a category selection; show a clear warning if omitted
  if (!category) {
    showToast("⚠️ Please select a category!");
    taskTypeSelect.focus();
    return;
  // Show/hide empty state
  if (tasks.length === 0) {
    emptyState.style.display = "flex";
    document.getElementById("kanban-board").style.display = "none";
  } else {
    emptyState.style.display = "none";
    document.getElementById("kanban-board").style.display = "flex";
  }

  // Show/hide no-results
  if (query && visibleTasks.length === 0) {
    noResultsQuery.textContent = query;
    noResultsMsg.style.display = "block";
  } else {
    noResultsMsg.style.display = "none";
  }

  // Create local task object
  const newTask = {
    id: Date.now(),
    text: text,
    category: category || 'General',
    categoryColor: catColor,
    priority: priority || 'Normal',
    priorityColor: priColor,
    status: 'pending',
    completed: false,
    priority: priorityValue,
    task_no: tasks.length + 1,
    createdAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  tasks.push(newTask);
  taskInput.value = "";
  if (priorityElement) priorityElement.value = "medium"; // Reset back to default

  taskTypeSelect.value = ""; // Reset dropdown
  if (eisenhowerSelect) {
    eisenhowerSelect.value = "";
  } // Reset Eisenhower dropdown

  };

  tasks.push(newTask);
  productivityStats.totalTasksCreated += 1;
  saveTasks();
  saveStats();

  taskInput.value = '';
  taskTypeSelect.value = '';
  taskPrioritySelect.value = '';

  renderTasks();
  showNewToast('🚀 Task created successfully!', 'success', '🚀');

  showToast("✅ Task added successfully!");
}

function toggleTask(id) {
  if (!badges.firstTask.unlocked) {
    unlockBadge('firstTask');
  }

  if (productivityStats.totalTasksCreated >= 25 && !badges.twentyFiveTasks.unlocked) {
    unlockBadge('twentyFiveTasks');
  }

  if (productivityStats.totalTasksCreated >= 50 && !badges.fiftyTasks.unlocked) {
    unlockBadge('fiftyTasks');
  }
}

function toggleComplete(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const isCompleted = task.status !== 'completed';
      if (isCompleted) {
        incrementStreak();

        if (!badges.firstComplete.unlocked) {
          unlockBadge('firstComplete');
        }
      }

      return {
        ...task,
        completed: !task.completed,
        completed: isCompleted,
        status: isCompleted ? 'completed' : 'pending',
      };
    }
    return task;
  });

  saveTasks();
    category: category,
    color: color,
    completed: false
  };
  const today = new Date().toISOString().split("T")[0];

  visibleTasks.forEach(task => {
    const laneDropTarget = document.getElementById(task.status);
    if (!laneDropTarget) return;

    const isOverdue = task.dueDate && task.dueDate < today && task.status !== "completed";
    const isDueToday = task.dueDate === today && task.status !== "completed";
    const isCompleted = task.status === "completed";
    const isInProgress = task.status === "inprogress";

    const card = document.createElement("div");
    card.id = task.id;
    card.setAttribute("draggable", "true");
    card.setAttribute("data-taskid", task.id);
    card.setAttribute("role", "listitem");

    let cardClass = "kanban-task-card";
    if (isCompleted) cardClass += " task-completed";
    else if (isOverdue) cardClass += " overdue-task";
    else if (isDueToday) cardClass += " due-today-task";
    card.className = cardClass;

    const priorityClass = getPriorityClass(task.priority || "Medium");
    const priorityEmoji = getPriorityEmoji(task.priority || "Medium");

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
        <span style="font-size:0.65rem; padding:2px 8px; border-radius:4px; background:rgba(255,255,255,0.06); color:rgba(240,240,245,0.7); font-weight:700;">${task.category || "General"}</span>
        <span class="priority-badge ${priorityClass}" aria-label="Priority: ${task.priority || 'Medium'}">${priorityEmoji} ${task.priority || "Medium"}</span>
      </div>
      <p class="card-title-text" aria-label="Task: ${task.title}">${task.title}</p>
      ${task.dueDate ? `<p style="font-size:0.75rem; color:#94a3b8; margin-top:4px;">📅 ${task.dueDate}</p>` : ""}
      ${isOverdue ? `<span class="overdue-badge" aria-label="Overdue">⚠️ Overdue</span>` : ""}
      <div class="card-actions">
        <button
          class="card-action-btn btn-complete ${isCompleted ? "btn-active-complete" : ""}"
          onclick="markTaskCompleted('${task.id}')"
          title="${isCompleted ? "Unmark Completed" : "Mark as Completed"}"
          aria-label="${isCompleted ? "Unmark Completed" : "Mark as Completed"}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
        <button
          class="card-action-btn btn-inprogress ${isInProgress ? "btn-active-inprogress" : ""}"
          onclick="markTaskInProgress('${task.id}')"
          title="${isInProgress ? "Back to Pending" : "Mark as In Progress"}"
          aria-label="${isInProgress ? "Back to Pending" : "Mark as In Progress"}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </button>
        <button
          class="card-action-btn btn-delete"
          onclick="deleteTaskNode('${task.id}')"
          title="Delete Task"
          aria-label="Delete Task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
    `;

    // Drag events
    card.addEventListener("dragstart", e => {
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", task.id);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));

    laneDropTarget.appendChild(card);
  });

  calculateSystemCounters();
}

// ─── Dashboard counters ────────────────────────────────────────────────────
function calculateSystemCounters() {
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  const progressCount = tasks.filter(t => t.status === "inprogress").length;
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const today = new Date().toISOString().split("T")[0];
  const overdueCount = tasks.filter(t => t.dueDate && t.dueDate < today && t.status !== "completed").length;

  const statEls = {
    "count-pending": pendingCount,
    "count-inprogress": progressCount,
    "count-completed": completedCount,
    "totalTasks": tasks.length,
    "dashboardPending": pendingCount,
    "dashboardInProgress": progressCount,
    "dashboardTotalCompleted": completedCount,
    "dashboardOverdue": overdueCount,
  };

function deleteTask(id) {
  // Triggers exit animation before layout re-render
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = "fadeOut 0.25s ease forwards";
    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      tasks.forEach((task, index) => {
        task.task_no = index + 1;
      });

      saveTasks();
      renderTasks();

      showToast("🗑️ Task deleted!");
    }, 250);
  }
}

function clearDone() {
  const previousLength = tasks.length;

  tasks = tasks.filter((task) => !task.completed);

  if (tasks.length === previousLength) {
    showToast("ℹ️ No completed tasks found.");
  } else {
    // Re-number tasks sequentially after clearing
    tasks.forEach((task, index) => {
      task.task_no = index + 1;
    });
    saveTasks();
    renderTasks();

    showToast("🧹 Completed tasks cleared!");
      saveTasks();
      tasks = tasks.filter(task => task.id !== id);
      saveTasks(); // Bug 1 fix: persist after delete
      renderTasks();
    }, 250);
  }
}

function updateTaskText(id, newText) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return {
        ...task,
        text: newText.trim() || "Untitled Task",
      };
      return { ...task, text: newText.trim() || 'Untitled Task' };
    }
    return task;
  });
  saveTasks();
}

// Status Filtering
function filterByStatus(status) {
  currentStatusFilter = status;

function filterTasks(buttonElement, filterValue) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((btn) => btn.classList.remove("active"));

  buttonElement.classList.add("active");

  currentFilter = filterValue;
  document.querySelectorAll('.status-tab').forEach((tab) => {
    if (tab.getAttribute('data-status') === status) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
function clearDone() {
  const previousLength = tasks.length;
  tasks = tasks.filter(task => !task.completed);
  if (tasks.length === previousLength) {
    showToast("ℹ️ No completed tasks to clear.");
  Object.entries(statEls).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Hero progress bar
  const heroFill = document.getElementById("heroProgressFill");
  const heroText = document.getElementById("progressText");
  if (tasks.length > 0) {
    const pct = Math.round((completedCount / tasks.length) * 100);
    if (heroFill) heroFill.style.width = `${pct}%`;
    if (heroText) heroText.textContent = `${completedCount} / ${tasks.length} tasks finished (${pct}%)`;
  } else {
    if (heroFill) heroFill.style.width = "0%";
    if (heroText) heroText.textContent = "0 / 0 tasks completed";
  }

  // Show/hide "Clear Completed" button
  const ccBtn = document.getElementById("clearCompletedBtn");
  if (ccBtn) ccBtn.hidden = completedCount === 0;
}

function renderTasks() {
  const filteredTasks = tasks.filter((task) => {
    // Apply main filter
    let passesFilter = false;
    if (currentFilter === "all") {
      passesFilter = true;
    } else if (currentFilter === "pending" || currentFilter === "active") {
      passesFilter = !task.completed;
    } else if (currentFilter === "done" || currentFilter === "completed") {
      passesFilter = task.completed;
    } else {
      passesFilter = task.category === currentFilter; // Matches Category Strings
    }

    // Apply search filter (only search task text, not buttons/metadata)
    if (currentSearch.trim()) {
      const searchLower = currentSearch.toLowerCase();
      const taskTextMatch = task.text.toLowerCase().includes(searchLower);
      const categoryMatch = task.category.toLowerCase().includes(searchLower);
      passesFilter = passesFilter && (taskTextMatch || categoryMatch);
    }

    return passesFilter;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = "";

    if (emptyState) {
      taskList.appendChild(emptyState);
      emptyState.style.display = "flex";
    }
  } else {
    if (emptyState) {
      emptyState.style.display = "none";
    }

    taskList.innerHTML = "";

    filteredTasks.forEach((task, idx) => {
      const card = document.createElement("div");

      card.className = `notes ${task.completed ? "completed" : ""}`;

      card.setAttribute("data-id", task.id);

      card.style.setProperty("--i", idx);

      card.innerHTML = `
        <div class="note-row">
          <textarea class="note-text" onchange="updateTaskText(${task.id}, this.value)">${task.text}</textarea>
          <div class="task-timestamp">📅 ${task.createdAt}</div>
          <div class="task-meta-row">
            <div class="category-badge">${task.category}</div>
            <div class="priority-badge ${task.priority}">
              ${task.priority === "high" ? "🔴 High" : task.priority === "medium" ? "🟡 Medium" : "🟢 Low"}
            </div>
            <button class="note-check" onclick="toggleTask(${task.id})">${task.completed ? "✓" : "✔"}</button>
            <button class="note-delete" onclick="deleteTask(${task.id})">Delete</button>
          </div>


          <div class="note-actions">
            <span class="task-number">${task.task_no}</span>
            ${
              task.eisenhower
                ? `
                  <span class="priority-tag ${task.eisenhower}">
                    ${
                      {
                        "urgent-important": "🔥 Urgent & Important",

                        "important-only": "⭐ Important Only",

                        "urgent-only": "⚡ Urgent Only",

                        neither: "🌱 Neither",
                      }[task.eisenhower]
                    }
                  </span>
                `
                : ""
            }
          </div>
  taskList.innerHTML = '';
  // Filter core task pool
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "all") return true;
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "done") return task.completed;
    return task.category === currentFilter; // Matches Category Strings
  });

  // Clear container safely — no innerHTML (Bug 2 fix: XSS prevention)
  taskList.replaceChildren();
// ─── Persist ───────────────────────────────────────────────────────────────
function saveTasks() {
  localStorage.setItem("kanban-board-tasks", JSON.stringify(tasks));
}

// ─── Character Counter ─────────────────────────────────────────────────────
taskInput.addEventListener("input", () => {
  const currentLen = taskInput.value.length;
  charCounter.textContent = `${currentLen} / 200`;
  if (currentLen > 198) {
    charCounter.classList.add("near-limit");
  } else {
    charCounter.classList.remove("near-limit");
  }
});

  updateMetrics();
  updateTaskChart();
}

// ============================================
// PROGRESS METRICS
// ============================================

// UPDATE DASHBOARD METRICS
function updateMetrics() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const inProgressTasks = totalTasks - completedTasks;
  const overdueTasks = 0;

  // Scans list items that are flagged high priority
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "high",
  ).length;

  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("inProgressTasks").textContent = inProgressTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
  document.getElementById("overdueTasks").textContent = overdueTasks;
  document.getElementById("highPriorityTasks").textContent = highPriorityCount;
}

// 4. Tab Navigation System
// function showHome() {
//   document.getElementById("btn-home").classList.add("active");
//   document.getElementById("btn-docs").classList.remove("active");
//   document.getElementById("home-tab").style.display = "block";
//   document.getElementById("documents-tab").style.display = "none";
// }

// function showDocuments() {
//   document.getElementById("btn-home").classList.remove("active");
//   document.getElementById("btn-docs").classList.add("active");
//   document.getElementById("home-tab").style.display = "none";
//   document.getElementById("documents-tab").style.display = "block";
// }

// ============================================
// TAB NAVIGATION
// ============================================

function showHome() {
  document.getElementById("nav-home").classList.add("active");

  document.getElementById("nav-documents").classList.remove("active");

  document.getElementById("home-tab").removeAttribute("hidden");

  document.getElementById("home-tab").style.display = "block";

  document.getElementById("documents-tab").setAttribute("hidden", "");

  document.getElementById("documents-tab").style.display = "none";
}

function showDocuments() {
  document.getElementById("nav-home").classList.remove("active");

  document.getElementById("nav-documents").classList.add("active");

  document.getElementById("home-tab").setAttribute("hidden", "");

  document.getElementById("home-tab").style.display = "none";

  document.getElementById("documents-tab").removeAttribute("hidden");

  document.getElementById("documents-tab").style.display = "block";
  updateProgress();
  renderBadges();
}

function updateMetrics() {
  const total = tasks.length;
  const pendingCount = tasks.filter((t) => t.status === 'pending' || !t.status).length;
  const inProgressCount = tasks.filter((t) => t.status === 'inprogress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  document.getElementById('count-all').textContent = total;
  document.getElementById('count-pending').textContent = pendingCount;
  document.getElementById('count-inprogress').textContent = inProgressCount;
  document.getElementById('count-completed').textContent = completedCount;
}

function updateTaskText(id, newText) {
  tasks = tasks.map(task => {
    if (task.id === id) return { ...task, text: newText.trim() || "Untitled Task" };
    return task;
// ─── Add task ──────────────────────────────────────────────────────────────
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.push({
    id: "task_" + Date.now(),
    title,
    category: categorySelect.value || "Others",
    priority: prioritySelect.value || "Medium",
    dueDate: dueDateInput.value,
    status: "pending",
  });

  saveTasks();
  renderKanban();
  showToast("✅ Task added!", "success");

  taskInput.value = "";
  charCounter.textContent = "0 / 200";
  charCounter.classList.remove("near-limit");
  categorySelect.selectedIndex = 0;
  prioritySelect.selectedIndex = 0;
  dueDateInput.value = "";
});

// ─── Delete ────────────────────────────────────────────────────────────────
window.deleteTaskNode = function (id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderKanban();
  showToast("🗑️ Task removed!", "info");
};

// ─── Toggle completed ──────────────────────────────────────────────────────
window.markTaskCompleted = function (id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t
  );
  saveTasks();
  renderKanban();
  const t = tasks.find(t => t.id === id);
  showToast(t && t.status === "completed" ? "✅ Marked as Completed!" : "🔄 Moved back to Pending!", "success");
};

// ─── Toggle in-progress ────────────────────────────────────────────────────
window.markTaskInProgress = function (id) {
  tasks = tasks.map(t =>
    t.id === id ? { ...t, status: t.status === "inprogress" ? "pending" : "inprogress" } : t
  );
  saveTasks();
  renderKanban();
  const t = tasks.find(t => t.id === id);
  showToast(t && t.status === "inprogress" ? "⚡ Marked as In Progress!" : "🔄 Moved back to Pending!", "info");
};

// ─── Drag-and-drop between columns ────────────────────────────────────────
document.querySelectorAll(".kanban-column-drop-zone").forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    zone.classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.classList.remove("drag-over");
    const droppedId = e.dataTransfer.getData("text/plain");
    const newStatus = zone.id;
    tasks = tasks.map(t => t.id === droppedId ? { ...t, status: newStatus } : t);
    saveTasks();
    renderKanban();
  });
});

// ─── Live search ───────────────────────────────────────────────────────────
searchInput.addEventListener("input", () => renderKanban());

// ─── Toast ────────────────────────────────────────────────────────────────
let _toastTimer = null;

function showToast(message, type) {
  const el = document.getElementById("appToast");
  if (!el) return;
  el.textContent = message;
  el.className = "toast-popup toast-show";
  if (type === "success") el.classList.add("toast-success");
  else if (type === "error") el.classList.add("toast-error");
  else el.classList.add("toast-info");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    el.classList.remove("toast-show", "toast-success", "toast-error", "toast-info");
  }, 3000);
}

// ─── Tab navigation ────────────────────────────────────────────────────────
window.showHome = function () {
  document.getElementById("home-tab").className = "active-section";
  document.getElementById("documents-tab").className = "inactive-section";
  document.getElementById("nav-home").classList.add("active");
  document.getElementById("nav-documents").classList.remove("active");
};

function showDocuments() {
  showSection('documents');
  renderSavedDocuments();
}



const navDocuments = document.getElementById("nav-documents");
// Calendar
function renderCalendar() {
  const container = document.getElementById('calendarContainer');
  if (!container) return;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startIndex = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const today = new Date();

if (navDocuments) {
  navDocuments.addEventListener("click", (e) => {
    e.preventDefault();
    showDocuments();
  });
}

// ============================================
// THEME SYSTEM
// ============================================

window.showDocuments = function () {
  document.getElementById("home-tab").className = "inactive-section";
  document.getElementById("documents-tab").className = "active-section";
  document.getElementById("nav-home").classList.remove("active");
  document.getElementById("nav-documents").classList.add("active");
  renderSavedDocuments();
};

// Wire up nav link click listeners
const navHome = document.getElementById("nav-home");
const navDocuments = document.getElementById("nav-documents");
if (navHome) {
  navHome.addEventListener("click", (e) => { e.preventDefault(); showHome(); });
}
if (navDocuments) {
  navDocuments.addEventListener("click", (e) => { e.preventDefault(); showDocuments(); });
}

// 5. Theme Customization System
function applyTheme(themeName) {
  document.body.classList.remove(
    "theme1",
    "theme2",
    "theme3",
    "theme4",
    "theme5",
  );

  document.body.classList.add(themeName);

  document
    .querySelectorAll(".theme-btn")
    .forEach((btn) => btn.classList.remove("active"));

  const activeBtn = document.querySelector(`[data-theme="${themeName}"]`);
  let html = `
    <div class="calendar-header">
      <h3>${monthNames[currentMonth]} ${currentYear}</h3>
      <div class="calendar-nav">
        <button onclick="changeMonth(-1)">&lt;</button>
        <button onclick="changeMonth(1)">&gt;</button>
      </div>
    </div>
    <div class="calendar-weekdays">
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
    </div>
    <div class="calendar-days">
  `;

  for (let i = 0; i < startIndex; i++) {
    const prevMonthDate = new Date(currentYear, currentMonth, -(startIndex - i));
    html += `<div class="calendar-day other-month">${prevMonthDate.getDate()}</div>`;
  }
    "theme5"
  );

  document.body.classList.add(themeName);

  document.querySelectorAll(".theme-btn")
    .forEach(btn => btn.classList.remove("active"));

  const activeBtn = document.querySelector(
    `[data-theme="${themeName}"]`
  );

document.querySelectorAll(".theme-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;

    if (!theme) return;

    applyTheme(theme);
  });
});

// ============================================
// PDF EXPORT SYSTEM
// ============================================
function changeMonth(diff) {
  currentMonth += diff;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
  try { localStorage.setItem('todo-theme', themeName); } catch (e) { }
}
document.querySelectorAll(".theme-btn").forEach(button => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    if (!theme) return;
    applyTheme(theme);
  });
});

// 6. PDF System using jsPDF Global Library
function saveAsPDF() {
  if (tasks.length === 0) {
    showToast("❌ Cannot export empty list!");
    return;
  }

  const snapshot = [...tasks];

  const doneCount = snapshot.filter((task) => task.completed).length;

  // Snapshot the current task list at this exact moment
  const snapshot = [...tasks];
  const doneCount = snapshot.filter(t => t.completed).length;
  const pendingCount = snapshot.length - doneCount;
// ─── Save as PDF ───────────────────────────────────────────────────────────
function saveAsPDF() {
  if (tasks.length === 0) { showToast("❌ No tasks to export!", "info"); return; }
  if (!window.jspdf) { showToast("⏳ PDF library loading, try again!", "info"); return; }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("To-Do List Report", 20, 24);
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

  doc.text(
    `Tasks: ${snapshot.length} total | ${doneCount} done | ${pendingCount} pending`,
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  doc.text(
    `Tasks: ${tasks.length} total  |  ${completedCount} completed  |  ${tasks.length - completedCount} pending/in progress`,
    20,
    38,
  );
  doc.text(`Tasks: ${snapshot.length} total  |  ${doneCount} done  |  ${pendingCount} pending`, 20, 38);
  const completedCount = tasks.filter(t => t.status === "completed").length;
  const inProgressCount = tasks.filter(t => t.status === "inprogress").length;
  const pendingCount = tasks.filter(t => t.status === "pending").length;
  doc.text(`Total: ${tasks.length}  |  Completed: ${completedCount}  |  In Progress: ${inProgressCount}  |  Pending: ${pendingCount}`, 20, 38);
  doc.line(20, 42, 190, 42);

  let y = 52;
  doc.setFontSize(12);

  tasks.forEach((task, index) => {
    if (verticalCursor > 270) {
      doc.addPage();
      verticalCursor = 20;
    }

    const status = task.completed ? "[DONE]" : "[PENDING]";

    const line = `${index + 1}. ${status} (${task.category}) — ${task.text}`;

    doc.text(line, 20, verticalCursor);

    verticalCursor += 10;
  });

  const timeLabel = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;

  const fileURL = URL.createObjectURL(doc.output("blob"));

  appendDocumentToList(
    fileName,
    fileURL,
    snapshot.length,
    doneCount,
    timeLabel,
  );

  showToast(`📥 Saved ${snapshot.length} tasks to Documents!`);

  showDocuments();
}

function appendDocumentToList(
  fileName,
  fileURL,
  taskCount,
  doneCount,
  timeLabel,
) {
  const docEmptyState = document.getElementById("emptyDocsState");

  if (docEmptyState) {
    docEmptyState.style.display = "none";
  }

  const docItem = document.createElement("div");

  docItem.className = "doc-item";

  docItem.innerHTML = `
    <div class="doc-icon">📄</div>
    const rawStatus = task.status || 'pending';
    const status = rawStatus === 'inprogress' ? 'IN PROGRESS' : rawStatus.toUpperCase();
    const printLine = `${index + 1}. [${status}] (${task.priority} Priority) [${task.category}] - ${task.text}`;
  snapshot.forEach((task, index) => {
    if (verticalCursor > 270) { doc.addPage(); verticalCursor = 20; }
    const status = task.completed ? "[DONE]" : "[PENDING]";
    const printLine = `${index + 1}. ${status} (${task.category}) — ${task.text}`;
    doc.text(printLine, 20, verticalCursor);
    verticalCursor += 10;
  tasks.forEach((task, i) => {
    if (y > 270) { doc.addPage(); y = 20; }
    const rawStatus = task.status || "pending";
    const status = rawStatus === "inprogress" ? "IN PROGRESS" : rawStatus.toUpperCase();
    doc.text(`${i + 1}. [${status}] [${task.priority || "Medium"}] [${task.category || "General"}] - ${task.title}`, 20, y);
    y += 10;
  });

  const fileName = `TodoList_${Date.now()}.pdf`;
  const pdfBlob = doc.output("blob");
  const fileURL = URL.createObjectURL(pdfBlob);

  const docEntry = {
    id: Date.now(),
    name: fileName,
    url: fileURL,
    total: tasks.length,
    completed: completedCount,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: new Date().toLocaleDateString(),
  };

  savedDocs.unshift(docEntry);
  const meta = savedDocs.map(({ url, ...rest }) => rest);
  localStorage.setItem("kanban-saved-docs-meta", JSON.stringify(meta));
  showToast("📥 PDF saved! Go to Documents to download.", "success");
  renderSavedDocuments();
}

// ─── Render saved documents ────────────────────────────────────────────────
function renderSavedDocuments() {
  const docEmptyState = document.getElementById("emptyDocsState");
  if (docEmptyState) docEmptyState.style.display = "none";

  if (documentsList.children.length === 0) {
    const docEmptyState = document.getElementById("emptyDocsState");
  documentsList.innerHTML = '';
  // Bug 3 fix: use <li> instead of <div> — <ul> must only contain <li> children
  // Bug 2 fix: build entirely with safe DOM APIs — no innerHTML
  const docItem = document.createElement("li");
  docItem.className = "doc-item";

  const iconDiv = document.createElement("div");
  iconDiv.className = "doc-icon";
  iconDiv.textContent = "📄";

  const infoDiv = document.createElement("div");
  infoDiv.className = "doc-info";

  const nameDiv = document.createElement("div");
  nameDiv.className = "doc-name";
  nameDiv.textContent = fileName; // safe: textContent never parses HTML

  const metaDiv = document.createElement("div");
  metaDiv.className = "doc-meta";

  const dateSpan = document.createElement("span");
  dateSpan.className = "doc-date";
  dateSpan.textContent = `${new Date().toLocaleDateString()} ${timeLabel || ''}`;

  const countSpan = document.createElement("span");
  countSpan.className = "doc-task-count";
  countSpan.textContent = `${taskCount} task${taskCount !== 1 ? 's' : ''} · ${doneCount} done`;

  metaDiv.appendChild(dateSpan);
  metaDiv.appendChild(countSpan);
  infoDiv.appendChild(nameDiv);
  infoDiv.appendChild(metaDiv);

  const actionsDiv = document.createElement("div");
  actionsDiv.className = "doc-actions";

  const viewBtn = document.createElement("button");
  viewBtn.className = "doc-btn";
  viewBtn.textContent = "View";
  viewBtn.addEventListener("click", () => window.open(fileURL, "_blank"));

  const dlLink = document.createElement("a");
  dlLink.className = "doc-btn";
  dlLink.href = fileURL;
  dlLink.download = fileName; // safe attribute assignment
  dlLink.textContent = "Download";
  dlLink.style.cssText = "text-decoration:none;display:inline-block;text-align:center;";

  const delBtn = document.createElement("button");
  delBtn.className = "doc-btn del";
  delBtn.textContent = "Delete";
  delBtn.addEventListener("click", () => removeDocumentItem(delBtn));

  actionsDiv.appendChild(viewBtn);
  actionsDiv.appendChild(dlLink);
  actionsDiv.appendChild(delBtn);

  docItem.appendChild(iconDiv);
  docItem.appendChild(infoDiv);
  docItem.appendChild(actionsDiv);

  // PREPEND so newest document is always at the TOP — prevents users from
  // accidentally viewing an older document and thinking tasks are missing.
  documentsList.prepend(docItem);
}
  const docsList = document.querySelector(".documents-list");
  if (!docsList) return;
  docsList.innerHTML = "";

  if (savedDocs.length === 0) {
    if (docEmptyState) docEmptyState.style.display = "flex";
  } else {
    if (docEmptyState) docEmptyState.style.display = "none";
    savedDocs.forEach(docEntry => {
      const item = document.createElement("li");
      item.className = "doc-item";
      const hasUrl = !!docEntry.url;
      item.innerHTML = `
        <div class="doc-info">
          <div class="doc-name">📄 ${docEntry.name}</div>
          <div class="doc-meta">
            <span class="doc-date">${docEntry.date} ${docEntry.time}</span>
            <span class="doc-task-count">${docEntry.total} tasks · ${docEntry.completed} completed</span>
          </div>
          ${!hasUrl ? '<div class="doc-stale">⚠️ File unavailable after reload — re-export to download again.</div>' : ""}
        </div>
        <div class="doc-actions">
          ${hasUrl ? `<button class="doc-btn" onclick="window.open('${docEntry.url}', '_blank')">View</button>` : ""}
          ${hasUrl ? `<a class="doc-btn" href="${docEntry.url}" download="${docEntry.name}">Download</a>` : ""}
          <button class="doc-btn doc-btn-del" onclick="deleteDocEntry('${docEntry.id}')">Delete</button>
        </div>
      `;
      docsList.appendChild(item);
    });
  }
}

window.deleteDocEntry = function (id) {
  savedDocs = savedDocs.filter(d => String(d.id) !== String(id));
  const meta = savedDocs.map(({ url, ...rest }) => rest);
  localStorage.setItem("kanban-saved-docs-meta", JSON.stringify(meta));
  renderSavedDocuments();
  showToast("🗑️ Document removed!", "info");
};

// ─── Sidebar button wiring ─────────────────────────────────────────────────
document.getElementById("savepdf").addEventListener("click", saveAsPDF);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    addTask();
  }
});

const savePdfBtn = document.getElementById("savepdf");

const savePdfBtn = document.getElementById("savepdf");
    addTask();
  }
document.getElementById("cleardone").addEventListener("click", () => {
  document.getElementById("clearModal").style.display = "flex";
});

document.getElementById("modalCancelBtn").addEventListener("click", () => {
  document.getElementById("clearModal").style.display = "none";
});

document.getElementById("modalConfirmBtn").addEventListener("click", () => {
  tasks = [];
  saveTasks();
  renderKanban();
  document.getElementById("clearModal").style.display = "none";
  showToast("🧹 Workspace cleared!", "info");
});

document.getElementById("clearModal").addEventListener("click", e => {
  if (e.target === document.getElementById("clearModal"))
    document.getElementById("clearModal").style.display = "none";
});

const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const clearCompletedModal = document.getElementById("clearCompletedModal");

clearCompletedBtn.addEventListener("click", () => {
  const completedCount = tasks.filter(t => t.status === "completed").length;
  if (completedCount === 0) { showToast("✨ No completed tasks to clear!", "info"); return; }
  clearCompletedModal.style.display = "flex";
});

document.getElementById("completedModalCancelBtn").addEventListener("click", () => {
  clearCompletedModal.style.display = "none";
});

document.getElementById("completedModalConfirmBtn").addEventListener("click", () => {
  tasks = tasks.filter(t => t.status !== "completed");
  saveTasks();
  renderKanban();
  clearCompletedModal.style.display = "none";
  showToast("✅ Completed tasks cleared!", "success");
});

clearCompletedModal.addEventListener("click", e => {
  if (e.target === clearCompletedModal) clearCompletedModal.style.display = "none";
});

try {
  const savedTheme = localStorage.getItem("todo-theme");

  applyTheme(savedTheme || "theme1");
} catch (e) {
  applyTheme("theme1");
}

// TASK SEARCH FUNCTIONALITY - Search tasks in real-time
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    renderTasks();
  });
}

// TASK FILTER FUNCTIONALITY - Uses existing render system
function applyTaskFilter(type) {
  if (type === "all") {
    currentFilter = "all";
  } else if (type === "active") {
    currentFilter = "active";
  } else if (type === "completed") {
    currentFilter = "completed";
  }
  renderTasks();
}

// TASK ANALYTICS DOUGHNUT CHART - Displays completed vs pending tasks
const ctx = document.getElementById("taskChart");
let taskChart = null;

function updateTaskChart() {
  if (!ctx) return;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;
  const totalTasks = tasks.length;
  const percentage =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  document.getElementById("completionPercent").innerText = `${percentage}%`;
  document.getElementById("doneCount").innerText = completedTasks;
  document.getElementById("activeCount").innerText = pendingTasks;
  const statusBadge = document.getElementById("statusBadge");
  if (completedTasks === totalTasks && totalTasks > 0) {
    statusBadge.textContent = "All done ✨";
  } else {
    statusBadge.textContent = "In Progress";
  }
  if (taskChart) {
    taskChart.destroy();
  }
  taskChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [
            totalTasks === 0 ? 0 : completedTasks,
            totalTasks === 0 ? 1 : pendingTasks,
          ],
          backgroundColor: ["#62dbc9", "#b06cff"],
          borderWidth: 0,
          borderRadius: 40,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "78%",
      plugins: { legend: { display: false } },
    },
  });
}

renderTasks();
updateTaskChart();
applyTheme("theme1");
  const savedTasks = localStorage.getItem("todo-tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }

  // Save PDF Button
  const savePdfBtnInit = document.getElementById('savepdf');
  if (savePdfBtnInit) {
    savePdfBtnInit.addEventListener('click', saveAsPDF);
  }
  const saved = localStorage.getItem('todo-theme');
  applyTheme(saved || 'theme1'); // fallback to theme1 if nothing saved
} catch (e) {
  applyTheme('theme1');
// ─── Theme switching ───────────────────────────────────────────────────────
const themeButtons = document.querySelectorAll(".theme-btn");

function applyTheme(theme) {
  document.body.classList.remove("theme1", "theme2", "theme3", "theme4", "theme5");
  document.body.classList.add(theme);
  themeButtons.forEach(btn =>
    btn.classList.toggle("active", btn.dataset.theme === theme)
  );
}

themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
    localStorage.setItem("selectedTheme", theme);
    showToast("🎨 Theme changed!", "success");
  });
});

// ─── Init ─────────────────────────────────────────────────────────────────
function init() {
  const savedTheme = localStorage.getItem("selectedTheme") || "theme1";
  applyTheme(savedTheme);
  renderKanban();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
