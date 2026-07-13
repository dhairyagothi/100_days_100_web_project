// Mock Default Decks Data
const DEFAULT_DECKS = [
    {
        id: "deck-js-basics",
        name: "JavaScript Basics",
        cards: [
            {
                id: "card-js-1",
                question: "What are the six primitive data types in JavaScript?",
                answer: "string, number, boolean, undefined, null, and symbol.",
                category: "Data Types",
                difficulty: "Medium",
                learned: false,
                starred: false,
                nextReview: 0
            },
            {
                id: "card-js-2",
                question: "What is the difference between 'let' and 'var'?",
                answer: "'var' is function-scoped and hoisted. 'let' is block-scoped and resides in a 'temporal dead zone' until declared.",
                category: "Variables",
                difficulty: "Medium",
                learned: false,
                starred: false,
                nextReview: 0
            },
            {
                id: "card-js-3",
                question: "What is the use of Promise.all()?",
                answer: "Promise.all() runs multiple promises concurrently and resolves when all resolve, or rejects when any promise fails.",
                category: "Asynchronous",
                difficulty: "Hard",
                learned: false,
                starred: false,
                nextReview: 0
            }
        ]
    },
    {
        id: "deck-css-layouts",
        name: "CSS Layouts",
        cards: [
            {
                id: "card-css-1",
                question: "What is the difference between flexbox and CSS Grid?",
                answer: "Flexbox is designed for one-dimensional layouts (rows OR columns). CSS Grid is built for two-dimensional layouts (rows AND columns).",
                category: "Grid & Flexbox",
                difficulty: "Medium",
                learned: false,
                starred: false,
                nextReview: 0
            },
            {
                id: "card-css-2",
                question: "What does the 'box-sizing: border-box' property do?",
                answer: "It includes padding and border in the element's total declared width and height, preventing content sizing extensions.",
                category: "Box Model",
                difficulty: "Easy",
                learned: false,
                starred: false,
                nextReview: 0
            }
        ]
    }
];

// App State Management
let state = {
    decks: [],
    currentDeckId: "",
    currentView: "study",
    studyIndex: 0,
    studyQueue: [],
    theme: "light",
    quiz: {
        isActive: false,
        cards: [],
        currentIndex: 0,
        correctCount: 0,
        incorrectCount: 0,
        timerSeconds: 15,
        timerMax: 15,
        timerInterval: null,
        durationSettings: "none",
        shuffleEnabled: true,
        difficultOnly: false,
        missedCards: []
    },
    activeEditCardId: null
};

// Safe LocalStorage helper
function loadStateFromStorage() {
    try {
        state.theme = localStorage.getItem("ff_theme") || "light";
        const storedDecks = localStorage.getItem("ff_decks");
        if (storedDecks) {
            state.decks = JSON.parse(storedDecks);
        } else {
            state.decks = DEFAULT_DECKS;
            saveDecksToStorage();
        }
        
        // Pick first deck as active
        if (state.decks.length > 0) {
            state.currentDeckId = state.decks[0].id;
        }
    } catch (e) {
        console.warn("Failed to load local storage data.", e);
        state.decks = DEFAULT_DECKS;
        state.currentDeckId = state.decks[0].id;
    }
}

function saveDecksToStorage() {
    try {
        localStorage.setItem("ff_decks", JSON.stringify(state.decks));
    } catch (e) {
        console.warn("Failed to save decks data.", e);
    }
}

function saveThemeToStorage() {
    try {
        localStorage.setItem("ff_theme", state.theme);
    } catch (e) {
        console.warn("Failed to save theme data.", e);
    }
}

// DOM Initialization
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    initTheme();
    initViewSwitching();
    initDecksManager();
    initStudyControls();
    initQuizControls();
    initManageTabControls();
    initAiGenerator();
    initImportExport();
    
    // Initial Render
    renderSidebarDecks();
    switchActiveDeck(state.currentDeckId);
    updateDecksProgressStats();
});

// Theme Management
function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    if (!themeBtn) return;

    // Set initial theme
    document.documentElement.setAttribute("data-theme", state.theme);
    updateThemeUI();

    themeBtn.addEventListener("click", () => {
        state.theme = state.theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", state.theme);
        saveThemeToStorage();
        updateThemeUI();
        showToast(`Theme switched to ${state.theme} mode`, "info");
    });
}

function updateThemeUI() {
    const themeBtn = document.getElementById("theme-toggle");
    if (!themeBtn) return;
    const icon = themeBtn.querySelector("i");
    const text = themeBtn.querySelector("span");

    if (state.theme === "dark") {
        icon.className = "fa-solid fa-sun";
        text.textContent = "Light Mode";
    } else {
        icon.className = "fa-solid fa-moon";
        text.textContent = "Dark Mode";
    }
}

// View Controller Switching
function initViewSwitching() {
    const menuItems = document.querySelectorAll(".sidebar-menu li[data-view]");
    menuItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const viewName = item.getAttribute("data-view");
            switchView(viewName);
        });
    });

    const mobileToggle = document.getElementById("mobile-toggle");
    const sidebar = document.querySelector(".sidebar");
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener("click", () => {
            sidebar.classList.toggle("mobile-open");
        });
    }
}

function switchView(viewName) {
    state.currentView = viewName;
    
    // Toggle active sidebar link
    document.querySelectorAll(".sidebar-menu li[data-view]").forEach(li => {
        if (li.getAttribute("data-view") === viewName) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    });

    // Toggle view sections
    document.querySelectorAll(".view-section").forEach(sec => {
        sec.classList.remove("active");
    });

    const targetSec = document.getElementById(`${viewName}-view`);
    if (targetSec) targetSec.classList.add("active");

    // Close sidebar on mobile
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) sidebar.classList.remove("mobile-open");

    // Reset Quiz if leaving Quiz Arena
    if (viewName !== "quiz" && state.quiz.isActive) {
        quitQuiz();
    }

    // Refresh view states
    if (viewName === "study") {
        buildStudyQueue();
        renderStudyCard();
    } else if (viewName === "manage") {
        renderManageDeckTable();
        populateCategoryFilter();
    } else if (viewName === "ai-gen") {
        populateAiDecksDropdown();
    }
}

// Decks sidebar selection & deck creation
function initDecksManager() {
    const createDeckTrigger = document.getElementById("create-deck-btn-trigger");
    const deckModal = document.getElementById("deck-modal");
    const deckModalClose = document.getElementById("deck-modal-close");
    const deckModalCancel = document.getElementById("deck-modal-cancel");
    const deckModalSubmit = document.getElementById("deck-modal-submit-btn");
    const newDeckNameInput = document.getElementById("new-deck-name");

    // Open creation modal
    if (createDeckTrigger && deckModal) {
        createDeckTrigger.addEventListener("click", () => {
            deckModal.classList.add("active");
            if (newDeckNameInput) {
                newDeckNameInput.value = "";
                newDeckNameInput.focus();
            }
        });
    }

    // Close modal handlers
    const closeModal = () => {
        if (deckModal) deckModal.classList.remove("active");
    };
    if (deckModalClose) deckModalClose.addEventListener("click", closeModal);
    if (deckModalCancel) deckModalCancel.addEventListener("click", closeModal);

    // Create Deck execution
    if (deckModalSubmit && newDeckNameInput) {
        deckModalSubmit.addEventListener("click", () => {
            const name = newDeckNameInput.value.trim();
            if (!name) {
                showToast("Please enter a deck name.", "danger");
                return;
            }

            const deckId = `deck-${Date.now()}`;
            const newDeck = {
                id: deckId,
                name: name,
                cards: []
            };

            state.decks.push(newDeck);
            saveDecksToStorage();
            renderSidebarDecks();
            closeModal();
            showToast(`Deck '${name}' created successfully!`, "success");
            switchActiveDeck(deckId);
        });
    }
}

function renderSidebarDecks() {
    const list = document.getElementById("sidebar-decks-list");
    if (!list) return;

    list.innerHTML = "";
    
    state.decks.forEach(deck => {
        const item = document.createElement("li");
        item.className = `deck-item-wrapper ${deck.id === state.currentDeckId ? "active" : ""}`;
        item.innerHTML = `
            <span>${deck.name}</span>
            <span class="deck-count-pill">${deck.cards.length}</span>
        `;

        item.addEventListener("click", (e) => {
            e.preventDefault();
            switchActiveDeck(deck.id);
        });

        list.appendChild(item);
    });
}

function switchActiveDeck(deckId) {
    state.currentDeckId = deckId;
    renderSidebarDecks();

    const currentDeck = state.decks.find(d => d.id === deckId);
    if (!currentDeck) return;

    // Update headers
    const headerName = document.getElementById("header-deck-name");
    const headerCount = document.getElementById("header-deck-count");
    if (headerName) headerName.textContent = currentDeck.name;
    if (headerCount) headerCount.textContent = `${currentDeck.cards.length} Cards total`;

    // Reset views indexes
    state.studyIndex = 0;
    
    // Re-build queues
    buildStudyQueue();
    
    // Render current active view contents
    if (state.currentView === "study") {
        renderStudyCard();
    } else if (state.currentView === "manage") {
        renderManageDeckTable();
        populateCategoryFilter();
    } else if (state.currentView === "quiz") {
        // Exit active quiz if changing deck during quiz
        if (state.quiz.isActive) quitQuiz();
    }
}

function updateDecksProgressStats() {
    const overallProgress = document.getElementById("overall-progress-bar");
    const learnedLabel = document.getElementById("stats-learned-count");
    const accuracyLabel = document.getElementById("stats-accuracy-percent");

    let totalCards = 0;
    let learnedCards = 0;

    state.decks.forEach(deck => {
        totalCards += deck.cards.length;
        learnedCards += deck.cards.filter(c => c.learned).length;
    });

    if (overallProgress && learnedLabel) {
        if (totalCards === 0) {
            overallProgress.style.width = "0%";
            learnedLabel.textContent = "0/0 Cards";
        } else {
            const percent = Math.round((learnedCards / totalCards) * 100);
            overallProgress.style.width = `${percent}%`;
            learnedLabel.textContent = `${learnedCards}/${totalCards} Cards`;
        }
    }

    // Diagnostic Quiz statistics accuracy averages
    // Just a placeholder calculation representing quiz performances
    if (accuracyLabel) {
        accuracyLabel.textContent = "100% Streak";
    }
}

// STUDY MODE FUNCTIONS
function initStudyControls() {
    const cardEl = document.getElementById("study-flashcard");
    const flipBtn = document.getElementById("flip-card-btn");
    const prevBtn = document.getElementById("prev-card-btn");
    const nextBtn = document.getElementById("next-card-btn");
    const markLearnedBtn = document.getElementById("mark-learned-btn");
    const markDifficultBtn = document.getElementById("mark-difficult-btn");
    const shuffleBtn = document.getElementById("shuffle-study-btn");

    // SRS Ratings actions
    const srsBtns = document.querySelectorAll(".srs-btn");

    const flipCard = () => {
        if (cardEl && state.studyQueue.length > 0) {
            cardEl.classList.toggle("flipped");
        }
    };

    // Flip Card triggers
    if (cardEl) cardEl.addEventListener("click", flipCard);
    if (flipBtn) flipBtn.addEventListener("click", flipCard);

    // Navigations triggers
    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            navigateStudyCard(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            navigateStudyCard(1);
        });
    }

    // Star/Difficult review trigger
    if (markDifficultBtn) {
        markDifficultBtn.addEventListener("click", () => {
            toggleDifficultStatus();
        });
    }

    // Mark learned trigger
    if (markLearnedBtn) {
        markLearnedBtn.addEventListener("click", () => {
            toggleLearnedStatus();
        });
    }

    // Shuffle trigger
    if (shuffleBtn) {
        shuffleBtn.addEventListener("click", () => {
            shuffleStudyQueue();
        });
    }

    // Spaced repetition scheduler triggers
    srsBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid double flipping card
            const level = btn.getAttribute("data-id") || btn.getAttribute("data-level");
            handleSpacedRepetition(level);
        });
    });

    // Global Key Bindings (Space for flip, arrows for nav)
    document.addEventListener("keydown", (e) => {
        if (state.currentView !== "study" || state.decks.length === 0) return;
        
        // Don't trigger if user is typing in forms/inputs
        const activeNode = document.activeElement.tagName;
        if (activeNode === "INPUT" || activeNode === "TEXTAREA" || activeNode === "SELECT") return;

        if (e.code === "Space") {
            e.preventDefault();
            flipCard();
        } else if (e.code === "ArrowLeft") {
            navigateStudyCard(-1);
        } else if (e.code === "ArrowRight") {
            navigateStudyCard(1);
        }
    });
}

function buildStudyQueue() {
    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck || currentDeck.cards.length === 0) {
        state.studyQueue = [];
        return;
    }

    // Setup an index queue
    state.studyQueue = currentDeck.cards.map((c, i) => i);
    state.studyIndex = Math.min(state.studyIndex, state.studyQueue.length - 1);
}

function shuffleStudyQueue() {
    if (state.studyQueue.length <= 1) return;
    
    // Fisher-Yates shuffle algorithm
    for (let i = state.studyQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [state.studyQueue[i], state.studyQueue[j]] = [state.studyQueue[j], state.studyQueue[i]];
    }
    
    state.studyIndex = 0;
    renderStudyCard();
    showToast("Study cards shuffled!", "info");
}

function renderStudyCard() {
    const cardEl = document.getElementById("study-flashcard");
    const qEl = document.getElementById("study-card-question");
    const aEl = document.getElementById("study-card-answer");
    const catEl = document.getElementById("study-card-category");
    const diffBadge = document.getElementById("study-difficulty-badge");
    const curIdxLabel = document.getElementById("study-current-index");
    const totalLabel = document.getElementById("study-total-cards");
    const progressBar = document.getElementById("study-progress-bar");
    const markLearnedBtn = document.getElementById("mark-learned-btn");

    if (cardEl) cardEl.classList.remove("flipped"); // Ensure front face is shown

    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    
    if (!currentDeck || currentDeck.cards.length === 0 || state.studyQueue.length === 0) {
        if (qEl) qEl.textContent = "Deck is empty. Create a card to start!";
        if (aEl) aEl.textContent = "No answer available.";
        if (catEl) catEl.textContent = "Empty";
        if (diffBadge) diffBadge.style.display = "none";
        if (curIdxLabel) curIdxLabel.textContent = "0";
        if (totalLabel) totalLabel.textContent = "0";
        if (progressBar) progressBar.style.width = "0%";
        return;
    }

    if (diffBadge) diffBadge.style.display = "inline-block";

    const cardRealIndex = state.studyQueue[state.studyIndex];
    const card = currentDeck.cards[cardRealIndex];

    if (!card) return;

    // Render contents
    if (qEl) qEl.textContent = card.question;
    if (aEl) aEl.textContent = card.answer;
    if (catEl) catEl.textContent = card.category || "General";
    
    // Difficulty labels
    if (diffBadge) {
        diffBadge.textContent = card.difficulty || "Medium";
        diffBadge.className = `badge ${card.difficulty ? card.difficulty.toLowerCase() : "medium"}`;
    }

    // Index tracking labels
    if (curIdxLabel) curIdxLabel.textContent = state.studyIndex + 1;
    if (totalLabel) totalLabel.textContent = state.studyQueue.length;

    // Progress bar fill
    if (progressBar) {
        const percent = Math.round(((state.studyIndex + 1) / state.studyQueue.length) * 100);
        progressBar.style.width = `${percent}%`;
    }

    // Toggle checkmark icon in learned buttons
    if (markLearnedBtn) {
        const icon = markLearnedBtn.querySelector("i");
        if (card.learned) {
            markLearnedBtn.className = "btn btn-sm btn-success";
            icon.className = "fa-solid fa-circle-check";
        } else {
            markLearnedBtn.className = "btn btn-sm btn-outline";
            icon.className = "fa-regular fa-circle-check";
        }
    }

    // Difficult button star toggle highlights
    const markDifficultBtn = document.getElementById("mark-difficult-btn");
    if (markDifficultBtn) {
        const icon = markDifficultBtn.querySelector("i");
        if (card.starred) {
            markDifficultBtn.className = "btn btn-sm btn-outline text-warning active-starred";
            icon.className = "fa-solid fa-star";
        } else {
            markDifficultBtn.className = "btn btn-sm btn-outline text-warning";
            icon.className = "fa-regular fa-star";
        }
    }
}

function navigateStudyCard(direction) {
    if (state.studyQueue.length <= 1) return;
    
    state.studyIndex += direction;

    // Loop bounds wrap
    if (state.studyIndex < 0) {
        state.studyIndex = state.studyQueue.length - 1;
    } else if (state.studyIndex >= state.studyQueue.length) {
        state.studyIndex = 0;
    }

    renderStudyCard();
}

function toggleLearnedStatus() {
    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck || currentDeck.cards.length === 0) return;

    const cardRealIndex = state.studyQueue[state.studyIndex];
    const card = currentDeck.cards[cardRealIndex];

    card.learned = !card.learned;
    saveDecksToStorage();
    renderStudyCard();
    updateDecksProgressStats();

    showToast(card.learned ? "Card marked as Learned!" : "Card marked as Unlearned", card.learned ? "success" : "info");
}

function toggleDifficultStatus() {
    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck || currentDeck.cards.length === 0) return;

    const cardRealIndex = state.studyQueue[state.studyIndex];
    const card = currentDeck.cards[cardRealIndex];

    card.starred = !card.starred;
    saveDecksToStorage();
    renderStudyCard();

    showToast(card.starred ? "Added to Difficult reviews list!" : "Removed from Difficult list", "info");
}

function handleSpacedRepetition(level) {
    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck || currentDeck.cards.length === 0) return;

    const cardRealIndex = state.studyQueue[state.studyIndex];
    const card = currentDeck.cards[cardRealIndex];

    let days = 1;
    if (level === "medium") days = 2;
    if (level === "easy") days = 4;

    const reviewTime = Date.now() + (days * 24 * 60 * 60 * 1000);
    card.nextReview = reviewTime;

    saveDecksToStorage();
    showToast(`Scheduled review in ${days} day${days > 1 ? "s" : ""}`, "info");

    // Smooth flip back before going next
    const cardEl = document.getElementById("study-flashcard");
    if (cardEl) {
        cardEl.classList.remove("flipped");
        setTimeout(() => {
            navigateStudyCard(1);
        }, 300);
    } else {
        navigateStudyCard(1);
    }
}

// QUIZ ARENA FLOW ENGINE
function initQuizControls() {
    const startBtn = document.getElementById("start-quiz-btn");
    const quitBtn = document.getElementById("quit-quiz-btn");
    const retryBtn = document.getElementById("quiz-retry-btn");
    const finishBtn = document.getElementById("quiz-finish-btn");
    const revealQuizBtn = document.getElementById("show-answer-quiz-btn");
    const correctBtn = document.getElementById("quiz-btn-correct");
    const incorrectBtn = document.getElementById("quiz-btn-incorrect");
    const quizCardEl = document.getElementById("quiz-flashcard");

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            setupAndStartQuiz();
        });
    }

    if (quitBtn) {
        quitBtn.addEventListener("click", () => {
            quitQuiz();
        });
    }

    if (retryBtn) {
        retryBtn.addEventListener("click", () => {
            setupAndStartQuiz();
        });
    }

    if (finishBtn) {
        finishBtn.addEventListener("click", () => {
            state.quiz.isActive = false;
            document.getElementById("quiz-results-panel").classList.remove("active");
            document.getElementById("quiz-setup-panel").classList.add("active");
            switchView("study");
        });
    }

    // Reveal answer during quiz
    const revealQuizCard = () => {
        if (quizCardEl) quizCardEl.classList.add("flipped");
        // Clear countdown timer once revealed
        if (state.quiz.timerInterval) {
            clearInterval(state.quiz.timerInterval);
            state.quiz.timerInterval = null;
        }
    };
    if (revealQuizBtn) revealQuizBtn.addEventListener("click", revealQuizCard);
    if (quizCardEl) quizCardEl.addEventListener("click", revealQuizCard);

    // Assess grading keys
    if (correctBtn) {
        correctBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            recordQuizGrade(true);
        });
    }

    if (incorrectBtn) {
        incorrectBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            recordQuizGrade(false);
        });
    }
}

function setupAndStartQuiz() {
    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck || currentDeck.cards.length === 0) {
        showToast("Create flashcards before starting the quiz!", "danger");
        return;
    }

    // Read form options
    const timerSelect = document.getElementById("quiz-timer-select");
    const shuffleCheck = document.getElementById("quiz-shuffle-check");
    const diffCheck = document.getElementById("quiz-difficult-only");

    state.quiz.durationSettings = timerSelect ? timerSelect.value : "none";
    state.quiz.shuffleEnabled = shuffleCheck ? shuffleCheck.checked : true;
    state.quiz.difficultOnly = diffCheck ? diffCheck.checked : false;

    // Filter deck cards
    let quizCards = [...currentDeck.cards];
    if (state.quiz.difficultOnly) {
        quizCards = quizCards.filter(c => c.starred);
    }

    if (quizCards.length === 0) {
        showToast("No cards matched selection filters (e.g. starred list is empty).", "warning");
        return;
    }

    // Shuffle questions
    if (state.quiz.shuffleEnabled) {
        for (let i = quizCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [quizCards[i], quizCards[j]] = [quizCards[j], quizCards[i]];
        }
    }

    // Hydrate quiz states
    state.quiz.isActive = true;
    state.quiz.cards = quizCards;
    state.quiz.currentIndex = 0;
    state.quiz.correctCount = 0;
    state.quiz.incorrectCount = 0;
    state.quiz.missedCards = [];

    // Swap Panel views
    document.getElementById("quiz-setup-panel").classList.remove("active");
    document.getElementById("quiz-results-panel").classList.remove("active");
    document.getElementById("quiz-play-panel").classList.add("active");

    renderQuizCard();
}

function quitQuiz() {
    // Reset timer
    if (state.quiz.timerInterval) {
        clearInterval(state.quiz.timerInterval);
        state.quiz.timerInterval = null;
    }
    
    state.quiz.isActive = false;
    document.getElementById("quiz-play-panel").classList.remove("active");
    document.getElementById("quiz-results-panel").classList.remove("active");
    document.getElementById("quiz-setup-panel").classList.add("active");
}

function renderQuizCard() {
    const quizCardEl = document.getElementById("quiz-flashcard");
    const qEl = document.getElementById("quiz-card-question");
    const aEl = document.getElementById("quiz-card-answer");
    const catEl = document.getElementById("quiz-card-category");
    
    const curLabel = document.getElementById("quiz-current-question");
    const totLabel = document.getElementById("quiz-total-questions");
    const correctLabel = document.getElementById("quiz-correct-count");
    const incorrectLabel = document.getElementById("quiz-incorrect-count");

    if (quizCardEl) quizCardEl.classList.remove("flipped");

    const card = state.quiz.cards[state.quiz.currentIndex];

    // Populate data
    if (qEl) qEl.textContent = card.question;
    if (aEl) aEl.textContent = card.answer;
    if (catEl) catEl.textContent = card.category || "Quiz";

    // Text metrics
    if (curLabel) curLabel.textContent = state.quiz.currentIndex + 1;
    if (totLabel) totLabel.textContent = state.quiz.cards.length;
    if (correctLabel) correctLabel.textContent = state.quiz.correctCount;
    if (incorrectLabel) incorrectLabel.textContent = state.quiz.incorrectCount;

    // Countdown timer setup
    const timerDisplay = document.getElementById("quiz-timer-display");
    const timerBar = document.getElementById("quiz-timer-bar-container");
    const timerBarFill = document.getElementById("quiz-timer-bar-fill");
    const secondsLabel = document.getElementById("timer-seconds");

    if (state.quiz.timerInterval) {
        clearInterval(state.quiz.timerInterval);
        state.quiz.timerInterval = null;
    }

    if (state.quiz.durationSettings !== "none") {
        const secs = parseInt(state.quiz.durationSettings);
        state.quiz.timerSeconds = secs;
        state.quiz.timerMax = secs;

        if (timerDisplay) timerDisplay.style.display = "block";
        if (timerBar) timerBar.style.display = "block";
        if (secondsLabel) secondsLabel.textContent = `${secs}s`;
        if (timerBarFill) timerBarFill.style.width = "100%";

        state.quiz.timerInterval = setInterval(() => {
            state.quiz.timerSeconds--;
            if (secondsLabel) secondsLabel.textContent = `${state.quiz.timerSeconds}s`;
            if (timerBarFill) {
                const percent = (state.quiz.timerSeconds / state.quiz.timerMax) * 100;
                timerBarFill.style.width = `${percent}%`;
            }

            if (state.quiz.timerSeconds <= 0) {
                clearInterval(state.quiz.timerInterval);
                state.quiz.timerInterval = null;
                showToast("Time ran out! Show answer.", "warning");
                // Reveal answer card automatically
                if (quizCardEl) quizCardEl.classList.add("flipped");
            }
        }, 1000);
    } else {
        if (timerDisplay) timerDisplay.style.display = "none";
        if (timerBar) timerBar.style.display = "none";
    }
}

function recordQuizGrade(isCorrect) {
    const card = state.quiz.cards[state.quiz.currentIndex];
    
    if (isCorrect) {
        state.quiz.correctCount++;
    } else {
        state.quiz.incorrectCount++;
        state.quiz.missedCards.push(card);
    }

    // Advance quiz index or close
    state.quiz.currentIndex++;
    if (state.quiz.currentIndex < state.quiz.cards.length) {
        renderQuizCard();
    } else {
        finishQuizSession();
    }
}

function finishQuizSession() {
    if (state.quiz.timerInterval) {
        clearInterval(state.quiz.timerInterval);
        state.quiz.timerInterval = null;
    }

    // Toggle panels
    document.getElementById("quiz-play-panel").classList.remove("active");
    document.getElementById("quiz-results-panel").classList.add("active");

    // Populate scoreboard
    const accuracyPercent = document.getElementById("results-score-percent");
    const correctCount = document.getElementById("results-correct-lbl");
    const incorrectCount = document.getElementById("results-incorrect-lbl");

    const total = state.quiz.cards.length;
    const accuracy = total === 0 ? 0 : Math.round((state.quiz.correctCount / total) * 100);

    if (accuracyPercent) accuracyPercent.textContent = `${accuracy}%`;
    if (correctCount) correctCount.textContent = state.quiz.correctCount;
    if (incorrectCount) incorrectCount.textContent = state.quiz.incorrectCount;

    // Render missed cards review panel
    const missedPanel = document.getElementById("review-missed-panel");
    const missedList = document.getElementById("results-missed-list");

    if (state.quiz.missedCards.length > 0) {
        if (missedPanel) missedPanel.style.display = "block";
        if (missedList) {
            missedList.innerHTML = "";
            state.quiz.missedCards.forEach(card => {
                const item = document.createElement("li");
                item.className = "missed-question-item";
                item.innerHTML = `
                    <span class="missed-q">Q: ${card.question}</span>
                    <span class="missed-a">A: ${card.answer}</span>
                `;
                missedList.appendChild(item);
            });
        }
    } else {
        if (missedPanel) missedPanel.style.display = "none";
    }

    // Star difficult updates automatically if accuracy is poor
    state.quiz.missedCards.forEach(card => {
        card.starred = true; // Auto-star missed cards
    });
    saveDecksToStorage();
    updateDecksProgressStats();
}

// MANAGE CARDS VIEW AND EDITOR FORM
function initManageTabControls() {
    const searchInput = document.getElementById("manage-search");
    const catFilter = document.getElementById("manage-category-filter");
    const deleteDeckBtn = document.getElementById("delete-deck-btn");

    // Modal elements
    const addCardBtn = document.getElementById("add-card-btn-trigger");
    const cardModal = document.getElementById("card-modal");
    const cardModalClose = document.getElementById("card-modal-close");
    const cardModalCancel = document.getElementById("card-modal-cancel");
    const cardModalSubmit = document.getElementById("card-modal-submit-btn");

    // Bind Search Input
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            renderManageDeckTable();
        });
    }

    // Bind Category filter dropdown change
    if (catFilter) {
        catFilter.addEventListener("change", () => {
            renderManageDeckTable();
        });
    }

    // Delete Deck triggers
    if (deleteDeckBtn) {
        deleteDeckBtn.addEventListener("click", () => {
            deleteCurrentActiveDeck();
        });
    }

    // Card edit form bindings
    if (addCardBtn) {
        addCardBtn.addEventListener("click", () => {
            openCardModal();
        });
    }

    const closeCardModal = () => {
        if (cardModal) cardModal.classList.remove("active");
    };
    if (cardModalClose) cardModalClose.addEventListener("click", closeCardModal);
    if (cardModalCancel) cardModalCancel.addEventListener("click", closeCardModal);

    // Save/Update Card submit trigger
    if (cardModalSubmit) {
        cardModalSubmit.addEventListener("click", () => {
            submitCardForm();
        });
    }
}

function populateCategoryFilter() {
    const catFilter = document.getElementById("manage-category-filter");
    if (!catFilter) return;

    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck) return;

    // Collect unique category tags
    const categories = new Set();
    currentDeck.cards.forEach(card => {
        if (card.category) categories.add(card.category.trim());
    });

    catFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        catFilter.appendChild(opt);
    });
}

function renderManageDeckTable() {
    const tableBody = document.getElementById("cards-table-body");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck || currentDeck.cards.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center" style="text-align: center; color: var(--text-muted); padding: 40px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 32px; display: block; margin-bottom: 12px;"></i>
                    No flashcards found in this deck. Add some cards above or generate with AI!
                </td>
            </tr>
        `;
        return;
    }

    const searchQuery = document.getElementById("manage-search").value.toLowerCase().trim();
    const categoryQuery = document.getElementById("manage-category-filter").value;

    const filteredCards = currentDeck.cards.filter(card => {
        const matchesSearch = card.question.toLowerCase().includes(searchQuery) ||
                              card.answer.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryQuery === "all" || card.category === categoryQuery;
        return matchesSearch && matchesCategory;
    });

    if (filteredCards.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    No cards matched search query filters.
                </td>
            </tr>
        `;
        return;
    }

    filteredCards.forEach(card => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><div class="cell-content-limited" title="${card.question}">${card.question}</div></td>
            <td><div class="cell-content-limited" title="${card.answer}">${card.answer}</div></td>
            <td><span class="card-tag" style="padding: 4px 10px; font-size: 11px;">${card.category || "General"}</span></td>
            <td><span class="badge ${card.difficulty.toLowerCase()}">${card.difficulty}</span></td>
            <td>
                <span class="badge" style="background-color: ${card.learned ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)'}; color: ${card.learned ? 'var(--success-color)' : 'var(--secondary-color)'}">
                    ${card.learned ? "Learned" : "New"}
                </span>
            </td>
            <td>
                <div class="card-action-btns">
                    <button class="btn-icon-sm edit-card-btn" data-id="${card.id}" title="Edit Card"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="btn-icon-sm delete delete-card-btn" data-id="${card.id}" title="Delete Card"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </td>
        `;

        // Bind Row actions
        row.querySelector(".edit-card-btn").addEventListener("click", () => {
            openCardModal(card.id);
        });

        row.querySelector(".delete-card-btn").addEventListener("click", () => {
            deleteCardItem(card.id);
        });

        tableBody.appendChild(row);
    });
}

function openCardModal(cardId = null) {
    const cardModal = document.getElementById("card-modal");
    if (!cardModal) return;

    // Setup deck options in form dropdown selector
    const deckSelect = document.getElementById("card-deck-select");
    if (deckSelect) {
        deckSelect.innerHTML = "";
        state.decks.forEach(d => {
            const opt = document.createElement("option");
            opt.value = d.id;
            opt.textContent = d.name;
            deckSelect.appendChild(opt);
        });
        deckSelect.value = state.currentDeckId;
    }

    const titleEl = document.getElementById("card-modal-title");
    const qInput = document.getElementById("card-question");
    const aInput = document.getElementById("card-answer");
    const catInput = document.getElementById("card-category");
    const diffSelect = document.getElementById("card-difficulty");

    if (cardId) {
        // Edit mode configuration
        state.activeEditCardId = cardId;
        if (titleEl) titleEl.textContent = "Edit Flashcard";
        
        const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
        const card = currentDeck.cards.find(c => c.id === cardId);

        if (card) {
            if (qInput) qInput.value = card.question;
            if (aInput) aInput.value = card.answer;
            if (catInput) catInput.value = card.category || "";
            if (diffSelect) diffSelect.value = card.difficulty || "Medium";
        }
    } else {
        // Create mode configuration
        state.activeEditCardId = null;
        if (titleEl) titleEl.textContent = "Create Flashcard";
        if (qInput) qInput.value = "";
        if (aInput) aInput.value = "";
        if (catInput) catInput.value = "";
        if (diffSelect) diffSelect.value = "Medium";
    }

    cardModal.classList.add("active");
}

function submitCardForm() {
    const deckSelect = document.getElementById("card-deck-select");
    const qInput = document.getElementById("card-question");
    const aInput = document.getElementById("card-answer");
    const catInput = document.getElementById("card-category");
    const diffSelect = document.getElementById("card-difficulty");

    const targetDeckId = deckSelect.value;
    const question = qInput.value.trim();
    const answer = aInput.value.trim();
    const category = catInput.value.trim() || "General";
    const difficulty = diffSelect.value;

    if (!question || !answer) {
        showToast("Please fill in both Question and Answer fields.", "danger");
        return;
    }

    const targetDeck = state.decks.find(d => d.id === targetDeckId);
    if (!targetDeck) return;

    if (state.activeEditCardId) {
        // Edit card workflow
        const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
        const cardIndex = currentDeck.cards.findIndex(c => c.id === state.activeEditCardId);

        if (cardIndex !== -1) {
            const updatedCard = {
                ...currentDeck.cards[cardIndex],
                question: question,
                answer: answer,
                category: category,
                difficulty: difficulty
            };

            // If deck changed
            if (state.currentDeckId !== targetDeckId) {
                currentDeck.cards.splice(cardIndex, 1);
                targetDeck.cards.push(updatedCard);
                showToast("Card moved to target deck!", "success");
            } else {
                currentDeck.cards[cardIndex] = updatedCard;
                showToast("Card updated successfully!", "success");
            }
        }
    } else {
        // Create card workflow
        const newCard = {
            id: `card-${Date.now()}`,
            question: question,
            answer: answer,
            category: category,
            difficulty: difficulty,
            learned: false,
            starred: false,
            nextReview: 0
        };

        targetDeck.cards.push(newCard);
        showToast("New Flashcard added!", "success");
    }

    saveDecksToStorage();
    document.getElementById("card-modal").classList.remove("active");
    
    // Switch to target deck view
    if (state.currentDeckId !== targetDeckId) {
        switchActiveDeck(targetDeckId);
    } else {
        switchActiveDeck(state.currentDeckId);
    }
    updateDecksProgressStats();
}

function deleteCardItem(cardId) {
    if (!confirm("Are you sure you want to delete this flashcard?")) return;

    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck) return;

    currentDeck.cards = currentDeck.cards.filter(c => c.id !== cardId);
    saveDecksToStorage();
    
    switchActiveDeck(state.currentDeckId);
    updateDecksProgressStats();
    showToast("Flashcard deleted successfully.", "info");
}

function deleteCurrentActiveDeck() {
    if (state.decks.length <= 1) {
        showToast("You must keep at least one deck in your workspace.", "warning");
        return;
    }

    const currentDeck = state.decks.find(d => d.id === state.currentDeckId);
    if (!currentDeck) return;

    if (!confirm(`Are you sure you want to delete the entire deck '${currentDeck.name}'? This will erase all its ${currentDeck.cards.length} cards.`)) return;

    state.decks = state.decks.filter(d => d.id !== state.currentDeckId);
    saveDecksToStorage();

    showToast(`Deck '${currentDeck.name}' deleted.`, "info");
    
    // Switch active deck to first available
    switchActiveDeck(state.decks[0].id);
    updateDecksProgressStats();
}

// AI GENERATOR PIPELINE SIMULATION
function initAiGenerator() {
    const countSlider = document.getElementById("ai-card-count");
    const countLabel = document.getElementById("ai-slider-value");
    const generateBtn = document.getElementById("generate-ai-cards-btn");

    if (countSlider && countLabel) {
        countSlider.addEventListener("input", () => {
            countLabel.textContent = `${countSlider.value} Cards`;
        });
    }

    if (generateBtn) {
        generateBtn.addEventListener("click", () => {
            triggerAiGeneration();
        });
    }
}

function populateAiDecksDropdown() {
    const select = document.getElementById("ai-target-deck");
    if (!select) return;

    select.innerHTML = "";
    state.decks.forEach(d => {
        const opt = document.createElement("option");
        opt.value = d.id;
        opt.textContent = d.name;
        select.appendChild(opt);
    });

    select.value = state.currentDeckId;
}

function triggerAiGeneration() {
    const notesArea = document.getElementById("ai-notes-input");
    const cardCount = parseInt(document.getElementById("ai-card-count").value);
    const targetDeckId = document.getElementById("ai-target-deck").value;

    const notesText = notesArea ? notesArea.value.trim() : "";

    if (!notesText || notesText.length < 20) {
        showToast("Please enter at least some study material notes for AI extraction.", "danger");
        return;
    }

    // Toggle loading screen overlay
    const loader = document.getElementById("ai-loader-overlay");
    if (loader) loader.style.display = "flex";

    // Simulate AI extraction timing delays
    setTimeout(() => {
        const extractedCards = extractCardsFromTextNotes(notesText, cardCount);
        
        const targetDeck = state.decks.find(d => d.id === targetDeckId);
        if (targetDeck) {
            extractedCards.forEach(card => {
                targetDeck.cards.push(card);
            });
            saveDecksToStorage();
        }

        if (loader) loader.style.display = "none";
        
        // Reset notes text area input
        if (notesArea) notesArea.value = "";

        showToast(`AI successfully generated ${extractedCards.length} flashcards!`, "success");
        
        // Open management panel
        switchActiveDeck(targetDeckId);
        switchView("manage");
        updateDecksProgressStats();
    }, 2000);
}

function extractCardsFromTextNotes(text, limit) {
    const cards = [];
    
    // Simplistic NLP Parsing logic:
    // Look for definitions patterns like:
    // "Term - definition" or "Term: definition" or "Term is definition" or "Term stands for definition"
    // Also splits by sentences to make sure we isolate statements.
    const sentences = text.split(/[.!?]\s+/);
    
    const patterns = [
        { regex: /([^:]+)\s*:\s*(.+)/i, qType: "definition" },
        { regex: /([^\-]+)\s*\-\s*(.+)/i, qType: "definition" },
        { regex: /(.+?)\s+is\s+defined\s+as\s+(.+)/i, qType: "definition" },
        { regex: /(.+?)\s+stands\s+for\s+(.+)/i, qType: "standsFor" },
        { regex: /(.+?)\s+refers\s+to\s+(.+)/i, qType: "definition" }
    ];

    for (let sentence of sentences) {
        if (cards.length >= limit) break;
        
        sentence = sentence.trim();
        if (sentence.length < 15) continue;

        let matched = false;

        for (const pat of patterns) {
            const match = sentence.match(pat.regex);
            if (match && match[1] && match[2]) {
                const term = match[1].trim();
                const definition = match[2].trim();

                // Validation boundaries
                if (term.length > 2 && term.length < 40 && definition.length > 5) {
                    let question = "";
                    if (pat.qType === "standsFor") {
                        question = `What does '${term}' stand for?`;
                    } else {
                        question = `What is the definition of '${term}'?`;
                    }

                    cards.push({
                        id: `card-ai-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                        question: question,
                        answer: definition.endsWith('.') ? definition : `${definition}.`,
                        category: "AI Extracted",
                        difficulty: "Medium",
                        learned: false,
                        starred: false,
                        nextReview: 0
                    });

                    matched = true;
                    break;
                }
            }
        }

        // If no format matches, but it's a long informative sentence, construct a general review card
        if (!matched && sentence.length > 40) {
            // Find a subject term based on capitals or starting word
            const words = sentence.split(/\s+/);
            const topic = words.slice(0, 3).join(" ");
            
            cards.push({
                id: `card-ai-${Date.now()}-${Math.floor(Math.random()*1000)}`,
                question: `Explain the concept regarding: "${topic}..."`,
                answer: sentence.endsWith('.') ? sentence : `${sentence}.`,
                category: "AI Concept",
                difficulty: "Hard",
                learned: false,
                starred: false,
                nextReview: 0
            });
        }
    }

    // Default Fallback cards if notes couldn't yield definitions
    if (cards.length === 0) {
        cards.push({
            id: `card-ai-${Date.now()}-fallback`,
            question: "Identify the main topic of your notes.",
            answer: `Summary notes provided: "${text.slice(0, 100)}..."`,
            category: "AI Review",
            difficulty: "Easy",
            learned: false,
            starred: false,
            nextReview: 0
        });
    }

    return cards.slice(0, limit);
}

// JSON IMPORT AND EXPORT BACKUP SYSTEM
function initImportExport() {
    const importTrigger = document.getElementById("import-deck-btn-trigger");
    const importModal = document.getElementById("import-modal");
    const importModalClose = document.getElementById("import-modal-close");
    const importModalCancel = document.getElementById("import-modal-cancel");
    const importModalSubmit = document.getElementById("import-modal-submit-btn");

    const dropZone = document.getElementById("import-drop-zone");
    const fileInput = document.getElementById("import-file-input");
    const statusText = document.getElementById("import-status-text");
    const exportBtn = document.getElementById("export-deck-btn");

    let importedDecksData = null;

    // Export Decks File anchor click
    if (exportBtn) {
        exportBtn.addEventListener("click", () => {
            exportWorkspaceDecks();
        });
    }

    // Modal view triggers
    if (importTrigger && importModal) {
        importTrigger.addEventListener("click", () => {
            importModal.classList.add("active");
            if (statusText) statusText.style.display = "none";
            if (importModalSubmit) importModalSubmit.disabled = true;
            importedDecksData = null;
        });
    }

    const closeImportModal = () => {
        if (importModal) importModal.classList.remove("active");
    };
    if (importModalClose) importModalClose.addEventListener("click", closeImportModal);
    if (importModalCancel) importModalCancel.addEventListener("click", closeImportModal);

    // Dropzone triggers
    if (dropZone && fileInput) {
        dropZone.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) handleImportFile(file);
        });

        // Drag/Drop visual toggles
        dropZone.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZone.classList.add("dragover");
        });

        dropZone.addEventListener("dragleave", () => {
            dropZone.classList.remove("dragover");
        });

        dropZone.addEventListener("drop", (e) => {
            e.preventDefault();
            dropZone.classList.remove("dragover");
            const file = e.dataTransfer.files[0];
            if (file) handleImportFile(file);
        });
    }

    const handleImportFile = (file) => {
        if (file.type !== "application/json" && !file.name.endsWith(".json")) {
            showToast("Invalid format. Please upload a JSON file.", "danger");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                
                // Validation checks
                const isValid = Array.isArray(parsed) && parsed.every(deck => {
                    return deck.name && Array.isArray(deck.cards);
                });

                if (!isValid) {
                    showToast("Corrupt decks layout schema structure.", "danger");
                    return;
                }

                importedDecksData = parsed;
                if (statusText) {
                    statusText.textContent = `Successfully parsed file. Found ${parsed.length} deck(s).`;
                    statusText.style.display = "block";
                }
                if (importModalSubmit) importModalSubmit.disabled = false;
            } catch (err) {
                showToast("Failed to parse JSON file.", "danger");
            }
        };
        reader.readAsText(file);
    };

    // Confirm Merge decks
    if (importModalSubmit) {
        importModalSubmit.addEventListener("click", () => {
            if (!importedDecksData) return;

            // Merge imported decks into current state
            importedDecksData.forEach(importedDeck => {
                // Ensure unique deck ids
                const newDeckId = `deck-imported-${Date.now()}-${Math.floor(Math.random()*1000)}`;
                const newDeck = {
                    id: newDeckId,
                    name: `${importedDeck.name} (Imported)`,
                    cards: importedDeck.cards.map(c => {
                        return {
                            ...c,
                            id: `card-imported-${Date.now()}-${Math.floor(Math.random()*1000)}`
                        };
                    })
                };
                state.decks.push(newDeck);
            });

            saveDecksToStorage();
            renderSidebarDecks();
            closeImportModal();
            showToast("Decks imported successfully!", "success");
            
            // Switch active deck to the first imported deck
            if (importedDecksData.length > 0) {
                const lastDeckIndex = state.decks.length - 1;
                switchActiveDeck(state.decks[lastDeckIndex].id);
            }
            updateDecksProgressStats();
        });
    }
}

function exportWorkspaceDecks() {
    try {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.decks, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", `FlashForge-Backup-${new Date().toISOString().slice(0, 10)}.json`);
        dlAnchorElem.click();
        showToast("Backup file downloaded successfully!", "success");
    } catch (e) {
        showToast("Export failed.", "danger");
    }
}

// Toast Notification alert helpers
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "fa-solid fa-circle-check";
    if (type === "info") icon = "fa-solid fa-circle-info";
    if (type === "danger") icon = "fa-solid fa-triangle-exclamation";

    toast.replaceChildren();

    const iconElement = document.createElement("i");
    iconElement.className = icon;

    const messageElement = document.createElement("span");
    messageElement.textContent = message;

    toast.appendChild(iconElement);
    toast.appendChild(messageElement);

    container.appendChild(toast);

    // Slide out and remove toast after timing delays
    setTimeout(() => {
        toast.style.animation = "slideInRight 0.3s reverse forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}
