/* ===================================================
   accordion.js — Zomato Clone Main JS
   =================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ────────────────────────────────────────────────
     1. ACCORDION
  ──────────────────────────────────────────────── */
  const accordionContainers = document.querySelectorAll(".accordion-container");

  accordionContainers.forEach((container) => {
    container.addEventListener("click", function () {
      const data = this.nextElementSibling;
      const icon = this.querySelector("i.fa-chevron-down");

      // Close all others
      accordionContainers.forEach((other) => {
        if (other !== this) {
          other.nextElementSibling.classList.remove("show");
          const otherIcon = other.querySelector("i.fa-chevron-down");
          if (otherIcon) otherIcon.classList.remove("animate");
        }
      });

      data.classList.toggle("show");
      if (icon) icon.classList.toggle("animate");
    });
  });

  /* ────────────────────────────────────────────────
     2. LOCATION DROPDOWN
  ──────────────────────────────────────────────── */
  const states = [
    "Andhra Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Delhi NCR",
    "Goa",
    "Gujarat",
    "Hyderabad",
    "Jaipur",
    "Karnataka",
    "Kerala",
    "Kolkata",
    "Lucknow",
    "Maharashtra",
    "Mumbai",
    "Noida",
    "Pune",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const locationInput = document.querySelector(".location-input");
  const dropdown = document.querySelector(".location-dropdown");
  const toggleBtn = document.querySelector(".dropdown-toggle");

  if (locationInput && dropdown) {
    function renderDropdown(list) {
      dropdown.innerHTML = "";
      if (list.length === 0) {
        dropdown.innerHTML = `<div class="dropdown-item" style="color:var(--text-muted)">No results found</div>`;
        return;
      }
      list.forEach((state) => {
        const item = document.createElement("div");
        item.classList.add("dropdown-item");
        item.textContent = state;
        item.addEventListener("click", () => {
          locationInput.value = state;
          dropdown.classList.add("hidden");
        });
        dropdown.appendChild(item);
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        renderDropdown(states);
        dropdown.classList.toggle("hidden");
      });
    }

    locationInput.addEventListener("input", () => {
      const val = locationInput.value.toLowerCase();
      const filtered = states.filter((s) => s.toLowerCase().includes(val));
      renderDropdown(filtered);
      dropdown.classList.remove("hidden");
    });

    locationInput.addEventListener("focus", () => {
      renderDropdown(states);
      dropdown.classList.remove("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".location")) {
        dropdown.classList.add("hidden");
      }
    });
  }

  /* ────────────────────────────────────────────────
     3. SEARCH FUNCTIONALITY
  ──────────────────────────────────────────────── */
  window.searchFood = function () {
    const val = document.getElementById("searchInput")?.value?.trim();
    if (!val) {
      showToast("Please enter something to search!");
      return;
    }
    showToast(`Searching for: "${val}"`);
  };

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") window.searchFood();
    });
  }

  window.handleLocation = function (event) {
    if (event.key === "Enter") {
      const loc = document.getElementById("locationInput")?.value?.trim();
      if (!loc) {
        showToast("Please enter a location!");
        return;
      }
      showToast(`Location set: ${loc}`);
    }
  };

  /* ────────────────────────────────────────────────
     4. DARK MODE TOGGLE
  ──────────────────────────────────────────────── */
  const darkBtn = document.getElementById("darkModeToggle");

  function applyTheme(isDark) {
    if (isDark) {
      document.body.classList.add("dark-mode");
      if (darkBtn) darkBtn.textContent = "☀️ Light Mode";
    } else {
      document.body.classList.remove("dark-mode");
      if (darkBtn) darkBtn.textContent = "🌙 Dark Mode";
    }
  }

  // Load saved preference
  const savedTheme = localStorage.getItem("zomato-theme");
  applyTheme(savedTheme === "dark");

  if (darkBtn) {
    darkBtn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      applyTheme(!isDark);
      localStorage.setItem("zomato-theme", isDark ? "light" : "dark");
    });
  }

  /* ────────────────────────────────────────────────
     5. MOBILE NAV TOGGLE
  ──────────────────────────────────────────────── */
  window.toggleMobileNav = function () {
    const nav = document.getElementById("mobileNav");
    const btn = document.getElementById("hamburgerBtn");
    if (!nav) return;
    nav.classList.toggle("mobile-open");
    if (btn) btn.classList.toggle("active");
  };

  // Close on nav link click
  document.querySelectorAll("#mobileNav .nav-item a").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("mobileNav")?.classList.remove("mobile-open");
      document.getElementById("hamburgerBtn")?.classList.remove("active");
    });
  });

  /* ────────────────────────────────────────────────
     6. TOAST NOTIFICATION HELPER
  ──────────────────────────────────────────────── */
  function showToast(message, duration = 2800) {
    // Remove existing
    document.querySelector(".z-toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "z-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
      position: "fixed",
      bottom: "2.4rem",
      left: "50%",
      transform: "translateX(-50%) translateY(20px)",
      background: "#1c1c1c",
      color: "#fff",
      padding: "1.2rem 2.2rem",
      borderRadius: "99px",
      fontSize: "1.45rem",
      fontFamily: "Outfit, sans-serif",
      fontWeight: "400",
      boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
      zIndex: "99999",
      opacity: "0",
      transition: "opacity 0.25s ease, transform 0.25s ease",
      whiteSpace: "nowrap",
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(0)";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(-50%) translateY(12px)";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ────────────────────────────────────────────────
     7. STICKY NAVBAR on scroll
  ──────────────────────────────────────────────── */
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        header.style.position = "fixed";
        header.style.top = "0";
        header.style.background = document.body.classList.contains("dark-mode")
          ? "rgba(15,15,15,0.97)"
          : "rgba(226,55,68,0.97)";
        header.style.backdropFilter = "blur(12px)";
        header.style.boxShadow = "0 2px 20px rgba(0,0,0,0.15)";
      } else {
        header.style.position = "absolute";
        header.style.background = "transparent";
        header.style.backdropFilter = "";
        header.style.boxShadow = "";
      }
    });
  }
});
