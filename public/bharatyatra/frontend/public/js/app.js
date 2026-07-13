/**
 * BharatYatra — Frontend Application
 * Vanilla JS, no framework dependencies.
 */

'use strict';

/* ── State ─────────────────────────────────────────────────── */
const state = {
  destinations: [],
  activeFilter: 'all',
};

/* ── DOM References ────────────────────────────────────────── */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

/* ═══════════════════════════════════════════════════════════
   NAVBAR — Scroll behaviour + mobile hamburger
   ═══════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('.nav-links');

  // Scroll shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu on nav link click
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   HERO — Animated floating particles
   ═══════════════════════════════════════════════════════════ */
function initHeroParticles() {
  const container = $('#heroParticles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${8 + Math.random() * 12}s;
      animation-delay: ${Math.random() * 8}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
}

/* ═══════════════════════════════════════════════════════════
   DESTINATIONS — Fetch & Render
   ═══════════════════════════════════════════════════════════ */
async function fetchDestinations() {
  const grid = $('#destinationsGrid');
  const errorState = $('#errorState');

  // Show skeletons
  grid.style.display = 'grid';
  errorState.style.display = 'none';
  grid.innerHTML = `
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
    <div class="card-skeleton"></div>
  `;

  try {
    const response = await fetch('/api/destinations');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { data, success } = await response.json();
    if (!success || !Array.isArray(data)) throw new Error('Invalid API response');

    state.destinations = data;
    renderDestinations(data);

    // Populate booking dropdown
    populateDestinationDropdown(data);

  } catch (err) {
    console.error('Failed to fetch destinations:', err);
    grid.style.display = 'none';
    errorState.style.display = 'block';
  }
}

function renderDestinations(destinations) {
  const grid = $('#destinationsGrid');

  if (destinations.length === 0) {
    grid.innerHTML = `
      <div class="error-state" style="grid-column: 1/-1; display:block;">
        <div class="error-icon">🗺️</div>
        <h3>No destinations found</h3>
        <p>Try selecting a different category filter.</p>
      </div>`;
    return;
  }

  grid.innerHTML = '';
  destinations.forEach((dest, i) => {
    const card = createDestinationCard(dest, i);
    grid.appendChild(card);
  });
}

function createDestinationCard(dest, index) {
  const card = document.createElement('article');
  card.classList.add('destination-card');
  card.dataset.id = dest._id;
  card.dataset.category = dest.category;
  card.style.animationDelay = `${index * 0.1}s`;

  // Fallback image
  const imgSrc = dest.image || `https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80`;

  card.innerHTML = `
    <div class="card-image-wrapper">
      <img
        src="${escapeHtml(imgSrc)}"
        alt="${escapeHtml(dest.title)}"
        loading="lazy"
        onerror="this.src='https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'"
      />
      <span class="card-category ${escapeHtml(dest.category)}">${escapeHtml(dest.category)}</span>
      <span class="card-rating">${dest.rating ? dest.rating.toFixed(1) : '4.8'}</span>
    </div>
    <div class="card-body">
      <p class="card-region">${escapeHtml(dest.region)}</p>
      <h3 class="card-title">${escapeHtml(dest.title)}</h3>
      <p class="card-description">${escapeHtml(dest.description)}</p>
      <div class="card-footer">
        <div class="card-visit-time">
          <strong>Best Time</strong>
          ${escapeHtml(dest.bestTimeToVisit || 'Oct – Mar')}
        </div>
        <a href="#booking" class="card-book-btn" data-dest-id="${escapeHtml(dest._id)}" data-dest-name="${escapeHtml(dest.title)}">
          Book Now →
        </a>
      </div>
    </div>
  `;

  // Clicking "Book Now" on a card pre-selects the destination
  const bookBtn = card.querySelector('.card-book-btn');
  bookBtn.addEventListener('click', (e) => {
    const destId = e.currentTarget.dataset.destId;
    const select = $('#destinationSelect');
    if (select) {
      select.value = destId;
      select.dispatchEvent(new Event('change'));
    }
  });

  return card;
}

/* ═══════════════════════════════════════════════════════════
   CATEGORY FILTER PILLS
   ═══════════════════════════════════════════════════════════ */
function initFilterPills() {
  const pills = $$('.pill');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      state.activeFilter = filter;

      const filtered =
        filter === 'all'
          ? state.destinations
          : state.destinations.filter((d) => d.category === filter);

      renderDestinations(filtered);
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   BOOKING FORM — Populate select + counter + submit
   ═══════════════════════════════════════════════════════════ */
function populateDestinationDropdown(destinations) {
  const select = $('#destinationSelect');
  if (!select) return;

  select.innerHTML = '<option value="">— Select a destination —</option>';
  destinations.forEach((dest) => {
    const option = document.createElement('option');
    option.value = dest._id;
    option.textContent = `${dest.title} · ${dest.category}`;
    select.appendChild(option);
  });
}

function initTravelersCounter() {
  const input = $('#travelersCount');
  const decBtn = $('#decrementBtn');
  const incBtn = $('#incrementBtn');
  if (!input || !decBtn || !incBtn) return;

  decBtn.addEventListener('click', () => {
    const current = parseInt(input.value, 10);
    if (current > 1) input.value = current - 1;
  });

  incBtn.addEventListener('click', () => {
    const current = parseInt(input.value, 10);
    if (current < 50) input.value = current + 1;
  });
}

function initMinTravelDate() {
  const dateInput = $('#travelDate');
  if (!dateInput) return;

  // Set minimum date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  dateInput.min = tomorrow.toISOString().split('T')[0];
}

async function submitBooking(formData) {
  const alert = $('#formAlert');
  const submitBtn = $('#submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  // Loading state
  submitBtn.disabled = true;
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-flex';
  alert.style.display = 'none';

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showFormAlert('success', `✈️ ${result.message}`);
      $('#bookingForm').reset();
      $('#travelersCount').value = 2;
      populateDestinationDropdown(state.destinations);
      initMinTravelDate();
    } else {
      showFormAlert('error', `⚠️ ${result.message || 'Something went wrong. Please try again.'}`);
    }
  } catch (err) {
    console.error('Booking submission error:', err);
    showFormAlert('error', '⚠️ Network error. Please check your connection and try again.');
  } finally {
    submitBtn.disabled = false;
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
  }
}

function showFormAlert(type, message) {
  const alert = $('#formAlert');
  alert.className = `form-alert ${type}`;
  alert.textContent = message;
  alert.style.display = 'block';

  // Scroll into view
  alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Auto-hide success after 8 seconds
  if (type === 'success') {
    setTimeout(() => {
      alert.style.display = 'none';
    }, 8000);
  }
}

function validateBookingForm(data) {
  if (!data.userEmail || !/^\S+@\S+\.\S+$/.test(data.userEmail)) {
    return 'Please enter a valid email address.';
  }
  if (!data.destinationId) {
    return 'Please select a destination.';
  }
  if (!data.travelDate) {
    return 'Please choose a travel date.';
  }
  if (new Date(data.travelDate) <= new Date()) {
    return 'Travel date must be in the future.';
  }
  if (!data.travelersCount || data.travelersCount < 1) {
    return 'Please enter at least 1 traveler.';
  }
  return null;
}

function initBookingForm() {
  const form = $('#bookingForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      userEmail: $('#userEmail').value.trim(),
      destinationId: $('#destinationSelect').value,
      travelDate: $('#travelDate').value,
      travelersCount: parseInt($('#travelersCount').value, 10),
      specialRequests: $('#specialRequests').value.trim(),
    };

    // Client-side validation
    const validationError = validateBookingForm(formData);
    if (validationError) {
      showFormAlert('error', `⚠️ ${validationError}`);
      return;
    }

    await submitBooking(formData);
  });
}

/* ═══════════════════════════════════════════════════════════
   UTILITY — Escape HTML to prevent XSS
   ═══════════════════════════════════════════════════════════ */
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ═══════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — Reveal animations on scroll
   ═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealEls = $$('.feature, .sidebar-card, .about-text');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL — for in-page anchors
   ═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navH = document.getElementById('navbar').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT — Bootstrap all modules on DOM ready
   ═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroParticles();
  initFilterPills();
  initTravelersCounter();
  initMinTravelDate();
  initBookingForm();
  initScrollReveal();
  initSmoothScroll();

  // Primary data fetch — destinations power both the grid and booking dropdown
  fetchDestinations();
});