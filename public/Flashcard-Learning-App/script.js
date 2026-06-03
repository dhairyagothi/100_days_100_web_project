const storageKey = 'flashcardLearningAppCards';
const themeKey = 'flashcardLearningAppTheme';

const cardFrontInput = document.getElementById('cardFront');
const cardBackInput = document.getElementById('cardBack');
const saveCardButton = document.getElementById('saveCardButton');
const clearFormButton = document.getElementById('clearFormButton');
const flashcardList = document.getElementById('flashcardList');
const cardCountLabel = document.getElementById('cardCount');
const studyCardText = document.getElementById('studyCardText');
const flipCardButton = document.getElementById('flipCardButton');
const nextCardButton = document.getElementById('nextCardButton');
const prevCardButton = document.getElementById('prevCardButton');
const randomCardButton = document.getElementById('randomCardButton');
const resetDeckButton = document.getElementById('resetDeckButton');
const themeToggleButton = document.getElementById('themeToggle');

let cards = [];
let activeIndex = 0;
let showingFront = true;
let editingIndex = null;

function loadCards() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      cards = JSON.parse(saved);
    } catch (error) {
      cards = [];
    }
  }
  if (!cards.length) {
    cards = [
      { front: 'What is spaced repetition?', back: 'A learning method that increases retention by reviewing material at gradually increasing intervals.' },
      { front: 'What is a flashcard?', back: 'A study tool with a prompt on one side and an answer on the other.' }
    ];
  }
}

function saveCards() {
  localStorage.setItem(storageKey, JSON.stringify(cards));
}

function updateCardCount() {
  const count = cards.length;
  cardCountLabel.textContent = `${count} card${count === 1 ? '' : 's'}`;
}

function renderDeck() {
  flashcardList.innerHTML = '';
  if (!cards.length) {
    flashcardList.innerHTML = '<p class="empty-message">No cards yet. Add one to start studying.</p>';
    return;
  }

  cards.forEach((card, index) => {
    const item = document.createElement('div');
    item.className = 'flashcard-item';
    item.innerHTML = `
      <p><strong>Front:</strong> ${card.front}</p>
      <p><strong>Back:</strong> ${card.back}</p>
      <div class="flashcard-actions">
        <button type="button" data-action="edit" data-index="${index}">Edit</button>
        <button type="button" data-action="delete" data-index="${index}">Delete</button>
      </div>
    `;
    flashcardList.appendChild(item);
  });
}

function updateStudyCard() {
  if (!cards.length) {
    studyCardText.textContent = 'Add a card to begin studying.';
    return;
  }

  if (activeIndex >= cards.length) activeIndex = 0;
  if (activeIndex < 0) activeIndex = cards.length - 1;
  showingFront = true;
  studyCardText.textContent = cards[activeIndex].front;
}

function addOrUpdateCard() {
  const front = cardFrontInput.value.trim();
  const back = cardBackInput.value.trim();
  if (!front || !back) {
    alert('Both front and back content are required.');
    return;
  }

  const newCard = { front, back };
  if (editingIndex !== null) {
    cards[editingIndex] = newCard;
    editingIndex = null;
    saveCardButton.textContent = 'Add Card';
  } else {
    cards.push(newCard);
    activeIndex = cards.length - 1;
  }

  cardFrontInput.value = '';
  cardBackInput.value = '';
  saveCards();
  renderDeck();
  updateCardCount();
  updateStudyCard();
}

function clearForm() {
  cardFrontInput.value = '';
  cardBackInput.value = '';
  editingIndex = null;
  saveCardButton.textContent = 'Add Card';
}

function handleDeckClick(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  if (action === 'edit') {
    const card = cards[index];
    cardFrontInput.value = card.front;
    cardBackInput.value = card.back;
    editingIndex = index;
    saveCardButton.textContent = 'Update Card';
  }

  if (action === 'delete') {
    cards.splice(index, 1);
    if (activeIndex >= cards.length) activeIndex = cards.length - 1;
    saveCards();
    renderDeck();
    updateCardCount();
    updateStudyCard();
  }
}

function showNextCard() {
  if (!cards.length) return;
  activeIndex = (activeIndex + 1) % cards.length;
  showingFront = true;
  updateStudyCard();
}

function showPreviousCard() {
  if (!cards.length) return;
  activeIndex = (activeIndex - 1 + cards.length) % cards.length;
  showingFront = true;
  updateStudyCard();
}

function flipCard() {
  if (!cards.length) return;
  showingFront = !showingFront;
  studyCardText.textContent = showingFront ? cards[activeIndex].front : cards[activeIndex].back;
}

function chooseRandomCard() {
  if (!cards.length) return;
  activeIndex = Math.floor(Math.random() * cards.length);
  showingFront = true;
  updateStudyCard();
}

function resetDeck() {
  if (!confirm('Reset the deck and remove all cards?')) return;
  cards = [];
  saveCards();
  renderDeck();
  updateCardCount();
  updateStudyCard();
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
}

function toggleTheme() {
  const current = document.documentElement.dataset.theme || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

function loadTheme() {
  const saved = localStorage.getItem(themeKey) || 'dark';
  setTheme(saved);
}

function init() {
  loadTheme();
  loadCards();
  renderDeck();
  updateCardCount();
  updateStudyCard();

  saveCardButton.addEventListener('click', addOrUpdateCard);
  clearFormButton.addEventListener('click', clearForm);
  flashcardList.addEventListener('click', handleDeckClick);
  nextCardButton.addEventListener('click', showNextCard);
  prevCardButton.addEventListener('click', showPreviousCard);
  flipCardButton.addEventListener('click', flipCard);
  randomCardButton.addEventListener('click', chooseRandomCard);
  resetDeckButton.addEventListener('click', resetDeck);
  themeToggleButton.addEventListener('click', toggleTheme);
}

init();
