const jokeEl = document.getElementById("joke");
const jokeBtn = document.getElementById("jokeBtn");

const generateJoke = async () => {
  const config = {
    headers: { Accept: "application/json" },
  };
  const res = await fetch("https://icanhazdadjoke.com/", config);
  const data = await res.json();
  jokeEl.innerHTML = data.joke;

  // Fetching with .then()
  //   fetch("https://icanhazdadjoke.com/", config)
  //     .then((res) => res.json())
  //     .then((data) => (jokeEl.innerHTML = data.joke));
};

generateJoke();

jokeBtn.addEventListener("click", () => generateJoke());

// ==========================
// Theme Toggle (Global)
// ==========================

// Select all toggle buttons (use a common class)
const themeToggles = document.querySelectorAll(".theme");
const themeIcon = document.getElementById("themeIcon");

// Default = DARK MODE
let isLightMode = JSON.parse(localStorage.getItem("lightMode")) || false;

// Apply theme on load
function updateTheme() {
  if (isLightMode) {
    document.body.classList.add("light-theme");
    themeIcon.textContent = "🌙"; // show moon when light mode active
  } else {
    document.body.classList.remove("light-theme");
    themeIcon.textContent = "☀️"; // show sun when dark mode active
  }
}

// Toggle theme on any button click
themeToggles.forEach(btn => {
  btn.addEventListener("click", () => {
    isLightMode = !isLightMode;
    localStorage.setItem("lightMode", JSON.stringify(isLightMode));
    updateTheme();
  });
});

// Initialize on page load
updateTheme();
