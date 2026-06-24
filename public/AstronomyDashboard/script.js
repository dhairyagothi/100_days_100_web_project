/**
 * Astronomy Dashboard
 * Live data with offline fallbacks for each section.
 */

// --- Fallback content --------------------------------------------------------

const facts = [
  {
    text: "Jupiter's Great Red Spot is a storm that has been raging for at least 350 years and is wider than Earth.",
    source: 'NASA Juno',
    url: 'https://science.nasa.gov/mission/juno/',
  },
  {
    text: 'A spoonful of neutron star material would weigh about a billion tons on Earth.',
    source: 'NASA Universe',
    url: 'https://science.nasa.gov/universe/stars/neutron-stars/',
  },
  {
    text: 'Venus rotates so slowly that one Venus day is longer than one Venus year.',
    source: 'NASA Solar System Exploration',
    url: 'https://science.nasa.gov/venus/',
  },
  {
    text: "Saturn's rings are mostly water ice, with pieces ranging from dust grains to mountain-sized chunks.",
    source: 'NASA Cassini',
    url: 'https://science.nasa.gov/mission/cassini/',
  },
  {
    text: 'The Sun contains more than 99 percent of all mass in the solar system.',
    source: 'NASA Sun Science',
    url: 'https://science.nasa.gov/sun/',
  },
  {
    text: 'Light from the Sun takes about eight minutes and twenty seconds to reach Earth.',
    source: 'NASA Space Place',
    url: 'https://spaceplace.nasa.gov/sunlight/en/',
  },
  {
    text: 'Olympus Mons on Mars is the largest volcano known in the solar system.',
    source: 'NASA Mars Exploration',
    url: 'https://science.nasa.gov/mars/',
  },
  {
    text: 'Europa may have a global ocean beneath its icy crust, making it one of the most intriguing places to search for habitability.',
    source: 'NASA Europa Clipper',
    url: 'https://science.nasa.gov/mission/europa-clipper/',
  },
  {
    text: 'The Milky Way is estimated to contain hundreds of billions of stars.',
    source: 'NASA Universe',
    url: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    text: "A black hole's boundary is called the event horizon, where escape velocity exceeds the speed of light.",
    source: 'NASA Black Holes',
    url: 'https://science.nasa.gov/universe/black-holes/',
  },
  {
    text: 'The International Space Station completes an orbit around Earth roughly every 90 minutes.',
    source: 'NASA ISS',
    url: 'https://www.nasa.gov/international-space-station/',
  },
  {
    text: 'Comets are frozen leftovers from the formation of the solar system, made of dust, rock, and ice.',
    source: 'NASA Comets',
    url: 'https://science.nasa.gov/solar-system/comets/',
  },
  {
    text: 'The Moon is slowly moving away from Earth at about 3.8 centimeters per year.',
    source: 'NASA Moon',
    url: 'https://science.nasa.gov/moon/',
  },
  {
    text: 'A year on Neptune lasts about 165 Earth years.',
    source: 'NASA Neptune',
    url: 'https://science.nasa.gov/neptune/',
  },
  {
    text: 'The James Webb Space Telescope observes mostly infrared light, helping it see through cosmic dust.',
    source: 'NASA Webb',
    url: 'https://science.nasa.gov/mission/webb/',
  },
];

const FALLBACK_NEWS_ITEMS = [
  {
    title:
      'James Webb telescope detects water vapor in atmosphere of TRAPPIST-1e',
    meta: 'NASA - 2 hours ago',
    image:
      'https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=260&q=80',
    summary:
      'Researchers continue studying exoplanet atmospheres for clues about how rocky worlds form and evolve.',
    url: 'https://science.nasa.gov/news/',
  },
  {
    title:
      'SpaceX Starship completes successful orbital refueling demonstration',
    meta: 'SpaceX - 6 hours ago',
    image:
      'https://images.unsplash.com/photo-1517976547714-720226b864c1?auto=format&fit=crop&w=260&q=80',
    summary:
      'The demonstration is part of ongoing work toward longer-duration spaceflight and deep-space mission support.',
    url: 'https://www.nasa.gov/news/',
  },
  {
    title:
      'Perseverance rover finds organic molecules in Jezero Crater samples',
    meta: 'JPL - 1 day ago',
    image:
      'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=260&q=80',
    summary:
      'Mars sample studies help scientists understand whether ancient environments could have supported life.',
    url: 'https://www.jpl.nasa.gov/news/',
  },
  {
    title:
      'Geminid meteor shower peaks this week with up to 120 meteors per hour',
    meta: 'Sky & Telescope - 1 day ago',
    image:
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=260&q=80',
    summary:
      'Meteor showers are best viewed from dark skies after your eyes adjust to the night.',
    url: 'https://skyandtelescope.org/astronomy-news/',
  },
  {
    title: "Europa Clipper begins long cruise to Jupiter's icy moon",
    meta: 'NASA - 2 days ago',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=260&q=80',
    summary:
      "Europa Clipper will investigate whether Jupiter's icy moon has conditions suitable for life.",
    url: 'https://science.nasa.gov/mission/europa-clipper/',
  },
];

// --- API endpoints & astronomy constants -------------------------------------

const SPACE_NEWS_API = 'https://api.spaceflightnewsapi.net/v4/articles/';
const NEWS_BATCH_SIZE = 5;

const STATIC_TOPICS = [
  {
    icon: 'BH',
    title: 'Black Holes 101',
    wiki: 'Black_hole',
    copy: 'Understand the most mysterious objects in the universe',
    detail:
      'Black holes are regions where gravity is so intense that not even light can escape once it crosses the event horizon.',
    source: 'NASA Black Holes',
    url: 'https://science.nasa.gov/universe/black-holes/',
  },
  {
    icon: 'ST',
    title: 'The Life Cycle of Stars',
    wiki: 'Stellar_evolution',
    copy: 'From stellar birth to supernova',
    detail:
      'Stars form in clouds of gas and dust, spend most of their lives fusing hydrogen, then end as white dwarfs, neutron stars, or black holes depending on mass.',
    source: 'NASA Stars',
    url: 'https://science.nasa.gov/universe/stars/',
  },
  {
    icon: 'SS',
    title: 'Our Solar System',
    wiki: 'Solar_System',
    copy: 'Explore planets, moons and more',
    detail:
      'Our solar system includes the Sun, eight planets, dwarf planets, moons, asteroids, comets, and icy worlds beyond Neptune.',
    source: 'NASA Solar System',
    url: 'https://science.nasa.gov/solar-system/',
  },
  {
    icon: 'EX',
    title: 'Exoplanets',
    wiki: 'Exoplanet',
    copy: 'Worlds orbiting distant stars',
    detail:
      'Exoplanets are planets outside our solar system. Scientists find them by watching stars dim or wobble as planets pass by or tug on them.',
    source: 'NASA Exoplanets',
    url: 'https://science.nasa.gov/exoplanets/',
  },
  {
    icon: 'GM',
    title: 'Galaxies',
    wiki: 'Galaxy',
    copy: 'Cities of stars and dark matter',
    detail:
      'Galaxies are vast systems of stars, gas, dust, and dark matter. The Milky Way is only one among billions in the observable universe.',
    source: 'NASA Galaxies',
    url: 'https://science.nasa.gov/universe/galaxies/',
  },
  {
    icon: 'CM',
    title: 'Comets & Asteroids',
    wiki: 'Small_Solar_System_body',
    copy: 'Ancient leftovers from planet formation',
    detail:
      'Comets and asteroids preserve early solar system material, helping scientists understand how planets formed.',
    source: 'NASA Small Bodies',
    url: 'https://science.nasa.gov/solar-system/asteroids-comets-meteors/',
  },
];

const STATIC_SCIENTISTS = [
  {
    initials: 'GC',
    name: 'Galileo Galilei',
    wiki: 'Galileo_Galilei',
    field: 'Telescope observations, moons of Jupiter',
    detail:
      "Galileo helped transform astronomy by using telescopes to observe Jupiter's moons, Venus's phases, sunspots, and lunar mountains.",
    url: 'https://science.nasa.gov/jupiter/moons/',
  },
  {
    initials: 'CJ',
    name: 'Cecilia Payne-Gaposchkin',
    wiki: 'Cecilia_Payne-Gaposchkin',
    field: 'Showed stars are mostly hydrogen and helium',
    detail:
      'Her work revealed that stars are made mostly of hydrogen and helium, one of the most important results in stellar astrophysics.',
    url: 'https://science.nasa.gov/universe/stars/',
  },
  {
    initials: 'SC',
    name: 'Subrahmanyan Chandrasekhar',
    wiki: 'Subrahmanyan_Chandrasekhar',
    field: 'Stellar evolution and black hole theory',
    detail:
      'Chandrasekhar calculated the mass limit for white dwarfs, shaping modern understanding of stellar collapse and compact objects.',
    url: 'https://science.nasa.gov/universe/stars/white-dwarfs/',
  },
  {
    initials: 'VR',
    name: 'Vera Rubin',
    wiki: 'Vera_Rubin',
    field: 'Galaxy rotation and dark matter evidence',
    detail:
      "Rubin's galaxy rotation measurements provided major evidence that galaxies contain large amounts of unseen dark matter.",
    url: 'https://science.nasa.gov/universe/dark-matter-dark-energy/',
  },
  {
    initials: 'HJ',
    name: 'Henrietta Swan Leavitt',
    wiki: 'Henrietta_Swan_Leavitt',
    field: 'Cepheid variables and cosmic distances',
    detail:
      'Leavitt discovered the period-luminosity relationship of Cepheid variable stars, giving astronomers a way to measure vast cosmic distances.',
    url: 'https://science.nasa.gov/universe/stars/variable-stars/',
  },
  {
    initials: 'EH',
    name: 'Edwin Hubble',
    wiki: 'Edwin_Hubble',
    field: 'Galaxies beyond the Milky Way',
    detail:
      'Hubble showed that the universe extends far beyond the Milky Way and helped establish that the universe is expanding.',
    url: 'https://science.nasa.gov/mission/hubble/',
  },
  {
    initials: 'KB',
    name: 'Katherine Johnson',
    wiki: 'Katherine_Johnson',
    field: 'Orbital mechanics and human spaceflight',
    detail:
      "Johnson's calculations supported early NASA missions, including Mercury flights and Apollo lunar trajectories.",
    url: 'https://www.nasa.gov/people/katherine-johnson/',
  },
  {
    initials: 'NT',
    name: 'Nancy Grace Roman',
    wiki: 'Nancy_Grace_Roman',
    field: 'Space telescopes and galactic structure',
    detail:
      'Roman was a NASA leader known as the mother of Hubble for her role in making space-based astronomy possible.',
    url: 'https://science.nasa.gov/mission/roman-space-telescope/',
  },
  {
    initials: 'NA',
    name: 'Neil Armstrong',
    wiki: 'Neil_Armstrong',
    field: 'Apollo 11 commander, first Moon landing',
    detail:
      "Armstrong became the first person to walk on the Moon on July 20, 1969, during NASA's Apollo 11 mission.",
    url: 'https://www.nasa.gov/humans-in-space/astronauts/',
  },
  {
    initials: 'SR',
    name: 'Sally Ride',
    wiki: 'Sally_Ride',
    field: 'First American woman in space',
    detail:
      'Ride flew aboard Space Shuttle Challenger in 1983 and later worked to inspire students in science and space exploration.',
    url: 'https://www.nasa.gov/humans-in-space/astronauts/',
  },
  {
    initials: 'KC',
    name: 'Kalpana Chawla',
    wiki: 'Kalpana_Chawla',
    field: 'NASA astronaut, Space Shuttle missions',
    detail:
      'Chawla was the first woman of Indian origin in space and served as a mission specialist on Space Shuttle flights.',
    url: 'https://www.nasa.gov/humans-in-space/astronauts/',
  },
];

const planets = {
  Mercury: 57.9,
  Venus: 108.2,
  Earth: 149.6,
  Mars: 227.9,
  Jupiter: 778.5,
  Saturn: 1432,
  Uranus: 2867,
  Neptune: 4515,
};

const ORBITAL_ELEMENTS = {
  Mercury: { a: 0.387, L0: 252.25, rate: 4.0923 },
  Venus: { a: 0.723, L0: 181.98, rate: 1.6021 },
  Earth: { a: 1.0, L0: 100.46, rate: 0.9856 },
  Mars: { a: 1.524, L0: 355.43, rate: 0.524 },
  Jupiter: { a: 5.203, L0: 34.35, rate: 0.0831 },
  Saturn: { a: 9.537, L0: 50.08, rate: 0.0335 },
  Uranus: { a: 19.19, L0: 314.05, rate: 0.0117 },
  Neptune: { a: 30.07, L0: 304.35, rate: 0.006 },
};

const PLANET_COLORS = {
  Mercury: 'linear-gradient(135deg, #d7d7d7, #8f8f8f)',
  Venus: 'linear-gradient(135deg, #ffe69a, #a27633)',
  Mars: 'linear-gradient(135deg, #ff8a4b, #943414)',
  Jupiter: 'linear-gradient(135deg, #f7d9a4, #9b704b)',
  Saturn: 'linear-gradient(135deg, #f2d7a0, #b58d4d)',
  Uranus: 'linear-gradient(135deg, #9de8ff, #4f8ea8)',
  Neptune: 'linear-gradient(135deg, #6ea8ff, #2f4f9f)',
  Sun: 'linear-gradient(135deg, #fff2a8, #ff8f3d)',
  Moon: 'linear-gradient(135deg, #ffffff, #b8bdd6)',
};

const DEFAULT_OBSERVER = {
  lat: 28.6139,
  lon: 77.209,
  label: 'Delhi, IN',
};

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';
const USNO_MOON_PHASES_URL = 'https://aa.usno.navy.mil/api/moon/phases/year';
const USNO_MOON_PHASE_DATE_URL =
  'https://aa.usno.navy.mil/api/moon/phases/date';
const USNO_RISESET_URL = 'https://aa.usno.navy.mil/api/rsttsp';
const FARMSENSE_MOON_URL = 'https://api.farmsense.net/v1/moonphases/';
const WIKIPEDIA_SUMMARY_BASE =
  'https://en.wikipedia.org/api/rest_v1/page/summary';
const LE_SYSTEME_BODIES_URL = 'https://api.le-systeme-solaire.net/rest/bodies';
const VISIBLE_PLANETS_URL = 'https://visibleplanets.dev/api';
const NASA_IMAGES_SEARCH_URL = 'https://images-api.nasa.gov/search';

const PLANET_API_IDS = {
  Mercury: 'mercury',
  Venus: 'venus',
  Earth: 'earth',
  Mars: 'mars',
  Jupiter: 'jupiter',
  Saturn: 'saturn',
  Uranus: 'uranus',
  Neptune: 'neptune',
};

const SKY_BODY_COLORS = {
  Sun: PLANET_COLORS.Sun,
  Moon: PLANET_COLORS.Moon,
  Mercury: PLANET_COLORS.Mercury,
  Venus: PLANET_COLORS.Venus,
  Mars: PLANET_COLORS.Mars,
  Jupiter: PLANET_COLORS.Jupiter,
  Saturn: PLANET_COLORS.Saturn,
  Uranus: PLANET_COLORS.Uranus,
  Neptune: PLANET_COLORS.Neptune,
};
const J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
const LUNAR_CYCLE_DAYS = 29.53058867;
const AU_KM = 149597870.7;
const LIGHT_SPEED_KM_S = 299792.458;

const phaseNames = [
  'New Moon',
  'Waxing Crescent',
  'First Quarter',
  'Waxing Gibbous',
  'Full Moon',
  'Waning Gibbous',
  'Last Quarter',
  'Waning Crescent',
];
const NASA_API_KEY =
  window.NASA_API_KEY || "DEMO_KEY";
const NASA_APOD_BASE = "https://api.nasa.gov/planetary/apod";
const NASA_NEO_FEED_BASE = "https://api.nasa.gov/neo/rest/v1/feed";
const FALLBACK_APOD = {
  title: 'R3 PanSTARRS: An Orion Comet',
  explanation:
    "Comet R3 PanSTARRS might be best remembered as an Orion comet. Its bright tail made a rare pass near one of the sky's most recognizable constellations.",
  date: '2026-05-15',
  url: 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1200&q=85',
  hdurl: 'https://apod.nasa.gov/',
  copyright: 'NASA APOD',
};

// --- DOM references ----------------------------------------------------------

const istTime = document.getElementById('istTime');
const todayDate = document.getElementById('todayDate');
const apodDate = document.getElementById('apodDate');
const apodImage = document.getElementById('apodImage');
const apodImg = document.getElementById('apodImg');
const apodTitle = document.getElementById('apodTitle');
const apodDescription = document.getElementById('apodDescription');
const apodLink = document.getElementById('apodLink');
const apodSource = document.getElementById('apodSource');
const spaceFact = document.getElementById('spaceFact');
const factSource = document.getElementById('factSource');
const moonDate = document.getElementById('moonDate');
const moonName = document.getElementById('moonName');
const moonOrb = document.getElementById('moonOrb');
const illumination = document.getElementById('illumination');
const lunarAge = document.getElementById('lunarAge');
const moonPhaseSource = document.getElementById('moonPhaseSource');
const fromPlanet = document.getElementById('fromPlanet');
const toPlanet = document.getElementById('toPlanet');
const newsScroll = document.getElementById('newsScroll');
const newsList = document.getElementById('newsList');
const newsDetail = document.getElementById('newsDetail');
const newsBack = document.getElementById('newsBack');
const newsLoading = document.getElementById('newsLoading');
const topicList = document.getElementById('topicList');
const topicDetail = document.getElementById('topicDetail');
const topicBack = document.getElementById('topicBack');
const exploreTopics = document.getElementById('exploreTopics');
const scientistList = document.getElementById('scientistList');
const scientistDetail = document.getElementById('scientistDetail');
const scientistBack = document.getElementById('scientistBack');
const meetScientists = document.getElementById('meetScientists');
const featureTabs = document.querySelectorAll('.feature-tab');
const featurePanes = document.querySelectorAll('.feature-pane');
const skyList = document.getElementById('skyList');
const skyLocation = document.getElementById('skyLocation');
const eventList = document.getElementById('eventList');
const distanceKm = document.getElementById('distanceKm');
const distanceAu = document.getElementById('distanceAu');
const lightTime = document.getElementById('lightTime');
const distanceSource = document.getElementById('distanceSource');

// --- Application state -------------------------------------------------------

const observerState = {
  lat: DEFAULT_OBSERVER.lat,
  lon: DEFAULT_OBSERVER.lon,
  label: DEFAULT_OBSERVER.label,
  ready: false,
};

const newsState = {
  items: [],
  offset: 0,
  isLoading: false,
  hasMore: true,
  usingFallback: false,
};

const topicState = {
  start: 0,
  size: 3,
};

const scientistState = {
  start: 0,
  size: 4,
};

let activeTopics = STATIC_TOPICS.map((topic) => ({ ...topic }));
let activeScientists = STATIC_SCIENTISTS.map((scientist) => ({ ...scientist }));
let moonFetchController = null;

// --- Shared helpers ----------------------------------------------------------

// Shared skeleton delay constant
const SKELETON_DELAY = 200;

// Active delayed skeleton timers store to prevent race conditions
const skeletonTimers = {};

/**
 * Centralized skeleton loader controller
 */
function applySkeletons(elements, isText = false) {
  elements.forEach((el) => {
    if (el) {
      el.classList.add(isText ? 'skeleton-text' : 'skeleton');
    }
  });
}

function clearSkeletons(elements) {
  elements.forEach((el) => {
    if (el) {
      el.classList.remove('skeleton', 'skeleton-text');
    }
  });
}

/**
 * Schedules a delayed skeleton loader, clearing any active overlapping timers.
 */
function scheduleSkeletonDelay(
  key,
  elements,
  isText = false,
  delayMs = SKELETON_DELAY
) {
  if (skeletonTimers[key]) {
    clearTimeout(skeletonTimers[key]);
  }

  skeletonTimers[key] = setTimeout(() => {
    applySkeletons(elements, isText);
    delete skeletonTimers[key];
  }, delayMs);

  return skeletonTimers[key];
}

function clearActiveTimer(key) {
  if (skeletonTimers[key]) {
    clearTimeout(skeletonTimers[key]);
    delete skeletonTimers[key];
  }
}

/**
 * Reusable list skeleton generator to eliminate redundant JS markup
 */
function renderSkeletonList(container, count, templateFunc) {
  if (container) {
    container.innerHTML = Array.from({ length: count })
      .map(templateFunc)
      .join('');
  }
}

/**
 * Fetch wrapper with AbortController-driven active connection cancellation.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const { signal } = controller;

  let abortHandler;
  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      abortHandler = () => controller.abort();
      options.signal.addEventListener('abort', abortHandler);
    }
  }

  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
    if (options.signal && abortHandler) {
      options.signal.removeEventListener('abort', abortHandler);
    }
  }
}

function escapeHtml(value) {
  return String(value || '').replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[char]
  );
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function getIstDateInputValue(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).formatToParts(date);
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function trimText(text, maxLength) {
  if (!text || text.length <= maxLength) {
    return text || "NASA's daily astronomy image is loading.";
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

function getWindowItems(items, start, size) {
  return Array.from(
    { length: size },
    (_, index) => items[(start + index) % items.length]
  );
}

function setPanelLoading(container, message) {
  container.innerHTML = `<p class="feature-loading">${escapeHtml(message)}</p>`;
}

function capitalizePlanetName(id) {
  const map = {
    mercury: 'Mercury',
    venus: 'Venus',
    earth: 'Earth',
    mars: 'Mars',
    jupiter: 'Jupiter',
    saturn: 'Saturn',
    uranus: 'Uranus',
    neptune: 'Neptune',
  };

  return map[id] || id.charAt(0).toUpperCase() + id.slice(1);
}

function formatLightTravelParts(seconds) {
  if (seconds < 60) {
    return { value: seconds.toFixed(1), unit: 'sec' };
  }

  if (seconds < 3600) {
    return { value: (seconds / 60).toFixed(2), unit: 'min' };
  }

  if (seconds < 86400) {
    return { value: (seconds / 3600).toFixed(2), unit: 'hr' };
  }

  return { value: (seconds / 86400).toFixed(2), unit: 'days' };
}

// --- Header clock ------------------------------------------------------------

function updateClock() {
  const now = new Date();
  istTime.textContent =
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    }).format(now) + ' IST';
  todayDate.textContent = formatDate(now);
}

// --- Picture of the day (NASA APOD) ------------------------------------------

function resolveApodImageUrl(data) {
  if (data.media_type === 'video') {
    return (data.thumbnail_url || FALLBACK_APOD.url).replace(
      /^http:\/\//,
      'https://'
    );
  }

  const imageUrl = data.url || data.hdurl || FALLBACK_APOD.url;
  return imageUrl.replace(/^http:\/\//, 'https://');
}

function setApodBackground(imageUrl) {
  apodImage.style.backgroundImage = `linear-gradient(180deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.25)), url("${imageUrl}")`;
}

function renderApod(data, isFallback = false) {
  clearActiveTimer('apod_block');
  clearActiveTimer('apod_text');
  clearSkeletons([apodTitle, apodDescription, apodDate, apodSource]);

  const imageUrl = resolveApodImageUrl(data);
  const title = data.title || FALLBACK_APOD.title;
  const explanation = data.explanation || FALLBACK_APOD.explanation;

  apodImage.setAttribute('aria-label', title);
  apodImg.alt = title;
  apodImg.referrerPolicy = 'no-referrer';
  apodImg.src = imageUrl;

  if (apodImg.complete) {
    clearSkeletons([apodImage]);
  } else {
    apodImg.onload = () => {
      clearSkeletons([apodImage]);
      apodImg.onload = null;
      apodImg.onerror = null;
    };
    apodImg.onerror = () => {
      clearSkeletons([apodImage]);
      apodImg.onload = null;
      apodImg.onerror = null;
    };
  }

  setApodBackground(imageUrl);
  apodTitle.textContent = title;
  apodDescription.textContent = trimText(explanation, 230);
  apodDate.textContent = data.date
    ? formatDate(new Date(`${data.date}T12:00:00Z`))
    : formatDate(new Date());

  const mediaLink = data.hdurl || data.url || 'https://apod.nasa.gov/';
  apodLink.href = mediaLink;
  apodLink.textContent =
    data.media_type === 'video' ? 'View NASA Media' : 'View HD Image';
  apodSource.href = isFallback
    ? 'https://apod.nasa.gov/'
    : `https://apod.nasa.gov/apod/ap${(data.date || '').replace(/-/g, '').slice(2)}.html`;
  apodSource.textContent = isFallback
    ? 'Source: NASA APOD (offline fallback)'
    : 'Source: NASA APOD';
}

apodImg?.addEventListener('error', () => {
  clearSkeletons([apodImage]);
  if (!apodImg.src.includes('images.unsplash.com')) {
    apodImg.src = FALLBACK_APOD.url;
    setApodBackground(FALLBACK_APOD.url);
  }
});

function getApodDatesToTry() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setUTCDate(today.getUTCDate() - 1);

  return [getIstDateInputValue(today), getIstDateInputValue(yesterday), null];
}

async function fetchNasaApodForDate(date) {
  const params = new URLSearchParams({
    api_key: NASA_API_KEY,
    thumbs: 'true',
  });

  if (date) {
    params.set('date', date);
  }

  const response = await fetchWithTimeout(`${NASA_APOD_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('NASA APOD request failed');
  }

  const data = await response.json();

  if (data.media_type === 'image' && !data.url && !data.hdurl) {
    throw new Error('NASA APOD image missing');
  }

  if (data.media_type === 'video' && !data.url && !data.thumbnail_url) {
    throw new Error('NASA APOD video missing');
  }

  return data;
}

async function loadNasaApod() {
  if (!apodTitle || !apodDescription || !apodImage || !apodImg || !apodDate || !apodLink || !apodSource) {
    return;
  }

  apodTitle.textContent = 'Loading NASA Picture of the Day…';
  apodDescription.textContent = "Fetching today's image from NASA.";

  scheduleSkeletonDelay('apod_block', [apodImage], false, SKELETON_DELAY);
  scheduleSkeletonDelay(
    'apod_text',
    [apodTitle, apodDescription, apodDate, apodSource],
    true,
    SKELETON_DELAY
  );

  try {
    for (const date of getApodDatesToTry()) {
      try {
        const data = await fetchNasaApodForDate(date);
        renderApod(data, false);
        return;
      } catch (error) {
        continue;
      }
    }
    renderApod(FALLBACK_APOD, true);
  } catch (globalError) {
    renderApod(FALLBACK_APOD, true);
  } finally {
    // Clear block and text skeleton delay timers to guarantee safety
    clearActiveTimer('apod_block');
    clearActiveTimer('apod_text');
  }
}

// --- Daily space facts -------------------------------------------------------

async function fetchNasaNeoFact() {
  const today = getIstDateInputValue(new Date());
  const params = new URLSearchParams({
    start_date: today,
    end_date: today,
    api_key: NASA_API_KEY,
  });
  const response = await fetchWithTimeout(`${NASA_NEO_FEED_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('NASA NEO request failed');
  }

  const data = await response.json();
  const objects = data.near_earth_objects?.[today] || [];
  const count = data.element_count ?? objects.length;

  if (!count) {
    throw new Error('NASA NEO returned no objects');
  }

  const sample = objects[0];
  const name = sample?.name || 'a near-Earth object';
  const hazard = sample?.is_potentially_hazardous_asteroid
    ? ' flagged as potentially hazardous'
    : '';

  return {
    text: `On ${formatDate(new Date(`${today}T12:00:00Z`))}, NASA is tracking ${count} near-Earth object${count === 1 ? '' : 's'}. One example is ${name}${hazard}.`,
    source: 'NASA Near-Earth Object Program',
    url: 'https://science.nasa.gov/planetary-defense/',
  };
}

async function fetchOnlineSpaceFact() {
  return await fetchNasaNeoFact();
}

function loadStaticFact(excludeText) {
  const options = excludeText
    ? facts.filter((fact) => fact.text !== excludeText)
    : facts;
  const next = options[Math.floor(Math.random() * options.length)] || facts[0];
  showFact(next);
}

async function loadDailyFact() {
  spaceFact.textContent = "Loading today's space fact…";
  factSource.textContent = 'Source: loading…';

  scheduleSkeletonDelay(
    'fact_text',
    [spaceFact, factSource],
    true,
    SKELETON_DELAY
  );

  try {
    const fact = await fetchOnlineSpaceFact();
    showFact(fact);
  } catch (error) {
    loadStaticFact();
  } finally {
    // Safe timeout cleanup inside finally block
    clearActiveTimer('fact_text');
  }
}

async function shuffleFact() {
  const current = spaceFact.textContent;
  spaceFact.textContent = 'Loading another space fact…';
  factSource.textContent = 'Source: loading…';

  scheduleSkeletonDelay(
    'fact_text',
    [spaceFact, factSource],
    true,
    SKELETON_DELAY
  );

  try {
    const fact = await fetchOnlineSpaceFact();

    if (fact.text === current) {
      loadStaticFact(current);
      return;
    }

    showFact(fact);
  } catch (error) {
    loadStaticFact(current);
  } finally {
    // Safe timeout cleanup inside finally block
    clearActiveTimer('fact_text');
  }
}

function showFact(fact) {
  clearActiveTimer('fact_text');
  clearSkeletons([spaceFact, factSource]);

  spaceFact.classList.add('is-changing');
  factSource.classList.add('is-changing');

  setTimeout(() => {
    spaceFact.textContent = fact.text;
    factSource.textContent = `Source: ${fact.source}`;
    factSource.href = fact.url;
    spaceFact.classList.remove('is-changing');
    factSource.classList.remove('is-changing');
  }, 160);
}

// --- Moon phase tab ----------------------------------------------------------

function moonPhase(date) {
  const lunarCycle = LUNAR_CYCLE_DAYS;
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / 86400000;
  const age = ((daysSince % lunarCycle) + lunarCycle) % lunarCycle;
  const illuminationValue =
    (1 - Math.cos((2 * Math.PI * age) / lunarCycle)) / 2;
  const phaseIndex = Math.floor((age / lunarCycle) * 8 + 0.5) % 8;

  return {
    age,
    illumination: illuminationValue * 100,
    name: phaseNames[phaseIndex],
  };
}

function formatUsnoDate(date) {
  return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
}

async function fetchUsnoMoonPhaseName(date, signal) {
  const params = new URLSearchParams({ date: formatUsnoDate(date) });
  const response = await fetchWithTimeout(
    `${USNO_MOON_PHASE_DATE_URL}?${params}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('USNO moon phase request failed');
  }

  const data = await response.json();
  const phases = data.phases || data.phasedata || data.moonphase || [];

  if (!phases.length) {
    throw new Error('USNO returned no moon phase');
  }

  const latest = phases[phases.length - 1];
  return latest.phase || latest.moonphase || latest.Moon;
}

async function fetchFarmsenseMoonPhaseName(date, signal) {
  const response = await fetchWithTimeout(
    `${FARMSENSE_MOON_URL}?d=${date.getTime()}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('Farmsense moon phase request failed');
  }

  const data = await response.json();

  if (!Array.isArray(data) || !data.length) {
    throw new Error('Farmsense returned no moon phase');
  }

  return data[0].Phase;
}

async function fetchOnlineMoonPhaseName(date, signal) {
  try {
    return {
      name: await fetchUsnoMoonPhaseName(date, signal),
      source: 'US Naval Observatory',
    };
  } catch (error) {
    return {
      name: await fetchFarmsenseMoonPhaseName(date, signal),
      source: 'Farmsense Moon API',
    };
  }
}

function moonMetricsFromOpenMeteoFraction(fraction) {
  const cycle = ((fraction % 1) + 1) % 1;
  const illuminationValue = (1 - Math.cos((2 * Math.PI * cycle) / 1)) / 2;
  const phaseIndex = Math.floor(cycle * 8 + 0.5) % 8;

  return {
    age: cycle * LUNAR_CYCLE_DAYS,
    illumination: illuminationValue * 100,
    name: phaseNames[phaseIndex],
  };
}

function buildMoonLitPath(illumination, isWaxing, size = 100) {
  const radius = size / 2;
  const center = radius;
  const lit = Math.max(0, Math.min(1, illumination / 100));

  if (lit >= 0.999) {
    return `M ${center},0 A ${radius},${radius} 0 1,0 ${center},${size} A ${radius},${radius} 0 1,0 ${center},0 Z`;
  }

  if (lit <= 0.001) {
    return '';
  }

  const theta = Math.acos(Math.max(-1, Math.min(1, 2 * lit - 1)));
  const terminatorRadius = radius * Math.sin(theta);

  if (isWaxing) {
    if (lit < 0.5) {
      return `M ${center},0 A ${radius},${radius} 0 0,1 ${center},${size} A ${terminatorRadius},${radius} 0 0,0 ${center},0 Z`;
    }

    return `M ${center},0 A ${radius},${radius} 0 0,1 ${center},${size} A ${radius},${radius} 0 1,1 ${center},0 A ${terminatorRadius},${radius} 0 0,0 ${center},0 Z`;
  }

  if (lit < 0.5) {
    return `M ${center},0 A ${radius},${radius} 0 0,0 ${center},${size} A ${terminatorRadius},${radius} 0 0,1 ${center},0 Z`;
  }

  return `M ${center},0 A ${radius},${radius} 0 0,0 ${center},${size} A ${radius},${radius} 0 1,1 ${center},0 A ${terminatorRadius},${radius} 0 0,1 ${center},0 Z`;
}

function renderMoonPhaseVisual(phase) {
  const size = 100;
  const radius = size / 2;
  const isWaxing = phase.age < LUNAR_CYCLE_DAYS / 2;
  const litPath = buildMoonLitPath(phase.illumination, isWaxing, size);

  moonOrb.innerHTML = `
        <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Moon at ${phase.illumination.toFixed(0)}% illumination">
            <defs>
                <radialGradient id="moonLitGradient" cx="35%" cy="28%" r="72%">
                    <stop offset="0%" stop-color="#ffffff"/>
                    <stop offset="55%" stop-color="#d5d7e2"/>
                    <stop offset="100%" stop-color="#959ab0"/>
                </radialGradient>
            </defs>
            <circle cx="${radius}" cy="${radius}" r="${radius}" fill="#0a0d18"/>
            ${litPath ? `<path d="${litPath}" fill="url(#moonLitGradient)"/>` : ''}
            <g fill="rgba(52, 56, 72, 0.42)">
                <circle cx="36" cy="30" r="5"/>
                <circle cx="61" cy="46" r="8"/>
                <circle cx="44" cy="67" r="6"/>
            </g>
        </svg>
    `;
  moonOrb.style.boxShadow = '0 0 36px rgba(194, 202, 255, 0.25)';
}

function renderMoonMetrics(phase, sourceLabel) {
  clearActiveTimer('moon_block');
  clearActiveTimer('moon_text');
  clearSkeletons([moonName, moonPhaseSource, moonOrb, illumination, lunarAge]);

  illumination.textContent = `${phase.illumination.toFixed(1)}%`;
  lunarAge.textContent = `${phase.age.toFixed(1)} days`;
  renderMoonPhaseVisual(phase);

  if (moonPhaseSource) {
    moonPhaseSource.textContent = sourceLabel;
  }
}

async function fetchOpenMeteoMoonData(date, signal) {
  const dateStr = getIstDateInputValue(date);
  const params = new URLSearchParams({
    latitude: String(observerState.lat || DEFAULT_OBSERVER.lat),
    longitude: String(observerState.lon || DEFAULT_OBSERVER.lon),
    daily: 'sunrise,sunset,moonrise,moonset,moon_phase',
    timezone: 'Asia/Kolkata',
    start_date: dateStr,
    end_date: dateStr,
  });
  const response = await fetchWithTimeout(`${OPEN_METEO_URL}?${params}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error('Open-Meteo moon request failed');
  }

  return response.json();
}

async function fetchOnlineMoonMetrics(date, signal) {
  const forecast = await fetchOpenMeteoMoonData(date, signal);
  const daily = forecast.daily || {};
  const fraction = daily.moon_phase?.[0];

  if (fraction === undefined || fraction === null) {
    throw new Error('Open-Meteo moon phase missing');
  }

  const metrics = moonMetricsFromOpenMeteoFraction(Number(fraction));
  const moonRise = formatClockTime(daily.moonrise?.[0]);
  const moonSet = formatClockTime(daily.moonset?.[0]);

  return {
    metrics,
    moonRise,
    moonSet,
    source: 'Open-Meteo',
  };
}

async function updateMoon() {
  const selected = moonDate.value
    ? new Date(`${moonDate.value}T12:00:00Z`)
    : new Date();
  const localPhase = moonPhase(selected);

  if (moonFetchController) {
    moonFetchController.abort();
  }

  moonFetchController = new AbortController();
  const { signal } = moonFetchController;

  moonName.textContent = 'Loading…';
  if (moonPhaseSource) {
    moonPhaseSource.textContent = 'Fetching live moon data…';
  }

  scheduleSkeletonDelay('moon_block', [moonOrb], false, SKELETON_DELAY);
  scheduleSkeletonDelay(
    'moon_text',
    [moonName, moonPhaseSource, illumination, lunarAge],
    true,
    SKELETON_DELAY
  );

  try {
    if (!observerState.ready) {
      await resolveObserverLocation();
    }

    try {
      const [onlinePhase, openMeteoMoon] = await Promise.all([
        fetchOnlineMoonPhaseName(selected, signal),
        fetchOnlineMoonMetrics(selected, signal),
      ]);

      moonName.textContent = onlinePhase.name;
      renderMoonMetrics(
        openMeteoMoon.metrics,
        `Phase: ${onlinePhase.source} · Metrics: ${openMeteoMoon.source}`
      );
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      try {
        const onlinePhase = await fetchOnlineMoonPhaseName(selected, signal);
        moonName.textContent = onlinePhase.name;
        renderMoonMetrics(
          localPhase,
          `Phase: ${onlinePhase.source} · Metrics: local fallback`
        );
      } catch (innerError) {
        if (innerError.name === 'AbortError') {
          return;
        }

        moonName.textContent = localPhase.name;
        renderMoonMetrics(localPhase, 'Offline fallback');
      }
    }
  } finally {
    if (!signal.aborted) {
      clearActiveTimer('moon_block');
      clearActiveTimer('moon_text');
    }
  }
}

async function fetchWikipediaSummary(wikiTitle, signal) {
  const response = await fetchWithTimeout(
    `${WIKIPEDIA_SUMMARY_BASE}/${encodeURIComponent(wikiTitle)}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error('Wikipedia summary request failed');
  }

  return response.json();
}

async function enrichTopicFromWikipedia(topic, signal) {
  if (!topic.wiki) {
    return { ...topic };
  }

  try {
    const data = await fetchWikipediaSummary(topic.wiki, signal);
    return {
      ...topic,
      title: data.title || topic.title,
      copy: data.description || topic.copy,
      detail: trimText(data.extract || topic.detail, 420),
      source: 'Wikipedia',
      url: data.content_urls?.desktop?.page || topic.url,
    };
  } catch (error) {
    return { ...topic };
  }
}

async function enrichScientistFromWikipedia(scientist, signal) {
  if (!scientist.wiki) {
    return { ...scientist };
  }

  try {
    const data = await fetchWikipediaSummary(scientist.wiki, signal);
    return {
      ...scientist,
      name: data.title || scientist.name,
      field: data.description || scientist.field,
      detail: trimText(data.extract || scientist.detail, 420),
      url: data.content_urls?.desktop?.page || scientist.url,
    };
  } catch (error) {
    return { ...scientist };
  }
}

// --- Learn astronomy & scientists (Wikipedia) ----------------------------------

async function loadDynamicTopics() {
  setPanelLoading(topicList, 'Loading astronomy topics…');

  if (skeletonTimers['topics']) {
    clearTimeout(skeletonTimers['topics']);
  }
  skeletonTimers['topics'] = setTimeout(() => {
    renderSkeletonList(
      topicList,
      2,
      () => `
            <div class="topic-item skeleton-card s-pointer-none s-opacity-85" aria-hidden="true">
                <span class="topic-icon skeleton s-no-border"></span>
                <span class="s-flex-1">
                    <span class="topic-title skeleton-text s-w-50 s-h-14 s-mb-6"></span>
                    <span class="topic-copy skeleton-text s-w-80 s-h-12"></span>
                </span>
                <span aria-hidden="true" class="s-color-soft">></span>
            </div>
        `
    );
  }, SKELETON_DELAY);

  const controller = new AbortController();

  try {
    const enriched = await Promise.all(
      STATIC_TOPICS.map((topic) =>
        enrichTopicFromWikipedia({ ...topic }, controller.signal)
      )
    );
    activeTopics = enriched;
  } catch (error) {
    activeTopics = STATIC_TOPICS.map((topic) => ({ ...topic }));
  } finally {
    clearActiveTimer('topics');
  }

  topicState.start = 0;
  renderTopics();
}

async function loadDynamicScientists() {
  setPanelLoading(scientistList, 'Loading scientists & astronauts…');

  if (skeletonTimers['scientists']) {
    clearTimeout(skeletonTimers['scientists']);
  }
  skeletonTimers['scientists'] = setTimeout(() => {
    renderSkeletonList(
      scientistList,
      2,
      () => `
            <div class="scientist-item skeleton-card s-pointer-none s-opacity-85" aria-hidden="true">
                <span class="scientist-avatar skeleton s-no-border"></span>
                <span class="s-flex-1">
                    <span class="scientist-name skeleton-text s-w-45 s-h-14 s-mb-6"></span>
                    <span class="scientist-field skeleton-text s-w-75 s-h-12"></span>
                </span>
            </div>
        `
    );
  }, SKELETON_DELAY);

  const controller = new AbortController();

  try {
    const enriched = await Promise.all(
      STATIC_SCIENTISTS.map((scientist) =>
        enrichScientistFromWikipedia({ ...scientist }, controller.signal)
      )
    );
    activeScientists = enriched;
  } catch (error) {
    activeScientists = STATIC_SCIENTISTS.map((scientist) => ({ ...scientist }));
  } finally {
    clearActiveTimer('scientists');
  }

  scientistState.start = 0;
  renderScientists();
}

// --- Sky tonight (observer location & planet visibility) ---------------------

function daysSinceJ2000(date) {
  return (date.getTime() - J2000) / 86400000;
}

function sunEclipticLongitude(date) {
  const days = daysSinceJ2000(date);
  return (((280.46 + 0.9856474 * days) % 360) + 360) % 360;
}

function planetEclipticLongitude(planet, date) {
  const orbit = ORBITAL_ELEMENTS[planet];
  const days = daysSinceJ2000(date);
  return (((orbit.L0 + orbit.rate * days) % 360) + 360) % 360;
}

function planetPosition(planet, date) {
  const orbit = ORBITAL_ELEMENTS[planet];
  const angle = (planetEclipticLongitude(planet, date) * Math.PI) / 180;
  return {
    x: orbit.a * Math.cos(angle),
    y: orbit.a * Math.sin(angle),
  };
}

function formatClockTime(isoString) {
  if (!isoString) {
    return '--:--';
  }

  const timePart = isoString.includes('T')
    ? isoString.split('T')[1]
    : isoString;
  const [hour, minute] = timePart.split(':').map(Number);

  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return '--:--';
  }

  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}

function elongationDegrees(planetLon, sunLon) {
  let diff = Math.abs(planetLon - sunLon);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

function getPlanetVisibilityMeta(planet, date) {
  const planetLon = planetEclipticLongitude(planet, date);
  const sunLon = sunEclipticLongitude(date);
  const elongation = elongationDegrees(planetLon, sunLon);
  const evening = planetLon > sunLon && planetLon - sunLon < 180;

  if (elongation < 12) {
    return 'Too close to the Sun - not visible tonight';
  }

  if (elongation > 165) {
    return 'Near opposition - visible most of the night';
  }

  return evening
    ? `Evening sky - elongation ${elongation.toFixed(0)}°`
    : `Morning sky - elongation ${elongation.toFixed(0)}°`;
}

function buildComputedPlanetSky(date) {
  return ['Venus', 'Mars', 'Jupiter', 'Saturn']
    .map((name) => ({
      name,
      meta: getPlanetVisibilityMeta(name, date),
      color: PLANET_COLORS[name],
    }))
    .filter((item) => !item.meta.startsWith('Too close'));
}

function renderSky(items) {
  if (!items.length) {
    skyList.innerHTML = `<p class="feature-loading">No major objects visible tonight from this location.</p>`;
    return;
  }

  skyList.innerHTML = items
    .map(
      (item) => `
        <div class="sky-item">
            <span class="sky-dot" style="background:${item.color}"></span>
            <p class="sky-name">${escapeHtml(item.name)}</p>
            <span class="sky-meta">${escapeHtml(item.meta)}</span>
        </div>
    `
    )
    .join('');
}

function setSkyLoading(message) {
  skyList.innerHTML = `<p class="feature-loading">${escapeHtml(message)}</p>`;
}

function setEventsLoading(message) {
  eventList.innerHTML = `<p class="feature-loading">${escapeHtml(message)}</p>`;
}

async function resolveObserverLocation() {
  if (!navigator.geolocation) {
    observerState.ready = true;
    skyLocation.textContent = DEFAULT_OBSERVER.label;
    return observerState;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        observerState.lat = position.coords.latitude;
        observerState.lon = position.coords.longitude;
        observerState.label = `${observerState.lat.toFixed(1)}°, ${observerState.lon.toFixed(1)}°`;
        observerState.ready = true;
        skyLocation.textContent = observerState.label;
        resolve(observerState);
      },
      () => {
        observerState.ready = true;
        skyLocation.textContent = DEFAULT_OBSERVER.label;
        resolve(observerState);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  });
}

function getSkyBodyColor(name) {
  return SKY_BODY_COLORS[name] || 'linear-gradient(135deg, #ffffff, #748cff)';
}

async function fetchUsnoSunMoonRiseSet(date) {
  const params = new URLSearchParams({
    date: formatUsnoDate(date),
    coords: `${observerState.lat},${observerState.lon}`,
    tz: '5.5',
  });
  const response = await fetchWithTimeout(`${USNO_RISESET_URL}?${params}`);

  if (!response.ok) {
    throw new Error('USNO rise/set request failed');
  }

  return response.json();
}

function parseUsnoRiseSetRows(rows, label) {
  if (!Array.isArray(rows)) {
    return null;
  }

  const rise = rows.find((row) =>
    String(row[0] || '')
      .toLowerCase()
      .includes('rise')
  )?.[1];
  const set = rows.find((row) =>
    String(row[0] || '')
      .toLowerCase()
      .includes('set')
  )?.[1];

  if (!rise && !set) {
    return null;
  }

  return `${label}: rise ${rise || '--'} · set ${set || '--'}`;
}

async function fetchVisiblePlanetsTonight() {
  const params = new URLSearchParams({
    latitude: String(observerState.lat),
    longitude: String(observerState.lon),
  });
  const response = await fetchWithTimeout(`${VISIBLE_PLANETS_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Visible Planets API request failed');
  }

  const data = await response.json();
  const items = [];

  if (Array.isArray(data)) {
    data.forEach((entry) => {
      if (!entry.name && !entry.planet) {
        return;
      }

      const name = entry.name || entry.planet;
      items.push({
        name,
        meta: entry.constellation
          ? `${entry.constellation}${entry.altitude ? ` · ${entry.altitude}° alt` : ''}`
          : entry.visibility || entry.status || 'Visible tonight',
        color: getSkyBodyColor(name),
      });
    });
  } else if (data.planets && typeof data.planets === 'object') {
    Object.entries(data.planets).forEach(([name, details]) => {
      if (details?.visible === false) {
        return;
      }

      const metaParts = [
        details.constellation,
        details.rise_time ? `Rise ${details.rise_time}` : '',
        details.set_time ? `Set ${details.set_time}` : '',
      ].filter(Boolean);

      items.push({
        name,
        meta: metaParts.join(' · ') || 'Visible tonight',
        color: getSkyBodyColor(name),
      });
    });
  } else if (data.data && typeof data.data === 'object') {
    Object.entries(data.data).forEach(([name, details]) => {
      items.push({
        name,
        meta: details?.visibility || details?.note || 'Visible tonight',
        color: getSkyBodyColor(name),
      });
    });
  }

  if (!items.length) {
    throw new Error('Visible Planets API returned no objects');
  }

  return items;
}

async function loadSkyTonight() {
  setSkyLoading("Loading tonight's sky from live sources…");
  const date = new Date();

  if (skeletonTimers['sky_tonight']) {
    clearTimeout(skeletonTimers['sky_tonight']);
  }
  skeletonTimers['sky_tonight'] = setTimeout(() => {
    renderSkeletonList(
      skyList,
      3,
      () => `
            <div class="sky-item skeleton-card s-pointer-none" aria-hidden="true">
                <span class="sky-dot skeleton s-circle-23"></span>
                <span class="s-flex-1 s-flex-col-gap6">
                    <span class="sky-name skeleton-text s-w-30 s-h-14"></span>
                    <span class="sky-meta skeleton-text s-w-65 s-h-12"></span>
                </span>
            </div>
        `
    );
  }, SKELETON_DELAY);

  if (!observerState.ready) {
    await resolveObserverLocation();
  }

  const items = [];

  try {
    const [openMeteo, usnoData, visiblePlanets] = await Promise.all([
      fetchOpenMeteoMoonData(date),
      fetchUsnoSunMoonRiseSet(date),
      fetchVisiblePlanetsTonight(),
    ]);

    const daily = openMeteo.daily || {};
    const sunSet = formatClockTime(daily.sunset?.[0]);
    const sunRise = formatClockTime(daily.sunrise?.[0]);
    const moonRise = formatClockTime(daily.moonrise?.[0]);
    const moonSet = formatClockTime(daily.moonset?.[0]);
    const moonFraction = daily.moon_phase?.[0];
    const moonMetrics =
      moonFraction !== undefined
        ? moonMetricsFromOpenMeteoFraction(Number(moonFraction))
        : moonPhase(date);

    let moonPhaseLabel = moonMetrics.name;
    try {
      moonPhaseLabel = await fetchOnlineMoonPhaseName(date);
      moonPhaseLabel = moonPhaseLabel.name;
    } catch (error) {
      moonPhaseLabel = moonMetrics.name;
    }

    const usnoSun = parseUsnoRiseSetRows(
      usnoData.sundata || usnoData.properties?.sundata,
      'USNO Sun'
    );
    const usnoMoon = parseUsnoRiseSetRows(
      usnoData.moondata || usnoData.properties?.moondata,
      'USNO Moon'
    );

    items.push({
      name: 'Sun',
      meta: usnoSun || `Open-Meteo: sets ${sunSet} · rises ${sunRise}`,
      color: getSkyBodyColor('Sun'),
    });
    items.push({
      name: `Moon (${moonPhaseLabel})`,
      meta: `${usnoMoon || `Rises ${moonRise} · sets ${moonSet}`} · ${moonMetrics.illumination.toFixed(0)}% lit`,
      color: getSkyBodyColor('Moon'),
    });
    items.push(...visiblePlanets);
    skyLocation.textContent = `${observerState.label} · live sky data`;
  } catch (error) {
    items.push(...buildComputedPlanetSky(date));
    const phase = moonPhase(date);
    items.unshift({
      name: `Moon (${phase.name})`,
      meta: `${phase.illumination.toFixed(0)}% lit · local fallback`,
      color: getSkyBodyColor('Moon'),
    });
    skyLocation.textContent = `${observerState.label} · partial fallback`;
  } finally {
    clearActiveTimer('sky_tonight');
  }

  renderSky(items.slice(0, 8));
}

// --- Space news --------------------------------------------------------------

function normalizeNewsArticle(article) {
  const source = article.news_site || 'Space News';
  const published = article.published_at
    ? formatDate(new Date(article.published_at))
    : formatDate(new Date());

  return {
    title: article.title || 'Untitled astronomy update',
    meta: `${source} - ${published}`,
    source,
    image: article.image_url || FALLBACK_NEWS_ITEMS[0].image,
    summary:
      article.summary ||
      'Open the full story for more details about this astronomy update.',
    url: article.url || 'https://science.nasa.gov/news/',
  };
}

function renderNews() {
  newsList.innerHTML = newsState.items
    .map(
      (item, index) => `
        <button class="news-item" type="button" data-news-index="${index}">
            <span class="news-thumb" style="--image:url('${escapeHtml(item.image)}')"></span>
            <span>
                <span class="news-title">${escapeHtml(item.title)}</span>
                <span class="news-meta">${escapeHtml(item.meta)}</span>
            </span>
        </button>
    `
    )
    .join('');
}

function renderNewsDetail(item) {
  newsScroll.hidden = true;
  newsDetail.hidden = false;
  newsBack.classList.add('visible');
  newsDetail.innerHTML = `
        <span class="news-detail-image" style="--image:url('${escapeHtml(item.image)}')"></span>
        <p class="news-meta">${escapeHtml(item.meta)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <a class="outline-action" href="${escapeHtml(item.url)}" target="_blank" rel="noreferrer">Read Full Story</a>
    `;
}

function showNewsList() {
  newsDetail.hidden = true;
  newsScroll.hidden = false;
  newsBack.classList.remove('visible');
}

function loadFallbackNewsBatch() {
  const nextItems = FALLBACK_NEWS_ITEMS.slice(
    newsState.offset,
    newsState.offset + NEWS_BATCH_SIZE
  );
  newsState.items.push(...nextItems);
  newsState.offset += nextItems.length;
  newsState.hasMore = newsState.offset < FALLBACK_NEWS_ITEMS.length;
  newsLoading.textContent = newsState.hasMore
    ? 'Scroll for more news...'
    : "You're caught up for now.";
  renderNews();
}

async function loadSpaceNews() {
  if (newsState.isLoading || !newsState.hasMore) {
    return;
  }

  newsState.isLoading = true;
  newsLoading.textContent = 'Loading more space news...';

  if (newsState.usingFallback) {
    loadFallbackNewsBatch();
    newsState.isLoading = false;
    return;
  }

  if (newsState.items.length === 0) {
    if (skeletonTimers['news_feed']) {
      clearTimeout(skeletonTimers['news_feed']);
    }
    skeletonTimers['news_feed'] = setTimeout(() => {
      renderSkeletonList(
        newsList,
        3,
        () => `
                <div class="news-item skeleton-card s-pointer-none" aria-hidden="true">
                    <span class="news-thumb skeleton s-no-border"></span>
                    <span class="s-flex-1">
                        <span class="news-title skeleton-text s-w-85 s-h-14 s-mb-6"></span>
                        <span class="news-title skeleton-text s-w-60 s-h-14"></span>
                        <span class="news-meta skeleton-text s-w-35 s-h-10 s-mt-10"></span>
                    </span>
                </div>
            `
      );
    }, SKELETON_DELAY);
  }

  try {
    const url = `${SPACE_NEWS_API}?limit=${NEWS_BATCH_SIZE}&offset=${newsState.offset}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error('Space news request failed');
    }

    const data = await response.json();
    const items = (data.results || []).map(normalizeNewsArticle);

    newsState.items.push(...items);
    newsState.offset += items.length;
    newsState.hasMore = Boolean(data.next) && items.length > 0;
    newsLoading.textContent = newsState.hasMore
      ? 'Scroll for more news...'
      : "You're caught up for now.";
    renderNews();
  } catch (error) {
    newsState.usingFallback = true;
    newsState.offset = newsState.items.length;
    loadFallbackNewsBatch();
  } finally {
    clearActiveTimer('news_feed');
    newsState.isLoading = false;
  }
}

// --- Upcoming events ---------------------------------------------------------

function getNextMoonEvents(count) {
  const results = [];
  const cursor = new Date();
  cursor.setUTCHours(12, 0, 0, 0);

  let previousPhase = moonPhase(cursor).name;

  for (let i = 1; results.length < count && i < 90; i += 1) {
    const nextDate = new Date(cursor);
    nextDate.setUTCDate(cursor.getUTCDate() + i);
    const phase = moonPhase(nextDate).name;

    if (
      phase !== previousPhase &&
      ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'].includes(phase)
    ) {
      results.push({
        date: formatShortDate(nextDate),
        title: phase,
        time: 'IST',
      });
    }

    previousPhase = phase;
  }

  return results;
}

function getSeasonalEvents() {
  const year = new Date().getFullYear();
  const candidates = [
    {
      date: new Date(Date.UTC(year, 7, 12, 12)),
      title: 'Perseid meteor shower peak',
      time: 'Late night',
    },
    {
      date: new Date(Date.UTC(year, 9, 21, 12)),
      title: 'Orionid meteor shower peak',
      time: 'Pre-dawn',
    },
    {
      date: new Date(Date.UTC(year, 11, 14, 12)),
      title: 'Geminid meteor shower peak',
      time: 'Late night',
    },
    {
      date: new Date(Date.UTC(year + 1, 0, 3, 12)),
      title: 'Quadrantid meteor shower peak',
      time: 'Pre-dawn',
    },
  ];
  const now = new Date();

  return candidates
    .filter((event) => event.date >= now)
    .slice(0, 2)
    .map((event) => ({
      date: formatShortDate(event.date),
      title: event.title,
      time: event.time,
    }));
}

function buildUpcomingEvents() {
  return [...getNextMoonEvents(4), ...getSeasonalEvents()].slice(0, 6);
}

function normalizeUsnoPhase(phase) {
  const date = new Date(`${phase.date}T12:00:00Z`);
  return {
    date: formatShortDate(date),
    title: phase.phase,
    time: 'IST',
  };
}

async function fetchUsnoMoonPhases() {
  const year = new Date().getFullYear();
  const response = await fetchWithTimeout(
    `${USNO_MOON_PHASES_URL}?year=${year}`
  );

  if (!response.ok) {
    throw new Error('USNO moon phases request failed');
  }

  const data = await response.json();
  const now = new Date();

  return (data.phases || [])
    .filter((phase) => new Date(`${phase.date}T12:00:00Z`) >= now)
    .slice(0, 4)
    .map(normalizeUsnoPhase);
}

function getNeoEventDateRange(daysAhead) {
  const start = new Date();
  const end = new Date(start);
  end.setUTCDate(start.getUTCDate() + daysAhead);

  return {
    start: getIstDateInputValue(start),
    end: getIstDateInputValue(end),
  };
}

async function fetchNasaNeoUpcomingEvents() {
  const range = getNeoEventDateRange(7);
  const params = new URLSearchParams({
    start_date: range.start,
    end_date: range.end,
    api_key: NASA_API_KEY,
  });
  const response = await fetchWithTimeout(`${NASA_NEO_FEED_BASE}?${params}`);

  if (!response.ok) {
    throw new Error('NASA NEO events request failed');
  }

  const data = await response.json();
  const events = [];

  Object.entries(data.near_earth_objects || {}).forEach(([date, objects]) => {
    objects.slice(0, 1).forEach((object) => {
      const approach = object.close_approach_data?.[0];
      const hazard = object.is_potentially_hazardous_asteroid
        ? ' · hazardous'
        : '';

      events.push({
        date: formatShortDate(new Date(`${date}T12:00:00Z`)),
        title: `${object.name} close approach`,
        time: approach?.miss_distance?.kilometers
          ? `${Math.round(Number(approach.miss_distance.kilometers)).toLocaleString('en-US')} km${hazard}`
          : `NASA NEO${hazard}`,
      });
    });
  });

  if (!events.length) {
    throw new Error('NASA NEO returned no upcoming events');
  }

  return events.slice(0, 3);
}

async function loadUpcomingEvents() {
  setEventsLoading('Loading upcoming events from live sources…');

  if (skeletonTimers['upcoming_events']) {
    clearTimeout(skeletonTimers['upcoming_events']);
  }
  skeletonTimers['upcoming_events'] = setTimeout(() => {
    renderSkeletonList(
      eventList,
      3,
      () => `
            <div class="event-item skeleton-card s-pointer-none" aria-hidden="true">
                <span class="event-date skeleton s-h-36 s-rounded-999 s-w-68"></span>
                <span class="s-flex-1 s-flex-col-gap6 s-ml-14">
                    <span class="event-title skeleton-text s-w-55 s-h-14"></span>
                    <span class="event-time skeleton-text s-w-35 s-h-12"></span>
                </span>
            </div>
        `
    );
  }, SKELETON_DELAY);

  try {
    const [usnoEvents, neoEvents] = await Promise.all([
      fetchUsnoMoonPhases(),
      fetchNasaNeoUpcomingEvents(),
    ]);
    const events = [...usnoEvents, ...neoEvents].slice(0, 8);
    renderEvents(events);
  } catch (error) {
    renderEvents(buildUpcomingEvents());
  } finally {
    clearActiveTimer('upcoming_events');
  }
}

function renderEvents(events) {
  eventList.innerHTML = events
    .map(
      (item) => `
        <div class="event-item">
            <span class="event-date">${escapeHtml(item.date)}</span>
            <p class="event-title">${escapeHtml(item.title)}</p>
            <span class="event-time">${escapeHtml(item.time)}</span>
        </div>
    `
    )
    .join('');
}

// --- Topics & scientists UI --------------------------------------------------

function showTopicList() {
  topicDetail.hidden = true;
  topicList.hidden = false;
  topicBack.classList.remove('visible');
  exploreTopics.textContent = 'Explore Topics';
}

function renderTopics() {
  const visibleTopics = getWindowItems(
    activeTopics,
    topicState.start,
    topicState.size
  );

  topicList.innerHTML = visibleTopics
    .map(
      (item) => `
        <button class="topic-item" type="button" data-topic-title="${escapeHtml(item.title)}">
            <span class="topic-icon">${item.icon}</span>
            <span>
                <span class="topic-title">${item.title}</span>
                <span class="topic-copy">${item.copy}</span>
            </span>
            <span aria-hidden="true">></span>
        </button>
    `
    )
    .join('');
}

function renderTopicDetail(topic) {
  topicList.hidden = true;
  topicDetail.hidden = false;
  topicBack.classList.add('visible');
  exploreTopics.textContent = 'Next Topics';
  topicDetail.innerHTML = `
        <span class="detail-kicker">${escapeHtml(topic.source)}</span>
        <h3>${escapeHtml(topic.title)}</h3>
        <p>${escapeHtml(topic.detail)}</p>
        <a class="outline-action" href="${escapeHtml(topic.url)}" target="_blank" rel="noreferrer">Read More</a>
    `;
}

function renderScientists() {
  const visibleScientists = getWindowItems(
    activeScientists,
    scientistState.start,
    scientistState.size
  );

  scientistList.innerHTML = visibleScientists
    .map(
      (item) => `
        <button class="scientist-item" type="button" data-scientist-name="${escapeHtml(item.name)}">
            <span class="scientist-avatar">${item.initials}</span>
            <span>
                <span class="scientist-name">${item.name}</span>
                <span class="scientist-field">${item.field}</span>
            </span>
        </button>
    `
    )
    .join('');
}

function showScientistList() {
  scientistDetail.hidden = true;
  scientistList.hidden = false;
  scientistBack.classList.remove('visible');
  meetScientists.textContent = 'Meet More People';
}

function renderScientistDetail(scientist) {
  scientistList.hidden = true;
  scientistDetail.hidden = false;
  scientistBack.classList.add('visible');
  meetScientists.textContent = 'More Scientists';
  scientistDetail.innerHTML = `
        <span class="scientist-avatar large">${escapeHtml(scientist.initials)}</span>
        <span class="detail-kicker">${escapeHtml(scientist.field)}</span>
        <h3>${escapeHtml(scientist.name)}</h3>
        <p>${escapeHtml(scientist.detail)}</p>
        <a class="outline-action" href="${escapeHtml(scientist.url)}" target="_blank" rel="noreferrer">Learn More</a>
    `;
}

function populatePlanetSelects(planetNames) {
  fromPlanet.innerHTML = '';
  toPlanet.innerHTML = '';

  planetNames.forEach((planet) => {
    fromPlanet.add(new Option(planet, planet));
    toPlanet.add(new Option(planet, planet));
  });

  fromPlanet.value = planetNames.includes('Earth') ? 'Earth' : planetNames[0];
  toPlanet.value = planetNames.includes('Mars')
    ? 'Mars'
    : planetNames[1] || planetNames[0];
}

async function fillPlanetSelects() {
  try {
    const response = await fetchWithTimeout(LE_SYSTEME_BODIES_URL);

    if (!response.ok) {
      throw new Error('Solar system bodies request failed');
    }

    const data = await response.json();
    const planetNames = (data.bodies || [])
      .filter(
        (body) => body.id && PLANET_API_IDS[capitalizePlanetName(body.id)]
      )
      .map((body) => capitalizePlanetName(body.id))
      .filter((name, index, list) => list.indexOf(name) === index);

    if (!planetNames.length) {
      throw new Error('No planets returned');
    }

    populatePlanetSelects(planetNames);
  } catch (error) {
    populatePlanetSelects(Object.keys(PLANET_API_IDS));
  }
}

// --- Planet distance calculator ----------------------------------------------

const kmFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

function setDistanceStat(container, value, unit) {
  const numberEl = container.querySelector('.stat-num');
  const unitEl = container.querySelector('.stat-unit');

  if (numberEl) {
    numberEl.textContent = value;
  }

  if (unitEl) {
    unitEl.textContent = unit;
  }
}

function calculateDistanceLocally(fromName, toName) {
  const now = new Date();
  const fromPos = planetPosition(fromName, now);
  const toPos = planetPosition(toName, now);
  const dx = fromPos.x - toPos.x;
  const dy = fromPos.y - toPos.y;
  const distanceAuValue = Math.sqrt(dx * dx + dy * dy);
  const distanceKmValue = distanceAuValue * AU_KM;

  return {
    km: distanceKmValue,
    au: distanceAuValue,
    source: 'Local orbital fallback',
  };
}

async function fetchLeSystemeDistance(fromName, toName) {
  const fromId = PLANET_API_IDS[fromName];
  const toId = PLANET_API_IDS[toName];

  if (!fromId || !toId) {
    throw new Error('Unknown planet');
  }

  if (fromName === toName) {
    return { km: 0, au: 0, source: 'Le Système Solaire API' };
  }

  const response = await fetchWithTimeout(`${LE_SYSTEME_BODIES_URL}/${fromId}`);

  if (!response.ok) {
    throw new Error('Le Système Solaire distance request failed');
  }

  const data = await response.json();
  const match = (data.distances || []).find((entry) => {
    const body = entry.body || {};
    return (
      body.id === toId ||
      body.englishName?.toLowerCase() === toName.toLowerCase() ||
      body.name?.toLowerCase() === toId
    );
  });

  if (!match?.distance?.km) {
    throw new Error('Distance not found in API response');
  }

  return {
    km: match.distance.km,
    au: match.distance.au ?? match.distance.km / AU_KM,
    source: 'Le Système Solaire API',
  };
}

async function calculateDistance() {
  const fromName = fromPlanet.value;
  const toName = toPlanet.value;

  if (distanceSource) {
    distanceSource.textContent = 'Fetching live distance…';
  }

  const targets = [
    distanceKm.querySelector('.stat-num'),
    distanceAu.querySelector('.stat-num'),
    lightTime.querySelector('.stat-num'),
    distanceSource,
  ];

  scheduleSkeletonDelay('distance_text', targets, true, SKELETON_DELAY);

  try {
    const live = await fetchLeSystemeDistance(fromName, toName);
    const lightSeconds = live.km / LIGHT_SPEED_KM_S;
    const travel = formatLightTravelParts(lightSeconds);

    setDistanceStat(distanceKm, kmFormatter.format(Math.round(live.km)), 'km');
    setDistanceStat(distanceAu, Number(live.au).toFixed(3), 'AU');
    setDistanceStat(lightTime, travel.value, travel.unit);

    if (distanceSource) {
      distanceSource.textContent = `Source: ${live.source}`;
    }
  } catch (error) {
    const fallback = calculateDistanceLocally(fromName, toName);
    const travel = formatLightTravelParts(fallback.km / LIGHT_SPEED_KM_S);

    setDistanceStat(
      distanceKm,
      kmFormatter.format(Math.round(fallback.km)),
      'km'
    );
    setDistanceStat(distanceAu, fallback.au.toFixed(3), 'AU');
    setDistanceStat(lightTime, travel.value, travel.unit);

    if (distanceSource) {
      distanceSource.textContent = `Source: ${fallback.source}`;
    }
  } finally {
    clearActiveTimer('distance_text');
    clearSkeletons(targets);
  }
}

// --- Decorative backgrounds (NASA Images) ------------------------------------

async function applyNasaDecorativeBackgrounds() {
  try {
    const params = new URLSearchParams({
      q: 'deep space nebula',
      media_type: 'image',
      page_size: '1',
    });
    const response = await fetch(`${NASA_IMAGES_SEARCH_URL}?${params}`);

    if (!response.ok) {
      throw new Error('NASA Images request failed');
    }

    const data = await response.json();
    const item = data.collection?.items?.[0];
    const imageLink =
      item?.links?.find(
        (link) => link.render === 'image' || link.rel === 'preview'
      )?.href || item?.href;

    if (!imageLink) {
      throw new Error('NASA image link missing');
    }

    const imageUrl = imageLink.replace(/^http:\/\//, 'https://');
    document.body.style.backgroundImage = `
            radial-gradient(circle at 82% 7%, rgba(96, 142, 255, 0.36), transparent 24rem),
            radial-gradient(circle at 100% 18%, rgba(187, 66, 255, 0.2), transparent 18rem),
            linear-gradient(90deg, rgba(5, 7, 19, 0.96), rgba(5, 7, 19, 0.78)),
            url("${imageUrl}") center / cover fixed`;

    const factCard = document.querySelector('.fact-card');
    if (factCard) {
      factCard.style.backgroundImage = `
                linear-gradient(90deg, rgba(9, 14, 45, 0.94), rgba(7, 9, 32, 0.84) 63%, rgba(7, 9, 32, 0.4)),
                url("${imageUrl}") center / cover no-repeat`;
    }
  } catch (error) {
    // Keep CSS Unsplash backgrounds as fallback.
  }
}

// --- Bootstrapping -------------------------------------------------------------

function setDefaultMoonDate() {
  moonDate.value = getIstDateInputValue(new Date());
}

function refreshFeaturePane(feature) {
  if (feature === 'moon') {
    updateMoon();
    return;
  }

  if (feature === 'sky') {
    loadSkyTonight();
    return;
  }

  if (feature === 'distance') {
    calculateDistance();
    return;
  }

  if (feature === 'events') {
    loadUpcomingEvents();
  }
}

function bindEvents() {
    document.getElementById("shuffleFact").addEventListener("click", shuffleFact);
    document.getElementById("calculateDistance").addEventListener("click", calculateDistance);

    const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

const moonIcon = `
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
`;

const sunIcon = `
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
`;

function updateThemeIcon(theme) {
    themeIcon.innerHTML = theme === "dark" ? sunIcon : moonIcon;
}

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {
    const currentTheme =
        document.documentElement.getAttribute("data-theme") || "light";

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);

    updateThemeIcon(nextTheme);
});

    newsList.addEventListener('click', (event) => {
    const item = event.target.closest('.news-item');

    if (!item) {
      return;
    }

    renderNewsDetail(newsState.items[Number(item.dataset.newsIndex)]);
  });
  newsBack.addEventListener('click', showNewsList);
  newsScroll.addEventListener('scroll', () => {
    const nearBottom =
      newsScroll.scrollTop + newsScroll.clientHeight >=
      newsScroll.scrollHeight - 40;

    if (nearBottom) {
      loadSpaceNews();
    }
  });

  topicList.addEventListener('click', (event) => {
    const item = event.target.closest('.topic-item');

    if (!item) {
      return;
    }

    const topic = activeTopics.find(
      (entry) => entry.title === item.dataset.topicTitle
    );
    renderTopicDetail(topic);
  });
  topicBack.addEventListener('click', showTopicList);
  exploreTopics.addEventListener('click', () => {
    if (!activeTopics.length) {
      return;
    }

    topicState.start =
      (topicState.start + topicState.size) % activeTopics.length;
    renderTopics();
    showTopicList();
  });

  scientistList.addEventListener('click', (event) => {
    const item = event.target.closest('.scientist-item');

    if (!item) {
      return;
    }

    const scientist = activeScientists.find(
      (entry) => entry.name === item.dataset.scientistName
    );
    renderScientistDetail(scientist);
  });
  scientistBack.addEventListener('click', showScientistList);
  meetScientists.addEventListener('click', () => {
    if (!activeScientists.length) {
      return;
    }

    scientistState.start =
      (scientistState.start + scientistState.size) % activeScientists.length;
    renderScientists();
    showScientistList();
  });

  featureTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const feature = tab.dataset.feature;

      featureTabs.forEach((item) =>
        item.classList.toggle('active', item === tab)
      );
      featurePanes.forEach((pane) =>
        pane.classList.toggle('active', pane.id === `feature-${feature}`)
      );
      refreshFeaturePane(feature);
    });
  });

  moonDate.addEventListener('change', updateMoon);
  moonDate.addEventListener('input', updateMoon);
  fromPlanet.addEventListener('change', calculateDistance);
  toPlanet.addEventListener('change', calculateDistance);
}

function initDashboard() {

  bindEvents();
  setDefaultMoonDate();
  updateClock();
  setInterval(updateClock, 1000);

  loadNasaApod();
  loadDailyFact();
  resolveObserverLocation();
  loadSkyTonight();
  loadSpaceNews();
  loadUpcomingEvents();
  loadDynamicTopics();
  loadDynamicScientists();
  applyNasaDecorativeBackgrounds();
  fillPlanetSelects().then(() => calculateDistance());
  updateMoon();
}

/*
=======================================================================
  ASTRONOMY DASHBOARD — JS ADDITIONS
  PASTE THIS ENTIRE BLOCK at the END of your script.js file,
  AFTER the initDashboard() function definition but BEFORE the
  final initDashboard() call at the very bottom.

  Then REPLACE the lone  initDashboard();  call at the bottom with:
      initDashboard();
      initFeatureAdditions();
=======================================================================
*/

// ═══════════════════════════════════════════════════════════════════
//  SECTION 1 — SHARED STATE & STORAGE HELPERS
// ═══════════════════════════════════════════════════════════════════

const LS_KEYS = {
  theme: 'astro_theme',
  favorites: 'astro_favorites',
  obs: 'astro_obs_log',
  quizScores: 'astro_quiz_scores',
  topicViews: 'astro_topic_views',
};

function lsGet(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 2 — DARK / LIGHT THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════

function loadThemePreference() {
  const saved = lsGet(LS_KEYS.theme);
  if (saved === 'light-theme' || saved === 'light-mode') applyLightTheme(true);
}

function applyLightTheme(on) {
  document.body.classList.toggle('light-theme', on);
  const iconDark = document.getElementById('themeIconDark');
  const iconLight = document.getElementById('themeIconLight');
  if (iconDark) iconDark.hidden = on;
  if (iconLight) iconLight.hidden = !on;
}

function bindThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    applyLightTheme(isLight);
    lsSet(LS_KEYS.theme, isLight ? 'light-theme' : 'dark-theme');
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 3 — FAVORITES SYSTEM
// ═══════════════════════════════════════════════════════════════════

let favsState = { apod: [], news: [], scientists: [] };
let favActiveTab = 'apod';

function loadFavoritesFromStorage() {
  const saved = lsGet(LS_KEYS.favorites);
  if (saved && typeof saved === 'object') {
    favsState = {
      apod: Array.isArray(saved.apod) ? saved.apod : [],
      news: Array.isArray(saved.news) ? saved.news : [],
      scientists: Array.isArray(saved.scientists) ? saved.scientists : [],
    };
  }
  syncApodFavBtn();
  renderFavsList();
  updateFavCount();
}

function saveFavoritesToStorage() {
  lsSet(LS_KEYS.favorites, favsState);
}

function updateFavCount() {
  const total =
    favsState.apod.length + favsState.news.length + favsState.scientists.length;
  const el = document.getElementById('favCount');
  if (el) el.textContent = `${total} saved`;
}

// ── APOD favorite ──────────────────────────────────────────────────

function syncApodFavBtn() {
  const btn = document.getElementById('apodFavBtn');
  if (!btn) return;
  const title = document.getElementById('apodTitle')?.textContent || '';
  const isSaved = favsState.apod.some((f) => f.title === title);
  btn.classList.toggle('saved', isSaved);
  // Target the explicit <span class="fav-label"> — no text node hunting
  const label = btn.querySelector('.fav-label');
  if (label) label.textContent = isSaved ? 'Saved!' : 'Save to Favorites';
}

function toggleApodFavorite() {
  const title = document.getElementById('apodTitle')?.textContent || '';
  const imgSrc = document.getElementById('apodImg')?.src || '';
  const date = document.getElementById('apodDate')?.textContent || '';
  const idx = favsState.apod.findIndex((f) => f.title === title);

  if (idx === -1) {
    favsState.apod.unshift({
      title,
      imgSrc,
      date,
      savedAt: new Date().toISOString(),
    });
    showNotif('⭐ APOD saved to favorites!');
  } else {
    favsState.apod.splice(idx, 1);
    showNotif('Removed from favorites.');
  }
  saveFavoritesToStorage();
  syncApodFavBtn();
  renderFavsList();
  updateFavCount();
}

function bindApodFavBtn() {
  const btn = document.getElementById('apodFavBtn');
  if (btn) btn.addEventListener('click', toggleApodFavorite);
}

// ── News / scientist star buttons ──────────────────────────────────

function addNewsStarButtons() {
  document.getElementById('newsList')?.addEventListener('click', (e) => {
    const star = e.target.closest('.item-star-btn[data-news-index]');
    if (!star) return;
    e.stopPropagation();
    const idx = Number(star.dataset.newsIndex);
    const item = newsState.items[idx];
    if (!item) return;
    const exists = favsState.news.findIndex((f) => f.title === item.title);
    if (exists === -1) {
      favsState.news.unshift({
        title: item.title,
        meta: item.meta,
        url: item.url,
        savedAt: new Date().toISOString(),
      });
      star.classList.add('saved');
      star.textContent = '★';
      showNotif('📰 Article bookmarked!');
    } else {
      favsState.news.splice(exists, 1);
      star.classList.remove('saved');
      star.textContent = '☆';
    }
    saveFavoritesToStorage();
    renderFavsList();
    updateFavCount();
  });
}

// Patch renderNews to include star buttons
const _origRenderNews = window._origRenderNews || null;
function patchRenderNews() {
  // Override the renderNews function defined earlier in script.js
  // by wrapping newsList innerHTML injection
  const origRenderNews = renderNews;
  window.renderNews = function () {
    newsList.innerHTML = newsState.items
      .map((item, index) => {
        const isSaved = favsState.news.some((f) => f.title === item.title);
        return `
            <div class="news-item" type="button" data-news-index="${index}">
                <span class="news-thumb" style="--image:url('${escapeHtml(item.image)}')"></span>
                <span style="flex:1">
                    <span class="news-title">${escapeHtml(item.title)}</span>
                    <span class="news-meta">${escapeHtml(item.meta)}</span>
                </span>
                <button class="item-star-btn ${isSaved ? 'saved' : ''}" data-news-index="${index}" type="button" title="Save to favorites" aria-label="Bookmark article">${isSaved ? '★' : '☆'}</button>
            </div>`;
      })
      .join('');
  };
}

function addScientistStarButtons() {
  document.getElementById('scientistList')?.addEventListener('click', (e) => {
    const star = e.target.closest('.item-star-btn[data-sci-name]');
    if (!star) return;
    e.stopPropagation();
    const name = star.dataset.sciName;
    const sci = activeScientists.find((s) => s.name === name);
    if (!sci) return;
    const exists = favsState.scientists.findIndex((f) => f.name === name);
    if (exists === -1) {
      favsState.scientists.unshift({
        name: sci.name,
        field: sci.field,
        url: sci.url,
        savedAt: new Date().toISOString(),
      });
      star.classList.add('saved');
      star.textContent = '★';
      showNotif('🔭 Scientist profile saved!');
    } else {
      favsState.scientists.splice(exists, 1);
      star.classList.remove('saved');
      star.textContent = '☆';
    }
    saveFavoritesToStorage();
    renderFavsList();
    updateFavCount();
  });
}

// Patch renderScientists to include star buttons
function patchRenderScientists() {
  window.renderScientists = function () {
    const visibleScientists = getWindowItems(
      activeScientists,
      scientistState.start,
      scientistState.size
    );
    scientistList.innerHTML = visibleScientists
      .map((item) => {
        const isSaved = favsState.scientists.some((f) => f.name === item.name);
        return `
            <div class="scientist-item" type="button" data-scientist-name="${escapeHtml(item.name)}">
                <span class="scientist-avatar">${item.initials}</span>
                <span style="flex:1">
                    <span class="scientist-name">${item.name}</span>
                    <span class="scientist-field">${item.field}</span>
                </span>
                <button class="item-star-btn ${isSaved ? 'saved' : ''}" data-sci-name="${escapeHtml(item.name)}" type="button" title="Save to favorites">${isSaved ? '★' : '☆'}</button>
            </div>`;
      })
      .join('');
  };
}

// ── Favorites list rendering ───────────────────────────────────────

function renderFavsList() {
  const list = document.getElementById('favsList');
  const empty = document.getElementById('favsEmpty');
  if (!list) return;

  const items = favsState[favActiveTab] || [];

  if (!items.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = items
    .map(
      (item, idx) => `
        <div class="fav-item">
            <span class="fav-item-title">${escapeHtml(item.title || item.name || 'Untitled')}</span>
            <span class="fav-item-date">${escapeHtml(item.date || item.savedAt?.slice(0, 10) || '')}</span>
            <button class="fav-remove-btn" data-fav-tab="${favActiveTab}" data-fav-idx="${idx}" title="Remove" aria-label="Remove from favorites">✕</button>
        </div>
    `
    )
    .join('');

  list.querySelectorAll('.fav-remove-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.favTab;
      const i = Number(btn.dataset.favIdx);
      favsState[tab].splice(i, 1);
      saveFavoritesToStorage();
      renderFavsList();
      updateFavCount();
      syncApodFavBtn();
    });
  });
}

function bindFavsTabs() {
  document.querySelectorAll('.favs-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      favActiveTab = tab.dataset.favtab;
      document
        .querySelectorAll('.favs-tab')
        .forEach((t) => t.classList.toggle('active', t === tab));
      renderFavsList();
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 4 — OBSERVATION LOG
// ═══════════════════════════════════════════════════════════════════

let obsEntries = [];
let editingObsId = null;

function loadObservations() {
  const saved = lsGet(LS_KEYS.obs);
  obsEntries = Array.isArray(saved) ? saved : [];
  renderObsList();
}

function saveObservations() {
  lsSet(LS_KEYS.obs, obsEntries);
}

function renderObsList() {
  const list = document.getElementById('obsList');
  const empty = document.getElementById('obsEmpty');
  if (!list) return;

  if (!obsEntries.length) {
    list.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.innerHTML = obsEntries
    .map(
      (entry, idx) => `
        <div class="obs-item" data-obs-id="${entry.id}">
            <div class="obs-item-header">
                <span class="obs-item-object">${escapeHtml(entry.object)}</span>
                <div class="obs-item-actions">
                    <button class="obs-action-btn edit" data-obs-idx="${idx}">Edit</button>
                    <button class="obs-action-btn delete" data-obs-idx="${idx}">Delete</button>
                </div>
            </div>
            <span class="obs-item-meta">${escapeHtml(entry.date)}${entry.location ? ' · ' + escapeHtml(entry.location) : ''}</span>
            ${entry.notes ? `<p class="obs-item-notes">${escapeHtml(entry.notes)}</p>` : ''}
        </div>
    `
    )
    .join('');

  list.querySelectorAll('.obs-action-btn.delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.obsIdx);
      obsEntries.splice(idx, 1);
      saveObservations();
      renderObsList();
      showNotif('Observation deleted.');
    });
  });

  list.querySelectorAll('.obs-action-btn.edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.obsIdx);
      const entry = obsEntries[idx];
      document.getElementById('obsDate').value = entry.date || '';
      document.getElementById('obsLocation').value = entry.location || '';
      document.getElementById('obsObject').value = entry.object || '';
      document.getElementById('obsNotes').value = entry.notes || '';
      editingObsId = entry.id;
      const btn2 = document.getElementById('obsSubmitBtn');
      if (btn2) btn2.textContent = 'Update Observation';
      document.getElementById('obsObject')?.focus();
    });
  });
}

function bindObsForm() {
  const form = document.getElementById('obsForm');
  if (!form) return;

  // Set default date to today
  const dateInput = document.getElementById('obsDate');
  if (dateInput && !dateInput.value)
    dateInput.value = getIstDateInputValue(new Date());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateVal = document.getElementById('obsDate')?.value || '';
    const locVal = document.getElementById('obsLocation')?.value?.trim() || '';
    const objVal = document.getElementById('obsObject')?.value?.trim() || '';
    const notesVal = document.getElementById('obsNotes')?.value?.trim() || '';

    if (!objVal) {
      showNotif('⚠️ Please enter the object observed.');
      return;
    }

    if (editingObsId !== null) {
      const idx = obsEntries.findIndex((e) => e.id === editingObsId);
      if (idx !== -1) {
        obsEntries[idx] = {
          ...obsEntries[idx],
          date: dateVal,
          location: locVal,
          object: objVal,
          notes: notesVal,
        };
      }
      editingObsId = null;
      const btn = document.getElementById('obsSubmitBtn');
      if (btn) btn.textContent = 'Log Observation';
      showNotif('✅ Observation updated!');
    } else {
      obsEntries.unshift({
        id: Date.now(),
        date: dateVal,
        location: locVal,
        object: objVal,
        notes: notesVal,
      });
      showNotif('✅ Observation logged!');
    }

    saveObservations();
    renderObsList();
    form.reset();
    if (dateInput) dateInput.value = getIstDateInputValue(new Date());
  });

  const exportBtn = document.getElementById('exportObsBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (!obsEntries.length) {
        showNotif('No observations to export yet.');
        return;
      }
      const blob = new Blob([JSON.stringify(obsEntries, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `astronomy-observations-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotif('📥 Observations exported!');
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 5 — ASTRONOMY QUIZ
// ═══════════════════════════════════════════════════════════════════

const QUIZ_QUESTIONS = {
  easy: [
    {
      q: 'Which is the largest planet in our Solar System?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
      correct: 1,
      explain:
        'Jupiter is the largest planet, with a mass more than twice all other planets combined.',
    },
    {
      q: 'How long does light from the Sun take to reach Earth?',
      options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
      correct: 1,
      explain:
        'Sunlight travels ~150 million km to reach Earth in about 8 minutes and 20 seconds.',
    },
    {
      q: 'What is the name of our galaxy?',
      options: ['Andromeda', 'Triangulum', 'Milky Way', 'Whirlpool'],
      correct: 2,
      explain: 'We live in the Milky Way galaxy, a barred spiral galaxy.',
    },
    {
      q: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mercury', 'Mars', 'Jupiter'],
      correct: 2,
      explain:
        'Mars gets its reddish color from iron oxide (rust) on its surface.',
    },
    {
      q: 'How many planets are in our Solar System?',
      options: ['7', '8', '9', '10'],
      correct: 1,
      explain:
        'There are 8 planets. Pluto was reclassified as a dwarf planet in 2006.',
    },
    {
      q: 'What is the closest star to Earth (other than the Sun)?',
      options: ['Sirius', 'Proxima Centauri', 'Betelgeuse', 'Vega'],
      correct: 1,
      explain: 'Proxima Centauri is about 4.24 light-years away.',
    },
    {
      q: 'What force keeps planets in orbit around the Sun?',
      options: ['Magnetism', 'Friction', 'Gravity', 'Nuclear force'],
      correct: 2,
      explain:
        'Gravity is the attractive force between masses that governs orbital motion.',
    },
  ],
  medium: [
    {
      q: "What is the name of Jupiter's largest moon?",
      options: ['Europa', 'Io', 'Ganymede', 'Callisto'],
      correct: 2,
      explain:
        'Ganymede is the largest moon in the Solar System, even bigger than Mercury.',
    },
    {
      q: 'What phenomenon causes a star to appear to wobble, indicating an orbiting planet?',
      options: [
        'Doppler shift',
        'Gravitational lensing',
        'Radial velocity method',
        'Transit photometry',
      ],
      correct: 2,
      explain:
        'The radial velocity (Doppler wobble) method detects slight stellar motion caused by an orbiting planet.',
    },
    {
      q: 'What is the Chandrasekhar limit?',
      options: [
        'Max mass of a neutron star',
        'Max mass of a white dwarf',
        'Min mass for nuclear fusion',
        'Size of an event horizon',
      ],
      correct: 1,
      explain:
        'The Chandrasekhar limit (~1.4 solar masses) is the maximum mass a white dwarf can have before collapsing.',
    },
    {
      q: 'What is a parsec?',
      options: [
        '~3.26 light-years',
        '~1 light-year',
        '~10 light-years',
        '~100 AU',
      ],
      correct: 0,
      explain:
        'One parsec ≈ 3.26 light-years, defined by a parallax angle of one arcsecond.',
    },
    {
      q: 'What powers a pulsar?',
      options: [
        'Nuclear fusion',
        'Rotation of a neutron star',
        "A black hole's accretion",
        'Dark matter annihilation',
      ],
      correct: 1,
      explain:
        'Pulsars are rapidly rotating neutron stars emitting beams of electromagnetic radiation.',
    },
    {
      q: 'What type of spectrum does a cool, dense star produce?',
      options: ['Emission', 'Continuous', 'Absorption', 'X-ray'],
      correct: 2,
      explain:
        'Dense stellar photospheres produce absorption spectra — dark lines on a continuous background.',
    },
  ],
  hard: [
    {
      q: 'What is the Tolman–Oppenheimer–Volkoff limit?',
      options: [
        'Max mass of a white dwarf',
        'Max mass of a neutron star',
        'Min mass for a black hole',
        'Mass of a solar neutrino',
      ],
      correct: 1,
      explain:
        'The TOV limit (~2–3 solar masses) sets the maximum mass a neutron star can have before collapsing into a black hole.',
    },
    {
      q: 'Which effect causes photons to lose energy as they escape a gravitational well?',
      options: [
        'Doppler redshift',
        'Gravitational redshift',
        'Compton scattering',
        'Lensing blueshift',
      ],
      correct: 1,
      explain:
        'Gravitational redshift (Einstein shift) occurs because photons do work against gravity escaping a massive body.',
    },
    {
      q: 'What is the approximate age of the Universe?',
      options: [
        '4.6 billion years',
        '8.8 billion years',
        '13.8 billion years',
        '20 billion years',
      ],
      correct: 2,
      explain: 'Based on CMB data, the Universe is ~13.8 billion years old.',
    },
    {
      q: 'What does the Hertzsprung–Russell diagram primarily plot?',
      options: [
        'Mass vs radius',
        'Luminosity vs temperature',
        'Age vs distance',
        'Rotation vs metallicity',
      ],
      correct: 1,
      explain:
        'The H-R diagram plots stellar luminosity (brightness) against surface temperature (spectral type).',
    },
    {
      q: 'What is baryonic matter estimated to make up of the total mass-energy of the Universe?',
      options: ['About 5%', 'About 27%', 'About 50%', 'About 68%'],
      correct: 0,
      explain:
        "Ordinary (baryonic) matter is ~5%; dark matter ~27%; dark energy ~68% of the Universe's total content.",
    },
    {
      q: 'What causes frame dragging in general relativity?',
      options: [
        'Mass',
        'Rotation of a massive body',
        'Electric charge',
        'Magnetic fields',
      ],
      correct: 1,
      explain:
        'Frame dragging (Lense-Thirring effect) is caused by a rotating mass warping spacetime around it.',
    },
  ],
};

const quizState = {
  difficulty: 'easy',
  questions: [],
  current: 0,
  score: 0,
  answered: false,
  history: [], // { score, total, diff, date }
};

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function loadQuizHistory() {
  const saved = lsGet(LS_KEYS.quizScores);
  if (Array.isArray(saved)) quizState.history = saved;
}

function saveQuizHistory() {
  lsSet(LS_KEYS.quizScores, quizState.history);
}

function startQuiz() {
  const pool = shuffleArray(QUIZ_QUESTIONS[quizState.difficulty]).slice(0, 5);
  quizState.questions = pool;
  quizState.current = 0;
  quizState.score = 0;
  quizState.answered = false;

  document.getElementById('quizStart').hidden = true;
  document.getElementById('quizPlay').hidden = false;
  document.getElementById('quizResult').hidden = true;

  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = quizState.questions[quizState.current];
  if (!q) {
    endQuiz();
    return;
  }

  const total = quizState.questions.length;
  const num = quizState.current + 1;

  document.getElementById('quizQNum').textContent =
    `Question ${num} / ${total}`;
  document.getElementById('quizQuestion').textContent = q.q;
  document.getElementById('quizProgressFill').style.width =
    `${((num - 1) / total) * 100}%`;
  const explainEl = document.getElementById('quizExplain');
  explainEl.hidden = true;
  explainEl.textContent = '';

  const nextBtn = document.getElementById('quizNextBtn');
  nextBtn.hidden = true;

  const optEl = document.getElementById('quizOptions');
  const shuffledOpts = q.options.map((text, idx) => ({ text, origIdx: idx }));
  // don't shuffle options to keep correct index consistent
  optEl.innerHTML = q.options
    .map(
      (text, idx) => `
        <button class="quiz-option-btn" type="button" data-opt-idx="${idx}">${escapeHtml(text)}</button>
    `
    )
    .join('');

  optEl.querySelectorAll('.quiz-option-btn').forEach((btn) => {
    btn.addEventListener('click', () =>
      answerQuestion(Number(btn.dataset.optIdx), q)
    );
  });

  // Update score pill
  document.getElementById('quizScorePill').textContent =
    `Score: ${quizState.score}`;
  quizState.answered = false;
}

function answerQuestion(chosenIdx, q) {
  if (quizState.answered) return;
  quizState.answered = true;

  const optEl = document.getElementById('quizOptions');
  const buttons = optEl.querySelectorAll('.quiz-option-btn');

  buttons.forEach((btn) => {
    btn.disabled = true;
    const idx = Number(btn.dataset.optIdx);
    if (idx === q.correct) btn.classList.add('correct');
    else if (idx === chosenIdx) btn.classList.add('wrong');
  });

  if (chosenIdx === q.correct) {
    quizState.score++;
    showNotif('✅ Correct!');
  } else {
    showNotif('❌ Wrong — check the explanation below.');
  }

  document.getElementById('quizScorePill').textContent =
    `Score: ${quizState.score}`;

  const explainEl = document.getElementById('quizExplain');
  explainEl.textContent = q.explain;
  explainEl.hidden = false;

  const nextBtn = document.getElementById('quizNextBtn');
  nextBtn.hidden = false;
  nextBtn.textContent =
    quizState.current + 1 >= quizState.questions.length
      ? 'See Results'
      : 'Next Question';
}

function nextQuizQuestion() {
  quizState.current++;
  if (quizState.current >= quizState.questions.length) {
    endQuiz();
  } else {
    renderQuizQuestion();
  }
}

function endQuiz() {
  const score = quizState.score;
  const total = quizState.questions.length;

  quizState.history.push({
    score,
    total,
    diff: quizState.difficulty,
    date: new Date().toISOString().slice(0, 10),
  });
  saveQuizHistory();

  document.getElementById('quizPlay').hidden = true;
  document.getElementById('quizResult').hidden = false;
  document.getElementById('quizFinalScore').textContent = `${score} / ${total}`;
  document.getElementById('quizResultLabel').textContent =
    score === total
      ? '🎉 Perfect!'
      : score >= total * 0.8
        ? '⭐ Excellent!'
        : score >= total * 0.6
          ? '👍 Good job!'
          : score >= total * 0.4
            ? '📚 Keep studying!'
            : '🔭 Try again!';

  showNotif(`Quiz done! You scored ${score}/${total}.`);
}

function resetQuiz() {
  document.getElementById('quizResult').hidden = true;
  document.getElementById('quizPlay').hidden = true;
  document.getElementById('quizStart').hidden = false;
}

function bindQuiz() {
  document.querySelectorAll('.quiz-diff-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      quizState.difficulty = btn.dataset.diff;
      document
        .querySelectorAll('.quiz-diff-btn')
        .forEach((b) => b.classList.toggle('active', b === btn));
    });
  });

  document.getElementById('startQuizBtn')?.addEventListener('click', startQuiz);
  document
    .getElementById('quizNextBtn')
    ?.addEventListener('click', nextQuizQuestion);
  document.getElementById('quizRetryBtn')?.addEventListener('click', resetQuiz);
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 6 — GLOBAL SEARCH
// ═══════════════════════════════════════════════════════════════════

function highlightMatch(text, query) {
  if (!query) return escapeHtml(text);
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  return escapeHtml(text).replace(
    regex,
    '<mark class="search-highlight">$1</mark>'
  );
}

function runSearch(query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;

  const q = query.trim().toLowerCase();
  if (q.length < 2) {
    dropdown.hidden = true;
    return;
  }

  const results = [];

  activeTopics.forEach((t) => {
    if (
      t.title.toLowerCase().includes(q) ||
      (t.copy || '').toLowerCase().includes(q)
    ) {
      results.push({
        type: 'Topic',
        text: t.title,
        sub: t.copy,
        action: () => {
          renderTopicDetail(t);
          showNotif(`📖 Topic: ${t.title}`);
        },
      });
    }
  });

  activeScientists.forEach((s) => {
    if (
      s.name.toLowerCase().includes(q) ||
      (s.field || '').toLowerCase().includes(q)
    ) {
      results.push({
        type: 'Person',
        text: s.name,
        sub: s.field,
        action: () => {
          renderScientistDetail(s);
          showNotif(`🔭 ${s.name}`);
        },
      });
    }
  });

  newsState.items.forEach((n, idx) => {
    if (
      n.title.toLowerCase().includes(q) ||
      (n.summary || '').toLowerCase().includes(q)
    ) {
      results.push({
        type: 'News',
        text: n.title,
        sub: n.meta,
        action: () => renderNewsDetail(n),
      });
    }
  });

  if (!results.length) {
    dropdown.innerHTML = `<p class="search-no-results">No results for "${escapeHtml(query)}"</p>`;
    dropdown.hidden = false;
    return;
  }

  dropdown.innerHTML = results
    .slice(0, 8)
    .map(
      (r, i) => `
        <div class="search-result-item" data-result-idx="${i}" role="button" tabindex="0">
            <span class="search-result-type">${r.type}</span>
            <span class="search-result-text">${highlightMatch(r.text, query)}</span>
        </div>
    `
    )
    .join('');

  dropdown.hidden = false;

  dropdown.querySelectorAll('.search-result-item').forEach((el, i) => {
    el.addEventListener('click', () => {
      results[i].action();
      dropdown.hidden = true;
      document.getElementById('globalSearch').value = '';
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') el.click();
    });
  });
}

function bindGlobalSearch() {
  const input = document.getElementById('globalSearch');
  const dropdown = document.getElementById('searchDropdown');
  if (!input) return;

  input.addEventListener('input', (e) => runSearch(e.target.value));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.hidden = true;
      input.value = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target))
      dropdown.hidden = true;
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 7 — STATS MODAL
// ═══════════════════════════════════════════════════════════════════

let topicViewsMap = {};

function loadTopicViews() {
  const saved = lsGet(LS_KEYS.topicViews);
  if (saved && typeof saved === 'object') topicViewsMap = saved;
}

function recordTopicView(topicTitle) {
  topicViewsMap[topicTitle] = (topicViewsMap[topicTitle] || 0) + 1;
  lsSet(LS_KEYS.topicViews, topicViewsMap);
}

// Patch renderTopicDetail to record views
function patchRenderTopicDetail() {
  const orig = renderTopicDetail;
  window.renderTopicDetail = function (topic) {
    orig(topic);
    recordTopicView(topic.title);
  };
}

function openStatsModal() {
  const modal = document.getElementById('statsModal');
  if (!modal) return;

  const totalFavs =
    favsState.apod.length + favsState.news.length + favsState.scientists.length;
  document.getElementById('statFavCount').textContent = totalFavs;
  document.getElementById('statObsCount').textContent = obsEntries.length;
  document.getElementById('statQuizTotal').textContent =
    quizState.history.length;

  const best = quizState.history.reduce(
    (acc, h) => {
      const pct = h.score / h.total;
      return pct > acc.pct ? { pct, label: `${h.score}/${h.total}` } : acc;
    },
    { pct: -1, label: '--' }
  );
  document.getElementById('statQuizBest').textContent = best.label;

  const topTopics = Object.entries(topicViewsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const topicListEl = document.getElementById('statTopTopics');
  if (topicListEl) {
    topicListEl.innerHTML = topTopics.length
      ? topTopics
          .map(
            ([name, views]) => `
                <div class="stats-topic-row">
                    <span class="stats-topic-name">${escapeHtml(name)}</span>
                    <span class="stats-topic-views">${views} view${views === 1 ? '' : 's'}</span>
                </div>`
          )
          .join('')
      : `<p style="color:var(--muted);font-size:13px;text-align:center;">No topics viewed yet.</p>`;
  }

  modal.showModal();
}

function bindStatsModal() {
  document
    .getElementById('statsBtn')
    ?.addEventListener('click', openStatsModal);
  document.getElementById('statsClose')?.addEventListener('click', () => {
    document.getElementById('statsModal')?.close();
  });
  document.getElementById('statsModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) e.currentTarget.close();
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 8 — TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════

let notifTimer = null;

function showNotif(message, duration = 3800) {
  const toast = document.getElementById('notifToast');
  if (!toast) return;

  if (notifTimer) {
    clearTimeout(notifTimer);
    toast.classList.remove('visible');
  }

  // tiny delay lets CSS transition retrigger cleanly
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.textContent = message;
      toast.classList.add('visible');
      notifTimer = setTimeout(() => {
        toast.classList.remove('visible');
        notifTimer = null;
      }, duration);
    });
  });
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 9 — ASTRONOMY EVENT NOTIFICATIONS
//  (fires on page load to alert upcoming events within 3 days)
// ═══════════════════════════════════════════════════════════════════

function checkUpcomingEventNotifications() {
  const events = buildUpcomingEvents(); // already defined in original script.js
  const now = new Date();

  for (const ev of events) {
    const evDate = new Date(`${ev.date} ${now.getFullYear()}`);
    const diff = (evDate - now) / (1000 * 60 * 60 * 24);
    if (diff >= 0 && diff <= 3) {
      setTimeout(
        () => showNotif(`🔭 Upcoming: ${ev.title} on ${ev.date}!`, 6000),
        3000
      );
      break; // only show one notification on load
    }
  }
}

// ═══════════════════════════════════════════════════════════════════
//  SECTION 10 — BOOTSTRAP ALL ADDITIONS
// ═══════════════════════════════════════════════════════════════════

function initFeatureAdditions() {
  // Persistence
  loadThemePreference();
  loadFavoritesFromStorage();
  loadObservations();
  loadQuizHistory();
  loadTopicViews();

  // Patches (must run before first render of news/scientists)
  patchRenderNews();
  patchRenderScientists();
  patchRenderTopicDetail();

  // Bind all UI
  bindThemeToggle();
  bindApodFavBtn();
  bindFavsTabs();
  addNewsStarButtons();
  addScientistStarButtons();
  bindObsForm();
  bindQuiz();
  bindGlobalSearch();
  bindStatsModal();

  // Notifications after 3 s to not clash with page load
  setTimeout(checkUpcomingEventNotifications, 3000);

}


// Safe theme initializer (no duplicate declarations)
const themeToggleEl = document.getElementById("theme-toggle");
const bodyEl = document.body;

if (themeToggleEl) {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
        bodyEl.classList.add("light-theme");
    }

    const updateIcon = () => {
        if (bodyEl.classList.contains("light-theme")) {
            themeToggleEl.textContent = "☀️";
        } else {
            themeToggleEl.textContent = "🌙";
        }
    };

    themeToggleEl.addEventListener("click", () => {
        const isLight = bodyEl.classList.toggle("light-theme");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        updateIcon();
    });

    updateIcon();

ocument.getElementByoggle
toggle saved = localStorage.getItem("theme");
    if (saved === "light") {
        bodyEl.classList.add("light-theme");
    }

    const updateIcon = () => {
        classLisht-theme")) {
            themeToggleEl.textConten";
        } else {
            themeToggleEl.textContent = "🌙";t" : "dark")t);

    updateIcon();

avedTheme ===) {
    body.classList.add("light-theme}


themeToggle.addEventListener("click", () => {

body.classList.toggle("light-theme"
    if (body.classList.contains("light-theme")) {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }

});

/*
=======================================================================
  FINAL STEP — at the VERY BOTTOM of script.js, change:

      initDashboard();

  to:

      initDashboard();
      initFeatureAdditions();

  That's it! All features are now active.
=======================================================================
*/
initDashboard();
initFeatureAdditions();