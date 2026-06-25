
/* ============================================================
   AirCast – Premium Weather & AQI Dashboard  |  script.js
   ============================================================ */

const API_KEY = "Insert Your API Key";

let lastAQI = null;

// ── DOM References ────────────────────────────────────────────
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
const weatherIconEl = document.getElementById("weatherIcon");

const aqiValue = document.getElementById("aqiValue");
const aqiStatus = document.getElementById("aqiStatus");
const aqiRecommendation = document.getElementById("aqiRecommendation");
const aqiTrend = document.getElementById("aqiTrend");
const aqiProgress = document.getElementById("aqiProgress");
const pm25 = document.getElementById("pm25");
const pm10 = document.getElementById("pm10");
const no2 = document.getElementById("no2");
const so2 = document.getElementById("so2");
const o3 = document.getElementById("o3");
const co = document.getElementById("co");
const greetingEl = document.getElementById("greeting");


const settingsModal = document.getElementById("settingsModal");
const apiKeyInput = document.getElementById("apiKeyInput");
const settingsFeedback = document.getElementById("settingsFeedback");
const loader = document.getElementById("loader");

// ── API Key Management ────────────────────────────────────────
function getActiveApiKey() {
  const saved = localStorage.getItem("openweather_api_key");
  return (saved && saved.trim()) ? saved.trim() : API_KEY;
}


function toggleSettings() {
  if (settingsModal.classList.contains("show")) {
    settingsModal.classList.remove("show");
  } else {

    apiKeyInput.value = localStorage.getItem("openweather_api_key") || "";

    settingsFeedback.innerText = "";
    settingsFeedback.className = "feedback-message";
    settingsModal.classList.add("show");
  }
}



function saveApiKey() {
  const keyVal = apiKeyInput.value.trim();
  if (!keyVal) {
    localStorage.removeItem("openweather_api_key");
    settingsFeedback.innerText = "API key cleared. Using script default.";
    settingsFeedback.className = "feedback-message success";
  } else {
    localStorage.setItem("openweather_api_key", keyVal);
l
    settingsFeedback.innerText = "✓ API key saved successfully!";
    settingsFeedback.className = "feedback-message success";
  }
  setTimeout(toggleSettings, 1100);
}

// Close modal when clicking backdrop
window.addEventListener("click", (e) => {
  if (e.target === settingsModal) toggleSettings();
});

// ── Enter Key Search ──────────────────────────────────────────
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getWeather();
});

// ── Greeting ──────────────────────────────────────────────────


function updateGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) greetingEl.innerText = "Good Morning ☀️";
  else if (h >= 12 && h < 17) greetingEl.innerText = "Good Afternoon 🌤";
  else greetingEl.innerText = "Good Evening 🌙";
}
updateGreeting();
setInterval(updateGreeting, 60 * 60 * 1000);

// ── Loader ────────────────────────────────────────────────────
function showLoader(on) {
  loader.classList.toggle("show", on);
}

// ── Weather Theme Engine ──────────────────────────────────────
const THEME_MAP = {
  clear: "theme-sunny",
  sunny: "theme-sunny",
  clouds: "theme-cloudy",
  rain: "theme-rainy",
  drizzle: "theme-rainy",
  snow: "theme-snowy",
  thunderstorm: "theme-stormy",
  mist: "theme-hazy",
  haze: "theme-hazy",
  fog: "theme-hazy",
  smoke: "theme-hazy",
  dust: "theme-hazy",
  sand: "theme-hazy",
  ash: "theme-hazy",
  squall: "theme-stormy",
  tornado: "theme-stormy",
};

function updateWeatherTheme(conditionMain, iconCode) {
  document.body.className = "";

  const isNight = iconCode && iconCode.endsWith("n");
  if (isNight) {
    document.body.classList.add("theme-night");
    return;
  }

  const key = conditionMain.toLowerCase();
  const theme = THEME_MAP[key] || "theme-default";
  document.body.classList.add(theme);
}

// ── AQI Ring Animation ────────────────────────────────────────
const AQI_RING_CIRCUMFERENCE = 251; // 2 * π * 40

function updateAQIRing(aqi) {
  const maxAQI = 300;
  const clamped = Math.min(aqi, maxAQI);
  const offset = AQI_RING_CIRCUMFERENCE * (1 - clamped / maxAQI);
  const color = getAQIColor(aqi);

  if (aqiProgress) {
    aqiProgress.style.strokeDashoffset = offset;
    aqiProgress.style.stroke = color;
  }
}

// ── Main Fetch Pipeline ───────────────────────────────────────
function getWeather() {
  const city = cityInput.value.trim();
  errorMessage.innerText = "";
  if (!city) return;

  const key = getActiveApiKey();
  if (!key || key === "Insert Your API Key") {

    errorMessage.innerText = "⚠️ Please configure your OpenWeatherMap API Key via the Settings (gear) icon.";

    resetUI();
    return;
  }


  showLoader(true);

  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${key}`)
    .then((res) => {
      if (!res.ok) {
        if (res.status === 401) throw new Error("Invalid API key. Please check your Settings.");

        throw new Error("Failed to search city coordinates.");
      }
      return res.json();
    })
    .then((loc) => {
      if (!loc || !loc.length) {


        resetUI();
        showLoader(false);
        return;
      }

      const { lat, lon, name, state, country } = loc[0];

      locationEl.innerText = name + (state ? ", " + state : "") + ", " + getCountryName(country);

      Promise.all([
        fetchWeather(lat, lon, key),
        fetchAQI(lat, lon, key),
      ])
        .then(() => showLoader(false))
        .catch((err) => {
          errorMessage.innerText = err.message || "Failed to fetch complete weather data.";
          showLoader(false);
        });

    })
    .catch((err) => {
      errorMessage.innerText = err.message || "Failed to retrieve location data.";
      resetUI();

      showLoader(false);
    });
}

// ── Weather + Forecast Fetch ──────────────────────────────────
function fetchWeather(lat, lon, key) {
  const weatherFetch = fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch current weather.");

      return res.json();
    })
    .then((d) => {
      temperature.innerText = `${Math.round(d.main.temp)}°C`;
      condition.innerText = d.weather[0].description;
      humidity.innerText = d.main.humidity + "%";
      wind.innerText = (d.wind.speed * 3.6).toFixed(1) + " km/h";

      feelsLikeEl.innerText = `${Math.round(d.main.feels_like)}°C — ${getFeelsLikeComment(d.main.feels_like)}`;
      sunriseEl.innerText = new Date(d.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      sunsetEl.innerText = new Date(d.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // Weather icon
      const iconCode = d.weather[0].icon;
      weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      weatherIconEl.alt = d.weather[0].description;
      weatherIconEl.style.display = "block";

      // Apply dynamic background theme
      updateWeatherTheme(d.weather[0].main, iconCode);
    });

  const forecastFetch = fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=5&appid=${key}`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch forecast.");

      return res.json();
    })
    .then((forecast) => {
      hourlyForecastEl.innerHTML = "";
      forecast.list.forEach((item) => {
        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp);
        const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;


        const card = document.createElement("div");
        card.innerHTML = `
          <div>${hour}:00</div>
          <img src="${iconUrl}" alt="${item.weather[0].description}" loading="lazy" />
          <span class="temp">${temp}°C</span>
        `;
        hourlyForecastEl.appendChild(card);

      });
    })
    .catch((err) => {
      console.error(err);
    });

  return Promise.all([weatherFetch, forecastFetch]);
}


// ── AQI Fetch ─────────────────────────────────────────────────
function fetchAQI(lat, lon, key) {
  return fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${key}`
  )
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch AQI data.");

      return res.json();
    })
    .then((d) => {
      const c = d.list[0].components;
      const aqi = calculateUSAQI(c.pm2_5);

      aqiValue.innerText = aqi;
      aqiStatus.innerText = getAQIStatus(aqi);
      aqiRecommendation.innerText = getAQIRecommendation(aqi);
      aqiTrend.innerText =
        lastAQI === null ? "📊 First reading — trend unavailable"
          : aqi > lastAQI ? "📈 AQI worsening"
            : aqi < lastAQI ? "📉 AQI improving"
              : "→ AQI stable";

      lastAQI = aqi;

      const color = getAQIColor(aqi);
      aqiValue.style.color = color;
      aqiStatus.style.color = color;


      // Animate the ring
      updateAQIRing(aqi);

      pm25.innerText = c.pm2_5.toFixed(1) + " µg/m³";
      pm10.innerText = c.pm10.toFixed(1) + " µg/m³";
      no2.innerText = c.no2.toFixed(1) + " µg/m³";
      so2.innerText = c.so2.toFixed(1) + " µg/m³";
      o3.innerText = c.o3.toFixed(1) + " µg/m³";
      co.innerText = c.co.toFixed(1) + " µg/m³";

    });
}

// ── Helper Functions ──────────────────────────────────────────
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
  for (const b of bp)
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
  if (aqi <= 50) return "🌿 Perfect for outdoor activities.";
  if (aqi <= 100) return "😷 Sensitive groups should take caution.";
  if (aqi <= 150) return "⚠️ Limit prolonged outdoor exposure.";
  if (aqi <= 200) return "🚫 Avoid outdoor activity.";
  return "🏠 Stay indoors. Health risk is high.";
}

function getAQIColor(aqi) {
  if (aqi <= 50) return "#22c55e";   // green
  if (aqi <= 100) return "#eab308";   // yellow
  if (aqi <= 150) return "#f97316";   // orange
  if (aqi <= 200) return "#ef4444";   // red
  if (aqi <= 300) return "#a855f7";   // purple
  return "#7f1d1d";                   // maroon
}

function getCountryName(code) {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
  } catch {
    return code;
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
  weatherIconEl.style.display = "none";
  aqiValue.innerText = "--";
  aqiStatus.innerText = "--";
  aqiRecommendation.innerText = "--";
  aqiTrend.innerText = "--";
  pm25.innerText = "--";
  pm10.innerText = "--";
  no2.innerText = "--";
  so2.innerText = "--";
  o3.innerText = "--";
  co.innerText = "--";
  if (aqiProgress) aqiProgress.style.strokeDashoffset = AQI_RING_CIRCUMFERENCE;
}