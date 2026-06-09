// You can get a free API key from https://api.cricapi.com/
const API_KEY = 'YOUR_API_KEY_HERE'; 
const USE_MOCK_DATA = true; // Set to false when you insert your real API key

// Mock Data for demonstration purposes
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

// Select DOM elements
const liveMatchesContainer = document.getElementById('live-matches');
const upcomingMatchesContainer = document.getElementById('upcoming-matches');

// Fetch Match Data
const fetchMatches = async () => {
  try {
    let matches = [];

    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      matches = mockMatches;
    } else {
      // Real API Call Implementation (CricAPI example)
      const response = await fetch(`https://api.cricapi.com/v1/currentMatches?apikey=${API_KEY}&offset=0`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      matches = data.data; // Adjust based on exact API response structure
    }

    renderMatches(matches);
  } catch (error) {
    console.error("Error fetching cricket scores:", error);
    liveMatchesContainer.innerHTML = `<p style="color: red;">Error loading matches. Please try again later.</p>`;
    upcomingMatchesContainer.innerHTML = `<p style="color: red;">Error loading fixtures. Please try again later.</p>`;
  }
};

// Render Matches to the DOM
const renderMatches = (matches) => {
  liveMatchesContainer.innerHTML = '';
  upcomingMatchesContainer.innerHTML = '';

  const liveMatches = matches.filter(match => match.isLive || match.matchStarted);
  const upcomingMatches = matches.filter(match => !match.isLive && !match.matchStarted);

  if (liveMatches.length === 0) {
    liveMatchesContainer.innerHTML = '<p>No live matches at the moment.</p>';
  } else {
    liveMatches.forEach(match => {
      liveMatchesContainer.appendChild(createMatchCard(match, true));
    });
  }

  if (upcomingMatches.length === 0) {
    upcomingMatchesContainer.innerHTML = '<p>No upcoming fixtures found.</p>';
  } else {
    upcomingMatches.forEach(match => {
      upcomingMatchesContainer.appendChild(createMatchCard(match, false));
    });
  }
};

// Create HTML Card for a Match
const createMatchCard = (match, isLive) => {
  const card = document.createElement('div');
  card.className = `match-card ${isLive ? 'live-card' : ''}`;

  // Use mock data properties or adapt to your specific API's property names
  const matchName = match.name || `${match.teams[0]} vs ${match.teams[1]}`;
  const matchStatus = match.status || 'Scheduled';
  const matchScore = match.score || 'Score pending';
  const venue = match.venue || 'TBA';
  const date = new Date(match.date || match.dateTimeGMT).toLocaleDateString();

  card.innerHTML = `
    <span class="match-status ${isLive ? 'status-live' : 'status-upcoming'}">
      ${isLive ? '🔴 LIVE' : '📅 UPCOMING'} - ${match.matchType || 'Match'}
    </span>
    <h3 class="match-teams">${matchName}</h3>
    ${isLive ? `<p class="match-score">${matchScore}</p>` : ''}
    <p class="match-info"><strong>Status:</strong> ${matchStatus}</p>
    <p class="match-info"><strong>Venue:</strong> ${venue}</p>
    <p class="match-info"><strong>Date:</strong> ${date}</p>
  `;

  return card;
};

// Initialize App
document.addEventListener('DOMContentLoaded', fetchMatches);