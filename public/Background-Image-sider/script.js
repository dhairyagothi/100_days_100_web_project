// ───── DESTINATION DATA ─────
const destinations = [
  { name: "Iceland", flag: "🇮🇸", region: "Europe", bg: "url('images/iceland.jpg')", desc: "Explore glaciers, geysers, and the ethereal Northern Lights across volcanic landscapes.", lat: 64.9631, lon: -19.0208 },
  { name: "Switzerland", flag: "🇨🇭", region: "Europe", bg: "url('images/Jennifer.avif')", desc: "Experience the serene beauty of the Swiss Alps and impossibly picturesque alpine villages.", lat: 46.8182, lon: 8.2275 },
  { name: "Scotland", flag: "🏴", region: "Europe", bg: "url('images/Daniel.jpeg')", desc: "Discover ancient castles, rugged Highlands, and a culture steeped in myth and legend.", lat: 56.4907, lon: -4.2026 },
  { name: "Ireland", flag: "🇮🇪", region: "Europe", bg: "url('images/kai.jpg')", desc: "Immerse yourself in emerald landscapes, dramatic coastal cliffs, and warm Celtic hospitality.", lat: 53.1424, lon: -7.6921 },
  { name: "Germany", flag: "🇩🇪", region: "Europe", bg: "url('images/Hannes-Becker4.jpg')", desc: "Explore fairy-tale castles, medieval towns, and a legendary beer and sausage culture.", lat: 51.1657, lon: 10.4515 },
  { name: "India", flag: "🇮🇳", region: "Asia", bg: "url('images/tajmehal.png')", desc: "A tapestry of majestic forts, colorful festivals, ancient spice routes, and the iconic Taj Mahal.", lat: 20.5937, lon: 78.9629 },
  { name: "Korea", flag: "🇰🇷", region: "Asia", bg: "url('images/korea.png')", desc: "Discover a perfect blend of futuristic cities, ancient palaces, K-culture, and mountain serenity.", lat: 35.9078, lon: 127.7669 },
  { name: "Japan", flag: "🇯🇵", region: "Asia", bg: "url('images/japan.png')", desc: "Journey through ancient temples, neon-lit streets, and ethereal cherry blossom forests.", lat: 36.2048, lon: 138.2529 },
  { name: "China", flag: "🇨🇳", region: "Asia", bg: "url('images/china.png')", desc: "Explore the Great Wall, misty karst mountains, and the dazzling energy of its megacities.", lat: 35.8617, lon: 104.1954 },
  { name: "Bali", flag: "🇮🇩", region: "Asia", bg: "url('images/bali.png')", desc: "Unwind in a tropical paradise of rice terraces, spiritual temples, and golden sunsets.", lat: -8.3405, lon: 115.0920 },
  { name: "Italy", flag: "🇮🇹", region: "Europe", bg: "url('images/italy.png')", desc: "Wander through millennia of history, breathtaking art, and the world's finest cuisine.", lat: 41.8719, lon: 12.5674 },
  { name: "France", flag: "🇫🇷", region: "Europe", bg: "url('images/france.png')", desc: "Discover Parisian elegance, lavender fields of Provence, and the storied French Riviera.", lat: 46.2276, lon: 2.2137 },
  { name: "Thailand", flag: "🇹🇭", region: "Asia", bg: "url('images/thailand.png')", desc: "Enjoy tropical beaches, vibrant night markets, golden temples, and unforgettable street food.", lat: 15.8700, lon: 100.9925 },
  { name: "Dubai", flag: "🇦🇪", region: "Middle East", bg: "url('images/dubai.png')", desc: "Experience futuristic skylines, luxury beyond imagination, and desert adventures at golden dusk.", lat: 25.2048, lon: 55.2708 }
];

// ───── STATE ─────
let current = 0;
let autoplaying = false;
let progressTimer = null;
let progressVal = 0;
let isTransitioning = false;
const AUTOPLAY_INTERVAL = 5000;

// ───── PERSISTENT STATE (localStorage) ─────
function loadState() {
  try {
    return {
      wishlist: JSON.parse(localStorage.getItem('wl_wishlist') || '[]'),
      ratings: JSON.parse(localStorage.getItem('wl_ratings') || '{}'),
      reviews: JSON.parse(localStorage.getItem('wl_reviews') || '{}'),
      tripPlan: JSON.parse(localStorage.getItem('wl_tripplan') || '[]'),
    };
  } catch { return { wishlist: [], ratings: {}, reviews: {}, tripPlan: [] }; }
}
function saveState(key, val) {
  try { localStorage.setItem('wl_' + key, JSON.stringify(val)); } catch {}
}

let { wishlist, ratings, reviews, tripPlan } = loadState();

// ───── DOM REFS ─────
const bgEl        = document.getElementById('wl-bg');
const bgNext      = document.getElementById('wl-bg-next');
const titleEl     = document.getElementById('placeTitle');
const descEl      = document.getElementById('placeDescription');
const regionEl    = document.getElementById('placeRegion');
const bookBtn     = document.getElementById('bookingButton');
const dotsEl      = document.getElementById('destinationIndicators');
const selector    = document.getElementById('placeSelector');
const autoBtn     = document.getElementById('autoplayBtn');
const autoIcon    = document.getElementById('autoplayIcon');
const autoLabel   = document.getElementById('autoplayLabel');
const counterEl   = document.getElementById('wlCounter');
const progressBar = document.getElementById('progressBar');
const prevBtn     = document.getElementById('prevBtn');
const nextBtn     = document.getElementById('nextBtn');
const homeLink    = document.getElementById('homeLink');

// Feature DOM refs
const wishBtn       = document.getElementById('wishlistBtn');
const weatherPanel  = document.getElementById('weatherPanel');
const ratingPanel   = document.getElementById('ratingPanel');
const tripPanel     = document.getElementById('tripPanel');
const panelOverlay  = document.getElementById('panelOverlay');

// ───── BUILD DROPDOWN + DOTS ─────
function buildUI() {
  destinations.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = ` ${d.flag} ${d.region} · ${d.name}`;
    selector.appendChild(opt);

    const dot = document.createElement('button');
    dot.className = 'destination-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to ${d.name}`);
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); });
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stopAutoplay(); goTo(i); }
    });
    dotsEl.appendChild(dot);
  });
  bgEl.style.backgroundImage = destinations[0].bg;
}

function updateDots() {
  dotsEl.querySelectorAll('.destination-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
    dot.setAttribute('aria-selected', i === current);
    dot.setAttribute('aria-current', i === current ? 'true' : 'false');
  });
}

function crossfade(newIdx) {
  if (isTransitioning) return;
  isTransitioning = true;
  bgNext.style.backgroundImage = destinations[newIdx].bg;
  bgNext.style.transition = 'none';
  bgNext.style.opacity = '0';
  requestAnimationFrame(() => {
    bgNext.style.transition = 'opacity 0.7s ease';
    bgNext.style.opacity = '1';
    setTimeout(() => {
      bgEl.style.backgroundImage = destinations[newIdx].bg;
      bgNext.style.transition = 'none';
      bgNext.style.opacity = '0';
      isTransitioning = false;
    }, 720);
  });
}

function updateContent(idx) {
  const d = destinations[idx];
  titleEl.textContent = d.name;
  descEl.textContent = d.desc;
  regionEl.textContent = `${d.region} · Destination ${idx + 1} of ${destinations.length}`;
  bookBtn.textContent = `Book a Trip to ${d.name}`;
  bookBtn.classList.remove('booked');
  selector.value = idx;
  counterEl.textContent = `${idx + 1} / ${destinations.length}`;
  updateDots();
  updateWishBtn();
  updateStarDisplay();
  updateReviewPreview();
  updateWeatherBadge();
}

function goTo(idx) {
  if (idx === current) return;
  crossfade(idx);
  current = idx;
  updateContent(current);
  resetProgress();
}
function goNext() { goTo((current + 1) % destinations.length); }
function goPrev() { goTo((current - 1 + destinations.length) % destinations.length); }

// ───── PROGRESS BAR ─────
function resetProgress() {
  progressVal = 0;
  progressBar.style.width = '0%';
  clearInterval(progressTimer);
  progressTimer = null;
  if (autoplaying) startProgress();
}
function startProgress() {
  clearInterval(progressTimer);
  progressTimer = null;
  const step = 100 / (AUTOPLAY_INTERVAL / 100);
  progressTimer = setInterval(() => {
    progressVal = Math.min(progressVal + step, 100);
    progressBar.style.width = progressVal + '%';
    if (progressVal >= 100) {
      clearInterval(progressTimer);
      progressTimer = null;
      current = (current + 1) % destinations.length;
      crossfade(current);
      updateContent(current);
      resetProgress();
    }
  }, 100);
}

function startAutoplay() {
  autoplaying = true;
  autoBtn.classList.add('playing');
  autoIcon.textContent = '⏸';
  autoLabel.textContent = 'Pause';
  resetProgress();
}
function stopAutoplay() {
  autoplaying = false;
  autoBtn.classList.remove('playing');
  autoIcon.textContent = '▶';
  autoLabel.textContent = 'Autoplay';
  clearInterval(progressTimer);
  progressBar.style.width = '0%';
  progressVal = 0;
}

// ───── ❤️ WISHLIST ─────
function updateWishBtn() {
  const inList = wishlist.includes(current);
  wishBtn.classList.toggle('active', inList);
  wishBtn.setAttribute('aria-label', inList ? 'Remove from wishlist' : 'Add to wishlist');
  wishBtn.title = inList ? 'Remove from Wishlist' : 'Add to Wishlist';
}

wishBtn.addEventListener('click', () => {
  const idx = wishlist.indexOf(current);
  if (idx === -1) {
    wishlist.push(current);
    showToast(`❤️ ${destinations[current].name} added to Wishlist!`);
  } else {
    wishlist.splice(idx, 1);
    showToast(`💔 ${destinations[current].name} removed from Wishlist`);
  }
  saveState('wishlist', wishlist);
  updateWishBtn();
});

// ───── ⭐ RATINGS & REVIEWS ─────
function updateStarDisplay() {
  const r = ratings[current] || 0;
  document.querySelectorAll('.star-input').forEach((s, i) => {
    s.classList.toggle('filled', i < r);
  });
  const rev = reviews[current];
  const avgEl = document.getElementById('avgRating');
  if (avgEl) avgEl.textContent = r ? `${r}.0 / 5.0` : 'Not rated yet';
}

function updateReviewPreview() {
  const rev = reviews[current];
  const previewEl = document.getElementById('reviewPreview');
  if (previewEl) {
    previewEl.textContent = rev ? `"${rev}"` : '';
    previewEl.style.display = rev ? 'block' : 'none';
  }
}

// ───── 🌤 WEATHER ─────
const weatherCache = {};

async function fetchWeather(idx) {
  if (weatherCache[idx]) return weatherCache[idx];
  const d = destinations[idx];
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lon}&current_weather=true&hourly=relative_humidity_2m,apparent_temperature&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const cw = data.current_weather;
    const humidity = data.hourly?.relative_humidity_2m?.[0] ?? '--';
    const feelsLike = data.hourly?.apparent_temperature?.[0] ?? '--';
    const result = {
      temp: Math.round(cw.temperature),
      windspeed: Math.round(cw.windspeed),
      weathercode: cw.weathercode,
      humidity,
      feelsLike: Math.round(feelsLike),
      icon: getWeatherIcon(cw.weathercode),
      label: getWeatherLabel(cw.weathercode),
    };
    weatherCache[idx] = result;
    return result;
  } catch (e) {
    return null;
  }
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 49) return '🌫️';
  if (code <= 69) return '🌧️';
  if (code <= 79) return '❄️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}
function getWeatherLabel(code) {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 49) return 'Foggy';
  if (code <= 69) return 'Rainy';
  if (code <= 79) return 'Snowy';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

async function updateWeatherBadge() {
  const badge = document.getElementById('weatherBadge');
  if (!badge) return;
  badge.textContent = '🌡 Loading...';
  const w = await fetchWeather(current);
  if (w) badge.textContent = `${w.icon} ${w.temp}°C`;
  else badge.textContent = '🌐 N/A';
}

// ───── PANEL SYSTEM ─────
function openPanel(panelId) {
  document.querySelectorAll('.feature-panel').forEach(p => p.classList.remove('open'));
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('open');
    panelOverlay.classList.add('visible');
  }
}
function closeAllPanels() {
  document.querySelectorAll('.feature-panel').forEach(p => p.classList.remove('open'));
  panelOverlay.classList.remove('visible');
}
panelOverlay.addEventListener('click', closeAllPanels);
document.querySelectorAll('.panel-close').forEach(btn => btn.addEventListener('click', closeAllPanels));

// ───── WEATHER PANEL ─────
document.getElementById('openWeather').addEventListener('click', async () => {
  openPanel('weatherPanel');
  const d = destinations[current];
  const panel = document.getElementById('weatherPanel');
  panel.querySelector('.panel-title').textContent = `🌤 Weather in ${d.name}`;
  const body = panel.querySelector('.weather-body');
  body.innerHTML = `<div class="weather-loading">Fetching live weather…</div>`;
  const w = await fetchWeather(current);
  if (w) {
    body.innerHTML = `
      <div class="weather-icon-big">${w.icon}</div>
      <div class="weather-temp">${w.temp}°C</div>
      <div class="weather-label">${w.label}</div>
      <div class="weather-grid">
        <div class="weather-stat"><span>💨 Wind</span><strong>${w.windspeed} km/h</strong></div>
        <div class="weather-stat"><span>💧 Humidity</span><strong>${w.humidity}%</strong></div>
        <div class="weather-stat"><span>🌡 Feels Like</span><strong>${w.feelsLike}°C</strong></div>
        <div class="weather-stat"><span>📍 Location</span><strong>${d.name}</strong></div>
      </div>
      <div class="weather-note">Live data via Open-Meteo API</div>
    `;
  } else {
    body.innerHTML = `<div class="weather-loading">⚠️ Unable to fetch weather data.</div>`;
  }
});

// ───── RATING PANEL ─────
document.getElementById('openRatings').addEventListener('click', () => {
  const d = destinations[current];
  const panel = document.getElementById('ratingPanel');
  panel.querySelector('.panel-title').textContent = `⭐ Rate ${d.name}`;
  const existingRating = ratings[current] || 0;
  const existingReview = reviews[current] || '';
  panel.querySelector('.rating-stars-row').innerHTML = [1,2,3,4,5].map(n => `
    <button class="star-btn ${n <= existingRating ? 'lit' : ''}" data-val="${n}" aria-label="${n} star${n>1?'s':''}">★</button>
  `).join('');
  panel.querySelector('#reviewText').value = existingReview;
  panel.querySelector('#ratingSubmitBtn').textContent = existingRating ? 'Update Review' : 'Submit Review';
  openPanel('ratingPanel');

  // Star hover/click
  let hoverRating = existingRating;
  panel.querySelectorAll('.star-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const v = +btn.dataset.val;
      panel.querySelectorAll('.star-btn').forEach((b, i) => b.classList.toggle('lit', i < v));
    });
    btn.addEventListener('mouseleave', () => {
      panel.querySelectorAll('.star-btn').forEach((b, i) => b.classList.toggle('lit', i < hoverRating));
    });
    btn.addEventListener('click', () => {
      hoverRating = +btn.dataset.val;
      panel.querySelectorAll('.star-btn').forEach((b, i) => b.classList.toggle('lit', i < hoverRating));
    });
  });

  panel.querySelector('#ratingSubmitBtn').onclick = () => {
    if (!hoverRating) { showToast('Please select a star rating!'); return; }
    ratings[current] = hoverRating;
    const txt = panel.querySelector('#reviewText').value.trim();
    if (txt) reviews[current] = txt;
    else delete reviews[current];
    saveState('ratings', ratings);
    saveState('reviews', reviews);
    updateStarDisplay();
    updateReviewPreview();
    closeAllPanels();
    showToast(`⭐ ${hoverRating}/5 for ${d.name} saved!`);
  };
});

// ───── WISHLIST PANEL ─────
document.getElementById('openWishlist').addEventListener('click', () => {
  const panel = document.getElementById('wishlistPanel');
  const list = panel.querySelector('.wishlist-items');
  list.innerHTML = wishlist.length === 0
    ? `<div class="empty-state">No favorites yet. Hit ❤️ on a destination!</div>`
    : wishlist.map(i => {
        const d = destinations[i];
        const r = ratings[i];
        return `<div class="wishlist-item" data-idx="${i}">
          <div class="wi-flag">${d.flag}</div>
          <div class="wi-info">
            <div class="wi-name">${d.name}</div>
            <div class="wi-region">${d.region}${r ? ` · ${'★'.repeat(r)}` : ''}</div>
          </div>
          <div class="wi-actions">
            <button class="wi-go" data-idx="${i}">Go →</button>
            <button class="wi-remove" data-idx="${i}">✕</button>
          </div>
        </div>`;
      }).join('');
  openPanel('wishlistPanel');

  list.querySelectorAll('.wi-go').forEach(btn => btn.addEventListener('click', () => {
    const idx = +btn.dataset.idx;
    closeAllPanels();
    stopAutoplay();
    goTo(idx);
  }));
  list.querySelectorAll('.wi-remove').forEach(btn => btn.addEventListener('click', () => {
    const idx = wishlist.indexOf(+btn.dataset.idx);
    if (idx !== -1) wishlist.splice(idx, 1);
    saveState('wishlist', wishlist);
    updateWishBtn();
    btn.closest('.wishlist-item').remove();
    if (!list.querySelector('.wishlist-item')) {
      list.innerHTML = `<div class="empty-state">No favorites yet. Hit ❤️ on a destination!</div>`;
    }
  }));
});

// ───── TRIP PLANNER PANEL ─────
function renderTripPlan() {
  const panel = document.getElementById('tripPanel');
  const list = panel.querySelector('.trip-list');
  if (tripPlan.length === 0) {
    list.innerHTML = `<div class="empty-state">Add destinations to plan your trip!</div>`;
    panel.querySelector('.trip-summary').textContent = '';
    return;
  }
  list.innerHTML = tripPlan.map((item, i) => {
    const d = destinations[item.idx];
    return `<div class="trip-item" data-pos="${i}">
      <div class="trip-order">${i + 1}</div>
      <div class="trip-flag">${d.flag}</div>
      <div class="trip-info">
        <div class="trip-name">${d.name}</div>
        <div class="trip-dates">
          <input class="trip-date-input" type="date" placeholder="Arrival" value="${item.arrival || ''}" data-pos="${i}" data-field="arrival">
          <span>→</span>
          <input class="trip-date-input" type="date" placeholder="Departure" value="${item.departure || ''}" data-pos="${i}" data-field="departure">
        </div>
        <input class="trip-note-input" type="text" placeholder="Add a note..." value="${item.note || ''}" data-pos="${i}" data-field="note">
      </div>
      <button class="trip-remove" data-pos="${i}">✕</button>
    </div>`;
  }).join('');

  const totalDays = tripPlan.reduce((sum, item) => {
    if (item.arrival && item.departure) {
      const diff = (new Date(item.departure) - new Date(item.arrival)) / 86400000;
      return sum + Math.max(0, diff);
    }
    return sum;
  }, 0);
  panel.querySelector('.trip-summary').textContent = tripPlan.length
    ? `${tripPlan.length} destination${tripPlan.length > 1 ? 's' : ''}${totalDays ? ` · ${totalDays} day${totalDays !== 1 ? 's' : ''} total` : ''}`
    : '';

  list.querySelectorAll('.trip-remove').forEach(btn => btn.addEventListener('click', () => {
    tripPlan.splice(+btn.dataset.pos, 1);
    saveState('tripplan', tripPlan);
    renderTripPlan();
  }));
  list.querySelectorAll('.trip-date-input, .trip-note-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const pos = +inp.dataset.pos, field = inp.dataset.field;
      tripPlan[pos][field] = inp.value;
      saveState('tripplan', tripPlan);
      if (field === 'arrival' || field === 'departure') renderTripPlan();
    });
  });
}

document.getElementById('openTripPlanner').addEventListener('click', () => {
  const panel = document.getElementById('tripPanel');
  panel.querySelector('.panel-title').textContent = `📅 Trip Planner`;
  renderTripPlan();
  openPanel('tripPanel');
});

document.getElementById('addToTrip').addEventListener('click', () => {
  const d = destinations[current];
  const already = tripPlan.find(t => t.idx === current);
  if (already) { showToast(`${d.name} is already in your trip!`); return; }
  tripPlan.push({ idx: current, arrival: '', departure: '', note: '' });
  saveState('tripplan', tripPlan);
  showToast(`📅 ${d.name} added to Trip Planner!`);
});

document.getElementById('clearTrip')?.addEventListener('click', () => {
  if (confirm('Clear your entire trip plan?')) {
    tripPlan = [];
    saveState('tripplan', tripPlan);
    renderTripPlan();
  }
});

// ───── TOAST ─────
function showToast(msg) {
  let t = document.getElementById('wl-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'wl-toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 2800);
}

// ───── CORE EVENTS ─────
autoBtn.addEventListener('click', () => {
  if (autoplaying) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
});
nextBtn.addEventListener('click', () => { stopAutoplay(); goNext(); });
prevBtn.addEventListener('click', () => { stopAutoplay(); goPrev(); });
selector.addEventListener('change', () => { stopAutoplay(); goTo(parseInt(selector.value)); });
bookBtn.addEventListener('click', () => {
  const d = destinations[current];
  bookBtn.textContent = `✓ Trip to ${d.name} Booked!`;
  bookBtn.classList.add('booked');
});
if (homeLink) homeLink.addEventListener('click', e => { e.preventDefault(); stopAutoplay(); goTo(0); window.scrollTo({ top: 0, behavior: 'smooth' }); });
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stopAutoplay(); goNext(); }
  if (e.key === 'ArrowLeft')  { stopAutoplay(); goPrev(); }
  if (e.key === 'Escape') closeAllPanels();
});

// ───── INIT ─────
window.addEventListener('DOMContentLoaded', () => {
  buildUI();
  updateContent(0);

  // Card hover — pause progress without changing autoplaying state
  const card = document.querySelector('.wl-card');
  if (card) {
    card.addEventListener('mouseenter', () => {
      if (autoplaying) clearInterval(progressTimer);
    });
    card.addEventListener('mouseleave', () => {
      if (autoplaying) startProgress();
    });
  }
});