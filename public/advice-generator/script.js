/* ── Advice Generator — Enhanced Script ── */

const API_URL = 'https://api.adviceslip.com/advice';
const STORAGE_KEYS = { favorites: 'wisdom_favorites', theme: 'wisdom_theme' };
const MAX_HISTORY = 5;

// Mood classification for advice snippets
const MOODS = [
  { keywords: ['love', 'friend', 'family', 'kind', 'care', 'together', 'share', 'heart'], emoji: '💛', label: 'Warmth' },
  { keywords: ['try', 'work', 'hard', 'effort', 'success', 'goal', 'learn', 'grow', 'better'], emoji: '🔥', label: 'Drive' },
  { keywords: ['peace', 'calm', 'breath', 'slow', 'patient', 'relax', 'still', 'moment'], emoji: '🌿', label: 'Calm' },
  { keywords: ['courage', 'brave', 'fear', 'risk', 'bold', 'dare', 'face', 'strong'], emoji: '⚡', label: 'Courage' },
  { keywords: ['happy', 'joy', 'laugh', 'smile', 'fun', 'enjoy', 'delight', 'play'], emoji: '🌟', label: 'Joy' },
  { keywords: ['wise', 'know', 'truth', 'think', 'mind', 'understand', 'reason', 'learn'], emoji: '🔮', label: 'Wisdom' },
];

// State
let currentAdvice = { id: null, text: '' };
let favorites = [];
let history = [];
let isFavPanelOpen = false;

// DOM refs
const adviceIdEl   = document.getElementById('adviceId');
const adviceTextEl = document.getElementById('adviceText');
const moodBadgeEl  = document.getElementById('moodBadge');
const moodEmojiEl  = document.getElementById('moodEmoji');
const moodLabelEl  = document.getElementById('moodLabel');
const adviceCard   = document.getElementById('adviceCard');
const rollBtn      = document.getElementById('rollBtn');
const rollIcon     = document.getElementById('rollIcon');
const copyBtn      = document.getElementById('copyBtn');
const favoriteBtn  = document.getElementById('favoriteBtn');
const tweetBtn     = document.getElementById('tweetBtn');
const heartIcon    = document.getElementById('heartIcon');
const viewFavBtn   = document.getElementById('viewFavoritesBtn');
const favPanel     = document.getElementById('favoritesPanel');
const favList      = document.getElementById('favoritesList');
const favEmpty     = document.getElementById('favEmpty');
const favBtnLabel  = document.getElementById('favBtnLabel');
const clearFavBtn  = document.getElementById('clearFavoritesBtn');
const toastEl      = document.getElementById('toast');
const themeBtn     = document.getElementById('themeToggleBtn');
const historyStrip = document.getElementById('historyStrip');

/* ── Theme ── */
function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem(STORAGE_KEYS.theme, isDark ? 'light' : 'dark');
  themeBtn.title = isDark ? 'Switch to dark mode' : 'Switch to light mode';
}
themeBtn.addEventListener('click', toggleTheme);

/* ── Toast ── */
let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2400);
}

/* ── Mood detection ── */
function detectMood(text) {
  const lower = text.toLowerCase();
  for (const mood of MOODS) {
    if (mood.keywords.some(kw => lower.includes(kw))) return mood;
  }
  return { emoji: '✨', label: 'Insight' };
}

/* ── Favorites ── */
function loadFavorites() {
  try {
    favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.favorites)) || [];
  } catch {
    favorites = [];
  }
}
function saveFavorites() {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
}
function isCurrentFavorited() {
  return favorites.some(f => f.id === currentAdvice.id);
}
function updateFavoriteBtn() {
  const saved = isCurrentFavorited();
  heartIcon.setAttribute('fill', saved ? 'currentColor' : 'none');
  favoriteBtn.classList.toggle('saved', saved);
  favoriteBtn.querySelector('span').textContent = saved ? 'Saved' : 'Save';
}
function toggleFavorite() {
  if (!currentAdvice.id) return;
  if (isCurrentFavorited()) {
    favorites = favorites.filter(f => f.id !== currentAdvice.id);
    showToast('Removed from saved');
  } else {
    favorites.unshift({ id: currentAdvice.id, text: currentAdvice.text });
    showToast('Saved ✦');
  }
  saveFavorites();
  updateFavoriteBtn();
  updateFavBtnLabel();
  renderFavorites();
}
function updateFavBtnLabel() {
  favBtnLabel.textContent = `Saved (${favorites.length})`;
}
function renderFavorites() {
  favList.innerHTML = '';
  favEmpty.style.display = favorites.length === 0 ? 'block' : 'none';
  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.className = 'fav-item';
    li.innerHTML = `
      <div style="flex:1">
        <p class="fav-item-text">${escapeHtml(fav.text)}</p>
        <p class="fav-item-id">#${fav.id}</p>
      </div>
      <button class="fav-remove" data-id="${fav.id}" title="Remove" aria-label="Remove this advice">✕</button>`;
    li.querySelector('.fav-remove').addEventListener('click', e => {
      e.stopPropagation();
      favorites = favorites.filter(f => f.id !== fav.id);
      saveFavorites();
      updateFavBtnLabel();
      renderFavorites();
      if (currentAdvice.id === fav.id) updateFavoriteBtn();
      showToast('Removed');
    });
    // Click item to reload that advice
    li.querySelector('.fav-item-text').addEventListener('click', () => {
      displayAdvice(fav.id, fav.text);
      closeFavPanel();
    });
    favList.appendChild(li);
  });
}
function clearFavorites() {
  if (favorites.length === 0) return;
  favorites = [];
  saveFavorites();
  updateFavBtnLabel();
  renderFavorites();
  updateFavoriteBtn();
  showToast('All saved advice cleared');
}

/* ── Favorites panel toggle ── */
function openFavPanel() {
  isFavPanelOpen = true;
  favPanel.classList.add('open');
  favPanel.setAttribute('aria-hidden', 'false');
  viewFavBtn.setAttribute('aria-expanded', 'true');
  renderFavorites();
}
function closeFavPanel() {
  isFavPanelOpen = false;
  favPanel.classList.remove('open');
  favPanel.setAttribute('aria-hidden', 'true');
  viewFavBtn.setAttribute('aria-expanded', 'false');
}
viewFavBtn.addEventListener('click', () => {
  if (isFavPanelOpen) closeFavPanel(); else openFavPanel();
});
clearFavBtn.addEventListener('click', clearFavorites);

/* ── History dots ── */
function updateHistoryDots() {
  historyStrip.innerHTML = '';
  history.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'history-dot' + (i === history.length - 1 ? ' active' : '');
    historyStrip.appendChild(dot);
  });
}

/* ── Display advice ── */
function displayAdvice(id, text) {
  currentAdvice = { id, text };

  adviceIdEl.textContent = `#${id}`;
  adviceTextEl.textContent = text;

  const mood = detectMood(text);
  moodEmojiEl.textContent = mood.emoji;
  moodLabelEl.textContent = mood.label;

  const tweetText = encodeURIComponent(`"${text}" — Advice #${id}`);
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${tweetText}`;

  // history
  if (!history.includes(id)) {
    history.push(id);
    if (history.length > MAX_HISTORY) history.shift();
    updateHistoryDots();
  }

  updateFavoriteBtn();
}

/* ── Fetch advice ── */
async function fetchAdvice() {
  adviceCard.classList.add('swap-out');
  setTimeout(() => adviceCard.classList.remove('swap-out'), 200);

  rollIcon.classList.add('roll-icon-spin');
  rollBtn.disabled = true;

  try {
    const resp = await fetch(`${API_URL}?t=${Date.now()}`);
    if (!resp.ok) throw new Error('Network error');
    const { slip } = await resp.json();

    // Small delay for swap-in animation to feel intentional
    setTimeout(() => {
      displayAdvice(slip.id, slip.advice);
      adviceCard.classList.add('swap-in');
      setTimeout(() => adviceCard.classList.remove('swap-in'), 400);
    }, 180);
  } catch {
    setTimeout(() => {
      adviceTextEl.textContent = 'Couldn\'t reach the wisdom well. Check your connection and try again.';
      moodEmojiEl.textContent = '🌧';
      moodLabelEl.textContent = 'Offline';
      showToast('Connection error — try again');
    }, 180);
  } finally {
    setTimeout(() => {
      rollIcon.classList.remove('roll-icon-spin');
      rollBtn.disabled = false;
    }, 300);
  }
}

/* ── Copy ── */
async function copyAdvice() {
  if (!currentAdvice.text) return;
  try {
    await navigator.clipboard.writeText(`"${currentAdvice.text}"`);
    showToast('Copied to clipboard');
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = `"${currentAdvice.text}"`;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Copied to clipboard');
  }
}

/* ── Keyboard shortcut ── */
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'n' || e.key === 'N' || e.key === ' ') {
    e.preventDefault();
    fetchAdvice();
  }
  if (e.key === 'c' || e.key === 'C') copyAdvice();
  if (e.key === 's' || e.key === 'S') toggleFavorite();
  if (e.key === 'Escape') closeFavPanel();
});

/* ── Util ── */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Init ── */
rollBtn.addEventListener('click', fetchAdvice);
copyBtn.addEventListener('click', copyAdvice);
favoriteBtn.addEventListener('click', toggleFavorite);

initTheme();
loadFavorites();
updateFavBtnLabel();
fetchAdvice();