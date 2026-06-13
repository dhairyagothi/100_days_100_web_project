const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const geoBtn = document.getElementById("geo-btn");
const statusMsg = document.getElementById("status-msg");
const weatherInfo = document.getElementById("weather-info");
const bodyBg = document.getElementById("weather-bg");

// Security-Compliant Public API Route configuration
const API_BASE = "https://api.openweathermap.org/data/2.5/weather";
const APP_KEY = "8582103934d4ff75727658f84445524d";

async function fetchWeather(queryParam) {
  statusMsg.textContent = "Syncing local atmospheric reports...";
  statusMsg.className = "status-text";
  weatherInfo.classList.add("hidden");

  try {
    const response = await fetch(
      `${API_BASE}?${queryParam}&units=metric&appid=${APP_KEY}`,
    );
    if (!response.ok) throw new Error();
    const data = await response.json();
    updateUI(data);
  } catch (err) {
    statusMsg.textContent =
      "Location match missing. Try checking city spelling!";
  }
}

function updateUI(data) {
  statusMsg.className = "hidden";

  document.getElementById("location-name").textContent =
    `${data.name}, ${data.sys.country}`;
  document.getElementById("temp-val").textContent = Math.round(data.main.temp);
  document.getElementById("weather-desc").textContent =
    data.weather[0].description;
  document.getElementById("humidity-val").textContent =
    `${data.main.humidity}%`;
  document.getElementById("wind-val").textContent = `${data.wind.speed} m/s`;

  // Process conditions to dynamically adjust theme backgrounds
  const mainCondition = data.weather[0].main.toLowerCase();
  const iconCode = data.weather[0].icon;
  const isNight = iconCode.includes("n");

  bodyBg.className = ""; // Wipe current background class references

  if (isNight) {
    bodyBg.classList.add("clear-night");
  } else if (
    mainCondition.includes("rain") ||
    mainCondition.includes("drizzle")
  ) {
    bodyBg.classList.add("rainy");
  } else if (mainCondition.includes("snow")) {
    bodyBg.classList.add("snowy");
  } else if (mainCondition.includes("cloud")) {
    bodyBg.classList.add("cloudy");
  } else {
    bodyBg.classList.add("clear-day");
  }

  weatherInfo.classList.remove("hidden");
}

function handleSearch() {
  const city = cityInput.value.trim();
  if (city) fetchWeather(`q=${encodeURIComponent(city)}`);
}

function handleGeoLocation() {
  if (!navigator.geolocation) {
    statusMsg.textContent =
      "Your browser does not support geolocation mapping services.";
    statusMsg.className = "status-text";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(`lat=${latitude}&lon=${longitude}`);
    },
    () => {
      statusMsg.textContent =
        "Location access denied. Please search by city instead.";
      statusMsg.className = "status-text";
    },
  );
}

searchBtn.addEventListener("click", handleSearch);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSearch();
});
geoBtn.addEventListener("click", handleGeoLocation);

// Default launch setup
fetchWeather("q=London");
