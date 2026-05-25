const STORAGE_KEY = 'whatsapp_clone_state_v1';

const defaultChats = [
  {
    id: 'a1',
    name: 'Aarav',
    type: 'personal',
    online: true,
    archived: false,
    unread: 2,
    color: '#25d366',
    status: 'online',
    messages: [
      { from: 'them', text: 'Morning. Are we still meeting at 6?', time: '08:14', state: 'read' },
      { from: 'me', text: 'Yes. I’ll send the location in a minute.', time: '08:16', state: 'read' },
      { from: 'them', text: 'Perfect. I’m on my way.', time: '08:18', state: 'read' }
    ]
  },
  {
    id: 'b2',
    name: 'Design Team',
    type: 'group',
    online: false,
    archived: false,
    unread: 0,
    color: '#128c7e',
    status: '3 participants online',
    messages: [
      { from: 'them', text: 'The hero section has been approved.', time: 'Yesterday', state: 'read' },
      { from: 'me', text: 'Great. I’ll keep the CTA on the right for now.', time: 'Yesterday', state: 'read' }
    ]
  },
  {
    id: 'c3',
    name: 'Mira',
    type: 'personal',
    online: false,
    archived: false,
    unread: 1,
    color: '#0f9d58',
    status: 'last seen 12m ago',
    messages: [
      { from: 'them', text: 'Can you review the deck before lunch?', time: '09:01', state: 'read' },
      { from: 'me', text: 'On it. I’ll leave comments in the next 20 minutes.', time: '09:06', state: 'read' }
    ]
  },
  {
    id: 'd4',
    name: 'Family Group',
    type: 'group',
    online: false,
    archived: true,
    unread: 0,
    color: '#1ebea5',
    status: '5 participants',
    messages: [
      { from: 'them', text: 'Dinner is at 8 today.', time: 'Mon', state: 'read' },
      { from: 'me', text: 'Noted. I’ll be there.', time: 'Mon', state: 'read' }
    ]
  },
  {
    id: 'e5',
    name: 'Product Update',
    type: 'group',
    online: false,
    archived: false,
    unread: 4,
    color: '#075e54',
    status: 'announcement channel',
    messages: [
      { from: 'them', text: 'Release notes are now in the drive.', time: '07:42', state: 'read' },
      { from: 'them', text: 'Please reply with blockers by noon.', time: '07:45', state: 'read' }
    ]
  }
];

const state = loadState();
let activeChatId = state.activeChatId || defaultChats[0].id;
let filter = 'all';
let searchQuery = '';
let typingTimer = null;

const elements = {
  chatList: document.getElementById('chat-list'),
  searchInput: document.getElementById('search-input'),
  messageInput: document.getElementById('message-input'),
  sendButton: document.getElementById('send-button'),
  messages: document.getElementById('messages'),
  typing: document.getElementById('typing-indicator'),
  conversation: document.getElementById('conversation'),
  emptyState: document.getElementById('empty-state'),
  peerName: document.getElementById('peer-name'),
  peerStatus: document.getElementById('peer-status'),
  peerAvatar: document.getElementById('peer-avatar'),
  themeToggle: document.getElementById('theme-toggle'),
  backToList: document.getElementById('back-to-list'),
  mobileListToggle: document.getElementById('mobile-list-toggle'),
  sidebar: document.querySelector('.sidebar')
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { chats: structuredClone(defaultChats), theme: 'dark', activeChatId: defaultChats[0].id };
    }

    const parsed = JSON.parse(raw);
    const baseChats = structuredClone(defaultChats);

    if (Array.isArray(parsed.chats)) {
      parsed.chats.forEach(savedChat => {
        const index = baseChats.findIndex(chat => chat.id === savedChat.id);
        if (index >= 0) {
          baseChats[index] = {
            ...baseChats[index],
            ...savedChat,
            messages: Array.isArray(savedChat.messages) && savedChat.messages.length ? savedChat.messages : baseChats[index].messages
          };
        }
      });
    }

    return {
      chats: baseChats,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
      activeChatId: parsed.activeChatId || defaultChats[0].id
    };
  } catch {
    return { chats: structuredClone(defaultChats), theme: 'dark', activeChatId: defaultChats[0].id };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    chats: state.chats,
    theme: document.documentElement.getAttribute('data-theme') || 'dark',
    activeChatId
  }));
}

function getActiveChat() {
  return state.chats.find(chat => chat.id === activeChatId) || state.chats[0];
}

function formatPreviewText(message) {
  if (!message) return 'Start a conversation';
  return message.length > 42 ? `${message.slice(0, 42)}…` : message;
}

function escapeText(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLastMessage(chat) {
  return chat.messages[chat.messages.length - 1] || null;
}

function renderChatList() {
  const query = searchQuery.trim().toLowerCase();

  const visibleChats = state.chats.filter(chat => {
    const matchesSearch = !query || chat.name.toLowerCase().includes(query) || chat.status.toLowerCase().includes(query);
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unread' && chat.unread > 0) ||
      (filter === 'groups' && chat.type === 'group') ||
      (filter === 'archived' && chat.archived);

    return matchesSearch && matchesFilter;
  });

  elements.chatList.innerHTML = visibleChats.map(chat => {
    const lastMessage = getLastMessage(chat);
    const initials = chat.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();

    return `
      <button class="chat-item ${chat.id === activeChatId ? 'active' : ''}" data-id="${chat.id}" role="listitem">
        <div class="avatar" style="background: linear-gradient(135deg, ${chat.color}, ${shadeColor(chat.color, -25)})">${initials}</div>
        <div class="chat-copy">
          <div class="chat-topline">
            <h3>${escapeText(chat.name)}</h3>
            <span class="chat-time">${escapeText(lastMessage ? lastMessage.time : 'now')}</span>
          </div>
          <p class="chat-snippet">
            <span>${escapeText(lastMessage ? lastMessage.text : 'No messages yet')}</span>
            ${chat.unread > 0 ? `<span class="badge">${chat.unread}</span>` : ''}
          </p>
        </div>
      </button>
    `;
  }).join('');

  if (!visibleChats.length) {
    elements.chatList.innerHTML = '<div class="empty-chat-list">No chats match your search.</div>';
  }

  elements.chatList.querySelectorAll('.chat-item').forEach(button => {
    button.addEventListener('click', () => openChat(button.dataset.id));
  });
}

function renderConversation() {
  const chat = getActiveChat();
  if (!chat) {
    elements.conversation.classList.add('hidden');
    elements.emptyState.classList.remove('hidden');
    return;
  }

  elements.emptyState.classList.add('hidden');
  elements.conversation.classList.remove('hidden');
  elements.peerName.textContent = chat.name;
  elements.peerStatus.textContent = chat.status;
  elements.peerAvatar.textContent = chat.name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase();
  elements.peerAvatar.style.background = `linear-gradient(135deg, ${chat.color}, ${shadeColor(chat.color, -22)})`;

  elements.messages.innerHTML = chat.messages.map(message => {
    const aligned = message.from === 'me' ? 'outgoing' : 'incoming';
    return `
      <article class="message-row ${aligned}">
        <div class="message-bubble">
          <p>${escapeText(message.text)}</p>
          <div class="message-meta">
            <span>${escapeText(message.time)}</span>
            ${message.from === 'me' ? `<span class="ticks">✓✓</span>` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  elements.typing.classList.add('hidden');
  scrollMessagesToBottom();
  saveState();
}

function scrollMessagesToBottom() {
  const viewport = document.getElementById('message-viewport');
  requestAnimationFrame(() => {
    viewport.scrollTop = viewport.scrollHeight;
  });
}

function openChat(chatId) {
  activeChatId = chatId;
  const chat = getActiveChat();
  if (chat) {
    chat.unread = 0;
  }
  renderChatList();
  renderConversation();
  if (window.innerWidth <= 780) {
    elements.sidebar.classList.remove('open');
  }
}

function sendMessage() {
  const text = elements.messageInput.value.trim();
  if (!text) return;

  const chat = getActiveChat();
  if (!chat) return;

  const sentAt = formatTime(new Date());
  chat.messages.push({ from: 'me', text, time: sentAt, state: 'sent' });
  chat.unread = 0;
  elements.messageInput.value = '';
  autoResize();
  renderChatList();
  renderConversation();

  elements.typing.classList.remove('hidden');
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    elements.typing.classList.add('hidden');
    chat.messages.push({
      from: 'them',
      text: generateReply(text, chat),
      time: formatTime(new Date()),
      state: 'read'
    });
    chat.unread = activeChatId === chat.id ? 0 : chat.unread + 1;
    renderChatList();
    renderConversation();
  }, 1000 + Math.random() * 900);

  saveState();
}

function generateReply(text, chat) {
  const clean = text.trim().toLowerCase();

  if (clean.includes('hello') || clean.includes('hi')) {
    return `Hey, ${chat.type === 'group' ? 'team' : 'I'} got your message.`;
  }

  if (clean.includes('meet') || clean.includes('call')) {
    return 'Works for me. Send the time and I will join.';
  }

  if (clean.includes('thanks')) {
    return 'Anytime. Keep me posted.';
  }

  if (chat.type === 'group') {
    return 'Sounds good. I will update the group shortly.';
  }

  return 'Got it. I will reply once I check this.';
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(date).toLowerCase();
}

function autoResize() {
  const textarea = elements.messageInput;
  textarea.style.height = 'auto';
  textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
}

function shadeColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return `rgb(${r}, ${g}, ${b})`;
}

function syncTheme() {
  document.documentElement.setAttribute('data-theme', state.theme || 'dark');
}

function init() {
  syncTheme();
  renderChatList();
  openChat(activeChatId);
  renderConversation();
}

function attachEvents() {
  elements.searchInput.addEventListener('input', event => {
    searchQuery = event.target.value;
    renderChatList();
  });

  document.querySelectorAll('.chip').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      filter = button.dataset.filter;
      renderChatList();
    });
  });

  elements.messageInput.addEventListener('input', autoResize);
  elements.messageInput.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  elements.sendButton.addEventListener('click', sendMessage);

  elements.themeToggle.addEventListener('click', () => {
    state.theme = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
    syncTheme();
    saveState();
  });

  elements.mobileListToggle.addEventListener('click', () => {
    elements.sidebar.classList.add('open');
  });

  elements.backToList.addEventListener('click', () => {
    elements.sidebar.classList.add('open');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 780) {
      elements.sidebar.classList.remove('open');
    }
  });
}

attachEvents();
init();
