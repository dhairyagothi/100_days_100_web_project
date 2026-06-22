// Global App State
let plants = [];
let activePlantId = null;
let currentFilter = 'all';
let isAudioEnabled = true;

// Web Audio API Synthesizer Context
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!isAudioEnabled) return;
  try {
    initAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const time = audioCtx.currentTime;
    
    switch (type) {
      case 'click': {
        // Soft wooden pop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.15);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.15);
        break;
      }
      case 'water': {
        // Water bubble spray (sequence of fast bubbly chirps)
        for (let i = 0; i < 6; i++) {
          const startTime = time + i * 0.08;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(300 + Math.random() * 400, startTime);
          osc.frequency.exponentialRampToValueAtTime(800 + Math.random() * 600, startTime + 0.1);
          
          gain.gain.setValueAtTime(0.08, startTime);
          gain.gain.linearRampToValueAtTime(0.01, startTime + 0.1);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start(startTime);
          osc.stop(startTime + 0.1);
        }
        break;
      }
      case 'levelup': {
        // Sweet digital wind chime arpeggio (C major 7th chord upward)
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C4, E4, G4, C5, E5
        notes.forEach((freq, idx) => {
          const startTime = time + idx * 0.12;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          
          gain.gain.setValueAtTime(0.1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);
          
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          
          osc.start(startTime);
          osc.stop(startTime + 0.65);
        });
        break;
      }
    }
  } catch (e) {
    console.error("Audio Synthesis error: ", e);
  }
}

// Starter Plants (Default database if local storage is empty)
const STARTER_PLANTS = [
  {
    id: 'starter-monstera',
    name: 'Bramble',
    species: 'monstera',
    potColor: 'terracotta',
    addedDate: Date.now() - (5 * 24 * 60 * 60 * 1000), // 5 days ago
    lastWatered: Date.now() - (6 * 60 * 60 * 1000), // 6 hours ago
    waterFrequency: 3, // every 3 days
    xp: 45,
    level: 2, // Sprout
    journal: [
      { timestamp: Date.now() - (5 * 24 * 60 * 60 * 1000), text: '🌱 Joined the greenhouse!', type: 'creation' },
      { timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), text: '💧 Bramble watered for the first time.', type: 'watering' },
      { timestamp: Date.now() - (2 * 24 * 60 * 60 * 1000), text: '🎉 bramble grew into a Sprout!', type: 'levelup' }
    ]
  },
  {
    id: 'starter-cactus',
    name: 'Pip',
    species: 'cactus',
    potColor: 'mint',
    addedDate: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
    lastWatered: Date.now() - (4 * 24 * 60 * 60 * 1000), // 4 days ago
    waterFrequency: 7, // every 7 days
    xp: 110,
    level: 4, // Blooming
    journal: [
      { timestamp: Date.now() - (10 * 24 * 60 * 60 * 1000), text: '🌱 Pip the cute cactus moved in!', type: 'creation' },
      { timestamp: Date.now() - (7 * 24 * 60 * 60 * 1000), text: '💧 Pip received hydration.', type: 'watering' },
      { timestamp: Date.now() - (4 * 24 * 60 * 60 * 1000), text: '🎉 Pip blossomed with a lovely flower!', type: 'levelup' }
    ]
  }
];

// Local Storage Wrappers
function saveToLocalStorage() {
  localStorage.setItem('flora_tracker_plants', JSON.stringify(plants));
  updateDashboardStats();
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem('flora_tracker_plants');
  if (stored) {
    plants = JSON.parse(stored);
  } else {
    plants = [...STARTER_PLANTS];
    saveToLocalStorage();
  }
}

// Helpers for Care Status
function getHydrationPercentage(plant) {
  const now = Date.now();
  const freqMs = plant.waterFrequency * 24 * 60 * 60 * 1000;
  const elapsed = now - plant.lastWatered;
  
  if (elapsed >= freqMs) return 0;
  
  const percentage = ((freqMs - elapsed) / freqMs) * 100;
  return Math.max(0, Math.min(100, Math.round(percentage)));
}

function getPlantMood(hydration) {
  if (hydration > 50) return 'happy';
  if (hydration >= 20) return 'normal';
  if (hydration > 0) return 'thirsty';
  return 'sad';
}

function getXPProgress(xp) {
  // Returns relative percentage progress within current level
  if (xp < 30) return { pct: (xp / 30) * 100, min: 0, max: 30 };
  if (xp < 60) return { pct: ((xp - 30) / 30) * 100, min: 30, max: 60 };
  if (xp < 100) return { pct: ((xp - 60) / 40) * 100, min: 60, max: 100 };
  return { pct: 100, min: 100, max: 100 };
}

function getLevelName(level) {
  switch (level) {
    case 1: return 'Seedling';
    case 2: return 'Sprout';
    case 3: return 'Mature';
    case 4: return 'Blooming';
    default: return 'Seedling';
  }
}

// UI Render Engine
function renderShelves() {
  const container = document.getElementById('shelves-container');
  container.innerHTML = '';
  
  // Filter plants
  let filteredPlants = [...plants];
  if (currentFilter === 'thirsty') {
    filteredPlants = plants.filter(p => getHydrationPercentage(p) < 20);
  } else if (currentFilter === 'blooming') {
    filteredPlants = plants.filter(p => p.level === 4);
  }
  
  if (filteredPlants.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><path d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"/></svg>
        <h2>Greenhouse is quiet</h2>
        <p>No plants fit this filter. Try adding a new plant companion to your shelf!</p>
        <button class="btn-primary" onclick="openAddModal()">
          <svg viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>
          Add a Plant
        </button>
      </div>
    `;
    return;
  }
  
  // Arrange in rows of maximum 4 plants per shelf
  const maxPerShelf = 4;
  const numShelves = Math.ceil(filteredPlants.length / maxPerShelf);
  
  for (let s = 0; s < numShelves; s++) {
    const shelfPlants = filteredPlants.slice(s * maxPerShelf, (s + 1) * maxPerShelf);
    
    const rowDiv = document.createElement('div');
    rowDiv.className = 'shelf-row';
    
    const gridDiv = document.createElement('div');
    gridDiv.className = 'plant-grid';
    
    shelfPlants.forEach(plant => {
      const hydration = getHydrationPercentage(plant);
      const mood = getPlantMood(hydration);
      const levelName = getLevelName(plant.level);
      
      const plantCard = document.createElement('div');
      plantCard.className = `plant-card is-${mood === 'happy' ? 'healthy' : mood === 'normal' ? 'healthy' : 'thirsty'}`;
      plantCard.setAttribute('data-id', plant.id);
      plantCard.onclick = (e) => {
        // Prevent click if clicking Water button or details button
        if (e.target.closest('button')) return;
        openPlantDrawer(plant.id);
      };
      
      const svgMarkup = window.getPlantSVG(plant.species, levelName.toLowerCase(), mood, plant.potColor);
      
      plantCard.innerHTML = `
        <span class="plant-badge level-${plant.level}">${levelName}</span>
        <div class="plant-avatar-container">
          ${svgMarkup}
        </div>
        <div class="plant-info">
          <h3>${plant.name}</h3>
          <p>${plant.species.toUpperCase().replace('_', ' ')}</p>
        </div>
        <div class="progress-box">
          <div class="progress-label">
            <span>Water Care</span>
            <span>${hydration}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${hydration}%"></div>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-water" onclick="waterPlant('${plant.id}', this)">
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z"/></svg>
            Water
          </button>
          <button class="btn-details" onclick="openPlantDrawer('${plant.id}')">
            <svg viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/></svg>
          </button>
        </div>
      `;
      
      gridDiv.appendChild(plantCard);
    });
    
    const shelfBoard = document.createElement('div');
    shelfBoard.className = 'shelf-board';
    
    rowDiv.appendChild(gridDiv);
    rowDiv.appendChild(shelfBoard);
    container.appendChild(rowDiv);
  }
}

function updateDashboardStats() {
  const total = plants.length;
  const thirsty = plants.filter(p => getHydrationPercentage(p) < 20).length;
  const blooming = plants.filter(p => p.level === 4).length;
  
  document.getElementById('stat-total').innerText = total;
  document.getElementById('stat-thirsty').innerText = thirsty;
  document.getElementById('stat-blooming').innerText = blooming;
}

// Water Interaction & Animation Particle Effect
function waterPlant(id, buttonEl) {
  playSound('water');
  
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  const originalLevel = plant.level;
  
  // Calculate gains
  const now = Date.now();
  const hydration = getHydrationPercentage(plant);
  const wasThirsty = hydration < 20;
  
  plant.lastWatered = now;
  
  // XP Increase
  let xpGain = 15;
  if (!wasThirsty) xpGain += 5; // Bonus for proactive care!
  plant.xp += xpGain;
  
  // Leveling up checks
  let newLevel = 1;
  if (plant.xp >= 100) newLevel = 4;
  else if (plant.xp >= 60) newLevel = 3;
  else if (plant.xp >= 30) newLevel = 2;
  
  plant.level = newLevel;
  
  // Create Journal Notes
  plant.journal.unshift({
    timestamp: now,
    text: `💧 Hydrated! (Gained +${xpGain} XP)`,
    type: 'watering'
  });
  
  if (newLevel > originalLevel) {
    plant.journal.unshift({
      timestamp: now,
      text: `🎉 Grew into a beautiful ${getLevelName(newLevel)} plant!`,
      type: 'levelup'
    });
    setTimeout(() => playSound('levelup'), 600);
  }
  
  saveToLocalStorage();
  
  // Splashing water particles effect
  createWaterSplashes(buttonEl);
  
  renderShelves();
  
  // If drawer is open for this plant, refresh details
  if (activePlantId === id) {
    updateDrawerUI(plant);
  }
}

function createWaterSplashes(element) {
  const rect = element.getBoundingClientRect();
  const container = document.body;
  
  for (let i = 0; i < 8; i++) {
    const drop = document.createElement('div');
    drop.className = 'water-droplet';
    
    // Position near the button / card
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
    const y = rect.top - 10 + (Math.random() - 0.5) * 15 + window.scrollY;
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    drop.style.background = `rgba(33, 150, 243, ${0.4 + Math.random() * 0.6})`;
    drop.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
    drop.style.animationDelay = `${Math.random() * 0.2}s`;
    
    container.appendChild(drop);
    
    // Remove droplet from DOM
    drop.addEventListener('animationend', () => {
      drop.remove();
    });
  }
}

// Drawer Control Functions
function openPlantDrawer(id) {
  playSound('click');
  const plant = plants.find(p => p.id === id);
  if (!plant) return;
  
  activePlantId = id;
  updateDrawerUI(plant);
  document.getElementById('plant-drawer').classList.add('active');
}

function closePlantDrawer() {
  playSound('click');
  document.getElementById('plant-drawer').classList.remove('active');
  activePlantId = null;
}

function updateDrawerUI(plant) {
  const hydration = getHydrationPercentage(plant);
  const mood = getPlantMood(hydration);
  const levelName = getLevelName(plant.level);
  const xpProg = getXPProgress(plant.xp);
  
  const formattedDate = new Date(plant.addedDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Drawer plant visual card
  const drawerPlantView = document.getElementById('drawer-plant-view');
  drawerPlantView.innerHTML = `
    ${window.getPlantSVG(plant.species, levelName.toLowerCase(), mood, plant.potColor)}
    <button class="cheat-btn" onclick="cheatXP('${plant.id}')">✨ Boost growth (+15 XP)</button>
  `;
  
  document.getElementById('drawer-title').innerText = plant.name;
  document.getElementById('drawer-details-subtitle').innerText = `${plant.species.toUpperCase()} (${levelName})`;
  
  // Stats inside drawer
  document.getElementById('drawer-stat-hydration').innerText = `${hydration}%`;
  document.getElementById('drawer-stat-xp').innerText = `${plant.xp} XP`;
  document.getElementById('drawer-stat-birthday').innerText = formattedDate;
  
  // Drawer level progress bar
  const xpBar = document.getElementById('drawer-xp-bar');
  const xpLabel = document.getElementById('drawer-xp-label');
  
  if (plant.level === 4) {
    xpBar.style.width = '100%';
    xpLabel.innerText = 'Max Growth Level!';
  } else {
    xpBar.style.width = `${xpProg.pct}%`;
    xpLabel.innerText = `${plant.xp} / ${xpProg.max} XP to next stage`;
  }
  
  // Load Journal logs list
  const logList = document.getElementById('journal-logs-list');
  logList.innerHTML = '';
  
  plant.journal.forEach(entry => {
    const dateStr = new Date(entry.timestamp).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }) + ' - ' + new Date(entry.timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
    
    const item = document.createElement('div');
    item.className = 'journal-entry';
    item.innerHTML = `
      <span class="journal-entry-time">${dateStr}</span>
      <span class="journal-entry-text">${entry.text}</span>
    `;
    logList.appendChild(item);
  });
}

// Add Custom Journal Entry
function submitJournalLog() {
  const input = document.getElementById('journal-text-input');
  const text = input.value.trim();
  if (!text || !activePlantId) return;
  
  playSound('click');
  const plantIndex = plants.findIndex(p => p.id === activePlantId);
  if (plantIndex === -1) return;
  
  plants[plantIndex].journal.unshift({
    timestamp: Date.now(),
    text: `📝 ${text}`,
    type: 'note'
  });
  
  input.value = '';
  saveToLocalStorage();
  updateDrawerUI(plants[plantIndex]);
}

// Modal Controllers
function openAddModal() {
  playSound('click');
  document.getElementById('add-modal').classList.add('active');
  
  // Set default values in modal
  document.getElementById('new-plant-name').value = '';
  document.getElementById('new-plant-frequency').value = 3;
  
  // Set default active species
  document.querySelectorAll('.species-option').forEach(el => el.classList.remove('active'));
  document.querySelector('.species-option[data-value="monstera"]').classList.add('active');
  
  // Set default active pot
  document.querySelectorAll('.color-dot').forEach(el => el.classList.remove('active'));
  document.querySelector('.color-dot[data-value="terracotta"]').classList.add('active');
}

function closeAddModal() {
  playSound('click');
  document.getElementById('add-modal').classList.remove('active');
}

// Handle Form Submission
function saveNewPlant() {
  const nameInput = document.getElementById('new-plant-name');
  const name = nameInput.value.trim() || 'Sprout';
  const frequency = parseInt(document.getElementById('new-plant-frequency').value) || 3;
  
  const selectedSpeciesEl = document.querySelector('.species-option.active');
  const species = selectedSpeciesEl ? selectedSpeciesEl.getAttribute('data-value') : 'monstera';
  
  const selectedColorEl = document.querySelector('.color-dot.active');
  const potColor = selectedColorEl ? selectedColorEl.getAttribute('data-value') : 'terracotta';
  
  const newPlant = {
    id: `plant-${Date.now()}`,
    name: name,
    species: species,
    potColor: potColor,
    addedDate: Date.now(),
    lastWatered: Date.now(),
    waterFrequency: frequency,
    xp: 0,
    level: 1, // Seedling
    journal: [
      { timestamp: Date.now(), text: '🌱 Planted in your greenhouse!', type: 'creation' }
    ]
  };
  
  plants.push(newPlant);
  saveToLocalStorage();
  playSound('levelup');
  
  closeAddModal();
  renderShelves();
}

// Toggle filters
function setFilter(type) {
  playSound('click');
  currentFilter = type;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-filter') === type);
  });
  renderShelves();
}

// Day/Night Greenhouse theme toggles
function toggleTheme() {
  playSound('click');
  const root = document.documentElement;
  const currentTheme = root.getAttribute('data-theme') || 'day';
  const newTheme = currentTheme === 'day' ? 'night' : 'day';
  root.setAttribute('data-theme', newTheme);
  
  const icon = document.getElementById('theme-icon');
  if (newTheme === 'night') {
    icon.innerHTML = '<path d="M12,18C11.11,18 10.26,17.8 9.5,17.45C11.56,16.5 13,14.42 13,12C13,9.58 11.56,7.5 9.5,6.55C10.26,6.2 11.11,6 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/>';
  } else {
    icon.innerHTML = '<path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z"/>';
  }
}

// Toggle Sound Setting
function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;
  playSound('click');
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (isAudioEnabled) {
    audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/></svg>';
  } else {
    audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12,4L7,9H3V15H7L12,20V4M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.48,12.42 16.5,12.21 16.5,12M19,12C19,12.9 18.82,13.75 18.48,14.53L20,16.05C20.63,14.82 21,13.46 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.44 14,18.64V20.7C15.38,20.44 16.63,19.82 17.68,18.96L20.73,22L22,20.73L12.79,11.53L4.27,3Z"/></svg>';
  }
}

// Development Testing Cheat (Instantly levels plant stage)
function cheatXP(id) {
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  const oldLevel = plant.level;
  plant.xp += 15;
  
  let newLevel = 1;
  if (plant.xp >= 100) newLevel = 4;
  else if (plant.xp >= 60) newLevel = 3;
  else if (plant.xp >= 30) newLevel = 2;
  
  plant.level = newLevel;
  
  plant.journal.unshift({
    timestamp: Date.now(),
    text: `✨ growth spurt! Added 15 XP.`,
    type: 'note'
  });
  
  if (newLevel > oldLevel) {
    plant.journal.unshift({
      timestamp: Date.now(),
      text: `🎉 Grew into a beautiful ${getLevelName(newLevel)} plant!`,
      type: 'levelup'
    });
    playSound('levelup');
  } else {
    playSound('water');
  }
  
  saveToLocalStorage();
  renderShelves();
  updateDrawerUI(plant);
}

// Set up UI triggers
document.addEventListener('DOMContentLoaded', () => {
  // Load database
  loadFromLocalStorage();
  renderShelves();
  updateDashboardStats();
  
  // Set up event listeners for modal choice items
  document.querySelectorAll('.species-option').forEach(opt => {
    opt.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.species-option').forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
    });
  });
  
  document.querySelectorAll('.color-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.color-dot').forEach(el => el.classList.remove('active'));
      dot.classList.add('active');
    });
  });
  
  // Keypress event for journal input
  document.getElementById('journal-text-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitJournalLog();
    }
  });
  
  // Run status update checks every 10 seconds to refresh UI timer bars dynamically
  setInterval(() => {
    renderShelves();
    updateDashboardStats();
    if (activePlantId) {
      const activePlant = plants.find(p => p.id === activePlantId);
      if (activePlant) updateDrawerUI(activePlant);
    }
  }, 10000);
});

// Expose global triggers
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.saveNewPlant = saveNewPlant;
window.waterPlant = waterPlant;
window.openPlantDrawer = openPlantDrawer;
window.closePlantDrawer = closePlantDrawer;
window.submitJournalLog = submitJournalLog;
window.setFilter = setFilter;
window.toggleTheme = toggleTheme;
window.toggleAudio = toggleAudio;
window.cheatXP = cheatXP;
