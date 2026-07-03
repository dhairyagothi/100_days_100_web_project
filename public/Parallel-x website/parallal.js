/* Parallax scroll — only runs on index.html where the elements exist */
const text1 = document.getElementById('text1');
const leaf   = document.getElementById('leaf');
const hill5  = document.getElementById('hill5');
const hill1  = document.getElementById('hill1');
const plant  = document.getElementById('plant');
const hill4  = document.getElementById('hill4');

/* Only attach listener if parallax elements are present */
if (text1 && leaf && hill5 && hill1 && plant && hill4) {
    let ticking = false;

    function runParallax() {
        const value = window.scrollY;

        if (window.innerWidth > 768) {
            text1.style.marginTop = value * 1.5  + 'px';
            leaf.style.left       = value * 2    + 'px';
            hill1.style.top       = value * 0.25 + 'px';
            hill5.style.left      = value * 1    + 'px';
            hill4.style.left      = value * -0.75 + 'px';
            plant.style.marginTop = value * 0.5  + 'px';
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(runParallax);
            ticking = true;
        }
    }, { passive: true });
}
// ==========================
// Theme Toggle
// ==========================

// Select all theme toggle buttons
const themeToggles = document.querySelectorAll(".theme-toggle");

// Function to update button icons
function updateToggleButtons() {
  const isDark = document.body.classList.contains("dark-theme");

  themeToggles.forEach(btn => {
    btn.textContent = isDark ? "☀️" : "🌙";
  });
}

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-theme");
}

updateToggleButtons();

// Add click event to every toggle button
themeToggles.forEach(btn => {
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");

    const isDark = document.body.classList.contains("dark-theme");

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );

    updateToggleButtons();
  });
});