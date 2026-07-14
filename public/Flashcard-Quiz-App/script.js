/* ============================================================
                    FLASHCARD QUIZ APP
============================================================ */
/* ============================================================
                    DEFAULT FLASHCARDS
============================================================ */
const defaultFlashcards = {
    webdev: [
        { question: "What does HTML stand for?", answer: "HyperText Markup Language", hint: "Starts with H" },
        { question: "Which HTML tag creates a hyperlink?", answer: "<a>", hint: "Starts with <" },
        { question: "Which CSS property changes text color?", answer: "color", hint: "Five letters" },
        { question: "Which keyword declares a variable in JavaScript?", answer: "let", hint: "Three letters" },
        { question: "Which browser storage persists after closing the browser?", answer: "localStorage", hint: "Starts with local" }
    ],
    dbms: [
        { question: "What does DBMS stand for?", answer: "Database Management System", hint: "Starts with Database" },
        { question: "Which SQL command retrieves data?", answer: "SELECT", hint: "Starts with S" },
        { question: "Which key uniquely identifies a record?", answer: "Primary Key", hint: "Starts with Primary" },
        { question: "Which SQL clause filters rows?", answer: "WHERE", hint: "Starts with W" },
        { question: "Which SQL command removes a table?", answer: "DROP", hint: "Starts with D" }
    ],
    cn: [
        { question: "What does TCP stand for?", answer: "Transmission Control Protocol", hint: "Starts with Transmission" },
        { question: "What does IP stand for?", answer: "Internet Protocol", hint: "Starts with Internet" },
        { question: "Which device forwards packets?", answer: "Router", hint: "Network device" },
        { question: "What does DNS stand for?", answer: "Domain Name System", hint: "Starts with Domain" },
        { question: "Which topology connects every node together?", answer: "Mesh", hint: "Starts with M" }
    ],
    os: [
        { question: "What is an Operating System?", answer: "System software that manages computer hardware and software resources", hint: "System software" },
        { question: "Which scheduling algorithm is First Come First Serve?", answer: "FCFS", hint: "Four letters" },
        { question: "Fastest memory in a computer?", answer: "Cache Memory", hint: "Starts with Cache" },
        { question: "Which memory is volatile?", answer: "RAM", hint: "Three letters" },
        { question: "Which OS is open source?", answer: "Linux", hint: "Penguin" }
    ],
    dsa: [
        { question: "What does DSA stand for?", answer: "Data Structures and Algorithms", hint: "Starts with Data" },
        { question: "Which data structure follows FIFO?", answer: "Queue", hint: "Starts with Q" },
        { question: "Which data structure follows LIFO?", answer: "Stack", hint: "Starts with S" },
        { question: "Which traversal is Left Root Right?", answer: "Inorder", hint: "Binary Tree" },
        { question: "Average complexity of Binary Search?", answer: "O(log n)", hint: "Starts with O" }
    ]
};
/* ============================================================
                    APP STATE
============================================================ */
let currentSubject = "webdev";
let flashcards = [];
let currentIndex = 0;
let isTimedMode = false;
let timer = null;
let totalTime = 60;
let timeLeft = 60;
let timedCorrect = 0;
let timedWrong = 0;
let timedAttempted = 0;
let cardAttempted = false;
let originalFlashcards = [];
/* ============================================================
                    LOCAL STORAGE
============================================================ */
function storageKey(subject) {
    return `flashcards_${subject}`;
}
function loadFlashcards(subject) {
    const saved = localStorage.getItem(storageKey(subject));
    if (saved) return JSON.parse(saved);
    return structuredClone(defaultFlashcards[subject]);
}
function saveFlashcards() {
    localStorage.setItem(storageKey(currentSubject), JSON.stringify(flashcards));
}
/* ============================================================
                    SUBJECT SWITCHING
============================================================ */
function switchSubject(subject) {
    currentSubject = subject;
    flashcards = loadFlashcards(subject);
    currentIndex = 0;
    renderCard();
}
/* ============================================================
                    NAVIGATION TABS
============================================================ */
const navTabs = document.querySelectorAll(".nav-tab");
navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        navTabs.forEach(button => button.classList.remove("active"));
        tab.classList.add("active");
        switchSubject(tab.dataset.subject);
    });
});
/* ============================================================
                    INITIAL DATA
============================================================ */
flashcards = loadFlashcards(currentSubject);
/* ============================================================
                    DOM ELEMENTS
============================================================ */
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const userAnswer = document.getElementById("userAnswer");
const result = document.getElementById("result");
const hintText = document.getElementById("hintText");
const checkBtn = document.getElementById("checkBtn");
const hintBtn = document.getElementById("hintBtn");
const showBtn = document.getElementById("showBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const questionInput = document.getElementById("questionInput");
const answerInput = document.getElementById("answerInput");
const hintInput = document.getElementById("hintInput");
const addBtn = document.getElementById("addBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");
/* ============================================================
                    UTILITY FUNCTIONS
============================================================ */
function normalize(text) {
    return text.trim().replace(/\s+/g, " ").toLowerCase();
}
function generateHint(answerText) {
    if (!answerText) return "";
    return `Starts with "${answerText.substring(0, 2)}" and contains ${answerText.length} characters.`;
}
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
/* ============================================================
                    RESET CARD
============================================================ */
function resetCard() {
    userAnswer.value = "";
    result.textContent = "";
    result.style.color = "";
    answer.classList.add("hidden");
    hintText.classList.add("hidden");
    hintText.textContent = "";
    answer.textContent = "";
    showBtn.classList.add("hidden");
    showBtn.textContent = "Show Answer";
    checkBtn.disabled = false;
    hintBtn.disabled = false;
    userAnswer.disabled = false;
}
/* ============================================================
                    RENDER CARD
============================================================ */
function renderCard() {
    cardAttempted = false;
    if (flashcards.length === 0) {
        question.textContent = "No flashcards available.";
        resetCard();
        return;
    }
    const card = flashcards[currentIndex];
    question.textContent = card.question;
    answer.textContent=`Correct Answer: ${card.answer}`;
    questionInput.value = card.question;
    answerInput.value = card.answer;
    hintInput.value=card.hint || "";
    resetCard();
}
/* ============================================================
                    MOVE CARDS
============================================================ */
function nextCard() {
    currentIndex++;
    if (currentIndex >= flashcards.length) currentIndex = 0;
    renderCard();
}
function previousCard() {
    currentIndex--;
    if (currentIndex < 0) currentIndex = flashcards.length - 1;
    renderCard();
}
/* ============================================================
                    HINT
============================================================ */
hintBtn.addEventListener("click", () => {
    const card = flashcards[currentIndex];
    hintText.classList.remove("hidden");
    hintText.textContent = card.hint?.trim() ? card.hint : generateHint(card.answer);
});
/* ============================================================
                    SHOW ANSWER
============================================================ */
showBtn.addEventListener("click", () => {
    answer.classList.toggle("hidden");
    showBtn.textContent = answer.classList.contains("hidden") ? "Show Answer" : "Hide Answer";
});
/* ============================================================
                    NAVIGATION
============================================================ */
nextBtn.addEventListener("click", () => {
    if (isTimedMode) return;
    nextCard();
});
prevBtn.addEventListener("click", () => {
    if (isTimedMode) return;
    previousCard();
});
/* ============================================================
                KEYBOARD SUPPORT
============================================================ */
userAnswer.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        checkAnswer();
    }
});
/* ============================================================
                INITIAL RENDER
============================================================ */
renderCard();
/* ============================================================
                    QUIZ HELPERS
============================================================ */
function enableQuiz() {
    checkBtn.disabled = false;
    hintBtn.disabled = false;
    userAnswer.disabled = false;
}
function disableQuiz() {
    checkBtn.disabled = true;
    hintBtn.disabled = true;
    userAnswer.disabled = true;
}
function updateCard() {
    setTimeout(() => {
        nextCard();
    }, 800);
}
/* ============================================================
                    ANSWER CHECKING
============================================================ */
function checkAnswer() {
    if (flashcards.length === 0) return;
    const user = normalize(userAnswer.value);
    if (user === "") {
        alert("Please enter your answer.");
        return;
    }
    const correct = normalize(flashcards[currentIndex].answer);
    if (user === correct) {
        handleCorrect();
    } else {
        handleWrong();
    }
}
/* ============================================================
                    CORRECT ANSWER
============================================================ */
function handleCorrect() {
    result.textContent = "✅ Correct!";
    result.style.color = "#16a34a";
    disableQuiz();
    showBtn.classList.add("hidden");

    if (isTimedMode && !cardAttempted) {
        timedCorrect++;
        timedAttempted++;
        cardAttempted = true;
        updateTimedStats();
    }

    updateCard();
}
/* ============================================================
                    WRONG ANSWER
============================================================ */
function handleWrong() {
    result.textContent = "❌ Incorrect!";
    result.style.color = "#dc2626";
    showBtn.classList.remove("hidden");

    if (isTimedMode && !cardAttempted) {
        timedWrong++;
        timedAttempted++;
        cardAttempted = true;
        updateTimedStats();
    }

    disableQuiz();
    setTimeout(() => {
        updateCard();
    }, 1200);
}
/* ============================================================
                    BUTTON EVENT
============================================================ */
checkBtn.addEventListener("click", checkAnswer);
/* ============================================================
                    TIMED MODE ELEMENTS
============================================================ */
const timedSetup = document.getElementById("timed-setup");
const timedStats = document.getElementById("timed-stats");
const timerOptions = document.getElementById("timer-options");
const startTimedBtn = document.getElementById("start-timed-btn");
const countdown = document.getElementById("countdown");
const timedCorrectText = document.getElementById("timed-correct");
const timedWrongText = document.getElementById("timed-wrong");
const timedAttemptedText = document.getElementById("timed-attempted");
const timedAccuracyText = document.getElementById("timed-accuracy");
const bestScoreText = document.getElementById("best-timed-score");
const modal = document.getElementById("results-modal");
const finalScore = document.getElementById("final-score");
const finalCorrect = document.getElementById("final-correct");
const finalWrong = document.getElementById("final-wrong");
const finalAccuracy = document.getElementById("final-accuracy");
const finalBest = document.getElementById("final-best-score");
const playAgainBtn = document.getElementById("play-again-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
/* ============================================================
                    STATISTICS
============================================================ */
function updateTimedStats() {
    timedCorrectText.textContent = timedCorrect;
    timedWrongText.textContent = timedWrong;
    timedAttemptedText.textContent = timedAttempted;
    const accuracy = timedAttempted === 0 ? 0 : Math.round((timedCorrect / timedAttempted) * 100);
    timedAccuracyText.textContent=`${accuracy}%`;
}
/* ============================================================
                    BEST SCORE
============================================================ */
function getBestScore() {
    return Number(localStorage.getItem("bestTimedScore") || 0);
}
function loadBestScore() {
    bestScoreText.textContent = getBestScore();
}
function saveBestScore(score) {
    if (score > getBestScore()) localStorage.setItem("bestTimedScore", score);
}
/* ============================================================
                    TIMER
============================================================ */
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        countdown.textContent = timeLeft;
        if (timeLeft <= 0) {
            endTimedMode();
        }
    }, 1000);
}
/* ============================================================
                    START TIMED MODE
============================================================ */
function startTimedMode() {
    isTimedMode = true;
    timedCorrect = 0;
    timedWrong = 0;
    timedAttempted = 0;
    clearInterval(timer);
    currentIndex = 0;
    totalTime = Number(timerOptions.value);
    timeLeft = totalTime;
    countdown.textContent = timeLeft;
    originalFlashcards = structuredClone(flashcards);
    shuffle(flashcards);
    timedSetup.hidden = true;
    timedStats.hidden = false;
    setEditingState(true);
    updateTimedStats();
    renderCard();
    startTimer();
}
/* ============================================================
                    END TIMED MODE
============================================================ */
function endTimedMode() {
    clearInterval(timer);
    isTimedMode = false;
    disableQuiz();
    const accuracy = timedAttempted === 0 ? 0 : Math.round((timedCorrect / timedAttempted) * 100);
    saveBestScore(timedCorrect);
    finalScore.textContent = timedCorrect;
    finalCorrect.textContent = timedCorrect;
    finalWrong.textContent = timedWrong;
    finalAccuracy.textContent=`${accuracy}%`;
    finalBest.textContent = getBestScore();
    loadBestScore();
    flashcards = structuredClone(originalFlashcards);
    currentIndex = 0;
    modal.hidden = false;
    modal.classList.add("active");
}
/* ============================================================
                    CLOSE MODAL
============================================================ */
function closeModal() {
    modal.classList.remove("active");
    setTimeout(() => {
        modal.hidden = true;
        timedSetup.hidden = false;
        timedStats.hidden = true;
        enableQuiz();
        setEditingState(false);
        renderCard();
    }, 250);
}
/* ============================================================
                    TIMED EVENTS
============================================================ */
startTimedBtn.addEventListener("click", startTimedMode);
playAgainBtn.addEventListener("click", () => {
        closeModal();
        startTimedMode();
});
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        closeModal();
    }
});
/* ============================================================
                    CRUD
============================================================ */
function addFlashcard() {
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const hint = hintInput.value.trim();
    if (!question || !answer) {
        alert("Question and Answer are required.");
        return;
    }
    flashcards.push({ question, answer, hint });
    saveFlashcards();
    currentIndex = flashcards.length - 1;
    renderCard();
}
function editFlashcard() {
    if (flashcards.length === 0) return;
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    const hint = hintInput.value.trim();
    if (!question || !answer) {
        alert("Question and Answer are required.");
        return;
    }
    flashcards[currentIndex] = { question, answer, hint };
    saveFlashcards();
    renderCard();
}
function deleteFlashcard() {
    if (flashcards.length === 1) {
        alert("At least one flashcard must exist.");
        return;
    }
    if (!confirm("Delete this flashcard?")) return;
    flashcards.splice(currentIndex, 1);
    if (currentIndex >= flashcards.length) currentIndex = flashcards.length - 1;
    saveFlashcards();
    renderCard();
}
/* ============================================================
                    CRUD EVENTS
============================================================ */
addBtn.addEventListener("click", addFlashcard);
editBtn.addEventListener("click", editFlashcard);
deleteBtn.addEventListener("click", deleteFlashcard);
/* ============================================================
                    EDITING STATE
============================================================ */
function setEditingState(disabled) {
    questionInput.disabled = disabled;
    answerInput.disabled = disabled;
    hintInput.disabled = disabled;
    addBtn.disabled = disabled;
    editBtn.disabled = disabled;
    deleteBtn.disabled = disabled;
    prevBtn.disabled = disabled;
    nextBtn.disabled = disabled;
}
/* ============================================================
                    INITIALIZATION
============================================================ */
loadBestScore();
setEditingState(false);
renderCard();