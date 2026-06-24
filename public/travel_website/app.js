/**
 * Travel Companion - Redesigned Hero Section
 * Modern, vibrant, with animations and interactions
 */

// Popular destinations for autocomplete
const popularDestinations = [
  'Paris',
  'Bali',
  'Tokyo',
  'New York',
  'Santorini',
  'Dubai'
];

// DOM Elements
const destinationInput = document.getElementById('destinationInput');
const searchBtn = document.getElementById('searchBtn');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const ctaButton = document.querySelector('.cta-button');

// ============================================
// Particle Animation System
// ============================================
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.init();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    // Create initial particles
    for (let i = 0; i < 30; i++) {
      this.particles.push(this.createParticle());
    }
    this.animate();
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      color: ['rgba(255, 107, 107,', 'rgba(74, 144, 226,', 'rgba(76, 175, 80,'][Math.floor(Math.random() * 3)]
    };
  }

  animate() {
    // Clear canvas
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.opacity += (Math.random() - 0.5) * 0.01;
      particle.opacity = Math.max(0.1, Math.min(0.6, particle.opacity));

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));

      // Draw particle
      this.ctx.fillStyle = `${particle.color}${particle.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw connections
      this.particles.forEach((other, otherIndex) => {
        if (otherIndex > index) {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 150)})`;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.stroke();
          }
        }
      });
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize particle system
const particleSystem = new ParticleSystem('particleCanvas');

// ============================================
// Search and Autocomplete Functionality
// ============================================

/**
 * Show autocomplete suggestions
 */
function showSuggestions(input) {
  const trimmedInput = input.toLowerCase().trim();

  if (trimmedInput.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  const filtered = popularDestinations.filter(dest =>
    dest.toLowerCase().startsWith(trimmedInput)
  );

  if (filtered.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  suggestionsContainer.innerHTML = filtered
    .map(dest => `
      <div class="suggestion-item" data-destination="${dest}">
        <span class="suggestion-icon">✈️</span>
        <span>${dest}</span>
      </div>
    `)
    .join('');

  suggestionsContainer.style.display = 'block';

  // Add click listeners to suggestions
  document.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      destinationInput.value = item.dataset.destination;
      suggestionsContainer.style.display = 'none';
      handleSearch();
    });
  });
}

/**
 * Handle search
 */
function handleSearch() {
  const destination = destinationInput.value.trim();

  if (!destination) {
    alert('Please enter a destination');
    return;
  }

  const isValid = popularDestinations.some(
    d => d.toLowerCase() === destination.toLowerCase()
  );

  if (isValid) {
    showSuccess(destination);
  } else {
    alert(`"${destination}" not found. Try: ${popularDestinations.slice(0, 3).join(', ')}`);
  }

  suggestionsContainer.style.display = 'none';
}

/**
 * Show success animation
 */
function showSuccess(destination) {
  // Trigger success animation
  const originalValue = destinationInput.value;
  destinationInput.style.borderColor = '#4ade80';
  
  setTimeout(() => {
    destinationInput.value = '';
    destinationInput.style.borderColor = '';
  }, 500);

  console.log(`✈️ Searching for: ${destination}`);
}

// ============================================
// Event Listeners
// ============================================

/**
 * Input event - show suggestions as user types
 */
destinationInput.addEventListener('input', (e) => {
  showSuggestions(e.target.value);
});

/**
 * Search button click
 */
searchBtn.addEventListener('click', handleSearch);

/**
 * Enter key support
 */
destinationInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

/**
 * Escape key to close suggestions
 */
destinationInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    suggestionsContainer.style.display = 'none';
  }
});

/**
 * Click outside suggestions to close
 */
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-wrapper')) {
    suggestionsContainer.style.display = 'none';
  }
});

/**
 * CTA Button click
 */
ctaButton.addEventListener('click', () => {
  const input = destinationInput.value.trim();
  if (input) {
    handleSearch();
  } else {
    destinationInput.focus();
  }
});

/**
 * Keyboard shortcut: Ctrl+K or Cmd+K to focus search
 */
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    destinationInput.focus();
  }
});

// ============================================
// Auto-focus input on load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  destinationInput.focus();
});

// ============================================
// Image Loading & Fallback System
// ============================================

const imageFallbacks = {
  tokyo: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&h=400&fit=crop',
  bali: 'https://images.unsplash.com/photo-1552733917-2c8c63c1d93d?w=600&h=400&fit=crop',
  dubai: 'https://images.unsplash.com/photo-1484557985920-dfb7c3f4b4d5?w=600&h=400&fit=crop'
};

function initImageLoading() {
  const images = document.querySelectorAll('.card-image');
  
  images.forEach(img => {
    img.addEventListener('error', (e) => {
      const card = e.target.closest('.destination-card');
      const destination = card.dataset.destination;
      
      // Try fallback image if available
      if (imageFallbacks[destination] && img.src !== imageFallbacks[destination]) {
        console.log(`Image failed for ${destination}, trying fallback...`);
        img.src = imageFallbacks[destination];
      } else {
        // Show placeholder color
        img.style.display = 'none';
        card.querySelector('.card-image-container').style.background = 
          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    });
    
    // Add loading attribute for better performance
    img.loading = 'lazy';
  });
}

// ============================================
// Wishlist Management
// ============================================

const wishlist = JSON.parse(localStorage.getItem('travelWishlist')) || [];

function initWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const card = btn.closest('.destination-card');
    const destination = card.dataset.destination;
    
    // Update UI based on stored wishlist
    if (wishlist.includes(destination)) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWishlist(destination, btn);
    });
  });
}

function toggleWishlist(destination, btn) {
  const index = wishlist.indexOf(destination);
  
  if (index > -1) {
    wishlist.splice(index, 1);
    btn.classList.remove('active');
  } else {
    wishlist.push(destination);
    btn.classList.add('active');
  }
  
  // Persist to localStorage
  localStorage.setItem('travelWishlist', JSON.stringify(wishlist));
}

// ============================================
// Filter Functionality
// ============================================

function initFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Update active state
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      
      // Filter cards
      const filterValue = pill.dataset.filter;
      filterCards(filterValue);
    });
  });
}

function filterCards(filter) {
  const cards = document.querySelectorAll('.destination-card');
  
  cards.forEach(card => {
    const categories = card.dataset.category.split(' ');
    
    if (filter === 'all' || categories.includes(filter)) {
      card.classList.remove('hidden');
      // Trigger animation
      card.style.animation = 'none';
      setTimeout(() => {
        card.style.animation = '';
      }, 10);
    } else {
      card.classList.add('hidden');
    }
  });
}

// ============================================
// Trip Planner Logic
// ============================================

const plannerSteps = document.querySelectorAll('.planner-step');
const plannerStepNumber = document.getElementById('plannerStepNumber');
const plannerProgressFill = document.getElementById('plannerProgressFill');
const plannerBackBtn = document.getElementById('plannerBackBtn');
const plannerNextBtn = document.getElementById('plannerNextBtn');
const itineraryOutput = document.getElementById('itineraryOutput');
const travelerDecrement = document.getElementById('travelerDecrement');
const travelerIncrement = document.getElementById('travelerIncrement');
const travelerCount = document.getElementById('travelerCount');
const tripTypeChips = document.querySelectorAll('.trip-type-chip');

let currentPlannerStep = 1;
let selectedTripTypes = [];
let travelers = 2;

function updatePlannerStep() {
  plannerSteps.forEach(step => {
    const stepNumber = Number(step.dataset.step);
    if (stepNumber === currentPlannerStep) {
      step.classList.remove('hidden');
    } else {
      step.classList.add('hidden');
    }
  });

  plannerStepNumber.textContent = currentPlannerStep;
  plannerProgressFill.style.width = `${((currentPlannerStep - 1) / (plannerSteps.length - 1)) * 100}%`;

  if (currentPlannerStep === 1) {
    plannerBackBtn.disabled = true;
    plannerBackBtn.classList.add('disabled');
  } else {
    plannerBackBtn.disabled = false;
    plannerBackBtn.classList.remove('disabled');
  }

  if (currentPlannerStep === plannerSteps.length) {
    plannerNextBtn.textContent = 'Generate Itinerary';
    plannerNextBtn.setAttribute('aria-label', 'Generate itinerary');
  } else {
    plannerNextBtn.textContent = 'Next';
    plannerNextBtn.setAttribute('aria-label', 'Next step');
  }
}

function getSelectedTripTypes() {
  return Array.from(tripTypeChips)
    .filter(chip => chip.classList.contains('active'))
    .map(chip => chip.dataset.type);
}

function generateMockItinerary() {
  const destination = document.getElementById('plannerDestination').value;
  const checkIn = document.getElementById('plannerCheckIn').value;
  const checkOut = document.getElementById('plannerCheckOut').value;
  const tripTypes = getSelectedTripTypes();
  const typeLabel = tripTypes.length ? tripTypes.join(', ') : 'Balanced';
  const totalDays = 4;

  const mapping = {
    Adventure: {
      morning: 'Hiking trail with scenic views',
      afternoon: 'Kayaking adventure on blue waters',
      evening: 'Sunset rooftop bonfire'
    },
    Relaxation: {
      morning: 'Spa morning and poolside lounge',
      afternoon: 'Beachside cabana retreat',
      evening: 'Sunset dinner with live music'
    },
    Culture: {
      morning: 'Museum visit and guided city tour',
      afternoon: 'Historic market and local crafts',
      evening: 'Cultural performance experience'
    },
    Food: {
      morning: 'Local breakfast tasting tour',
      afternoon: 'Street food market crawl',
      evening: 'Chef-led dining experience'
    }
  };

  const activeType = tripTypes[0] || 'Adventure';
  const itinerary = [];

  for (let day = 1; day <= totalDays; day++) {
    const activity = mapping[activeType] || mapping['Adventure'];
    itinerary.push({
      day,
      morning: activity.morning,
      afternoon: activity.afternoon,
      evening: activity.evening
    });
  }

  itineraryOutput.innerHTML = `
    <div class="itinerary-summary">
      <h3>Your ${typeLabel} itinerary for ${destination}</h3>
      <p>${checkIn ? `From ${checkIn}` : ''}${checkIn && checkOut ? ' to ' : ''}${checkOut ? `${checkOut}` : ''}</p>
    </div>
    ${itinerary.map(day => `
      <div class="itinerary-day">
        <h4>Day ${day.day}</h4>
        <p><strong>Morning:</strong> ${day.morning}</p>
        <p><strong>Afternoon:</strong> ${day.afternoon}</p>
        <p><strong>Evening:</strong> ${day.evening}</p>
      </div>
    `).join('')}
  `;
  itineraryOutput.classList.remove('hidden');
}

plannerBackBtn.addEventListener('click', () => {
  if (currentPlannerStep > 1) {
    currentPlannerStep -= 1;
    updatePlannerStep();
  }
});

plannerNextBtn.addEventListener('click', () => {
  if (currentPlannerStep < plannerSteps.length) {
    currentPlannerStep += 1;
    updatePlannerStep();
  } else {
    generateMockItinerary();
  }
});

travelerDecrement.addEventListener('click', () => {
  if (travelers > 1) {
    travelers -= 1;
    travelerCount.textContent = travelers;
  }
});

travelerIncrement.addEventListener('click', () => {
  travelers += 1;
  travelerCount.textContent = travelers;
});

tripTypeChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const isActive = chip.classList.toggle('active');
    chip.setAttribute('aria-pressed', String(isActive));
  });
});

// ============================================
// Initialize Featured Destinations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initImageLoading();
  initWishlistButtons();
  initFilters();
  updatePlannerStep();
});



