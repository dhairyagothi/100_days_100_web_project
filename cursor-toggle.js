/**
 * cursor-toggle.js
 * Adds a toggle button to switch between the site's custom cursor
 * and the default browser cursor. Persists preference in localStorage.
 *
 * Usage: <script src="cursor-toggle.js"></script>
 * Place at the bottom of <body>, after your existing cursor script.
 */

(function () {
  const STORAGE_KEY = 'cursorPreference';
  const CUSTOM_CLASS = 'custom-cursor-active';   // class your existing cursor JS adds to <body>
  const DEFAULT_CLASS = 'default-cursor-active';

  // --- Restore preference on load ---
  const saved = localStorage.getItem(STORAGE_KEY) || 'custom';
  applyMode(saved);

  // --- Inject toggle button ---
  const btn = document.createElement('button');
  btn.id = 'cursor-toggle-btn';
  btn.setAttribute('aria-label', 'Toggle cursor style');
  btn.setAttribute('title', 'Switch cursor');
  btn.innerHTML = getCurrent() === 'custom' ? 'Default cursor' : 'Custom cursor';

  const style = document.createElement('style');
  style.textContent = `
    #cursor-toggle-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      padding: 8px 14px;
      font-size: 13px;
      font-family: inherit;
      background: rgba(0, 0, 0, 0.75);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 999px;
      cursor: default !important;
      backdrop-filter: blur(8px);
      transition: background 0.2s, transform 0.1s;
      user-select: none;
    }
    #cursor-toggle-btn:hover {
      background: rgba(0, 0, 0, 0.9);
    }
    #cursor-toggle-btn:active {
      transform: scale(0.96);
    }
    body.default-cursor-active,
    body.default-cursor-active * {
      cursor: default !important;
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    const next = getCurrent() === 'custom' ? 'default' : 'custom';
    applyMode(next);
    localStorage.setItem(STORAGE_KEY, next);
    btn.innerHTML = next === 'custom' ? 'Default cursor' : 'Custom cursor';
  });

  function getCurrent() {
    return localStorage.getItem(STORAGE_KEY) || 'custom';
  }

  function applyMode(mode) {
    if (mode === 'default') {
      document.body.classList.add(DEFAULT_CLASS);
      document.body.classList.remove(CUSTOM_CLASS);
      // Hide the custom cursor element if it exists
      const cursorEl = document.querySelector('.cursor, #cursor, [data-cursor]');
      if (cursorEl) cursorEl.style.display = 'none';
    } else {
      document.body.classList.remove(DEFAULT_CLASS);
      document.body.classList.add(CUSTOM_CLASS);
      const cursorEl = document.querySelector('.cursor, #cursor, [data-cursor]');
      if (cursorEl) cursorEl.style.display = '';
    }
  }
})();