/**
 * =========================================================
 * VAULT PASSWORD MANAGER — COMPLETE SCRIPT.JS
 * Modern UI + Theme Toggle + Vault Features
 * =========================================================
 */

"use strict";

/* =========================================================
   STATE
========================================================= */

let masterPassword = null;
let entries = [];
let pwVisible = false;

const STORAGE_KEY = "vault_entries_v2";
const THEME_KEY = "vault_theme";

/* =========================================================
   DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeGate();
  updateClock();
  setInterval(updateClock, 1000);

  const passwordInput = document.getElementById("password");

  if (passwordInput) {
    passwordInput.addEventListener("input", (e) => {
      onPasswordInput(e.target.value);
    });
  }

  renderList();
  updateStats();
});

/* =========================================================
   THEME TOGGLE
========================================================= */

function initializeTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    updateThemeIcon(true);
  } else {
    document.body.classList.remove("light-mode");
    updateThemeIcon(false);
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");

  localStorage.setItem(
    THEME_KEY,
    isLight ? "light" : "dark"
  );

  updateThemeIcon(isLight);
}

function updateThemeIcon(isLight) {
  const btn = document.getElementById("themeToggle");

  if (!btn) return;

  btn.innerHTML = isLight
    ? "🌙 Dark"
    : "☀️ Light";
}

/* =========================================================
   CLOCK
========================================================= */

function updateClock() {
  const clock = document.getElementById("liveClock");

  if (!clock) return;

  const now = new Date();

  clock.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* =========================================================
   GATE
========================================================= */

function initializeGate() {
  const stored = getStoredEntries();

  const gateSub = document.getElementById("gate-sub");
  const gateHint = document.getElementById("gate-hint");

  if (stored.length === 0) {
    gateSub.textContent =
      "Create a master password to secure your vault.";

    gateHint.textContent =
      "Your master password is never stored.";
  } else {
    gateSub.textContent =
      "Enter your master password to unlock.";

    gateHint.textContent =
      `${stored.length} encrypted entr${
        stored.length === 1 ? "y" : "ies"
      } stored securely.`;
  }

  document
    .getElementById("master-input")
    .addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        unlockVault();
      }
    });
}

async function unlockVault() {
  const input = document
    .getElementById("master-input")
    .value.trim();

  const errEl = document.getElementById("gate-error");

  errEl.textContent = "";

  if (!input || input.length < 6) {
    errEl.textContent =
      "Master password must be at least 6 characters.";
    return;
  }

  const stored = getStoredEntries();

  if (stored.length === 0) {
    masterPassword = input;
    entries = [];
    showApp();
    return;
  }

  try {
    await decryptEntry(stored[0], input);

    masterPassword = input;

    entries = await decryptAll(stored, input);

    showApp();
  } catch {
    errEl.textContent =
      "Incorrect master password.";
  }
}

function showApp() {
  document
    .getElementById("gate-overlay")
    .classList.add("hidden");

  document
    .getElementById("app")
    .classList.remove("hidden");

  renderList();
  updateStats();
}

function lockVault() {
  masterPassword = null;
  entries = [];

  document
    .getElementById("app")
    .classList.add("hidden");

  document
    .getElementById("gate-overlay")
    .classList.remove("hidden");

  document.getElementById("master-input").value = "";
}

/* =========================================================
   CRYPTO
========================================================= */

async function deriveKey(password, salt) {
  const enc = new TextEncoder();

  const keyMaterial =
    await crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptText(text, password) {
  const salt = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const iv = crypto.getRandomValues(
    new Uint8Array(12)
  );

  const key = await deriveKey(password, salt);

  const encoded = new TextEncoder().encode(text);

  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );

  const combined = new Uint8Array(
    16 + 12 + cipher.byteLength
  );

  combined.set(salt, 0);
  combined.set(iv, 16);
  combined.set(new Uint8Array(cipher), 28);

  return btoa(
    String.fromCharCode(...combined)
  );
}

async function decryptText(blob, password) {
  const bytes = Uint8Array.from(
    atob(blob),
    (c) => c.charCodeAt(0)
  );

  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const cipher = bytes.slice(28);

  const key = await deriveKey(password, salt);

  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    cipher
  );

  return new TextDecoder().decode(plain);
}

/* =========================================================
   STORAGE
========================================================= */

function getStoredEntries() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || []
    );
  } catch {
    return [];
  }
}

function persistEntries() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(entries)
  );
}

/* =========================================================
   ENTRY CRUD
========================================================= */

async function addEntry() {
  const site = document
    .getElementById("site")
    .value.trim();

  const username = document
    .getElementById("username")
    .value.trim();

  const password =
    document.getElementById("password").value;

  const category =
    document.getElementById("category")
      ?.value || "Personal";

  const favorite =
    document.getElementById("favorite")
      ?.checked || false;

  const errEl =
    document.getElementById("form-error");

  errEl.classList.add("hidden");

  if (!site || !username || !password) {
    errEl.textContent =
      "Please fill all required fields.";

    errEl.classList.remove("hidden");

    return;
  }

  try {
    const encryptedPassword =
      await encryptText(
        password,
        masterPassword
      );

    const entry = {
      id: Date.now(),
      site,
      username,
      encryptedPassword,
      category,
      favorite,
      createdAt: new Date().toISOString(),
    };

    entries.unshift(entry);

    persistEntries();

    clearForm();

    renderList();

    updateStats();
  } catch (e) {
    errEl.textContent =
      "Failed to encrypt entry.";

    errEl.classList.remove("hidden");
  }
}

function clearForm() {
  document.getElementById("site").value = "";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";

  const fav =
    document.getElementById("favorite");

  if (fav) fav.checked = false;

  resetStrength();
}

function deleteEntry(id) {
  const confirmDelete = confirm(
    "Delete this entry?"
  );

  if (!confirmDelete) return;

  entries = entries.filter(
    (e) => e.id !== id
  );

  persistEntries();

  renderList();

  updateStats();
}

async function revealPassword(id) {
  const entry = entries.find(
    (e) => e.id === id
  );

  if (!entry) return;

  const pwEl = document.querySelector(
    `[data-pw="${id}"]`
  );

  const btn = document.querySelector(
    `[data-reveal="${id}"]`
  );

  if (
    pwEl.dataset.revealed === "true"
  ) {
    pwEl.textContent = "••••••••";
    pwEl.dataset.revealed = "false";

    btn.textContent = "Show";

    return;
  }

  const pw = await decryptText(
    entry.encryptedPassword,
    masterPassword
  );

  pwEl.textContent = pw;

  pwEl.dataset.revealed = "true";

  btn.textContent = "Hide";
}

async function copyPassword(id) {
  const entry = entries.find(
    (e) => e.id === id
  );

  if (!entry) return;

  const pw = await decryptText(
    entry.encryptedPassword,
    masterPassword
  );

  await navigator.clipboard.writeText(pw);

  const btn = document.querySelector(
    `[data-copy="${id}"]`
  );

  if (btn) {
    btn.textContent = "Copied!";

    setTimeout(() => {
      btn.textContent = "Copy";
    }, 1500);
  }
}

/* =========================================================
   RENDER LIST
========================================================= */

function renderList() {
  const list =
    document.getElementById("entry-list");

  if (!list) return;

  const search =
    document
      .getElementById("search")
      ?.value.toLowerCase() || "";

  const filtered = entries.filter(
    (entry) =>
      entry.site
        .toLowerCase()
        .includes(search) ||
      entry.username
        .toLowerCase()
        .includes(search)
  );

  const badge =
    document.getElementById("count-badge");

  if (badge) {
    badge.textContent = entries.length;
  }

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        No matching entries found.
      </div>
    `;
    return;
  }

  list.innerHTML = filtered
    .map(
      (entry) => `
      <div class="entry-card">

        <div class="entry-left">

          <div class="entry-icon">
            🔐
          </div>

          <div class="entry-info">
            <h3>${escapeHtml(
              entry.site
            )}</h3>

            <p>${escapeHtml(
              entry.username
            )}</p>

            <span class="entry-category">
              ${entry.category}
            </span>
          </div>

        </div>

        <div class="entry-center">
          <span
            class="entry-password"
            data-pw="${entry.id}"
            data-revealed="false"
          >
            ••••••••
          </span>
        </div>

        <div class="entry-actions">

          <button
            class="action-btn"
            data-reveal="${entry.id}"
            onclick="revealPassword(${entry.id})"
          >
            Show
          </button>

          <button
            class="action-btn"
            data-copy="${entry.id}"
            onclick="copyPassword(${entry.id})"
          >
            Copy
          </button>

          <button
            class="action-btn danger"
            onclick="deleteEntry(${entry.id})"
          >
            Delete
          </button>

        </div>

      </div>
    `
    )
    .join("");
}

/* =========================================================
   STATS
========================================================= */

function updateStats() {
  const total =
    document.getElementById("totalEntries");

  const weak =
    document.getElementById("weakPasswords");

  const reused =
    document.getElementById("reusedPasswords");

  const security =
    document.getElementById("securityScore");

  if (total) {
    total.textContent = entries.length;
  }

  let weakCount = 0;

  entries.forEach((entry) => {
    if (
      entry.encryptedPassword.length < 50
    ) {
      weakCount++;
    }
  });

  if (weak) {
    weak.textContent = weakCount;
  }

  if (reused) {
    reused.textContent = "0";
  }

  const score = Math.max(
    60,
    100 - weakCount * 10
  );

  if (security) {
    security.textContent = `${score}%`;
  }
}

/* =========================================================
   PASSWORD STRENGTH
========================================================= */

const STRENGTH_LABELS = [
  "Very Weak",
  "Weak",
  "Fair",
  "Strong",
  "Very Strong",
];

const STRENGTH_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#4ade80",
];

function getStrength(password) {
  if (!password) return -1;

  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password))
    score++;

  return Math.min(score, 4);
}

function onPasswordInput(value) {
  updateStrengthUI(
    getStrength(value)
  );
}

function updateStrengthUI(level) {
  const label =
    document.getElementById(
      "strength-label"
    );

  if (level < 0) {
    resetStrength();
    return;
  }

  for (let i = 0; i < 5; i++) {
    const seg =
      document.getElementById(`s${i}`);

    if (seg) {
      seg.style.background =
        i <= level
          ? STRENGTH_COLORS[level]
          : "rgba(255,255,255,0.08)";
    }
  }

  if (label) {
    label.textContent =
      STRENGTH_LABELS[level];

    label.style.color =
      STRENGTH_COLORS[level];
  }
}

function resetStrength() {
  for (let i = 0; i < 5; i++) {
    const seg =
      document.getElementById(`s${i}`);

    if (seg) {
      seg.style.background =
        "rgba(255,255,255,0.08)";
    }
  }

  const label =
    document.getElementById(
      "strength-label"
    );

  if (label) {
    label.textContent = "—";
    label.style.color =
      "var(--text-muted)";
  }
}

/* =========================================================
   PASSWORD GENERATOR
========================================================= */

function generatePassword() {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

  const arr =
    crypto.getRandomValues(
      new Uint8Array(20)
    );

  const password = Array.from(
    arr,
    (x) => chars[x % chars.length]
  ).join("");

  const input =
    document.getElementById("password");

  input.value = password;

  onPasswordInput(password);
}

/* =========================================================
   TOGGLE PASSWORD
========================================================= */

function togglePwVisibility() {
  const input =
    document.getElementById("password");

  pwVisible = !pwVisible;

  input.type = pwVisible
    ? "text"
    : "password";
}

/* =========================================================
   EXPORT DATA
========================================================= */

function exportVault() {
  const blob = new Blob(
    [
      JSON.stringify(
        getStoredEntries(),
        null,
        2
      ),
    ],
    {
      type: "application/json",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "vault-backup.json";

  a.click();

  URL.revokeObjectURL(url);
}

/* =========================================================
   HELPERS
========================================================= */

async function decryptEntry(
  entry,
  password
) {
  await decryptText(
    entry.encryptedPassword,
    password
  );

  return entry;
}

async function decryptAll(
  stored,
  password
) {
  const result = [];

  for (const entry of stored) {
    await decryptText(
      entry.encryptedPassword,
      password
    );

    result.push(entry);
  }

  return result;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}