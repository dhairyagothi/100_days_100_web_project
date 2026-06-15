/**
 * ═══════════════════════════════════════════════════════════════
 * CHRONOS+ · 3-STATE THEME SYSTEM
 * States: light ↔ dark ↔ auto
 * Real-time OS preference sync in auto mode
 * ═══════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY  = 'chronos-theme';
  const STATES       = ['dark', 'light', 'auto'];

  const themeBtn      = document.getElementById('themeToggleBtn');
  const sunIcon       = document.getElementById('sunIcon');
  const moonIcon      = document.getElementById('moonIcon');
  const autoLabel     = document.getElementById('autoModeLabel');

  let currentState   = 'auto';
  let effectiveTheme = 'dark';

  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');

  // ── Resolve what to actually render ──────────────────────────
  const resolveEffective = () => {
    if (currentState === 'auto') return darkMQ.matches ? 'dark' : 'light';
    return currentState;
  };

  // ── Apply theme classes to <body> ────────────────────────────
  const applyToDom = (theme) => {
    document.body.classList.toggle('dark-theme',  theme === 'dark');
    document.body.classList.toggle('light-theme', theme === 'light');
    effectiveTheme = theme;
  };

  // ── Update button icon/label ─────────────────────────────────
  const updateUI = (state) => {
    // Hide all
    if (sunIcon)    sunIcon.style.display    = 'none';
    if (moonIcon)   moonIcon.style.display   = 'none';
    if (autoLabel)  autoLabel.style.display  = 'none';

    const ariaBase = 'Click to cycle theme (dark → light → auto)';

    switch (state) {
      case 'dark':
        // Currently dark → icon shows sun (to switch to light)
        if (sunIcon) sunIcon.style.display = 'block';
        themeBtn?.setAttribute('aria-label', `Dark mode active. ${ariaBase}`);
        break;
      case 'light':
        // Currently light → icon shows moon (to switch to dark)
        if (moonIcon) moonIcon.style.display = 'block';
        themeBtn?.setAttribute('aria-label', `Light mode active. ${ariaBase}`);
        break;
      case 'auto':
        if (autoLabel) autoLabel.style.display = 'inline';
        themeBtn?.setAttribute('aria-label', `Auto mode (follows system). ${ariaBase}`);
        break;
    }
  };

  // ── Master apply ─────────────────────────────────────────────
  const applyState = (state, skipPersist = false) => {
    if (!STATES.includes(state)) state = 'auto';
    currentState = state;
    applyToDom(resolveEffective());
    updateUI(state);
    if (!skipPersist) localStorage.setItem(STORAGE_KEY, state);
  };

  // ── OS theme change (only fires in auto mode) ────────────────
  darkMQ.addEventListener('change', (e) => {
    if (currentState !== 'auto') return;
    const next = e.matches ? 'dark' : 'light';
    if (effectiveTheme !== next) {
      applyToDom(next);
      updateUI('auto');
    }
  });

  // ── Init ─────────────────────────────────────────────────────
  const init = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    applyState(saved && STATES.includes(saved) ? saved : 'auto', true);
  };

  init();

  // ── Click handler: cycle states ──────────────────────────────
  const cycle = () => {
    const idx  = STATES.indexOf(currentState);
    const next = STATES[(idx + 1) % STATES.length];
    applyState(next);
  };

  themeBtn?.addEventListener('click', cycle);

  // ── Keyboard: T key ──────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 't') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const active = document.activeElement;
    if (active?.tagName === 'INPUT' || active?.tagName === 'TEXTAREA') return;
    e.preventDefault();
    cycle();
  });

  // ── Public API ───────────────────────────────────────────────
  window.chronosTheme = {
    getState:          () => currentState,
    getEffective:      () => effectiveTheme,
    setTheme:          (s) => applyState(s),
    isAuto:            () => currentState === 'auto',
    getSystemPref:     () => darkMQ.matches ? 'dark' : 'light',
  };
});
