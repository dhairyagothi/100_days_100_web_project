/* ================================================================
   settings.js – MoodMusic Premium Settings Page Logic
   ================================================================ */
'use strict';

/* ── Storage Keys ───────────────────────────────────────────── */
const KEYS = {
    settings:   'moodMusic_settings',
    favorites:  'moodMusicFavorites',
    history:    'moodMusicHistory',
    recData:    'moodMusic_recData',
    cache:      'moodMusic_cache',
};

/* ── Default Settings ────────────────────────────────────────── */
const DEFAULTS = {
    theme:            'dark',
    accent:           '#1db954',
    dynamicThemes:    true,
    uiAnimations:     true,
    genres:           ['pop', 'hiphop'],
    artists:          [],
    recCount:         10,
    autoplay:         false,
    explicitFilter:   false,
    enableMoodHistory:true,
    smartRec:         true,
    defaultMood:      '',
    dailySuggestion:  false,
    moodReminder:     false,
    playlistAlerts:   true,
};

/* ── Load / Save helpers ─────────────────────────────────────── */
function loadSettings() {
    try {
        const raw = localStorage.getItem(KEYS.settings);
        return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch { return { ...DEFAULTS }; }
}
function saveSettings(cfg) {
    try { localStorage.setItem(KEYS.settings, JSON.stringify(cfg)); return true; }
    catch { return false; }
}
function loadJSON(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch { return []; }
}
function saveJSON(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); return true; }
    catch { return false; }
}

/* ── State ───────────────────────────────────────────────────── */
let cfg = loadSettings();
let artistList = [...(cfg.artists || [])];
let pendingAction = null;      // for confirmation modal

/* ── DOM Refs ────────────────────────────────────────────────── */
const $ = id => document.getElementById(id);

const sidebar       = document.getElementById('settingsSidebar');
const hamburgerBtn  = $('hamburgerBtn');
const mobileCloseBtn= $('mobileCloseBtn');
const settingsSearch= $('settingsSearch');
const navItems      = document.querySelectorAll('.snav-item');
const sections      = document.querySelectorAll('.settings-section');

const saveBtn       = $('saveSettingsBtn');
const resetBtn      = $('resetDefaultsBtn');

const themeRadios   = document.querySelectorAll('input[name="theme"]');
const swatches      = document.querySelectorAll('.swatch');
const customColor   = $('customColorPicker');
const dynamicThemes = $('dynamicThemes');
const uiAnimations  = $('uiAnimations');

const genreChips    = document.querySelectorAll('.chip');
const artistInput   = $('artistInput');
const artistTagList = $('artistTagList');
const recCountMinus = $('recCountMinus');
const recCountPlus  = $('recCountPlus');
const recCountVal   = $('recCountVal');
const autoplay      = $('autoplay');
const explicitFilter= $('explicitFilter');

const enableMoodHistory = $('enableMoodHistory');
const moodHistoryCount  = $('moodHistoryCount');
const clearMoodHistoryBtn= $('clearMoodHistoryBtn');
const smartRec          = $('smartRec');
const defaultMood       = $('defaultMood');

const favCount      = $('favCount');
const histCount     = $('histCount');
const storageSize   = $('storageSize');
const exportFavBtn  = $('exportFavBtn');
const importFavInput= $('importFavInput');
const clearFavBtn   = $('clearFavBtn');
const resetRecDataBtn= $('resetRecDataBtn');

const dailySuggestion = $('dailySuggestion');
const moodReminder    = $('moodReminder');
const playlistAlerts  = $('playlistAlerts');

const localStorageStatus = $('localStorageStatus');
const localStorageBadge  = $('localStorageBadge');
const clearCacheBtn      = $('clearCacheBtn');
const deleteAllDataBtn   = $('deleteAllDataBtn');

const modalOverlay  = $('modalOverlay');
const modalTitle    = $('modalTitle');
const modalBody     = $('modalBody');
const modalCancelBtn= $('modalCancelBtn');
const modalConfirmBtn= $('modalConfirmBtn');

const toast         = $('settingsToast');
const toastIcon     = $('toastIcon');
const toastMsg      = $('toastMsg');
let toastTimer;

/* ================================================================
   THEME
   ================================================================ */
function applyTheme(theme) {
    let resolved = theme;
    if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', resolved);
}

function applyAccent(color) {
    const r = parseInt(color.slice(1,3), 16);
    const g = parseInt(color.slice(3,5), 16);
    const b = parseInt(color.slice(5,7), 16);
    document.documentElement.style.setProperty('--accent', color);
    document.documentElement.style.setProperty('--accent-hover', lighten(color, 15));
    document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.25)`);
}

function lighten(hex, pct) {
    let r = parseInt(hex.slice(1,3),16);
    let g = parseInt(hex.slice(3,5),16);
    let b = parseInt(hex.slice(5,7),16);
    r = Math.min(255, r + Math.round(255 * pct / 100));
    g = Math.min(255, g + Math.round(255 * pct / 100));
    b = Math.min(255, b + Math.round(255 * pct / 100));
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

/* ================================================================
   POPULATE UI FROM CONFIG
   ================================================================ */
function populateUI() {
    /* -- theme -- */
    themeRadios.forEach(r => { r.checked = r.value === cfg.theme; });
    applyTheme(cfg.theme);

    /* -- accent -- */
    applyAccent(cfg.accent);
    customColor.value = cfg.accent;
    swatches.forEach(s => {
        s.classList.toggle('active', s.dataset.color === cfg.accent);
    });

    /* -- toggles -- */
    dynamicThemes.checked  = cfg.dynamicThemes;
    uiAnimations.checked   = cfg.uiAnimations;
    autoplay.checked       = cfg.autoplay;
    explicitFilter.checked = cfg.explicitFilter;
    enableMoodHistory.checked = cfg.enableMoodHistory;
    smartRec.checked       = cfg.smartRec;
    dailySuggestion.checked= cfg.dailySuggestion;
    moodReminder.checked   = cfg.moodReminder;
    playlistAlerts.checked = cfg.playlistAlerts;

    /* -- rec count -- */
    recCountVal.textContent = cfg.recCount;

    /* -- genres -- */
    genreChips.forEach(c => {
        c.classList.toggle('active', cfg.genres.includes(c.dataset.genre));
    });

    /* -- artists -- */
    artistList = [...(cfg.artists || [])];
    renderArtistTags();

    /* -- default mood -- */
    defaultMood.value = cfg.defaultMood || '';

    /* -- data stats -- */
    refreshDataStats();

    /* -- localStorage status -- */
    checkLocalStorageStatus();
}

/* ── Data Stats ──────────────────────────────────────────────── */
function refreshDataStats() {
    const favs = loadJSON(KEYS.favorites);
    const hist = loadJSON(KEYS.history);
    favCount.textContent  = favs.length;
    histCount.textContent = hist.length;
    moodHistoryCount.textContent = `${hist.length} mood entries recorded.`;

    /* storage size estimate */
    let total = 0;
    try {
        for (const k in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, k)) {
                total += (localStorage[k].length + k.length) * 2;
            }
        }
    } catch {}
    storageSize.textContent = total < 1024
        ? `${total} B`
        : total < 1024 * 1024
            ? `${(total / 1024).toFixed(1)} KB`
            : `${(total / (1024*1024)).toFixed(2)} MB`;
}

/* ── localStorage availability ───────────────────────────────── */
function checkLocalStorageStatus() {
    try {
        localStorage.setItem('__test__', '1');
        localStorage.removeItem('__test__');
        localStorageStatus.textContent = 'localStorage is available and working.';
        localStorageBadge.textContent  = 'Active';
        localStorageBadge.className    = 'status-badge';
    } catch {
        localStorageStatus.textContent = 'localStorage is unavailable (private mode or blocked).';
        localStorageBadge.textContent  = 'Unavailable';
        localStorageBadge.className    = 'status-badge error';
    }
}

/* ── Artist Tags ─────────────────────────────────────────────── */
function renderArtistTags() {
    artistTagList.innerHTML = '';
    artistList.forEach((name, i) => {
        const tag = document.createElement('span');
        tag.className = 'artist-tag';
        tag.innerHTML = `${name}<button aria-label="Remove ${name}"><i class="fa-solid fa-xmark"></i></button>`;
        tag.querySelector('button').addEventListener('click', () => {
            artistList.splice(i, 1);
            renderArtistTags();
        });
        artistTagList.appendChild(tag);
    });
}

/* ================================================================
   COLLECT UI → CONFIG
   ================================================================ */
function collectConfig() {
    const chosen = [...themeRadios].find(r => r.checked);
    cfg.theme    = chosen ? chosen.value : 'dark';
    cfg.accent   = customColor.value;
    cfg.dynamicThemes   = dynamicThemes.checked;
    cfg.uiAnimations    = uiAnimations.checked;
    cfg.genres   = [...genreChips].filter(c => c.classList.contains('active')).map(c => c.dataset.genre);
    cfg.artists  = [...artistList];
    cfg.recCount = parseInt(recCountVal.textContent) || 10;
    cfg.autoplay = autoplay.checked;
    cfg.explicitFilter  = explicitFilter.checked;
    cfg.enableMoodHistory = enableMoodHistory.checked;
    cfg.smartRec        = smartRec.checked;
    cfg.defaultMood     = defaultMood.value;
    cfg.dailySuggestion = dailySuggestion.checked;
    cfg.moodReminder    = moodReminder.checked;
    cfg.playlistAlerts  = playlistAlerts.checked;
}

/* ================================================================
   TOAST
   ================================================================ */
function showToast(msg, isError = false) {
    clearTimeout(toastTimer);
    toastMsg.textContent = msg;
    toastIcon.className  = isError ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    toast.className      = `settings-toast show${isError ? ' error' : ''}`;
    toastTimer = setTimeout(() => { toast.className = 'settings-toast'; }, 3000);
}

/* ================================================================
   CONFIRMATION MODAL
   ================================================================ */
function openModal(title, body, onConfirm) {
    modalTitle.textContent = title;
    modalBody.textContent  = body;
    pendingAction = onConfirm;
    modalOverlay.classList.add('active');
}
function closeModal() {
    modalOverlay.classList.remove('active');
    pendingAction = null;
}

modalCancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
modalConfirmBtn.addEventListener('click', () => {
    if (pendingAction) pendingAction();
    closeModal();
});

/* ================================================================
   SIDEBAR NAV & SCROLL SPY
   ================================================================ */
/* mobile sidebar */
hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    ensureOverlay(true);
});
mobileCloseBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    ensureOverlay(false);
});

let sidebarOverlay = null;
function ensureOverlay(show) {
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.className = 'sidebar-overlay';
        document.body.appendChild(sidebarOverlay);
        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            ensureOverlay(false);
        });
    }
    sidebarOverlay.classList.toggle('active', show);
}

/* nav click → smooth scroll */
navItems.forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        const target = document.getElementById(item.dataset.section);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        /* mobile: close sidebar after tap */
        if (window.innerWidth < 900) {
            sidebar.classList.remove('open');
            ensureOverlay(false);
        }
        setActiveNav(item.dataset.section);
    });
});

function setActiveNav(sectionId) {
    navItems.forEach(i => i.classList.toggle('active', i.dataset.section === sectionId));
}

/* scroll spy */
const scrollContainer = document.getElementById('settingsScroll');
scrollContainer.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 80;
        if (scrollContainer.scrollTop >= top) current = sec.id;
    });
    if (current) setActiveNav(current);
}, { passive: true });

/* ================================================================
   SETTINGS SEARCH
   ================================================================ */
settingsSearch.addEventListener('input', () => {
    const q = settingsSearch.value.toLowerCase().trim();
    sections.forEach(sec => {
        if (!q) {
            sec.classList.remove('hidden');
            return;
        }
        const label = (sec.dataset.label || '').toLowerCase();
        const text  = sec.textContent.toLowerCase();
        sec.classList.toggle('hidden', !label.includes(q) && !text.includes(q));
    });
});

/* ================================================================
   EVENT LISTENERS — APPEARANCE
   ================================================================ */
themeRadios.forEach(r => {
    r.addEventListener('change', () => {
        applyTheme(r.value);
    });
});

swatches.forEach(s => {
    s.addEventListener('click', () => {
        swatches.forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        customColor.value = s.dataset.color;
        applyAccent(s.dataset.color);
    });
});

customColor.addEventListener('input', () => {
    swatches.forEach(s => s.classList.remove('active'));
    applyAccent(customColor.value);
});

/* ================================================================
   EVENT LISTENERS — MUSIC PREFS
   ================================================================ */
genreChips.forEach(c => {
    c.addEventListener('click', () => c.classList.toggle('active'));
});

artistInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = artistInput.value.trim().replace(/,$/, '');
        if (val && !artistList.includes(val)) {
            artistList.push(val);
            renderArtistTags();
        }
        artistInput.value = '';
    }
});

let recCount = cfg.recCount;
recCountMinus.addEventListener('click', () => {
    recCount = Math.max(1, recCount - 1);
    recCountVal.textContent = recCount;
});
recCountPlus.addEventListener('click', () => {
    recCount = Math.min(50, recCount + 1);
    recCountVal.textContent = recCount;
});

/* ================================================================
   EVENT LISTENERS — MOOD PREFS
   ================================================================ */
clearMoodHistoryBtn.addEventListener('click', () => {
    openModal(
        'Clear Mood History?',
        'All recorded mood entries will be permanently deleted.',
        () => {
            saveJSON(KEYS.history, []);
            refreshDataStats();
            showToast('Mood history cleared.');
        }
    );
});

/* ================================================================
   EVENT LISTENERS — FAVORITES & DATA
   ================================================================ */
exportFavBtn.addEventListener('click', () => {
    const favs = loadJSON(KEYS.favorites);
    if (!favs.length) { showToast('No favourites to export.', true); return; }
    const blob = new Blob([JSON.stringify(favs, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = Object.assign(document.createElement('a'), {
        href: url,
        download: `moodmusic_favorites_${Date.now()}.json`
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${favs.length} favourite(s).`);
});

importFavInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const data = JSON.parse(ev.target.result);
            if (!Array.isArray(data)) throw new Error('Invalid format');
            const existing = loadJSON(KEYS.favorites);
            const merged = [...existing];
            let added = 0;
            data.forEach(song => {
                if (!merged.find(s => s.title === song.title && s.artist === song.artist)) {
                    merged.push(song);
                    added++;
                }
            });
            saveJSON(KEYS.favorites, merged);
            refreshDataStats();
            showToast(`Imported ${added} new favourite(s).`);
        } catch {
            showToast('Import failed – invalid file.', true);
        }
    };
    reader.readAsText(file);
    importFavInput.value = '';
});

clearFavBtn.addEventListener('click', () => {
    openModal(
        'Clear All Favourites?',
        'All your saved favourite songs will be permanently removed.',
        () => {
            saveJSON(KEYS.favorites, []);
            refreshDataStats();
            showToast('Favourites cleared.');
        }
    );
});

resetRecDataBtn.addEventListener('click', () => {
    openModal(
        'Reset Recommendation Data?',
        'All recommendation history and smart learning data will be erased.',
        () => {
            try { localStorage.removeItem(KEYS.recData); } catch {}
            refreshDataStats();
            showToast('Recommendation data reset.');
        }
    );
});

/* ================================================================
   EVENT LISTENERS — PRIVACY
   ================================================================ */
clearCacheBtn.addEventListener('click', () => {
    openModal(
        'Clear Cached Data?',
        'Recommendation cache will be removed. Your preferences and favourites are kept.',
        () => {
            try { localStorage.removeItem(KEYS.cache); } catch {}
            refreshDataStats();
            showToast('Cache cleared.');
        }
    );
});

deleteAllDataBtn.addEventListener('click', () => {
    openModal(
        'Delete ALL User Data?',
        'Every setting, favourite, mood entry, and cached data will be permanently deleted. This cannot be undone.',
        () => {
            try {
                Object.values(KEYS).forEach(k => localStorage.removeItem(k));
                cfg = { ...DEFAULTS };
                artistList = [];
                populateUI();
                showToast('All user data deleted.');
            } catch {
                showToast('Failed to delete some data.', true);
            }
        }
    );
});

/* ================================================================
   SAVE & RESET
   ================================================================ */
saveBtn.addEventListener('click', () => {
    collectConfig();
    const ok = saveSettings(cfg);
    applyTheme(cfg.theme);
    applyAccent(cfg.accent);
    showToast(ok ? 'Settings saved!' : 'Could not save (storage unavailable).', !ok);

    /* pulse animation on button */
    saveBtn.classList.add('saved-pulse');
    setTimeout(() => saveBtn.classList.remove('saved-pulse'), 600);
});

resetBtn.addEventListener('click', () => {
    openModal(
        'Reset to Defaults?',
        'All appearance, music, and notification settings will be restored to their default values. Your favourites and history are not affected.',
        () => {
            cfg = { ...DEFAULTS };
            saveSettings(cfg);
            artistList = [];
            populateUI();
            applyTheme(cfg.theme);
            applyAccent(cfg.accent);
            showToast('Settings reset to defaults.');
        }
    );
});

/* ── Pulse style injected at runtime ──────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .saved-pulse { animation: savePulse 0.6s var(--ease); }
  @keyframes savePulse {
    0%   { transform: scale(1); }
    40%  { transform: scale(0.93); }
    70%  { transform: scale(1.06); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

/* ── System theme watcher ─────────────────────────────────────── */
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (cfg.theme === 'system') applyTheme('system');
});

/* ================================================================
   INIT
   ================================================================ */
populateUI();
