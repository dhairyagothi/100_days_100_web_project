/* GLOBAL CONTROLLERS & INITIALIZATION */
document.addEventListener("DOMContentLoaded", () => {
  initAppDashboard();
});

function simulateLogout() {
  const loader = document.getElementById("app-global-loader");
  loader.classList.remove("hide");

  setTimeout(() => {
    location.reload();
  }, 1500);
}

/* 4. DASHBOARD RENDERERS */
function initAppDashboard() {
  document
    .querySelectorAll("#logged-in-username")
    .forEach((el) => (el.textContent = INSTAGRAM_DB.currentUser.username));
  document
    .querySelectorAll("#logged-in-username-dm")
    .forEach((el) => (el.textContent = INSTAGRAM_DB.currentUser.username));
  document
    .querySelectorAll("#logged-in-fullname")
    .forEach((el) => (el.textContent = INSTAGRAM_DB.currentUser.fullname));

  renderStoriesTray();
  renderFeedPosts();
  renderSuggestions();
  renderExploreGrid();
  renderReels();
  renderChatThreads();
  renderProfilePosts();
}

// stories
function renderStoriesTray() {
  const container = document.getElementById("stories-container");
  container.innerHTML = "";

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

// Feed posts rendering with enhanced comment system
function renderFeedPosts() {
  const container = document.getElementById("feed-posts-container");
  container.innerHTML = "";

  INSTAGRAM_DB.posts.forEach((post, index) => {
    const card = document.createElement("article");
    card.className = "post-card";
    card.dataset.postId = post.id;

    let commentsHTML = "";
    // Show last 3 comments (including replies collapsed)
    const displayComments = post.comments.slice(-3);
    displayComments.forEach((comment) => {
      commentsHTML += renderCommentHTML(comment, post.id, false);
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
                    ${post.comments.length > 3 ? `<div class="view-all-comments" onclick="openPostDetailsModal('${post.id}')">View all ${post.comments.length} comments</div>` : ""}
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

/* ============================================
   ENHANCED COMMENT SYSTEM WITH REPLIES & DELETION
   ============================================ */

// Generate HTML for a comment with reply button and delete option
function renderCommentHTML(comment, postId, isDetailView = false) {
  const isOwner = comment.username === INSTAGRAM_DB.currentUser.username;
  const repliesCount = comment.replies ? comment.replies.length : 0;
  
  let repliesHTML = '';
  if (comment.replies && comment.replies.length > 0) {
    // Show first 2 replies, rest with "View more" link
    const displayReplies = comment.replies.slice(0, 2);
    displayReplies.forEach(reply => {
      repliesHTML += renderReplyHTML(reply, postId, comment.id, isDetailView);
    });
    
    if (comment.replies.length > 2) {
      const remaining = comment.replies.length - 2;
      repliesHTML += `
        <div class="view-more-replies" onclick="showAllReplies('${postId}', '${comment.id}')">
          View ${remaining} more replies
        </div>
      `;
    }
  }

  return `
    <div class="comment-wrapper" id="comment-${comment.id}" data-comment-id="${comment.id}">
      <div class="comment-line">
        <span class="username" onclick="viewUserProfile('${comment.username}')">${comment.username}</span>
        <span>${comment.text}</span>
        ${isOwner ? `<button class="btn-delete-comment" onclick="deleteComment('${postId}', '${comment.id}')" title="Delete comment">
          <i class="fa-regular fa-trash-can"></i>
        </button>` : ''}
      </div>
      <div class="comment-actions">
        <span class="comment-timestamp">${comment.timestamp || 'Just now'}</span>
        <button class="btn-reply" onclick="showReplyInput('${postId}', '${comment.id}')">
          <i class="fa-regular fa-comment"></i> Reply
        </button>
        ${repliesCount > 0 ? `<span class="reply-count">${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}</span>` : ''}
      </div>
      <div class="replies-container" id="replies-${comment.id}">
        ${repliesHTML}
      </div>
      <div class="reply-input-wrapper hide" id="reply-input-${comment.id}">
        <input type="text" placeholder="Write a reply..." class="reply-input" 
               onkeydown="handleReplyKeyDown(event, '${postId}', '${comment.id}')">
        <button class="btn-text-send" onclick="submitReply(this, '${postId}', '${comment.id}')">Reply</button>
        <button class="btn-cancel-reply" onclick="cancelReply('${comment.id}')">Cancel</button>
      </div>
    </div>
  `;
}

// Generate HTML for a reply
function renderReplyHTML(reply, postId, commentId, isDetailView = false) {
  const isOwner = reply.username === INSTAGRAM_DB.currentUser.username;
  
  return `
    <div class="reply-wrapper" id="reply-${reply.id}" data-reply-id="${reply.id}">
      <div class="reply-line">
        <span class="username" onclick="viewUserProfile('${reply.username}')">${reply.username}</span>
        <span>${reply.text}</span>
        ${isOwner ? `<button class="btn-delete-reply" onclick="deleteReply('${postId}', '${commentId}', '${reply.id}')" title="Delete reply">
          <i class="fa-regular fa-trash-can"></i>
        </button>` : ''}
      </div>
      <div class="reply-timestamp">${reply.timestamp || 'Just now'}</div>
    </div>
  `;
}

// Submit a new comment
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

  // Add comment with unique ID
  const newComment = {
    id: `comment-${Date.now()}`,
    username: INSTAGRAM_DB.currentUser.username,
    text: text,
    timestamp: "Just now",
    replies: []
  };

  post.comments.push(newComment);
  input.value = "";

  // Re-render comments
  renderPostComments(postId);
  updateCommentCount(postId);
}

// Submit a reply to a comment
function submitReply(btn, postId, commentId) {
  const wrapper = btn.closest('.reply-input-wrapper');
  const input = wrapper.querySelector('.reply-input');
  const text = input.value.trim();
  if (!text) return;

  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  const comment = post.comments.find((c) => c.id === commentId);
  if (!comment) return;

  // Add reply with unique ID
  const newReply = {
    id: `reply-${Date.now()}`,
    username: INSTAGRAM_DB.currentUser.username,
    text: text,
    timestamp: "Just now"
  };

  if (!comment.replies) comment.replies = [];
  comment.replies.push(newReply);

  input.value = "";
  document.getElementById(`reply-input-${commentId}`).classList.add('hide');

  // Re-render comments
  renderPostComments(postId);
  updateCommentCount(postId);
}

// Delete a comment
function deleteComment(postId, commentId) {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  const index = post.comments.findIndex((c) => c.id === commentId);
  if (index === -1) return;

  // Check if user owns the comment
  if (post.comments[index].username !== INSTAGRAM_DB.currentUser.username) {
    alert('You can only delete your own comments!');
    return;
  }

  post.comments.splice(index, 1);
  
  // Re-render comments
  renderPostComments(postId);
  updateCommentCount(postId);
}

// Delete a reply
function deleteReply(postId, commentId, replyId) {
  if (!confirm('Are you sure you want to delete this reply?')) return;

  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  const comment = post.comments.find((c) => c.id === commentId);
  if (!comment) return;

  const replyIndex = comment.replies.findIndex((r) => r.id === replyId);
  if (replyIndex === -1) return;

  // Check if user owns the reply
  if (comment.replies[replyIndex].username !== INSTAGRAM_DB.currentUser.username) {
    alert('You can only delete your own replies!');
    return;
  }

  comment.replies.splice(replyIndex, 1);
  
  // Re-render comments
  renderPostComments(postId);
  updateCommentCount(postId);
}

// Show reply input
function showReplyInput(postId, commentId) {
  // Hide all other reply inputs first
  document.querySelectorAll('.reply-input-wrapper').forEach(el => {
    el.classList.add('hide');
  });
  
  const inputWrapper = document.getElementById(`reply-input-${commentId}`);
  if (inputWrapper) {
    inputWrapper.classList.remove('hide');
    inputWrapper.querySelector('.reply-input').focus();
  }
}

// Cancel reply
function cancelReply(commentId) {
  const inputWrapper = document.getElementById(`reply-input-${commentId}`);
  if (inputWrapper) {
    inputWrapper.classList.add('hide');
    inputWrapper.querySelector('.reply-input').value = '';
  }
}

// Handle reply keydown (Enter to submit)
function handleReplyKeyDown(event, postId, commentId) {
  if (event.key === "Enter") {
    event.preventDefault();
    const btn = event.target.closest('.reply-input-wrapper').querySelector('.btn-text-send');
    submitReply(btn, postId, commentId);
  }
}

// Show all replies for a comment
function showAllReplies(postId, commentId) {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  const comment = post.comments.find((c) => c.id === commentId);
  if (!comment || !comment.replies) return;

  const container = document.getElementById(`replies-${commentId}`);
  if (!container) return;

  // Clear and show all replies
  container.innerHTML = '';
  comment.replies.forEach(reply => {
    container.innerHTML += renderReplyHTML(reply, postId, commentId, false);
  });

  // Add a "Show less" option
  const showLess = document.createElement('div');
  showLess.className = 'view-more-replies';
  showLess.textContent = 'Show less';
  showLess.onclick = () => renderPostComments(postId);
  container.appendChild(showLess);
}

// Render comments for a specific post
function renderPostComments(postId) {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  const container = document.getElementById(`comments-preview-${postId}`);
  if (!container) return;

  let commentsHTML = '';
  
  // Show view all if more than 3 comments
  if (post.comments.length > 3) {
    commentsHTML += `<div class="view-all-comments" onclick="openPostDetailsModal('${postId}')">View all ${post.comments.length} comments</div>`;
  }

  // Show last 3 comments
  const displayComments = post.comments.slice(-3);
  displayComments.forEach(comment => {
    commentsHTML += renderCommentHTML(comment, postId, false);
  });

  container.innerHTML = commentsHTML;
}

// Update comment count in UI
function updateCommentCount(postId) {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  // Update in detail view if open
  const detailModal = document.getElementById('post-detail-modal');
  if (!detailModal.classList.contains('hide') && activeDetailPostId === postId) {
    renderDetailCommentsLog(post);
  }

  // Update feed view
  renderPostComments(postId);
}

// Focus comment input
function focusCommentInput(btn) {
  const postCard = btn.closest(".post-card");
  const input = postCard.querySelector(".post-add-comment input");
  input.focus();
}

// Handle comment keydown (Enter to submit)
function handleCommentKeyDown(event, postId) {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = event.target;
    submitComment(input, postId);
  }
}

/* ============================================
   EXISTING FEED FUNCTIONS (Likes, Bookmarks, etc.)
   ============================================ */

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

  const likesLabel = document.getElementById(`likes-count-${postId}`);
  if (likesLabel)
    likesLabel.textContent = `${post.likes.toLocaleString()} likes`;
}

function triggerDoubleTapLike(container, postId) {
  const heart = container.querySelector(".double-tap-heart");
  const post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) return;

  if (!post.liked) {
    post.liked = true;
    post.likes += 1;

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
    if (!INSTAGRAM_DB.currentUser.saved.includes(post)) {
      INSTAGRAM_DB.currentUser.saved.push(post);
    }
  } else {
    btn.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
    INSTAGRAM_DB.currentUser.saved = INSTAGRAM_DB.currentUser.saved.filter(
      (p) => p.id !== postId,
    );
  }
}

function sharePost(postId) {
  alert(`Post shared to simulated clipboard!`);
}

/* 8. EXPLORE GRID VIEWPORT */
function renderExploreGrid() {
  const grid = document.getElementById("explore-grid");
  grid.innerHTML = "";

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

  chat.unread = false;

  renderChatThreads();

  document.getElementById("chat-empty-state").classList.add("hide");
  const activePanel = document.getElementById("chat-active-state");
  activePanel.classList.remove("hide");

  if (window.innerWidth < 768) {
    document
      .querySelector(".chat-conversation-panel")
      .classList.add("open-mobile");
  }

  document.getElementById("chat-header-avatar").src = chat.user.avatar;
  document.getElementById("chat-header-name").textContent = chat.user.fullname;
  document.getElementById("chat-header-status").textContent = chat.user.status;

  const log = document.getElementById("chat-messages-log");
  log.innerHTML = "";

  chat.messages.forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.className = `message-bubble ${msg.sender}`;
    bubble.textContent = msg.text;
    log.appendChild(bubble);
  });

  scrollToChatBottom();
}

function scrollToChatBottom() {
  const log = document.getElementById("chat-messages-log");
  log.scrollTop = log.scrollHeight;
}

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

  chat.messages.push({
    sender: "self",
    text: text,
  });

  input.value = "";
  document.getElementById("btn-chat-send").classList.add("hide");

  const log = document.getElementById("chat-messages-log");
  const bubble = document.createElement("div");
  bubble.className = "message-bubble self";
  bubble.textContent = text;
  log.appendChild(bubble);

  scrollToChatBottom();
  renderChatThreads();

  if (chat.replies && chat.replies.length > 0) {
    setTimeout(() => {
      document.getElementById("typing-indicator").classList.remove("hide");
      scrollToChatBottom();
    }, 800);

    setTimeout(() => {
      const nextReply = chat.replies.shift() || "Haha, nice!";

      chat.messages.push({
        sender: "other",
        text: nextReply,
      });

      document.getElementById("typing-indicator").classList.add("hide");

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
  document.getElementById("profile-page-avatar").src =
    INSTAGRAM_DB.currentUser.avatar;
  document.getElementById("profile-page-username").textContent =
    INSTAGRAM_DB.currentUser.username;
  document.getElementById("profile-page-fullname").textContent =
    INSTAGRAM_DB.currentUser.fullname;
  document.getElementById("profile-page-bio").textContent =
    INSTAGRAM_DB.currentUser.bio;

  document.getElementById("profile-posts-count").textContent =
    INSTAGRAM_DB.currentUser.posts.length;

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
                <div class="grid-overlay-stat"><i class="fa-solid fa-comment"></i> ${post.commentsCount || post.comments?.length || 0}</div>
            </div>
        `;
    grid.appendChild(item);
  });
}

function switchProfileTab(tabType, event) {
  if (event) event.preventDefault();

  currentProfileTab = tabType;

  document.querySelectorAll(".profile-tabs-bar .tab-item").forEach((tab) => {
    tab.classList.remove("active");
  });

  if (event) event.target.closest(".tab-item").classList.add("active");

  renderProfilePosts();
}

function viewUserProfile(username) {
  if (username === INSTAGRAM_DB.currentUser.username) {
    switchTab("profile");
    return;
  }

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

  document.getElementById("create-post-dropzone").classList.add("hide");
  const editor = document.getElementById("create-post-editor");
  editor.classList.remove("hide");

  document.querySelector(".create-post-card").classList.add("expanded");

  document.getElementById("btn-share-post").classList.remove("hide");

  document.getElementById("create-post-preview-img").src = imgUrl;
  document.getElementById("create-post-preview-img").className = "none";

  document.querySelectorAll(".filter-preview").forEach((preview) => {
    preview.style.backgroundImage = `url('${imgUrl}')`;
  });
}

function applyCSSFilter(filterClass) {
  const previewImg = document.getElementById("create-post-preview-img");
  previewImg.className = filterClass;

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

  const newPostId = `my-post-${Date.now()}`;
  const newPost = {
    id: newPostId,
    user: {
      username: INSTAGRAM_DB.currentUser.username,
      avatar: INSTAGRAM_DB.currentUser.avatar,
      location: location,
    },
    mediaUrl: selectedFileUrl,
    caption: caption,
    likes: 0,
    liked: false,
    bookmarked: false,
    time: "Just now",
    comments: [],
  };

  INSTAGRAM_DB.posts.unshift(newPost);

  INSTAGRAM_DB.currentUser.posts.unshift({
    id: newPostId,
    mediaUrl: selectedFileUrl,
    likes: 0,
    commentsCount: 0,
    caption: caption,
    location: location,
  });

  renderFeedPosts();
  renderProfilePosts();

  closeModal("create-post-modal");
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

  renderProfilePosts();

  document
    .querySelectorAll("#logged-in-fullname")
    .forEach((el) => (el.textContent = fullname));

  closeModal("edit-profile-modal");
}

function simulateAvatarChange() {
  alert("Avatar updated with a random aesthetic coding profile template!");
}

/* 14. STORY VIEWER SYSTEM */
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

  story.viewed = true;
  renderStoriesTray();

  document.getElementById("story-viewer-modal").classList.remove("hide");

  loadStorySlide();
}

function loadStorySlide() {
  const story = INSTAGRAM_DB.stories[activeStoryIndex];
  const slide = story.slides[activeSlideIndex];

  document.getElementById("story-viewer-avatar").src = story.avatar;
  document.getElementById("story-viewer-username").textContent = story.username;
  document.getElementById("story-viewer-time").textContent = slide.time;
  document.getElementById("story-viewer-img").src = slide.url;

  const progressContainer = document.getElementById("story-progress-container");
  progressContainer.innerHTML = "";

  story.slides.forEach((s, idx) => {
    const wrapper = document.createElement("div");
    wrapper.className = "story-progress-bar-wrapper";

    const fill = document.createElement("div");
    fill.className = "story-progress-bar-fill";
    fill.id = `story-progress-fill-${idx}`;

    if (idx < activeSlideIndex) {
      fill.classList.add("complete");
    }

    wrapper.appendChild(fill);
    progressContainer.appendChild(wrapper);
  });

  startStoryProgress();
}

function startStoryProgress() {
  if (storyProgressTimer) clearInterval(storyProgressTimer);

  currentProgressFill = 0;
  const fillBar = document.getElementById(
    `story-progress-fill-${activeSlideIndex}`,
  );
  if (!fillBar) return;

  const slideDuration = 4000;
  const interval = 40;
  const increment = (interval / slideDuration) * 100;

  storyProgressTimer = setInterval(() => {
    if (!isStoryPaused) {
      currentProgressFill += increment;
      if (currentProgressFill >= 100) {
        currentProgressFill = 100;
        fillBar.style.width = "100%";
        clearInterval(storyProgressTimer);
        navigateStory(1);
      } else {
        fillBar.style.width = `${currentProgressFill}%`;
      }
    }
  }, interval);
}

function navigateStory(direction) {
  const story = INSTAGRAM_DB.stories[activeStoryIndex];

  activeSlideIndex += direction;

  if (activeSlideIndex >= story.slides.length) {
    if (activeStoryIndex + 1 < INSTAGRAM_DB.stories.length) {
      activeStoryIndex += 1;
      activeSlideIndex = 0;
      loadStorySlide();
    } else {
      closeStoryViewer();
    }
  } else if (activeSlideIndex < 0) {
    if (activeStoryIndex - 1 >= 0) {
      activeStoryIndex -= 1;
      activeSlideIndex =
        INSTAGRAM_DB.stories[activeStoryIndex].slides.length - 1;
      loadStorySlide();
    } else {
      activeSlideIndex = 0;
      loadStorySlide();
    }
  } else {
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

/* 15. POST DETAILS VIEW MODAL WITH ENHANCED COMMENTS */
let activeDetailPostId = "";

function openPostDetailsModal(postId) {
  activeDetailPostId = postId;

  let post = INSTAGRAM_DB.posts.find((p) => p.id === postId);
  if (!post) {
    const myPost = INSTAGRAM_DB.currentUser.posts.find((p) => p.id === postId);
    if (myPost) {
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

  document.getElementById("detail-modal-img").src = post.mediaUrl;

  document.getElementById("detail-modal-avatar").src = post.user.avatar;
  document.getElementById("detail-modal-username").textContent =
    post.user.username;
  document.getElementById("detail-modal-location").textContent =
    post.user.location;

  const likeBtn = document.getElementById("detail-like-btn");
  if (post.liked) {
    likeBtn.classList.add("liked");
    likeBtn.innerHTML = `<i class="fa-solid fa-heart" style="color: var(--ig-red);"></i>`;
  } else {
    likeBtn.classList.remove("liked");
    likeBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
  }

  const bookmarkBtn = document.getElementById("detail-bookmark-btn");
  if (post.bookmarked) {
    bookmarkBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i>`;
  } else {
    bookmarkBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>`;
  }

  document.getElementById("detail-likes-count").textContent =
    `${post.likes.toLocaleString()} likes`;
  document.getElementById("detail-post-date").textContent = post.time;

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

  // Render all comments with replies
  post.comments.forEach((comment) => {
    const item = document.createElement("div");
    item.className = "detail-comment-item";

    let posterAvatar = "assets/images/user_avatar.png";
    const commenter = INSTAGRAM_DB.stories.find(
      (s) => s.username === comment.username,
    );
    if (commenter) posterAvatar = commenter.avatar;

    const isOwner = comment.username === INSTAGRAM_DB.currentUser.username;
    const repliesCount = comment.replies ? comment.replies.length : 0;

    let repliesHTML = '';
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        repliesHTML += `
          <div class="detail-reply-item">
            <strong>${reply.username}</strong> ${reply.text}
            <span class="comment-meta">${reply.timestamp || 'Just now'}</span>
          </div>
        `;
      });
    }

    item.innerHTML = `
      <img src="${posterAvatar}" alt="${comment.username}">
      <div class="comment-content" style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; width: 100%;">
          <span class="comment-text"><strong>${comment.username}</strong> ${comment.text}</span>
          ${isOwner ? `<button class="btn-delete-comment" onclick="deleteComment('${post.id}', '${comment.id}')" title="Delete comment" style="background: none; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px;">
            <i class="fa-regular fa-trash-can"></i>
          </button>` : ''}
        </div>
        <div class="comment-meta">
          <span>${comment.timestamp || 'Just now'}</span>
          <span style="cursor:pointer; font-weight:600;" onclick="showReplyInput('${post.id}', '${comment.id}')">
            <i class="fa-regular fa-comment"></i> Reply
          </span>
          ${repliesCount > 0 ? `<span>${repliesCount} ${repliesCount === 1 ? 'reply' : 'replies'}</span>` : ''}
        </div>
        ${repliesHTML ? `<div style="margin-top: 8px; padding-left: 12px; border-left: 2px solid var(--border-primary);">${repliesHTML}</div>` : ''}
        <div class="reply-input-wrapper hide" id="reply-input-${comment.id}" style="margin-top: 8px;">
          <input type="text" placeholder="Write a reply..." class="reply-input" 
                 onkeydown="handleReplyKeyDown(event, '${post.id}', '${comment.id}')" 
                 style="width: 70%; padding: 6px 12px; border: 1px solid var(--border-primary); border-radius: 8px; background: var(--bg-input); color: var(--text-primary);">
          <button class="btn-text-send" onclick="submitReply(this, '${post.id}', '${comment.id}')" style="margin-left: 8px;">Reply</button>
          <button class="btn-cancel-reply" onclick="cancelReply('${comment.id}')" style="margin-left: 4px; color: var(--text-secondary);">Cancel</button>
        </div>
      </div>
    `;
    log.appendChild(item);
  });

  // Scroll to bottom
  log.scrollTop = log.scrollHeight;
}

function toggleDetailLike() {
  const post = INSTAGRAM_DB.posts.find((p) => p.id === activeDetailPostId);
  if (!post) return;

  const btn = document.getElementById("detail-like-btn");

  toggleLike(activeDetailPostId, btn);

  renderFeedPosts();

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

  const newComment = {
    id: `comment-${Date.now()}`,
    username: INSTAGRAM_DB.currentUser.username,
    text: text,
    timestamp: "Just now",
    replies: []
  };

  post.comments.push(newComment);
  input.value = "";

  renderDetailCommentsLog(post);
  renderFeedPosts();
}

/* 16. USER TAB SWITCHER (SPA ROUTING) */
function switchTab(tabName, event) {
  if (event) event.preventDefault();

  document.querySelectorAll(".app-view").forEach((view) => {
    view.classList.add("hide");
  });

  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) targetView.classList.remove("hide");

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  const activeLink = document.querySelector(`.nav-item[data-tab="${tabName}"]`);
  if (activeLink) activeLink.classList.add("active");

  closeAllDrawers();

  window.scrollTo({ top: 0 });

  if (tabName === "profile") {
    renderProfilePosts();
  } else if (tabName === "explore") {
    renderExploreGrid();
  } else if (tabName === "messages") {
    selectFirstChat();
  }
}

/* 17. DRAWERS */
let activeDrawer = null;

function toggleDrawer(drawerName, event) {
  if (event) event.preventDefault();

  const drawer = document.getElementById(`${drawerName}-drawer`);

  if (activeDrawer === drawerName) {
    closeAllDrawers();
    return;
  }

  closeAllDrawers();

  drawer.classList.remove("hide");
  activeDrawer = drawerName;

  const activeLink = document.querySelector(
    `.nav-item[data-drawer="${drawerName}"]`,
  );
  if (activeLink) activeLink.classList.add("active");

  document.querySelector(".sidebar").style.width = "72px";
  document.querySelector(".sidebar-logo").style.display = "none";
  document.querySelector(".sidebar-logo-icon").style.display = "inline-block";
  document.querySelector(".app-main-content").style.marginLeft = "72px";
  document.querySelectorAll(".nav-item span").forEach((span) => {
    span.style.display = "none";
  });

  if (drawerName === "search") {
    renderRecentSearches();
    document.getElementById("drawer-search-input").focus();
  } else if (drawerName === "notifications") {
    renderNotifications();
    document.getElementById("notification-dot").classList.add("hide");
  }
}

function closeAllDrawers() {
  document.querySelectorAll(".sidebar-drawer").forEach((drawer) => {
    drawer.classList.add("hide");
  });
  activeDrawer = null;

  if (window.innerWidth > 1260) {
    document.querySelector(".sidebar").style.width = "244px";
    document.querySelector(".sidebar-logo").style.display = "block";
    document.querySelector(".sidebar-logo-icon").style.display = "none";
    document.querySelector(".app-main-content").style.marginLeft = "244px";
    document.querySelectorAll(".nav-item span").forEach((span) => {
      span.style.display = "flex";
    });
  }

  document.querySelectorAll(".nav-item[data-drawer]").forEach((item) => {
    item.classList.remove("active");
  });

  const currentView = document
    .querySelector(".app-view:not(.hide)")
    .id.replace("view-", "");
  const activeLink = document.querySelector(
    `.nav-item[data-tab="${currentView}"]`,
  );
  if (activeLink) activeLink.classList.add("active");
}

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

    if (notif.timeframe.includes("h")) {
      containerWeek.appendChild(item);
    } else {
      containerEarlier.appendChild(item);
    }
  });
}

/* 18. THEME TOGGLER */
function toggleTheme() {
  const body = document.body;
  const dropdown = document.getElementById("more-dropdown");

  if (body.classList.contains("dark-mode")) {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
  } else {
    body.classList.remove("light-mode");
    body.classList.add("dark-mode");
  }

  dropdown.classList.add("hide");
}

function toggleMoreMenu(event) {
  if (event) event.preventDefault();
  const dropdown = document.getElementById("more-dropdown");
  dropdown.classList.toggle("hide");
}

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