function updateClock() {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Digital Clock
    const digitalTime =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    document.getElementById("digitalClock").textContent = digitalTime;

    // Analog Clock
    const hourDeg = (hours % 12) * 30 + minutes * 0.5;
    const minuteDeg = minutes * 6;
    const secondDeg = seconds * 6;

    document.getElementById("hour").style.transform =
        `translateX(-50%) rotate(${hourDeg}deg)`;

    document.getElementById("minute").style.transform =
        `translateX(-50%) rotate(${minuteDeg}deg)`;

    document.getElementById("second").style.transform =
        `translateX(-50%) rotate(${secondDeg}deg)`;
}

updateClock();
setInterval(updateClock, 1000);

const toggleBtn = document.getElementById("theme-toggle");

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
}

// Toggle theme
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        toggleBtn.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        toggleBtn.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});