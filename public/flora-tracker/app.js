// Global App State
let plants = [];
let activePlantId = null;
let currentFilter = 'all';
let isAudioEnabled = true;
let pendingDeletionId = null;
let pendingDeletionType = null;

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
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
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
      case 'delete': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, time);
        osc.frequency.exponentialRampToValueAtTime(100, time + 0.4);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.4);
        break;
      }
      case 'archive': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, time);
        osc.frequency.exponentialRampToValueAtTime(200, time + 0.3);
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.3);
        break;
      }
      case 'restore': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, time);
        osc.frequency.exponentialRampToValueAtTime(500, time + 0.25);
        gain.gain.setValueAtTime(0.1, time);
        gain.gain.linearRampToValueAtTime(0.01, time + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(time);
        osc.stop(time + 0.25);
        break;
      }
    }
  } catch (e) {
    console.error("Audio Synthesis error: ", e);
  }
}

// Starter Plants
const STARTER_PLANTS = [
  {
    id: 'starter-monstera',
    name: 'Bramble',
    species: 'monstera',
    potColor: 'terracotta',
    addedDate: Date.now() - (5 * 24 * 60 * 60 * 1000),
    lastWatered: Date.now() - (6 * 60 * 60 * 1000),
    waterFrequency: 3,
    xp: 45,
    level: 2,
    isArchived: false,
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
    addedDate: Date.now() - (10 * 24 * 60 * 60 * 1000),
    lastWatered: Date.now() - (4 * 24 * 60 * 60 * 1000),
    waterFrequency: 7,
    xp: 110,
    level: 4,
    isArchived: false,
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
  updateArchiveCount();
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem('flora_tracker_plants');
  if (stored) {
    plants = JSON.parse(stored);
    plants = plants.map(p => ({
      ...p,
      isArchived: p.isArchived || false
    }));
  } else {
    plants = [...STARTER_PLANTS];
    saveToLocalStorage();
  }
}

// Helpers for Care Status
function getHydrationPercentage(plant) {
  if (plant.isArchived) return 0;
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

// Toast Notification System
function showToast(message, type = 'success', duration = 3000) {
  const toast = document.getElementById('toast');
  const toastIcon = toast.querySelector('.toast-icon');
  const toastTitle = toast.querySelector('h4');
  const toastMessage = toast.querySelector('p');
  
  const icons = {
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  const titles = {
    success: 'Success!',
    warning: 'Notice',
    error: 'Oops!'
  };
  
  toastIcon.className = `toast-icon ${type}`;
  toastIcon.textContent = icons[type] || '✅';
  toastTitle.textContent = titles[type] || 'Success!';
  toastMessage.textContent = message;
  
  toast.classList.add('active');
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('active');
  }, duration);
}

function closeToast() {
  const toast = document.getElementById('toast');
  toast.classList.remove('active');
  clearTimeout(toast._timeout);
}

// Archive Management Functions
function archivePlant(id) {
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  if (plant.isArchived) return;
  
  plant.isArchived = true;
  plant.journal.unshift({
    timestamp: Date.now(),
    text: '📦 Plant was archived to the greenhouse basement',
    type: 'archive'
  });
  
  saveToLocalStorage();
  playSound('archive');
  renderShelves();
  showToast(`${plant.name} has been archived!`, 'warning');
  
  if (activePlantId === id) {
    closePlantDrawer();
  }
}

function restorePlant(id) {
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  if (!plant.isArchived) return;
  
  plant.isArchived = false;
  plant.journal.unshift({
    timestamp: Date.now(),
    text: '🌱 Plant was restored from the archive!',
    type: 'restore'
  });
  
  saveToLocalStorage();
  playSound('restore');
  renderShelves();
  showToast(`${plant.name} has been restored!`, 'success');
  
  if (activePlantId === id) {
    updateDrawerUI(plant);
  }
}

function deletePlantPermanent(id) {
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  const plantName = plant.name;
  
  plants.splice(plantIndex, 1);
  saveToLocalStorage();
  playSound('delete');
  renderShelves();
  showToast(`🗑️ ${plantName} has been permanently removed`, 'error');
  
  if (activePlantId === id) {
    closePlantDrawer();
  }
}

function confirmDelete(id, type) {
  pendingDeletionId = id;
  pendingDeletionType = type;
  
  const modal = document.getElementById('confirm-modal');
  const title = document.getElementById('confirm-title');
  const message = document.getElementById('confirm-message');
  const confirmBtn = document.getElementById('confirm-delete-btn');
  
  const plant = plants.find(p => p.id === id);
  if (!plant) return;
  
  if (type === 'archive') {
    title.textContent = 'Archive Plant?';
    message.innerHTML = `Move <strong>${plant.name}</strong> to the archive?<br><small style="color: var(--text-muted);">You can restore it anytime from the archive.</small>`;
    confirmBtn.textContent = 'Move to Archive';
    confirmBtn.className = 'btn-primary';
    confirmBtn.style.background = 'var(--gold)';
  } else if (type === 'delete') {
    title.textContent = 'Permanently Delete?';
    message.innerHTML = `Are you sure you want to permanently delete <strong>${plant.name}</strong>?<br><small style="color: var(--danger);">This action cannot be undone!</small>`;
    confirmBtn.textContent = 'Delete Permanently';
    confirmBtn.className = 'btn-danger';
    confirmBtn.style.background = 'var(--danger)';
  }
  
  modal.classList.add('active');
  playSound('click');
}

function closeConfirmModal() {
  document.getElementById('confirm-modal').classList.remove('active');
  pendingDeletionId = null;
  pendingDeletionType = null;
  playSound('click');
}

function executeConfirmedAction() {
  if (!pendingDeletionId) return;
  
  if (pendingDeletionType === 'archive') {
    archivePlant(pendingDeletionId);
  } else if (pendingDeletionType === 'delete') {
    deletePlantPermanent(pendingDeletionId);
  }
  
  closeConfirmModal();
}

function updateArchiveCount() {
  const archivedCount = plants.filter(p => p.isArchived).length;
  const filterBtn = document.querySelector('.filter-btn[data-filter="archived"]');
  if (filterBtn) {
    const existingBadge = filterBtn.querySelector('.archive-count-badge');
    if (archivedCount > 0) {
      if (!existingBadge) {
        const badge = document.createElement('span');
        badge.className = 'archive-count-badge';
        badge.textContent = archivedCount;
        filterBtn.appendChild(badge);
      } else {
        existingBadge.textContent = archivedCount;
      }
    } else if (existingBadge) {
      existingBadge.remove();
    }
  }
  
  // Update archive stat
  const archiveStat = document.getElementById('stat-archived');
  if (archiveStat) {
    archiveStat.textContent = archivedCount;
  }
}

// UI Render Engine
function renderShelves() {
  const container = document.getElementById('shelves-container');
  container.innerHTML = '';
  
  let filteredPlants = [...plants];
  
  if (currentFilter === 'archived') {
    filteredPlants = plants.filter(p => p.isArchived === true);
  } else {
    filteredPlants = plants.filter(p => !p.isArchived);
    
    if (currentFilter === 'thirsty') {
      filteredPlants = filteredPlants.filter(p => getHydrationPercentage(p) < 20);
    } else if (currentFilter === 'blooming') {
      filteredPlants = filteredPlants.filter(p => p.level === 4);
    }
  }
  
  if (filteredPlants.length === 0) {
    let emptyMessage = '';
    if (currentFilter === 'archived') {
      emptyMessage = `
        <h2>Archive is empty</h2>
        <p>No plants have been archived yet. Archive plants to keep your greenhouse tidy!</p>
      `;
    } else {
      emptyMessage = `
        <h2>Greenhouse is quiet</h2>
        <p>No plants fit this filter. Try adding a new plant companion to your shelf!</p>
        <button class="btn-primary" onclick="openAddModal()">
          <svg viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>
          Add a Plant
        </button>
      `;
    }
    
    container.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24"><path d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3M12,5A7,7 0 0,1 19,12A7,7 0 0,1 12,19A7,7 0 0,1 5,12A7,7 0 0,1 12,5M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z"/></svg>
        ${emptyMessage}
      </div>
    `;
    return;
  }
  
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
      const isArchived = plant.isArchived || false;
      
      const plantCard = document.createElement('div');
      plantCard.className = `plant-card ${isArchived ? 'is-healthy archived' : mood === 'happy' ? 'is-healthy' : mood === 'normal' ? 'is-healthy' : 'is-thirsty'}`;
      plantCard.setAttribute('data-id', plant.id);
      plantCard.onclick = (e) => {
        if (e.target.closest('button')) return;
        openPlantDrawer(plant.id);
      };
      
      const svgMarkup = window.getPlantSVG(plant.species, levelName.toLowerCase(), mood, plant.potColor);
      
      plantCard.innerHTML = `
        ${isArchived ? '<span class="archive-badge">📦 Archived</span>' : `<span class="plant-badge level-${plant.level}">${levelName}</span>`}
        <div class="plant-avatar-container">
          ${svgMarkup}
        </div>
        <div class="plant-info">
          <h3>${plant.name} ${isArchived ? '📦' : ''}</h3>
          <p>${plant.species.toUpperCase().replace('_', ' ')}</p>
        </div>
        ${!isArchived ? `
        <div class="progress-box">
          <div class="progress-label">
            <span>Water Care</span>
            <span>${hydration}%</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" style="width: ${hydration}%"></div>
          </div>
        </div>
        ` : `
        <div class="progress-box">
          <div class="progress-label">
            <span>Status</span>
            <span>In Archive</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar" style="width: 100%; background: var(--text-muted);"></div>
          </div>
        </div>
        `}
        <div class="card-actions">
          ${isArchived ? `
            <button class="btn-restore" onclick="confirmRestore('${plant.id}')">
              <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M13,3C9.23,3 6.19,5.6 5.27,9H3L6,12L9,9H7.1C7.92,6.16 10.35,4 13,4C16.31,4 19,6.69 19,10C19,13.31 16.31,16 13,16C11.18,16 9.54,15.21 8.46,14H6.05C7.45,16.03 9.81,17.5 12.5,17.5C16.53,17.5 19.75,14.28 19.75,10.25C19.75,6.22 16.53,3 13,3Z"/></svg>
              Restore
            </button>
            <button class="btn-delete-permanent" onclick="confirmDelete('${plant.id}', 'delete')">
              <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"/></svg>
              Delete
            </button>
          ` : `
            <button class="btn-water" onclick="waterPlant('${plant.id}', this)">
              <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z"/></svg>
              Water
            </button>
            <button class="btn-archive" onclick="confirmDelete('${plant.id}', 'archive')" title="Archive this plant">
              <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M20,6H4V4H20V6M21,8H3V20H21V8M11,10H13V15H11V10Z"/></svg>
            </button>
            <button class="btn-details" onclick="openPlantDrawer('${plant.id}')">
              <svg viewBox="0 0 24 24"><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/></svg>
            </button>
          `}
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
  const total = plants.filter(p => !p.isArchived).length;
  const thirsty = plants.filter(p => !p.isArchived && getHydrationPercentage(p) < 20).length;
  const blooming = plants.filter(p => !p.isArchived && p.level === 4).length;
  const archived = plants.filter(p => p.isArchived).length;
  
  document.getElementById('stat-total').innerText = total;
  document.getElementById('stat-thirsty').innerText = thirsty;
  document.getElementById('stat-blooming').innerText = blooming;
  
  const archiveStat = document.getElementById('stat-archived');
  if (archiveStat) {
    archiveStat.textContent = archived;
  }
}

function waterPlant(id, buttonEl) {
  playSound('water');
  
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  if (plant.isArchived) {
    showToast('Archived plants cannot be watered!', 'warning');
    return;
  }
  
  const originalLevel = plant.level;
  
  const now = Date.now();
  const hydration = getHydrationPercentage(plant);
  const wasThirsty = hydration < 20;
  
  plant.lastWatered = now;
  
  let xpGain = 15;
  if (!wasThirsty) xpGain += 5;
  plant.xp += xpGain;
  
  let newLevel = 1;
  if (plant.xp >= 100) newLevel = 4;
  else if (plant.xp >= 60) newLevel = 3;
  else if (plant.xp >= 30) newLevel = 2;
  
  plant.level = newLevel;
  
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
    showToast(`🎉 ${plant.name} grew to ${getLevelName(newLevel)}!`, 'success');
  }
  
  saveToLocalStorage();
  createWaterSplashes(buttonEl);
  renderShelves();
  
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
    
    const x = rect.left + rect.width / 2 + (Math.random() - 0.5) * 60;
    const y = rect.top - 10 + (Math.random() - 0.5) * 15 + window.scrollY;
    
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    drop.style.background = `rgba(33, 150, 243, ${0.4 + Math.random() * 0.6})`;
    drop.style.transform = `scale(${0.6 + Math.random() * 0.6})`;
    drop.style.animationDelay = `${Math.random() * 0.2}s`;
    
    container.appendChild(drop);
    
    drop.addEventListener('animationend', () => {
      drop.remove();
    });
  }
}

function confirmRestore(id) {
  const plant = plants.find(p => p.id === id);
  if (!plant) return;
  
  if (confirm(`Restore "${plant.name}" from the archive?`)) {
    restorePlant(id);
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
  const isArchived = plant.isArchived || false;
  
  const formattedDate = new Date(plant.addedDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const drawerPlantView = document.getElementById('drawer-plant-view');
  drawerPlantView.innerHTML = `
    ${window.getPlantSVG(plant.species, levelName.toLowerCase(), mood, plant.potColor)}
    ${!isArchived ? `<button class="cheat-btn" onclick="cheatXP('${plant.id}')">✨ Boost growth (+15 XP)</button>` : ''}
    ${isArchived ? `<p style="margin-top: 0.5rem; color: var(--text-muted); font-size: 0.9rem;">📦 This plant is in the archive</p>` : ''}
  `;
  
  document.getElementById('drawer-title').innerText = plant.name + (isArchived ? ' 📦' : '');
  document.getElementById('drawer-details-subtitle').innerText = `${plant.species.toUpperCase()} (${levelName})${isArchived ? ' - Archived' : ''}`;
  
  document.getElementById('drawer-stat-hydration').innerText = isArchived ? '—' : `${hydration}%`;
  document.getElementById('drawer-stat-xp').innerText = isArchived ? '—' : `${plant.xp} XP`;
  document.getElementById('drawer-stat-birthday').innerText = formattedDate;
  
  const xpBar = document.getElementById('drawer-xp-bar');
  const xpLabel = document.getElementById('drawer-xp-label');
  
  if (isArchived) {
    xpBar.style.width = '100%';
    xpBar.style.background = 'var(--text-muted)';
    xpLabel.innerText = 'Archived';
  } else if (plant.level === 4) {
    xpBar.style.width = '100%';
    xpBar.style.background = 'linear-gradient(to right, var(--accent-green), var(--gold))';
    xpLabel.innerText = 'Max Growth Level!';
  } else {
    xpBar.style.width = `${xpProg.pct}%`;
    xpBar.style.background = 'linear-gradient(to right, var(--accent-green), var(--gold))';
    xpLabel.innerText = `${plant.xp} / ${xpProg.max} XP to next stage`;
  }
  
  const logList = document.getElementById('journal-logs-list');
  logList.innerHTML = '';
  
  if (isArchived) {
    const item = document.createElement('div');
    item.className = 'journal-entry';
    item.innerHTML = `
      <span class="journal-entry-time">📦 In Archive</span>
      <span class="journal-entry-text">This plant is currently archived. Restore it to continue caring for it.</span>
    `;
    logList.appendChild(item);
  }
  
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
  
  const journalInput = document.querySelector('.journal-section .form-control');
  const journalButton = document.querySelector('.journal-section .btn-primary');
  if (journalInput && journalButton) {
    if (isArchived) {
      journalInput.style.display = 'none';
      journalButton.style.display = 'none';
    } else {
      journalInput.style.display = 'block';
      journalButton.style.display = 'block';
    }
  }
}

function submitJournalLog() {
  const input = document.getElementById('journal-text-input');
  const text = input.value.trim();
  if (!text || !activePlantId) return;
  
  const plantIndex = plants.findIndex(p => p.id === activePlantId);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  if (plant.isArchived) {
    showToast('Cannot add journal entries to archived plants!', 'warning');
    return;
  }
  
  playSound('click');
  plants[plantIndex].journal.unshift({
    timestamp: Date.now(),
    text: `📝 ${text}`,
    type: 'note'
  });
  
  input.value = '';
  saveToLocalStorage();
  updateDrawerUI(plants[plantIndex]);
  showToast('Journal entry added! ✨', 'success');
}

// Modal Controllers
function openAddModal() {
  playSound('click');
  document.getElementById('add-modal').classList.add('active');
  
  document.getElementById('new-plant-name').value = '';
  document.getElementById('new-plant-frequency').value = 3;
  
  document.querySelectorAll('.species-option').forEach(el => el.classList.remove('active'));
  document.querySelector('.species-option[data-value="monstera"]').classList.add('active');
  
  document.querySelectorAll('.color-dot').forEach(el => el.classList.remove('active'));
  document.querySelector('.color-dot[data-value="terracotta"]').classList.add('active');
}

function closeAddModal() {
  playSound('click');
  document.getElementById('add-modal').classList.remove('active');
}

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
    level: 1,
    isArchived: false,
    journal: [
      { timestamp: Date.now(), text: '🌱 Planted in your greenhouse!', type: 'creation' }
    ]
  };
  
  plants.push(newPlant);
  saveToLocalStorage();
  playSound('levelup');
  
  closeAddModal();
  renderShelves();
  showToast(`🌱 Welcome ${name}!`, 'success');
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

// Day/Night Theme Toggle
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

function toggleAudio() {
  isAudioEnabled = !isAudioEnabled;
  playSound('click');
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (isAudioEnabled) {
    audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/></svg>';
    showToast('🔊 Sound enabled', 'success');
  } else {
    audioBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12,4L7,9H3V15H7L12,20V4M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.48,12.42 16.5,12.21 16.5,12M19,12C19,12.9 18.82,13.75 18.48,14.53L20,16.05C20.63,14.82 21,13.46 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.44 14,18.64V20.7C15.38,20.44 16.63,19.82 17.68,18.96L20.73,22L22,20.73L12.79,11.53L4.27,3Z"/></svg>';
    showToast('🔇 Sound disabled', 'warning');
  }
}

function cheatXP(id) {
  const plantIndex = plants.findIndex(p => p.id === id);
  if (plantIndex === -1) return;
  
  const plant = plants[plantIndex];
  if (plant.isArchived) {
    showToast('Cannot boost archived plants!', 'warning');
    return;
  }
  
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
    showToast(`🎉 ${plant.name} grew to ${getLevelName(newLevel)}!`, 'success');
  } else {
    playSound('water');
    showToast(`✨ +15 XP for ${plant.name}!`, 'success');
  }
  
  saveToLocalStorage();
  renderShelves();
  updateDrawerUI(plant);
}

// Set up UI triggers
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  renderShelves();
  updateDashboardStats();
  
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
  
  document.getElementById('journal-text-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitJournalLog();
    }
  });
  
  document.getElementById('confirm-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      closeConfirmModal();
    }
  });
  
  document.querySelector('.toast-close')?.addEventListener('click', closeToast);
  
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
window.archivePlant = archivePlant;
window.restorePlant = restorePlant;
window.deletePlantPermanent = deletePlantPermanent;
window.confirmDelete = confirmDelete;
window.confirmRestore = confirmRestore;
window.closeConfirmModal = closeConfirmModal;
window.executeConfirmedAction = executeConfirmedAction;
window.showToast = showToast;
window.closeToast = closeToast;