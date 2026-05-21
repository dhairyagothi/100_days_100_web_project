document.addEventListener('DOMContentLoaded', () => {
  renderHabits();

  document.getElementById('habitInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addHabit();
  });
});

function getHabits() {
  return JSON.parse(localStorage.getItem('habits')) || [];
}

function saveHabits(habits) {
  localStorage.setItem('habits', JSON.stringify(habits));
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0];
}

function addHabit() {
  const input = document.getElementById('habitInput');
  const name = input.value.trim();
  if (!name) return;

  const habits = getHabits();
  const duplicate = habits.find(h => h.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    alert('Habit already exists!');
    return;
  }

  habits.push({
    id: Date.now(),
    name,
    streak: 0,
    lastDone: null,
  });

  saveHabits(habits);
  input.value = '';
  renderHabits();
}

function markDone(id) {
  const habits = getHabits();
  const today = getTodayStr();

  const habit = habits.find(h => h.id === id);
  if (!habit) return;
  if (habit.lastDone === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (habit.lastDone === yesterdayStr) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }

  habit.lastDone = today;
  saveHabits(habits);
  renderHabits();
}

function deleteHabit(id) {
  if (!confirm('Delete this habit?')) return;
  let habits = getHabits();
  habits = habits.filter(h => h.id !== id);
  saveHabits(habits);
  renderHabits();
}

function renderHabits() {
  const habits = getHabits();
  const list = document.getElementById('habitList');
  const emptyMsg = document.getElementById('emptyMsg');
  const today = getTodayStr();

  list.innerHTML = '';

  if (habits.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  habits.forEach(habit => {
    const doneToday = habit.lastDone === today;

    const card = document.createElement('div');
    card.className = `habit-card${doneToday ? ' done' : ''}`;

    card.innerHTML = `
      <div class="habit-left">
        <div class="habit-name">${escapeHTML(habit.name)}</div>
        <div class="habit-streak">🔥 ${habit.streak} day streak <span>· Last done: ${habit.lastDone || 'Never'}</span></div>
      </div>
      <div class="habit-actions">
        <button class="btn-done ${doneToday ? 'completed' : ''}" 
          onclick="${doneToday ? '' : `markDone(${habit.id})`}" 
          ${doneToday ? 'disabled' : ''}>
          ${doneToday ? '✅ Done' : 'Mark Done'}
        </button>
        <button class="btn-delete" onclick="deleteHabit(${habit.id})">🗑️</button>
      </div>
    `;

    list.appendChild(card);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}
