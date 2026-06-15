const STORAGE_KEYS = {
  ENTRIES: 'journly_entries_v1',
  THEME: 'journly_theme_v1'
};

function safeGet(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    return JSON.parse(decodeURIComponent(atob(raw)));
  } catch (e) {
    console.error("Local storage decode error", key, e);
    return defaultVal;
  }
}

function safeSet(key, val) {
  try {
    const encrypted = btoa(encodeURIComponent(JSON.stringify(val)));
    localStorage.setItem(key, encrypted);
  } catch (e) {
    console.error("Local storage encode error", key, e);
  }
}

// --- App State ---
let journalEntries = safeGet(STORAGE_KEYS.ENTRIES, []);
let currentTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'cozy-night';

let currentEntryId = null;
let activeTab = 'write'; // 'write' | 'preview'
let stickersList = []; // Stickers for current active entry

// Debounce timer for auto-saving drafts
let autosaveTimeout = null;

// --- DOM Reference Selectors ---
const btnNewEntry = document.getElementById('btn-new-entry');
const btnWelcomeNew = document.getElementById('btn-welcome-new');
const searchInput = document.getElementById('search-input');
const moodFilterBadges = document.querySelectorAll('.mood-filter-badge');
const entriesListEl = document.getElementById('entries-list');
const moodStatsEl = document.getElementById('mood-stats-visualization');

const welcomeScreen = document.getElementById('welcome-screen');
const journalSheet = document.getElementById('journal-sheet');
const entryDatetimeEl = document.getElementById('entry-datetime');
const entryTitleInput = document.getElementById('entry-title');
const moodSelectButtons = document.querySelectorAll('.mood-btn');
const btnDeleteEntry = document.getElementById('btn-delete-entry');
const btnSaveEntry = document.getElementById('btn-save-entry');
const toolbarButtons = document.querySelectorAll('.toolbar-btn');

const tabWrite = document.getElementById('tab-write');
const tabPreview = document.getElementById('tab-preview');
const paneEditor = document.getElementById('pane-editor');
const panePreview = document.getElementById('pane-preview');
const diaryTextarea = document.getElementById('diary-textarea');
const wordCharCountEl = document.getElementById('word-char-count');
const autosaveIndicator = document.getElementById('autosave-indicator');

const btnToggleStickers = document.getElementById('btn-toggle-stickers');
const stickerDrawer = document.getElementById('sticker-drawer');
const stickerItems = document.querySelectorAll('.sticker-item');
const stickerCanvas = document.getElementById('sticker-canvas');
const markdownRenderedContent = document.getElementById('markdown-rendered-content');

const themeDots = document.querySelectorAll('.theme-dot');

// --- Sticker Emoji Map ---
const STICKERS = {
  sparkle: '✨',
  heart: '💖',
  star: '🌟',
  flower: '🌸',
  clover: '🍀',
  coffee: '☕',
  cat: '🐱',
  moon: '🌙',
  book: '📚',
  palette: '🎨',
  balloon: '🎈',
  rainbow: '🌈'
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupSidebar();
  setupEditor();
  setupStickerSystem();
  renderEntriesList();
  renderMoodAnalytics();
  lucide.createIcons();
});

// --- Theme Management ---
function initializeTheme() {
  document.body.className = `theme-${currentTheme}`;
  themeDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.theme === currentTheme);
  });

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentTheme = dot.dataset.theme;
      document.body.className = `theme-${currentTheme}`;
      localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
      
      themeDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}

// --- Sidebar Core Setup (Sorting, Searching & Filtering) ---
let activeMoodFilter = 'all';

function setupSidebar() {
  btnNewEntry.addEventListener('click', createNewEntry);
  btnWelcomeNew.addEventListener('click', createNewEntry);

  searchInput.addEventListener('input', () => {
    renderEntriesList();
  });

  moodFilterBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      moodFilterBadges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      activeMoodFilter = badge.dataset.mood;
      renderEntriesList();
    });
  });
}

function renderEntriesList() {
  entriesListEl.innerHTML = '';
  const query = searchInput.value.toLowerCase().trim();

  // Sort entries descending by date
  const filtered = journalEntries.filter(entry => {
    // Mood search match
    const matchesMood = (activeMoodFilter === 'all' || entry.mood === activeMoodFilter);
    // Word search query match
    const matchesQuery = !query || 
      entry.title.toLowerCase().includes(query) || 
      entry.content.toLowerCase().includes(query);
    
    return matchesMood && matchesQuery;
  }).sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  if (filtered.length === 0) {
    entriesListEl.innerHTML = `<div class="no-entries-msg">No reflection entries found.</div>`;
    return;
  }

  filtered.forEach(entry => {
    const card = document.createElement('div');
    card.className = `entry-card ${entry.id === currentEntryId ? 'active' : ''}`;
    
    const dateFormatted = new Date(entry.datetime).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const excerpt = entry.content 
      ? entry.content.replace(/[#*`~_\[\]()\-]/g, '').substring(0, 80)
      : 'No additional details written...';

    const moodEmoji = getMoodEmoji(entry.mood);

    card.innerHTML = `
      <div class="entry-card-header">
        <span class="entry-card-date">${dateFormatted}</span>
        <span class="entry-card-mood" title="${entry.mood}">${moodEmoji}</span>
      </div>
      <div class="entry-card-title">${entry.title || 'Untitled Entry'}</div>
      <div class="entry-card-excerpt">${excerpt}</div>
    `;

    card.addEventListener('click', () => {
      selectEntry(entry.id);
    });

    entriesListEl.appendChild(card);
  });
}

// --- Mood Helper Maps ---
function getMoodEmoji(mood) {
  const map = {
    happy: '🌟',
    calm: '🍃',
    tired: '💤',
    sad: '🌧️',
    angry: '⚡'
  };
  return map[mood] || '🍃';
}

function getMoodColor(mood) {
  const map = {
    happy: '#ffb703',
    calm: '#2ec4b6',
    tired: '#909bb4',
    sad: '#4a90e2',
    angry: '#ff4d4f'
  };
  return map[mood] || '#2ec4b6';
}

// --- Mood Analytics Visualization Panel ---
function renderMoodAnalytics() {
  moodStatsEl.innerHTML = '';
  
  const moodCounts = { happy: 0, calm: 0, tired: 0, sad: 0, angry: 0 };
  let totalCount = 0;

  journalEntries.forEach(entry => {
    if (moodCounts[entry.mood] !== undefined) {
      moodCounts[entry.mood]++;
      totalCount++;
    }
  });

  const moodsList = ['happy', 'calm', 'tired', 'sad', 'angry'];
  
  moodsList.forEach(mood => {
    const count = moodCounts[mood];
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
    
    const row = document.createElement('div');
    row.className = 'stat-bar-row';
    row.innerHTML = `
      <span class="stat-emoji" title="${mood}">${getMoodEmoji(mood)}</span>
      <div class="stat-bar-outer">
        <div class="stat-bar-inner" style="width: ${percentage}%; background-color: ${getMoodColor(mood)}"></div>
      </div>
      <span class="stat-count">${count}</span>
    `;
    moodStatsEl.appendChild(row);
  });
}

// --- Diary Content Operations (CRUD) ---
function createNewEntry() {
  const newId = 'entry_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const newEntry = {
    id: newId,
    title: '',
    content: '',
    datetime: new Date().toISOString(),
    mood: 'calm',
    stickers: []
  };

  journalEntries.push(newEntry);
  safeSet(STORAGE_KEYS.ENTRIES, journalEntries);
  
  renderEntriesList();
  renderMoodAnalytics();
  selectEntry(newId);
}

function selectEntry(id) {
  currentEntryId = id;
  const entry = journalEntries.find(e => e.id === id);
  if (!entry) return;

  // Swap Screen view panels
  welcomeScreen.classList.add('hidden');
  journalSheet.classList.remove('hidden');

  // Load content
  entryTitleInput.value = entry.title;
  diaryTextarea.value = entry.content;
  stickersList = entry.stickers || [];

  // Update timestamps
  const datetimeFormatted = new Date(entry.datetime).toLocaleString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
  entryDatetimeEl.textContent = datetimeFormatted;

  // Set selected mood state
  updateMoodSelectorUI(entry.mood);

  // Sync tabs & state status
  switchTab('write');
  updateWordCount();
  
  // Refresh Highlight CSS Class inside Sidebar List
  document.querySelectorAll('.entry-card').forEach(card => {
    card.classList.remove('active');
  });
  renderEntriesList();
}

function updateMoodSelectorUI(activeMood) {
  moodSelectButtons.forEach(btn => {
    const isMatched = btn.dataset.mood === activeMood;
    btn.classList.toggle('active', isMatched);
  });
}

function deleteActiveEntry() {
  if (!currentEntryId) return;
  
  if (confirm('Are you sure you want to delete this diary entry permanently? This action cannot be undone.')) {
    journalEntries = journalEntries.filter(e => e.id !== currentEntryId);
    safeSet(STORAGE_KEYS.ENTRIES, journalEntries);
    
    currentEntryId = null;
    journalSheet.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
    
    renderEntriesList();
    renderMoodAnalytics();
  }
}

function saveActiveEntry(isAutosave = false) {
  if (!currentEntryId) return;

  const entryIndex = journalEntries.findIndex(e => e.id === currentEntryId);
  if (entryIndex === -1) return;

  // Extract values
  const activeMoodBtn = document.querySelector('.mood-btn.active');
  const moodVal = activeMoodBtn ? activeMoodBtn.dataset.mood : 'calm';

  journalEntries[entryIndex].title = entryTitleInput.value;
  journalEntries[entryIndex].content = diaryTextarea.value;
  journalEntries[entryIndex].mood = moodVal;
  journalEntries[entryIndex].stickers = stickersList; // Sync stickers

  safeSet(STORAGE_KEYS.ENTRIES, journalEntries);

  if (isAutosave) {
    showAutosaveFeedback('Draft saved');
  } else {
    showAutosaveFeedback('Saved successfully');
  }

  // Refresh analytics & titles list in sidebar
  renderEntriesList();
  renderMoodAnalytics();
}

// Autosave helper status triggers
function showAutosaveFeedback(msg) {
  autosaveIndicator.innerHTML = `<i data-lucide="check-check"></i> ${msg}`;
  lucide.createIcons();
  autosaveIndicator.classList.add('active');
  
  setTimeout(() => {
    autosaveIndicator.innerHTML = `<i data-lucide="check-check"></i> Saved`;
    lucide.createIcons();
  }, 2000);
}

function triggerAutosaveDebouncer() {
  autosaveIndicator.innerHTML = `<i data-lucide="loader-2" class="spin-icon"></i> Auto-saving...`;
  lucide.createIcons();

  if (autosaveTimeout) clearTimeout(autosaveTimeout);
  autosaveTimeout = setTimeout(() => {
    saveActiveEntry(true);
  }, 1200);
}

// --- Markdown Toolbar and Tab Editors logic ---
function setupEditor() {
  // Save/Delete bindings
  btnSaveEntry.addEventListener('click', () => saveActiveEntry(false));
  btnDeleteEntry.addEventListener('click', deleteActiveEntry);

  // Inputs monitors
  entryTitleInput.addEventListener('input', triggerAutosaveDebouncer);
  diaryTextarea.addEventListener('input', () => {
    updateWordCount();
    triggerAutosaveDebouncer();
  });

  // Mood buttons selection action
  moodSelectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      moodSelectButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      triggerAutosaveDebouncer();
    });
  });

  // Toolbar Actions
  toolbarButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.dataset.command;
      applyToolbarFormat(command);
    });
  });

  // Tab buttons triggers
  tabWrite.addEventListener('click', () => switchTab('write'));
  tabPreview.addEventListener('click', () => switchTab('preview'));
}

function updateWordCount() {
  const text = diaryTextarea.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const chars = text.length;
  wordCharCountEl.textContent = `${words} word${words !== 1 ? 's' : ''} | ${chars} character${chars !== 1 ? 's' : ''}`;
}

function applyToolbarFormat(cmd) {
  const start = diaryTextarea.selectionStart;
  const end = diaryTextarea.selectionEnd;
  const text = diaryTextarea.value;
  const selected = text.substring(start, end);
  
  let formatted = '';
  let cursorShift = 0;

  switch (cmd) {
    case 'bold':
      formatted = `**${selected || 'bold text'}**`;
      cursorShift = 2;
      break;
    case 'italic':
      formatted = `*${selected || 'italic text'}*`;
      cursorShift = 1;
      break;
    case 'heading':
      formatted = `\n### ${selected || 'Heading'}\n`;
      cursorShift = 5;
      break;
    case 'quote':
      formatted = `\n> ${selected || 'Blockquote'}\n`;
      cursorShift = 3;
      break;
    case 'list-bullet':
      formatted = `\n- ${selected || 'List item'}\n`;
      cursorShift = 3;
      break;
    case 'list-check':
      formatted = `\n- [ ] ${selected || 'Todo item'}\n`;
      cursorShift = 8;
      break;
    case 'code':
      formatted = `\n\`\`\`\n${selected || 'code block'}\n\`\`\`\n`;
      cursorShift = 5;
      break;
    case 'link':
      formatted = `[${selected || 'link text'}](https://example.com)`;
      cursorShift = 1;
      break;
  }

  diaryTextarea.value = text.substring(0, start) + formatted + text.substring(end);
  diaryTextarea.focus();
  
  // Reposition selection bounds
  const newCursorPos = start + (selected ? formatted.length : cursorShift);
  diaryTextarea.setSelectionRange(newCursorPos, newCursorPos);
  
  updateWordCount();
  triggerAutosaveDebouncer();
}

function switchTab(target) {
  activeTab = target;
  
  tabWrite.classList.toggle('active', target === 'write');
  tabPreview.classList.toggle('active', target === 'preview');
  
  paneEditor.classList.toggle('hidden', target !== 'write');
  panePreview.classList.toggle('hidden', target !== 'preview');

  if (target === 'preview') {
    renderMarkdownPreview();
  }
}

function renderMarkdownPreview() {
  const mdText = diaryTextarea.value || '*Write something beautiful today...*';
  
  // Render Markdown to HTML using Marked CDN
  markdownRenderedContent.innerHTML = marked.parse(mdText, {
    breaks: true,
    gfm: true
  });

  // Re-render placed stickers
  renderStickersCanvas();
}


// --- Sticker Canvas System ---
let activeDragSticker = null;
let dragStartX = 0;
let dragStartY = 0;
let stickerStartLeft = 0;
let stickerStartTop = 0;

function setupStickerSystem() {
  // Toggle Drawer Open/Close
  btnToggleStickers.addEventListener('click', () => {
    stickerDrawer.classList.toggle('hidden');
  });

  // Click on items inside the drawer
  stickerItems.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.sticker;
      addNewStickerToCanvas(type);
    });
  });
}

function addNewStickerToCanvas(type) {
  if (!currentEntryId) return;

  const newId = 'sticker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  // Default coordinate: Center (approx 50% left / 30% top down)
  const stickerObj = {
    id: newId,
    type: type,
    x: 50,
    y: 30
  };

  stickersList.push(stickerObj);
  saveStickersForCurrentEntry();
  renderStickersCanvas();
}

function deleteSticker(id) {
  stickersList = stickersList.filter(s => s.id !== id);
  saveStickersForCurrentEntry();
  renderStickersCanvas();
}

function saveStickersForCurrentEntry() {
  if (!currentEntryId) return;
  const idx = journalEntries.findIndex(e => e.id === currentEntryId);
  if (idx !== -1) {
    journalEntries[idx].stickers = stickersList;
    safeSet(STORAGE_KEYS.ENTRIES, journalEntries);
  }
}

function renderStickersCanvas() {
  // Clear any existing stickers in canvas DOM
  const existingStickers = stickerCanvas.querySelectorAll('.placed-sticker');
  existingStickers.forEach(el => el.remove());

  stickersList.forEach(sticker => {
    const stickerEl = document.createElement('div');
    stickerEl.className = 'placed-sticker';
    stickerEl.dataset.id = sticker.id;
    stickerEl.style.left = `${sticker.x}%`;
    stickerEl.style.top = `${sticker.y}%`;
    
    const emoji = STICKERS[sticker.type] || '✨';
    stickerEl.innerHTML = `
      ${emoji}
      <button class="sticker-delete-btn" title="Delete Sticker">×</button>
    `;

    // Hook events
    setupStickerDragging(stickerEl);
    
    // Hook delete click handler
    stickerEl.querySelector('.sticker-delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteSticker(sticker.id);
    });

    stickerCanvas.appendChild(stickerEl);
  });
}

// High-fidelity touch & mouse drag system utilizing percentages
function setupStickerDragging(stickerEl) {
  const onPointerDown = (e) => {
    activeDragSticker = stickerEl;
    stickerEl.classList.add('dragging');

    // Extract exact pixel position
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragStartX = clientX;
    dragStartY = clientY;

    stickerStartLeft = parseFloat(stickerEl.style.left) || 50;
    stickerStartTop = parseFloat(stickerEl.style.top) || 30;

    // Attach listeners to document scope
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    
    // Prevent scrolling while dragging
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!activeDragSticker) return;

    if (e.cancelable) e.preventDefault();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const deltaX = clientX - dragStartX;
    const deltaY = clientY - dragStartY;

    const canvasRect = stickerCanvas.getBoundingClientRect();

    // Map offset movement pixels to percentages
    const pctDeltaX = (deltaX / canvasRect.width) * 100;
    const pctDeltaY = (deltaY / canvasRect.height) * 100;

    let newLeft = stickerStartLeft + pctDeltaX;
    let newTop = stickerStartTop + pctDeltaY;

    // Safety boundary constraints so stickers stay inside the writing pad
    newLeft = Math.max(0, Math.min(newLeft, 95));
    newTop = Math.max(0, Math.min(newTop, 95));

    activeDragSticker.style.left = `${newLeft.toFixed(2)}%`;
    activeDragSticker.style.top = `${newTop.toFixed(2)}%`;
  };

  const onPointerUp = () => {
    if (!activeDragSticker) return;

    activeDragSticker.classList.remove('dragging');

    const sId = activeDragSticker.dataset.id;
    const finalLeft = parseFloat(activeDragSticker.style.left);
    const finalTop = parseFloat(activeDragSticker.style.top);

    // Save final placement states
    const stickerObj = stickersList.find(s => s.id === sId);
    if (stickerObj) {
      stickerObj.x = finalLeft;
      stickerObj.y = finalTop;
      saveStickersForCurrentEntry();
    }

    activeDragSticker = null;

    document.removeEventListener('mousemove', onPointerMove);
    document.removeEventListener('mouseup', onPointerUp);
    document.removeEventListener('touchmove', onPointerMove);
    document.removeEventListener('touchend', onPointerUp);
  };

  stickerEl.addEventListener('mousedown', onPointerDown);
  stickerEl.addEventListener('touchstart', onPointerDown, { passive: true });
}
