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

  const username = window.username || null;

  // Initialize Theme based on localStorage before rendering
  const savedTheme = localStorage.getItem("theme") || "dark";
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
  const isLight = document.body.classList.contains("light-mode");
  const themeIcon = isLight ? "fa-sun" : "fa-moon";

  // FIX: Avoid appending "index.html" on web servers to prevent 308 Redirect lag.
  // We only append it if we detect the file:// protocol (for local double-click testing).
  const isLocalFile = window.location.protocol === "file:";
  const homeHref = isLocalFile ? `${base}index.html` : base;
  const learnHref = `${base}learning/learning.html`;
  const contributorsHref = `${base}contributors/contributor.html`;

  const themeBtn = `<button class="btn btn-ghost btn-sm" id="themeToggleNav" aria-label="Toggle theme"><i class="fas ${themeIcon}"></i> Theme</button>`;
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

              <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu" aria-controls="navButtons" aria-expanded="false">
                  <i class="fas fa-bars" aria-hidden="true"></i>
              </button>

              <div class="nav-buttons mobile-drawer-layer" id="navButtons">
                  ${navButtonsHTML}
              </div>
          </nav>
      </header>
  `;

  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById("themeToggleNav");
  let transitionTimer;
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const currentlyLight = document.body.classList.contains("light-mode");
      localStorage.setItem("theme", currentlyLight ? "light" : "dark");

      themeToggleBtn.querySelector("i").className = currentlyLight
        ? "fas fa-sun"
        : "fas fa-moon";

      document.body.classList.add("theme-transitioning");
      if (transitionTimer) clearTimeout(transitionTimer);
      transitionTimer = setTimeout(() => {
        document.body.classList.remove("theme-transitioning");
      }, 400);
    });
  }

  // Mobile Menu Logic
  const menuToggle = document.getElementById("menuToggle");
  const navButtonsDiv = document.getElementById("navButtons");
  if (menuToggle && navButtonsDiv) {
    const closeMenu = () => {
      menuToggle.classList.remove("active");
      navButtonsDiv.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = navButtonsDiv.classList.toggle("active");
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!navButtonsDiv.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
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
      location.reload();
    });
  }
})();
