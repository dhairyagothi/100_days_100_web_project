
// ─── State ───────────────────────────────────────────────────
let allCountries   = [];          // raw data from API
let filtered       = [];          // current filtered/sorted list
let favorites      = new Set();   // stored in localStorage
let showFavsOnly   = false;       // favourites filter toggle
let currentCountry = null;        // country open in modal
let comparisonList = [];        // countries to compare (max 2)

// ─── DOM References ─────────────────────────────────────────
const cardsGrid      = document.getElementById('cardsGrid');
const favGrid        = document.getElementById('favGrid');
const favSection     = document.getElementById('favorites-section');
const spinnerWrap    = document.getElementById('spinnerWrap');
const noResults      = document.getElementById('noResults');
const countLabel     = document.getElementById('countLabel');
const searchInput    = document.getElementById('searchInput');
const searchClear    = document.getElementById('searchClear');
const continentFilter= document.getElementById('continentFilter');
const sortSelect     = document.getElementById('sortSelect');
const showFavBtn     = document.getElementById('showFavBtn');
const comparisonPanel= document.getElementById('comparisonPanel');
const comparisonWrap = document.getElementById('comparisonWrap');
const clearComparisonBtn = document.getElementById('clearComparisonBtn');
const toast          = document.getElementById('toast');

// Modal
const modalOverlay   = document.getElementById('modalOverlay');
const modalClose     = document.getElementById('modalClose');
const modalFlag      = document.getElementById('modalFlag');
const modalCountryName = document.getElementById('modalCountryName');
const modalRegion    = document.getElementById('modalRegion');
const modalFavBtn    = document.getElementById('modalFavBtn');
const modalCapital   = document.getElementById('modalCapital');
const modalPopulation= document.getElementById('modalPopulation');
const modalSubregion = document.getElementById('modalSubregion');
const modalArea      = document.getElementById('modalArea');
const modalLanguages = document.getElementById('modalLanguages');
const modalCurrency  = document.getElementById('modalCurrency');
const modalTimezones = document.getElementById('modalTimezones');
const modalTLD       = document.getElementById('modalTLD');
const modalFacts     = document.getElementById('modalFacts');
const modalMapsLink  = document.getElementById('modalMapsLink');

// Nav
const themeToggle    = document.getElementById('themeToggle');
const themeIcon      = document.getElementById('themeIcon');
const hamburger      = document.getElementById('hamburger');
const navLinks       = document.getElementById('navLinks');

// ─── Init ────────────────────────────────────────────────────
(function init() {
  loadFavorites();
  loadComparison();
  applyStoredTheme();
  fetchCountries();
  bindEvents();
})();

// ─── Fetch Countries ─────────────────────────────────────────
async function fetchCountries() {
  showSpinner(true);

  try {
    const res = await fetch('./countries.json');

    if (!res.ok)
      throw new Error(`HTTP ${res.status}`);

    allCountries = await res.json();
    filtered = [...allCountries];

    applyFilters();
  }
  catch (err) {
    console.error('Failed to fetch countries:', err);
    showSpinner(false);
    countLabel.textContent = 'Failed to load data. Please refresh.';
  }
}

// ─── Render Cards ────────────────────────────────────────────
function renderCards(list, container) {
  container.innerHTML = '';

  if (!list.length) {
    if (container === cardsGrid) noResults.hidden = false;
    return;
  }
  noResults.hidden = true;

  // Add stagger delay for animation
  list.forEach((country, i) => {
    const card = createCard(country, i);
    container.appendChild(card);
  });
}

/**
 * Build a single country card element
 */
function createCard(country, index = 0) {
  const name    = country.name?.common || 'Unknown';
  const flag    = country.flags?.svg || country.flags?.png || '';
  const capital = (country.capital && country.capital[0]) || 'N/A';
  const region  = country.region || 'N/A';
  const pop     = formatNumber(country.population);
  const isFav   = favorites.has(country.cca2);
  const isSelected = comparisonList.findIndex(c => c.cca2 === country.cca2) !== -1;

  const card    = document.createElement('div');
  card.className = `country-card ${isSelected ? 'selected' : ''}`;
  card.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`;
  card.setAttribute('role', 'button');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `View details for ${name}`);
  card.setAttribute('data-cca2', country.cca2);

  card.innerHTML = `
    <div class="card-flag-wrap">
      <img class="card-flag" src="${flag}" alt="Flag of ${name}" loading="lazy" />
      <span class="card-fav-badge ${isFav ? 'active' : ''}" data-fav="${country.cca2}" aria-label="${isFav ? 'Favourited' : 'Not favourited'}">
        ${isFav ? '⭐' : '☆'}
      </span>
    </div>
    <div class="card-body">
      <p class="card-name" title="${name}">${name}</p>
      <div class="card-meta">
        <span class="card-meta-item"><span class="card-meta-label">Capital</span>${capital}</span>
        <span class="card-meta-item"><span class="card-meta-label">Region</span>${region}</span>
        <span class="card-meta-item"><span class="card-meta-label">People</span>${pop}</span>
      </div>
      <button class="compare-btn" aria-label="Compare ${name}">${isSelected ? '✅ Compared' : 'Compare'}</button>
    </div>
  `;

  // Click → open modal
  card.addEventListener('click', () => openModal(country));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(country); }
  });

  // Favourite badge click (stop propagation so card click doesn't fire)
  const badge = card.querySelector('.card-fav-badge');
  badge.addEventListener('click', e => {
    e.stopPropagation();
    toggleFavorite(country.cca2);
    const isFavNow = favorites.has(country.cca2);
    badge.textContent  = isFavNow ? '⭐' : '☆';
    badge.classList.toggle('active', isFavNow);
    renderFavSection();
  });

  // Compare button click (stop propagation)
  const compareBtn = card.querySelector('.compare-btn');
  compareBtn.addEventListener('click', e => {
    e.stopPropagation();
    toggleComparison(country);
  });

  return card;
}

// ─── Modal ───────────────────────────────────────────────────

/**
 * Open the detail modal for a given country object
 */
function openModal(country) {
  currentCountry = country;
  const name = country.name?.common || 'Unknown';

  modalFlag.src   = country.flags?.svg || country.flags?.png || '';
  modalFlag.alt   = `Flag of ${name}`;
  modalCountryName.textContent = name;
  modalRegion.textContent      = `${country.region || ''}${country.subregion ? ' · ' + country.subregion : ''}`;

  // Populate info fields
  modalCapital.textContent    = (country.capital && country.capital.join(', ')) || 'N/A';
  modalPopulation.textContent = formatNumber(country.population);
  modalSubregion.textContent  = country.subregion || 'N/A';
  modalArea.textContent       = country.area ? `${formatNumber(country.area)} km²` : 'N/A';
  modalTimezones.textContent  = (country.timezones || []).join(', ') || 'N/A';
  modalTLD.textContent        = (country.tld || []).join(', ') || 'N/A';

  // Languages
  const langs = country.languages ? Object.values(country.languages) : [];
  modalLanguages.textContent  = langs.length ? langs.join(', ') : 'N/A';

  // Currencies
  const currencies = country.currencies
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ')
    : 'N/A';
  modalCurrency.textContent = currencies;

  // Google Maps
  modalMapsLink.href = country.maps?.googleMaps || `https://www.google.com/maps/search/${encodeURIComponent(name)}`;

  // Interesting Facts
  modalFacts.innerHTML = generateFacts(country)
    .map(f => `<li>${f}</li>`)
    .join('');

  // Favourite button state
  updateModalFavBtn(country.cca2);

  // Show the modal
  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
  currentCountry = null;
}

/**
 * Generate interesting facts based on available data
 */
function generateFacts(c) {
  const facts = [];
  const name = c.name?.common || 'This country';

  if (c.population)
    facts.push(`${name} has a population of ${formatNumber(c.population)} people.`);

  if (c.area)
    facts.push(`It covers an area of ${formatNumber(c.area)} km², making it ${sizeCategory(c.area)}.`);

  if (c.timezones && c.timezones.length > 1)
    facts.push(`It spans ${c.timezones.length} timezones — from ${c.timezones[0]} to ${c.timezones[c.timezones.length - 1]}.`);
  else if (c.timezones && c.timezones.length === 1)
    facts.push(`The timezone is ${c.timezones[0]}.`);

  const langs = c.languages ? Object.values(c.languages) : [];
  if (langs.length > 1)
    facts.push(`${langs.length} official languages are spoken: ${langs.join(', ')}.`);

  if (c.currencies) {
    const currNames = Object.values(c.currencies).map(x => x.name);
    facts.push(`The official ${currNames.length > 1 ? 'currencies are' : 'currency is'} ${currNames.join(' and ')}.`);
  }

  if (c.capital && c.capital.length > 1)
    facts.push(`It has ${c.capital.length} capital cities: ${c.capital.join(', ')}.`);

  if (c.tld && c.tld.length)
    facts.push(`Its internet domain extension is ${c.tld.join(' / ')}.`);

  if (c.subregion)
    facts.push(`${name} is part of the ${c.subregion} subregion in ${c.region}.`);

  // Always return at least 3 facts
  while (facts.length < 3)
    facts.push('More detailed information is available on the Google Maps link below.');

  return facts.slice(0, 6);
}

function sizeCategory(area) {
  if (area > 8_000_000) return 'one of the largest countries in the world';
  if (area > 1_000_000) return 'a very large country';
  if (area > 100_000)   return 'a medium-sized country';
  if (area > 10_000)    return 'a relatively small country';
  return 'a small nation';
}

// ─── Filters & Sorting ───────────────────────────────────────

/**
 * Central function: apply search + continent filter + sort
 */
function applyFilters() {
  showSpinner(false);
  const query     = searchInput.value.trim().toLowerCase();
  const continent = continentFilter.value;
  const sort      = sortSelect.value;

  filtered = allCountries.filter(c => {
    const name = (c.name?.common || '').toLowerCase();
    const matchSearch   = !query || name.includes(query);
    const matchContinent = continent === 'all' || c.region === continent;
    return matchSearch && matchContinent;
  });

  // Sort
  filtered.sort((a, b) => {
    switch (sort) {
      case 'name-asc':  return (a.name?.common || '').localeCompare(b.name?.common || '');
      case 'name-desc': return (b.name?.common || '').localeCompare(a.name?.common || '');
      case 'pop-desc':  return (b.population || 0) - (a.population || 0);
      case 'pop-asc':   return (a.population || 0) - (b.population || 0);
      default:          return 0;
    }
  });

  // Update UI
  noResults.hidden = true;
  renderCards(filtered, cardsGrid);
  countLabel.textContent = filtered.length
    ? `Showing ${filtered.length} ${filtered.length === 1 ? 'country' : 'countries'}`
    : '';

  renderFavSection();
  renderComparisonPanel();
  updateSelectedCards();
}

// ─── Favourites ──────────────────────────────────────────────
function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem('wex_favorites') || '[]');
    favorites    = new Set(stored);
  } catch { favorites = new Set(); }
}

function saveFavorites() {
  localStorage.setItem('wex_favorites', JSON.stringify([...favorites]));
}

function toggleFavorite(cca2) {
  if (favorites.has(cca2)) favorites.delete(cca2);
  else                      favorites.add(cca2);
  saveFavorites();
  if (currentCountry?.cca2 === cca2) updateModalFavBtn(cca2);
}

function updateModalFavBtn(cca2) {
  const isFav = favorites.has(cca2);
  modalFavBtn.textContent = isFav ? '⭐ Favourited' : '☆ Add to Favourites';
  modalFavBtn.classList.toggle('is-fav', isFav);
}

function renderFavSection() {
  const favCountries = allCountries.filter(c => favorites.has(c.cca2));
  if (!favCountries.length) {
    favSection.hidden = true;
    return;
  }
  favSection.hidden = false;
  renderCards(favCountries, favGrid);
}

// ─── Theme ───────────────────────────────────────────────────
function applyStoredTheme() {
  const stored = localStorage.getItem('wex_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);
  themeIcon.textContent = stored === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('wex_theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
}

// ─── Helpers ─────────────────────────────────────────────────
function formatNumber(n) {
  if (!n && n !== 0) return 'N/A';
  return new Intl.NumberFormat().format(n);
}

function showSpinner(visible) {
  spinnerWrap.style.display = visible ? 'flex' : 'none';
  if (visible) cardsGrid.innerHTML = '';
}

// ─── Event Bindings ──────────────────────────────────────────
function bindEvents() {
  // Search input (debounced)
  let searchTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchClear.classList.toggle('visible', !!searchInput.value);
    searchTimer = setTimeout(applyFilters, 280);
  });

  // Clear search
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.classList.remove('visible');
    applyFilters();
    searchInput.focus();
  });

  // Continent filter
  continentFilter.addEventListener('change', applyFilters);

  // Sort
  sortSelect.addEventListener('change', applyFilters);

  // Show favourites toggle
  showFavBtn.addEventListener('click', () => {
    showFavBtn.classList.toggle('active');
    const el = document.getElementById('favorites-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Modal close button
  modalClose.addEventListener('click', closeModal);

  // Close modal on overlay backdrop click
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  // Favourite button inside modal
  modalFavBtn.addEventListener('click', () => {
    if (!currentCountry) return;
    toggleFavorite(currentCountry.cca2);
    // Refresh card badges in grid
    refreshCardBadge(currentCountry.cca2);
    renderFavSection();
  });

  // Theme toggle
  themeToggle.addEventListener('click', toggleTheme);

  // Mobile hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Clear comparison button
  clearComparisonBtn.addEventListener('click', clearComparison);

  // Navbar background changes on scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.style.background = window.scrollY > 60
      ? ''  /* let CSS handle it */
      : '';
  }, { passive: true });
}

/**
 * Refresh the favourite badge on a specific card in the grid (without full re-render)
 */
function refreshCardBadge(cca2) {
  const badge = cardsGrid.querySelector(`[data-fav="${cca2}"]`);
  if (badge) {
    const isFav = favorites.has(cca2);
    badge.textContent = isFav ? '⭐' : '☆';
    badge.classList.toggle('active', isFav);
  }
}

// ─── Comparison ───────────────────────────────────────────────

function loadComparison() {
  try {
    const stored = JSON.parse(localStorage.getItem('wex_comparison') || '[]');
    comparisonList = stored;
  } catch { comparisonList = []; }
}

function saveComparison() {
  localStorage.setItem('wex_comparison', JSON.stringify(comparisonList));
}

function toggleComparison(country) {
  const index = comparisonList.findIndex(c => c.cca2 === country.cca2);
  if (index !== -1) {
    comparisonList.splice(index, 1);
  } else if (comparisonList.length >= 2) {
    showToast('You can compare only two countries at a time.');
    return;
  } else {
    comparisonList.push(country);
  }
  saveComparison();
  renderComparisonPanel();
  updateSelectedCards();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}

function renderComparisonPanel() {
  if (comparisonList.length === 0) {
    comparisonPanel.hidden = true;
    return;
  }
  comparisonPanel.hidden = false;
  comparisonWrap.innerHTML = comparisonList.map(country => {
    const name = country.name?.common || 'Unknown';
    const flag = country.flags?.svg || country.flags?.png || '';
    const capital = (country.capital && country.capital[0]) || 'N/A';
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const pop = formatNumber(country.population);
    const area = country.area ? `${formatNumber(country.area)} km²` : 'N/A';
    const langs = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const currencies = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ') : 'N/A';
    const timezones = (country.timezones || []).join(', ') || 'N/A';

    return `
      <div class="comparison-card">
        <img src="${flag}" alt="Flag of ${name}" class="comparison-flag" loading="lazy">
        <h3 class="comparison-name">${name}</h3>
        <div class="comparison-info">
          <div class="info-item">
            <span class="info-icon">🏙️</span>
            <div>
              <p class="info-label">Capital</p>
              <p class="info-value">${capital}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">👥</span>
            <div>
              <p class="info-label">Population</p>
              <p class="info-value">${pop}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🗺️</span>
            <div>
              <p class="info-label">Region</p>
              <p class="info-value">${region}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">📍</span>
            <div>
              <p class="info-label">Subregion</p>
              <p class="info-value">${subregion}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">📐</span>
            <div>
              <p class="info-label">Area</p>
              <p class="info-value">${area}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🗣️</span>
            <div>
              <p class="info-label">Languages</p>
              <p class="info-value">${langs}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">💰</span>
            <div>
              <p class="info-label">Currency</p>
              <p class="info-value">${currencies}</p>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🕐</span>
            <div>
              <p class="info-label">Timezones</p>
              <p class="info-value">${timezones}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateSelectedCards() {
  const selectedCca2 = comparisonList.map(c => c.cca2);
  document.querySelectorAll('.country-card').forEach(card => {
    const cca2 = card.getAttribute('data-cca2');
    if (selectedCca2.includes(cca2)) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
}

function clearComparison() {
  comparisonList = [];
  saveComparison();
  renderComparisonPanel();
  updateSelectedCards();
}