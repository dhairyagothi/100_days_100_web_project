document.addEventListener("DOMContentLoaded", () => {
  // ─────────────────────────────────────────────
  // 1. CITIES CONFIG
  // ─────────────────────────────────────────────
  const citiesConfig = {
    ny: {
      id: "ny",
      name: "New York",
      country: "USA",
      timeZone: "America/New_York",
      sublabel: "EST / EDT",
      banner: "new_york.png",
      lat: 40.7128,
      lon: -74.006,
    },
    london: {
      id: "london",
      name: "London",
      country: "UK",
      timeZone: "Europe/London",
      sublabel: "GMT / BST",
      banner: "london.png",
      lat: 51.5074,
      lon: -0.1278,
    },
    tokyo: {
      id: "tokyo",
      name: "Tokyo",
      country: "Japan",
      timeZone: "Asia/Tokyo",
      sublabel: "JST",
      banner: "tokyo.png",
      lat: 35.6762,
      lon: 139.6503,
    },
    sydney: {
      id: "sydney",
      name: "Sydney",
      country: "Australia",
      timeZone: "Australia/Sydney",
      sublabel: "AEST",
      lat: -33.8688,
      lon: 151.2093,
    },
    paris: {
      id: "paris",
      name: "Paris",
      country: "France",
      timeZone: "Europe/Paris",
      sublabel: "CET",
      lat: 48.8566,
      lon: 2.3522,
    },
    dubai: {
      id: "dubai",
      name: "Dubai",
      country: "UAE",
      timeZone: "Asia/Dubai",
      sublabel: "GST",
      lat: 25.2048,
      lon: 55.2708,
    },
    mumbai: {
      id: "mumbai",
      name: "Mumbai",
      country: "India",
      timeZone: "Asia/Kolkata",
      sublabel: "IST",
      banner: "taj_mahal.png",
      lat: 19.076,
      lon: 72.8777,
    },
    rio: {
      id: "rio",
      name: "Rio de Janeiro",
      country: "Brazil",
      timeZone: "America/Sao_Paulo",
      sublabel: "BRT",
      lat: -22.9068,
      lon: -43.1729,
    },
    cairo: {
      id: "cairo",
      name: "Cairo",
      country: "Egypt",
      timeZone: "Africa/Cairo",
      sublabel: "EET",
      lat: 30.0444,
      lon: 31.2357,
    },
    singapore: {
      id: "singapore",
      name: "Singapore",
      country: "Singapore",
      timeZone: "Asia/Singapore",
      sublabel: "SGT",
      lat: 1.3521,
      lon: 103.8198,
    },
    la: {
      id: "la",
      name: "Los Angeles",
      country: "USA",
      timeZone: "America/Los_Angeles",
      sublabel: "PST",
      lat: 34.0522,
      lon: -118.2437,
    },
  };

  const timezoneSectors = [
    {
      offset: -11,
      id: "Pacific/Niue",
      name: "Niue Time (NUT)",
      cities: "Alofi, Pago Pago",
    },
    {
      offset: -10,
      id: "Pacific/Honolulu",
      name: "Hawaii Standard Time (HST)",
      cities: "Honolulu, Papeete",
    },
    {
      offset: -9,
      id: "America/Anchorage",
      name: "Alaska Standard Time (AKST)",
      cities: "Anchorage, Juneau",
    },
    {
      offset: -8,
      id: "America/Los_Angeles",
      name: "Pacific Standard Time (PST)",
      cities: "Los Angeles, Vancouver",
    },
    {
      offset: -7,
      id: "America/Denver",
      name: "Mountain Standard Time (MST)",
      cities: "Denver, Phoenix",
    },
    {
      offset: -6,
      id: "America/Chicago",
      name: "Central Standard Time (CST)",
      cities: "Chicago, Mexico City",
    },
    {
      offset: -5,
      id: "America/New_York",
      name: "Eastern Standard Time (EST)",
      cities: "New York, Toronto",
    },
    {
      offset: -4,
      id: "America/Halifax",
      name: "Atlantic Standard Time (AST)",
      cities: "Halifax, Caracas",
    },
    {
      offset: -3,
      id: "America/Sao_Paulo",
      name: "Brasilia Time (BRT)",
      cities: "Rio, Buenos Aires",
    },
    {
      offset: -2,
      id: "America/Noronha",
      name: "Noronha Time (FNT)",
      cities: "Grytviken",
    },
    {
      offset: -1,
      id: "Atlantic/Cape_Verde",
      name: "Cape Verde Time (CVT)",
      cities: "Praia",
    },
    {
      offset: 0,
      id: "Europe/London",
      name: "Greenwich Mean Time (GMT)",
      cities: "London, Dublin",
    },
    {
      offset: 1,
      id: "Europe/Paris",
      name: "Central European Time (CET)",
      cities: "Paris, Berlin, Rome",
    },
    {
      offset: 2,
      id: "Africa/Cairo",
      name: "Eastern European Time (EET)",
      cities: "Cairo, Athens",
    },
    {
      offset: 3,
      id: "Europe/Moscow",
      name: "Moscow Standard Time (MSK)",
      cities: "Moscow, Baghdad",
    },
    {
      offset: 4,
      id: "Asia/Dubai",
      name: "Gulf Standard Time (GST)",
      cities: "Dubai, Muscat",
    },
    {
      offset: 5,
      id: "Asia/Karachi",
      name: "Pakistan Standard Time (PKT)",
      cities: "Karachi",
    },
    {
      offset: 5.5,
      id: "Asia/Kolkata",
      name: "Indian Standard Time (IST)",
      cities: "Mumbai, Delhi",
    },
    {
      offset: 6,
      id: "Asia/Dhaka",
      name: "Bangladesh Standard Time (BST)",
      cities: "Dhaka",
    },
    {
      offset: 7,
      id: "Asia/Bangkok",
      name: "Indochina Time (ICT)",
      cities: "Bangkok, Jakarta",
    },
    {
      offset: 8,
      id: "Asia/Singapore",
      name: "Singapore Standard Time (SGT)",
      cities: "Singapore, Shanghai",
    },
    {
      offset: 9,
      id: "Asia/Tokyo",
      name: "Japan Standard Time (JST)",
      cities: "Tokyo, Seoul",
    },
    {
      offset: 10,
      id: "Australia/Sydney",
      name: "Australian Eastern Time (AEST)",
      cities: "Sydney, Melbourne",
    },
    {
      offset: 11,
      id: "Pacific/Guadalcanal",
      name: "Solomon Islands Time (SBT)",
      cities: "Honiara",
    },
    {
      offset: 12,
      id: "Pacific/Auckland",
      name: "New Zealand Standard Time (NZST)",
      cities: "Auckland",
    },
  ];

  // ─────────────────────────────────────────────
  // 2. PINNED CLOCK STATE
  // ─────────────────────────────────────────────
  let activePinnedClocks = ["ny", "london", "tokyo"];
  const saved = localStorage.getItem("chronos_pinned_clocks");
  if (saved) {
    try {
      activePinnedClocks = JSON.parse(saved);
    } catch (e) {}
  }

  let dynamicClocks = [];
  const offsets = {};

  // ─────────────────────────────────────────────
  // 3. TICK GENERATOR
  // ─────────────────────────────────────────────
  function generateTicks(face) {
    if (!face) return;
    face.querySelectorAll(".tick").forEach((t) => t.remove());
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement("div");
      tick.className = "tick" + (i % 5 === 0 ? " major" : "");
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
    const grid = document.getElementById("worldClocksGrid");
    if (!grid) return;
    grid.innerHTML = "";
    dynamicClocks = [];

    activePinnedClocks.forEach((id) => {
      const city = citiesConfig[id];
      if (!city) return;

      grid.insertAdjacentHTML("beforeend", buildCard(city));

      const card = grid.querySelector(`.world-clock-card[data-id="${id}"]`);
      const face = card.querySelector(`.clock-face[data-face="${id}"]`);
      generateTicks(face);

      card.querySelector(".remove-btn").addEventListener("click", (e) => {
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
    localStorage.setItem(
      "chronos_pinned_clocks",
      JSON.stringify(activePinnedClocks),
    );
    renderGrid();
    setTimeout(() => {
      const card = document.querySelector(`.world-clock-card[data-id="${id}"]`);
      if (card) {
        card.classList.add("card-highlight-active");
        setTimeout(() => card.classList.remove("card-highlight-active"), 1800);
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 80);
    updateTooltipBtn(id);
  }

  // Global tracker to prevent overlapping dismiss timers
let toastTimeoutReference;

function showPremiumToast(message) {
  let toast = document.querySelector('.custom-toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.innerHTML = `<span>⚠️</span><span class="toast-message"></span>`;
    document.body.appendChild(toast);
  }
  
  toast.querySelector('.toast-message').textContent = message;
  
  clearTimeout(toastTimeoutReference);
  
  toast.classList.add('show');
  
  // smoothly slide down and hide after exactly 1.5 seconds
  toastTimeoutReference = setTimeout(() => {
    toast.classList.remove('show');
  }, 1500);
}


function unpinClock(id) {
  if (activePinnedClocks.length <= 1) {
    // replacing the native alert() with the custom premium toast
    showPremiumToast("Keep at least one world clock pinned!");
    return;
  }
  
  activePinnedClocks = activePinnedClocks.filter((c) => c !== id);
  localStorage.setItem(
    "chronos_pinned_clocks",
    JSON.stringify(activePinnedClocks),
  );

  const card = document.querySelector(`.world-clock-card[data-id="${id}"]`);
  if (card) {
    card.style.opacity = "0";
    card.style.transform = "scale(0.94) translateY(12px)";
    card.style.transition = "all 0.35s ease";
    setTimeout(renderGrid, 360);
  } else {
    renderGrid();
  }
  updateTooltipBtn(id);
}

  // ─────────────────────────────────────────────
  // 7. SEARCH
  // ─────────────────────────────────────────────
  const searchInput = document.getElementById("citySearchInput");
  const searchResults = document.getElementById("citySearchResults");

  function renderSearch(query = "") {
    if (!searchResults) return;
    const q = query.toLowerCase().trim();
    if (!q) {
      searchResults.classList.remove("active");
      searchResults.innerHTML = "";
      return;
    }

    const matches = Object.values(citiesConfig).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.timeZone.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );

    searchResults.innerHTML = "";

    matches.forEach((city) => {
      const pinned = activePinnedClocks.includes(city.id);
      const item = document.createElement("div");
      item.className = "search-item";
      item.innerHTML = `
        <div class="search-item-info">
          <h4>${city.name}</h4>
          <p>${city.timeZone}</p>
        </div>
        <button class="quick-pin-btn" data-id="${city.id}" ${pinned ? "disabled" : ""}>
          ${pinned ? "✓ Pinned" : "Pin"}
        </button>
      `;
      searchResults.appendChild(item);
    });

    searchResults.classList.toggle("active", matches.length > 0);

    searchResults
      .querySelectorAll(".quick-pin-btn:not([disabled])")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          pinClock(btn.dataset.id);
          renderSearch(searchInput.value);
        });
      });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => renderSearch(e.target.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") searchResults.classList.remove("active");
    });
    document.addEventListener("click", (e) => {
      if (
        !searchInput.contains(e.target) &&
        !searchResults.contains(e.target)
      ) {
        searchResults.classList.remove("active");
      }
    });
  }

  // ─────────────────────────────────────────────
  // 8. LOCAL TZ LABEL
  // ─────────────────────────────────────────────
  const localTzEl = document.getElementById("local-tz-label");
  if (localTzEl) {
    try {
      localTzEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      localTzEl.textContent = "Local Time";
    }
  }

  // Generate local clock ticks
  const localFace = document.querySelector("#local-face");
  generateTicks(localFace);

  // ─────────────────────────────────────────────
  // 9. OFFSET ENGINE
  // ─────────────────────────────────────────────
  function calcOffset(timeZone) {
    const now = new Date();
    try {
      const tzStr = now.toLocaleString("en-US", { timeZone, hour12: false });
      const localStr = now.toLocaleString("en-US", { hour12: false });
      return new Date(tzStr).getTime() - new Date(localStr).getTime();
    } catch {
      return 0;
    }
  }

  function refreshOffsets() {
    dynamicClocks.forEach((c) => {
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
    const arc = document.getElementById("timerArc");
    if (!arc || timerTotal <= 0) return;
    const CIRCUMFERENCE = 2 * Math.PI * 85; // r=85
    const progress = remaining / timerTotal;
    arc.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress);
  }

  // Inject SVG gradient for arc
  function injectArcGradient() {
    const svg = document.getElementById("timerArcSvg");
    if (!svg) return;
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
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
    const ms = now.getMilliseconds();
    const sec = now.getSeconds() + ms / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    // Local clock
    const setHand = (id, deg) => {
      const el = document.getElementById(id);
      if (el) el.style.transform = `rotate(${deg}deg)`;
    };

    setHand("local-hour", hr * 30);
    setHand("local-minute", min * 6);
    setHand("local-second", sec * 6);

    const dig = document.getElementById("local-digital");
    if (dig) {
      dig.textContent = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map((n) => String(n).padStart(2, "0"))
        .join(":");
    }

    const dateEl = document.getElementById("local-date");
    if (dateEl) {
      const d = now.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      if (dateEl.textContent !== d) dateEl.textContent = d;
    }

    // World clocks
    dynamicClocks.forEach(({ id, timeZone }) => {
      const offset = offsets[id] || 0;
      const t = new Date(now.getTime() + offset);
      const ms2 = t.getMilliseconds();
      const s = t.getSeconds() + ms2 / 1000;
      const m = t.getMinutes() + s / 60;
      const h = (t.getHours() % 12) + m / 60;

      setHand(`${id}-hour`, h * 30);
      setHand(`${id}-minute`, m * 6);
      setHand(`${id}-second`, s * 6);

      const dd = document.getElementById(`${id}-digital`);
      if (dd)
        dd.textContent = [t.getHours(), t.getMinutes(), t.getSeconds()]
          .map((n) => String(n).padStart(2, "0"))
          .join(":");

      const de = document.getElementById(`${id}-date`);
      if (de) {
        const dstr = t.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        if (de.textContent !== dstr) de.textContent = dstr;
      }
    });

    requestAnimationFrame(animateClocks);
  }

  requestAnimationFrame(animateClocks);

  // First render
  renderGrid();

  //MAP
  const mapWrapper = document.getElementById("timezone-map-wrapper");
  const mapContainer = document.querySelector(".map-container");
  const tooltip = document.getElementById("map-tooltip");
  const ttCity = document.getElementById("tooltip-city");
  const ttOffset = document.getElementById("tooltip-offset");
  const ttTz = document.getElementById("tooltip-timezone");
  const ttTime = document.getElementById("tooltip-time");
  const ttDate = document.getElementById("tooltip-date");

  let ttInterval = null;
  let hoveredCityId = null;
  let hideTooltipTimer = null;

  function cancelHide() {
    clearTimeout(hideTooltipTimer);
  }

  function scheduleHide() {
    hideTooltipTimer = setTimeout(() => {
      tooltip.style.display = "none";
      if (ttInterval) clearInterval(ttInterval);
      hoveredCityId = null;
    }, 200); 
  }

  // event bindings to keep the card alive when interacting with its buttons
  tooltip.addEventListener("mouseenter", cancelHide);
  tooltip.addEventListener("mouseleave", scheduleHide);

  function updateTooltipBtn(id) {
    if (!tooltip || tooltip.style.display === "none") return;
    const currentTz = ttTz ? ttTz.textContent : "";
    const city = citiesConfig[id];
    if (city && city.timeZone === currentTz) setupTtBtn(id);
  }

  function setupTtBtn(cityId) {
    // Dynamic lookup ensures the live button is always referenced in the current DOM
    let activeBtn = document.getElementById("tooltip-pin-btn");
    if (!activeBtn) return;

    activeBtn.style.display = "block";
    const isPinned = activePinnedClocks.includes(cityId);

    if (isPinned) {
      activeBtn.className = "tt-pin-btn tt-remove-btn";
      activeBtn.textContent = "Remove from Dashboard";
    } else {
      activeBtn.className = "tt-pin-btn";
      activeBtn.textContent = "Pin to Dashboard";
    }

    const freshBtn = activeBtn.cloneNode(true);
    activeBtn.parentNode.replaceChild(freshBtn, activeBtn);

    // rebind listener directly to the newly mounted fresh button node
    freshBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      cancelHide(); 

      if (activePinnedClocks.includes(cityId)) {
        unpinClock(cityId);
      } else {
        pinClock(cityId);
      }

      // retrigger visual layout updates
      setupTtBtn(cityId);
    });
  }

  function tickTooltip(timeZone) {
    if (ttInterval) clearInterval(ttInterval);
    const tick = () => {
      const now = new Date();
      try {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        const parts = fmt.formatToParts(now);
        const get = (t) => parts.find((p) => p.type === t)?.value ?? "00";
        ttTime.textContent = `${get("hour")}:${get("minute")}:${get("second")}`;
        ttDate.textContent = now.toLocaleDateString("en-US", {
          timeZone,
          weekday: "short",
          month: "short",
          day: "numeric",
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
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "longOffset",
      }).formatToParts(new Date());
      const p = parts.find((x) => x.type === "timeZoneName");
      return p ? p.value.replace("GMT", "UTC") : "UTC+0";
    } catch {
      return "UTC";
    }
  }

  function syncMapMarkers() {
    document.querySelectorAll(".city-marker").forEach((m) => {
      const id = m.getAttribute("data-id");
      m.classList.toggle("pinned-marker", activePinnedClocks.includes(id));
    });
  }

  function positionTooltipOverElement(element) {
    const containerRect = mapContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    //mathematically centers the tooltip right above the targeted asset dot
    let leftPosition = elementRect.left - containerRect.left + (elementRect.width / 2) - 125; 
    let topPosition = elementRect.top - containerRect.top - 155; 

    
    if (leftPosition < 10) leftPosition = 10;
    if (leftPosition + 250 > containerRect.width) leftPosition = containerRect.width - 260;
    if (topPosition < 10) topPosition = elementRect.bottom - containerRect.top + 15;

    tooltip.style.left = `${leftPosition}px`;
    tooltip.style.top = `${topPosition}px`;
  }

  function initMap() {
    const svg = document.getElementById("world-map");
    if (!svg) return;

    const W = 784.077, H = 458.627, minX = 30.767, minY = 241.591;
    const stripeW = W / 24;

    //build grid lines
    let gridG = svg.getElementById("map-grid-lines");
    if (!gridG) {
      gridG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      gridG.setAttribute("id", "map-grid-lines");
      svg.insertBefore(gridG, svg.firstChild);
    }
    gridG.innerHTML = "";

    const mkLine = (cls, x1, y1, x2, y2) => {
      const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
      l.setAttribute("class", `map-grid-line ${cls}`);
      [["x1", x1], ["y1", y1], ["x2", x2], ["y2", y2]].forEach(([a, v]) => l.setAttribute(a, v));
      gridG.appendChild(l);
    };
    mkLine("equator-line", minX, 530.8, minX + W, 530.8);
    mkLine("meridian-line", 422.8, minY, 422.8, minY + H);

    //build timezone sectors
    let bandsG = svg.getElementById("timezone-bands");
    if (!bandsG) {
      bandsG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      bandsG.setAttribute("id", "timezone-bands");
      svg.appendChild(bandsG);
    }
    bandsG.innerHTML = "";

    timezoneSectors.forEach((s, i) => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("class", "timezone-sector");
      const lon = s.offset * 15;
      const xC = (lon + 180) * (W / 360) + minX;
      rect.setAttribute("x", xC - stripeW / 2);
      rect.setAttribute("y", minY);
      rect.setAttribute("width", stripeW);
      rect.setAttribute("height", H);
      rect.setAttribute("data-index", i);
      rect.setAttribute("data-offset", s.offset);
      rect.setAttribute("data-tz", s.id);
      rect.setAttribute("data-name", s.name);
      bandsG.appendChild(rect);
    });

    //build city markers
    let markG = svg.getElementById("city-markers");
    if (!markG) {
      markG = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markG.setAttribute("id", "city-markers");
      svg.appendChild(markG);
    }
    markG.innerHTML = "";

    Object.values(citiesConfig).forEach((city) => {
      const x = (city.lon + 180) * (W / 360) + minX;
      const y = 530.8 - city.lat * 3.16;

      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "city-marker");
      g.setAttribute("data-id", city.id);

      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("class", "pulse-ring");
      ring.setAttribute("cx", x);
      ring.setAttribute("cy", y);
      ring.setAttribute("r", 6);
      g.appendChild(ring);

      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("class", "center-dot");
      dot.setAttribute("cx", x);
      dot.setAttribute("cy", y);
      dot.setAttribute("r", 4);
      g.appendChild(dot);

      const catcher = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      catcher.setAttribute("cx", x);
      catcher.setAttribute("cy", y);
      catcher.setAttribute("r", 14);
      catcher.setAttribute("fill", "transparent");
      g.appendChild(catcher);

      markG.appendChild(g);
    });

    const sectors = svg.querySelectorAll(".timezone-sector");
    const markers = svg.querySelectorAll(".city-marker");

    //sector events
    sectors.forEach((s) => {
      s.addEventListener("mouseenter", (e) => {
        if (hoveredCityId) return;
        cancelHide();

        sectors.forEach((x) => x.classList.remove("active-sector"));
        s.classList.add("active-sector");

        const tz = s.getAttribute("data-tz");
        const off = parseFloat(s.getAttribute("data-offset"));

        ttCity.textContent = s.getAttribute("data-name");
        ttOffset.textContent = (off >= 0 ? "+" : "") + off + " hrs";
        ttTz.textContent = tz;
        tickTooltip(tz);

        const match = Object.values(citiesConfig).find((c) => c.timeZone === tz);
        if (match) {
          setupTtBtn(match.id);
        } else {
          const btn = document.getElementById("tooltip-pin-btn");
          if (btn) btn.style.display = "none";
        }

        tooltip.style.display = "flex";
        // Contextually positions the card relative to the center mouse entryway point of the sector
        const containerRect = mapContainer.getBoundingClientRect();
        let lx = e.clientX - containerRect.left - 110;
        let ly = e.clientY - containerRect.top - 140;
        tooltip.style.left = `${Math.max(10, lx)}px`;
        tooltip.style.top = `${Math.max(10, ly)}px`;
      });

      s.addEventListener("mouseleave", () => {
        if (hoveredCityId) return;
        s.classList.remove("active-sector");
        scheduleHide();
      });
    });

    // city marker events
    markers.forEach((m) => {
      m.addEventListener("mouseenter", () => {
        cancelHide();

        const id = m.getAttribute("data-id");
        const city = citiesConfig[id];
        if (!city) return;

        hoveredCityId = id;

        sectors.forEach((s) => {
          s.classList.toggle("active-sector", s.getAttribute("data-tz") === city.timeZone);
        });

        ttCity.textContent = `${city.name}, ${city.country}`;
        ttOffset.textContent = calcOffsetLabel(city.timeZone);
        ttTz.textContent = city.timeZone;
        tickTooltip(city.timeZone);
        setupTtBtn(id);

        tooltip.style.display = "flex";
        // Locks the card statically over the dot structure
        positionTooltipOverElement(m);
      });

      m.addEventListener("mouseleave", () => {
        hoveredCityId = null;
        sectors.forEach((s) => s.classList.remove("active-sector"));
        scheduleHide(); 
      });
    });

    syncMapMarkers();
  }

  // asynchronous SVG loader framework
  fetch("world-map.svg")
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.text();
    })
    .then((text) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "image/svg+xml");
      const svg = doc.querySelector("svg");

      if (!svg) throw new Error();

      svg.removeAttribute("width");
      svg.removeAttribute("height");
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("id", "world-map");

      svg.querySelectorAll("path, polygon, polyline").forEach((el) => {
        el.classList.add("land-path");
        el.removeAttribute("fill");
        el.removeAttribute("stroke");
      });

      mapWrapper.innerHTML = "";
      mapWrapper.appendChild(svg);
      initMap();
    })
    .catch(() => {
      if (typeof renderFallbackMap === "function") renderFallbackMap();
    });

  // ─────────────────────────────────────────────
  // 13. COUNTDOWN TIMER
  // ─────────────────────────────────────────────
  let timerInterval = null;
  let timerRemaining = 0;
  let timerPaused = false;
  const CIRCUMFERENCE = 2 * Math.PI * 85;

  const hoursIn = document.getElementById("hours");
  const minutesIn = document.getElementById("minutes");
  const secondsIn = document.getElementById("seconds");
  const countdownEl = document.getElementById("countdownDisplay");
  const timerUpMsg = document.getElementById("timerUpMsg");
  const timerSound = document.getElementById("timerSound");
  const pauseBtn = document.getElementById("pausebtn");

  function renderTimer() {
    if (!countdownEl) return;
    const h = Math.floor(timerRemaining / 3600);
    const m = Math.floor((timerRemaining % 3600) / 60);
    const s = timerRemaining % 60;
    countdownEl.textContent = [h, m, s]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");
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
    if (timerUpMsg) timerUpMsg.style.display = "flex";
    if (timerSound) {
      timerSound.currentTime = 0;
      timerSound.play().catch(() => {});
    }
  }

  window.startCountdown = function () {
    clearInterval(timerInterval);
    if (timerUpMsg) timerUpMsg.style.display = "none";
    stopSound();

    const h = Math.max(0, Math.min(23, parseInt(hoursIn?.value) || 0));
    const m = Math.max(0, Math.min(59, parseInt(minutesIn?.value) || 0));
    const s = Math.max(0, Math.min(59, parseInt(secondsIn?.value) || 0));
    timerRemaining = h * 3600 + m * 60 + s;

    if (timerRemaining <= 0) {
      showPremiumToast("Enter a timer duration.");
      return;
    }
    timerTotal = timerRemaining;

    // Reset arc
    const arc = document.getElementById("timerArc");
    if (arc) arc.style.strokeDashoffset = "0";

    timerPaused = false;
    if (pauseBtn) pauseBtn.textContent = "Pause";
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
    if (pauseBtn) pauseBtn.textContent = timerPaused ? "Resume" : "Pause";
  };

  window.restartCountdown = function () {
    clearInterval(timerInterval);
    timerInterval = null;
    timerRemaining = 0;
    timerTotal = 0;
    timerPaused = false;
    renderTimer();
    if (hoursIn) hoursIn.value = "";
    if (minutesIn) minutesIn.value = "";
    if (secondsIn) secondsIn.value = "";
    if (pauseBtn) pauseBtn.textContent = "Pause";
    if (timerUpMsg) timerUpMsg.style.display = "none";
    const arc = document.getElementById("timerArc");
    if (arc) arc.style.strokeDashoffset = String(CIRCUMFERENCE);
    stopSound();
  };

  renderTimer();

//FOCUS MODE

  // Grab the two buttons
  const focusBtn     = document.getElementById("focusModeBtn");   // header nav button
  const focusBackBtn = document.getElementById("focusBackBtn");    // back arrow (top-left)

  // SVG icons reused for the header button label swap
  const ICON_FOCUS = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
      <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
      <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
      <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
    </svg>
    <span>Focus</span>`;

  const ICON_EXIT = `
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>
    </svg>
    <span>Exit Focus</span>`;

  // simple flag so keyboard shortcuts know the current state
  let focusModeActive = false;

  function enterFocusMode() {
    focusModeActive = true;
    document.body.classList.add("focus-active-view");
    if (focusBtn) focusBtn.innerHTML = ICON_EXIT;
  }

  function exitFocusMode() {
    focusModeActive = false;
    document.body.classList.remove("focus-active-view");
    if (focusBtn) focusBtn.innerHTML = ICON_FOCUS;
  }

  // header "Focus" button toggles in and out
  if (focusBtn) {
    focusBtn.addEventListener("click", () => {
      if (focusModeActive) {
        exitFocusMode();
      } else {
        enterFocusMode();
      }
    });
  }

  // back arrow button — always exits
  if (focusBackBtn) {
    focusBackBtn.addEventListener("click", exitFocusMode);
  }

  // keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;

    // F — toggle focus mode
    if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      if (focusModeActive) {
        exitFocusMode();
      } else {
        enterFocusMode();
      }
    }

    // escape — exit focus mode if active
    if (e.key === "Escape" && focusModeActive) {
      e.preventDefault();
      exitFocusMode();
    }

    // T — toggle theme
    if (e.key.toLowerCase() === "t") {
      document.getElementById("themeToggleBtn")?.click();
    }
  });

  // If the page loaded with #focus in the URL hash, enter immediately
  if (window.location.hash === "#focus") {
    enterFocusMode();
  }

});  // ← end of DOMContentLoaded — keep this closing bracket
