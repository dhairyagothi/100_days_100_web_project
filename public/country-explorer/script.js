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

// Asynchronous Data Fetch Engine
async function initExplorer() {
  setControlsEnabled(false);
  retryBtn.style.display = 'none';
  loadingMsg.style.display = 'block';

  try {
    const response = await fetch(
      'https://restcountries.com/3.1/all?fields=name,flags,population,continences,region,capital'
    );
    if (!response.ok) throw new Error();
    allCountries = await response.json();

    // Sort alphabetical arrays safely
    allCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));

    loadingMsg.style.display = 'none';

    setControlsEnabled(true);

    renderExplorerGrid(allCountries);
  } catch (err) {
    allCountries = [];

    setControlsEnabled(false);

    loadingMsg.textContent =
      'Data network offline. Unable to populate metrics.';

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

    const capitalStr =
      country.capital && country.capital.length > 0
        ? country.capital[0]
        : 'N/A';
    const populationNum = country.population
      ? country.population.toLocaleString()
      : '0';

    card.innerHTML = `
            <img src="${country.flags.svg || country.flags.png}" class="flag-img" alt="Flag of ${country.name.common}">
            <div class="card-info">
                <h3>${country.name.common}</h3>
                <p><strong>Population:</strong> ${populationNum}</p>
                <p><strong>Region:</strong> ${country.region}</p>
                <p><strong>Capital:</strong> ${capitalStr}</p>
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
    const matchesName = country.name.common.toLowerCase().includes(searchVal);
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
