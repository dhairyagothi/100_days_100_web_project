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

    const savedStats = localStorage.getItem('todo-stats');
    if (savedStats) productivityStats = JSON.parse(savedStats);
    productivityStats.totalTasksCreated = Math.max(productivityStats.totalTasksCreated, tasks.length);

    const savedStreak = localStorage.getItem('todo-streak');
    if (savedStreak) streakData = JSON.parse(savedStreak);

    const savedBadgesData = localStorage.getItem('todo-badges');
    if (savedBadgesData) badges = JSON.parse(savedBadgesData);
  } catch (e) {
    console.error('Error loading from storage:', e);
  }
}

// New Toast Notifications
function showNewToast(message, type = 'info', icon = 'ℹ️') {
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;

  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close notification">&times;</button>
  `;

  toastContainerNew.appendChild(toast);

  toast.querySelector('.toast-close').addEventListener('click', () => {
    removeNewToast(toast);
  });

  setTimeout(() => {
    removeNewToast(toast);
  }, 4000);
}

function removeNewToast(toast) {
  toast.style.animation = 'toastSlideIn 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28) reverse forwards';
  setTimeout(() => {
    toast.remove();
  }, 400);
}

// Streak Management
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function updateStreak() {
  const today = getTodayString();
  if (streakData.lastActiveDate === today) {
    renderStreak();
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  if (streakData.lastActiveDate === yesterdayString) {
    streakData.lastActiveDate = today;
  } else {
    if (streakData.lastActiveDate !== null && streakData.lastActiveDate !== today) {
      streakData.currentStreak = 0;
      streakData.lastActiveDate = today;
    }
  }

  saveStreak();
  renderStreak();
}

function incrementStreak() {
  const today = getTodayString();
  if (streakData.lastStreakCheck !== today) {
    streakData.currentStreak += 1;
    streakData.lastActiveDate = today;
    streakData.lastStreakCheck = today;

    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }

    saveStreak();
    renderStreak();

    if (streakData.currentStreak >= 7 && !badges.sevenDayStreak.unlocked) {
      unlockBadge('sevenDayStreak');
    }
  }
}

function renderStreak() {
  if (currentStreakEl) currentStreakEl.textContent = streakData.currentStreak;
  if (longestStreakEl) longestStreakEl.textContent = streakData.longestStreak;
  const dashCurrentStreak = document.getElementById('dashboardCurrentStreak');
  const dashLongestStreak = document.getElementById('dashboardLongestStreak');
  if (dashCurrentStreak) dashCurrentStreak.textContent = streakData.currentStreak;
  if (dashLongestStreak) dashLongestStreak.textContent = streakData.longestStreak;
}

// Badge Management
function unlockBadge(badgeKey) {
  if (!badges[badgeKey].unlocked) {
    badges[badgeKey].unlocked = true;
    saveBadges();
    renderBadges();
    showNewToast(`🏆 Achievement Unlocked: ${badges[badgeKey].name}`, 'success', '🏆');
  }
}

function renderBadges() {
  let unlocked = 0;
  for (let key in badges) {
    if (badges[key].unlocked) unlocked++;
  }
  if (unlockedBadgesEl) unlockedBadgesEl.textContent = unlocked;
  renderAchievementsPage();
}

function renderAchievementsPage() {
  const container = document.getElementById('achievementsGrid');
  if (!container) return;
  container.innerHTML = '';

  Object.entries(badges).forEach(([key, badge]) => {
    const card = document.createElement('div');
    card.className = `achievement-card ${badge.unlocked ? 'unlocked' : ''}`;
    card.innerHTML = `
      <div class="achievement-icon">${badge.icon}</div>
      <div class="achievement-info">
        <h3>${badge.name}</h3>
        <p>${badge.description}</p>
        <span class="achievement-status">${badge.unlocked ? 'Unlocked' : 'Locked'}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// Progress Management
function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'completed').length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  productivityStats.totalTasksCompleted = done;
  productivityStats.completionPercentage = pct;
  saveStats();

  if (progressPercent) progressPercent.textContent = `${pct}%`;
  if (progressDetails) progressDetails.textContent = `${done}/${total} tasks`;
  if (totalTasksEl) totalTasksEl.textContent = total;

  if (heroProgressFill) heroProgressFill.style.width = `${pct}%`;
  if (heroProgressText) heroProgressText.textContent = `${done}/${total} done`;

  if (progressRingFill) {
    const circumference = 251.2;
    const offset = circumference - (pct / 100) * circumference;
    progressRingFill.style.strokeDashoffset = offset;
  }

  const dashProgress = document.querySelector('.dashboard-progress-fill');
  if (dashProgress) {
    const dashCircumference = 314;
    const dashOffset = dashCircumference - (pct / 100) * dashCircumference;
    dashProgress.style.strokeDashoffset = dashOffset;
  }
  const dashPct = document.getElementById('dashboardProgressPercent');
  if (dashPct) dashPct.textContent = `${pct}%`;
  const dashDetails = document.getElementById('dashboardProgressText');
  if (dashDetails) dashDetails.textContent = `${done}/${total} tasks completed`;

  // Update dashboard stats grid
  const dashCreated = document.getElementById('dashboardTotalCreated');
  if (dashCreated) dashCreated.textContent = productivityStats.totalTasksCreated;
  const dashCompleted = document.getElementById('dashboardTotalCompleted');
  if (dashCompleted) dashCompleted.textContent = done;
  const dashPending = document.getElementById('dashboardPending');
  if (dashPending) dashPending.textContent = tasks.filter(t => t.status === 'pending').length;
  const dashInProgress = document.getElementById('dashboardInProgress');
  if (dashInProgress) dashInProgress.textContent = tasks.filter(t => t.status === 'inprogress').length;

  // Update statistics page
  const statsCompletion = document.getElementById('statisticsCompletion');
  if (statsCompletion) statsCompletion.textContent = `${pct}%`;
  const statsCategory = document.getElementById('statisticsCategory');
  if (statsCategory) {
    const categoryCount = {};
    tasks.forEach(t => {
      categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
    });
    const mostUsed = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
    statsCategory.textContent = mostUsed ? `${mostUsed[0]} (${mostUsed[1]})` : '-';
  }
  const statsPriority = document.getElementById('statisticsPriority');
  if (statsPriority) {
    const priorityCount = {};
    tasks.forEach(t => {
      priorityCount[t.priority] = (priorityCount[t.priority] || 0) + 1;
    });
    const mostUsed = Object.entries(priorityCount).sort((a, b) => b[1] - a[1])[0];
    statsPriority.textContent = mostUsed ? `${mostUsed[0]} (${mostUsed[1]})` : '-';
  }
}

// Core Task Operations
function addTask() {
  const text = taskInput.value.trim();
  const category = taskTypeSelect.value;
  const priority = taskPrioritySelect.value;

  if (!text) {
    showNewToast('⚠️ Please enter a task description!', 'warning', '⚠️');
    return;
  }

  const selectedCatOption = taskTypeSelect.options[taskTypeSelect.selectedIndex];
  const catColor = (selectedCatOption && selectedCatOption.getAttribute('data-color')) || '#7c63ff';

  const selectedPriOption = taskPrioritySelect.options[taskPrioritySelect.selectedIndex];
  const priColor = (selectedPriOption && selectedPriOption.getAttribute('data-color')) || '#3b82f6';

  const newTask = {
    id: Date.now(),
    text: text,
    category: category || 'General',
    categoryColor: catColor,
    priority: priority || 'Normal',
    priorityColor: priColor,
    status: 'pending',
    completed: false,
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
        completed: isCompleted,
        status: isCompleted ? 'completed' : 'pending',
      };
    }
    return task;
  });

  saveTasks();
  renderTasks();
  const task = tasks.find((t) => t.id === id);
  showNewToast(
    task.status === 'completed' ? '✅ Task marked as completed!' : '📋 Task marked as pending!',
    'success',
    task.status === 'completed' ? '✅' : '📋'
  );
}

function toggleInProgress(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const isInProgress = task.status !== 'inprogress';
      return {
        ...task,
        completed: false,
        status: isInProgress ? 'inprogress' : 'pending',
      };
    }
    return task;
  });
  saveTasks();
  renderTasks();
  const task = tasks.find((t) => t.id === id);
  showNewToast(
    task.status === 'inprogress' ? '⚡ Task marked as in-progress!' : '📋 Task marked as pending!',
    'info',
    '⚡'
  );
}

function deleteTask(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.animation = 'fadeOut 0.2s ease forwards';
    setTimeout(() => {
      tasks = tasks.filter((task) => task.id !== id);
      saveTasks();
      renderTasks();
      showNewToast('🧹 Task deleted successfully!', 'info', '🧹');
    }, 200);
  }
}

function updateTaskText(id, newText) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, text: newText.trim() || 'Untitled Task' };
    }
    return task;
  });
  saveTasks();
}

// Status Filtering
function filterByStatus(status) {
  currentStatusFilter = status;

  document.querySelectorAll('.status-tab').forEach((tab) => {
    if (tab.getAttribute('data-status') === status) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  renderTasks();
}

// Render Tasks Grid
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    currentStatusFilter = 'all';
    emptyState.style.display = 'flex';
    statusTabsContainer.style.display = 'none';
    taskList.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    statusTabsContainer.style.display = 'inline-flex';
    taskList.style.display = 'grid';

    const filteredTasks = tasks.filter((task) => {
      if (currentStatusFilter === 'all') return true;
      return task.status === currentStatusFilter;
    });

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
          <div class="empty-icon">📂</div>
          <p class="empty-title">No tasks in this view</p>
          <p class="empty-desc">Switch tabs or add a task to get started!</p>
        </div>
      `;
    } else {
      filteredTasks.forEach((task) => {
        const card = document.createElement('li');
        card.className = 'notes' + (task.status === 'completed' ? ' completed' : '');
        card.setAttribute('data-id', task.id);

        const isCompleted = task.status === 'completed';
        const isInProgress = task.status === 'inprogress';

        card.innerHTML = `
          <div class="note-row">
            <textarea class="note-text" oninput="updateTaskText(${task.id}, this.value)" onblur="updateTaskText(${task.id}, this.value)" placeholder="Edit task...">${task.text}</textarea>
            <div class="note-badges">
              <span class="category-badge" style="border-color: ${task.categoryColor}; color: ${task.categoryColor}; background: ${task.categoryColor}22;">
                📂 ${task.category}
              </span>
              <span class="priority-badge" style="border-color: ${task.priorityColor}; color: ${task.priorityColor}; background: ${task.priorityColor}22;">
                ⭐ ${task.priority}
              </span>
            </div>
            <div class="note-actions">
              <button type="button" class="note-check" onclick="toggleInProgress(${task.id})" title="Toggle In Progress" style="background: ${isInProgress ? 'rgba(79,141,255,0.2)' : ''}; color: ${isInProgress ? '#4f8dff' : ''};">
                ⚡
              </button>
              <button type="button" class="note-check" onclick="toggleComplete(${task.id})" title="Toggle Complete" style="background: ${isCompleted ? 'rgba(20,184,166,0.2)' : ''}; color: ${isCompleted ? '#14b8a6' : ''};">
                ${isCompleted ? '↩️' : '✅'}
              </button>
              <button type="button" class="note-delete" onclick="deleteTask(${task.id})" title="Delete Task">
                🗑️
              </button>
            </div>
          </div>
        `;

        taskList.appendChild(card);
      });
    }
  }

  updateMetrics();
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

// Tab Switching
function showSection(section) {
  // Hide all sections
  document.querySelectorAll('section').forEach(el => {
    el.classList.remove('active-section');
    el.classList.add('inactive-section');
  });

  // Update progress bar
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.innerText = `${done} / ${total} done`;

  // Show ‘Clear Done’ button only when at least one task is completed
  const clearDoneBtn = document.getElementById('cleardone');
  if (clearDoneBtn) clearDoneBtn.hidden = done === 0;
}

function showHome() {
  showSection('home');
}

function showDocuments() {
  showSection('documents');
  renderSavedDocuments();
}



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

  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = today.getDate() === i && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
    const taskDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    html += `
      <div class="calendar-day ${isToday ? 'today' : ''}">
        ${i}
        <div class="calendar-day-dots"></div>
      </div>
    `;
  }

  const remaining = 42 - (startIndex + daysInMonth);
  for (let i = 1; i <= remaining; i++) {
    html += `<div class="calendar-day other-month">${i}</div>`;
  }

  html += '</div>';
  container.innerHTML = html;
}

function changeMonth(diff) {
  currentMonth += diff;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
}

// PDF Exporter & Snapshots History
function saveAsPDF() {
  if (tasks.length === 0) {
    showNewToast('❌ Cannot export empty list!', 'error', '❌');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('TaskFlow Agenda Report', 20, 24);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 32);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  doc.text(
    `Tasks: ${tasks.length} total  |  ${completedCount} completed  |  ${tasks.length - completedCount} pending/in progress`,
    20,
    38
  );
  doc.line(20, 42, 190, 42);

  let verticalCursor = 52;
  doc.setFontSize(12);

  tasks.forEach((task, index) => {
    if (verticalCursor > 270) {
      doc.addPage();
      verticalCursor = 20;
    }
    const rawStatus = task.status || 'pending';
    const status = rawStatus === 'inprogress' ? 'IN PROGRESS' : rawStatus.toUpperCase();
    const printLine = `${index + 1}. [${status}] (${task.priority} Priority) [${task.category}] - ${task.text}`;
    doc.text(printLine, 20, verticalCursor);
    verticalCursor += 10;
  });

  const fileName = `TaskFlow_${Date.now()}.pdf`;
  const pdfOutput = doc.output('blob');
  const fileURL = URL.createObjectURL(pdfOutput);

  const docItem = {
    id: Date.now(),
    name: fileName,
    url: fileURL,
    total: tasks.length,
    completed: completedCount,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toLocaleDateString(),
  };

  savedDocs.unshift(docItem);
  saveDocuments();
  showNewToast('📥 PDF exported! Check documents tab to download!', 'success', '📥');
}

function renderSavedDocuments() {
  const docEmptyState = document.getElementById('emptyDocsState');
  if (!documentsList) return;

  documentsList.innerHTML = '';

  if (savedDocs.length === 0) {
    if (docEmptyState) docEmptyState.style.display = 'flex';
  } else {
    if (docEmptyState) docEmptyState.style.display = 'none';
    savedDocs.forEach((doc) => {
      const docItem = document.createElement('li');
      docItem.className = 'doc-item';
      const hasUrl = !!doc.url;
      docItem.innerHTML = `
        <div class="doc-info">
          <div class="doc-name">${doc.name}</div>
          <div class="doc-meta">
            <span class="doc-date">${doc.date} ${doc.time}</span>
            <span class="doc-task-count">${doc.total} tasks · ${doc.completed} completed</span>
          </div>
          ${!hasUrl ? '<div class="doc-stale">⚠️ File unavailable after page reload — re-export to download again!</div>' : ''}
        </div>
        <div class="doc-actions">
          ${hasUrl ? `<button class="doc-btn" onclick="window.open('${doc.url}', '_blank')">View</button>` : ''}
          ${hasUrl ? `<a class="doc-btn" href="${doc.url}" download="${doc.name}" style="text-decoration: none; display: inline-block; text-align: center; line-height: 40px; padding: 0 16px;">Download</a>` : ''}
          <button class="doc-btn del" onclick="deleteDocument('${doc.id}')">Delete</button>
        </div>
      `;
      documentsList.appendChild(docItem);
    });
  }
}

function deleteDocument(id) {
  savedDocs = savedDocs.filter((doc) => String(doc.id) !== String(id));
  saveDocuments();
  renderSavedDocuments();
  showNewToast('🧹 Snapshot record cleared!', 'info', '🧹');
}

// Original Toast Notifications (Keep for compatibility)
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `pdf-message show`;

  setTimeout(() => {
    toast.classList.remove('show');
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

// Wire up Clear Done button click listener
const clearDoneBtn = document.getElementById('cleardone');
if (clearDoneBtn) {
  clearDoneBtn.addEventListener('click', clearDone);
}

// Wire up filter bar buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    filterTasks(btn, btn.dataset.filter);
  });
});

// --- Page Initialisation ---
// Set Home tab as active and apply default/saved theme on load
showHome();

try {
  const savedTasks = localStorage.getItem("todo-tasks");
  if (savedTasks) {
    tasks = JSON.parse(savedTasks);
  }

  // Save PDF Button
  const savePdfBtn = document.getElementById('savepdf');
  if (savePdfBtn) {
    savePdfBtn.addEventListener('click', saveAsPDF);
  }
}

document.addEventListener('DOMContentLoaded', init);
