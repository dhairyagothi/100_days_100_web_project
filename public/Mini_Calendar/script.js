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

// Mini calendar state
const todayRef = new Date();
let viewYear  = todayRef.getFullYear();
let viewMonth = todayRef.getMonth();

// Notes state
let notes        = JSON.parse(localStorage.getItem("calendarNotes") || "[]");
let activeFilter = "all";

// ─── Calendar ────────────────────────────────────────────────

function updateCalendar() {
  const now = new Date();

  document.getElementById("month").textContent = months[now.getMonth()];
  document.getElementById("year").textContent  = now.getFullYear();
  document.getElementById("date").textContent  = now.getDate();

  const dayEl = document.getElementById("day");
  dayEl.textContent = days[now.getDay()];
  dayEl.className   = (now.getDay() === 0 || now.getDay() === 6)
    ? "day-name weekend"
    : "day-name weekday";

  // Digital clock
  const h  = now.getHours();
  const m  = now.getMinutes();
  const s  = now.getSeconds();
  document.getElementById("clock").textContent =
    `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;

  // Analog clock hands
  const secondDeg = (s / 60) * 360;
  const minuteDeg = ((m + s / 60) / 60) * 360;
  const hourDeg   = (((h % 12) + m / 60) / 12) * 360;
  document.getElementById("secondHand").style.transform = `rotate(${secondDeg}deg)`;
  document.getElementById("minuteHand").style.transform = `rotate(${minuteDeg}deg)`;
  document.getElementById("hourHand").style.transform   = `rotate(${hourDeg}deg)`;

  // Progress bar
  const secondsIntoDay = h * 3600 + m * 60 + s;
  const percent        = (secondsIntoDay / 86400) * 100;
  document.getElementById("dayProgressFill").style.width = `${percent}%`;
  document.getElementById("dayProgressLabel").textContent =
    `${percent.toFixed(1)}% of today gone`;

  // Greeting
  let greeting;
  if      (h < 5)  greeting = "Burning the midnight oil";
  else if (h < 12) greeting = "Good morning";
  else if (h < 17) greeting = "Good afternoon";
  else if (h < 21) greeting = "Good evening";
  else             greeting = "Good night";
  document.getElementById("greeting").textContent = greeting;
}

// ─── Mini Calendar ───────────────────────────────────────────

function renderMiniCalendar() {
  const grid    = document.getElementById("miniCalGrid");
  const wkRow   = document.getElementById("miniCalWeekdays");
  const label   = document.getElementById("miniMonthYear");

  label.textContent = `${months[viewMonth]} ${viewYear}`;

  if (wkRow.childElementCount === 0) {
    weekdayShort.forEach(d => {
      const span = document.createElement("span");
      span.textContent = d;
      wkRow.appendChild(span);
    });
  }

  grid.innerHTML = "";

  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth   = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const cell = document.createElement("div");
    cell.className = "cell empty";
    grid.appendChild(cell);
  }

  const now = new Date();
  const isCurrentMonth =
    viewYear === now.getFullYear() && viewMonth === now.getMonth();

  for (let d = 1; d <= daysInMonth; d++) {
    const cell     = document.createElement("div");
    const dayOfWeek = new Date(viewYear, viewMonth, d).getDay();
    cell.className = "cell";
    cell.textContent = d;
    if (dayOfWeek === 0 || dayOfWeek === 6) cell.classList.add("weekend");
    if (isCurrentMonth && d === now.getDate()) cell.classList.add("today");
    grid.appendChild(cell);
  }
}

function goToPrevMonth() {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderMiniCalendar();
}

function goToNextMonth() {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderMiniCalendar();
}

function goToCurrentMonth() {
  const now = new Date();
  viewYear  = now.getFullYear();
  viewMonth = now.getMonth();
  renderMiniCalendar();
}

// ─── Clock Toggle ────────────────────────────────────────────

function setupClockToggle() {
  const toggleBtn = document.getElementById("clockToggle");
  const digital   = document.getElementById("clock");
  const analog    = document.getElementById("analogClock");

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

// ─── Theme Toggle ────────────────────────────────────────────

function setupThemeToggle() {
  const toggleBtn  = document.getElementById("themeToggle");
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

// ─── Notes ───────────────────────────────────────────────────

function saveNotes() {
  localStorage.setItem("calendarNotes", JSON.stringify(notes));
}

function formatTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function renderNotes() {
  const list     = document.getElementById("notesList");
  const filtered = activeFilter === "all"
    ? notes
    : notes.filter(n => n.tag === activeFilter);

  document.getElementById("noteCount").textContent = notes.length;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="notes-empty">
        <div class="notes-empty-icon">🗒️</div>
        ${activeFilter === "all"
          ? "No notes yet. Add one above!"
          : `No <strong>${activeFilter}</strong> notes yet.`}
      </div>`;
    return;
  }

  list.innerHTML = "";

  // Show newest first
  [...filtered].reverse().forEach(note => {
    const el = document.createElement("div");
    el.className = "note-item";
    el.setAttribute("data-tag", note.tag);
    el.innerHTML = `
      <div class="note-top">
        <div class="note-text">${escapeHTML(note.text).replace(/\n/g, "<br>")}</div>
        <button class="note-delete" data-id="${note.id}" title="Delete note">✕</button>
      </div>
      <div class="note-meta">
        <span class="note-tag" data-tag="${note.tag}">${note.tag}</span>
        <span class="note-time">${formatTime(note.ts)}</span>
      </div>`;
    list.appendChild(el);
  });
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function addNote() {
  const input = document.getElementById("noteInput");
  const tag   = document.getElementById("noteTag").value;
  const text  = input.value.trim();
  if (!text) return;

  notes.push({ id: Date.now(), text, tag, ts: Date.now() });
  saveNotes();
  renderNotes();
  input.value = "";
  input.focus();
}

function setupNotes() {
  document.getElementById("addNoteBtn").addEventListener("click", addNote);

  document.getElementById("noteInput").addEventListener("keydown", e => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) addNote();
  });

  document.getElementById("notesList").addEventListener("click", e => {
    const btn = e.target.closest(".note-delete");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    notes = notes.filter(n => n.id !== id);
    saveNotes();
    renderNotes();
  });

  document.getElementById("notesFilter").addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.filter;
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderNotes();
  });
}

// ─── Init ────────────────────────────────────────────────────

function init() {
  updateCalendar();
  setInterval(updateCalendar, 1000);

  renderMiniCalendar();

  document.getElementById("prevMonth").addEventListener("click", goToPrevMonth);
  document.getElementById("nextMonth").addEventListener("click", goToNextMonth);
  document.getElementById("todayBtn").addEventListener("click", goToCurrentMonth);

  setupClockToggle();
  setupThemeToggle();
  setupNotes();
  renderNotes();
}

init();