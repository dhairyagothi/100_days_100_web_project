/* ============================================================
   Self-Improvement Dashboard — script.js
   ============================================================ */

const App = (() => {
  'use strict';

  // ── 1. STATE ──────────────────────────────────
  const STORAGE_KEY = 'si_state';

  const State = {
    goals: [], habits: [], achievements: [],
    challenges: { completedIds: [], lastDate: '' },
    learningPaths: {}, activity: {},
    settings: { name: 'User', notifications: true, reminderInterval: 60, theme: 'dark' },
    firstVisit: null
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      Object.keys(State).forEach(key => {
        if (parsed[key] === undefined) return;
        if (key === 'settings') State.settings = { ...State.settings, ...parsed.settings };
        else if (key === 'challenges') State.challenges = { ...State.challenges, ...parsed.challenges };
        else State[key] = parsed[key];
      });
    } catch (e) { console.error('loadState:', e); }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(State)); }
    catch (e) { console.error('saveState:', e); }
  }

  function recordActivity() {
    const t = todayStr();
    State.activity[t] = (State.activity[t] || 0) + 1;
    saveState();
  }

  // ── 2. UTILS ──────────────────────────────────
  function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function daysBetween(d1, d2) {
    return Math.floor(Math.abs(new Date(d2) - new Date(d1)) / 86400000);
  }

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
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
    return State.firstVisit ? daysBetween(State.firstVisit, new Date()) : 0;
  }

  // SECURITY: Escape all user-provided text before inserting into HTML
  function esc(str) {
    const div = document.createElement('div');
    div.textContent = String(str ?? '');
    return div.innerHTML;
  }

  // SECURITY: Safe DOM helper — sets text content, never innerHTML
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = String(val ?? '');
  }

  // Safe innerHTML setter — only for internally-constructed HTML (no direct user data)
  function setHTML(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  const QUOTES = [
    'The only way to do great work is to love what you do.',
    'Small daily improvements are the key to staggering long-term results.',
    'Success is the sum of small efforts repeated day in and day out.',
    'The secret of getting ahead is getting started.',
    'Don\'t watch the clock; do what it does. Keep going.',
    'Believe you can and you\'re halfway there.',
    'The only impossible journey is the one you never begin.',
    'Push yourself, because no one else is going to do it for you.',
    'Dream it. Wish it. Do it.',
    'Wake up with determination. Go to bed with satisfaction.',
    'Do something today that your future self will thank you for.',
    'Discipline is the bridge between goals and accomplishment.'
  ];

  // ── 3. ROUTER ─────────────────────────────────
  const PAGE_TITLES = {
    dashboard: 'Dashboard', goals: 'Goals', habits: 'Habits',
    analytics: 'Analytics', achievements: 'Achievements', learning: 'Learning Paths'
  };

  // SECURITY: Allowlist of valid view names — prevents unvalidated dynamic dispatch
  const ALLOWED_VIEWS = new Set(['dashboard', 'goals', 'habits', 'analytics', 'achievements', 'learning']);

  const viewRenderers = {
    dashboard: renderDashboard, goals: renderGoals, habits: renderHabits,
    analytics: renderAnalytics, achievements: renderAchievements, learning: renderLearningPaths
  };

  let currentView = 'dashboard';

  function navigate(viewName) {
    // SECURITY: Validate against allowlist before any dynamic dispatch
    if (!ALLOWED_VIEWS.has(viewName)) viewName = 'dashboard';

    currentView = viewName;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewName + '-view')?.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-view="${viewName}"]`)?.classList.add('active');
    setText('page-title', PAGE_TITLES[viewName] || 'Dashboard');
    viewRenderers[viewName]();
    window.location.hash = viewName;
    document.querySelector('.sidebar')?.classList.remove('open');
  }

  function initRouter() {
    document.querySelectorAll('[data-view]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        // SECURITY: Read attribute value but validate through navigate()'s allowlist
        const view = el.getAttribute('data-view');
        if (view) navigate(view);
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash && hash !== currentView) navigate(hash);
    });

    navigate(window.location.hash.replace('#', '') || 'dashboard');
  }

  // ── 4. DASHBOARD ──────────────────────────────
  function renderDashboard() {
    setText('welcome-greeting', `${getGreeting()}, ${State.settings.name}!`);
    const quoteEl = document.getElementById('welcome-quote');
    if (quoteEl) quoteEl.textContent = `"${QUOTES[Math.floor(Date.now()/86400000) % QUOTES.length]}"`;
    setText('welcome-date', formatDate(new Date()));

    animateCounter('stat-goals-val', State.goals.filter(g => g.completedAt).length);
    animateCounter('stat-streaks-val', computeGlobalStreak());
    animateCounter('stat-days-val', Object.keys(State.activity).length);
    animateCounter('stat-badges-val', State.achievements.length);

    // Active goals widget
    const activeGoals = State.goals
      .filter(g => !g.archived && !g.completedAt)
      .sort((a, b) => new Date(a.deadline || '9999-12-31') - new Date(b.deadline || '9999-12-31'))
      .slice(0, 3);

    setHTML('dashboard-goals-list', activeGoals.length === 0
      ? '<div class="empty-state"><span class="empty-icon">🎯</span><p>No active goals yet. Create your first goal!</p></div>'
      : activeGoals.map(g => `
        <div class="mini-goal-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
            <span class="category-badge">${esc(g.category || 'learning')}</span>
            <span class="priority-dot priority-${esc(g.priority || 'medium')}"></span>
          </div>
          <h4 style="font-size:.9rem;font-weight:600;margin-bottom:6px">${esc(g.title)}</h4>
          <div class="progress-bar"><div class="progress-fill" style="width:${g.progress||0}%;background:${progressColor(g.progress||0)}"></div></div>
          <span style="font-size:.75rem;color:var(--text-muted)">${g.progress||0}% · ${g.deadline ? formatDate(g.deadline) : 'No deadline'}</span>
        </div>`).join(''));

    // Today's habits widget
    const today = todayStr();
    const dailyHabits = State.habits.filter(h => h.frequency === 'daily' || h.frequency === 'weekly');
    const habitsEl = document.getElementById('dashboard-habits-list');
    if (habitsEl) {
      if (dailyHabits.length === 0) {
        habitsEl.innerHTML = '<div class="empty-state"><span class="empty-icon">🔥</span><p>No habits tracked yet.</p></div>';
      } else {
        habitsEl.innerHTML = dailyHabits.map(h => {
          const done = h.completions?.[today];
          return `<div class="dash-habit-row ${done?'completed':''}" style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-subtle)">
            <button class="habit-checkbox ${done?'checked':''}" data-habit-id="${esc(h.id)}" aria-label="Toggle habit">${done?'✓':''}</button>
            <span style="flex:1;font-size:.9rem;${done?'text-decoration:line-through;opacity:.6':''}">${esc(h.name)}</span>
            <span style="font-size:.75rem;color:var(--amber)">🔥 ${calculateStreak(h)}</span>
          </div>`;
        }).join('');
        habitsEl.querySelectorAll('.habit-checkbox').forEach(btn => {
          btn.addEventListener('click', () => { toggleHabitCompletion(btn.dataset.habitId); renderDashboard(); });
        });
      }
    }

    renderDailyChallenge();
    const recContainer = document.getElementById('recommendations-list');
    if (recContainer) renderRecommendations(recContainer);

    // Recent achievements
    const recent = [...State.achievements]
      .sort((a,b) => new Date(b.unlockedAt) - new Date(a.unlockedAt)).slice(0,3);
    setHTML('dashboard-achievements-list', recent.length === 0
      ? '<div class="empty-state"><span class="empty-icon">🏆</span><p>Complete goals and habits to earn badges!</p></div>'
      : recent.map(a => {
          const def = ACHIEVEMENTS.find(d => d.id === a.id);
          return def ? `<div style="display:flex;align-items:center;gap:8px;padding:6px 0"><span style="font-size:1.4rem">${def.icon}</span><span style="font-size:.85rem;font-weight:500">${esc(def.name)}</span></div>` : '';
        }).join(''));

    renderHeatmap('mini-heatmap', 12);
  }

  function animateCounter(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const start = performance.now();
    const dur = 800;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1-p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }

  function computeGlobalStreak() {
    let streak = 0, d = new Date();
    while (true) {
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (State.activity[ds]) { streak++; d.setDate(d.getDate()-1); } else break;
    }
    return streak;
  }

  function progressColor(p) {
    if (p < 33) return 'var(--rose)';
    if (p < 67) return 'var(--amber)';
    return 'var(--emerald)';
  }

  // ── 5. GOALS ──────────────────────────────────
  let goalsFilter = 'all';

  function renderGoals() {
    const filterBar = document.getElementById('goals-filter-bar');
    filterBar?.querySelectorAll('.filter-chip').forEach(chip => {
      const cat = chip.dataset.category;
      chip.classList.toggle('active', goalsFilter === cat);
      chip.setAttribute('aria-selected', goalsFilter === cat ? 'true' : 'false');
      chip.onclick = e => { e.preventDefault(); goalsFilter = cat; renderGoals(); };
    });

    const grid = document.getElementById('goals-grid');
    if (!grid) return;
    const goals = State.goals.filter(g => !g.archived && (goalsFilter === 'all' || g.category === goalsFilter));

    if (goals.length === 0) {
      grid.innerHTML = `<div class="empty-state full-empty"><span class="empty-icon large">🎯</span><h3>No goals yet</h3><p>Set your first goal to start your journey!</p><button class="btn btn-primary" id="add-goal-empty-btn">+ Create Goal</button></div>`;
      document.getElementById('add-goal-empty-btn')?.addEventListener('click', () => openGoalModal());
    } else {
      grid.innerHTML = goals.map(g => `
        <div class="goal-card" data-id="${esc(g.id)}">
          <div class="goal-card-header">
            <span class="category-badge">${esc(g.category || 'learning')}</span>
            <span class="priority-dot priority-${esc(g.priority || 'medium')}"></span>
          </div>
          <div class="goal-card-body">
            <h3 class="goal-title">${esc(g.title)}</h3>
            <p style="font-size:.85rem;color:var(--text-muted);margin-top:4px">${esc(g.description || '')}</p>
          </div>
          <div class="goal-progress-ring">${createProgressRingSVG(g.progress || 0)}</div>
          <div class="goal-card-footer">
            <span class="goal-deadline">📅 ${g.deadline ? formatDate(g.deadline) : 'No deadline'}</span>
            <div class="goal-actions">
              <button class="goal-edit-btn" data-id="${esc(g.id)}" title="Edit">✏️</button>
              <button class="goal-archive-btn" data-id="${esc(g.id)}" title="Archive">📦</button>
              <button class="goal-delete-btn" data-id="${esc(g.id)}" title="Delete">🗑️</button>
            </div>
          </div>
        </div>`).join('');

      grid.querySelectorAll('.goal-edit-btn').forEach(b => b.addEventListener('click', () => openGoalModal(b.dataset.id)));
      grid.querySelectorAll('.goal-archive-btn').forEach(b => b.addEventListener('click', () => archiveGoal(b.dataset.id)));
      grid.querySelectorAll('.goal-delete-btn').forEach(b => b.addEventListener('click', () => deleteGoal(b.dataset.id)));
    }

    document.getElementById('add-goal-btn')?.addEventListener('click', () => openGoalModal());
  }

  function openGoalModal(goalId) {
    const existing = goalId ? State.goals.find(g => g.id === goalId) : null;
    const ms = existing?.milestones || [];

    const body = document.createElement('div');
    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Title *</label>
        <input type="text" id="goal-title-input" class="form-input" placeholder="e.g., Learn JavaScript" maxlength="100" />
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea id="goal-desc-input" class="form-textarea" rows="3" placeholder="Describe your goal..." maxlength="500"></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select id="goal-category-input" class="form-select">
            ${['learning','skill','productivity','health','custom'].map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select id="goal-priority-input" class="form-select">
            <option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Deadline</label>
        <input type="date" id="goal-deadline-input" class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">Milestones</label>
        <div id="milestones-list"></div>
        <button type="button" class="btn btn-secondary btn-sm" id="add-milestone-btn" style="margin-top:8px">+ Add Milestone</button>
      </div>`;

    // Populate existing values via DOM (no innerHTML with user data)
    body.querySelector('#goal-title-input').value = existing?.title || '';
    body.querySelector('#goal-desc-input').value = existing?.description || '';
    body.querySelector('#goal-category-input').value = existing?.category || 'learning';
    body.querySelector('#goal-priority-input').value = existing?.priority || 'medium';
    body.querySelector('#goal-deadline-input').value = existing?.deadline || '';

    const msList = body.querySelector('#milestones-list');
    ms.forEach((m, i) => msList.appendChild(createMilestoneRow(m.text, i)));

    body.querySelector('#add-milestone-btn').addEventListener('click', () => {
      msList.appendChild(createMilestoneRow('', msList.children.length));
    });

    const footer = document.createElement('div');
    footer.innerHTML = `<button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button><button class="btn btn-primary" id="modal-save-goal-btn">${existing ? 'Save Changes' : 'Create Goal'}</button>`;

    openModal(existing ? 'Edit Goal' : 'New Goal', body, footer);

    footer.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);
    footer.querySelector('#modal-save-goal-btn').addEventListener('click', () => {
      const titleVal = document.getElementById('goal-title-input').value.trim();
      if (!titleVal) { showNotification('Please enter a goal title.', 'error'); return; }

      const milestoneInputs = document.querySelectorAll('.milestone-input');
      const newMilestones = [];
      milestoneInputs.forEach(inp => {
        const text = inp.value.trim();
        if (text) {
          const found = existing?.milestones?.find(m => m.text === text);
          newMilestones.push({ id: found?.id || genId(), text, done: found?.done || false });
        }
      });

      if (existing) {
        Object.assign(existing, {
          title: titleVal,
          description: document.getElementById('goal-desc-input').value.trim(),
          category: document.getElementById('goal-category-input').value,
          priority: document.getElementById('goal-priority-input').value,
          deadline: document.getElementById('goal-deadline-input').value,
          milestones: newMilestones,
          progress: newMilestones.length ? Math.round(newMilestones.filter(m=>m.done).length/newMilestones.length*100) : existing.progress
        });
        showNotification('Goal updated!', 'success');
      } else {
        State.goals.push({
          id: genId(), archived: false, completedAt: null, progress: 0,
          createdAt: new Date().toISOString(), milestones: newMilestones,
          title: titleVal,
          description: document.getElementById('goal-desc-input').value.trim(),
          category: document.getElementById('goal-category-input').value,
          priority: document.getElementById('goal-priority-input').value,
          deadline: document.getElementById('goal-deadline-input').value
        });
        recordActivity();
        showNotification('Goal created!', 'success');
      }
      saveState(); closeModal(); checkAchievements(); renderGoals();
    });
  }

  function createMilestoneRow(text, idx) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;margin-bottom:6px';
    const inp = document.createElement('input');
    inp.type = 'text'; inp.className = 'form-input milestone-input';
    inp.value = text; inp.placeholder = `Milestone ${idx + 1}`; inp.maxLength = 100;
    const btn = document.createElement('button');
    btn.type = 'button'; btn.textContent = '✕';
    btn.style.cssText = 'flex-shrink:0;width:36px;border-radius:6px;background:rgba(255,255,255,.06);border:1px solid var(--border-input);cursor:pointer;color:var(--text-muted)';
    btn.addEventListener('click', () => row.remove());
    row.append(inp, btn);
    return row;
  }

  function createProgressRingSVG(pct) {
    const r = 40, circ = 2 * Math.PI * r;
    const color = pct < 33 ? '#f43f5e' : pct < 67 ? '#f59e0b' : '#10b981';
    return `<svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="8"/>
      <circle cx="50" cy="50" r="${r}" fill="none" stroke="${color}" stroke-width="8"
        stroke-dasharray="${circ}" stroke-dashoffset="${circ*(1-pct/100)}"
        stroke-linecap="round" transform="rotate(-90 50 50)"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
        fill="${color}" font-size="18" font-weight="bold">${Math.round(pct)}%</text>
    </svg>`;
  }

  function deleteGoal(id) {
    if (!confirm('Delete this goal? This cannot be undone.')) return;
    State.goals = State.goals.filter(g => g.id !== id);
    saveState(); showNotification('Goal deleted.', 'info'); renderGoals();
  }

  function archiveGoal(id) {
    const goal = State.goals.find(g => g.id === id);
    if (!goal) return;
    goal.archived = !goal.archived;
    saveState(); showNotification(goal.archived ? 'Goal archived.' : 'Goal restored.', 'info'); renderGoals();
  }

  // ── 6. HABITS ─────────────────────────────────
  let habitsFilter = 'all';

  function renderHabits() {
    document.getElementById('habits-filter-bar')?.querySelectorAll('.filter-chip').forEach(chip => {
      const f = chip.dataset.filter;
      chip.classList.toggle('active', habitsFilter === f);
      chip.setAttribute('aria-selected', habitsFilter === f ? 'true' : 'false');
      chip.onclick = e => { e.preventDefault(); habitsFilter = f; renderHabits(); };
    });

    setText('current-streak-val', computeGlobalStreak());
    setText('longest-streak-val', computeLongestGlobalStreak());
    setText('completion-rate-val', Math.round(calculateCompletionRate()) + '%');
    setText('consistency-score-val', Math.round(calculateConsistencyScore()) + '%');

    const list = document.getElementById('habits-list');
    if (!list) return;
    const habits = habitsFilter === 'all' ? State.habits : State.habits.filter(h => h.frequency === habitsFilter);

    if (habits.length === 0) {
      list.innerHTML = `<div class="empty-state full-empty"><span class="empty-icon large">🔥</span><h3>No habits yet</h3><p>Start building positive habits today!</p><button class="btn btn-primary" id="add-habit-empty-btn">+ Create Habit</button></div>`;
      document.getElementById('add-habit-empty-btn')?.addEventListener('click', () => openHabitModal());
    } else {
      const today = todayStr();
      list.innerHTML = habits.map(h => {
        const done = h.completions?.[today];
        const s = calculateStreak(h);
        return `<div class="habit-item ${done?'completed':''}" data-id="${esc(h.id)}">
          <button class="habit-checkbox ${done?'checked':''}" data-habit-id="${esc(h.id)}" aria-label="Toggle">${done?'✓':''}</button>
          <div style="flex:1;min-width:0">
            <div class="habit-name">${esc(h.name)}</div>
            ${s > 0 ? `<div class="habit-streak">🔥 ${s} day${s>1?'s':''}</div>` : ''}
          </div>
          <span class="habit-frequency">${esc(h.frequency)}</span>
          <div class="habit-actions">
            <button class="habit-edit-btn" data-id="${esc(h.id)}" title="Edit">✏️</button>
            <button class="habit-delete-btn" data-id="${esc(h.id)}" title="Delete">🗑️</button>
          </div>
        </div>`;
      }).join('');

      list.querySelectorAll('.habit-checkbox').forEach(b => b.addEventListener('click', () => { toggleHabitCompletion(b.dataset.habitId); renderHabits(); }));
      list.querySelectorAll('.habit-edit-btn').forEach(b => b.addEventListener('click', () => openHabitModal(b.dataset.id)));
      list.querySelectorAll('.habit-delete-btn').forEach(b => b.addEventListener('click', () => {
        if (confirm('Delete this habit?')) { State.habits = State.habits.filter(h => h.id !== b.dataset.id); saveState(); showNotification('Habit deleted.', 'info'); renderHabits(); }
      }));
    }

    document.getElementById('add-habit-btn')?.addEventListener('click', () => openHabitModal());
    renderHeatmap('habit-heatmap', 20);
  }

  function openHabitModal(habitId) {
    const existing = habitId ? State.habits.find(h => h.id === habitId) : null;

    const body = document.createElement('div');
    body.innerHTML = `
      <div class="form-group"><label class="form-label">Habit Name *</label>
        <input type="text" id="habit-name-input" class="form-input" placeholder="e.g., Read 30 minutes" maxlength="100"/></div>
      <div class="form-group"><label class="form-label">Frequency</label>
        <select id="habit-freq-input" class="form-select">
          <option value="daily">Daily</option><option value="weekly">Weekly</option></select></div>
      <div class="form-group" id="target-group" style="display:none">
        <label class="form-label">Target per week</label>
        <input type="number" id="habit-target-input" class="form-input" min="1" max="7" value="3"/></div>`;

    body.querySelector('#habit-name-input').value = existing?.name || '';
    body.querySelector('#habit-freq-input').value = existing?.frequency || 'daily';
    const targetGroup = body.querySelector('#target-group');
    const freqSel = body.querySelector('#habit-freq-input');
    targetGroup.style.display = (existing?.frequency === 'weekly') ? 'block' : 'none';
    if (existing?.targetPerWeek) body.querySelector('#habit-target-input').value = existing.targetPerWeek;
    freqSel.addEventListener('change', () => { targetGroup.style.display = freqSel.value === 'weekly' ? 'block' : 'none'; });

    const footer = document.createElement('div');
    footer.innerHTML = `<button class="btn btn-secondary" id="modal-cancel-btn">Cancel</button><button class="btn btn-primary" id="modal-save-habit-btn">${existing ? 'Save Changes' : 'Create Habit'}</button>`;
    openModal(existing ? 'Edit Habit' : 'New Habit', body, footer);

    footer.querySelector('#modal-cancel-btn').addEventListener('click', closeModal);
    footer.querySelector('#modal-save-habit-btn').addEventListener('click', () => {
      const name = document.getElementById('habit-name-input').value.trim();
      if (!name) { showNotification('Please enter a habit name.', 'error'); return; }
      const frequency = document.getElementById('habit-freq-input').value;
      const targetPerWeek = parseInt(document.getElementById('habit-target-input').value) || 3;

      if (existing) {
        Object.assign(existing, { name, frequency, targetPerWeek });
        showNotification('Habit updated!', 'success');
      } else {
        State.habits.push({ id: genId(), name, frequency, targetPerWeek, completions: {}, createdAt: new Date().toISOString() });
        recordActivity();
        showNotification('Habit created!', 'success');
      }
      saveState(); closeModal(); checkAchievements(); renderHabits();
    });
  }

  function toggleHabitCompletion(habitId) {
    const habit = State.habits.find(h => h.id === habitId);
    if (!habit) return;
    const today = todayStr();
    if (!habit.completions) habit.completions = {};
    if (habit.completions[today]) delete habit.completions[today];
    else habit.completions[today] = true;
    recordActivity(); saveState(); checkAchievements();
  }

  function calculateStreak(habit) {
    if (!habit.completions) return 0;
    let streak = 0;
    const d = new Date();
    while (true) {
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (habit.completions[ds]) { streak++; d.setDate(d.getDate()-1); } else break;
    }
    return streak;
  }

  function computeLongestGlobalStreak() {
    const dates = Object.keys(State.activity).sort();
    if (!dates.length) return 0;
    let longest = 1, current = 1;
    for (let i = 1; i < dates.length; i++) {
      if (daysBetween(dates[i-1], dates[i]) === 1) { current++; if (current > longest) longest = current; }
      else current = 1;
    }
    return longest;
  }

  function calculateCompletionRate() {
    if (!State.habits.length) return 0;
    let expected = 0, actual = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today); d.setDate(d.getDate()-i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      State.habits.forEach(h => {
        expected += h.frequency === 'daily' ? 1 : (h.targetPerWeek||3)/7;
        if (h.completions?.[ds]) actual++;
      });
    }
    return expected > 0 ? (actual/expected)*100 : 0;
  }

  function calculateConsistencyScore() {
    if (!State.habits.length) return 0;
    return State.habits.reduce((sum, h) => {
      let exp = 0, act = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today); d.setDate(d.getDate()-i);
        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        exp += h.frequency === 'daily' ? 1 : (h.targetPerWeek||3)/7;
        if (h.completions?.[ds]) act++;
      }
      return sum + (exp > 0 ? (act/exp)*100 : 0);
    }, 0) / State.habits.length;
  }

  function renderHeatmap(containerId, weeks) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - weeks*7 + 1);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const cells = [];
    for (let w = 0; w < weeks; w++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(startDate); d.setDate(d.getDate() + w*7 + day);
        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const count = State.activity[ds] || 0;
        const level = d > today ? '' : count >= 6 ? 4 : count >= 4 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.setAttribute('data-level', level);
        cell.title = `${ds}: ${count} activities`;
        cells.push(cell);
      }
    }
    container.innerHTML = '';
    cells.forEach(c => container.appendChild(c));
  }

  // ── 7. ANALYTICS ──────────────────────────────
  let analyticsPeriod = '30';

  function renderAnalytics() {
    document.getElementById('analytics-filter-bar')?.querySelectorAll('.filter-chip').forEach(chip => {
      chip.classList.toggle('active', analyticsPeriod === chip.dataset.period);
      chip.setAttribute('aria-selected', analyticsPeriod === chip.dataset.period ? 'true' : 'false');
      chip.onclick = e => { e.preventDefault(); analyticsPeriod = chip.dataset.period; renderAnalytics(); };
    });

    const days = parseInt(analyticsPeriod) || 30;
    renderLineChart(document.getElementById('goal-completion-chart'), buildGoalCompletionData(days), { color: '#8b5cf6' });
    renderBarChart(document.getElementById('habit-consistency-chart'), buildHabitConsistencyData(), {});
    renderHeatmap('yearly-heatmap', 52);

    const totalActs = Object.values(State.activity).reduce((s,v)=>s+v, 0);
    const mins = totalActs * 15;
    setText('time-invested-val', `${Math.floor(mins/60)}h ${mins%60}m`);

    const daysActive = Object.keys(State.activity).length;
    const avg = daysActive > 0 ? (totalActs/daysActive).toFixed(1) : 0;
    const rows = [
      ['Total Goals', State.goals.length],
      ['Completed Goals', State.goals.filter(g=>g.completedAt).length],
      ['Active Habits', State.habits.length],
      ['Habit Completions', State.habits.reduce((s,h)=>s+Object.keys(h.completions||{}).length, 0)],
      ['Days Active', daysActive],
      ['Avg Activities/Day', avg]
    ];
    setHTML('engagement-list', rows.map(([label, val]) =>
      `<div class="engagement-item"><span class="engagement-name">${label}</span><span class="engagement-value">${val}</span></div>`
    ).join(''));
  }

  function buildGoalCompletionData(days) {
    const data = [], interval = Math.max(1, Math.floor(days/8));
    for (let i = days; i >= 0; i -= interval) {
      const d = new Date(); d.setDate(d.getDate()-i);
      const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      data.push({ label: `${d.getMonth()+1}/${d.getDate()}`, value: State.goals.filter(g => g.completedAt && g.completedAt.slice(0,10) <= ds).length });
    }
    return data;
  }

  function buildHabitConsistencyData() {
    const colors = ['#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e','#ec4899','#6366f1','#14b8a6'];
    return State.habits.slice(0, 8).map((h, i) => {
      const total = Object.keys(h.completions || {}).length;
      const days = Math.max(1, daysBetween(new Date(h.createdAt), new Date()));
      return { label: h.name.length > 12 ? h.name.slice(0,10)+'..' : h.name, value: Math.min(100, Math.round((total/days)*100)), color: colors[i%colors.length] };
    });
  }

  function renderLineChart(container, data, options) {
    if (!container) return;
    if (!data?.length) { container.innerHTML = '<p style="color:var(--text-muted);padding:20px">No data available yet.</p>'; return; }
    const W=600, H=250, P={t:20,r:30,b:40,l:50};
    const cW=W-P.l-P.r, cH=H-P.t-P.b;
    const maxVal = Math.max(1,...data.map(d=>d.value));
    const pts = data.map((d,i)=>({ x:P.l+(i/Math.max(1,data.length-1))*cW, y:P.t+cH-(d.value/maxVal)*cH, label:d.label, value:d.value }));

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i=1;i<pts.length;i++) {
      const [prev,curr]=[pts[i-1],pts[i]], dx=(curr.x-prev.x)/3;
      pathD += ` C ${prev.x+dx} ${prev.y}, ${curr.x-dx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    let grid='', xlabels='';
    for (let i=0;i<=5;i++) {
      const y=P.t+(i/5)*cH, val=Math.round(maxVal-(i/5)*maxVal);
      grid += `<line x1="${P.l}" y1="${y}" x2="${W-P.r}" y2="${y}" stroke="rgba(255,255,255,.08)" stroke-width="1"/>`;
      grid += `<text x="${P.l-8}" y="${y+4}" text-anchor="end" fill="rgba(255,255,255,.5)" font-size="11">${val}</text>`;
    }
    pts.forEach((p,i) => {
      if (i % Math.max(1,Math.floor(pts.length/6)) === 0 || i===pts.length-1)
        xlabels += `<text x="${p.x}" y="${H-5}" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="11">${p.label}</text>`;
    });

    const areaD = pathD + ` L ${pts[pts.length-1].x} ${P.t+cH} L ${pts[0].x} ${P.t+cH} Z`;
    const color = options.color || '#8b5cf6';
    container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%" preserveAspectRatio="xMidYMid meet">
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}" stop-opacity=".3"/>
        <stop offset="100%" stop-color="${color}" stop-opacity=".02"/>
      </linearGradient></defs>
      ${grid}
      <path d="${areaD}" fill="url(#ag)"/>
      <path d="${pathD}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
      ${pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4" fill="${color}" stroke="rgba(0,0,0,.3)" stroke-width="1"/>`).join('')}
      ${xlabels}</svg>`;
  }

  function renderBarChart(container, data, options) {
    if (!container) return;
    if (!data?.length) { container.innerHTML = '<p style="color:var(--text-muted);padding:20px">No habits to display yet.</p>'; return; }
    const W=600, H=250, P={t:20,r:20,b:50,l:50};
    const cW=W-P.l-P.r, cH=H-P.t-P.b;
    const maxVal = Math.max(1,...data.map(d=>d.value));
    const bW = Math.min(50, cW/data.length-8);

    let grid='', bars='';
    for (let i=0;i<=4;i++) {
      const y=P.t+(i/4)*cH;
      grid += `<line x1="${P.l}" y1="${y}" x2="${W-P.r}" y2="${y}" stroke="rgba(255,255,255,.08)" stroke-width="1"/>`;
      grid += `<text x="${P.l-8}" y="${y+4}" text-anchor="end" fill="rgba(255,255,255,.5)" font-size="11">${Math.round(maxVal-(i/4)*maxVal)}%</text>`;
    }
    data.forEach((d,i) => {
      const bH=(d.value/maxVal)*cH, x=P.l+(i/data.length)*cW+(cW/data.length-bW)/2, y=P.t+cH-bH;
      bars += `<rect x="${x}" y="${y}" width="${bW}" height="${bH}" rx="4" fill="${d.color||'#8b5cf6'}" opacity=".85"/>`;
      bars += `<text x="${x+bW/2}" y="${y-5}" text-anchor="middle" fill="rgba(255,255,255,.8)" font-size="11">${d.value}%</text>`;
      bars += `<text x="${x+bW/2}" y="${H-8}" text-anchor="middle" fill="rgba(255,255,255,.5)" font-size="10" transform="rotate(-25 ${x+bW/2} ${H-8})">${d.label}</text>`;
    });
    container.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%" preserveAspectRatio="xMidYMid meet">${grid}${bars}</svg>`;
  }

  // ── 8. ACHIEVEMENTS ───────────────────────────
  const ACHIEVEMENTS = [
    { id:'first_goal', icon:'🎯', name:'First Goal', desc:'Complete your first goal', points:10, check:s=>s.goals.filter(g=>g.completedAt).length>=1 },
    { id:'streak_7', icon:'🔥', name:'7-Day Streak', desc:'7-day habit streak', points:25, check:()=>computeGlobalStreak()>=7 },
    { id:'streak_30', icon:'🏆', name:'30-Day Champion', desc:'30-day consistency', points:100, check:()=>computeGlobalStreak()>=30 },
    { id:'learning_explorer', icon:'📚', name:'Learning Explorer', desc:'Complete a learning module', points:15, check:s=>Object.keys(s.learningPaths).some(pid=>s.learningPaths[pid]?.completedModules?.length>0) },
    { id:'productivity_master', icon:'⚡', name:'Productivity Master', desc:'Complete 10 goals', points:50, check:s=>s.goals.filter(g=>g.completedAt).length>=10 },
    { id:'habit_builder', icon:'🌟', name:'Habit Builder', desc:'Create 5 habits', points:20, check:s=>s.habits.length>=5 },
    { id:'diamond_streak', icon:'💎', name:'Diamond Streak', desc:'100-day streak', points:500, check:()=>computeGlobalStreak()>=100 },
    { id:'customizer', icon:'🎨', name:'Customizer', desc:'Create a custom category goal', points:10, check:s=>s.goals.some(g=>g.category==='custom') },
    { id:'challenger', icon:'🧠', name:'Challenge Accepted', desc:'Complete 10 daily challenges', points:30, check:s=>s.challenges.completedIds.length>=10 },
    { id:'three_goals', icon:'🎯', name:'Triple Threat', desc:'Complete 3 goals', points:20, check:s=>s.goals.filter(g=>g.completedAt).length>=3 },
    { id:'week_active', icon:'📅', name:'Week Warrior', desc:'Active for 7 days', points:15, check:s=>Object.keys(s.activity).length>=7 },
    { id:'month_active', icon:'📅', name:'Monthly Master', desc:'Active for 30 days', points:50, check:s=>Object.keys(s.activity).length>=30 },
    { id:'all_categories', icon:'🌈', name:'Well-Rounded', desc:'Goals in all categories', points:30, check:s=>{const c=new Set(s.goals.map(g=>g.category));return['learning','skill','productivity','health','custom'].every(x=>c.has(x));} },
    { id:'perfect_day', icon:'⭐', name:'Perfect Day', desc:'Complete all habits in one day', points:25, check:s=>{const dh=s.habits.filter(h=>h.frequency==='daily');if(!dh.length)return false;const dates=new Set();dh.forEach(h=>Object.keys(h.completions||{}).forEach(d=>dates.add(d)));return[...dates].some(date=>dh.every(h=>h.completions?.[date]));} },
    { id:'path_complete', icon:'🛤️', name:'Path Finder', desc:'Complete a learning path', points:100, check:s=>LEARNING_PATHS.some(p=>{const st=s.learningPaths[p.id];return st?.completedModules?.length===p.modules.length;}) },
    { id:'high_consistency', icon:'📊', name:'Consistency King', desc:'90%+ consistency score', points:75, check:()=>calculateConsistencyScore()>=90 },
    { id:'data_master', icon:'💾', name:'Data Master', desc:'Export your data', points:5, check:s=>s._exported===true }
  ];

  function checkAchievements() {
    let newUnlocks = false;
    ACHIEVEMENTS.forEach(ach => {
      if (!State.achievements.some(a=>a.id===ach.id) && ach.check(State)) {
        State.achievements.push({ id: ach.id, unlockedAt: new Date().toISOString() });
        showNotification(`🏆 Achievement Unlocked: ${ach.name}! (+${ach.points} pts)`, 'success', 5000);
        newUnlocks = true;
      }
    });
    if (newUnlocks) { saveState(); fireConfetti(); }
  }

  function getTotalPoints() {
    return State.achievements.reduce((sum,a)=>{ const d=ACHIEVEMENTS.find(x=>x.id===a.id); return sum+(d?.points||0); }, 0);
  }

  function getUserLevel() {
    const p=getTotalPoints();
    if(p<50)return 1; if(p<150)return 2; if(p<300)return 3; if(p<500)return 4; if(p<750)return 5; if(p<1000)return 6; return 7;
  }

  function renderAchievements() {
    const level=getUserLevel(), pts=getTotalPoints();
    const levelThresholds=[0,0,50,150,300,500,750,1000,1500];
    const nextPts=levelThresholds[level]||1500, prevPts=levelThresholds[level-1]||0;

    setText('ach-unlocked', State.achievements.length);
    setText('ach-total', ACHIEVEMENTS.length);
    setText('ach-points', pts);
    setText('user-level', `Level ${level}`);
    setText('user-points', `${pts} pts`);
    setText('next-level-pts', `${nextPts-pts} pts to Level ${level+1}`);
    const fill=document.getElementById('level-progress-fill');
    if(fill) fill.style.width=Math.min(100, nextPts>prevPts ? ((pts-prevPts)/(nextPts-prevPts))*100 : 100)+'%';

    setHTML('badges-grid', ACHIEVEMENTS.map(ach => {
      const unlocked = State.achievements.find(a=>a.id===ach.id);
      return `<div class="badge-card ${unlocked?'unlocked':'locked'}">
        <div class="badge-icon">${ach.icon}</div>
        <h4 class="badge-name">${esc(ach.name)}</h4>
        <p class="badge-desc">${esc(ach.desc)}</p>
        <div class="badge-progress"><div class="badge-progress-fill" style="width:${unlocked?100:0}%"></div></div>
        ${unlocked ? `<span style="font-size:.7rem;color:var(--text-muted)">${formatDate(unlocked.unlockedAt)}</span>` : `<span style="font-size:.75rem;color:var(--text-muted)">🔒 ${ach.points} pts</span>`}
      </div>`;
    }).join(''));
  }

  // ── 9. RECOMMENDATIONS ────────────────────────
  function generateRecommendations() {
    const rules = [
      { icon:'🎯', title:'Create Your First Goal', desc:'Setting goals gives you direction.', action:'goals', score:()=>State.goals.length===0?100:0 },
      { icon:'⏰', title:'Deadline Approaching', desc:'You have goals with upcoming deadlines. Focus!', action:'goals', score:()=>State.goals.filter(g=>{if(!g.deadline||g.completedAt||g.archived)return false;return daysBetween(new Date(),new Date(g.deadline))<=7;}).length>0?90:0 },
      { icon:'🔥', title:'Keep Your Streak Alive', desc:'Complete your habits to maintain your streak!', action:'habits', score:()=>{if(!State.habits.length)return 0;const y=new Date();y.setDate(y.getDate()-1);const ys=`${y.getFullYear()}-${String(y.getMonth()+1).padStart(2,'0')}-${String(y.getDate()).padStart(2,'0')}`;return State.habits.filter(h=>h.frequency==='daily'&&!h.completions?.[ys]).length>0?85:0;} },
      { icon:'🌱', title:'Build a New Habit', desc:'Habits are the building blocks of success.', action:'habits', score:()=>State.habits.length===0?95:State.habits.length<3?50:0 },
      { icon:'📚', title:'Start a Learning Path', desc:'Build new skills with structured paths.', action:'learning', score:()=>Object.keys(State.learningPaths).length===0?65:0 },
      { icon:'🏅', title:'Chase Achievements', desc:'You have locked achievements waiting!', action:'achievements', score:()=>ACHIEVEMENTS.length-State.achievements.length>0?35:0 },
      { icon:'📊', title:'Check Your Analytics', desc:'Review your progress patterns.', action:'analytics', score:()=>daysSinceStart()>=7?40:0 }
    ];
    return rules.map(r=>({...r,s:r.score()})).filter(r=>r.s>0).sort((a,b)=>b.s-a.s).slice(0,4);
  }

  function renderRecommendations(container) {
    const recs = generateRecommendations();
    if (!recs.length) { container.innerHTML = '<p style="color:var(--text-muted);padding:16px">You\'re doing great! No recommendations right now.</p>'; return; }
    container.innerHTML = recs.map(r =>
      `<div style="display:flex;align-items:flex-start;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-subtle)">
        <span style="font-size:1.4rem;flex-shrink:0">${r.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:.9rem;margin-bottom:2px">${esc(r.title)}</div>
          <div style="font-size:.8rem;color:var(--text-muted)">${esc(r.desc)}</div>
        </div>
        <button class="btn btn-sm btn-secondary rec-go-btn" data-view="${esc(r.action)}">Go →</button>
      </div>`
    ).join('');
    container.querySelectorAll('.rec-go-btn').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.view)));
  }

  // ── 10. DAILY CHALLENGE ───────────────────────
  const CHALLENGES = [
    {id:'c01',category:'productivity',text:'Write down your top 3 priorities for tomorrow',reward:'10 XP'},
    {id:'c02',category:'learning',text:"Read for 20 minutes on a topic you've never explored",reward:'15 XP'},
    {id:'c03',category:'habit',text:'Complete all your habits before noon',reward:'20 XP'},
    {id:'c04',category:'creativity',text:'Write a haiku about your current goal',reward:'10 XP'},
    {id:'c05',category:'productivity',text:'Declutter your workspace for 10 minutes',reward:'10 XP'},
    {id:'c06',category:'learning',text:'Watch a TED talk and write one takeaway',reward:'15 XP'},
    {id:'c07',category:'habit',text:'Meditate for 5 minutes',reward:'10 XP'},
    {id:'c08',category:'productivity',text:'Use the Pomodoro technique for one hour',reward:'15 XP'},
    {id:'c09',category:'learning',text:'Learn and use 3 new vocabulary words today',reward:'10 XP'},
    {id:'c10',category:'habit',text:'Drink 8 glasses of water today',reward:'10 XP'},
    {id:'c11',category:'creativity',text:'Brainstorm 10 ideas in 5 minutes',reward:'15 XP'},
    {id:'c12',category:'productivity',text:'Do your hardest task first thing today',reward:'15 XP'},
    {id:'c13',category:'habit',text:'Take a 30-minute walk without your phone',reward:'15 XP'},
    {id:'c14',category:'creativity',text:'Write a gratitude letter to yourself',reward:'10 XP'},
    {id:'c15',category:'learning',text:'Listen to a podcast on personal development',reward:'15 XP'},
    {id:'c16',category:'habit',text:'Do a digital detox for 2 hours',reward:'20 XP'},
    {id:'c17',category:'productivity',text:'Plan your entire week in advance',reward:'20 XP'},
    {id:'c18',category:'learning',text:'Read a chapter of a non-fiction book',reward:'15 XP'},
    {id:'c19',category:'habit',text:'Stretch for 10 minutes',reward:'10 XP'},
    {id:'c20',category:'creativity',text:'Try journaling for 15 minutes',reward:'10 XP'}
  ];

  function getDailyChallenge() {
    return CHALLENGES[parseInt(todayStr().replace(/-/g,'')) % CHALLENGES.length];
  }

  function renderDailyChallenge() {
    const container = document.getElementById('daily-challenge-card');
    if (!container) return;
    const ch = getDailyChallenge();
    if (!ch) { container.innerHTML = '<p style="color:var(--text-muted)">No challenge today.</p>'; return; }

    const today = todayStr(), key = ch.id+'_'+today;
    const done = State.challenges.completedIds.includes(key);
    const hoursLeft = Math.floor((new Date(new Date().setHours(24,0,0,0))-new Date())/3600000);

    // Build using DOM to avoid HTML injection
    container.innerHTML = '';
    const content = document.createElement('div');
    content.className = 'challenge-content';

    const catBadge = document.createElement('span');
    catBadge.className = 'challenge-category';
    catBadge.textContent = ch.category;
    content.appendChild(catBadge);

    const text = document.createElement('p');
    text.className = 'challenge-text';
    text.textContent = ch.text;
    content.appendChild(text);

    const meta = document.createElement('div');
    meta.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin:8px 0';
    const reward = document.createElement('span');
    reward.className = 'challenge-reward';
    reward.textContent = `🎁 ${ch.reward}`;
    const timer = document.createElement('span');
    timer.style.cssText = 'font-size:.8rem;color:var(--text-muted)';
    timer.textContent = `⏳ ${hoursLeft}h remaining`;
    meta.append(reward, timer);
    content.appendChild(meta);

    if (done) {
      const badge = document.createElement('div');
      badge.style.cssText = 'padding:8px 14px;border-radius:8px;background:rgba(16,185,129,.1);color:var(--emerald);font-weight:600;font-size:.9rem;text-align:center';
      badge.textContent = '✅ Completed Today!';
      content.appendChild(badge);
    } else {
      const btn = document.createElement('button');
      btn.className = 'btn btn-accent';
      btn.textContent = 'Accept Challenge';
      btn.addEventListener('click', () => completeChallenge(ch.id));
      content.appendChild(btn);
    }
    container.appendChild(content);
  }

  function completeChallenge(id) {
    const key = id+'_'+todayStr();
    if (State.challenges.completedIds.includes(key)) return;
    State.challenges.completedIds.push(key);
    State.challenges.lastDate = todayStr();
    recordActivity(); saveState(); checkAchievements();
    showNotification('🎉 Challenge completed! Well done!', 'success');
    fireConfetti(); renderDailyChallenge();
  }

  // ── 11. LEARNING PATHS ────────────────────────
  const LEARNING_PATHS = [
    { id:'productivity', icon:'⚡', name:'Productivity Mastery', desc:'Master time management and focus',
      modules:[{id:'pm1',name:'Time Boxing Basics',desc:'Pomodoro & time blocking'},{id:'pm2',name:'Priority Frameworks',desc:'Eisenhower matrix & MoSCoW'},{id:'pm3',name:'Deep Work',desc:'Build a deep work practice'},{id:'pm4',name:'Weekly Reviews',desc:'Weekly planning & review'}] },
    { id:'mindfulness', icon:'🧘', name:'Mindfulness Journey', desc:'Build awareness and reduce stress',
      modules:[{id:'mm1',name:'Breathing Basics',desc:'Fundamental breathing exercises'},{id:'mm2',name:'Body Scan',desc:'Body awareness meditation'},{id:'mm3',name:'Mindful Activities',desc:'Apply mindfulness daily'},{id:'mm4',name:'Stress Management',desc:'Stress management techniques'}] },
    { id:'fitness', icon:'💪', name:'Fitness Foundations', desc:'Build a sustainable exercise habit',
      modules:[{id:'fm1',name:'Movement Basics',desc:'Start with daily movement'},{id:'fm2',name:'Strength Training',desc:'Basic strength exercises'},{id:'fm3',name:'Cardio',desc:'Build cardiovascular fitness'},{id:'fm4',name:'Recovery',desc:'Optimize recovery and nutrition'}] },
    { id:'creativity', icon:'🎨', name:'Creative Thinking', desc:'Unlock your creative potential',
      modules:[{id:'cm1',name:'Idea Generation',desc:'Brainstorming techniques'},{id:'cm2',name:'Problem Solving',desc:'Apply creativity to challenges'},{id:'cm3',name:'Creative Habits',desc:'Daily creative practices'},{id:'cm4',name:'Share Your Work',desc:'Present and iterate on ideas'}] },
    { id:'leadership', icon:'👑', name:'Leadership Skills', desc:'Develop leadership capabilities',
      modules:[{id:'lm1',name:'Self-Leadership',desc:'Lead yourself first'},{id:'lm2',name:'Communication',desc:'Master clear communication'},{id:'lm3',name:'Decision Making',desc:'Make better decisions'},{id:'lm4',name:'Team Building',desc:'Build effective teams'}] }
  ];

  let learningFilter = 'all';

  function renderLearningPaths() {
    document.getElementById('learning-filter-bar')?.querySelectorAll('.filter-chip').forEach(chip => {
      const f = chip.dataset.lstatus;
      chip.classList.toggle('active', learningFilter === f);
      chip.setAttribute('aria-selected', learningFilter === f ? 'true' : 'false');
      chip.onclick = e => { e.preventDefault(); learningFilter = f; renderLearningPaths(); };
    });

    let paths = LEARNING_PATHS;
    if (learningFilter === 'active') paths = paths.filter(p=>{const s=State.learningPaths[p.id];return s?.started&&(s.completedModules?.length||0)<p.modules.length;});
    else if (learningFilter === 'completed') paths = paths.filter(p=>State.learningPaths[p.id]?.completedModules?.length===p.modules.length);

    const container = document.getElementById('learning-paths-grid');
    if (!container) return;

    if (!paths.length) { container.innerHTML = '<div class="empty-state full-empty"><span class="empty-icon large">📚</span><h3>No learning paths found</h3><p>Try a different filter.</p></div>'; return; }

    setHTML('learning-paths-grid', paths.map(path => {
      const state = State.learningPaths[path.id] || { started:false, completedModules:[] };
      const done = state.completedModules?.length || 0, total = path.modules.length;
      const pct = Math.round((done/total)*100);
      const isComplete = done === total;
      return `<div class="path-card ${isComplete?'active':''}" style="cursor:pointer" data-path-id="${esc(path.id)}">
        <div class="path-icon">${path.icon}</div>
        <div class="path-info">
          <div class="path-name">${esc(path.name)}</div>
          <div class="path-desc">${esc(path.desc)}</div>
          <div style="margin-top:10px">
            <div class="path-progress-track"><div class="path-progress-fill" style="width:${pct}%"></div></div>
            <div class="path-progress-label">${done}/${total} modules · ${pct}%</div>
          </div>
        </div>
        <span class="path-status ${isComplete?'completed':state.started?'in-progress':'not-started'}">${isComplete?'Complete':state.started?'In Progress':'Start'}</span>
      </div>`;
    }).join(''));

    container.querySelectorAll('[data-path-id]').forEach(el => el.addEventListener('click', () => openLearningPathModal(el.dataset.pathId)));
  }

  function openLearningPathModal(pathId) {
    const path = LEARNING_PATHS.find(p=>p.id===pathId);
    if (!path) return;
    if (!State.learningPaths[pathId]) State.learningPaths[pathId] = { started:true, completedModules:[] };
    State.learningPaths[pathId].started = true;
    saveState();

    const state = State.learningPaths[pathId];

    const body = document.createElement('div');
    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border-subtle)';
    const iconEl = document.createElement('span');
    iconEl.style.cssText = 'font-size:2rem;width:48px;height:48px;display:flex;align-items:center;justify-content:center;background:rgba(99,102,241,.1);border-radius:10px';
    iconEl.textContent = path.icon;
    const info = document.createElement('div');
    const title = document.createElement('h3'); title.textContent = path.name; title.style.marginBottom='4px';
    const desc = document.createElement('p'); desc.textContent = path.desc; desc.style.cssText = 'font-size:.85rem;color:var(--text-muted)';
    info.append(title, desc);
    header.append(iconEl, info);
    body.appendChild(header);

    path.modules.forEach((mod, i) => {
      const done = state.completedModules?.includes(mod.id);
      const row = document.createElement('div');
      row.style.cssText = `display:flex;align-items:center;gap:12px;padding:12px;border-radius:8px;margin-bottom:6px;background:${done?'rgba(16,185,129,.05)':'rgba(255,255,255,.02)'};border:1px solid ${done?'rgba(16,185,129,.2)':'var(--border-subtle)'}`;

      const checkBtn = document.createElement('button');
      checkBtn.style.cssText = `width:28px;height:28px;border-radius:50%;border:2px solid ${done?'var(--emerald)':'var(--border-input)'};background:${done?'var(--emerald)':'transparent'};color:#fff;font-size:.8rem;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center`;
      checkBtn.textContent = done ? '✓' : String(i+1);
      checkBtn.addEventListener('click', () => { toggleModule(pathId, mod.id); openLearningPathModal(pathId); });

      const modInfo = document.createElement('div');
      const modName = document.createElement('div'); modName.textContent = mod.name;
      modName.style.cssText = `font-weight:600;font-size:.9rem;${done?'text-decoration:line-through;opacity:.6':''}`;
      const modDesc = document.createElement('div'); modDesc.textContent = mod.desc;
      modDesc.style.cssText = 'font-size:.8rem;color:var(--text-muted);margin-top:2px';
      modInfo.append(modName, modDesc);
      row.append(checkBtn, modInfo);
      body.appendChild(row);
    });

    const footer = document.createElement('div');
    footer.innerHTML = '<button class="btn btn-secondary" id="close-path-btn">Close</button>';
    openModal(path.name, body, footer);
    footer.querySelector('#close-path-btn').addEventListener('click', closeModal);
  }

  function toggleModule(pathId, moduleId) {
    if (!State.learningPaths[pathId]) State.learningPaths[pathId] = { started:true, completedModules:[] };
    const state = State.learningPaths[pathId];
    if (!state.completedModules) state.completedModules = [];
    const idx = state.completedModules.indexOf(moduleId);
    if (idx>=0) state.completedModules.splice(idx,1); else state.completedModules.push(moduleId);
    recordActivity(); saveState(); checkAchievements();
  }

  // ── 12. NOTIFICATIONS ─────────────────────────
  let notifCount = 0, reminderTimer = null;

  function showNotification(message, type='info', duration=4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    // SECURITY: Build toast using DOM, not innerHTML with user-controlled message
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = 'display:flex;align-items:flex-start;gap:10px;padding:14px 16px;background:var(--bg-secondary);border:1px solid var(--border-card);border-radius:12px;box-shadow:var(--shadow-lg);pointer-events:auto;animation:slideInRight .4s ease forwards;position:relative;overflow:hidden';

    const leftBar = document.createElement('div');
    leftBar.style.cssText = `position:absolute;top:0;left:0;width:3px;height:100%;background:${type==='success'?'var(--emerald)':type==='error'?'var(--rose)':type==='warning'?'var(--amber)':'var(--cyan)'}`;

    const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
    const iconEl = document.createElement('span');
    iconEl.style.cssText = 'font-size:1.1rem;flex-shrink:0;margin-left:8px';
    iconEl.textContent = icons[type] || 'ℹ️';

    const msgEl = document.createElement('span');
    msgEl.style.cssText = 'flex:1;font-size:.875rem;font-weight:500';
    msgEl.textContent = message; // textContent, not innerHTML — safe

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = 'width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:4px;color:var(--text-muted);font-size:.8rem;cursor:pointer;flex-shrink:0';
    closeBtn.textContent = '✕';

    toast.append(leftBar, iconEl, msgEl, closeBtn);
    container.appendChild(toast);

    const remove = () => { toast.style.animation='slideOutRight .3s ease forwards'; setTimeout(()=>toast.remove(), 300); notifCount=Math.max(0,notifCount-1); updateNotifBadge(); };
    closeBtn.addEventListener('click', remove);
    setTimeout(remove, duration);

    notifCount++;
    updateNotifBadge();
  }

  function updateNotifBadge() {
    const badge = document.getElementById('notification-badge');
    if (badge) { badge.textContent = notifCount; badge.hidden = notifCount === 0; }
  }

  function setupReminders() {
    if (reminderTimer) clearInterval(reminderTimer);
    if (!State.settings.notifications || State.settings.reminderInterval <= 0) return;
    const msgs = ['Remember to check on your goals today! 🎯','Have you completed your habits? 🌱','Stay consistent — small steps lead to big results! 🏆','Time for a quick progress check! 📊'];
    reminderTimer = setInterval(() => showNotification(msgs[Math.floor(Math.random()*msgs.length)], 'info', 5000), State.settings.reminderInterval*60000);
  }

  // ── 13. CONFETTI ──────────────────────────────
  function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth; canvas.height = innerHeight;
    const colors = ['#8b5cf6','#06b6d4','#10b981','#f59e0b','#f43f5e','#6366f1'];
    const particles = Array.from({length:120}, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height*-1,
      size:Math.random()*8+4, color:colors[Math.floor(Math.random()*colors.length)],
      vx:(Math.random()-.5)*6, vy:Math.random()*4+2, rot:Math.random()*360, rSpeed:(Math.random()-.5)*10,
      shape:Math.random()>.5?'rect':'circle'
    }));
    const start=performance.now(), dur=3000;
    (function animate(now) {
      const el=now-start;
      if(el>dur){ctx.clearRect(0,0,canvas.width,canvas.height);return;}
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const op=1-Math.max(0,(el-dur*.7)/(dur*.3));
      particles.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.rot+=p.rSpeed;
        ctx.save(); ctx.globalAlpha=op; ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180);
        ctx.fillStyle=p.color;
        if(p.shape==='rect') ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
        else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      });
      requestAnimationFrame(animate);
    })(start);
  }

  // ── 14. THEME ─────────────────────────────────
  function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    document.body.classList.toggle('dark-theme', !isDark);
    document.body.classList.toggle('light-theme', isDark);
    State.settings.theme = isDark ? 'light' : 'dark';
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = State.settings.theme === 'dark' ? '🌙' : '☀️';
    saveState();
  }

  function applyTheme() {
    document.body.classList.toggle('dark-theme', State.settings.theme !== 'light');
    document.body.classList.toggle('light-theme', State.settings.theme === 'light');
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = State.settings.theme === 'dark' ? '🌙' : '☀️';
  }

  // ── 15. SETTINGS ──────────────────────────────
  function initSettings() {
    document.getElementById('settings-btn')?.addEventListener('click', () => document.getElementById('settings-panel')?.classList.add('open'));
    document.getElementById('close-settings-btn')?.addEventListener('click', () => document.getElementById('settings-panel')?.classList.remove('open'));
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);

    const nameInput = document.getElementById('setting-name');
    if (nameInput) {
      nameInput.value = State.settings.name;
      nameInput.addEventListener('input', () => {
        State.settings.name = nameInput.value.trim() || 'User';
        saveState();
        setText('user-name', State.settings.name);
        const g = document.getElementById('welcome-greeting');
        if (g) g.textContent = `${getGreeting()}, ${State.settings.name}!`;
      });
    }

    const notifToggle = document.getElementById('setting-notifications');
    if (notifToggle) { notifToggle.checked = State.settings.notifications; notifToggle.addEventListener('change', () => { State.settings.notifications=notifToggle.checked; saveState(); setupReminders(); }); }

    const remInput = document.getElementById('setting-reminder');
    if (remInput) { remInput.value = State.settings.reminderInterval; remInput.addEventListener('change', () => { State.settings.reminderInterval=parseInt(remInput.value)||60; saveState(); setupReminders(); }); }

    document.getElementById('export-data-btn')?.addEventListener('click', () => {
      try {
        State._exported = true; saveState();
        const a = Object.assign(document.createElement('a'), {
          href: URL.createObjectURL(new Blob([JSON.stringify(State,null,2)], {type:'application/json'})),
          download: `growth-backup-${todayStr()}.json`
        });
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        showNotification('Data exported!', 'success'); checkAchievements();
      } catch(e) { showNotification('Export failed.', 'error'); }
    });

    document.getElementById('import-data-btn')?.addEventListener('click', () => {
      const inp = Object.assign(document.createElement('input'), {type:'file', accept:'.json'});
      inp.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const imported = JSON.parse(ev.target.result);
            Object.keys(imported).forEach(key => {
              if (key === 'settings') State.settings = {...State.settings,...imported.settings};
              else if (key in State) State[key] = imported[key];
            });
            saveState(); applyTheme(); showNotification('Data imported!', 'success'); navigate(currentView);
          } catch { showNotification('Invalid backup file.', 'error'); }
        };
        reader.readAsText(file);
      });
      inp.click();
    });

    document.getElementById('reset-data-btn')?.addEventListener('click', () => {
      if (confirm('Reset ALL data? This cannot be undone!') && confirm('Permanently delete all goals, habits, and progress?')) {
        try { localStorage.removeItem(STORAGE_KEY); showNotification('All data reset.', 'info'); setTimeout(()=>location.reload(), 500); }
        catch { showNotification('Reset failed.', 'error'); }
      }
    });

    setText('user-name', State.settings.name);
  }

  // ── 16. MODAL ─────────────────────────────────
  let prevFocused = null;

  function openModal(title, bodyEl, footerEl) {
    prevFocused = document.activeElement;
    const overlay = document.getElementById('modal-overlay');
    const titleEl = document.getElementById('modal-title');
    const bodyContainer = document.getElementById('modal-body');
    const footerContainer = document.getElementById('modal-footer');

    if (titleEl) titleEl.textContent = title; // textContent, not innerHTML
    if (bodyContainer) { bodyContainer.innerHTML = ''; if (bodyEl instanceof Element) bodyContainer.appendChild(bodyEl); else bodyContainer.innerHTML = bodyEl; }
    if (footerContainer) { footerContainer.innerHTML = ''; if (footerEl instanceof Element) footerContainer.appendChild(footerEl); else if (footerEl) footerContainer.innerHTML = footerEl; }

    if (overlay) { overlay.removeAttribute('hidden'); overlay.classList.add('active'); overlay.style.display='flex'; }
    setTimeout(() => overlay?.querySelector('input, button')?.focus(), 50);
  }

  function closeModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) { overlay.classList.remove('active'); overlay.style.display='none'; overlay.setAttribute('hidden',''); }
    prevFocused?.focus(); prevFocused = null;
  }

  function initModal() {
    document.getElementById('modal-overlay')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });
    document.getElementById('modal-close-btn')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key !== 'Escape') return;
      if (document.getElementById('modal-overlay')?.classList.contains('active')) closeModal();
      if (document.getElementById('settings-panel')?.classList.contains('open')) document.getElementById('settings-panel').classList.remove('open');
    });
  }

  // ── 17. INIT ──────────────────────────────────
  function init() {
    loadState();
    if (!State.firstVisit) { State.firstVisit = new Date().toISOString(); }
    if (!State.activity[todayStr()]) recordActivity();
    else saveState();

    applyTheme(); initRouter(); initModal(); initSettings(); setupReminders(); checkAchievements();

    // Sidebar hamburger
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar = document.querySelector('.sidebar');
    hamburger?.addEventListener('click', () => sidebar?.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (sidebar?.classList.contains('open') && !sidebar.contains(e.target) && !hamburger?.contains(e.target))
        sidebar.classList.remove('open');
    });

    // Notification bell
    document.getElementById('notification-bell')?.addEventListener('click', () => { notifCount=0; updateNotifBadge(); showNotification('All caught up! 🎉', 'info', 2000); });

    // Sidebar close button
    document.getElementById('sidebar-close')?.addEventListener('click', () => sidebar?.classList.remove('open'));

    // Refresh recommendations
    document.getElementById('refresh-recs')?.addEventListener('click', () => { const r=document.getElementById('recommendations-list'); if(r) renderRecommendations(r); });
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);