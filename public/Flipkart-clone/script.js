// ─── HERO SLIDER ───
let currentIndex = 0;
const track = document.querySelector(".section-track");
const dots = document.querySelectorAll(".dot");
const totalSlides = dots.length;
let slideInterval;

function showSlide(index) {
  if (index >= totalSlides) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = totalSlides - 1;
  } else {
    currentIndex = index;
  }

  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function moveSlide(direction) {
  clearInterval(slideInterval);
  showSlide(currentIndex + direction);
  startAutoSlide();
}

function currentSlide(index) {
  clearInterval(slideInterval);
  showSlide(index);
  startAutoSlide();
}

function startAutoSlide() {
  slideInterval = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 4000);
}

// ─── PAUSE ON HOVER ───
const heroSection = document.querySelector(".hero-section");
if (heroSection) {
  heroSection.addEventListener("mouseenter", () =>
    clearInterval(slideInterval),
  );
  heroSection.addEventListener("mouseleave", () => startAutoSlide());
}

// ─── SEARCH FOCUS EFFECT ───
const searchInput = document.querySelector(".search-box input");
const searchBox = document.querySelector(".search-box");

if (searchInput && searchBox) {
  searchInput.addEventListener("focus", () => {
    searchBox.style.boxShadow = "0 2px 8px rgba(40,116,240,0.25)";
  });
  searchInput.addEventListener("blur", () => {
    searchBox.style.boxShadow = "none";
  });
}

// ─── TOAST NOTIFICATION SYSTEM ───
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
  
  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ─── WISHLIST FUNCTIONALITY ───
const WISHLIST_KEY = 'flipkart_wishlist';

// Get wishlist from localStorage
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

// Save wishlist to localStorage
function saveWishlist(items) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  updateWishlistBadge();
}

// Check if an item is in wishlist
function isInWishlist(itemId) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === itemId);
}

// Toggle wishlist item
function toggleWishlist(item) {
  const wishlist = getWishlist();
  const index = wishlist.findIndex(w => w.id === item.id);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
    showToast('Removed from Wishlist', 'error');
    return false;
  } else {
    wishlist.push({
      ...item,
      addedAt: new Date().toISOString()
    });
    saveWishlist(wishlist);
    showToast('Added to Wishlist ❤️', 'success');
    return true;
  }
}

// Update wishlist badge count
function updateWishlistBadge() {
  const badge = document.querySelector('.wishlist-badge');
  if (badge) {
    const count = getWishlist().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
    
    // Add pulse animation when count changes
    if (count > 0) {
      badge.classList.remove('pulse');
      // Trigger reflow
      void badge.offsetWidth;
      badge.classList.add('pulse');
    }
  }
}

// ─── WISHLIST BUTTON HANDLERS ───
function handleWishlistClick(event, product) {
  event.stopPropagation();
  event.preventDefault();
  
  const button = event.currentTarget;
  const isLiked = toggleWishlist(product);
  
  // Update button visual state
  if (isLiked) {
    button.classList.add('liked');
    button.querySelector('i').classList.remove('fa-regular');
    button.querySelector('i').classList.add('fa-solid');
  } else {
    button.classList.remove('liked');
    button.querySelector('i').classList.remove('fa-solid');
    button.querySelector('i').classList.add('fa-regular');
  }
}

// Initialize wishlist buttons on product cards
function initializeWishlistButtons() {
  // For brand cards
  document.querySelectorAll('.brand-card').forEach((card, index) => {
    const img = card.querySelector('.image-container img');
    const title = card.querySelector('.promo-text')?.textContent || `Product ${index + 1}`;
    
    // Check if wishlist button already exists
    if (!card.querySelector('.wishlist-btn')) {
      const product = {
        id: `brand-${index}`,
        name: title,
        image: img?.src || '',
        price: '₹499',
        description: title
      };
      
      const button = document.createElement('button');
      button.className = `wishlist-btn ${isInWishlist(product.id) ? 'liked' : ''}`;
      button.innerHTML = `<i class="${isInWishlist(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
      button.setAttribute('aria-label', 'Add to wishlist');
      
      button.addEventListener('click', (e) => handleWishlistClick(e, product));
      
      const container = card.querySelector('.image-container');
      if (container) {
        container.appendChild(button);
      }
    }
  });
  
  // For decor cards
  document.querySelectorAll('.decor-card').forEach((card, index) => {
    const img = card.querySelector('.image-wrapper img');
    const title = card.querySelector('.item-title')?.textContent || `Decor ${index + 1}`;
    
    if (!card.querySelector('.wishlist-btn')) {
      const product = {
        id: `decor-${index}`,
        name: title,
        image: img?.src || '',
        price: '₹799',
        description: title
      };
      
      const button = document.createElement('button');
      button.className = `wishlist-btn ${isInWishlist(product.id) ? 'liked' : ''}`;
      button.innerHTML = `<i class="${isInWishlist(product.id) ? 'fa-solid' : 'fa-regular'} fa-heart"></i>`;
      button.setAttribute('aria-label', 'Add to wishlist');
      
      button.addEventListener('click', (e) => handleWishlistClick(e, product));
      
      const container = card.querySelector('.image-wrapper');
      if (container) {
        container.appendChild(button);
        // Ensure container has position relative
        container.style.position = 'relative';
      }
    }
  });
}

// ─── WISHLIST PAGE FUNCTIONS ───
function renderWishlistPage() {
  const wishlistGrid = document.querySelector('.wishlist-grid');
  if (!wishlistGrid) return;
  
  const wishlist = getWishlist();
  
  if (wishlist.length === 0) {
    wishlistGrid.innerHTML = `
      <div class="wishlist-empty" style="grid-column: 1 / -1;">
        <i class="fa-regular fa-heart"></i>
        <h2>Your wishlist is empty</h2>
        <p>Start adding items you love to your wishlist!</p>
        <a href="index.html" class="shop-now-btn">Start Shopping</a>
      </div>
    `;
    return;
  }
  
  wishlistGrid.innerHTML = wishlist.map(item => `
    <div class="wishlist-item" data-id="${item.id}">
      <div class="image-container">
        <img src="${item.image || 'https://via.placeholder.com/200'}" alt="${item.name}">
        <button class="wishlist-btn liked" onclick="removeFromWishlist('${item.id}')" aria-label="Remove from wishlist">
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <div class="item-price">${item.price || '₹499'}</div>
        <p class="item-desc">${item.description || ''}</p>
        <div class="item-actions">
          <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
          <button class="remove-btn" onclick="removeFromWishlist('${item.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
  
  // Update the count
  const countElement = document.querySelector('.wishlist-count');
  if (countElement) {
    countElement.textContent = `${wishlist.length} items`;
  }
}

function removeFromWishlist(itemId) {
  const wishlist = getWishlist();
  const filtered = wishlist.filter(item => item.id !== itemId);
  saveWishlist(filtered);
  showToast('Removed from Wishlist', 'error');
  renderWishlistPage();
  updateWishlistBadge();
}

function addToCart(itemId) {
  showToast('Added to Cart! 🛒', 'success');
  // Here you would implement actual add to cart logic
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', function() {
  // Initialize wishlist buttons
  initializeWishlistButtons();
  
  // Update badge on load
  updateWishlistBadge();
  
  // If on wishlist page, render it
  if (document.querySelector('.wishlist-page')) {
    renderWishlistPage();
  }
  
  // Start slider
  startAutoSlide();
});

// Expose functions globally
window.toggleWishlist = toggleWishlist;
window.handleWishlistClick = handleWishlistClick;
window.removeFromWishlist = removeFromWishlist;
window.addToCart = addToCart;
window.showToast = showToast;