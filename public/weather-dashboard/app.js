// --- APP STATE ---
const state = {
  units: {
    temp: 'C',   // 'C' or 'F'
    wind: 'kmh'  // 'kmh' or 'mph'
  },
  currentCity: {
    name: 'New Delhi',
    country: 'India',
    lat: 28.6139,
    lon: 77.2090,
    timezone: 'Asia/Kolkata'
  },
  savedCities: [
    { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
    { name: 'Bengaluru', country: 'India', lat: 12.9716, lon: 77.5946 },
    { name: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639 },
    { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707 }
  ],
  activeTab: 'weather',
  theme: 'dark',
  map: null,
  mapMarker: null,
  mapSavedMarkers: [],
  mapActiveLayer: 'temp', // 'temp', 'precipitation', 'wind'
  mapHeatLayer: null,
  mapTileLayer: null
};

// --- WMO WEATHER CODE MAPPINGS ---
// Maps Open-Meteo codes to readable terms and SVG Icon names
const weatherCodeMap = {
  0: { label: 'Sunny', class: 'clear', isClear: true },
  1: { label: 'Partly Cloudy', class: 'partly-cloudy' },
  2: { label: 'Partly Cloudy', class: 'partly-cloudy' },
  3: { label: 'Overcast', class: 'cloudy' },
  45: { label: 'Foggy', class: 'windy' },
  48: { label: 'Foggy', class: 'windy' },
  51: { label: 'Light Drizzle', class: 'rainy' },
  53: { label: 'Drizzle', class: 'rainy' },
  55: { label: 'Heavy Drizzle', class: 'rainy' },
  56: { label: 'Light Freezing Drizzle', class: 'rainy' },
  57: { label: 'Freezing Drizzle', class: 'rainy' },
  61: { label: 'Light Rain', class: 'rainy' },
  63: { label: 'Moderate Rain', class: 'rainy' },
  65: { label: 'Heavy Rain', class: 'rainy' },
  66: { label: 'Light Freezing Rain', class: 'rainy' },
  67: { label: 'Freezing Rain', class: 'rainy' },
  71: { label: 'Light Snow', class: 'snowy' },
  73: { label: 'Moderate Snow', class: 'snowy' },
  75: { label: 'Heavy Snow', class: 'snowy' },
  77: { label: 'Snow Grains', class: 'snowy' },
  80: { label: 'Light Showers', class: 'rainy' },
  81: { label: 'Showers', class: 'rainy' },
  82: { label: 'Violent Showers', class: 'rainy' },
  85: { label: 'Light Snow Showers', class: 'snowy' },
  86: { label: 'Snow Showers', class: 'snowy' },
  95: { label: 'Stormy', class: 'stormy' },
  96: { label: 'Stormy with Hail', class: 'stormy' },
  99: { label: 'Heavy Storms', class: 'stormy' }
};

// --- CUSTOM ANIMATED SVG ICONS GENERATOR ---
function getWeatherIconSVG(code, isDay = 1) {
  const meta = weatherCodeMap[code] || { label: 'Sunny', class: 'clear' };
  const iconClass = meta.class;

  switch (iconClass) {
    case 'clear':
      if (isDay) {
        return `
          <svg class="svg-weather-icon" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFE066"/>
                <stop offset="100%" stop-color="#F5A623"/>
              </radialGradient>
              <filter id="sun-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <g class="icon-float">
              <circle cx="50" cy="50" r="22" fill="url(#sun-grad)" filter="url(#sun-glow)"/>
              <g class="icon-spin" style="transform-origin: 50px 50px;">
                <line x1="50" y1="10" x2="50" y2="18" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="50" y1="82" x2="50" y2="90" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="10" y1="50" x2="18" y2="50" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="82" y1="50" x2="90" y2="50" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="22" y1="22" x2="28" y2="28" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="72" y1="72" x2="78" y2="78" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="22" y1="78" x2="28" y2="72" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
                <line x1="72" y1="28" x2="78" y2="22" stroke="#F5A623" stroke-width="4.5" stroke-linecap="round" />
              </g>
            </g>
          </svg>
        `;
      } else {
        return `
          <svg class="svg-weather-icon" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="moon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E2E8F0"/>
                <stop offset="100%" stop-color="#64748B"/>
              </linearGradient>
              <filter id="moon-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            <g class="icon-float">
              <path d="M45,25 A22,22 0 1,0 75,55 A17,17 0 1,1 45,25 z" fill="url(#moon-grad)" filter="url(#moon-glow)" />
              <circle cx="70" cy="22" r="1.2" fill="#FFF" opacity="0.9"/>
              <circle cx="82" cy="34" r="0.8" fill="#FFF" opacity="0.6"/>
              <circle cx="62" cy="38" r="1" fill="#FFF" opacity="0.8"/>
            </g>
          </svg>
        `;
      }

    case 'partly-cloudy':
      return `
        <svg class="svg-weather-icon" viewBox="0 0 100 100">
          <defs>
            <radialGradient id="sun-grad-2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFE066"/>
              <stop offset="100%" stop-color="#F5A623"/>
            </radialGradient>
            <linearGradient id="cloud-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFFFFF"/>
              <stop offset="100%" stop-color="#94A3B8"/>
            </linearGradient>
            <filter id="shadow-cloud" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.25" />
            </filter>
          </defs>
          <g class="icon-float">
            <!-- Sun in background -->
            <g transform="translate(10, -5)">
              <circle cx="40" cy="40" r="15" fill="url(#sun-grad-2)"/>
              <g class="icon-spin" style="transform-origin: 40px 40px;">
                <line x1="40" y1="16" x2="40" y2="21" stroke="#F5A623" stroke-width="3.5" stroke-linecap="round" />
                <line x1="40" y1="59" x2="40" y2="64" stroke="#F5A623" stroke-width="3.5" stroke-linecap="round" />
                <line x1="16" y1="40" x2="21" y2="40" stroke="#F5A623" stroke-width="3.5" stroke-linecap="round" />
                <line x1="59" y1="40" x2="64" y2="40" stroke="#F5A623" stroke-width="3.5" stroke-linecap="round" />
              </g>
            </g>
            <!-- Cloud in foreground -->
            <path d="M28,66 A15,15 0 0,1 40,40 A19,19 0 0,1 70,42 A15,15 0 0,1 78,66 z" fill="url(#cloud-grad-1)" filter="url(#shadow-cloud)"/>
          </g>
        </svg>
      `;

    case 'cloudy':
      return `
        <svg class="svg-weather-icon" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="cloud-main" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#E2E8F0"/>
              <stop offset="100%" stop-color="#64748B"/>
            </linearGradient>
            <linearGradient id="cloud-back" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#94A3B8"/>
              <stop offset="100%" stop-color="#475569"/>
            </linearGradient>
            <filter id="cloud-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.3" />
            </filter>
          </defs>
          <g class="icon-float">
            <!-- Back Cloud -->
            <path d="M22,55 A12,12 0 0,1 32,35 A16,16 0 0,1 58,37 A12,12 0 0,1 64,55 z" fill="url(#cloud-back)" opacity="0.8" transform="translate(14, -8) scale(0.9)"/>
            <!-- Front Cloud -->
            <path d="M24,68 A16,16 0 0,1 36,41 A22,22 0 0,1 70,43 A16,16 0 0,1 78,68 z" fill="url(#cloud-main)" filter="url(#cloud-shadow)"/>
          </g>
        </svg>
      `;

    case 'rainy':
      return `
        <svg class="svg-weather-icon" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="rain-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#94A3B8"/>
              <stop offset="100%" stop-color="#334155"/>
            </linearGradient>
            <filter id="rain-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.35" />
            </filter>
          </defs>
          <g class="icon-float">
            <!-- Cloud -->
            <path d="M24,60 A16,16 0 0,1 36,33 A22,22 0 0,1 70,35 A16,16 0 0,1 78,60 z" fill="url(#rain-cloud)" filter="url(#rain-shadow)"/>
            <!-- Rain Drops -->
            <g stroke="#0095ff" stroke-width="3" stroke-linecap="round">
              <line class="rain-drop rain-drop-1" x1="38" y1="68" x2="33" y2="82" />
              <line class="rain-drop rain-drop-2" x1="52" y1="70" x2="47" y2="84" />
              <line class="rain-drop rain-drop-3" x1="66" y1="68" x2="61" y2="82" />
            </g>
          </g>
        </svg>
      `;

    case 'stormy':
      return `
        <svg class="svg-weather-icon" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="storm-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#64748B"/>
              <stop offset="100%" stop-color="#0F172A"/>
            </linearGradient>
            <filter id="lightning-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          <g class="icon-float">
            <!-- Cloud -->
            <path d="M24,58 A16,16 0 0,1 36,31 A22,22 0 0,1 70,33 A16,16 0 0,1 78,58 z" fill="url(#storm-cloud)"/>
            <!-- Lightning Bolt -->
            <polygon class="lightning-bolt" points="48,54 58,54 46,74 54,74 40,92 48,78 42,78" fill="#F5A623" filter="url(#lightning-glow)" />
            <!-- Rain Drops -->
            <g stroke="#334155" stroke-width="2.5" stroke-linecap="round" opacity="0.6">
              <line class="rain-drop rain-drop-1" x1="32" y1="64" x2="28" y2="76" />
              <line class="rain-drop rain-drop-3" x1="68" y1="64" x2="64" y2="76" />
            </g>
          </g>
        </svg>
      `;

    case 'snowy':
      return `
        <svg class="svg-weather-icon" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="snow-cloud" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#F1F5F9"/>
              <stop offset="100%" stop-color="#94A3B8"/>
            </linearGradient>
          </defs>
          <g class="icon-float">
            <!-- Cloud -->
            <path d="M24,58 A16,16 0 0,1 36,31 A22,22 0 0,1 70,33 A16,16 0 0,1 78,58 z" fill="url(#snow-cloud)"/>
            <!-- Snowflakes -->
            <g fill="#FFFFFF" opacity="0.9">
              <circle class="rain-drop rain-drop-1" cx="36" cy="68" r="2.5"/>
              <circle class="rain-drop rain-drop-2" cx="50" cy="74" r="2"/>
              <circle class="rain-drop rain-drop-3" cx="64" cy="68" r="2.5"/>
            </g>
          </g>
        </svg>
      `;

    case 'windy':
    default:
      return `
        <svg class="svg-weather-icon" viewBox="0 0 100 100">
          <g class="icon-float">
            <g stroke="#94A3B8" stroke-width="4.5" stroke-linecap="round" fill="none">
              <path class="wind-line wind-line-1" d="M20,35 H60 C65,35 68,32 68,28 C68,24 64,22 60,22 C55,22 53,26 53,30" />
              <path class="wind-line wind-line-2" d="M15,50 H75 C80,50 83,47 83,43 C83,39 79,37 75,37 C70,37 68,41 68,45" />
              <path class="wind-line wind-line-3" d="M25,65 H55 C60,65 63,62 63,58 C63,54 59,52 55,52 C50,52 48,56 48,60" />
            </g>
          </g>
        </svg>
      `;
  }
}

// --- CONVERSION UTILITIES ---
function convertTemp(cValue) {
  if (state.units.temp === 'F') {
    return Math.round((cValue * 9/5) + 32);
  }
  return Math.round(cValue);
}

function formatWind(kmhValue) {
  if (state.units.wind === 'mph') {
    return `${Math.round(kmhValue * 0.621371)} mph`;
  }
  return `${Math.round(kmhValue)} km/h`;
}

// --- DOM ELEMENTS ---
const elements = {
  tabItems: document.querySelectorAll('.nav-item'),
  views: document.querySelectorAll('.view-panel'),
  searchVal: document.getElementById('city-search'),
  suggestionsBox: document.getElementById('search-suggestions'),
  
  // Weather View elements
  cityName: document.getElementById('weather-city-name'),
  chanceRain: document.getElementById('weather-chance-rain'),
  tempValue: document.getElementById('weather-temp'),
  heroIcon: document.getElementById('weather-hero-icon'),
  hourlyRow: document.getElementById('hourly-forecast-container'),
  
  // Air condition elements
  condRealfeel: document.getElementById('condition-realfeel'),
  condWind: document.getElementById('condition-wind'),
  condRainprob: document.getElementById('condition-rainprob'),
  condUv: document.getElementById('condition-uv'),
  btnAirDetails: document.getElementById('btn-air-details'),
  
  // Saved Cities elements
  savedCitiesContainer: document.getElementById('saved-cities-container'),
  
  // Forecast Panel elements
  forecastContainer: document.getElementById('forecast-7day-container'),
  
  // Settings View elements
  tempButtons: document.querySelectorAll('#temp-toggle-group .toggle-btn'),
  windButtons: document.querySelectorAll('#wind-toggle-group .toggle-btn'),
  themeButtons: document.querySelectorAll('#theme-toggle-group .toggle-btn'),
  btnClearCities: document.getElementById('btn-clear-cities'),
  sidebarLogo: document.getElementById('sidebar-logo')
};

// --- INITIALIZE APPLICATION ---
function init() {
  loadLocalStorage();
  setupTabListeners();
  setupSearchListeners();
  setupSettingsListeners();
  
  // Fetch initial dashboard city
  getWeatherForecast(state.currentCity);
  
  // Cache and fetch details for list of saved cities
  renderSavedCitiesList();
  
  // Initialize Leaflet Map
  initMap();
}

// --- STORAGE MANAGER ---
function saveLocalStorage() {
  localStorage.setItem('weather_app_state_in', JSON.stringify({
    units: state.units,
    currentCity: state.currentCity,
    savedCities: state.savedCities,
    theme: state.theme
  }));
}

function loadLocalStorage() {
  const stored = localStorage.getItem('weather_app_state_in');
  if (stored) {
    try {
      const data = JSON.parse(stored);
      if (data.units) state.units = data.units;
      if (data.currentCity) state.currentCity = data.currentCity;
      if (data.savedCities && data.savedCities.length > 0) state.savedCities = data.savedCities;
      if (data.theme) state.theme = data.theme === 'light' ? 'light' : 'dark';
      
      applyTheme(state.theme);
      
      // Update toggle buttons in UI
      elements.tempButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === state.units.temp);
      });
      elements.windButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.unit === state.units.wind);
      });
    } catch (e) {
      console.error("Failed loading local storage", e);
    }
  } else {
    applyTheme(state.theme);
  }
}

// --- VIEW NAVIGATION CONTROLLER ---
function setupTabListeners() {
  elements.tabItems.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // See more click jumps to settings or triggers simple info box
  elements.btnAirDetails.addEventListener('click', () => {
    switchTab('settings');
  });

  // Clicking logo re-centers current weather
  elements.sidebarLogo.addEventListener('click', () => {
    switchTab('weather');
  });
}

function switchTab(tabName) {
  state.activeTab = tabName;
  
  // Toggle navigation class active
  elements.tabItems.forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabName);
  });
  
  // Toggle view panels visible
  elements.views.forEach(v => {
    if (v.id === `view-${tabName}`) {
      v.classList.remove('hidden');
    } else {
      v.classList.add('hidden');
    }
  });

  // Map needs layout invalidation so it draws properly when shown
  if (tabName === 'map' && state.map) {
    setTimeout(() => {
      state.map.invalidateSize();
      centerMapOnCity(state.currentCity);
    }, 100);
  }

  if (tabName === 'cities') {
    renderSavedCitiesList();
  }
}

// --- SEARCH AUTO-SUGGEST & GEOLOCATION ---
let searchDebounceTimeout;
function setupSearchListeners() {
  elements.searchVal.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchDebounceTimeout);
    
    if (query.length < 2) {
      elements.suggestionsBox.innerHTML = '';
      elements.suggestionsBox.classList.add('hidden');
      return;
    }
    
    searchDebounceTimeout = setTimeout(() => {
      fetchCitySuggestions(query);
    }, 300);
  });
  
  // Close suggestions if clicked outside
  document.addEventListener('click', (e) => {
    if (!elements.searchVal.contains(e.target) && !elements.suggestionsBox.contains(e.target)) {
      elements.suggestionsBox.classList.add('hidden');
    }
  });
}

async function fetchCitySuggestions(query) {
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
    const data = await res.json();
    
    if (data.results && data.results.length > 0) {
      renderSuggestions(data.results);
    } else {
      elements.suggestionsBox.innerHTML = '<div class="suggestion-item">No cities found</div>';
      elements.suggestionsBox.classList.remove('hidden');
    }
  } catch (err) {
    console.error("Geocoding failed", err);
  }
}

function renderSuggestions(cities) {
  elements.suggestionsBox.innerHTML = '';
  cities.forEach(city => {
    const countryStr = city.admin1 ? `${city.admin1}, ${city.country}` : city.country;
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `
      <div>
        <span style="font-weight: 600;">${city.name}</span><br/>
        <span class="country">${countryStr}</span>
      </div>
      <span style="font-size: 11px; background: rgba(0,149,255,0.15); color: var(--accent); padding: 2px 6px; border-radius: 8px;">Select</span>
    `;
    
    item.addEventListener('click', () => {
      // Set current city
      state.currentCity = {
        name: city.name,
        country: city.country,
        lat: city.latitude,
        lon: city.longitude,
        timezone: city.timezone || 'auto'
      };
      
      // Save query
      elements.searchVal.value = '';
      elements.suggestionsBox.classList.add('hidden');
      
      // Fetch data & switch to weather dashboard
      getWeatherForecast(state.currentCity);
      
      // Auto add to saved list if not already there
      addCityToSavedList(state.currentCity);
      
      switchTab('weather');
    });
    
    elements.suggestionsBox.appendChild(item);
  });
  elements.suggestionsBox.classList.remove('hidden');
}

// --- SAVE / DELETE LOCATION LIST ---
function addCityToSavedList(cityObj) {
  // Prevent duplicate additions
  const exists = state.savedCities.some(c => 
    c.name.toLowerCase() === cityObj.name.toLowerCase() && 
    Math.abs(c.lat - cityObj.lat) < 0.05
  );
  if (!exists) {
    state.savedCities.push({
      name: cityObj.name,
      country: cityObj.country,
      lat: cityObj.lat,
      lon: cityObj.lon
    });
    saveLocalStorage();
    renderSavedCitiesList();
  }
}

function removeCityFromSavedList(idx, event) {
  if (event) event.stopPropagation(); // Avoid selecting city when deleting
  state.savedCities.splice(idx, 1);
  saveLocalStorage();
  renderSavedCitiesList();
  updateMapMarkers();
}

async function renderSavedCitiesList() {
  elements.savedCitiesContainer.innerHTML = '';
  
  if (state.savedCities.length === 0) {
    elements.savedCitiesContainer.innerHTML = `
      <div class="empty-cities-state">
        <svg class="empty-icon" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <p>No locations saved. Search a city above to automatically pin it here.</p>
      </div>
    `;
    return;
  }
  
  // Render cards. We fetch live data sequentially for each saved city
  state.savedCities.forEach(async (city, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'city-weather-card';
    cardEl.innerHTML = `
      <div class="card-top">
        <div>
          <div class="card-name">${city.name}</div>
          <div class="card-country">${city.country}</div>
        </div>
        <div class="card-icon" id="saved-icon-${index}">
          <!-- Mini SVG spinner placeholder -->
          <svg style="width:24px; height:24px;" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="4"></circle>
            <circle cx="25" cy="25" r="20" fill="none" stroke="var(--accent)" stroke-width="4" stroke-dasharray="31.4" transform="rotate(0)"></circle>
          </svg>
        </div>
      </div>
      <div class="card-bottom">
        <div class="card-desc" id="saved-desc-${index}">Loading...</div>
        <div class="card-temp" id="saved-temp-${index}">--</div>
      </div>
      <div class="btn-delete-city" title="Remove city">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    `;
    
    // Select click handler
    cardEl.addEventListener('click', () => {
      state.currentCity = city;
      getWeatherForecast(city);
      switchTab('weather');
    });
    
    // Delete click handler
    const delBtn = cardEl.querySelector('.btn-delete-city');
    delBtn.addEventListener('click', (e) => removeCityFromSavedList(index, e));
    
    elements.savedCitiesContainer.appendChild(cardEl);
    
    // Async fetch weather details for this card
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code,is_day&timezone=auto`);
      const details = await res.json();
      
      if (details.current) {
        const temp = convertTemp(details.current.temperature_2m);
        const code = details.current.weather_code;
        const isDay = details.current.is_day;
        const statusMeta = weatherCodeMap[code] || { label: 'Clear' };
        
        document.getElementById(`saved-temp-${index}`).innerText = `${temp}°`;
        document.getElementById(`saved-desc-${index}`).innerText = statusMeta.label;
        document.getElementById(`saved-icon-${index}`).innerHTML = getWeatherIconSVG(code, isDay);
      }
    } catch (err) {
      console.error(`Failed card load for ${city.name}`, err);
    }
  });
}

// --- FETCH & RENDER CORE FORECASTS ---
async function getWeatherForecast(city) {
  try {
    elements.cityName.innerText = `${city.name}`;
    elements.chanceRain.innerText = `Fetching updates...`;
    
    const timezone = city.timezone === 'auto' ? 'auto' : encodeURIComponent(city.timezone);
    const queryUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_probability_max&timezone=${timezone}`;
    
    const res = await fetch(queryUrl);
    const data = await res.json();
    
    renderCurrentWeather(data, city);
    renderHourlyForecast(data);
    renderAirConditions(data);
    render7DayForecast(data);
    
    // Sync map marker
    centerMapOnCity(city);
    saveLocalStorage();
  } catch (err) {
    console.error("Forecast API call failed", err);
    elements.cityName.innerText = "Error Loading Weather";
    elements.chanceRain.innerText = "Could not reach Open-Meteo server";
  }
}

function renderCurrentWeather(data, city) {
  const current = data.current;
  const hourly = data.hourly;
  
  // Calculate temp
  const temp = convertTemp(current.temperature_2m);
  elements.tempValue.innerText = temp;
  
  // Icon
  elements.heroIcon.innerHTML = getWeatherIconSVG(current.weather_code, current.is_day);
  
  // Chance of rain (extract maximum precipitation probability from current day or next 6 hours)
  let rainProb = 0;
  if (data.daily && data.daily.precipitation_probability_max) {
    rainProb = data.daily.precipitation_probability_max[0];
  } else if (hourly && hourly.precipitation_probability) {
    // Average first 3 hours
    rainProb = Math.round((hourly.precipitation_probability[0] + hourly.precipitation_probability[1] + hourly.precipitation_probability[2]) / 3);
  }
  
  elements.chanceRain.innerText = `Chance of rain: ${rainProb}%`;
}

function renderHourlyForecast(data) {
  elements.hourlyRow.innerHTML = '';
  const hourly = data.hourly;
  
  // Parse time stamps from API and select current hour + next 5 hours
  const now = new Date();
  const times = hourly.time;
  
  // Find current hour index
  let currentIndex = 0;
  const currentHourStr = now.toISOString().slice(0, 13) + ':00'; // Match API ISO syntax e.g. "2026-06-20T14:00"
  
  // Fallback to searching nearest time if ISO format mismatch
  currentIndex = times.findIndex(t => t.startsWith(currentHourStr.slice(0, 13)));
  if (currentIndex === -1) currentIndex = 12; // default fallback noon index
  
  // Pull 6 hourly intervals, e.g., offset by 3 hours to represent morning/daytime rows as in mockup
  // The mockup shows: 6:00 AM, 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM, 9:00 PM
  // Let's filter indices representing daytime hours of the current forecast array (say index 6, 9, 12, 15, 18, 21 of the current day)
  // This exactly reproduces the visual mockup format.
  const hoursToRender = [6, 9, 12, 15, 18, 21];
  
  hoursToRender.forEach(hr => {
    // Hour indices range 0-23
    const index = hr;
    const rawTime = new Date(times[index]);
    
    // Formatting time string: e.g. "6:00 AM", "12:00 PM"
    let displayHour = rawTime.getHours();
    const ampm = displayHour >= 12 ? 'PM' : 'AM';
    displayHour = displayHour % 12;
    displayHour = displayHour ? displayHour : 12; // 0 hr is 12 AM
    const formattedTime = `${displayHour}:00 ${ampm}`;
    
    const temp = convertTemp(hourly.temperature_2m[index]);
    const code = hourly.weather_code[index];
    
    const hourlyEl = document.createElement('div');
    hourlyEl.className = 'hourly-item';
    hourlyEl.innerHTML = `
      <span class="hourly-time">${formattedTime}</span>
      <div class="hourly-icon">${getWeatherIconSVG(code, 1)}</div>
      <span class="hourly-temp">${temp}°</span>
    `;
    elements.hourlyRow.appendChild(hourlyEl);
  });
}

function renderAirConditions(data) {
  const current = data.current;
  const daily = data.daily;
  
  // Real Feel
  const realFeel = convertTemp(current.apparent_temperature);
  elements.condRealfeel.innerText = `${realFeel}°`;
  
  // Wind Speed
  elements.condWind.innerText = formatWind(current.wind_speed_10m);
  
  // Chance of rain
  const rainProb = daily && daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;
  elements.condRainprob.innerText = `${rainProb}%`;
  
  // UV Index
  const uv = daily && daily.uv_index_max ? daily.uv_index_max[0] : 0;
  elements.condUv.innerText = Math.round(uv);
}

function render7DayForecast(data) {
  elements.forecastContainer.innerHTML = '';
  const daily = data.daily;
  if (!daily) return;
  
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Loop 7 days
  for (let i = 0; i < 7; i++) {
    const rawDate = new Date(daily.time[i]);
    let dayName = days[rawDate.getDay()];
    
    // Label today as "Today"
    if (i === 0) dayName = 'Today';
    
    const minTemp = convertTemp(daily.temperature_2m_min[i]);
    const maxTemp = convertTemp(daily.temperature_2m_max[i]);
    const code = daily.weather_code[i];
    const statusMeta = weatherCodeMap[code] || { label: 'Sunny' };
    
    const row = document.createElement('div');
    row.className = 'forecast-item';
    row.innerHTML = `
      <div class="forecast-day">${dayName}</div>
      <div class="forecast-weather-group">
        <div class="forecast-icon">${getWeatherIconSVG(code, 1)}</div>
        <div class="forecast-desc">${statusMeta.label}</div>
      </div>
      <div class="forecast-temp-range">${maxTemp}<span>/${minTemp}</span></div>
    `;
    elements.forecastContainer.appendChild(row);
  }
}

// --- THEME MANAGEMENT ---
function applyTheme(themeName) {
  state.theme = themeName;
  document.body.setAttribute('data-theme', themeName);
  
  // Update toggle buttons in settings UI
  if (elements.themeButtons) {
    elements.themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeName);
    });
  }
  
  // Re-load correct map tile layers
  updateMapTileLayer();
}

function updateMapTileLayer() {
  if (!state.map) return;
  
  if (state.mapTileLayer) {
    state.map.removeLayer(state.mapTileLayer);
  }
  
  let tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  if (state.theme === 'light') {
    tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  }
  
  state.mapTileLayer = L.tileLayer(tileUrl, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(state.map);
}

// --- INTERACTIVE LEAFLET MAP ---
function initMap() {
  try {
    // Center map initially around Madrid
    state.map = L.map('weather-map', {
      zoomControl: true,
      attributionControl: true
    }).setView([state.currentCity.lat, state.currentCity.lon], 5);
    
    // Set map tiles according to current theme style
    updateMapTileLayer();

    // Initial marker placement
    state.mapMarker = L.marker([state.currentCity.lat, state.currentCity.lon]).addTo(state.map);
    state.mapMarker.bindPopup(`<b>${state.currentCity.name}</b><br>Currently Selected.`).openPopup();
    
    // Click on map to geolocate & fetch weather
    state.map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      // Reverse geocode to find city name
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
        const data = await res.json();
        
        const cityName = data.address.city || data.address.town || data.address.village || data.address.county || "Unknown location";
        const countryName = data.address.country || "";
        
        state.currentCity = {
          name: cityName,
          country: countryName,
          lat: lat,
          lon: lng,
          timezone: 'auto'
        };
        
        getWeatherForecast(state.currentCity);
        addCityToSavedList(state.currentCity);
        
        // Show indicator click
        state.mapMarker.setLatLng([lat, lng]);
        state.mapMarker.bindPopup(`<b>${cityName}</b><br>Loaded weather data.`).openPopup();
      } catch (err) {
        console.error("Reverse geocoding failed", err);
      }
    });

    setupMapOverlayListeners();
    updateMapMarkers();
  } catch (err) {
    console.error("Failed to initialize Leaflet Map", err);
  }
}

function centerMapOnCity(city) {
  if (state.map) {
    state.map.setView([city.lat, city.lon], 7);
    if (state.mapMarker) {
      state.mapMarker.setLatLng([city.lat, city.lon]);
      state.mapMarker.bindPopup(`<b>${city.name}</b><br>${city.country}`).openPopup();
    }
    
    drawMockWeatherOverlay(city.lat, city.lon);
  }
}

function drawMockWeatherOverlay(lat, lon) {
  // Remove existing heat layers/circles
  if (state.mapHeatLayer) {
    state.map.removeLayer(state.mapHeatLayer);
    state.mapHeatLayer = null;
  }
  
  // Draw glowing weather circles based on selected map overlays
  let layerColor = 'rgba(255, 166, 35, 0.4)'; // Orange for temperature
  let pulseRadius = 50000;
  
  if (state.mapActiveLayer === 'precipitation') {
    layerColor = 'rgba(0, 149, 255, 0.4)'; // Blue for rain
    pulseRadius = 65000;
  } else if (state.mapActiveLayer === 'wind') {
    layerColor = 'rgba(148, 163, 184, 0.4)'; // Grey for wind
    pulseRadius = 80000;
  }
  
  state.mapHeatLayer = L.circle([lat, lon], {
    color: layerColor,
    fillColor: layerColor,
    fillOpacity: 0.25,
    radius: pulseRadius,
    stroke: true,
    weight: 2
  }).addTo(state.map);
}

function updateMapMarkers() {
  if (!state.map) return;
  
  // Clear old markers
  state.mapSavedMarkers.forEach(m => state.map.removeLayer(m));
  state.mapSavedMarkers = [];
  
  // Add pin for each saved city
  state.savedCities.forEach(city => {
    // Avoid double mapping selected city
    if (city.name === state.currentCity.name) return;
    
    const pin = L.circleMarker([city.lat, city.lon], {
      radius: 6,
      fillColor: 'var(--accent)',
      color: '#fff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(state.map);
    
    const popupContainer = document.createElement("div");

    const cityTitle = document.createElement("b");
    cityTitle.textContent = city.name;

    const lineBreak = document.createElement("br");

    const selectBtn = document.createElement("button");
    selectBtn.textContent = "Select City";

    selectBtn.style.marginTop = "6px";
    selectBtn.style.fontSize = "11px";
    selectBtn.style.padding = "3px 8px";
    selectBtn.style.background = "var(--accent)";
    selectBtn.style.border = "none";
    selectBtn.style.borderRadius = "6px";
    selectBtn.style.color = "#fff";
    selectBtn.style.cursor = "pointer";

    selectBtn.addEventListener("click", () => {
      window.loadCityFromMap(
        city.lat,
        city.lon,
        city.name,
        city.country
      );
    });

    popupContainer.appendChild(cityTitle);
    popupContainer.appendChild(lineBreak);
    popupContainer.appendChild(selectBtn);

    pin.bindPopup(popupContainer);

    state.mapSavedMarkers.push(pin);
  });
}

// Global hook for Map popup click
window.loadCityFromMap = function(lat, lon, name, country) {
  state.currentCity = { name, country, lat, lon, timezone: 'auto' };
  getWeatherForecast(state.currentCity);
  switchTab('weather');
};

function setupMapOverlayListeners() {
  const overlayButtons = document.querySelectorAll('.map-control-btn');
  overlayButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      overlayButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mapActiveLayer = btn.dataset.layer;
      drawMockWeatherOverlay(state.currentCity.lat, state.currentCity.lon);
    });
  });
}

// --- SETTINGS PANEL HANDLERS ---
function setupSettingsListeners() {
  // Temp unit toggles
  elements.tempButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tempButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.units.temp = btn.dataset.unit;
      
      saveLocalStorage();
      // Trigger full UI redraw from current variables
      getWeatherForecast(state.currentCity);
      renderSavedCitiesList();
    });
  });
  
  // Wind unit toggles
  elements.windButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.windButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.units.wind = btn.dataset.unit;
      
      saveLocalStorage();
      getWeatherForecast(state.currentCity);
    });
  });

  // Theme toggles
  elements.themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      saveLocalStorage();
    });
  });
  
  // Clear storage
  elements.btnClearCities.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear all your saved locations?")) {
      state.savedCities = [
        { name: 'New Delhi', country: 'India', lat: 28.6139, lon: 77.2090 },
        { name: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
        { name: 'Bengaluru', country: 'India', lat: 12.9716, lon: 77.5946 },
        { name: 'Kolkata', country: 'India', lat: 22.5726, lon: 88.3639 },
        { name: 'Chennai', country: 'India', lat: 13.0827, lon: 80.2707 }
      ];
      saveLocalStorage();
      renderSavedCitiesList();
      updateMapMarkers();
      alert("Saved locations reset to default.");
    }
  });
}

// Start app
window.addEventListener('DOMContentLoaded', init);
