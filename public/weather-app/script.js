// OpenWeatherMap Endpoint Configuration
// Using a safe developer key for the execution thread pipeline
const API_KEY = "858d1b1df4000e47087e5b565780f2d4";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const geoBtn = document.getElementById("geoBtn");

const welcomeState = document.getElementById("welcomeState");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const weatherDisplayCard = document.getElementById("weatherDisplayCard");

const errorTitle = document.getElementById("errorTitle");
const errorMsg = document.getElementById("errorMsg");

// Weather DOM Interface Node Pointers
const cityName = document.getElementById("cityName");
const weatherDesc = document.getElementById("weatherDesc");
const tempValue = document.getElementById("tempValue");
const weatherIcon = document.getElementById("weatherIcon");
const feelsLikeValue = document.getElementById("feelsLikeValue");
const humidityValue = document.getElementById("humidityValue");
const windValue = document.getElementById("windValue");
const pressureValue = document.getElementById("pressureValue");

// Main Weather Data Processing Coordinator
async function fetchWeatherData(queryParam) {
  // Engaged view states setup layouts
  welcomeState.classList.add("hidden");
  errorState.classList.add("hidden");
  weatherDisplayCard.classList.add("hidden");
  loadingState.classList.remove("hidden");

  try {
    const url = `${BASE_URL}?${queryParam}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    // Handle 404/Invalid input criteria
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("City not found. Verify the exact spelling string.");
      } else {
        throw new Error("Unable to establish remote API connection logs.");
      }
    }

    const data = await response.json();
    populateWeatherInterface(data);
  } catch (error) {
    console.error("Weather Pipeline Exception:", error);
    triggerErrorState("Search Failure", error.message);
  }
}

// Map parameters cleanly onto DOM structural interfaces
function populateWeatherInterface(data) {
  loadingState.classList.add("hidden");
  weatherDisplayCard.classList.remove("hidden");

  // Bind metrics text values cleanly
  cityName.innerText = `${data.name}, ${data.sys.country}`;
  weatherDesc.innerText = data.weather[0].description;
  tempValue.innerText = `${Math.round(data.main.temp)}°C`;

  // Bind child metric array components
  feelsLikeValue.innerText = `${Math.round(data.main.feels_like)}°C`;
  humidityValue.innerText = `${data.main.humidity}%`;
  windValue.innerText = `${data.wind.speed} m/s`;
  pressureValue.innerText = `${data.main.pressure} hPa`;

  // Map weather codes directly onto official icon asset paths
  const iconCode = data.weather[0].icon;
  weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // Process background themes depending on climate signatures
  evaluateBackgroundTheme(data);
}

// Adaptive Background Switcher Core Logic
function evaluateBackgroundTheme(data) {
  const mainCondition = data.weather[0].main.toLowerCase();
  const iconCode = data.weather[0].icon;
  const isNight = iconCode.includes("n");
  let themeName = "default";

  if (mainCondition === "clear") {
    themeName = isNight ? "clear-night" : "clear-day";
  } else if (mainCondition === "clouds") {
    themeName = "clouds";
  } else if (
    mainCondition === "rain" ||
    mainCondition === "drizzle" ||
    mainCondition === "mist"
  ) {
    themeName = "rain";
  } else if (mainCondition === "snow") {
    themeName = "snow";
  } else if (mainCondition === "thunderstorm") {
    themeName = "thunderstorm";
  }

  document.body.setAttribute("data-theme", themeName);
}

// Native Geolocation Integration
function initiateGeolocationLookup() {
  if (!navigator.geolocation) {
    triggerErrorState(
      "Not Supported",
      "Your browser does not support native geolocation modules.",
    );
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(`lat=${lat}&lon=${lon}`);
    },
    (error) => {
      console.warn("Geolocation permission error:", error);
      triggerErrorState(
        "Access Denied",
        "Location request denied. Search for your city manually above.",
      );
    },
  );
}

// Utility Presentation view error handler
function triggerErrorState(title, description) {
  loadingState.classList.add("hidden");
  welcomeState.classList.add("hidden");
  weatherDisplayCard.classList.add("hidden");

  errorTitle.innerText = title;
  errorMsg.innerText = description;
  errorState.classList.remove("hidden");
  document.body.setAttribute("data-theme", "default");
}

// Event Bindings Configuration Panel
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const targetedCity = cityInput.value.trim();
  if (targetedCity) {
    fetchWeatherData(`q=${encodeURIComponent(targetedCity)}`);
  }
});

geoBtn.addEventListener("click", initiateGeolocationLookup);
