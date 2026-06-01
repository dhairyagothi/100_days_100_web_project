// Nexus Web Application Main Orchestrator
import { state, subscribeState, fetchRooms, executeSaveNotepad, loadEnvVariables, BADGES } from './state.js';
import { initBackground3D } from './services/background3d.js';
import { playSound, stopSound, adjustVolume, isSoundPlaying, getAnalyserData } from './services/audio.js';
import { startCompanionSimulator, stopCompanionSimulator } from './services/bots.js';

// Import UI components
import { initAuthComponent, renderAuthView } from './components/auth.js';
import { initLobbyComponent, renderLobbyView } from './components/lobby.js';
import { initRoomComponent, renderRoomView } from './components/room.js';
import { initTimerComponent, renderTimerView } from './components/timer.js';
import { initChatComponent, renderChatView } from './components/chat.js';
import { initTasksComponent, renderTasksView } from './components/tasks.js';
import { initWhiteboardComponent } from './components/whiteboard.js';
import { initFlashcardsComponent, renderFlashcardsView } from './components/flashcards.js';

// DOM elements
const appShell = document.getElementById('app');
const bootLoader = document.getElementById('boot-loader');
const headerUserPanel = document.getElementById('header-user-panel');
const profileTrigger = document.getElementById('header-profile-trigger');
const profileDropdown = document.getElementById('profile-dropdown-card');
const btnDropdownLogout = document.getElementById('btn-dropdown-logout');
const notepadTextarea = document.getElementById('notepad-textarea');
const notepadCharCount = document.getElementById('notepad-char-count');

// Visualizer elements
const visualizerCanvas = document.getElementById('soundscape-visualizer');
let visualizerCtx = null;
let visualizerAnimationId = null;

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Start 3D Constellations Particle Background
  initBackground3D();

  // 2. Initialize UI components event bindings
  initAuthComponent();
  initLobbyComponent();
  initRoomComponent();
  initTimerComponent();
  initChatComponent();
  initTasksComponent();
  initWhiteboardComponent();
  initFlashcardsComponent();

  // 3. Collaborative Notepad input listener
  notepadTextarea.addEventListener('input', (e) => {
    if (!state.activeRoom) return;
    const text = e.target.value;
    notepadCharCount.textContent = `${text.length} chars`;
    executeSaveNotepad(state.activeRoom.id, text);
  });

  // Sync update from other tabs
  window.addEventListener('notepad-sync-update', (e) => {
    notepadTextarea.value = e.detail;
    notepadCharCount.textContent = `${e.detail.length} chars`;
  });

  // 4. Ambient Focus Sound Card buttons and sliders
  initSoundscapeControls();

  // 5. Profile Dropdown Trigger Toggle
  profileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('hidden');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (profileDropdown && !profileDropdown.classList.contains('hidden') && !profileDropdown.contains(e.target) && !profileTrigger.contains(e.target)) {
      profileDropdown.classList.add('hidden');
    }
  });

  // Global Logout event (inside dropdown)
  btnDropdownLogout.addEventListener('click', () => {
    // Hide dropdown
    profileDropdown.classList.add('hidden');
    // Stop all audio playing
    const activePlayButtons = document.querySelectorAll('.btn-play-sound');
    activePlayButtons.forEach(btn => {
      btn.textContent = "Play";
      btn.classList.remove('active');
    });
    // Call custom logout
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_jwt_token');
    state.user = null;
    state.activeRoom = null;
    stopCompanionSimulator();
  });

  // Landing Page CTA clicks
  document.getElementById('btn-hero-launch').addEventListener('click', () => {
    navigateTo('auth');
  });
  document.getElementById('btn-nav-login').addEventListener('click', () => {
    navigateTo('auth');
  });
  document.getElementById('auth-back-to-home').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('landing');
  });
  document.getElementById('header-logo-btn').addEventListener('click', () => {
    if (state.user) {
      if (!state.activeRoom) {
        navigateTo('lobby');
      }
    } else {
      navigateTo('landing');
    }
  });

  // Contact form submission handler
  const contactForm = document.getElementById('form-landing-contact');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      alert(`Thank you, ${name}! Your message has been received. Our team will reach out to you shortly.`);
      contactForm.reset();
    });
  }

  // 6. Reactive state subscriber
  subscribeState((prop, value) => {
    // Route page view depends on auth & room selections
    if (prop === 'user') {
      renderHeaderUserPanel();
      if (state.user) {
        navigateTo('lobby');
      } else {
        navigateTo('landing');
      }
      renderLobbyView();
    }
    else if (prop === 'activeRoom') {
      renderRoomView();
      renderLobbyView();
      
      if (value) {
        // Just entered room
        navigateTo('room');
        startCompanionSimulator();
        renderTimerView();
        renderChatView();
        renderTasksView();
        renderFlashcardsView();
        
        // Setup initial notepad content
        notepadTextarea.value = state.notepad[value.id] || '';
        notepadCharCount.textContent = `${notepadTextarea.value.length} chars`;
      } else {
        // Left room
        navigateTo('lobby');
        stopCompanionSimulator();
      }
    }
    else if (prop === 'timer') {
      renderTimerView();
    }
    else if (prop === 'chat') {
      renderChatView();
    }
    else if (prop === 'tasks') {
      renderTasksView();
    }
    else if (prop === 'flashcards') {
      renderFlashcardsView();
    }
  });

  // 7. Complete loading boot sequence
  await initialPageBoot();
});

// Navigation routing function to show/hide views cleanly
export function navigateTo(screenName) {
  const landing = document.getElementById('screen-landing');
  const auth = document.getElementById('screen-auth');
  const lobby = document.getElementById('screen-lobby');
  const room = document.getElementById('screen-room');
  const headerPublicNav = document.getElementById('header-public-nav');

  // Hide all screens
  if (landing) landing.classList.add('hidden');
  if (auth) auth.classList.add('hidden');
  if (lobby) lobby.classList.add('hidden');
  if (room) room.classList.add('hidden');

  if (state.user) {
    // Logged in: Hide public navigation, show user stats/dropdown
    if (headerPublicNav) headerPublicNav.style.display = 'none';
    if (headerUserPanel) headerUserPanel.classList.remove('hidden');

    if (state.activeRoom) {
      if (room) room.classList.remove('hidden');
    } else {
      if (lobby) lobby.classList.remove('hidden');
    }
  } else {
    // Anonymous: Show public navigation, hide user stats/dropdown
    if (headerPublicNav) headerPublicNav.style.display = 'flex';
    if (headerUserPanel) headerUserPanel.classList.add('hidden');

    if (screenName === 'auth') {
      if (auth) auth.classList.remove('hidden');
    } else {
      if (landing) landing.classList.remove('hidden');
    }
  }
}

// Render user profile details in header and dropdown
function renderHeaderUserPanel() {
  if (state.user) {
    headerUserPanel.classList.remove('hidden');
    
    // Header Bar info
    document.getElementById('header-username').textContent = state.user.username;
    document.getElementById('header-avatar').textContent = state.user.avatar;
    document.getElementById('header-xp-value').textContent = state.user.xp || 0;
    
    // Level Badge
    const lvl = state.user.level || 1;
    document.getElementById('header-level-badge').textContent = `Lvl ${lvl}`;

    // Populates floating Profile Dropdown Card
    document.getElementById('dropdown-username').textContent = state.user.username;
    document.getElementById('dropdown-email').textContent = state.user.email || 'offline@nexus.com';
    document.getElementById('dropdown-user-avatar').textContent = state.user.avatar;

    // Dynamic XP Level progress calculation (100 XP per level)
    const xp = state.user.xp || 0;
    const xpProgress = xp % 100;
    document.getElementById('dropdown-level-text').textContent = `Level ${lvl}`;
    document.getElementById('dropdown-xp-progress-text').textContent = `${xpProgress} / 100 XP`;
    const progressFill = document.getElementById('dropdown-level-progress-fill');
    if (progressFill) {
      progressFill.style.width = `${xpProgress}%`;
    }

    // Study Rank Name and Stars rating mapping
    let rankName = "Deep Focus Cadet";
    let stars = "⭐";
    if (lvl >= 5) {
      rankName = "Zen Focus Sage";
      stars = "⭐⭐⭐⭐⭐";
    } else if (lvl >= 4) {
      rankName = "Deep Focus Master";
      stars = "⭐⭐⭐⭐";
    } else if (lvl >= 3) {
      rankName = "Elite Scholar";
      stars = "⭐⭐⭐";
    } else if (lvl >= 2) {
      rankName = "Prodigy Scholar";
      stars = "⭐⭐";
    }
    
    document.getElementById('dropdown-rank-name').textContent = rankName;
    document.getElementById('dropdown-stars').textContent = stars;

    // Unlocked Badges list in dropdown
    const unlockedList = state.user.badgesUnlocked || [];
    const badgesListContainer = document.getElementById('dropdown-badges-list');
    
    if (unlockedList.length === 0) {
      badgesListContainer.innerHTML = `<span style="font-size: 0.7rem; color: var(--text-secondary); grid-column: span 6;">No badges unlocked</span>`;
    } else {
      badgesListContainer.innerHTML = unlockedList.map(badgeId => {
        const badge = BADGES.find(b => b.id === badgeId);
        if (!badge) return '';
        return `<div class="dropdown-badge-item" title="${badge.name}: ${badge.desc}">${badge.icon}</div>`;
      }).join('');
    }
  } else {
    headerUserPanel.classList.add('hidden');
    // Ensure dropdown card is hidden if no user
    const profileDropdown = document.getElementById('profile-dropdown-card');
    if (profileDropdown) {
      profileDropdown.classList.add('hidden');
    }
  }
}

// Initial sequence loading rooms and checking routes
async function initialPageBoot() {
  try {
    // Load environment variables first
    await loadEnvVariables();

    // Load initial active rooms from DB
    await fetchRooms();

    // Check URL query parameters for invite code: ?invite=NEXUS-ROOM-X
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get('invite');

    // Simulate small latency to show clean initiating focus space loader
    setTimeout(() => {
      bootLoader.classList.add('hidden');
      appShell.classList.remove('hidden');
      
      // Initialize view
      renderHeaderUserPanel();
      if (state.user) {
        if (state.activeRoom) {
          navigateTo('room');
        } else {
          navigateTo('lobby');
        }
      } else {
        navigateTo('landing');
      }

      if (inviteCode && state.user) {
        const roomId = parseInt(inviteCode.replace('NEXUS-ROOM-', ''));
        const matched = state.rooms.find(r => r.id === roomId);
        if (matched) {
          joinRoom(matched);
        }
      }
    }, 1500);

  } catch(e) {
    console.error("Boot error: ", e);
    bootLoader.querySelector('h2').textContent = "Connection Failure";
    bootLoader.querySelector('p').textContent = "Backend offline. Reconnecting...";
  }
}

// -------------------------------------------------------------
// SOUNDSCAPE UI CONTROLS & VISUALIZER
// -------------------------------------------------------------
function initSoundscapeControls() {
  const cards = document.querySelectorAll('.sound-card');
  
  if (visualizerCanvas) {
    visualizerCtx = visualizerCanvas.getContext('2d');
  }

  cards.forEach(card => {
    const soundId = card.getAttribute('data-sound');
    const playBtn = card.querySelector('.btn-play-sound');
    const volumeSlider = card.querySelector('.sound-vol');

    playBtn.addEventListener('click', () => {
      const playing = isSoundPlaying(soundId);
      
      if (playing) {
        stopSound(soundId);
        playBtn.textContent = "Play";
        playBtn.classList.remove('active');
        card.classList.remove('playing');
      } else {
        const vol = parseFloat(volumeSlider.value);
        playSound(soundId, vol);
        playBtn.textContent = "Mute";
        playBtn.classList.add('active');
        card.classList.add('playing');
        
        // Start Canvas drawing loop
        startSoundscapeVisualizer();
      }
    });

    volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      adjustVolume(soundId, vol);
    });
  });

  // Start checking visualizer changes when tab switches
  window.addEventListener('soundscape-tab-active', () => {
    startSoundscapeVisualizer();
  });
}

function startSoundscapeVisualizer() {
  if (visualizerAnimationId) return;

  function draw() {
    visualizerAnimationId = requestAnimationFrame(draw);

    const data = getAnalyserData();
    if (!data) return;

    const width = visualizerCanvas.width;
    const height = visualizerCanvas.height;
    
    visualizerCtx.clearRect(0, 0, width, height);

    // Subtle background
    visualizerCtx.fillStyle = 'rgba(19, 17, 28, 0.2)';
    visualizerCtx.fillRect(0, 0, width, height);

    const barWidth = (width / data.length) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      barHeight = (data[i] / 255) * height * 0.9;

      // Purple/Cyan spectrum gradient bars
      const grad = visualizerCtx.createLinearGradient(0, height, 0, height - barHeight);
      grad.addColorStop(0, '#8b5cf6'); // Purple
      grad.addColorStop(1, '#06b6d4'); // Cyan

      visualizerCtx.fillStyle = grad;
      visualizerCtx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

      x += barWidth;
    }
  }

  draw();
}
