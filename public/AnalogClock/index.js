document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Core Config & Timezone Sector Database
    // ----------------------------------------------------
    const citiesConfig = {
        ny: { id: 'ny', name: 'New York', country: 'USA', timeZone: 'America/New_York', sublabel: 'EST / EDT', banner: 'new_york.png', lat: 40.7128, lon: -74.0060 },
        london: { id: 'london', name: 'London', country: 'UK', timeZone: 'Europe/London', sublabel: 'GMT / BST', banner: 'london.png', lat: 51.5074, lon: -0.1278 },
        tokyo: { id: 'tokyo', name: 'Tokyo', country: 'Japan', timeZone: 'Asia/Tokyo', sublabel: 'JST', banner: 'tokyo.png', lat: 35.6762, lon: 139.6503 },
        sydney: { id: 'sydney', name: 'Sydney', country: 'Australia', timeZone: 'Australia/Sydney', sublabel: 'AEST / AEDT', banner: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #f59e0b 100%)', lat: -33.8688, lon: 151.2093 },
        paris: { id: 'paris', name: 'Paris', country: 'France', timeZone: 'Europe/Paris', sublabel: 'CET / CEST', banner: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 60%, #f472b6 100%)', lat: 48.8566, lon: 2.3522 },
        dubai: { id: 'dubai', name: 'Dubai', country: 'UAE', timeZone: 'Asia/Dubai', sublabel: 'GST', banner: 'linear-gradient(135deg, #111827 0%, #374151 40%, #d97706 100%)', lat: 25.2048, lon: 55.2708 },
        mumbai: { id: 'mumbai', name: 'Mumbai', country: 'India', timeZone: 'Asia/Kolkata', sublabel: 'IST', banner: 'taj_mahal.png', lat: 19.0760, lon: 72.8777 },
        rio: { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', timeZone: 'America/Sao_Paulo', sublabel: 'BRT', banner: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #fbbf24 100%)', lat: -22.9068, lon: -43.1729 },
        cairo: { id: 'cairo', name: 'Cairo', country: 'Egypt', timeZone: 'Africa/Cairo', sublabel: 'EET', banner: 'linear-gradient(135deg, #451a03 0%, #9a3412 50%, #f59e0b 100%)', lat: 30.0444, lon: 31.2357 },
        singapore: { id: 'singapore', name: 'Singapore', country: 'Singapore', timeZone: 'Asia/Singapore', sublabel: 'SGT', banner: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #06b6d4 100%)', lat: 1.3521, lon: 103.8198 },
        la: { id: 'la', name: 'Los Angeles', country: 'USA', timeZone: 'America/Los_Angeles', sublabel: 'PST / PDT', banner: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #fb7185 100%)', lat: 34.0522, lon: -118.2437 }
    };

    const timezoneSectors = [
        { offset: -11, id: 'Pacific/Niue', name: 'Niue Time (NUT)', cities: 'Alofi, Pago Pago' },
        { offset: -10, id: 'Pacific/Honolulu', name: 'Hawaii Standard Time (HST)', cities: 'Honolulu, Papeete' },
        { offset: -9, id: 'America/Anchorage', name: 'Alaska Standard Time (AKST)', cities: 'Anchorage, Juneau' },
        { offset: -8, id: 'America/Los_Angeles', name: 'Pacific Standard Time (PST)', cities: 'Los Angeles, Vancouver' },
        { offset: -7, id: 'America/Denver', name: 'Mountain Standard Time (MST)', cities: 'Denver, Phoenix, Calgary' },
        { offset: -6, id: 'America/Chicago', name: 'Central Standard Time (CST)', cities: 'Chicago, Mexico City' },
        { offset: -5, id: 'America/New_York', name: 'Eastern Standard Time (EST)', cities: 'New York, Toronto, Miami' },
        { offset: -4, id: 'America/Halifax', name: 'Atlantic Standard Time (AST)', cities: 'Halifax, Caracas, Santiago' },
        { offset: -3, id: 'America/Sao_Paulo', name: 'Brasilia Time (BRT)', cities: 'Rio de Janeiro, Buenos Aires' },
        { offset: -2, id: 'America/Noronha', name: 'Noronha Time (FNT)', cities: 'Grytviken' },
        { offset: -1, id: 'Atlantic/Cape_Verde', name: 'Cape Verde Time (CVT)', cities: 'Praia, Ponta Delgada' },
        { offset: 0, id: 'Europe/London', name: 'Greenwich Mean Time (GMT)', cities: 'London, Dublin, Reykjavik' },
        { offset: 1, id: 'Europe/Paris', name: 'Central European Time (CET)', cities: 'Paris, Berlin, Rome, Madrid' },
        { offset: 2, id: 'Africa/Cairo', name: 'Eastern European Time (EET)', cities: 'Cairo, Johannesburg, Athens' },
        { offset: 3, id: 'Europe/Moscow', name: 'Moscow Standard Time (MSK)', cities: 'Moscow, Baghdad, Nairobi' },
        { offset: 4, id: 'Asia/Dubai', name: 'Gulf Standard Time (GST)', cities: 'Dubai, Baku, Tbilisi, Muscat' },
        { offset: 5, id: 'Asia/Karachi', name: 'Pakistan Standard Time (PKT)', cities: 'Karachi, Yekaterinburg' },
        { offset: 5.5, id: 'Asia/Kolkata', name: 'Indian Standard Time (IST)', cities: 'Mumbai, New Delhi, Bengaluru' },
        { offset: 6, id: 'Asia/Dhaka', name: 'Bangladesh Standard Time (BST)', cities: 'Dhaka, Almaty, Omsk' },
        { offset: 7, id: 'Asia/Bangkok', name: 'Indochina Time (ICT)', cities: 'Bangkok, Jakarta, Hanoi' },
        { offset: 8, id: 'Asia/Singapore', name: 'Singapore Standard Time (SGT)', cities: 'Singapore, Shanghai, Perth' },
        { offset: 9, id: 'Asia/Tokyo', name: 'Japan Standard Time (JST)', cities: 'Tokyo, Seoul, Yakutsk' },
        { offset: 10, id: 'Australia/Sydney', name: 'Australian Eastern Time (AEST)', cities: 'Sydney, Melbourne, Vladivostok' },
        { offset: 11, id: 'Pacific/Guadalcanal', name: 'Solomon Islands Time (SBT)', cities: 'Honiara, Noumea' },
        { offset: 12, id: 'Pacific/Auckland', name: 'New Zealand Standard Time (NZST)', cities: 'Auckland, Suva' }
    ];

    // ----------------------------------------------------
    // 2. LocalStorage & Registry Initialization
    // ----------------------------------------------------
    let activePinnedClocks = ['ny', 'london', 'tokyo'];
    const savedPinned = localStorage.getItem('chronos_pinned_clocks');
    if (savedPinned) {
        try {
            activePinnedClocks = JSON.parse(savedPinned);
        } catch (e) {
            console.error('Error parsing active pinned clocks:', e);
        }
    }

    let dynamicClocks = []; // Register ticking cards
    const offsets = {};

    function generateClockCardMarkup(city) {
        const bannerStyle = city.banner.endsWith('.png') 
            ? `background-image: url('${city.banner}');` 
            : `background: ${city.banner};`;
            
        return `
            <div class="neumorphic-plate world-clock-card" data-id="${city.id}">
                <button class="remove-clock-btn" data-id="${city.id}" aria-label="Remove ${city.name} clock">&times;</button>
                <div class="clock-banner" style="${bannerStyle}"></div>
                
                <div class="clock-header">
                    <h3 class="clock-label">${city.name}</h3>
                    <p class="clock-sublabel">${city.sublabel}</p>
                </div>
                
                <div class="clock-frame">
                    <div class="clock-face" data-face-id="${city.id}">
                        <div class="clock-glass"></div>
                        
                        <div class="hand hour" id="${city.id}-hour"></div>
                        <div class="hand minute" id="${city.id}-minute"></div>
                        <div class="hand second" id="${city.id}-second"></div>
                        
                        <div class="center-pin"></div>
                    </div>
                </div>
                
                <div class="digital-readout" id="${city.id}-digital">00:00:00</div>
                <div class="clock-date" id="${city.id}-date">Thu, May 21</div>
            </div>
        `;
    }

    function generateTicksForFace(face) {
        if (!face) return;
        const existingTicks = face.querySelectorAll('.tick');
        existingTicks.forEach(tick => tick.remove());
        for (let i = 0; i < 12; i++) {
            const tick = document.createElement('div');
            tick.classList.add('tick');
            if (i % 3 === 0) {
                tick.classList.add('major');
            }
            tick.style.transform = `rotate(${i * 30}deg)`;
            face.appendChild(tick);
        }
    }

    function syncMapPinpoints() {
        const markers = document.querySelectorAll('.city-marker');
        markers.forEach(marker => {
            const id = marker.getAttribute('data-id');
            if (activePinnedClocks.includes(id)) {
                marker.classList.add('pinned-marker');
            } else {
                marker.classList.remove('pinned-marker');
            }
        });
    }

    function updateTooltipButtonState(id) {
        const tooltip = document.getElementById('map-tooltip');
        if (!tooltip || tooltip.style.display === 'none') return;
        
        const tooltipPinBtn = document.getElementById('tooltip-pin-btn');
        if (!tooltipPinBtn) return;
        
        const currentTz = document.getElementById('tooltip-timezone').textContent;
        const city = citiesConfig[id];
        if (city && city.timeZone === currentTz) {
            const isPinned = activePinnedClocks.includes(id);
            if (isPinned) {
                tooltipPinBtn.className = "btn tooltip-btn tooltip-remove-btn";
                tooltipPinBtn.textContent = "Remove from Dashboard";
                tooltipPinBtn.onclick = () => unpinClock(id);
            } else {
                tooltipPinBtn.className = "btn btn-primary tooltip-btn";
                tooltipPinBtn.textContent = "Pin to Dashboard";
                tooltipPinBtn.onclick = () => pinClock(id);
            }
        }
    }

    function renderClockGrid() {
        const grid = document.getElementById('worldClocksGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        dynamicClocks = [];
        
        activePinnedClocks.forEach(id => {
            const city = citiesConfig[id];
            if (!city) return;
            
            grid.insertAdjacentHTML('beforeend', generateClockCardMarkup(city));
            
            const card = grid.querySelector(`.world-clock-card[data-id="${id}"]`);
            const face = card.querySelector(`.clock-face[data-face-id="${id}"]`);
            
            generateTicksForFace(face);
            
            const closeBtn = card.querySelector('.remove-clock-btn');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                unpinClock(id);
            });
            
            dynamicClocks.push({
                id: city.id,
                timeZone: city.timeZone
            });
        });
        
        refreshOffsets();
        syncMapPinpoints();
    }

    function pinClock(id) {
        if (!citiesConfig[id]) return;
        if (activePinnedClocks.includes(id)) return;
        
        activePinnedClocks.push(id);
        localStorage.setItem('chronos_pinned_clocks', JSON.stringify(activePinnedClocks));
        
        renderClockGrid();
        
        setTimeout(() => {
            const card = document.querySelector(`.world-clock-card[data-id="${id}"]`);
            if (card) {
                card.classList.add('card-highlight-active');
                setTimeout(() => {
                    card.classList.remove('card-highlight-active');
                }, 2000);
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
        
        updateTooltipButtonState(id);
    }

    function unpinClock(id) {
        if (activePinnedClocks.length <= 1) {
            alert("Keep at least one world clock pinned to your dashboard!");
            return;
        }
        
        activePinnedClocks = activePinnedClocks.filter(cid => cid !== id);
        localStorage.setItem('chronos_pinned_clocks', JSON.stringify(activePinnedClocks));
        
        const card = document.querySelector(`.world-clock-card[data-id="${id}"]`);
        if (card) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => {
                renderClockGrid();
            }, 400);
        } else {
            renderClockGrid();
        }
        
        updateTooltipButtonState(id);
    }

    // Call first rendering
    renderClockGrid();

    // Generate local clock ticks
    const localFace = document.querySelector('.main-clock-section .clock-face');
    generateTicksForFace(localFace);

    // ----------------------------------------------------
    // 3. Dynamic Timezone Offsets Engine
    // Calculates offset (ms) relative to local browser time
    // ----------------------------------------------------
    function calculateTimezoneOffset(timeZone) {
        const now = new Date();
        try {
            const tzString = now.toLocaleString("en-US", { timeZone, hour12: false });
            const localString = now.toLocaleString("en-US", { hour12: false });
            
            const tzDate = new Date(tzString);
            const localDate = new Date(localString);
            
            return tzDate.getTime() - localDate.getTime();
        } catch (error) {
            console.error(`Error computing offset for ${timeZone}:`, error);
            return 0;
        }
    }

    function refreshOffsets() {
        dynamicClocks.forEach(clock => {
            if (clock.timeZone) {
                offsets[clock.id] = calculateTimezoneOffset(clock.timeZone);
            }
        });
    }

    // Initial offsets computing
    refreshOffsets();
    setInterval(refreshOffsets, 60000);

    // ----------------------------------------------------
    // 4. High-Performance 60 FPS Sweep Animation Loop
    // Calculates exact angle rotation down to the millisecond
    // ----------------------------------------------------
    function animateClocks() {
        const now = new Date();
        const localMs = now.getMilliseconds();
        const localSec = now.getSeconds() + localMs / 1000;
        const localMin = now.getMinutes() + localSec / 60;
        const localHr = (now.getHours() % 12) + localMin / 60;

        // Local centerpiece clock ticking
        const localClockObj = {
            hourHand: document.getElementById('local-hour'),
            minuteHand: document.getElementById('local-minute'),
            secondHand: document.getElementById('local-second'),
            digital: document.getElementById('local-digital'),
            date: document.getElementById('local-date')
        };
        
        if (localClockObj.hourHand) localClockObj.hourHand.style.transform = `rotate(${localHr * 30}deg)`;
        if (localClockObj.minuteHand) localClockObj.minuteHand.style.transform = `rotate(${localMin * 6}deg)`;
        if (localClockObj.secondHand) localClockObj.secondHand.style.transform = `rotate(${localSec * 6}deg)`;
        
        if (localClockObj.digital) {
            const padH = String(now.getHours()).padStart(2, '0');
            const padM = String(now.getMinutes()).padStart(2, '0');
            const padS = String(now.getSeconds()).padStart(2, '0');
            localClockObj.digital.textContent = `${padH}:${padM}:${padS}`;
        }
        
        const localDateText = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        if (localClockObj.date && localClockObj.date.textContent !== localDateText) {
            localClockObj.date.textContent = localDateText;
        }

        // Dynamic world clocks ticking
        dynamicClocks.forEach(clock => {
            const offset = offsets[clock.id] || 0;
            const targetTime = new Date(now.getTime() + offset);
            const ms = targetTime.getMilliseconds();

            const sec = targetTime.getSeconds() + ms / 1000;
            const min = targetTime.getMinutes() + sec / 60;
            const hr = (targetTime.getHours() % 12) + min / 60;
            
            const displayHr = targetTime.getHours();
            const displayMin = targetTime.getMinutes();
            const displaySec = targetTime.getSeconds();
            const dateText = targetTime.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });

            const hRotation = hr * 30;
            const mRotation = min * 6;
            const sRotation = sec * 6;

            const hourHand = document.getElementById(`${clock.id}-hour`);
            const minuteHand = document.getElementById(`${clock.id}-minute`);
            const secondHand = document.getElementById(`${clock.id}-second`);
            const digital = document.getElementById(`${clock.id}-digital`);
            const date = document.getElementById(`${clock.id}-date`);

            if (hourHand) hourHand.style.transform = `rotate(${hRotation}deg)`;
            if (minuteHand) minuteHand.style.transform = `rotate(${mRotation}deg)`;
            if (secondHand) secondHand.style.transform = `rotate(${sRotation}deg)`;

            if (digital) {
                const padH = String(displayHr).padStart(2, '0');
                const padM = String(displayMin).padStart(2, '0');
                const padS = String(displaySec).padStart(2, '0');
                digital.textContent = `${padH}:${padM}:${padS}`;
            }

            if (date && date.textContent !== dateText) {
                date.textContent = dateText;
            }
        });

    if (clock.digital) {
      clock.digital.textContent =
        `${String(time.getHours()).padStart(2, "0")}:` +
        `${String(time.getMinutes()).padStart(2, "0")}:` +
        `${String(time.getSeconds()).padStart(2, "0")}`;
    }

    // Launch sweep loops
    requestAnimationFrame(animateClocks);
  }

    // ----------------------------------------------------
    // 5. Interactive Timezone Map Loader & Controller
    // ----------------------------------------------------
    const mapWrapper = document.getElementById('timezone-map-wrapper');
    const mapContainer = document.querySelector('.map-container');
    const tooltip = document.getElementById('map-tooltip');
    const tooltipCity = document.getElementById('tooltip-city');
    const tooltipOffset = document.getElementById('tooltip-offset');
    const tooltipTzId = document.getElementById('tooltip-timezone');
    const tooltipTime = document.getElementById('tooltip-time');
    const tooltipDate = document.getElementById('tooltip-date');
    const tooltipPinBtn = document.getElementById('tooltip-pin-btn');

    let tooltipInterval = null;
    let hoveredCityId = null;

    function renderFallbackSVGMap() {
        if (!mapWrapper) return;
        const fallbackSVG = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="784.077px" height="458.627px" viewBox="30.767 241.591 784.077 458.627" id="world-map">
            <rect x="30.767" y="241.591" width="784.077" height="458.627" fill="transparent" />
            <g id="continents-fallback">
                <!-- North America -->
                <path id="fallback-na" d="M120,300 C150,280 220,290 250,320 C270,340 260,370 250,390 C220,430 190,440 180,450 C170,460 160,490 140,490 C120,490 100,470 90,450 C80,430 90,390 100,360 Z" />
                <!-- South America -->
                <path id="fallback-sa" d="M210,480 C230,480 250,510 270,540 C290,570 280,630 250,670 C240,690 230,700 220,700 C210,700 200,680 200,650 C200,610 190,570 190,540 C190,510 200,480 210,480 Z" />
                <!-- Greenland -->
                <path id="fallback-gl" d="M280,260 C300,250 340,260 350,280 C360,300 340,330 310,340 C290,350 270,320 270,300 Z" />
                <!-- Eurasia & Africa -->
                <path id="fallback-ea-af" d="M380,320 C420,300 480,290 550,290 C620,290 710,320 740,360 C760,390 750,420 720,440 C690,460 670,440 650,460 C630,480 620,510 590,530 C560,550 540,580 520,600 C500,620 480,630 460,630 C440,630 430,600 430,570 C430,540 400,530 380,510 C360,490 350,450 360,420 C370,390 360,340 380,320 Z" />
                <!-- Australia -->
                <path id="fallback-au" d="M660,580 C690,570 730,570 750,590 C770,610 760,650 730,660 C700,670 670,660 650,640 C630,620 640,590 660,580 Z" />
            </g>
        </svg>`;
        mapWrapper.innerHTML = fallbackSVG;
        initMapInteractions();
    }

    function initMapInteractions() {
        const svg = document.getElementById('world-map');
        if (!svg) return;

        // Ensure proper layout variables
        const width = 784.077;
        const height = 458.627;
        const minX = 30.767;
        const minY = 241.591;
        const stripeWidth = width / 24;

        // 0. Inject Equator & Prime Meridian Grid Lines
        let gridGroup = svg.getElementById('map-grid-lines');
        if (!gridGroup) {
            gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            gridGroup.setAttribute('id', 'map-grid-lines');
            // Put it at the very beginning of the SVG so it stays as a background layer
            svg.insertBefore(gridGroup, svg.firstChild);
        } else {
            gridGroup.innerHTML = '';
        }

        // Draw Equator Line
        const equator = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        equator.setAttribute('class', 'map-grid-line equator-line');
        equator.setAttribute('x1', minX);
        equator.setAttribute('y1', 530.8);
        equator.setAttribute('x2', minX + width);
        equator.setAttribute('y2', 530.8);
        gridGroup.appendChild(equator);

        // Draw Prime Meridian Line
        const meridian = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        meridian.setAttribute('class', 'map-grid-line meridian-line');
        meridian.setAttribute('x1', 422.8);
        meridian.setAttribute('y1', minY);
        meridian.setAttribute('x2', 422.8);
        meridian.setAttribute('y2', minY + height);
        gridGroup.appendChild(meridian);

        // 1. Inject Timezone Bands Group
        let bandsGroup = svg.getElementById('timezone-bands');
        if (!bandsGroup) {
            bandsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            bandsGroup.setAttribute('id', 'timezone-bands');
            // Put bands on top of paths but below pinpoints
            svg.appendChild(bandsGroup);
        } else {
            bandsGroup.innerHTML = '';
        }

        // Draw 24 bands
        timezoneSectors.forEach((sector, index) => {
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('class', 'timezone-sector');
            rect.setAttribute('y', minY);
            rect.setAttribute('height', height);
            
            // Calculate band X centered around its longitude (offset * 15)
            const lon = sector.offset * 15;
            const xCenter = ((lon + 180) * (width / 360)) + minX;
            const xStart = xCenter - stripeWidth / 2;
            
            rect.setAttribute('x', xStart);
            rect.setAttribute('width', stripeWidth);
            
            rect.setAttribute('data-index', index);
            rect.setAttribute('data-offset', sector.offset);
            rect.setAttribute('data-tz', sector.id);
            rect.setAttribute('data-name', sector.name);
            rect.setAttribute('data-cities', sector.cities);
            
            bandsGroup.appendChild(rect);
        });

        // 2. Inject Pulsing City Markers Group
        let markersGroup = svg.getElementById('city-markers');
        if (!markersGroup) {
            markersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            markersGroup.setAttribute('id', 'city-markers');
            svg.appendChild(markersGroup);
        } else {
            markersGroup.innerHTML = '';
        }

        Object.values(citiesConfig).forEach(city => {
            const x = ((city.lon + 180) * (width / 360)) + minX;
            const y = 530.8 - (city.lat * 3.16);

            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            marker.setAttribute('class', 'city-marker');
            marker.setAttribute('data-id', city.id);

            // Pulsing ring
            const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            ring.setAttribute('class', 'pulse-ring');
            ring.setAttribute('cx', x);
            ring.setAttribute('cy', y);
            ring.setAttribute('r', 6);
            marker.appendChild(ring);

            // Core center dot
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('class', 'center-dot');
            dot.setAttribute('cx', x);
            dot.setAttribute('cy', y);
            dot.setAttribute('r', 4);
            marker.appendChild(dot);

            // Larger hover catcher
            const catcher = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            catcher.setAttribute('cx', x);
            catcher.setAttribute('cy', y);
            catcher.setAttribute('r', 12);
            catcher.setAttribute('fill', 'transparent');
            marker.appendChild(catcher);

            markersGroup.appendChild(marker);
        });

        // 3. Register Tooltip Dynamic Tick Loop
        function updateTooltipTickingTime(timeZone) {
            if (tooltipInterval) clearInterval(tooltipInterval);
            
            const tick = () => {
                const now = new Date();
                try {
                    const formatter = new Intl.DateTimeFormat('en-US', {
                        timeZone,
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    });
                    const parts = formatter.formatToParts(now);
                    const h = parts.find(p => p.type === 'hour').value;
                    const m = parts.find(p => p.type === 'minute').value;
                    const s = parts.find(p => p.type === 'second').value;
                    tooltipTime.textContent = `${h}:${m}:${s}`;

                    const dateStr = targetTimeDateString(now, timeZone);
                    tooltipDate.textContent = dateStr;
                } catch(e) {
                    tooltipTime.textContent = now.toLocaleTimeString();
                    tooltipDate.textContent = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                }
            };
            
            tick();
            tooltipInterval = setInterval(tick, 1000);
        }

        function targetTimeDateString(date, timeZone) {
            try {
                return date.toLocaleDateString("en-US", {
                    timeZone,
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                });
            } catch(e) {
                return date.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
            }
        }

        // 4. Helper to configure the tooltip Pin/Unpin CTA
        function setupTooltipButton(cityId) {
            tooltipPinBtn.style.display = 'block';
            tooltipPinBtn.disabled = false;
            const isPinned = activePinnedClocks.includes(cityId);
            if (isPinned) {
                tooltipPinBtn.className = "btn tooltip-btn tooltip-remove-btn";
                tooltipPinBtn.textContent = "Remove from Dashboard";
                tooltipPinBtn.onclick = () => unpinClock(cityId);
            } else {
                tooltipPinBtn.className = "btn btn-primary tooltip-btn";
                tooltipPinBtn.textContent = "Pin to Dashboard";
                tooltipPinBtn.onclick = () => pinClock(cityId);
            }
        }

        // 5. Attach Hover and Click Event Listeners
        const sectors = svg.querySelectorAll('.timezone-sector');
        const cityMarkers = svg.querySelectorAll('.city-marker');

        sectors.forEach(sector => {
            sector.addEventListener('mouseover', (e) => {
                if (hoveredCityId) return; // Prioritize city hover details
                
                sectors.forEach(s => s.classList.remove('active-sector'));
                sector.classList.add('active-sector');
                
                const name = sector.getAttribute('data-name');
                const offsetVal = parseFloat(sector.getAttribute('data-offset'));
                const tz = sector.getAttribute('data-tz');
                
                tooltipCity.textContent = name;
                tooltipOffset.textContent = (offsetVal >= 0 ? '+' : '') + offsetVal + ' Hrs';
                tooltipTzId.textContent = tz;
                updateTooltipTickingTime(tz);
                
                // Find matching configurations if any to pin
                const configMatch = Object.values(citiesConfig).find(c => c.timeZone === tz);
                if (configMatch) {
                    setupTooltipButton(configMatch.id);
                } else {
                    tooltipPinBtn.style.display = 'none';
                }
                
                tooltip.style.display = 'flex';
            });

            sector.addEventListener('mouseleave', () => {
                if (hoveredCityId) return;
                sector.classList.remove('active-sector');
                tooltip.style.display = 'none';
                if (tooltipInterval) clearInterval(tooltipInterval);
            });
        });

        cityMarkers.forEach(marker => {
            marker.addEventListener('mouseover', (e) => {
                const id = marker.getAttribute('data-id');
                const city = citiesConfig[id];
                if (!city) return;

                hoveredCityId = id;
                
                // Highlight its timezone band
                sectors.forEach(s => {
                    if (s.getAttribute('data-tz') === city.timeZone) {
                        s.classList.add('active-sector');
                    } else {
                        s.classList.remove('active-sector');
                    }
                });

                tooltipCity.textContent = `${city.name}, ${city.country}`;
                
                const offsetText = calculateOffsetLabel(city.timeZone);
                tooltipOffset.textContent = offsetText;
                tooltipTzId.textContent = city.timeZone;
                
                updateTooltipTickingTime(city.timeZone);
                setupTooltipButton(city.id);
                
                tooltip.style.display = 'flex';
            });

            marker.addEventListener('mouseleave', () => {
                hoveredCityId = null;
                sectors.forEach(s => s.classList.remove('active-sector'));
                tooltip.style.display = 'none';
                if (tooltipInterval) clearInterval(tooltipInterval);
            });

            // Double click shortcut to instantly pin/unpin city
            marker.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const id = marker.getAttribute('data-id');
                const isPinned = activePinnedClocks.includes(id);
                if (isPinned) {
                    unpinClock(id);
                } else {
                    pinClock(id);
                }
            });
        });

        // Sync glowing state of map pinpoints on SVG load completion
        syncMapPinpoints();

        function calculateOffsetLabel(timeZone) {
            try {
                const parts = new Intl.DateTimeFormat('en-US', {
                    timeZone,
                    timeZoneName: 'longOffset'
                }).formatToParts(new Date());
                const tzPart = parts.find(p => p.type === 'timeZoneName');
                return tzPart ? tzPart.value.replace('GMT', 'UTC') : 'UTC+0';
            } catch(e) {
                return 'UTC';
            }
        }

        // Float Tooltip alongside Mouse coordinates
        svg.addEventListener('mousemove', (e) => {
            if (tooltip.style.display === 'none') return;
            
            const rect = mapContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const tooltipWidth = 250;
            const tooltipHeight = 150;
            
            let posX = x + 15;
            let posY = y + 15;
            
            if (posX + tooltipWidth > rect.width) {
                posX = x - tooltipWidth - 15;
            }
            if (posY + tooltipHeight > rect.height) {
                posY = y - tooltipHeight - 15;
            }
            
            tooltip.style.left = `${Math.max(10, posX)}px`;
            tooltip.style.top = `${Math.max(10, posY)}px`;
        });
    }

    // Async Fetch standard world map SVG
    fetch('world-map.svg')
        .then(response => {
            if (!response.ok) throw new Error('CORS or file loading restricted');
            return response.text();
        })
        .then(svgText => {
            mapWrapper.innerHTML = svgText;
            initMapInteractions();
        })
        .catch(err => {
            console.warn('Could not load external SVG world map (likely CORS/file protocol restriction). Falling back to inline high-end minimalist map.', err);
            renderFallbackSVGMap();
        });

    // ----------------------------------------------------
    // 6. Theme Toggle & Timer Systems (Unmodified)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');

    function updateThemeUI(isDark) {
        if (isDark) {
            document.body.classList.add('dark-theme');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            document.body.classList.remove('dark-theme');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
  }

  function initTheme() {
    const saved = localStorage.getItem("chronos-theme");

    if (saved) {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      applyTheme(prefersDark ? "dark" : "light");
    }
  }

  initTheme();

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const dark = document.body.classList.contains("dark-theme");

      const next = dark ? "light" : "dark";

      localStorage.setItem("chronos-theme", next);

      applyTheme(next);
    });
  }

  /* =========================================
       COUNTDOWN TIMER
    ========================================= */

  let timerInterval = null;
  let timerRemaining = 0;
  let timerPaused = false;

  const hoursInput = document.getElementById("hours");
  const minutesInput = document.getElementById("minutes");
  const secondsInput = document.getElementById("seconds");

  const countdownDisplay = document.getElementById("countdownDisplay");

  const timerUpMsg = document.getElementById("timerUpMsg");

  const timerSound = document.getElementById("timerSound");

  const pauseBtn = document.getElementById("pausebtn");

  function renderTimer() {
    if (!countdownDisplay) return;
    const hrs = Math.floor(timerRemaining / 3600);
    const mins = Math.floor((timerRemaining % 3600) / 60);
    const secs = timerRemaining % 60;

    countdownDisplay.textContent =
      `${String(hrs).padStart(2, "0")}:` +
      `${String(mins).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}`;
  }

  function stopTimerSound() {
    if (!timerSound) return;

    timerSound.pause();
    timerSound.currentTime = 0;
  }

  function finishTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
timerRemaining = 0;
renderTimer();
    timerUpMsg.style.display = "flex";

    if (timerSound) {
      timerSound.currentTime = 0;

      timerSound.play().catch(() => {});
    }
  }

  window.startCountdown = function () {
    clearInterval(timerInterval);

    timerUpMsg.style.display = "none";

    stopTimerSound();

    const h = Math.max(
  0,
  Math.min(23, parseInt(hoursInput.value) || 0)
);

const m = Math.max(
  0,
  Math.min(59, parseInt(minutesInput.value) || 0)
);

const s = Math.max(
  0,
  Math.min(59, parseInt(secondsInput.value) || 0)
);

    timerRemaining = h * 3600 + m * 60 + s;

    if (timerRemaining <= 0) {
      alert("Please enter valid timer duration.");

      return;
    }

       timerPaused = false;

if (pauseBtn) {
  pauseBtn.innerText = "Pause";
}

renderTimer();
tickCountdown();
  }
function tickCountdown() {
  clearInterval(timerInterval);

  renderTimer();

  timerInterval = setInterval(() => {
    if (timerPaused) return;

    timerRemaining = Math.max(0, timerRemaining - 1);

    renderTimer();

    if (timerRemaining === 0) {
      finishTimer();
    }
  }, 1000);
}

  window.pauseCountdown = function () {
    if (timerRemaining <= 0) return;

    timerPaused = !timerPaused;

    pauseBtn.textContent =   timerPaused ? "Resume" : "Pause";
  };

  window.restartCountdown = function () {
    clearInterval(timerInterval);
timerInterval = null;

timerRemaining = 0;

    timerPaused = false;

    renderTimer();

    hoursInput.value = "";
    minutesInput.value = "";
    secondsInput.value = "";

    pauseBtn.textContent = "Pause";

    timerUpMsg.style.display = "none";

    stopTimerSound();
  };

  renderTimer();

  /* =========================================
       MULTIPLE ALARMS SYSTEM
    ========================================= */

  let alarms = JSON.parse(localStorage.getItem("chronos-alarms")) || [];

  const alarmList = document.getElementById("alarmList");

  function saveAlarms() {
    localStorage.setItem("chronos-alarms", JSON.stringify(alarms));
  }

  function renderAlarms() {
    if (!alarmList) return;

    alarmList.innerHTML = "";

    if (!alarms.length) {
      alarmList.innerHTML = `<div class="text-secondary text-center py-3">
                    No alarms added
                 </div>`;

      return;
    }

    alarms.forEach((alarm, index) => {
      const item = document.createElement("div");

      item.className =
        "list-group-item d-flex justify-content-between align-items-center";

      item.innerHTML = `
                <div>
                    <strong>${alarm.time}</strong>
                    <div class="small text-secondary">
                        ${alarm.label || "Alarm"}
                    </div>
                </div>

                <div class="d-flex gap-2">

                    <button class="btn btn-sm btn-warning snooze-btn">
                        Snooze
                    </button>

                    <button class="btn btn-sm btn-danger delete-btn">
                        Delete
                    </button>

                </div>
            `;

      item.querySelector(".delete-btn").addEventListener("click", () => {
        alarms.splice(index, 1);

        saveAlarms();

        renderAlarms();
      });

      item.querySelector(".snooze-btn").addEventListener("click", () => {
        const current = new Date();

        current.setMinutes(current.getMinutes() + 5);

        alarm.time =
          `${String(current.getHours()).padStart(2, "0")}:` +
          `${String(current.getMinutes()).padStart(2, "0")}`;

        saveAlarms();

        renderAlarms();
      });

      alarmList.appendChild(item);
    });
  }

  renderAlarms();

  const addAlarmBtn = document.getElementById("addAlarmBtn");

  if (addAlarmBtn) {
    addAlarmBtn.addEventListener("click", () => {
      const alarmTime = document.getElementById("alarmTime").value;

      const alarmLabel = document.getElementById("alarmLabel").value;

      if (!alarmTime) {
        alert("Select alarm time.");

        return;
      }

      alarms.push({
        time: alarmTime,
        label: alarmLabel,
      });

      saveAlarms();

      renderAlarms();

      document.getElementById("alarmTime").value = "";
      document.getElementById("alarmLabel").value = "";
    });
  }

  setInterval(() => {
    const now = new Date();

    const current =
      `${String(now.getHours()).padStart(2, "0")}:` +
      `${String(now.getMinutes()).padStart(2, "0")}`;

    alarms.forEach((alarm) => {
      if (alarm.time === current && now.getSeconds() === 0) {
        alert(`⏰ Alarm: ${alarm.label || alarm.time}`);

        if (timerSound) {
          timerSound.currentTime = 0;

          timerSound.play().catch(() => {});
        }
      }
    });
  }, 1000);

  /* =========================================
       STOPWATCH SYSTEM
    ========================================= */

  let stopwatchInterval = null;
  let stopwatchTime = 0;
  let stopwatchRunning = false;

  const stopwatchDisplay = document.getElementById("stopwatchDisplay");

  const lapList = document.getElementById("lapList");

  function updateStopwatchDisplay() {
    const ms = stopwatchTime % 1000;

    const totalSec = Math.floor(stopwatchTime / 1000);

    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;

    stopwatchDisplay.textContent =
      `${String(hrs).padStart(2, "0")}:` +
      `${String(mins).padStart(2, "0")}:` +
      `${String(secs).padStart(2, "0")}.` +
      `${String(ms).padStart(3, "0")}`;
  }

  window.startStopwatch = function () {
    if (stopwatchRunning) return;

    stopwatchRunning = true;

    let last = performance.now();

    stopwatchInterval = setInterval(() => {
      const now = performance.now();

      stopwatchTime += now - last;

      last = now;

      updateStopwatchDisplay();
    }, 10);
  };

  window.pauseStopwatch = function () {
    stopwatchRunning = false;

    clearInterval(stopwatchInterval);
  };

  window.resetStopwatch = function () {
    stopwatchRunning = false;

    clearInterval(stopwatchInterval);

    stopwatchTime = 0;

    updateStopwatchDisplay();

    if (lapList) lapList.innerHTML = "";
  };

  window.addLap = function () {
    if (!lapList) return;

    const item = document.createElement("li");

    item.className = "list-group-item";

    item.textContent = stopwatchDisplay.textContent;

    lapList.prepend(item);
  };

  updateStopwatchDisplay();

  /* =========================================
       DRAGGABLE CLOCK CARDS
    ========================================= */

  const grid = document.getElementById("worldClocksGrid");

  if (grid && window.Sortable) {
    Sortable.create(grid, {
      animation: 200,
      ghostClass: "sortable-ghost",
    });
  }

  /* =========================================
       CUSTOM BACKGROUND UPLOAD
    ========================================= */

  const bgUpload = document.getElementById("bgUpload");

  if (bgUpload) {
    bgUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = function (event) {
        document.querySelectorAll(".clock-banner").forEach((banner) => {
          banner.style.backgroundImage = `url(${event.target.result})`;
        });
      };

      reader.readAsDataURL(file);
    });
  }

  /* =========================================
       FOCUS MODE
    ========================================= */

 const focusModeBtn = document.getElementById("focusModeBtn");

if (focusModeBtn) {
  focusModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");

    focusModeBtn.textContent =
      document.body.classList.contains("focus-mode")
        ? "Exit Focus Mode"
        : "Focus Mode";
  });
}
  /* =========================================
       KEYBOARD SHORTCUTS
    ========================================= */

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "t") {
      themeToggleBtn.click();
    }

    window.pauseCountdown = function() {
        if (countdownTime <= 0) return;

      if (stopwatchRunning) {
        pauseStopwatch();
      } else {
        startStopwatch();
      }
    }
  });

  /* =========================================
       CLOCK MODAL VIEW
    ========================================= */

  document.querySelectorAll(".world-clock-card").forEach((card) => {
    card.addEventListener("dblclick", () => {
      const modalClock = card.querySelector(".clock-frame").cloneNode(true);

      const modalBody = document.getElementById("clockModalBody");

      if (modalBody) {
        modalBody.innerHTML = "";

        modalClock.classList.add("large-clock");

        modalBody.appendChild(modalClock);
      }
    });
  });

  /* =========================================
       EXPORT DASHBOARD
    ========================================= */

  const exportBtn = document.getElementById("exportDashboardBtn");

  if (exportBtn && window.html2canvas) {
    exportBtn.addEventListener("click", () => {
      html2canvas(document.body).then((canvas) => {
        const link = document.createElement("a");

        link.download = "chronos-dashboard.png";

        link.href = canvas.toDataURL();

        link.click();
      });
    });
  }
});
