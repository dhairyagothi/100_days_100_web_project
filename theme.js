(function initSharedTheme() {
  const STORAGE_KEY = "theme";
  const THEMES = new Set(["dark", "light"]);
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
    const iconClass = theme === "light" ? "fas fa-sun" : "fas fa-moon";
    document.querySelectorAll("#themeToggle i, #themeToggleNav i").forEach((icon) => {
      icon.className = iconClass;
    });

    document.querySelectorAll("#themeToggle, #themeToggleNav").forEach((button) => {
      button.setAttribute("aria-pressed", String(theme === "light"));
      button.setAttribute("title", theme === "light" ? "Switch to dark theme" : "Switch to light theme");
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

  const init = () => {
    if (!root.getAttribute("data-theme")) {
      applyTheme(getStoredTheme(), { persist: false });
    } else {
      applyTheme(root.getAttribute("data-theme"), { persist: false });
    }

    if (initialized) return;
    initialized = true;

    document.addEventListener("click", (event) => {
      const toggle = event.target.closest("#themeToggle, #themeToggleNav");
      if (!toggle) return;
      event.preventDefault();
      toggleTheme();
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
  };

  applyTheme(getStoredTheme(), { persist: false });
  init();
})();
