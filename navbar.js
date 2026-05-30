(function initNavbar() {
  const container = document.getElementById("navbar-container");
  if (!container) return;

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

  const username = window.username || localStorage.getItem('loggedInUser') || null;

  window.ThemeManager?.init?.();
  const isLight = window.ThemeManager?.currentTheme?.() === "light";
  const themeIcon = isLight ? "fa-sun" : "fa-moon";

  // FIX: Avoid appending "index.html" on web servers to prevent 308 Redirect lag.
  // We only append it if we detect the file:// protocol (for local double-click testing).
  const isLocalFile = window.location.protocol === "file:";
  const homeHref = isLocalFile ? `${base}index.html` : base;
  const learnHref = `${base}learning/learning.html`;
  const contributorsHref = `${base}contributors/contributor.html`;

  const themeBtn = `
    <div class="theme-dropdown-container">
      <button class="btn btn-ghost btn-sm dropdown-toggle" id="themeToggleNav" aria-label="Select theme" aria-haspopup="true" aria-expanded="false">
        <i class="fas ${themeIcon}"></i> Theme
      </button>
      <div class="dropdown-menu">
        <button class="dropdown-item" data-theme-value="light"><i class="fas fa-sun"></i> Light</button>
        <button class="dropdown-item" data-theme-value="dark"><i class="fas fa-moon"></i> Dark</button>
        <button class="dropdown-item" data-theme-value="sepia"><i class="fas fa-coffee"></i> Sepia</button>
        <button class="dropdown-item" data-theme-value="cyberpunk"><i class="fas fa-bolt"></i> Cyberpunk</button>
        <button class="dropdown-item" data-theme-value="nord"><i class="fas fa-snowflake"></i> Nord</button>
      </div>
    </div>
  `;
  const homeBtn = `<a class="btn ${isHome ? "btn-primary active" : "btn-ghost"} btn-sm" href="${homeHref}"><i class="fas fa-home"></i> Home</a>`;
  const learnBtn = `<a class="btn ${isLearn ? "btn-primary active" : "btn-ghost"} btn-sm" href="${learnHref}"><i class="fas fa-graduation-cap"></i> Learn</a>`;
  const contributorsBtn = `<a class="btn ${isContributors ? "btn-primary active" : "btn-ghost"} btn-sm" href="${contributorsHref}">Contributors</a>`;
  const githubBtn = `<a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank"><i class="fab fa-github"></i> GitHub</a>`;
  const readmeBtn = `<a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">Generate README</a>`;

  let navButtonsHTML = "";
  if (username) {
    const userSection = `
      <span class="welcome-text">Hi, ${username}</span>
      <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
    `;
    navButtonsHTML = `${themeBtn} ${homeBtn} ${learnBtn} ${contributorsBtn} ${readmeBtn} ${githubBtn} ${userSection}`;
  } else {
    const signinBtn = `<a class="btn btn-primary btn-sm" href="${base}public/Login.html">Sign in</a>`;
    navButtonsHTML = `${themeBtn} ${homeBtn} ${learnBtn} ${contributorsBtn} ${readmeBtn} ${githubBtn} ${signinBtn}`;
  }

  container.innerHTML = `
      <header>
          <nav class="navbar" id="navbar" aria-label="Main Navigation">
              <a class="navbar-brand" href="${homeHref}" style="text-decoration:none;">
                  <span class="brand-mark" aria-label="100 Days logo">100</span>
                  <span class="brand-copy">
                      <span class="brand-kicker">Open Source Archive</span>
                      <strong>100 Days · 100 Web Projects</strong>
                  </span>
              </a>

              <button class="menu-toggle" id="menuToggle" type="button" aria-label="Toggle navigation menu" aria-controls="navButtons" aria-expanded="false">
                  <i class="fas fa-bars" aria-hidden="true"></i>
              </button>

              <div class="nav-buttons mobile-drawer-layer" id="navButtons">
                  ${navButtonsHTML}
              </div>
          </nav>
      </header>
  `;

  window.ThemeManager?.applyTheme?.(window.ThemeManager.currentTheme(), { persist: false });

  // Mobile Menu Logic
  const menuToggle = document.getElementById("menuToggle");
  const navButtonsDiv = document.getElementById("navButtons");
  if (menuToggle && navButtonsDiv) {
    if (menuToggle.dataset.mobileNavBound === "true") return;
    menuToggle.dataset.mobileNavBound = "true";

    const closeMenu = () => {
      menuToggle.classList.remove("active");
      navButtonsDiv.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    const openMenu = () => {
      menuToggle.classList.add("active");
      navButtonsDiv.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      const firstLink = navButtonsDiv.querySelector("a, button");
      firstLink?.focus({ preventScroll: true });
    };

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

    navButtonsDiv.addEventListener("click", (e) => {
      if (
        e.target.closest(".btn") ||
        e.target.closest("a") ||
        e.target.closest("button")
      ) {
        closeMenu();
      }
    });
  }

  // Logout Logic
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      window.username = null;
      localStorage.removeItem('loggedInUser');
      location.reload();
    });
  }

  // Dropdown Logic
  const dropdownToggle = document.getElementById("themeToggleNav");
  const dropdownMenu = dropdownToggle?.nextElementSibling;
  
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", !isExpanded);
      dropdownMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
      }
    });
    
    // Close dropdown on item click
    dropdownMenu.addEventListener("click", (e) => {
      if (e.target.closest(".dropdown-item")) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
      }
    });
  }
})();
