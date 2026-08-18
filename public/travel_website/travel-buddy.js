/**
 * Find a Travel Buddy - Frontend Prototype
 *
 * This is a UI-only demo: the traveler list below is hardcoded mock data,
 * filtering happens entirely in the browser, and the "Connect" modal shows
 * a scripted sample conversation. Nothing here talks to a backend, and no
 * real messages are sent or stored.
 */

// ============================================
// Mock Traveler Data
// ============================================
const TRAVELERS = [
  {
    id: 1,
    name: 'Maya Chen',
    ageRange: '25-30',
    destination: 'Bali, Indonesia',
    startDate: '2026-09-05',
    endDate: '2026-09-15',
    interests: ['Adventure', 'Relaxation'],
    style: 'Backpacker',
    avatar: 'https://i.pravatar.cc/150?img=47',
    bio: 'Yoga instructor chasing waterfalls and sunrise hikes. Always up for a spontaneous adventure!'
  },
  {
    id: 2,
    name: 'Diego Ramirez',
    ageRange: '30-35',
    destination: 'Tokyo, Japan',
    startDate: '2026-10-01',
    endDate: '2026-10-10',
    interests: ['Food', 'Culture'],
    style: 'Solo-friendly',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Ramen enthusiast and amateur photographer exploring neon streets and quiet temples.'
  },
  {
    id: 3,
    name: 'Priya Nair',
    ageRange: '22-27',
    destination: 'Paris, France',
    startDate: '2026-09-20',
    endDate: '2026-09-27',
    interests: ['Culture', 'Food'],
    style: 'Luxury',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bio: 'Art history nerd on a mission to visit every museum in Europe, one croissant at a time.'
  },
  {
    id: 4,
    name: "Liam O'Connor",
    ageRange: '35-40',
    destination: 'Santorini, Greece',
    startDate: '2026-08-25',
    endDate: '2026-09-02',
    interests: ['Relaxation', 'Culture'],
    style: 'Family',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Traveling with my two kids — looking for family-friendly adventures and sunset views.'
  },
  {
    id: 5,
    name: 'Aiko Tanaka',
    ageRange: '28-33',
    destination: 'Dubai, UAE',
    startDate: '2026-11-05',
    endDate: '2026-11-12',
    interests: ['Adventure', 'Culture'],
    style: 'Luxury',
    avatar: 'https://i.pravatar.cc/150?img=44',
    bio: 'Desert safaris by day, rooftop skylines by night. Let’s find the best views together.'
  },
  {
    id: 6,
    name: 'Marcus Webb',
    ageRange: '26-31',
    destination: 'New York, USA',
    startDate: '2026-09-12',
    endDate: '2026-09-18',
    interests: ['Food', 'Culture'],
    style: 'Solo-friendly',
    avatar: 'https://i.pravatar.cc/150?img=53',
    bio: 'Food-truck hopper and Broadway addict. First time traveling solo and excited to meet people.'
  },
  {
    id: 7,
    name: 'Sofia Rossi',
    ageRange: '24-29',
    destination: 'Bali, Indonesia',
    startDate: '2026-09-08',
    endDate: '2026-09-18',
    interests: ['Relaxation', 'Adventure'],
    style: 'Backpacker',
    avatar: 'https://i.pravatar.cc/150?img=29',
    bio: 'Surf instructor looking for a dive buddy and a beach bonfire crew.'
  },
  {
    id: 8,
    name: 'Noah Kim',
    ageRange: '31-36',
    destination: 'Tokyo, Japan',
    startDate: '2026-10-05',
    endDate: '2026-10-14',
    interests: ['Culture', 'Adventure'],
    style: 'Solo-friendly',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Ex-consultant turned digital nomad. Into temples, hiking trails and good coffee.'
  },
  {
    id: 9,
    name: 'Emma Fischer',
    ageRange: '40-45',
    destination: 'Santorini, Greece',
    startDate: '2026-08-28',
    endDate: '2026-09-04',
    interests: ['Relaxation', 'Food'],
    style: 'Luxury',
    avatar: 'https://i.pravatar.cc/150?img=65',
    bio: 'Wine tours and slow mornings. Traveling with my partner, open to meeting fellow couples or friends.'
  },
  {
    id: 10,
    name: 'Tariq Hassan',
    ageRange: '27-32',
    destination: 'Dubai, UAE',
    startDate: '2026-11-01',
    endDate: '2026-11-09',
    interests: ['Adventure', 'Food'],
    style: 'Family',
    avatar: 'https://i.pravatar.cc/150?img=22',
    bio: 'Bringing the whole family for desert dune bashing and the best kebabs in town.'
  }
];

// ============================================
// DOM Elements
// ============================================
const navbar = document.getElementById('navbar');
const navbarToggle = document.getElementById('navbarToggle');
const navbarLinks = document.getElementById('navbarLinks');
const navbarLinkItems = document.querySelectorAll('.navbar-link');

const buddyFilterForm = document.getElementById('buddyFilterForm');
const filterDestination = document.getElementById('filterDestination');
const filterStartDate = document.getElementById('filterStartDate');
const filterEndDate = document.getElementById('filterEndDate');
const filterStyle = document.getElementById('filterStyle');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

const buddyGrid = document.getElementById('buddyGrid');
const resultsCount = document.getElementById('resultsCount');
const noResultsMessage = document.getElementById('noResultsMessage');

const chatModalOverlay = document.getElementById('chatModalOverlay');
const chatModal = document.getElementById('chatModal');
const chatModalClose = document.getElementById('chatModalClose');
const chatModalAvatar = document.getElementById('chatModalAvatar');
const chatModalTitle = document.getElementById('chatModalTitle');
const chatModalMessages = document.getElementById('chatModalMessages');

let lastFocusedElement = null;

// ============================================
// Navbar Functionality (scroll + mobile toggle)
// ============================================
function updateNavbarBackground() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function closeNavbarMenu() {
  navbarToggle.classList.remove('active');
  navbarLinks.classList.remove('active');
  navbarToggle.setAttribute('aria-expanded', 'false');
}

navbarToggle.addEventListener('click', () => {
  const isActive = navbarToggle.classList.toggle('active');
  navbarLinks.classList.toggle('active');
  navbarToggle.setAttribute('aria-expanded', String(isActive));
});

navbarLinkItems.forEach(link => {
  link.addEventListener('click', () => closeNavbarMenu());
});

window.addEventListener('scroll', updateNavbarBackground);
updateNavbarBackground();

// ============================================
// Filtering
// ============================================

/**
 * Read the current state of the filter form.
 */
function getActiveFilters() {
  const interests = Array.from(
    document.querySelectorAll('input[name="interests"]:checked')
  ).map(checkbox => checkbox.value);

  return {
    destination: filterDestination.value.trim().toLowerCase(),
    startDate: filterStartDate.value ? new Date(filterStartDate.value) : null,
    endDate: filterEndDate.value ? new Date(filterEndDate.value) : null,
    interests,
    style: filterStyle.value
  };
}

/**
 * Check whether a traveler matches the active filters.
 * - Destination: partial, case-insensitive match.
 * - Dates: traveler's trip must overlap the selected range.
 * - Interests: matches if the traveler shares at least one selected interest.
 * - Style: exact match, ignored when "Any style" is selected.
 */
function matchesFilters(traveler, filters) {
  if (filters.destination && !traveler.destination.toLowerCase().includes(filters.destination)) {
    return false;
  }

  if (filters.style && traveler.style !== filters.style) {
    return false;
  }

  if (filters.interests.length > 0) {
    const hasSharedInterest = filters.interests.some(interest => traveler.interests.includes(interest));
    if (!hasSharedInterest) return false;
  }

  if (filters.startDate || filters.endDate) {
    const travelerStart = new Date(traveler.startDate);
    const travelerEnd = new Date(traveler.endDate);

    if (filters.startDate && travelerEnd < filters.startDate) return false;
    if (filters.endDate && travelerStart > filters.endDate) return false;
  }

  return true;
}

function applyFilters() {
  const filters = getActiveFilters();
  const filtered = TRAVELERS.filter(traveler => matchesFilters(traveler, filters));
  renderCards(filtered);
}

// ============================================
// Rendering
// ============================================

function formatDateRange(startISO, endISO) {
  const options = { month: 'short', day: 'numeric' };
  const start = new Date(startISO);
  const end = new Date(endISO);
  const year = end.getFullYear();

  return `${start.toLocaleDateString('en-US', options)} – ${end.toLocaleDateString('en-US', options)}, ${year}`;
}

function renderCards(travelers) {
  buddyGrid.innerHTML = travelers
    .map(traveler => `
      <article class="buddy-card" data-id="${traveler.id}">
        <div class="buddy-card-header">
          <img class="buddy-avatar" src="${traveler.avatar}" alt="${traveler.name}'s avatar" loading="lazy" />
          <div>
            <p class="buddy-name">${traveler.name}</p>
            <p class="buddy-age">Age ${traveler.ageRange}</p>
          </div>
        </div>

        <div class="buddy-meta">
          <span>📍 ${traveler.destination}</span>
          <span>📅 ${formatDateRange(traveler.startDate, traveler.endDate)}</span>
        </div>

        <span class="buddy-style-badge">${traveler.style}</span>

        <div class="buddy-interests">
          ${traveler.interests.map(interest => `<span class="buddy-tag">${interest}</span>`).join('')}
        </div>

        <p class="buddy-bio">${traveler.bio}</p>

        <button type="button" class="buddy-connect-btn" data-id="${traveler.id}">
          Connect
        </button>
      </article>
    `)
    .join('');

  resultsCount.textContent = `${travelers.length} traveler${travelers.length === 1 ? '' : 's'} found`;
  noResultsMessage.classList.toggle('hidden', travelers.length > 0);
}

// ============================================
// Filter Events
// ============================================
buddyFilterForm.addEventListener('submit', e => {
  e.preventDefault();
  applyFilters();
});

// Live-update as filters change, in addition to the explicit submit button
[filterDestination, filterStartDate, filterEndDate, filterStyle].forEach(field => {
  field.addEventListener('input', applyFilters);
});

document.querySelectorAll('input[name="interests"]').forEach(checkbox => {
  checkbox.addEventListener('change', applyFilters);
});

resetFiltersBtn.addEventListener('click', () => {
  buddyFilterForm.reset();
  applyFilters();
});

// ============================================
// Mock Chat Modal
// ============================================

/**
 * Builds a static, scripted 6-message conversation for the demo. The copy
 * is templated with the traveler's own details purely for realism - it is
 * still a hardcoded script, not a live/real conversation.
 */
function buildMockConversation(traveler) {
  const firstName = traveler.name.split(' ')[0];
  const topInterest = traveler.interests[0].toLowerCase();
  const dates = formatDateRange(traveler.startDate, traveler.endDate);

  return [
    { sender: 'them', text: `Hi! I saw you're also headed to ${traveler.destination} (${dates}) — want to team up? 👋` },
    { sender: 'you', text: `Hey ${firstName}! That sounds great, I'm really into ${topInterest} trips too.` },
    { sender: 'them', text: `Perfect, that's kind of my thing! I usually travel ${traveler.style.toLowerCase()}-style, does that work for you?` },
    { sender: 'you', text: `Totally works for me. What part of the trip are you most excited about?` },
    { sender: 'them', text: `Honestly just meeting new people and exploring somewhere new. Let's swap plans closer to the date!` },
    { sender: 'you', text: `Sounds like a plan — looking forward to it! ✈️` }
  ];
}

function renderConversation(messages) {
  chatModalMessages.innerHTML = messages
    .map(message => `<p class="chat-bubble ${message.sender}">${message.text}</p>`)
    .join('');
}

function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
  );
}

function openChatModal(traveler) {
  lastFocusedElement = document.activeElement;

  chatModalAvatar.src = traveler.avatar;
  chatModalAvatar.alt = `${traveler.name}'s avatar`;
  chatModalTitle.textContent = `Chat with ${traveler.name}`;
  renderConversation(buildMockConversation(traveler));

  chatModalOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  chatModalClose.focus();
}

function closeChatModal() {
  chatModalOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');

  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

// Open modal when a "Connect" button is clicked (event delegation)
buddyGrid.addEventListener('click', e => {
  const connectBtn = e.target.closest('.buddy-connect-btn');
  if (!connectBtn) return;

  const traveler = TRAVELERS.find(t => t.id === Number(connectBtn.dataset.id));
  if (traveler) openChatModal(traveler);
});

chatModalClose.addEventListener('click', closeChatModal);

// Click outside the dialog (on the overlay) closes the modal
chatModalOverlay.addEventListener('click', e => {
  if (e.target === chatModalOverlay) closeChatModal();
});

// Escape key closes the modal; Tab is trapped inside while it's open
document.addEventListener('keydown', e => {
  if (chatModalOverlay.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    closeChatModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = getFocusableElements(chatModal);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// The message form is disabled by design (prototype only) - guard against submit
document.getElementById('modalInputForm').addEventListener('submit', e => {
  e.preventDefault();
});

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  renderCards(TRAVELERS);
});
