// DOM Element Binding
const issLatElement = document.getElementById("iss-lat");
const issLngElement = document.getElementById("iss-lng");
const astronautList = document.getElementById("astronaut-list");
const launchContainer = document.getElementById("launch-container");

// Global arrays for running interval countdown execution loops
let activeCountdowns = [];

// 1. ISS Tracking Loop Engine
async function updateISSLocation() {
  try {
    const response = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );

    const data = await response.json();

    issLatElement.textContent = data.latitude.toFixed(4);
    issLngElement.textContent = data.longitude.toFixed(4);

  } catch (error) {
    console.error("ISS Error:", error);
  }
}

async function fetchCrewMetadata() {
  astronautList.innerHTML =
    "<li>ISS Crew Data Currently Unavailable</li>";
}

// 2. International Space Flight Launch Feed Engine
async function fetchSpaceflightSchedule() {
  try {
    const response = await fetch(
      "https://lldev.thespacedevs.com/2.2.0/launch/upcoming/?limit=3",
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      launchContainer.innerHTML = "";
      activeCountdowns.forEach((id) => clearInterval(id));
      activeCountdowns = [];

      data.results.forEach((launch, index) => {
        renderLaunchCard(launch, index);
      });
    } else {
      launchContainer.innerHTML =
        '<div class="loading-placeholder">No upcoming international launch data loaded.</div>';
    }
  } catch (error) {
    launchContainer.innerHTML =
      '<div class="loading-placeholder">Network exception processing schedule feeds.</div>';
  }
}

function renderLaunchCard(launch, index) {
  const launchItem = document.createElement("div");
  launchItem.className = "launch-item";

  const missionName = launch.mission
    ? launch.mission.name
    : "Unknown Research Mission";
  const rocketName =
    launch.rocket && launch.rocket.configuration
      ? launch.rocket.configuration.name
      : "Orbital Carrier System";
  const padLocation =
    launch.pad && launch.pad.location
      ? launch.pad.location.name
      : "International Launch Complex";

  const targetTimestamp = new Date(launch.net).getTime();
  const clockId = `countdown-clock-${index}`;

  launchItem.innerHTML = `
        <div class="launch-header">
            <span class="mission-name">${missionName}</span>
            <span class="rocket-tag">${rocketName}</span>
        </div>
        <div class="launch-details">
            <p><strong>Pad Site:</strong> ${padLocation}</p>
        </div>
        <div class="countdown-wrapper">
            <span class="countdown-label">T-Minus Window:</span>
            <span class="countdown-clock" id="${clockId}">00d 00h 00m 00s</span>
        </div>
    `;

  launchContainer.appendChild(launchItem);
  initializeClock(clockId, targetTimestamp);
}

function initializeClock(elementId, targetTime) {
  function runTimer() {
    const now = new Date().getTime();
    const difference = targetTime - now;

    const clockElement = document.getElementById(elementId);
    if (!clockElement) return;

    if (difference <= 0) {
      clockElement.textContent = "LIFTOFF / IN FLIGHT";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    clockElement.textContent =
      `${days.toString().padStart(2, "0")}d ` +
      `${hours.toString().padStart(2, "0")}h ` +
      `${minutes.toString().padStart(2, "0")}m ` +
      `${seconds.toString().padStart(2, "0")}s`;
  }

  runTimer();
  const intervalId = setInterval(runTimer, 1000);
  activeCountdowns.push(intervalId);
}

// Initialize Application Lifecycles
updateISSLocation();
fetchCrewMetadata();
fetchSpaceflightSchedule();

// Setup explicit background recurrence routines for coordinate refreshing
setInterval(updateISSLocation, 5000);
