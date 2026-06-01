import { state, API_BASE_URL } from '../state.js';

window.switchTab = function(tab) {
  document.getElementById('tab-users').classList.remove('active');
  document.getElementById('tab-rooms').classList.remove('active');
  document.getElementById('view-users').style.display = 'none';
  document.getElementById('view-rooms').style.display = 'none';

  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`view-${tab}`).style.display = 'block';
};

async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('nexus_token');
  if (!token) {
    alert("Not logged in");
    window.location.href = 'admin-login.html';
    return null;
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });
    if (response.status === 403) {
      alert("Access Denied: You do not have admin privileges.");
      window.location.href = 'admin-login.html';
      return null;
    }
    return response.json();
  } catch (err) {
    console.error("Admin fetch error:", err);
    return null;
  }
}

async function loadAdminData() {
  const stats = await fetchWithAuth('/admin/stats');
  if (!stats) return;

  document.getElementById('stat-total-users').textContent = stats.totalUsers;
  document.getElementById('stat-total-rooms').textContent = stats.totalRooms;

  const users = await fetchWithAuth('/admin/users');
  renderUsers(users);

  const rooms = await fetchWithAuth('/admin/rooms');
  renderRooms(rooms);
}

function renderUsers(users) {
  const tbody = document.getElementById('users-table-body');
  if (!users || users.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center;">No users found.</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map(user => `
    <tr>
      <td>#${user.id}</td>
      <td style="font-size: 1.5rem;">${user.avatar}</td>
      <td style="font-weight: 600;">${user.username}</td>
      <td style="color: rgba(255,255,255,0.6);">${user.email}</td>
      <td>
        <span style="background: ${user.role === 'ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.1)'}; 
                     color: ${user.role === 'ADMIN' ? 'var(--color-primary)' : 'white'};
                     padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
          ${user.role}
        </span>
      </td>
      <td>${user.xp} XP (Lvl ${user.level})</td>
      <td>
        ${user.role !== 'ADMIN' ? `<button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>` : 'Admin'}
      </td>
    </tr>
  `).join('');
}

function renderRooms(rooms) {
  const tbody = document.getElementById('rooms-table-body');
  if (!rooms || rooms.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center;">No active rooms found.</td></tr>`;
    return;
  }

  tbody.innerHTML = rooms.map(room => `
    <tr>
      <td>#${room.id}</td>
      <td style="font-weight: 600;">${room.name}</td>
      <td style="color: var(--color-secondary);">${room.subject}</td>
      <td>${room.creatorUsername}</td>
      <td>${room.focusLevel}%</td>
      <td>
        <button class="delete-btn" onclick="deleteRoom(${room.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteUser = async function(id) {
  if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
    await fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' });
    loadAdminData();
  }
};

window.deleteRoom = async function(id) {
  if (confirm("Are you sure you want to delete this room? Everyone inside will be kicked out.")) {
    await fetchWithAuth(`/admin/rooms/${id}`, { method: 'DELETE' });
    loadAdminData();
  }
};

// Auto-load on script execution
if (localStorage.getItem('nexus_token')) {
  loadAdminData();
} else {
  alert("Please log in first.");
  window.location.href = 'admin-login.html';
}
