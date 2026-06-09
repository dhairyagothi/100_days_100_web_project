const GEOCODING_API = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_API = "https://api.open-meteo.com/v1/forecast";

const COMMON_CITIES = [
  "Bengaluru",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Delhi",
  "Mumbai"
];

let weatherChart = null;
let activeMetric = "temperature";
let lastForecastData = null;
let isCelsius = true;
let activeWeatherRequestId = 0;

/* =========================
   DOM ELEMENTS
========================= */

const weatherFields = {
  temp: document.getElementById("temp"),
  temp2: document.getElementById("temp2"),
  feels_like: document.getElementById("feels_like"),
  humidity: document.getElementById("humidity"),
  humidity2: document.getElementById("humidity2"),
  min_temp: document.getElementById("min_temp"),
  max_temp: document.getElementById("max_temp"),
  wind_speed: document.getElementById("wind_speed"),
  wind_speed2: document.getElementById("wind_speed2"),
  wind_degrees: document.getElementById("wind_degrees"),
  sunrise: document.getElementById("sunrise"),
  sunset: document.getElementById("sunset")
};

const cityInput = document.getElementById("city");
const searchButton = document.getElementById("submit");
const cityName = document.getElementById("cityName");
const statusMessage = document.getElementById("statusMessage");
const themeToggle = document.getElementById("themeToggle");
const unitToggle = document.getElementById("unit-toggle");

const presetCityLinks = document.querySelectorAll(
  ".dropdown-item[data-city]"
);

const commonCityRows = Array.from(
  document.querySelectorAll("tbody tr")
).filter((row) => {
  const header = row.querySelector('th[scope="row"]');
  return header && COMMON_CITIES.includes(header.textContent.trim());
});

/* =========================
   HELPERS
========================= */

function normalizeCity(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ");
}

function setText(node, value) {
  if (!node) return;
  node.textContent = value;
}

function setStatus(message, tone = "info") {
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.dataset.tone = tone;
  statusMessage.style.display = message ? "block" : "none";
}

function setLoading(isLoading) {
  if (!searchButton || !cityInput) return;

  searchButton.disabled = isLoading;
  cityInput.disabled = isLoading;

  if (isLoading) {
    searchButton.innerHTML =
      `<span class="spinner-border spinner-border-sm"></span>`;
  } else {
    searchButton.innerHTML = `Search`;
  }
}

function formatTime(isoDateTime) {
  if (!isoDateTime) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(isoDateTime));
}

function formatTemperature(temp) {
  if (!Number.isFinite(temp)) return "—";

  if (isCelsius) {
    return `${Math.round(temp)}°C`;
  }

  return `${Math.round((temp * 9) / 5 + 32)}°F`;
}

function formatCityLabel(location, originalQuery) {
  const parts = [
    location.name,
    location.admin1,
    location.country
  ].filter(Boolean);

  return parts.length ? parts.join(", ") : originalQuery;
}

/* =========================
   API
========================= */

async function geocodeCity(city) {
  const url = new URL(GEOCODING_API);

  url.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json"
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status})`);
  }

  const data = await response.json();

  return data?.results?.[0] || null;
}

async function fetchWeather(latitude, longitude) {
  const url = new URL(WEATHER_API);

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code",
    daily:
      "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max",
    timezone: "auto"
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather API failed (${response.status})`);
  }

  return response.json();
}

/* =========================
   WEATHER SUMMARY
========================= */

function buildWeatherSummary(data) {
  const current = data?.current || {};
  const daily = data?.daily || {};

  return {
    temperatureValue: formatTemperature(current.temperature_2m),
    temperatureLabel: formatTemperature(current.temperature_2m),

    feelsLike: formatTemperature(current.apparent_temperature),

    humidityValue: Number.isFinite(current.relative_humidity_2m)
      ? `${Math.round(current.relative_humidity_2m)}`
      : "—",

    humidityLabel: Number.isFinite(current.relative_humidity_2m)
      ? `${Math.round(current.relative_humidity_2m)}%`
      : "—",

    minTemperature: formatTemperature(
      daily.temperature_2m_min?.[0]
    ),

    maxTemperature: formatTemperature(
      daily.temperature_2m_max?.[0]
    ),

    windSpeedValue: Number.isFinite(current.wind_speed_10m)
      ? `${Math.round(current.wind_speed_10m)}`
      : "—",

    windSpeedLabel: Number.isFinite(current.wind_speed_10m)
      ? `${Math.round(current.wind_speed_10m)} km/h`
      : "—",

    windDirection: Number.isFinite(current.wind_direction_10m)
      ? `${Math.round(current.wind_direction_10m)}°`
      : "—",

    sunrise: formatTime(daily.sunrise?.[0]),
    sunset: formatTime(daily.sunset?.[0])
  };
}

function updateWeatherCard(cityLabel, summary) {
  cityName.textContent = cityLabel;

  setText(weatherFields.temp, summary.temperatureLabel);
  setText(weatherFields.temp2, summary.temperatureValue);

  setText(weatherFields.feels_like, summary.feelsLike);

  setText(weatherFields.humidity, summary.humidityLabel);
  setText(weatherFields.humidity2, summary.humidityValue);

  setText(weatherFields.min_temp, summary.minTemperature);
  setText(weatherFields.max_temp, summary.maxTemperature);

  setText(weatherFields.wind_speed, summary.windSpeedLabel);
  setText(weatherFields.wind_speed2, summary.windSpeedValue);

  setText(weatherFields.wind_degrees, summary.windDirection);

  setText(weatherFields.sunrise, summary.sunrise);
  setText(weatherFields.sunset, summary.sunset);
}

function resetWeatherSummary() {
  updateWeatherCard("Search for a city", {
    temperatureValue: "—",
    temperatureLabel: "—",
    feelsLike: "—",
    humidityValue: "—",
    humidityLabel: "—",
    minTemperature: "—",
    maxTemperature: "—",
    windSpeedValue: "—",
    windSpeedLabel: "—",
    windDirection: "—",
    sunrise: "—",
    sunset: "—"
  });
}

/* =========================
   WEATHER RECOMMENDATIONS
========================= */

function getRecommendations(temp, weatherCode) {
  let clothing = "";
  let travel = "";

  const isRain = [
    51,53,55,56,57,
    61,63,65,66,67,
    80,81,82,95,96,99
  ].includes(weatherCode);

  const isSnow = [
    71,73,75,77,85,86
  ].includes(weatherCode);

  if (isRain) {
    clothing =
      "☔ Carry umbrella and wear waterproof clothing.";
  } else if (isSnow) {
    clothing =
      "❄️ Heavy winter wear and insulated boots recommended.";
  } else if (temp < 15) {
    clothing =
      "🧥 Wear warm jackets or hoodies.";
  } else if (temp > 30) {
    clothing =
      "👕 Light breathable clothes recommended.";
  } else {
    clothing =
      "😎 Comfortable weather for casual clothing.";
  }

  if (weatherCode >= 95) {
    travel =
      "⚡ Avoid outdoor travel due to thunderstorms.";
  } else if (isRain) {
    travel =
      "🚗 Drive carefully on wet roads.";
  } else if (temp > 36) {
    travel =
      "☀️ Stay hydrated and avoid direct sunlight.";
  } else {
    travel =
      "🟢 Weather is suitable for travel and outdoor activities.";
  }

  return { clothing, travel };
}

function updateRecommendations(temp, weatherCode) {
  const card = document.getElementById(
    "recommendations-card"
  );

  const clothingEl = document.getElementById(
    "clothing-recommendation"
  );

  const travelEl = document.getElementById(
    "travel-recommendation"
  );

  if (!card || !clothingEl || !travelEl) return;

  const recs = getRecommendations(temp, weatherCode);

  clothingEl.innerHTML = recs.clothing;
  travelEl.innerHTML = recs.travel;

  card.style.display = "block";
}

/* =========================
   TABLE
========================= */

function setRowMessage(row, message) {
  row.querySelectorAll("td").forEach((cell) => {
    cell.textContent = message;
  });
}

function renderRowWeather(row, data) {
  const current = data?.current || {};
  const daily = data?.daily || {};

  const values = [
    `${Math.round(current.cloud_cover || 0)}%`,
    formatTemperature(current.apparent_temperature),
    `${Math.round(current.relative_humidity_2m || 0)}%`,
    formatTemperature(daily.temperature_2m_max?.[0]),
    formatTemperature(daily.temperature_2m_min?.[0]),
    formatTime(daily.sunrise?.[0]),
    formatTime(daily.sunset?.[0]),
    formatTemperature(current.temperature_2m),
    `${Math.round(current.wind_direction_10m || 0)}°`,
    `${Math.round(current.wind_speed_10m || 0)} km/h`
  ];

  const cells = row.querySelectorAll("td");

  cells.forEach((cell, index) => {
    cell.textContent = values[index] || "—";
  });
}

async function updateComparisonTable() {
  await Promise.allSettled(
    commonCityRows.map(async (row) => {
      const city =
        row.querySelector('th[scope="row"]')
          ?.textContent.trim();

      if (!city) return;

      setRowMessage(row, "Loading...");

      const location = await geocodeCity(city);

      if (!location) {
        setRowMessage(row, "—");
        return;
      }

      const weatherData = await fetchWeather(
        location.latitude,
        location.longitude
      );

      renderRowWeather(row, weatherData);
    })
  );
}

/* =========================
   CHARTS
========================= */

function buildChartData(data) {
  const daily = data?.daily || {};

  const labels = (daily.time || []).map((d) =>
    new Intl.DateTimeFormat("en-IN", {
      weekday: "short"
    }).format(new Date(d))
  );

  return {
    labels,
    temperature: {
      label: isCelsius
        ? "Temperature °C"
        : "Temperature °F",

      data: (daily.temperature_2m_max || []).map((t) =>
        isCelsius
          ? Math.round(t)
          : Math.round((t * 9) / 5 + 32)
      ),

      color: "#4da3ff"
    },

    humidity: {
      label: "Rain Probability %",
      data: daily.precipitation_probability_max || [],
      color: "#7b61ff"
    },

    wind: {
      label: "Wind Speed km/h",
      data: daily.wind_speed_10m_max || [],
      color: "#00d4ff"
    }
  };
}

function renderChart(data) {
  const canvas = document.getElementById("weatherChart");

  if (!canvas || !data) return;

  document.getElementById(
    "charts-section"
  ).style.display = "block";

  const datasets = buildChartData(data);

  const metric = datasets[activeMetric];

  if (weatherChart) {
    weatherChart.destroy();
  }

  weatherChart = new Chart(canvas, {
    type: "line",

    data: {
      labels: datasets.labels,

      datasets: [
        {
          label: metric.label,
          data: metric.data,
          borderColor: metric.color,
          backgroundColor: metric.color + "22",
          borderWidth: 3,
          fill: true,
          tension: 0.45,
          pointRadius: 5,
          pointHoverRadius: 8
        }
      ]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          labels: {
            color:
  document.body.classList.contains("light-mode")
    ? "#0f172a"
    : "#ffffff"
          }
        }
      },

      scales: {
        x: {
          ticks: {
           color:
  document.body.classList.contains("light-mode")
    ? "#475569"
    : "#dddddd"
          },
          grid: {
           color:
  document.body.classList.contains("light-mode")
    ? "rgba(15,23,42,0.08)"
    : "rgba(255,255,255,0.06)"
          }
        },

        y: {
          ticks: {
            color:
  document.body.classList.contains("light-mode")
    ? "#475569"
    : "#dddddd"
          },
          grid: {
           color:
  document.body.classList.contains("light-mode")
    ? "rgba(15,23,42,0.08)"
    : "rgba(255,255,255,0.06)"
          }
        }
      }
    }
  });
}

function bindChartTabs() {
  document.querySelectorAll(".chart-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".chart-tab")
        .forEach((b) =>
          b.classList.remove("active")
        );

      btn.classList.add("active");

      activeMetric = btn.dataset.metric;

      if (lastForecastData) {
        renderChart(lastForecastData);
      }
    });
  });
}

/* =========================
   SEARCH WEATHER
========================= */

async function loadCityWeather(city) {
  const requestId = ++activeWeatherRequestId;
  const normalizedCity = normalizeCity(city);

  if (!normalizedCity) {
    setLoading(false);
    setStatus(
      "Please enter a city name.",
      "error"
    );
    return;
  }

  try {
    setLoading(true);

    setStatus(
      `Searching weather for ${normalizedCity}...`,
      "info"
    );

    const location = await geocodeCity(
      normalizedCity
    );

    if (requestId !== activeWeatherRequestId) {
      return;
    }

    if (!location) {
      throw new Error("City not found.");
    }

    const weatherData = await fetchWeather(
      location.latitude,
      location.longitude
    );

    if (requestId !== activeWeatherRequestId) {
      return;
    }

    const summary = buildWeatherSummary(
      weatherData
    );

    const label = formatCityLabel(
      location,
      normalizedCity
    );

    updateWeatherCard(label, summary);

    updateRecommendations(
      weatherData.current.temperature_2m,
      weatherData.current.weather_code
    );


    lastForecastData = weatherData;
    renderChart(weatherData);
    setStatus(
      `Showing weather for ${label}`,
      "success"
    );
  } catch (error) {
    if (requestId !== activeWeatherRequestId) {
      return;
    }

    console.error(error);

    setStatus(
      error.message ||
        "Unable to fetch weather.",
      "error"
    );

  } finally {
    if (requestId === activeWeatherRequestId) {
      setLoading(false);
    }
  }
}

/* =========================
   SEARCH FORM
========================= */

function bindSearchForm() {
  const form = cityInput?.form;

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;

    loadCityWeather(city);
  });
}

/* =========================
   PRESET CITY LINKS
========================= */

function bindPresetCities() {
  presetCityLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const city = link.dataset.city;

      cityInput.value = city;

      loadCityWeather(city);
    });
  });
}

/* =========================
   UNIT TOGGLE
========================= */

unitToggle?.addEventListener("click", async () => {
  isCelsius = !isCelsius;

  unitToggle.textContent = isCelsius
    ? "Switch to °F"
    : "Switch to °C";

  const currentCity =
    cityName.textContent.split(",")[0];

  if (
    currentCity &&
    currentCity !== "Search for a city"
  ) {
    await loadCityWeather(currentCity);
  }

  await updateComparisonTable();
});

/* =========================
   THEME TOGGLE
========================= */

function applyTheme(theme) {
  const isLight = theme === "light";

  document.body.classList.toggle(
    "light-mode",
    isLight
  );

  if (themeToggle) {
    themeToggle.innerHTML = isLight
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }

  localStorage.setItem(
    "weather-theme",
    theme
  );

  if (lastForecastData) {
    renderChart(lastForecastData);
  }
}
themeToggle?.addEventListener("click", () => {
  applyTheme(
    document.body.classList.contains("light-mode")
      ? "dark"
      : "light"
  );
});
/* =========================
   GUIDE MODAL
========================= */

const guideBtn =
  document.getElementById("openGuide");

const guideModal =
  document.getElementById("guideModal");

const closeGuide =
  document.querySelector(".close-guide");

guideBtn?.addEventListener("click", (e) => {
  e.preventDefault();

  guideModal.style.display = "block";
});

closeGuide?.addEventListener("click", () => {
  guideModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === guideModal) {
    guideModal.style.display = "none";
  }
});

/* =========================
   WEATHER ANIMATION
========================= */

function createFloatingParticles() {
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle =
      document.createElement("div");

    particle.className = "weather-particle";

    particle.style.left =
      Math.random() * 100 + "vw";

    particle.style.animationDuration =
      Math.random() * 10 + 8 + "s";

    particle.style.animationDelay =
      Math.random() * 5 + "s";

    document.body.appendChild(particle);
  }
}

/* =========================
   INIT
========================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    bindSearchForm();

    bindPresetCities();

    bindChartTabs();

    resetWeatherSummary();

    setStatus(
      "Search for a city to get live weather updates.",
      "info"
    );

    await updateComparisonTable();

    const savedTheme =
      localStorage.getItem("weather-theme") ||
      "dark";

    applyTheme(savedTheme);

    createFloatingParticles();
  }
);
