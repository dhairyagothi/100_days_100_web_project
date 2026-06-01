// Lobby & Dashboard UI Component Handler
import { state, BADGES, executeCreateRoom, executeJoinRoomByCode, joinRoom, fetchRooms } from '../state.js';

export function initLobbyComponent() {
  const btnOpenCreate = document.getElementById('btn-open-create-modal');
  const btnCloseCreate = document.getElementById('btn-close-modal');
  const modalCreate = document.getElementById('modal-create-room');
  const formCreateRoom = document.getElementById('form-create-room');
  const chkBackendMode = document.getElementById('chk-backend-mode');
  const modeStatusText = document.getElementById('mode-status-text');

  // Load initial toggle state
  chkBackendMode.checked = state.backendMode;
  updateModeStatusUI(state.backendMode);

  // Toggle backend mode
  chkBackendMode.addEventListener('change', async (e) => {
    const active = e.target.checked;
    state.backendMode = active;
    updateModeStatusUI(active);
    
    // Refresh rooms list
    await fetchRooms();
    renderRoomsList();
  });

  // Modal control
  btnOpenCreate.addEventListener('click', () => {
    modalCreate.classList.remove('hidden');
  });

  btnCloseCreate.addEventListener('click', () => {
    modalCreate.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modalCreate) {
      modalCreate.classList.add('hidden');
    }
  });

  // Create room submit
  formCreateRoom.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('room-name').value.trim();
    const category = document.getElementById('room-category').value;
    const description = document.getElementById('room-description').value.trim();
    const focusTime = parseInt(document.getElementById('room-focus-time').value) || 25;

    try {
      const room = await executeCreateRoom(name, category, description, focusTime);
      modalCreate.classList.add('hidden');
      formCreateRoom.reset();
      
      // Auto-join the created room
      joinRoom(room);
    } catch (err) {
      alert("Failed to launch study room: " + err.message);
    }
  });

  // Join Room Modal Logic
  const btnOpenJoin = document.getElementById('btn-open-join-modal');
  const btnCloseJoin = document.getElementById('btn-close-join-modal');
  const modalJoin = document.getElementById('modal-join-room');
  const formJoinRoom = document.getElementById('form-join-room');

  if (btnOpenJoin && btnCloseJoin && modalJoin && formJoinRoom) {
    btnOpenJoin.addEventListener('click', () => {
      modalJoin.classList.remove('hidden');
    });

    btnCloseJoin.addEventListener('click', () => {
      modalJoin.classList.add('hidden');
    });

    window.addEventListener('click', (e) => {
      if (e.target === modalJoin) {
        modalJoin.classList.add('hidden');
      }
    });

    formJoinRoom.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = document.getElementById('join-room-code').value.trim().toUpperCase();
      try {
        const room = await executeJoinRoomByCode(code);
        modalJoin.classList.add('hidden');
        formJoinRoom.reset();
        joinRoom(room);
      } catch (err) {
        alert("Failed to join study room: " + err.message);
      }
    });
  }
}

function updateModeStatusUI(isBackendActive) {
  const modeStatusText = document.getElementById('mode-status-text');
  if (!modeStatusText) return;

  if (isBackendActive) {
    modeStatusText.textContent = "Spring Boot Connected (Port 8080)";
    modeStatusText.className = "status-online";
  } else {
    modeStatusText.textContent = "LocalStorage Mode (Offline)";
    modeStatusText.className = "status-offline";
  }
}

// -------------------------------------------------------------
// RENDER LOBBY SCREENS & WIDGETS
// -------------------------------------------------------------
export function renderLobbyView() {
  const screenLobby = document.getElementById('screen-lobby');
  if (!screenLobby) return;

  if (state.user && !state.activeRoom) {
    screenLobby.classList.remove('hidden');
  } else {
    screenLobby.classList.add('hidden');
    return;
  }

  // 1. Render User Header Profile
  document.getElementById('lobby-username-span').textContent = state.user.username;
  
  // Rank calculations based on Level
  const rank = calculateRank(state.user.level);
  document.getElementById('lobby-rank-badge').textContent = rank;

  // Compute Total study hours (mock-added from total XP)
  const totalFocusMinutes = state.user.xp || 0;
  document.getElementById('lobby-total-hours').textContent = `${totalFocusMinutes}m`;

  // 2. Render Profile Stats Summary Card
  document.getElementById('stat-total-time').textContent = totalFocusMinutes;
  
  // Calculate completed Pomodoros (e.g. 1 session per 25 XP)
  const completedSessionsCount = Math.floor(totalFocusMinutes / 25);
  document.getElementById('stat-sessions-count').textContent = completedSessionsCount;

  const unlockedCount = state.user.badgesUnlocked?.length || 0;
  document.getElementById('stat-badges-count').textContent = `${unlockedCount} / ${BADGES.length}`;

  // 3. Render SVG Productivity Chart
  renderProductivityChart();

  // 4. Render Achievement Badges Grid
  renderBadgesGrid();

  // 5. Render active rooms list
  renderRoomsList();
}

function calculateRank(level) {
  if (level >= 10) return "Grandmaster Focus sage 🧙‍♂️";
  if (level >= 7) return "Zen Master Scholar 🧘";
  if (level >= 4) return "Elite Pomodoro Champion 🏆";
  if (level >= 2) return "Deep Work Prodigy ⚡";
  return "Deep Focus Cadet 🦉";
}

// Draw a beautiful glowing SVG charts programmatically
function renderProductivityChart() {
  const container = document.getElementById('lobby-chart-container');
  if (!container) return;

  // Let's create an SVG grid representation of study mins
  // Mock daily study records based on current user level and XP
  const baseMinutes = Math.min(60, state.user.xp || 15);
  const data = [
    { day: 'Mon', mins: Math.floor(baseMinutes * 0.4) },
    { day: 'Tue', mins: Math.floor(baseMinutes * 0.8) },
    { day: 'Wed', mins: Math.floor(baseMinutes * 0.5) },
    { day: 'Thu', mins: Math.floor(baseMinutes * 1.1) },
    { day: 'Fri', mins: Math.floor(baseMinutes * 0.7) },
    { day: 'Sat', mins: Math.floor(baseMinutes * 1.3) },
    { day: 'Sun', mins: Math.floor(baseMinutes * 0.9) }
  ];

  const svgWidth = 500;
  const svgHeight = 150;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Find max minutes to scale chart heights
  const maxVal = Math.max(...data.map(d => d.mins), 30);

  // Compute point coordinates
  const points = data.map((d, index) => {
    const x = paddingLeft + (index * (chartWidth / (data.length - 1)));
    const y = paddingTop + chartHeight - ((d.mins / maxVal) * chartHeight);
    return { x, y, day: d.day, val: d.mins };
  });

  const polylinePath = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaPath = `${points[0].x},${paddingTop + chartHeight} ` + 
                   polylinePath + 
                   ` ${points[points.length - 1].x},${paddingTop + chartHeight}`;

  let svgHtml = `
    <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" class="productivity-svg">
      <defs>
        <!-- Neon purple glow gradient for area overlay -->
        <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.0"/>
        </linearGradient>
        <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#a78bfa"/>
          <stop offset="50%" stop-color="#8b5cf6"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
        <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      <!-- Horizontal Grid Lines -->
      <line x1="${paddingLeft}" y1="${paddingTop}" x2="${svgWidth - paddingRight}" y2="${paddingTop}" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
      <line x1="${paddingLeft}" y1="${paddingTop + chartHeight/2}" x2="${svgWidth - paddingRight}" y2="${paddingTop + chartHeight/2}" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
      <line x1="${paddingLeft}" y1="${paddingTop + chartHeight}" x2="${svgWidth - paddingRight}" y2="${paddingTop + chartHeight}" stroke="rgba(255,255,255,0.15)" stroke-width="1" />

      <!-- Left Axis values -->
      <text x="${paddingLeft - 8}" y="${paddingTop + 4}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="end">${maxVal}m</text>
      <text x="${paddingLeft - 8}" y="${paddingTop + chartHeight/2 + 3}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="end">${Math.floor(maxVal/2)}m</text>
      <text x="${paddingLeft - 8}" y="${paddingTop + chartHeight + 3}" fill="rgba(255,255,255,0.4)" font-size="9" text-anchor="end">0</text>

      <!-- Gradient Area Under Curve -->
      <polygon points="${areaPath}" fill="url(#chart-area-grad)" />

      <!-- Glow path line -->
      <path d="M ${polylinePath}" fill="none" stroke="#8b5cf6" stroke-width="3" opacity="0.3" filter="url(#neon-glow)" />
      
      <!-- Primary Vector line -->
      <path d="M ${polylinePath}" fill="none" stroke="url(#chart-line-grad)" stroke-width="2.5" stroke-linecap="round" />

      <!-- Point Circles and Day Text -->
  `;

  points.forEach(p => {
    svgHtml += `
      <!-- Intersect circles -->
      <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#13111C" stroke="#a78bfa" stroke-width="2" />
      <!-- Tooltip values -->
      <text x="${p.x}" y="${p.y - 8}" fill="#06b6d4" font-size="8" font-weight="600" text-anchor="middle" opacity="0.9">${p.val}m</text>
      <!-- X-Axis text -->
      <text x="${p.x}" y="${svgHeight - 8}" fill="rgba(255,255,255,0.5)" font-size="9" text-anchor="middle">${p.day}</text>
    `;
  });

  svgHtml += `</svg>`;
  container.innerHTML = svgHtml;
}

function renderBadgesGrid() {
  const grid = document.getElementById('lobby-badges-grid');
  if (!grid) return;

  try {
    const unlockedSet = new Set(state.user.badgesUnlocked || []);

    grid.innerHTML = BADGES.map(badge => {
      const isUnlocked = unlockedSet.has(badge.id);
      if (isUnlocked) {
        return `
          <div class="badge-card-container unlocked">
            <div class="badge-card-flat glass">
              <div class="badge-neon-circle">
                <span class="badge-icon-3d">${badge.icon}</span>
              </div>
              <h4 class="badge-title-flat">${badge.name}</h4>
              <p class="badge-desc-flat">${badge.desc}</p>
              <div class="badge-divider-flat"></div>
              <span class="badge-criteria-flat unlocked-text">&#x2713; Unlocked</span>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="badge-card-container locked">
            <div class="badge-card-flat glass">
              <div class="badge-neon-circle">
                <span class="badge-icon-3d">${badge.icon}</span>
                <span class="badge-lock-overlay">🔒</span>
              </div>
              <h4 class="badge-title-flat">${badge.name}</h4>
              <span class="badge-criteria-flat">Requires: ${badge.requirement}</span>
            </div>
          </div>
        `;
      }
    }).join('');
  } catch (err) {
    grid.innerHTML = `<div style="color:red; background:#222; padding:20px; font-size:16px;">Error in renderBadgesGrid: ${err.message}<br>${err.stack}</div>`;
    console.error(err);
  }
}

export function renderRoomsList() {
  const container = document.getElementById('rooms-list-container');
  if (!container) return;

  if (state.rooms.length === 0) {
    container.innerHTML = `
      <div class="no-rooms-card glass">
        <p>No active study rooms found. Be the first to launch one!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.rooms.map(room => {
    return `
      <div class="room-card glass border-glow">
        <div class="room-card-header">
          <span class="room-category-tag">${room.category}</span>
          <span class="room-creator-tag">By ${room.creator || 'Guest'}</span>
        </div>
        <h3>${room.name}</h3>
        <p class="room-desc">${room.description || 'No description provided.'}</p>
        <div class="room-stats-row">
          <span class="room-stat">⏱ ${room.focusTime} mins</span>
          <button class="btn btn-primary btn-join-room" data-room-id="${room.id}">Join Table</button>
        </div>
      </div>
    `;
  }).join('');

  // Attach join click listeners
  container.querySelectorAll('.btn-join-room').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roomId = parseInt(e.target.getAttribute('data-room-id'));
      const room = state.rooms.find(r => r.id === roomId);
      if (room) {
        joinRoom(room);
      }
    });
  });
}
