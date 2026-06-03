/* ============================================================
   Self-Improvement Dashboard — script.js
   A single-page application for personal growth tracking.
   All data persists in localStorage under key 'si_state'.
   ============================================================ */

const App = (() => {
  'use strict';

  // ──────────────────────────────────────────────
  // 1. STATE MODULE
  // ──────────────────────────────────────────────
  const State = {
    goals: [],
    habits: [],
    achievements: [],
    challenges: { completedIds: [], lastDate: '' },
    learningPaths: {},
    activity: {},
    settings: { name: 'User', notifications: true, reminderInterval: 60, theme: 'dark' },
    firstVisit: null
  };

  const STORAGE_KEY = 'si_state';

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const defaults = {
          goals: [],
          habits: [],
          achievements: [],
          challenges: { completedIds: [], lastDate: '' },
          learningPaths: {},
          activity: {},
          settings: { name: 'User', notifications: true, reminderInterval: 60, theme: 'dark' },
          firstVisit: null
        };
        Object.keys(defaults).forEach(key => {
          if (parsed[key] !== undefined) {
            if (key === 'settings') {
              State.settings = { ...defaults.settings, ...parsed.settings };
            } else if (key === 'challenges') {
              State.challenges = { ...defaults.challenges, ...parsed.challenges };
            } else {
              State[key] = parsed[key];
            }
          } else {
            State[key] = defaults[key];
          }
        });
      }
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(State));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  function recordActivity() {
    const today = todayStr();
    if (!State.activity[today]) {
      State.activity[today] = 0;
    }
    State.activity[today]++;
    saveState();
  }

  // ──────────────────────────────────────────────
  // 2. UTILS MODULE
  // ──────────────────────────────────────────────
  function genId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
  }

  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }

  function daysBetween(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0');
  }

  function getGreeting() {
    const h = new Date().getHours();
    if (h < 6) return 'Good Night';
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    if (h < 21) return 'Good Evening';
    return 'Good Night';
  }

  function daysSinceStart() {
    if (!State.firstVisit) return 0;
    return daysBetween(State.firstVisit, new Date());
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ──────────────────────────────────────────────
  // QUOTES
  // ──────────────────────────────────────────────
  const QUOTES = [
    'The only way to do great work is to love what you do.',
    'Small daily improvements are the key to staggering long-term results.',
    'Success is the sum of small efforts repeated day in and day out.',
    'What you get by achieving your goals is not as important as what you become.',
    'The secret of getting ahead is getting started.',
    'Don\'t watch the clock; do what it does. Keep going.',
    'Believe you can and you\'re halfway there.',
    'It does not matter how slowly you go as long as you do not stop.',
    'The only impossible journey is the one you never begin.',
    'Your limitation—it\'s only your imagination.',
    'Push yourself, because no one else is going to do it for you.',
    'Great things never come from comfort zones.',
    'Dream it. Wish it. Do it.',
    'Success doesn\'t just find you. You have to go out and get it.',
    'The harder you work for something, the greater you\'ll feel when you achieve it.',
    'Dream bigger. Do bigger.',
    'Don\'t stop when you\'re tired. Stop when you\'re done.',
    'Wake up with determination. Go to bed with satisfaction.',
    'Do something today that your future self will thank you for.',
    'Discipline is the bridge between goals and accomplishment.'
  ];

  // ──────────────────────────────────────────────
  // 3. ROUTER MODULE
  // ──────────────────────────────────────────────
  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    goals: 'Goals',
    habits: 'Habits',
    analytics: 'Analytics',
    achievements: 'Achievements',
    learning: 'Learning Paths'
  };

  const viewRenderers = {
    dashboard: () => renderDashboard(),
    goals: () => renderGoals(),
    habits: () => renderHabits(),
    analytics: () => renderAnalytics(),
    achievements: () => renderAchievements(),
    learning: () => renderLearningPaths()
  };

  let currentView = 'dashboard';

  function navigate(viewName) {
    if (!viewRenderers[viewName]) viewName = 'dashboard';
    currentView = viewName;

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewName + '-view');
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
    if (navItem) navItem.classList.add('active');

    const titleEl = document.getElementById('page-title');
    if (titleEl) titleEl.textContent = PAGE_TITLES[viewName] || 'Dashboard';

    if (viewRenderers[viewName]) viewRenderers[viewName]();

    window.location.hash = viewName;

    // Close mobile sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('open');
  }

  function initRouter() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) navigate(view);
      });
    });

    document.querySelectorAll('.widget-action[data-view]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const view = item.getAttribute('data-view');
        if (view) navigate(view);
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== currentView) navigate(hash);
    });

    const hash = window.location.hash.replace('#', '');
    navigate(hash || 'dashboard');
  }

  // ──────────────────────────────────────────────
  // 4. DASHBOARD MODULE
  // ──────────────────────────────────────────────
  function renderDashboard() {
    // Greeting
    const greetingEl = document.getElementById('welcome-greeting');
    if (greetingEl) greetingEl.textContent = `${getGreeting()}, ${escapeHTML(State.settings.name)}!`;

    // Quote
    const quoteEl = document.getElementById('welcome-quote');
    if (quoteEl) {
      const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % QUOTES.length;
      quoteEl.textContent = `"${QUOTES[dayIndex]}"`;
    }

    // Date
    const dateEl = document.getElementById('welcome-date');
    if (dateEl) dateEl.textContent = formatDate(new Date());

    // Stats
    const goalsCompleted = State.goals.filter(g => g.completedAt).length;
    const streak = computeGlobalStreak();
    const daysActive = Object.keys(State.activity).length;
    const badgesEarned = State.achievements.length;

    animateCounter('stat-goals-completed', goalsCompleted);
    animateCounter('stat-current-streak', streak);
    animateCounter('stat-days-active', daysActive);
    animateCounter('stat-badges-earned', badgesEarned);

    // Top 3 active goals
    const goalsList = document.getElementById('dashboard-goals-list');
    if (goalsList) {
      const activeGoals = State.goals
        .filter(g => !g.archived && !g.completedAt)
        .sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'))
        .slice(0, 3);

      if (activeGoals.length === 0) {
        goalsList.innerHTML = '<p class="empty-text">No active goals yet. Create your first goal!</p>';
      } else {
        goalsList.innerHTML = activeGoals.map(g => `
          <div class="mini-goal-card" data-id="${g.id}">
            <div class="mini-goal-header">
              <span class="category-badge category-${g.category || 'learning'}">${escapeHTML(g.category || 'learning')}</span>
              <span class="priority-dot priority-${g.priority || 'medium'}"></span>
            </div>
            <h4 class="mini-goal-title">${escapeHTML(g.title)}</h4>
            <div class="mini-progress-bar">
              <div class="mini-progress-fill" style="width:${g.progress || 0}%;background:${progressColor(g.progress || 0)}"></div>
            </div>
            <span class="mini-goal-meta">${g.progress || 0}% · ${g.deadline ? formatDate(g.deadline) : 'No deadline'}</span>
          </div>
        `).join('');
      }
    }

    // Today's habits
    const habitsList = document.getElementById('dashboard-habits-list');
    if (habitsList) {
      const today = todayStr();
      const dailyHabits = State.habits.filter(h => h.frequency === 'daily' || h.frequency === 'weekly');
      if (dailyHabits.length === 0) {
        habitsList.innerHTML = '<p class="empty-text">No habits tracked yet. Start building habits!</p>';
      } else {
        habitsList.innerHTML = dailyHabits.map(h => {
          const done = h.completions && h.completions[today];
          return `
            <div class="dash-habit-row ${done ? 'completed' : ''}" data-habit-id="${h.id}">
              <button class="habit-check-btn ${done ? 'checked' : ''}" data-habit-id="${h.id}" aria-label="Toggle habit">
                <span class="check-circle">${done ? '✓' : ''}</span>
              </button>
              <span class="dash-habit-name">${escapeHTML(h.name)}</span>
              <span class="dash-habit-streak">🔥 ${calculateStreak(h)}</span>
            </div>
          `;
        }).join('');

        habitsList.querySelectorAll('.habit-check-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-habit-id');
            toggleHabitCompletion(id);
            renderDashboard();
          });
        });
      }
    }

    // Daily challenge
    renderDailyChallenge();

    // Recommendations
    const recContainer = document.getElementById('recommendations-list');
    if (recContainer) renderRecommendations(recContainer);

    // Recent achievements
    const achieveList = document.getElementById('dashboard-achievements-list');
    if (achieveList) {
      const recent = [...State.achievements]
        .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
        .slice(0, 3);
      if (recent.length === 0) {
        achieveList.innerHTML = '<p class="empty-text">No achievements unlocked yet.</p>';
      } else {
        achieveList.innerHTML = recent.map(a => {
          const def = ACHIEVEMENTS.find(d => d.id === a.id);
          if (!def) return '';
          return `<div class="mini-badge"><span class="mini-badge-icon">${def.icon}</span><span class="mini-badge-name">${escapeHTML(def.name)}</span></div>`;
        }).join('');
      }
    }

    // Mini heatmap (last 12 weeks)
    const miniHeatmap = document.getElementById('mini-heatmap');
    if (miniHeatmap) renderHeatmap('mini-heatmap', 12);
  }

  function animateCounter(elementId, target) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const duration = 800;
    const start = 0;
    const startTime = performance.now();
    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function computeGlobalStreak() {
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      if (State.activity[ds] && State.activity[ds] > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function progressColor(p) {
    if (p < 33) return 'var(--rose, #f43f5e)';
    if (p < 67) return 'var(--amber, #f59e0b)';
    return 'var(--emerald, #10b981)';
  }

  // ──────────────────────────────────────────────
  // 5. GOALS MODULE
  // ──────────────────────────────────────────────
  let goalsFilter = 'all';

  function renderGoals() {
    const grid = document.getElementById('goals-grid');
    if (!grid) return;

    // Filter chips
    const filterBar = document.getElementById('goals-filter-bar');
    if (filterBar) {
      filterBar.querySelectorAll('.filter-chip').forEach(chip => {
        const cat = chip.getAttribute('data-category') || chip.getAttribute('data-filter');
        if (goalsFilter === cat) {
          chip.classList.add('active');
          chip.setAttribute('aria-selected', 'true');
        } else {
          chip.classList.remove('active');
          chip.removeAttribute('aria-selected');
        }
        chip.onclick = (e) => {
          e.preventDefault();
          goalsFilter = cat;
          renderGoals();
        };
      });
    }

    // Filter goals
    let goals = State.goals.filter(g => !g.archived);
    if (goalsFilter !== 'all') {
      goals = goals.filter(g => g.category === goalsFilter);
    }

    if (goals.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🎯</div>
          <h3>No goals yet</h3>
          <p>Set your first goal to start your journey!</p>
          <button class="btn btn-primary" id="add-goal-empty-btn">+ Add Goal</button>
        </div>
      `;
      const emptyBtn = document.getElementById('add-goal-empty-btn');
      if (emptyBtn) emptyBtn.addEventListener('click', () => openGoalModal());
    } else {
      grid.innerHTML = goals.map(g => {
        const progress = g.progress || 0;
        return `
          <div class="goal-card" data-id="${g.id}">
            <div class="goal-card-header">
              <span class="category-badge category-${g.category || 'learning'}">${escapeHTML(g.category || 'learning')}</span>
              <span class="priority-dot priority-${g.priority || 'medium'}" title="Priority: ${g.priority || 'medium'}"></span>
            </div>
            <h3 class="goal-title">${escapeHTML(g.title)}</h3>
            <p class="goal-desc">${escapeHTML(g.description || '')}</p>
            <div class="goal-progress-ring">
              ${createProgressRingSVG(progress)}
            </div>
            <div class="goal-meta">
              <span class="goal-deadline">${g.deadline ? '📅 ' + formatDate(g.deadline) : 'No deadline'}</span>
              ${g.completedAt ? '<span class="goal-completed-badge">✅ Completed</span>' : ''}
            </div>
            <div class="goal-milestones-summary">
              ${(g.milestones && g.milestones.length > 0) ? `${g.milestones.filter(m => m.done).length}/${g.milestones.length} milestones` : ''}
            </div>
            <div class="goal-actions">
              <button class="btn-icon goal-edit-btn" data-id="${g.id}" title="Edit">✏️</button>
              <button class="btn-icon goal-archive-btn" data-id="${g.id}" title="Archive">📦</button>
              <button class="btn-icon goal-delete-btn" data-id="${g.id}" title="Delete">🗑️</button>
            </div>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.goal-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openGoalModal(btn.getAttribute('data-id')));
      });
      grid.querySelectorAll('.goal-archive-btn').forEach(btn => {
        btn.addEventListener('click', () => archiveGoal(btn.getAttribute('data-id')));
      });
      grid.querySelectorAll('.goal-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteGoal(btn.getAttribute('data-id')));
      });
    }

    // Add goal button
    const addBtn = document.getElementById('add-goal-btn');
    if (addBtn) {
      addBtn.onclick = () => openGoalModal();
    }
  }

  function openGoalModal(goalId) {
    const existing = goalId ? State.goals.find(g => g.id === goalId) : null;
    const title = existing ? 'Edit Goal' : 'Add New Goal';

    const milestones = existing && existing.milestones ? existing.milestones : [];
    const milestonesHTML = milestones.map((m, i) => `
      <div class="milestone-row" data-index="${i}">
        <input type="text" class="milestone-input" value="${escapeHTML(m.text)}" placeholder="Milestone ${i + 1}" />
        <button class="btn-icon remove-milestone" data-index="${i}">✕</button>
      </div>
    `).join('');

    const bodyHTML = `
      <form id="goal-form" class="modal-form">
        <div class="form-group">
          <label for="goal-title-input">Title *</label>
          <input type="text" id="goal-title-input" class="form-input" value="${existing ? escapeHTML(existing.title) : ''}" required placeholder="e.g., Learn JavaScript" />
        </div>
        <div class="form-group">
          <label for="goal-desc-input">Description</label>
          <textarea id="goal-desc-input" class="form-input" rows="3" placeholder="Describe your goal...">${existing ? escapeHTML(existing.description || '') : ''}</textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="goal-category-input">Category</label>
            <select id="goal-category-input" class="form-input">
              <option value="learning" ${existing && existing.category === 'learning' ? 'selected' : ''}>Learning</option>
              <option value="skill" ${existing && existing.category === 'skill' ? 'selected' : ''}>Skill</option>
              <option value="productivity" ${existing && existing.category === 'productivity' ? 'selected' : ''}>Productivity</option>
              <option value="health" ${existing && existing.category === 'health' ? 'selected' : ''}>Health</option>
              <option value="custom" ${existing && existing.category === 'custom' ? 'selected' : ''}>Custom</option>
            </select>
          </div>
          <div class="form-group">
            <label for="goal-priority-input">Priority</label>
            <select id="goal-priority-input" class="form-input">
              <option value="low" ${existing && existing.priority === 'low' ? 'selected' : ''}>Low</option>
              <option value="medium" ${(!existing || existing.priority === 'medium') ? 'selected' : ''}>Medium</option>
              <option value="high" ${existing && existing.priority === 'high' ? 'selected' : ''}>High</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label for="goal-deadline-input">Deadline</label>
          <input type="date" id="goal-deadline-input" class="form-input" value="${existing && existing.deadline ? existing.deadline : ''}" />
        </div>
        <div class="form-group">
          <label>Milestones</label>
          <div id="milestones-list">${milestonesHTML}</div>
          <button type="button" class="btn btn-secondary btn-sm" id="add-milestone-btn">+ Add Milestone</button>
        </div>
      </form>
    `;

    const footerHTML = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
      <button class="btn btn-primary" id="modal-save-goal-btn">${existing ? 'Save Changes' : 'Create Goal'}</button>
    `;

    openModal(title, bodyHTML, footerHTML);

    // Add milestone button
    document.getElementById('add-milestone-btn').addEventListener('click', () => {
      const list = document.getElementById('milestones-list');
      const idx = list.children.length;
      const row = document.createElement('div');
      row.className = 'milestone-row';
      row.setAttribute('data-index', idx);
      row.innerHTML = `
        <input type="text" class="milestone-input" placeholder="Milestone ${idx + 1}" />
        <button class="btn-icon remove-milestone" data-index="${idx}">✕</button>
      `;
      list.appendChild(row);
      row.querySelector('.remove-milestone').addEventListener('click', () => row.remove());
    });

    // Remove milestone buttons
    document.querySelectorAll('.remove-milestone').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.milestone-row').remove();
      });
    });

    // Cancel
    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);

    // Save
    document.getElementById('modal-save-goal-btn').addEventListener('click', () => {
      const titleVal = document.getElementById('goal-title-input').value.trim();
      if (!titleVal) {
        showNotification('Please enter a goal title.', 'error');
        return;
      }
      const desc = document.getElementById('goal-desc-input').value.trim();
      const category = document.getElementById('goal-category-input').value;
      const priority = document.getElementById('goal-priority-input').value;
      const deadline = document.getElementById('goal-deadline-input').value;

      const milestoneInputs = document.querySelectorAll('#milestones-list .milestone-input');
      const newMilestones = [];
      milestoneInputs.forEach(input => {
        const text = input.value.trim();
        if (text) {
          const existingMilestone = existing && existing.milestones
            ? existing.milestones.find(m => m.text === text)
            : null;
          newMilestones.push({
            id: existingMilestone ? existingMilestone.id : genId(),
            text: text,
            done: existingMilestone ? existingMilestone.done : false
          });
        }
      });

      if (existing) {
        existing.title = titleVal;
        existing.description = desc;
        existing.category = category;
        existing.priority = priority;
        existing.deadline = deadline;
        existing.milestones = newMilestones;
        existing.progress = newMilestones.length > 0
          ? Math.round((newMilestones.filter(m => m.done).length / newMilestones.length) * 100)
          : existing.progress;
        showNotification('Goal updated successfully!', 'success');
      } else {
        const newGoal = {
          id: genId(),
          title: titleVal,
          description: desc,
          category: category,
          priority: priority,
          deadline: deadline,
          milestones: newMilestones,
          progress: 0,
          archived: false,
          createdAt: new Date().toISOString(),
          completedAt: null
        };
        State.goals.push(newGoal);
        recordActivity();
        showNotification('Goal created successfully!', 'success');
      }

      saveState();
      closeModal();
      checkAchievements();
      renderGoals();
    });
  }

  function createProgressRingSVG(percentage) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percentage / 100);
    let color;
    if (percentage < 33) color = '#f43f5e';
    else if (percentage < 67) color = '#f59e0b';
    else color = '#10b981';

    return `
      <svg class="progress-ring" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="${radius}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8" />
        <circle cx="50" cy="50" r="${radius}" fill="none" stroke="${color}" stroke-width="8"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 50 50)" />
        <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
          fill="${color}" font-size="18" font-weight="bold">${Math.round(percentage)}%</text>
      </svg>
    `;
  }

  function deleteGoal(id) {
    if (!confirm('Are you sure you want to delete this goal? This cannot be undone.')) return;
    State.goals = State.goals.filter(g => g.id !== id);
    saveState();
    showNotification('Goal deleted.', 'info');
    renderGoals();
  }

  function archiveGoal(id) {
    const goal = State.goals.find(g => g.id === id);
    if (!goal) return;
    goal.archived = !goal.archived;
    saveState();
    showNotification(goal.archived ? 'Goal archived.' : 'Goal unarchived.', 'info');
    renderGoals();
  }

  function updateMilestone(goalId, milestoneId) {
    const goal = State.goals.find(g => g.id === goalId);
    if (!goal || !goal.milestones) return;
    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;
    milestone.done = !milestone.done;
    const total = goal.milestones.length;
    const done = goal.milestones.filter(m => m.done).length;
    goal.progress = total > 0 ? Math.round((done / total) * 100) : 0;
    if (goal.progress === 100 && !goal.completedAt) {
      goal.completedAt = new Date().toISOString();
      showNotification('🎉 Goal completed! Amazing work!', 'success');
      fireConfetti();
    } else if (goal.progress < 100 && goal.completedAt) {
      goal.completedAt = null;
    }
    recordActivity();
    saveState();
    checkAchievements();
  }

  // ──────────────────────────────────────────────
  // 6. HABITS MODULE
  // ──────────────────────────────────────────────
  let habitsFilter = 'all';

  function renderHabits() {
    // Filter
    const filterBar = document.getElementById('habits-filter-bar');
    if (filterBar) {
      filterBar.querySelectorAll('.filter-chip').forEach(chip => {
        const filterVal = chip.getAttribute('data-filter');
        if (habitsFilter === filterVal) {
          chip.classList.add('active');
          chip.setAttribute('aria-selected', 'true');
        } else {
          chip.classList.remove('active');
          chip.removeAttribute('aria-selected');
        }
        chip.onclick = (e) => {
          e.preventDefault();
          habitsFilter = filterVal;
          renderHabits();
        };
      });
    }

    // Stats
    const streak = computeGlobalStreak();
    const longestStreak = computeLongestGlobalStreak();
    const completionRate = calculateCompletionRate();
    const consistency = calculateConsistencyScore();

    const statEls = {
      'habit-stat-streak': streak,
      'habit-stat-longest': longestStreak,
      'habit-stat-rate': Math.round(completionRate) + '%',
      'habit-stat-consistency': Math.round(consistency) + '%'
    };
    Object.entries(statEls).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    // Habits list
    const list = document.getElementById('habits-list');
    if (!list) return;

    let habits = State.habits;
    if (habitsFilter !== 'all') {
      habits = habits.filter(h => h.frequency === habitsFilter);
    }

    if (habits.length === 0) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🌱</div>
          <h3>No habits yet</h3>
          <p>Start building positive habits today!</p>
          <button class="btn btn-primary" id="add-habit-empty-btn">+ Add Habit</button>
        </div>
      `;
      const emptyBtn = document.getElementById('add-habit-empty-btn');
      if (emptyBtn) emptyBtn.addEventListener('click', () => openHabitModal());
    } else {
      const today = todayStr();
      list.innerHTML = habits.map(h => {
        const done = h.completions && h.completions[today];
        const streakVal = calculateStreak(h);
        return `
          <div class="habit-item ${done ? 'completed' : ''}" data-id="${h.id}">
            <button class="habit-check-btn ${done ? 'checked' : ''}" data-habit-id="${h.id}" aria-label="Toggle habit completion">
              <span class="check-circle">${done ? '✓' : ''}</span>
            </button>
            <div class="habit-info">
              <span class="habit-name">${escapeHTML(h.name)}</span>
              <span class="habit-streak">${streakVal > 0 ? '🔥 ' + streakVal + ' day' + (streakVal > 1 ? 's' : '') : ''}</span>
            </div>
            <span class="frequency-badge freq-${h.frequency}">${h.frequency}</span>
            <div class="habit-actions">
              <button class="btn-icon habit-edit-btn" data-id="${h.id}" title="Edit">✏️</button>
              <button class="btn-icon habit-delete-btn" data-id="${h.id}" title="Delete">🗑️</button>
            </div>
          </div>
        `;
      }).join('');

      list.querySelectorAll('.habit-check-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          toggleHabitCompletion(btn.getAttribute('data-habit-id'));
          renderHabits();
        });
      });
      list.querySelectorAll('.habit-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openHabitModal(btn.getAttribute('data-id')));
      });
      list.querySelectorAll('.habit-delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm('Delete this habit?')) {
            State.habits = State.habits.filter(h => h.id !== btn.getAttribute('data-id'));
            saveState();
            showNotification('Habit deleted.', 'info');
            renderHabits();
          }
        });
      });
    }

    // Add habit button
    const addBtn = document.getElementById('add-habit-btn');
    if (addBtn) addBtn.onclick = () => openHabitModal();

    // Heatmap
    renderHeatmap('habit-heatmap', 20);
  }

  function openHabitModal(habitId) {
    const existing = habitId ? State.habits.find(h => h.id === habitId) : null;
    const title = existing ? 'Edit Habit' : 'Add New Habit';

    const bodyHTML = `
      <form id="habit-form" class="modal-form">
        <div class="form-group">
          <label for="habit-name-input">Habit Name *</label>
          <input type="text" id="habit-name-input" class="form-input" value="${existing ? escapeHTML(existing.name) : ''}" required placeholder="e.g., Read 30 minutes" />
        </div>
        <div class="form-group">
          <label for="habit-frequency-input">Frequency</label>
          <select id="habit-frequency-input" class="form-input">
            <option value="daily" ${(!existing || existing.frequency === 'daily') ? 'selected' : ''}>Daily</option>
            <option value="weekly" ${existing && existing.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
          </select>
        </div>
        <div class="form-group" id="target-per-week-group" style="display:${existing && existing.frequency === 'weekly' ? 'block' : 'none'}">
          <label for="habit-target-input">Target per Week</label>
          <input type="number" id="habit-target-input" class="form-input" min="1" max="7" value="${existing && existing.targetPerWeek ? existing.targetPerWeek : 3}" />
        </div>
      </form>
    `;

    const footerHTML = `
      <button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button>
      <button class="btn btn-primary" id="modal-save-habit-btn">${existing ? 'Save Changes' : 'Create Habit'}</button>
    `;

    openModal(title, bodyHTML, footerHTML);

    const freqSelect = document.getElementById('habit-frequency-input');
    const targetGroup = document.getElementById('target-per-week-group');
    freqSelect.addEventListener('change', () => {
      targetGroup.style.display = freqSelect.value === 'weekly' ? 'block' : 'none';
    });

    document.getElementById('modal-cancel-btn').addEventListener('click', closeModal);

    document.getElementById('modal-save-habit-btn').addEventListener('click', () => {
      const name = document.getElementById('habit-name-input').value.trim();
      if (!name) {
        showNotification('Please enter a habit name.', 'error');
        return;
      }
      const frequency = document.getElementById('habit-frequency-input').value;
      const targetPerWeek = parseInt(document.getElementById('habit-target-input').value) || 3;

      if (existing) {
        existing.name = name;
        existing.frequency = frequency;
        existing.targetPerWeek = targetPerWeek;
        showNotification('Habit updated!', 'success');
      } else {
        State.habits.push({
          id: genId(),
          name: name,
          frequency: frequency,
          targetPerWeek: targetPerWeek,
          completions: {},
          createdAt: new Date().toISOString()
        });
        recordActivity();
        showNotification('Habit created!', 'success');
      }

      saveState();
      closeModal();
      checkAchievements();
      renderHabits();
    });
  }

  function toggleHabitCompletion(habitId) {
    const habit = State.habits.find(h => h.id === habitId);
    if (!habit) return;
    const today = todayStr();
    if (!habit.completions) habit.completions = {};
    if (habit.completions[today]) {
      delete habit.completions[today];
    } else {
      habit.completions[today] = true;
    }
    recordActivity();
    saveState();
    checkAchievements();
  }

  function calculateStreak(habit) {
    if (!habit.completions) return 0;
    let streak = 0;
    const d = new Date();

    if (habit.frequency === 'weekly') {
      // Count consecutive weeks with at least targetPerWeek completions
      const target = habit.targetPerWeek || 1;
      while (true) {
        const weekStart = new Date(d);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        let weekCount = 0;
        for (let i = 0; i < 7; i++) {
          const ds = weekStart.getFullYear() + '-' +
            String(weekStart.getMonth() + 1).padStart(2, '0') + '-' +
            String(weekStart.getDate()).padStart(2, '0');
          if (habit.completions[ds]) weekCount++;
          weekStart.setDate(weekStart.getDate() + 1);
        }
        if (weekCount >= target) {
          streak++;
          d.setDate(d.getDate() - 7);
        } else {
          break;
        }
      }
      return streak;
    }

    // Daily
    while (true) {
      const ds = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      if (habit.completions[ds]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  function calculateLongestStreak(habit) {
    if (!habit.completions) return 0;
    const dates = Object.keys(habit.completions).sort();
    if (dates.length === 0) return 0;

    let longest = 1;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const diff = daysBetween(dates[i - 1], dates[i]);
      if (diff === 1) {
        current++;
        if (current > longest) longest = current;
      } else {
        current = 1;
      }
    }
    return longest;
  }

  function computeLongestGlobalStreak() {
    const allDates = Object.keys(State.activity).sort();
    if (allDates.length === 0) return 0;
    let longest = 1;
    let current = 1;
    for (let i = 1; i < allDates.length; i++) {
      const diff = daysBetween(allDates[i - 1], allDates[i]);
      if (diff === 1) {
        current++;
        if (current > longest) longest = current;
      } else {
        current = 1;
      }
    }
    return longest;
  }

  function calculateCompletionRate() {
    if (State.habits.length === 0) return 0;
    const today = new Date();
    let expected = 0;
    let actual = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      State.habits.forEach(h => {
        if (h.frequency === 'daily') {
          expected++;
          if (h.completions && h.completions[ds]) actual++;
        } else if (h.frequency === 'weekly') {
          expected += (h.targetPerWeek || 3) / 7;
          if (h.completions && h.completions[ds]) actual++;
        }
      });
    }
    return expected > 0 ? (actual / expected) * 100 : 0;
  }

  function calculateConsistencyScore() {
    if (State.habits.length === 0) return 0;
    let totalRate = 0;
    State.habits.forEach(h => {
      const dates = Object.keys(h.completions || {});
      const today = new Date();
      let expected = 0;
      let actual = 0;
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
        if (h.frequency === 'daily') {
          expected++;
          if (h.completions && h.completions[ds]) actual++;
        } else {
          expected += (h.targetPerWeek || 3) / 7;
          if (h.completions && h.completions[ds]) actual++;
        }
      }
      totalRate += expected > 0 ? (actual / expected) * 100 : 0;
    });
    return totalRate / State.habits.length;
  }

  function renderHeatmap(containerId, weeks) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const today = new Date();
    const totalDays = weeks * 7;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - totalDays + 1);

    // Mini heatmap layout (row-by-row simple wrapping, 7 columns)
    if (containerId === 'mini-heatmap') {
      startDate.setDate(startDate.getDate() - startDate.getDay());
      let html = '';
      for (let w = 0; w < weeks; w++) {
        for (let day = 0; day < 7; day++) {
          const d = new Date(startDate);
          d.setDate(d.getDate() + w * 7 + day);
          const ds = d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
          const count = State.activity[ds] || 0;
          let level = 0;
          if (count >= 6) level = 4;
          else if (count >= 4) level = 3;
          else if (count >= 2) level = 2;
          else if (count >= 1) level = 1;

          const isFuture = d > today;
          html += `<div class="heatmap-cell ${isFuture ? 'future' : ''}" data-level="${isFuture ? '' : level}" data-date="${ds}" title="${ds}: ${count} activities"></div>`;
        }
      }
      container.innerHTML = html;
      return;
    }

    // Standard Heatmaps: Align to Sunday for column-major layouts (weeks as columns, days as rows)
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let html = '<div class="heatmap-wrapper">';

    // Day labels
    html += '<div class="heatmap-day-labels">';
    dayLabels.forEach(label => {
      html += `<div class="heatmap-day-label">${label}</div>`;
    });
    html += '</div>';

    html += '<div class="heatmap-grid-wrapper">';

    // Month labels
    html += `<div class="heatmap-month-labels" style="--weeks: ${weeks}">`;
    let lastMonth = -1;
    for (let w = 0; w < weeks; w++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + w * 7);
      const m = d.getMonth();
      if (m !== lastMonth) {
        html += `<div class="heatmap-month-label" style="grid-column:${w + 1}">${months[m]}</div>`;
        lastMonth = m;
      }
    }
    html += '</div>';

    // Grid (Fills column by column: w is outer loop, day is inner loop)
    html += '<div class="heatmap-container">';
    for (let w = 0; w < weeks; w++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + w * 7 + day);
        const ds = d.getFullYear() + '-' +
          String(d.getMonth() + 1).padStart(2, '0') + '-' +
          String(d.getDate()).padStart(2, '0');
        const count = State.activity[ds] || 0;
        let level = 0;
        if (count >= 6) level = 4;
        else if (count >= 4) level = 3;
        else if (count >= 2) level = 2;
        else if (count >= 1) level = 1;

        const isFuture = d > today;
        html += `<div class="heatmap-cell ${isFuture ? 'future' : ''}" data-level="${isFuture ? '' : level}" data-date="${ds}" title="${ds}: ${count} activities"></div>`;
      }
    }
    html += '</div></div></div>';

    container.innerHTML = html;
  }

  // ──────────────────────────────────────────────
  // 7. ANALYTICS MODULE
  // ──────────────────────────────────────────────
  let analyticsPeriod = '30';

  function renderAnalytics() {
    // Period filter
    const filterBar = document.getElementById('analytics-filter-bar');
    if (filterBar) {
      filterBar.querySelectorAll('.filter-chip').forEach(chip => {
        const periodVal = chip.getAttribute('data-period');
        if (analyticsPeriod === periodVal) {
          chip.classList.add('active');
          chip.setAttribute('aria-selected', 'true');
        } else {
          chip.classList.remove('active');
          chip.removeAttribute('aria-selected');
        }
        chip.onclick = (e) => {
          e.preventDefault();
          analyticsPeriod = periodVal;
          renderAnalytics();
        };
      });
    }

    const days = parseInt(analyticsPeriod) || 30;

    // Goal completion chart
    const goalChartContainer = document.getElementById('goal-completion-chart');
    if (goalChartContainer) {
      const data = buildGoalCompletionData(days);
      renderLineChart(goalChartContainer, data, { height: 250, color: '#8b5cf6' });
    }

    // Habit consistency chart
    const habitChartContainer = document.getElementById('habit-consistency-chart');
    if (habitChartContainer) {
      const data = buildHabitConsistencyData();
      renderBarChart(habitChartContainer, data, { height: 250 });
    }

    // Yearly heatmap
    renderHeatmap('yearly-heatmap', 52);

    // Time invested
    const timeEl = document.getElementById('time-invested-val');
    if (timeEl) {
      const totalActivities = Object.values(State.activity).reduce((s, v) => s + v, 0);
      const estimatedMinutes = totalActivities * 15;
      const hours = Math.floor(estimatedMinutes / 60);
      const mins = estimatedMinutes % 60;
      timeEl.textContent = `${hours}h ${mins}m`;
    }

    // Engagement list
    const engList = document.getElementById('engagement-list');
    if (engList) {
      const totalGoals = State.goals.length;
      const completedGoals = State.goals.filter(g => g.completedAt).length;
      const totalHabits = State.habits.length;
      const totalCompletions = State.habits.reduce((s, h) => s + Object.keys(h.completions || {}).length, 0);
      const daysActive = Object.keys(State.activity).length;
      const avgPerDay = daysActive > 0 ? (Object.values(State.activity).reduce((s, v) => s + v, 0) / daysActive).toFixed(1) : 0;

      engList.innerHTML = `
        <div class="engagement-item"><span class="engagement-label">Total Goals</span><span class="engagement-value">${totalGoals}</span></div>
        <div class="engagement-item"><span class="engagement-label">Completed Goals</span><span class="engagement-value">${completedGoals}</span></div>
        <div class="engagement-item"><span class="engagement-label">Active Habits</span><span class="engagement-value">${totalHabits}</span></div>
        <div class="engagement-item"><span class="engagement-label">Total Completions</span><span class="engagement-value">${totalCompletions}</span></div>
        <div class="engagement-item"><span class="engagement-label">Days Active</span><span class="engagement-value">${daysActive}</span></div>
        <div class="engagement-item"><span class="engagement-label">Avg. Activities/Day</span><span class="engagement-value">${avgPerDay}</span></div>
      `;
    }
  }

  function buildGoalCompletionData(days) {
    const data = [];
    const interval = Math.max(1, Math.floor(days / 8));
    for (let i = days; i >= 0; i -= interval) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.getFullYear() + '-' +
        String(d.getMonth() + 1).padStart(2, '0') + '-' +
        String(d.getDate()).padStart(2, '0');
      const completed = State.goals.filter(g =>
        g.completedAt && g.completedAt.substring(0, 10) <= ds
      ).length;
      const label = (d.getMonth() + 1) + '/' + d.getDate();
      data.push({ label, value: completed });
    }
    return data;
  }

  function buildHabitConsistencyData() {
    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#6366f1', '#14b8a6'];
    return State.habits.slice(0, 8).map((h, i) => {
      const total = Object.keys(h.completions || {}).length;
      const created = new Date(h.createdAt);
      const daysExist = Math.max(1, daysBetween(created, new Date()));
      const rate = Math.min(100, Math.round((total / daysExist) * 100));
      return {
        label: h.name.length > 12 ? h.name.substring(0, 10) + '..' : h.name,
        value: rate,
        color: colors[i % colors.length]
      };
    });
  }

  function renderLineChart(container, data, options) {
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-text">No data available yet.</p>';
      return;
    }

    const width = 600;
    const height = options.height || 250;
    const padding = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(1, ...data.map(d => d.value));
    const points = data.map((d, i) => ({
      x: padding.left + (i / Math.max(1, data.length - 1)) * chartW,
      y: padding.top + chartH - (d.value / maxVal) * chartH,
      label: d.label,
      value: d.value
    }));

    // Build path with cubic bezier
    let pathD = '';
    if (points.length === 1) {
      pathD = `M ${points[0].x} ${points[0].y}`;
    } else {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx1 = prev.x + (curr.x - prev.x) / 3;
        const cpy1 = prev.y;
        const cpx2 = curr.x - (curr.x - prev.x) / 3;
        const cpy2 = curr.y;
        pathD += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
      }
    }

    // Grid lines
    let gridLines = '';
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (i / gridCount) * chartH;
      const val = Math.round(maxVal - (i / gridCount) * maxVal);
      gridLines += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;
      gridLines += `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="11">${val}</text>`;
    }

    // X labels
    let xLabels = '';
    points.forEach((p, i) => {
      if (i % Math.max(1, Math.floor(points.length / 6)) === 0 || i === points.length - 1) {
        xLabels += `<text x="${p.x}" y="${height - 5}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="11">${p.label}</text>`;
      }
    });

    // Dots
    const dots = points.map(p => `
      <circle cx="${p.x}" cy="${p.y}" r="4" fill="${options.color || '#8b5cf6'}" stroke="rgba(0,0,0,0.3)" stroke-width="1" />
    `).join('');

    // Area fill
    const areaD = pathD +
      ` L ${points[points.length - 1].x} ${padding.top + chartH}` +
      ` L ${points[0].x} ${padding.top + chartH} Z`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${options.color || '#8b5cf6'}" stop-opacity="0.3" />
            <stop offset="100%" stop-color="${options.color || '#8b5cf6'}" stop-opacity="0.02" />
          </linearGradient>
        </defs>
        ${gridLines}
        <path d="${areaD}" fill="url(#areaGrad)" />
        <path d="${pathD}" fill="none" stroke="${options.color || '#8b5cf6'}" stroke-width="2.5" stroke-linecap="round" />
        ${dots}
        ${xLabels}
      </svg>
    `;
  }

  function renderBarChart(container, data, options) {
    if (!data || data.length === 0) {
      container.innerHTML = '<p class="empty-text">No habits to display yet.</p>';
      return;
    }

    const width = 600;
    const height = options.height || 250;
    const padding = { top: 20, right: 20, bottom: 50, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxVal = Math.max(1, ...data.map(d => d.value));
    const barWidth = Math.min(50, chartW / data.length - 8);

    // Grid lines
    let gridLines = '';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (i / 4) * chartH;
      const val = Math.round(maxVal - (i / 4) * maxVal);
      gridLines += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />`;
      gridLines += `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="11">${val}%</text>`;
    }

    const bars = data.map((d, i) => {
      const barH = (d.value / maxVal) * chartH;
      const x = padding.left + (i / data.length) * chartW + (chartW / data.length - barWidth) / 2;
      const y = padding.top + chartH - barH;
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" rx="4" fill="${d.color || '#8b5cf6'}" opacity="0.85" />
        <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" fill="rgba(255,255,255,0.8)" font-size="11">${d.value}%</text>
        <text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="10" transform="rotate(-25 ${x + barWidth / 2} ${height - 10})">${d.label}</text>
      `;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" class="chart-svg" preserveAspectRatio="xMidYMid meet">
        ${gridLines}
        ${bars}
      </svg>
    `;
  }

  // ──────────────────────────────────────────────
  // 8. ACHIEVEMENTS MODULE
  // ──────────────────────────────────────────────
  const ACHIEVEMENTS = [
    {
      id: 'first_goal', icon: '🎯', name: 'First Goal', desc: 'Complete your first goal', points: 10,
      check: (s) => s.goals.filter(g => g.completedAt).length >= 1
    },
    {
      id: 'streak_7', icon: '🔥', name: '7-Day Streak', desc: '7-day habit streak', points: 25,
      check: () => computeGlobalStreak() >= 7
    },
    {
      id: 'streak_30', icon: '🏆', name: '30-Day Champion', desc: '30-day consistency', points: 100,
      check: () => computeGlobalStreak() >= 30
    },
    {
      id: 'learning_explorer', icon: '📚', name: 'Learning Explorer', desc: 'Complete a learning module', points: 15,
      check: (s) => {
        for (const pid of Object.keys(s.learningPaths)) {
          if (s.learningPaths[pid].completedModules && s.learningPaths[pid].completedModules.length > 0) return true;
        }
        return false;
      }
    },
    {
      id: 'productivity_master', icon: '⚡', name: 'Productivity Master', desc: 'Complete 10 goals', points: 50,
      check: (s) => s.goals.filter(g => g.completedAt).length >= 10
    },
    {
      id: 'habit_builder', icon: '🌟', name: 'Habit Builder', desc: 'Create 5 habits', points: 20,
      check: (s) => s.habits.length >= 5
    },
    {
      id: 'diamond_streak', icon: '💎', name: 'Diamond Streak', desc: '100-day streak', points: 500,
      check: () => computeGlobalStreak() >= 100
    },
    {
      id: 'customizer', icon: '🎨', name: 'Customizer', desc: 'Create a custom category goal', points: 10,
      check: (s) => s.goals.some(g => g.category === 'custom')
    },
    {
      id: 'challenger', icon: '🧠', name: 'Challenge Accepted', desc: 'Complete 10 daily challenges', points: 30,
      check: (s) => s.challenges.completedIds.length >= 10
    },
    {
      id: 'quick_start', icon: '🚀', name: 'Quick Start', desc: 'Complete 3 goals in first week', points: 40,
      check: (s) => {
        if (!s.firstVisit) return false;
        const weekLater = new Date(s.firstVisit);
        weekLater.setDate(weekLater.getDate() + 7);
        const completedInWeek = s.goals.filter(g =>
          g.completedAt && new Date(g.completedAt) <= weekLater
        ).length;
        return completedInWeek >= 3;
      }
    },
    {
      id: 'three_goals', icon: '🎯', name: 'Triple Threat', desc: 'Complete 3 goals', points: 20,
      check: (s) => s.goals.filter(g => g.completedAt).length >= 3
    },
    {
      id: 'five_habits', icon: '✅', name: 'Habit Collector', desc: 'Track 5 habits simultaneously', points: 15,
      check: (s) => s.habits.length >= 5
    },
    {
      id: 'week_active', icon: '📅', name: 'Week Warrior', desc: 'Active for 7 days', points: 15,
      check: (s) => Object.keys(s.activity).length >= 7
    },
    {
      id: 'month_active', icon: '📅', name: 'Monthly Master', desc: 'Active for 30 days', points: 50,
      check: (s) => Object.keys(s.activity).length >= 30
    },
    {
      id: 'all_categories', icon: '🌈', name: 'Well-Rounded', desc: 'Goals in all categories', points: 30,
      check: (s) => {
        const cats = new Set(s.goals.map(g => g.category));
        return ['learning', 'skill', 'productivity', 'health', 'custom'].every(c => cats.has(c));
      }
    },
    {
      id: 'perfect_day', icon: '⭐', name: 'Perfect Day', desc: 'Complete all habits in one day', points: 25,
      check: (s) => {
        if (s.habits.length === 0) return false;
        const dailyHabits = s.habits.filter(h => h.frequency === 'daily');
        if (dailyHabits.length === 0) return false;
        const allDates = new Set();
        dailyHabits.forEach(h => {
          Object.keys(h.completions || {}).forEach(d => allDates.add(d));
        });
        for (const date of allDates) {
          if (dailyHabits.every(h => h.completions && h.completions[date])) return true;
        }
        return false;
      }
    },
    {
      id: 'ten_challenges', icon: '💪', name: 'Challenge Champion', desc: 'Complete 10 challenges', points: 30,
      check: (s) => s.challenges.completedIds.length >= 10
    },
    {
      id: 'path_complete', icon: '🛤️', name: 'Path Finder', desc: 'Complete a learning path', points: 100,
      check: (s) => {
        for (const path of LEARNING_PATHS) {
          const state = s.learningPaths[path.id];
          if (state && state.completedModules && state.completedModules.length === path.modules.length) return true;
        }
        return false;
      }
    },
    {
      id: 'high_consistency', icon: '📊', name: 'Consistency King', desc: '90%+ consistency score', points: 75,
      check: () => calculateConsistencyScore() >= 90
    },
    {
      id: 'data_master', icon: '💾', name: 'Data Master', desc: 'Export your data', points: 5,
      check: (s) => s._exported === true
    }
  ];

  function checkAchievements() {
    let newUnlocks = false;
    ACHIEVEMENTS.forEach(ach => {
      const alreadyUnlocked = State.achievements.some(a => a.id === ach.id);
      if (!alreadyUnlocked && ach.check(State)) {
        State.achievements.push({ id: ach.id, unlockedAt: new Date().toISOString() });
        showNotification(`🏆 Achievement Unlocked: ${ach.name}! (+${ach.points} pts)`, 'success', 5000);
        newUnlocks = true;
      }
    });
    if (newUnlocks) {
      saveState();
      fireConfetti();
    }
  }

  function renderAchievements() {
    const grid = document.getElementById('badges-grid');
    if (!grid) return;

    const level = getUserLevel();
    const totalPoints = getTotalPoints();
    const nextLevel = getNextLevelThreshold(level);

    // Update achievements stats
    const unlockedEl = document.getElementById('ach-unlocked');
    if (unlockedEl) unlockedEl.textContent = State.achievements.length;
    const totalEl = document.getElementById('ach-total');
    if (totalEl) totalEl.textContent = ACHIEVEMENTS.length;
    const achPointsEl = document.getElementById('ach-points');
    if (achPointsEl) achPointsEl.textContent = totalPoints;

    // Level display
    const levelEl = document.getElementById('user-level');
    if (levelEl) levelEl.textContent = `Level ${level}`;
    const pointsEl = document.getElementById('user-points');
    if (pointsEl) pointsEl.textContent = `${totalPoints} pts`;
    const levelProgress = document.getElementById('level-progress-fill');
    if (levelProgress) {
      const prevThreshold = getLevelThreshold(level);
      const pct = nextLevel > prevThreshold ? ((totalPoints - prevThreshold) / (nextLevel - prevThreshold)) * 100 : 100;
      levelProgress.style.width = Math.min(100, pct) + '%';
    }
    const nextLevelEl = document.getElementById('next-level-pts');
    if (nextLevelEl) nextLevelEl.textContent = `${nextLevel - totalPoints} pts to Level ${level + 1}`;

    grid.innerHTML = ACHIEVEMENTS.map(ach => {
      const unlocked = State.achievements.find(a => a.id === ach.id);
      return `
        <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
          <div class="badge-icon">${ach.icon}</div>
          <h4 class="badge-name">${escapeHTML(ach.name)}</h4>
          <p class="badge-desc">${escapeHTML(ach.desc)}</p>
          <div class="badge-footer">
            <span class="badge-points">${ach.points} pts</span>
            ${unlocked ? `<span class="badge-date">${formatDate(unlocked.unlockedAt)}</span>` : '<span class="badge-locked">🔒 Locked</span>'}
          </div>
        </div>
      `;
    }).join('');
  }

  function getTotalPoints() {
    return State.achievements.reduce((sum, a) => {
      const def = ACHIEVEMENTS.find(d => d.id === a.id);
      return sum + (def ? def.points : 0);
    }, 0);
  }

  function getUserLevel() {
    const pts = getTotalPoints();
    if (pts < 50) return 1;
    if (pts < 150) return 2;
    if (pts < 300) return 3;
    if (pts < 500) return 4;
    if (pts < 750) return 5;
    if (pts < 1000) return 6;
    return 7;
  }

  function getLevelThreshold(level) {
    const thresholds = [0, 0, 50, 150, 300, 500, 750, 1000];
    return thresholds[level] || 0;
  }

  function getNextLevelThreshold(level) {
    const thresholds = [0, 50, 150, 300, 500, 750, 1000, 1500];
    return thresholds[level] || 1500;
  }

  // ──────────────────────────────────────────────
  // 9. RECOMMENDATIONS MODULE
  // ──────────────────────────────────────────────
  const RECOMMENDATION_RULES = [
    {
      icon: '🎯',
      title: 'Create Your First Goal',
      desc: 'Setting goals gives you direction. Start by creating one achievable goal.',
      action: 'goals',
      score: () => State.goals.length === 0 ? 100 : 0
    },
    {
      icon: '⏰',
      title: 'Goal Deadline Approaching',
      desc: 'You have goals with upcoming deadlines. Focus on completing them!',
      action: 'goals',
      score: () => {
        const urgent = State.goals.filter(g => {
          if (!g.deadline || g.completedAt || g.archived) return false;
          return daysBetween(new Date(), new Date(g.deadline)) <= 7;
        });
        return urgent.length > 0 ? 90 : 0;
      }
    },
    {
      icon: '🔥',
      title: 'Keep Your Streak Alive',
      desc: 'You missed yesterday\'s habits. Complete them today to maintain your streak!',
      action: 'habits',
      score: () => {
        if (State.habits.length === 0) return 0;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const ys = yesterday.getFullYear() + '-' +
          String(yesterday.getMonth() + 1).padStart(2, '0') + '-' +
          String(yesterday.getDate()).padStart(2, '0');
        const missedYesterday = State.habits.filter(h =>
          h.frequency === 'daily' && (!h.completions || !h.completions[ys])
        );
        return missedYesterday.length > 0 ? 85 : 0;
      }
    },
    {
      icon: '🌅',
      title: 'Morning Routine',
      desc: 'Start your day with intention. Review your goals and plan your day.',
      action: 'dashboard',
      score: () => new Date().getHours() < 12 ? 60 : 0
    },
    {
      icon: '🌙',
      title: 'Evening Reflection',
      desc: 'Reflect on your day. What went well? What can you improve?',
      action: 'dashboard',
      score: () => new Date().getHours() >= 18 ? 60 : 0
    },
    {
      icon: '🎉',
      title: 'Impressive Consistency!',
      desc: 'Your consistency score is excellent. Consider leveling up your challenges.',
      action: 'habits',
      score: () => calculateConsistencyScore() >= 80 ? 70 : 0
    },
    {
      icon: '💪',
      title: 'Don\'t Give Up!',
      desc: 'Every small step counts. Pick one habit and complete it today.',
      action: 'habits',
      score: () => {
        const rate = calculateCompletionRate();
        return (rate > 0 && rate < 30) ? 75 : 0;
      }
    },
    {
      icon: '📚',
      title: 'Start a Learning Path',
      desc: 'Explore structured learning paths to build new skills systematically.',
      action: 'learning',
      score: () => Object.keys(State.learningPaths).length === 0 ? 65 : 0
    },
    {
      icon: '🌱',
      title: 'Build a New Habit',
      desc: 'Habits are the building blocks of success. Start tracking a new one.',
      action: 'habits',
      score: () => State.habits.length === 0 ? 95 : (State.habits.length < 3 ? 50 : 0)
    },
    {
      icon: '📊',
      title: 'Check Your Analytics',
      desc: 'Review your progress charts to understand your patterns better.',
      action: 'analytics',
      score: () => daysSinceStart() >= 7 ? 40 : 0
    },
    {
      icon: '🏅',
      title: 'Chase Achievements',
      desc: 'You have locked achievements waiting. Check what you can unlock next!',
      action: 'achievements',
      score: () => {
        const locked = ACHIEVEMENTS.length - State.achievements.length;
        return locked > 0 ? 35 : 0;
      }
    },
    {
      icon: '🧠',
      title: 'Daily Challenge',
      desc: 'Complete today\'s challenge for bonus points and growth.',
      action: 'dashboard',
      score: () => {
        const today = todayStr();
        const ch = getDailyChallenge();
        if (!ch) return 0;
        return State.challenges.completedIds.includes(ch.id + '_' + today) ? 0 : 55;
      }
    }
  ];

  function generateRecommendations() {
    return RECOMMENDATION_RULES
      .map(r => ({ ...r, computedScore: r.score() }))
      .filter(r => r.computedScore > 0)
      .sort((a, b) => b.computedScore - a.computedScore)
      .slice(0, 4);
  }

  function renderRecommendations(container) {
    const recs = generateRecommendations();
    if (recs.length === 0) {
      container.innerHTML = '<p class="empty-text">You\'re doing great! No recommendations right now.</p>';
      return;
    }
    container.innerHTML = recs.map(r => `
      <div class="rec-item" data-action="${r.action}">
        <span class="rec-icon">${r.icon}</span>
        <div class="rec-content">
          <h4 class="rec-title">${escapeHTML(r.title)}</h4>
          <p class="rec-desc">${escapeHTML(r.desc)}</p>
        </div>
        <button class="btn btn-sm btn-secondary rec-action-btn" data-view="${r.action}">Go →</button>
      </div>
    `).join('');

    container.querySelectorAll('.rec-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view) navigate(view);
      });
    });
  }

  // ──────────────────────────────────────────────
  // 10. DAILY CHALLENGES MODULE
  // ──────────────────────────────────────────────
  const CHALLENGES = [
    { id: 'c01', category: 'productivity', text: 'Write down your top 3 priorities for tomorrow', reward: '10 XP' },
    { id: 'c02', category: 'learning', text: 'Read for 20 minutes on a topic you\'ve never explored', reward: '15 XP' },
    { id: 'c03', category: 'habit', text: 'Complete all your habits before noon', reward: '20 XP' },
    { id: 'c04', category: 'creativity', text: 'Write a haiku about your current goal', reward: '10 XP' },
    { id: 'c05', category: 'productivity', text: 'Declutter your workspace for 10 minutes', reward: '10 XP' },
    { id: 'c06', category: 'learning', text: 'Watch a TED talk and write one takeaway', reward: '15 XP' },
    { id: 'c07', category: 'habit', text: 'Meditate for 5 minutes', reward: '10 XP' },
    { id: 'c08', category: 'creativity', text: 'Sketch or doodle your ideal productive day', reward: '10 XP' },
    { id: 'c09', category: 'productivity', text: 'Use the Pomodoro technique for one hour', reward: '15 XP' },
    { id: 'c10', category: 'learning', text: 'Learn and use 3 new vocabulary words today', reward: '10 XP' },
    { id: 'c11', category: 'habit', text: 'Drink 8 glasses of water today', reward: '10 XP' },
    { id: 'c12', category: 'creativity', text: 'Brainstorm 10 ideas (any topic) in 5 minutes', reward: '15 XP' },
    { id: 'c13', category: 'productivity', text: 'Identify and eliminate one time-wasting activity', reward: '15 XP' },
    { id: 'c14', category: 'learning', text: 'Teach someone something you learned recently', reward: '20 XP' },
    { id: 'c15', category: 'habit', text: 'Take a 30-minute walk without your phone', reward: '15 XP' },
    { id: 'c16', category: 'creativity', text: 'Write a gratitude letter to yourself', reward: '10 XP' },
    { id: 'c17', category: 'productivity', text: 'Plan your entire week in advance', reward: '20 XP' },
    { id: 'c18', category: 'learning', text: 'Research a skill you want to learn and create a study plan', reward: '20 XP' },
    { id: 'c19', category: 'habit', text: 'Go to bed 30 minutes earlier tonight', reward: '10 XP' },
    { id: 'c20', category: 'creativity', text: 'Rearrange something in your environment creatively', reward: '10 XP' },
    { id: 'c21', category: 'productivity', text: 'Say no to one non-essential commitment', reward: '15 XP' },
    { id: 'c22', category: 'learning', text: 'Listen to a podcast on personal development', reward: '15 XP' },
    { id: 'c23', category: 'habit', text: 'Do a digital detox for 2 hours', reward: '20 XP' },
    { id: 'c24', category: 'creativity', text: 'Write down 3 things that inspire you', reward: '10 XP' },
    { id: 'c25', category: 'productivity', text: 'Set up a morning routine and follow it tomorrow', reward: '15 XP' },
    { id: 'c26', category: 'learning', text: 'Read a chapter of a non-fiction book', reward: '15 XP' },
    { id: 'c27', category: 'habit', text: 'Stretch for 10 minutes', reward: '10 XP' },
    { id: 'c28', category: 'creativity', text: 'Create a vision board (digital or physical)', reward: '20 XP' },
    { id: 'c29', category: 'productivity', text: 'Do your hardest task first thing today', reward: '15 XP' },
    { id: 'c30', category: 'learning', text: 'Write a summary of something you learned this week', reward: '15 XP' },
    { id: 'c31', category: 'habit', text: 'Practice deep breathing for 5 minutes', reward: '10 XP' },
    { id: 'c32', category: 'creativity', text: 'Try journaling for 15 minutes', reward: '10 XP' }
  ];

  function getDailyChallenge() {
    const today = todayStr();
    const dateInt = parseInt(today.replace(/-/g, ''), 10);
    const index = dateInt % CHALLENGES.length;
    return CHALLENGES[index];
  }

  function renderDailyChallenge() {
    const container = document.getElementById('daily-challenge-card');
    if (!container) return;

    const challenge = getDailyChallenge();
    if (!challenge) {
      container.innerHTML = '<p class="empty-text">No challenge today.</p>';
      return;
    }

    const today = todayStr();
    const completionKey = challenge.id + '_' + today;
    const isCompleted = State.challenges.completedIds.includes(completionKey);
    const remaining = getChallengeTimeRemaining();

    container.innerHTML = `
      <div class="challenge-content">
        <div class="challenge-category-badge challenge-${challenge.category}">${challenge.category}</div>
        <p class="challenge-text">${escapeHTML(challenge.text)}</p>
        <div class="challenge-meta">
          <span class="challenge-reward">🎁 ${challenge.reward}</span>
          <span class="challenge-timer" id="challenge-timer">⏳ ${remaining}h remaining</span>
        </div>
        ${isCompleted
          ? '<div class="challenge-completed-badge">✅ Completed Today!</div>'
          : `<button class="btn btn-primary btn-sm" id="complete-challenge-btn">Complete Challenge</button>`
        }
      </div>
    `;

    if (!isCompleted) {
      const btn = document.getElementById('complete-challenge-btn');
      if (btn) {
        btn.addEventListener('click', () => completeChallenge(challenge.id));
      }
    }
  }

  function completeChallenge(id) {
    const today = todayStr();
    const completionKey = id + '_' + today;
    if (State.challenges.completedIds.includes(completionKey)) return;
    State.challenges.completedIds.push(completionKey);
    State.challenges.lastDate = today;
    recordActivity();
    saveState();
    checkAchievements();
    showNotification('🎉 Challenge completed! Well done!', 'success');
    fireConfetti();
    renderDailyChallenge();
  }

  function getChallengeTimeRemaining() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    return Math.floor(diff / (1000 * 60 * 60));
  }

  // ──────────────────────────────────────────────
  // 11. LEARNING PATHS MODULE
  // ──────────────────────────────────────────────
  const LEARNING_PATHS = [
    {
      id: 'productivity', icon: '⚡', name: 'Productivity Mastery', desc: 'Master time management and focus',
      modules: [
        { id: 'pm1', name: 'Time Boxing Basics', desc: 'Learn the Pomodoro technique and time blocking' },
        { id: 'pm2', name: 'Priority Frameworks', desc: 'Eisenhower matrix and MoSCoW method' },
        { id: 'pm3', name: 'Deep Work', desc: 'Build a deep work practice' },
        { id: 'pm4', name: 'Weekly Reviews', desc: 'Implement weekly planning and review' }
      ]
    },
    {
      id: 'mindfulness', icon: '🧘', name: 'Mindfulness Journey', desc: 'Build awareness and reduce stress',
      modules: [
        { id: 'mm1', name: 'Breathing Basics', desc: 'Learn fundamental breathing exercises' },
        { id: 'mm2', name: 'Body Scan Meditation', desc: 'Practice body awareness meditation' },
        { id: 'mm3', name: 'Mindful Daily Activities', desc: 'Apply mindfulness to everyday tasks' },
        { id: 'mm4', name: 'Stress Management', desc: 'Techniques for managing stress' }
      ]
    },
    {
      id: 'fitness', icon: '💪', name: 'Fitness Foundations', desc: 'Build a sustainable exercise habit',
      modules: [
        { id: 'fm1', name: 'Movement Basics', desc: 'Start with daily movement' },
        { id: 'fm2', name: 'Strength Training Intro', desc: 'Learn basic strength exercises' },
        { id: 'fm3', name: 'Cardio & Endurance', desc: 'Build cardiovascular fitness' },
        { id: 'fm4', name: 'Recovery & Nutrition', desc: 'Optimize recovery and eating' }
      ]
    },
    {
      id: 'creativity', icon: '🎨', name: 'Creative Thinking', desc: 'Unlock your creative potential',
      modules: [
        { id: 'cm1', name: 'Idea Generation', desc: 'Techniques for brainstorming' },
        { id: 'cm2', name: 'Creative Problem Solving', desc: 'Apply creativity to challenges' },
        { id: 'cm3', name: 'Building Creative Habits', desc: 'Daily creative practices' },
        { id: 'cm4', name: 'Sharing Your Work', desc: 'Presenting and iterating on ideas' }
      ]
    },
    {
      id: 'leadership', icon: '👑', name: 'Leadership Skills', desc: 'Develop leadership capabilities',
      modules: [
        { id: 'lm1', name: 'Self-Leadership', desc: 'Lead yourself first' },
        { id: 'lm2', name: 'Communication', desc: 'Master clear communication' },
        { id: 'lm3', name: 'Decision Making', desc: 'Make better decisions faster' },
        { id: 'lm4', name: 'Team Building', desc: 'Build and lead effective teams' }
      ]
    }
  ];

  let learningFilter = 'all';

  function renderLearningPaths() {
    const container = document.getElementById('learning-paths-grid');
    if (!container) return;

    // Filter
    const filterBar = document.getElementById('learning-filter-bar');
    if (filterBar) {
      filterBar.querySelectorAll('.filter-chip').forEach(chip => {
        const filterVal = chip.getAttribute('data-lstatus') || chip.getAttribute('data-filter');
        if (learningFilter === filterVal) {
          chip.classList.add('active');
          chip.setAttribute('aria-selected', 'true');
        } else {
          chip.classList.remove('active');
          chip.removeAttribute('aria-selected');
        }
        chip.onclick = (e) => {
          e.preventDefault();
          learningFilter = filterVal;
          renderLearningPaths();
        };
      });
    }

    let paths = LEARNING_PATHS;
    if (learningFilter === 'active') {
      paths = paths.filter(p => {
        const s = State.learningPaths[p.id];
        return s && s.started && (!s.completedModules || s.completedModules.length < p.modules.length);
      });
    } else if (learningFilter === 'completed') {
      paths = paths.filter(p => {
        const s = State.learningPaths[p.id];
        return s && s.completedModules && s.completedModules.length === p.modules.length;
      });
    }

    if (paths.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-icon">📚</div><h3>No learning paths found</h3><p>Try a different filter.</p></div>';
      return;
    }

    container.innerHTML = paths.map(path => {
      const state = State.learningPaths[path.id] || { started: false, completedModules: [] };
      const completed = state.completedModules ? state.completedModules.length : 0;
      const total = path.modules.length;
      const pct = Math.round((completed / total) * 100);
      const isStarted = state.started;
      const isComplete = completed === total;

      return `
        <div class="path-card ${isComplete ? 'path-completed' : ''}" data-path-id="${path.id}">
          <div class="path-icon">${path.icon}</div>
          <h3 class="path-name">${escapeHTML(path.name)}</h3>
          <p class="path-desc">${escapeHTML(path.desc)}</p>
          <div class="path-progress">
            <div class="path-progress-bar">
              <div class="path-progress-fill" style="width:${pct}%"></div>
            </div>
            <span class="path-progress-text">${completed}/${total} modules</span>
          </div>
          <button class="btn btn-primary btn-sm path-action-btn" data-path-id="${path.id}">
            ${isComplete ? '✅ Completed' : (isStarted ? 'Continue' : 'Start Path')}
          </button>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.path-action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pathId = btn.getAttribute('data-path-id');
        openLearningPathModal(pathId);
      });
    });
  }

  function openLearningPathModal(pathId) {
    const path = LEARNING_PATHS.find(p => p.id === pathId);
    if (!path) return;

    if (!State.learningPaths[pathId]) {
      State.learningPaths[pathId] = { started: true, completedModules: [] };
      saveState();
    }
    const state = State.learningPaths[pathId];
    if (!state.started) {
      state.started = true;
      saveState();
    }

    const bodyHTML = `
      <div class="learning-path-detail">
        <div class="path-detail-header">
          <span class="path-detail-icon">${path.icon}</span>
          <div>
            <h3>${escapeHTML(path.name)}</h3>
            <p>${escapeHTML(path.desc)}</p>
          </div>
        </div>
        <div class="modules-list" id="modules-list">
          ${path.modules.map((mod, i) => {
            const done = state.completedModules && state.completedModules.includes(mod.id);
            return `
              <div class="module-item ${done ? 'module-done' : ''}" data-module-id="${mod.id}">
                <button class="module-check-btn ${done ? 'checked' : ''}" data-path-id="${pathId}" data-module-id="${mod.id}">
                  <span class="check-circle">${done ? '✓' : i + 1}</span>
                </button>
                <div class="module-info">
                  <h4 class="module-name">${escapeHTML(mod.name)}</h4>
                  <p class="module-desc">${escapeHTML(mod.desc)}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const footerHTML = `<button class="btn btn-secondary" id="modal-close-path-btn">Close</button>`;

    openModal(path.name, bodyHTML, footerHTML);

    document.getElementById('modal-close-path-btn').addEventListener('click', closeModal);

    document.querySelectorAll('.module-check-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-path-id');
        const mid = btn.getAttribute('data-module-id');
        toggleModule(pid, mid);
        // Re-open modal to reflect changes
        openLearningPathModal(pid);
      });
    });
  }

  function toggleModule(pathId, moduleId) {
    if (!State.learningPaths[pathId]) {
      State.learningPaths[pathId] = { started: true, completedModules: [] };
    }
    const state = State.learningPaths[pathId];
    if (!state.completedModules) state.completedModules = [];

    const idx = state.completedModules.indexOf(moduleId);
    if (idx >= 0) {
      state.completedModules.splice(idx, 1);
    } else {
      state.completedModules.push(moduleId);
    }
    recordActivity();
    saveState();
    checkAchievements();
  }

  // ──────────────────────────────────────────────
  // 12. NOTIFICATIONS MODULE
  // ──────────────────────────────────────────────
  let notificationCount = 0;

  function showNotification(message, type, duration) {
    type = type || 'info';
    duration = duration || 4000;

    const container = document.getElementById('notification-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-message">${escapeHTML(message)}</span>
      <button class="toast-close">✕</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-show');
    });

    const closeBtn = toast.querySelector('.toast-close');
    const removeToast = () => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    };

    closeBtn.addEventListener('click', removeToast);
    setTimeout(removeToast, duration);

    // Update badge
    notificationCount++;
    updateNotificationBadge();
    setTimeout(() => {
      notificationCount = Math.max(0, notificationCount - 1);
      updateNotificationBadge();
    }, duration);
  }

  function updateNotificationBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) {
      badge.textContent = notificationCount;
      badge.style.display = notificationCount > 0 ? 'flex' : 'none';
    }
  }

  let reminderTimer = null;

  function setupReminders() {
    if (reminderTimer) clearInterval(reminderTimer);
    if (!State.settings.notifications || State.settings.reminderInterval <= 0) return;

    const reminderMessages = [
      'Remember to check on your goals today! 🎯',
      'Have you completed your habits? 🌱',
      'Stay consistent — small steps lead to big results! 🏆',
      'Time for a quick progress check! 📊',
      'Keep pushing forward — you\'re doing great! 💪',
      'Take a moment to reflect on your achievements. ⭐',
      'Don\'t forget today\'s daily challenge! 🧠',
      'Progress, not perfection. Keep going! 🚀'
    ];

    reminderTimer = setInterval(() => {
      const msg = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
      showNotification(msg, 'info', 5000);
    }, State.settings.reminderInterval * 60 * 1000);
  }

  // ──────────────────────────────────────────────
  // 13. CONFETTI MODULE
  // ──────────────────────────────────────────────
  function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899', '#6366f1', '#14b8a6', '#fbbf24', '#a78bfa'];
    const particles = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 6,
        speedY: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        wobbleOffset: Math.random() * Math.PI * 2,
        shape: Math.random() > 0.5 ? 'rect' : 'circle'
      });
    }

    const startTime = performance.now();
    const duration = 3000;

    function animate(now) {
      const elapsed = now - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const opacity = 1 - Math.max(0, (elapsed - duration * 0.7) / (duration * 0.3));

      particles.forEach(p => {
        p.x += p.speedX + Math.sin(elapsed * p.wobbleSpeed + p.wobbleOffset) * p.wobble * 0.02;
        p.y += p.speedY;
        p.speedY += 0.05; // gravity
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  // ──────────────────────────────────────────────
  // 14. THEME MODULE
  // ──────────────────────────────────────────────
  function toggleTheme() {
    const body = document.body;
    if (body.classList.contains('light-theme')) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      State.settings.theme = 'dark';
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      State.settings.theme = 'light';
    }

    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = State.settings.theme === 'dark' ? '🌙' : '☀️';

    saveState();
  }

  function applyTheme() {
    const body = document.body;
    body.classList.remove('dark-theme', 'light-theme');
    body.classList.add(State.settings.theme === 'light' ? 'light-theme' : 'dark-theme');

    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = State.settings.theme === 'dark' ? '🌙' : '☀️';
  }

  // ──────────────────────────────────────────────
  // 15. SETTINGS MODULE
  // ──────────────────────────────────────────────
  function openSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel) panel.classList.add('open');
  }

  function closeSettings() {
    const panel = document.getElementById('settings-panel');
    if (panel) panel.classList.remove('open');
  }

  function initSettings() {
    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

    const closeSettingsBtn = document.getElementById('close-settings-btn');
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);

    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Populate fields
    const nameInput = document.getElementById('setting-name');
    if (nameInput) {
      nameInput.value = State.settings.name;
      nameInput.addEventListener('input', () => {
        State.settings.name = nameInput.value.trim() || 'User';
        saveState();
        // Update greeting if on dashboard
        const greetingEl = document.getElementById('welcome-greeting');
        if (greetingEl) greetingEl.textContent = `${getGreeting()}, ${escapeHTML(State.settings.name)}!`;
        // Update sidebar user name
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = State.settings.name;
      });
    }

    const notifToggle = document.getElementById('setting-notifications');
    if (notifToggle) {
      notifToggle.checked = State.settings.notifications;
      notifToggle.addEventListener('change', () => {
        State.settings.notifications = notifToggle.checked;
        saveState();
        setupReminders();
      });
    }

    const reminderInput = document.getElementById('setting-reminder');
    if (reminderInput) {
      reminderInput.value = State.settings.reminderInterval;
      reminderInput.addEventListener('change', () => {
        State.settings.reminderInterval = parseInt(reminderInput.value) || 60;
        saveState();
        setupReminders();
      });
    }

    // Export
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        try {
          State._exported = true;
          saveState();
          const data = JSON.stringify(State, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `self-improvement-backup-${todayStr()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          showNotification('Data exported successfully!', 'success');
          checkAchievements();
        } catch (e) {
          showNotification('Failed to export data.', 'error');
          console.error(e);
        }
      });
    }

    // Import
    const importBtn = document.getElementById('import-data-btn');
    if (importBtn) {
      importBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const imported = JSON.parse(ev.target.result);
              // Merge
              Object.keys(imported).forEach(key => {
                if (key === 'settings') {
                  State.settings = { ...State.settings, ...imported.settings };
                } else if (State.hasOwnProperty(key)) {
                  State[key] = imported[key];
                }
              });
              saveState();
              applyTheme();
              showNotification('Data imported successfully!', 'success');
              navigate(currentView);
            } catch (err) {
              showNotification('Invalid backup file.', 'error');
              console.error(err);
            }
          };
          reader.readAsText(file);
        });
        input.click();
      });
    }

    // Reset
    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
          if (confirm('This will permanently delete all your goals, habits, and progress. Continue?')) {
            try {
              localStorage.removeItem(STORAGE_KEY);
              showNotification('All data has been reset.', 'info');
              setTimeout(() => location.reload(), 500);
            } catch (e) {
              showNotification('Failed to reset data.', 'error');
            }
          }
        }
      });
    }

    // User name display
    const userNameEl = document.getElementById('user-name');
    if (userNameEl) userNameEl.textContent = State.settings.name;
  }

  // ──────────────────────────────────────────────
  // 16. MODAL MODULE
  // ──────────────────────────────────────────────
  let previouslyFocused = null;

  function openModal(title, bodyHTML, footerHTML) {
    previouslyFocused = document.activeElement;

    const overlay = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const bodyEl = document.getElementById('modal-body');
    const footerEl = document.getElementById('modal-footer');

    if (titleEl) titleEl.textContent = title;
    if (bodyEl) bodyEl.innerHTML = bodyHTML;
    if (footerEl) footerEl.innerHTML = footerHTML || '';
    if (overlay) {
      overlay.classList.add('open', 'active');
      overlay.style.display = 'flex';
    }

    // Trap focus
    const modal = document.getElementById('modal-content') || overlay;
    if (modal) {
      const focusable = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        setTimeout(() => focusable[0].focus(), 50);
      }
    }
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.classList.remove('open', 'active');
      overlay.style.display = 'none';
    }
    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  }

  function initModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('modal-overlay');
        if (overlay && overlay.classList.contains('open')) {
          closeModal();
        }
        // Also close settings
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel && settingsPanel.classList.contains('open')) {
          closeSettings();
        }
      }
    });
  }

  // ──────────────────────────────────────────────
  // 17. INIT
  // ──────────────────────────────────────────────
  function init() {
    loadState();

    // First visit
    if (!State.firstVisit) {
      State.firstVisit = new Date().toISOString();
      recordActivity();
      saveState();
    }

    // Ensure today has activity
    if (!State.activity[todayStr()]) {
      recordActivity();
    }

    applyTheme();
    initRouter();
    initModal();
    initSettings();
    setupReminders();

    // Hamburger toggle for mobile sidebar
    const hamburger = document.getElementById('hamburger-btn');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.classList.toggle('open');
      });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      const hamburger = document.getElementById('hamburger-btn');
      if (sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && e.target !== hamburger && !hamburger.contains(e.target)) {
          sidebar.classList.remove('open');
        }
      }
    });

    // Notification bell
    const notifBell = document.getElementById('notification-bell');
    if (notifBell) {
      notifBell.addEventListener('click', () => {
        notificationCount = 0;
        updateNotificationBadge();
        showNotification('All caught up! 🎉', 'info', 2000);
      });
    }

    // Check achievements on load
    checkAchievements();

    // Render current view
    const hash = window.location.hash.replace('#', '');
    navigate(hash || 'dashboard');
  }

  // ── Public API ──
  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
