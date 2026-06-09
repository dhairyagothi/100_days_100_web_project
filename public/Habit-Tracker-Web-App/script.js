'use strict';

const habitInput = document.getElementById('habitInput');
const habitTags = document.getElementById('habitTags');
const habitNotes = document.getElementById('habitNotes');
const habitGoal = document.getElementById('habitGoal');
const habitReminder = document.getElementById('habitReminder');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');
const totalHabits = document.getElementById('totalHabits');
const completedHabits = document.getElementById('completedHabits');
const scheduledToday = document.getElementById('scheduledToday');
const weeklyRate = document.getElementById('weeklyRate');
const progressList = document.getElementById('progressList');
const themeToggle = document.getElementById('theme-toggle');

const deleteModal = document.getElementById('delete-modal');
const deleteMessage = document.getElementById('delete-message');
const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
const deleteCancelBtn = document.getElementById('delete-cancel-btn');
const deleteCloseBtn = document.getElementById('delete-close-btn');
const milestoneModal = document.getElementById('milestone-modal');
const closeMilestoneBtn = document.getElementById('close-modal-btn');
const milestoneBtn = document.getElementById('milestone-btn');
const milestoneMessage = document.getElementById('milestone-message');

const STORAGE_KEY = 'habits';
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_SCHEDULE = [0, 1, 2, 3, 4, 5, 6];

let habits = loadHabits();
let pendingDeleteIndex = null;

setupGoalField();
setupValidationUI();
migrateHabits();
updateHabitsDailyStatus();
saveHabits();
renderAll();
setupEventListeners();
checkReminders();
setInterval(checkReminders, 60000);

function loadHabits() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

function getTodayString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
}

function getDateStringFromOffset(offsetDays) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split('T')[0];
}

function getDateMs(dateString) {
  return new Date(`${dateString}T00:00:00`).getTime();
}

function getLast7Dates() {
  const dates = [];
  for (let i = 6; i >= 0; i -= 1) {
    dates.push(getDateStringFromOffset(-i));
  }
  return dates;
}

function migrateHabits() {
  habits = habits.map(habit => {
    const completionDates = Array.isArray(habit.completionDates)
      ? habit.completionDates
      : Array.isArray(habit.history)
        ? habit.history
        : [];

    const migrated = {
      name: habit.name || '',
      tags: Array.isArray(habit.tags) ? habit.tags : parseTags(habit.tags || ''),
      notes: habit.notes || '',
      goalText: habit.goalText || (habit.goalValue ? String(habit.goalValue) : ''),
      goalValue: habit.goalValue || Number.parseInt(habit.goalText, 10) || '',
      reminderTime: habit.reminderTime || '',
      schedule: Array.isArray(habit.schedule) && habit.schedule.length ? habit.schedule : DEFAULT_SCHEDULE,
      completionDates: Array.from(new Set(completionDates)).sort(),
      completed: Boolean(habit.completed),
      streak: habit.streak || 0,
      maxStreak: habit.maxStreak || 0,
      lastCompleted: habit.lastCompleted || '',
      createdAt: habit.createdAt || getTodayString()
    };

    migrated.completed = migrated.completionDates.includes(getTodayString());
    migrated.lastCompleted = getLatestCompletionDate(migrated);
    migrated.streak = calculateCurrentStreak(migrated);
    migrated.maxStreak = Math.max(migrated.maxStreak, calculateMaxStreak(migrated));
    migrated.history = migrated.completionDates;
    return migrated;
  });
}

function normalizeCompletionDates(habit) {
  habit.completionDates = Array.from(new Set(habit.completionDates || [])).sort();
  habit.history = habit.completionDates;
}

function getLatestCompletionDate(habit) {
  if (!habit.completionDates || habit.completionDates.length === 0) return '';
  return habit.completionDates.slice().sort().pop();
}

function calculateCurrentStreak(habit) {
  if (!habit.completionDates || habit.completionDates.length === 0) return 0;

  const dates = new Set(habit.completionDates);
  let streak = 0;
  let currentDateMs = getDateMs(getTodayString());

  while (dates.has(new Date(currentDateMs).toISOString().split('T')[0])) {
    streak += 1;
    currentDateMs -= 86400000;
  }

  return streak;
}

function calculateMaxStreak(habit) {
  if (!habit.completionDates || habit.completionDates.length === 0) return 0;

  const dates = habit.completionDates.slice().sort();
  let current = 1;
  let max = 1;

  for (let i = 1; i < dates.length; i += 1) {
    const isConsecutive = getDateMs(dates[i]) - getDateMs(dates[i - 1]) === 86400000;
    current = isConsecutive ? current + 1 : 1;
    max = Math.max(max, current);
  }

  return max;
}

function updateHabitsDailyStatus() {
  const today = getTodayString();
  habits.forEach(habit => {
    normalizeCompletionDates(habit);
    habit.completed = habit.completionDates.includes(today);
    habit.lastCompleted = getLatestCompletionDate(habit);
    habit.streak = calculateCurrentStreak(habit);
    habit.maxStreak = Math.max(habit.maxStreak || 0, calculateMaxStreak(habit));
  });
}

function parseTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value.split(',').map(tag => tag.trim()).filter(Boolean);
}

function getSelectedSchedule() {
  return Array.from(document.querySelectorAll('.schedule-day:checked')).map(input => Number(input.value));
}

function isScheduledForDay(habit, dayIndex) {
  if (!habit.schedule || habit.schedule.length === 0) return true;
  return habit.schedule.includes(dayIndex);
}

function getWeeklyProgress(habit) {
  let scheduledCount = 0;
  let completedCount = 0;

  getLast7Dates().forEach(dateStr => {
    const dayIndex = new Date(`${dateStr}T00:00:00`).getDay();
    if (isScheduledForDay(habit, dayIndex)) scheduledCount += 1;
    if (habit.completionDates.includes(dateStr)) completedCount += 1;
  });

  return {
    scheduledCount,
    completedCount,
    percent: scheduledCount === 0 ? 0 : Math.round((completedCount / scheduledCount) * 100)
  };
}

function createHabitFromForm() {
  const name = habitInput.value.trim();
  const goalValue = Number.parseInt(habitGoal.value, 10);

  return {
    name,
    tags: parseTags(habitTags.value),
    notes: habitNotes.value.trim(),
    goalText: String(goalValue),
    goalValue,
    reminderTime: habitReminder.value,
    schedule: getSelectedSchedule(),
    completionDates: [],
    history: [],
    completed: false,
    streak: 0,
    maxStreak: 0,
    lastCompleted: '',
    createdAt: getTodayString()
  };
}

function addHabit() {
  clearFeedback();

  if (!validateHabitForm()) return;

  const newHabit = createHabitFromForm();
  habits.push(newHabit);
  saveHabits();
  renderAll();
  resetHabitForm();
  showFormMessage('Habit added successfully.', 'success');

  if (newHabit.reminderTime) requestNotificationPermission();
}

function validateHabitForm() {
  let isValid = true;
  const name = habitInput.value.trim();
  const goal = habitGoal.value.trim();
  const goalNumber = Number(goal);
  const selectedSchedule = getSelectedSchedule();

  if (!name) {
    setFieldError(habitInput, 'Enter a habit name.');
    isValid = false;
  } else if (name.length < 2) {
    setFieldError(habitInput, 'Habit name must be at least 2 characters.');
    isValid = false;
  }

  if (!goal) {
    setFieldError(habitGoal, 'Enter a numeric daily goal.');
    isValid = false;
  } else if (!Number.isInteger(goalNumber) || goalNumber <= 0) {
    setFieldError(habitGoal, 'Daily goal must be a positive whole number.');
    isValid = false;
  }

  if (selectedSchedule.length === 0) {
    showFormMessage('Select at least one day for this habit.', 'error');
    isValid = false;
  }

  if (!isValid) {
    showFormMessage('Please fix the highlighted fields.', 'error');
  }

  return isValid;
}

function setupGoalField() {
  if (!habitGoal) return;
  habitGoal.type = 'number';
  habitGoal.min = '1';
  habitGoal.step = '1';
  habitGoal.inputMode = 'numeric';
  habitGoal.placeholder = '20';
}

function setupValidationUI() {
  [habitInput, habitGoal].forEach(input => {
    if (!input) return;
    input.setAttribute('aria-invalid', 'false');
    input.addEventListener('input', () => clearFieldError(input));
  });

  if (!document.getElementById('formFeedback')) {
    const feedback = document.createElement('p');
    feedback.id = 'formFeedback';
    feedback.className = 'form-feedback';
    feedback.setAttribute('role', 'status');
    addHabitBtn.closest('.cta-row').appendChild(feedback);
  }
}

function setFieldError(input, message) {
  input.classList.add('is-invalid');
  input.setAttribute('aria-invalid', 'true');

  let error = input.parentElement.querySelector('.field-error');
  if (!error) {
    error = document.createElement('span');
    error.className = 'field-error';
    input.parentElement.appendChild(error);
  }
  error.textContent = message;
}

function clearFieldError(input) {
  input.classList.remove('is-invalid');
  input.setAttribute('aria-invalid', 'false');
  const error = input.parentElement.querySelector('.field-error');
  if (error) error.remove();
}

function clearFeedback() {
  [habitInput, habitGoal].forEach(input => input && clearFieldError(input));
  const feedback = document.getElementById('formFeedback');
  if (feedback) {
    feedback.textContent = '';
    feedback.className = 'form-feedback';
  }
}

function showFormMessage(message, type) {
  const feedback = document.getElementById('formFeedback');
  if (!feedback) return;
  feedback.textContent = message;
  feedback.className = `form-feedback ${type}`;
}

function resetHabitForm() {
  habitInput.value = '';
  habitTags.value = '';
  habitNotes.value = '';
  habitGoal.value = '';
  habitReminder.value = '';
  document.querySelectorAll('.schedule-day').forEach(input => {
    input.checked = true;
  });
  habitInput.focus();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function renderHabits() {
  habitList.innerHTML = '';

  if (habits.length === 0) {
    habitList.innerHTML = '<li class="empty-state-small">No habits yet. Create one above to start tracking.</li>';
    return;
  }

  habits.forEach((habit, index) => {
    const weekly = getWeeklyProgress(habit);
    const scheduleLabel = (habit.schedule || DEFAULT_SCHEDULE)
      .map(day => WEEK_DAYS[day])
      .filter(Boolean)
      .join(' ');
    const tagsHtml = (habit.tags || [])
      .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');
    const streakHtml = habit.streak > 0
      ? `<span class="streak-badge">Streak: ${habit.streak} day${habit.streak === 1 ? '' : 's'}</span>`
      : '';

    const li = document.createElement('li');
    li.className = 'habit-item';
    li.innerHTML = `
      <div class="habit-main">
        <div class="habit-details">
          <span class="habit-title ${habit.completed ? 'completed' : ''}">${escapeHtml(habit.name)}</span>
          <div class="habit-meta">
            ${tagsHtml}
            <span>Schedule: ${scheduleLabel || 'Daily'}</span>
            <span>Goal: ${escapeHtml(habit.goalText || habit.goalValue || '')}</span>
            ${habit.reminderTime ? `<span>Reminder: ${escapeHtml(habit.reminderTime)}</span>` : ''}
            <span>Weekly: ${weekly.completedCount}/${weekly.scheduledCount}</span>
          </div>
          ${habit.notes ? `<p class="habit-note">${escapeHtml(habit.notes)}</p>` : ''}
          ${streakHtml}
        </div>
        <div class="actions habit-actions">
          <button class="complete-btn" type="button">${habit.completed ? 'Undo' : 'Done'}</button>
          <button class="delete-btn" type="button">Delete</button>
        </div>
      </div>
      <div class="progress-bar"><span style="width: ${weekly.percent}%"></span></div>
    `;

    li.querySelector('.complete-btn').addEventListener('click', () => {
      toggleComplete(index);
      saveHabits();
      renderAll();
    });

    li.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(index));
    habitList.appendChild(li);
  });
}

function renderProgressCharts() {
  progressList.innerHTML = '';

  if (habits.length === 0) {
    progressList.innerHTML = '<p class="empty-state-small">Progress appears after you add a habit.</p>';
    return;
  }

  habits.forEach(habit => {
    const weekly = getWeeklyProgress(habit);
    const card = document.createElement('div');
    card.className = 'progress-card';
    card.innerHTML = `
      <div class="habit-title">${escapeHtml(habit.name)}</div>
      <div class="habit-meta">Weekly completion: ${weekly.percent}%</div>
      <div class="progress-bar"><span style="width: ${weekly.percent}%"></span></div>
    `;
    progressList.appendChild(card);
  });
}

function updateStats() {
  const todayDay = new Date(`${getTodayString()}T00:00:00`).getDay();
  let completedCount = 0;
  let scheduledCount = 0;
  let totalScheduledWeek = 0;
  let totalCompletedWeek = 0;

  habits.forEach(habit => {
    if (habit.completed) completedCount += 1;
    if (isScheduledForDay(habit, todayDay)) scheduledCount += 1;

    const weekly = getWeeklyProgress(habit);
    totalScheduledWeek += weekly.scheduledCount;
    totalCompletedWeek += weekly.completedCount;
  });

  totalHabits.textContent = habits.length;
  completedHabits.textContent = completedCount;
  scheduledToday.textContent = scheduledCount;
  weeklyRate.textContent = totalScheduledWeek === 0
    ? '0%'
    : `${Math.round((totalCompletedWeek / totalScheduledWeek) * 100)}%`;
}

function renderAll() {
  updateHabitsDailyStatus();
  renderHabits();
  renderProgressCharts();
  updateStats();
  checkMilestones();
}

function toggleComplete(index) {
  const habit = habits[index];
  const today = getTodayString();

  if (habit.completed) {
    habit.completionDates = habit.completionDates.filter(date => date !== today);
  } else {
    habit.completionDates.push(today);
  }

  normalizeCompletionDates(habit);
  habit.completed = habit.completionDates.includes(today);
  habit.lastCompleted = getLatestCompletionDate(habit);
  habit.streak = calculateCurrentStreak(habit);
  habit.maxStreak = Math.max(habit.maxStreak || 0, calculateMaxStreak(habit));

  if (habit.completed) checkMilestoneUnlocked(habit.name, habit.streak);
}

function openDeleteModal(index) {
  pendingDeleteIndex = index;
  deleteMessage.textContent = `Delete "${habits[index].name}"? This action cannot be undone.`;
  deleteModal.classList.add('show');
}

function closeDeleteModal() {
  pendingDeleteIndex = null;
  deleteModal.classList.remove('show');
}

function checkMilestones() {
  const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.maxStreak || 0), 0);
  [3, 7, 30].forEach(days => {
    const badge = document.getElementById(`badge-${days}`);
    if (!badge) return;
    badge.classList.toggle('unlocked', bestStreak >= days);
    badge.classList.toggle('locked', bestStreak < days);
  });
}

function checkMilestoneUnlocked(habitName, streak) {
  if (![3, 7, 30].includes(streak)) return;
  if (milestoneMessage) {
    milestoneMessage.textContent = `You achieved a ${streak}-day streak on "${habitName}"!`;
  }
  if (milestoneModal) {
    milestoneModal.classList.remove('hidden');
    milestoneModal.classList.add('show');
  }
}

function closeMilestoneModal() {
  if (!milestoneModal) return;
  milestoneModal.classList.remove('show');
  milestoneModal.classList.add('hidden');
}

function requestNotificationPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') return;
  Notification.requestPermission();
}

function checkReminders() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const currentTime = new Date().toTimeString().slice(0, 5);
  habits.forEach(habit => {
    if (habit.reminderTime !== currentTime || habit.lastReminderDate === getTodayString()) return;

    new Notification('Habit Tracker', {
      body: `Time for your habit: "${habit.name}"`
    });
    habit.lastReminderDate = getTodayString();
  });

  saveHabits();
}

function setupEventListeners() {
  addHabitBtn.addEventListener('click', addHabit);

  [habitInput, habitGoal].forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') addHabit();
    });
  });

  deleteCloseBtn?.addEventListener('click', closeDeleteModal);
  deleteCancelBtn?.addEventListener('click', closeDeleteModal);
  deleteConfirmBtn?.addEventListener('click', () => {
    if (pendingDeleteIndex !== null) {
      habits.splice(pendingDeleteIndex, 1);
      saveHabits();
      renderAll();
      showFormMessage('Habit deleted.', 'success');
    }
    closeDeleteModal();
  });
  deleteModal?.addEventListener('click', event => {
    if (event.target === deleteModal) closeDeleteModal();
  });

  closeMilestoneBtn?.addEventListener('click', closeMilestoneModal);
  milestoneBtn?.addEventListener('click', closeMilestoneModal);

  themeToggle?.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  });

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = 'Light Mode';
  }
}
