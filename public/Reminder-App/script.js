// ============================================================
//  Neon Reminder App — script.js
// ============================================================

const STORAGE_KEY = 'neon-reminders';

// ── DOM refs ──────────────────────────────────────────────
const form          = document.getElementById('reminder-form');
const titleInput    = document.getElementById('title');
const datetimeInput = document.getElementById('datetime');
const priorityInput = document.getElementById('priority');
const reminderList  = document.getElementById('reminder-list');
const activeCount   = document.getElementById('active-count');
const completedCount= document.getElementById('completed-count');
const toastContainer= document.getElementById('toast-container');

// ── State ────────────────────────────────────────────────
let reminders = loadReminders();

// ── Init ─────────────────────────────────────────────────
(function init() {
  // Set the min datetime to right now so past dates are blocked
  datetimeInput.min = toLocalISOString(new Date());

  requestNotificationPermission();
  render();
  scheduleAllAlerts();
})();

// ── Form submit ──────────────────────────────────────────
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title    = titleInput.value.trim();
  const deadline = datetimeInput.value;
  const priority = priorityInput.value;

  if (!title || !deadline) return;

  const reminder = {
    id:        crypto.randomUUID(),
    title,
    deadline,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  reminders.unshift(reminder);
  saveReminders();
  render();
  scheduleAlert(reminder);
  showToast('Reminder Added', `"${title}" has been saved.`, '🔔');

  form.reset();
  priorityInput.value = 'Medium';
  datetimeInput.min   = toLocalISOString(new Date());
});

// ── Render ───────────────────────────────────────────────
function render() {
  reminderList.innerHTML = '';

  if (reminders.length === 0) {
    reminderList.innerHTML =
      `<p style="color:var(--text-muted);text-align:center;padding:2rem 0;">
         No reminders yet. Add one above!
       </p>`;
  } else {
    reminders.forEach((r) => {
      reminderList.appendChild(createCard(r));
    });
  }

  updateStats();
}

function createCard(reminder) {
  const card = document.createElement('div');
  card.className = `reminder-card priority-${reminder.priority}${reminder.completed ? ' completed' : ''}`;
  card.dataset.id = reminder.id;

  const deadlineDate = new Date(reminder.deadline);
  const isOverdue    = !reminder.completed && deadlineDate < new Date();

  card.innerHTML = `
    <div class="reminder-info">
      <h3>${escapeHTML(reminder.title)}</h3>
      <div class="reminder-meta">
        <span>${formatDate(deadlineDate)}${isOverdue ? ' <span style="color:var(--priority-high)">· Overdue</span>' : ''}</span>
        <span class="priority-badge">${reminder.priority}</span>
      </div>
    </div>
    <div class="reminder-actions">
      <button
        class="action-btn btn-complete"
        title="${reminder.completed ? 'Mark as active' : 'Mark as complete'}"
        aria-label="${reminder.completed ? 'Mark as active' : 'Mark as complete'}"
      >
        ${reminder.completed ? checkCircleIcon() : checkIcon()}
      </button>
      <button
        class="action-btn btn-delete"
        title="Delete reminder"
        aria-label="Delete reminder"
      >
        ${trashIcon()}
      </button>
    </div>
  `;

  // Complete button
  card.querySelector('.btn-complete').addEventListener('click', () => {
    toggleComplete(reminder.id);
  });

  // Delete button
  card.querySelector('.btn-delete').addEventListener('click', () => {
    deleteReminder(reminder.id);
  });

  return card;
}

// ── Actions ───────────────────────────────────────────────
function toggleComplete(id) {
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return;

  reminder.completed = !reminder.completed;
  saveReminders();
  render();

  const msg = reminder.completed ? 'Marked as complete!' : 'Marked as active.';
  showToast(reminder.title, msg, reminder.completed ? '✅' : '🔄');
}

function deleteReminder(id) {
  const reminder = reminders.find((r) => r.id === id);
  if (!reminder) return;

  // Animate card out before removal
  const card = reminderList.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.style.transition = 'opacity 0.3s, transform 0.3s';
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(30px)';
    setTimeout(() => {
      reminders = reminders.filter((r) => r.id !== id);
      saveReminders();
      render();
    }, 280);
  } else {
    reminders = reminders.filter((r) => r.id !== id);
    saveReminders();
    render();
  }

  showToast('Deleted', `"${reminder.title}" was removed.`, '🗑️');
}

// ── Stats ─────────────────────────────────────────────────
function updateStats() {
  const completed = reminders.filter((r) => r.completed).length;
  const active    = reminders.length - completed;

  activeCount.textContent    = active;
  completedCount.textContent = completed;
}

// ── Toast Notifications ──────────────────────────────────
function showToast(title, message, icon = '🔔') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size:1.5rem">${icon}</span>
    <div class="toast-content">
      <h4>${escapeHTML(title)}</h4>
      <p>${escapeHTML(message)}</p>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Auto-remove after 3.5 s
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 1, 1) forwards';
    setTimeout(() => toast.remove(), 380);
  }, 3500);
}

// ── Browser Notification Alerts ──────────────────────────
function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function scheduleAlert(reminder) {
  if (reminder.completed) return;

  const delay = new Date(reminder.deadline) - Date.now();
  if (delay <= 0) return; // already overdue

  setTimeout(() => {
    // Show in-app toast
    showToast(reminder.title, 'Your reminder is due now!', '⏰');

    // Show browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('NeonReminders ⏰', {
        body: reminder.title,
        icon: '/fav.ico',
      });
    }
  }, delay);
}

function scheduleAllAlerts() {
  reminders.forEach(scheduleAlert);
}

// ── Persistence ───────────────────────────────────────────
function saveReminders() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

function loadReminders() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

// ── Helpers ───────────────────────────────────────────────
function formatDate(date) {
  return date.toLocaleString(undefined, {
    month:  'short',
    day:    'numeric',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/** Returns a local ISO string suitable for datetime-local min attribute */
function toLocalISOString(date) {
  const off = date.getTimezoneOffset() * 60000;
  return new Date(date - off).toISOString().slice(0, 16);
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── SVG Icons ─────────────────────────────────────────────
function checkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`;
}

function checkCircleIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>`;
}

function trashIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/>
    <path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>`;
}
