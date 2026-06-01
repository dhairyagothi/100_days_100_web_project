// Room Chat and Jaypee Medical AI Chatbot Component Handler
import { state, sendChatMessage, askMedicalAiChatbot, addFlashcard } from '../state.js';
import { handleChatCommand } from '../services/bots.js';

export function initChatComponent() {
  const formChat = document.getElementById('form-chat');
  const chatInput = document.getElementById('chat-input');
  
  const formMedicalAi = document.getElementById('form-medical-ai');
  const medicalAiInput = document.getElementById('medical-ai-input');
  
  const helperButtons = document.querySelectorAll('.btn-chat-helper');

  // Room Chat Form Submit
  formChat.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // Check if it's a local chat command (starts with /)
    if (text.startsWith('/')) {
      const commandHandled = handleChatCommand(text);
      if (commandHandled) {
        chatInput.value = '';
        return;
      }
    }

    // Standard message
    sendChatMessage(text, 'text');
    chatInput.value = '';
  });

  // Chat Command Helpers click handlers
  helperButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const command = btn.getAttribute('data-command');
      handleChatCommand(command);
    });
  });

  // Jaypee Medical Study AI Chatbot Form Submit
  formMedicalAi.addEventListener('submit', async (e) => {
    e.preventDefault();
    const promptText = medicalAiInput.value.trim();
    if (!promptText) return;

    medicalAiInput.value = '';
    
    // 1. Append user's question to the medical chatbox
    appendMedicalAiMessage(promptText, 'user');

    // 2. Render typing indicator
    const typingId = appendMedicalAiTypingIndicator();

    try {
      // 3. Ask AI
      const result = await askMedicalAiChatbot(promptText);
      
      // Remove typing bubble
      removeMedicalAiTypingIndicator(typingId);

      // 4. Render AI's response text
      appendMedicalAiMessage(result.reply || 'No response received.', 'system');

      // 5. Check if the AI returned flashcards to inject
      if (result.flashcards && result.flashcards.length > 0) {
        result.flashcards.forEach(card => {
          addFlashcard(card.front, card.back);
        });

        // Notify room chat about injected flashcards
        sendChatMessage(
          `🩺 **Jaypee Study AI**: Injected ${result.flashcards.length} revision cards into the deck! Check the "Revision Flashcards" tab.`, 
          'system-local'
        );
      }
    } catch(err) {
      removeMedicalAiTypingIndicator(typingId);
      appendMedicalAiMessage("⚠️ Failed to reach medical AI service. Connecting to offline index.", 'system');
      console.error(err);
    }
  });
}

// -------------------------------------------------------------
// RENDER HELPERS
// -------------------------------------------------------------

export function renderChatView() {
  const container = document.getElementById('chat-messages-container');
  if (!container || !state.activeRoom) return;

  const roomId = state.activeRoom.id;
  const messages = state.chat[roomId] || [];

  container.innerHTML = messages.map(msg => {
    let bubbleClass = 'chat-bubble';
    if (msg.type === 'system') bubbleClass += ' system';
    if (msg.type === 'system-local') bubbleClass += ' system-local';
    if (msg.type === 'bot-local') bubbleClass += ' bot-local';

    const isMe = msg.sender === state.user.username;
    if (isMe) bubbleClass += ' me';

    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="${bubbleClass}">
        <div class="chat-meta">
          <span class="chat-sender">${msg.avatar} ${msg.sender}</span>
          <span class="chat-time">${time}</span>
        </div>
        <div class="chat-text">${formatMessageText(msg.text)}</div>
      </div>
    `;
  }).join('');

  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function formatMessageText(text) {
  // Convert standard markdown bold and emojis safely
  let formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>');
  return formatted;
}

// -------------------------------------------------------------
// MEDICAL AI VIEW HELPERS
// -------------------------------------------------------------

function appendMedicalAiMessage(text, sender) {
  const chatBox = document.getElementById('medical-ai-chat-box');
  if (!chatBox) return;

  const bubble = document.createElement('div');
  bubble.className = `ai-chat-bubble ${sender}`;
  
  // Parse simple markdown tags in AI outputs
  bubble.innerHTML = formatMessageText(text).replace(/\n/g, '<br>');

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMedicalAiTypingIndicator() {
  const chatBox = document.getElementById('medical-ai-chat-box');
  if (!chatBox) return null;

  const typingId = 'ai-typing-' + Date.now();
  const bubble = document.createElement('div');
  bubble.className = 'ai-chat-bubble system typing';
  bubble.id = typingId;
  bubble.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
    🩺 <em>Jaypee Medical AI is thinking...</em>
  `;

  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typingId;
}

function removeMedicalAiTypingIndicator(id) {
  if (!id) return;
  const bubble = document.getElementById(id);
  if (bubble) {
    bubble.remove();
  }
}
