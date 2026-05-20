const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

const ampmEl = document.getElementById("ampm");

const dayNameEl = document.getElementById("day-name");
const fullDateEl = document.getElementById("full-date");

const timezoneLabel = document.getElementById("timezone-label");

const toast = document.getElementById("toast");

const alarmStatus = document.getElementById("alarm-status");

const alarmSound = document.getElementById("alarm-sound");

const alarmPopup = document.getElementById("alarm-popup");

let alarmTime = localStorage.getItem("alarmTime") || null;

let alarmTriggered = false;

function updateClock() {

  const timezone =
    document.getElementById("timezone").value;

  let now = new Date();

  if (timezone !== "local") {

    now = new Date(
      now.toLocaleString("en-US", {
        timeZone: timezone
      })
    );
  }

  let hours = now.getHours();

  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const ampm = hours >= 12 ? "PM" : "AM";

  const rawHours =
    String(hours).padStart(2, "0");

  const rawMinutes =
    String(minutes).padStart(2, "0");

  const currentTime =
    `${rawHours}:${rawMinutes}`;

  hours = hours % 12;

  if (hours === 0) {
    hours = 12;
  }

  hoursEl.textContent =
    String(hours).padStart(2, "0");

  minutesEl.textContent =
    String(minutes).padStart(2, "0");

  secondsEl.textContent =
    String(seconds).padStart(2, "0");

  ampmEl.textContent = ampm;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  dayNameEl.textContent =
    days[now.getDay()];

  fullDateEl.textContent =
    `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  timezoneLabel.textContent =
    document.getElementById("timezone")
    .selectedOptions[0].text;

  checkAlarm(currentTime);
}

function setTheme(theme) {

  const root =
    document.documentElement;

  const label =
    document.getElementById("theme-label");

  const buttons =
    document.querySelectorAll(".theme-btn");

  buttons.forEach(btn =>
    btn.classList.remove("active")
  );

  if (theme === "classic") {

    root.style.setProperty(
      "--primary",
      "#00ff99"
    );

    label.textContent =
      "CLASSIC MODE";

    document
      .querySelector(".classic-btn")
      .classList.add("active");
  }

  else if (theme === "modern") {

    root.style.setProperty(
      "--primary",
      "#3b82f6"
    );

    label.textContent =
      "MODERN MODE";

    document
      .querySelector(".modern-btn")
      .classList.add("active");
  }

  else {

    root.style.setProperty(
      "--primary",
      "#ec4899"
    );

    label.textContent =
      "FUTURISTIC MODE";

    document
      .querySelector(".futuristic-btn")
      .classList.add("active");
  }

  localStorage.setItem(
    "clockTheme",
    theme
  );
}

function toggleAlarmSection() {

  document
    .getElementById("alarm-controls")
    .classList.toggle("hidden");
}

function setAlarm() {

  const input =
    document.getElementById("alarm-time");

  if (!input.value) {

    showToast("Select alarm time");
    return;
  }

  alarmTime = input.value;

  localStorage.setItem(
    "alarmTime",
    alarmTime
  );

  alarmStatus.textContent =
    alarmTime;

  showToast(
    `Alarm set for ${alarmTime}`
  );
}

function setTheme(theme) {

  const root =
    document.documentElement;

  const label =
    document.getElementById("theme-label");

  const buttons =
    document.querySelectorAll(".theme-btn");

  const body =
    document.body;

  const card =
    document.querySelector(".clock-card");

  buttons.forEach(btn =>
    btn.classList.remove("active")
  );

  // Remove old themes
  body.classList.remove(
    "classic-theme",
    "modern-theme",
    "future-theme"
  );

  card.classList.remove(
    "classic-clock",
    "modern-clock",
    "future-clock"
  );

  if (theme === "classic") {

    root.style.setProperty(
      "--primary",
      "#00ff99"
    );

    label.textContent =
      "CLASSIC MODE";

    document
      .querySelector(".classic-btn")
      .classList.add("active");

    body.classList.add(
      "classic-theme"
    );

    card.classList.add(
      "classic-clock"
    );
  }

  else if (theme === "modern") {

    root.style.setProperty(
      "--primary",
      "#3b82f6"
    );

    label.textContent =
      "MODERN MODE";

    document
      .querySelector(".modern-btn")
      .classList.add("active");

    body.classList.add(
      "modern-theme"
    );

    card.classList.add(
      "modern-clock"
    );
  }

  else if (theme === "futuristic") {

    root.style.setProperty(
      "--primary",
      "#ec4899"
    );

    label.textContent =
      "FUTURISTIC MODE";

    document
      .querySelector(".futuristic-btn")
      .classList.add("active");

    body.classList.add(
      "future-theme"
    );

    card.classList.add(
      "future-clock"
    );
  }

  localStorage.setItem(
    "clockTheme",
    theme
  );
}


function clearAlarm() {

  localStorage.removeItem(
    "alarmTime"
  );

  alarmTime = null;

  alarmTriggered = false;

  alarmStatus.textContent =
    "Not Set";

  showToast("Alarm cleared");
}

function checkAlarm(currentTime) {

  if (
    alarmTime !== null &&
    currentTime === alarmTime &&
    !alarmTriggered
  ) {

    alarmTriggered = true;

    triggerAlarm();
  }
}

function triggerAlarm() {

  alarmPopup.classList.remove(
    "hidden"
  );

  alarmSound.loop = true;

  alarmSound.play().catch(() => {
    showToast(
      "Browser blocked audio"
    );
  });
}

function stopAlarm() {

  alarmPopup.classList.add(
    "hidden"
  );

  alarmSound.pause();

  alarmSound.currentTime = 0;

  alarmTriggered = false;

  // Remove saved alarm
  localStorage.removeItem("alarmTime");

  alarmTime = null;

  // Update UI
  alarmStatus.textContent =
    "Not Set";

  showToast("Alarm stopped");
}

function showToast(message) {

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 3000);
}

const savedTheme =
  localStorage.getItem("clockTheme")
  || "classic";

setTheme(savedTheme);

if (alarmTime) {

  alarmStatus.textContent =
    alarmTime;
}

updateClock();

setInterval(updateClock, 1000);