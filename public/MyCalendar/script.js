// ================================
// DOM Elements
// ================================
const daysContainer = document.querySelector(".calendar-grid");
const monthYearText = document.getElementById("monthYearText");
const monthImage = document.getElementById("month-image");
const noteInput = document.getElementById("noteInput");
const selectedDateText = document.getElementById("selectedDateText");
const saveBtn = document.getElementById("saveNote");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const eventTag = document.getElementById("eventTag");
const themeToggle = document.getElementById("themeToggle");
// ================================
// State
// ================================
let date = new Date();
let selectedDateKey = "";
// ================================
// Theme
// ================================
const monthImages = [
    "jan.jpg",
    "feb.jpg",
    "mar.jpg",
    "apr.jpg",
    "may.jpg",
    "jun.jpg",
    "jul.jpg",
    "aug.jpg",
    "sep.jpg",
    "oct.jpg",
    "nov.jpg",
    "dec.jpg"
];
const monthColors = [
    "#00b894",
    "#00cec9",
    "#0984e3",
    "#6c5ce7",
    "#fab1a0",
    "#ff7675",
    "#fd79a8",
    "#fdcb6e",
    "#e17055",
    "#d63031",
    "#4834d4",
    "#2d3436"
];
function updateTheme(monthIndex) {
    const color = monthColors[monthIndex];
    document.documentElement.style.setProperty(
        "--theme-color",
        color
    );
    if (!document.body.classList.contains("dark")) {
        document.body.style.background = color + "15";
    }
}
// ================================
// Dark Mode
// ================================
function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
}
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark =
        document.body.classList.contains("dark");
    themeToggle.textContent =
        isDark ? "☀️" : "🌙";
    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );
    updateTheme(date.getMonth());
});
// ================================
// Calendar
// ================================
function renderCalendar() {
    const existing =
        daysContainer.querySelectorAll(
            ".day,.empty-day"
        );
    existing.forEach((el) => el.remove());
    const month = date.getMonth();
    const year = date.getFullYear();
    monthYearText.textContent =
        `${date.toLocaleString("default", {
            month: "long",
        })} ${year}`;
    monthImage.style.backgroundImage =
        `url(images/${monthImages[month]})`;
    updateTheme(month);
    const firstDay =
        new Date(year, month, 1).getDay();
    const totalDays =
        new Date(year, month + 1, 0).getDate();
    // Blank cells
    for (let i = 0; i < firstDay; i++) {
        const empty =
            document.createElement("div");
        empty.classList.add("empty-day");
        daysContainer.appendChild(empty);
    }
    // Dates
    for (let i = 1; i <= totalDays; i++) {
        const day =
            document.createElement("div");
        day.classList.add("day");
        day.textContent = i;
        const key =
            `${year}-${month + 1}-${i}`;
        const saved =
            localStorage.getItem(key);
        if (saved) {
            const data = JSON.parse(saved);
            if (data.text)
                day.classList.add("has-note");
            if (data.tag === "festival")
                day.classList.add("festival-mark");
            if (data.tag === "event")
                day.classList.add("event-mark");
        }
        const today = new Date();
        if (
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            day.style.border =
                "2px solid var(--theme-color)";
        }
        day.addEventListener("click", () =>
            selectDate(i, key, day)
        );
        daysContainer.appendChild(day);
    }
}
// ================================
// Date Selection
// ================================
function selectDate(day, key, element) {
    document
        .querySelectorAll(".day")
        .forEach((d) =>
            d.classList.remove("active")
        );
    element.classList.add("active");
    selectedDateKey = key;
    selectedDateText.textContent = key;
    const saved =
        localStorage.getItem(key);
    if (saved) {
        const data = JSON.parse(saved);
        noteInput.value = data.text || "";
        eventTag.value = data.tag || "none";
    } else {
        noteInput.value = "";
        eventTag.value = "none";
    }
}
// ================================
// Save Notes
// ================================
saveBtn.addEventListener("click", () => {
    if (!selectedDateKey) {
        alert("Please select a date first.");
        return;
    }
    const data = {
        text: noteInput.value,
        tag: eventTag.value,
    };
    localStorage.setItem(
        selectedDateKey,
        JSON.stringify(data)
    );
    renderCalendar();
});
// ================================
// Navigation
// ================================
prevBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});
nextBtn.addEventListener("click", () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});
// ================================
// Initialize
// ================================
loadTheme();
renderCalendar();