/* ============================================================
   pageloader.js  —  Pageloader Demo
   ============================================================ */

/* ── 1. Measure actual page load time ── */
const t0 = performance.now();

window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  const page = document.getElementById("page");
  const loadStat = document.getElementById("loadTimeStat");

  // Show real load time in the hero stat
  const elapsed = Math.round(performance.now() - t0);
  if (loadStat) loadStat.textContent = elapsed;

  // Hide preloader
  if (preloader) preloader.classList.add("hidden");

  // Fade in page
  if (page) {
    // Small delay so the fade-in is visible after preloader hides
    setTimeout(function () {
      page.classList.add("visible");
    }, 100);
  }
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

  if (!sendBtn) return;

  sendBtn.addEventListener("click", function () {
    // Basic validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
      showMsg("⚠️ Please fill in all fields before sending.", "error");
      return;
    }

    // Simulate sending (button loading state)
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";

    setTimeout(function () {
      // Clear all fields
      nameInput.value = "";
      emailInput.value = "";
      msgInput.value = "";

      // Reset button
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message";

      // Show success
      showMsg("✅ Message sent! We'll get back to you soon.", "success");
    }, 1200);
  });

  function showMsg(text, type) {
    successMsg.textContent = text;
    successMsg.className = "success-msg " + type + " show";

    // Auto-hide after 4 seconds
    setTimeout(function () {
      successMsg.classList.remove("show");
    }, 4000);
  }
});