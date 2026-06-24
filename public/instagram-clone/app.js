/* GLOBAL CONTROLLERS & INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
  // Initialize dashboard UI directly as there is no login portal
  initAppDashboard();
});

function simulateLogout() {
  const loader = document.getElementById("app-global-loader");
  loader.classList.remove("hide");

  setTimeout(() => {
    // Reloading the page resets the session data and simulates logging out cleanly
    location.reload();
  }, 1500);
}

/* 4. DASHBOARD RENDERERS */
function initAppDashboard() {
  // 1. Update Current User details in headers
  document
    .querySelectorAll("#logged-in-username")
    .forEach((el) => (el.textContent = INSTAGRAM_DB.currentUser.username));
  document
    .querySelectorAll("#logged-in-username-dm")
    .forEach((el) => (el.textContent = INSTAGRAM_DB.currentUser.username));
  document
    .querySelectorAll("#logged-in-fullname")
    .forEach((el) => (el.textContent = INSTAGRAM_DB.currentUser.fullname));

  // 2. Render Stories Tray
  renderStoriesTray();

  // 3. Render Feed Posts
  renderFeedPosts();

  // 4. Render Sidebar Suggestions
  renderSuggestions();

  // 5. Render Explore Grid
  renderExploreGrid();

  // 6. Render Reels
  renderReels();

  // 7. Render Messaging Threads
  renderChatThreads();

  // 8. Render Profile Grid
  renderProfilePosts();
}

// stories
function renderStoriesTray() {
  const container = document.getElementById("stories-container");
  container.innerHTML = "";

  // Render logged in user story creator first
  const myStoryItem = document.createElement("div");
  myStoryItem.className = "story-item viewed";
  myStoryItem.innerHTML = `
        <div class="story-avatar-wrapper">
            <img src="${INSTAGRAM_DB.currentUser.avatar}" alt="Your avatar">
        </div>
        <span class="story-username">Your story</span>
    `;
  myStoryItem.onclick = () =>
    alert("You don't have active stories. Click 'Create' to upload a post!");
  container.appendChild(myStoryItem);

  // Render other stories
  INSTAGRAM_DB.stories.forEach((story, idx) => {
    const item = document.createElement("div");
    item.className = `story-item ${story.viewed ? "viewed" : ""}`;
    item.innerHTML = `
            <div class="story-avatar-wrapper">
                <img src="${story.avatar}" alt="${story.username}">
            </div>
            <span class="story-username">${story.username}</span>
        `;
    item.onclick = () => openStoryViewer(idx);
    container.appendChild(item);
  });
}

// suggestions sidebar
function renderSuggestions() {
  const list = document.getElementById("suggestions-list");
  list.innerHTML = "";

  const mockSuggestions = [
    {
      username: "john_doe",
      avatar: "assets/images/user_avatar.png",
      relation: "Popular near you",
    },
    {
      username: "chef_master",
      avatar: "assets/images/cafe_flatlay.png",
      relation: "Follows travel_guru",
    },
    {
      username: "wanderer",
      avatar: "assets/images/travel_amalfi.png",
      relation: "New to Instagram",
    },
  ];

  mockSuggestions.forEach((sug) => {
    const item = document.createElement("div");
    item.className = "suggestion-item";
    item.innerHTML = `
            <div class="suggestion-user-info">
                <img src="${sug.avatar}" alt="${sug.username}">
                <div class="names">
                    <span class="username">${sug.username}</span>
                    <span class="relation">${sug.relation}</span>
                </div>
            </div>
            <button class="btn-text-action" onclick="toggleFollowBtn(this)">Follow</button>
        `;
    list.appendChild(item);
  });
}

function toggleFollowBtn(btn) {
  if (btn.textContent === "Follow") {
    btn.textContent = "Following";
    btn.style.color = "var(--text-secondary)";
  } else {
    btn.textContent = "Follow";
    btn.style.color = "var(--ig-blue)";
  }
}

// Feed posts rendering
function renderFeedPosts() {
  const container = document.getElementById("feed-posts-container");
  container.innerHTML = "";

  INSTAGRAM_DB.posts.forEach((post, index) => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.dataset.postId = post.id;

    let commentsHTML = "";
    post.comments.forEach((c) => {
      commentsHTML += `
                <div class="comment-line">
                    <span class="username">${c.username}</span>
                    <span>${c.text}</span>
                </div>
            `;
    });

    card.innerHTML = `
            <div class="post-header">
                <div class="post-user-info" onclick="viewUserProfile('${post.user.username}')">
                    <img src="${post.user.avatar}" alt="${post.user.username}" class="post-avatar">
                    <div class="names">
                        <span class="username">${post.user.username}</span>
                        <span class="location">${post.user.location}</span>
                    </div>
                </div>
                <button class="btn-post-options"><i class="fa-solid fa-ellipsis"></i></button>
            </div>
            <div class="post-media-container" ondblclick="triggerDoubleTapLike(this, '${post.id}')">
                <img src="${post.mediaUrl}" alt="Post Content">
                <i class="fa-solid fa-heart double-tap-heart"></i>
            </div>
            <div class="post-actions">
                <div class="post-actions-left">
                    <button onclick="toggleLike('${post.id}', this)" class="${post.liked ? "liked" : ""}">
                        <i class="${post.liked ? "fa-solid fa-heart" : "fa-regular fa-heart"}"></i>
                    </button>
                    <button onclick="focusCommentInput(this)"><i class="fa-regular fa-comment"></i></button>
                    <button onclick="sharePost('${post.id}')"><i class="fa-regular fa-paper-plane"></i></button>
                </div>
                <button onclick="toggleBookmark('${post.id}', this)">
                    <i class="${post.bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}"></i>
                </button>
            </div>
            <div class="post-details">
                <div class="likes-count" id="likes-count-${post.id}">${post.likes.toLocaleString()} likes</div>
                <div class="post-caption">
                    <span class="username" onclick="viewUserProfile('${post.user.username}')">${post.user.username}</span>
                    <span>${post.caption}</span>
                </div>
                <div class="comments-preview" id="comments-preview-${post.id}">
                    ${post.comments.length > 2 ? `<div class="view-all-comments" onclick="openPostDetailsModal('${post.id}')">View all ${post.comments.length} comments</div>` : ""}
                    ${commentsHTML}
                </div>
                <div class="post-time">${post.time}</div>
            </div>
            <div class="post-add-comment">
                <i class="fa-regular fa-face-smile"></i>
                <input type="text" placeholder="Add a comment..." onkeydown="handleCommentKeyDown(event, '${post.id}')">
                <button class="btn-text-send" onclick="submitComment(this, '${post.id}')">Post</button>
            </div>
        `;

    container.appendChild(card);
  });
}

/* 5. USER TAB SWITCHER (SPA ROUTING) */
function switchTab(tabName, event) {
  if (event) event.preventDefault();

  // Hide all views
  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.add("hide");
  });

  // Show target view
  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) targetView.classList.remove("hide");

  // Update active nav link
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
    // Update home/explore/reels/messages/profile icon classes if needed
  });

  const activeLink = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  if (activeLink) activeLink.classList.add("active");

  // Close drawers if switching tabs
  closeAllDrawers();

  // Scroll window back to top
  window.scrollTo({ top: 0 });

  // Specific tab activations
  if (tabName === "profile") {
    renderProfilePosts();
  } else if (tabName === "explore") {
    renderExploreGrid();
  } else if (tabName === "messages") {
    selectFirstChat();
  }
}

/* 6. DRAWERS (Search & Notifications drawers) */
let activeDrawer = null;

function toggleDrawer(drawerName, event) {
  if (event) event.preventDefault();

  const drawer = document.getElementById(`${drawerName}-drawer`);

  // If clicking already open drawer, close it
  if (activeDrawer === drawerName) {
    closeAllDrawers();
    return;
  }

  // Close existing drawer first
  closeAllDrawers();

  // Open new drawer
  drawer.classList.remove("hide");
  activeDrawer = drawerName;

  // Highlight sidebar icon
  const activeLink = document.querySelector(
    `.nav-item[data-drawer="${drawerName}"]`,
  );
  if (activeLink) activeLink.classList.add("active");

  // Collapse sidebar for drawer visibility
  document.querySelector(".sidebar").style.width = "72px";
  document.querySelector(".sidebar-logo").style.display = "none";
  document.querySelector(".sidebar-logo-icon").style.display = "inline-block";
  document.querySelector(".app-main-content").style.marginLeft = "72px";
  document.querySelectorAll(".nav-item span").forEach((span) => {
    span.style.display = "none";
  });

  // Load drawer content
  if (drawerName === "search") {
    renderRecentSearches();
    document.getElementById("drawer-search-input").focus();
  } else if (drawerName === "notifications") {
    renderNotifications();
    // Remove badge dot
    document.getElementById("notification-dot").classList.add("hide");
  }
}

function closeAllDrawers() {
  document.querySelectorAll(".sidebar-drawer").forEach((drawer) => {
    drawer.classList.add("hide");
  });
  activeDrawer = null;

  // Reset sidebar width unless screen size forces collapsed state
  if (window.innerWidth > 1260) {
    document.querySelector(".sidebar").style.width = "244px";
    document.querySelector(".sidebar-logo").style.display = "block";
    document.querySelector(".sidebar-logo-icon").style.display = "none";
    document.querySelector(".app-main-content").style.marginLeft = "244px";
    document.querySelectorAll(".nav-item span").forEach((span) => {
      span.style.display = "flex";
    });
  }
  // Remove active link from drawer indicators
  document.querySelectorAll(".nav-item[data-drawer]").forEach((item) => {
    item.classList.remove("active");
  });

  // Re-active current view link
  const currentView = document
    .querySelector(".app-view:not(.hide)")
    .id.replace("view-", "");
  const activeLink = document.querySelector(
    `.nav-item[data-tab="${currentView}"]`,
  );
  if (activeLink) activeLink.classList.add("active");
}

// Search actions
function renderRecentSearches() {
  const container = document.getElementById("search-recent-list");
  container.innerHTML = "";

  if (INSTAGRAM_DB.searchHistory.length === 0) {
    container.innerHTML = `<p class="field-hint" style="padding: 20px; text-align:center;">No recent searches.</p>`;
    return;
  }

  INSTAGRAM_DB.searchHistory.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "drawer-user-item";
    row.innerHTML = `
            <div class="user-item-info" onclick="viewUserProfile('${item.username}')">
                <img src="${item.avatar}" alt="${item.username}">
                <div class="names">
                    <span class="username">${item.username}</span>
                    <span class="fullname">${item.fullname}</span>
                </div>
            </div>
            <button class="btn-remove-recent" onclick="removeRecentSearch(${index}, event)"><i class="fa-solid fa-xmark"></i></button>
        `;
    container.appendChild(row);
  });
}

function handleSearchQuery(query) {
  const listRecent = document.getElementById("search-recent-list");
  const listResults = document.getElementById("search-results-list");
  const container = document.getElementById("search-results-list");

  if (!query.trim()) {
    listRecent.classList.remove("hide");
    listResults.classList.add("hide");
    return;
  }

  listRecent.classList.add("hide");
  listResults.classList.remove("hide");
  container.innerHTML = "";

  // Filter from users
  const allUsers = [
    {
      username: "travel_guru",
      fullname: "Marco Polo",
      avatar: "assets/images/travel_amalfi.png",
    },
    {
      username: "cafe_lover",
      fullname: "Sophia Loren",
      avatar: "assets/images/cafe_flatlay.png",
    },
    {
      username: "nature_wild",
      fullname: "Jane Goodall",
      avatar: "assets/images/mountain_sunset.png",
    },
    {
      username: "pixel_pioneer",
      fullname: "Grace Hopper",
      avatar: "assets/images/user_avatar.png",
    },
  ];

  const filtered = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.fullname.toLowerCase().includes(query.toLowerCase()),
  );

  if (filtered.length === 0) {
    container.innerHTML = `<p class="field-hint" style="padding: 20px; text-align:center;">No results found.</p>`;
    return;
  }

  filtered.forEach((u) => {
    const row = document.createElement("div");
    row.className = "drawer-user-item";
    row.innerHTML = `
            <div class="user-item-info" onclick="addSearchHistory('${u.username}'); viewUserProfile('${u.username}')">
                <img src="${u.avatar}" alt="${u.username}">
                <div class="names">
                    <span class="username">${u.username}</span>
                    <span class="fullname">${u.fullname}</span>
                </div>
            </div>
        `;
    container.appendChild(row);
  });
}

function addSearchHistory(username) {
  const allUsers = [
    {
      username: "travel_guru",
      fullname: "Marco Polo",
      avatar: "assets/images/travel_amalfi.png",
    },
    {
      username: "cafe_lover",
      fullname: "Sophia Loren",
      avatar: "assets/images/cafe_flatlay.png",
    },
    {
      username: "nature_wild",
      fullname: "Jane Goodall",
      avatar: "assets/images/mountain_sunset.png",
    },
    {
      username: "pixel_pioneer",
      fullname: "Grace Hopper",
      avatar: "assets/images/user_avatar.png",
    },
  ];

  const matched = allUsers.find((u) => u.username === username);
  if (!matched) return;

  // Remove if already exists to push to top
  INSTAGRAM_DB.searchHistory = INSTAGRAM_DB.searchHistory.filter(
    (h) => h.username !== username,
  );
  INSTAGRAM_DB.searchHistory.unshift(matched);
}

function removeRecentSearch(index, event) {
  if (event) event.stopPropagation();
  INSTAGRAM_DB.searchHistory.splice(index, 1);
  renderRecentSearches();
}

function clearAllRecentSearch() {
  INSTAGRAM_DB.searchHistory = [];
  renderRecentSearches();
}

function clearSearchInput() {
  const inp = document.getElementById("drawer-search-input");
  inp.value = "";
  handleSearchQuery("");
  inp.focus();
}

// Notifications Actions
function renderNotifications() {
  const containerWeek = document.getElementById("notification-list-week");
  const containerEarlier = document.getElementById("notification-list-earlier");

  containerWeek.innerHTML = "";
  containerEarlier.innerHTML = "";

  INSTAGRAM_DB.notifications.forEach((notif) => {
    const item = document.createElement("div");
    item.className = "notification-item";

    let rightActionHTML = "";
    if (notif.postImg) {
      rightActionHTML = `<img src="${notif.postImg}" alt="Post thumbnail" class="notification-post-img">`;
    } else if (notif.type === "follow") {
      rightActionHTML = `<button class="btn-secondary" style="padding: 4px 12px; font-size:12px;" onclick="toggleFollowBtn(this)">Following</button>`;
    }

    item.innerHTML = `
            <div class="user-item-info">
                <img src="${notif.avatar}" alt="${notif.username}" style="width: 44px; height: 44px; border-radius:50%; object-fit:cover;">
                <div class="notification-text">
                    <strong>${notif.username}</strong> ${notif.text} <span style="color: var(--text-secondary); font-size:12px;">${notif.timeframe}</span>
                </div>
            </div>
            ${rightActionHTML}
        `;

    // Distribute weekly vs earlier mockingly
    if (notif.timeframe.includes("h")) {
      containerWeek.appendChild(item);
    } else {
      containerEarlier.appendChild(item);
    }
  });
}

/* 7. LIKE & COMMENT CORE INTERACTIONS */
function toggleLike(postId, btn) {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  post.liked = !post.liked;
  if (post.liked) {
    post.likes += 1;
    btn.classList.add("liked");
    btn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
  } else {
    post.likes -= 1;
    btn.classList.remove("liked");
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }

  // Update label count
  const likesLabel = document.getElementById(`likes-count-${postId}`);
  if (likesLabel)
    likesLabel.textContent = `${post.likes.toLocaleString()} likes`;
}

function triggerDoubleTapLike(container, postId) {
  const heart = container.querySelector(".double-tap-heart");
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  // Only increment like if not already liked
  if (!post.liked) {
    post.liked = true;
    post.likes += 1;

    // Find corresponding action buttons to update color
    const postCard = container.closest(".post-card");
    if (postCard) {
      const likeBtn = postCard.querySelector(
        ".post-actions-left button:first-child",
      );
      likeBtn.classList.add("liked");
      likeBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
    }

    const likesLabel = document.getElementById(`likes-count-${postId}`);
    if (likesLabel)
      likesLabel.textContent = `${post.likes.toLocaleString()} likes`;
  }

  // Pop heart animation
  heart.classList.add("animate");
  setTimeout(() => {
    heart.classList.remove("animate");
  }, 800);
}

function toggleBookmark(postId, btn) {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  post.bookmarked = !post.bookmarked;
  if (post.bookmarked) {
    btn.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
    // Add to saved array
    if (!INSTAGRAM_DB.currentUser.saved.includes(post)) {
      INSTAGRAM_DB.currentUser.saved.push(post);
    }
  } else {
    btn.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
    // Remove from saved array
    INSTAGRAM_DB.currentUser.saved = INSTAGRAM_DB.currentUser.saved.filter(
      (p) => p.id !== postId,
    );
  }
}

function focusCommentInput(btn) {
  const postCard = btn.closest(".post-card");
  const input = postCard.querySelector(".post-add-comment input");
  input.focus();
}

function handleCommentKeyDown(event, postId) {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = event.target;
    submitComment(input, postId);
  }
}

function submitComment(btnOrInput, postId) {
  let input;
  if (btnOrInput.tagName === "INPUT") {
    input = btnOrInput;
  } else {
    input = btnOrInput.previousElementSibling;
  }

  const text = input.value.trim();
  if (!text) return;

  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  // Add comment to database
  post.comments.push({
    username: INSTAGRAM_DB.currentUser.username,
    text: text,
  });

  // Clear input
  input.value = "";

  // Rerender specific comments block
  const commentBox = document.getElementById(`comments-preview-${postId}`);
  let commentsHTML = "";

  // Show view all link if appropriate
  if (post.comments.length > 2) {
    commentsHTML += `<div class="view-all-comments" onclick="openPostDetailsModal('${post.id}')">View all ${post.comments.length} comments</div>`;
  }

  // Render last 3 comments
  const sliceComments = post.comments.slice(-3);
  sliceComments.forEach((c) => {
    commentsHTML += `
            <div class="comment-line">
                <span class="username">${c.username}</span>
                <span>${c.text}</span>
            </div>
        `;
  });

  commentBox.innerHTML = commentsHTML;
}

function sharePost(postId) {
  alert(`Post shared to simulated clipboard!`);
}

/* 8. EXPLORE GRID VIEWPORT */
function renderExploreGrid() {
  const grid = document.getElementById("explore-grid");
  grid.innerHTML = "";

  // Mix and match posts to create a big grid
  const allItems = [
    ...INSTAGRAM_DB.posts,
    ...INSTAGRAM_DB.posts,
    ...INSTAGRAM_DB.posts,
  ];

  allItems.forEach((post, index) => {
    const item = document.createElement("div");
    item.className = "grid-item";
    item.onclick = () => openPostDetailsModal(post.id);
    item.innerHTML = `
            <img src="${post.mediaUrl}" alt="Explore item">
            <div class="grid-item-overlay">
                <div class="grid-overlay-stat"><i class="fa-solid fa-heart"></i> ${post.likes}</div>
                <div class="grid-overlay-stat"><i class="fa-solid fa-comment"></i> ${post.comments.length}</div>
            </div>
        `;
    grid.appendChild(item);
  });
}

/* 9. REELS TABS VIEWER */
function renderReels() {
  const container = document.getElementById("reels-container");
  container.innerHTML = "";

  INSTAGRAM_DB.reels.forEach((reel) => {
    const card = document.createElement("div");
    card.className = "reel-card";
    card.innerHTML = `
            <div class="reel-video-container">
                <img src="${reel.mediaUrl}" alt="Reel Frame">
                <div class="reel-overlay-info">
                    <div class="reel-user-row">
                        <img src="${reel.user.avatar}" alt="${reel.user.username}">
                        <span class="username">${reel.user.username}</span>
                        <button class="follow-btn" onclick="toggleFollowBtn(this)">Follow</button>
                    </div>
                    <div class="reel-caption">${reel.caption}</div>
                    <div class="reel-music"><i class="fa-solid fa-music"></i> ${reel.musicName}</div>
                </div>
                <div class="reel-side-actions">
                    <button class="reel-action-btn ${reel.liked ? "liked" : ""}" onclick="toggleReelLike(this)">
                        <i class="fa-solid fa-heart"></i>
                        <span>${reel.likes}</span>
                    </button>
                    <button class="reel-action-btn" onclick="alert('Reel comments box coming soon!')">
                        <i class="fa-solid fa-comment"></i>
                        <span>${reel.commentsCount}</span>
                    </button>
                    <button class="reel-action-btn" onclick="alert('Shared Reel!')">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                    <button class="reel-action-btn" onclick="toggleReelBookmark(this)">
                        <i class="fa-regular fa-bookmark"></i>
                    </button>
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

function toggleReelLike(btn) {
  btn.classList.toggle("liked");
  const icon = btn.querySelector("i");
  const span = btn.querySelector("span");

  if (btn.classList.contains("liked")) {
    icon.style.color = "var(--ig-red)";
    span.textContent = "Liked";
  } else {
    icon.style.color = "#fff";
    span.textContent = "12K";
  }
}

function toggleReelBookmark(btn) {
  const icon = btn.querySelector("i");
  if (icon.classList.contains("fa-regular")) {
    icon.className = "fa-solid fa-bookmark";
  } else {
    icon.className = "fa-regular fa-bookmark";
  }
}

/* 10. DIRECT MESSAGES CHAT SYSTEM */
let activeChatIndex = 0;

function renderChatThreads() {
  const container = document.getElementById("chat-threads-container");
  container.innerHTML = "";

  INSTAGRAM_DB.chats.forEach((chat, index) => {
    const lastMsg = chat.messages[chat.messages.length - 1];
    const lastMsgText = lastMsg ? lastMsg.text : "No messages yet";

    const item = document.createElement("div");
    item.className = `chat-thread-item ${index === activeChatIndex ? "active" : ""} ${chat.unread ? "unread" : ""}`;
    item.onclick = () => selectChat(index);
    item.innerHTML = `
            <img src="${chat.user.avatar}" alt="${chat.user.username}" class="chat-avatar">
            <div class="thread-details">
                <span class="name">${chat.user.fullname}</span>
                <div class="message-preview-row">
                    <span class="message-preview">${lastMsg.sender === "self" ? "You: " : ""}${lastMsgText}</span>
                    <span>• 1h</span>
                </div>
            </div>
        `;
    container.appendChild(item);
  });
}

function selectFirstChat() {
  selectChat(0);
}

function selectChat(index) {
  activeChatIndex = index;
  const chat = INSTAGRAM_DB.chats[index];
  if (!chat) return;

  chat.unread = false; // Mark read

  // Update thread items active background
  renderChatThreads();

  // Show active panel
  document.getElementById("chat-empty-state").classList.add("hide");
  const activePanel = document.getElementById("chat-active-state");
  activePanel.classList.remove("hide");

  // Mobile sliding view support
  if (window.innerWidth < 768) {
    document
      .querySelector(".chat-conversation-panel")
      .classList.add("open-mobile");
  }

  // Header config
  document.getElementById("chat-header-avatar").src = chat.user.avatar;
  document.getElementById("chat-header-name").textContent = chat.user.fullname;
  document.getElementById("chat-header-status").textContent = chat.user.status;

  // Clear & render messages
  const log = document.getElementById("chat-messages-log");
  log.innerHTML = "";

  chat.messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${msg.sender}`;
    bubble.textContent = msg.text;
    log.appendChild(bubble);
  });

  // Scroll to bottom
  scrollToChatBottom();
}

function scrollToChatBottom() {
  const log = document.getElementById("chat-messages-log");
  log.scrollTop = log.scrollHeight;
}

// Typing Send toggles
const chatInput = document.getElementById("chat-input-message");
if (chatInput) {
  chatInput.addEventListener("input", () => {
    const sendBtn = document.getElementById("btn-chat-send");
    if (chatInput.value.trim()) {
      sendBtn.classList.remove("hide");
    } else {
      sendBtn.classList.add("hide");
    }
  });
}

function handleChatInputKeyDown(event) {
  if (event.key === "Enter") {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById("chat-input-message");
  const text = input.value.trim();
  if (!text) return;

  const chat = INSTAGRAM_DB.chats[activeChatIndex];

  // Push message to data
  chat.messages.push({
    sender: "self",
    text: text,
  });

  // Clear input
  input.value = "";
  document.getElementById("btn-chat-send").classList.add("hide");

  // Render immediately in chat panel
  const log = document.getElementById("chat-messages-log");
  const bubble = document.createElement("div");
  bubble.className = "message-bubble self";
  bubble.textContent = text;
  log.appendChild(bubble);

  scrollToChatBottom();
  renderChatThreads(); // update preview text in list

  // Simulate auto typing replies from mock user
  if (chat.replies && chat.replies.length > 0) {
    // Show typing indicator in 800ms
    setTimeout(() => {
      document.getElementById("typing-indicator").classList.remove("hide");
      scrollToChatBottom();
    }, 800);

    // Append reply in 2000ms
    setTimeout(() => {
      const nextReply = chat.replies.shift() || "Haha, nice!";

      // Push reply to data
      chat.messages.push({
        sender: "other",
        text: nextReply,
      });

      // Hide typing indicator
      document.getElementById("typing-indicator").classList.add("hide");

      // Append bubble
      const replyBubble = document.createElement("div");
      replyBubble.className = "message-bubble other";
      replyBubble.textContent = nextReply;
      log.appendChild(replyBubble);

      scrollToChatBottom();
      renderChatThreads();
    }, 2200);
  }
}

/* 11. USER PROFILE PAGE VIEWER */
let currentProfileTab = "posts";

function renderProfilePosts() {
  // 1. Configure user details in header
  document.getElementById("profile-page-avatar").src =
    INSTAGRAM_DB.currentUser.avatar;
  document.getElementById("profile-page-username").textContent =
    INSTAGRAM_DB.currentUser.username;
  document.getElementById("profile-page-fullname").textContent =
    INSTAGRAM_DB.currentUser.fullname;
  document.getElementById("profile-page-bio").textContent =
    INSTAGRAM_DB.currentUser.bio;

  // Set posts count
  document.getElementById("profile-posts-count").textContent =
    INSTAGRAM_DB.currentUser.posts.length;

  // 2. Render grids
  const grid = document.getElementById("profile-posts-grid");
  grid.innerHTML = "";

  let targetSource = [];
  if (currentProfileTab === "posts") {
    targetSource = INSTAGRAM_DB.currentUser.posts;
  } else if (currentProfileTab === "saved") {
    targetSource = INSTAGRAM_DB.currentUser.saved;
  }

  if (targetSource.length === 0) {
    grid.innerHTML = `<div style="grid-column: span 3; text-align:center; padding: 40px; color: var(--text-secondary);">
            <i class="fa-regular fa-image" style="font-size: 40px; margin-bottom: 10px;"></i>
            <h3>No posts yet.</h3>
        </div>`;
    return;
  }

  targetSource.forEach((post) => {
    const item = document.createElement("div");
    item.className = "grid-item";
    item.onclick = () => openPostDetailsModal(post.id);
    item.innerHTML = `
            <img src="${post.mediaUrl}" alt="Profile post">
            <div class="grid-item-overlay">
                <div class="grid-overlay-stat"><i class="fa-solid fa-heart"></i> ${post.likes}</div>
                <div class="grid-overlay-stat"><i class="fa-solid fa-comment"></i> ${post.commentsCount || post.comments.length}</div>
            </div>
        `;
    grid.appendChild(item);
  });
}

function switchProfileTab(tabType, event) {
  if (event) event.preventDefault();

  currentProfileTab = tabType;

  // Active tabs class toggle
  document.querySelectorAll(".profile-tabs-bar .tab-item").forEach((tab) => {
    tab.classList.remove("active");
  });

  if (event) event.target.closest(".tab-item").classList.add("active");

  renderProfilePosts();
}

function viewUserProfile(username) {
  // If username clicked is current user, direct to profile
  if (username === INSTAGRAM_DB.currentUser.username) {
    switchTab("profile");
    return;
  }

  // Otherwise open a simulated alert profile view
  alert(
    `Viewing user profile: @${username}. In this mockup, profiles other than your own are summarized. Clicking their feed posts will open the Post Details View!`,
  );
}

/* 12. CREATE POST CONTROLLER */
let selectedFileUrl = "";

function openModal(modalId, event) {
  if (event) event.preventDefault();
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("hide");

    // Specific setups
    if (modalId === "create-post-modal") {
      resetCreatePostModal();
    }
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("hide");
}

function resetCreatePostModal() {
  document.getElementById("create-post-dropzone").classList.remove("hide");
  document.getElementById("create-post-editor").classList.add("hide");
  document.getElementById("btn-share-post").classList.add("hide");
  document.querySelector(".create-post-card").classList.remove("expanded");

  document.getElementById("create-post-caption").value = "";
  document.getElementById("create-post-location").value = "";
  selectedFileUrl = "";
}

function selectStockCreateImage(imgUrl) {
  selectedFileUrl = imgUrl;

  // Transition dropzone out, editor in
  document.getElementById("create-post-dropzone").classList.add("hide");
  const editor = document.getElementById("create-post-editor");
  editor.classList.remove("hide");

  // Expand card width
  document.querySelector(".create-post-card").classList.add("expanded");

  // Show Share button in header
  document.getElementById("btn-share-post").classList.remove("hide");

  // Preview
  document.getElementById("create-post-preview-img").src = imgUrl;
  document.getElementById("create-post-preview-img").className = "none"; // reset filter preview

  // Update filter preview mini grids
  document.querySelectorAll(".filter-preview").forEach((preview) => {
    preview.style.backgroundImage = `url('${imgUrl}')`;
  });
}

function applyCSSFilter(filterClass) {
  const previewImg = document.getElementById("create-post-preview-img");
  previewImg.className = filterClass;

  // Toggle active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = event.currentTarget;
  if (activeBtn) activeBtn.classList.add("active");
}

function submitCreatePost() {
  const caption = document.getElementById("create-post-caption").value.trim();
  const location =
    document.getElementById("create-post-location").value.trim() || "Earth";
  const filterClass = document.getElementById(
    "create-post-preview-img",
  ).className;

  // Create new post in DB
  const newPostId = `my-post-${Date.now()}`;
  const newPost = {
    id: newPostId,
    user: {
      username: INSTAGRAM_DB.currentUser.username,
      avatar: INSTAGRAM_DB.currentUser.avatar,
      location: location,
    },
    // We will include the CSS filter style class directly in the post image
    mediaUrl: selectedFileUrl,
    caption: caption,
    likes: 0,
    liked: false,
    bookmarked: false,
    time: "Just now",
    comments: [],
  };

  // Prepend to posts lists
  INSTAGRAM_DB.posts.unshift(newPost);

  // Prepend to user profile posts
  INSTAGRAM_DB.currentUser.posts.unshift({
    id: newPostId,
    mediaUrl: selectedFileUrl,
    likes: 0,
    commentsCount: 0,
    caption: caption,
    location: location,
  });

  // Rerender feed
  renderFeedPosts();

  // Rerender profile posts
  renderProfilePosts();

  // Close modal
  closeModal("create-post-modal");

  // Redirect to home feed
  switchTab("feed");
}

/* 13. EDIT PROFILE ACTIONS */
function openEditProfileModal() {
  document.getElementById("edit-username-placeholder").textContent =
    INSTAGRAM_DB.currentUser.username;
  document.getElementById("edit-profile-fullname").value =
    INSTAGRAM_DB.currentUser.fullname;
  document.getElementById("edit-profile-bio").value =
    INSTAGRAM_DB.currentUser.bio;

  openModal("edit-profile-modal");
}

function saveProfileChanges() {
  const fullname = document
    .getElementById("edit-profile-fullname")
    .value.trim();
  const bio = document.getElementById("edit-profile-bio").value.trim();

  if (!fullname) {
    alert("Full name cannot be blank!");
    return;
  }

  INSTAGRAM_DB.currentUser.fullname = fullname;
  INSTAGRAM_DB.currentUser.bio = bio;

  // Rerender profile page details
  renderProfilePosts();

  // Rerender header profiles
  document
    .querySelectorAll("#logged-in-fullname")
    .forEach((el) => (el.textContent = fullname));

  closeModal("edit-profile-modal");
}

function simulateAvatarChange() {
  alert("Avatar updated with a random aesthetic coding profile template!");
}

/* 14. STORY VIEWER SYSTEM WITH ACTIVE PROGRESS BARS */
let activeStoryIndex = 0;
let activeSlideIndex = 0;
let storyProgressTimer = null;
let currentProgressFill = 0;
let isStoryPaused = false;

function openStoryViewer(storyIdx) {
  activeStoryIndex = storyIdx;
  activeSlideIndex = 0;
  isStoryPaused = false;

  const story = INSTAGRAM_DB.stories[storyIdx];
  if (!story) return;

  story.viewed = true; // Mark viewed
  renderStoriesTray(); // Rerender circle rings

  document.getElementById("story-viewer-modal").classList.remove("hide");

  loadStorySlide();
}

function loadStorySlide() {
  const story = INSTAGRAM_DB.stories[activeStoryIndex];
  const slide = story.slides[activeSlideIndex];

  // Configure details
  document.getElementById("story-viewer-avatar").src = story.avatar;
  document.getElementById("story-viewer-username").textContent = story.username;
  document.getElementById("story-viewer-time").textContent = slide.time;
  document.getElementById("story-viewer-img").src = slide.url;

  // Create progress bar layout
  const progressContainer = document.getElementById("story-progress-container");
  progressContainer.innerHTML = "";

  story.slides.forEach((s, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "story-progress-bar-wrapper";

    const fill = document.createElement("div");
    fill.className = "story-progress-bar-fill";
    fill.id = `story-progress-fill-${idx}`;

    // Mark previous bars as complete
    if (idx < activeSlideIndex) {
      fill.classList.add("complete");
    }

    wrapper.appendChild(fill);
    progressContainer.appendChild(wrapper);
  });

  // Restart progression animation loop
  startStoryProgress();
}

function startStoryProgress() {
  if (storyProgressTimer) clearInterval(storyProgressTimer);

  currentProgressFill = 0;
  const fillBar = document.getElementById(
    `story-progress-fill-${activeSlideIndex}`,
  );
  if (!fillBar) return;

  const slideDuration = 4000; // 4 seconds per slide
  const interval = 40; // update fill every 40ms
  const increment = (interval / slideDuration) * 100;

  storyProgressTimer = setInterval(() => {
    if (!isStoryPaused) {
      currentProgressFill += increment;
      if (currentProgressFill >= 100) {
        currentProgressFill = 100;
        fillBar.style.width = "100%";
        clearInterval(storyProgressTimer);
        navigateStory(1); // auto advance
      } else {
        fillBar.style.width = `${currentProgressFill}%`;
      }
    }
  }, interval);
}

function navigateStory(direction) {
  const story = INSTAGRAM_DB.stories[activeStoryIndex];

  activeSlideIndex += direction;

  // If reached end of slides in current story
  if (activeSlideIndex >= story.slides.length) {
    // Switch to next user story
    if (activeStoryIndex + 1 < INSTAGRAM_DB.stories.length) {
      activeStoryIndex += 1;
      activeSlideIndex = 0;
      loadStorySlide();
    } else {
      // No more stories
      closeStoryViewer();
    }
  }
  // If navigated backwards below 0
  else if (activeSlideIndex < 0) {
    // Go back to previous user story
    if (activeStoryIndex - 1 >= 0) {
      activeStoryIndex -= 1;
      // Load last slide of previous story
      activeSlideIndex =
        INSTAGRAM_DB.stories[activeStoryIndex].slides.length - 1;
      loadStorySlide();
    } else {
      activeSlideIndex = 0;
      loadStorySlide();
    }
  }
  // Normal slides navigation
  else {
    loadStorySlide();
  }
}

function toggleStoryPlayState(btn) {
  isStoryPaused = !isStoryPaused;
  const icon = btn.querySelector("i");
  if (isStoryPaused) {
    icon.className = "fa-solid fa-play";
  } else {
    icon.className = "fa-solid fa-pause";
  }
}

function handleStoryModalClick(event) {
  // If clicking right side of card, go next. If left, go back.
  const rect = event.currentTarget.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const halfWidth = rect.width / 2;

  if (x > halfWidth) {
    navigateStory(1);
  } else {
    navigateStory(-1);
  }
}

function closeStoryViewer() {
  if (storyProgressTimer) clearInterval(storyProgressTimer);
  document.getElementById("story-viewer-modal").classList.add("hide");
}

/* 15. POST DETAILS VIEW MODAL (FOR SEARCH GRID / PROFILE GRID CLICKS) */
let activeDetailPostId = "";

function openPostDetailsModal(postId) {
  activeDetailPostId = postId;

  // Find post in feed DB or user profile DB
  let post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) {
    // Try searching user own profile posts
    const myPost = INSTAGRAM_DB.currentUser.posts.find((p) => p.id === postId);
    if (myPost) {
      // Convert simple post struct to detailed post struct
      post = {
        id: myPost.id,
        user: {
          username: INSTAGRAM_DB.currentUser.username,
          avatar: INSTAGRAM_DB.currentUser.avatar,
          location: myPost.location,
        },
        mediaUrl: myPost.mediaUrl,
        caption: myPost.caption,
        likes: myPost.likes,
        liked: false,
        bookmarked: false,
        time: "1 day ago",
        comments: [],
      };
    }
  }

  if (!post) return;

  const modal = document.getElementById("post-detail-modal");
  modal.classList.remove("hide");

  // Image
  document.getElementById("detail-modal-img").src = post.mediaUrl;

  // Header
  document.getElementById("detail-modal-avatar").src = post.user.avatar;
  document.getElementById("detail-modal-username").textContent =
    post.user.username;
  document.getElementById("detail-modal-location").textContent =
    post.user.location;

  // Like button setup
  const likeBtn = document.getElementById("detail-like-btn");
  if (post.liked) {
    likeBtn.classList.add("liked");
    likeBtn.innerHTML = `<i class="fa-solid fa-heart" style="color: var(--ig-red);"></i>`;
  } else {
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }

  // Bookmark setup
  const bookmarkBtn = document.getElementById("detail-bookmark-btn");
  if (post.bookmarked) {
    bookmarkBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
  } else {
    bookmarkBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
  }

  // Likes Count
  document.getElementById("detail-likes-count").textContent =
    `${post.likes.toLocaleString()} likes`;
  document.getElementById("detail-post-date").textContent = post.time;

  // Populate comments log
  renderDetailCommentsLog(post);
}

function renderDetailCommentsLog(post) {
  const log = document.getElementById("detail-modal-comments-log");
  log.innerHTML = "";

  // Render caption first
  const captionItem = document.createElement("div");
  captionItem.className = "detail-comment-item";
  captionItem.innerHTML = `
        <img src="${post.user.avatar}" alt="${post.user.username}">
        <div class="comment-content">
            <span class="comment-text"><strong>${post.user.username}</strong> ${post.caption}</span>
            <div class="comment-meta">
                <span>${post.time}</span>
            </div>
        </div>
    `;
  log.appendChild(captionItem);

  // Render comments list
  post.comments.forEach((c) => {
    const item = document.createElement("div");
    item.className = "detail-comment-item";

    // Find avatar for comments poster
    let posterAvatar = "assets/images/user_avatar.png";
    const commenter = INSTAGRAM_DB.stories.find(
      (s) => s.username === c.username,
    );
    if (commenter) posterAvatar = commenter.avatar;

    item.innerHTML = `
            <img src="${posterAvatar}" alt="${c.username}">
            <div class="comment-content">
                <span class="comment-text"><strong>${c.username}</strong> ${c.text}</span>
                <div class="comment-meta">
                    <span>1h</span>
                    <span style="cursor:pointer; font-weight:600;">Reply</span>
                </div>
            </div>
        `;
    log.appendChild(item);
  });
}

function toggleDetailLike() {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === activeDetailPostId);
  if (!post) return;

  const btn = document.getElementById("detail-like-btn");

  // Call existing toggleLike engine
  toggleLike(activeDetailPostId, btn);

  // Update main feed posts buttons/counts
  renderFeedPosts();

  // Rerender details card stats
  document.getElementById("detail-likes-count").textContent =
    `${post.likes.toLocaleString()} likes`;
  if (post.liked) {
    btn.innerHTML = `<i class="fa-solid fa-heart" style="color: var(--ig-red);"></i>`;
  } else {
    btn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }
}

function toggleDetailBookmark() {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === activeDetailPostId);
  if (!post) return;

  const btn = document.getElementById("detail-bookmark-btn");
  toggleBookmark(activeDetailPostId, btn);

  // Update main feed posts buttons
  renderFeedPosts();
}

function focusDetailCommentInput() {
  document.getElementById("detail-comment-input").focus();
}

function handleDetailCommentKeyDown(event) {
  if (event.key === "Enter") {
    submitDetailComment();
  }
}

function submitDetailComment() {
  const input = document.getElementById("detail-comment-input");
  const text = input.value.trim();
  if (!text) return;

  const post = INSTAGRAM_DB.posts.find((p) => p.id === activeDetailPostId);
  if (!post) return;

  // Add comment to data
  post.comments.push({
    username: INSTAGRAM_DB.currentUser.username,
    text: text,
  });

  // Clear input
  input.value = "";

  // Rerender comments log inside details card
  renderDetailCommentsLog(post);

  // Update comments on main feed posts
  renderFeedPosts();
}

/* 16. THEME TOGGLER (DARK / LIGHT MODE) */
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("more-menu-btn");
  const dropdown = document.getElementById("more-dropdown");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  }

  // Close dropdown
  dropdown.classList.add("hide");
}

function toggleMoreMenu(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById("more-dropdown");
  dropdown.classList.toggle("hide");
}

// Close more dropdown when clicking outside
window.addEventListener("click", (e) => {
  const dropdown = document.getElementById("more-dropdown");
  const moreBtn = document.getElementById("more-menu-btn");

  if (
    dropdown &&
    !dropdown.classList.contains("hide") &&
    !moreBtn.contains(e.target) &&
    !dropdown.contains(e.target)
  ) {
    dropdown.classList.add("hide");
  }
});
