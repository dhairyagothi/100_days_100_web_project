/* ============================================================
   CUSTOM CURSOR SYSTEM — cursor.js
   10 magical cursor styles with crystal/sparkle effects
   Mobile devices automatically use default cursor
   ============================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "customCursorStyle";
  const ENABLED_KEY = "customCursorEnabled";
  const DEFAULT_STYLE = "crystal";

  const CURSOR_STYLES = [
    { id: "crystal",  label: "Crystal Trail",  icon: "fa-diamond"      },
    { id: "sparkle",  label: "Sparkle Magic",  icon: "fa-star"         },
    { id: "comet",    label: "Comet Tail",      icon: "fa-rocket"       },
    { id: "rainbow",  label: "Rainbow Trail",   icon: "fa-circle"       },
    { id: "snow",     label: "Snow Flakes",     icon: "fa-snowflake"    },
    { id: "fire",     label: "Fire Trail",      icon: "fa-fire"         },
    { id: "neon",     label: "Neon Glow",       icon: "fa-bolt"         },
    { id: "galaxy",   label: "Galaxy Dust",     icon: "fa-star-of-life" },
    { id: "minimal",  label: "Minimal Ring",    icon: "fa-circle-dot"   },
    { id: "default",  label: "Default Arrow",   icon: "fa-arrow-pointer"},
  ];

  const RAINBOW_COLORS = ["#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff","#ff9ff3"];
  let rainbowIdx = 0;

  let activeStyle = DEFAULT_STYLE;
  let isEnabled = true;
  let outerEl = null;
  let innerEl = null;
  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;
  let lastParticle = 0;

  const isMobile = window.matchMedia("(pointer: coarse)").matches;

  /* ── Helpers ── */
  function getSaved() {
    try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_STYLE; }
    catch (_) { return DEFAULT_STYLE; }
  }

  function getEnabled() {
    try { return localStorage.getItem(ENABLED_KEY) !== "false"; }
    catch (_) { return true; }
  }

  function saveStyle(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (_) {}
  }

  function saveEnabled(enabled) {
    try { localStorage.setItem(ENABLED_KEY, String(enabled)); } catch (_) {}
  }

  /* ── Create cursor elements ── */
  function ensureCursorElements() {
    outerEl = document.querySelector(".cursor-ring--outer");
    innerEl = document.querySelector(".cursor-ring--inner");

    if (!outerEl) {
      outerEl = document.createElement("div");
      outerEl.className = "cursor-ring cursor-ring--outer";
      outerEl.setAttribute("aria-hidden", "true");
      document.body.appendChild(outerEl);
    }
    if (!innerEl) {
      innerEl = document.createElement("div");
      innerEl.className = "cursor-ring cursor-ring--inner";
      innerEl.setAttribute("aria-hidden", "true");
      document.body.appendChild(innerEl);
    }
  }

  /* ── Apply cursor style ── */
  function applyStyle(id) {
    if (!CURSOR_STYLES.find(s => s.id === id)) id = DEFAULT_STYLE;
    activeStyle = id;
    saveStyle(id);

    ensureCursorElements();

    // Reset
    outerEl.style.cssText = "";
    innerEl.style.cssText = "";
    outerEl.className = "cursor-ring cursor-ring--outer";
    innerEl.className = "cursor-ring cursor-ring--inner";

    // If disabled or default style, hide cursor elements and set standard cursor
    if (!isEnabled || id === "default") {
      document.body.classList.remove("custom-cursor-active");
      document.body.style.cursor = "auto";
      outerEl.classList.remove("is-visible");
      outerEl.style.display = "none";
      innerEl.classList.remove("is-visible");
      innerEl.style.display = "none";
      return;
    }

    document.body.classList.add("custom-cursor-active");
    document.body.style.cursor = "none";
    outerEl.classList.add("is-visible");
    outerEl.style.display = "block";
    innerEl.classList.add("is-visible");
    innerEl.style.display = "block";

    // Style configs
    const styles = {
      crystal: () => {
        outerEl.style.width = "32px"; outerEl.style.height = "32px";
        outerEl.style.border = "1.5px solid rgba(147,197,253,0.8)";
        outerEl.style.boxShadow = "0 0 12px rgba(147,197,253,0.6),inset 0 0 8px rgba(147,197,253,0.2)";
        outerEl.style.background = "rgba(147,197,253,0.05)";
        innerEl.style.width = "6px"; innerEl.style.height = "6px";
        innerEl.style.background = "rgba(255,255,255,0.95)";
        innerEl.style.boxShadow = "0 0 8px #fff,0 0 14px rgba(147,197,253,0.9)";
      },
      sparkle: () => {
        outerEl.style.width = "28px"; outerEl.style.height = "28px";
        outerEl.style.border = "1.5px solid rgba(250,204,21,0.7)";
        outerEl.style.boxShadow = "0 0 10px rgba(250,204,21,0.5)";
        innerEl.style.width = "5px"; innerEl.style.height = "5px";
        innerEl.style.background = "#facc15";
        innerEl.style.boxShadow = "0 0 8px #facc15,0 0 16px #facc15";
      },
      comet: () => {
        outerEl.style.width = "14px"; outerEl.style.height = "14px";
        outerEl.style.background = "radial-gradient(circle,#fff 20%,rgba(99,102,241,0.8) 80%)";
        outerEl.style.border = "none";
        outerEl.style.boxShadow = "0 0 16px rgba(99,102,241,0.8)";
        innerEl.style.display = "none";
      },
      rainbow: () => {
        outerEl.style.width = "16px"; outerEl.style.height = "16px";
        outerEl.style.border = "none";
        outerEl.style.background = "#ff6b6b";
        outerEl.style.boxShadow = "0 0 10px #ff6b6b";
        innerEl.style.display = "none";
      },
      snow: () => {
        outerEl.style.width = "12px"; outerEl.style.height = "12px";
        outerEl.style.background = "rgba(219,234,254,0.9)";
        outerEl.style.border = "1px solid rgba(191,219,254,0.8)";
        outerEl.style.boxShadow = "0 0 8px rgba(191,219,254,0.7)";
        innerEl.style.display = "none";
      },
      fire: () => {
        outerEl.style.width = "14px"; outerEl.style.height = "14px";
        outerEl.style.background = "radial-gradient(circle,#fbbf24,#ef4444)";
        outerEl.style.border = "none";
        outerEl.style.boxShadow = "0 0 14px rgba(239,68,68,0.8),0 0 24px rgba(251,191,36,0.4)";
        innerEl.style.display = "none";
      },
      neon: () => {
        outerEl.style.width = "36px"; outerEl.style.height = "36px";
        outerEl.style.border = "2px solid #00ff88";
        outerEl.style.background = "transparent";
        outerEl.style.boxShadow = "0 0 12px #00ff88,0 0 24px #00ff88,inset 0 0 6px rgba(0,255,136,0.15)";
        innerEl.style.width = "5px"; innerEl.style.height = "5px";
        innerEl.style.background = "#00ff88";
        innerEl.style.boxShadow = "0 0 8px #00ff88";
      },
      galaxy: () => {
        outerEl.style.width = "20px"; outerEl.style.height = "20px";
        outerEl.style.background = "radial-gradient(circle,#c4b5fd,#7c3aed)";
        outerEl.style.border = "none";
        outerEl.style.boxShadow = "0 0 16px rgba(167,139,250,0.8),0 0 28px rgba(124,58,237,0.4)";
        innerEl.style.display = "none";
      },
      minimal: () => {
        outerEl.style.width = "30px"; outerEl.style.height = "30px";
        outerEl.style.border = "1px solid rgba(255,255,255,0.6)";
        outerEl.style.borderRadius = "0";
        outerEl.style.background = "transparent";
        outerEl.style.boxShadow = "none";
        innerEl.style.width = "3px"; innerEl.style.height = "3px";
        innerEl.style.background = "#fff";
        innerEl.style.borderRadius = "0";
        innerEl.style.boxShadow = "none";
      },
    };

    if (styles[id]) styles[id]();

    // Update dropdown buttons
    document.querySelectorAll(".cursor-option-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.cursorStyle === id);
    });
  }

  /* ── Spawn trail particles ── */
  function spawnParticle(x, y) {
    if (activeStyle === "default" || activeStyle === "minimal") return;

    const el = document.createElement("div");
    let color = "#93c5fd", txt = "", sz = 5;

    if (activeStyle === "crystal") {
      color = `hsl(${200 + Math.random() * 40},80%,${70 + Math.random() * 20}%)`;
      txt = ["◆","◇","✦","·"][Math.floor(Math.random() * 4)];
      sz = Math.random() * 8 + 4;
    } else if (activeStyle === "sparkle") {
      color = ["#facc15","#fde68a","#fbbf24","#fff"][Math.floor(Math.random() * 4)];
      txt = ["✦","★","✧","✸","·"][Math.floor(Math.random() * 5)];
      sz = Math.random() * 10 + 6;
    } else if (activeStyle === "comet") {
      color = `hsl(${240 + Math.random() * 30},70%,${60 + Math.random() * 30}%)`;
      sz = Math.random() * 5 + 2;
    } else if (activeStyle === "rainbow") {
      color = RAINBOW_COLORS[rainbowIdx % RAINBOW_COLORS.length];
      rainbowIdx++;
      sz = Math.random() * 7 + 4;
    } else if (activeStyle === "snow") {
      color = "rgba(219,234,254,0.9)";
      txt = ["❄","·","*"][Math.floor(Math.random() * 3)];
      sz = Math.random() * 8 + 4;
    } else if (activeStyle === "fire") {
      const t = Math.random();
      color = t < 0.4 ? "#fbbf24" : t < 0.7 ? "#f97316" : "#ef4444";
      sz = Math.random() * 8 + 3;
    } else if (activeStyle === "neon") {
      color = ["#00ff88","#00ffcc","#39ff14"][Math.floor(Math.random() * 3)];
      sz = Math.random() * 5 + 2;
    } else if (activeStyle === "galaxy") {
      color = ["#c4b5fd","#a78bfa","#ddd6fe","#fff","#e9d5ff"][Math.floor(Math.random() * 5)];
      txt = ["·","✦","*"][Math.floor(Math.random() * 3)];
      sz = Math.random() * 7 + 3;
    }

    const vx = (Math.random() - 0.5) * 2.5;
    const vy = (Math.random() - 0.5) * 2.5 - 0.8;
    const dur = Math.random() * 400 + 350;

    el.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      width:${sz}px;height:${sz}px;border-radius:50%;
      background:${color};pointer-events:none;z-index:999996;
      transform:translate(-50%,-50%);opacity:0.9;
      font-size:${sz + 2}px;line-height:1;color:${color};
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 ${sz}px ${color};
    `;
    if (txt) el.textContent = txt;
    document.body.appendChild(el);

    let px = x, py = y, frame = 0;
    const maxFrames = dur / 16;

    function animateParticle() {
      frame++;
      px += vx;
      py += vy + (activeStyle === "snow" ? 0.4 : -0.1);
      el.style.left = px + "px";
      el.style.top = py + "px";
      el.style.opacity = String(0.9 * (1 - frame / maxFrames));
      if (frame < maxFrames) requestAnimationFrame(animateParticle);
      else el.remove();
    }
    requestAnimationFrame(animateParticle);
  }

  /* ── Animation loop ── */
  function startLoop() {
    function tick() {
      requestAnimationFrame(tick);
      if (activeStyle === "default" || !outerEl) return;

      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;

      outerEl.style.left = outerX + "px";
      outerEl.style.top  = outerY + "px";

      if (innerEl && innerEl.style.display !== "none") {
        innerEl.style.left = mouseX + "px";
        innerEl.style.top  = mouseY + "px";
      }

      // Rainbow color update
      if (activeStyle === "rainbow") {
        const c = RAINBOW_COLORS[Math.floor(Date.now() / 80) % RAINBOW_COLORS.length];
        outerEl.style.background = c;
        outerEl.style.boxShadow = `0 0 10px ${c}`;
      }
    }
    tick();
  }

  /* ── Build navbar dropdown ── */
  function buildDropdown() {
    if (document.getElementById("cursorStyleDropdown")) return null;

    // Inject CSS
    if (!document.getElementById("cursorSystemCSS")) {
      const s = document.createElement("style");
      s.id = "cursorSystemCSS";
      s.textContent = `
        .cursor-switcher-container{position:relative;display:inline-block}
        .cursor-option-btn.active{
          background:var(--accent-dim,rgba(59,130,246,0.1))!important;
          color:var(--accent,#3b82f6)!important;font-weight:600!important
        }
        .cursor-option-btn.active::after{content:"✓";margin-left:auto;font-size:0.75rem}
        @media(pointer:coarse){.cursor-switcher-container{display:none!important}}
      `;
      document.head.appendChild(s);
    }

    const container = document.createElement("div");
    container.className = "cursor-switcher-container";

    const toggle = document.createElement("button");
    toggle.id = "cursorStyleToggle";
    toggle.className = "btn btn-ghost btn-sm";
    toggle.setAttribute("aria-haspopup", "true");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Change cursor style");
    toggle.style.cssText = "display:inline-flex;align-items:center;gap:6px;white-space:nowrap;";
    toggle.innerHTML = `<i class="fas fa-sparkles" aria-hidden="true"></i> Cursor <i class="fas fa-chevron-down" style="font-size:0.6rem;opacity:0.7" aria-hidden="true"></i>`;

    const panel = document.createElement("div");
    panel.id = "cursorStyleDropdown";
    panel.setAttribute("role", "menu");
    panel.style.cssText = `
      display:none;position:absolute;top:calc(100% + 8px);right:0; transform:translateX(-55px);
      min-width:190px;background:var(--bg-elevated,#111315);
      border:1px solid var(--border,#1b1f24);border-radius:12px;
      padding:6px;box-shadow:0 16px 40px rgba(0,0,0,0.4);
      z-index:9999999;backdrop-filter:blur(12px);
    `;

    const hdr = document.createElement("div");
    hdr.style.cssText = "padding:6px 10px 8px;font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted,#768496);border-bottom:1px solid var(--border,#1b1f24);margin-bottom:4px;";
    hdr.textContent = "Cursor Style";
    panel.appendChild(hdr);

    CURSOR_STYLES.forEach(style => {
      const btn = document.createElement("button");
      btn.className = "cursor-option-btn";
      btn.dataset.cursorStyle = style.id;
      btn.setAttribute("role", "menuitem");
      btn.style.cssText = "width:100%;display:flex;align-items:center;gap:10px;padding:7px 10px;background:transparent;border:none;border-radius:8px;color:var(--text-secondary,#8b97a8);font-family:inherit;font-size:0.825rem;font-weight:500;cursor:pointer;text-align:left;transition:background 0.15s,color 0.15s;";
      btn.innerHTML = `<i class="fas ${style.icon}" style="width:14px;text-align:center;font-size:0.75rem;" aria-hidden="true"></i>${style.label}`;

      btn.addEventListener("mouseover", () => {
        if (!btn.classList.contains("active")) {
          btn.style.background = "var(--bg-surface,#161a1e)";
          btn.style.color = "var(--text-primary,#f0f4f8)";
        }
      });
      btn.addEventListener("mouseout", () => {
        if (!btn.classList.contains("active")) {
          btn.style.background = "transparent";
          btn.style.color = "var(--text-secondary,#8b97a8)";
        }
      });
      btn.addEventListener("click", () => { applyStyle(style.id); closePanel(); });
      panel.appendChild(btn);
    });

    container.appendChild(toggle);
    container.appendChild(panel);

    function openPanel() { panel.style.display = "block"; toggle.setAttribute("aria-expanded","true"); }
    function closePanel() { panel.style.display = "none"; toggle.setAttribute("aria-expanded","false"); }

    toggle.addEventListener("click", e => {
      e.stopPropagation();
      panel.style.display === "none" ? openPanel() : closePanel();
    });
    document.addEventListener("click", () => closePanel());
    document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });

    return container;
  }

  /* ── Inject into navbar ── */
  function injectIntoNavbar() {
    const dropdown = buildDropdown();
    if (!dropdown) return;

    const targets = [".nav-buttons", "#navButtons"];
    for (const sel of targets) {
      const el = document.querySelector(sel);
      if (el) { el.insertBefore(dropdown, el.firstChild); return; }
    }
    const navbar = document.querySelector(".navbar, nav, header");
    if (navbar) navbar.appendChild(dropdown);
  }

  /* ── Mouse events ── */
  function onMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isEnabled && activeStyle !== "default" && outerEl) {
      outerEl.classList.add("is-visible");
      if (innerEl) innerEl.classList.add("is-visible");
    }

    const now = Date.now();
    if (now - lastParticle > 25) {
      lastParticle = now;
      spawnParticle(mouseX, mouseY);
    }
  }

  /* ── Init ── */
  function init() {
    if (isMobile) return;

    // Check enabled state
    isEnabled = getEnabled();

    ensureCursorElements();
    startLoop();

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", () => {
      if (outerEl) outerEl.classList.remove("is-visible");
      if (innerEl) innerEl.classList.remove("is-visible");
    });

    const saved = getSaved();
    applyStyle(saved);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setTimeout(injectIntoNavbar, 600));
    } else {
      setTimeout(injectIntoNavbar, 600);
    }
  }

  // Public API for enabling/disabling cursor system
  function enableCursorSystem() {
    isEnabled = true;
    saveEnabled(true);
    applyStyle(activeStyle);
    updateCursorToggleUI();
  }

  function disableCursorSystem() {
    isEnabled = false;
    saveEnabled(false);
    document.body.style.cursor = "auto";
    if (outerEl) {
      outerEl.classList.remove("is-visible");
      outerEl.style.display = "none";
      document.body.classList.remove("custom-cursor-active");
    }
    if (innerEl) {
      innerEl.classList.remove("is-visible");
      innerEl.style.display = "none";
    }
    updateCursorToggleUI();
  }

  function updateCursorToggleUI() {
    document.querySelectorAll("#cursorToggleNav").forEach((btn) => {
      btn.innerHTML = `
        <span class="mobile-nav-icon"><i class="fas ${isEnabled ? "fa-circle-notch" : "fa-mouse-pointer"}" aria-hidden="true"></i></span>
        Cursor: ${isEnabled ? "Custom" : "Default"}
      `;
      btn.setAttribute(
        "aria-label",
        `Toggle custom cursor (currently ${isEnabled ? "Custom" : "Default"})`,
      );
    });
  }

  init();

  window.CursorSystem = { 
    apply: applyStyle, 
    styles: CURSOR_STYLES,
    enable: enableCursorSystem,
    disable: disableCursorSystem,
    updateUI: updateCursorToggleUI
  };
})();