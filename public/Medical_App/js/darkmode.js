const toggleBtn = document.getElementById("themeToggle");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        toggleBtn.textContent = "☀️";
        localStorage.setItem("theme","dark");
    } else {
        toggleBtn.textContent = "🌙";
        localStorage.setItem("theme","light");
    }
});

window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");

    if(savedTheme === "dark"){
        document.body.classList.add("dark-mode");
        toggleBtn.textContent = "☀️";
    }
});