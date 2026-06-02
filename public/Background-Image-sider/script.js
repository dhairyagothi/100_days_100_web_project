// ───── DESTINATION DATA ─────
const destinations = [
  {
    name: "Iceland",
    flag: "🇮🇸",
    region: "Europe",
    bg: "url('images/iceland.jpg')",
    desc: "Explore glaciers, geysers, and the ethereal Northern Lights across volcanic landscapes."
  },
  {
    name: "Switzerland",
    flag: "🇨🇭",
    region: "Europe",
    bg: "url('images/Jennifer.avif')",
    desc: "Experience the serene beauty of the Swiss Alps and impossibly picturesque alpine villages."
  },
  {
    name: "Scotland",
    flag: "🏴",
    region: "Europe",
    bg: "url('images/Daniel.jpeg')",
    desc: "Discover ancient castles, rugged Highlands, and a culture steeped in myth and legend."
  },
  {
    name: "Ireland",
    flag: "🇮🇪",
    region: "Europe",
    bg: "url('images/kai.jpg')",
    desc: "Immerse yourself in emerald landscapes, dramatic coastal cliffs, and warm Celtic hospitality."
  },
  {
    name: "Germany",
    flag: "🇩🇪",
    region: "Europe",
    bg: "url('images/Hannes-Becker4.jpg')",
    desc: "Explore fairy-tale castles, medieval towns, and a legendary beer and sausage culture."
  },
  {
    name: "India",
    flag: "🇮🇳",
    region: "Asia",
    bg: "url('images/tajmehal.png')",
    desc: "A tapestry of majestic forts, colorful festivals, ancient spice routes, and the iconic Taj Mahal."
  },
  {
    name: "Korea",
    flag: "🇰🇷",
    region: "Asia",
    bg: "url('images/korea.png')",
    desc: "Discover a perfect blend of futuristic cities, ancient palaces, K-culture, and mountain serenity."
  },
  {
    name: "Japan",
    flag: "🇯🇵",
    region: "Asia",
    bg: "url('images/japan.png')",
    desc: "Journey through ancient temples, neon-lit streets, and ethereal cherry blossom forests."
  },
  {
    name: "China",
    flag: "🇨🇳",
    region: "Asia",
    bg: "url('images/china.png')",
    desc: "Explore the Great Wall, misty karst mountains, and the dazzling energy of its megacities."
  },
  {
    name: "Bali",
    flag: "🇮🇩",
    region: "Asia",
    bg: "url('images/bali.png')",
    desc: "Unwind in a tropical paradise of rice terraces, spiritual temples, and golden sunsets."
  },
  {
    name: "Italy",
    flag: "🇮🇹",
    region: "Europe",
    bg: "url('images/italy.png')",
    desc: "Wander through millennia of history, breathtaking art, and the world's finest cuisine."
  },
  {
    name: "France",
    flag: "🇫🇷",
    region: "Europe",
    bg: "url('images/france.png')",
    desc: "Discover Parisian elegance, lavender fields of Provence, and the storied French Riviera."
  },
  {
    name: "Thailand",
    flag: "🇹🇭",
    region: "Asia",
    bg: "url('images/thailand.png')",
    desc: "Enjoy tropical beaches, vibrant night markets, golden temples, and unforgettable street food."
  },
  {
    name: "Dubai",
    flag: "🇦🇪",
    region: "Middle East",
    bg: "url('images/dubai.png')",
    desc: "Experience futuristic skylines, luxury beyond imagination, and desert adventures at golden dusk."
  }
];

// ───── STATE ─────
let current = 0;
let autoplaying = false;
let progressTimer = null;
let progressVal = 0;
let isTransitioning = false;
const AUTOPLAY_INTERVAL = 5000;

// ───── DOM REFS ─────
const bgEl           = document.getElementById('wl-bg');
const bgNext         = document.getElementById('wl-bg-next');
const titleEl        = document.getElementById('placeTitle');
const descEl         = document.getElementById('placeDescription');
const regionEl       = document.getElementById('placeRegion');
const bookBtn        = document.getElementById('bookingButton');
const dotsEl         = document.getElementById('destinationIndicators');
const selector       = document.getElementById('placeSelector');
const autoBtn        = document.getElementById('autoplayBtn');
const autoIcon       = document.getElementById('autoplayIcon');
const autoLabel      = document.getElementById('autoplayLabel');
const counterEl      = document.getElementById('wlCounter');
const progressBar    = document.getElementById('progressBar');
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const homeLink       = document.getElementById('homeLink');

// ───── BUILD DROPDOWN + DOTS ─────
function buildUI() {
  destinations.forEach((d, i) => {
    // Dropdown option
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = ` ${d.flag} ${d.region} · ${d.name}`;
    selector.appendChild(opt);

    // Indicator dot
    const dot = document.createElement('button');
    dot.className = 'destination-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Go to ${d.name}`);
    dot.setAttribute('tabindex', '0');
    dot.addEventListener('click', () => { stopAutoplay(); goTo(i); });
    dot.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); stopAutoplay(); goTo(i); }
    });
    dotsEl.appendChild(dot);
  });

  // Set initial background
  bgEl.style.backgroundImage = destinations[0].bg;
}

// ───── UPDATE ACTIVE DOT ─────
function updateDots() {
  const dots = dotsEl.querySelectorAll('.destination-dot');
  dots.forEach((dot, i) => {
    const isActive = i === current;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive);
    dot.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

// ───── CROSSFADE BACKGROUND ─────
function crossfade(newIdx) {
  if (isTransitioning) return;
  isTransitioning = true;

  bgNext.style.backgroundImage = destinations[newIdx].bg;
  bgNext.style.transition = 'none';
  bgNext.style.opacity = '0';

  requestAnimationFrame(() => {
    bgNext.style.transition = 'opacity 0.7s ease';
    bgNext.style.opacity = '1';

    setTimeout(() => {
      bgEl.style.backgroundImage = destinations[newIdx].bg;
      bgNext.style.transition = 'none';
      bgNext.style.opacity = '0';
      isTransitioning = false;
    }, 720);
  });
}

// ───── UPDATE CARD CONTENT ─────
function updateContent(idx) {
  const d = destinations[idx];
  titleEl.textContent = d.name;
  descEl.textContent = d.desc;
  regionEl.textContent = `${d.region} · Destination ${idx + 1} of ${destinations.length}`;
  bookBtn.textContent = `Book a Trip to ${d.name}`;
  bookBtn.classList.remove('booked');
  selector.value = idx;
  counterEl.textContent = `${idx + 1} / ${destinations.length}`;
  updateDots();
}

// ───── GO TO DESTINATION ─────
function goTo(idx) {
  if (idx === current) return;
  crossfade(idx);
  current = idx;
  updateContent(current);
  resetProgress();
}

function goNext() { goTo((current + 1) % destinations.length); }
function goPrev() { goTo((current - 1 + destinations.length) % destinations.length); }

// ───── PROGRESS BAR ─────
function resetProgress() {
  progressVal = 0;
  progressBar.style.width = '0%';
  clearInterval(progressTimer);
  if (autoplaying) startProgress();
}

function startProgress() {
  const step = 100 / (AUTOPLAY_INTERVAL / 100);
  progressTimer = setInterval(() => {
    progressVal = Math.min(progressVal + step, 100);
    progressBar.style.width = progressVal + '%';
    if (progressVal >= 100) {
      clearInterval(progressTimer);
      current = (current + 1) % destinations.length;
      crossfade(current);
      updateContent(current);
      resetProgress();
    }
  }, 100);
}

// ───── AUTOPLAY ─────
function startAutoplay() {
  autoplaying = true;
  autoBtn.classList.add('playing');
  autoIcon.textContent = '⏸';
  autoLabel.textContent = 'Pause';
  resetProgress();
}

function stopAutoplay() {
  autoplaying = false;
  autoBtn.classList.remove('playing');
  autoIcon.textContent = '▶';
  autoLabel.textContent = 'Autoplay';
  clearInterval(progressTimer);
  progressBar.style.width = '0%';
  progressVal = 0;
}

// ───── EVENT LISTENERS ─────
autoBtn.addEventListener('click', () => {
  autoplaying ? stopAutoplay() : startAutoplay();
});

nextBtn.addEventListener('click', () => { stopAutoplay(); goNext(); });
prevBtn.addEventListener('click', () => { stopAutoplay(); goPrev(); });

selector.addEventListener('change', () => {
  stopAutoplay();
  goTo(parseInt(selector.value));
});

bookBtn.addEventListener('click', () => {
  const d = destinations[current];
  bookBtn.textContent = `✓ Trip to ${d.name} Booked!`;
  bookBtn.classList.add('booked');
});


// HOME link resets to first destination
if (homeLink) {
  homeLink.addEventListener('click', e => {
    e.preventDefault();
    stopAutoplay();
    goTo(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Keyboard arrow navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { stopAutoplay(); goNext(); }
  if (e.key === 'ArrowLeft')  { stopAutoplay(); goPrev(); }
});

// Pause autoplay on card hover
const card = document.querySelector('.wl-card');
if (card) {
  card.addEventListener('mouseenter', () => { if (autoplaying) clearInterval(progressTimer); });
  card.addEventListener('mouseleave', () => { if (autoplaying) startProgress(); });
}

// ───── INIT ─────
window.addEventListener('DOMContentLoaded', () => {
  buildUI();
  updateContent(0);
});