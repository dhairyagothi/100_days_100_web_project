(function initSharedTheme() {
  const STORAGE_KEY = "theme";
  const THEMES = new Set(["dark", "light", "sepia", "cyberpunk", "nord"]);
  const root = document.documentElement;
  let transitionTimer = null;
  let initialized = false;

  const safeStorage = {
    get() {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (_) {
        return null;
      }
    },
    set(theme) {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (_) {
        // Private browsing and embedded contexts can block storage.
      }
    },
  };

  const normalizeTheme = (theme) => (THEMES.has(theme) ? theme : "dark");

 const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const getStoredTheme = () => {
  const saved = safeStorage.get();
  return saved ? normalizeTheme(saved) : getSystemTheme();
};
  const syncBodyClass = (theme) => {
    if (!document.body) return;
    document.body.classList.toggle("light-mode", theme === "light");
  };

  const syncToggleIcons = (theme) => {
    // Update active state in dropdown menus
    document.querySelectorAll(".theme-dropdown-container .dropdown-item").forEach(item => {
      if (item.dataset.themeValue === theme) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    const themeSymbols = {
      light: "☀",
      dark: "☾",
      sepia: "☕",
      cyberpunk: "⚡",
      nord: "❄"
    };
    const currentSymbol = themeSymbols[theme] || "◌";
    
    // Update all theme toggle button icons (both navbar and contact page)
    document.querySelectorAll("#themeToggleNav span[aria-hidden='true']").forEach((icon) => {
      icon.textContent = currentSymbol;
    });
    
    // Update ARIA labels for all theme buttons to reflect current state
    const themeLabels = {
      light: "Switch theme (currently Light)",
      dark: "Switch theme (currently Dark)",
      sepia: "Switch theme (currently Sepia)",
      cyberpunk: "Switch theme (currently Cyberpunk)",
      nord: "Switch theme (currently Nord)"
    };
    
    document.querySelectorAll("#themeToggle, #themeToggleNav").forEach((btn) => {
      btn.setAttribute("aria-label", themeLabels[theme] || "Switch theme");
    });
  };

  const applyTheme = (theme, options = {}) => {
    const nextTheme = normalizeTheme(theme);
    root.setAttribute("data-theme", nextTheme);
    root.style.colorScheme = nextTheme;
    syncBodyClass(nextTheme);
    syncToggleIcons(nextTheme);

    if (options.persist !== false) {
      safeStorage.set(nextTheme);
    }

    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: nextTheme } }));
    return nextTheme;
  };

  const withTransitionGuard = () => {
    root.setAttribute("data-theme-transitioning", "true");
    document.body?.classList.add("theme-transitioning");
    if (transitionTimer) clearTimeout(transitionTimer);
    transitionTimer = setTimeout(() => {
      root.removeAttribute("data-theme-transitioning");
      document.body?.classList.remove("theme-transitioning");
    }, 250);
  };

 const toggleTheme = () => {
    const currentTheme = normalizeTheme(root.getAttribute("data-theme"));
    const themeArray = ["light", "dark", "sepia", "cyberpunk", "nord"];
    
    const currentIndex = themeArray.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeArray.length;
    const nextTheme = themeArray[nextIndex];

    applyTheme(nextTheme);
    withTransitionGuard();
};

  const setTheme = (themeName) => {
    applyTheme(themeName);
    withTransitionGuard();
  };

  const init = () => {
    if (!root.getAttribute("data-theme")) {
      applyTheme(getStoredTheme(), { persist: false });
    } else {
      applyTheme(root.getAttribute("data-theme"), { persist: false });
    }

    if (initialized) return;
    initialized = true;

    // Ensure all theme buttons exist and are properly initialized
    const initializeThemeButtons = () => {
      const currentTheme = normalizeTheme(root.getAttribute("data-theme") || getStoredTheme());
      
      // Initialize all theme toggle buttons with proper ARIA attributes
      document.querySelectorAll("#themeToggle, #themeToggleNav").forEach((btn) => {
        if (!btn.classList.contains("dropdown-toggle")) {
          btn.setAttribute("role", "button");
          btn.setAttribute("tabindex", btn.tabIndex >= 0 ? btn.tabIndex : "0");
        }
      });
      
      // Sync all buttons to current theme state
      syncToggleIcons(currentTheme);
    };

    // Initialize on DOMContentLoaded if not already initialized
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeThemeButtons);
    } else {
      initializeThemeButtons();
    }

// Cross-tab theme sync
window.addEventListener('storage', (e) => {
  if (e.key === 'theme' && e.newValue) {
    applyTheme(e.newValue, { persist: false });
  }
});

// Respect system theme changes (only if user hasn't manually set a theme)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!safeStorage.get()) {
    applyTheme(e.matches ? 'dark' : 'light', { persist: false });
  }
});

    // Mouse click handler for theme toggle buttons and dropdown items
    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("#themeToggle, #themeToggleNav:not(.dropdown-toggle)");
      if (toggle) {
        event.preventDefault();
        event.stopPropagation();
        toggleTheme();
        return;
      }
      
      const dropdownItem = event.target.closest(".theme-dropdown-container .dropdown-item");
      if (dropdownItem) {
        event.preventDefault();
        event.stopPropagation();
        const themeValue = dropdownItem.dataset.themeValue;
        if (themeValue) {
          setTheme(themeValue);
        }
      }
    });

    // Keyboard support (Enter/Space) for accessibility
    document.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target) {
        const toggle = event.target.closest("#themeToggle, #themeToggleNav:not(.dropdown-toggle)");
        if (toggle) {
          event.preventDefault();
          event.stopPropagation();
          toggleTheme();
          toggle.focus();
          return;
        }

        const dropdownItem = event.target.closest(".theme-dropdown-container .dropdown-item");
        if (dropdownItem) {
          event.preventDefault();
          event.stopPropagation();
          const themeValue = dropdownItem.dataset.themeValue;
          if (themeValue) {
            setTheme(themeValue);
          }
        }
      }
    });

    document.addEventListener("DOMContentLoaded", () => {
      applyTheme(root.getAttribute("data-theme") || getStoredTheme(), { persist: false });
      syncToggleIcons(root.getAttribute("data-theme") || getStoredTheme());
    });
  };

  window.ThemeManager = {
    applyTheme,
    currentTheme: () => normalizeTheme(root.getAttribute("data-theme") || getStoredTheme()),
    init,
    toggleTheme,
    setTheme,
  };

  applyTheme(getStoredTheme(), { persist: false });
  init();
})();
