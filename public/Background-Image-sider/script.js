// ───── CONFIGURATION & DATA ─────
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

const AUTOPLAY_INTERVAL = 5000;
const weatherCache = {};

// ───── STATE ENGINE ─────
let current = 0;
let autoplaying = false;
let progressTimer = null;
let progressVal = 0;
let isTransitioning = false;

const storageManager = {
  load() {
    try {
      return {
        wishlist: JSON.parse(localStorage.getItem('wl_wishlist') || '[]'),
        ratings: JSON.parse(localStorage.getItem('wl_ratings') || '{}'),
        reviews: JSON.parse(localStorage.getItem('wl_reviews') || '{}'),
        tripPlan: JSON.parse(localStorage.getItem('wl_tripplan') || '[]'),
      };
    } catch {
      return { wishlist: [], ratings: {}, reviews: {}, tripPlan: [] };
    }
  },
  save(key, val) {
    try {
      localStorage.setItem('wl_' + key, JSON.stringify(val));
    } catch {}
  }
};

let { wishlist, ratings, reviews, tripPlan } = storageManager.load();

// ───── DOM ELEMENT CACHE ─────
const nodes = {
  bgEl: document.getElementById('wl-bg'),
  bgNext: document.getElementById('wl-bg-next'),
  titleEl: document.getElementById('placeTitle'),
  descEl: document.getElementById('placeDescription'),
  regionEl: document.getElementById('placeRegion'),
  bookBtn: document.getElementById('bookingButton'),
  dotsEl: document.getElementById('destinationIndicators'),
  selector: document.getElementById('placeSelector'),
  autoBtn: document.getElementById('autoplayBtn'),
  autoIcon: document.getElementById('autoplayIcon'),
  autoLabel: document.getElementById('autoplayLabel'),
  counterEl: document.getElementById('wlCounter'),
  progressBar: document.getElementById('progressBar'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  homeLink: document.getElementById('homeLink'),
  wishBtn: document.getElementById('wishlistBtn'),
  weatherPanel: document.getElementById('weatherPanel'),
  ratingPanel: document.getElementById('ratingPanel'),
  tripPanel: document.getElementById('tripPanel'),
  panelOverlay: document.getElementById('panelOverlay')
};

// ───── CORE VIEW RENDERING ─────
function buildUI() {
  const fragmentDropdown = document.createDocumentFragment();
  const fragmentDots = document.createDocumentFragment();

  destinations.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = ` ${d.flag} ${d.region} · ${d.name}`;
    fragmentDropdown.appendChild(opt);

    const dot = document.createElement('button');
    dot.className = 'destination-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to ${d.name}`);
    dot.setAttribute('tabindex', '0');
    
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); });
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { 
        e.preventDefault(); 
        stopAutoplay(); 
        goTo(i); 
      }
    });
    fragmentDots.appendChild(dot);
  });

  nodes.selector.appendChild(fragmentDropdown);
  nodes.dotsEl.appendChild(fragmentDots);
  nodes.bgEl.style.backgroundImage = destinations[0].bg;
}

function updateDots() {
  const dots = nodes.dotsEl.querySelectorAll('.destination-dot');
  dots.forEach((dot, i) => {
    const isActive = i === current;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function crossfade(newIdx) {
  if (isTransitioning) return;
  isTransitioning = true;
  
  nodes.bgNext.style.backgroundImage = destinations[newIdx].bg;
  nodes.bgNext.style.transition = 'none';
  nodes.bgNext.style.opacity = '0';
  
  requestAnimationFrame(() => {
    nodes.bgNext.style.transition = 'opacity 0.7s ease';
    nodes.bgNext.style.opacity = '1';
    setTimeout(() => {
      nodes.bgEl.style.backgroundImage = destinations[newIdx].bg;
      nodes.bgNext.style.transition = 'none';
      nodes.bgNext.style.opacity = '0';
      isTransitioning = false;
    }, 720);
  });
}

function updateContent(idx) {
  const d = destinations[idx];
  nodes.titleEl.textContent = d.name;
  nodes.descEl.textContent = d.desc;
  nodes.regionEl.textContent = `${d.region} · Destination ${idx + 1} of ${destinations.length}`;
  nodes.bookBtn.textContent = `Book a Trip to ${d.name}`;
  nodes.bookBtn.classList.remove('booked');
  nodes.selector.value = idx;
  nodes.counterEl.textContent = `${idx + 1} / ${destinations.length}`;
  
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

// ───── ROTATION & AUTOPLAY ENGINE ─────
function resetProgress() {
  progressVal = 0;
  nodes.progressBar.style.width = '0%';
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
    nodes.progressBar.style.width = progressVal + '%';
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
  nodes.autoBtn.classList.add('playing');
  nodes.autoIcon.textContent = '⏸';
  nodes.autoLabel.textContent = 'Pause';
  resetProgress();
}

function stopAutoplay() {
  autoplaying = false;
  nodes.autoBtn.classList.remove('playing');
  nodes.autoIcon.textContent = '▶';
  nodes.autoLabel.textContent = 'Autoplay';
  clearInterval(progressTimer);
  nodes.progressBar.style.width = '0%';
  progressVal = 0;
}

// ───── WISHLIST ─────
function updateWishBtn() {
  const inList = wishlist.includes(current);
  nodes.wishBtn.classList.toggle('active', inList);
  nodes.wishBtn.setAttribute('aria-label', inList ? 'Remove from wishlist' : 'Add to wishlist');
  nodes.wishBtn.title = inList ? 'Remove from Wishlist' : 'Add to Wishlist';
}

nodes.wishBtn.addEventListener('click', () => {
  const idx = wishlist.indexOf(current);
  if (idx === -1) {
    wishlist.push(current);
    showToast(`❤️ ${destinations[current].name} added to Wishlist!`);
  } else {
    wishlist.splice(idx, 1);
    showToast(`💔 ${destinations[current].name} removed from Wishlist`);
  }
  storageManager.save('wishlist', wishlist);
  updateWishBtn();
});

// ───── INTERACTIVITY & REVIEWS ─────
function updateStarDisplay() {
  const r = ratings[current] || 0;
  document.querySelectorAll('.star-input').forEach((s, i) => {
    s.classList.toggle('filled', i < r);
  });
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

// ───── WEATHER UTILITIES & DATA FETCHING ─────
const weatherTransmutation = {
  getIcon(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 49) return '🌫️';
    if (code <= 69) return '🌧️';
    if (code <= 79) return '❄️';
    if (code <= 99) return '⛈️';
    return '🌡️';
  },
  getLabel(code) {
    if (code === 0) return 'Clear Sky';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 49) return 'Foggy';
    if (code <= 69) return 'Rainy';
    if (code <= 79) return 'Snowy';
    if (code <= 99) return 'Thunderstorm';
    return 'Unknown';
  }
};

async function fetchWeather(idx) {
  if (weatherCache[idx]) return weatherCache[idx];
  const d = destinations[idx];
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lon}&current=temperature_2m,wind_speed_10m,weather_code,relative_humidity_2m,apparent_temperature&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    const cw = data.current;
    
    const result = {
      temp: Math.round(cw.temperature_2m),
      windspeed: Math.round(cw.wind_speed_10m),
      weathercode: cw.weather_code,
      humidity: cw.relative_humidity_2m ?? '--',
      feelsLike: Math.round(cw.apparent_temperature ?? cw.temperature_2m),
      icon: weatherTransmutation.getIcon(cw.weather_code),
      label: weatherTransmutation.getLabel(cw.weather_code),
    };
    weatherCache[idx] = result;
    return result;
  } catch {
    return null;
  }
}

async function updateWeatherBadge() {
  const badge = document.getElementById('weatherBadge');
  if (!badge) return;
  badge.textContent = '🌡 Loading...';
  const w = await fetchWeather(current);
  badge.textContent = w ? `${w.icon} ${w.temp}°C` : '🌐 N/A';
}

// ───── OVERLAY & PANEL TRANSITIONS ─────
function openPanel(panelId) {
  document.querySelectorAll('.feature-panel').forEach(p => p.classList.remove('open'));
  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.add('open');
    nodes.panelOverlay.classList.add('visible');
  }
}

function closeAllPanels() {
  document.querySelectorAll('.feature-panel').forEach(p => p.classList.remove('open'));
  nodes.panelOverlay.classList.remove('visible');
}

nodes.panelOverlay.addEventListener('click', closeAllPanels);
document.querySelectorAll('.panel-close').forEach(btn => btn.addEventListener('click', closeAllPanels));

// ───── LIVE WEATHER DISPLAY ─────
document.getElementById('openWeather').addEventListener('click', async () => {
  openPanel('weatherPanel');
  const d = destinations[current];
  const panel = nodes.weatherPanel;
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

// ───── RATINGS ENGINE ─────
document.getElementById('openRatings').addEventListener('click', () => {
  const d = destinations[current];
  const panel = nodes.ratingPanel;
  panel.querySelector('.panel-title').textContent = `⭐ Rate ${d.name}`;
  
  const existingRating = ratings[current] || 0;
  const existingReview = reviews[current] || '';
  
  panel.querySelector('.rating-stars-row').innerHTML = [1,2,3,4,5].map(n => `
    <button class="star-btn ${n <= existingRating ? 'lit' : ''}" data-val="${n}" aria-label="${n} star${n>1?'s':''}">★</button>
  `).join('');
  
  panel.querySelector('#reviewText').value = existingReview;
  panel.querySelector('#ratingSubmitBtn').textContent = existingRating ? 'Update Review' : 'Submit Review';
  openPanel('ratingPanel');

  let hoverRating = existingRating;
  const stars = panel.querySelectorAll('.star-btn');
  
  stars.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const v = +btn.dataset.val;
      stars.forEach((b, i) => b.classList.toggle('lit', i < v));
    });
    btn.addEventListener('mouseleave', () => {
      stars.forEach((b, i) => b.classList.toggle('lit', i < hoverRating));
    });
    btn.addEventListener('click', () => {
      hoverRating = +btn.dataset.val;
      stars.forEach((b, i) => b.classList.toggle('lit', i < hoverRating));
    });
  });

  panel.querySelector('#ratingSubmitBtn').onclick = () => {
    if (!hoverRating) { showToast('Please select a star rating!'); return; }
    ratings[current] = hoverRating;
    const txt = panel.querySelector('#reviewText').value.trim();
    
    if (txt) reviews[current] = txt;
    else delete reviews[current];
    
    storageManager.save('ratings', ratings);
    storageManager.save('reviews', reviews);
    updateStarDisplay();
    updateReviewPreview();
    closeAllPanels();
    showToast(`⭐ ${hoverRating}/5 for ${d.name} saved!`);
  };
});

// ───── WISHLIST DASHBOARD ─────
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
    storageManager.save('wishlist', wishlist);
    updateWishBtn();
    btn.closest('.wishlist-item').remove();
    if (!list.querySelector('.wishlist-item')) {
      list.innerHTML = `<div class="empty-state">No favorites yet. Hit ❤️ on a destination!</div>`;
    }
  }));
});

// ───── TRIP ROUTE PLANNING ─────
function renderTripPlan() {
  const panel = nodes.tripPanel;
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
    storageManager.save('tripplan', tripPlan);
    renderTripPlan();
  }));
  
  list.querySelectorAll('.trip-date-input, .trip-note-input').forEach(inp => {
    inp.addEventListener('change', () => {
      const pos = +inp.dataset.pos;
      const field = inp.dataset.field;
      tripPlan[pos][field] = inp.value;
      storageManager.save('tripplan', tripPlan);
      if (field === 'arrival' || field === 'departure') renderTripPlan();
    });
  });
}

document.getElementById('openTripPlanner').addEventListener('click', () => {
  nodes.tripPanel.querySelector('.panel-title').textContent = `📅 Trip Planner`;
  renderTripPlan();
  openPanel('tripPanel');
});

document.getElementById('addToTrip').addEventListener('click', () => {
  const d = destinations[current];
  const already = tripPlan.find(t => t.idx === current);
  if (already) { showToast(`${d.name} is already in your trip!`); return; }
  tripPlan.push({ idx: current, arrival: '', departure: '', note: '' });
  storageManager.save('tripplan', tripPlan);
  showToast(`📅 ${d.name} added to Trip Planner!`);
});

document.getElementById('clearTrip')?.addEventListener('click', () => {
  if (confirm('Clear your entire trip plan?')) {
    tripPlan = [];
    storageManager.save('tripplan', tripPlan);
    renderTripPlan();
  }
});

// ───── NOTIFICATIONS SYSTEM ─────
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

// ───── ROOT INTERACTION BINDINGS ─────
nodes.autoBtn.addEventListener('click', () => {
  if (autoplaying) stopAutoplay();
  else startAutoplay();
});

nodes.nextBtn.addEventListener('click', () => { stopAutoplay(); goNext(); });
nodes.prevBtn.addEventListener('click', () => { stopAutoplay(); goPrev(); });
nodes.selector.addEventListener('change', () => { stopAutoplay(); goTo(parseInt(nodes.selector.value)); });

nodes.bookBtn.addEventListener('click', () => {
  const d = destinations[current];
  nodes.bookBtn.textContent = `✓ Trip to ${d.name} Booked!`;
  nodes.bookBtn.classList.add('booked');
});

if (nodes.homeLink) {
  nodes.homeLink.addEventListener('click', e => { 
    e.preventDefault(); 
    stopAutoplay(); 
    goTo(0); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stopAutoplay(); goNext(); }
  if (e.key === 'ArrowLeft')  { stopAutoplay(); goPrev(); }
  if (e.key === 'Escape') closeAllPanels();
});

// ───── SYSTEM START ─────
window.addEventListener('DOMContentLoaded', () => {
  buildUI();
  updateContent(0);

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