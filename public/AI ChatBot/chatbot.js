/* ===========================
   CONFIG
=========================== */
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const STORAGE_KEY_API     = 'gemini_api_key';
const STORAGE_KEY_HISTORY = 'gemini_chat_history';
const STORAGE_KEY_THEME   = 'gemini_theme';
   
/* ===========================
   STATE  
=========================== */
let geminiApiKey      = localStorage.getItem(STORAGE_KEY_API) || '';
let selectedImageBase64 = null;
let chatHistory       = [];   // [{role:"user"|"model", parts:[{text}]}]
let sessions          = loadSessions();
let activeSessionId   = null;

/* ===========================
   DOM REFS
=========================== */
const apiModal        = document.getElementById('settings-modal');
const apiKeyInput     = document.getElementById('settings-api-input');
const saveKeyBtn      = document.getElementById('save-key-btn');
const toggleKeyBtn    = document.getElementById('ob-toggle-key');
const changeKeyBtn    = document.getElementById('change-key-btn');
const messagesInner   = document.getElementById('messages-inner');
const viewport        = document.getElementById('messages-viewport');
const promptInput     = document.getElementById('prompt-input');
const sendBtn         = document.getElementById('send-btn');
const imageInput      = document.getElementById('image-input');
const previewImg      = document.getElementById('preview-img');
const previewWrap     = document.getElementById('image-preview-wrap');
const removeImgBtn    = document.getElementById('remove-image-btn');
const emptyState      = document.getElementById('empty-state');
const historyList     = document.getElementById('history-list');
const newChatBtn      = document.getElementById('new-chat-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const themeToggle     = document.getElementById('theme-toggle');
const sidebarToggle   = document.getElementById('sidebar-toggle');
const sidebar         = document.getElementById('sidebar');
const sidebarClose    = document.getElementById('sidebar-close');

/* ===========================
   INIT
=========================== */
function init() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (!geminiApiKey) {
    apiModal.classList.remove('hidden');
  } else {
    apiKeyInput.value = geminiApiKey;
    apiModal.classList.add('hidden');
  }

  renderHistoryList();

  // Load most recent session or start fresh
  if (sessions.length > 0) {
    loadSession(sessions[0].id);
  } else {
    startNewChat();
  }
}

/* ===========================
   API KEY MODAL
=========================== */
saveKeyBtn.addEventListener('click', saveApiKey);
apiKeyInput.addEventListener('keydown', e => { if (e.key === 'Enter') saveApiKey(); });

function saveApiKey() {
  const val = apiKeyInput.value.trim();
  if (!val) {
    apiKeyInput.style.borderColor = '#e05252';
    setTimeout(() => { apiKeyInput.style.borderColor = ''; }, 1500);
    return;
  }
  geminiApiKey = val;
  localStorage.setItem(STORAGE_KEY_API, geminiApiKey);
  apiModal.classList.add('hidden');
}

toggleKeyBtn.addEventListener('click', () => {
  apiKeyInput.type = apiKeyInput.type === 'password' ? 'text' : 'password';
});
if(changeKeyBtn){
  changeKeyBtn.addEventListener('click', () => {
    apiModal.classList.remove('hidden');
  });
}

/* ===========================
   THEME
=========================== */
if(themeToggle){
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY_THEME, next);
  });
}

/* ===========================
   SIDEBAR
=========================== */
sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
if(sidebarClose){
  sidebarClose.addEventListener('click',  () => sidebar.classList.remove('open'));
}

/* ===========================
   SESSIONS
=========================== */
function loadSessions() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_HISTORY)) || []; }
  catch { return []; }
}

function saveSessions() {
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(sessions));
}

function startNewChat() {
  activeSessionId = Date.now().toString();
  chatHistory = [];
  sessions.unshift({ id: activeSessionId, title: 'New chat', messages: [] });
  saveSessions();
  renderHistoryList();
  clearMessages();
}

function loadSession(id) {
  const session = sessions.find(s => s.id === id);
  if (!session) return;
  activeSessionId = id;
  // Rebuild API history — map stored role "ai" -> "model" for legacy data
  chatHistory = session.messages
    .filter(m => m.text)
    .map(m => ({
      role: m.role === 'ai' ? 'model' : m.role,
      parts: [{ text: m.text }]
    }));
  clearMessages();
  session.messages.forEach(m => renderMessage(m.role === 'ai' ? 'ai' : m.role, m.text, m.image, false));
  renderHistoryList();
  if (window.innerWidth <= 700) sidebar.classList.remove('open');
}

function getCurrentSession() {
  return sessions.find(s => s.id === activeSessionId);
}

function deleteSession(id, e) {
  e.stopPropagation();
  if (sessions.length === 1) {
    // Last session: just wipe it and start fresh
    sessions = [];
    saveSessions();
    startNewChat();
    return;
  }
  sessions = sessions.filter(s => s.id !== id);
  saveSessions();
  if (id === activeSessionId) {
    loadSession(sessions[0].id);
  } else {
    renderHistoryList();
  }
}

function renameSession(id, e) {
  e.stopPropagation();
  const session = sessions.find(s => s.id === id);
  if (!session) return;
  const newTitle = prompt('Rename chat:', session.title);
  if (newTitle && newTitle.trim()) {
    session.title = newTitle.trim().slice(0, 60);
    saveSessions();
    renderHistoryList();
  }
}

function renderHistoryList() {
  historyList.innerHTML = '';
  sessions.forEach(session => {
    const item = document.createElement('div');
    item.className = 'history-item' + (session.id === activeSessionId ? ' active' : '');

    item.innerHTML = `
      <svg class="hist-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <span class="hist-title">${escapeHtml(session.title)}</span>
      <div class="hist-actions">
        <button class="hist-btn rename-btn" title="Rename">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
        <button class="hist-btn delete-btn" title="Delete">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`;

    item.querySelector('.rename-btn').addEventListener('click', e => renameSession(session.id, e));
    item.querySelector('.delete-btn').addEventListener('click', e => deleteSession(session.id, e));
    item.addEventListener('click', () => loadSession(session.id));
    historyList.appendChild(item);
  });
}

newChatBtn.addEventListener('click', startNewChat);

if(clearHistoryBtn){
  clearHistoryBtn.addEventListener('click', () => {
    if (confirm('Delete all chat history?')) {
      sessions = [];
      saveSessions();
      startNewChat();
    }
  });
}

/* ===========================
   IMAGE ATTACHMENT
=========================== */
imageInput.addEventListener('change', () => {
  const file = imageInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    selectedImageBase64 = e.target.result.split(',')[1];
    previewImg.src = e.target.result;
    previewWrap.classList.remove('hidden');
    updateSendBtn();
  };
  reader.readAsDataURL(file);
});

removeImgBtn.addEventListener('click', clearImage);

function clearImage() {
  selectedImageBase64 = null;
  imageInput.value = '';
  previewWrap.classList.add('hidden');
  previewImg.src = '#';
  updateSendBtn();
}

/* ===========================
   INPUT
=========================== */
promptInput.addEventListener('input', () => {
  promptInput.style.height = 'auto';
  promptInput.style.height = Math.min(promptInput.scrollHeight, 160) + 'px';
  updateSendBtn();
});

promptInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    processOutgoingMessage();
  }
});

function updateSendBtn() {
  sendBtn.disabled = !promptInput.value.trim() && !selectedImageBase64;
}

sendBtn.addEventListener('click', handleSend);

// Suggestion chips
document.querySelectorAll('.suggestion-chip').forEach(bindChip);

function bindChip(chip) {
  chip.addEventListener('click', () => {
    promptInput.value = chip.dataset.text;
    promptInput.dispatchEvent(new Event('input'));
    promptInput.focus();
  });
}

/* ===========================
   SEND / RECEIVE
=========================== */
function handleSend() {
  const text  = promptInput.value.trim();
  const image = selectedImageBase64;
  if (!text && !image) return;

  if (!geminiApiKey) { apiModal.classList.remove('hidden'); return; }

  renderMessage('user', text || 'Sent an image', image, true);

  // Build parts for API
  const parts = [];
  if (text)  parts.push({ text });
  if (image) parts.push({ inline_data: { mime_type: 'image/jpeg', data: image } });
  chatHistory.push({ role: 'user', parts });

  promptInput.value = '';
  promptInput.style.height = 'auto';
  clearImage();
  sendBtn.disabled = true;
  clearAttachmentPreview();
  
  // Execute LLM parsing pipeline connection
  fetchGeminiResponse(text, activeFileForAI);
}

// ----------------------------------------------------
// GEMINI API INTEGRATION WITH MULTIMODAL CAPABILITY
// ----------------------------------------------------
async function fetchGeminiResponse(userPrompt, fileAttachment) {
  const savedKey = localStorage.getItem('gemini_api_key');
  if (!savedKey) {
    appendMessageBubble("Missing API Key! Click 'Change API Key' in the sidebar to configure it.", "ai", "System Error", null);
    return;
  }

  showTypingIndicator();

  try {
    console.log('Gemini request key:', savedKey);
    const response = await fetch(`${API_URL}?key=${savedKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: chatHistory })
    });

    removeTyping(typingRow);

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${response.status} — check your API key and try again.`);
    }

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiText) throw new Error('Empty response from Gemini.');

    // Push with correct role "model"
    chatHistory.push({ role: 'model', parts: [{ text: aiText }] });
    renderMessage('ai', aiText, null, true);

    // Auto-title after first reply
    const session = getCurrentSession();
    if (session && session.title === 'New chat') {
      const firstUserText = chatHistory.find(m => m.role === 'user')?.parts?.[0]?.text || '';
      if (firstUserText) {
        session.title = firstUserText.slice(0, 40) + (firstUserText.length > 40 ? '…' : '');
      }
    }
    saveSessions();
    renderHistoryList();

  } catch (err) {
    removeTyping(typingRow);
    renderMessage('ai', `**Error:** ${err.message}`, null, true);
    console.error('Gemini error:', err);
  }
}

/* ===========================
   RENDER MESSAGE
=========================== */
function renderMessage(role, text, image, save) {
  if (emptyState.parentNode) emptyState.remove();

  const row = document.createElement('div');
  row.className = `message-row ${role}`;

  if (role === 'ai') {
    row.innerHTML = `
      <div class="ai-sender">
        <div class="ai-dot">
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
        </div>
        <span>${senderName}</span>
      </div>`;

    const bubble = row.querySelector('.bubble');
    bubble.innerHTML = marked.parse(text);

    // Per-codeblock copy buttons
    bubble.querySelectorAll('pre').forEach(pre => {
      pre.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        navigator.clipboard.writeText(code ? code.innerText : pre.innerText);
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      });
      pre.appendChild(btn);
    });

    row.querySelector('.copy-response-btn').addEventListener('click', function () {
      navigator.clipboard.writeText(text);
      this.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
      setTimeout(() => {
        this.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy`;
      }, 2000);
    });

  } else {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    if (image) {
      const img = document.createElement('img');
      img.src = `data:image/jpeg;base64,${image}`;
      img.className = 'msg-image';
      bubble.appendChild(img);
    }
    if (text) {
      const p = document.createElement('p');
      p.style.margin = '0';
      p.textContent = text;
      bubble.appendChild(p);
    }
    row.appendChild(bubble);
  }

  messagesInner.appendChild(row);
  scrollToBottom();

  if (save) {
    const session = getCurrentSession();
    if (session) {
      session.messages.push({ role, text, image: image || null });
      saveSessions();
    }
  }
}

/* ===========================
   TYPING INDICATOR
=========================== */
function showTyping() {
  const row = document.createElement('div');
  row.className = 'typing-row';
  row.innerHTML = `
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messagesInner.appendChild(row);
  scrollToBottom();
  return row;
}

function removeTyping(row) {
  if (row?.parentNode) row.parentNode.removeChild(row);
}

/* ===========================
   HELPERS
=========================== */
function clearMessages() {
  messagesInner.innerHTML = '';
  messagesInner.appendChild(emptyState);
  // Re-bind chips after re-insert
  emptyState.querySelectorAll('.suggestion-chip').forEach(bindChip);
}

function scrollToBottom() {
  viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ===========================
   START
=========================== */
init();