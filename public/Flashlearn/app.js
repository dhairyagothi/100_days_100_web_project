// --- DEFAULT SAMPLE DATA ---
const DEFAULT_DECKS = [
  {
    id: "deck_js_basics",
    title: "JavaScript Essentials",
    category: "Programming",
    icon: "⚡",
    description: "Core JavaScript concepts including variables, scope, async operations, and functions."
  },
  {
    id: "deck_web_dev",
    title: "Web Development 101",
    category: "Programming",
    icon: "🌐",
    description: "Key concepts in HTML, CSS layout modes, responsive web design, and web APIs."
  },
  {
    id: "deck_spanish",
    title: "Spanish Vocabulary",
    category: "Languages",
    icon: "🇪🇸",
    description: "Essential Spanish words and phrases for beginners."
  },
  {
    id: "deck_science",
    title: "Science & Nature",
    category: "Science",
    icon: "🔬",
    description: "Fun science facts, biology terms, and physics fundamentals."
  }
];

const DEFAULT_CARDS = [
  // JavaScript Cards
  {
    id: "card_js_1",
    deckId: "deck_js_basics",
    question: "What is the main difference between 'let' and 'const'?",
    answer: "'let' allows re-assigning values to a variable later, while 'const' creates a read-only reference that cannot be re-assigned.",
    hint: "Think about constant vs changeable variables.",
    status: "mastered"
  },
  {
    id: "card_js_2",
    deckId: "deck_js_basics",
    question: "What is a Closure in JavaScript?",
    answer: "A closure is a function bundled together with references to its surrounding state (the lexical environment). It gives an inner function access to an outer function's scope.",
    hint: "Functions remembering their outer scope variables.",
    status: "learning"
  },
  {
    id: "card_js_3",
    deckId: "deck_js_basics",
    question: "What does a JavaScript Promise represent?",
    answer: "A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value.",
    hint: "States: Pending, Fulfilled, Rejected.",
    status: "learning"
  },
  {
    id: "card_js_4",
    deckId: "deck_js_basics",
    question: "What is the output of 'typeof NaN' in JavaScript?",
    answer: "'number'. Although NaN stands for 'Not a Number', its technical type representation in JS is numeric.",
    hint: "It's a quirk in JS type checking!",
    status: "learning"
  },

  // Web Dev Cards
  {
    id: "card_web_1",
    deckId: "deck_web_dev",
    question: "What does HTML stand for?",
    answer: "HyperText Markup Language. It provides the standard structure for Web pages.",
    hint: "Standard markup language for documents designed to display in a browser.",
    status: "mastered"
  },
  {
    id: "card_web_2",
    deckId: "deck_web_dev",
    question: "What is the primary difference between CSS Flexbox and Grid?",
    answer: "Flexbox is designed for one-dimensional layouts (a row OR a column), whereas CSS Grid is designed for two-dimensional layouts (rows AND columns simultaneously).",
    hint: "1D layout vs 2D layout.",
    status: "learning"
  },

  // Spanish Cards
  {
    id: "card_spanish_1",
    deckId: "deck_spanish",
    question: "How do you say 'Thank you very much' in Spanish?",
    answer: "'Muchas gracias'.",
    hint: "Sounds like 'moo-chas grah-see-as'.",
    status: "mastered"
  },
  {
    id: "card_spanish_2",
    deckId: "deck_spanish",
    question: "What does '¿Cómo estás?' mean in English?",
    answer: "'How are you?' (informal greeting).",
    hint: "Used to ask someone how they are feeling.",
    status: "learning"
  },

  // Science Cards
  {
    id: "card_science_1",
    deckId: "deck_science",
    question: "What process do plants use to convert sunlight into energy?",
    answer: "Photosynthesis. Plants use chlorophyll to absorb light and convert carbon dioxide and water into glucose and oxygen.",
    hint: "Requires light, carbon dioxide, and water.",
    status: "mastered"
  },
  {
    id: "card_science_2",
    deckId: "deck_science",
    question: "What is the chemical formula for pure water?",
    answer: "H₂O (Two Hydrogen atoms bonded with one Oxygen atom).",
    hint: "Hydrogen + Oxygen.",
    status: "mastered"
  }
];

// --- APP STATE ---
let state = {
  decks: [],
  cards: [],
  activeCategory: "all",
  searchQuery: "",
  theme: "light",
  study: {
    deckId: null,
    cardsList: [],
    currentIndex: 0,
    isFlipped: false,
    isShuffled: false
  },
  selectedManageDeckId: null
};

// --- LOCAL STORAGE MANAGER ---
const STORAGE_KEY = "flashlearn_platform_data";
const THEME_KEY = "flashlearn_theme";

function saveState() {
  try {
    const payload = {
      decks: state.decks,
      cards: state.cards
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state.decks = parsed.decks || DEFAULT_DECKS;
      state.cards = parsed.cards || DEFAULT_CARDS;
    } else {
      // Use defaults
      state.decks = [...DEFAULT_DECKS];
      state.cards = [...DEFAULT_CARDS];
      saveState();
    }
  } catch (err) {
    console.warn("Could not parse localStorage, resetting to defaults.", err);
    state.decks = [...DEFAULT_DECKS];
    state.cards = [...DEFAULT_CARDS];
  }

  // Load Theme
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  setTheme(savedTheme);
}

// --- THEME TOGGLE ---
function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);

  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

// --- DOM ELEMENT REFERENCES ---
const DOM = {
  // Navigation Tabs
  navTabs: document.querySelectorAll(".nav-tab"),
  views: document.querySelectorAll(".view-section"),
  themeToggleBtn: document.getElementById("theme-toggle-btn"),
  btnLogo: document.getElementById("btn-logo"),

  // Decks View
  decksGrid: document.getElementById("decks-grid-container"),
  deckSearchInput: document.getElementById("deck-search-input"),
  categoryFilters: document.getElementById("category-filters"),
  createDeckModalBtn: document.getElementById("create-deck-modal-btn"),

  // Study View
  backToDecksBtn: document.getElementById("back-to-decks-btn"),
  studyDeckTitle: document.getElementById("study-deck-title"),
  studyDeckBadge: document.getElementById("study-deck-badge"),
  studyCardCounter: document.getElementById("study-card-counter"),
  studyMasteryScore: document.getElementById("study-mastery-score"),
  studyProgressFill: document.getElementById("study-progress-fill"),

  flashcardElement: document.getElementById("flashcard-element"),
  cardQuestionText: document.getElementById("card-question-text"),
  cardAnswerText: document.getElementById("card-answer-text"),
  cardHintBox: document.getElementById("card-hint-box"),
  cardHintText: document.getElementById("card-hint-text"),

  btnPrevCard: document.getElementById("btn-prev-card"),
  btnNextCard: document.getElementById("btn-next-card"),
  btnFlipCard: document.getElementById("btn-flip-card"),
  btnToggleHint: document.getElementById("btn-toggle-hint"),
  btnShuffleDeck: document.getElementById("btn-shuffle-deck"),
  btnRestartStudy: document.getElementById("btn-restart-study"),

  btnMarkLearning: document.getElementById("btn-mark-learning"),
  btnMarkMastered: document.getElementById("btn-mark-mastered"),
  btnSpeechFront: document.getElementById("btn-speech-front"),
  btnSpeechBack: document.getElementById("btn-speech-back"),

  // Manage View
  manageDeckList: document.getElementById("manage-deck-list"),
  managerDeckTitle: document.getElementById("manager-deck-title"),
  managerCardCount: document.getElementById("manager-card-count"),
  managerCardsTbody: document.getElementById("manager-cards-tbody"),
  emptyCardsState: document.getElementById("empty-cards-state"),
  btnAddCardModal: document.getElementById("btn-add-card-modal"),
  btnEditCurrentDeck: document.getElementById("btn-edit-current-deck"),
  btnDeleteCurrentDeck: document.getElementById("btn-delete-current-deck"),
  quickCreateBtn: document.getElementById("quick-create-btn"),

  // Stats View
  statTotalDecks: document.getElementById("stat-total-decks"),
  statTotalCards: document.getElementById("stat-total-cards"),
  statMasteredCards: document.getElementById("stat-mastered-cards"),
  statMasteryRate: document.getElementById("stat-mastery-rate"),

  btnExportJson: document.getElementById("btn-export-json"),
  importJsonFile: document.getElementById("import-json-file"),
  btnResetSampleData: document.getElementById("btn-reset-sample-data"),

  // Modals & Forms
  modalDeck: document.getElementById("modal-deck"),
  formDeck: document.getElementById("form-deck"),
  inputDeckId: document.getElementById("input-deck-id"),
  inputDeckTitle: document.getElementById("input-deck-title"),
  inputDeckCategory: document.getElementById("input-deck-category"),
  inputDeckIcon: document.getElementById("input-deck-icon"),
  inputDeckDesc: document.getElementById("input-deck-desc"),
  modalDeckTitleText: document.getElementById("modal-deck-title-text"),

  modalCard: document.getElementById("modal-card"),
  formCard: document.getElementById("form-card"),
  inputCardId: document.getElementById("input-card-id"),
  selectCardTargetDeck: document.getElementById("select-card-target-deck"),
  inputCardQuestion: document.getElementById("input-card-question"),
  inputCardAnswer: document.getElementById("input-card-answer"),
  inputCardHint: document.getElementById("input-card-hint"),
  modalCardTitleText: document.getElementById("modal-card-title-text"),

  toastContainer: document.getElementById("toast-container")
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initEventListeners();
  renderDecksGrid();
  updateStatsView();
});

// --- NAVIGATION CONTROLLER ---
function switchTab(targetTabId) {
  DOM.navTabs.forEach(tab => {
    if (tab.dataset.tab === targetTabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  DOM.views.forEach(view => {
    if (view.id === targetTabId) {
      view.classList.add("active");
    } else {
      view.classList.remove("active");
    }
  });

  // Tab specific refreshes
  if (targetTabId === "decks-view") {
    renderDecksGrid();
  } else if (targetTabId === "manage-view") {
    renderManagerView();
  } else if (targetTabId === "stats-view") {
    updateStatsView();
  }
}

// --- RENDER DECKS LIBRARY ---
function renderDecksGrid() {
  const query = state.searchQuery.toLowerCase().trim();
  const category = state.activeCategory;

  const filteredDecks = state.decks.filter(deck => {
    const matchesCategory = category === "all" || deck.category === category;
    const matchesQuery = deck.title.toLowerCase().includes(query) ||
                         (deck.description && deck.description.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  DOM.decksGrid.innerHTML = "";

  if (filteredDecks.length === 0) {
    DOM.decksGrid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <h3>No Decks Found</h3>
        <p>Try clearing your search query or creating a new deck.</p>
      </div>
    `;
    return;
  }

  filteredDecks.forEach(deck => {
    const deckCards = state.cards.filter(c => c.deckId === deck.id);
    const totalCount = deckCards.length;
    const masteredCount = deckCards.filter(c => c.status === "mastered").length;
    const masteryPct = totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;

    const cardEl = document.createElement("div");
    cardEl.className = "deck-card";
    cardEl.innerHTML = `
      <div>
        <div class="deck-top">
          <div class="deck-emoji">${deck.icon || "⚡"}</div>
          <span class="badge">${deck.category}</span>
        </div>
        <h3 class="deck-title">${escapeHTML(deck.title)}</h3>
        <p class="deck-desc">${escapeHTML(deck.description || "No description provided.")}</p>
      </div>
      <div class="deck-meta">
        <div class="deck-stats">
          <span><i class="fa-solid fa-clone"></i> ${totalCount} cards</span>
          <span><i class="fa-solid fa-chart-line"></i> ${masteryPct}%</span>
        </div>
        <button class="btn btn-primary btn-sm btn-start-study" data-deck-id="${deck.id}">
          <i class="fa-solid fa-play"></i> Study
        </button>
      </div>
    `;
    DOM.decksGrid.appendChild(cardEl);
  });

  // Attach start study listeners
  document.querySelectorAll(".btn-start-study").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const deckId = btn.dataset.deckId;
      startStudySession(deckId);
    });
  });
}

// --- STUDY MODE ENGINE ---
function startStudySession(deckId) {
  const deck = state.decks.find(d => d.id === deckId);
  if (!deck) return;

  const deckCards = state.cards.filter(c => c.deckId === deckId);
  if (deckCards.length === 0) {
    showToast("This deck has no cards yet! Add cards in the Manage tab.", "error");
    state.selectedManageDeckId = deckId;
    switchTab("manage-view");
    return;
  }

  state.study.deckId = deckId;
  state.study.cardsList = [...deckCards];
  state.study.currentIndex = 0;
  state.study.isFlipped = false;
  state.study.isShuffled = false;

  DOM.studyDeckTitle.textContent = deck.title;
  DOM.studyDeckBadge.textContent = deck.category;
  DOM.btnShuffleDeck.classList.remove("active");

  renderCurrentStudyCard();
  switchTab("study-view");
}

function renderCurrentStudyCard() {
  const { cardsList, currentIndex, isFlipped } = state.study;
  if (!cardsList || cardsList.length === 0) return;

  const currentCard = cardsList[currentIndex];
  const total = cardsList.length;

  // Unflip first for visual transition if switching card
  DOM.flashcardElement.classList.toggle("flipped", isFlipped);
  DOM.cardHintBox.classList.add("hidden");

  DOM.cardQuestionText.textContent = currentCard.question;
  DOM.cardAnswerText.textContent = currentCard.answer;
  DOM.cardHintText.textContent = currentCard.hint || "No hint available for this card.";

  // Controls & Counter
  DOM.studyCardCounter.textContent = `Card ${currentIndex + 1} of ${total}`;
  
  const masteredCount = cardsList.filter(c => c.status === "mastered").length;
  const masteryPct = Math.round((masteredCount / total) * 100);
  DOM.studyMasteryScore.textContent = `Mastered: ${masteryPct}%`;

  const progressPct = ((currentIndex + 1) / total) * 100;
  DOM.studyProgressFill.style.width = `${progressPct}%`;
}

function flipCard() {
  state.study.isFlipped = !state.study.isFlipped;
  DOM.flashcardElement.classList.toggle("flipped", state.study.isFlipped);
}

function nextCard() {
  const { cardsList, currentIndex } = state.study;
  if (currentIndex < cardsList.length - 1) {
    state.study.currentIndex++;
    state.study.isFlipped = false;
    renderCurrentStudyCard();
  } else {
    showToast("🎉 You've reached the end of this deck!", "success");
  }
}

function prevCard() {
  if (state.study.currentIndex > 0) {
    state.study.currentIndex--;
    state.study.isFlipped = false;
    renderCurrentStudyCard();
  }
}

function setCardMasteryStatus(status) {
  const { cardsList, currentIndex } = state.study;
  if (!cardsList || cardsList.length === 0) return;

  const currentCard = cardsList[currentIndex];
  currentCard.status = status;

  // Update in primary state array
  const globalCard = state.cards.find(c => c.id === currentCard.id);
  if (globalCard) {
    globalCard.status = status;
    saveState();
  }

  showToast(status === "mastered" ? "Marked as Mastered! 🎉" : "Marked as Still Learning 💡", "info");

  // Advance to next card if available
  if (currentIndex < cardsList.length - 1) {
    nextCard();
  } else {
    renderCurrentStudyCard();
  }
}

function speakText(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Cancel active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    showToast("Text-to-speech is not supported in your browser.", "error");
  }
}

// --- MANAGE DECKS & CARDS ---
function renderManagerView() {
  // If no selected deck, select first
  if (!state.selectedManageDeckId && state.decks.length > 0) {
    state.selectedManageDeckId = state.decks[0].id;
  }

  // Render Sidebar List
  DOM.manageDeckList.innerHTML = "";
  state.decks.forEach(deck => {
    const cardCount = state.cards.filter(c => c.deckId === deck.id).length;
    const btn = document.createElement("button");
    btn.className = `deck-select-item ${deck.id === state.selectedManageDeckId ? "active" : ""}`;
    btn.innerHTML = `
      <span>${deck.icon || "⚡"} ${escapeHTML(deck.title)}</span>
      <span class="count-badge">${cardCount}</span>
    `;
    btn.addEventListener("click", () => {
      state.selectedManageDeckId = deck.id;
      renderManagerView();
    });
    DOM.manageDeckList.appendChild(btn);
  });

  // Render Table content
  const selectedDeck = state.decks.find(d => d.id === state.selectedManageDeckId);
  if (!selectedDeck) {
    DOM.managerDeckTitle.textContent = "Select a Deck";
    DOM.managerCardCount.textContent = "0 cards";
    DOM.managerCardsTbody.innerHTML = "";
    DOM.emptyCardsState.classList.remove("hidden");
    return;
  }

  DOM.managerDeckTitle.textContent = `${selectedDeck.icon || "⚡"} ${selectedDeck.title}`;
  const deckCards = state.cards.filter(c => c.deckId === selectedDeck.id);
  DOM.managerCardCount.textContent = `${deckCards.length} cards`;

  DOM.managerCardsTbody.innerHTML = "";
  if (deckCards.length === 0) {
    DOM.emptyCardsState.classList.remove("hidden");
  } else {
    DOM.emptyCardsState.classList.add("hidden");
    deckCards.forEach((card, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${idx + 1}</strong></td>
        <td>${escapeHTML(card.question)}</td>
        <td>${escapeHTML(card.answer)}</td>
        <td>
          <span class="status-tag ${card.status}">
            ${card.status === "mastered" ? "Mastered" : "Learning"}
          </span>
        </td>
        <td>
          <div class="table-actions">
            <button class="icon-action-btn edit-card-btn" data-card-id="${card.id}" title="Edit Card">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="icon-action-btn delete-btn delete-card-btn" data-card-id="${card.id}" title="Delete Card">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      DOM.managerCardsTbody.appendChild(tr);
    });

    // Attach card table listeners
    document.querySelectorAll(".edit-card-btn").forEach(btn => {
      btn.addEventListener("click", () => openCardModal(btn.dataset.cardId));
    });

    document.querySelectorAll(".delete-card-btn").forEach(btn => {
      btn.addEventListener("click", () => deleteCard(btn.dataset.cardId));
    });
  }
}

// --- MODAL HANDLERS ---
function openDeckModal(deckId = null) {
  DOM.formDeck.reset();
  if (deckId) {
    const deck = state.decks.find(d => d.id === deckId);
    if (deck) {
      DOM.inputDeckId.value = deck.id;
      DOM.inputDeckTitle.value = deck.title;
      DOM.inputDeckCategory.value = deck.category;
      DOM.inputDeckIcon.value = deck.icon || "⚡";
      DOM.inputDeckDesc.value = deck.description || "";
      DOM.modalDeckTitleText.textContent = "Edit Deck";
    }
  } else {
    DOM.inputDeckId.value = "";
    DOM.modalDeckTitleText.textContent = "Create New Deck";
  }
  DOM.modalDeck.classList.remove("hidden");
}

function closeDeckModal() {
  DOM.modalDeck.classList.add("hidden");
}

function openCardModal(cardId = null) {
  DOM.formCard.reset();

  // Populate Target Deck Selector Options
  DOM.selectCardTargetDeck.innerHTML = "";
  state.decks.forEach(deck => {
    const opt = document.createElement("option");
    opt.value = deck.id;
    opt.textContent = deck.title;
    if (deck.id === state.selectedManageDeckId) opt.selected = true;
    DOM.selectCardTargetDeck.appendChild(opt);
  });

  if (cardId) {
    const card = state.cards.find(c => c.id === cardId);
    if (card) {
      DOM.inputCardId.value = card.id;
      DOM.selectCardTargetDeck.value = card.deckId;
      DOM.inputCardQuestion.value = card.question;
      DOM.inputCardAnswer.value = card.answer;
      DOM.inputCardHint.value = card.hint || "";
      DOM.modalCardTitleText.textContent = "Edit Flashcard";
    }
  } else {
    DOM.inputCardId.value = "";
    DOM.modalCardTitleText.textContent = "Add New Flashcard";
  }
  DOM.modalCard.classList.remove("hidden");
}

function closeCardModal() {
  DOM.modalCard.classList.add("hidden");
}

// --- SAVE FORM DATA ---
function handleSaveDeck(e) {
  e.preventDefault();
  const id = DOM.inputDeckId.value;
  const title = DOM.inputDeckTitle.value.trim();
  const category = DOM.inputDeckCategory.value;
  const icon = DOM.inputDeckIcon.value.trim() || "⚡";
  const description = DOM.inputDeckDesc.value.trim();

  if (!title) return;

  if (id) {
    // Edit existing
    const deck = state.decks.find(d => d.id === id);
    if (deck) {
      deck.title = title;
      deck.category = category;
      deck.icon = icon;
      deck.description = description;
      showToast("Deck updated successfully!", "success");
    }
  } else {
    // Create new deck
    const newDeck = {
      id: "deck_" + Date.now(),
      title,
      category,
      icon,
      description
    };
    state.decks.push(newDeck);
    state.selectedManageDeckId = newDeck.id;
    showToast("New deck created!", "success");
  }

  saveState();
  closeDeckModal();
  renderDecksGrid();
  renderManagerView();
}

function handleSaveCard(e) {
  e.preventDefault();
  const id = DOM.inputCardId.value;
  const deckId = DOM.selectCardTargetDeck.value;
  const question = DOM.inputCardQuestion.value.trim();
  const answer = DOM.inputCardAnswer.value.trim();
  const hint = DOM.inputCardHint.value.trim();

  if (!question || !answer) return;

  if (id) {
    // Edit existing
    const card = state.cards.find(c => c.id === id);
    if (card) {
      card.deckId = deckId;
      card.question = question;
      card.answer = answer;
      card.hint = hint;
      showToast("Flashcard updated!", "success");
    }
  } else {
    // Create new
    const newCard = {
      id: "card_" + Date.now(),
      deckId,
      question,
      answer,
      hint,
      status: "learning"
    };
    state.cards.push(newCard);
    showToast("New flashcard added!", "success");
  }

  saveState();
  closeCardModal();
  renderManagerView();
  renderDecksGrid();
}

function deleteCard(cardId) {
  if (confirm("Are you sure you want to delete this card?")) {
    state.cards = state.cards.filter(c => c.id !== cardId);
    saveState();
    showToast("Card deleted.", "info");
    renderManagerView();
    renderDecksGrid();
  }
}

function deleteCurrentDeck() {
  const deckId = state.selectedManageDeckId;
  const deck = state.decks.find(d => d.id === deckId);
  if (!deck) return;

  if (confirm(`Are you sure you want to delete the deck "${deck.title}" and all its cards?`)) {
    state.decks = state.decks.filter(d => d.id !== deckId);
    state.cards = state.cards.filter(c => c.deckId !== deckId);
    state.selectedManageDeckId = state.decks.length > 0 ? state.decks[0].id : null;
    saveState();
    showToast("Deck deleted.", "info");
    renderManagerView();
    renderDecksGrid();
  }
}

// --- STATS VIEW & DATA MANAGEMENT ---
function updateStatsView() {
  const totalDecks = state.decks.length;
  const totalCards = state.cards.length;
  const masteredCards = state.cards.filter(c => c.status === "mastered").length;
  const masteryRate = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  DOM.statTotalDecks.textContent = totalDecks;
  DOM.statTotalCards.textContent = totalCards;
  DOM.statMasteredCards.textContent = masteredCards;
  DOM.statMasteryRate.textContent = `${masteryRate}%`;
}

function exportDataJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
    decks: state.decks,
    cards: state.cards
  }, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `flashlearn_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Backup JSON file exported!", "success");
}

function importDataJSON(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const imported = JSON.parse(evt.target.result);
      if (Array.isArray(imported.decks) && Array.isArray(imported.cards)) {
        state.decks = imported.decks;
        state.cards = imported.cards;
        saveState();
        showToast("Data imported successfully!", "success");
        renderDecksGrid();
        renderManagerView();
        updateStatsView();
      } else {
        showToast("Invalid JSON file format.", "error");
      }
    } catch (err) {
      showToast("Error parsing JSON file.", "error");
    }
  };
  reader.readAsText(file);
}

function resetSampleData() {
  if (confirm("Reset all decks and progress back to default sample data?")) {
    state.decks = [...DEFAULT_DECKS];
    state.cards = [...DEFAULT_CARDS];
    saveState();
    showToast("Reset to sample data completed.", "info");
    renderDecksGrid();
    renderManagerView();
    updateStatsView();
  }
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="${type === 'success' ? 'fa-solid fa-circle-check' : type === 'error' ? 'fa-solid fa-circle-xmark' : 'fa-solid fa-circle-info'}"></i>
    <span>${escapeHTML(message)}</span>
  `;
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// --- UTILITY ---
function escapeHTML(str) {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// --- EVENT LISTENERS REGISTRATION ---
function initEventListeners() {
  // Navigation
  DOM.navTabs.forEach(tab => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  DOM.btnLogo.addEventListener("click", () => switchTab("decks-view"));

  // Theme Toggle
  DOM.themeToggleBtn.addEventListener("click", () => {
    setTheme(state.theme === "light" ? "dark" : "light");
  });

  // Search & Filters
  DOM.deckSearchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderDecksGrid();
  });

  DOM.categoryFilters.addEventListener("click", (e) => {
    if (e.target.classList.contains("pill")) {
      DOM.categoryFilters.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      state.activeCategory = e.target.dataset.category;
      renderDecksGrid();
    }
  });

  // Study Mode Controls
  DOM.backToDecksBtn.addEventListener("click", () => switchTab("decks-view"));
  DOM.flashcardElement.addEventListener("click", flipCard);
  DOM.btnFlipCard.addEventListener("click", flipCard);
  DOM.btnNextCard.addEventListener("click", nextCard);
  DOM.btnPrevCard.addEventListener("click", prevCard);

  DOM.btnToggleHint.addEventListener("click", (e) => {
    e.stopPropagation();
    DOM.cardHintBox.classList.toggle("hidden");
  });

  DOM.btnShuffleDeck.addEventListener("click", () => {
    state.study.isShuffled = !state.study.isShuffled;
    DOM.btnShuffleDeck.classList.toggle("active", state.study.isShuffled);
    if (state.study.isShuffled) {
      state.study.cardsList.sort(() => Math.random() - 0.5);
      showToast("Cards shuffled!", "info");
    } else {
      state.study.cardsList = state.cards.filter(c => c.deckId === state.study.deckId);
    }
    state.study.currentIndex = 0;
    renderCurrentStudyCard();
  });

  DOM.btnRestartStudy.addEventListener("click", () => {
    state.study.currentIndex = 0;
    state.study.isFlipped = false;
    renderCurrentStudyCard();
    showToast("Study session restarted.", "info");
  });

  DOM.btnMarkLearning.addEventListener("click", () => setCardMasteryStatus("learning"));
  DOM.btnMarkMastered.addEventListener("click", () => setCardMasteryStatus("mastered"));

  DOM.btnSpeechFront.addEventListener("click", (e) => {
    e.stopPropagation();
    const currentCard = state.study.cardsList[state.study.currentIndex];
    if (currentCard) speakText(currentCard.question);
  });

  DOM.btnSpeechBack.addEventListener("click", (e) => {
    e.stopPropagation();
    const currentCard = state.study.cardsList[state.study.currentIndex];
    if (currentCard) speakText(currentCard.answer);
  });

  // Keyboard Shortcuts for Study Mode
  document.addEventListener("keydown", (e) => {
    // Only capture keyboard shortcuts when study view is active and no inputs are focused
    const isStudyActive = document.getElementById("study-view").classList.contains("active");
    const isModalOpen = !DOM.modalDeck.classList.contains("hidden") || !DOM.modalCard.classList.contains("hidden");
    const isInputFocused = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);

    if (isStudyActive && !isModalOpen && !isInputFocused) {
      if (e.code === "Space") {
        e.preventDefault();
        flipCard();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        nextCard();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        prevCard();
      } else if (e.key === "1") {
        e.preventDefault();
        setCardMasteryStatus("learning");
      } else if (e.key === "2") {
        e.preventDefault();
        setCardMasteryStatus("mastered");
      }
    }
  });

  // Manager View
  DOM.createDeckModalBtn.addEventListener("click", () => openDeckModal());
  DOM.btnAddCardModal.addEventListener("click", () => openCardModal());
  DOM.quickCreateBtn.addEventListener("click", () => openCardModal());

  DOM.btnEditCurrentDeck.addEventListener("click", () => {
    if (state.selectedManageDeckId) openDeckModal(state.selectedManageDeckId);
  });
  DOM.btnDeleteCurrentDeck.addEventListener("click", deleteCurrentDeck);

  // Close Modal Buttons
  document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.close;
      document.getElementById(modalId).classList.add("hidden");
    });
  });

  // Form Submissions
  DOM.formDeck.addEventListener("submit", handleSaveDeck);
  DOM.formCard.addEventListener("submit", handleSaveCard);

  // Data Actions
  DOM.btnExportJson.addEventListener("click", exportDataJSON);
  DOM.importJsonFile.addEventListener("change", importDataJSON);
  DOM.btnResetSampleData.addEventListener("click", resetSampleData);
}
