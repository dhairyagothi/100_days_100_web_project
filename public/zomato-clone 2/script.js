// =============================
// NAVBAR SCROLL EFFECT
// =============================
const navbar = document.getElementById("navbar");

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar(); // Run on load

// =============================
// HAMBURGER MENU
// =============================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  hamburger.setAttribute("aria-expanded", isOpen);
  navbar.classList.add("scrolled"); // Keep navbar white when menu open
});

// Close mobile menu on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && mobileMenu.classList.contains("open")) {
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    updateNavbar();
  }
});

// =============================
// HERO SEARCH — SYNC LOCATION
// =============================
const heroLocationInput = document.querySelector(".location-input");
const navLocationText = document.querySelector(".location-text");

if (heroLocationInput && navLocationText) {
  heroLocationInput.addEventListener("input", () => {
    const val = heroLocationInput.value.trim();
    navLocationText.textContent = val || "Indore";
  });
}

// =============================
// APP PHONE INPUT — VALIDATION
// =============================
const appSendBtn = document.querySelector(".app-send-btn");
const appPhoneInput = document.querySelector(".app-phone-input");

if (appSendBtn && appPhoneInput) {
  appSendBtn.addEventListener("click", () => {
    const phone = appPhoneInput.value.replace(/\D/g, "");
    if (phone.length < 10) {
      appPhoneInput.style.outline = "2px solid #e23744";
      appPhoneInput.focus();
      setTimeout(() => {
        appPhoneInput.style.outline = "";
      }, 2000);
    } else {
      appSendBtn.textContent = "Link Sent!";
      appSendBtn.style.background = "#2ecc71";
      setTimeout(() => {
        appSendBtn.textContent = "Send SMS";
        appSendBtn.style.background = "";
        appPhoneInput.value = "";
      }, 3000);
    }
  });
}

// =============================
// SMOOTH KEYBOARD NAVIGATION
// =============================
document.querySelectorAll(".collection-card, .locality-card, .order-card").forEach((el) => {
  el.setAttribute("tabindex", "0");
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      el.click();
    }
  });
});