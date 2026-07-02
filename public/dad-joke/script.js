const jokeEl = document.getElementById("joke");
const jokeBtn = document.getElementById("jokeBtn");

const generateJoke = async () => {
    try {
        const config = {
            headers: { Accept: "application/json" },
        };
        const res = await fetch("https://icanhazdadjoke.com/", config);
        const data = await res.json();
        jokeEl.innerHTML = data.joke;
    } catch (error) {
        jokeEl.innerHTML = "Oops! Couldn't fetch a joke 😅";
        console.error("Joke fetch error:", error);
    }
};

// Load initial joke
generateJoke();

jokeBtn.addEventListener("click", generateJoke);

// ==========================
// Theme Toggle
// ==========================
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// Default: dark mode (false = dark)
let isLightMode = JSON.parse(localStorage.getItem("lightMode")) || false;

function updateTheme() {
    if (isLightMode) {
        document.body.classList.add("light-mode");
        themeIcon.textContent = "🌙"; // moon for light mode
    } else {
        document.body.classList.remove("light-mode");
        themeIcon.textContent = "☀️"; // sun for dark mode
    }
}

themeToggle.addEventListener("click", () => {
    isLightMode = !isLightMode;
    localStorage.setItem("lightMode", JSON.stringify(isLightMode));
    updateTheme();
});

// Initialize theme on page load
updateTheme();