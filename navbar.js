(function initNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

  const safeStorage = {
    getItem(key) {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    setItem(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (_) {
        // Ignored
      }
    },
    removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (_) {
        // Ignored
      }
    },
  };

  const path = window.location.pathname;
  const isSubfolder =
    path.includes("/learning/") ||
    path.includes("/contributors/") ||
    path.includes("/public/");
  const base = isSubfolder ? "../" : "./";

  const isHome =
    path.endsWith("/") || (path.endsWith("index.html") && !isSubfolder);
  const isLearn = path.includes("/learning/");
  const isContributors = path.includes("/contributors/");

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readSession() {
    const rawSession = safeStorage.getItem("loggedInUserData");
    if (rawSession) {
      try {
        const parsedSession = JSON.parse(rawSession);
        if (parsedSession && typeof parsedSession === "object") {
          return parsedSession;
        }
      } catch (_) {
        // Ignore malformed session data and fall back below.
      }
    }

    const fallbackUsername =
      window.username || safeStorage.getItem("loggedInUser") || null;
    if (fallbackUsername) {
      return {
        username: fallbackUsername,
        name: fallbackUsername,
        authAction: "login",
      };
    }

    return null;
  }

  function getDisplayName(session) {
    return String(
      session?.name || session?.username || window.username || safeStorage.getItem("loggedInUser") || ""
    ).trim();
  }

  function getIstGreeting() {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      }).format(new Date()),
    );

    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }

  function getGreetingCopy(session) {
    const displayName = getDisplayName(session) || "there";
    const authAction = String(session?.authAction || "login").toLowerCase();

    if (authAction === "signup") {
      return `Hey ${displayName}, Welcome!`;
    }

    return `${getIstGreeting()}, ${displayName}. Welcome back!`;
  }

  const session = readSession();
  const displayName = getDisplayName(session) || "there";
  const greetingCopy = session ? getGreetingCopy(session) : "";

  window.ThemeManager?.init?.();
  const isLight = window.ThemeManager?.currentTheme?.() === "light";
  const themeIcon = isLight ? "☀" : "☾";

  const isLocalFile = window.location.protocol === "file:";
  const homeHref = isLocalFile ? `${base}index.html` : base;
  const learnHref = `${base}learning/learning.html`;
  const contributorsHref = `${base}contributors/contributor.html`;

  const themeBtn = `
    <div class="theme-dropdown-container">
      <button class="btn btn-ghost btn-sm dropdown-toggle" id="themeToggleNav" aria-label="Select theme" aria-haspopup="true" aria-expanded="false">
        <span aria-hidden="true">${themeIcon}</span> Theme
      </button>
      <div class="dropdown-menu">
        <button class="dropdown-item" data-theme-value="light">☀ Light</button>
        <button class="dropdown-item" data-theme-value="dark">☾ Dark</button>
        <button class="dropdown-item" data-theme-value="sepia">☕ Sepia</button>
        <button class="dropdown-item" data-theme-value="cyberpunk">⚡Cyberpunk</button>
        <button class="dropdown-item" data-theme-value="nord">❄ Nord</button>
      </div>
    </div>
  `;
  const homeBtn = `
  <a class="btn ${isHome ? "btn-primary active" : "btn-ghost"} btn-sm" href="${homeHref}">
    <span class="mobile-nav-icon"><i class="fas fa-home" aria-hidden="true"></i></span>
    Home
  </a>`;

  const learnBtn = `
  <a class="btn ${isLearn ? "btn-primary active" : "btn-ghost"} btn-sm" href="${learnHref}">
    <span class="mobile-nav-icon"><i class="fas fa-graduation-cap" aria-hidden="true"></i></span>
    Learn
  </a>`;

  const contributorsBtn = `
  <a class="btn ${isContributors ? "btn-primary active" : "btn-ghost"} btn-sm" href="${contributorsHref}">
    <span class="mobile-nav-icon"><i class="fas fa-users" aria-hidden="true"></i></span>
    Contributors
  </a>`;

  const githubBtn = `
  <a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">
    GitHub
  </a>`;

  const readmeBtn = `
  <a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">
    Generate README
  </a>`;

  const customCursorEnabled =
    safeStorage.getItem("customCursorEnabled") !== "false";
  const cursorBtn = `
    <button class="btn btn-ghost btn-sm" id="cursorToggleNav" aria-label="Toggle custom cursor (currently ${customCursorEnabled ? "Custom" : "Default"})">
      <span class="mobile-nav-icon"><i class="fas ${customCursorEnabled ? "fa-circle-notch" : "fa-mouse-pointer"}" aria-hidden="true"></i></span>
      Cursor: ${customCursorEnabled ? "Custom" : "Default"}
    </button>
  `;

  let navButtonsHTML = "";
  if (session) {
    const userSection = `
      <div class="welcome-text" id="navWelcomeCopy">${escapeHTML(greetingCopy)}</div>
      <div class="mobile-user-strip">
        <div class="mobile-user-avatar">${escapeHTML(displayName.slice(0, 2).toUpperCase())}</div>
        <div class="mobile-user-info">
          <p class="mobile-user-name">${escapeHTML(greetingCopy)}</p>
          <p class="mobile-user-role">${escapeHTML(session.authAction === "signup" ? "New session" : "Signed in")}</p>
        </div>
      </div>
      <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
    `;
    navButtonsHTML = `${themeBtn} ${cursorBtn} ${homeBtn} ${learnBtn} ${contributorsBtn} ${readmeBtn} ${githubBtn} ${userSection}`;
  } else {
    const signinBtn = `<button class="btn btn-primary btn-sm" id="navSignInCta">Sign in</button>`;
    navButtonsHTML = `${themeBtn} ${cursorBtn} ${homeBtn} ${learnBtn} ${contributorsBtn} ${readmeBtn} ${githubBtn} ${signinBtn}`;
  }

  container.innerHTML = `
    <nav class="navbar" id="navbar" aria-label="Main Navigation">
      <a class="navbar-brand" href="${homeHref}" style="text-decoration:none;">
        <span class="brand-mark" aria-label="100 Days logo">100</span>
        <span class="brand-copy">
          <span class="brand-kicker">Open Source Archive</span>
          <strong>100 Days · 100 Web Projects</strong>
        </span>
      </a>

      <button class="menu-toggle" id="menuToggle" type="button" aria-label="Toggle navigation menu" aria-controls="navButtons" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="nav-buttons mobile-drawer-layer" id="navButtons">
        <div class="mobile-menu-header">
          <span class="mobile-menu-title">MENU</span>
          <button class="mobile-menu-close" id="mobileMenuClose" type="button">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        ${navButtonsHTML}
      </div>
    </nav>
  `;

  window.ThemeManager?.applyTheme?.(window.ThemeManager.currentTheme(), {
    persist: false,
  });

  // Mobile drawer state triggers
  const menuToggle = document.getElementById("menuToggle");
  const navButtonsDiv = document.getElementById("navButtons");
  const closeBtn = document.getElementById("mobileMenuClose");

  let overlay = document.querySelector(".mobile-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "mobile-overlay";
    document.body.appendChild(overlay);
  }

  if (menuToggle && navButtonsDiv) {
    if (menuToggle.dataset.mobileNavBound === "true") return;
    menuToggle.dataset.mobileNavBound = "true";

    const closeMenu = () => {
      menuToggle.classList.remove("active");
      navButtonsDiv.classList.remove("active");
      overlay.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      menuToggle.classList.add("active");
      navButtonsDiv.classList.add("active");
      overlay.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      const firstLink = navButtonsDiv.querySelector("a, button");
      firstLink?.focus({ preventScroll: true });
    };

    overlay.addEventListener("click", closeMenu);
    closeBtn?.addEventListener("click", closeMenu);

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navButtonsDiv.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (e) => {
      if (!navButtonsDiv.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navButtonsDiv.classList.contains("active")) {
        closeMenu();
        menuToggle.focus({ preventScroll: true });
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

    navButtonsDiv.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn:not(.dropdown-toggle)") ||
        e.target.closest("a") ||
        e.target.closest(".dropdown-item")
      ) {
        closeMenu();
      }
    });
  }

  // Desktop drop menu engines
  const dropdownToggle = document.getElementById("themeToggleNav");
  const dropdownMenu = dropdownToggle?.nextElementSibling;

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded =
        dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", !isExpanded);
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (
        !dropdownToggle.contains(e.target) &&
        !dropdownMenu.contains(e.target)
      ) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dropdownMenu.classList.contains("show")) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
        dropdownToggle.focus();
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.username = null;
      safeStorage.removeItem("loggedInUser");
      safeStorage.removeItem("loggedInUserData");
      location.reload();
    });
  }

  // Cursor Toggle Logic
  document.addEventListener("click", (event) => {
    const toggle = event.target.closest("#cursorToggleNav");
    if (!toggle) return;
    event.preventDefault();
    const currentlyEnabled =
      safeStorage.getItem("customCursorEnabled") !== "false";
    const nextState = !currentlyEnabled;
    safeStorage.setItem("customCursorEnabled", String(nextState));

    // Call the cursor system to enable/disable
    if (nextState && window.CursorSystem?.enable) {
      window.CursorSystem.enable();
    } else if (!nextState && window.CursorSystem?.disable) {
      window.CursorSystem.disable();
    } else {
      // Fallback if cursor system not loaded yet
      document.querySelectorAll("#cursorToggleNav").forEach((btn) => {
        btn.innerHTML = `
          <span class="mobile-nav-icon"><i class="fas ${nextState ? "fa-circle-notch" : "fa-mouse-pointer"}" aria-hidden="true"></i></span>
          Cursor: ${nextState ? "Custom" : "Default"}
        `;
        btn.setAttribute(
          "aria-label",
          `Toggle custom cursor (currently ${nextState ? "Custom" : "Default"})`,
        );
      });
    }
  });

  // Sign In Click Logic
  document.addEventListener("click", (event) => {
    const signInBtn = event.target.closest("#navSignInCta");
    if (!signInBtn) return;
    event.preventDefault();
    const name = prompt("Enter your name/nickname to personalize your experience:");
    if (name && name.trim()) {
      const trimmed = name.trim();
      safeStorage.setItem("loggedInUser", trimmed);
      safeStorage.setItem("loggedInUserData", JSON.stringify({
        username: trimmed,
        name: trimmed,
        authAction: "login",
        loginTime: Date.now()
      }));
      location.reload();
    }
  });
})();
