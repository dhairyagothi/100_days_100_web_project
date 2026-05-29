const getWeather = (city) => {
    cityName.innerHTML = city;

    fetch(`https://wttr.in/${city}?format=j1`)
        .then((response) => response.json())
        .then((response) => {
            console.log(response);

            temp.innerHTML =
                response.current_condition[0].temp_C;

            temp2.innerHTML =
                response.current_condition[0].temp_C;

            feels_like.innerHTML =
                response.current_condition[0].FeelsLikeC;

            humidity.innerHTML =
                response.current_condition[0].humidity;

            humidity2.innerHTML =
                response.current_condition[0].humidity;

            wind_speed.innerHTML =
                response.current_condition[0].windspeedKmph;

            wind_speed2.innerHTML =
                response.current_condition[0].windspeedKmph;

            wind_degrees.innerHTML =
                response.current_condition[0].winddirDegree;

            sunrise.innerHTML =
                response.weather[0].astronomy[0].sunrise;

            sunset.innerHTML =
                response.weather[0].astronomy[0].sunset;

            min_temp.innerHTML = "N/A";
            max_temp.innerHTML = "N/A";
        })

        .catch((err) => console.error(err));
};

submit.addEventListener("click", (e) => {
    e.preventDefault();
    getWeather(city.value);
});

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const COMMON_CITIES = ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Noida', 'Delhi'];
let isCelsius = true;

const weatherFields = {
  temp: document.getElementById('temp'),
  temp2: document.getElementById('temp2'),
  feels_like: document.getElementById('feels_like'),
  humidity: document.getElementById('humidity'),
  humidity2: document.getElementById('humidity2'),
  min_temp: document.getElementById('min_temp'),
  max_temp: document.getElementById('max_temp'),
  wind_speed: document.getElementById('wind_speed'),
  wind_speed2: document.getElementById('wind_speed2'),
  wind_degrees: document.getElementById('wind_degrees'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset')
};

const cityInput = document.getElementById('city');
const searchButton = document.getElementById('submit');
const loading = document.getElementById('loading');
const cityName = document.getElementById('cityName');
const statusMessage = document.getElementById('statusMessage');
const presetCityLinks = document.querySelectorAll('.dropdown-item[data-city]');
const commonCityRows = Array.from(document.querySelectorAll('tbody tr')).filter((row) => {
  const rowHeader = row.querySelector('th[scope="row"]');
  return rowHeader && COMMON_CITIES.includes(rowHeader.textContent.trim());
});

function normalizeCity(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function setStatus(message, tone = 'info') {
  if (!statusMessage) return;

  statusMessage.textContent = message;
  statusMessage.dataset.tone = tone;
  statusMessage.hidden = !message;
  statusMessage.style.display = message ? 'block' : 'none';
}

function setLoading(isLoading) {
  if (loading) {
    loading.style.display = isLoading ? 'block' : 'none';
  }

  if (searchButton) {
    searchButton.disabled = isLoading;
  }

  if (cityInput) {
    cityInput.disabled = isLoading;
  }
}

function setText(node, value) {
  if (!node) return;
  node.textContent = value;
}

function setWeatherSummary(summary) {
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
  setWeatherSummary({
    temperatureValue: '—',
    temperatureLabel: '—',
    feelsLike: '—',
    humidityValue: '—',
    humidityLabel: '—',
    minTemperature: '—',
    maxTemperature: '—',
    windSpeedValue: '—',
    windSpeedLabel: '—',
    windDirection: '—',
    sunrise: '—',
    sunset: '—'
  });
  hideRecommendations();
}

function formatTime(unixTimestamp) {

  if (!unixTimestamp) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(unixTimestamp * 1000));

}

function formatCityLabel(location, originalQuery) {
  const parts = [location.name, location.admin1, location.country].filter(Boolean);
  return parts.length ? parts.join(', ') : originalQuery;
}

async function geocodeCity(city) {
  const url = new URL(GEOCODING_API);

  url.search = new URLSearchParams({
    name: city,
    count: '1',
    language: 'en',
    format: 'json'
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Geocoding request failed (${response.status})`);
  }

  const data = await response.json();

  const location = data?.results?.[0];

  if (!location) {
    return null;
  }

  return location;
}

async function fetchWeather(latitude, longitude) {

  const url = new URL(WEATHER_API);

  url.search = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m,weather_code',

    daily:
      'temperature_2m_max,temperature_2m_min,sunrise,sunset',

    timezone: 'auto',

    timeformat: 'unixtime'
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status})`);
  }

  return response.json();
}

function formatTemperature(temp) {

  if (!Number.isFinite(temp)) return '—';

  if (isCelsius) {
    return `${Math.round(temp)}°C`;
  }

  return `${Math.round((temp * 9/5) + 32)}°F`;
}

function buildWeatherSummary(data) {

  const current = data?.current || {};
  const daily = data?.daily || {};

  const temperature = current.temperature_2m;
  const humidity = current.relative_humidity_2m;
  const feelsLikeTemperature = current.apparent_temperature;
  const windSpeed = current.wind_speed_10m;
  const windDirection = current.wind_direction_10m;

  return {

    temperatureValue:
      Number.isFinite(temperature)
        ? formatTemperature(temperature)
        : '—',

    temperatureLabel:
      Number.isFinite(temperature)
        ? formatTemperature(temperature)
        : '—',

    feelsLike:
      Number.isFinite(feelsLikeTemperature)
        ? formatTemperature(feelsLikeTemperature)
        : '—',

    humidityValue:
      Number.isFinite(humidity)
        ? `${Math.round(humidity)}`
        : '—',

    humidityLabel:
      Number.isFinite(humidity)
        ? `${Math.round(humidity)}%`
        : '—',

    minTemperature:
      Number.isFinite(daily.temperature_2m_min?.[0])
        ? formatTemperature(daily.temperature_2m_min[0])
        : '—',

    maxTemperature:
      Number.isFinite(daily.temperature_2m_max?.[0])
        ? formatTemperature(daily.temperature_2m_max[0])
        : '—',

    windSpeedValue:
      Number.isFinite(windSpeed)
        ? `${Math.round(windSpeed)}`
        : '—',

    windSpeedLabel:
      Number.isFinite(windSpeed)
        ? `${Math.round(windSpeed)} km/h`
        : '—',

    windDirection:
      Number.isFinite(windDirection)
        ? `${Math.round(windDirection)}°`
        : '—',

    sunrise: formatTime(daily.sunrise?.[0]),
    sunset: formatTime(daily.sunset?.[0])

  };
}
