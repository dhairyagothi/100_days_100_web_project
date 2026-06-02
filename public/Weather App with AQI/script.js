// ─── API Configuration ──────────────────────────────────────────────────────
// Replace the placeholder below with your OpenWeatherMap API key.
// Get a free key at: https://home.openweathermap.org/api_keys
const API_KEY = "fc599e64b024416ecff5d2119f2e5aa2";

// ─── State ──────────────────────────────────────────────────────────────────
let lastAQI = null;
let currentRequestId = 0; // Guards against race conditions from rapid searches

// ─── DOM References ─────────────────────────────────────────────────────────
const cityInput = document.getElementById("cityInput");
const errorMessage = document.getElementById("errorMessage");
const locationEl = document.getElementById("location");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLikeEl = document.getElementById("feelsLike");
const sunriseEl = document.getElementById("sunrise");
const sunsetEl = document.getElementById("sunset");
const hourlyForecastEl = document.getElementById("hourlyForecast");

const aqiValue = document.getElementById("aqiValue");
const aqiStatus = document.getElementById("aqiStatus");
const aqiRecommendation = document.getElementById("aqiRecommendation");
const aqiTrend = document.getElementById("aqiTrend");
const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");
const no2 = document.getElementById("no2");
const so2 = document.getElementById("so2");
const o3 = document.getElementById("o3");
const co = document.getElementById("co");
const greetingEl = document.getElementById("greeting");
const loadingOverlay = document.getElementById("loadingOverlay");

// ─── Greeting ───────────────────────────────────────────────────────────────
function updateGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) greetingEl.innerText = "Good Morning";
  else if (hour >= 12 && hour < 17) greetingEl.innerText = "Good Afternoon";
  else greetingEl.innerText = "Good Evening";
}
updateGreeting();
setInterval(updateGreeting, 60 * 60 * 1000);

// ─── Enter-key support ─────────────────────────────────────────────────────
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather();
  }
});

// ─── Helpers: loading & errors ──────────────────────────────────────────────
function showLoading() {
  if (loadingOverlay) loadingOverlay.classList.add("visible");
}

function hideLoading() {
  if (loadingOverlay) loadingOverlay.classList.remove("visible");
}

function showError(msg) {
  errorMessage.innerText = msg;
}

function clearError() {
  errorMessage.innerText = "";
}

/**
 * Validates the API key is not the placeholder default.
 * Returns true if the key looks usable.
 */
function isApiKeyConfigured() {
  return (
    API_KEY &&
    API_KEY !== "Insert Your API Key" &&
    API_KEY.trim().length > 0
  );
}

/**
 * Wraps fetch with status-code validation.
 * Throws a descriptive Error for non-2xx responses.
 */
async function safeFetch(url) {
  const res = await fetch(url);

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(
        "API key is invalid or not yet activated. New OpenWeatherMap keys can take up to 2 hours to activate. Please wait and try again.",
      );
    }
    if (res.status === 404) {
      throw new Error("The requested data could not be found.");
    }
    if (res.status === 429) {
      throw new Error(
        "API rate limit reached. Please wait a moment and try again.",
      );
    }
    throw new Error(`API request failed (HTTP ${res.status}).`);
  }

  return res.json();
}

// ─── Main entry point ───────────────────────────────────────────────────────
async function getWeather() {
  const city = cityInput.value.trim();
  clearError();

  // Input validation
  if (!city) {
    showError("Please enter a city name.");
    return;
  }

  // API key validation
  if (!isApiKeyConfigured()) {
    showError(
      "API key is not configured. Please set a valid OpenWeatherMap API key in script.js.",
    );
    return;
  }

  // Increment request ID to cancel stale responses (race-condition guard)
  const requestId = ++currentRequestId;

  showLoading();

  try {
    // ── Geocoding ──────────────────────────────────────────────────────────
    const encodedCity = encodeURIComponent(city);
    const loc = await safeFetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodedCity}&limit=1&appid=${API_KEY}`,
    );

    // Stale-response check
    if (requestId !== currentRequestId) return;

    if (!Array.isArray(loc) || loc.length === 0) {
      showError(`No results found for "${city}". Please check the city name.`);
      resetUI();
      hideLoading();
      return;
    }

    const { lat, lon, name, state, country } = loc[0];
    locationEl.innerText =
      name + (state ? ", " + state : "") + ", " + getCountryName(country);

    // ── Parallel weather & AQI fetch ───────────────────────────────────────
    await Promise.all([
      fetchWeather(lat, lon, requestId),
      fetchAQI(lat, lon, requestId),
    ]);
  } catch (err) {
    if (requestId !== currentRequestId) return;
    showError(err.message || "Failed to fetch location data. Please try again.");
    resetUI();
  } finally {
    if (requestId === currentRequestId) hideLoading();
  }
}

// ─── Weather + 5-hour forecast ──────────────────────────────────────────────
async function fetchWeather(lat, lon, requestId) {
  try {
    // Current weather
    const d = await safeFetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
    );

    if (requestId !== currentRequestId) return;

    // Safe property access — guard against malformed responses
    temperature.innerText = d.main?.temp != null
      ? `${Math.round(d.main.temp)}°C`
      : "--";

    condition.innerText = d.weather?.[0]?.description ?? "--";
    humidity.innerText = d.main?.humidity != null ? d.main.humidity + "%" : "--";
    wind.innerText = d.wind?.speed != null
      ? (d.wind.speed * 3.6).toFixed(1) + " km/h"
      : "--";

    feelsLikeEl.innerText = d.main?.feels_like != null
      ? `${Math.round(d.main.feels_like)}°C - ${getFeelsLikeComment(d.main.feels_like)}`
      : "--";

    sunriseEl.innerText = d.sys?.sunrise
      ? new Date(d.sys.sunrise * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";

    sunsetEl.innerText = d.sys?.sunset
      ? new Date(d.sys.sunset * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";
  } catch (err) {
    if (requestId !== currentRequestId) return;
    console.error("Weather fetch error:", err);
    showError("Failed to load weather data. " + (err.message || ""));
  }

  // Hourly forecast (independent — errors here don't block weather)
  try {
    const forecast = await safeFetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=5&appid=${API_KEY}`,
    );

    if (requestId !== currentRequestId) return;

    hourlyForecastEl.innerHTML = "";

    if (forecast.list && Array.isArray(forecast.list)) {
      forecast.list.forEach((item) => {
        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main?.temp ?? 0);
        const icon = item.weather?.[0]?.icon ?? "01d";
        // Use HTTPS to avoid mixed-content blocking
        const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        const div = document.createElement("div");
        div.innerHTML = `<div><div>${hour}:00</div><img src="${iconUrl}" alt="weather icon"><span class="temp">${temp}°C</span></div>`;
        hourlyForecastEl.appendChild(div);
      });
    }
  } catch (err) {
    if (requestId !== currentRequestId) return;
    console.error("Forecast fetch error:", err);
    // Non-critical — don't overwrite a previous weather error
  }
}

// ─── AQI ────────────────────────────────────────────────────────────────────
async function fetchAQI(lat, lon, requestId) {
  try {
    const d = await safeFetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
    );

    if (requestId !== currentRequestId) return;

    if (!d.list || !d.list[0] || !d.list[0].components) {
      aqiValue.innerText = "--";
      aqiStatus.innerText = "Data unavailable";
      aqiRecommendation.innerText = "--";
      aqiTrend.innerText = "--";
      return;
    }

    const c = d.list[0].components;
    const aqi = calculateUSAQI(c.pm2_5 ?? 0);

    aqiValue.innerText = aqi;
    aqiStatus.innerText = getAQIStatus(aqi);
    aqiRecommendation.innerText = getAQIRecommendation(aqi);
    aqiTrend.innerText =
      lastAQI === null
        ? "Trend data unavailable"
        : aqi > lastAQI
          ? "AQI worsening"
          : aqi < lastAQI
            ? "AQI improving"
            : "AQI stable";
    lastAQI = aqi;

    const color = getAQIColor(aqi);
    aqiValue.style.color = color;
    aqiStatus.style.color = color;

    pm25.innerText = c.pm2_5 != null ? c.pm2_5 + " µg/m³" : "--";
    pm10.innerText = c.pm10 != null ? c.pm10 + " µg/m³" : "--";
    no2.innerText = c.no2 != null ? c.no2 + " µg/m³" : "--";
    so2.innerText = c.so2 != null ? c.so2 + " µg/m³" : "--";
    o3.innerText = c.o3 != null ? c.o3 + " µg/m³" : "--";
    co.innerText = c.co != null ? c.co + " µg/m³" : "--";
  } catch (err) {
    if (requestId !== currentRequestId) return;
    console.error("AQI fetch error:", err);
    aqiValue.innerText = "--";
    aqiStatus.innerText = "Failed to load";
    aqiRecommendation.innerText = "--";
    aqiTrend.innerText = "--";
  }
}

// ─── Helper functions ───────────────────────────────────────────────────────
function getFeelsLikeComment(temp) {
  if (temp <= 0) return "Freezing";
  if (temp <= 10) return "Cold";
  if (temp <= 20) return "Cool";
  if (temp <= 30) return "Warm";
  if (temp <= 35) return "Hot";
  return "Scorching";
}

function calculateUSAQI(pm25) {
  const bp = [
    [0, 12, 0, 50],
    [12.1, 35.4, 51, 100],
    [35.5, 55.4, 101, 150],
    [55.5, 150.4, 151, 200],
    [150.5, 250.4, 201, 300],
    [250.5, 500.4, 301, 500],
  ];
  for (let b of bp)
    if (pm25 >= b[0] && pm25 <= b[1])
      return Math.round(((b[3] - b[2]) / (b[1] - b[0])) * (pm25 - b[0]) + b[2]);
  return 500;
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy (Sensitive)";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function getAQIRecommendation(aqi) {
  if (aqi <= 50) return "Perfect for outdoor activities.";
  if (aqi <= 100) return "Sensitive people should take caution.";
  if (aqi <= 150) return "Limit prolonged outdoor exposure.";
  if (aqi <= 200) return "Avoid outdoor activity.";
  return "Stay indoors. Health risk is high.";
}

function getAQIColor(aqi) {
  if (aqi <= 50) return "#22c55e";   // green
  if (aqi <= 100) return "#eab308";  // yellow
  if (aqi <= 150) return "#f97316";  // orange
  if (aqi <= 200) return "#ef4444";  // red
  if (aqi <= 300) return "#a855f7";  // purple
  return "#991b1b";                  // maroon
}

function getCountryName(code) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
  } catch {
    return code; // Fallback to raw country code
  }
}

function resetUI() {
  locationEl.innerText = "--";
  temperature.innerText = "--";
  condition.innerText = "--";
  humidity.innerText = "--";
  wind.innerText = "--";
  feelsLikeEl.innerText = "--";
  sunriseEl.innerText = "--";
  sunsetEl.innerText = "--";
  hourlyForecastEl.innerHTML = "";
  aqiValue.innerText = "--";
  aqiValue.style.color = "";
  aqiStatus.innerText = "--";
  aqiStatus.style.color = "";
  aqiRecommendation.innerText = "--";
  aqiTrend.innerText = "--";
  pm25.innerText = "--";
  pm10.innerText = "--";
  no2.innerText = "--";
  so2.innerText = "--";
  o3.innerText = "--";
  co.innerText = "--";
}
