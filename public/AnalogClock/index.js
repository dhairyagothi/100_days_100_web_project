document.addEventListener('DOMContentLoaded', () => {
  // ─────────────────────────────────────────────
  // 1. CITIES CONFIG
  // ─────────────────────────────────────────────
  const citiesConfig = {
    ny: {
      id: 'ny', name: 'New York', country: 'USA',
      timeZone: 'America/New_York', sublabel: 'EST / EDT',
      banner: 'new_york.png', lat: 40.7128, lon: -74.006,
    },
    london: {
      id: 'london', name: 'London', country: 'UK',
      timeZone: 'Europe/London', sublabel: 'GMT / BST',
      banner: 'london.png', lat: 51.5074, lon: -0.1278,
    },
    tokyo: {
      id: 'tokyo', name: 'Tokyo', country: 'Japan',
      timeZone: 'Asia/Tokyo', sublabel: 'JST',
      banner: 'tokyo.png', lat: 35.6762, lon: 139.6503,
    },
    sydney: {
      id: 'sydney', name: 'Sydney', country: 'Australia',
      timeZone: 'Australia/Sydney', sublabel: 'AEST',
      lat: -33.8688, lon: 151.2093,
    },
    paris: {
      id: 'paris', name: 'Paris', country: 'France',
      timeZone: 'Europe/Paris', sublabel: 'CET',
      lat: 48.8566, lon: 2.3522,
    },
    dubai: {
      id: 'dubai', name: 'Dubai', country: 'UAE',
      timeZone: 'Asia/Dubai', sublabel: 'GST',
      lat: 25.2048, lon: 55.2708,
    },
    mumbai: {
      id: 'mumbai', name: 'Mumbai', country: 'India',
      timeZone: 'Asia/Kolkata', sublabel: 'IST',
      banner: 'taj_mahal.png', lat: 19.076, lon: 72.8777,
    },
    rio: {
      id: 'rio', name: 'Rio de Janeiro', country: 'Brazil',
      timeZone: 'America/Sao_Paulo', sublabel: 'BRT',
      lat: -22.9068, lon: -43.1729,
    },
    cairo: {
      id: 'cairo', name: 'Cairo', country: 'Egypt',
      timeZone: 'Africa/Cairo', sublabel: 'EET',
      lat: 30.0444, lon: 31.2357,
    },
    singapore: {
      id: 'singapore', name: 'Singapore', country: 'Singapore',
      timeZone: 'Asia/Singapore', sublabel: 'SGT',
      lat: 1.3521, lon: 103.8198,
    },
    la: {
      id: 'la', name: 'Los Angeles', country: 'USA',
      timeZone: 'America/Los_Angeles', sublabel: 'PST',
      lat: 34.0522, lon: -118.2437,
    },
  };

  const timezoneSectors = [
    { offset: -11, id: 'Pacific/Niue',         name: 'Niue Time (NUT)',                  cities: 'Alofi, Pago Pago' },
    { offset: -10, id: 'Pacific/Honolulu',      name: 'Hawaii Standard Time (HST)',       cities: 'Honolulu, Papeete' },
    { offset: -9,  id: 'America/Anchorage',     name: 'Alaska Standard Time (AKST)',      cities: 'Anchorage, Juneau' },
    { offset: -8,  id: 'America/Los_Angeles',   name: 'Pacific Standard Time (PST)',      cities: 'Los Angeles, Vancouver' },
    { offset: -7,  id: 'America/Denver',        name: 'Mountain Standard Time (MST)',     cities: 'Denver, Phoenix' },
    { offset: -6,  id: 'America/Chicago',       name: 'Central Standard Time (CST)',      cities: 'Chicago, Mexico City' },
    { offset: -5,  id: 'America/New_York',      name: 'Eastern Standard Time (EST)',      cities: 'New York, Toronto' },
    { offset: -4,  id: 'America/Halifax',       name: 'Atlantic Standard Time (AST)',     cities: 'Halifax, Caracas' },
    { offset: -3,  id: 'America/Sao_Paulo',     name: 'Brasilia Time (BRT)',              cities: 'Rio, Buenos Aires' },
    { offset: -2,  id: 'America/Noronha',       name: 'Noronha Time (FNT)',               cities: 'Grytviken' },
    { offset: -1,  id: 'Atlantic/Cape_Verde',   name: 'Cape Verde Time (CVT)',            cities: 'Praia' },
    { offset:  0,  id: 'Europe/London',         name: 'Greenwich Mean Time (GMT)',        cities: 'London, Dublin' },
    { offset:  1,  id: 'Europe/Paris',          name: 'Central European Time (CET)',      cities: 'Paris, Berlin, Rome' },
    { offset:  2,  id: 'Africa/Cairo',          name: 'Eastern European Time (EET)',      cities: 'Cairo, Athens' },
    { offset:  3,  id: 'Europe/Moscow',         name: 'Moscow Standard Time (MSK)',       cities: 'Moscow, Baghdad' },
    { offset:  4,  id: 'Asia/Dubai',            name: 'Gulf Standard Time (GST)',         cities: 'Dubai, Muscat' },
    { offset:  5,  id: 'Asia/Karachi',          name: 'Pakistan Standard Time (PKT)',     cities: 'Karachi' },
    { offset:  5.5,id: 'Asia/Kolkata',          name: 'Indian Standard Time (IST)',       cities: 'Mumbai, Delhi' },
    { offset:  6,  id: 'Asia/Dhaka',            name: 'Bangladesh Standard Time (BST)',   cities: 'Dhaka' },
    { offset:  7,  id: 'Asia/Bangkok',          name: 'Indochina Time (ICT)',             cities: 'Bangkok, Jakarta' },
    { offset:  8,  id: 'Asia/Singapore',        name: 'Singapore Standard Time (SGT)',    cities: 'Singapore, Shanghai' },
    { offset:  9,  id: 'Asia/Tokyo',            name: 'Japan Standard Time (JST)',        cities: 'Tokyo, Seoul' },
    { offset: 10,  id: 'Australia/Sydney',      name: 'Australian Eastern Time (AEST)',   cities: 'Sydney, Melbourne' },
    { offset: 11,  id: 'Pacific/Guadalcanal',   name: 'Solomon Islands Time (SBT)',       cities: 'Honiara' },
    { offset: 12,  id: 'Pacific/Auckland',      name: 'New Zealand Standard Time (NZST)', cities: 'Auckland' },
  ];

  // ─────────────────────────────────────────────
  // 2. PINNED CLOCK STATE
  // ─────────────────────────────────────────────
  let activePinnedClocks = ['ny', 'london', 'tokyo'];
  const saved = localStorage.getItem('chronos_pinned_clocks');
  if (saved) {
    try { activePinnedClocks = JSON.parse(saved); } catch (e) {}
  }

  let dynamicClocks = [];
  const offsets = {};

  // ─────────────────────────────────────────────
  // 3. TICK GENERATOR
  // ─────────────────────────────────────────────
  function generateTicks(face) {
    if (!face) return;
    face.querySelectorAll('.tick').forEach(t => t.remove());
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('div');
      tick.className = 'tick' + (i % 5 === 0 ? ' major' : '');
      tick.style.transform = `rotate(${i * 6}deg)`;
      face.appendChild(tick);
    }
  }

  // ─────────────────────────────────────────────
  // 4. CARD MARKUP
  // ─────────────────────────────────────────────
  function buildCard(city) {
    return `
      <div class="world-clock-card" data-id="${city.id}">
        <button class="remove-btn" data-id="${city.id}" aria-label="Remove ${city.name}">×</button>
        <div class="card-city">${city.name}</div>
        <div class="card-sub">${city.sublabel}</div>
        <div class="clock-bezel">
          <div class="clock-face" data-face="${city.id}">
            <div class="clock-glass-sheen"></div>
            <div class="hand hour-hand" id="${city.id}-hour"></div>
            <div class="hand minute-hand" id="${city.id}-minute"></div>
            <div class="hand second-hand" id="${city.id}-second"></div>
            <div class="center-jewel"></div>
          </div>
        </div>
        <div class="digital-time" id="${city.id}-digital">00:00:00</div>
        <div class="digital-date" id="${city.id}-date">—</div>
      </div>
    `;
  }

  // ─────────────────────────────────────────────
  // 5. RENDER GRID
  // ─────────────────────────────────────────────
  function renderGrid() {
    const grid = document.getElementById('worldClocksGrid');
    if (!grid) return;
    grid.innerHTML = '';
    dynamicClocks = [];

    activePinnedClocks.forEach(id => {
      const city = citiesConfig[id];
      if (!city) return;

      grid.insertAdjacentHTML('beforeend', buildCard(city));

      const card = grid.querySelector(`.world-clock-card[data-id="${id}"]`);
      const face = card.querySelector(`.clock-face[data-face="${id}"]`);
      generateTicks(face);

      card.querySelector('.remove-btn').addEventListener('click', e => {
        e.stopPropagation();
        unpinClock(id);
      });

      dynamicClocks.push({ id: city.id, timeZone: city.timeZone });
    });

    refreshOffsets();
    syncMapMarkers();
  }

  // ─────────────────────────────────────────────
  // 6. PIN / UNPIN
  // ─────────────────────────────────────────────
  function pinClock(id) {
    if (!citiesConfig[id] || activePinnedClocks.includes(id)) return;
    activePinnedClocks.push(id);
    localStorage.setItem('chronos_pinned_clocks', JSON.stringify(activePinnedClocks));
    renderGrid();
    setTimeout(() => {
      const card = document.querySelector(`.world-clock-card[data-id="${id}"]`);
      if (card) {
        card.classList.add('card-highlight-active');
        setTimeout(() => card.classList.remove('card-highlight-active'), 1800);
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 80);
    updateTooltipBtn(id);
  }

  function unpinClock(id) {
    if (activePinnedClocks.length <= 1) {
      alert('Keep at least one world clock pinned!');
      return;
    }
    activePinnedClocks = activePinnedClocks.filter(c => c !== id);
    localStorage.setItem('chronos_pinned_clocks', JSON.stringify(activePinnedClocks));

    const card = document.querySelector(`.world-clock-card[data-id="${id}"]`);
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.94) translateY(12px)';
      card.style.transition = 'all 0.35s ease';
      setTimeout(renderGrid, 360);
    } else {
      renderGrid();
    }
    updateTooltipBtn(id);
  }

  // ─────────────────────────────────────────────
  // 7. SEARCH
  // ─────────────────────────────────────────────
  const searchInput = document.getElementById('citySearchInput');
  const searchResults = document.getElementById('citySearchResults');

  function renderSearch(query = '') {
    if (!searchResults) return;
    const q = query.toLowerCase().trim();
    if (!q) { searchResults.classList.remove('active'); searchResults.innerHTML = ''; return; }

    const matches = Object.values(citiesConfig).filter(
      c => c.name.toLowerCase().includes(q) ||
           c.timeZone.toLowerCase().includes(q) ||
           c.country.toLowerCase().includes(q)
    );

    searchResults.innerHTML = '';

    matches.forEach(city => {
      const pinned = activePinnedClocks.includes(city.id);
      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <div class="search-item-info">
          <h4>${city.name}</h4>
          <p>${city.timeZone}</p>
        </div>
        <button class="quick-pin-btn" data-id="${city.id}" ${pinned ? 'disabled' : ''}>
          ${pinned ? '✓ Pinned' : 'Pin'}
        </button>
      `;
      searchResults.appendChild(item);
    });

    searchResults.classList.toggle('active', matches.length > 0);

    searchResults.querySelectorAll('.quick-pin-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        pinClock(btn.dataset.id);
        renderSearch(searchInput.value);
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', e => renderSearch(e.target.value));
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') searchResults.classList.remove('active');
    });
    document.addEventListener('click', e => {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
  }

  // ─────────────────────────────────────────────
  // 8. LOCAL TZ LABEL
  // ─────────────────────────────────────────────
  const localTzEl = document.getElementById('local-tz-label');
  if (localTzEl) {
    try {
      localTzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      localTzEl.textContent = 'Local Time';
    }
  }

  // Generate local clock ticks
  const localFace = document.querySelector('#local-face');
  generateTicks(localFace);

  // ─────────────────────────────────────────────
  // 9. OFFSET ENGINE
  // ─────────────────────────────────────────────
  function calcOffset(timeZone) {
    const now = new Date();
    try {
      const tzStr    = now.toLocaleString('en-US', { timeZone, hour12: false });
      const localStr = now.toLocaleString('en-US', { hour12: false });
      return new Date(tzStr).getTime() - new Date(localStr).getTime();
    } catch { return 0; }
  }

  function refreshOffsets() {
    dynamicClocks.forEach(c => {
      if (c.timeZone) offsets[c.id] = calcOffset(c.timeZone);
    });
  }

  refreshOffsets();
  setInterval(refreshOffsets, 60000);

  // ─────────────────────────────────────────────
  // 10. ARC TIMER STATE
  // ─────────────────────────────────────────────
  let timerTotal = 0;

  function updateArc(remaining) {
    const arc = document.getElementById('timerArc');
    if (!arc || timerTotal <= 0) return;
    const CIRCUMFERENCE = 2 * Math.PI * 85; // r=85
    const progress = remaining / timerTotal;
    arc.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  }

  // Inject SVG gradient for arc
  function injectArcGradient() {
    const svg = document.getElementById('timerArcSvg');
    if (!svg) return;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c9a84c"/>
        <stop offset="50%" stop-color="#e2c876"/>
        <stop offset="100%" stop-color="#b8923a"/>
      </linearGradient>`;
    svg.insertBefore(defs, svg.firstChild);
  }

  injectArcGradient();

  // ─────────────────────────────────────────────
  // 11. ANIMATION LOOP — 60fps
  // ─────────────────────────────────────────────
  function animateClocks() {
    const now = new Date();
    const ms  = now.getMilliseconds();
    const sec = now.getSeconds()  + ms  / 1000;
    const min = now.getMinutes()  + sec / 60;
    const hr  = (now.getHours() % 12) + min / 60;

    // Local clock
    const setHand = (id, deg) => {
      const el = document.getElementById(id);
      if (el) el.style.transform = `rotate(${deg}deg)`;
    };

    setHand('local-hour',   hr * 30);
    setHand('local-minute', min * 6);
    setHand('local-second', sec * 6);

    const dig = document.getElementById('local-digital');
    if (dig) {
      dig.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':');
    }

    const dateEl = document.getElementById('local-date');
    if (dateEl) {
      const d = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      if (dateEl.textContent !== d) dateEl.textContent = d;
    }

    // World clocks
    dynamicClocks.forEach(({ id, timeZone }) => {
      const offset = offsets[id] || 0;
      const t  = new Date(now.getTime() + offset);
      const ms2 = t.getMilliseconds();
      const s  = t.getSeconds()  + ms2 / 1000;
      const m  = t.getMinutes()  + s / 60;
      const h  = (t.getHours() % 12) + m / 60;

      setHand(`${id}-hour`,   h * 30);
      setHand(`${id}-minute`, m * 6);
      setHand(`${id}-second`, s * 6);

      const dd = document.getElementById(`${id}-digital`);
      if (dd) dd.textContent = [t.getHours(), t.getMinutes(), t.getSeconds()]
        .map(n => String(n).padStart(2, '0')).join(':');

      const de = document.getElementById(`${id}-date`);
      if (de) {
        const dstr = t.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        if (de.textContent !== dstr) de.textContent = dstr;
      }
    });

    requestAnimationFrame(animateClocks);
  }

  requestAnimationFrame(animateClocks);

  // First render
  renderGrid();

  // ─────────────────────────────────────────────
  // 12. MAP
  // ─────────────────────────────────────────────
  const mapWrapper   = document.getElementById('timezone-map-wrapper');
  const mapContainer = document.querySelector('.map-container');
  const tooltip      = document.getElementById('map-tooltip');
  const ttCity       = document.getElementById('tooltip-city');
  const ttOffset     = document.getElementById('tooltip-offset');
  const ttTz         = document.getElementById('tooltip-timezone');
  const ttTime       = document.getElementById('tooltip-time');
  const ttDate       = document.getElementById('tooltip-date');
  const ttPinBtn     = document.getElementById('tooltip-pin-btn');

  let ttInterval = null;
  let hoveredCityId = null;

  function updateTooltipBtn(id) {
    if (!tooltip || tooltip.style.display === 'none') return;
    const currentTz = ttTz ? ttTz.textContent : '';
    const city = citiesConfig[id];
    if (city && city.timeZone === currentTz) setupTtBtn(id);
  }

  function setupTtBtn(cityId) {
    if (!ttPinBtn) return;
    ttPinBtn.style.display = 'block';
    const pinned = activePinnedClocks.includes(cityId);
    if (pinned) {
      ttPinBtn.className = 'tt-pin-btn tt-remove-btn';
      ttPinBtn.textContent = 'Remove from Dashboard';
      ttPinBtn.onclick = () => unpinClock(cityId);
    } else {
      ttPinBtn.className = 'tt-pin-btn';
      ttPinBtn.textContent = 'Pin to Dashboard';
      ttPinBtn.onclick = () => pinClock(cityId);
    }
  }

  function tickTooltip(timeZone) {
    if (ttInterval) clearInterval(ttInterval);
    const tick = () => {
      const now = new Date();
      try {
        const fmt = new Intl.DateTimeFormat('en-US', {
          timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
        const parts = fmt.formatToParts(now);
        const get = t => parts.find(p => p.type === t)?.value ?? '00';
        ttTime.textContent = `${get('hour')}:${get('minute')}:${get('second')}`;
        ttDate.textContent = now.toLocaleDateString('en-US', {
          timeZone, weekday: 'short', month: 'short', day: 'numeric'
        });
      } catch {
        ttTime.textContent = now.toLocaleTimeString();
        ttDate.textContent = now.toLocaleDateString();
      }
    };
    tick();
    ttInterval = setInterval(tick, 1000);
  }

  function calcOffsetLabel(tz) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'longOffset' })
        .formatToParts(new Date());
      const p = parts.find(x => x.type === 'timeZoneName');
      return p ? p.value.replace('GMT', 'UTC') : 'UTC+0';
    } catch { return 'UTC'; }
  }

  function syncMapMarkers() {
    document.querySelectorAll('.city-marker').forEach(m => {
      const id = m.getAttribute('data-id');
      m.classList.toggle('pinned-marker', activePinnedClocks.includes(id));
    });
  }

  function renderFallbackMap() {
    if (!mapWrapper) return;
    mapWrapper.innerHTML = `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="784" height="458" viewBox="30.767 241.591 784.077 458.627" id="world-map">
        <rect x="30.767" y="241.591" width="784.077" height="458.627" fill="transparent"/>
        <g id="continents-fallback">
          <path d="M120,300 C150,280 220,290 250,320 C270,340 260,370 250,390 C220,430 190,440 180,450 C170,460 160,490 140,490 C120,490 100,470 90,450 C80,430 90,390 100,360 Z"/>
          <path d="M210,480 C230,480 250,510 270,540 C290,570 280,630 250,670 C240,690 230,700 220,700 C210,700 200,680 200,650 C200,610 190,570 190,540 C190,510 200,480 210,480 Z"/>
          <path d="M280,260 C300,250 340,260 350,280 C360,300 340,330 310,340 C290,350 270,320 270,300 Z"/>
          <path d="M380,320 C420,300 480,290 550,290 C620,290 710,320 740,360 C760,390 750,420 720,440 C690,460 670,440 650,460 C630,480 620,510 590,530 C560,550 540,580 520,600 C500,620 480,630 460,630 C440,630 430,600 430,570 C430,540 400,530 380,510 C360,490 350,450 360,420 C370,390 360,340 380,320 Z"/>
          <path d="M660,580 C690,570 730,570 750,590 C770,610 760,650 730,660 C700,670 670,660 650,640 C630,620 640,590 660,580 Z"/>
        </g>
      </svg>`;
    initMap();
  }

  function initMap() {
    const svg = document.getElementById('world-map');
    if (!svg) return;

    const W = 784.077, H = 458.627, minX = 30.767, minY = 241.591;
    const stripeW = W / 24;

    // Grid lines
    let gridG = svg.getElementById('map-grid-lines');
    if (!gridG) {
      gridG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gridG.setAttribute('id', 'map-grid-lines');
      svg.insertBefore(gridG, svg.firstChild);
    }
    gridG.innerHTML = '';

    const mkLine = (cls, x1, y1, x2, y2) => {
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('class', `map-grid-line ${cls}`);
      [['x1',x1],['y1',y1],['x2',x2],['y2',y2]].forEach(([a,v]) => l.setAttribute(a, v));
      gridG.appendChild(l);
    };
    mkLine('equator-line',  minX, 530.8, minX + W, 530.8);
    mkLine('meridian-line', 422.8, minY, 422.8, minY + H);

    // Timezone bands
    let bandsG = svg.getElementById('timezone-bands');
    if (!bandsG) {
      bandsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      bandsG.setAttribute('id', 'timezone-bands');
      svg.appendChild(bandsG);
    }
    bandsG.innerHTML = '';

    timezoneSectors.forEach((s, i) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('class', 'timezone-sector');
      const lon = s.offset * 15;
      const xC  = (lon + 180) * (W / 360) + minX;
      rect.setAttribute('x',       xC - stripeW / 2);
      rect.setAttribute('y',       minY);
      rect.setAttribute('width',   stripeW);
      rect.setAttribute('height',  H);
      rect.setAttribute('data-index',  i);
      rect.setAttribute('data-offset', s.offset);
      rect.setAttribute('data-tz',     s.id);
      rect.setAttribute('data-name',   s.name);
      rect.setAttribute('data-cities', s.cities);
      bandsG.appendChild(rect);
    });

    // City markers
    let markG = svg.getElementById('city-markers');
    if (!markG) {
      markG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      markG.setAttribute('id', 'city-markers');
      svg.appendChild(markG);
    }
    markG.innerHTML = '';

    Object.values(citiesConfig).forEach(city => {
      const x = (city.lon + 180) * (W / 360) + minX;
      const y = 530.8 - city.lat * 3.16;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'city-marker');
      g.setAttribute('data-id', city.id);

      const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      ring.setAttribute('class', 'pulse-ring');
      ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.setAttribute('r', 6);
      g.appendChild(ring);

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('class', 'center-dot');
      dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 4);
      g.appendChild(dot);

      const catcher = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      catcher.setAttribute('cx', x); catcher.setAttribute('cy', y);
      catcher.setAttribute('r', 14); catcher.setAttribute('fill', 'transparent');
      g.appendChild(catcher);

      markG.appendChild(g);
    });

    // Events
    const sectors = svg.querySelectorAll('.timezone-sector');
    const markers = svg.querySelectorAll('.city-marker');

    sectors.forEach(s => {
      s.addEventListener('mouseover', () => {
        if (hoveredCityId) return;
        sectors.forEach(x => x.classList.remove('active-sector'));
        s.classList.add('active-sector');

        const tz = s.getAttribute('data-tz');
        const off = parseFloat(s.getAttribute('data-offset'));

        ttCity.textContent   = s.getAttribute('data-name');
        ttOffset.textContent = (off >= 0 ? '+' : '') + off + ' hrs';
        ttTz.textContent     = tz;
        tickTooltip(tz);

        const match = Object.values(citiesConfig).find(c => c.timeZone === tz);
        if (match) { setupTtBtn(match.id); ttPinBtn.style.display = 'block'; }
        else ttPinBtn.style.display = 'none';

        tooltip.style.display = 'flex';
      });

      s.addEventListener('mouseleave', () => {
        if (hoveredCityId) return;
        s.classList.remove('active-sector');
        tooltip.style.display = 'none';
        if (ttInterval) clearInterval(ttInterval);
      });
    });

    markers.forEach(m => {
      m.addEventListener('mouseover', () => {
        const id   = m.getAttribute('data-id');
        const city = citiesConfig[id];
        if (!city) return;
        hoveredCityId = id;

        sectors.forEach(s => {
          s.classList.toggle('active-sector', s.getAttribute('data-tz') === city.timeZone);
        });

        ttCity.textContent   = `${city.name}, ${city.country}`;
        ttOffset.textContent = calcOffsetLabel(city.timeZone);
        ttTz.textContent     = city.timeZone;
        tickTooltip(city.timeZone);
        setupTtBtn(id);
        tooltip.style.display = 'flex';
      });

      m.addEventListener('mouseleave', () => {
        hoveredCityId = null;
        sectors.forEach(s => s.classList.remove('active-sector'));
        tooltip.style.display = 'none';
        if (ttInterval) clearInterval(ttInterval);
      });

      m.addEventListener('dblclick', e => {
        e.stopPropagation();
        e.preventDefault();
        const id = m.getAttribute('data-id');
        activePinnedClocks.includes(id) ? unpinClock(id) : pinClock(id);
      });
    });

    syncMapMarkers();

    // Tooltip follow mouse
    svg.addEventListener('mousemove', e => {
      if (tooltip.style.display === 'none') return;
      const rect = mapContainer.getBoundingClientRect();
      let lx = e.clientX - rect.left + 18;
      let ly = e.clientY - rect.top  + 18;
      if (lx + 250 > rect.width)  lx = e.clientX - rect.left - 265;
      if (ly + 160 > rect.height) ly = e.clientY - rect.top  - 175;
      tooltip.style.left = `${Math.max(8, lx)}px`;
      tooltip.style.top  = `${Math.max(8, ly)}px`;
    });
  }

  fetch('world-map.svg')
    .then(r => { if (!r.ok) throw new Error(); return r.text(); })
    .then(text => { mapWrapper.innerHTML = text; initMap(); })
    .catch(() => renderFallbackMap());

  // ─────────────────────────────────────────────
  // 13. COUNTDOWN TIMER
  // ─────────────────────────────────────────────
  let timerInterval = null;
  let timerRemaining = 0;
  let timerPaused = false;
  const CIRCUMFERENCE = 2 * Math.PI * 85;

  const hoursIn   = document.getElementById('hours');
  const minutesIn = document.getElementById('minutes');
  const secondsIn = document.getElementById('seconds');
  const countdownEl = document.getElementById('countdownDisplay');
  const timerUpMsg  = document.getElementById('timerUpMsg');
  const timerSound  = document.getElementById('timerSound');
  const pauseBtn    = document.getElementById('pausebtn');

  function renderTimer() {
    if (!countdownEl) return;
    const h = Math.floor(timerRemaining / 3600);
    const m = Math.floor((timerRemaining % 3600) / 60);
    const s = timerRemaining % 60;
    countdownEl.textContent = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
    updateArc(timerRemaining);
  }

  function stopSound() {
    if (!timerSound) return;
    timerSound.pause();
    timerSound.currentTime = 0;
  }

  function finishTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRemaining = 0;
    renderTimer();
    if (timerUpMsg) timerUpMsg.style.display = 'flex';
    if (timerSound) { timerSound.currentTime = 0; timerSound.play().catch(() => {}); }
  }

  window.startCountdown = function () {
    clearInterval(timerInterval);
    if (timerUpMsg) timerUpMsg.style.display = 'none';
    stopSound();

    const h = Math.max(0, Math.min(23, parseInt(hoursIn?.value)   || 0));
    const m = Math.max(0, Math.min(59, parseInt(minutesIn?.value) || 0));
    const s = Math.max(0, Math.min(59, parseInt(secondsIn?.value) || 0));
    timerRemaining = h * 3600 + m * 60 + s;

    if (timerRemaining <= 0) { alert('Enter a timer duration.'); return; }
    timerTotal = timerRemaining;

    // Reset arc
    const arc = document.getElementById('timerArc');
    if (arc) arc.style.strokeDashoffset = '0';

    timerPaused = false;
    if (pauseBtn) pauseBtn.textContent = 'Pause';
    renderTimer();

    timerInterval = setInterval(() => {
      if (timerPaused) return;
      timerRemaining = Math.max(0, timerRemaining - 1);
      renderTimer();
      if (timerRemaining === 0) finishTimer();
    }, 1000);
  };

  window.pauseCountdown = function () {
    if (timerRemaining <= 0) return;
    timerPaused = !timerPaused;
    if (pauseBtn) pauseBtn.textContent = timerPaused ? 'Resume' : 'Pause';
  };

  window.restartCountdown = function () {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRemaining = 0;
    timerTotal = 0;
    timerPaused = false;
    renderTimer();
    if (hoursIn)   hoursIn.value = '';
    if (minutesIn) minutesIn.value = '';
    if (secondsIn) secondsIn.value = '';
    if (pauseBtn)  pauseBtn.textContent = 'Pause';
    if (timerUpMsg) timerUpMsg.style.display = 'none';
    const arc = document.getElementById('timerArc');
    if (arc) arc.style.strokeDashoffset = String(CIRCUMFERENCE);
    stopSound();
  };

  renderTimer();

  // ─────────────────────────────────────────────
  // 14. FOCUS MODE BUTTON
  // ─────────────────────────────────────────────
  const focusBtn = document.getElementById('focusModeBtn');
  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      document.body.classList.toggle('focus-mode');
      const inFocus = document.body.classList.contains('focus-mode');
      focusBtn.querySelector('span').textContent = inFocus ? 'Exit Focus' : 'Focus';
    });
  }

  // ─────────────────────────────────────────────
  // 15. KEYBOARD SHORTCUTS
  // ─────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.target.matches('input, textarea')) return;

    if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      focusBtn?.click();
    }
    if (e.key.toLowerCase() === 't') {
      document.getElementById('themeToggleBtn')?.click();
    }
  });
});
