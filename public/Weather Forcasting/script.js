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

const CONFIG = {
    thresholds: { cold: 15, hot: 30, criticalHot: 36 },
    weatherCodes: {
        rain: [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99],
        snow: [71, 73, 75, 77, 85, 86],
        thunder: 95
    },
    metrics: {
        temperature: { key: "temperature_2m_max", labelCelsius: "Temperature °C", labelFahrenheit: "Temperature °F", color: "#ffc107" },
        humidity: { key: "precipitation_probability_max", label: "Rain Probability %", color: "#0dcaf0" },
        wind: { key: "wind_speed_10m_max", label: "Wind Speed km/h", color: "#198754" }
    }
};

let weatherChart = null;
let activeMetric = "temperature";
let lastForecastData = null;
let isCelsius = true;
let activeWeatherRequestId = 0;

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
const guideBtn = document.getElementById("openGuide");
const guideModal = document.getElementById("guideModal");
const closeGuide = document.querySelector(".close-guide");
const presetCityLinks = document.querySelectorAll(".dropdown-item[data-city]");

const commonCityRows = Array.from(document.querySelectorAll("tbody tr")).filter((row) => {
    const header = row.querySelector('th[scope="row"]');
    return header && COMMON_CITIES.includes(header.textContent.trim());
});

function normalizeCity(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
}

function setText(node, value) {
    if (node) node.textContent = value;
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
    searchButton.innerHTML = isLoading ? `<span class="spinner-border spinner-border-sm"></span>` : "Search";
}

function formatTime(isoDateTime) {
    if (!isoDateTime) return "—";
    return new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" }).format(new Date(isoDateTime));
}

function formatTemperature(temp) {
    if (!Number.isFinite(temp)) return "—";
    const displayValue = isCelsius ? temp : (temp * 9) / 5 + 32;
    return `${Math.round(displayValue)}°${isCelsius ? "C" : "F"}`;
}

function formatCityLabel(location, originalQuery) {
    const parts = [location.name, location.admin1, location.country].filter(Boolean);
    return parts.length ? parts.join(", ") : originalQuery;
}

async function makeRequest(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API Request failed with status ${response.status}`);
    return response.json();
}

async function geocodeCity(city) {
    const url = new URL(GEOCODING_API);
    url.search = new URLSearchParams({ name: city, count: "1", language: "en", format: "json" });
    const data = await makeRequest(url.toString());
    return data?.results?.[0] || null;
}

async function fetchWeather(latitude, longitude) {
    const url = new URL(WEATHER_API);
    url.search = new URLSearchParams({
        latitude: String(latitude),
        longitude: String(longitude),
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code",
        daily: "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max",
        timezone: "auto"
    });
    return makeRequest(url.toString());
}

function buildWeatherSummary(data) {
    const current = data?.current || {};
    const daily = data?.daily || {};

    return {
        temperatureValue: formatTemperature(current.temperature_2m),
        temperatureLabel: formatTemperature(current.temperature_2m),
        feelsLike: formatTemperature(current.apparent_temperature),
        humidityValue: Number.isFinite(current.relative_humidity_2m) ? `${Math.round(current.relative_humidity_2m)}%` : "—",
        humidityLabel: Number.isFinite(current.relative_humidity_2m) ? `${Math.round(current.relative_humidity_2m)}%` : "—",
        minTemperature: formatTemperature(daily.temperature_2m_min?.[0]),
        maxTemperature: formatTemperature(daily.temperature_2m_max?.[0]),
        windSpeedValue: Number.isFinite(current.wind_speed_10m) ? `${Math.round(current.wind_speed_10m)} km/h` : "—",
        windSpeedLabel: Number.isFinite(current.wind_speed_10m) ? `${Math.round(current.wind_speed_10m)} km/h` : "—",
        windDirection: Number.isFinite(current.wind_direction_10m) ? `${Math.round(current.wind_direction_10m)}°` : "—",
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
        temperatureValue: "—", temperatureLabel: "—", feelsLike: "—",
        humidityValue: "—", humidityLabel: "—", minTemperature: "—",
        maxTemperature: "—", windSpeedValue: "—", windSpeedLabel: "—",
        windDirection: "—", sunrise: "—", sunset: "—"
    });
}

function getRecommendations(temp, weatherCode) {
    let clothing = "😎 Comfortable weather for casual clothing.";
    let travel = "🟢 Weather is suitable for travel and outdoor activities.";

    const isRain = CONFIG.weatherCodes.rain.includes(weatherCode);
    const isSnow = CONFIG.weatherCodes.snow.includes(weatherCode);

    if (isRain) {
        clothing = "☔ Carry umbrella and wear waterproof clothing.";
    } else if (isSnow) {
        clothing = "❄️ Heavy winter wear and insulated boots recommended.";
    } else if (temp < CONFIG.thresholds.cold) {
        clothing = "🧥 Wear warm jackets or hoodies.";
    } else if (temp > CONFIG.thresholds.hot) {
        clothing = "👕 Light breathable clothes recommended.";
    }

    if (weatherCode >= CONFIG.weatherCodes.thunder) {
        travel = "⚡ Avoid outdoor travel due to thunderstorms.";
    } else if (isRain) {
        travel = "🚗 Drive carefully on wet roads.";
    } else if (temp > CONFIG.thresholds.criticalHot) {
        travel = "☀️ Stay hydrated and avoid direct sunlight.";
    }

    return { clothing, travel };
}

function updateRecommendations(temp, weatherCode) {
    const card = document.getElementById("recommendations-card");
    const clothingEl = document.getElementById("clothing-recommendation");
    const travelEl = document.getElementById("travel-recommendation");

    if (!card || !clothingEl || !travelEl) return;

    const recs = getRecommendations(temp, weatherCode);
    clothingEl.innerHTML = recs.clothing;
    travelEl.innerHTML = recs.travel;
    card.style.display = "block";
}

function setRowMessage(row, message) {
    row.querySelectorAll("td").forEach((cell) => {
        cell.textContent = message;
    });
}

function renderRowWeather(row, data) {
    const current = data?.current || {};
    const daily = data?.daily || {};

    const values = [
        formatTemperature(current.temperature_2m),
        formatTemperature(current.apparent_temperature),
        `${Math.round(current.relative_humidity_2m || 0)}%`,
        `${Math.round(current.wind_speed_10m || 0)} km/h`,
        formatTime(daily.sunrise?.[0]),
        formatTime(daily.sunset?.[0])
    ];

    row.querySelectorAll("td").forEach((cell, index) => {
        cell.textContent = values[index] || "—";
    });
}

async function updateComparisonTable() {
    await Promise.allSettled(
        commonCityRows.map(async (row) => {
            const city = row.querySelector('th[scope="row"]')?.textContent.trim();
            if (!city) return;

            setRowMessage(row, "Loading...");
            const location = await geocodeCity(city);

            if (!location) {
                setRowMessage(row, "—");
                return;
            }

            const weatherData = await fetchWeather(location.latitude, location.longitude);
            renderRowWeather(row, weatherData);
        })
    );
}

function buildChartData(data) {
    const daily = data?.daily || {};
    
    const labels = (daily.time || []).map((d) =>
        new Intl.DateTimeFormat("en-IN", { weekday: "short" }).format(new Date(d))
    );

    const rawTemperatureArray = daily.temperature_2m_max || daily.temperature_2m_min || [];
    const rawHumidityArray = daily.precipitation_probability_max || [];
    const rawWindArray = daily.wind_speed_10m_max || [];

    return {
        labels,
        temperature: {
            label: isCelsius ? "Temperature Max °C" : "Temperature Max °F",
            data: rawTemperatureArray.map((t) =>
                isCelsius ? Math.round(t) : Math.round((t * 9) / 5 + 32)
            ),
            color: CONFIG.metrics.temperature.color
        },
        humidity: {
            label: CONFIG.metrics.humidity.label,
            data: rawHumidityArray.map(h => Math.round(h)),
            color: CONFIG.metrics.humidity.color
        },
        wind: {
            label: CONFIG.metrics.wind.label,
            data: rawWindArray.map(w => Math.round(w)),
            color: CONFIG.metrics.wind.color
        }
    };
}

function renderChart(data) {
    const canvas = document.getElementById("weatherChart");
    if (!canvas) return;

    const chartsSection = document.getElementById("charts-section");
    if (chartsSection) {
        chartsSection.style.display = "block";
    }

    if (weatherChart) {
        weatherChart.destroy();
    }

    const isLightMode = document.body.classList.contains("light-mode");
    const labelColor = isLightMode ? "#0f172a" : "#ffffff";
    const tickColor = isLightMode ? "#475569" : "#dddddd";
    const gridColor = isLightMode ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.06)";

    let chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let chartDataPoints = [0, 0, 0, 0, 0, 0, 0];
    let chartLabelString = "No Data Available";
    let chartLineColor = "#ffc107";

    if (data && data.daily) {
        const datasets = buildChartData(data);
        const metric = datasets[activeMetric];
        if (metric) {
            chartLabels = datasets.labels;
            chartDataPoints = metric.data;
            chartLabelString = metric.label;
            chartLineColor = metric.color;
        }
    }

    weatherChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: chartLabelString,
                    data: chartDataPoints,
                    borderColor: chartLineColor,
                    backgroundColor: chartLineColor + "15",
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: data ? 5 : 0,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    labels: { 
                        color: labelColor, 
                        font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 13 } 
                    } 
                }
            },
            scales: {
                x: {
                    ticks: { color: tickColor, font: { family: "'Plus Jakarta Sans', sans-serif" } },
                    grid: { display: false }
                },
                y: {
                    ticks: { color: tickColor, font: { family: "'Plus Jakarta Sans', sans-serif" } },
                    grid: { color: gridColor }
                }
            }
        }
    });
}

function bindChartTabs() {
    document.querySelectorAll(".chart-tab").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            
            document.querySelectorAll(".chart-tab").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            activeMetric = btn.dataset.metric;

            if (lastForecastData) {
                renderChart(lastForecastData);
            }
        });
    });
}

async function loadCityWeather(city) {
    const requestId = ++activeWeatherRequestId;
    const normalizedCity = normalizeCity(city);

    if (!normalizedCity) {
        setLoading(false);
        setStatus("Please enter a city name.", "error");
        return;
    }

    try {
        setLoading(true);
        setStatus(`Searching weather for ${normalizedCity}...`, "info");

        const location = await geocodeCity(normalizedCity);
        if (requestId !== activeWeatherRequestId) return;

        if (!location) throw new Error("City not found.");

        const weatherData = await fetchWeather(location.latitude, location.longitude);
        if (requestId !== activeWeatherRequestId) return;

        const summary = buildWeatherSummary(weatherData);
        const label = formatCityLabel(location, normalizedCity);

        updateWeatherCard(label, summary);
        updateRecommendations(weatherData.current.temperature_2m, weatherData.current.weather_code);

        lastForecastData = weatherData;
        renderChart(weatherData);
        setStatus(`Showing weather for ${label}`, "success");
    } catch (error) {
        if (requestId !== activeWeatherRequestId) return;
        console.error(error);
        setStatus(error.message || "Unable to fetch weather.", "error");
    } finally {
        if (requestId === activeWeatherRequestId) {
            setLoading(false);
        }
    }
}

function bindSearchForm() {
    const form = cityInput?.form;
    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            loadCityWeather(city);
        }
    });
}

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

unitToggle?.addEventListener("click", async () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? "°F" : "°C";

    const currentCity = cityName.textContent.split(",")[0];
    if (currentCity && currentCity !== "Search for a city") {
        await loadCityWeather(currentCity);
    }
    await updateComparisonTable();
});

function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);
    document.body.classList.toggle("dark-theme", !isLight);

    if (themeToggle) {
        themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }

    localStorage.setItem("weather-theme", theme);

    if (lastForecastData) {
        renderChart(lastForecastData);
    }
}

themeToggle?.addEventListener("click", () => {
    applyTheme(document.body.classList.contains("light-mode") ? "dark" : "light");
});

guideBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    guideModal.classList.add("active");
});

closeGuide?.addEventListener("click", () => {
    guideModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
    if (e.target === guideModal) {
        guideModal.classList.remove("active");
    }
});

function createFloatingParticles() {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "weather-particle";
        particle.style.left = Math.random() * 100 + "vw";
        particle.style.animationDuration = Math.random() * 10 + 8 + "s";
        particle.style.animationDelay = Math.random() * 5 + "s";
        document.body.appendChild(particle);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    bindSearchForm();
    bindPresetCities();
    bindChartTabs();
    resetWeatherSummary();
    setStatus("Search for a city to get live weather updates.", "info");

    renderChart(null);
    
    const savedTheme = localStorage.getItem("weather-theme") || "dark";
    applyTheme(savedTheme);

    await updateComparisonTable();
    createFloatingParticles();
});