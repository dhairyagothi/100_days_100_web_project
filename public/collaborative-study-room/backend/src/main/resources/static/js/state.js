// Nexus Reactive State, Sync Channel, and Full-Stack API Gateway
import { stopAllSounds } from './services/audio.js';

const CHANNEL_NAME = 'nexus-study-room-channel';
export let API_BASE_URL = '/api';

// CONFIGURATION: Enter your Google Client ID here from Google Cloud Console
export let GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';


// Default list of achievement badges
export const BADGES = [
  { id: 'first_step', name: 'First Step', desc: 'Join or create your first study room', icon: '🎯', requirement: 'Join a room' },
  { id: 'pomodoro_complete', name: 'Deep Focus', desc: 'Complete your first Pomodoro focus session', icon: '⏱', requirement: 'Focus session' },
  { id: 'social_butterfly', name: 'Social Scholar', desc: 'Send 5 or more messages in room chat', icon: '💬', requirement: '5 messages' },
  { id: 'doodler', name: 'Creative Thinker', desc: 'Draw something on the shared whiteboard', icon: '🎨', requirement: 'Draw on whiteboard' },
  { id: 'quiz_scholar', name: 'Memory Wizard', desc: 'Create and flip revision flashcards', icon: '🧙', requirement: 'Flip flashcard' },
  { id: 'task_slayer', name: 'Goal Achiever', desc: 'Check off a task in the session checklist', icon: '✓', requirement: 'Check off task' },
  { id: 'deep_focus_legend', name: 'Focus Legend', desc: 'Study for 60 minutes or more in total', icon: '🏆', requirement: '60 minutes total' },
  { id: 'zen_practitioner', name: 'Zen Master', desc: 'Complete a guided box breathing break', icon: '🧘', requirement: 'Breathing break' },
  { id: 'night_owl', name: 'Midnight Scholar', desc: 'Study during late hours', icon: '🦉', requirement: 'Late session' }
];

// Initial state object
const rawState = {
  user: null, // { username, email, avatar, xp, level, badgesUnlocked: [] }
  activeRoom: null, // Current active room object
  rooms: [], // Active study rooms in the lobby
  timer: {
    mode: 'focus', // 'focus' | 'break' | 'stopwatch'
    duration: 1500, // Duration in seconds (25 minutes)
    timeRemaining: 1500,
    isRunning: false,
    startTimestamp: null,
    pausedRemaining: null
  },
  chat: {}, // roomId -> Array of messages
  tasks: {}, // roomId -> Array of tasks
  flashcards: {}, // roomId -> Array of flashcards
  currentFlashcardIndex: 0,
  activeMembers: [], // Users currently in the active room
  notepad: {}, // roomId -> Notes content
  
  // Dual Execution Mode
  backendMode: true, // Set to true to route auth/rooms/tasks/notes/AI through Spring Boot Java JWT Server
  
  // Application Configurations loaded from .env
  config: {
    googleClientId: '',
    apiBaseUrl: '/api'
  }
};

// Listeners subscribed to state updates
const stateListeners = [];

// BroadcastChannel for real-time multi-tab syncing
let syncChannel = null;

// Initialize state from LocalStorage
function initPersistedState() {
  const savedUser = localStorage.getItem('nexus_user');
  if (savedUser) {
    rawState.user = JSON.parse(savedUser);
  }

  // Load custom backendMode flag if set
  const savedMode = localStorage.getItem('nexus_backend_mode');
  if (savedMode) {
    rawState.backendMode = savedMode === 'true';
  }

  // Load rooms
  const savedRooms = localStorage.getItem('nexus_rooms');
  if (savedRooms) {
    rawState.rooms = JSON.parse(savedRooms);
  } else {
    // Starting default list
    rawState.rooms = [
      { id: 1, name: '🏛 Cozy Campus Library', category: 'General', description: 'Quiet room for focused study. Pomodoro mode active.', focusTime: 25, creator: 'Nexus' },
      { id: 2, name: '💻 Algorithms & Caffeine', category: 'Computer Science', description: 'Reviewing LeetCode patterns and system design.', focusTime: 45, creator: 'Nexus' },
      { id: 3, name: '📐 Advanced Calculus Lab', category: 'Mathematics', description: 'Studying Fourier transforms. Flashcards enabled.', focusTime: 50, creator: 'Nexus' }
    ];
    localStorage.setItem('nexus_rooms', JSON.stringify(rawState.rooms));
  }
}

initPersistedState();

// Parse and load environment variables from local .env
export async function loadEnvVariables() {
  try {
    const res = await fetch('/.env');
    if (res.ok) {
      const text = await res.text();
      const env = {};
      text.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const parts = trimmed.split('=');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
            env[key] = val;
          }
        }
      });
      
      if (env.GOOGLE_CLIENT_ID) {
        GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
        state.config.googleClientId = env.GOOGLE_CLIENT_ID;
      }
      if (env.API_BASE_URL) {
        API_BASE_URL = env.API_BASE_URL;
        state.config.apiBaseUrl = env.API_BASE_URL;
      }
    }
  } catch(e) {
    console.warn("Could not parse .env file, utilizing defaults.", e);
  }
}

// Save state helpers
export function saveUserState() {
  if (rawState.user) {
    localStorage.setItem('nexus_user', JSON.stringify(rawState.user));
  }
}

export function saveRoomsState() {
  localStorage.setItem('nexus_rooms', JSON.stringify(rawState.rooms));
}

// State Proxy
export const state = new Proxy(rawState, {
  set(target, prop, value) {
    target[prop] = value;
    
    if (prop === 'user') {
      saveUserState();
    }
    if (prop === 'rooms') {
      saveRoomsState();
    }
    if (prop === 'backendMode') {
      localStorage.setItem('nexus_backend_mode', value.toString());
    }

    stateListeners.forEach(listener => listener(prop, value));
    return true;
  }
});

// Subscribe to state changes
export function subscribeState(callback) {
  stateListeners.push(callback);
}

// -------------------------------------------------------------
// JWT API FETCH HELPERS
// -------------------------------------------------------------
function getHeaders() {
  const token = localStorage.getItem('nexus_jwt_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -------------------------------------------------------------
// CLOUD AUTHENTICATION (SUPABASE & JAVA BACKEND)
// -------------------------------------------------------------

// Supabase Configuration Placeholders (Fully wired client)
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-placeholder';
let supabase = null;

if (window.supabase) {
  // Safe instantiation in case script CDN is loaded
  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch(e) {
    console.warn("Supabase failed to initialize with placeholder keys.");
  }
}

export async function loginWithGoogleOAuth() {
  // Check if Google GSI Client SDK is loaded
  if (typeof google === 'undefined' || !google.accounts) {
    emulateGoogleLogin();
    return;
  }

  // Check for stored Client ID or config, or ask the user
  let clientId = GOOGLE_CLIENT_ID;
  if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    clientId = localStorage.getItem('nexus_google_client_id');
  }

  if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
    const input = prompt(
      "🔗 Configure Google Login:\n\n" +
      "Enter your Google OAuth 2.0 Client ID (from Google Cloud Console).\n" +
      "If you don't have a Client ID or want to review the login flow instantly, click Cancel to emulate Google Auth.",
      ""
    );
    if (input === null || input.trim() === "") {
      emulateGoogleLogin();
      return;
    }
    clientId = input.trim();
    localStorage.setItem('nexus_google_client_id', clientId);
  }

  try {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'email profile openid',
      callback: async (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          // Retrieve profile details using Google UserInfo endpoint
          const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`);
          if (res.ok) {
            const googleUser = await res.json();
            
            // Log in User in local reactive state
            state.user = {
              username: googleUser.name || googleUser.given_name || 'Google Scholar',
              email: googleUser.email,
              avatar: '🤖',
              xp: 25,
              level: 1,
              badgesUnlocked: ['first_step']
            };

            // Sync credentials with Spring Boot if Backend Mode is enabled
            if (state.backendMode) {
              try {
                await executeAuthSignup(state.user.username, state.user.email, "google-oauth-password-bypass", state.user.avatar);
              } catch(e) {
                // User already registered on backend, ignore
              }
              try {
                await executeAuthLogin(state.user.email, "google-oauth-password-bypass");
              } catch(e) {
                console.error("Backend OAuth sync error:", e);
              }
            }

            alert(`Google Sign-In Successful!\nLogged in as ${state.user.username}`);
          } else {
            emulateGoogleLogin();
          }
        }
      }
    });
    client.requestAccessToken();
  } catch (err) {
    console.error("Google GSI login error:", err);
    emulateGoogleLogin();
  }
}

function emulateGoogleLogin() {
  const randomName = "Dr. Emma Google";
  const randomEmail = "emma.google@gmail.com";
  
  state.user = {
    username: randomName,
    email: randomEmail,
    avatar: '🦉',
    xp: 35,
    level: 1,
    badgesUnlocked: ['first_step']
  };

  if (state.backendMode) {
    executeAuthSignup(randomName, randomEmail, "google-oauth-password-bypass", '🦉')
      .then(() => executeAuthLogin(randomEmail, "google-oauth-password-bypass"))
      .catch(() => {
        executeAuthLogin(randomEmail, "google-oauth-password-bypass").catch(console.error);
      });
  }

  alert("🔗 Emulated Google Authentication Success!\nLogged in as: " + randomName + " (" + randomEmail + ")");
}

export async function executeAuthSignup(username, email, password, avatar) {
  if (state.backendMode) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, avatar })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Signup failed');
      }
      return true;
    } catch(e) {
      console.error("Backend signup error:", e);
      throw e;
    }
  } else {
    // Local emulation database
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
    if (users.some(u => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = { username, email, password, avatar, xp: 0, level: 1, badgesUnlocked: ['first_step'] };
    users.push(newUser);
    localStorage.setItem('nexus_registered_users', JSON.stringify(users));
    return true;
  }
}

export async function executeAuthLogin(email, password) {
  if (state.backendMode) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Authentication failed');
      }
      const data = await response.json();
      localStorage.setItem('nexus_jwt_token', data.token);
      
      state.user = {
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        xp: data.xp,
        level: data.level,
        badgesUnlocked: data.badgesUnlocked || []
      };
      return true;
    } catch(e) {
      console.error("Backend login error:", e);
      throw e;
    }
  } else {
    // Local DB login check
    const users = JSON.parse(localStorage.getItem('nexus_registered_users') || '[]');
    const matched = users.find(u => u.email === email);
    if (!matched || matched.password !== password) {
      throw new Error("Invalid Email or Password!");
    }
    state.user = {
      username: matched.username,
      email: matched.email,
      avatar: matched.avatar,
      xp: matched.xp || 0,
      level: matched.level || 1,
      badgesUnlocked: matched.badgesUnlocked || ['first_step']
    };
    return true;
  }
}

// -------------------------------------------------------------
// ROOMS DATA OPERATIONS
// -------------------------------------------------------------
export async function fetchRooms() {
  if (state.backendMode) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms`, { headers: getHeaders() });
      if (res.ok) {
        state.rooms = await res.json();
      }
    } catch(e) {
      console.error("Failed to load rooms from Spring Boot backend:", e);
    }
  } else {
    // load from localStorage
    state.rooms = JSON.parse(localStorage.getItem('nexus_rooms') || '[]');
  }
}

export async function executeCreateRoom(name, category, description, focusTime) {
  if (state.backendMode) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name: `✨ ${name}`, category, description, focusTime })
      });
      if (res.ok) {
        const newRoom = await res.json();
        state.rooms = [...state.rooms, newRoom];
        return newRoom;
      }
    } catch(e) {
      console.error("Failed to create room on backend:", e);
    }
  }
  
  // Local emulation fallback
  const localRoom = {
    id: Date.now(),
    name: `✨ ${name}`,
    category,
    description,
    focusTime,
    creator: state.user.username,
    roomCode: Math.random().toString(36).substring(2, 8).toUpperCase()
  };
  state.rooms = [...state.rooms, localRoom];
  return localRoom;
}

export async function executeJoinRoomByCode(code) {
  if (state.backendMode) {
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/code/${code}`, { headers: getHeaders() });
      if (res.ok) {
        const room = await res.json();
        return room;
      } else {
        throw new Error('Room not found with that code.');
      }
    } catch(e) {
      console.error("Failed to join room by code on backend:", e);
      throw e;
    }
  }

  // Local emulation fallback
  const room = state.rooms.find(r => r.roomCode === code);
  if (room) {
    return room;
  }
  throw new Error('Room not found with that code.');
}

// -------------------------------------------------------------
// SYNCED NOTEPAD OPERATIONS
// -------------------------------------------------------------
export async function fetchRoomNotepad(roomId) {
  if (state.backendMode) {
    try {
      const res = await fetch(`${API_BASE_URL}/notes/${roomId}`, { headers: getHeaders() });
      if (res.ok) {
        const note = await res.json();
        state.notepad[roomId] = note.content || '';
        state.notepad = { ...state.notepad };
      }
    } catch(e) {
      console.error("Notepad load error:", e);
    }
  } else {
    if (!state.notepad[roomId]) {
      state.notepad[roomId] = 'Welcome to your synced study notepad! Write group summaries or draft code together here...';
    }
  }
}

export async function executeSaveNotepad(roomId, text) {
  rawState.notepad[roomId] = text; // local save
  broadcastEvent('NOTEPAD_UPDATE', text);

  if (state.backendMode) {
    try {
      await fetch(`${API_BASE_URL}/notes/${roomId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content: text })
      });
    } catch(e) {
      console.error("Notepad save error:", e);
    }
  }
}

// -------------------------------------------------------------
// JAYPEE MEDICAL STUDY AI SERVICE CALL
// -------------------------------------------------------------
export async function askMedicalAiChatbot(promptText) {
  if (state.backendMode) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch(e) {
      console.error("AI service fetch error:", e);
    }
  }

  // Emulation fallback matching Java AiService logic
  return new Promise((resolve) => {
    setTimeout(() => {
      const query = promptText.toLowerCase();
      let replyText;
      const flashcardsList = [];

      if (query.contains("flashcard") || query.contains("quiz")) {
        if (query.contains("heart") || query.contains("cardio") || query.contains("anatomy")) {
          replyText = "🩺 **Jaypee Study AI**: I have generated 3 cardiac anatomy flashcards for your revision deck!";
          flashcardsList.push({ front: "What are the four chambers of the human heart?", back: "Right atrium, right ventricle, left atrium, and left ventricle." });
          flashcardsList.push({ front: "Which blood vessel carries oxygenated blood from the lungs to the heart?", back: "The pulmonary vein." });
          flashcardsList.push({ front: "What is the primary pacemaker of the heart?", back: "The Sinoatrial (SA) Node." });
        } else {
          replyText = "🩺 **Jaypee Study AI**: Here are 3 general medical physiology flashcards for your deck!";
          flashcardsList.push({ front: "What is the normal resting heart rate range for adults?", back: "60 to 100 beats per minute (bpm)." });
          flashcardsList.push({ front: "Which organ produces insulin to regulate blood sugar?", back: "The pancreas." });
          flashcardsList.push({ front: "What is the main functional unit of the human kidney?", back: "The nephron." });
        }
      } 
      else if (query.contains("heart") || query.contains("cardio")) {
        replyText = "❤️ **Cardiovascular System Summary:**\n" +
                "The human cardiovascular system consists of the heart and blood vessels. " +
                "The heart acts as a double pump: the right side pumps deoxygenated blood to the lungs (pulmonary circulation), " +
                "and the left side pumps oxygenated blood to the body (systemic circulation).\n" +
                "💡 *Study Tip: You can type 'generate anatomy flashcards about the heart' to add cards to your revision deck!*";
      } 
      else {
        replyText = "👋 Hello! I am the **Jaypee Medical Study AI** assistant.\n" +
                "I can help you review concepts in anatomy, physiology, and pharmacology. Try asking:\n" +
                "• *'Explain the anatomy of the heart'*\n" +
                "• *'Generate flashcards about skeletal bones'*";
      }

      resolve({ reply: replyText, flashcards: flashcardsList });
    }, 800);
  });
}

// Polyfill in case String.contains doesn't map to String.includes
if (!String.prototype.contains) {
  String.prototype.contains = function(str) {
    return this.includes(str);
  };
}

// -------------------------------------------------------------
// GAMIFICATION ENGINE: XP & LEVEL UP & BADGES
// -------------------------------------------------------------
export function addXP(amount) {
  if (!state.user) return;
  
  const oldXp = state.user.xp || 0;
  const newXp = oldXp + amount;
  state.user.xp = newXp;

  // Level Up logic: 100 XP per level
  const oldLevel = state.user.level || 1;
  const newLevel = Math.floor(newXp / 100) + 1;
  
  if (newLevel > oldLevel) {
    state.user.level = newLevel;
    if (state.activeRoom) {
      sendChatMessage(`✨ leveled up to Level ${newLevel}! Keep pushing!`, 'system');
    }
  }

  const totalMinutes = Math.floor(newXp);
  if (totalMinutes >= 60) {
    unlockBadge('deep_focus_legend');
  }

  state.user = { ...state.user };
}

export function unlockBadge(badgeId) {
  if (!state.user) return;
  if (!state.user.badgesUnlocked) {
    state.user.badgesUnlocked = [];
  }

  if (!state.user.badgesUnlocked.includes(badgeId)) {
    state.user.badgesUnlocked.push(badgeId);
    state.user = { ...state.user };
    
    if (state.activeRoom) {
      const badge = BADGES.find(b => b.id === badgeId);
      sendChatMessage(`🏆 unlocked the achievement badge: "${badge.name}" ${badge.icon}!`, 'system');
    }
    return true;
  }
  return false;
}

// -------------------------------------------------------------
// REAL-TIME SYNC ENGINE: BROADCAST CHANNEL
// -------------------------------------------------------------
export function initSyncChannel() {
  if (syncChannel) {
    syncChannel.close();
  }

  syncChannel = new BroadcastChannel(CHANNEL_NAME);
  
  syncChannel.onmessage = (event) => {
    const { type, roomId, sender, data, timestamp } = event.data;
    
    if (!state.activeRoom || state.activeRoom.id !== roomId) {
      return;
    }

    switch (type) {
      case 'CHAT_MSG':
        handleIncomingChatMessage(roomId, data);
        break;

      case 'TIMER_ACTION':
        handleIncomingTimerAction(data, timestamp);
        break;

      case 'TASK_ACTION':
        handleIncomingTaskAction(data);
        break;

      case 'FLASHCARD_ACTION':
        handleIncomingFlashcardAction(data);
        break;

      case 'MEMBER_SYNC':
        handleIncomingMemberSync(data);
        break;

      case 'WHITEBOARD_DRAW':
        window.dispatchEvent(new CustomEvent('whiteboard-draw-stroke', { detail: data }));
        break;

      case 'WHITEBOARD_CLEAR':
        window.dispatchEvent(new CustomEvent('whiteboard-clear-canvas'));
        break;

      case 'NOTEPAD_UPDATE':
        handleIncomingNotepadUpdate(roomId, data);
        break;

      default:
        console.warn('Unknown sync message type:', type);
    }
  };
}

export function broadcastEvent(type, data) {
  if (!syncChannel || !state.activeRoom || !state.user) return;
  
  syncChannel.postMessage({
    type,
    roomId: state.activeRoom.id,
    sender: state.user.username,
    data,
    timestamp: Date.now()
  });
}

// -------------------------------------------------------------
// STATE MODIFIERS
// -------------------------------------------------------------
export function joinRoom(room) {
  state.activeRoom = room;
  initSyncChannel();

  state.currentFlashcardIndex = 0;
  
  if (!state.chat[room.id]) state.chat[room.id] = [];
  if (!state.tasks[room.id]) state.tasks[room.id] = [];
  if (!state.flashcards[room.id]) state.flashcards[room.id] = [];
  
  // Load notes
  fetchRoomNotepad(room.id);

  state.activeMembers = [{
    username: state.user.username,
    avatar: state.user.avatar,
    lastSeen: Date.now()
  }];

  broadcastEvent('MEMBER_SYNC', {
    action: 'join',
    user: { username: state.user.username, avatar: state.user.avatar }
  });

  sendChatMessage(`${state.user.username} joined the focus room.`, 'system');
  unlockBadge('first_step');

  state.timer = {
    mode: 'focus',
    duration: room.focusTime * 60,
    timeRemaining: room.focusTime * 60,
    isRunning: false,
    startTimestamp: null,
    pausedRemaining: null
  };
}

export function leaveRoom() {
  if (!state.activeRoom) return;

  broadcastEvent('MEMBER_SYNC', {
    action: 'leave',
    username: state.user.username
  });

  state.activeRoom = null;
  state.activeMembers = [];
  if (syncChannel) {
    syncChannel.close();
    syncChannel = null;
  }
}

function handleIncomingMemberSync(data) {
  const { action, user, username } = data;

  if (action === 'join') {
    if (!state.activeMembers.some(m => m.username === user.username)) {
      state.activeMembers.push({ ...user, lastSeen: Date.now() });
      state.activeMembers = [...state.activeMembers];
      sendChatMessage(`${user.username} joined the focus room.`, 'system');
    }
    broadcastEvent('MEMBER_SYNC', {
      action: 'handshake',
      user: { username: state.user.username, avatar: state.user.avatar }
    });
  } 
  else if (action === 'handshake') {
    if (!state.activeMembers.some(m => m.username === user.username)) {
      state.activeMembers.push({ ...user, lastSeen: Date.now() });
      state.activeMembers = [...state.activeMembers];
    }
  }
  else if (action === 'leave') {
    state.activeMembers = state.activeMembers.filter(m => m.username !== username);
    sendChatMessage(`${username} left the room.`, 'system');
  }
}

export function sendChatMessage(text, type = 'text') {
  if (!state.activeRoom || !state.user) return;

  const msg = {
    sender: type === 'system' ? 'System' : state.user.username,
    avatar: type === 'system' ? '🤖' : state.user.avatar,
    text,
    timestamp: Date.now(),
    type
  };

  const roomId = state.activeRoom.id;
  if (!state.chat[roomId]) state.chat[roomId] = [];
  state.chat[roomId].push(msg);
  state.chat = { ...state.chat };

  if (type === 'text') {
    const userMsgCount = state.chat[roomId].filter(m => m.sender === state.user.username && m.type === 'text').length;
    if (userMsgCount >= 5) {
      unlockBadge('social_butterfly');
    }
  }

  if (type !== 'system-local' && type !== 'bot-local') {
    broadcastEvent('CHAT_MSG', msg);
  }
}

function handleIncomingChatMessage(roomId, msg) {
  if (!state.chat[roomId]) state.chat[roomId] = [];
  state.chat[roomId].push(msg);
  state.chat = { ...state.chat };
}

export function toggleTimer() {
  if (!state.activeRoom) return;

  const newRunning = !state.timer.isRunning;
  let startTimestamp = null;
  let pausedRemaining = null;

  if (newRunning) {
    startTimestamp = Date.now();
    pausedRemaining = state.timer.timeRemaining;
  } else {
    pausedRemaining = state.timer.timeRemaining;
  }

  state.timer = {
    ...state.timer,
    isRunning: newRunning,
    startTimestamp,
    pausedRemaining
  };

  broadcastEvent('TIMER_ACTION', {
    action: newRunning ? 'start' : 'pause',
    timeRemaining: state.timer.timeRemaining,
    mode: state.timer.mode
  });

  sendChatMessage(
    `${state.user.username} ${newRunning ? 'started' : 'paused'} the study timer.`, 
    'system'
  );
}

export function resetTimer() {
  if (!state.activeRoom) return;

  const duration = state.timer.mode === 'focus' ? state.activeRoom.focusTime * 60 : 300;
  state.timer = {
    mode: state.timer.mode,
    duration,
    timeRemaining: duration,
    isRunning: false,
    startTimestamp: null,
    pausedRemaining: null
  };

  broadcastEvent('TIMER_ACTION', {
    action: 'reset',
    duration,
    mode: state.timer.mode
  });

  sendChatMessage(`${state.user.username} reset the study timer.`, 'system');
}

export function changeTimerMode(mode) {
  let duration = 1500;
  if (mode === 'break') duration = 300;
  if (mode === 'stopwatch') duration = 0;
  
  if (mode === 'focus' && state.activeRoom) {
    duration = state.activeRoom.focusTime * 60;
  }

  state.timer = {
    mode,
    duration,
    timeRemaining: duration,
    isRunning: false,
    startTimestamp: null,
    pausedRemaining: null
  };

  broadcastEvent('TIMER_ACTION', {
    action: 'mode_change',
    mode,
    duration
  });
}

function handleIncomingTimerAction(data, timestamp) {
  const { action, timeRemaining, mode, duration } = data;

  if (action === 'start') {
    const delay = (Date.now() - timestamp) / 1000;
    const adjustedRemaining = Math.max(0, timeRemaining - delay);
    
    state.timer = {
      ...state.timer,
      isRunning: true,
      timeRemaining: adjustedRemaining,
      startTimestamp: Date.now(),
      pausedRemaining: adjustedRemaining,
      mode
    };
  } 
  else if (action === 'pause') {
    state.timer = {
      ...state.timer,
      isRunning: false,
      timeRemaining,
      pausedRemaining: timeRemaining,
      mode
    };
  } 
  else if (action === 'reset') {
    state.timer = {
      mode,
      duration,
      timeRemaining: duration,
      isRunning: false,
      startTimestamp: null,
      pausedRemaining: null
    };
  } 
  else if (action === 'mode_change') {
    state.timer = {
      mode,
      duration,
      timeRemaining: duration,
      isRunning: false,
      startTimestamp: null,
      pausedRemaining: null
    };
  }
}

export function addTask(text) {
  if (!state.activeRoom || !state.user) return;
  const roomId = state.activeRoom.id;
  const task = {
    id: 'task-' + Date.now(),
    text,
    completed: false,
    createdBy: state.user.username
  };

  if (!state.tasks[roomId]) state.tasks[roomId] = [];
  state.tasks[roomId].push(task);
  state.tasks = { ...state.tasks };

  broadcastEvent('TASK_ACTION', { action: 'add', task });
}

export function toggleTask(taskId) {
  if (!state.activeRoom) return;
  const roomId = state.activeRoom.id;
  
  if (state.tasks[roomId]) {
    state.tasks[roomId] = state.tasks[roomId].map(t => {
      if (t.id === taskId) {
        const targetState = !t.completed;
        if (targetState) {
          unlockBadge('task_slayer');
        }
        return { ...t, completed: targetState };
      }
      return t;
    });
    state.tasks = { ...state.tasks };
    broadcastEvent('TASK_ACTION', { action: 'toggle', taskId });
  }
}

export function deleteTask(taskId) {
  if (!state.activeRoom) return;
  const roomId = state.activeRoom.id;

  if (state.tasks[roomId]) {
    state.tasks[roomId] = state.tasks[roomId].filter(t => t.id !== taskId);
    state.tasks = { ...state.tasks };
    broadcastEvent('TASK_ACTION', { action: 'delete', taskId });
  }
}

function handleIncomingTaskAction(data) {
  const roomId = state.activeRoom.id;
  const { action, task, taskId } = data;

  if (!state.tasks[roomId]) state.tasks[roomId] = [];

  if (action === 'add') {
    state.tasks[roomId].push(task);
  } 
  else if (action === 'toggle') {
    state.tasks[roomId] = state.tasks[roomId].map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
  } 
  else if (action === 'delete') {
    state.tasks[roomId] = state.tasks[roomId].filter(t => t.id !== taskId);
  }
  
  state.tasks = { ...state.tasks };
}

export function addFlashcard(front, back) {
  if (!state.activeRoom || !state.user) return;
  const roomId = state.activeRoom.id;
  const card = { front, back };

  if (!state.flashcards[roomId]) state.flashcards[roomId] = [];
  state.flashcards[roomId].push(card);
  state.flashcards = { ...state.flashcards };

  broadcastEvent('FLASHCARD_ACTION', { action: 'add', card });
  unlockBadge('quiz_scholar');
}

function handleIncomingFlashcardAction(data) {
  const roomId = state.activeRoom.id;
  const { action, card } = data;

  if (!state.flashcards[roomId]) state.flashcards[roomId] = [];

  if (action === 'add') {
    state.flashcards[roomId].push(card);
    state.flashcards = { ...state.flashcards };
  }
}

function handleIncomingNotepadUpdate(roomId, text) {
  rawState.notepad[roomId] = text;
  window.dispatchEvent(new CustomEvent('notepad-sync-update', { detail: text }));
}
