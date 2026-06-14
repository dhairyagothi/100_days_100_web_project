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

// 1. DOM Element References (match HTML ids/classes)
const taskInput = document.getElementById("task");
const taskTypeSelect = document.getElementById("task-category");
const taskList = document.getElementById("notes-container");
const emptyState = document.getElementById("emptyState");
const documentsList = document.querySelector('.documents-list');

// Progress / stats elements present in HTML
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Data State — loaded from localStorage on startup (Bug 1 fix: persistence)
let tasks = [];
try {
  const stored = localStorage.getItem('todo-tasks');
  if (stored) tasks = JSON.parse(stored);
} catch (e) {
  tasks = [];
}
let currentFilter = "all";

// Persist tasks to localStorage on every mutation
function saveTasks() {
  try { localStorage.setItem('todo-tasks', JSON.stringify(tasks)); } catch (e) { }
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

  if (!text) {
    showToast("⚠️ Please enter a task description!");
    return;
  }

  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const selectedCatOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const catColor = (selectedCatOption && selectedCatOption.getAttribute('data-color')) || '#7c63ff';
  // Bug 4 fix: require a category selection; show a clear warning if omitted
  if (!category) {
    showToast("⚠️ Please select a category!");
    taskTypeSelect.focus();
    return;
  }

  // Find category color from the dropdown configuration (fallback)
  const selectedOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const color = (selectedOption && selectedOption.getAttribute && selectedOption.getAttribute("data-color")) || "#ffb86b";

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

  tasks.push(newTask);
  saveTasks(); // Bug 1 fix: persist after add
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
  saveTasks(); // Bug 1 fix: persist after toggle
  renderTasks();
}

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
  } else {
    saveTasks(); // Bug 1 fix: persist after clear
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

  // Toggle Visibility of Empty State Element
  if (filteredTasks.length === 0) {
    if (emptyState) {
      taskList.appendChild(emptyState);
      emptyState.style.display = "flex";
    }
  } else {
    if (emptyState) emptyState.style.display = "none";

    filteredTasks.forEach((task, idx) => {
      // Bug 3 fix: use <li> instead of <div> so <ul> contains valid children
      const card = document.createElement("li");
      card.className = "notes" + (task.completed ? " completed" : "");
      card.setAttribute("data-id", task.id);
      card.style.setProperty("--i", idx);

      // Bug 2 fix: build the card entirely with safe DOM APIs — no innerHTML
    const noteRow = document.createElement("div");
    noteRow.className = "note-row";

    let textarea;
    if (task.completed) {
      textarea = document.createElement("div");
      textarea.className = "note-text note-text-done";
      textarea.textContent = task.text;
    } else {
      textarea = document.createElement("textarea");
      textarea.className = "note-text";
      textarea.value = task.text;
      textarea.addEventListener("change", () => updateTaskText(task.id, textarea.value));
    }

    // ✅ Done badge appears right below the text when completed
    if (task.completed) {
      const doneBadge = document.createElement("span");
      doneBadge.className = "done-badge";
      doneBadge.textContent = "✅ Done";
      noteRow.appendChild(textarea);
      noteRow.appendChild(doneBadge);
    } else {
      noteRow.appendChild(textarea);
    }

      const noteActions = document.createElement("div");
      noteActions.className = "note-actions";

      const badge = document.createElement("div");
      badge.className = "category-badge";
      if (task.completed) {
        badge.textContent = task.category;
        badge.style.opacity = "0.8";
      } else {
        badge.textContent = task.category;
      }

      const btnGroup = document.createElement("div");

      const checkBtn = document.createElement("button");
      checkBtn.className = "note-check";
      checkBtn.textContent = task.completed ? "↩" : "✔";
      checkBtn.title = task.completed ? "Mark as Pending" : "Mark as Completed";
      checkBtn.addEventListener("click", () => toggleTask(task.id));

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "note-delete";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(task.id));

      btnGroup.appendChild(checkBtn);
      btnGroup.appendChild(deleteBtn);
      noteActions.appendChild(badge);
      noteActions.appendChild(btnGroup);
      noteRow.appendChild(noteActions);
      card.appendChild(noteRow);

      taskList.appendChild(card);
    });
  }

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
  });
  saveTasks(); // Bug 1 fix: persist inline edits
}

function updateMetrics() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Update progress UI (matches HTML)
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${done} / ${total} done`;

  // Show ‘Clear Done’ button only when at least one task is completed
  const clearDoneBtn = document.getElementById('cleardone');
  if (clearDoneBtn) clearDoneBtn.hidden = done === 0;
}

// 4. Tab Navigation System
function showHome() {
  document.getElementById("nav-home").classList.add("active");
  document.getElementById("nav-documents").classList.remove("active");
  document.getElementById("home-tab").removeAttribute("hidden");
  document.getElementById("home-tab").style.display = "block";
  document.getElementById("documents-tab").setAttribute("hidden", "");
  document.getElementById("documents-tab").style.display = "none";
}

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

  document.getElementById("nav-home").classList.remove("active");
  document.getElementById("nav-documents").classList.add("active");
  document.getElementById("home-tab").setAttribute("hidden", "");
  document.getElementById("home-tab").style.display = "none";
  document.getElementById("documents-tab").removeAttribute("hidden");
  document.getElementById("documents-tab").style.display = "block";
}

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

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // jsPDF v2.x API: doc.text(text, x, y)
  doc.setFont("Helvetica", "bold");
  doc.setFontSize(22);
  doc.text("TaskFlow Agenda Report", 20, 24);

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
  doc.line(20, 42, 190, 42);

  let verticalCursor = 52;
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
  });

  const timeLabel = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const fileURL = URL.createObjectURL(doc.output("blob"));

  appendDocumentToList(fileName, fileURL, snapshot.length, doneCount, timeLabel);
  showToast(`📥 Saved ${snapshot.length} task${snapshot.length !== 1 ? 's' : ''} to Documents!`);

  // Auto-navigate to Documents tab so the user sees the new entry
  showDocuments();
}

function appendDocumentToList(fileName, fileURL, taskCount, doneCount, timeLabel) {
  // Hide the empty-state placeholder (it is a sibling of the ul, not inside it)
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

function removeDocumentItem(button) {
  button.closest(".doc-item").remove();
  if (documentsList.children.length === 0) {
    // Restore the empty-state placeholder when all docs are deleted
    const docEmptyState = document.getElementById("emptyDocsState");
    if (docEmptyState) docEmptyState.style.display = "flex";
  }
}

// 7. Toast Alerts Notification System
function showToast(message) {
  const toast = document.getElementById("pdfMessage");
  if (!toast) {
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
});
// Wire up Save as PDF button click listener
const savePdfBtn = document.getElementById('savepdf');
if (savePdfBtn) {
  savePdfBtn.addEventListener('click', () => saveAsPDF());
}

// Wire up Clear Done button click listener
const clearDoneBtn = document.getElementById('cleardone');
if (clearDoneBtn) {
  clearDoneBtn.addEventListener('click', function () {
    if (typeof clearDone === 'function') clearDone();
  });
}

// Wire up filter bar buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typeof filterTasks === 'function') filterTasks(btn, btn.dataset.filter);
  });
});

// --- Workspace Skin (Theme Switcher) ---
(function initTheme() {
  // Restore persisted theme on load
  const saved = localStorage.getItem('todo-workspace-theme');
  if (saved) document.body.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const theme = btn.getAttribute('data-theme');
      if (theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('todo-workspace-theme', theme);
      }
    });
  });
})();

// --- Page Initialisation ---
// Set Home tab as active and apply default/saved theme on load
showHome();

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
}

// Render tasks loaded from localStorage so they appear immediately on refresh
renderTasks();
