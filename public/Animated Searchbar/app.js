// DOM Elements
const container = document.querySelector('.container');
const magnifier = document.querySelector('.magnifier');
const mic = document.querySelector('.mic-icon');
const input = document.querySelector('.input');
const resultBox = document.getElementById('result');
const clearIcon = document.querySelector('.clear-icon');
const loadingSpinner = document.querySelector('.loading-spinner');
const suggestionsBox = document.getElementById('suggestions');
const shortcutBadge = document.querySelector('.shortcut-badge');

// Sample search suggestions (you can replace with API calls)
const searchSuggestions = [
  'JavaScript tutorials',
  'JavaScript frameworks',
  'JavaScript best practices',
  'Python programming',
  'Python data science',
  'Web development',
  'Web design trends',
  'React hooks',
  'React components',
  'Node.js backend',
  'CSS animations',
  'CSS grid layout',
  'HTML5 features',
  'TypeScript basics',
  'API development',
  'Database design',
  'Machine learning',
  'Artificial intelligence',
  'Cloud computing',
  'DevOps practices',
];

let selectedSuggestionIndex = -1;
let currentSuggestions = [];

init();

function init() {
  setupEventListeners();
  updateClearButton();
  updateShortcutBadge();
}

function setupEventListeners() {
  // Magnifier click
  magnifier.addEventListener('click', handleSearch);
  magnifier.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleSearch();
  });

  // Input events
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeyDown);
  input.addEventListener('focus', () => {
    container.classList.add('active');
    updateShortcutBadge();
    if (input.value.trim()) showSuggestions(input.value);
  });
  input.addEventListener('blur', () => {
    // Delay to allow suggestion click
    setTimeout(() => {
      container.classList.remove('active');
      updateShortcutBadge();
      hideSuggestions();
    }, 200);
  });

  // Clear button
  clearIcon.addEventListener('click', clearSearch);
  clearIcon.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') clearSearch();
  });

  // Microphone
  mic.addEventListener('click', handleVoiceSearch);
  mic.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') handleVoiceSearch();
  });

  // Click outside to close suggestions
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target) && !suggestionsBox.contains(e.target)) {
      hideSuggestions();
    }
  });
}

const debouncedShowSuggestions = debounce(showSuggestions, 150);

function handleInput(e) {
  const value = e.target.value;
  updateClearButton();
  updateShortcutBadge();

  if (value.trim()) {
    debouncedShowSuggestions(value);
  } else {
    hideSuggestions();
  }
}

function handleKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    if (
      selectedSuggestionIndex >= 0 &&
      currentSuggestions[selectedSuggestionIndex]
    ) {
      selectSuggestion(currentSuggestions[selectedSuggestionIndex]);
    } else {
      handleSearch();
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    navigateSuggestions(1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    navigateSuggestions(-1);
  } else if (e.key === 'Escape') {
    hideSuggestions();
  }
}

function navigateSuggestions(direction) {
  if (currentSuggestions.length === 0) return;

  selectedSuggestionIndex += direction;

  if (selectedSuggestionIndex < -1) {
    selectedSuggestionIndex = currentSuggestions.length - 1;
  } else if (selectedSuggestionIndex >= currentSuggestions.length) {
    selectedSuggestionIndex = -1;
  }

  updateSuggestionSelection();
}

function updateSuggestionSelection() {
  const items = suggestionsBox.querySelectorAll('.suggestion-item');
  items.forEach((item, index) => {
    if (index === selectedSuggestionIndex) {
      item.classList.add('selected');
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      input.value = currentSuggestions[index];
    } else {
      item.classList.remove('selected');
    }
  });

  if (selectedSuggestionIndex === -1 && currentSuggestions.length > 0) {
    input.value = input.getAttribute('data-original-value') || '';
  }
}

function showSuggestions(query) {
  if (!input.value.trim()) {
    hideSuggestions();
    return;
  }
  const filtered = searchSuggestions.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    hideSuggestions();
    return;
  }

  currentSuggestions = filtered.slice(0, 8); // Limit to 8 suggestions
  selectedSuggestionIndex = -1;
  input.setAttribute('data-original-value', query);

  suggestionsBox.innerHTML = currentSuggestions
    .map(
      (item) => `
      <div class="suggestion-item" data-value="${item}">
        <i class="fa-solid fa-magnifying-glass"></i>
        <span>${highlightMatch(item, query)}</span>
      </div>
    `
    )
    .join('');

  // Add click listeners to suggestions
  suggestionsBox.querySelectorAll('.suggestion-item').forEach((item) => {
    item.addEventListener('click', () => {
      selectSuggestion(item.getAttribute('data-value'));
    });
  });

  suggestionsBox.classList.add('visible');
}

function highlightMatch(text, query) {
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<strong style="color: #ffa31a;">$1</strong>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hideSuggestions() {
  suggestionsBox.classList.remove('visible');
  selectedSuggestionIndex = -1;
  currentSuggestions = [];
}

function selectSuggestion(value) {
  input.value = value;
  hideSuggestions();
  handleSearch();
}

// Make performGoogleSearch globally accessible
window.performGoogleSearch = performGoogleSearch;

function handleSearch() {
  const searchValue = input.value.trim();

  if (searchValue === '') {
    showResult('Please enter a search query', 'error');
    return;
  }

  // Show loading state
  showLoading();
  hideSuggestions();

  // Simulate processing then redirect to Google
  setTimeout(() => {
    hideLoading();
    performGoogleSearch(searchValue);
  }, 500);
}

// Function to perform Google search
function performGoogleSearch(query) {
  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(searchUrl, '_blank');

  showResult(
    `<strong><i class="fa-brands fa-google"></i> Searching Google for:</strong><br>
    <span style="color:#ffa31a; font-size: 1.2em;">"${escapeHtml(query)}"</span><br><br>
    <small style="color: #888;">Opening in a new tab...</small><br><br>
    <button onclick="performGoogleSearch('${escapeHtml(query)}')" style="background: #ffa31a; color: #1a1a2e; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: bold;">
      <i class="fa-brands fa-google"></i> Search Again
    </button>`,
    'success'
  );
}

function handleVoiceSearch() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    showResult(
      '<i class="fa-solid fa-triangle-exclamation"></i><br>Sorry, your browser doesn\'t support voice search.<br><small>Try Chrome, Edge, or Safari.</small>',
      'error'
    );
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  // Visual feedback
  mic.classList.add('listening');
  container.classList.add('listening');
  input.placeholder = 'Listening...';

  try {
    recognition.start();
  } catch (error) {
    showResult(
      `<i class="fa-solid fa-triangle-exclamation"></i><br>Voice recognition is already active or unavailable.`,
      'error'
    );
    resetVoiceUI();
    return;
  }

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    const confidence = event.results[0][0].confidence;

    input.value = transcript;
    updateClearButton();

    showResult(
      `<strong><i class="fa-solid fa-microphone"></i> Voice Search Detected:</strong><br>
      You said: <span style="color:#ffa31a; font-size: 1.2em;">"${escapeHtml(transcript)}"</span><br>
      <small style="color: #888;">Confidence: ${(confidence * 100).toFixed(1)}%</small><br><br>
      <button onclick="performGoogleSearch('${escapeHtml(transcript)}')" style="background: #ffa31a; color: #1a1a2e; border: none; padding: 10px 20px; border-radius: 25px; cursor: pointer; font-weight: bold; margin-top: 10px;">
        <i class="fa-brands fa-google"></i> Search on Google
      </button>`,
      'success'
    );

    resetVoiceUI();
  };

  recognition.onerror = function (event) {
    let errorMessage = 'Could not recognize your voice. Please try again.';

    if (event.error === 'no-speech') {
      errorMessage = 'No speech detected. Please speak clearly and try again.';
    } else if (event.error === 'not-allowed') {
      errorMessage =
        'Microphone access denied. Please allow microphone access in your browser settings.';
    } else if (event.error === 'network') {
      errorMessage =
        'Voice recognition works offline in most browsers. Please try speaking again.';
    } else if (event.error === 'aborted') {
      errorMessage = 'Voice recognition was cancelled.';
    }

    showResult(
      `<i class="fa-solid fa-triangle-exclamation"></i><br>${errorMessage}`,
      'error'
    );
    resetVoiceUI();
  };

  recognition.onend = function () {
    resetVoiceUI();
  };
}

function resetVoiceUI() {
  mic.classList.remove('listening');
  container.classList.remove('listening');
  input.placeholder = 'Type to search...';
}

function clearSearch() {
  input.value = '';
  updateClearButton();
  updateShortcutBadge();
  hideSuggestions();
  hideResult();
  input.focus();
}

function updateClearButton() {
  if (input.value.trim()) {
    clearIcon.classList.add('visible');
  } else {
    clearIcon.classList.remove('visible');
  }
}

function updateShortcutBadge() {
  if (!shortcutBadge) return;
  if (document.activeElement === input || input.value.trim() !== '') {
    shortcutBadge.classList.add('hidden');
  } else {
    shortcutBadge.classList.remove('hidden');
  }
}

function showLoading() {
  loadingSpinner.classList.add('active');
  magnifier.style.opacity = '0';
}

function hideLoading() {
  loadingSpinner.classList.remove('active');
  magnifier.style.opacity = '1';
}

function showResult(message, type = 'success') {
  resultBox.innerHTML = `
  <button
    id="closeResult"
    style="
      float:right;
      background:none;
      border:none;
      color:#aaa;
      font-size:18px;
      cursor:pointer;
    "
    aria-label="Close result"
  >
    &times;
  </button>
  ${message}
`;

  document.getElementById('closeResult')?.addEventListener('click', hideResult);
  resultBox.classList.add('visible');
  resultBox.style.display = 'block';

  if (type === 'error') {
    resultBox.style.borderLeft = '4px solid #ff4444';
  } else {
    resultBox.style.borderLeft = '4px solid #ffa31a';
  }

  // Keep result visible until user clears search,
  // performs another search, or manually closes it.
}

function hideResult() {
  resultBox.classList.remove('visible');
  setTimeout(() => {
    resultBox.style.display = 'none';
  }, 300);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Debounce function for better performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optional: Add keyboard shortcut (Ctrl/Cmd + K) to focus search
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    input.focus();
  }
});
