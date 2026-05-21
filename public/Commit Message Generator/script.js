/* ═══════════════════════════════════════════════════
   COMMIT MESSAGE GENERATOR — script.js
   ═══════════════════════════════════════════════════ */

(() => {
  'use strict';

  // ── Type descriptions ──────────────────────────────
  const TYPE_INFO = {
    feat:     'A new feature',
    fix:      'Bug fix',
    docs:     'Documentation changes',
    style:    'Code style (formatting, semicolons…)',
    refactor: 'Code refactor',
    test:     'Adding or updating tests',
    chore:    'Maintenance tasks',
  };

  // ── Random commit examples ─────────────────────────
  const RANDOM_COMMITS = [
    { type: 'feat',     desc: 'add dark mode support' },
    { type: 'feat',     desc: 'add responsive navbar' },
    { type: 'feat',     desc: 'implement search functionality' },
    { type: 'feat',     desc: 'add user profile page' },
    { type: 'feat',     desc: 'integrate payment gateway' },
    { type: 'feat',     desc: 'add email notifications' },
    { type: 'feat',     desc: 'implement infinite scroll' },
    { type: 'fix',      desc: 'resolve authentication issue' },
    { type: 'fix',      desc: 'resolve mobile navbar issue' },
    { type: 'fix',      desc: 'correct form validation on submit' },
    { type: 'fix',      desc: 'handle null pointer in user service' },
    { type: 'fix',      desc: 'fix memory leak in event listeners' },
    { type: 'fix',      desc: 'prevent duplicate API calls on click' },
    { type: 'docs',     desc: 'update README instructions' },
    { type: 'docs',     desc: 'update contribution guidelines' },
    { type: 'docs',     desc: 'add API endpoint documentation' },
    { type: 'docs',     desc: 'add inline JSDoc comments' },
    { type: 'style',    desc: 'format code with prettier' },
    { type: 'style',    desc: 'fix indentation in utils module' },
    { type: 'style',    desc: 'remove trailing whitespace' },
    { type: 'refactor', desc: 'simplify authentication logic' },
    { type: 'refactor', desc: 'extract reusable modal component' },
    { type: 'refactor', desc: 'replace callbacks with async/await' },
    { type: 'refactor', desc: 'move constants to config file' },
    { type: 'test',     desc: 'add unit tests for auth module' },
    { type: 'test',     desc: 'increase coverage for user service' },
    { type: 'test',     desc: 'add integration tests for checkout' },
    { type: 'chore',    desc: 'update dependencies to latest' },
    { type: 'chore',    desc: 'configure CI/CD pipeline' },
    { type: 'chore',    desc: 'remove unused npm packages' },
    { type: 'chore',    desc: 'add pre-commit linting hook' },
  ];

  // ── DOM refs ───────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);

  const commitType        = $('#commit-type');
  const commitScope       = $('#commit-scope');
  const commitDescription = $('#commit-description');
  const charCount         = $('#char-count');
  const descError         = $('#description-error');
  const typeHelper        = $('#type-helper');
  const previewMessage    = $('#preview-message');

  const btnGenerate       = $('#btn-generate');
  const btnCopy           = $('#btn-copy');
  const btnRandom         = $('#btn-random');
  const btnDownload       = $('#btn-download');
  const btnClearHistory   = $('#btn-clear-history');
  const themeToggle       = $('#theme-toggle');

  const toast             = $('#toast');
  const toastMsg          = $('#toast-message');
  const historyList       = $('#history-list');
  const historyEmpty      = $('#history-empty');

  // ── State ──────────────────────────────────────────
  const STORAGE_KEY = 'cmg_history';
  const THEME_KEY   = 'cmg_theme';
  let history       = loadHistory();
  let toastTimer    = null;
  let currentMessage = '';

  // ── Init ───────────────────────────────────────────
  function init() {
    applyTheme(loadTheme());
    renderHistory();
    updatePreview();

    // Live events
    commitType.addEventListener('change', onTypeChange);
    commitScope.addEventListener('input', updatePreview);
    commitDescription.addEventListener('input', onDescriptionInput);

    // Buttons
    btnGenerate.addEventListener('click', generate);
    btnCopy.addEventListener('click', copyToClipboard);
    btnRandom.addEventListener('click', randomCommit);
    btnDownload.addEventListener('click', downloadHistory);
    btnClearHistory.addEventListener('click', clearHistory);
    themeToggle.addEventListener('click', toggleTheme);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleShortcuts);
  }

  // ── Theme ──────────────────────────────────────────
  function loadTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // ── Type change ────────────────────────────────────
  function onTypeChange() {
    const val = commitType.value;
    typeHelper.textContent = `${val} → ${TYPE_INFO[val]}`;
    updatePreview();
  }

  // ── Description input ──────────────────────────────
  function onDescriptionInput() {
    const len = commitDescription.value.length;
    charCount.textContent = len;

    // Clear error state when user starts typing
    if (len > 0) {
      hideError();
    }

    // Color warning on count
    charCount.style.color = len > 60 ? 'var(--orange)' : len > 50 ? 'var(--yellow)' : '';
    updatePreview();
  }

  // ── Preview ────────────────────────────────────────
  function buildMessage() {
    const type  = commitType.value;
    const scope = commitScope.value.trim();
    const desc  = commitDescription.value.trim();
    const scopePart = scope ? `(${scope})` : '';
    return desc ? `${type}${scopePart}: ${desc}` : '';
  }

  function updatePreview() {
    const msg = buildMessage();
    const display = msg || '...';

    if (previewMessage.textContent !== display) {
      previewMessage.textContent = display;
      previewMessage.classList.remove('flash');
      // Trigger reflow so the animation re-plays
      void previewMessage.offsetWidth;
      previewMessage.classList.add('flash');
    }
  }

  // ── Generate ───────────────────────────────────────
  function generate() {
    const desc = commitDescription.value.trim();

    if (!desc) {
      showError();
      commitDescription.classList.add('error');
      commitDescription.focus();
      return;
    }

    hideError();
    commitDescription.classList.remove('error');

    currentMessage = buildMessage();
    btnCopy.disabled = false;

    // Add to history
    addToHistory(currentMessage, commitType.value);
    showToast('Commit message generated!');
  }

  // ── Validation ─────────────────────────────────────
  function showError() {
    descError.hidden = false;
  }
  function hideError() {
    descError.hidden = true;
    commitDescription.classList.remove('error');
  }

  // ── Copy ───────────────────────────────────────────
  async function copyToClipboard() {
    if (!currentMessage) return;

    try {
      await navigator.clipboard.writeText(currentMessage);
      showToast('Commit message copied!');
      animateCopyButton();
    } catch {
      // Fallback
      fallbackCopy(currentMessage);
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Commit message copied!');
    animateCopyButton();
  }

  function animateCopyButton() {
    btnCopy.classList.add('copied');
    const label = btnCopy.querySelector('.btn__label');
    label.textContent = 'Copied!';

    setTimeout(() => {
      btnCopy.classList.remove('copied');
      label.textContent = 'Copy';
    }, 1800);
  }

  // ── Copy from history ──────────────────────────────
  async function copyHistoryItem(msg) {
    try {
      await navigator.clipboard.writeText(msg);
    } catch {
      fallbackCopy(msg);
      return;
    }
    showToast('Commit message copied!');
  }

  // ── Random ─────────────────────────────────────────
  function randomCommit() {
    const pick = RANDOM_COMMITS[Math.floor(Math.random() * RANDOM_COMMITS.length)];
    commitType.value = pick.type;
    onTypeChange();
    commitDescription.value = pick.desc;
    onDescriptionInput();

    // Auto-generate
    generate();
  }

  // ── History ────────────────────────────────────────
  function loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function addToHistory(msg, type) {
    // Prevent consecutive duplicate
    if (history.length && history[0].msg === msg) return;

    history.unshift({ msg, type, ts: Date.now() });
    if (history.length > 50) history.pop(); // cap at 50
    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    // Toggle empty state
    const hasItems = history.length > 0;
    historyEmpty.hidden = hasItems;
    btnDownload.disabled = !hasItems;
    btnClearHistory.disabled = !hasItems;

    // Remove old items (but keep the empty placeholder)
    historyList.querySelectorAll('.history-item').forEach(el => el.remove());

    history.forEach((item, i) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.style.animationDelay = `${i * .04}s`;

      li.innerHTML = `
        <span class="history-item__type type-${item.type}">${item.type}</span>
        <span class="history-item__msg" title="${escapeHtml(item.msg)}">${escapeHtml(item.msg)}</span>
        <button class="history-item__copy" title="Copy" aria-label="Copy commit message">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        </button>
      `;

      li.querySelector('.history-item__copy').addEventListener('click', () => copyHistoryItem(item.msg));
      historyList.appendChild(li);
    });
  }

  function clearHistory() {
    if (!confirm('Clear all commit history?')) return;
    history = [];
    saveHistory();
    renderHistory();
    showToast('History cleared');
  }

  // ── Download ───────────────────────────────────────
  function downloadHistory() {
    if (!history.length) return;

    const lines = history.map((h, i) => `${i + 1}. ${h.msg}`).join('\n');
    const header = `# Commit History\n# Generated by Commit Message Generator\n# ${new Date().toISOString()}\n\n`;
    const blob = new Blob([header + lines + '\n'], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;
    a.download = 'commit-history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('History downloaded!');
  }

  // ── Toast ──────────────────────────────────────────
  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.hidden = false;

    // Force reflow then add class
    void toast.offsetWidth;
    toast.classList.add('visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => { toast.hidden = true; }, 300);
    }, 2200);
  }

  // ── Keyboard shortcuts ─────────────────────────────
  function handleShortcuts(e) {
    // Ctrl+Enter → Generate
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      generate();
    }

    // Ctrl+Shift+C → Copy
    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      copyToClipboard();
    }

    // Ctrl+R → Random (but not browser refresh if focus is in our app)
    if (e.ctrlKey && !e.shiftKey && (e.key === 'r' || e.key === 'R') && document.activeElement.closest('.card')) {
      e.preventDefault();
      randomCommit();
    }
  }

  // ── Helpers ────────────────────────────────────────
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Boot ───────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);
})();
