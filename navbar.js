// IIFE to initialize and render the navbar component
// Encapsulates all navbar logic to avoid polluting global scope
(function initNavbar() {
  // Get the container element where navbar will be inserted
  const container = document.getElementById("navbar-container");
  // Exit early if container doesn't exist
  if (!container) return;

  // Determine current page path to set proper navigation links
  const path = window.location.pathname;
  // Check if current page is in a subdirectory
  const isSubfolder =
    path.includes("/learning/") ||
    path.includes("/contributors/") ||
    path.includes("/public/");
  // Set base URL relative path (go up one level for subfolders)
  const base = isSubfolder ? "../" : "./";

  // Determine which navigation page is currently active
  // Used to highlight active link with 'active' class
  const isHome =
    path.endsWith("/") || (path.endsWith("index.html") && !isSubfolder);
  const isLearn = path.includes("/learning/");
  const isContributors = path.includes("/contributors/");

  // Retrieve logged-in username from window object or localStorage
  // Used to display personalized greeting or show Sign in button
  const username =
    window.username || localStorage.getItem("loggedInUser") || null;

  // Initialize theme manager if available
  // Check if current theme is light or dark
  // Set appropriate icon for theme button (sun for light, moon for dark)
  window.ThemeManager?.init?.();
  const isLight = window.ThemeManager?.currentTheme?.() === "light";
  const themeIcon = isLight ? "&#9728;" : "&#9790;";

  // Avoid appending "index.html" on web servers to prevent redirect lag.
  // Only append it for file:// URLs used during local double-click testing.
  const isLocalFile = window.location.protocol === "file:";
  // Construct navigation hrefs based on file type and location
  const homeHref = isLocalFile ? `${base}index.html` : base;
  const learnHref = `${base}learning/learning.html`;
  const contributorsHref = `${base}contributors/contributor.html`;

  // Theme dropdown button with menu containing theme options
  const themeBtn = `
    <div class="theme-dropdown-container">
      <button class="btn btn-ghost btn-sm dropdown-toggle" id="themeToggleNav" aria-label="Select theme" aria-haspopup="true" aria-expanded="false">
        <span aria-hidden="true">${themeIcon}</span> Theme
      </button>
      <div class="dropdown-menu">
        <button class="dropdown-item" data-theme-value="light">&#9728; Light</button>
        <button class="dropdown-item" data-theme-value="dark">&#9790; Dark</button>
        <button class="dropdown-item" data-theme-value="sepia">&#9749; Sepia</button>
        <button class="dropdown-item" data-theme-value="cyberpunk">&#9889; Cyberpunk</button>
        <button class="dropdown-item" data-theme-value="nord">&#10052; Nord</button>
      </div>
    </div>
  `;
  // Generate individual navigation buttons
  // Active buttons get 'btn-primary' and 'active' classes for visual emphasis
  const homeBtn = `<a class="btn ${isHome ? "btn-primary active" : "btn-ghost"} btn-sm" href="${homeHref}">&#127968; Home</a>`;
  const learnBtn = `<a class="btn ${isLearn ? "btn-primary active" : "btn-ghost"} btn-sm" href="${learnHref}">&#127891; Learn</a>`;
  const contributorsBtn = `<a class="btn ${isContributors ? "btn-primary active" : "btn-ghost"} btn-sm" href="${contributorsHref}">Contributors</a>`;
  // External links to GitHub and README generator tool
  const githubBtn = `<a class="btn btn-ghost btn-sm" href="https://github.com/dhairyagothi/100_days_100_web_project" target="_blank">GitHub</a>`;
  const readmeBtn = `<a class="btn btn-ghost btn-sm" href="https://www.github-readme.tech" target="_blank">Generate README</a>`;

  // Build navigation buttons HTML based on login status
  // If user is logged in: show welcome message and logout button
  // If user is not logged in: show Sign in button
  let navButtonsHTML = "";
  if (username) {
    // User authenticated: display personalized greeting and logout option
    const userSection = `
      <span class="welcome-text">Hi, ${username}</span>
      <button class="btn btn-ghost btn-sm" id="logoutBtn">Log out</button>
    `;
    navButtonsHTML = `${themeBtn} ${homeBtn} ${learnBtn} ${contributorsBtn} ${readmeBtn} ${githubBtn} ${userSection}`;
  } else {
    // User not authenticated: display Sign in link
    const signinBtn = `<a class="btn btn-primary btn-sm" href="${base}public/Login.html">Sign in</a>`;
    navButtonsHTML = `${themeBtn} ${homeBtn} ${learnBtn} ${contributorsBtn} ${readmeBtn} ${githubBtn} ${signinBtn}`;
  }

  // Inject navbar HTML structure into the container
  // Includes: brand/logo, mobile menu toggle, and navigation buttons
  container.innerHTML = `
    <nav class="navbar" id="navbar" aria-label="Main Navigation">
      <a class="navbar-brand" href="${homeHref}" style="text-decoration:none;">
        <span class="brand-mark" aria-label="100 Days logo">100</span>
        <span class="brand-copy">
          <span class="brand-kicker">Open Source Archive</span>
          <strong>100 Days &middot; 100 Web Projects</strong>
        </span>
      </a>

      <!-- Mobile menu toggle button (hamburger) -->
      <button class="menu-toggle" id="menuToggle" type="button" aria-label="Toggle navigation menu" aria-controls="navButtons" aria-expanded="false">
        &#9776;
      </button>

      <!-- Navigation buttons container (mobile drawer on small screens) -->
      <div class="nav-buttons mobile-drawer-layer" id="navButtons">
        ${navButtonsHTML}
      </div>
    </nav>
  `;

  // Apply current theme to navbar without persisting (theme already persisted elsewhere)
  window.ThemeManager?.applyTheme?.(window.ThemeManager.currentTheme(), {
    persist: false,
  });

  // Get references to mobile menu toggle button and navigation buttons container
  const menuToggle = document.getElementById("menuToggle");
  const navButtonsDiv = document.getElementById("navButtons");
  // Setup mobile menu event listeners (only bind once to prevent duplicates)
  if (menuToggle && navButtonsDiv) {
    // Prevent binding event listeners multiple times
    if (menuToggle.dataset.mobileNavBound === "true") return;
    menuToggle.dataset.mobileNavBound = "true";

    // Helper function to close/hide mobile menu
    const closeMenu = () => {
      menuToggle.classList.remove("active");
      navButtonsDiv.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    // Helper function to open/show mobile menu and focus first link for accessibility
    const openMenu = () => {
      menuToggle.classList.add("active");
      navButtonsDiv.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
      const firstLink = navButtonsDiv.querySelector("a, button");
      firstLink?.focus({ preventScroll: true });
    };

    // Toggle menu open/close on hamburger button click
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (navButtonsDiv.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking outside of menu and toggle button
    document.addEventListener("click", (e) => {
      if (!navButtonsDiv.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close menu on Escape key press for keyboard accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navButtonsDiv.classList.contains("active")) {
        closeMenu();
        // Return focus to menu toggle button for accessibility
        menuToggle.focus({ preventScroll: true });
      }
    });

    // Close menu when a navigation link/button is clicked
    // Exception: don't close menu for theme dropdown interactions
    navButtonsDiv.addEventListener("click", (e) => {
      const clickedThemeControl = e.target.closest(
        ".theme-dropdown-container"
      );
      // Allow theme dropdown to stay open
      if (clickedThemeControl) return;

      // Close menu when any other button or link is clicked
      if (
        e.target.closest(".btn") ||
        e.target.closest("a") ||
        e.target.closest("button")
      ) {
        closeMenu();
      }
    });
  }

  // Handle logout functionality if user is logged in
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear user session data
      window.username = null;
      localStorage.removeItem("loggedInUser");
      // Reload page to reflect logged-out state
      location.reload();
    });
  }

  // Get references to theme dropdown button and its menu
  const dropdownToggle = document.getElementById("themeToggleNav");
  const dropdownMenu = dropdownToggle?.nextElementSibling;

  // Setup theme dropdown menu functionality
  if (dropdownToggle && dropdownMenu) {
    // Toggle theme dropdown menu on button click
    dropdownToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      // Toggle aria-expanded attribute for accessibility
      const isExpanded =
        dropdownToggle.getAttribute("aria-expanded") === "true";
      dropdownToggle.setAttribute("aria-expanded", String(!isExpanded));
      // Toggle menu visibility
      dropdownMenu.classList.toggle("show");
    });

    // Close theme dropdown when clicking outside of it
    document.addEventListener("click", (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
      }
    });

    // Close theme dropdown after selecting a theme option
    dropdownMenu.addEventListener("click", (e) => {
      if (e.target.closest(".dropdown-item")) {
        dropdownToggle.setAttribute("aria-expanded", "false");
        dropdownMenu.classList.remove("show");
      }
    });
  }
})(); // End of navbar initialization IIFE