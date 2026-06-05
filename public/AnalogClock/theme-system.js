/**
 * ============================================================
 * CHRONOS+ 3-STATE THEME SYSTEM (REFACTORED)
 * Light ↔ Dark ↔ Auto (System Preference) with Real-Time Sync
 * ============================================================
 * 
 * IMPROVEMENTS:
 * - Active matchMedia listener for real-time OS theme detection
 * - Conditional DOM mutations (only in 'auto' mode)
 * - No recursive loops or state conflicts
 * - Seamless integration with keyboard shortcuts
 * - Clean state management and persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // 1. CONFIGURATION & DOM REFERENCES
  // ============================================================
  const STORAGE_KEY = 'chronos-theme';
  const THEME_STATES = ['light', 'dark', 'auto'];
  
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const sunIcon = document.getElementById('sunIcon');
  const moonIcon = document.getElementById('moonIcon');
  const autoModeLabel = document.getElementById('autoModeLabel');
  
  // ============================================================
  // 2. STATE MACHINE
  // ============================================================
  let currentThemeState = 'auto'; // Current user selection
  let effectiveTheme = 'light';   // What's actually rendered (resolves 'auto')
  
  // Create a persistent matchMedia query object
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  // ============================================================
  // 3. CORE UTILITIES
  // ============================================================
  
  /**
   * Calculates the effective theme based on current state
   * If state is 'auto', resolves to actual OS preference
   * @returns {string} - 'light' or 'dark'
   */
  const resolveEffectiveTheme = () => {
    if (currentThemeState === 'auto') {
      return darkModeQuery.matches ? 'dark' : 'light';
    }
    return currentThemeState;
  };
  
  /**
   * Applies theme to the DOM (class manipulation only)
   * This is separated from state management for clarity
   * @param {string} theme - 'light' or 'dark' (effective theme)
   */
  const applyThemeToDom = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    effectiveTheme = theme;
  };
  
  /**
   * Updates UI indicators (icons and labels)
   * Reflects current user selection, not effective theme
   * @param {string} state - 'light', 'dark', or 'auto'
   */
  const updateThemeUI = (state) => {
    // Hide all indicators
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'none';
    autoModeLabel.style.display = 'none';
    
    // Show appropriate indicator based on state
    switch (state) {
      case 'light':
        moonIcon.style.display = 'block';
        themeToggleBtn.setAttribute(
          'aria-label',
          'Light mode active. Click to switch to dark mode.'
        );
        break;
        
      case 'dark':
        sunIcon.style.display = 'block';
        themeToggleBtn.setAttribute(
          'aria-label',
          'Dark mode active. Click to switch to auto mode.'
        );
        break;
        
      case 'auto':
        autoModeLabel.style.display = 'block';
        themeToggleBtn.setAttribute(
          'aria-label',
          `Auto mode (system: ${effectiveTheme}). Click to switch theme.`
        );
        break;
    }
  };
  
  /**
   * Master function: Apply theme state to app
   * Handles state change, DOM update, and persistence
   * @param {string} state - 'light', 'dark', or 'auto'
   * @param {boolean} skipPersist - Don't save to localStorage (internal use)
   */
  const applyThemeState = (state, skipPersist = false) => {
    // Validate state
    if (!THEME_STATES.includes(state)) {
      console.warn(`Invalid theme state: ${state}. Defaulting to 'auto'.`);
      state = 'auto';
    }
    
    // Update state variable
    currentThemeState = state;
    
    // Calculate and apply effective theme
    const newEffective = resolveEffectiveTheme();
    applyThemeToDom(newEffective);
    
    // Update UI indicators
    updateThemeUI(state);
    
    // Persist to localStorage (unless skipped)
    if (!skipPersist) {
      localStorage.setItem(STORAGE_KEY, state);
    }
  };
  
  // ============================================================
  // 4. DYNAMIC SYSTEM LISTENER (CRITICAL)
  // ============================================================
  
  /**
   * Handles OS theme preference changes
   * ONLY executes if currentThemeState === 'auto'
   * Prevents override when user explicitly chose 'light' or 'dark'
   * 
   * @param {MediaQueryListEvent} event - matchMedia change event
   */
  const handleSystemThemeChange = (event) => {
    // CONDITIONAL EXECUTION: Only apply if user is in 'auto' mode
    if (currentThemeState !== 'auto') {
      return; // Bypass if user manually selected light/dark
    }
    
    // Safe to apply OS preference change
    const newEffectiveTheme = event.matches ? 'dark' : 'light';
    
    // Update DOM only if theme actually changed
    if (effectiveTheme !== newEffectiveTheme) {
      applyThemeToDom(newEffectiveTheme);
      
      // Update aria-label to reflect current system state
      updateThemeUI(currentThemeState);
      
      console.log(
        `[Theme System] OS theme changed to ${newEffectiveTheme}. Applied in 'auto' mode.`
      );
    }
  };
  
  // Register the listener on darkModeQuery
  // This will trigger whenever the OS theme changes
  darkModeQuery.addEventListener('change', handleSystemThemeChange);
  
  // ============================================================
  // 5. INITIALIZATION
  // ============================================================
  
  /**
   * Initialize theme on page load
   * Restores saved preference or defaults to 'auto'
   */
  const initializeTheme = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    
    if (saved && THEME_STATES.includes(saved)) {
      applyThemeState(saved, true); // Skip persist on init
    } else {
      applyThemeState('auto', true); // Default to auto on first visit
    }
    
    console.log(`[Theme System] Initialized with state: ${currentThemeState}`);
  };
  
  // Initialize on page load
  initializeTheme();
  
  // ============================================================
  // 6. CLICK HANDLER - MANUAL THEME CYCLING
  // ============================================================
  
  /**
   * Cycles through theme states: light → dark → auto → light
   * Called on button click
   */
  const cycleThemeState = () => {
    const currentIndex = THEME_STATES.indexOf(currentThemeState);
    const nextIndex = (currentIndex + 1) % THEME_STATES.length;
    const nextState = THEME_STATES[nextIndex];
    
    applyThemeState(nextState); // Automatically persists
    
    console.log(`[Theme System] User cycled to: ${nextState}`);
  };
  
  // Attach click listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', cycleThemeState);
  }
  
  // ============================================================
  // 7. KEYBOARD SHORTCUT - 'T' KEY
  // ============================================================
  
  /**
   * Press 'T' to cycle through themes
   * Safeguards: Don't trigger if typing in input/textarea
   * Prevents recursive loops by using click delegation
   */
  document.addEventListener('keydown', (e) => {
    // Check if 'T' key was pressed alone (no modifiers)
    if (e.key.toLowerCase() === 't' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const activeElement = document.activeElement;
      
      // Don't trigger if user is typing in a form field
      if (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA'
      ) {
        return;
      }
      
      // Prevent default behavior
      e.preventDefault();
      
      // Cycle theme (uses same logic as button click)
      cycleThemeState();
    }
  });
  
  // ============================================================
  // 8. PUBLIC API (Optional - for external access)
  // ============================================================
  
  /**
   * Expose theme utilities to window for debugging/external control
   * window.chronosTheme.getState() - returns current state
   * window.chronosTheme.setTheme(state) - set theme manually
   */
  window.chronosTheme = {
    getState: () => currentThemeState,
    getEffectiveTheme: () => effectiveTheme,
    setTheme: (state) => applyThemeState(state),
    isAutoMode: () => currentThemeState === 'auto',
    getSystemPreference: () => darkModeQuery.matches ? 'dark' : 'light',
  };
  
  // ============================================================
  // 9. DEBUG LOGGING
  // ============================================================
  
  // Log initial state
  console.log('[Theme System] Initialization complete');
  console.log(`Current State: ${currentThemeState}`);
  console.log(`Effective Theme: ${effectiveTheme}`);
  console.log(`System Prefers Dark: ${darkModeQuery.matches}`);
  console.log(
    'Use window.chronosTheme to access theme utilities in console'
  );
});