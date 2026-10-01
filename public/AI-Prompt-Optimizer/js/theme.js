const themeToggle = document.getElementById("themeToggle");

export function initTheme() {
  loadTheme();

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const mode = document.body.classList.contains("light")
      ? "light"
      : "dark";

    localStorage.setItem("theme", mode);
    updateThemeIcon();
  });
}

function loadTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.body.classList.add("light");
  }

  updateThemeIcon();
}

function updateThemeIcon() {
  themeToggle.textContent =
    document.body.classList.contains("light")
      ? "\u2600\uFE0F"
      : "\uD83C\uDF19";
}
