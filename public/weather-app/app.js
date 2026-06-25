/* ==========================================================================
   WeatherLens Engine — Highly Advanced & Production-Ready Script
   ========================================================================== */

const GEO_BASE  = "https://geocoding-api.open-meteo.com/v1/search";
const WX_BASE   = "https://api.open-meteo.com/v1/forecast";
const AQI_BASE  = "https://air-quality-api.open-meteo.com/v1/air-quality";

// WMO weather code → description + icon mapping
const WMO = {
  0:  { desc: "Clear sky",             icon: "01" },
  1:  { desc: "Mainly clear",          icon: "02" },
  2:  { desc: "Partly cloudy",         icon: "03" },
  3:  { desc: "Overcast",              icon: "04" },
  45: { desc: "Foggy",                 icon: "50" },
  48: { desc: "Icy fog",               icon: "50" },
  51: { desc: "Light drizzle",         icon: "09" },
  53: { desc: "Moderate drizzle",      icon: "09" },
  55: { desc: "Dense drizzle",         icon: "09" },
  61: { desc: "Slight rain",           icon: "10" },
  63: { desc: "Moderate rain",         icon: "10" },
  65: { desc: "Heavy rain",            icon: "10" },
  71: { desc: "Slight snow",           icon: "13" },
  73: { desc: "Moderate snow",         icon: "13" },
  75: { desc: "Heavy snow",            icon: "13" },
  77: { desc: "Snow grains",           icon: "13" },
  80: { desc: "Slight showers",        icon: "09" },
  81: { desc: "Moderate showers",      icon: "09" },
  82: { desc: "Violent showers",       icon: "09" },
  85: { desc: "Slight snow showers",   icon: "13" },
  86: { desc: "Heavy snow showers",    icon: "13" },
  95: { desc: "Thunderstorm",          icon: "11" },
  96: { desc: "Thunderstorm w/ hail",  icon: "11" },
  99: { desc: "Thunderstorm w/ hail",  icon: "11" },
};

function wmoInfo(code, isNight) {
  const w = WMO[code] || { desc: "Unknown", icon: "01" };
  const suffix = (isNight && ["01","02","03"].includes(w.icon)) ? "n" : "d";
  return { 
    desc: w.desc, 
    iconUrl: `https://openweathermap.org/img/wn/${w.icon}${suffix}@2x.png`, 
    isNight: suffix === "n" 
  };
}

function wmoTheme(code, isNight) {
  if (isNight) return "night";
  if (code === 0 || code === 1) return "sunny";
  if (code >= 51 && code <= 82) return "rainy";
  if (code >= 71 && code <= 86) return "snowy";
  if (code >= 95) return "rainy";
  if (code >= 2)  return "cloudy";
  return "default";
}

const AQI_LEVELS = [
  { label: "Good",      color: "#22c55e", class: "aqi-1" },
  { label: "Fair",      color: "#84cc16", class: "aqi-2" },
  { label: "Moderate",  color: "#eab308", class: "aqi-3" },
  { label: "Poor",      color: "#f97316", class: "aqi-4" },
  { label: "Very Poor", color: "#ef4444", class: "aqi-5" },
];

function aqiLevel(usAqi) {
  if (usAqi <= 50)  return AQI_LEVELS[0];
  if (usAqi <= 100) return AQI_LEVELS[1];
  if (usAqi <= 150) return AQI_LEVELS[2];
  if (usAqi <= 200) return AQI_LEVELS[3];
  return AQI_LEVELS[4];
}

/* ==========================================================================
   State & Global Application Registry
   ========================================================================== */
let currentUnit    = "metric";
let currentCity    = "";
let favourites     = JSON.parse(localStorage.getItem("wl_favs")    || "[]");
let recentSearches = JSON.parse(localStorage.getItem("wl_recent")  || "[]");
let particles      = [];
let animFrame;
let sunriseTs = 0, sunsetTs = 0;

// DOM Registry Cache
const $ = id => document.getElementById(id);
const cityInput       = $("cityInput");
const searchBtn       = $("searchBtn");
const geoBtn          = $("geoBtn");
const statusMessage   = $("statusMessage");
const statusText      = $("statusText");
const statusSpinner   = $("statusSpinner");
const weatherDisplay  = $("weatherDisplay");
const errorState      = $("errorState");
const errorText       = $("errorText");
const appBody         = $("appBody");
const cityName        = $("cityName");
const weatherCondition= $("weatherCondition");
const tempDisplay     = $("tempDisplay");
const feelsLike       = $("feelsLike");
const weatherIcon     = $("weatherIcon");
const humidityValue   = $("humidityValue");
const windValue       = $("windValue");
const pressureValue   = $("pressureValue");
const visibilityValue = $("visibilityValue");
const uvIndex         = $("uvIndex");
const cloudinessValue = $("cloudinessValue");
const sunriseVal      = $("sunriseVal");
const sunsetVal       = $("sunsetVal");
const localTime       = $("localTime");
const forecastList    = $("forecastList");
const favList         = $("favList");
const favBtn          = $("favBtn");
const aqiDisplay      = $("aqiDisplay");
const recentSearchesDiv = $("recentSearches");
const recentList      = $("recentList");
const unitToggle      = $("unitToggle");
const canvas          = $("particleCanvas");
const ctx             = canvas.getContext("2d");
const liveTime        = $("liveTime");
const liveDate        = $("liveDate");

/* ==========================================================================
   Clock Mechanics
   ========================================================================== */
function updateClock() {
  const now = new Date();
  liveTime.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  liveDate.textContent = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}
updateClock();
setInterval(updateClock, 1000);

/* ==========================================================================
   Unit Management Systems
   ========================================================================== */
unitToggle.addEventListener("click", e => {
  const opt = e.target.closest(".unit-opt");
  if (!opt) return;
  const newUnit = opt.dataset.unit;
  if (newUnit === currentUnit) return;
  currentUnit = newUnit;
  document.querySelectorAll(".unit-opt").forEach(el =>
    el.classList.toggle("active", el.dataset.unit === currentUnit));
  if (currentCity) {
    fetchByName(currentCity.split(",")[0].trim());
  }
});

/* ==========================================================================
   Core Networking Engine
   ========================================================================== */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network tracking returned status HTTP ${res.status}`);
  return res.json();
}

async function fetchByName(query) {
  if (!validateInput(query)) return;
  showStatus("Locating city coordinates…");
  try {
    const geo = await fetchJSON(`${GEO_BASE}?name=${encodeURIComponent(query)}&count=1&language=en&format=json`);
    if (!geo.results || geo.results.length === 0) {
      throw new Error(`Could not find "${query}". Check spelling and try again.`);
    }
    const place = geo.results[0];
    await fetchByCoords(place.latitude, place.longitude, place.name, place.country, place.timezone);
    addRecentSearch(place.name);
  } catch (err) {
    showError(err.message);
  }
}

async function fetchByCoords(lat, lon, name, country, timezone) {
  showStatus("Syncing local microclimate data…");
  try {
    if (!name) {
      const geo = await fetchJSON(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      if(geo && geo.address) {
        name    = geo.address.city || geo.address.town || geo.address.village || geo.address.county || "Detected Location";
        country = geo.address.country_code?.toUpperCase() || "";
      } else {
        name = "Local Horizon";
        country = "";
      }
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    const unitParam    = currentUnit === "metric" ? "celsius" : "fahrenheit";
    const windUnit     = currentUnit === "metric" ? "ms" : "mph";
    const speedLabel   = currentUnit === "metric" ? "m/s" : "mph";
    const tempUnit     = currentUnit === "metric" ? "°C" : "°F";

    const wxUrl = `${WX_BASE}?latitude=${lat}&longitude=${lon}`
      + `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,visibility,wind_speed_10m,cloud_cover,uv_index,is_day`
      + `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset`
      + `&temperature_unit=${unitParam}&wind_speed_unit=${windUnit}`
      + `&timezone=${encodeURIComponent(timezone || "auto")}&forecast_days=6`;

    const aqiUrl = `${AQI_BASE}?latitude=${lat}&longitude=${lon}`
      + `&current=us_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,carbon_monoxide`
      + `&timezone=${encodeURIComponent(timezone || "auto")}`;

    const [wx, aqi] = await Promise.all([fetchJSON(wxUrl), fetchJSON(aqiUrl)]);

    const c = wx.current;
    const d = wx.daily;
    const isNight = c.is_day === 0;
    const wmo = wmoInfo(c.weather_code, isNight);

    currentCity = `${name}${country ? `, ${country}` : ""}`;
    cityName.textContent = currentCity;
    weatherCondition.textContent = wmo.desc;
    tempDisplay.textContent = `${Math.round(c.temperature_2m)}${tempUnit}`;
    feelsLike.textContent = `${Math.round(c.apparent_temperature)}${tempUnit}`;
    weatherIcon.src = wmo.iconUrl;
    weatherIcon.alt = wmo.desc;
    humidityValue.textContent = `${c.relative_humidity_2m}%`;
    windValue.textContent = `${c.wind_speed_10m} ${speedLabel}`;
    pressureValue.textContent = `${Math.round(c.surface_pressure)} hPa`;
    visibilityValue.textContent = c.visibility != null ? `${(c.visibility / 1000).toFixed(1)} km` : "N/A";
    uvIndex.textContent = c.uv_index != null ? c.uv_index.toFixed(1) : "N/A";
    cloudinessValue.textContent = `${c.cloud_cover}%`;

    const srStr = d.sunrise[0], ssStr = d.sunset[0];
    sunriseVal.textContent = srStr ? srStr.slice(11, 16) : "—";
    sunsetVal.textContent  = ssStr ? ssStr.slice(11, 16) : "—";
    sunriseTs = srStr ? new Date(srStr).getTime() / 1000 : 0;
    sunsetTs  = ssStr ? new Date(ssStr).getTime() / 1000 : 0;
    animateSunArc();

    try {
      localTime.textContent = "Local Horizon: " + new Date().toLocaleTimeString("en-US",
        { timeZone: timezone, hour: "2-digit", minute: "2-digit" });
    } catch { 
      localTime.textContent = ""; 
    }

    renderForecast(d, tempUnit);
    renderAQI(aqi);

    const theme = wmoTheme(c.weather_code, isNight);
    appBody.setAttribute("data-weather-theme", theme);
    startParticles(theme);

    favBtn.classList.toggle("active", favourites.includes(currentCity));

    weatherDisplay.classList.remove("hidden");
    errorState.classList.add("hidden");
    statusMessage.classList.add("hidden");
    renderFavourites();

  } catch (err) {
    showError(err.message || "Failed sync cycle to gather remote matrix parameters.");
  }
}

/* ==========================================================================
   Automatic & Manual Location Detection Engine
   ========================================================================== */
function runAutomaticDetection() {
  if (!navigator.geolocation) {
    fetchByName("London"); // Safe default metric sandbox fallback
    return;
  }

  showStatus("Detecting current coordinates automatically…");
  geoBtn.classList.add("locating-active");

  navigator.geolocation.getCurrentPosition(
    position => {
      geoBtn.classList.remove("locating-active");
      fetchByCoords(position.coords.latitude, position.coords.longitude);
    },
    error => {
      geoBtn.classList.remove("locating-active");
      let systemReason = "Location tracking access declined.";
      if (error.code === error.POSITION_UNAVAILABLE) systemReason = "Network location data structural failure.";
      if (error.code === error.TIMEOUT) systemReason = "Location handshake tracking cycle timed out.";
      
      console.warn(`Geolocation sequence warning: ${systemReason}. Loading structural default (London).`);
      fetchByName("London");
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 600000 }
  );
}

/* ==========================================================================
   UI Data Rendering Pipelines
   ========================================================================== */
function renderForecast(d, tempUnit) {
  forecastList.innerHTML = "";
  const days = d.time.slice(1, 6);
  days.forEach((dateStr, i) => {
    const idx = i + 1;
    const day = new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
    const hi  = Math.round(d.temperature_2m_max[idx]);
    const lo  = Math.round(d.temperature_2m_min[idx]);
    const wmo = wmoInfo(d.weather_code[idx], false);

    const row = document.createElement("div");
    row.className = "forecast-row";
    row.innerHTML = `
      <span class="fc-day">${day}</span>
      <img class="fc-icon" src="${wmo.iconUrl}" alt="${wmo.desc}" />
      <span class="fc-desc">${wmo.desc}</span>
      <div class="fc-temps">
        <div class="fc-hi">${hi}${tempUnit}</div>
        <div class="fc-lo">${lo}${tempUnit}</div>
      </div>`;
    forecastList.appendChild(row);
  });
}

function renderAQI(aqi) {
  const c = aqi.current;
  const usAqi = Math.round(c.us_aqi);
  const info  = aqiLevel(usAqi);
  aqiDisplay.innerHTML = `
    <div class="aqi-badge ${info.class}">
      <span>AQI ${usAqi}</span> — <span>${info.label}</span>
    </div>
    <div class="aqi-bar-wrap">
      <div class="aqi-bar" style="width:${Math.min(usAqi / 3, 100)}%;"></div>
    </div>
    <div class="aqi-components">
      <span class="aqi-comp">PM2.5: ${c.pm2_5?.toFixed(1) ?? "—"}</span>
      <span class="aqi-comp">PM10: ${c.pm10?.toFixed(1) ?? "—"}</span>
      <span class="aqi-comp">NO₂: ${c.nitrogen_dioxide?.toFixed(1) ?? "—"}</span>
      <span class="aqi-comp">O₃: ${c.ozone?.toFixed(1) ?? "—"}</span>
      <span class="aqi-comp">CO: ${c.carbon_monoxide?.toFixed(0) ?? "—"}</span>
    </div>`;
}

function renderFavourites() {
  if (favourites.length === 0) {
    favList.innerHTML = `<p class="side-placeholder">No saved tracks inside memory profile.</p>`;
    return;
  }
  favList.innerHTML = "";
  favourites.forEach(city => {
    const item = document.createElement("div");
    item.className = "fav-item";
    item.innerHTML = `
      <span class="fav-item-name">${city}</span>
      <button class="fav-remove" title="Wipe track profile">×</button>`;
    
    item.querySelector(".fav-item-name").addEventListener("click", () => fetchByName(city.split(",")[0].trim()));
    item.querySelector(".fav-remove").addEventListener("click", e => {
      e.stopPropagation();
      favourites = favourites.filter(f => f !== city);
      localStorage.setItem("wl_favs", JSON.stringify(favourites));
      renderFavourites();
      if (city === currentCity) favBtn.classList.remove("active");
    });
    favList.appendChild(item);
  });
}

favBtn.addEventListener("click", () => {
  if (!currentCity) return;
  if (favourites.includes(currentCity)) {
    favourites = favourites.filter(f => f !== currentCity);
    favBtn.classList.remove("active");
  } else {
    favourites.unshift(currentCity);
    if (favourites.length > 8) favourites.pop();
    favBtn.classList.add("active");
  }
  localStorage.setItem("wl_favs", JSON.stringify(favourites));
  renderFavourites();
});

function addRecentSearch(city) {
  const norm = city.trim().toLowerCase();
  recentSearches = recentSearches.filter(r => r.toLowerCase() !== norm);
  recentSearches.unshift(city.trim());
  if (recentSearches.length > 5) recentSearches.pop();
  localStorage.setItem("wl_recent", JSON.stringify(recentSearches));
  renderRecent();
}

function renderRecent() {
  if (recentSearches.length === 0) { recentSearchesDiv.classList.add("hidden"); return; }
  recentSearchesDiv.classList.remove("hidden");
  recentList.innerHTML = "";
  recentSearches.forEach(city => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.textContent = city;
    chip.addEventListener("click", () => fetchByName(city));
    recentList.appendChild(chip);
  });
}

function animateSunArc() {
  const now = Math.floor(Date.now() / 1000);
  const dayLen = sunsetTs - sunriseTs;
  const pct = dayLen > 0 ? Math.max(0, Math.min((now - sunriseTs) / dayLen, 1)) : 0;
  const path = document.getElementById("sunProgress");
  const dot  = document.getElementById("sunDot");
  if(path && dot) {
    path.style.strokeDashoffset = 120 * (1 - pct);
    const t = pct;
    dot.setAttribute("cx", (1-t)*(1-t)*10 + 2*(1-t)*t*60 + t*t*110);
    dot.setAttribute("cy", (1-t)*(1-t)*55 + 2*(1-t)*t*5  + t*t*55);
  }
}

/* ==========================================================================
   Fluid High-Fidelity Particle System Engine
   ========================================================================== */
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function startParticles(theme) {
  cancelAnimationFrame(animFrame);
  particles = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (theme === "rainy") spawnRain();
  else if (theme === "snowy") spawnSnow();
  else if (theme === "sunny") spawnSparkles();
  else if (theme === "night") spawnStars();
  else return;
  animateParticles(theme);
}

function spawnRain() {
  for (let i = 0; i < 120; i++) particles.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    len: Math.random() * 18 + 8, speed: Math.random() * 8 + 10,
    alpha: Math.random() * 0.4 + 0.15,
  });
}
function spawnSnow() {
  for (let i = 0; i < 80; i++) particles.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 3 + 1, speed: Math.random() * 1.2 + 0.4,
    drift: (Math.random() - 0.5) * 0.5, alpha: Math.random() * 0.6 + 0.2,
  });
}
function spawnSparkles() {
  for (let i = 0; i < 40; i++) particles.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5, life: Math.random(), speed: Math.random() * 0.012 + 0.005,
  });
}
function spawnStars() {
  for (let i = 0; i < 100; i++) particles.push({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height * 0.7,
    r: Math.random() * 1.5 + 0.3, twinkle: Math.random(), speed: Math.random() * 0.02 + 0.005,
  });
}

function animateParticles(theme) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    if (theme === "rainy") {
      ctx.save(); ctx.strokeStyle = `rgba(147,197,253,${p.alpha})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - 2, p.y + p.len);
      ctx.stroke(); ctx.restore();
      p.y += p.speed;
      if (p.y > canvas.height) { p.y = -p.len; p.x = Math.random() * canvas.width; }
    } else if (theme === "snowy") {
      ctx.save(); ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      p.y += p.speed; p.x += p.drift;
      if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width; }
    } else if (theme === "sunny") {
      p.life += p.speed; if (p.life > 1) p.life = 0;
      ctx.save(); ctx.fillStyle = `rgba(253,224,71,${Math.sin(p.life * Math.PI) * 0.5})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    } else if (theme === "night") {
      p.twinkle += p.speed; if (p.twinkle > 1) p.twinkle = 0;
      ctx.save(); ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(p.twinkle * Math.PI) * 0.5})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  });
  animFrame = requestAnimationFrame(() => animateParticles(theme));
}

/* ==========================================================================
   Defensive Intermediary States & Validation
   ========================================================================== */
function validateInput(str) {
  if (!str) { showError("Please enter a target city name first."); return false; }
  if (/[0-9]/.test(str)) { showError("Metric parameters cannot validate strings containing numbers."); return false; }
  if (/[<>{}[\]\\]/.test(str)) { showError("Input contains unauthorized script parameters."); return false; }
  return true;
}

function showStatus(msg) {
  statusText.textContent = msg;
  statusMessage.classList.remove("hidden");
  statusSpinner.classList.remove("hidden");
  weatherDisplay.classList.add("hidden");
  errorState.classList.add("hidden");
}

function showError(msg) {
  errorText.textContent = msg;
  errorState.classList.remove("hidden");
  statusMessage.classList.add("hidden");
  weatherDisplay.classList.add("hidden");
}

/* ==========================================================================
   Event Binding Architectures
   ========================================================================== */
searchBtn.addEventListener("click", () => {
  const q = cityInput.value.trim();
  fetchByName(q);
});

cityInput.addEventListener("keypress", e => { 
  if (e.key === "Enter") searchBtn.click(); 
});

geoBtn.addEventListener("click", () => {
  if (!navigator.geolocation) { 
    showError("Geolocation tracking protocols not supported on this node."); 
    return; 
  }
  showStatus("Syncing current location metadata…");
  navigator.geolocation.getCurrentPosition(
    pos => fetchByCoords(pos.coords.latitude, pos.coords.longitude),
    ()  => showError("Location permission denied. Enter city coordinate strings manually.")
  );
});

/* ==========================================================================
   Initialization Routine
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderRecent();
  renderFavourites();
  runAutomaticDetection();
});