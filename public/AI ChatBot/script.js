/* CONFIG & CONSTANTS */
const STORAGE = {
  API_KEY: "gc_api_key",
  SESSIONS: "gc_sessions",
  THEME: "gc_theme",
  MODEL: "gc_model",
  SYSTEM_PROMPT: "gc_system_prompt",
  AUTO_SPEAK: "gc_auto_speak",
  VOICE_LANG: "gc_voice_lang",
  ONBOARDED: "gc_onboarded",
  HF_KEY: "gc_hf_key",
};

const MODEL_NAMES = {
  "gemini-2.5-flash": "Gemini 2.5 Flash",
  "gemini-2.5-pro": "Gemini 2.5 Pro",
  "gemini-2.0-flash": "Gemini 2.0 Flash",
};

// Optional local default config file.
// Create public/AI ChatBot/default-config.js and set window.DEFAULT_GEMINI_API_KEY.
const DEFAULT_GEMINI_API_KEY = window.DEFAULT_GEMINI_API_KEY?.trim() || "";
const GEMINI_PROXY_ENDPOINT = "/api/gemini";

/* STATE */
let apiKey = localStorage.getItem(STORAGE.API_KEY) || DEFAULT_GEMINI_API_KEY || "";

// Migration: check for old storage key from unused chatbot.js
if (!apiKey) {
  const oldKey = localStorage.getItem('gemini_api_key');
  if (oldKey) {
    apiKey = oldKey;
    localStorage.setItem(STORAGE.API_KEY, apiKey);
    console.log('✓ Migrated API key from old storage key');
  }
}

let hfKey = localStorage.getItem(STORAGE.HF_KEY) || "";
let sessions = loadSessions();
let activeSessionId = null;
let chatHistory = [];
let selectedImage = null; // base64
let isListening = false;
let recognition = null;
let currentSpeech = null;
let pinnedMessages = [];
let showingPins = false;
let renameSessionId = null;
let deleteSessionId = null;
let isSpeaking = false;
let emptyStateEl = null;

/* DOM */
const $ = (id) => document.getElementById(id);
const messagesInner = $("messages-inner");
const viewport = $("messages-viewport");
const promptInput = $("prompt-input");
const sendBtn = $("send-btn");
const imageInput = $("image-input");
const previewImg = $("preview-img");
const previewWrap = $("image-preview-wrap");
const historyList = $("history-list");
const sidebar = $("sidebar");
const sidebarOverlay = $("sidebar-overlay");
const headerTitle = $("header-title");
const modelDisplay = $("model-display");
const modelPill = $("model-pill");
const voiceBtn = $("voice-btn");
const pinnedBanner = $("pinned-banner");
const pinnedCount = $("pinned-count");
const charCounter = $("char-counter");

/* INIT */
function init() {
  // Theme
  const savedTheme = localStorage.getItem(STORAGE.THEME) || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeOptions(savedTheme);

  // Model
  const savedModel = localStorage.getItem(STORAGE.MODEL) || "gemini-2.5-flash";
  $("model-select").value = savedModel;
  modelDisplay.textContent = MODEL_NAMES[savedModel] || savedModel;

  // Settings fields
  if (apiKey) $("settings-api-input").value = apiKey;
  if (hfKey && $("settings-hf-input")) $("settings-hf-input").value = hfKey;

  const sysProm = localStorage.getItem(STORAGE.SYSTEM_PROMPT) || "";
  $("system-prompt-input").value = sysProm;

  const autoSpeak = localStorage.getItem(STORAGE.AUTO_SPEAK) === "true";
  $("auto-speak-toggle").checked = autoSpeak;

  populateVoices();
  window.speechSynthesis.onvoiceschanged = populateVoices;

  // Model pill click = open settings
  modelPill.addEventListener("click", openSettings);

  // Onboarding
  const onboarded = localStorage.getItem(STORAGE.ONBOARDED);
  if (!onboarded) {
    $("onboarding").classList.remove("hidden");
  }

  // Sessions
  renderHistoryList();
  if (sessions.length > 0) {
    loadSession(sessions[0].id);
  } else {
    activeSessionId = null;
    chatHistory = [];
    clearMessages();
    headerTitle.textContent = "New Chat";
  }

  // Input events
  promptInput.addEventListener("input", onInputChange);
  promptInput.addEventListener("keydown", onInputKeydown);
  imageInput.addEventListener("change", onImageChange);

  // Suggestion chips
  document.querySelectorAll(".suggestion-chip").forEach((c) =>
    c.addEventListener("click", () => {
      promptInput.value = c.dataset.text;
      onInputChange();
      promptInput.focus();
    }),
  );

  // Voice support check
  if (
    !("webkitSpeechRecognition" in window) &&
    !("SpeechRecognition" in window)
  ) {
    voiceBtn.style.opacity = "0.3";
    voiceBtn.title = "Voice not supported in this browser";
    voiceBtn.onclick = null;
  }
  updateSidebarToggleIcon();
}

// Keep sidebar consistent on window resize
window.addEventListener("resize", () => {
  // On desktop, if sidebar isn't explicitly open, ensure compact rail
  if (window.innerWidth > 720 && !sidebar.classList.contains("open")) {
    setCompact();
  }
  updateSidebarToggleIcon();
});

window.addEventListener("DOMContentLoaded", () => {
  syncAllEyes();
});

/* ONBOARDING */
let currentObStep = 1;

function nextStep(n) {
  document
    .querySelector(`.ob-step[data-step="${currentObStep}"]`)
    .classList.remove("active");
  document
    .querySelector(`.ob-prog-dot[data-dot="${currentObStep}"]`)
    .classList.remove("active");
  currentObStep = n;
  document.querySelector(`.ob-step[data-step="${n}"]`).classList.add("active");
  document
    .querySelector(`.ob-prog-dot[data-dot="${n}"]`)
    .classList.add("active");
}

function toggleObKey() {
  const inp = $("ob-api-input");
  inp.type = inp.type === "password" ? "text" : "password";
}

function toggleObHfKey() {
  const inp = $("ob-hf-input");
  inp.type = inp.type === "password" ? "text" : "password";
}

function finishOnboarding() {
  const val = $("ob-api-input").value.trim();
  const errEl = $("ob-key-error");
  if (val && !val.startsWith("AIza")) {
    errEl.classList.remove("hidden");
    return;
  }
  errEl.classList.add("hidden");
  if (val) {
    apiKey = val;
    localStorage.setItem(STORAGE.API_KEY, apiKey);
    $("settings-api-input").value = apiKey;
  }

  const hfVal = $("ob-hf-input")?.value.trim();
  if (hfVal) {
    hfKey = hfVal;
    localStorage.setItem(STORAGE.HF_KEY, hfKey);
    if ($("settings-hf-input")) $("settings-hf-input").value = hfKey;
  }

  localStorage.setItem(STORAGE.ONBOARDED, "1");
  $("onboarding").classList.add("hidden");
}

function skipOnboarding() {
  localStorage.setItem(STORAGE.ONBOARDED, "1");
  $("onboarding").classList.add("hidden");
}

/* THEME */
function toggleTheme() {
  const curr = document.documentElement.getAttribute("data-theme");
  setTheme(curr === "dark" ? "light" : "dark");
}

function setTheme(t) {
  localStorage.setItem(STORAGE.THEME, t);

  if (t === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    document.documentElement.setAttribute("data-theme", systemTheme);
  } else {
    document.documentElement.setAttribute("data-theme", t);
  }

  updateThemeOptions(t);
}

function updateThemeOptions(t) {
  document.querySelectorAll(".theme-option").forEach((b) => {
    b.classList.toggle("active", b.dataset.theme === t);
  });
}

/* SIDEBAR */
function toggleSidebar() {
  // Desktop: toggle between compact (icon rail) and expanded (full sidebar)
  if (window.innerWidth > 720) {
    if (sidebar.classList.contains("open")) {
      // currently expanded -> collapse to compact
      setCompact();
    } else if (sidebar.classList.contains("compact")) {
      // compact -> expand
      setExpanded();
    } else {
      // default: expand
      setExpanded();
    }
  } else {
    // Mobile: slide in/out full sidebar with overlay
    const isOpen = sidebar.classList.toggle("open");
    sidebarOverlay.classList.toggle("open", isOpen);
    updateSidebarToggleIcon();
  }
}

function closeSidebar() {
  if (window.innerWidth > 720) {
    // collapse to compact rail on desktop
    setCompact();
  } else {
    // hide on mobile
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("open");
    updateSidebarToggleIcon();
  }
}

function updateSidebarToggleIcon() {
  const btn = $("sidebar-toggle");
  if (!btn) return;
  // consider compact vs expanded state for the icon
  const isExpanded =
    sidebar.classList.contains("open") ||
    !sidebar.classList.contains("compact");
  btn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
  const hamburger = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>`;
  const closeX = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>`;
  btn.innerHTML = isExpanded ? closeX : hamburger;
}

function setCompact() {
  sidebar.classList.add("compact");
  sidebar.classList.remove("open");
  sidebarOverlay.classList.remove("open");
  updateSidebarToggleIcon();
}

function setExpanded() {
  sidebar.classList.remove("compact");
  sidebar.classList.add("open");
  // only show overlay on small screens
  if (window.innerWidth <= 720) sidebarOverlay.classList.add("open");
  updateSidebarToggleIcon();
}

/* SETTINGS */
function openSettings() {
  $("settings-modal").classList.remove("hidden");
}

function closeSettings() {
  $("settings-modal").classList.add("hidden");
}

function eyeOpenIcon() {
  return `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `;
}

function eyeClosedIcon() {
  return `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a21.77 21.77 0 0 1 5.06-6.94" />
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a21.77 21.77 0 0 1-4.21 5.55" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  `;
}

function syncAllEyes() {
  syncEye("settings-api-input");
  syncEye("settings-hf-input");
}

function syncEye(inputId) {
  const inp = $(inputId);
  const btn = inp.parentElement.querySelector(".settings-eye-btn");
  const icon = btn.querySelector(".eye-icon");

  const isHidden = inp.type === "password";
  icon.innerHTML = isHidden ? eyeOpenIcon() : eyeClosedIcon();
}

function toggleKey(btn, inputId) {
  const inp = $(inputId);
  const icon = btn.querySelector(".eye-icon");

  const isHidden = inp.type === "password";
  inp.type = isHidden ? "text" : "password";

  icon.innerHTML = isHidden ? eyeClosedIcon() : eyeOpenIcon();
}

function saveKey(type) {
  let inputId, storageKey, statusId, setGlobal;

  if (type === "gemini") {
    inputId = "settings-api-input";
    storageKey = STORAGE.API_KEY;
    statusId = "settings-key-status";
    setGlobal = (val) => (apiKey = val);
  }

  if (type === "hf") {
    inputId = "settings-hf-input";
    storageKey = STORAGE.HF_KEY;
    statusId = "settings-hf-status";
    setGlobal = (val) => (hfKey = val);
  }

  const val = $(inputId).value.trim();
  const statusEl = $(statusId);

  if (!val) return;

  setGlobal(val);
  localStorage.setItem(storageKey, val);

  statusEl.textContent = "✓ API key saved successfully";
  statusEl.className = "settings-key-status success";

  setTimeout(() => {
    statusEl.className = "settings-key-status hidden";
  }, 2500);
}

function saveAllSettings() {
  // API key
  const keyVal = $("settings-api-input").value.trim();
  if (keyVal) {
    apiKey = keyVal;
    localStorage.setItem(STORAGE.API_KEY, apiKey);
  }

  const hfVal = $("settings-hf-input").value.trim();
  if (hfVal) {
    hfKey = hfVal;
    localStorage.setItem(STORAGE.HF_KEY, hfKey);
  }

  // Model
  const model = $("model-select").value;
  localStorage.setItem(STORAGE.MODEL, model);
  modelDisplay.textContent = MODEL_NAMES[model] || model;

  // System prompt
  const sp = $("system-prompt-input").value.trim();
  localStorage.setItem(STORAGE.SYSTEM_PROMPT, sp);

  // Auto speak
  localStorage.setItem(STORAGE.AUTO_SPEAK, $("auto-speak-toggle").checked);

  // Voice lang
  localStorage.setItem(STORAGE.VOICE_LANG, $("voice-lang-select").value);

  closeSettings();
}

/* Close modal on backdrop click */
$("settings-modal").addEventListener("click", (e) => {
  if (e.target === $("settings-modal")) closeSettings();
});

/* SEARCH */
function openSearch() {
  $("search-modal").classList.remove("hidden");
  setTimeout(() => $("search-input").focus(), 50);
}

function closeSearch() {
  $("search-modal").classList.add("hidden");
  $("search-input").value = "";
  $("search-results").innerHTML = "";
}

function doSearch(query) {
  const results = $("search-results");
  results.innerHTML = "";
  if (!query.trim()) return;

  const q = query.toLowerCase();
  let found = 0;

  sessions.forEach((session) => {
    session.messages.forEach((msg, idx) => {
      if (!msg.text) return;
      if (msg.text.toLowerCase().includes(q)) {
        found++;
        const item = document.createElement("div");
        item.className = "search-result-item";
        const highlighted = msg.text.replace(
          new RegExp(`(${escapeRegex(query)})`, "gi"),
          "<mark>$1</mark>",
        );
        item.innerHTML = `
          <div class="search-result-role">${msg.role === "ai" ? "Lumix" : "You"} · ${session.title}</div>
          <div class="search-result-text">${highlighted.slice(0, 200)}</div>`;
        item.addEventListener("click", () => {
          closeSearch();
          loadSession(session.id);
        });
        results.appendChild(item);
      }
    });
  });

  if (!found) {
    results.innerHTML = `<div class="search-empty">No messages found for "<strong>${escapeHtml(query)}</strong>"</div>`;
  }
}

$("search-modal").addEventListener("click", (e) => {
  if (e.target === $("search-modal")) closeSearch();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSearch();
    closeSettings();
    closeExport();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    openSearch();
  }
});

/* EXPORT */
function openExport() {
  $("export-modal").classList.remove("hidden");
}

function closeExport() {
  $("export-modal").classList.add("hidden");
}

$("export-modal").addEventListener("click", (e) => {
  if (e.target === $("export-modal")) closeExport();
});

function exportAs(format) {
  const session = getCurrentSession();
  if (!session || !session.messages.length)
    return alert("No messages to export.");

  const title = session.title;
  const msgs = session.messages;
  let content = "",
    ext = format,
    mime = "text/plain";

  if (format === "txt") {
    content = `${title}\n${"=".repeat(title.length)}\n\n`;
    msgs.forEach((m) => {
      content += `[${m.role === "ai" ? "Lumix" : "You"}]\n${m.text || "[image]"}\n\n`;
    });
  } else if (format === "md") {
    content = `# ${title}\n\n`;

    msgs.forEach((m) => {
      content += `**${m.role === "ai" ? "Lumix" : "You"}**\n\n${m.text || "_[image]_"}\n\n---\n\n`;
    });

    mime = "text/markdown";
  } else if (format === "json") {
    const exportMsgs = msgs.map((m) => ({
      ...m,
      image: m.image ? "[base64 image omitted]" : null,
    }));

    content = JSON.stringify({ title, messages: exportMsgs }, null, 2);
    mime = "application/json";
  } else if (format === "html") {
    const rows = msgs
      .map((m) => {
        const role = m.role === "ai" ? "Lumix" : "You";
        const cls = m.role === "ai" ? "ai" : "user";
        let bodyContent;
        if (m.image) {
          bodyContent = `<img src="${m.image}" style="max-width:340px;border-radius:8px;display:block;">`;
        } else {
          const raw = window.marked
            ? marked.parse(m.text || "")
            : escapeHtml(m.text || "");
          bodyContent = sanitizeHtml(raw);
        }
        return `<div class="msg ${cls}"><span class="role">${role}</span><div class="text">${bodyContent}</div></div>`;
      })
      .join("");
    content = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title><style>body{font-family:sans-serif;max-width:720px;margin:40px auto;padding:0 20px;background:#0e0d0b;color:#f0ece3}.msg{margin:18px 0;padding:14px 18px;border-radius:12px}.ai{background:#1a1916;border:1px solid #2c2a26}.user{background:#e8e0cc;color:#100f0d;text-align:right}.role{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.5;display:block;margin-bottom:6px}pre{background:#111;padding:12px;border-radius:8px;overflow-x:auto}code{font-family:monospace}</style></head><body><h1>${escapeHtml(title)}</h1>${rows}</body></html>`;
    ext = "html";
    mime = "text/html";
  }

  try {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "export").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  } finally {
    closeExport();
  }
}

/* SESSIONS */
function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE.SESSIONS)) || [];
  } catch {
    return [];
  }
}

function saveSessions() {
  localStorage.setItem(STORAGE.SESSIONS, JSON.stringify(sessions));
}

function startNewChat() {
  activeSessionId = Date.now().toString();
  chatHistory = [];
  pinnedMessages = [];
  sessions.unshift({
    id: activeSessionId,
    title: "New Chat",
    messages: [],
    pins: [],
  });
  saveSessions();
  renderHistoryList();
  clearMessages();
  headerTitle.textContent = "New Chat";
  if (window.innerWidth <= 720) closeSidebar();
  updatePinnedBanner();
}

function loadSession(id) {
  const session = sessions.find((s) => s.id === id);
  if (!session) return;
  activeSessionId = id;
  pinnedMessages = session.pins || [];
  chatHistory = session.messages
    .filter((m) => m.text)
    .map((m) => ({
      role: m.role === "ai" ? "model" : m.role,
      parts: [{ text: m.text }],
    }));
  clearMessages();
  session.messages.forEach((m) =>
    renderMessage(m.role, m.text, m.image, false, m.id),
  );
  headerTitle.textContent = session.title;
  renderHistoryList();
  updatePinnedBanner();
  if (window.innerWidth <= 720) closeSidebar();
}

function getCurrentSession() {
  return sessions.find((s) => s.id === activeSessionId);
}

// Rename Session
function openRenameModal(id, currentTitle) {
  renameSessionId = id;
  document.getElementById("rename-input").value = currentTitle;
  document.getElementById("rename-modal").classList.remove("hidden");
}

function closeRenameModal() {
  document.getElementById("rename-modal").classList.add("hidden");
}

function confirmRename() {
  const newTitle = document.getElementById("rename-input").value.trim();

  if (!newTitle) return;

  const session = sessions.find((s) => s.id === renameSessionId);
  if (session) session.title = newTitle;

  saveSessions();
  renderHistoryList();
  closeRenameModal();
}

// Delete Session
function openDeleteModal(id) {
  deleteSessionId = id;
  document.getElementById("delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
  document.getElementById("delete-modal").classList.add("hidden");
}

function confirmDelete() {
  sessions = sessions.filter((s) => s.id !== deleteSessionId);

  if (activeSessionId === deleteSessionId) {
    activeSessionId = sessions[0]?.id || null;
  }

  saveSessions();
  renderHistoryList();
  closeDeleteModal();
}

// Clear History
function openClearModal() {
  document.getElementById("clear-modal").classList.remove("hidden");
}

function closeClearModal() {
  document.getElementById("clear-modal").classList.add("hidden");
}

function confirmClear() {
  sessions = [];
  activeSessionId = null;

  saveSessions();
  renderHistoryList();
  closeClearModal();

  // Reset main chat area
  clearMessages();
  headerTitle.textContent = "New Chat";
  chatHistory = [];
  pinnedMessages = [];
  updatePinnedBanner();
}

function confirmClearHistory() {
  openClearModal();
}

function renderHistoryList() {
  historyList.innerHTML = "";

  if (sessions.length === 0) {
    historyList.innerHTML = `
      <div class="history-empty">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.5">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <span>No chats yet</span>
        <small>Start a new chat to get going</small>
      </div>`;
    return;
  }

  sessions.forEach((session) => {
    const hasPins = session.pins && session.pins.length > 0;
    const item = document.createElement("div");
    item.className =
      "history-item" + (session.id === activeSessionId ? " active" : "");
    item.innerHTML = `
      <svg class="hist-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="hist-title">${escapeHtml(session.title)}</span>
      ${hasPins ? '<span class="hist-pin"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg></span>' : ""}
      <div class="hist-actions">
        <button class="hist-btn rename-btn" title="Rename">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="hist-btn delete-btn" title="Delete">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`;

    item.querySelector(".rename-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openRenameModal(session.id, session.title);
    });

    item.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openDeleteModal(session.id);
    });

    item.addEventListener("click", () => loadSession(session.id));
    historyList.appendChild(item);
  });
}

/* PINS */
function togglePin(messageId, btn) {
  const session = getCurrentSession();
  if (!session) return;

  const idx = pinnedMessages.indexOf(messageId);

  if (idx === -1) {
    pinnedMessages.push(messageId);
    btn.classList.add("active");
    btn.title = "Unpin message";
    btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg> Unpin`;
  } else {
    pinnedMessages.splice(idx, 1);
    btn.classList.remove("active");
    btn.title = "Pin message";
    btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg> Pin`;
  }

  session.pins = [...pinnedMessages];
  saveSessions();
  updatePinnedBanner();
}

function updatePinnedBanner() {
  if (pinnedMessages.length > 0) {
    pinnedBanner.classList.remove("hidden");
    pinnedCount.textContent = `${pinnedMessages.length} pinned message${pinnedMessages.length > 1 ? "s" : ""}`;
  } else {
    pinnedBanner.classList.add("hidden");
  }
}

function togglePinnedView() {
  const rows = messagesInner.querySelectorAll(".message-row");
  const viewBtn = pinnedBanner.querySelector("button");

  if (!showingPins) {
    rows.forEach((row) => {
      const id = row.dataset.id;
      row.style.display = pinnedMessages.includes(id) ? "" : "none";
    });
    showingPins = true;
    if (viewBtn) viewBtn.textContent = "Hide";
  } else {
    rows.forEach((row) => (row.style.display = ""));
    showingPins = false;
    if (viewBtn) viewBtn.textContent = "View";
  }
}

/* VOICE INPUT */
function toggleVoice() {
  if (isListening) stopListening();
  else startListening();
}

function startListening() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) return;
  const lang = localStorage.getItem(STORAGE.VOICE_LANG) || "en-US";
  recognition = new SpeechRec();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = lang;

  recognition.onstart = () => {
    isListening = true;
    voiceBtn.classList.add("active");
    $("input-box").classList.add("listening");
    promptInput.placeholder = "Listening...";
  };

  recognition.onresult = (e) => {
    const transcript = Array.from(e.results)
      .map((r) => r[0].transcript)
      .join("");
    promptInput.value = transcript;
    onInputChange();
  };

  recognition.onerror = (e) => {
    console.warn("Speech recognition error:", e.error);
    stopListening();
  };

  // Only stop UI state here, don't clear the transcript
  recognition.onend = () => stopListening();

  recognition.start();
}

function stopListening() {
  isListening = false;
  if (recognition) {
    try {
      recognition.stop();
    } catch (e) {}
    recognition = null;
  }
  voiceBtn.classList.remove("active");
  $("input-box").classList.remove("listening");
  promptInput.placeholder = "Message Lumix...";
}

/* TTS (text to speech) */
function speakText(text, btn) {
  if (!("speechSynthesis" in window)) return;

  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    if (btn) {
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Read`;
    }
    return;
  }

  if (currentSpeech) window.speechSynthesis.cancel();

  const plain = text.replace(/[#*`>_~\[\]]/g, "").replace(/\n+/g, " ");
  const utt = new SpeechSynthesisUtterance(plain);

  const savedVoice = localStorage.getItem(STORAGE.VOICE_LANG) || "";
  const voices = window.speechSynthesis.getVoices();
  const matched = voices.find((v) => v.name === savedVoice);
  if (matched) utt.voice = matched;

  utt.rate = 1.0;
  utt.pitch = 1.0;

  utt.onstart = () => {
    isSpeaking = true;
    if (btn)
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg> Stop`;
  };

  utt.onend = () => {
    isSpeaking = false;
    if (btn)
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Read`;
  };

  utt.onerror = () => {
    isSpeaking = false;
    if (btn)
      btn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> Read`;
  };

  currentSpeech = utt;
  window.speechSynthesis.speak(utt);
}

function populateVoices() {
  const select = $("voice-lang-select");
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return;

  const saved = localStorage.getItem(STORAGE.VOICE_LANG) || "";
  select.innerHTML = "";

  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    option.selected = voice.name === saved;
    select.appendChild(option);
  });
}

/* IMAGE */
function onImageChange() {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImage = e.target.result.split(",")[1];
    previewImg.src = e.target.result;
    previewWrap.classList.remove("hidden");
    updateSendBtn();
  };
  reader.readAsDataURL(file);
}

function clearImage() {
  selectedImage = null;
  imageInput.value = "";
  previewWrap.classList.add("hidden");
  previewImg.src = "#";
  updateSendBtn();
}

async function handleImageGenerate() {
  const text = promptInput.value.trim();
  if (!text) return;

  if (!hfKey) {
    renderMessage(
      "ai",
      "**No Hugging Face API key** — add one in Settings to generate images.",
      null,
      true,
    );
    openSettings();
    return;
  }

  let session = getCurrentSession();
  if (!session) {
    activeSessionId = Date.now().toString();
    session = {
      id: activeSessionId,
      title: "New Chat",
      messages: [],
      pins: [],
    };
    sessions.unshift(session);
    saveSessions();
    renderHistoryList();
    headerTitle.textContent = "New Chat";
  }

  const userMsgId = Date.now().toString();
  renderMessage("user", text, null, true, userMsgId);

  promptInput.value = "";
  promptInput.style.height = "auto";
  charCounter.textContent = "";
  sendBtn.disabled = true;

  const typingRow = showTyping();

  try {
    const res = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hfKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const blob = await res.blob();

    // Convert blob to base64 so it persists after reload
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

    const imgUrl = base64;

    removeTyping(typingRow);

    const aiMsgId = Date.now().toString() + "-ai";
    const es = messagesInner.querySelector(".empty-state");
    if (es) es.remove();

    const row = document.createElement("div");
    row.dataset.id = aiMsgId;
    row.className = "message-row ai";
    row.innerHTML = `
      <div class="ai-sender">
        <div class="logo-mark">
          <svg width="15" height="15" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style="overflow:visible">
            <path d="M6 38 L6 10 L14 10 L24 30 L34 10 L42 10 L42 38 L35 38 L35 17 L26 36 L22 36 L13 17 L13 38 Z" fill="currentColor"/>
            <circle cx="51" cy="3" r="6" fill="#7F77DD"/>
          </svg>
        </div>
        <span>Lumix</span>
      </div>
      <div class="bubble" style="padding:8px;background:transparent;border:none;box-shadow:none;"></div>
      <div class="msg-actions">
        <button class="msg-action-btn download-img-btn" title="Download">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download
        </button>
      </div>`;

    const img = document.createElement("img");
    img.src = imgUrl;
    img.style.cssText =
      "max-width:340px;width:100%;border-radius:14px;display:block;";
    row.querySelector(".bubble").appendChild(img);

    row.querySelector(".download-img-btn").addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = `lumix-${Date.now()}.png`;
      a.click();
    });

    messagesInner.appendChild(row);
    scrollToBottom();

    session.messages.push({
      id: aiMsgId,
      role: "ai",
      text: `[Generated image: ${text}]`,
      image: base64,
    });
    saveSessions();

    if (session.title === "New Chat") {
      session.title = text.slice(0, 42) + (text.length > 42 ? "…" : "");
      headerTitle.textContent = session.title;
      saveSessions();
      renderHistoryList();
    }
  } catch (err) {
    removeTyping(typingRow);
    renderMessage("ai", `**Error:** ${err.message}`, null, true);
  }
}

/* INPUT */
function onInputChange() {
  promptInput.style.height = "auto";
  promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + "px";
  updateSendBtn();
  const len = promptInput.value.length;
  charCounter.textContent = len > 100 ? `${len}` : "";
}

function onInputKeydown(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) handleSend();
  }
}

function updateSendBtn() {
  sendBtn.disabled = !promptInput.value.trim() && !selectedImage;
}

/* SEND / RECEIVE */
function handleSend() {
  const text = promptInput.value.trim();
  const image = selectedImage;

  if (!text && !image) return;

  // Route to image generation if starts with /imagine
  if (text.toLowerCase().startsWith("/imagine ")) {
    promptInput.value = text.slice(9).trim(); // strip the command
    handleImageGenerate();
    return;
  }

  // 🧠 LAZY SESSION CREATION
  let session = getCurrentSession();

  if (!session) {
    activeSessionId = Date.now().toString();

    session = {
      id: activeSessionId,
      title: "New Chat",
      messages: [],
      pins: [],
    };

    sessions.unshift(session);
    saveSessions();
    renderHistoryList();
    headerTitle.textContent = "New Chat";
  }

  const userMsgId = Date.now().toString();
  renderMessage("user", text || "", image, true, userMsgId);

  const parts = [];
  if (text) parts.push({ text });
  if (image)
    parts.push({ inline_data: { mime_type: "image/jpeg", data: image } });
  chatHistory.push({ role: "user", parts });

  promptInput.value = "";
  promptInput.style.height = "auto";
  charCounter.textContent = "";
  clearImage();
  sendBtn.disabled = true;

  getAIResponse();
}

async function getAIResponse() {
  const typingRow = showTyping();
  const model = localStorage.getItem(STORAGE.MODEL) || "gemini-2.5-flash";
  const sysProm = localStorage.getItem(STORAGE.SYSTEM_PROMPT) || "";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const body = { contents: chatHistory };
  if (sysProm) body.systemInstruction = { parts: [{ text: sysProm }] };

  try {
    // Validate apiKey
    console.log('📡 [Gemini] Starting request', { 
      apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'EMPTY',
      apiKeyValid: apiKey && apiKey.length > 0,
      model,
      chatHistoryLength: chatHistory.length,
      bodyKeys: Object.keys(body),
      firstMessageRole: chatHistory[0]?.role,
      firstMessagePartsCount: chatHistory[0]?.parts?.length
    });
    
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error("API key is missing. Please add your Gemini API key in Settings (gear icon).");
    }

    // Validate API key format
    if (!apiKey.startsWith('AIza')) {
      console.warn('⚠️ [Gemini] API key does not start with "AIza" - this may be incorrect format');
    }

    // Validate chatHistory format
    if (!chatHistory || chatHistory.length === 0) {
      throw new Error("No chat history to send.");
    }

    const useProxy = false; // Disable proxy - always use direct Google API
    
    // Official Google Gemini API auth: use API key as query parameter
    const fetchOptions = {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const requestUrl = `${API_URL}?key=${encodeURIComponent(apiKey)}`;
    
    console.log('📡 [Gemini] Request URL:', requestUrl.replace(apiKey, '[API_KEY_REDACTED]'));
    console.log('📡 [Gemini] Auth method:', 'Query parameter (?key=...)');
    console.log('📡 [Gemini] Request body:', JSON.stringify(body, null, 2));
    
    const res = await fetch(requestUrl, fetchOptions);

    removeTyping(typingRow);

    const responseText = await res.text();
    console.log('📡 [Gemini] Response status:', res.status);
    console.log('📡 [Gemini] Response body:', responseText);

    if (!res.ok) {
      let err;
      try {
        err = JSON.parse(responseText);
      } catch {
        err = { error: responseText };
      }
      
      const message = err.error?.message || err.error || `HTTP ${res.status}`;
      const code = err.error?.code;
      
      // Specific error guidance
      let userMessage = message;
      if (code === 401 || message.includes('authentication') || message.includes('UNAUTHENTICATED')) {
        userMessage = `Authentication Failed: Your API key may be invalid or have OAuth-only restrictions. 
        
1. Verify your Gemini API key starts with "AIza"
2. Check in Google Cloud Console that the API key has "Generative Language API" enabled
3. Ensure it's not restricted to OAuth only (check the key's application restrictions)
4. Try creating a new unrestricted API key`;
      }
      
      console.error('❌ [Gemini] Error:', { status: res.status, code, error: err });
      throw new Error(userMessage || "Unable to connect to Gemini. Check your API key and try again.");
    }

    const data = JSON.parse(responseText);

    if (data.candidates && data.candidates[0]) {
      const candidate = data.candidates[0];
      if (candidate.finishReason && candidate.finishReason !== "STOP") {
        if (candidate.finishReason === "SAFETY") {
          throw new Error("Response was blocked by Gemini safety filters. Please try rephrasing your request.");
        } else if (candidate.finishReason === "RECITATION") {
          throw new Error("Response was blocked due to recitation/copyright constraints.");
        } else {
          throw new Error(`Response generation ended with reason: ${candidate.finishReason}`);
        }
      }
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) throw new Error("Empty response from Gemini.");

    const aiMsgId = Date.now().toString() + "-ai";
    renderMessage("ai", aiText, null, true, aiMsgId);

    chatHistory.push({ role: "model", parts: [{ text: aiText }] });

    // Auto-speak
    if (localStorage.getItem(STORAGE.AUTO_SPEAK) === "true")
      speakText(aiText, null);

    // Auto-title
    const session = getCurrentSession();
    if (session && session.title === "New Chat") {
      const firstText =
        chatHistory.find((m) => m.role === "user")?.parts?.[0]?.text || "";
      if (firstText) {
        session.title =
          firstText.slice(0, 42) + (firstText.length > 42 ? "…" : "");
        headerTitle.textContent = session.title;
      }
    }
    saveSessions();
    renderHistoryList();
  } catch (err) {
    removeTyping(typingRow);
    console.error('❌ [Gemini] Final error caught:', err);
    renderMessage("ai", `**Error:** ${err.message}`, null, true);
  }
}

/* RENDER MESSAGE */
function renderMessage(
  role,
  text,
  image,
  save,
  messageId = Date.now().toString(),
) {
  // Remove empty state
  const es = messagesInner.querySelector(".empty-state");
  if (es) es.remove();

  const session = getCurrentSession();

  const row = document.createElement("div");
  row.dataset.id = messageId;
  row.className = `message-row ${role}`;
  if (pinnedMessages.includes(messageId)) row.classList.add("pinned");

  if (role === "ai") {
    row.innerHTML = `
      <div class="ai-sender">
        <div class="logo-mark">
            <svg
                width="15"
                height="15"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="overflow: visible"
            >
            <path
                d="M6 38 L6 10 L14 10 L24 30 L34 10 L42 10 L42 38 L35 38 L35 17 L26 36 L22 36 L13 17 L13 38 Z"
                fill="currentColor"
            />
                <circle cx="51" cy="3" r="6" fill="#7F77DD" />
            </svg>
        </div>
        <span>Lumix</span>
      </div>
      <div class="bubble"></div>
      <div class="msg-actions">
        <button class="msg-action-btn copy-response-btn" title="Copy response">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </button>
        <button class="msg-action-btn speak-btn" title="Read aloud">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          Read
        </button>
        <button class="msg-action-btn pinned-btn ${pinnedMessages.includes(messageId) ? "active" : ""}" title="${pinnedMessages.includes(messageId) ? "Unpin" : "Pin"} message">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z"/></svg>
          Pin
        </button>
      </div>`;

    // Code block copy buttons
    const bubble = row.querySelector(".bubble");

    if (image) {
      const img = document.createElement("img");
      img.src = image;
      img.style.cssText =
        "max-width:340px;width:100%;border-radius:14px;display:block;";
      bubble.appendChild(img);

      const actionsEl = row.querySelector(".msg-actions");

      // Hide Copy and Read, irrelevant for images
      row.querySelector(".copy-response-btn").style.display = "none";
      row.querySelector(".speak-btn").style.display = "none";

      // Add Download button
      const dlBtn = document.createElement("button");
      dlBtn.className = "msg-action-btn download-img-btn";
      dlBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download`;
      dlBtn.addEventListener("click", () => {
        const a = document.createElement("a");
        a.href = image;
        a.download = `lumix-${Date.now()}.png`;
        a.click();
      });
      actionsEl.prepend(dlBtn);
    } else {
      const htmlContent = window.marked ? marked.parse(text) : text;
      bubble.innerHTML = sanitizeHtml(htmlContent);

      // code block copy buttons (already present, keep as-is)
      bubble.querySelectorAll("pre").forEach((pre) => {
        const btn = document.createElement("button");
        btn.className = "copy-btn";
        btn.textContent = "Copy";
        btn.addEventListener("click", () => {
          const code = pre.querySelector("code");
          navigator.clipboard.writeText(code ? code.innerText : pre.innerText);
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = "Copy"), 2000);
        });
        pre.style.position = "relative";
        pre.appendChild(btn);
      });
    }

    // Copy full response
    row
      .querySelector(".copy-response-btn")
      .addEventListener("click", function () {
        navigator.clipboard.writeText(text);
        const orig = this.innerHTML;
        this.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        setTimeout(() => (this.innerHTML = orig), 2000);
      });

    // Speak button
    row.querySelector(".speak-btn").addEventListener("click", function () {
      speakText(text, this);
    });

    const msgId = messageId;

    row.querySelector(".pinned-btn").addEventListener("click", function () {
      togglePin(messageId, this);
    });
  } else {
    // User message
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    if (image) {
      const img = document.createElement("img");
      img.src = image.startsWith("data:")
        ? image
        : `data:image/jpeg;base64,${image}`;
      img.className = "msg-image";
      bubble.appendChild(img);
    }

    if (text) {
      const p = document.createElement("p");
      p.textContent = text;
      bubble.appendChild(p);
    }

    const actions = document.createElement("div");
    actions.className = "msg-actions";

    const copyBtn = document.createElement("button");
    copyBtn.className = "msg-action-btn";
    copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(text);
      copyBtn.textContent = "✓ Copied";
      setTimeout(
        () =>
          (copyBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`),
        2000,
      );
    });
    actions.appendChild(copyBtn);

    row.appendChild(bubble);
    row.appendChild(actions);
  }

  messagesInner.appendChild(row);
  scrollToBottom();

  if (save && session) {
    session.messages.push({
      id: messageId,
      role,
      text,
      image: image || null,
    });
    saveSessions();
  }
}

/* TYPING */
function showTyping() {
  const row = document.createElement("div");
  row.className = "typing-row";
  row.innerHTML = `
    <div class="ai-sender">
      <div class="logo-mark">
            <svg
                width="15"
                height="15"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style="overflow: visible"
            >
            <path
                  d="M6 38 L6 10 L14 10 L24 30 L34 10 L42 10 L42 38 L35 38 L35 17 L26 36 L22 36 L13 17 L13 38 Z"
                  fill="currentColor"
            />
                <circle cx="51" cy="3" r="6" fill="#7F77DD" />
            </svg>
        </div>
        <span>Lumix</span>
    </div>
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  messagesInner.appendChild(row);
  scrollToBottom();
  return row;
}

function removeTyping(row) {
  if (row?.parentNode) row.remove();
}

/* HELPERS */
function clearMessages() {
  messagesInner.innerHTML = "";

  const noSessions = sessions.length === 0;

  messagesInner.innerHTML = noSessions
    ? `
    <div class="empty-state">
      <div class="empty-gem">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h2>No chats yet</h2>
      <p>Your conversation history has been cleared. Start fresh below.</p>
      <button class="ob-next-btn" style="max-width:220px;margin-top:8px" onclick="startNewChat()">
        New Chat
      </button>
    </div>`
    : `
    <div class="empty-state">
      <div class="empty-gem">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h2>How can I help?</h2>
      <p>Ask me anything — code, analysis, writing, math, images, and more.</p>
      <div class="suggestions">
        <button class="suggestion-chip" data-text="Explain quantum computing simply">⚛️ Explain quantum computing</button>
        <button class="suggestion-chip" data-text="Write a Python function to parse JSON data">🐍 Python JSON parser</button>
        <button class="suggestion-chip" data-text="What are clean code best practices?">✨ Clean code practices</button>
        <button class="suggestion-chip" data-text="Brainstorm startup name ideas for a tech company">💡 Startup name ideas</button>
      </div>
    </div>`;

  // Re-bind chips
  messagesInner.querySelectorAll(".suggestion-chip").forEach((c) =>
    c.addEventListener("click", () => {
      promptInput.value = c.dataset.text;
      onInputChange();
      promptInput.focus();
    }),
  );
}

function scrollToBottom() {
  viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
}

function sanitizeHtml(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  
  // Strip dangerous tags completely
  const dangerousElements = temp.querySelectorAll("script, iframe, object, embed, link, meta, style");
  dangerousElements.forEach(el => el.remove());
  
  // Sanitize all remaining elements
  const allElements = temp.querySelectorAll("*");
  allElements.forEach(el => {
    const attributes = el.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attrName = attributes[i].name;
      // Strip event handlers (onload, onerror, onclick, etc.) and javascript URI schemes
      if (attrName.startsWith("on") || attributes[i].value.trim().toLowerCase().startsWith("javascript:")) {
        el.removeAttribute(attrName);
      }
    }
  });
  return temp.innerHTML;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* START */
init();
