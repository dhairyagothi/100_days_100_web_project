// OpenWeatherMap global search endpoint reference
const OPENWEATHER_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=8f2467d3e6205844a4b1f4faaa387eb3";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const geoBtn = document.getElementById("geoBtn");
const statusMessage = document.getElementById("statusMessage");
const weatherDisplay = document.getElementById("weatherDisplay");
const appBody = document.getElementById("appBody");

const cityName = document.getElementById("cityName");
const weatherCondition = document.getElementById("weatherCondition");
const tempDisplay = document.getElementById("tempDisplay");
const weatherIcon = document.getElementById("weatherIcon");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");

// Core API query workflow engine
async function getAtmosphericMetrics(apiUrl) {
  weatherDisplay.classList.add("hidden");
  statusMessage.classList.remove("hidden");
  statusMessage.innerText = "Querying global weather systems...";

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Location reference not found.");

    const payload = await response.json();
    populateWeatherInterface(payload);
  } catch (error) {
    statusMessage.innerText =
      "Target location not recognized. Try verification checks on spelling rules.";
  }
}

// Map variables to DOM elements
function populateWeatherInterface(data) {
  statusMessage.classList.add("hidden");
  weatherDisplay.classList.remove("hidden");

  cityName.innerText = `${data.name}, ${data.sys.country}`;
  const details = data.weather[0];
  weatherCondition.innerText = details.description;
  tempDisplay.innerText = `${Math.round(data.main.temp)}°C`;
  humidityValue.innerText = `${data.main.humidity}%`;
  windValue.innerText = `${data.wind.speed} m/s`;

  // Hook up OpenWeather graphic index asset directly
  weatherIcon.src = `https://openweathermap.org/img/wn/${details.icon}@2x.png`;

  // Process conditions to inject contextual themes
  evaluateContextualTheme(details.id, details.icon);
}

// Dynamically compute layout attributes using standard weather conditions IDs
function evaluateContextualTheme(conditionId, iconId) {
  let activeTheme = "default";

  if (iconId.includes("n")) {
    activeTheme = "night";
  } else {
    if (conditionId >= 200 && conditionId < 600) {
      activeTheme = "rainy";
    } else if (conditionId >= 600 && conditionId < 700) {
      activeTheme = "snowy";
    } else if (conditionId === 800) {
      activeTheme = "sunny";
    } else {
      activeTheme = "default"; // Covers fog, clouds, and local visibility haze
    }
  }

  appBody.setAttribute("data-weather-theme", activeTheme);
}

// HTML5 Geolocation parsing
function triggerUserGeolocation() {
  if (!navigator.geolocation) {
    alert(
      "Native geolocation queries are not supported across this web browsing client.",
    );
    return;
  }

  statusMessage.classList.remove("hidden");
  statusMessage.innerText =
    "Awaiting coordinate approval metrics from user access permissions...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getAtmosphericMetrics(`${OPENWEATHER_ENDPOINT}&lat=${lat}&lon=${lon}`);
    },
    () => {
      statusMessage.innerText =
        "Location request rejected. Enter city targets inside input console block manually.";
    },
  );
}

// Operational button click event hooks
searchBtn.addEventListener("click", () => {
  const searchString = cityInput.value.trim();
  if (searchString) {
    getAtmosphericMetrics(
      `${OPENWEATHER_ENDPOINT}&q=${encodeURIComponent(searchString)}`,
    );
  }
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") searchBtn.click();
});

geoBtn.addEventListener("click", triggerUserGeolocation);

// Run a default query to display dashboard on load
getAtmosphericMetrics(`${OPENWEATHER_ENDPOINT}&q=London`);
