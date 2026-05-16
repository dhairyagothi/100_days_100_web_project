/* ============================================================
   CONTRIBUTOR PROGRESS DASHBOARD — JavaScript
   ============================================================ */

'use strict';

/* ── Data Store ─────────────────────────────────────── */
const DATA = {
  weekly: {
    overall: 72,
    total: 48, prs: 11, streak: 7, badges: 2,
    legend: { frontend: 18, backend: 9, aiml: 6, docs: 7, devops: 4, design: 4 },
    topics: [
      {
        id: 'frontend', name: 'Frontend', icon: 'fa-brands fa-html5',
        color: '#6c63ff', bgAlpha: '1a', pct: 78, count: 18,
        label: 'Web UI',
        tags: ['HTML', 'CSS', 'React'],
        stats: { prs: 6, issues: 8, files: 42 },
        tasks: [
          { icon: 'fas fa-code-pull-request', text: 'PR #102 – Navbar redesign merged' },
          { icon: 'fas fa-bug', text: 'Issue #98 – Fixed mobile overflow bug' },
          { icon: 'fas fa-code', text: 'PR #99 – Added CSS animations to hero' },
        ]
      },
      {
        id: 'backend', name: 'Backend', icon: 'fas fa-server',
        color: '#00d4aa', bgAlpha: '1a', pct: 55, count: 9,
        label: 'APIs & Logic',
        tags: ['Node.js', 'Express', 'REST'],
        stats: { prs: 3, issues: 4, files: 19 },
        tasks: [
          { icon: 'fas fa-code-pull-request', text: 'PR #88 – Auth middleware added' },
          { icon: 'fas fa-bug', text: 'Issue #91 – Fixed JWT expiry bug' },
        ]
      },
      {
        id: 'aiml', name: 'AI / ML', icon: 'fas fa-brain',
        color: '#ff9f43', bgAlpha: '1a', pct: 40, count: 6,
        label: 'Machine Learning',
        tags: ['Python', 'TensorFlow', 'Jupyter'],
        stats: { prs: 2, issues: 3, files: 11 },
        tasks: [
          { icon: 'fas fa-code-pull-request', text: 'PR #77 – Added image classifier demo' },
          { icon: 'fas fa-file-alt', text: 'Added Jupyter notebook for EDA' },
        ]
      },
      {
        id: 'docs', name: 'Documentation', icon: 'fas fa-book-open',
        color: '#ff4f6a', bgAlpha: '1a', pct: 90, count: 7,
        label: 'Docs & Guides',
        tags: ['Markdown', 'README', 'Wiki'],
        stats: { prs: 5, issues: 2, files: 14 },
        tasks: [
          { icon: 'fas fa-code-pull-request', text: 'PR #95 – Updated CONTRIBUTING.md' },
          { icon: 'fas fa-code-pull-request', text: 'PR #100 – Added project README' },
          { icon: 'fas fa-edit', text: 'Improved onboarding guide' },
        ]
      },
      {
        id: 'devops', name: 'DevOps', icon: 'fas fa-gears',
        color: '#54a0ff', bgAlpha: '1a', pct: 30, count: 4,
        label: 'CI/CD & Infra',
        tags: ['GitHub Actions', 'Docker'],
        stats: { prs: 2, issues: 1, files: 8 },
        tasks: [
          { icon: 'fas fa-code-pull-request', text: 'PR #82 – Added GitHub Actions workflow' },
        ]
      },
      {
        id: 'design', name: 'Design', icon: 'fas fa-palette',
        color: '#a29bfe', bgAlpha: '1a', pct: 60, count: 4,
        label: 'UI/UX Design',
        tags: ['Figma', 'CSS', 'Icons'],
        stats: { prs: 3, issues: 2, files: 9 },
        tasks: [
          { icon: 'fas fa-code-pull-request', text: 'PR #89 – New color palette applied' },
          { icon: 'fas fa-image', text: 'Added Figma mockup for dashboard' },
        ]
      },
    ],
    activity: [12, 5, 9, 14, 7, 8, 11],
  },
  monthly: {
    overall: 58,
    total: 148, prs: 34, streak: 21, badges: 5,
    legend: { frontend: 52, backend: 28, aiml: 20, docs: 24, devops: 12, design: 12 },
    topics: [
      { id: 'frontend', name: 'Frontend', icon: 'fa-brands fa-html5', color: '#6c63ff', bgAlpha: '1a', pct: 65, count: 52, label: 'Web UI', tags: ['HTML', 'CSS', 'React'], stats: { prs: 18, issues: 22, files: 130 }, tasks: [{ icon: 'fas fa-code-pull-request', text: 'PR #102 – Navbar redesign merged' }, { icon: 'fas fa-code-pull-request', text: 'PR #99 – Added hero animations' }, { icon: 'fas fa-bug', text: 'Fixed 8 mobile responsiveness issues' }] },
      { id: 'backend',  name: 'Backend',  icon: 'fas fa-server',      color: '#00d4aa', bgAlpha: '1a', pct: 48, count: 28, label: 'APIs & Logic', tags: ['Node.js', 'Express'], stats: { prs: 9, issues: 11, files: 67 }, tasks: [{ icon: 'fas fa-code-pull-request', text: 'PR #88 – Auth middleware' }, { icon: 'fas fa-bug', text: 'Fixed 3 API timeout issues' }] },
      { id: 'aiml',    name: 'AI / ML',   icon: 'fas fa-brain',       color: '#ff9f43', bgAlpha: '1a', pct: 35, count: 20, label: 'Machine Learning', tags: ['Python', 'TF'], stats: { prs: 6, issues: 8, files: 35 }, tasks: [{ icon: 'fas fa-code-pull-request', text: 'PR #77 – Image classifier' }] },
      { id: 'docs',    name: 'Documentation', icon: 'fas fa-book-open', color: '#ff4f6a', bgAlpha: '1a', pct: 88, count: 24, label: 'Docs & Guides', tags: ['Markdown', 'Wiki'], stats: { prs: 14, issues: 6, files: 48 }, tasks: [{ icon: 'fas fa-code-pull-request', text: 'PR #95 – CONTRIBUTING.md' }, { icon: 'fas fa-edit', text: 'Updated 6 README files' }] },
      { id: 'devops',  name: 'DevOps',   icon: 'fas fa-gears',        color: '#54a0ff', bgAlpha: '1a', pct: 25, count: 12, label: 'CI/CD & Infra', tags: ['GH Actions'], stats: { prs: 4, issues: 3, files: 18 }, tasks: [{ icon: 'fas fa-code-pull-request', text: 'PR #82 – GH Actions workflow' }] },
      { id: 'design',  name: 'Design',   icon: 'fas fa-palette',      color: '#a29bfe', bgAlpha: '1a', pct: 55, count: 12, label: 'UI/UX Design', tags: ['Figma', 'CSS'], stats: { prs: 8, issues: 5, files: 28 }, tasks: [{ icon: 'fas fa-code-pull-request', text: 'PR #89 – New color palette' }] },
    ],
    activity: [38, 22, 29, 41, 18, 33, 28],
  },
  alltime: {
    overall: 85,
    total: 437, prs: 98, streak: 45, badges: 5,
    legend: { frontend: 160, backend: 84, aiml: 55, docs: 72, devops: 34, design: 32 },
    topics: [
      { id: 'frontend', name: 'Frontend', icon: 'fa-brands fa-html5', color: '#6c63ff', bgAlpha: '1a', pct: 88, count: 160, label: 'Web UI', tags: ['HTML', 'CSS', 'React'], stats: { prs: 48, issues: 62, files: 380 }, tasks: [{ icon: 'fas fa-code-pull-request', text: '48 PRs merged across all sessions' }, { icon: 'fas fa-star', text: 'Top contributor – Frontend domain' }] },
      { id: 'backend',  name: 'Backend',  icon: 'fas fa-server',      color: '#00d4aa', bgAlpha: '1a', pct: 72, count: 84,  label: 'APIs & Logic', tags: ['Node.js', 'Express'], stats: { prs: 26, issues: 34, files: 190 }, tasks: [{ icon: 'fas fa-code-pull-request', text: '26 PRs merged – Backend domain' }] },
      { id: 'aiml',    name: 'AI / ML',   icon: 'fas fa-brain',       color: '#ff9f43', bgAlpha: '1a', pct: 50, count: 55,  label: 'Machine Learning', tags: ['Python', 'TF'], stats: { prs: 16, issues: 22, files: 98 }, tasks: [{ icon: 'fas fa-code-pull-request', text: '16 PRs – AI/ML notebooks & demos' }] },
      { id: 'docs',    name: 'Documentation', icon: 'fas fa-book-open', color: '#ff4f6a', bgAlpha: '1a', pct: 92, count: 72, label: 'Docs & Guides', tags: ['Markdown', 'Wiki'], stats: { prs: 38, issues: 18, files: 144 }, tasks: [{ icon: 'fas fa-book', text: '38 doc PRs – highest completion rate' }] },
      { id: 'devops',  name: 'DevOps',   icon: 'fas fa-gears',        color: '#54a0ff', bgAlpha: '1a', pct: 40, count: 34,  label: 'CI/CD & Infra', tags: ['GH Actions'], stats: { prs: 12, issues: 10, files: 55 }, tasks: [{ icon: 'fas fa-code-pull-request', text: '12 DevOps PRs merged' }] },
      { id: 'design',  name: 'Design',   icon: 'fas fa-palette',      color: '#a29bfe', bgAlpha: '1a', pct: 68, count: 32,  label: 'UI/UX Design', tags: ['Figma', 'CSS'], stats: { prs: 20, issues: 14, files: 76 }, tasks: [{ icon: 'fas fa-code-pull-request', text: '20 design PRs merged' }] },
    ],
    activity: [120, 80, 95, 140, 72, 88, 110],
  },
};

const BADGES = [
  { icon: '🚀', name: 'First PR',      desc: 'Merged first PR',     locked: false },
  { icon: '🔥', name: 'Streak 7',      desc: '7-day streak',        locked: false },
  { icon: '📚', name: 'Doc Master',    desc: '10+ doc PRs',         locked: false },
  { icon: '⭐', name: 'Top Contrib',   desc: 'Top contributor',     locked: false },
  { icon: '🏆', name: 'Centurion',     desc: '100+ contributions',  locked: false },
  { icon: '🤖', name: 'AI Pioneer',    desc: '5+ AI/ML PRs',        locked: true  },
  { icon: '🛠️', name: 'DevOps Hero',   desc: '10+ DevOps PRs',      locked: true  },
  { icon: '💎', name: 'Diamond',       desc: '500+ contributions',  locked: true  },
  { icon: '🌙', name: 'Night Owl',     desc: '20 late-night PRs',   locked: true  },
  { icon: '🎨', name: 'Designer',      desc: '15+ design PRs',      locked: true  },
  { icon: '⚡', name: 'Speed Demon',   desc: 'PR in under 1h',      locked: true  },
  { icon: '🌟', name: 'GSSoC Star',    desc: 'Program top 10',      locked: true  },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_IDX = (new Date().getDay() + 6) % 7; // 0=Mon

let currentPeriod = 'weekly';

/* ── Bootstrap ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderBadges();
  renderPeriod('weekly');
  initPeriodToggle();
  initModal();
  injectGradientDefs();
});

/* ── Period toggle ── */
function initPeriodToggle() {
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      renderPeriod(currentPeriod);
    });
  });
}

/* ── Render full dashboard for a period ── */
function renderPeriod(period) {
  const d = DATA[period];
  animateSummary(d);
  animateOverallRing(d.overall, d.legend);
  renderTopics(d.topics);
  renderTimeline(d.activity);
  document.getElementById('overallPeriodLabel').textContent =
    period === 'weekly' ? 'This Week' : period === 'monthly' ? 'This Month' : 'All Time';
}

/* ── Summary counter animation ── */
function animateSummary(d) {
  const map = [
    ['summaryTotal',   d.total],
    ['summaryPRs',     d.prs],
    ['summaryStreak',  d.streak],
    ['summaryBadges',  d.badges],
  ];
  map.forEach(([id, target]) => {
    const el = document.querySelector(`#${id} .summary-value`);
    if (!el) return;
    el.dataset.target = target;
    countUp(el, target);
  });
}

function countUp(el, target, duration = 900) {
  const start = performance.now();
  const from  = parseInt(el.textContent) || 0;
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(from + (target - from) * easeOut(t));
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ── Overall ring ── */
function animateOverallRing(pct, legend) {
  const circle = document.getElementById('overallRingFill');
  const pctEl  = document.getElementById('overallPercent');
  const circ   = 515; // 2π × 82

  // Animate ring
  setTimeout(() => {
    circle.style.strokeDashoffset = circ - (pct / 100) * circ;
  }, 100);

  // Animate percent text
  countUpText(pctEl, pct, '%');

  // Legend counts
  const keys = { frontend: 'leg-frontend', backend: 'leg-backend', aiml: 'leg-aiml', docs: 'leg-docs', devops: 'leg-devops', design: 'leg-design' };
  Object.entries(keys).forEach(([key, elId]) => {
    const el = document.getElementById(elId);
    if (el) countUp(el, legend[key]);
  });
}

function countUpText(el, target, suffix = '', duration = 900) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * easeOut(t)) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ── Topic cards ── */
function renderTopics(topics) {
  const grid = document.getElementById('topicsGrid');
  grid.innerHTML = '';

  topics.forEach((topic, i) => {
    const card = document.createElement('div');
    card.className = 'topic-card';
    card.style.animationDelay = `${i * 0.07}s`;
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${topic.name}`);

    const tagPills = topic.tags.map(t =>
      `<span class="tag-pill" style="background:${topic.color}22;color:${topic.color}">${t}</span>`
    ).join('');

    card.innerHTML = `
      <div class="topic-card-header">
        <div class="topic-icon-wrap" style="background:${topic.color}22;color:${topic.color}">
          <i class="${topic.icon}"></i>
        </div>
        <span class="topic-badge" style="background:${topic.color}22;color:${topic.color}">${topic.pct}%</span>
      </div>
      <p class="topic-name">${topic.name}</p>
      <p class="topic-count"><i class="fas fa-code-commit" style="color:${topic.color}"></i> ${topic.count} contributions</p>
      <div class="bar-wrap">
        <div class="bar-fill" style="background:linear-gradient(90deg,${topic.color}cc,${topic.color})" data-pct="${topic.pct}"></div>
      </div>
      <div class="bar-meta">
        <span>${topic.label}</span>
        <span class="bar-pct" style="color:${topic.color}">${topic.pct}%</span>
      </div>
      <div class="topic-card-footer">${tagPills}</div>
    `;

    card.addEventListener('click', () => openModal(topic));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(topic); });

    grid.appendChild(card);

    // Animate bar after render
    requestAnimationFrame(() => {
      setTimeout(() => {
        const fill = card.querySelector('.bar-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
      }, 150 + i * 70);
    });
  });
}

/* ── Timeline ── */
function renderTimeline(activity) {
  const barsEl = document.getElementById('timelineBars');
  const daysEl = document.getElementById('timelineDays');
  const max    = Math.max(...activity);
  const maxH   = 130; // px

  barsEl.innerHTML = '';
  daysEl.innerHTML = '';

  activity.forEach((val, i) => {
    const h    = max > 0 ? Math.round((val / max) * maxH) : 4;
    const hue  = 260 - i * 15;
    const isToday = i === TODAY_IDX;

    const wrap = document.createElement('div');
    wrap.className = 'tl-bar-wrap';
    wrap.innerHTML = `
      <span class="tl-count">${val}</span>
      <div class="tl-bar"
        style="background:hsl(${hue},70%,60%);height:0"
        data-tip="${val} contribution${val !== 1 ? 's' : ''} – ${DAYS[i]}"
        data-h="${h}">
      </div>
    `;
    barsEl.appendChild(wrap);

    const dayEl = document.createElement('div');
    dayEl.className = 'tl-day' + (isToday ? ' today' : '');
    dayEl.textContent = DAYS[i];
    daysEl.appendChild(dayEl);

    // Animate bar height
    setTimeout(() => {
      const bar = wrap.querySelector('.tl-bar');
      bar.style.height = bar.dataset.h + 'px';
    }, 100 + i * 60);
  });
}

/* ── Badges ── */
function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = '';
  BADGES.forEach(b => {
    const card = document.createElement('div');
    card.className = 'badge-card' + (b.locked ? ' locked' : '');
    card.title = b.locked ? `🔒 Locked – ${b.desc}` : b.desc;
    card.innerHTML = `
      <span class="badge-icon">${b.icon}</span>
      <p class="badge-name">${b.name}</p>
      <p class="badge-desc">${b.locked ? '🔒 ' : ''}${b.desc}</p>
    `;
    grid.appendChild(card);
  });
}

/* ── Modal ── */
function initModal() {
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(topic) {
  const overlay = document.getElementById('modalOverlay');

  // Icon
  const iconWrap = document.getElementById('modalIcon');
  iconWrap.innerHTML = `<i class="${topic.icon}"></i>`;
  iconWrap.style.background = `${topic.color}22`;
  iconWrap.style.color       = topic.color;

  document.getElementById('modalTitle').textContent = topic.name;
  document.getElementById('modalSub').textContent   = topic.label;
  document.getElementById('modalRingPct').textContent = '0%';

  // Stats
  document.getElementById('mContrib').textContent = topic.count;
  document.getElementById('mPRs').textContent     = topic.stats.prs;
  document.getElementById('mIssues').textContent  = topic.stats.issues;
  document.getElementById('mFiles').textContent   = topic.stats.files;

  // Tasks
  const list = document.getElementById('modalTaskList');
  list.innerHTML = topic.tasks.map(t =>
    `<li class="modal-task-item"><i class="${t.icon}" style="color:${topic.color}"></i>${t.text}</li>`
  ).join('');

  // Ring
  const ring = document.getElementById('modalRingFill');
  ring.style.stroke           = topic.color;
  ring.style.strokeDashoffset = 314; // reset

  overlay.hidden = false;
  document.body.style.overflow = 'hidden';

  // Animate ring after paint
  requestAnimationFrame(() => {
    setTimeout(() => {
      ring.style.strokeDashoffset = 314 - (topic.pct / 100) * 314;
      countUpText(document.getElementById('modalRingPct'), topic.pct, '%');
    }, 80);
  });
}

function closeModal() {
  document.getElementById('modalOverlay').hidden = true;
  document.body.style.overflow = '';
}

/* ── SVG gradient defs ── */
function injectGradientDefs() {
  const svg = document.querySelector('.ring-svg');
  if (!svg) return;
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#6c63ff"/>
      <stop offset="50%"  stop-color="#00d4aa"/>
      <stop offset="100%" stop-color="#ff9f43"/>
    </linearGradient>`;
  svg.prepend(defs);
}
