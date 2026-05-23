const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

const COMMON_CITIES = ['Bengaluru', 'Chennai', 'Hyderabad', 'Pune', 'Noida', 'Delhi'];

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

function formatTime(isoDateTime) {
  if (!isoDateTime) return '—';

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(isoDateTime));
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
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,cloud_cover,wind_speed_10m,wind_direction_10m',
    daily: 'temperature_2m_max,temperature_2m_min,sunrise,sunset',
    timezone: 'auto'
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status})`);
  }

  return response.json();
}

function buildWeatherSummary(data) {
  const current = data?.current || {};
  const daily = data?.daily || {};

  return {
    temperatureValue: Number.isFinite(current.temperature_2m) ? `${Math.round(current.temperature_2m)}` : '—',
    temperatureLabel: Number.isFinite(current.temperature_2m) ? `${Math.round(current.temperature_2m)}°C` : '—',
    feelsLike: Number.isFinite(current.apparent_temperature) ? `${Math.round(current.apparent_temperature)}°C` : '—',
    humidityValue: Number.isFinite(current.relative_humidity_2m) ? `${Math.round(current.relative_humidity_2m)}` : '—',
    humidityLabel: Number.isFinite(current.relative_humidity_2m) ? `${Math.round(current.relative_humidity_2m)}%` : '—',
    minTemperature: Number.isFinite(daily.temperature_2m_min?.[0]) ? `${Math.round(daily.temperature_2m_min[0])}°C` : '—',
    maxTemperature: Number.isFinite(daily.temperature_2m_max?.[0]) ? `${Math.round(daily.temperature_2m_max[0])}°C` : '—',
    windSpeedValue: Number.isFinite(current.wind_speed_10m) ? `${Math.round(current.wind_speed_10m)}` : '—',
    windSpeedLabel: Number.isFinite(current.wind_speed_10m) ? `${Math.round(current.wind_speed_10m)} km/h` : '—',
    windDirection: Number.isFinite(current.wind_direction_10m) ? `${Math.round(current.wind_direction_10m)}°` : '—',
    sunrise: formatTime(daily.sunrise?.[0]),
    sunset: formatTime(daily.sunset?.[0])
  };
}

// FIX: Safe UI update for main weather card
function updateWeatherCard(cityLabel, summary) {
  console.log("UPDATING UI:", cityLabel, summary); // DEBUG

  if (!summary) {
    console.error("Summary is undefined");
    return;
  }

  if (cityName) {
    cityName.textContent = cityLabel || "Unknown City";
  }

  setWeatherSummary({
    temperatureValue: summary.temperatureValue || "—",
    temperatureLabel: summary.temperatureLabel || "—",
    feelsLike: summary.feelsLike || "—",
    humidityValue: summary.humidityValue || "—",
    humidityLabel: summary.humidityLabel || "—",
    minTemperature: summary.minTemperature || "—",
    maxTemperature: summary.maxTemperature || "—",
    windSpeedValue: summary.windSpeedValue || "—",
    windSpeedLabel: summary.windSpeedLabel || "—",
    windDirection: summary.windDirection || "—",
    sunrise: summary.sunrise || "—",
    sunset: summary.sunset || "—"
  });
}

function getRecommendations(temp, weatherCode) {
  let clothing = "";
  let travel = "";

  const isRain = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(weatherCode);
  const isSnow = [71, 73, 75, 77, 85, 86].includes(weatherCode);

  if (isRain) {
    clothing = "☔ <strong>Umbrella & Rainwear:</strong> It's currently wet or raining. Carry an umbrella or wear a waterproof raincoat/jacket, and opt for water-resistant footwear.";
  } else if (isSnow) {
    clothing = "❄️ <strong>Heavy Winter Wear:</strong> It is snowing. Dress in thick, warm layers with a thermal base, a heavy down jacket, gloves, scarf, beanie, and insulated boots.";
  } else if (temp < 15) {
    clothing = "🧥 <strong>Warm Outerwear:</strong> The weather is chilly. A thick sweater, fleece, or windbreaker jacket, along with long pants, is recommended to stay warm.";
  } else if (temp > 28) {
    clothing = "👕 <strong>Light & Breathable:</strong> It's warm/hot. Wear lightweight, light-colored cotton or linen clothing, sunglasses, and a sun hat if heading outdoors.";
  } else {
    clothing = "👟 <strong>Casual/Comfortable Wear:</strong> The temperature is mild and pleasant. A standard t-shirt, jeans, or a light cardigan/hoodie will be perfectly comfortable.";
  }

  const isThunderstorm = [95, 96, 99].includes(weatherCode);
  const isHeavyRain = [65, 82].includes(weatherCode);
  const isFog = [45, 48].includes(weatherCode);

  if (isThunderstorm) {
    travel = "⚡ <strong>Severe Warning:</strong> Thunderstorms active. Avoid outdoor activities, seek shelter indoors immediately, and stay away from open windows and tall metal structures.";
  } else if (isHeavyRain) {
    travel = "🚗 <strong>Hazardous Driving:</strong> Heavy downpour is causing low visibility and wet roads. Drive slowly, maintain safe following distance, and avoid flooded areas.";
  } else if (isFog) {
    travel = "🌫️ <strong>Dense Fog:</strong> Visibility is severely reduced. Use low-beam fog lights while driving, reduce your speed, and stay alert on the roads.";
  } else if (temp > 35) {
    travel = "☀️ <strong>Extreme Heat Advisory:</strong> Extremely hot weather. Stay indoors as much as possible, keep hydrated by drinking water/electrolytes, and avoid strenuous outdoor exercise during peak heat hours (11 AM - 4 PM).";
  } else {
    travel = "🟢 <strong>Safe to Travel:</strong> Weather conditions are clear and highly favorable. Perfect for road trips, outdoor walks, or sightseeing. Have a safe journey!";
  }

  return { clothing, travel };
}

function updateRecommendations(temp, weatherCode) {
  const recsCard = document.getElementById('recommendations-card');
  const clothingRecEl = document.getElementById('clothing-recommendation');
  const travelRecEl = document.getElementById('travel-recommendation');

  if (!recsCard || !clothingRecEl || !travelRecEl) return;

  const recs = getRecommendations(temp, weatherCode);
  clothingRecEl.innerHTML = recs.clothing;
  travelRecEl.innerHTML = recs.travel;
  recsCard.style.display = 'block';
}

function hideRecommendations() {
  const recsCard = document.getElementById('recommendations-card');
  if (recsCard) {
    recsCard.style.display = 'none';
  }
}

function setRowMessage(row, message) {
  row.querySelectorAll('td').forEach((cell) => {
    cell.textContent = message;
  });
}

function renderRowWeather(row, data, cachedHeaders = null) {
  const current = data?.current || {};
  const daily = data?.daily || {};
  
  // 1. Map API values directly to keys that match the exact HTML header text strings
  const weatherMap = {
    'Cloud_pct': Number.isFinite(current.cloud_cover) ? `${Math.round(current.cloud_cover)}%` : '—',
    'Feels_like' : Number.isFinite(current.apparent_temperature) ? `${Math.round(current.apparent_temperature)}°C` : '—',
    'Humidity' : Number.isFinite(current.relative_humidity_2m) ? `${Math.round(current.relative_humidity_2m)}%` : '—',
    'Max_temp' : Number.isFinite(daily.temperature_2m_max?.[0]) ? `${Math.round(daily.temperature_2m_max[0])}°C` : '—',
    'Min_temp' : Number.isFinite(daily.temperature_2m_min?.[0]) ? `${Math.round(daily.temperature_2m_min[0])}°C` : '—',
    'Sunrise' : formatTime(daily.sunrise?.[0]),
    'Sunset' : formatTime(daily.sunset?.[0]),
    'Temp' : Number.isFinite(current.temperature_2m) ? `${Math.round(current.temperature_2m)}°C` : '—',
    'Wind_degrees' : Number.isFinite(current.wind_direction_10m) ? `${Math.round(current.wind_direction_10m)}°` : '—',
    'Wind_speed' : Number.isFinite(current.wind_speed_10m) ? `${Math.round(current.wind_speed_10m)} km/h` : '—'
  };  

  let headers = cachedHeaders;
  if (!headers) {
    const tableEl = row.closest('table');
    if (!tableEl) return;
    headers = Array.from(tableEl.querySelectorAll('thead th')).map(th => th.textContent.trim());
  }

  const cells = row.querySelectorAll('td');

  // 3. Iterate over table cells and bind data by structural name matching
  cells.forEach((cell, index) => {
    // index + 1 skips first header colums
    const headerName = headers[index + 1]; // Get the header text for this cell

    if(headerName && weatherMap[headerName] !== undefined) {
      cell.textContent = weatherMap[headerName]; // Set cell text based on header mapping
    } else {
      cell.textContent = '—'; // Default if no mapping found
    }
  });
}

async function loadCityWeather(city, options = {}) {
  const { updateTable = false } = options;
  const normalizedCity = normalizeCity(city);

  if (!normalizedCity) {
    resetWeatherSummary();
    setStatus('Type a city name to fetch weather data.', 'info');
    if (cityName) {
      cityName.textContent = 'Search for a city';
    }
    return;
  }

  setLoading(true);
  setStatus(`Searching weather for ${normalizedCity}...`, 'info');

  try {
    const location = await geocodeCity(normalizedCity);

    if (!location) {
      throw new Error(`No city found for "${normalizedCity}".`);
    }

    const weatherData = await fetchWeather(location.latitude, location.longitude);
    const summary = buildWeatherSummary(weatherData);
    const label = formatCityLabel(location, normalizedCity);

    updateWeatherCard(label, summary);

    if (weatherData && weatherData.current) {
      updateRecommendations(weatherData.current.temperature_2m, weatherData.current.weather_code);
    }

    setStatus(updateTable ? `Updated ${label} and the comparison table.` : `Showing weather for ${label}.`, 'success');

    return { location, weatherData };
  } catch (error) {
    console.error('Weather lookup failed:', error);
    resetWeatherSummary();
    if (cityName) {
      cityName.textContent = 'Search for a city';
    }
    setStatus(error.message || 'Unable to load weather data right now.', 'error');
    return null;
  } finally {
    setLoading(false);
  }
}

async function updateComparisonTable() {
  const tableEl = commonCityRows[0]?.closest('table');
  if (!tableEl) return;

  const cachedHeaders = Array.from(tableEl.querySelectorAll('thead th')).map(th => th.textContent.trim());

  await Promise.allSettled(
    commonCityRows.map(async (row) => {
      const city = row.querySelector('th[scope="row"]')?.textContent.trim();
      if (!city) return;

      setRowMessage(row, 'Loading...');

      const location = await geocodeCity(city);
      if (!location) {
        setRowMessage(row, '—');
        return;
      }

      const weatherData = await fetchWeather(location.latitude, location.longitude);
      renderRowWeather(row, weatherData, cachedHeaders);
    })
  );
}

// FIX: Clean and stable search handler
function handleSearch(event) {
  if (event) event.preventDefault(); // stop page reload

  const city = cityInput.value.trim(); // take input safely
  loadCityWeather(city); // send to API function
}

// FIX: Reliable search handling (button + Enter)
function bindSearchForm() {
  const searchForm = cityInput?.form;

  if (!searchForm || !cityInput) return;

  console.log("Search system initialized"); // DEBUG

  // FIX: form submit (button click also triggers this)
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop page refresh

    const city = cityInput.value.trim();

    console.log("SEARCH CLICKED:", city); // DEBUG

    if (!city) return;

    loadCityWeather(city);

    cityInput.value = ""; // clear after capture
  });
}

function bindPresetCityLinks() {
  presetCityLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const presetCity = link.dataset.city;

      if (cityInput) {
        cityInput.value = presetCity;
      }

      loadCityWeather(presetCity);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  bindSearchForm();
  bindPresetCityLinks();
  resetWeatherSummary();
  setStatus('Search for a city to load live weather data.', 'info');

  await loadCityWeather('Delhi', { updateTable: false });

  // 2. RUN THE FIX: Populate the comparison table using your declarative mapping
  await updateComparisonTable();
});

/* Usage Guide */

const guideBtn =
document.getElementById("openGuide");

const guideModal =
document.getElementById("guideModal");

const closeGuide =
document.querySelector(".close-guide");


guideBtn?.addEventListener(
"click",
(e)=>{

e.preventDefault();

guideModal.style.display="block";

});


closeGuide?.addEventListener(
"click",
()=>{

guideModal.style.display="none";

});


window.addEventListener(
"click",
(e)=>{

if(e.target===guideModal){

guideModal.style.display="none";

}

});