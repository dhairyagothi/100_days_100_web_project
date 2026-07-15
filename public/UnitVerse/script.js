/* ============================================
UnitVerse - JavaScript Functionality
   ============================================ */

// Conversion data with units and conversion rates
const CONVERSION_DATA = {
    length: {
        name: 'Length',
        baseUnit: 'm',
        units: {
            mm: { 
            name: 'Millimeter', 
            symbol: 'mm', 
            toBase: 0.001,
            description: 'One thousandth of a meter.',
            applications: 'Engineering, machining, small measurements'
        },
            cm: { 
            name: 'Centimeter', 
            symbol: 'cm', 
            toBase: 0.01,
            description: 'One hundredth of a meter.',
            applications: 'Everyday measurements, clothing sizes'
        },
            m: { 
            name: 'Meter', 
            symbol: 'm', 
            toBase: 1,
            description: 'Base unit of length in the metric system.',
            applications: 'Science, engineering, everyday measurements'
        },
            km: { 
            name: 'Kilometer', 
            symbol: 'km', 
            toBase: 1000,
            description: 'One thousand meters.',
            applications: 'Road distances, travel'
        },
            in: { 
            name: 'Inch', 
            symbol: 'in', 
            toBase: 0.0254,
            description: 'Imperial unit, 1/12 of a foot.',
            applications: 'Construction, screen sizes, height measurements'
        },
            ft: { 
            name: 'Foot', 
            symbol: 'ft', 
            toBase: 0.3048,
            description: '12 inches.',
            applications: 'Height, construction'
        },
            yd: { 
            name: 'Yard', 
            symbol: 'yd', 
            toBase: 0.9144,
            description: '3 feet.',
            applications: 'Sports fields, construction'
        },
            mi: { 
            name: 'Mile', 
            symbol: 'mi', 
            toBase: 1609.34,
            description: '5280 feet.',
            applications: 'Road distances, US/UK'
        },
        }
    },
    weight: {
        name: 'Weight',
        baseUnit: 'g',
        units: {
            mg: { 
            name: 'Milligram', 
            symbol: 'mg', 
            toBase: 0.001,
            description: 'One thousandth of a gram.',
            applications: 'Medicine, chemistry'
        },
            g: { 
            name: 'Gram', 
            symbol: 'g', 
            toBase: 1,
            description: 'Base unit of mass.',
            applications: 'Cooking, science'
        },
            kg: { 
            name: 'Kilogram', 
            symbol: 'kg', 
            toBase: 1000,
            description: '1000 grams.',
            applications: 'Body weight, groceries'
        },
            oz: { 
            name: 'Ounce', 
            symbol: 'oz', 
            toBase: 28.3495,
            description: '1/16 of a pound.',
            applications: 'Cooking, food packaging'
        },
            lb: { 
            name: 'Pound', 
            symbol: 'lb', 
            toBase: 453.592,
            description: '16 ounces.',
            applications: 'Body weight, shopping'
        },
        }
    },
    temperature: {
        name: 'Temperature',
        baseUnit: 'celsius',
        units: {
            celsius: { 
            name: 'Celsius', 
            symbol: '°C',
            description: 'Water freezes at 0°C, boils at 100°C.',
            applications: 'Everyday use, science'
        },
            fahrenheit: { 
            name: 'Fahrenheit', 
            symbol: '°F',
            description: 'Water freezes at 32°F, boils at 212°F.',
            applications: 'US weather, cooking in US'
        },
            kelvin: { 
            name: 'Kelvin', 
            symbol: 'K',
            description: 'Absolute temperature scale.',
            applications: 'Science, physics'
        },
        }
    },
    time: {
        name: 'Time',
        baseUnit: 's',
        units: {
            s: { 
            name: 'Second', 
            symbol: 's', 
            toBase: 1,
            description: 'Base unit of time.',
            applications: 'Everyday, science'
        },
            min: { 
            name: 'Minute', 
            symbol: 'min', 
            toBase: 60,
            description: '60 seconds.',
            applications: 'Everyday'
        },
            h: { 
            name: 'Hour', 
            symbol: 'h', 
            toBase: 3600,
            description: '60 minutes.',
            applications: 'Everyday'
        },
            d: { 
            name: 'Day', 
            symbol: 'd', 
            toBase: 86400,
            description: '24 hours.',
            applications: 'Everyday'
        },
            wk: { 
            name: 'Week', 
            symbol: 'wk', 
            toBase: 604800,
            description: '7 days.',
            applications: 'Everyday scheduling'
        },
            mo: { 
            name: 'Month', 
            symbol: 'mo', 
            toBase: 2592000,
            description: 'Approximately 30 days.',
            applications: 'Scheduling'
        },
            yr: { 
            name: 'Year', 
            symbol: 'yr', 
            toBase: 31536000,
            description: '365 days.',
            applications: 'Age, long-term planning'
        },
        }
    },
    speed: {
        name: 'Speed',
        baseUnit: 'ms',
        units: {
            'ms': { 
            name: 'Meter per Second', 
            symbol: 'm/s', 
            toBase: 1,
            description: 'Distance in meters per second.',
            applications: 'Science, physics'
        },
            'kmh': { 
            name: 'Kilometer per Hour', 
            symbol: 'km/h', 
            toBase: 0.27778,
            description: 'Distance in kilometers per hour.',
            applications: 'Speed limits, everyday'
        },
            'mph': { 
            name: 'Mile per Hour', 
            symbol: 'mph', 
            toBase: 0.44704,
            description: 'Distance in miles per hour.',
            applications: 'Speed limits US/UK'
        },
            'knot': { 
            name: 'Knot', 
            symbol: 'kn', 
            toBase: 0.51444,
            description: 'Nautical mile per hour.',
            applications: 'Maritime, aviation'
        },
        }
    }
};

// Get DOM elements
const inputValue = document.getElementById('input-value');
const fromUnit = document.getElementById('from-unit');
const toUnit = document.getElementById('to-unit');
const resultValue = document.getElementById('result-value');
const resultUnit = document.getElementById('result-unit');
const categoryTitle = document.getElementById('category-title');
const swapBtn = document.getElementById('swap-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const clearFavoritesBtn = document.getElementById('clear-favorites-btn');
const historyContainer = document.getElementById('history-container');
const favoritesContainer = document.getElementById('favorites-container');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const inputError = document.getElementById('input-error');
const categoryCards = document.querySelectorAll('.category-card');
const sidebarTabs = document.querySelectorAll('.sidebar__tab');

// New elements references
const formulaText = document.getElementById('formula-text');
const stepsContainer = document.getElementById('steps-container');
const fromUnitName = document.getElementById('from-unit-name');
const fromUnitSymbol = document.getElementById('from-unit-symbol');
const fromUnitDesc = document.getElementById('from-unit-desc');
const fromUnitApps = document.getElementById('from-unit-apps');
const toUnitName = document.getElementById('to-unit-name');
const toUnitSymbol = document.getElementById('to-unit-symbol');
const toUnitDesc = document.getElementById('to-unit-desc');
const toUnitApps = document.getElementById('to-unit-apps');
const conversionTableBody = document.getElementById('conversion-table-body');

// State variables
let currentCategory = 'length';
let conversionHistory = [];
let favorites = [];

/**
 * Initialize the application
 */
/**
 * Initialize the application
 */
function init() {
  loadFromLocalStorage();
  populateUnitSelects();
  attachEventListeners();
  updateFavoritesDisplay();
  updateFavoriteButtonState();
  updateConversionsCounter();
}

/**
 * Attach event listeners to DOM elements
 */
function attachEventListeners() {
  // Category buttons
  categoryCards.forEach((card) => {
    card.addEventListener('click', () =>
      handleCategoryChange(card.dataset.category)
    );
    populateUnitSelects();
    clearFields();
  });

  // Input and select events
  inputValue.addEventListener('input', () => {
    handleConversion();
    updateFavoriteButtonState();
  });

  fromUnit.addEventListener('change', () => {
    handleConversion();
    updateFavoriteButtonState();
  });

  toUnit.addEventListener('change', () => {
    handleConversion();
    updateFavoriteButtonState();
  });

  // Button events
  swapBtn.addEventListener('click', swapUnits);
  copyBtn.addEventListener('click', copyResult);
  clearBtn.addEventListener('click', clearFields);
  favoriteBtn.addEventListener('click', toggleFavorite);
  clearHistoryBtn.addEventListener('click', clearHistory);
  clearFavoritesBtn.addEventListener('click', clearFavorites);

  // Tab navigation
  sidebarTabs.forEach((tab) => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
}

/**
 * Handle category change when user clicks a category button
 * @param {string} category - The selected category
 */
function handleCategoryChange(category) {
  currentCategory = category;

  // Update active category button styling
  categoryCards.forEach((card) => {
    card.classList.remove('active');
    if (card.dataset.category === category) {
      card.classList.add('active');
    }
  });

  // Update title
  categoryTitle.textContent = `${CONVERSION_DATA[category].name} Converter`;

  // Populate new unit options
  populateUnitSelects();
  clearFields();
  updateFavoriteButtonState();
}

/**
 * Populate unit select dropdowns with appropriate units for current category
 */
/**
 * Populate unit select dropdowns with appropriate units for current category
 */
function populateUnitSelects() {
    const units = CONVERSION_DATA[currentCategory].units;

    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    // Add placeholder option for "From" select
    const placeholderFrom = document.createElement('option');
    placeholderFrom.value = '';
    placeholderFrom.textContent = '-- Select unit --';
    placeholderFrom.selected = true;
    placeholderFrom.disabled = true;
    fromUnit.appendChild(placeholderFrom);

    // Add placeholder option for "To" select
    const placeholderTo = document.createElement('option');
    placeholderTo.value = '';
    placeholderTo.textContent = '-- Select unit --';
    placeholderTo.selected = true;
    placeholderTo.disabled = true;
    toUnit.appendChild(placeholderTo);

    // Get all unit keys
    const unitKeys = Object.keys(units);

    // Populate options for both selects (without auto-selecting)
    unitKeys.forEach((unitKey) => {
        const unit = units[unitKey];

        // Create option for "From" select
        const option1 = document.createElement('option');
        option1.value = unitKey;
        option1.textContent = `${unit.name} (${unit.symbol})`;
        fromUnit.appendChild(option1);

        // Create option for "To" select
        const option2 = document.createElement('option');
        option2.value = unitKey;
        option2.textContent = `${unit.name} (${unit.symbol})`;
        toUnit.appendChild(option2);
    });
}

/**
 * Handle conversion and display result
 * This function runs whenever user changes input or units
 */
/**
 * Handle conversion and display result
 * This function runs whenever user changes input or units
 */
function handleConversion() {
  const inputVal = parseFloat(inputValue.value);

    // Update unit info always
    updateUnitInfo();
    
    // Update multi-conversion table always
    updateMultiConversionTable(inputVal);

    // If input is empty, reset result
    if (inputValue.value === '') {
        resultValue.textContent = '0';
        inputError.textContent = '';
        updateFormulaAndSteps(0, 0); // Show placeholder or nothing
        return;
    }
  // If input is empty, reset result
  if (inputValue.value === '') {
    resultValue.textContent = '0';
    inputError.textContent = '';
    return;
  }

  // Check if units are selected (not empty)
  if (fromUnit.value === '' || toUnit.value === '') {
    inputError.textContent = '⚠️ Please select both units';
    resultValue.textContent = '0';
    return;
  }

  if (isNaN(inputVal)) {
    inputError.textContent = '❌ Please enter a valid number';
    resultValue.textContent = '0';
    return;
  }

  if (inputVal < 0) {
    inputError.textContent = '⚠️ Please enter a positive number';
    resultValue.textContent = '0';
    return;
  }

  inputError.textContent = '';

  // Perform conversion based on category
  let result;
  if (currentCategory === 'temperature') {
    // Temperature has special conversion formulas
    result = convertTemperature(inputVal, fromUnit.value, toUnit.value);
  } else {
    // Other categories use base unit conversion
    result = convertUnits(inputVal, fromUnit.value, toUnit.value);
  }

    // Display result
    resultValue.textContent = formatResult(result);
    updateResultUnit();
    
    // Update formula and steps
    updateFormulaAndSteps(inputVal, result);

  // Add to history (only if units are selected)
  addToHistory(inputVal, fromUnit.value, toUnit.value, result);
}

/**
 * Convert units using base unit method
 * Example: To convert meters to feet:
 * 1. Convert 10 m to base (m): 10 * 1 = 10 m
 * 2. Convert from base to feet: 10 / 0.3048 = 32.808 ft
 *
 * @param {number} value - The value to convert
 * @param {string} fromUnitKey - From unit key
 * @param {string} toUnitKey - To unit key
 * @returns {number} Converted value
 */
function convertUnits(value, fromUnitKey, toUnitKey) {
  const units = CONVERSION_DATA[currentCategory].units;

  // Convert input value to base unit
  const fromBaseValue = value * units[fromUnitKey].toBase;

  // Convert from base unit to target unit
  const result = fromBaseValue / units[toUnitKey].toBase;

  return result;
}

/**
 * Convert temperature values
 * Temperature conversion is special because it's not linear at zero
 * Celsius is used as the intermediate conversion point
 *
 * @param {number} value - The value to convert
 * @param {string} from - From temperature unit
 * @param {string} to - To temperature unit
 * @returns {number} Converted temperature value
 */
function convertTemperature(value, from, to) {
  // Step 1: Convert to Celsius (intermediate)
  let celsius;
  switch (from) {
    case 'celsius':
      celsius = value;
      break;
    case 'fahrenheit':
      // F = (C × 9/5) + 32, so C = (F - 32) × 5/9
      celsius = (value - 32) * (5 / 9);
      break;
    case 'kelvin':
      // K = C + 273.15, so C = K - 273.15
      celsius = value - 273.15;
      break;
    default:
      celsius = value;
  }

  // Step 2: Convert from Celsius to target unit
  let result;
  switch (to) {
    case 'celsius':
      result = celsius;
      break;
    case 'fahrenheit':
      // F = (C × 9/5) + 32
      result = celsius * (9 / 5) + 32;
      break;
    case 'kelvin':
      // K = C + 273.15
      result = celsius + 273.15;
      break;
    default:
      result = celsius;
  }

  return result;
}

/**
 * Format result to appropriate decimal places
 * Smart rounding: Shows 2-4 decimals for normal numbers,
 * handles very large/small numbers elegantly
 * @param {number} value - The value to format
 * @returns {string} Formatted value
 */
function formatResult(value) {
  if (value === 0) return '0';

  // Get absolute value to check magnitude
  const absValue = Math.abs(value);

  let decimals = 2; // Default: 2 decimal places

  // Adjust decimals based on number magnitude
  if (absValue >= 1000000) {
    // Very large numbers: 1 decimal (e.g., 1234567.1)
    decimals = 1;
  } else if (absValue >= 1000) {
    // Large numbers: 2 decimals (e.g., 1234.56)
    decimals = 2;
  } else if (absValue >= 1) {
    // Normal numbers: 3 decimals (e.g., 123.456)
    decimals = 3;
  } else if (absValue >= 0.001) {
    // Small numbers: 4 decimals (e.g., 0.1234)
    decimals = 4;
  } else {
    // Very small numbers: 5 decimals (e.g., 0.00001)
    decimals = 5;
  }

  // Round to the appropriate decimal places
  const rounded =
    Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);

  // Convert to string and remove trailing zeros
  const result = rounded.toFixed(decimals);
  return parseFloat(result).toString();
}

/**
 * Update result unit display
 * Extracts unit symbol from the full name (e.g., "Meter (m)" -> "(m)")
 */
/**
 * Update result unit display
 * Extracts unit symbol from the full name (e.g., "Meter (m)" -> "(m)")
 */
function updateResultUnit() {
  if (toUnit.value === '') {
    resultUnit.textContent = '';
    return;
  }

  const units = CONVERSION_DATA[currentCategory].units;
  const toUnitKey = toUnit.value;
  const unitDisplay = units[toUnitKey].name.match(/\([^)]+\)/)[0];
  resultUnit.textContent = unitDisplay;
}

/**
 * Swap from and to units
 */
function swapUnits() {
  const temp = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = temp;
  handleConversion();
  updateFavoriteButtonState();
  showToast('Units swapped! 🔄');
}

/**
 * Copy result to clipboard using Clipboard API
 */
function copyResult() {
  const textToCopy = `${resultValue.textContent} ${resultUnit.textContent}`;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      showToast('Copied to clipboard! 📋');
    })
    .catch(() => {
      showToast('Failed to copy! ❌');
    });
}

/**
 * Clear all input fields and reset to initial state
 */
function clearFields() {
  inputValue.value = '';
  resultValue.textContent = '0';
  resultUnit.textContent = '';
  inputError.textContent = '';

  // Reset unit selectors to placeholder (empty value)
  fromUnit.value = '';
  toUnit.value = '';

  updateFavoriteButtonState();

  // Don't call handleConversion() as units are empty
  showToast('All fields cleared! 🧹');
}

/**
 * Add conversion to history
 * Stores conversion data with timestamp
 * Keeps only the last 10 conversions
 *
 * @param {number} value - Input value
 * @param {string} fromUnit - From unit
 * @param {string} toUnit - To unit
 * @param {number} result - Result value
 */
function addToHistory(value, fromUnit, toUnit, result) {
  const units = CONVERSION_DATA[currentCategory].units;
  const timestamp = new Date().toLocaleTimeString();

  // Create history item object
  const historyItem = {
    category: currentCategory,
    value: value,
    fromUnit: fromUnit,
    fromName: units[fromUnit].name,
    toUnit: toUnit,
    toName: units[toUnit].name,
    result: formatResult(result),
    timestamp: timestamp,
  };

  // Add to beginning of array and keep only last 10
  conversionHistory.unshift(historyItem);
  conversionHistory = conversionHistory.slice(0, 10);

  // Save to local storage
  saveToLocalStorage();
  updateHistoryDisplay();
  updateConversionsCounter();
}

/**
 * Update history display in the sidebar
 */
function updateHistoryDisplay() {
  if (conversionHistory.length === 0) {
    historyContainer.innerHTML =
      '<p class="history-empty">No conversions yet</p>';
    return;
  }

  historyContainer.innerHTML = '';

  conversionHistory.forEach((item) => {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
            <div class="history-item__content">
                ${item.value} ${item.fromName} = ${item.result} ${item.toName}
            </div>
            <div class="history-item__time">${item.timestamp}</div>
        `;

    // Click to load this conversion
    historyItem.addEventListener('click', () => loadHistoryItem(item));

    historyContainer.appendChild(historyItem);
  });
}

/**
 * Load a history item into the converter
 * Useful for reusing past conversions
 * @param {object} item - History item to load
 */
function loadHistoryItem(item) {
  // Change category if different from current
  if (currentCategory !== item.category) {
    const categoryBtn = document.querySelector(
      `[data-category="${item.category}"]`
    );
    categoryBtn.click();
  }

  // Set input and unit values
  inputValue.value = item.value;
  fromUnit.value = item.fromUnit;
  toUnit.value = item.toUnit;

  // Manually perform conversion without adding to history
  performConversionWithoutHistory();
  updateFavoriteButtonState();
  showToast('Loaded from history! ⏰');
}

/**
 * Perform conversion without adding to history
 * Used when loading from history to avoid duplicates
 */
function performConversionWithoutHistory() {
  const inputVal = parseFloat(inputValue.value);

  // Validate input
  if (isNaN(inputVal) || inputVal < 0) {
    return;
  }

  // Clear any error messages
  inputError.textContent = '';

  // Perform conversion based on category
  let result;
  if (currentCategory === 'temperature') {
    result = convertTemperature(inputVal, fromUnit.value, toUnit.value);
  } else {
    result = convertUnits(inputVal, fromUnit.value, toUnit.value);
  }

  // Display result
  resultValue.textContent = formatResult(result);
  updateResultUnit();

  // NOTE: We do NOT call addToHistory() here to avoid duplicates
}

/**
 * Clear entire conversion history
 */
function clearHistory() {
  if (conversionHistory.length === 0) {
    showToast('History is already empty! 🗑️');
    return;
  }

  // Confirm before clearing
  if (confirm('Are you sure you want to clear all conversion history?')) {
    conversionHistory = [];
    saveToLocalStorage();
    updateHistoryDisplay();
    updateConversionsCounter(); // Add this line
    showToast('History cleared! 🗑️');
  }
}

/**
 * Toggle favorite status for current conversion
 */
function toggleFavorite() {
  storeFavorite();
}

/**
 * Update favorite button state based on current conversion
 */
function updateFavoriteButtonState() {
  // No valid conversion selected
  if (!fromUnit.value || !toUnit.value) {
    favoriteBtn.classList.remove('active');
    return;
  }

  const favoriteKey = `${currentCategory}-${fromUnit.value}-${toUnit.value}`;

  const isFavorited = favorites.some((fav) => fav.id === favoriteKey);

  favoriteBtn.classList.toggle('active', isFavorited);
}

/**
 * Show toast notification
 * Auto-dismisses after 2 seconds
 * @param {string} message - Message to display
 */
function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');

  // Remove show class after 2 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

/**
 * Save data to browser's local storage
 * Persists history and favorites across sessions
 */
function saveToLocalStorage() {
  localStorage.setItem('unitVerse_history', JSON.stringify(conversionHistory));
  localStorage.setItem('unitVerse_favorites', JSON.stringify(favorites));
}

/**
 * Load data from browser's local storage
 * Restores previous session's history and favorites
 */
function loadFromLocalStorage() {
  const savedHistory = localStorage.getItem('unitVerse_history');
  const savedFavorites = localStorage.getItem('unitVerse_favorites');

  if (savedHistory) {
    conversionHistory = JSON.parse(savedHistory);
    updateHistoryDisplay();
  }

  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
  }
}

/**
 * Switch between History and Favorites tabs
 * @param {string} tabName - The tab to switch to ('history' or 'favorites')
 */
function switchTab(tabName) {
  // Hide all tab contents
  document.querySelectorAll('.sidebar__tab-content').forEach((content) => {
    content.classList.remove('active');
  });

  // Remove active from all tabs
  sidebarTabs.forEach((tab) => {
    tab.classList.remove('active');
  });

  // Show selected tab content
  document.getElementById(`${tabName}-tab`).classList.add('active');

  // Mark tab as active
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

/**
 * Store a favorite conversion
 * Creates a favorite object with all conversion details
 */
function storeFavorite() {
  if (inputValue.value === '') {
    showToast('Please enter a value first! ⚠️');
    return;
  }

  if (fromUnit.value === '' || toUnit.value === '') {
    showToast('Please select both units! ⚠️');
    return;
  }

  const units = CONVERSION_DATA[currentCategory].units;
  const favoriteKey = `${currentCategory}-${fromUnit.value}-${toUnit.value}`;

  // Create favorite object
  const favorite = {
    id: favoriteKey,
    category: currentCategory,
    fromUnit: fromUnit.value,
    fromName: units[fromUnit.value].name,
    toUnit: toUnit.value,
    toName: units[toUnit.value].name,
    lastValue: inputValue.value,
    timestamp: new Date().toLocaleString(),
  };

  // Check if already in favorites
  const index = favorites.findIndex((fav) => fav.id === favoriteKey);

  if (index > -1) {
    // Remove if already exists
    favorites.splice(index, 1);
    favoriteBtn.classList.remove('active');
    showToast('Removed from favorites! 💔');
  } else {
    // Add new favorite
    favorites.push(favorite);
    favoriteBtn.classList.add('active');
    showToast('Added to favorites! ⭐');
  }

  // IMPORTANT: Save and update displays
  saveToLocalStorage();
  updateFavoritesDisplay();
  updateFavoriteButtonState();
}

/**
 * Update favorites display in the sidebar
 */
function updateFavoritesDisplay() {
  if (favorites.length === 0) {
    favoritesContainer.innerHTML =
      '<p class="favorites-empty">No favorites yet</p>';
    return;
  }

  favoritesContainer.innerHTML = '';

  favorites.forEach((favorite) => {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    favoriteItem.innerHTML = `
            <div class="favorite-item__content">
                ${favorite.fromName} ➜ ${favorite.toName}
            </div>
            <div class="favorite-item__units">
                ${favorite.category.charAt(0).toUpperCase() + favorite.category.slice(1)} • ${favorite.timestamp}
            </div>
        `;

    // Click to load this favorite conversion
    favoriteItem.addEventListener('click', () =>
      loadFavoriteConversion(favorite)
    );

    favoritesContainer.appendChild(favoriteItem);
  });
}

/**
 * Load a favorite conversion into the converter
 * @param {object} favorite - Favorite conversion to load
 */
function loadFavoriteConversion(favorite) {
  // Change category if different
  if (currentCategory !== favorite.category) {
    const categoryBtn = document.querySelector(
      `[data-category="${favorite.category}"]`
    );
    categoryBtn.click();
  }

  // Set the last used value and units
  inputValue.value = favorite.lastValue;
  fromUnit.value = favorite.fromUnit;
  toUnit.value = favorite.toUnit;

  // Perform conversion without adding to history
  performConversionWithoutHistory();
  updateFavoriteButtonState();
  showToast('Loaded favorite conversion! ⭐');
}

/**
 * Clear all favorite conversions
 */
function clearFavorites() {
  if (favorites.length === 0) {
    showToast('Favorites list is already empty! 🗑️');
    return;
  }

  if (confirm('Are you sure you want to clear all favorite conversions?')) {
    favorites = [];
    saveToLocalStorage();
    updateFavoritesDisplay();
    updateFavoriteButtonState();
    showToast('All favorites cleared! 🗑️');
  }
}

/**
 * Calculate unique conversions (no duplicates)
 * A unique conversion is a specific "From -> To" unit combination
 * @returns {number} Count of unique conversions
 */
function getUniqueConversionsCount() {
  // Create a Set to store unique conversion IDs
  const uniqueConversions = new Set();

  // Add each history item's conversion combination to the Set
  conversionHistory.forEach((item) => {
    const conversionId = `${item.category}-${item.fromUnit}-${item.toUnit}`;
    uniqueConversions.add(conversionId);
  });

  // Return the size of the Set (unique items only)
  return uniqueConversions.size;
}

/**
 * Update the unique conversions counter display
 */
function updateConversionsCounter() {
  const uniqueCount = getUniqueConversionsCount();
  const counterElement = document.getElementById('unique-conversions-count');
  counterElement.textContent = uniqueCount;
}

// New functions for enhanced features
function updateUnitInfo() {
    const units = CONVERSION_DATA[currentCategory].units;
    
    // Update From Unit Info
    if (fromUnit.value) {
        const from = units[fromUnit.value];
        fromUnitName.textContent = from.name;
        fromUnitSymbol.textContent = `Symbol: ${from.symbol}`;
        fromUnitDesc.textContent = `Description: ${from.description}`;
        fromUnitApps.textContent = `Applications: ${from.applications}`;
    } else {
        fromUnitName.textContent = 'Select a unit';
        fromUnitSymbol.textContent = '';
        fromUnitDesc.textContent = '';
        fromUnitApps.textContent = '';
    }
    
    // Update To Unit Info
    if (toUnit.value) {
        const to = units[toUnit.value];
        toUnitName.textContent = to.name;
        toUnitSymbol.textContent = `Symbol: ${to.symbol}`;
        toUnitDesc.textContent = `Description: ${to.description}`;
        toUnitApps.textContent = `Applications: ${to.applications}`;
    } else {
        toUnitName.textContent = 'Select a unit';
        toUnitSymbol.textContent = '';
        toUnitDesc.textContent = '';
        toUnitApps.textContent = '';
    }
}

function updateFormulaAndSteps(value, result) {
    if (!fromUnit.value || !toUnit.value) {
        formulaText.textContent = 'Select units to see the conversion formula';
        stepsContainer.innerHTML = '';
        return;
    }
    
    const units = CONVERSION_DATA[currentCategory].units;
    const from = units[fromUnit.value];
    const to = units[toUnit.value];
    
    let formula = '';
    let steps = [];
    
    if (currentCategory === 'temperature') {
        // Temperature-specific formulas
        if (fromUnit.value === 'celsius' && toUnit.value === 'fahrenheit') {
            formula = '°F = (°C × 9/5) + 32';
            steps = [
                `Step 1: Multiply ${value} by 9/5: ${value} × (9/5) = ${(value * 9/5).toFixed(4)}`,
                `Step 2: Add 32: ${(value * 9/5).toFixed(4)} + 32 = ${formatResult(result)}`
            ];
        } else if (fromUnit.value === 'fahrenheit' && toUnit.value === 'celsius') {
            formula = '°C = (°F - 32) × 5/9';
            steps = [
                `Step 1: Subtract 32 from ${value}: ${value} - 32 = ${(value - 32).toFixed(4)}`,
                `Step 2: Multiply by 5/9: ${(value - 32).toFixed(4)} × (5/9) = ${formatResult(result)}`
            ];
        } else if (fromUnit.value === 'celsius' && toUnit.value === 'kelvin') {
            formula = 'K = °C + 273.15';
            steps = [
                `Step 1: Add 273.15 to ${value}: ${value} + 273.15 = ${formatResult(result)}`
            ];
        } else if (fromUnit.value === 'kelvin' && toUnit.value === 'celsius') {
            formula = '°C = K - 273.15';
            steps = [
                `Step 1: Subtract 273.15 from ${value}: ${value} - 273.15 = ${formatResult(result)}`
            ];
        } else if (fromUnit.value === 'fahrenheit' && toUnit.value === 'kelvin') {
            formula = 'K = (°F - 32) × 5/9 + 273.15';
            steps = [
                `Step 1: Subtract 32 from ${value}: ${value} - 32 = ${(value - 32).toFixed(4)}`,
                `Step 2: Multiply by 5/9: ${(value - 32).toFixed(4)} × (5/9) = ${((value - 32) * 5/9).toFixed(4)}`,
                `Step 3: Add 273.15: ${((value - 32) * 5/9).toFixed(4)} + 273.15 = ${formatResult(result)}`
            ];
        } else if (fromUnit.value === 'kelvin' && toUnit.value === 'fahrenheit') {
            formula = '°F = (K - 273.15) × 9/5 + 32';
            steps = [
                `Step 1: Subtract 273.15 from ${value}: ${value} - 273.15 = ${(value - 273.15).toFixed(4)}`,
                `Step 2: Multiply by 9/5: ${(value - 273.15).toFixed(4)} × (9/5) = ${((value - 273.15) * 9/5).toFixed(4)}`,
                `Step 3: Add 32: ${((value - 273.15) * 9/5).toFixed(4)} + 32 = ${formatResult(result)}`
            ];
        } else {
            formula = 'No conversion needed';
            steps = [
                `Step 1: Units are same! Value = ${formatResult(result)}`
            ];
        }
    } else {
        // Other categories
        const conversionFactor = to.toBase / from.toBase;
        formula = `${to.symbol} = ${from.symbol} × ${conversionFactor}`;
        const baseValue = value * from.toBase;
        steps = [
            `Step 1: Convert to base unit: ${value} ${from.symbol} × ${from.toBase} = ${baseValue.toFixed(8)}`,
            `Step 2: Convert base to ${to.symbol}: ${baseValue.toFixed(8)} / ${to.toBase} = ${formatResult(result)}`
        ];
    }
    
    formulaText.textContent = formula;
    
    // Render steps
    stepsContainer.innerHTML = '';
    steps.forEach((step, idx) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'step-item';
        stepEl.textContent = step;
        stepsContainer.appendChild(stepEl);
    });
}

function updateMultiConversionTable(value) {
    if (!value || isNaN(value)) {
        conversionTableBody.innerHTML = '';
        return;
    }
    
    const units = CONVERSION_DATA[currentCategory].units;
    conversionTableBody.innerHTML = '';
    
    Object.keys(units).forEach((unitKey) => {
        const unit = units[unitKey];
        let convertedValue;
        
        if (currentCategory === 'temperature') {
            // Use temperature conversion
            if (fromUnit.value && unitKey !== fromUnit.value) {
                convertedValue = convertTemperature(value, fromUnit.value, unitKey);
            } else {
                convertedValue = value;
            }
        } else {
            // Use base unit conversion
            const from = fromUnit.value ? units[fromUnit.value] : unit;
            const baseValue = value * from.toBase;
            convertedValue = baseValue / unit.toBase;
        }
        
        const row = document.createElement('tr');
        row.className = unitKey === fromUnit.value ? 'highlighted-row' : '';
        row.innerHTML = `
            <td>${unit.name} (${unit.symbol})</td>
            <td>${formatResult(convertedValue)}</td>
        `;
        conversionTableBody.appendChild(row);
    });
}

/**
 * Initialize application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', init);

const button = document.createElement('button');
button.id = 'themeToggleBtn';
button.style.position = 'fixed';
button.style.top = '15px';
button.style.right = '15px';
button.style.zIndex = '9999';
button.style.cursor = 'pointer';
button.style.background = 'none';
button.style.border = 'none';
button.style.fontSize = '24px';
button.style.padding = '5px';
button.style.lineHeight = '1';
document.body.appendChild(button);
let isLightMode = JSON.parse(localStorage.getItem('lightMode')) || false;
function updateTheme() {
  if (isLightMode) {
    document.body.classList.add('light-theme');
    button.textContent = '🌙';
  } else {
    document.body.classList.remove('light-theme');
    button.textContent = '☀️';
  }
}
button.addEventListener('click', () => {
  isLightMode = !isLightMode;
  localStorage.setItem('lightMode', JSON.stringify(isLightMode));
  updateTheme();
});
updateTheme();
