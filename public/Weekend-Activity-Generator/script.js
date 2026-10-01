// State Management
let currentCoords = { lat: 45.5152, lng: -122.6784 }; // Default: Portland, OR
let map = null;
let tileLayer = null;
let markersGroup = null;
let userMarker = null;
let activeFilters = {
  category: 'all',
  vibe: 'all',
  weather: 'all',
  budget: 'all'
};
let matchingActivities = [];
let currentActivity = null;
let recentActivityIds = [];
let itinerary = [];

// Audio Context and Synth Sound Effects
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playClick() {
  if (!document.getElementById('soundToggle').checked) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(320, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
}

function playTick() {
  if (!document.getElementById('soundToggle').checked) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(650, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.04);
  
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playSuccess() {
  if (!document.getElementById('soundToggle').checked) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const now = audioCtx.currentTime;
  const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);
    
    gain.gain.setValueAtTime(0, now + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.22);
    
    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.25);
  });
}

function playShuffle() {
  if (!document.getElementById('soundToggle').checked) return;
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const now = audioCtx.currentTime;
  const duration = 1.2;
  const steps = 14;
  const stepTime = duration / steps;
  
  for (let i = 0; i < steps; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    const pitch = 220 + (i * 28);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(pitch, now + i * stepTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, now + i * stepTime + 0.04);
    
    gain.gain.setValueAtTime(0, now + i * stepTime);
    gain.gain.linearRampToValueAtTime(0.06, now + i * stepTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * stepTime + 0.04);
    
    osc.start(now + i * stepTime);
    osc.stop(now + i * stepTime + 0.05);
  }
}

// Map Configuration
function initMap() {
  // Determine tile style based on active theme
  const isDark = document.body.classList.contains('theme-midnight-breeze');
  const tileUrl = isDark 
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const tileAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  map = L.map('map', {
    zoomControl: false,
    attributionControl: false
  }).setView([currentCoords.lat, currentCoords.lng], 13);
  
  tileLayer = L.tileLayer(tileUrl, {
    attribution: tileAttribution,
    maxZoom: 19
  }).addTo(map);

  markersGroup = L.layerGroup().addTo(map);
  
  // Custom Zoom Control at top right
  L.control.zoom({
    position: 'topright'
  }).addTo(map);

  updateUserMarker();
  updateActivityMarkers();
}

function updateMapTiles() {
  if (!map) return;
  const isDark = document.body.classList.contains('theme-midnight-breeze');
  const tileUrl = isDark 
    ? 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  
  tileLayer.setUrl(tileUrl);
}

function updateUserMarker() {
  if (!map) return;
  
  if (userMarker) {
    map.removeLayer(userMarker);
  }

  const userIcon = L.divIcon({
    className: 'custom-div-icon',
    html: '<div class="user-marker-pin"></div>',
    iconSize: [26, 26],
    iconAnchor: [13, 13]
  });

  userMarker = L.marker([currentCoords.lat, currentCoords.lng], {
    icon: userIcon,
    zIndexOffset: 1000
  })
  .addTo(map)
  .bindPopup('<b>You are here</b><br>Exploring weekend spots nearby.');
}

function updateActivityMarkers() {
  if (!map || !markersGroup) return;
  markersGroup.clearLayers();

  matchingActivities.forEach(activity => {
    const actLat = currentCoords.lat + activity.latOffset;
    const actLng = currentCoords.lng + activity.lngOffset;

    const markerHtml = `
      <div class="marker-pin" style="background: ${activity.color};">
        <i class="fa-solid ${activity.icon}"></i>
      </div>
    `;

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: markerHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -30]
    });

    const marker = L.marker([actLat, actLng], {
      icon: customIcon
    });

    const popupContent = `
      <div class="map-popup-card">
        <h4>${activity.name}</h4>
        <p><i class="fa-solid fa-tag"></i> ${activity.vibe} • ${activity.cost}</p>
        <button class="btn btn-secondary" onclick="loadActivityFromMap(${activity.id})" style="padding: 4px 8px; font-size: 11px; margin-top: 5px; width: 100%; border-radius: 4px;">
          Select Spot
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
    marker.activityId = activity.id;
    markersGroup.addLayer(marker);
  });
}

function loadActivityFromMap(id) {
  playClick();
  const selected = activitiesData.find(a => a.id === id);
  if (selected) {
    displaySelectedActivity(selected);
    // Focus map on this marker
    const actLat = currentCoords.lat + selected.latOffset;
    const actLng = currentCoords.lng + selected.lngOffset;
    map.setView([actLat, actLng], 14, { animate: true });
  }
}

// Geolocation Handling
function handleLocateMe() {
  playClick();
  const mapLoading = document.getElementById('mapLoading');
  const locationStatus = document.getElementById('locationStatus');
  
  if (!navigator.geolocation) {
    locationStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Geolocation not supported by browser.';
    return;
  }

  mapLoading.style.display = 'flex';
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentCoords.lat = position.coords.latitude;
      currentCoords.lng = position.coords.longitude;
      
      mapLoading.style.display = 'none';
      locationStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Found location: ${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}`;
      
      // Update map view & markers
      map.setView([currentCoords.lat, currentCoords.lng], 13);
      updateUserMarker();
      updateActivityMarkers();
      playSuccess();
    },
    (error) => {
      mapLoading.style.display = 'none';
      let message = 'Location permission denied.';
      if (error.code === 2) message = 'Location unavailable.';
      if (error.code === 3) message = 'Location request timeout.';
      locationStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Fallback: Using default city (Portland)`;
      console.warn('Geolocation error:', error);
    },
    { timeout: 8000, maximumAge: 60000 }
  );
}

// Filtering System
function initFilters() {
  // Category buttons
  const categoryBtns = document.querySelectorAll('[data-filter="category"]');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClick();
      categoryBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeFilters.category = e.currentTarget.dataset.value;
      runFiltering();
    });
  });

  // Vibe buttons
  const vibeBtns = document.querySelectorAll('[data-filter="vibe"]');
  vibeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClick();
      vibeBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeFilters.vibe = e.currentTarget.dataset.value;
      runFiltering();
    });
  });

  // Weather radios
  const weatherRadios = document.querySelectorAll('input[name="weather"]');
  weatherRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      playClick();
      activeFilters.weather = e.target.value;
      runFiltering();
    });
  });

  // Budget buttons
  const budgetBtns = document.querySelectorAll('.budget-btn');
  budgetBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClick();
      budgetBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      activeFilters.budget = e.currentTarget.dataset.value;
      runFiltering();
    });
  });
}

function runFiltering() {
  matchingActivities = activitiesData.filter(activity => {
    // Category check
    if (activeFilters.category !== 'all' && activity.category !== activeFilters.category) {
      return false;
    }
    // Vibe check
    if (activeFilters.vibe !== 'all' && activity.vibe !== activeFilters.vibe) {
      return false;
    }
    // Budget check
    if (activeFilters.budget !== 'all' && activity.cost !== activeFilters.budget) {
      return false;
    }
    // Weather check
    if (activeFilters.weather === 'sunny') {
      // Must be outdoor/sunny compatible
      return activity.weather === 'sunny' || activity.locationType === 'outdoor';
    } else if (activeFilters.weather === 'any') {
      // Must be rainy friendly / indoor
      return activity.weather === 'any' || activity.locationType === 'indoor';
    }

    return true;
  });

  // Update match count element
  const matchCountEl = document.getElementById('matchCount');
  matchCountEl.textContent = `${matchingActivities.length} activities match current preferences`;
  
  updateActivityMarkers();
}

// Generate Action
function handleGenerateActivity() {
  if (matchingActivities.length === 0) {
    playClick();
    const card = document.getElementById('activityCard');
    card.classList.add('has-error');
    
    // Shake animation reset
    setTimeout(() => {
      card.classList.remove('has-error');
    }, 450);
    
    // Inform user in card description
    resetCardErrorState();
    return;
  }

  playShuffle();
  const card = document.getElementById('activityCard');
  card.classList.add('is-shuffling');

  // Slot-machine title/description rapid switcher during shuffle
  let shuffleCount = 0;
  const cardTitle = document.getElementById('cardTitle');
  const cardDescription = document.getElementById('cardDescription');
  
  const shuffleInterval = setInterval(() => {
    const randomAct = matchingActivities[Math.floor(Math.random() * matchingActivities.length)];
    cardTitle.textContent = randomAct.name;
    cardDescription.textContent = randomAct.description.substring(0, 100) + '...';
    shuffleCount++;
    if (shuffleCount % 3 === 0) {
      playTick();
    }
  }, 90);

  // Pick final activity
  setTimeout(() => {
    clearInterval(shuffleInterval);
    card.classList.remove('is-shuffling');

    // Avoid recent items if there are enough options
    let selected = null;
    if (matchingActivities.length > 3) {
      const candidates = matchingActivities.filter(a => !recentActivityIds.includes(a.id));
      selected = candidates[Math.floor(Math.random() * candidates.length)];
    } else {
      selected = matchingActivities[Math.floor(Math.random() * matchingActivities.length)];
    }

    // Record history
    recentActivityIds.push(selected.id);
    if (recentActivityIds.length > 4) {
      recentActivityIds.shift();
    }

    displaySelectedActivity(selected);
    playSuccess();
    
    // Center map on the selected spot and pop it up
    if (map) {
      const actLat = currentCoords.lat + selected.latOffset;
      const actLng = currentCoords.lng + selected.lngOffset;
      map.setView([actLat, actLng], 14, { animate: true });
      
      // Find the marker object in markersGroup and open popup
      markersGroup.eachLayer((marker) => {
        if (marker.activityId === selected.id) {
          marker.openPopup();
        }
      });
    }

  }, 1200);
}

function resetCardErrorState() {
  const cardCategory = document.getElementById('cardCategory');
  const cardCost = document.getElementById('cardCost');
  const cardDuration = document.getElementById('cardDuration');
  const cardTitle = document.getElementById('cardTitle');
  const cardDescription = document.getElementById('cardDescription');
  const checklistContainer = document.getElementById('cardChecklistContainer');
  const cardActions = document.getElementById('cardActions');

  cardCategory.textContent = "Oops";
  cardCost.textContent = "";
  cardDuration.innerHTML = "";
  cardTitle.textContent = "No Matches Found";
  cardDescription.textContent = "We couldn't find activities matching your select criteria. Try broadening your preferences (e.g. choose All Budgets or Any Weather) and generate again!";
  checklistContainer.style.display = "none";
  cardActions.style.display = "none";
  currentActivity = null;
}

function displaySelectedActivity(activity) {
  currentActivity = activity;
  
  const cardCategory = document.getElementById('cardCategory');
  const cardCost = document.getElementById('cardCost');
  const cardDuration = document.getElementById('cardDuration');
  const cardTitle = document.getElementById('cardTitle');
  const cardDescription = document.getElementById('cardDescription');
  const checklistContainer = document.getElementById('cardChecklistContainer');
  const cardChecklist = document.getElementById('cardChecklist');
  const cardActions = document.getElementById('cardActions');

  // Fill in metrics
  cardCategory.textContent = activity.category;
  cardCategory.style.background = `rgba(${hexToRgb(activity.color)}, 0.25)`;
  cardCost.textContent = activity.cost;
  cardDuration.innerHTML = `<i class="fa-regular fa-clock"></i> ${activity.duration}`;
  
  // Text details
  cardTitle.textContent = activity.name;
  cardDescription.textContent = activity.description;
  
  // Checklist
  cardChecklist.innerHTML = '';
  activity.checklist.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<i class="fa-regular fa-square"></i> <span>${item}</span>`;
    cardChecklist.appendChild(li);
  });
  
  checklistContainer.style.display = 'block';
  cardActions.style.display = 'flex';
}

// Utility to convert hex to RGB for alpha values
function hexToRgb(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
  }
  return '255,255,255';
}

// Theme Switching
function initThemeSelector() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playClick();
      themeBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const theme = e.currentTarget.dataset.theme;
      
      // Clean up body classes
      document.body.className = theme;
      
      // Update map styles
      updateMapTiles();
    });
  });
}

// Itinerary Logic
function initItinerary() {
  // Load from local storage
  const stored = localStorage.getItem('weekend_itinerary');
  if (stored) {
    try {
      itinerary = JSON.parse(stored);
      renderItinerary();
    } catch (e) {
      console.error('Error loading itinerary', e);
      itinerary = [];
    }
  }

  // Buttons
  document.getElementById('btnAddToItinerary').addEventListener('click', () => {
    if (!currentActivity) return;
    
    // Check if already added
    const exists = itinerary.find(item => item.activityId === currentActivity.id);
    if (exists) {
      playClick();
      // Shake the card to indicate duplicate
      const card = document.getElementById('activityCard');
      card.classList.add('has-error');
      setTimeout(() => card.classList.remove('has-error'), 450);
      return;
    }

    playSuccess();
    
    itinerary.push({
      id: Date.now(),
      activityId: currentActivity.id,
      name: currentActivity.name,
      category: currentActivity.category,
      cost: currentActivity.cost,
      duration: currentActivity.duration,
      completed: false
    });

    saveItinerary();
    renderItinerary();
  });

  document.getElementById('btnClearItinerary').addEventListener('click', () => {
    if (itinerary.length === 0) return;
    playClick();
    if (confirm('Clear your weekend plan?')) {
      itinerary = [];
      saveItinerary();
      renderItinerary();
    }
  });

  document.getElementById('btnShowOnMap').addEventListener('click', () => {
    if (!currentActivity) return;
    playClick();
    const actLat = currentCoords.lat + currentActivity.latOffset;
    const actLng = currentCoords.lng + currentActivity.lngOffset;
    map.setView([actLat, actLng], 15, { animate: true });
    
    markersGroup.eachLayer((marker) => {
      if (marker.activityId === currentActivity.id) {
        marker.openPopup();
      }
    });
  });
}

function saveItinerary() {
  localStorage.setItem('weekend_itinerary', JSON.stringify(itinerary));
}

function toggleItineraryItem(itemId) {
  playTick();
  itinerary = itinerary.map(item => {
    if (item.id === itemId) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });
  saveItinerary();
  renderItinerary();
}

function removeItineraryItem(itemId) {
  playClick();
  itinerary = itinerary.filter(item => item.id !== itemId);
  saveItinerary();
  renderItinerary();
}

function renderItinerary() {
  const list = document.getElementById('itineraryList');
  const emptyState = document.getElementById('itineraryEmpty');
  const progressArea = document.getElementById('itineraryProgressArea');
  const progressFill = document.getElementById('itineraryProgressFill');
  const progressText = document.getElementById('itineraryProgressText');

  list.innerHTML = '';
  
  if (itinerary.length === 0) {
    emptyState.style.display = 'flex';
    progressArea.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  progressArea.style.display = 'block';

  let completedCount = 0;

  itinerary.forEach(item => {
    if (item.completed) completedCount++;

    const li = document.createElement('li');
    li.className = `itinerary-item ${item.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="item-checkbox ${item.completed ? 'checked' : ''}" onclick="toggleItineraryItem(${item.id})">
        <i class="fa-solid fa-check"></i>
      </div>
      <div class="item-details" onclick="loadActivityFromItinerary(${item.activityId})">
        <span class="item-title">${item.name}</span>
        <div class="item-meta">
          <span><i class="fa-solid fa-tag"></i> ${item.category}</span>
          <span>•</span>
          <span>${item.cost}</span>
          <span>•</span>
          <span><i class="fa-regular fa-clock"></i> ${item.duration}</span>
        </div>
      </div>
      <button class="btn-remove-item" onclick="removeItineraryItem(${item.id})" title="Remove spot">
        <i class="fa-regular fa-trash-can"></i>
      </button>
    `;

    list.appendChild(li);
  });

  // Update Progress Bar
  const pct = (completedCount / itinerary.length) * 100;
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${completedCount} of ${itinerary.length} activities completed`;
}

function loadActivityFromItinerary(activityId) {
  playClick();
  const act = activitiesData.find(a => a.id === activityId);
  if (act) {
    displaySelectedActivity(act);
    const actLat = currentCoords.lat + act.latOffset;
    const actLng = currentCoords.lng + act.lngOffset;
    map.setView([actLat, actLng], 14, { animate: true });
    
    markersGroup.eachLayer((marker) => {
      if (marker.activityId === act.id) {
        marker.openPopup();
      }
    });
  }
}

// Global functions exposed to inline events
window.toggleItineraryItem = toggleItineraryItem;
window.removeItineraryItem = removeItineraryItem;
window.loadActivityFromItinerary = loadActivityFromItinerary;
window.loadActivityFromMap = loadActivityFromMap;

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  initThemeSelector();
  initFilters();
  initItinerary();
  
  // Set up generate button listener
  document.getElementById('btnGenerate').addEventListener('click', handleGenerateActivity);
  
  // Set up location detection listener
  document.getElementById('btnLocateMe').addEventListener('click', handleLocateMe);
  
  // Add quick initial filtering to populate matches count
  runFiltering();
  
  // Initialize Leaflet Map with slight delay to ensure container layout dimensions are computed
  setTimeout(() => {
    initMap();
  }, 100);
});
