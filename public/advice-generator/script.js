// Target entry endpoint parameter mapping references
const ADVICE_SLIP_API = 'https://api.adviceslip.com/advice';

const adviceId = document.getElementById('adviceId');
const adviceQuote = document.getElementById('adviceQuote');
const diceBtn = document.getElementById('diceBtn');
const tweetBtn = document.getElementById('tweetBtn');
const adviceCard = document.querySelector('.advice-card');
const copyBtn = document.getElementById('copyBtn');
const favoriteBtn = document.getElementById('favoriteBtn');
const viewFavoritesBtn = document.getElementById('viewFavoritesBtn');
const favoritesPanel = document.getElementById('favoritesPanel');
const favoritesList = document.getElementById('favoritesList');
const toast = document.getElementById('toast');
let activeAdviceText = '';

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function getFavorites() {
  return JSON.parse(localStorage.getItem('favoriteAdvice')) || [];
}

function saveFavorite(advice) {
  const favorites = getFavorites();

  if (favorites.includes(advice)) {
    showToast('Advice already saved');
    return;
  }

  favorites.push(advice);
  localStorage.setItem('favoriteAdvice', JSON.stringify(favorites));

  renderFavorites();
  showToast('Advice saved');
}

function renderFavorites() {
  const favorites = getFavorites();

  favoritesList.innerHTML = '';

  if (!favorites.length) {
    favoritesList.innerHTML = '<li>No saved advice yet.</li>';
    return;
  }

  favorites.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    favoritesList.appendChild(li);
  });
}

// Dynamic API fetch interface engine
async function loadNewAdviceSlip() {
  // Inject local state loading classes to toggle loading states
  adviceCard.classList.add('loading');
  diceBtn.disabled = true;

  try {
    // Append unique timestamp filters to prevent browser cache retention loops
    const response = await fetch(
      `${ADVICE_SLIP_API}?ts=${new Date().getTime()}`
    );
    if (!response.ok) throw new Error('Connection request rejected.');

    const payload = await response.json();
    const slip = payload.slip;

    // Render response metrics to interface layout components
    adviceId.innerText = slip.id;
    activeAdviceText = slip.advice;
    document.querySelector('.advice-quote').innerText = `"${activeAdviceText}"`;

    // Update the share link context properties
    syncTwitterIntent(activeAdviceText);
  } catch (error) {
    document.querySelector('.advice-quote').innerText =
      'An error occurred while loading advice. Please try again.';
  } finally {
    // Disengage blocking layouts
    adviceCard.classList.remove('loading');
    diceBtn.disabled = false;
  }
}

// Format sharing attributes to match Twitter/X intent APIs
function syncTwitterIntent(text) {
  const formattedShareText = encodeURIComponent(
    `${text} — Generated via Advice Workspace Engine`
  );
  tweetBtn.href = `https://twitter.com/intent/tweet?text=${formattedShareText}`;
}

// Configure button event listener mappings
diceBtn.addEventListener('click', loadNewAdviceSlip);

copyBtn.addEventListener('click', async () => {
  if (!activeAdviceText) return;

  await navigator.clipboard.writeText(activeAdviceText);
  showToast('Advice copied');
});

favoriteBtn.addEventListener('click', () => {
  if (!activeAdviceText) return;

  saveFavorite(activeAdviceText);
});

viewFavoritesBtn.addEventListener('click', () => {
  favoritesPanel.classList.toggle('show-panel');
});

// Load an initial piece of advice when the page opens
renderFavorites();
loadNewAdviceSlip();
