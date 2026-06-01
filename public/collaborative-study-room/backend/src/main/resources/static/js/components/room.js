// Room View & Workspace Layout Controller
import { state, leaveRoom } from '../state.js';

export function initRoomComponent() {
  const btnLeave = document.getElementById('btn-leave-room');
  const btnDistractionFree = document.getElementById('btn-toggle-distraction-free');
  const btnInvite = document.getElementById('btn-invite-link');
  const workspaceTabs = document.querySelectorAll('.workspace-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // Leave room event
  btnLeave.addEventListener('click', () => {
    leaveRoom();
  });

  // Distraction-Free Mode Toggle
  btnDistractionFree.addEventListener('click', () => {
    const mainContainer = document.getElementById('room-workspace-grid');
    const dfText = document.getElementById('df-text');
    const dfIcon = document.getElementById('df-icon');
    
    if (mainContainer.classList.contains('distraction-free')) {
      mainContainer.classList.remove('distraction-free');
      dfText.textContent = "Distraction-Free";
      dfIcon.textContent = "👁";
      btnDistractionFree.classList.remove('active');
    } else {
      mainContainer.classList.add('distraction-free');
      dfText.textContent = "Show Sidebar";
      dfIcon.textContent = "👁‍🗨";
      btnDistractionFree.classList.add('active');
    }
  });

  // Copy Room Invite Link / Code
  btnInvite.addEventListener('click', async () => {
    if (!state.activeRoom) return;
    
    const inviteCode = state.activeRoom.roomCode || `NEXUS-ROOM-${state.activeRoom.id}`;

    try {
      await navigator.clipboard.writeText(inviteCode);
      const originalText = btnInvite.innerHTML;
      btnInvite.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
        <span>Copied Code!</span>
      `;
      btnInvite.classList.add('copied');
      
      setTimeout(() => {
        btnInvite.innerHTML = originalText;
        btnInvite.classList.remove('copied');
      }, 2000);
    } catch (err) {
      alert("Invite Code: " + inviteCode);
    }
  });

  // Tab Switcher Router
  workspaceTabs.forEach(tabButton => {
    tabButton.addEventListener('click', () => {
      const targetTab = tabButton.getAttribute('data-tab');

      // Update active states on tab buttons
      workspaceTabs.forEach(btn => btn.classList.remove('active'));
      tabButton.classList.add('active');

      // Update active states on panels
      tabContents.forEach(panel => {
        if (panel.id === `tab-${targetTab}`) {
          panel.classList.remove('hidden');
          panel.classList.add('active');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('active');
        }
      });

      // Special resize hook for canvas if whiteboard or soundscape is selected
      if (targetTab === 'whiteboard') {
        window.dispatchEvent(new CustomEvent('whiteboard-tab-active'));
      }
      if (targetTab === 'soundscape') {
        window.dispatchEvent(new CustomEvent('soundscape-tab-active'));
      }
    });
  });
}

// Reactively draw room details when room state updates
export function renderRoomView() {
  const screenRoom = document.getElementById('screen-room');
  if (!screenRoom) return;

  if (state.activeRoom) {
    screenRoom.classList.remove('hidden');
    
    // Update labels
    document.getElementById('room-display-name').textContent = state.activeRoom.name;
    document.getElementById('room-display-category').textContent = state.activeRoom.category;
    document.getElementById('room-display-code').textContent = `Code: ${state.activeRoom.roomCode || 'N/A'}`;

    // Load active room members
    renderMembersList();
  } else {
    screenRoom.classList.add('hidden');
  }
}

export function renderMembersList() {
  const listContainer = document.getElementById('room-members-list');
  const countBadge = document.getElementById('active-members-count');
  if (!listContainer || !state.activeRoom) return;

  const count = state.activeMembers.length;
  countBadge.textContent = `${count} Active`;

  listContainer.innerHTML = state.activeMembers.map(member => {
    const isMe = member.username === state.user.username;
    return `
      <div class="member-tag glass ${isMe ? 'self-member border-glow' : ''}">
        <span class="member-avatar">${member.avatar}</span>
        <span class="member-name">${member.username} ${isMe ? '(You)' : ''}</span>
        <span class="member-status-dot online"></span>
      </div>
    `;
  }).join('');
}
