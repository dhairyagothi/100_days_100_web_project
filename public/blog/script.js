// ===== Configuration & State =====
const STORAGE_KEYS = {
  POSTS: 'blog_posts',
  LIKES: 'blog_likes',
  BOOKMARKS: 'blog_bookmarks',
  COMMENTS: 'blog_comments',
  THEME: 'blog_theme'
};

const CATEGORIES = ['All', 'JavaScript', 'CSS', 'HTML', 'React', 'Python', 'Data Science', 'Web Design'];
const AUTHORS_DATA = [
  { name: 'John Doe', image: './assets/male1.jpg' },
  { name: 'Jane Smith', image: './assets/female1.jpg' },
  { name: 'Mike Johnson', image: './assets/male2.jpg' },
  { name: 'Emily Brown', image: './assets/female2.jpg' },
  { name: 'David Wilson', image: './assets/male3.jpg' }
];

const DEFAULT_POSTS = [
  {
    id: '1',
    title: 'Getting Started with JavaScript',
    content: 'JavaScript is a versatile programming language that powers the interactive elements of websites. It\'s essential for any aspiring web developer to master. In this post, we\'ll cover the basics of JavaScript syntax, variables, and functions. From console logs to DOM manipulation, this guide will give you a solid foundation.',
    author: 'John Doe',
    date: '2024-06-01',
    image: './assets/javascript.jpg',
    category: 'JavaScript'
  },
  {
    id: '2',
    title: 'Mastering CSS Grid Layout',
    content: 'CSS Grid is a powerful tool for creating complex layouts in web design. It allows for more flexibility and control over the positioning of elements on a page. This post will introduce you to the basics of CSS Grid and how to use it effectively. Learn about grid-template-columns, grid-template-rows, and much more!',
    author: 'Jane Smith',
    date: '2024-06-05',
    image: './assets/cssGrid.jpg',
    category: 'CSS'
  },
  {
    id: '3',
    title: 'Responsive Web Design Best Practices',
    content: 'Designing for multiple screen sizes is crucial in today\'s multi-device world. Responsive web design ensures that your website looks great on everything from smartphones to desktop computers. Learn the principles and techniques in this comprehensive guide including media queries, flexible grids, and responsive images.',
    author: 'Mike Johnson',
    date: '2024-06-10',
    image: './assets/responsiveWeb.jpg',
    category: 'Web Design'
  },
  {
    id: '4',
    title: 'Introduction to React Hooks',
    content: 'React Hooks provide a more direct API to the React concepts you already know. They allow you to use state and other React features without writing a class. This post will introduce you to the most commonly used hooks and how to implement them in your projects including useState, useEffect, and custom hooks.',
    author: 'Emily Brown',
    date: '2024-06-15',
    image: './assets/react.jpg',
    category: 'React'
  },
  {
    id: '5',
    title: 'Python for Data Science',
    content: 'Python has become the go-to language for data scientists due to its simplicity and powerful libraries. In this post, we\'ll explore how to use Python for data analysis, visualization, and machine learning tasks. Get ready to dive into the world of data science with pandas, numpy, and matplotlib!',
    author: 'David Wilson',
    date: '2024-06-20',
    image: './assets/4401280.jpg',
    category: 'Python'
  }
];

let state = {
  posts: [],
  likes: {},
  bookmarks: {},
  comments: {},
  currentFilter: 'All',
  searchQuery: ''
};

// ===== Utility Functions =====
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// ===== Local Storage Functions =====
function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error loading from storage:', e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

function initializeData() {
  state.posts = loadFromStorage(STORAGE_KEYS.POSTS, DEFAULT_POSTS);
  state.likes = loadFromStorage(STORAGE_KEYS.LIKES, {});
  state.bookmarks = loadFromStorage(STORAGE_KEYS.BOOKMARKS, {});
  state.comments = loadFromStorage(STORAGE_KEYS.COMMENTS, {});
  
  state.posts.forEach(post => {
    if (!state.likes[post.id]) state.likes[post.id] = { count: 0, liked: false };
    if (!state.comments[post.id]) state.comments[post.id] = [];
    if (state.bookmarks[post.id] === undefined) state.bookmarks[post.id] = false;
  });
  
  saveToStorage(STORAGE_KEYS.LIKES, state.likes);
  saveToStorage(STORAGE_KEYS.BOOKMARKS, state.bookmarks);
  saveToStorage(STORAGE_KEYS.COMMENTS, state.comments);
}

// ===== Toast Notifications =====
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type]} toast-icon"></i>
    <span class="toast-message">${message}</span>
    <button class="toast-close"><i class="fas fa-times"></i></button>
  `;
  
  container.appendChild(toast);
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => toast.remove());
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ===== Theme Management =====
function initializeTheme() {
  const savedTheme = loadFromStorage(STORAGE_KEYS.THEME, 'dark');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
  }
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  saveToStorage(STORAGE_KEYS.THEME, isLight ? 'light' : 'dark');
  showToast(`Switched to ${isLight ? 'light' : 'dark'} mode!`, 'info');
}

// ===== Render Functions =====
function renderPosts() {
  const container = document.getElementById('blogPosts');
  
  let filteredPosts = [...state.posts];
  
  if (state.currentFilter !== 'All') {
    filteredPosts = filteredPosts.filter(p => p.category === state.currentFilter);
  }
  
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query)
    );
  }
  
  filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (filteredPosts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>No posts found. Try a different search or category!</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredPosts.map(post => {
    const likes = state.likes[post.id] || { count: 0, liked: false };
    const comments = state.comments[post.id] || [];
    const isBookmarked = state.bookmarks[post.id] || false;
    
    return `
      <article class="post" data-post-id="${post.id}">
        <div class="post-image-container">
          <img src="${post.image}" alt="${post.title}" class="post-image" onerror="this.src='./assets/10165944.jpg'">
        </div>
        <div class="post-content">
          <div class="post-header">
            <span class="category-badge">${post.category}</span>
          </div>
          <div class="post-meta">
            <span><i class="fas fa-user"></i> ${post.author}</span>
            <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
          </div>
          <h3 class="post-title">${post.title}</h3>
          <p class="post-excerpt">${post.content.substring(0, 180)}...</p>
          <div class="post-footer">
            <div class="post-actions">
              <button class="action-btn like-btn ${likes.liked ? 'liked' : ''}" data-post-id="${post.id}">
                <i class="fas fa-heart"></i>
                <span>${likes.count}</span>
              </button>
              <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-post-id="${post.id}">
                <i class="fas fa-bookmark"></i>
              </button>
              <button class="action-btn comment-btn" data-post-id="${post.id}">
                <i class="fas fa-comment"></i>
                <span>${comments.length}</span>
              </button>
              <button class="action-btn share-btn" data-post-id="${post.id}">
                <i class="fas fa-share-alt"></i>
              </button>
            </div>
            <button class="read-more-btn" data-post-id="${post.id}">
              Read More <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  attachPostEventListeners();
}

function renderCategories() {
  const container = document.getElementById('categoriesList');
  container.innerHTML = CATEGORIES.map(cat => `
    <button class="category-btn ${cat === state.currentFilter ? 'active' : ''}" data-category="${cat}">
      ${cat}
    </button>
  `).join('');
  
  container.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.currentFilter = btn.dataset.category;
      renderCategories();
      renderPosts();
      showToast(`Showing ${state.currentFilter} posts`, 'info');
    });
  });
}

function renderTrendingPosts() {
  const container = document.getElementById('trendingPostsList');
  
  const trendingPosts = [...state.posts]
    .map(post => ({
      ...post,
      likeCount: (state.likes[post.id]?.count || 0)
    }))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5);
  
  if (trendingPosts.length === 0) {
    container.innerHTML = '<div class="empty-state">No trending posts yet!</div>';
    return;
  }
  
  container.innerHTML = trendingPosts.map(post => `
    <div class="sidebar-post" data-post-id="${post.id}">
      <img src="${post.image}" alt="${post.title}" class="sidebar-post-thumb" onerror="this.src='./assets/10165944.jpg'">
      <div class="sidebar-post-content">
        <div class="sidebar-post-title">${post.title}</div>
        <div class="sidebar-post-meta">
          <i class="fas fa-heart"></i> ${state.likes[post.id]?.count || 0}
        </div>
      </div>
    </div>
  `).join('');
  
  container.querySelectorAll('.sidebar-post').forEach(el => {
    el.addEventListener('click', () => openPostDetail(el.dataset.postId));
  });
}

function renderBookmarkedPosts() {
  const container = document.getElementById('bookmarkedPostsList');
  
  const bookmarkedPosts = state.posts.filter(post => state.bookmarks[post.id]);
  
  if (bookmarkedPosts.length === 0) {
    container.innerHTML = '<div class="empty-state">No bookmarks yet!</div>';
    return;
  }
  
  container.innerHTML = bookmarkedPosts.map(post => `
    <div class="sidebar-post" data-post-id="${post.id}">
      <img src="${post.image}" alt="${post.title}" class="sidebar-post-thumb" onerror="this.src='./assets/10165944.jpg'">
      <div class="sidebar-post-content">
        <div class="sidebar-post-title">${post.title}</div>
        <div class="sidebar-post-meta">${post.author}</div>
      </div>
    </div>
  `).join('');
  
  container.querySelectorAll('.sidebar-post').forEach(el => {
    el.addEventListener('click', () => openPostDetail(el.dataset.postId));
  });
}

function renderAuthors() {
  const container = document.getElementById('authorsList');
  container.innerHTML = AUTHORS_DATA.map(author => `
    <div class="author-item">
      <img src="${author.image}" alt="${author.name}" class="author-image">
      <span>${author.name}</span>
    </div>
  `).join('');
}

// ===== Post Management =====
function openCreatePostModal() {
  const modal = document.getElementById('createPostModal');
  modal.classList.add('show');
  document.getElementById('createPostForm').reset();
}

function closeCreatePostModal() {
  const modal = document.getElementById('createPostModal');
  modal.classList.remove('show');
}

function createPost(e) {
  e.preventDefault();
  
  const title = document.getElementById('postTitle').value.trim();
  const author = document.getElementById('postAuthor').value.trim();
  const category = document.getElementById('postCategory').value;
  const image = document.getElementById('postImage').value.trim() || './assets/10165944.jpg';
  const content = document.getElementById('postContent').value.trim();
  
  if (!title || !author || !category || !content) {
    showToast('Please fill in all required fields!', 'error');
    return;
  }
  
  const newPost = {
    id: generateId(),
    title,
    author,
    category,
    image,
    content,
    date: getCurrentDate()
  };
  
  state.posts.unshift(newPost);
  state.likes[newPost.id] = { count: 0, liked: false };
  state.comments[newPost.id] = [];
  state.bookmarks[newPost.id] = false;
  
  saveToStorage(STORAGE_KEYS.POSTS, state.posts);
  saveToStorage(STORAGE_KEYS.LIKES, state.likes);
  saveToStorage(STORAGE_KEYS.COMMENTS, state.comments);
  saveToStorage(STORAGE_KEYS.BOOKMARKS, state.bookmarks);
  
  closeCreatePostModal();
  renderPosts();
  renderTrendingPosts();
  renderBookmarkedPosts();
  showToast('Post created successfully!', 'success');
}

// ===== Post Detail Modal =====
function openPostDetail(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;
  
  const likes = state.likes[post.id] || { count: 0, liked: false };
  const comments = state.comments[post.id] || [];
  const isBookmarked = state.bookmarks[post.id] || false;
  
  const relatedPosts = state.posts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 4);
  
  const modal = document.getElementById('postDetailModal');
  const content = document.getElementById('postDetailContent');
  
  content.innerHTML = `
    <img src="${post.image}" alt="${post.title}" class="detail-image" onerror="this.src='./assets/10165944.jpg'">
    <div class="detail-header">
      <span class="category-badge">${post.category}</span>
      <h2 class="detail-title">${post.title}</h2>
      <div class="detail-meta">
        <span><i class="fas fa-user"></i> ${post.author}</span>
        <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
        <span><i class="fas fa-heart"></i> ${likes.count} likes</span>
        <span><i class="fas fa-comment"></i> ${comments.length} comments</span>
      </div>
    </div>
    <div class="detail-content">${post.content}</div>
    <div class="detail-actions">
      <button class="action-btn like-btn ${likes.liked ? 'liked' : ''}" data-post-id="${post.id}">
        <i class="fas fa-heart"></i> ${likes.liked ? 'Liked' : 'Like'} (${likes.count})
      </button>
      <button class="action-btn bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" data-post-id="${post.id}">
        <i class="fas fa-bookmark"></i> ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
      </button>
      <button class="action-btn share-btn" data-post-id="${post.id}">
        <i class="fas fa-share-alt"></i> Share
      </button>
    </div>
    
    <div class="comments-section">
      <h3><i class="fas fa-comments"></i> Comments (${comments.length})</h3>
      <div class="comment-form">
        <textarea id="commentText" placeholder="Write a comment..." rows="3"></textarea>
        <button class="btn-primary" id="submitCommentBtn" data-post-id="${post.id}">
          <i class="fas fa-paper-plane"></i> Post
        </button>
      </div>
      <div class="comment-list">
        ${comments.length === 0 
          ? '<div class="empty-state">No comments yet. Be the first!</div>'
          : comments.map(c => `
            <div class="comment">
              <div class="comment-author">${c.author}</div>
              <div class="comment-date">${formatDate(c.date)}</div>
              <div class="comment-text">${c.text}</div>
            </div>
          `).join('')
        }
      </div>
    </div>
    
    ${relatedPosts.length > 0 ? `
      <div class="related-posts">
        <h3><i class="fas fa-link"></i> Related Posts</h3>
        <div class="related-grid">
          ${relatedPosts.map(p => `
            <div class="related-card" data-post-id="${p.id}">
              <img src="${p.image}" alt="${p.title}" onerror="this.src='./assets/10165944.jpg'">
              <div class="related-card-content">
                <div class="related-card-title">${p.title}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;
  
  modal.classList.add('show');
  attachDetailEventListeners();
}

function closePostDetail() {
  const modal = document.getElementById('postDetailModal');
  modal.classList.remove('show');
}

function attachDetailEventListeners() {
  document.querySelectorAll('#postDetailContent .like-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleLike(btn.dataset.postId));
  });
  
  document.querySelectorAll('#postDetailContent .bookmark-btn').forEach(btn => {
    btn.addEventListener('click', () => toggleBookmark(btn.dataset.postId));
  });
  
  document.querySelectorAll('#postDetailContent .share-btn').forEach(btn => {
    btn.addEventListener('click', () => sharePost(btn.dataset.postId));
  });
  
  const submitBtn = document.getElementById('submitCommentBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => addComment(submitBtn.dataset.postId));
  }
  
  document.querySelectorAll('#postDetailContent .related-card').forEach(card => {
    card.addEventListener('click', () => {
      closePostDetail();
      setTimeout(() => openPostDetail(card.dataset.postId), 200);
    });
  });
}

// ===== Interactions =====
function toggleLike(postId) {
  if (!state.likes[postId]) {
    state.likes[postId] = { count: 0, liked: false };
  }
  
  state.likes[postId].liked = !state.likes[postId].liked;
  state.likes[postId].count += state.likes[postId].liked ? 1 : -1;
  
  saveToStorage(STORAGE_KEYS.LIKES, state.likes);
  
  renderPosts();
  renderTrendingPosts();
  
  const detailModal = document.getElementById('postDetailModal');
  if (detailModal.classList.contains('show')) {
    openPostDetail(postId);
  }
  
  showToast(state.likes[postId].liked ? 'Post liked!' : 'Post unliked', state.likes[postId].liked ? 'success' : 'info');
}

function toggleBookmark(postId) {
  state.bookmarks[postId] = !state.bookmarks[postId];
  saveToStorage(STORAGE_KEYS.BOOKMARKS, state.bookmarks);
  
  renderPosts();
  renderBookmarkedPosts();
  
  const detailModal = document.getElementById('postDetailModal');
  if (detailModal.classList.contains('show')) {
    openPostDetail(postId);
  }
  
  showToast(state.bookmarks[postId] ? 'Post bookmarked!' : 'Bookmark removed', state.bookmarks[postId] ? 'success' : 'info');
}

function sharePost(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post) return;
  
  if (navigator.share) {
    navigator.share({
      title: post.title,
      text: post.content.substring(0, 100),
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('Link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Could not copy link', 'error');
    });
  }
}

function addComment(postId) {
  const textarea = document.getElementById('commentText');
  const text = textarea.value.trim();
  
  if (!text) {
    showToast('Please write a comment!', 'warning');
    return;
  }
  
  const comment = {
    id: generateId(),
    author: 'Guest',
    text,
    date: getCurrentDate()
  };
  
  if (!state.comments[postId]) {
    state.comments[postId] = [];
  }
  
  state.comments[postId].unshift(comment);
  saveToStorage(STORAGE_KEYS.COMMENTS, state.comments);
  
  renderPosts();
  openPostDetail(postId);
  showToast('Comment added!', 'success');
}

function attachPostEventListeners() {
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleLike(btn.dataset.postId);
    });
  });
  
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookmark(btn.dataset.postId);
    });
  });
  
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPostDetail(btn.dataset.postId);
    });
  });
  
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      sharePost(btn.dataset.postId);
    });
  });
  
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => openPostDetail(btn.dataset.postId));
  });
  
  document.querySelectorAll('.post').forEach(post => {
    post.addEventListener('click', () => openPostDetail(post.dataset.postId));
  });
}

// ===== Search =====
function handleSearch(query) {
  state.searchQuery = query;
  renderPosts();
}

// ===== Navigation =====
function handleScroll() {
  const header = document.getElementById('main-header');
  const backToTop = document.getElementById('backToTop');
  
  if (window.scrollY > 100) {
    header.classList.add('header-scrolled');
    backToTop.classList.add('show');
  } else {
    header.classList.remove('header-scrolled');
    backToTop.classList.remove('show');
  }
}

function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('show');
}

// ===== Initialize App =====
function initializeApp() {
  initializeTheme();
  initializeData();
  
  renderCategories();
  renderPosts();
  renderTrendingPosts();
  renderBookmarkedPosts();
  renderAuthors();
  
  document.getElementById('darkModeToggle').addEventListener('click', toggleTheme);
  document.getElementById('createPostBtn').addEventListener('click', openCreatePostModal);
  document.getElementById('heroCreateBtn').addEventListener('click', openCreatePostModal);
  document.getElementById('createPostForm').addEventListener('submit', createPost);
  document.getElementById('searchInput').addEventListener('input', (e) => handleSearch(e.target.value));
  document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
  
  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeCreatePostModal();
      closePostDetail();
    });
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCreatePostModal();
        closePostDetail();
      }
    });
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCreatePostModal();
      closePostDetail();
    }
  });
  
  window.addEventListener('scroll', handleScroll);
  
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you for your message!', 'success');
    e.target.reset();
  });
  
  document.getElementById('subscribeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you for subscribing!', 'success');
    e.target.reset();
  });
  
  console.log('Blog initialized!');
}

document.addEventListener('DOMContentLoaded', initializeApp);
