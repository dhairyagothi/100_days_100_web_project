// --- State Management ---
const defaultProfile = {
    name: 'User',
    handle: '@user123',
    avatar: 'https://i.pravatar.cc/150?img=11',
    following: ['@techcrunch']
};

const MOCK_USERS = [
    { name: 'TechCrunch', handle: '@techcrunch', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Elon Musk', handle: '@elonmusk', avatar: 'https://i.pravatar.cc/150?img=13' },
    { name: 'JavaScript Daily', handle: '@jsdaily', avatar: 'https://i.pravatar.cc/150?img=14' },
    { name: 'OpenAI', handle: '@openai', avatar: 'https://i.pravatar.cc/150?img=15' }
];

const initialTweets = [
    {
        id: '1',
        author: 'User',
        handle: '@user123',
        avatar: 'https://i.pravatar.cc/150?img=11',
        content: 'Just setting up my Twitter clone! #100DaysOfCode #WebDevelopment',
        image: null,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        likes: 5, reposts: 2, bookmarks: 1, liked: false, reposted: false, bookmarked: false, replies: []
    },
    {
        id: '2',
        author: 'TechCrunch',
        handle: '@techcrunch',
        avatar: 'https://i.pravatar.cc/150?img=12',
        content: 'Breaking: New AI model can write entire Twitter clones in under an hour. #AI #TechNews',
        image: null,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 1200, reposts: 450, bookmarks: 89, liked: false, reposted: false, bookmarked: false, replies: []
    },
    {
        id: '3',
        author: 'Elon Musk',
        handle: '@elonmusk',
        avatar: 'https://i.pravatar.cc/150?img=13',
        content: 'Mars is looking pretty good right now. #SpaceX',
        image: null,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        likes: 55000, reposts: 12000, bookmarks: 500, liked: false, reposted: false, bookmarked: false, replies: []
    }
];

const State = {
    tweets: JSON.parse(localStorage.getItem('tweets')) || initialTweets,
    theme: localStorage.getItem('theme') || 'light',
    profile: JSON.parse(localStorage.getItem('profile')) || defaultProfile,
    notifications: JSON.parse(localStorage.getItem('notifications')) || [],
    messages: JSON.parse(localStorage.getItem('messages')) || {}, // handle -> array of msgs
    activeTab: 'foryou',

    saveData() {
        try {
            localStorage.setItem('tweets', JSON.stringify(this.tweets));
            localStorage.setItem('theme', this.theme);
            localStorage.setItem('profile', JSON.stringify(this.profile));
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
            localStorage.setItem('messages', JSON.stringify(this.messages));
        } catch (e) {
            alert("Storage limit reached! Please delete some tweets with images.");
        }
    }
};

let currentSearchQuery = "";
let currentImageBase64 = null;
let currentChatHandle = null;

// --- DOM Elements ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themeToggleText = document.getElementById('themeToggleText');
const htmlEl = document.documentElement;
const feedContainer = document.getElementById('feed-container');

// Tabs
const tabForYou = document.getElementById('tabForYou');
const tabFollowing = document.getElementById('tabFollowing');

// Composer
const tweetInput = document.getElementById('tweetInput');
const postBtn = document.getElementById('postBtn');
const progressCircle = document.getElementById('progressCircle');
const imageUploadInput = document.getElementById('imageUploadInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageBtn = document.getElementById('removeImageBtn');
const aiPostBtn = document.getElementById('aiPostBtn');

// Auth Overlay
const authOverlay = document.getElementById('authOverlay');
const authUsername = document.getElementById('authUsername');
const authPassword = document.getElementById('authPassword');
const authLoginBtn = document.getElementById('authLoginBtn');

// Profile & Modal
const openProfileModalBtn = document.getElementById('openProfileModalBtn');
const closeProfileModalBtn = document.getElementById('closeProfileModalBtn');
const profileModal = document.getElementById('profileModal');
const profileNameInput = document.getElementById('profileNameInput');
const profileHandleInput = document.getElementById('profileHandleInput');
const avatarUploadInput = document.getElementById('avatarUploadInput');
const modalAvatarPreview = document.getElementById('modalAvatarPreview');
const saveProfileBtn = document.getElementById('saveProfileBtn');

// Search
const searchInput = document.getElementById('searchInput');
const searchResultsDropdown = document.getElementById('searchResultsDropdown');
const searchResultsList = document.getElementById('searchResultsList');

// Trending
const trendingContainer = document.getElementById('trendingContainer');

// Notifications
const openNotificationsBtn = document.getElementById('openNotificationsBtn');
const notifModal = document.getElementById('notifModal');
const closeNotifModalBtn = document.getElementById('closeNotifModalBtn');
const notifContainer = document.getElementById('notifContainer');
const notifBadge = document.getElementById('notifBadge');

// Messages
const openMessagesBtn = document.getElementById('openMessagesBtn');
const messagesModal = document.getElementById('messagesModal');
const closeMessagesModalBtn = document.getElementById('closeMessagesModalBtn');
const chatContactsList = document.getElementById('chatContactsList');
const chatHeader = document.getElementById('chatHeader');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');


const MAX_CHARS = 280;
const CIRCUMFERENCE = 62.8;

// --- Initialization ---
function init() {
    if (!State.profile.following) {
        State.profile.following = ['@techcrunch'];
        State.saveData();
    }

    applyTheme(State.theme);
    updateProfileUI();
    
    // Auth Check
    if (!localStorage.getItem('authToken')) {
        authOverlay.classList.remove('hidden');
    } else {
        authOverlay.classList.add('hidden');
        renderTweets();
        updateTrending();
        updateNotifBadge();
        startTimestampUpdater();
        mockIncomingNotifications();
    }
}

// --- Auth Handling ---
authLoginBtn.addEventListener('click', () => {
    const user = authUsername.value.trim();
    const pass = authPassword.value.trim();
    if (user && pass) {
        localStorage.setItem('authToken', 'mock-jwt-token-12345'); // mock JWT
        authOverlay.classList.add('hidden');
        State.profile.handle = '@' + user.replace(/\s+/g, '').toLowerCase();
        State.profile.name = user;
        State.saveData();
        updateProfileUI();
        renderTweets();
        updateTrending();
        updateNotifBadge();
    } else {
        alert("Please enter a username and password");
    }
});

// --- Theme Handling ---
function applyTheme(theme) {
    if (theme === 'dark') {
        htmlEl.classList.add('dark');
        if (themeToggleText) themeToggleText.textContent = 'Light Mode';
    } else {
        htmlEl.classList.remove('dark');
        if (themeToggleText) themeToggleText.textContent = 'Dark Mode';
    }
}

themeToggleBtn.addEventListener('click', () => {
    State.theme = State.theme === 'dark' ? 'light' : 'dark';
    State.saveData();
    applyTheme(State.theme);
});

// --- AI Post Generator ---
aiPostBtn.addEventListener('click', async () => {
    const originalText = aiPostBtn.innerHTML;
    aiPostBtn.innerHTML = '<span class="text-xs font-bold text-gray-500">...</span>';
    try {
        const res = await fetch('https://dummyjson.com/quotes/random');
        const data = await res.json();
        tweetInput.value = data.quote + " #AIQuote";
        updateComposerUI();
    } catch (e) {
        console.error("AI generator failed", e);
    }
    aiPostBtn.innerHTML = originalText;
});

// --- Tab Handling ---
function switchTab(tab) {
    State.activeTab = tab;
    if (tab === 'foryou') {
        tabForYou.querySelector('span').classList.add('font-bold', 'border-b-4', 'border-[#1d9bf0]');
        tabForYou.querySelector('span').classList.remove('text-gray-500', 'font-medium', 'border-transparent');
        tabFollowing.querySelector('span').classList.remove('font-bold', 'border-b-4', 'border-[#1d9bf0]');
        tabFollowing.querySelector('span').classList.add('text-gray-500', 'font-medium', 'border-transparent');
    } else {
        tabFollowing.querySelector('span').classList.add('font-bold', 'border-b-4', 'border-[#1d9bf0]');
        tabFollowing.querySelector('span').classList.remove('text-gray-500', 'font-medium', 'border-transparent');
        tabForYou.querySelector('span').classList.remove('font-bold', 'border-b-4', 'border-[#1d9bf0]');
        tabForYou.querySelector('span').classList.add('text-gray-500', 'font-medium', 'border-transparent');
    }
    renderTweets();
}

tabForYou.addEventListener('click', () => switchTab('foryou'));
tabFollowing.addEventListener('click', () => switchTab('following'));

// --- Profile Handling ---
function updateProfileUI() {
    document.querySelectorAll('.profile-avatar-img').forEach(img => img.src = State.profile.avatar);
    document.querySelectorAll('.profile-name-text').forEach(el => el.textContent = State.profile.name);
    document.querySelectorAll('.profile-handle-text').forEach(el => el.textContent = State.profile.handle);
    
    profileNameInput.value = State.profile.name;
    profileHandleInput.value = State.profile.handle;
    modalAvatarPreview.src = State.profile.avatar;
}

openProfileModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    profileModal.classList.remove('hidden');
});

closeProfileModalBtn.addEventListener('click', () => profileModal.classList.add('hidden'));

avatarUploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) modalAvatarPreview.src = await compressImage(file);
});

saveProfileBtn.addEventListener('click', () => {
    State.profile.name = profileNameInput.value.trim() || 'User';
    State.profile.handle = profileHandleInput.value.trim().startsWith('@') ? profileHandleInput.value.trim() : '@' + profileHandleInput.value.trim();
    State.profile.avatar = modalAvatarPreview.src;
    State.saveData();
    updateProfileUI();
    profileModal.classList.add('hidden');
    renderTweets();
});


// --- Notifications Handling ---
openNotificationsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    notifModal.classList.remove('hidden');
    // mark all as read
    State.notifications.forEach(n => n.read = true);
    State.saveData();
    updateNotifBadge();
    renderNotifications();
});

closeNotifModalBtn.addEventListener('click', () => notifModal.classList.add('hidden'));

function renderNotifications() {
    notifContainer.innerHTML = '';
    if (State.notifications.length === 0) {
        notifContainer.innerHTML = '<div class="text-center text-gray-500 mt-10">No notifications yet</div>';
        return;
    }
    
    State.notifications.forEach(n => {
        let icon = '';
        let color = '';
        if (n.type === 'like') { icon = 'assets/like.svg'; color = 'bg-pink-500'; }
        else if (n.type === 'repost') { icon = 'assets/repost.svg'; color = 'bg-green-500'; }
        else { icon = 'assets/comment.svg'; color = 'bg-blue-500'; }

        notifContainer.innerHTML += `
            <div class="flex items-start space-x-3 p-3 border-b border-gray-100 dark:border-[#38444d] ${!n.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}">
                <div class="p-2 rounded-full ${color}"><img src="${icon}" class="w-4 h-4 filter-invert"></div>
                <div class="flex-1">
                    <img src="${n.user.avatar}" class="w-8 h-8 rounded-full mb-2">
                    <p><span class="font-bold">${n.user.name}</span> ${n.text}</p>
                    <p class="text-xs text-gray-500 mt-1">${getTimeAgo(n.time)}</p>
                </div>
            </div>
        `;
    });
}

function updateNotifBadge() {
    const unread = State.notifications.filter(n => !n.read).length;
    if (unread > 0) {
        notifBadge.textContent = unread;
        notifBadge.classList.remove('hidden');
    } else {
        notifBadge.classList.add('hidden');
    }
}

function mockIncomingNotifications() {
    // Generate a random notification every 30 seconds to make it feel alive
    setInterval(() => {
        const types = [
            { t: 'like', text: 'liked your post' }, 
            { t: 'repost', text: 'reposted your post' }, 
            { t: 'follow', text: 'followed you' }
        ];
        const user = MOCK_USERS[Math.floor(Math.random() * MOCK_USERS.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        
        State.notifications.unshift({
            id: Date.now(),
            user: user,
            type: type.t,
            text: type.text,
            read: false,
            time: new Date().toISOString()
        });
        State.saveData();
        updateNotifBadge();
        if (!notifModal.classList.contains('hidden')) renderNotifications();
    }, 30000);
}

// --- Messages Handling ---
openMessagesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    messagesModal.classList.remove('hidden');
    renderChatContacts();
});

closeMessagesModalBtn.addEventListener('click', () => messagesModal.classList.add('hidden'));

function renderChatContacts() {
    chatContactsList.innerHTML = '';
    MOCK_USERS.forEach(user => {
        const lastMsgObj = State.messages[user.handle] ? State.messages[user.handle][State.messages[user.handle].length - 1] : null;
        const lastMsg = lastMsgObj ? (lastMsgObj.sender === 'me' ? 'You: ' : '') + lastMsgObj.text : 'Tap to chat';
        
        const div = document.createElement('div');
        div.className = `p-4 border-b border-gray-100 dark:border-[#38444d] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center space-x-3 ${currentChatHandle === user.handle ? 'bg-gray-100 dark:bg-gray-800' : ''}`;
        div.innerHTML = `
            <img src="${user.avatar}" class="w-12 h-12 rounded-full">
            <div class="flex-1 overflow-hidden">
                <div class="flex justify-between items-center">
                    <span class="font-bold">${user.name}</span>
                    <span class="text-xs text-gray-500">${lastMsgObj ? getTimeAgo(lastMsgObj.time) : ''}</span>
                </div>
                <div class="text-sm text-gray-500 truncate">${lastMsg}</div>
            </div>
        `;
        div.addEventListener('click', () => openChat(user));
        chatContactsList.appendChild(div);
    });
}

function openChat(user) {
    currentChatHandle = user.handle;
    renderChatContacts(); // update active state
    
    chatHeader.innerHTML = `
        <img src="${user.avatar}" class="w-8 h-8 rounded-full">
        <span class="font-bold">${user.name}</span>
    `;
    
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    renderChatMessages();
}

function renderChatMessages() {
    chatMessages.innerHTML = '';
    if (!currentChatHandle) return;
    
    const msgs = State.messages[currentChatHandle] || [];
    msgs.forEach(msg => {
        const isMe = msg.sender === 'me';
        chatMessages.innerHTML += `
            <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[70%] rounded-2xl p-3 ${isMe ? 'bg-[#1d9bf0] text-white rounded-br-sm' : 'bg-gray-200 dark:bg-gray-800 rounded-bl-sm'}">
                    ${escapeHTML(msg.text)}
                </div>
            </div>
        `;
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatSendBtn.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });

function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentChatHandle) return;
    
    if (!State.messages[currentChatHandle]) State.messages[currentChatHandle] = [];
    
    State.messages[currentChatHandle].push({
        sender: 'me',
        text: text,
        time: new Date().toISOString()
    });
    State.saveData();
    chatInput.value = '';
    renderChatMessages();
    renderChatContacts();
    
    // Auto reply
    setTimeout(() => {
        State.messages[currentChatHandle].push({
            sender: 'them',
            text: "I'm just a mock user, but thanks for the message! 🤖",
            time: new Date().toISOString()
        });
        State.saveData();
        if (!messagesModal.classList.contains('hidden') && currentChatHandle) {
            renderChatMessages();
            renderChatContacts();
        }
    }, 1000);
}


// --- Search Handling ---
searchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim().toLowerCase();
    
    if (currentSearchQuery.length > 0) {
        searchResultsDropdown.classList.remove('hidden');
        renderSearchResults();
    } else {
        searchResultsDropdown.classList.add('hidden');
    }
    
    renderTweets();
});

document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
        searchResultsDropdown.classList.add('hidden');
    }
});

searchInput.addEventListener('focus', () => {
    if (currentSearchQuery.length > 0) searchResultsDropdown.classList.remove('hidden');
});

function renderSearchResults() {
    searchResultsList.innerHTML = '';
    const matches = MOCK_USERS.filter(u => 
        u.name.toLowerCase().includes(currentSearchQuery) || 
        u.handle.toLowerCase().includes(currentSearchQuery)
    );

    if (matches.length === 0) {
        searchResultsList.innerHTML = `<div class="p-4 text-gray-500 text-center">No accounts found</div>`;
        return;
    }

    matches.forEach(user => {
        const isFollowing = State.profile.following && State.profile.following.includes(user.handle);
        const btnText = isFollowing ? "Following" : "Follow";

        const div = document.createElement('div');
        div.className = "p-3 border-b border-gray-200 dark:border-[#38444d] hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between cursor-pointer transition";
        div.innerHTML = `
            <div class="flex items-center space-x-3">
                <img src="${user.avatar}" class="w-10 h-10 rounded-full">
                <div class="flex flex-col">
                    <span class="font-bold text-sm text-black dark:text-white">${user.name}</span>
                    <span class="text-gray-500 text-sm">${user.handle}</span>
                </div>
            </div>
            <button class="follow-btn font-bold py-1 px-4 rounded-full text-sm transition hover:opacity-80 ${isFollowing ? 'bg-transparent border border-gray-500 text-black dark:text-white' : 'bg-black dark:bg-white text-white dark:text-black'}" data-handle="${user.handle}">
                ${btnText}
            </button>
        `;
        searchResultsList.appendChild(div);
    });
}

searchResultsList.addEventListener('click', (e) => {
    const btn = e.target.closest('.follow-btn');
    if (btn) {
        const handle = btn.dataset.handle;
        if (!State.profile.following) State.profile.following = [];
        
        if (State.profile.following.includes(handle)) {
            State.profile.following = State.profile.following.filter(h => h !== handle);
        } else {
            State.profile.following.push(handle);
        }
        State.saveData();
        renderSearchResults();
        renderTweets();
    }
});


// --- Composer Logic ---
tweetInput.addEventListener('input', updateComposerUI);

function updateComposerUI() {
    const len = tweetInput.value.length;
    const hasText = len > 0 && len <= MAX_CHARS;
    const hasImage = currentImageBase64 !== null;
    
    if (hasText || hasImage) {
        postBtn.disabled = false;
        postBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        postBtn.disabled = true;
        postBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    const percentage = len / MAX_CHARS;
    const offset = CIRCUMFERENCE - (percentage * CIRCUMFERENCE);
    progressCircle.style.strokeDashoffset = Math.max(0, offset);

    if (len > MAX_CHARS) {
        progressCircle.setAttribute('stroke', '#f4212e');
    } else if (MAX_CHARS - len <= 20) {
        progressCircle.setAttribute('stroke', '#ffd400');
    } else {
        progressCircle.setAttribute('stroke', '#1d9bf0');
    }
}

imageUploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        currentImageBase64 = await compressImage(file);
        imagePreview.src = currentImageBase64;
        imagePreviewContainer.classList.remove('hidden');
        updateComposerUI();
    }
});

removeImageBtn.addEventListener('click', () => {
    currentImageBase64 = null;
    imagePreviewContainer.classList.add('hidden');
    imageUploadInput.value = '';
    updateComposerUI();
});

postBtn.addEventListener('click', () => {
    const content = tweetInput.value.trim();
    if ((!content || content.length > MAX_CHARS) && !currentImageBase64) return;

    const newTweet = {
        id: Date.now().toString(),
        author: State.profile.name,
        handle: State.profile.handle,
        avatar: State.profile.avatar,
        content: content,
        image: currentImageBase64,
        timestamp: new Date().toISOString(),
        likes: 0, reposts: 0, bookmarks: 0, liked: false, reposted: false, bookmarked: false, replies: []
    };

    State.tweets.unshift(newTweet);
    State.saveData();
    
    tweetInput.value = '';
    currentImageBase64 = null;
    imagePreviewContainer.classList.add('hidden');
    imageUploadInput.value = '';
    updateComposerUI();
    
    renderTweets();
    updateTrending(); // update hashtags
});

// --- Dynamic Trending ---
function updateTrending() {
    if (!trendingContainer) return;
    const hashtags = {};
    State.tweets.forEach(t => {
        const matches = (t.content || '').match(/#\w+/g);
        if (matches) {
            matches.forEach(tag => {
                hashtags[tag] = (hashtags[tag] || 0) + 1;
            });
        }
    });
    
    const sorted = Object.entries(hashtags).sort((a,b) => b[1] - a[1]).slice(0, 3);
    
    trendingContainer.innerHTML = '';
    if (sorted.length === 0) {
        trendingContainer.innerHTML = '<p class="text-gray-500">No trending topics yet.</p>';
        return;
    }
    
    sorted.forEach(([tag, count], i) => {
        // give fake engagement numbers for visual flair
        const engagement = Math.floor(count * 4521 + Math.random() * 1000);
        trendingContainer.innerHTML += `
            <div class="flex justify-between cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 transition -mx-4 px-4 py-2">
                <div>
                    <p class="text-sm text-gray-500">${i+1} · Trending</p>
                    <p class="font-bold">${escapeHTML(tag)}</p>
                    <p class="text-sm text-gray-500">${engagement.toLocaleString()} posts</p>
                </div>
                <div class="text-gray-500 hover:text-[#1d9bf0] font-bold">···</div>
            </div>
        `;
    });
}


// --- Rendering ---
function renderTweets() {
    if (!feedContainer) return;
    feedContainer.innerHTML = '';
    
    let displayTweets = State.tweets;
    
    // Tab Filtering
    if (State.activeTab === 'following') {
        const followedHandles = State.profile.following || [];
        displayTweets = displayTweets.filter(t => 
            t.handle === State.profile.handle || followedHandles.includes(t.handle)
        );
    }

    // Search Filtering
    if (currentSearchQuery) {
        displayTweets = displayTweets.filter(t => {
            const contentStr = t.content || '';
            const authorStr = t.author || '';
            const handleStr = t.handle || '';
            return contentStr.toLowerCase().includes(currentSearchQuery) || 
                   authorStr.toLowerCase().includes(currentSearchQuery) || 
                   handleStr.toLowerCase().includes(currentSearchQuery);
        });
    }
    
    displayTweets.forEach(tweet => {
        const timeAgo = getTimeAgo(tweet.timestamp);
        
        let imageHTML = '';
        if (tweet.image) {
            imageHTML = `<img src="${tweet.image}" class="mt-3 rounded-2xl max-h-96 object-cover border border-gray-200 dark:border-[#38444d] w-full">`;
        }

        let repliesHTML = '';
        if (tweet.replies && tweet.replies.length > 0) {
            repliesHTML = `<div class="mt-3 pl-4 border-l-2 border-gray-200 dark:border-[#38444d] flex flex-col space-y-3">`;
            tweet.replies.forEach(reply => {
                repliesHTML += `
                    <div class="flex space-x-2">
                        <img src="${reply.avatar}" class="w-6 h-6 rounded-full object-cover">
                        <div class="flex-1">
                            <span class="font-bold text-sm">${escapeHTML(reply.author)}</span>
                            <span class="text-gray-500 text-xs">${escapeHTML(reply.handle)} · <span class="time-ago" data-timestamp="${reply.timestamp}">${getTimeAgo(reply.timestamp)}</span></span>
                            <div class="text-sm">${escapeHTML(reply.content)}</div>
                        </div>
                    </div>
                `;
            });
            repliesHTML += `</div>`;
        }
        
        // Highlight hashtags
        let formattedContent = escapeHTML(tweet.content).replace(/(#\w+)/g, '<span class="text-[#1d9bf0] hover:underline cursor-pointer">$1</span>');
        
        const tweetHTML = `
            <div class="border-b border-gray-200 dark:border-[#38444d] p-4 hover:bg-gray-50 dark:hover:bg-[#1c2732] transition cursor-pointer" data-id="${tweet.id}">
                <div class="flex space-x-3">
                    <img src="${tweet.avatar}" alt="Avatar" class="w-10 h-10 rounded-full object-cover">
                    <div class="flex-1 overflow-hidden">
                        <div class="flex items-center space-x-1">
                            <span class="font-bold hover:underline truncate max-w-[120px] sm:max-w-none">${escapeHTML(tweet.author)}</span>
                            ${MOCK_USERS.some(u => u.handle === tweet.handle) ? `<svg viewBox="0 0 24 24" class="w-[18px] h-[18px] text-[#1d9bf0] fill-current"><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.46.75 2.76 1.87 3.45-.05.22-.08.45-.08.69 0 2.21 1.71 4 3.918 4 .626 0 1.218-.145 1.748-.4.542 1.26 1.795 2.14 3.25 2.14 1.455 0 2.708-.88 3.25-2.14.53.255 1.122.4 1.748.4 2.21 0 3.918-1.79 3.918-4 0-.24-.03-.47-.08-.69 1.12-.69 1.87-1.99 1.87-3.45zm-10.96 4.31l-3.59-3.59 1.41-1.41 2.18 2.18 5.67-5.67 1.41 1.41-7.08 7.08z"></path></svg>` : ''}
                            <span class="text-gray-500 truncate max-w-[100px] sm:max-w-none">${escapeHTML(tweet.handle)}</span>
                            <span class="text-gray-500">·</span>
                            <span class="text-gray-500 hover:underline time-ago" data-timestamp="${tweet.timestamp}">${timeAgo}</span>
                            <div class="ml-auto flex items-center">
                                <button class="action-btn text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition" data-action="delete">
                                    <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current pointer-events-none"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                </button>
                            </div>
                        </div>
                        <div class="mt-1 text-[15px] whitespace-pre-wrap">${formattedContent}</div>
                        
                        ${imageHTML}
                        
                        <div class="flex justify-between mt-3 text-gray-500 max-w-md">
                            <div class="flex items-center space-x-2 group action-btn" data-action="reply">
                                <div class="p-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-[#1d9bf0] rounded-full transition pointer-events-none">
                                    <img src="assets/comment.svg" alt="Comment" class="w-5 h-5 dark:filter-invert group-hover:filter-none">
                                </div>
                                <span class="text-sm group-hover:text-[#1d9bf0] transition pointer-events-none">${tweet.replies ? tweet.replies.length : 0}</span>
                            </div>
                            
                            <div class="flex items-center space-x-2 group action-btn ${tweet.reposted ? 'text-green-500' : ''}" data-action="repost">
                                <div class="p-2 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 group-hover:text-green-500 rounded-full transition pointer-events-none">
                                    <img src="assets/repost.svg" alt="Repost" class="w-5 h-5 dark:filter-invert group-hover:filter-none ${tweet.reposted ? 'filter-none filter-green' : ''}">
                                </div>
                                <span class="text-sm group-hover:text-green-500 transition pointer-events-none">${tweet.reposts}</span>
                            </div>
                            
                            <div class="flex items-center space-x-2 group action-btn ${tweet.liked ? 'text-pink-500' : ''}" data-action="like">
                                <div class="p-2 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30 group-hover:text-pink-500 rounded-full transition pointer-events-none">
                                    <img src="assets/like.svg" alt="Like" class="w-5 h-5 dark:filter-invert group-hover:filter-none ${tweet.liked ? 'filter-none filter-pink' : ''}">
                                </div>
                                <span class="text-sm group-hover:text-pink-500 transition pointer-events-none">${tweet.likes}</span>
                            </div>
                            
                            <div class="flex items-center space-x-2 group action-btn ${tweet.bookmarked ? 'text-blue-500' : ''}" data-action="bookmark">
                                <div class="p-2 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-[#1d9bf0] rounded-full transition pointer-events-none">
                                    <img src="assets/bookmark.svg" alt="Bookmark" class="w-5 h-5 dark:filter-invert group-hover:filter-none ${tweet.bookmarked ? 'filter-none filter-blue' : ''}">
                                </div>
                                <span class="text-sm group-hover:text-[#1d9bf0] transition pointer-events-none">${tweet.bookmarks}</span>
                            </div>
                        </div>

                        <div class="reply-container hidden mt-3 flex space-x-2">
                            <input type="text" class="reply-input flex-1 bg-transparent border-b border-[#1d9bf0] outline-none text-sm py-1" placeholder="Post your reply...">
                            <button class="reply-submit-btn bg-[#1d9bf0] text-white text-xs font-bold py-1 px-3 rounded-full hover:bg-[#1a8cd8]">Reply</button>
                        </div>

                        ${repliesHTML}
                    </div>
                </div>
            </div>
        `;
        feedContainer.insertAdjacentHTML('beforeend', tweetHTML);
    });
}

// --- Interactions Event Delegation ---
if (feedContainer) {
    feedContainer.addEventListener('click', (e) => {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) {
            if (e.target.classList.contains('reply-submit-btn')) {
                handleReplySubmit(e);
            }
            return;
        }
        
        e.stopPropagation();
        
        const tweetEl = actionBtn.closest('[data-id]');
        if (!tweetEl) return;
        
        const id = tweetEl.dataset.id;
        const tweet = State.tweets.find(t => t.id === id);
        if (!tweet) return;

        const action = actionBtn.dataset.action;

        switch (action) {
            case 'like':
                tweet.liked = !tweet.liked;
                tweet.likes += tweet.liked ? 1 : -1;
                break;
            case 'repost':
                tweet.reposted = !tweet.reposted;
                tweet.reposts += tweet.reposted ? 1 : -1;
                break;
            case 'bookmark':
                tweet.bookmarked = !tweet.bookmarked;
                tweet.bookmarks += tweet.bookmarked ? 1 : -1;
                break;
            case 'delete':
                State.tweets = State.tweets.filter(t => t.id !== id);
                updateTrending(); // update trending
                break;
            case 'reply':
                const replyContainer = tweetEl.querySelector('.reply-container');
                replyContainer.classList.toggle('hidden');
                if (!replyContainer.classList.contains('hidden')) {
                    replyContainer.querySelector('.reply-input').focus();
                }
                return;
        }

        State.saveData();
        renderTweets();
    });
}

function handleReplySubmit(e) {
    e.stopPropagation();
    const tweetEl = e.target.closest('[data-id]');
    const input = tweetEl.querySelector('.reply-input');
    const content = input.value.trim();
    if (!content) return;

    const id = tweetEl.dataset.id;
    const tweet = State.tweets.find(t => t.id === id);
    
    if (!tweet.replies) tweet.replies = [];
    
    tweet.replies.push({
        author: State.profile.name,
        handle: State.profile.handle,
        avatar: State.profile.avatar,
        content: content,
        timestamp: new Date().toISOString()
    });

    State.saveData();
    renderTweets();
}

// --- Utilities ---
function getTimeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval >= 1) return Math.floor(interval) + 'y';
    interval = seconds / 2592000;
    if (interval >= 1) return Math.floor(interval) + 'mo';
    interval = seconds / 86400;
    if (interval >= 1) return Math.floor(interval) + 'd';
    interval = seconds / 3600;
    if (interval >= 1) return Math.floor(interval) + 'h';
    interval = seconds / 60;
    if (interval >= 1) return Math.floor(interval) + 'm';
    return Math.max(0, Math.floor(seconds)) + 's';
}

function startTimestampUpdater() {
    setInterval(() => {
        document.querySelectorAll('.time-ago').forEach(el => {
            const ts = el.dataset.timestamp;
            if (ts) el.textContent = getTimeAgo(ts);
        });
    }, 30000);
}

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

function compressImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
        };
    });
}

// --- Start ---
init();
