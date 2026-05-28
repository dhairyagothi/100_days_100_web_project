/* ========== CHARACTER SETS ========== */
const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '!@#$%^&*()-_=+[]{}|;:,.<>?'
};

const STORAGE_KEY = 'passforge_saved';

/* ========== GENERATE ========== */
function generatePassword() {
  const length = parseInt(document.getElementById('lengthSlider').value);
  const useUpper   = document.getElementById('optUppercase').checked;
  const useLower   = document.getElementById('optLowercase').checked;
  const useNumbers = document.getElementById('optNumbers').checked;
  const useSymbols = document.getElementById('optSymbols').checked;

  let pool = '';
  let guaranteed = [];

  if (useUpper)   { pool += CHARS.uppercase; guaranteed.push(randomFrom(CHARS.uppercase)); }
  if (useLower)   { pool += CHARS.lowercase; guaranteed.push(randomFrom(CHARS.lowercase)); }
  if (useNumbers) { pool += CHARS.numbers;   guaranteed.push(randomFrom(CHARS.numbers)); }
  if (useSymbols) { pool += CHARS.symbols;   guaranteed.push(randomFrom(CHARS.symbols)); }

  if (!pool) {
    showToast('Select at least one character type!', 'error');
    return;
  }

  const remaining = length - guaranteed.length;
  const arr = [...guaranteed];
  for (let i = 0; i < remaining; i++) arr.push(randomFrom(pool));

  // Shuffle using Fisher-Yates with crypto random
  for (let i = arr.length - 1; i > 0; i--) {
    const j = cryptoRandInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const pwd = arr.join('');
  document.getElementById('passwordText').textContent = pwd;

  // Flicker animation
  const display = document.getElementById('passwordDisplay');
  display.classList.remove('flash');
  void display.offsetWidth; // reflow
  display.classList.add('flash');

  updateStrength(pwd);
}

function randomFrom(str) {
  return str[cryptoRandInt(str.length)];
}

function cryptoRandInt(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

/* ========== STRENGTH ========== */
function updateStrength(pwd) {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  const bar  = document.getElementById('strengthBar');
  const text = document.getElementById('strengthText');

  bar.className = 'strength-bar';
  text.className = 'strength-text';

  if (score <= 2) {
    bar.classList.add('weak');
    text.classList.add('weak');
    text.textContent = 'Weak';
  } else if (score <= 4) {
    bar.classList.add('medium');
    text.classList.add('medium');
    text.textContent = 'Medium';
  } else {
    bar.classList.add('strong');
    text.classList.add('strong');
    text.textContent = 'Strong';
  }

  return score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
}

function getStrengthLabel(pwd) {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 20) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
}

/* ========== CLIPBOARD ========== */
function copyPassword() {
  const pwd = document.getElementById('passwordText').textContent;
  if (!pwd || pwd === 'Click Generate →') {
    showToast('Generate a password first!', 'error');
    return;
  }

  navigator.clipboard.writeText(pwd)
    .then(() => {
      const btn = document.getElementById('copyBtn');
      btn.classList.add('copied');
      showToast('✓ Copied to clipboard!', 'success');
      setTimeout(() => btn.classList.remove('copied'), 2000);
    })
    .catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = pwd;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✓ Copied to clipboard!', 'success');
    });
}

/* ========== SAVE ========== */
function savePassword() {
  const pwd   = document.getElementById('passwordText').textContent;
  const label = document.getElementById('saveLabel').value.trim();

  if (!pwd || pwd === 'Click Generate →') {
    showToast('Generate a password first!', 'error');
    return;
  }
  if (!label) {
    showToast('Please enter a label (e.g. Gmail)', 'error');
    document.getElementById('saveLabel').focus();
    return;
  }

  const saved = getSaved();
  const entry = {
    id:       Date.now(),
    label:    label,
    password: pwd,
    strength: getStrengthLabel(pwd),
    date:     new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
  };

  saved.unshift(entry);
  setSaved(saved);
  document.getElementById('saveLabel').value = '';
  showToast(`✓ Saved "${label}" successfully!`, 'success');
  renderSaved();
}

function deleteEntry(id) {
  const saved = getSaved().filter(e => e.id !== id);
  setSaved(saved);
  renderSaved();
}

function clearAll() {
  if (confirm('Delete all saved passwords? This cannot be undone.')) {
    setSaved([]);
    renderSaved();
  }
}

function copyEntry(pwd) {
  navigator.clipboard.writeText(pwd)
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = pwd;
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    });
  showToast('✓ Password copied!', 'success');
}

/* ========== STORAGE ========== */
function getSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function setSaved(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* ========== RENDER ========== */
function renderSaved() {
  const list   = document.getElementById('savedList');
  const query  = document.getElementById('searchInput').value.toLowerCase().trim();
  const danger = document.getElementById('dangerZone');
  const count  = document.getElementById('savedCount');
  let saved    = getSaved();

  count.textContent = saved.length;
  danger.style.display = saved.length ? 'block' : 'none';

  if (query) {
    saved = saved.filter(e => e.label.toLowerCase().includes(query));
  }

  if (!saved.length) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🗝️</span>
        <p>${query ? 'No results found.' : 'No passwords saved yet.'}</p>
        <small>${query ? 'Try a different search.' : 'Generate one and hit Save!'}</small>
      </div>`;
    return;
  }

  list.innerHTML = saved.map(e => `
    <div class="saved-card" id="card-${e.id}">
      <div class="card-top">
        <div style="display:flex;align-items:flex-start;gap:.35rem;">
          <span class="card-strength-dot dot-${e.strength}"></span>
          <div>
            <div class="card-label">${escapeHtml(e.label)}</div>
            <div class="card-date">${e.date}</div>
          </div>
        </div>
      </div>
      <div class="card-password" title="Hover to reveal">${escapeHtml(e.password)}</div>
      <div class="card-actions">
        <button class="card-btn" onclick="copyEntry('${escapeAttr(e.password)}')" title="Copy password">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy
        </button>
        <button class="card-btn del" onclick="deleteEntry(${e.id})" title="Delete">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

/* ========== HELPERS ========== */
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.classList.remove('show'); }, 3000);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function escapeAttr(str) {
  return String(str).replace(/'/g, '\\\'');
}

/* ========== KEYBOARD SHORTCUT ========== */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generatePassword();
});

/* ========== INIT ========== */
generatePassword();
renderSaved();