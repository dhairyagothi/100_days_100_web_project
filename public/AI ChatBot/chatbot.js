// Initialize WebSockets connection to the Backend Server
const socket = io('http://localhost:5000');

// DOM Element Registry
const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const messagesInner = document.getElementById('messages-inner');
const emptyState = document.getElementById('empty-state');
const collabBtn = document.getElementById('collab-btn');
const collabCard = document.getElementById('collab-card');
const shareUrlInput = document.getElementById('share-url-input');
const copyRoomLinkBtn = document.getElementById('copy-room-link-btn');
const roomStatusBadge = document.getElementById('room-status-badge');

// Attachment Pipeline Elements
const imageInput = document.getElementById('image-input');
const imagePreviewWrap = document.getElementById('image-preview-wrap');
const previewImg = document.getElementById('preview-img');
const fileIconPlaceholder = document.getElementById('file-icon-placeholder');
const fileNamePreview = document.getElementById('file-name-preview');
const removeImageBtn = document.getElementById('remove-image-btn');

// API Key Modal Elements
const apiModal = document.getElementById('api-modal');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const toggleKeyVisibility = document.getElementById('toggle-key-visibility');
const eyeIcon = document.getElementById('eye-icon');
const changeKeyBtn = document.getElementById('change-key-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// Room Session State Parsing
const urlParams = new URLSearchParams(window.location.search);
let currentRoomId = urlParams.get('room') || null;

// Track active file details in memory
let attachedFilePayload = null;

// Initialize Session Syncing on Launch
if (currentRoomId) {
  socket.emit('join_room', currentRoomId);
  setupCollaborationUI(currentRoomId);
}

// ----------------------------------------------------
// ATTACHMENT PIPELINE EVENT HANDLERS
// ----------------------------------------------------
imageInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  
  reader.onload = function(event) {
    attachedFilePayload = {
      name: file.name,
      type: file.type,
      dataUrl: event.target.result // Base64 encoding for synchronization
    };

    imagePreviewWrap.classList.remove('hidden');
    sendBtn.disabled = false;

    if (file.type.startsWith('image/')) {
      fileIconPlaceholder.style.display = 'none';
      previewImg.style.display = 'block';
      previewImg.src = event.target.result;
    } else {
      previewImg.style.display = 'none';
      fileIconPlaceholder.style.display = 'flex';
      fileNamePreview.textContent = file.name;
    }
  };

  reader.readAsDataURL(file);
});

removeImageBtn.addEventListener('click', clearAttachmentPreview);

function clearAttachmentPreview() {
  attachedFilePayload = null;
  imageInput.value = '';
  imagePreviewWrap.classList.add('hidden');
  previewImg.src = '#';
  if (promptInput.value.trim() === '') {
    sendBtn.disabled = true;
  }
}

// ----------------------------------------------------
// LOCAL STORAGE & MODAL MANAGEMENT LOGIC
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) {
    apiModal.classList.add('hidden');
    apiModal.style.display = 'none'; 
  }
});

saveKeyBtn.addEventListener('click', () => {
  const keyValue = apiKeyInput.value.trim();
  if (keyValue) {
    localStorage.setItem('gemini_api_key', keyValue);
    apiModal.classList.add('hidden');
    apiModal.style.display = 'none';
  } else {
    alert("Please enter a valid API key to proceed.");
  }
});

toggleKeyVisibility.addEventListener('click', () => {
  if (apiKeyInput.type === 'password') {
    apiKeyInput.type = 'text';
    eyeIcon.style.stroke = 'var(--accent)';
  } else {
    apiKeyInput.type = 'password';
    eyeIcon.style.stroke = 'currentColor';
  }
});

changeKeyBtn.addEventListener('click', () => {
  apiModal.classList.remove('hidden');
  apiModal.style.display = 'flex';
  const savedKey = localStorage.getItem('gemini_api_key');
  if (savedKey) apiKeyInput.value = savedKey;
});

clearHistoryBtn.addEventListener('click', () => {
  if (confirm("Are you sure you want to clear your chat environment data?")) {
    localStorage.removeItem('gemini_api_key');
    messagesInner.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    window.location.reload();
  }
});

// ----------------------------------------------------
// WEBSOCKET BROADCAST LISTENERS
// ----------------------------------------------------
socket.on('receive_message', (data) => {
  hideEmptyState();
  if (data.isAI) {
    appendMessageBubble(data.message, 'ai', data.sender, null);
  } else {
    appendMessageBubble(data.message, 'user', data.sender, data.file);
  }
});

socket.on('user_joined', (data) => {
  roomStatusBadge.textContent = "👥 Connected Group";
  roomStatusBadge.style.background = "#eefbf4";
  roomStatusBadge.style.color = "#187741";
  roomStatusBadge.style.borderColor = "#187741";
});

// ----------------------------------------------------
// UI INTERACTION HANDLERS & HANDSHAKES
// ----------------------------------------------------
collabBtn.addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:5000/api/room/create');
    const data = await response.json();
    window.location.search = `?room=${data.roomId}`;
  } catch (err) {
    console.error("Failed to generate collaborative room channel:", err);
  }
});

copyRoomLinkBtn.addEventListener('click', () => {
  shareUrlInput.select();
  document.execCommand('copy');
  copyRoomLinkBtn.textContent = "Copied link! ✔";
  setTimeout(() => { copyRoomLinkBtn.textContent = "Copy Session Link"; }, 2000);
});

function setupCollaborationUI(roomId) {
  collabCard.style.display = 'block';
  shareUrlInput.value = window.location.href;
  roomStatusBadge.style.display = 'inline-flex';
  roomStatusBadge.textContent = "👤 Live Session Link";
}

promptInput.addEventListener('input', () => {
  sendBtn.disabled = promptInput.value.trim() === '' && !attachedFilePayload;
});

sendBtn.addEventListener('click', processOutgoingMessage);
promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !sendBtn.disabled) {
    e.preventDefault();
    processOutgoingMessage();
  }
});

function processOutgoingMessage() {
  const text = promptInput.value.trim();
  if (!text && !attachedFilePayload) return;

  hideEmptyState();
  
  // 1. Render locally on sender's UI workspace instantly
  appendMessageBubble(text, 'user', 'You', attachedFilePayload);

  // 2. Broadcast data structure over WebSockets to partners
  if (currentRoomId) {
    socket.emit('send_message', {
      room: currentRoomId,
      message: text,
      sender: `Peer (${socket.id.slice(0, 4)})`,
      isAI: false,
      file: attachedFilePayload
    });
  }

  // Preserve attachment info pointer reference for API delivery call before clearing text field
  const activeFileForAI = attachedFilePayload;

  promptInput.value = '';
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
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${savedKey}`;
    
    // Assemble multimodal parts collection array structure dynamically
    let requestParts = [];

    if (fileAttachment) {
      // Split off metadata prefix to parse clean base64 data string
      const base64CleanData = fileAttachment.dataUrl.split(',')[1];
      
      requestParts.push({
        inlineData: {
          mimeType: fileAttachment.type,
          data: base64CleanData
        }
      });
    }

    // Append text prompt instruction block part if user entered text alongside document
    requestParts.push({ text: userPrompt || `Analyze the attached file named ${fileAttachment.name}` });

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: requestParts }]
      })
    });

    const data = await response.json();
    removeTypingIndicator();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const aiReplyText = data.candidates[0].content.parts[0].text;
      
      appendMessageBubble(aiReplyText, 'ai', 'Gemini Engine', null);

      if (currentRoomId) {
        socket.emit('send_message', {
          room: currentRoomId,
          message: aiReplyText,
          sender: 'Gemini Engine',
          isAI: true,
          file: null
        });
      }
    } else {
      throw new Error("Invalid output format returned by API");
    }

  } catch (error) {
    console.error("Gemini API Request Failed:", error);
    removeTypingIndicator();
    appendMessageBubble("Failed to obtain context. Note: Gemini 2.5 Flash natively reads images, plain text files, and PDFs directly.", "ai", "Gemini Engine", null);
  }
}

// ----------------------------------------------------
// DOM INJECTION RENDER UTILITIES
// ----------------------------------------------------
function hideEmptyState() {
  if (emptyState) emptyState.style.display = 'none';
}

function appendMessageBubble(text, type, senderName, fileInfo) {
  const row = document.createElement('div');
  row.className = `message-row ${type}`;

  let headerContext = '';
  if (type === 'ai') {
    headerContext = `
      <div class="ai-sender">
        <div class="ai-dot">
          <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
        </div>
        <span>${senderName}</span>
      </div>`;
  } else {
    headerContext = `<div class="ai-sender" style="justify-content: flex-end; padding-right:4px;"><span>${senderName}</span></div>`;
  }

  // Handle building rendering context structure block for attachments dynamically inside bubble
  let attachmentMarkup = '';
  if (fileInfo) {
    if (fileInfo.type.startsWith('image/')) {
      attachmentMarkup = `<img src="${fileInfo.dataUrl}" class="msg-image" alt="Attached Image Layer" style="max-width: 100%; border-radius: var(--radius-md); margin-bottom: 8px; display: block;" />`;
    } else {
      // Build an interactive download anchor link badge interface look for shared PDFs/documents
      attachmentMarkup = `
        <a href="${fileInfo.dataUrl}" download="${fileInfo.name}" style="display: flex; align-items: center; gap: 8px; background: rgba(232,103,58,0.12); border: 1px dashed var(--accent); padding: 10px; border-radius: var(--radius-sm); margin-bottom: 8px; text-decoration: none; color: inherit; width: fit-content;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <div style="display: flex; flex-direction: column; text-align: left;">
            <span style="font-size: 0.82rem; font-weight: 600; text-decoration: underline;">${fileInfo.name}</span>
            <span style="font-size: 0.7rem; color: var(--text-secondary);">Click to Download / View</span>
          </div>
        </a>`;
    }
  }

  const formattedContent = text ? ((typeof marked !== 'undefined') ? marked.parse(text) : `<p>${text}</p>`) : '';

  row.innerHTML = `
    ${headerContext}
    <div class="bubble">
      ${attachmentMarkup}
      ${formattedContent}
    </div>
  `;
  
  messagesInner.appendChild(row);
  document.getElementById('messages-viewport').scrollTop = document.getElementById('messages-viewport').scrollHeight;
}

function showTypingIndicator() {
  const existing = document.getElementById('typing-indicator');
  if (existing) return;

  const row = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typing-indicator';
  row.innerHTML = `
    <div class="typing-bubble">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  messagesInner.appendChild(row);
  document.getElementById('messages-viewport').scrollTop = document.getElementById('messages-viewport').scrollHeight;
}

function removeTypingIndicator() {
  const indicator = document.getElementById('typing-indicator');
  if (indicator) indicator.remove();
}