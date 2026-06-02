/* ─────────────────────────────────────────────
   BOREDOM BUSTER — script.js
   3-stage API fallback + local library
   Features: favourites, history, toast, tabs,
             dark/light theme, copy to clipboard
───────────────────────────────────────────── */

'use strict';

// ── Local Activity Library (30 items, all 9 categories) ──────────────────────
const LOCAL_ACTIVITIES = [
  // Education (price 0)
  { activity: 'Watch a TED talk on a topic you know nothing about', type: 'education',    participants: 1, price: 0.0 },
  { activity: 'Learn 10 words in a new language on Duolingo',        type: 'education',    participants: 1, price: 0.0 },
  { activity: 'Read a Wikipedia deep-dive rabbit hole for an hour',  type: 'education',    participants: 1, price: 0.0 },
  // Recreational
  { activity: 'Go for a 30-minute walk and count interesting things', type: 'recreational', participants: 1, price: 0.0 },
  { activity: 'Learn to juggle with three socks',                     type: 'recreational', participants: 1, price: 0.0 },
  { activity: 'Do a 500-piece jigsaw puzzle',                         type: 'recreational', participants: 2, price: 0.2 },
  { activity: 'Stargaze and identify five constellations',            type: 'recreational', participants: 2, price: 0.0 },
  // Social
  { activity: 'Host a virtual movie night with friends',              type: 'social',       participants: 4, price: 0.0 },
  { activity: 'Play a board game with friends',                       type: 'social',       participants: 4, price: 0.1 },
  { activity: 'Organise a neighbourhood trivia night',                type: 'social',       participants: 6, price: 0.2 },
  { activity: 'Write and perform a stand-up comedy bit for friends',  type: 'social',       participants: 3, price: 0.0 },
  // DIY
  { activity: 'Learn origami — fold a paper crane',                   type: 'diy',          participants: 1, price: 0.0 },
  { activity: 'Build a birdhouse from scrap wood',                    type: 'diy',          participants: 2, price: 0.3 },
  { activity: 'Repot a houseplant and add decorative stones',         type: 'diy',          participants: 1, price: 0.1 },
  { activity: 'Make a scrapbook of your favourite memories',          type: 'diy',          participants: 1, price: 0.2 },
  // Charity
  { activity: 'Donate unused items to a local charity',               type: 'charity',      participants: 1, price: 0.0 },
  { activity: 'Volunteer at a local food bank for an afternoon',      type: 'charity',      participants: 2, price: 0.0 },
  { activity: 'Write letters to elderly residents in care homes',     type: 'charity',      participants: 1, price: 0.0 },
  // Cooking
  { activity: 'Cook a recipe from a country you have never tried',    type: 'cooking',      participants: 2, price: 0.3 },
  { activity: 'Bake cookies and share with a neighbour',              type: 'cooking',      participants: 1, price: 0.2 },
  { activity: 'Make homemade pizza from scratch',                     type: 'cooking',      participants: 3, price: 0.4 },
  { activity: 'Try a new smoothie recipe with seasonal fruit',        type: 'cooking',      participants: 1, price: 0.1 },
  // Relaxation
  { activity: 'Do a 10-minute guided meditation',                     type: 'relaxation',   participants: 1, price: 0.0 },
  { activity: 'Write a letter to your future self',                   type: 'relaxation',   participants: 1, price: 0.0 },
  { activity: 'Start a gratitude journal — write five things',        type: 'relaxation',   participants: 1, price: 0.0 },
  { activity: 'Take a long bath with candles and music',              type: 'relaxation',   participants: 1, price: 0.6 },
  // Music
  { activity: 'Learn a simple guitar chord progression',              type: 'music',        participants: 1, price: 0.0 },
  { activity: 'Compose a short melody using GarageBand or similar',   type: 'music',        participants: 1, price: 0.0 },
  { activity: 'Create a playlist for every mood you have',            type: 'music',        participants: 1, price: 0.0 },
  // Busywork
  { activity: 'Organise your digital files and delete duplicates',    type: 'busywork',     participants: 1, price: 0.0 },
];

// ── State ───────────────────────────────────────────────────────────────────
let history    = [];          // session only
let favourites = JSON.parse(localStorage.getItem('bb_favs') || '[]');
let currentActivity = null;   // displayed activity object

// ── DOM Refs ──────────────────────────────────────────────────────────────────
const themeBtn    = document.getElementById('themeBtn');
const fetchBtn    = document.getElementById('fetchBtn');
const resultBox   = document.getElementById('resultBox');
const extraCard   = document.getElementById('extraCard');
const activityName = document.getElementById('activityName');
const sourceBadge  = document.getElementById('sourceBadge');
const pillType    = document.getElementById('pillType');
const pillPeeps   = document.getElementById('pillPeeps');
const pillCost    = document.getElementById('pillCost');
const favBtn      = document.getElementById('favBtn');
const shareBtn    = document.getElementById('shareBtn');
const againBtn    = document.getElementById('againBtn');
const historyList = document.getElementById('historyList');
const favList     = document.getElementById('favList');
const toast       = document.getElementById('toast');

// ── Theme Toggle ─────────────────────────────────────────────────────────────
themeBtn.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? '☀️' : '🌙';
});

// ── Tab Switching ─────────────────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`tab-${tab.dataset.tab}`).classList.add('active');
  });
});

// ── Fetch with AbortController ────────────────────────────────────────────────
async function fetchWithTimeout(url, ms = 6000) {
  const ctrl = new AbortController();
  const id    = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

// ── Build API URL ─────────────────────────────────────────────────────────────
function buildUrl({ category, participants, budget }) {
  let url = 'https://bored.api.lewagon.com/api/activity?';
  if (category)     url += `type=${category}&`;
  if (participants) url += `participants=${participants}&`;
  if (budget === 'free')      url += 'price=0.0&';
  else if (budget === 'cheap')     url += 'minprice=0.1&maxprice=0.4&';
  else if (budget === 'expensive') url += 'minprice=0.5&maxprice=1.0&';
  return url;
}

// ── Local Fallback ────────────────────────────────────────────────────────────
function getLocalFallback(category, participants, budget) {
  const notSeen = a => !history.some(h => h.activity === a.activity);

  function budgetMatch(price) {
    if (!budget)                   return true;
    if (budget === 'free')         return price === 0;
    if (budget === 'cheap')        return price > 0 && price <= 0.4;
    if (budget === 'expensive')    return price > 0.4;
    return true;
  }

  // Stage 1 — all filters
  let pool = LOCAL_ACTIVITIES.filter(a =>
    (!category    || a.type === category) &&
    (!participants || a.participants <= parseInt(participants)) &&
    budgetMatch(a.price) &&
    notSeen(a)
  );

  // Stage 2 — category only
  if (!pool.length) {
    pool = LOCAL_ACTIVITIES.filter(a =>
      (!category || a.type === category) && notSeen(a)
    );
  }

  // Stage 3 — full pool (prefer unseen)
  if (!pool.length) {
    pool = LOCAL_ACTIVITIES.filter(notSeen);
  }

  // Stage 4 — entire library (allow repeats)
  if (!pool.length) pool = LOCAL_ACTIVITIES;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Main Fetch Activity ───────────────────────────────────────────────────────
async function fetchActivity() {
  const category    = document.getElementById('category').value;
  const participants = document.getElementById('participants').value;
  const budget      = document.getElementById('budget').value;

  setLoading(true);

  let data   = null;
  let source = 'live';

  try {
    // Stage 1: full filters
    let res = await fetchWithTimeout(buildUrl({ category, participants, budget }));
    if (res.ok) data = await res.json();
    if (data?.error) data = null;

    // Stage 2: category only
    if (!data && category) {
      res = await fetchWithTimeout(buildUrl({ category, participants: '', budget: '' }));
      if (res.ok) data = await res.json();
      if (data?.error) data = null;
    }

    // Stage 3: fully random
    if (!data) {
      res = await fetchWithTimeout('https://bored.api.lewagon.com/api/activity');
      if (res.ok) data = await res.json();
      if (data?.error) data = null;
    }
  } catch (_) {
    // Network error — fall through to local
    data = null;
  }

  // Stage 4: local fallback
  if (!data) {
    data   = getLocalFallback(category, participants, budget);
    source = 'local';
  }

  setLoading(false);
  displayActivity(data, source);
}

// ── Display Activity ──────────────────────────────────────────────────────────
function displayActivity(data, source) {
  currentActivity = data;

  activityName.textContent = data.activity;
  sourceBadge.textContent  = source === 'live'
    ? '📡 Live from Bored API'
    : '📚 From curated local library';

  pillType.textContent  = `🏷 ${capitalize(data.type || '—')}`;
  pillPeeps.textContent = `👥 ${data.participants} ${data.participants === 1 ? 'person' : 'people'}`;

  // Cost pill with colour class
  pillCost.className = 'pill';
  if (data.price === 0)              { pillCost.textContent = '🆓 Free';   pillCost.classList.add('free'); }
  else if (data.price <= 0.4)        { pillCost.textContent = '💸 Cheap';  }
  else                               { pillCost.textContent = '💰 Pricey'; pillCost.classList.add('pricey'); }

  // Fav button state
  updateFavBtn();

  // Show result box with animation
  resultBox.hidden = false;
  resultBox.classList.remove('visible');
  void resultBox.offsetWidth; // reflow
  resultBox.classList.add('visible');

  // Show extra card
  extraCard.hidden = false;
  extraCard.classList.add('visible');

  // Push to history and re-render
  history.unshift({ activity: data.activity, type: data.type });
  if (history.length > 20) history.pop();
  renderHistory();
}

// ── Favourite Button ──────────────────────────────────────────────────────────
function updateFavBtn() {
  if (!currentActivity) return;
  const isFav = favourites.some(f => f.activity === currentActivity.activity);
  favBtn.textContent = isFav ? '🧡' : '🤍';
}

favBtn.addEventListener('click', () => {
  if (!currentActivity) return;
  const idx = favourites.findIndex(f => f.activity === currentActivity.activity);
  if (idx === -1) {
    favourites.push({ activity: currentActivity.activity, type: currentActivity.type });
    showToast('Added to favourites 🧡');
  } else {
    favourites.splice(idx, 1);
    showToast('Removed from favourites');
  }
  localStorage.setItem('bb_favs', JSON.stringify(favourites));
  updateFavBtn();
  renderFavourites();
});

// ── Share / Copy ──────────────────────────────────────────────────────────────
shareBtn.addEventListener('click', async () => {
  if (!currentActivity) return;
  const text = `✨ Boredom Buster Activity\n\n${currentActivity.activity}\nType: ${capitalize(currentActivity.type)} | People: ${currentActivity.participants}`;
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copied to clipboard 📋');
  } catch {
    showToast('Could not copy — try manually');
  }
});

// ── Shuffle (fetch again) ─────────────────────────────────────────────────────
againBtn.addEventListener('click', fetchActivity);

// ── Render History ────────────────────────────────────────────────────────────
function renderHistory() {
  if (!history.length) {
    historyList.innerHTML = '<li class="empty-state">No activities yet — find one!</li>';
    return;
  }
  historyList.innerHTML = [...history].reverse().slice(0, 20).map(h => `
    <li>
      <span>${h.activity}</span>
      <small style="flex-shrink:0;opacity:.55;font-size:.75rem">${capitalize(h.type)}</small>
    </li>
  `).join('');
}

// ── Render Favourites ─────────────────────────────────────────────────────────
function renderFavourites() {
  if (!favourites.length) {
    favList.innerHTML = '<li class="empty-state">No favourites yet — heart an activity!</li>';
    return;
  }
  favList.innerHTML = favourites.map((f, i) => `
    <li>
      <span>${f.activity}</span>
      <button class="remove-btn" data-index="${i}" title="Remove">✕</button>
    </li>
  `).join('');

  favList.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      favourites.splice(parseInt(btn.dataset.index), 1);
      localStorage.setItem('bb_favs', JSON.stringify(favourites));
      renderFavourites();
      updateFavBtn();
    });
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ── Loading State ─────────────────────────────────────────────────────────────
function setLoading(on) {
  fetchBtn.disabled    = on;
  fetchBtn.textContent = on ? '🔍 Seeking…' : 'Find Activity';
  againBtn.disabled    = on;
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

// ── Main Button ───────────────────────────────────────────────────────────────
fetchBtn.addEventListener('click', fetchActivity);

// ── Init ──────────────────────────────────────────────────────────────────────
renderHistory();
renderFavourites();