const countriesGrid = document.getElementById('countries-grid');
const searchBar = document.getElementById('search-bar');
const regionFilter = document.getElementById('region-filter');
const themeToggle = document.getElementById('theme-toggle');
const loadingMsg = document.getElementById('loading-msg');
const retryBtn = document.getElementById('retry-btn');

let allCountries = [];

function setControlsEnabled(enabled) {
  searchBar.disabled = !enabled;
  regionFilter.disabled = !enabled;
}

// Theme Sync Management
const storedTheme = localStorage.getItem('explorer-theme') || 'dark';
document.documentElement.setAttribute('data-theme', storedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('explorer-theme', newTheme);
});

// Normalization function to support both v3.1 and v5 data structures
function normalizeCountry(c) {
  // Determine name
  let name = 'N/A';
  if (c.names && typeof c.names === 'object') {
    name = c.names.common || c.names.official || 'N/A';
  } else if (c.name && typeof c.name === 'object') {
    name = c.name.common || c.name.official || 'N/A';
  } else if (typeof c.name === 'string') {
    name = c.name;
  }

  // Determine flag
  let flagSvg = '';
  let flagPng = '';
  if (c.flag && typeof c.flag === 'object') {
    flagSvg = c.flag.url_svg || '';
    flagPng = c.flag.url_png || '';
  } else if (c.flags && typeof c.flags === 'object') {
    flagSvg = c.flags.svg || '';
    flagPng = c.flags.png || '';
  }

  // Determine capital
  let capital = 'N/A';
  if (Array.isArray(c.capitals) && c.capitals.length > 0) {
    const firstCapital = c.capitals[0];
    if (firstCapital && typeof firstCapital === 'object') {
      capital = firstCapital.name || 'N/A';
    } else if (typeof firstCapital === 'string') {
      capital = firstCapital;
    }
  } else if (Array.isArray(c.capital) && c.capital.length > 0) {
    capital = c.capital[0] || 'N/A';
  } else if (typeof c.capital === 'string') {
    capital = c.capital;
  }

  // Determine population
  const population = typeof c.population === 'number' ? c.population : 0;

  // Determine region
  const region = c.region || 'N/A';

  return {
    name,
    flag: flagSvg || flagPng || '',
    capital,
    population,
    region
  };
}

// Asynchronous Data Fetch Engine
async function initExplorer() {
  setControlsEnabled(false);
  retryBtn.style.display = 'none';
  loadingMsg.textContent = 'Fetching global database...';
  loadingMsg.style.display = 'block';
  
  // Clear any existing grid entries and countries state
  countriesGrid.innerHTML = '';
  allCountries = [];

  try {
    let data = null;
    let fetchedFromV5 = false;

    // Try V5 endpoint first
    try {
      // Demo key: no account required.
        const response = await fetch(
          'https://api.restcountries.com/countries/v5?limit=250',
          { headers: { 'Authorization': 'Bearer rc_live_demo' } }
        );
      if (response.ok) {
        const payload = await response.json();
        if (payload && payload.data && Array.isArray(payload.data.objects)) {
          data = payload.data.objects;
          fetchedFromV5 = true;
        }
      }
    } catch (v5Err) {
      console.warn('V5 fetch failed, falling back to V3.1:', v5Err);
    }

    // Fallback to local countries.json if V5 failed or did not return objects
    if (!fetchedFromV5) {
      const response = await fetch('countries.json');
      
      if (!response.ok) {
        throw new Error(`API Error: Server responded with status ${response.status} (${response.statusText || 'Unknown Error'})`);
      }
      
      data = await response.json();
    }

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Empty Response: No country data was retrieved from the database.');
    }

    // Normalize
    allCountries = data.map(normalizeCountry);

    // Sort alphabetical arrays safely
    allCountries.sort((a, b) => a.name.localeCompare(b.name));

    loadingMsg.style.display = 'none';

    setControlsEnabled(true);

    renderExplorerGrid(allCountries);
  } catch (err) {
    allCountries = [];

    setControlsEnabled(false);
    countriesGrid.innerHTML = '';

    // Differentiate error types for user-friendly messaging
    if (err.message && (err.message.startsWith('API Error:') || err.message.startsWith('Empty Response:'))) {
      loadingMsg.textContent = err.message;
    } else if (err instanceof TypeError) {
      // Typically fetch throws TypeError on network issues
      loadingMsg.textContent = 'Network Error: Failed to fetch country data. Please check your internet connection and try again.';
    } else {
      loadingMsg.textContent = `Error: ${err.message || 'An unexpected error occurred while loading country data.'}`;
    }

    loadingMsg.style.display = 'block';
    retryBtn.style.display = 'block';
  }
}

function renderExplorerGrid(countriesList) {
  countriesGrid.innerHTML = '';

  if (countriesList.length === 0) {
    countriesGrid.innerHTML =
      '<div class="status-text" style="grid-column: 1/-1;">No countries match filters.</div>';
    return;
  }

  countriesList.forEach((country) => {
    const card = document.createElement('div');
    card.className = 'country-card';

    const populationNum = country.population
      ? country.population.toLocaleString()
      : '0';

    card.innerHTML = `
            <img src="${country.flag}" class="flag-img" alt="Flag of ${country.name}">
            <div class="card-info">
                <h3>${country.name}</h3>
                <p><strong>Population:</strong> ${populationNum}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${country.capital}</p>
            </div>
        `;
    countriesGrid.appendChild(card);
  });
}

// Multi-parameter client filters
function runFilterPipeline() {
  const searchVal = searchBar.value.toLowerCase().trim();
  const regionVal = regionFilter.value.toLowerCase();

  const filtered = allCountries.filter((country) => {
    const matchesName = country.name.toLowerCase().includes(searchVal);
    const matchesRegion =
      !regionVal || country.region.toLowerCase() === regionVal;
    return matchesName && matchesRegion;
  });

  renderExplorerGrid(filtered);
}

searchBar.addEventListener('input', runFilterPipeline);
regionFilter.addEventListener('change', runFilterPipeline);

retryBtn.addEventListener('click', () => {
  loadingMsg.textContent = 'Fetching global database...';
  initExplorer();
});

initExplorer();
