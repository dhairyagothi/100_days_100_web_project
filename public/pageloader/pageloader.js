/* ============================================================
   pageloader.js  —  Pageloader Demo
   ============================================================ */

// Loader data
const loaders = [
  {
    id: "spinner",
    name: "Classic Spinner",
    description: "The standard dual-color rotating ring.",
    type: "spinner",
    getHtml: () => `<div class="spinner"></div>`,
    getCss: (size, color, speed, glow) => `
.spinner {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(4, size / 12)}px solid rgba(148, 163, 184, 0.15);
  border-top-color: ${color};
  border-right-color: ${color};
  animation: spin ${0.9 / speed}s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`,
  },
  {
    id: "dots",
    name: "Bouncing Dots",
    description: "Playful and modern, great for chat or dynamic content.",
    type: "dots",
    getHtml: () => `
<div class="loader-dots">
  <div></div>
  <div></div>
  <div></div>
</div>
`,
    getCss: (size, color, speed, glow) => `
.loader-dots {
  display: flex;
  gap: ${size / 6}px;
}
.loader-dots div {
  width: ${size / 3}px;
  height: ${size / 3}px;
  border-radius: 50%;
  background: ${color};
  animation: bounce ${0.5 / speed}s alternate infinite ease-in-out;
}
.loader-dots div:nth-child(2) {
  animation-delay: 0.15s;
}
.loader-dots div:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes bounce {
  0% { transform: translateY(0); }
  100% { transform: translateY(-${size / 3}px); }
}
`,
  },
  {
    id: "pulse",
    name: "Radar Pulse",
    description: "Minimalist expanding ring for subtle background loading.",
    type: "pulse",
    getHtml: () => `<div class="loader-pulse"></div>`,
    getCss: (size, color, speed, glow) => `
.loader-pulse {
  width: ${size / 2}px;
  height: ${size / 2}px;
  background: ${color};
  border-radius: 50%;
  animation: pulse-ring ${1.2 / speed}s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
@keyframes pulse-ring {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}
`,
  },
  {
    id: "double-ring",
    name: "Double Ring",
    description: "Elegant, intersecting spinning paths.",
    type: "ring",
    getHtml: () => `<div class="loader-double-ring"></div>`,
    getCss: (size, color, speed, glow) => `
.loader-double-ring {
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  border: ${Math.max(4, size / 12)}px solid transparent;
  border-top-color: ${color};
  border-bottom-color: ${color};
  animation: spin ${1.5 / speed}s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
  position: relative;
}
.loader-double-ring::before {
  content: "";
  position: absolute;
  inset: ${Math.max(4, size / 12)}px;
  border-radius: 50%;
  border: ${Math.max(4, size / 12)}px solid transparent;
  border-left-color: ${color};
  border-right-color: ${color};
  animation: spin ${1 / speed}s linear infinite reverse;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`,
  },
  {
    id: "bars",
    name: "Wave Bars",
    description: "Smooth vertical scaling, perfect for media or audio loading.",
    type: "spinner",
    getHtml: () => `
<div class="loader-bars">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
`,
    getCss: (size, color, speed, glow) => `
.loader-bars {
  display: flex;
  gap: ${size / 12}px;
  align-items: center;
}
.loader-bars div {
  width: ${size / 6}px;
  height: ${size / 2}px;
  background: ${color};
  border-radius: 4px;
  animation: wave ${1 / speed}s ease-in-out infinite;
}
.loader-bars div:nth-child(1) { animation-delay: -0.4s; }
.loader-bars div:nth-child(2) { animation-delay: -0.2s; }
.loader-bars div:nth-child(3) { animation-delay: 0s; }
.loader-bars div:nth-child(4) { animation-delay: 0.2s; }
@keyframes wave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}
`,
  },
  {
    id: "flip",
    name: "Flipping Square",
    description: "A geometric 3D rotation effect for a sharp, modern feel.",
    type: "spinner",
    getHtml: () => `<div class="loader-flip"></div>`,
    getCss: (size, color, speed, glow) => `
.loader-flip {
  width: ${size / 2}px;
  height: ${size / 2}px;
  background: ${color};
  animation: flip ${1.2 / speed}s infinite ease-in-out;
}
@keyframes flip {
  0% { transform: perspective(120px) rotateX(0deg) rotateY(0deg); }
  50% { transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg); }
  100% { transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg); }
}
`,
  },
  {
    id: "orbit",
    name: "Orbit",
    description: "A continuous orbital path spinning around a solid core.",
    type: "ring",
    getHtml: () => `<div class="loader-orbit"></div>`,
    getCss: (size, color, speed, glow) => `
.loader-orbit {
  width: ${size / 6}px;
  height: ${size / 6}px;
  border-radius: 50%;
  background: ${color};
  position: relative;
}
.loader-orbit::before {
  content: "";
  position: absolute;
  top: -${size / 4}px;
  left: -${size / 4}px;
  width: ${size / 1.2}px;
  height: ${size / 1.2}px;
  border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: ${color};
  border-bottom-color: ${color};
  animation: spin ${1.2 / speed}s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`,
  },
  {
    id: "glow",
    name: "Glow Ring",
    description: "A neon-inspired pulsing gradient with dynamic shadows.",
    type: "glow",
    getHtml: () => `<div class="loader-glow"></div>`,
    getCss: (size, color, speed, glow) => `
.loader-glow {
  width: ${size / 1.5}px;
  height: ${size / 1.5}px;
  border-radius: 50%;
  border: 4px solid ${color};
  box-shadow: 0 0 ${16 * glow}px ${color}, inset 0 0 ${16 * glow}px ${color};
  animation: glow-pulse ${1.5 / speed}s ease-in-out infinite alternate;
}
@keyframes glow-pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 ${8 * glow}px ${color}, inset 0 0 ${8 * glow}px ${color};
    opacity: 0.7;
  }
  100% {
    transform: scale(1.1);
    box-shadow: 0 0 ${24 * glow}px ${color}, inset 0 0 ${24 * glow}px ${color};
    opacity: 1;
  }
}
`,
  },
];

// State
let currentLoader = null;
let currentSettings = {
  size: 80,
  speed: 1,
  color: "#38bdf8",
  glow: 1,
  theme: "dark",
};
let favorites = JSON.parse(localStorage.getItem("loaderFavorites") || "[]");
let currentFilter = "all";
let searchQuery = "";

/* ── 1. Measure actual page load time ── */
const t0 = performance.now();
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  const page = document.getElementById("page");
  const loadStat = document.getElementById("loadTimeStat");

  const elapsed = Math.round(performance.now() - t0);
  if (loadStat) loadStat.textContent = elapsed;

  if (preloader) preloader.classList.add("hidden");

  if (page) {
    setTimeout(function () {
      page.classList.add("visible");
    }, 100);
  }

  initApp();
});

/* ── 2. Single-page router (hash-based) ── */
function handleRouting() {
  const hash = window.location.hash || "#home";

  document.querySelectorAll(".page-section").forEach(function (sec) {
    sec.classList.remove("active");
  });

  const target = document.querySelector(hash);
  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}
window.addEventListener("hashchange", handleRouting);
window.addEventListener("DOMContentLoaded", handleRouting);

/* ── 3. Contact form — send + success + clear ── */
window.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.getElementById("sendBtn");
  const nameInput = document.getElementById("fname");
  const emailInput = document.getElementById("femail");
  const msgInput = document.getElementById("fmsg");
  const successMsg = document.getElementById("successMsg");

  if (sendBtn) {
    sendBtn.addEventListener("click", function () {
      if (
        !nameInput.value.trim() ||
        !emailInput.value.trim() ||
        !msgInput.value.trim()
      ) {
        showFormMsg("⚠️ Please fill in all fields before sending.", "error");
        return;
      }
      sendBtn.disabled = true;
      sendBtn.textContent = "Sending…";
      setTimeout(function () {
        nameInput.value = "";
        emailInput.value = "";
        msgInput.value = "";
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Message";
        showFormMsg("✅ Message sent! We'll get back to you soon.", "success");
      }, 1200);
    });
  }

  function showFormMsg(text, type) {
    successMsg.textContent = text;
    successMsg.className = "success-msg " + type + " show";
    setTimeout(function () {
      successMsg.classList.remove("show");
    }, 4000);
  }
});

/* ── Initialize Application ── */
function initApp() {
  renderLoaders();
  setupEventListeners();
  startFPSCounter();
}

/* ── Render Loaders Grid ── */
function renderLoaders() {
  const grid = document.getElementById("loader-grid");
  if (!grid) return;

  let filteredLoaders = loaders.filter((loader) => {
    const matchesSearch =
      loader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loader.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loader.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "favorites" && favorites.includes(loader.id)) ||
      loader.type === currentFilter;
    return matchesSearch && matchesFilter;
  });
  if(filteredLoaders.length==0){
    if(currentFilter==="favorites" && favorites.length===0)
    {
      grid.innerHTML='<p> ❤️ No favorite loaders yet </p>'
    }
    else 
    {
      grid.innerHTML='<p> 🔍 No loaders found matching your search or filter </p>'
    }
    return;
  }
  grid.innerHTML = filteredLoaders
    .map(
      (loader) => `
    <article class="loader-showcase-card" data-id="${loader.id}">
      <button class="favorite-btn ${favorites.includes(loader.id) ? "favorited" : ""}" data-id="${loader.id}" title="Add to favorites">
        ${favorites.includes(loader.id) ? "❤️" : "🤍"}
      </button>
      <div class="showcase-box">
        ${loader.getHtml()}
      </div>
      <h3>${loader.name}</h3>
      <p>${loader.description}</p>
    </article>
  `,
    )
    .join("");
}

/* ── Setup Event Listeners ── */
function setupEventListeners() {
  // Loader cards click
  document.getElementById("loader-grid").addEventListener("click", (e) => {
    const card = e.target.closest(".loader-showcase-card");
    const favBtn = e.target.closest(".favorite-btn");

    if (favBtn) {
      e.stopPropagation();
      toggleFavorite(favBtn.dataset.id);
      return;
    }

    if (card) {
      openModal(card.dataset.id);
    }
  });

  // Search
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderLoaders();
    });
  }

  // Filter tabs
  const filterTabs = document.getElementById("filter-tabs");
  if (filterTabs) {
    filterTabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".filter-tab");
      if (tab) {
        filterTabs
          .querySelectorAll(".filter-tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        currentFilter = tab.dataset.filter;
        renderLoaders();
      }
    });
  }

  // Modal close
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("loader-modal").addEventListener("click", (e) => {
    if (e.target.id === "loader-modal") closeModal();
  });

  // Fullscreen close
  document
    .getElementById("fullscreen-close")
    .addEventListener("click", closeFullscreen);
  document
    .getElementById("fullscreen-preview")
    .addEventListener("click", (e) => {
      if (e.target.id === "fullscreen-preview") closeFullscreen();
    });

  // Controls
  document.getElementById("size-slider").addEventListener("input", (e) => {
    currentSettings.size = parseInt(e.target.value);
    updateModalPreview();
    document.getElementById("size-value").textContent =
      `${currentSettings.size}px`;
    document.getElementById("size-display").textContent =
      `${currentSettings.size}px`;
  });

  document.getElementById("speed-slider").addEventListener("input", (e) => {
    currentSettings.speed = parseFloat(e.target.value);
    updateModalPreview();
    document.getElementById("speed-value").textContent =
      `${currentSettings.speed.toFixed(1)}x`;
    document.getElementById("speed-display").textContent =
      `${currentSettings.speed.toFixed(1)}x`;
  });

  document.getElementById("color-picker").addEventListener("input", (e) => {
    currentSettings.color = e.target.value;
    updateModalPreview();
  });

  document.getElementById("glow-slider").addEventListener("input", (e) => {
    currentSettings.glow = parseFloat(e.target.value);
    updateModalPreview();
    document.getElementById("glow-value").textContent =
      currentSettings.glow.toFixed(1);
  });

  document.getElementById("theme-select").addEventListener("change", (e) => {
    currentSettings.theme = e.target.value;
    updateModalPreview();
  });

  // Actions
  document.getElementById("copy-css-btn").addEventListener("click", copyCSS);
  document
    .getElementById("download-css-btn")
    .addEventListener("click", downloadCSS);
  document
    .getElementById("fullscreen-btn")
    .addEventListener("click", openFullscreen);

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const fullscreen = document.getElementById("fullscreen-preview");
      if (!fullscreen.classList.contains("hidden")) {
        closeFullscreen();
      } else {
        closeModal();
      }
    }
  });
}

/* ── Favorites ── */
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((fid) => fid !== id);
  } else {
    favorites.push(id);
  }
  localStorage.setItem("loaderFavorites", JSON.stringify(favorites));
  renderLoaders();
}

/* ── Modal Functions ── */
function openModal(id) {
  currentLoader = loaders.find((l) => l.id === id);
  if (!currentLoader) return;

  // Reset settings
  currentSettings = {
    size: 80,
    speed: 1,
    color: "#38bdf8",
    glow: 1,
    theme: "dark",
  };
  document.getElementById("size-slider").value = 80;
  document.getElementById("speed-slider").value = 1;
  document.getElementById("color-picker").value = "#38bdf8";
  document.getElementById("glow-slider").value = 1;
  document.getElementById("theme-select").value = "dark";
  document.getElementById("size-value").textContent = "80px";
  document.getElementById("speed-value").textContent = "1.0x";
  document.getElementById("glow-value").textContent = "1";
  document.getElementById("size-display").textContent = "80px";
  document.getElementById("speed-display").textContent = "1.0x";

  document.getElementById("modal-loader-name").textContent = currentLoader.name;
  document.getElementById("modal-loader-description").textContent =
    currentLoader.description;

  updateModalPreview();
  document.getElementById("loader-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("loader-modal").classList.add("hidden");
}

function updateModalPreview() {
  if (!currentLoader) return;

  const container = document.getElementById("modal-preview-container");
  container.className =
    "modal-preview-container theme-" + currentSettings.theme;
  const preview = document.getElementById("modal-loader-preview");

  preview.innerHTML = currentLoader.getHtml();

  // Inject custom CSS
  const styleId = "modal-loader-style";
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement("style");
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = currentLoader.getCss(
    currentSettings.size,
    currentSettings.color,
    currentSettings.speed,
    currentSettings.glow,
  );
}

/* ── Fullscreen Preview ── */
function openFullscreen() {
  if (!currentLoader) return;
  const preview = document.getElementById("fullscreen-loader-preview");
  preview.innerHTML = currentLoader.getHtml();
  const styleId = "modal-loader-style";
  const style = document.getElementById(styleId);
  if (style) {
    const fsStyleId = "fullscreen-loader-style";
    let fsStyle = document.getElementById(fsStyleId);
    if (!fsStyle) {
      fsStyle = document.createElement("style");
      fsStyle.id = fsStyleId;
      document.head.appendChild(fsStyle);
    }
    fsStyle.textContent = style.textContent;
  }
  document.getElementById("fullscreen-preview").classList.remove("hidden");
}

function closeFullscreen() {
  document.getElementById("fullscreen-preview").classList.add("hidden");
}

/* ── Copy & Download CSS ── */
function copyCSS() {
  if (!currentLoader) return;
  const css = currentLoader.getCss(
    currentSettings.size,
    currentSettings.color,
    currentSettings.speed,
    currentSettings.glow,
  );

  navigator.clipboard
    .writeText(css)
    .then(() => {
      showToast("CSS copied successfully!", "success");
    })
    .catch(() => {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = css;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("CSS copied successfully!", "success");
    });
}

function downloadCSS() {
  if (!currentLoader) return;
  const css = currentLoader.getCss(
    currentSettings.size,
    currentSettings.color,
    currentSettings.speed,
    currentSettings.glow,
  );
  const blob = new Blob([css], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentLoader.id}-loader.css`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("CSS downloaded!", "success");
}

/* ── Toast Notifications ── */
function showToast(text, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = text;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

/* ── FPS Counter ── */
let lastTime = performance.now();
let frames = 0;

function startFPSCounter() {
  requestAnimationFrame(updateFPS);
}

function updateFPS() {
  frames++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    const fps = Math.round((frames * 1000) / (now - lastTime));
    const fpsDisplay = document.getElementById("fps-display");
    if (fpsDisplay) fpsDisplay.textContent = fps;
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(updateFPS);
}
