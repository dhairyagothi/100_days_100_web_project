// Leave empty strings to query simulation engine profiles immediately
const OPENWEATHER_API_KEY = "";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const welcomeMessage = document.getElementById("welcome-message");
const currentWeatherCard = document.getElementById("current-weather-card");
const forecastSection = document.getElementById("forecast-section");

const locationName = document.getElementById("location-name");
const currentDateDisplay = document.getElementById("current-date");
const currentTemp = document.getElementById("current-temp");
const weatherDescription = document.getElementById("weather-description");
const humidityValue = document.getElementById("humidity-value");
const windValue = document.getElementById("wind-value");
const forecastGrid = document.getElementById("forecast-grid");

// Mapping dictionary converter for visual emoji tokens
const emojiMap = {
  "clear sky": "☀️",
  "few clouds": "⛅",
  "scattered clouds": "☁️",
  "broken clouds": "☁️",
  "shower rain": "🌧️",
  rain: "🌦️",
  thunderstorm: "⛈️",
  snow: "❄️",
  mist: "🌫️",
};

async function getWeatherData(cityName) {
  if (!cityName.trim()) return;

  if (OPENWEATHER_API_KEY) {
    // Live Fetch REST Endpoint Configuration Protocol
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&units=metric&appid=${OPENWEATHER_API_KEY}`;

    try {
      const currentRes = await fetch(currentUrl);
      if (!currentRes.ok) throw new Error("City data profile not located.");
      const currentData = await currentRes.json();

      const forecastRes = await fetch(forecastUrl);
      if (!forecastRes.ok) throw new Error("Forecast matrix unavailable.");
      const forecastData = await forecastRes.json();

      renderCurrentWeather(
        currentData.name,
        currentData.main.temp,
        currentData.weather[0].description,
        currentData.main.humidity,
        currentData.wind.speed,
      );
      renderForecast(forecastData.list);
    } catch (error) {
      alert(error.message);
    }
  } else {
    // Fallback Mock Execution Sandbox Lifecycle Context
    generateMockDashboard(cityName);
  }
}

function renderCurrentWeather(name, temp, desc, humidity, wind) {
  welcomeMessage.classList.add("hide");
  currentWeatherCard.classList.remove("hide");
  forecastSection.classList.remove("hide");

  locationName.textContent = name;
  currentDateDisplay.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  currentTemp.textContent = Math.round(temp);

  const token = desc.toLowerCase();
  const icon = emojiMap[token] || "🌤️";
  weatherDescription.textContent = `${icon} ${desc}`;

  humidityValue.textContent = `${humidity}%`;
  windValue.textContent = `${wind} m/s`;
}

function renderForecast(forecastList) {
  forecastGrid.innerHTML = ""; // Secure prior data cleaning handles

  // OpenWeather API delivers 3-hour increments; filters down to 24-hour steps
  const dailyData = forecastList
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);

  dailyData.forEach((day) => {
    const dateObj = new Date(day.dt * 1000);
    const dayLabel = dateObj.toLocaleDateString("en-US", { weekday: "short" });
    const descText = day.weather[0].description.toLowerCase();
    const iconEmoji = emojiMap[descText] || "🌤️";

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
            <span class="f-date">${dayLabel}</span>
            <span class="f-icon">${iconEmoji}</span>
            <span class="f-temp">${Math.round(day.main.temp)}°C</span>
            <span class="f-desc">${day.weather[0].description}</span>
        `;
    forecastGrid.appendChild(card);
  });
}

function generateMockDashboard(cityName) {
  // Generate clean static mock properties for fallback pipelines
  const standardizedName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
  const conditions = ["Clear Sky", "Scattered Clouds", "Rain", "Few Clouds"];
  const activeCondition =
    conditions[Math.floor(Math.random() * conditions.length)];
  const simulatedTemp = Math.floor(Math.random() * (32 - 12 + 1)) + 12;

  renderCurrentWeather(
    standardizedName,
    simulatedTemp,
    activeCondition,
    64,
    4.2,
  );

  forecastGrid.innerHTML = "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let currentDayIdx = new Date().getDay();

  for (let i = 0; i < 5; i++) {
    currentDayIdx = (currentDayIdx + 1) % 7;
    const targetLabel = days[currentDayIdx];
    const loopCondition =
      conditions[Math.floor(Math.random() * conditions.length)];
    const loopIcon = emojiMap[loopCondition.toLowerCase()] || "🌤️";
    const loopTemp = simulatedTemp + Math.floor(Math.random() * 4) - 2;

    const card = document.createElement("div");
    card.classList.add("forecast-card");
    card.innerHTML = `
            <span class="f-date">${targetLabel}</span>
            <span class="f-icon">${loopIcon}</span>
            <span class="f-temp">${loopTemp}°C</span>
            <span class="f-desc">${loopCondition}</span>
        `;
    forecastGrid.appendChild(card);
  }
}

searchBtn.addEventListener("click", () => getWeatherData(cityInput.value));
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getWeatherData(cityInput.value);
});
