const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const days = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

const weekdayShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// -----------------------------
// State for the mini month calendar
// -----------------------------
const todayRef = new Date();
let viewYear = todayRef.getFullYear();
let viewMonth = todayRef.getMonth();

// -----------------------------
// Main update loop: date, day, clock, progress bar
// -----------------------------
function updateCalendar() {
  const now = new Date();

  // Set month, year, day and date
  document.getElementById("month").textContent =
    months[now.getMonth()];

  document.getElementById("year").textContent =
    now.getFullYear();

  document.getElementById("day").textContent =
    days[now.getDay()];

  document.getElementById("date").textContent =
    now.getDate();

  // -----------------------------
  // Live Digital Clock
  // -----------------------------

  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  const hh = hours.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");

  document.getElementById("clock").textContent =
    `${hh}:${mm}:${ss}`;

  // -----------------------------
  // Analog clock hands
  // -----------------------------
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = (((hours % 12) + minutes / 60) / 12) * 360;

  document.getElementById("secondHand").style.transform =
    `rotate(${secondDeg}deg)`;
  document.getElementById("minuteHand").style.transform =
    `rotate(${minuteDeg}deg)`;
  document.getElementById("hourHand").style.transform =
    `rotate(${hourDeg}deg)`;

  // -----------------------------
  // Weekend Highlighting
  // -----------------------------

  const dayElement = document.getElementById("day");

  // Remove previous classes
  dayElement.classList.remove("weekend", "weekday");

  // Sunday = 0, Saturday = 6
  if (now.getDay() === 0 || now.getDay() === 6) {
    dayElement.classList.add("weekend");
  } else {
    dayElement.classList.add("weekday");
  }

  // -----------------------------
  // Day progress bar (how much of today has passed)
  // -----------------------------
  const secondsIntoDay = hours * 3600 + minutes * 60 + seconds;
  const percent = (secondsIntoDay / 86400) * 100;

  document.getElementById("dayProgressFill").style.width = `${percent}%`;
  document.getElementById("dayProgressLabel").textContent =
    `${percent.toFixed(1)}% of today gone`;

  // -----------------------------
  // Greeting message
  // -----------------------------
  let greeting;
  if (hours < 5) {
    greeting = "Burning the midnight oil";
  } else if (hours < 12) {
    greeting = "Good morning";
  } else if (hours < 17) {
    greeting = "Good afternoon";
  } else if (hours < 21) {
    greeting = "Good evening";
  } else {
    greeting = "Good night";
  }
  document.getElementById("greeting").textContent = greeting;
}

// -----------------------------
// Mini month calendar
// -----------------------------
function renderMiniCalendar() {
  const grid = document.getElementById("miniCalGrid");
  const weekdaysRow = document.getElementById("miniCalWeekdays");
  const label = document.getElementById("miniMonthYear");

  // Header label
  label.textContent = `${months[viewMonth]} ${viewYear}`;

  // Weekday header (only render once)
  if (weekdaysRow.childElementCount === 0) {
    weekdayShort.forEach((d) => {
      const span = document.createElement("span");
      span.textContent = d;
      weekdaysRow.appendChild(span);
    });
  }

  // Clear previous cells
  grid.innerHTML = "";

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Leading empty cells
  for (let i = 0; i < firstDayIndex; i++) {
    const cell = document.createElement("div");
    cell.className = "cell empty";
    grid.appendChild(cell);
  }

  const now = new Date();
  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.textContent = d;

    const cellDate = new Date(viewYear, viewMonth, d);
    const dayOfWeek = cellDate.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      cell.classList.add("weekend");
    }

    if (isCurrentMonth && d === now.getDate()) {
      cell.classList.add("today");
    }

    grid.appendChild(cell);
  }
}

function goToPrevMonth() {
  viewMonth--;
  if (viewMonth < 0) {
    viewMonth = 11;
    viewYear--;
  }
  renderMiniCalendar();
}

function goToNextMonth() {
  viewMonth++;
  if (viewMonth > 11) {
    viewMonth = 0;
    viewYear++;
  }
  renderMiniCalendar();
}

function goToCurrentMonth() {
  const now = new Date();
  viewYear = now.getFullYear();
  viewMonth = now.getMonth();
  renderMiniCalendar();
}

// -----------------------------
// Clock display toggle (digital / analog)
// -----------------------------
function setupClockToggle() {
  const toggleBtn = document.getElementById("clockToggle");
  const digital = document.getElementById("clock");
  const analog = document.getElementById("analogClock");

  toggleBtn.addEventListener("click", () => {
    const showingAnalog = !analog.classList.contains("hidden");

    if (showingAnalog) {
      analog.classList.add("hidden");
      digital.classList.remove("hidden");
      toggleBtn.textContent = "Show analog clock";
    } else {
      analog.classList.remove("hidden");
      digital.classList.add("hidden");
      toggleBtn.textContent = "Show digital clock";
    }
  });
}

// -----------------------------
// Theme toggle (dark / light), persisted in localStorage
// -----------------------------
function setupThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("calendarTheme");

  if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    const isLight = document.body.getAttribute("data-theme") === "light";

    if (isLight) {
      document.body.removeAttribute("data-theme");
      toggleBtn.textContent = "🌙";
      localStorage.setItem("calendarTheme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      toggleBtn.textContent = "☀️";
      localStorage.setItem("calendarTheme", "light");
    }
  });
}

// -----------------------------
// Init
// -----------------------------
function init() {
  updateCalendar();
  setInterval(updateCalendar, 1000);

  renderMiniCalendar();

  document.getElementById("prevMonth").addEventListener("click", goToPrevMonth);
  document.getElementById("nextMonth").addEventListener("click", goToNextMonth);
  document.getElementById("todayBtn").addEventListener("click", goToCurrentMonth);

  setupClockToggle();
  setupThemeToggle();
}

init();