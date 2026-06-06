const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

themeBtn.textContent = savedTheme ===  "dark" ? "☀️" : "🌙";

themeBtn.addEventListener("click", () => {
  const currentTheme =
    document.documentElement.getAttribute("data-theme");

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  themeBtn.textContent = newTheme === "dark" ? "☀️" : "🌙";
});