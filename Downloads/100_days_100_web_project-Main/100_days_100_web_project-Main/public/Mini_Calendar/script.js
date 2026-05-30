const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const days = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

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

  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  document.getElementById("clock").textContent =
    `${hours}:${minutes}:${seconds}`;

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
}

// Run immediately
updateCalendar();

// Update every second
setInterval(updateCalendar, 1000);