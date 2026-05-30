const STORAGE_KEY = 'habit-tracker-v1';

const habitForm = document.getElementById('habitForm');
const habitInput = document.getElementById('habitInput');
const feedback = document.getElementById('feedback');
const habitList = document.getElementById('habitList');
const emptyState = document.getElementById('emptyState');
const totalHabits = document.getElementById('totalHabits');
const completedCount = document.getElementById('completedCount');
const completionRate = document.getElementById('completionRate');
const currentStreak = document.getElementById('currentStreak');
const longestStreak = document.getElementById('longestStreak');
const progressBar = document.getElementById('progressBar');
const progressLabel = document.getElementById('progressLabel');
const taskSubtitle = document.getElementById('taskSubtitle');

const state = {
  habits: [],
  global: {
    currentStreak: 0,
    longestStreak: 0,
    lastFullCompleteDate: null,
  },
};

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
};

function normalizeHabit(value) {
  return value.trim().replace(/\s+/g, ' ').toLowerCase();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);
    if (parsed && Array.isArray(parsed.habits)) {
      state.habits = parsed.habits;
    }
    if (parsed && parsed.global) {
      state.global = {
        ...state.global,
        ...parsed.global,
      };
    }
  } catch (error) {
    console.warn('Unable to load habit state:', error);
  }
}

function setFeedback(message, type = 'neutral') {
  feedback.textContent = message;
  feedback.dataset.type = type;
  clearTimeout(feedback.timeoutId);

  if (type === 'error') {
    feedback.style.color = '#f7a3a3';
  } else if (type === 'success') {
    feedback.style.color = '#b8f2ff';
  } else {
    feedback.style.color = '#8fa3d9';
  }

  if (type !== 'neutral') {
    feedback.timeoutId = setTimeout(() => {
      feedback.textContent = 'Use short habit names and avoid duplicates.';
      feedback.style.color = '#8fa3d9';
    }, 2400);
  }
}

function getStats() {
  const total = state.habits.length;
  const completed = state.habits.filter((habit) => habit.completedToday).length;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    rate,
  };
}

function updateGlobalStreak() {
  const allDoneToday = state.habits.length > 0 && state.habits.every((habit) => habit.completedToday);
  const lastDate = state.global.lastFullCompleteDate;

  if (allDoneToday) {
    if (lastDate === today()) {
      return;
    }

    if (lastDate === yesterday()) {
      state.global.currentStreak += 1;
    } else {
      state.global.currentStreak = 1;
    }

    state.global.lastFullCompleteDate = today();
    state.global.longestStreak = Math.max(state.global.longestStreak, state.global.currentStreak);
    saveState();
    return;
  }

  if (lastDate !== today() && lastDate !== yesterday()) {
    state.global.currentStreak = 0;
  }
}

function buildListItem(habit) {
  const listItem = document.createElement('li');
  listItem.className = 'habit-item';
  listItem.dataset.id = habit.id;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = `habit-toggle${habit.completedToday ? ' active' : ''}`;
  toggle.setAttribute('aria-pressed', String(habit.completedToday));
  toggle.title = habit.completedToday ? 'Unmark habit' : 'Mark habit complete';
  toggle.textContent = habit.completedToday ? '✓' : '';

  const details = document.createElement('div');
  details.className = 'habit-details';

  const title = document.createElement('p');
  title.className = `habit-title${habit.completedToday ? ' completed' : ''}`;
  title.textContent = habit.title;

  const meta = document.createElement('p');
  meta.className = 'habit-meta';
  const streakText = habit.streak > 0 ? `${habit.streak} day streak` : 'No streak yet';
  const activityText = habit.completedToday ? 'Completed today' : habit.lastCompleted ? `Last done ${habit.lastCompleted}` : 'Not completed yet';
  meta.textContent = `${activityText} · ${streakText}`;

  details.append(title, meta);

  const actions = document.createElement('div');
  actions.className = 'habit-actions';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'habit-remove';
  removeButton.ariaLabel = `Remove ${habit.title}`;
  removeButton.textContent = '✕';

  actions.append(removeButton);
  listItem.append(toggle, details, actions);

  toggle.addEventListener('click', () => toggleHabit(habit.id));
  removeButton.addEventListener('click', () => removeHabit(habit.id));

  return listItem;
}

function renderHabits() {
  habitList.innerHTML = '';

  if (state.habits.length === 0) {
    emptyState.classList.add('active');
    taskSubtitle.textContent = 'No habits yet. Add one above to begin.';
    progressBar.style.width = '0%';
    progressLabel.textContent = '0 / 0';
    totalHabits.textContent = '0';
    completedCount.textContent = '0';
    completionRate.textContent = '0%';
    currentStreak.textContent = String(state.global.currentStreak);
    longestStreak.textContent = String(state.global.longestStreak);
    return;
  }

  emptyState.classList.remove('active');
  taskSubtitle.textContent = 'Tap the circle to complete a habit for today.';

  state.habits.forEach((habit) => {
    habitList.append(buildListItem(habit));
  });

  const stats = getStats();
  totalHabits.textContent = String(stats.total);
  completedCount.textContent = String(stats.completed);
  completionRate.textContent = `${stats.rate}%`;
  progressBar.style.width = `${stats.rate}%`;
  progressLabel.textContent = `${stats.completed} / ${stats.total}`;
  currentStreak.textContent = String(state.global.currentStreak);
  longestStreak.textContent = String(state.global.longestStreak);
}

function createHabit(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    setFeedback('Please enter a habit name.', 'error');
    return;
  }

  const normalized = normalizeHabit(trimmed);
  if (state.habits.some((habit) => normalizeHabit(habit.title) === normalized)) {
    setFeedback('This habit already exists.', 'error');
    return;
  }

  state.habits.unshift({
    id: String(Date.now()),
    title: trimmed,
    completedToday: false,
    lastCompleted: null,
    streak: 0,
  });

  setFeedback('Habit added.', 'success');
  saveState();
  renderHabits();
}

function removeHabit(id) {
  state.habits = state.habits.filter((habit) => habit.id !== id);
  saveState();
  updateGlobalStreak();
  renderHabits();
  setFeedback('Habit removed.', 'neutral');
}

function toggleHabit(id) {
  const habit = state.habits.find((item) => item.id === id);
  if (!habit) return;

  const todayKey = today();
  const wasCompleted = habit.completedToday;

  if (wasCompleted && habit.lastCompleted === todayKey) {
    habit.completedToday = false;
    setFeedback('Habit unchecked.', 'neutral');
  } else {
    const streakContinues = habit.lastCompleted === yesterday();
    habit.streak = streakContinues ? habit.streak + 1 : 1;
    habit.completedToday = true;
    habit.lastCompleted = todayKey;
    setFeedback('Habit marked complete.', 'success');
  }

  saveState();
  updateGlobalStreak();
  renderHabits();
}

habitForm.addEventListener('submit', (event) => {
  event.preventDefault();
  createHabit(habitInput.value);
  habitInput.value = '';
  habitInput.focus();
});

habitInput.addEventListener('input', () => {
  if (feedback.dataset.type === 'error') {
    setFeedback('Use short habit names and avoid duplicates.', 'neutral');
  }
});

loadState();
updateGlobalStreak();
renderHabits();
