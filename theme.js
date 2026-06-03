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

  const getStoredTheme = () => normalizeTheme(safeStorage.get());

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
    document.querySelectorAll("#themeToggleNav span[aria-hidden='true']").forEach((icon) => {
      icon.textContent = currentSymbol;
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
    const nextTheme = currentTheme === "light" ? "dark" : "light";
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

    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("#themeToggle");
      if (toggle) {
        event.preventDefault();
        toggleTheme();
        return;
      }
      
      const dropdownItem = event.target.closest(".theme-dropdown-container .dropdown-item");
      if (dropdownItem) {
        event.preventDefault();
        const themeValue = dropdownItem.dataset.themeValue;
        if (themeValue) {
          setTheme(themeValue);
        }
      }
    });

    document.addEventListener("DOMContentLoaded", () => {
      applyTheme(root.getAttribute("data-theme") || getStoredTheme(), { persist: false });
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
