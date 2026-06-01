/**
 * Password Manager — script.js
 * 
 * Security features implemented:
 *  1. AES-256-GCM encryption via native Web Crypto API (zero dependencies)
 *  2. PBKDF2 key derivation (100,000 iterations, SHA-256) from master password
 *  3. Real-time password strength meter (entropy-based, 5 levels)
 *  4. HaveIBeenPwned breach check using k-Anonymity (only 5-char SHA-1 prefix sent)
 *  5. Master password never stored — re-derived on every operation
 *  6. Each entry encrypted independently with unique salt + IV
 */

'use strict';

// ── State ─────────────────────────────────────────────────────────────────
let masterPassword = null;   // held in memory only; cleared on lock
let entries        = [];     // decrypted entries array (in-memory only)
let pwVisible      = false;

const STORAGE_KEY = 'vault_entries_v2';   // v2 = encrypted format

// ── Gate Logic ────────────────────────────────────────────────────────────

/**
 * Called when user submits the master password gate.
 * If vault is empty → set new master password.
 * If vault has data → attempt to decrypt the first entry to verify.
 */
async function unlockVault() {
  const input = document.getElementById('master-input').value.trim();
  const errEl = document.getElementById('gate-error');
  errEl.textContent = '';

  if (!input || input.length < 6) {
    errEl.textContent = 'Master password must be at least 6 characters.';
    return;
  }

  const stored = getStoredEntries();

  if (stored.length === 0) {
    // First-time setup — any password is accepted
    masterPassword = input;
    entries        = [];
    showApp();
    document.getElementById('gate-hint').textContent = '';
    return;
  }

  // Verify by trying to decrypt the first stored entry
  try {
    await decryptEntry(stored[0], input);   // throws if wrong key
    masterPassword = input;
    entries = await decryptAll(stored, input);
    showApp();
  } catch {
    errEl.textContent = 'Wrong master password. Try again.';
    document.getElementById('master-input').value = '';
    document.getElementById('master-input').focus();
  }
}

function lockVault() {
  masterPassword = null;
  entries        = [];
  document.getElementById('master-input').value = '';
  document.getElementById('gate-error').textContent = '';
  document.getElementById('app').classList.add('hidden');
  document.getElementById('gate-overlay').classList.remove('hidden');
}

function showApp() {
  document.getElementById('gate-overlay').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
  renderList();
}

// Allow Enter key on gate input
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('master-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') unlockVault();
  });

  const stored = getStoredEntries();
  if (stored.length === 0) {
    document.getElementById('gate-sub').textContent  = 'Set a master password to create your vault.';
    document.getElementById('gate-hint').textContent = 'This password encrypts all your data. Don\'t forget it.';
  } else {
    document.getElementById('gate-sub').textContent  = 'Enter your master password to unlock the vault.';
    document.getElementById('gate-hint').textContent = `${stored.length} encrypted entr${stored.length === 1 ? 'y' : 'ies'} stored.`;
  }
});

// ── Crypto Helpers ────────────────────────────────────────────────────────

/**
 * Derive AES-256-GCM key from master password + salt using PBKDF2.
 * @param {string}     password
 * @param {Uint8Array} salt      — 16 random bytes
 */
async function deriveKey(password, salt) {
  const enc         = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt a plaintext string.
 * Returns a base64 blob: [16-byte salt][12-byte IV][ciphertext]
 */
async function encryptText(plaintext, password) {
  const salt       = crypto.getRandomValues(new Uint8Array(16));
  const iv         = crypto.getRandomValues(new Uint8Array(12));
  const key        = await deriveKey(password, salt);
  const encoded    = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  // Pack: salt(16) + iv(12) + ciphertext
  const combined = new Uint8Array(16 + 12 + ciphertext.byteLength);
  combined.set(salt,                    0);
  combined.set(iv,                     16);
  combined.set(new Uint8Array(ciphertext), 28);

  // Base64 encode
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a base64 blob produced by encryptText.
 * Throws DOMException if password is wrong (authentication tag mismatch).
 */
async function decryptText(blob, password) {
  const combined = Uint8Array.from(atob(blob), c => c.charCodeAt(0));
  const salt       = combined.slice(0,  16);
  const iv         = combined.slice(16, 28);
  const ciphertext = combined.slice(28);

  const key       = await deriveKey(password, salt);
  const plainBuf  = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
  return new TextDecoder().decode(plainBuf);
}

// ── Entry CRUD ────────────────────────────────────────────────────────────

/**
 * Each stored entry = { site, username, encryptedPassword }
 * Only `encryptedPassword` is a crypto blob; site/username stored as-is.
 * (Encrypt site+username too if higher privacy needed — easy extension.)
 */

async function addEntry() {
  const site     = document.getElementById('site').value.trim();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errEl    = document.getElementById('form-error');

  errEl.textContent = '';
  errEl.classList.add('hidden');

  if (!site || !username || !password) {
    errEl.textContent = 'All three fields are required.';
    errEl.classList.remove('hidden');
    return;
  }

  try {
    const encryptedPassword = await encryptText(password, masterPassword);

    const entry = { id: Date.now(), site, username, encryptedPassword };
    entries.push(entry);
    persistEntries();

    // Reset form
    document.getElementById('site').value     = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    resetStrength();
    document.getElementById('breach-warn').classList.add('hidden');

    renderList();
  } catch (e) {
    errEl.textContent = 'Encryption failed: ' + e.message;
    errEl.classList.remove('hidden');
  }
}

function deleteEntry(id) {
  entries = entries.filter(e => e.id !== id);
  persistEntries();
  renderList();
}

async function copyPassword(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  try {
    const pw = await decryptText(entry.encryptedPassword, masterPassword);
    await navigator.clipboard.writeText(pw);
    // Brief visual feedback
    const btn = document.querySelector(`[data-copy="${id}"]`);
    if (btn) { btn.textContent = 'Copied!'; setTimeout(() => { btn.textContent = 'Copy'; }, 1500); }
  } catch {
    alert('Failed to copy password.');
  }
}

async function revealPassword(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  const pwEl = document.querySelector(`[data-pw="${id}"]`);
  if (!pwEl) return;

  if (pwEl.dataset.revealed === 'true') {
    pwEl.textContent     = '••••••••';
    pwEl.dataset.revealed = 'false';
    const btn = document.querySelector(`[data-reveal="${id}"]`);
    if (btn) btn.textContent = 'Show';
    return;
  }

  try {
    const pw = await decryptText(entry.encryptedPassword, masterPassword);
    pwEl.textContent     = pw;
    pwEl.dataset.revealed = 'true';
    const btn = document.querySelector(`[data-reveal="${id}"]`);
    if (btn) btn.textContent = 'Hide';
  } catch {
    alert('Decryption failed.');
  }
}

// ── Storage ───────────────────────────────────────────────────────────────

function getStoredEntries() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function persistEntries() {
  // Save the in-memory entries array directly — passwords are already
  // stored as encrypted blobs; site/username are metadata only.
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** Decrypt a single entry object — used to verify master password. */
async function decryptEntry(entry, password) {
  await decryptText(entry.encryptedPassword, password);
  return entry;
}

/** Decrypt all stored entries — called on unlock. */
async function decryptAll(stored, password) {
  const result = [];
  for (const e of stored) {
    // Carry all fields as-is; we don't need to decrypt to display site/user
    await decryptText(e.encryptedPassword, password); // validate
    result.push(e);
  }
  return result;
}

// ── Render ────────────────────────────────────────────────────────────────

function renderList() {
  const query   = (document.getElementById('search')?.value || '').toLowerCase();
  const listEl  = document.getElementById('entry-list');
  const badgeEl = document.getElementById('count-badge');

  const filtered = entries.filter(e =>
    e.site.toLowerCase().includes(query) ||
    e.username.toLowerCase().includes(query)
  );

  badgeEl.textContent = entries.length;

  if (filtered.length === 0) {
    listEl.innerHTML = `<p class="empty-state">${
      entries.length === 0
        ? 'No entries yet. Add one above.'
        : 'No entries match your search.'
    }</p>`;
    return;
  }

  listEl.innerHTML = filtered.map(e => `
    <div class="entry-card">
      <div class="entry-info">
        <div class="entry-site">${escapeHtml(e.site)}</div>
        <div class="entry-user">${escapeHtml(e.username)}</div>
      </div>
      <div class="entry-pw-wrap">
        <span class="entry-pw" data-pw="${e.id}" data-revealed="false">••••••••</span>
      </div>
      <div class="entry-actions">
        <button class="entry-btn" data-reveal="${e.id}" onclick="revealPassword(${e.id})">Show</button>
        <button class="entry-btn copy" data-copy="${e.id}" onclick="copyPassword(${e.id})">Copy</button>
        <button class="entry-btn del" onclick="deleteEntry(${e.id})">Del</button>
      </div>
    </div>
  `).join('');
}

// ── Strength Meter ────────────────────────────────────────────────────────

const STRENGTH_LABELS  = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const STRENGTH_COLORS  = ['#f04a4a', '#f07a4a', '#f0c44a', '#7acf55', '#4af0a0'];

function getStrength(pw) {
  if (!pw) return -1;
  let score = 0;
  if (pw.length >= 8)                              score++;
  if (pw.length >= 12)                             score++;
  if (/[A-Z]/.test(pw))                           score++;
  if (/[a-z]/.test(pw))                           score++;
  if (/[0-9]/.test(pw))                           score++;
  if (/[^A-Za-z0-9]/.test(pw))                    score++;
  if (/(.)\1{2,}/.test(pw))                        score--;   // repeated chars
  if (/^(123|abc|password|qwerty|letmein)/i.test(pw)) score -= 2;
  return Math.min(Math.max(score, 0), 4);
}

function updateStrengthUI(level) {
  const wrap  = document.getElementById('strength-wrap');
  const label = document.getElementById('strength-label');

  if (level < 0) { resetStrength(); return; }

  // Color segments up to `level`
  for (let i = 0; i < 5; i++) {
    const seg = document.getElementById(`s${i}`);
    seg.style.background = i <= level ? STRENGTH_COLORS[level] : 'var(--border2)';
  }

  label.textContent = STRENGTH_LABELS[level];
  label.style.color = STRENGTH_COLORS[level];
  wrap.style.opacity = '1';
}

function resetStrength() {
  for (let i = 0; i < 5; i++) {
    document.getElementById(`s${i}`).style.background = 'var(--border2)';
  }
  const label = document.getElementById('strength-label');
  label.textContent = '—';
  label.style.color = 'var(--text-dim)';
}

// ── Breach Check (HaveIBeenPwned k-Anonymity) ─────────────────────────────

/**
 * Sends only the first 5 chars of SHA-1(password) to HIBP.
 * The full hash never leaves the browser.
 */
async function checkBreached(password) {
  if (!password) return false;
  try {
    const msgBuf   = new TextEncoder().encode(password);
    const hashBuf  = await crypto.subtle.digest('SHA-1', msgBuf);
    const hashHex  = Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    const res  = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' }   // prevents traffic-analysis side-channel
    });
    const text = await res.text();

    const match = text.split('\n').find(line => line.startsWith(suffix));
    if (match) {
      const count = parseInt(match.split(':')[1].trim(), 10);
      return count;   // number of times seen in breaches
    }
    return 0;
  } catch {
    return 0; // network error — don't block user
  }
}

// ── Input Handler (strength + breach) ────────────────────────────────────

let breachTimer = null;

async function onPasswordInput(value) {
  updateStrengthUI(getStrength(value));

  // Hide breach warning while typing
  document.getElementById('breach-warn').classList.add('hidden');

  // Debounce breach check — 800ms after user stops typing
  clearTimeout(breachTimer);
  if (value.length < 4) return;

  breachTimer = setTimeout(async () => {
    const count = await checkBreached(value);
    const warnEl = document.getElementById('breach-warn');
    const msgEl  = document.getElementById('breach-msg');
    if (count > 0) {
      msgEl.textContent = `This password appeared ${count.toLocaleString()} time${count > 1 ? 's' : ''} in known data breaches. Use a different one.`;
      warnEl.classList.remove('hidden');
    } else {
      warnEl.classList.add('hidden');
    }
  }, 800);
}

// ── Password Generator ────────────────────────────────────────────────────

function generatePassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}';
  const arr     = crypto.getRandomValues(new Uint8Array(20));
  const pw      = Array.from(arr, b => charset[b % charset.length]).join('');
  const input   = document.getElementById('password');
  input.value   = pw;
  onPasswordInput(pw);
}

// ── Toggle Password Visibility ────────────────────────────────────────────

function togglePwVisibility() {
  const input = document.getElementById('password');
  pwVisible   = !pwVisible;
  input.type  = pwVisible ? 'text' : 'password';
}

// ── Utility ───────────────────────────────────────────────────────────────

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}