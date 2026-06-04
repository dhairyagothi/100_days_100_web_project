const API_KEY = "Insert Your API Key";
let lastAQI = null;

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

// Automatic greeting
function updateGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) greetingEl.innerText = "Good Morning";
  else if (hour >= 12 && hour < 17) greetingEl.innerText = "Good Afternoon";
  else greetingEl.innerText = "Good Evening";
}
updateGreeting();
setInterval(updateGreeting, 60 * 60 * 1000);

// Fetch weather
function getWeather() {
  const city = cityInput.value.trim();
  errorMessage.innerText = "";
  if (!city) return;

  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`,
  )
    .then((res) => res.json())
    .then((loc) => {
      if (!loc.length) {
        errorMessage.innerText = "Invalid city name.";
        resetUI();
        return;
      }
      const { lat, lon, name, state, country } = loc[0];
      locationEl.innerText =
        name + (state ? ", " + state : "") + ", " + getCountryName(country);
      fetchWeather(lat, lon);
      fetchAQI(lat, lon);
    });
}

// Weather + Extra Info + 5-hour forecast
function fetchWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`,
  )
    .then((res) => res.json())
    .then((d) => {
      temperature.innerText = `${Math.round(d.main.temp)}°C`;
      condition.innerText = d.weather[0].description;
      humidity.innerText = d.main.humidity + "%";
      wind.innerText = (d.wind.speed * 3.6).toFixed(1) + " km/h";
      feelsLikeEl.innerText = `${Math.round(d.main.feels_like)}°C - ${getFeelsLikeComment(d.main.feels_like)}`;
      sunriseEl.innerText = new Date(d.sys.sunrise * 1000).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" },
      );
      sunsetEl.innerText = new Date(d.sys.sunset * 1000).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" },
      );
    });

  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=5&appid=${API_KEY}`,
  )
    .then((res) => res.json())
    .then((forecast) => {
      hourlyForecastEl.innerHTML = "";
      forecast.list.forEach((item) => {
        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp);
        const iconUrl = `http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;
        const div = document.createElement("div");
        div.innerHTML = `<div><div>${hour}:00</div><img src="${iconUrl}" alt="icon"><span class="temp">${temp}°C</span></div>`;
        hourlyForecastEl.appendChild(div);
      });
    });
}

// AQI
function fetchAQI(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`,
  )
    .then((res) => res.json())
    .then((d) => {
      const c = d.list[0].components;
      const aqi = calculateUSAQI(c.pm2_5);
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
      pm25.innerText = c.pm2_5 + " µg/m³";
      pm10.innerText = c.pm10 + " µg/m³";
      no2.innerText = c.no2 + " µg/m³";
      so2.innerText = c.so2 + " µg/m³";
      o3.innerText = c.o3 + " µg/m³";
      co.innerText = c.co + " µg/m³";
    });
}

// Helpers
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
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "yellow";
  if (aqi <= 150) return "orange";
  if (aqi <= 200) return "red";
  if (aqi <= 300) return "purple";
  return "maroon";
}

function getCountryName(code) {
  return new Intl.DisplayNames(["en"], { type: "region" }).of(code);
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
  aqiStatus.innerText = "--";
  aqiRecommendation.innerText = "--";
  aqiTrend.innerText = "--";
  pm25.innerText = "--";
  pm10.innerText = "--";
  no2.innerText = "--";
  so2.innerText = "--";
  o3.innerText = "--";
  co.innerText = "--";
}
