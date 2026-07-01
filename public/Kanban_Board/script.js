/* =====================================
   STORAGE
===================================== */
const STORAGE_KEY = 'advancedKanbanData';

let appData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
  activeBoardId: 1,
  boards: [
    {
      id: 1,
      name: 'My Board',
      tasks: [],
    },
  ],
};

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
}

/* =====================================
   DOM ELEMENTS
===================================== */
const boardList = document.getElementById('boardList');
const currentBoardTitle = document.getElementById('currentBoardTitle');
const addBoardBtn = document.getElementById('addBoardBtn');
const renameBoardBtn = document.getElementById('renameBoardBtn');
const deleteBoardBtn = document.getElementById('deleteBoardBtn');

/* Sidebar */
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

/* Search */
const searchInput = document.getElementById('searchInput');

/* Analytics */
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const progressTasksEl = document.getElementById('progressTasks');
const pendingTasksEl = document.getElementById('pendingTasks');
const completionRateEl = document.getElementById('completionRate');

/* Modals */
const taskModal = document.getElementById('taskModal');
const taskDetailsModal = document.getElementById('taskDetailsModal');

/* Task Inputs */
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const addSubtaskBtn = document.getElementById('addSubtaskBtn');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const subtaskContainer = document.getElementById('subtaskContainer');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');

/* Toast */
const toastContainer = document.getElementById('toastContainer');

/* =====================================
   SIDEBAR TOGGLE (Mobile)
===================================== */

// Create overlay element
const sidebarOverlay = document.createElement('div');
sidebarOverlay.className = 'sidebar-overlay';
document.body.appendChild(sidebarOverlay);

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
});

function closeSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('active');
}

/* =====================================
   TOAST NOTIFICATIONS
===================================== */
function showToast(message, type = 'info') {
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* =====================================
   CONFETTI EFFECT
===================================== */
function triggerConfetti(x, y) {
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#a855f7', '#ec4899'];
  const shapes = ['■', '●', '▲', '◆', '★'];

  for (let i = 0; i < 25; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
    piece.style.left = `${x + (Math.random() - 0.5) * 100}px`;
    piece.style.top = `${y}px`;
    piece.style.color = colors[Math.floor(Math.random() * colors.length)];
    piece.style.fontSize = `${8 + Math.random() * 12}px`;
    piece.style.animationDuration = `${1 + Math.random() * 1}s`;
    piece.style.animationDelay = `${Math.random() * 0.3}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2000);
  }
}

/* =====================================
   ACTIVE BOARD
===================================== */
function getActiveBoard() {
  return appData.boards.find((board) => board.id === appData.activeBoardId);
}

/* =====================================
   BOARD RENDERING
===================================== */
function renderBoards() {
  boardList.innerHTML = '';

  appData.boards.forEach((board) => {
    const taskCount = board.tasks.length;
    const item = document.createElement('div');
    item.className = 'board-item';

    if (board.id === appData.activeBoardId) {
      item.classList.add('active');
    }

    item.innerHTML = `
      <span>${board.name}</span>
    `;

    item.addEventListener('click', () => {
      appData.activeBoardId = board.id;
      saveData();
      renderBoards();
      renderTasks();
      updateDashboard();
      closeSidebar();
    });

    boardList.appendChild(item);
  });

  const activeBoard = getActiveBoard();
  if (activeBoard) {
    currentBoardTitle.textContent = activeBoard.name;
  }
}

/* =====================================
   ADD BOARD
===================================== */
addBoardBtn.addEventListener('click', () => {
  const boardName = prompt('Enter board name:');
  if (!boardName || !boardName.trim()) return;

  const trimmedName = boardName.trim();
  const duplicateBoard = appData.boards.some(
    (board) => board.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (duplicateBoard) {
    showToast('A board with this name already exists.', 'warning');
    return;
  }

  const newBoard = {
    id: Date.now(),
    name: trimmedName,
    tasks: [],
  };

  appData.boards.push(newBoard);
  appData.activeBoardId = newBoard.id;
  saveData();
  renderBoards();
  renderTasks();
  updateDashboard();
  showToast(`Board "${trimmedName}" created!`, 'success');
});

/* =====================================
   RENAME BOARD
===================================== */
renameBoardBtn.addEventListener('click', () => {
  const board = getActiveBoard();
  const newName = prompt('Rename board:', board.name);
  if (!newName || !newName.trim()) return;

  const trimmedName = newName.trim();
  const duplicateBoard = appData.boards.some(
    (b) => b.id !== board.id && b.name.toLowerCase() === trimmedName.toLowerCase()
  );

  if (duplicateBoard) {
    showToast('A board with this name already exists.', 'warning');
    return;
  }

  board.name = trimmedName;
  saveData();
  renderBoards();
  showToast(`Board renamed to "${trimmedName}"`, 'info');
});

/* =====================================
   DELETE BOARD
===================================== */
deleteBoardBtn.addEventListener('click', () => {
  if (appData.boards.length <= 1) {
    showToast('Cannot delete the last board.', 'error');
    return;
  }

  const board = getActiveBoard();
  const confirmed = confirm(`Delete board "${board.name}" and all its tasks?`);
  if (!confirmed) return;

  appData.boards = appData.boards.filter((b) => b.id !== board.id);
  appData.activeBoardId = appData.boards[0].id;
  saveData();
  renderBoards();
  renderTasks();
  updateDashboard();
  showToast(`Board "${board.name}" deleted.`, 'error');
});

/* =====================================
   TASK MODAL
===================================== */
let currentTaskStatus = 'todo';
let currentPriority = 'low';
let editingTaskId = null;

document.querySelectorAll('.add-column-task').forEach((btn) => {
  btn.addEventListener('click', () => {
    editingTaskId = null;
    currentTaskStatus = btn.dataset.status;
    currentPriority = 'low';
    taskModal.classList.add('show');
    taskTitleInput.value = '';
    taskDescriptionInput.value = '';
    subtaskContainer.innerHTML = '';
    updatePriorityButtons();

    // Update modal title
    taskModal.querySelector('.modal-header h2').innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
      New Task
    `;
    saveTaskBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>
      Create Task
    `;

    setTimeout(() => taskTitleInput.focus(), 300);
  });
});

document.querySelector('.close-modal').addEventListener('click', () => {
  taskModal.classList.remove('show');
});

cancelTaskBtn.addEventListener('click', () => {
  taskModal.classList.remove('show');
});

/* =====================================
   PRIORITY SELECTOR
===================================== */
function updatePriorityButtons() {
  document.querySelectorAll('.priority-btn').forEach((btn) => {
    btn.classList.remove('active');
    if (btn.dataset.priority === currentPriority) {
      btn.classList.add('active');
    }
  });
}

document.querySelectorAll('.priority-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentPriority = btn.dataset.priority;
    updatePriorityButtons();
  });
});

/* =====================================
   SUBTASKS
===================================== */
addSubtaskBtn.addEventListener('click', () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'subtask-item';
  wrapper.innerHTML = `
    <input class="subtask-input" type="text" placeholder="Subtask title..." />
    <button class="remove-subtask">✕</button>
  `;

  wrapper
    .querySelector('.remove-subtask')
    .addEventListener('click', () => {
      wrapper.style.animation = 'taskAppear 0.2s ease reverse';
      setTimeout(() => wrapper.remove(), 200);
    });

  subtaskContainer.appendChild(wrapper);

  // Focus the new input
  const newInput = wrapper.querySelector('.subtask-input');
  setTimeout(() => newInput.focus(), 100);
});

/* =====================================
   CREATE / EDIT TASK
===================================== */
saveTaskBtn.addEventListener('click', () => {
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();

  if (!title) {
    showToast('Task title is required!', 'error');
    taskTitleInput.focus();
    taskTitleInput.style.borderColor = 'var(--danger)';
    taskTitleInput.style.boxShadow = '0 0 0 3px var(--danger-light)';
    setTimeout(() => {
      taskTitleInput.style.borderColor = '';
      taskTitleInput.style.boxShadow = '';
    }, 2000);
    return;
  }

  const subtasks = [];
  document.querySelectorAll('.subtask-input').forEach((input) => {
    const value = input.value.trim();
    if (value) {
      subtasks.push({
        id: Date.now() + Math.random(),
        text: value,
        completed: false,
      });
    }
  });

  const board = getActiveBoard();

  if (editingTaskId) {
    // Edit existing task
    const task = board.tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.title = title;
      task.description = description;
      task.priority = currentPriority;
      // Preserve existing subtask completion status
      task.subtasks = subtasks.map((newSub) => {
        const existing = task.subtasks.find((s) => s.text === newSub.text);
        if (existing) {
          return { ...newSub, completed: existing.completed };
        }
        return newSub;
      });
    }
    showToast('Task updated successfully!', 'success');
  } else {
    // Create new task
    const task = {
      id: Date.now(),
      title,
      description,
      status: currentTaskStatus,
      priority: currentPriority,
      subtasks,
      createdAt: new Date().toISOString(),
    };
    board.tasks.push(task);
    showToast('Task created!', 'success');
  }

  saveData();
  taskModal.classList.remove('show');
  editingTaskId = null;
  renderTasks();
  updateDashboard();
});

/* =====================================
   PROGRESS CALCULATION
===================================== */
function calculateProgress(task) {
  if (!task.subtasks || task.subtasks.length === 0) return 0;
  const completed = task.subtasks.filter((s) => s.completed).length;
  return Math.round((completed / task.subtasks.length) * 100);
}

/* =====================================
   TASK CARD ELEMENT
===================================== */
function createTaskElement(task, index) {
  const progress = calculateProgress(task);
  const priority = task.priority || 'low';
  const subtaskCount = task.subtasks ? task.subtasks.length : 0;
  const completedSubtasks = task.subtasks ? task.subtasks.filter((s) => s.completed).length : 0;

  const div = document.createElement('div');
  div.className = `task priority-${priority}`;
  div.draggable = true;
  div.dataset.id = task.id;
  div.style.animationDelay = `${index * 0.05}s`;

  div.innerHTML = `
    <span class="task-priority-badge">${priority}</span>
    <div class="task-title">${escapeHtml(task.title)}</div>
    <div class="task-description">${escapeHtml(task.description || 'No description')}</div>
    ${
      subtaskCount > 0
        ? `
    <div class="task-progress">
      <div class="progress-info">
        <span>Progress</span>
        <span>${progress}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    <div class="subtask-preview">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      ${completedSubtasks}/${subtaskCount} subtasks
    </div>`
        : ''
    }
  `;

  // Drag events
  div.addEventListener('dragstart', (e) => {
    div.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  });

  div.addEventListener('dragend', () => {
    div.classList.remove('dragging');
    document.querySelectorAll('.column').forEach((col) => col.classList.remove('drag-over'));
  });

  // Click to open details
  div.addEventListener('click', (e) => {
    if (div.classList.contains('dragging')) return;
    openTaskDetails(task.id);
  });

  return div;
}

/* =====================================
   ESCAPE HTML UTILITY
===================================== */
function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/* =====================================
   RENDER TASKS
===================================== */
function renderTasks(searchQuery = '') {
  document.querySelectorAll('.task-container').forEach((container) => {
    container.innerHTML = '';
  });

  const board = getActiveBoard();
  let tasks = board.tasks;

  // Filter by search query
  if (searchQuery) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  const statusCounts = { todo: 0, progress: 0, review: 0, completed: 0 };

  tasks.forEach((task, index) => {
    const column = document.getElementById(task.status);
    if (!column) return;
    statusCounts[task.status]++;
    column.appendChild(createTaskElement(task, index));
  });

  // Update column task counts
  document.getElementById('todoCount').textContent = statusCounts.todo;
  document.getElementById('progressCount').textContent = statusCounts.progress;
  document.getElementById('reviewCount').textContent = statusCounts.review;
  document.getElementById('completedCount').textContent = statusCounts.completed;

  // Show empty states
  document.querySelectorAll('.task-container').forEach((container) => {
    if (container.children.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <span>Drop tasks here</span>
        </div>
      `;
    }
  });
}

/* =====================================
   SEARCH
===================================== */
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    renderTasks(e.target.value);
  }, 200);
});

/* =====================================
   DASHBOARD
===================================== */
function updateDashboard() {
  const board = getActiveBoard();
  const tasks = board.tasks;

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'progress').length;
  const pending = tasks.filter(
    (t) => t.status === 'todo' || t.status === 'review'
  ).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Animate counter changes
  animateValue(totalTasksEl, parseInt(totalTasksEl.textContent) || 0, total, 400);
  animateValue(completedTasksEl, parseInt(completedTasksEl.textContent) || 0, completed, 400);
  animateValue(progressTasksEl, parseInt(progressTasksEl.textContent) || 0, inProgress, 400);
  animateValue(pendingTasksEl, parseInt(pendingTasksEl.textContent) || 0, pending, 400);

  completionRateEl.textContent = percentage + '%';
}

function animateValue(element, start, end, duration) {
  if (start === end) return;
  const range = end - start;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(start + range * eased);
    element.textContent = current;
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* =====================================
   TASK DETAILS MODAL
===================================== */
const detailTaskTitle = document.getElementById('detailTaskTitle');
const detailTaskDescription = document.getElementById('detailTaskDescription');
const detailProgressPercent = document.getElementById('detailProgressPercent');
const detailProgressFill = document.getElementById('detailProgressFill');
const detailSubtaskList = document.getElementById('detailSubtaskList');
const detailPriorityBadge = document.getElementById('detailPriorityBadge');
const deleteTaskBtn = document.getElementById('deleteTaskBtn');
const editTaskBtn = document.getElementById('editTaskBtn');

let selectedTaskId = null;

function openTaskDetails(taskId) {
  const board = getActiveBoard();
  const task = board.tasks.find((t) => t.id === taskId);
  if (!task) return;

  selectedTaskId = task.id;
  const priority = task.priority || 'low';

  detailTaskTitle.textContent = task.title;
  detailTaskDescription.textContent = task.description || 'No description available';

  // Priority badge
  detailPriorityBadge.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
  detailPriorityBadge.className = `detail-priority-badge priority-${priority}`;

  const progress = calculateProgress(task);
  detailProgressPercent.textContent = progress + '%';

  // Animate progress fill
  detailProgressFill.style.width = '0%';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      detailProgressFill.style.width = progress + '%';
    });
  });

  // Render subtasks
  detailSubtaskList.innerHTML = '';

  if (!task.subtasks || task.subtasks.length === 0) {
    detailSubtaskList.innerHTML = `
      <div class="no-subtasks">No subtasks available</div>
    `;
  } else {
    task.subtasks.forEach((subtask) => {
      const item = document.createElement('div');
      item.className = 'detail-subtask';
      if (subtask.completed) {
        item.classList.add('completed');
      }

      item.innerHTML = `
        <input type="checkbox" ${subtask.completed ? 'checked' : ''} />
        <span class="subtask-text">${escapeHtml(subtask.text)}</span>
      `;

      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', () => {
        subtask.completed = checkbox.checked;
        saveData();
        renderTasks();
        updateDashboard();
        openTaskDetails(task.id);

        // Check if all subtasks completed — celebrate!
        if (task.subtasks.every((s) => s.completed)) {
          const rect = item.getBoundingClientRect();
          triggerConfetti(rect.left + rect.width / 2, rect.top);
          showToast('All subtasks completed! 🎉', 'success');
        }
      });

      detailSubtaskList.appendChild(item);
    });
  }

  taskDetailsModal.classList.add('show');
}

/* =====================================
   EDIT TASK
===================================== */
editTaskBtn.addEventListener('click', () => {
  if (selectedTaskId === null) return;

  const board = getActiveBoard();
  const task = board.tasks.find((t) => t.id === selectedTaskId);
  if (!task) return;

  // Close details modal
  taskDetailsModal.classList.remove('show');

  // Open task modal in edit mode
  editingTaskId = task.id;
  currentTaskStatus = task.status;
  currentPriority = task.priority || 'low';

  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description || '';
  subtaskContainer.innerHTML = '';

  if (task.subtasks) {
    task.subtasks.forEach((subtask) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'subtask-item';
      wrapper.innerHTML = `
        <input class="subtask-input" type="text" placeholder="Subtask title..." value="${escapeHtml(subtask.text)}" />
        <button class="remove-subtask">✕</button>
      `;
      wrapper
        .querySelector('.remove-subtask')
        .addEventListener('click', () => {
          wrapper.style.animation = 'taskAppear 0.2s ease reverse';
          setTimeout(() => wrapper.remove(), 200);
        });
      subtaskContainer.appendChild(wrapper);
    });
  }

  updatePriorityButtons();

  // Update modal title for edit mode
  taskModal.querySelector('.modal-header h2').innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 8px;"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    Edit Task
  `;
  saveTaskBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 6px;"><polyline points="20 6 9 17 4 12"/></svg>
    Save Changes
  `;

  taskModal.classList.add('show');
  setTimeout(() => taskTitleInput.focus(), 300);
});

/* =====================================
   CLOSE DETAILS MODAL
===================================== */
document.querySelector('.close-details').addEventListener('click', () => {
  taskDetailsModal.classList.remove('show');
});

/* =====================================
   DELETE TASK
===================================== */
deleteTaskBtn.addEventListener('click', () => {
  if (selectedTaskId === null) return;

  const confirmed = confirm('Delete this task?');
  if (!confirmed) return;

  const board = getActiveBoard();
  const task = board.tasks.find((t) => t.id === selectedTaskId);
  const taskName = task ? task.title : 'Task';

  board.tasks = board.tasks.filter((t) => t.id !== selectedTaskId);
  saveData();
  taskDetailsModal.classList.remove('show');
  renderTasks();
  updateDashboard();
  showToast(`"${taskName}" deleted.`, 'error');
});

/* =====================================
   DRAG & DROP
===================================== */
document.querySelectorAll('.task-container').forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    container.closest('.column').classList.add('drag-over');

    // Reorder visual feedback
    const dragged = document.querySelector('.dragging');
    if (!dragged) return;

    const siblings = [...container.querySelectorAll('.task:not(.dragging)')];
    const nextSibling = siblings.find((sibling) => {
      const rect = sibling.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    });

    if (nextSibling) {
      container.insertBefore(dragged, nextSibling);
    } else {
      // Remove empty state if present
      const emptyState = container.querySelector('.empty-state');
      if (emptyState) emptyState.remove();
      container.appendChild(dragged);
    }
  });

  container.addEventListener('dragleave', (e) => {
    // Only remove if we're leaving the column entirely
    if (!container.contains(e.relatedTarget)) {
      container.closest('.column').classList.remove('drag-over');
    }
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    container.closest('.column').classList.remove('drag-over');

    const dragged = document.querySelector('.dragging');
    if (!dragged) return;

    const taskId = Number(dragged.dataset.id);
    const board = getActiveBoard();
    const task = board.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    task.status = container.id;

    saveData();
    renderTasks();
    updateDashboard();

    // Show toast & confetti when moved to completed
    if (task.status === 'completed' && oldStatus !== 'completed') {
      const rect = container.getBoundingClientRect();
      triggerConfetti(rect.left + rect.width / 2, rect.top + 100);
      showToast(`"${task.title}" completed! 🎉`, 'success');
    } else if (oldStatus !== task.status) {
      const statusLabels = {
        todo: 'To Do',
        progress: 'In Progress',
        review: 'Review',
        completed: 'Completed',
      };
      showToast(`Moved to ${statusLabels[task.status]}`, 'info');
    }
  });
});

/* =====================================
   THEME TOGGLE
===================================== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('kanbanTheme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark');
}

// Also check system preference if no saved theme
if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('kanbanTheme', isDark ? 'dark' : 'light');

  // Add rotation animation
  themeToggle.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    themeToggle.style.transform = '';
  }, 500);
});

/* =====================================
   CLOSE MODALS ON OUTSIDE CLICK
===================================== */
window.addEventListener('click', (e) => {
  if (e.target === taskModal) {
    taskModal.classList.remove('show');
  }
  if (e.target === taskDetailsModal) {
    taskDetailsModal.classList.remove('show');
  }
});

/* =====================================
   KEYBOARD SHORTCUTS
===================================== */
document.addEventListener('keydown', (e) => {
  // Escape to close modals
  if (e.key === 'Escape') {
    taskModal.classList.remove('show');
    taskDetailsModal.classList.remove('show');
    closeSidebar();
  }

  // Ctrl+K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
  }

  // Ctrl+N to add task to To Do
  if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
    // Only if no modal is open
    if (!taskModal.classList.contains('show') && !taskDetailsModal.classList.contains('show')) {
      e.preventDefault();
      editingTaskId = null;
      currentTaskStatus = 'todo';
      currentPriority = 'low';
      taskModal.classList.add('show');
      taskTitleInput.value = '';
      taskDescriptionInput.value = '';
      subtaskContainer.innerHTML = '';
      updatePriorityButtons();
      setTimeout(() => taskTitleInput.focus(), 300);
    }
  }
});

/* =====================================
   TOUCH SUPPORT FOR DRAG & DROP
===================================== */
let touchDragElement = null;
let touchDragTask = null;
let touchClone = null;
let touchStartX, touchStartY;
let hasMoved = false;

document.addEventListener('touchstart', (e) => {
  const taskEl = e.target.closest('.task');
  if (!taskEl) return;

  touchDragElement = taskEl;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  hasMoved = false;

  // Long press to start drag
  touchDragTask = setTimeout(() => {
    taskEl.classList.add('dragging');

    // Create visual clone
    touchClone = taskEl.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.zIndex = '9999';
    touchClone.style.width = taskEl.offsetWidth + 'px';
    touchClone.style.opacity = '0.85';
    touchClone.style.transform = 'rotate(3deg) scale(1.05)';
    touchClone.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
    document.body.appendChild(touchClone);
    hasMoved = true;

    // Haptic feedback if available
    if (navigator.vibrate) navigator.vibrate(50);
  }, 300);
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  if (!touchDragElement || !hasMoved) {
    const dx = Math.abs(e.touches[0].clientX - touchStartX);
    const dy = Math.abs(e.touches[0].clientY - touchStartY);
    if (dx > 10 || dy > 10) {
      clearTimeout(touchDragTask);
    }
    return;
  }

  e.preventDefault();

  const touch = e.touches[0];
  if (touchClone) {
    touchClone.style.left = touch.clientX - touchClone.offsetWidth / 2 + 'px';
    touchClone.style.top = touch.clientY - 30 + 'px';
  }

  // Highlight column under touch
  document.querySelectorAll('.column').forEach((col) => col.classList.remove('drag-over'));
  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  if (elementBelow) {
    const column = elementBelow.closest('.column');
    if (column) column.classList.add('drag-over');
  }
}, { passive: false });

document.addEventListener('touchend', (e) => {
  clearTimeout(touchDragTask);

  if (!touchDragElement || !hasMoved) {
    touchDragElement = null;
    return;
  }

  // Find which column we dropped on
  const touch = e.changedTouches[0];
  if (touchClone) touchClone.remove();
  touchClone = null;

  const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
  document.querySelectorAll('.column').forEach((col) => col.classList.remove('drag-over'));

  if (elementBelow) {
    const column = elementBelow.closest('.column');
    if (column) {
      const container = column.querySelector('.task-container');
      const taskId = Number(touchDragElement.dataset.id);
      const board = getActiveBoard();
      const task = board.tasks.find((t) => t.id === taskId);

      if (task) {
        const oldStatus = task.status;
        task.status = container.id;
        saveData();
        renderTasks();
        updateDashboard();

        if (task.status === 'completed' && oldStatus !== 'completed') {
          triggerConfetti(touch.clientX, touch.clientY);
          showToast(`"${task.title}" completed! 🎉`, 'success');
        }
      }
    }
  }

  touchDragElement.classList.remove('dragging');
  touchDragElement = null;
  hasMoved = false;
});

/* =====================================
   INITIALIZE APP
===================================== */

// Migrate old tasks that don't have priority
appData.boards.forEach((board) => {
  board.tasks.forEach((task) => {
    if (!task.priority) task.priority = 'low';
    if (!task.createdAt) task.createdAt = new Date().toISOString();
  });
});
saveData();

renderBoards();
renderTasks();
updateDashboard();

// Welcome animation
document.querySelectorAll('.stat-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.08}s`;
});
