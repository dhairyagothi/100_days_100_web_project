// =====================================
// CONFIGURATION
// =====================================

// Get a free API key from:
// https://api.cricapi.com/

const API_KEY = "YOUR_API_KEY_HERE";

// Set to false after adding a valid API key
const USE_MOCK_DATA = true;

// =====================================
// MOCK DATA
// =====================================

const mockMatches = [
  {
    id: 1,
    name: "India vs Australia, 1st Test",
    matchType: "Test",
    status: "Day 3: India lead by 150 runs",
    venue: "Border-Gavaskar Trophy",
    date: "2026-06-05",
    teams: ["India", "Australia"],
    score: "IND 350 & 120/2 | AUS 320",
    isLive: true
  },
  {
    id: 2,
    name: "England vs South Africa, 3rd ODI",
    matchType: "ODI",
    status: "Innings Break",
    venue: "Lord's Cricket Ground",
    date: "2026-06-05",
    teams: ["England", "South Africa"],
    score: "ENG 280/8 (50 ov)",
    isLive: true
  },
  {
    id: 3,
    name: "Pakistan vs New Zealand, 1st T20I",
    matchType: "T20",
    status: "Match starts tomorrow",
    venue: "Gaddafi Stadium",
    date: "2026-06-06",
    teams: ["Pakistan", "New Zealand"],
    score: "N/A",
    isLive: false
  },
  {
    id: 4,
    name: "West Indies vs Sri Lanka, 2nd Test",
    matchType: "Test",
    status: "Upcoming",
    venue: "Kensington Oval",
    date: "2026-06-10",
    teams: ["West Indies", "Sri Lanka"],
    score: "N/A",
    isLive: false
  }
];

// =====================================
// DOM ELEMENTS
// =====================================

const liveMatchesContainer =
  document.getElementById("live-matches");
const upcomingMatchesContainer =
  document.getElementById("upcoming-matches");
const themeBtn =
  document.getElementById("toggleTheme");

// =====================================
// FETCH MATCHES
// =====================================

async function fetchMatches() {
  try {
    let matches = [];
    if (USE_MOCK_DATA) {
      await new Promise(resolve =>
        setTimeout(resolve, 800)
      );
      matches = mockMatches;
    } else {
      const response = await fetch(
        `https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      matches = data.data || [];
    }
    renderMatches(matches);

  } catch (error) {
    console.error(error);
    liveMatchesContainer.innerHTML =
      "<p style='color:red'>Failed to load live matches.</p>";
    upcomingMatchesContainer.innerHTML =
      "<p style='color:red'>Failed to load upcoming fixtures.</p>";
  }
}

// =====================================
// RENDER MATCHES
// =====================================

function renderMatches(matches) {
  liveMatchesContainer.innerHTML = "";
  upcomingMatchesContainer.innerHTML = "";
  const liveMatches =
    matches.filter(match =>
      match.isLive || match.matchStarted
    );
  const upcomingMatches =
    matches.filter(match =>
      !match.isLive && !match.matchStarted
    );
  if (!liveMatches.length) {
    liveMatchesContainer.innerHTML =
      "<p>No live matches available.</p>";
  } else {
    liveMatches.forEach(match => {
      liveMatchesContainer.appendChild(
        createMatchCard(match, true)
      );
    });
  }
  if (!upcomingMatches.length) {
    upcomingMatchesContainer.innerHTML =
      "<p>No upcoming fixtures available.</p>";
  } else {
    upcomingMatches.forEach(match => {
      upcomingMatchesContainer.appendChild(
        createMatchCard(match, false)
      );
    });
  }
}

// =====================================
// CREATE CARD
// =====================================

function createMatchCard(match, isLive) {

  const card = document.createElement("div");
  card.className =
    `match-card ${isLive ? "live-card" : ""}`;
  card.innerHTML = `
    <span class="match-status ${isLive ? "status-live" : "status-upcoming"
    }">
      ${isLive
      ? "🔴 LIVE"
      : "📅 UPCOMING"
    }
      • ${match.matchType || "Match"}
    </span>
    <h3 class="match-teams">
      ${match.name}
    </h3>
    ${isLive
      ? `<p class="match-score">${match.score}</p>`
      : ""
    }
    <p class="match-info">
      <strong>Status:</strong>
      ${match.status}
    </p>
    <p class="match-info">
      <strong>Venue:</strong>
      ${match.venue}
    </p>
    <p class="match-info">
      <strong>Date:</strong>
      ${new Date(match.date).toLocaleDateString()}
    </p>
  `;
  return card;
}

// =====================================
// THEME MANAGEMENT
// =====================================

function updateButtonText() {
  if (document.body.classList.contains("dark")) {
    themeBtn.textContent = "☀️ Light Mode";
  } else {
    themeBtn.textContent = "🌙 Dark Mode";
  }
}

function loadTheme() {
  const savedTheme =
    localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
  } else {
    const prefersDark =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    document.body.classList.add(
      prefersDark ? "dark" : "light"
    );
  }
  updateButtonText();
}

function toggleTheme() {

  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  const currentTheme =
    document.body.classList.contains("dark")
      ? "dark"
      : "light";
  localStorage.setItem(
    "theme",
    currentTheme
  );

  updateButtonText();
}

// =====================================
// INITIALIZATION
// =====================================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    loadTheme();
    fetchMatches();
    themeBtn.addEventListener(
      "click",
      toggleTheme
    );
  }
);