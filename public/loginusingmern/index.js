<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Manager — Day 31</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d0f12;
      --surface: #161a1f;
      --surface2: #1e242b;
      --border: #2a3140;
      --accent: #00e5a0;
      --accent-dim: rgba(0,229,160,0.12);
      --danger: #ff4d6d;
      --danger-dim: rgba(255,77,109,0.12);
      --text: #e8edf2;
      --muted: #7a8899;
      --mono: 'IBM Plex Mono', monospace;
      --sans: 'IBM Plex Sans', sans-serif;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--sans);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem 4rem;
    }

    /* ── LOCK SCREEN ── */
    #lockScreen {
      width: 100%;
      max-width: 420px;
      margin-top: 6rem;
    }
    #lockScreen h1 {
      font-family: var(--mono);
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }
    #lockScreen p {
      color: var(--muted);
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }
    .lock-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
    }
    .lock-card label {
      display: block;
      font-size: 0.75rem;
      font-family: var(--mono);
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
    }
    .lock-card input[type="password"] {
      width: 100%;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 1rem;
      padding: 0.75rem 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .lock-card input[type="password"]:focus {
      border-color: var(--accent);
    }
    .hint {
      font-size: 0.75rem;
      color: var(--muted);
      margin-top: 0.5rem;
    }
    #lockError {
      font-size: 0.8rem;
      color: var(--danger);
      margin-top: 0.75rem;
      min-height: 1.2em;
    }
    .btn-primary {
      width: 100%;
      margin-top: 1.25rem;
      background: var(--accent);
      color: #0d0f12;
      border: none;
      border-radius: 8px;
      font-family: var(--mono);
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.8rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-primary:hover { opacity: 0.88; }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

    /* ── MAIN APP ── */
    #app { display: none; width: 100%; max-width: 720px; }

    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .app-title {
      font-family: var(--mono);
      font-size: 1.25rem;
      font-weight: 600;
    }
    .app-title span {
      color: var(--accent);
    }
    .header-actions { display: flex; gap: 0.5rem; }
    .btn-sm {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 0.78rem;
      padding: 0.4rem 0.75rem;
      cursor: pointer;
      transition: color 0.2s, border-color 0.2s;
    }
    .btn-sm:hover { color: var(--text); border-color: var(--muted); }
    .btn-sm.danger:hover { color: var(--danger); border-color: var(--danger); }

    /* ── ADD FORM ── */
    .add-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .add-card h2 {
      font-family: var(--mono);
      font-size: 0.85rem;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 1rem;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .form-row.full { grid-template-columns: 1fr; }
    .field { display: flex; flex-direction: column; gap: 0.35rem; }
    .field label {
      font-size: 0.72rem;
      font-family: var(--mono);
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .field input {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 0.875rem;
      padding: 0.6rem 0.75rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .field input:focus { border-color: var(--accent); }
    .pw-wrap { position: relative; }
    .pw-wrap input { width: 100%; padding-right: 2.5rem; }
    .toggle-vis {
      position: absolute;
      right: 0.6rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--muted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem;
    }
    .strength-bar {
      height: 3px;
      border-radius: 2px;
      background: var(--surface2);
      margin-top: 0.35rem;
      overflow: hidden;
    }
    .strength-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.3s, background 0.3s;
      width: 0%;
    }
    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .btn-add {
      flex: 1;
      background: var(--accent-dim);
      border: 1px solid var(--accent);
      border-radius: 8px;
      color: var(--accent);
      font-family: var(--mono);
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.65rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-add:hover { background: rgba(0,229,160,0.2); }
    .btn-gen {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 0.8rem;
      padding: 0.65rem 1rem;
      cursor: pointer;
      transition: color 0.2s;
      white-space: nowrap;
    }
    .btn-gen:hover { color: var(--text); }

    /* ── SEARCH ── */
    .search-wrap {
      position: relative;
      margin-bottom: 1rem;
    }
    .search-wrap input {
      width: 100%;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 0.875rem;
      padding: 0.65rem 1rem 0.65rem 2.5rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-wrap input:focus { border-color: var(--accent); }
    .search-icon {
      position: absolute;
      left: 0.9rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
      font-size: 0.9rem;
      pointer-events: none;
    }

    /* ── PASSWORD LIST ── */
    #entryList { display: flex; flex-direction: column; gap: 0.5rem; }
    .entry-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: border-color 0.2s;
    }
    .entry-card:hover { border-color: var(--muted); }
    .entry-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: var(--accent-dim);
      border: 1px solid rgba(0,229,160,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--mono);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--accent);
      flex-shrink: 0;
    }
    .entry-info { flex: 1; min-width: 0; }
    .entry-site {
      font-weight: 600;
      font-size: 0.9rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .entry-user {
      font-family: var(--mono);
      font-size: 0.75rem;
      color: var(--muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .entry-pw {
      font-family: var(--mono);
      font-size: 0.8rem;
      color: var(--muted);
      letter-spacing: 0.1em;
    }
    .entry-actions { display: flex; gap: 0.35rem; flex-shrink: 0; }
    .icon-btn {
      background: none;
      border: 1px solid transparent;
      border-radius: 6px;
      color: var(--muted);
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0.35rem 0.5rem;
      transition: color 0.2s, border-color 0.2s, background 0.2s;
    }
    .icon-btn:hover { color: var(--text); border-color: var(--border); background: var(--surface2); }
    .icon-btn.del:hover { color: var(--danger); border-color: var(--danger-dim); background: var(--danger-dim); }

    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--muted);
      font-family: var(--mono);
      font-size: 0.875rem;
    }
    .empty-state div { font-size: 2rem; margin-bottom: 0.75rem; opacity: 0.3; }

    /* Toast */
    #toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 0.8rem;
      padding: 0.65rem 1.1rem;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s;
    }
    #toast.show { opacity: 1; }

    /* Responsive */
    @media (max-width: 540px) {
      .form-row { grid-template-columns: 1fr; }
      .entry-pw { display: none; }
    }
  </style>
</head>
<body>

<!-- ══ LOCK SCREEN ══ -->
<div id="lockScreen">
  <h1>🔐 Vault</h1>
  <p>Your passwords are encrypted with your master key.</p>
  <div class="lock-card">
    <label for="masterInput">Master Password</label>
    <input type="password" id="masterInput" placeholder="Enter master password…" autocomplete="current-password" />
    <p class="hint" id="lockHint">First time? Set a master password to create your vault.</p>
    <div id="lockError"></div>
    <button class="btn-primary" id="unlockBtn" onclick="unlock()">Unlock Vault</button>
  </div>
</div>

<!-- ══ MAIN APP ══ -->
<div id="app">
  <div class="app-header">
    <div class="app-title">Vault <span>·</span> <span id="entryCount">0</span> entries</div>
    <div class="header-actions">
      <button class="btn-sm danger" onclick="lockVault()">🔒 Lock</button>
      <button class="btn-sm danger" onclick="clearVault()">⚠ Clear All</button>
    </div>
  </div>

  <!-- Add Form -->
  <div class="add-card">
    <h2>Add Entry</h2>
    <div class="form-row">
      <div class="field">
        <label for="fSite">Website / App</label>
        <input type="text" id="fSite" placeholder="github.com" autocomplete="off" />
      </div>
      <div class="field">
        <label for="fUser">Username / Email</label>
        <input type="text" id="fUser" placeholder="you@email.com" autocomplete="off" />
      </div>
    </div>
    <div class="form-row full">
      <div class="field">
        <label for="fPass">Password</label>
        <div class="pw-wrap">
          <input type="password" id="fPass" placeholder="••••••••" autocomplete="new-password" oninput="updateStrength(this.value)" />
          <button class="toggle-vis" onclick="toggleVis('fPass', this)" type="button" title="Show/hide">👁</button>
        </div>
        <div class="strength-bar"><div class="strength-fill" id="strengthFill"></div></div>
      </div>
    </div>
    <div class="form-actions">
      <button class="btn-gen" onclick="generatePassword()">⚙ Generate</button>
      <button class="btn-add" onclick="addEntry()">+ Save Entry</button>
    </div>
  </div>

  <!-- Search -->
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input type="text" id="searchInput" placeholder="Search by site or username…" oninput="renderList()" />
  </div>

  <!-- List -->
  <div id="entryList"></div>
</div>

<div id="toast"></div>

<script>
/* ════════════════════════════════════════════════════════
   CRYPTO HELPERS  — Web Crypto API (AES-GCM + PBKDF2)
   All encryption/decryption happens in the browser.
   localStorage only ever holds ciphertext.
════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'vault_enc_v1';
const SALT_KEY    = 'vault_salt_v1';

let derivedKey = null;   // CryptoKey — held only in memory, gone on lock/refresh
let entries    = [];     // decrypted working copy

/* --- Key derivation ---------------------------------------------------- */
async function deriveKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 250_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/* --- Encrypt a JS value to a base64 string ----------------------------- */
async function encrypt(data, key) {
  const iv  = crypto.getRandomValues(new Uint8Array(12));
  const enc = new TextEncoder();
  const ct  = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(JSON.stringify(data))
  );
  // Store iv + ciphertext together, base64-encoded
  const combined = new Uint8Array(iv.byteLength + ct.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ct), iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

/* --- Decrypt a base64 string back to a JS value ------------------------ */
async function decrypt(b64, key) {
  const combined = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ct = combined.slice(12);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  return JSON.parse(new TextDecoder().decode(pt));
}

/* --- Persist entries to localStorage (encrypted) ----------------------- */
async function saveVault() {
  const b64 = await encrypt(entries, derivedKey);
  localStorage.setItem(STORAGE_KEY, b64);
}

/* ════════════════════════════════════════════════════════
   LOCK / UNLOCK
════════════════════════════════════════════════════════ */
async function unlock() {
  const btn = document.getElementById('unlockBtn');
  const pw  = document.getElementById('masterInput').value.trim();
  const err = document.getElementById('lockError');
  err.textContent = '';

  if (!pw) { err.textContent = 'Please enter your master password.'; return; }
  if (pw.length < 8) { err.textContent = 'Master password must be at least 8 characters.'; return; }

  btn.disabled = true;
  btn.textContent = 'Unlocking…';

  try {
    // Get or create salt (random, stored plaintext — that's fine, it's not secret)
    let saltB64 = localStorage.getItem(SALT_KEY);
    let salt;
    if (saltB64) {
      salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0));
    } else {
      salt    = crypto.getRandomValues(new Uint8Array(16));
      saltB64 = btoa(String.fromCharCode(...salt));
      localStorage.setItem(SALT_KEY, saltB64);
    }

    derivedKey = await deriveKey(pw, salt);

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        entries = await decrypt(stored, derivedKey);
      } catch {
        // Wrong password — decryption failed
        err.textContent = 'Wrong master password. Try again.';
        derivedKey = null;
        btn.disabled = false;
        btn.textContent = 'Unlock Vault';
        return;
      }
    } else {
      entries = [];  // brand new vault
    }

    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    renderList();
  } catch (e) {
    err.textContent = 'Unexpected error: ' + e.message;
    derivedKey = null;
  }

  btn.disabled = false;
  btn.textContent = 'Unlock Vault';
}

function lockVault() {
  derivedKey = null;
  entries    = [];
  document.getElementById('masterInput').value = '';
  document.getElementById('lockError').textContent = '';
  document.getElementById('app').style.display = 'none';
  document.getElementById('lockScreen').style.display = 'block';
}

function clearVault() {
  if (!confirm('Delete ALL saved passwords permanently? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SALT_KEY);
  entries = [];
  lockVault();
  toast('Vault cleared.');
}

/* ════════════════════════════════════════════════════════
   ENTRIES
════════════════════════════════════════════════════════ */
async function addEntry() {
  const site = document.getElementById('fSite').value.trim();
  const user = document.getElementById('fUser').value.trim();
  const pass = document.getElementById('fPass').value;

  if (!site || !user || !pass) { toast('Fill in all three fields.'); return; }

  entries.push({ id: Date.now(), site, user, pass });
  await saveVault();
  renderList();

  document.getElementById('fSite').value = '';
  document.getElementById('fUser').value = '';
  document.getElementById('fPass').value = '';
  document.getElementById('strengthFill').style.width = '0%';

  toast('Entry saved & encrypted.');
}

async function deleteEntry(id) {
  if (!confirm('Remove this entry?')) return;
  entries = entries.filter(e => e.id !== id);
  await saveVault();
  renderList();
  toast('Entry deleted.');
}

function copyPassword(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  navigator.clipboard.writeText(entry.pass).then(() => toast('Password copied!'));
}

/* ════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════ */
function renderList() {
  const q    = (document.getElementById('searchInput').value || '').toLowerCase();
  const list = document.getElementById('entryList');
  const filtered = entries.filter(e =>
    e.site.toLowerCase().includes(q) || e.user.toLowerCase().includes(q)
  );

  document.getElementById('entryCount').textContent = entries.length;

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><div>🔑</div>${q ? 'No matches found.' : 'No entries yet — add one above.'}</div>`;
    return;
  }

  list.innerHTML = filtered.map(e => `
    <div class="entry-card">
      <div class="entry-icon">${e.site.charAt(0).toUpperCase()}</div>
      <div class="entry-info">
        <div class="entry-site">${esc(e.site)}</div>
        <div class="entry-user">${esc(e.user)}</div>
      </div>
      <div class="entry-pw">••••••••</div>
      <div class="entry-actions">
        <button class="icon-btn" onclick="copyPassword(${e.id})" title="Copy password">📋</button>
        <button class="icon-btn del" onclick="deleteEntry(${e.id})" title="Delete">🗑</button>
      </div>
    </div>
  `).join('');
}

/* ════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════ */
function esc(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function toggleVis(id, btn) {
  const inp = document.getElementById(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = '🙈'; }
  else { inp.type = 'password'; btn.textContent = '👁'; }
}

function updateStrength(pw) {
  const fill = document.getElementById('strengthFill');
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 14) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const pct   = (score / 5) * 100;
  const color = score <= 1 ? '#ff4d6d' : score <= 3 ? '#ffb347' : '#00e5a0';
  fill.style.width      = pct + '%';
  fill.style.background = color;
}

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}';
  const arr   = new Uint32Array(20);
  crypto.getRandomValues(arr);
  const pw = Array.from(arr).map(n => chars[n % chars.length]).join('');
  document.getElementById('fPass').value = pw;
  document.getElementById('fPass').type  = 'text';
  updateStrength(pw);
}

let toastTimer;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

/* Allow Enter key on lock screen */
document.getElementById('masterInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') unlock();
});

/* First-visit hint */
if (!localStorage.getItem(SALT_KEY)) {
  document.getElementById('lockHint').textContent = 'First time? Choose a strong master password — it cannot be recovered.';
}
</script>
</body>
</html>
