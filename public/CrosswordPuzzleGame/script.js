// ---------------------------------------------------------------------------
// Puzzle data: organized by topic, then by difficulty.
// Each puzzle is a small set of words; each word carries its own clue and
// the direction it should be listed under (across / down).
// ---------------------------------------------------------------------------
const topicData = {
    technology: {
        label: "Technology",
        icon: "💻",
        easy: [
            { words: [
                { answer: "WIFI", clue: "Wireless internet connection", direction: "across" },
                { answer: "MOUSE", clue: "Device used to point and click", direction: "down" }
            ] },
            { words: [
                { answer: "EMAIL", clue: "Electronic message sent online", direction: "across" },
                { answer: "APP", clue: "Short for application", direction: "down" }
            ] },
            { words: [
                { answer: "CLOUD", clue: "Online storage and computing space", direction: "across" },
                { answer: "PIXEL", clue: "Smallest unit of a digital image", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "SOFTWARE", clue: "Programs that run on a computer", direction: "across" },
                { answer: "BROWSER", clue: "Application used to access websites", direction: "down" }
            ] },
            { words: [
                { answer: "HARDWARE", clue: "Physical parts of a computer", direction: "across" },
                { answer: "FIREWALL", clue: "Security system that blocks unauthorized access", direction: "down" }
            ] },
            { words: [
                { answer: "INTERNET", clue: "Global network connecting computers", direction: "across" },
                { answer: "BANDWIDTH", clue: "Maximum data transfer rate of a connection", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "ENCRYPTION", clue: "Process of converting data into a secure code", direction: "across" },
                { answer: "ALGORITHM", clue: "Step-by-step procedure for solving a problem", direction: "down" }
            ] },
            { words: [
                { answer: "CYBERSECURITY", clue: "Protection of systems from digital attacks", direction: "across" },
                { answer: "BLOCKCHAIN", clue: "Decentralized digital ledger technology", direction: "down" }
            ] },
            { words: [
                { answer: "AUTHENTICATION", clue: "Process of verifying a user's identity", direction: "across" },
                { answer: "COMPILER", clue: "Translates code into machine language", direction: "down" }
            ] }
        ]
    },
    science: {
        label: "Science",
        icon: "🔬",
        easy: [
            { words: [
                { answer: "ATOM", clue: "Smallest unit of matter", direction: "across" },
                { answer: "CELL", clue: "Basic unit of life", direction: "down" }
            ] },
            { words: [
                { answer: "ENERGY", clue: "Capacity to do work", direction: "across" },
                { answer: "GRAVITY", clue: "Force that pulls objects toward Earth", direction: "down" }
            ] },
            { words: [
                { answer: "PLANET", clue: "Large body orbiting a star", direction: "across" },
                { answer: "ORBIT", clue: "Path an object takes around another", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "MOLECULE", clue: "Group of atoms bonded together", direction: "across" },
                { answer: "ELECTRON", clue: "Negatively charged subatomic particle", direction: "down" }
            ] },
            { words: [
                { answer: "ECOSYSTEM", clue: "Community of organisms and their environment", direction: "across" },
                { answer: "ORGANISM", clue: "Any living thing", direction: "down" }
            ] },
            { words: [
                { answer: "HYPOTHESIS", clue: "A testable scientific prediction", direction: "across" },
                { answer: "CHEMICAL", clue: "Substance with a distinct composition", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "THERMODYNAMICS", clue: "Study of heat and energy transfer", direction: "across" },
                { answer: "MITOCHONDRIA", clue: "Organelle that produces cellular energy", direction: "down" }
            ] },
            { words: [
                { answer: "RADIOACTIVITY", clue: "Spontaneous emission of radiation from atoms", direction: "across" },
                { answer: "CATALYST", clue: "Substance that speeds up a reaction", direction: "down" }
            ] },
            { words: [
                { answer: "PHOTOSYNTHESIS", clue: "Process plants use to convert light into energy", direction: "across" },
                { answer: "QUANTUM", clue: "Smallest discrete unit of a physical property", direction: "down" }
            ] }
        ]
    },
    sports: {
        label: "Sports",
        icon: "🏆",
        easy: [
            { words: [
                { answer: "BALL", clue: "Round object used in many games", direction: "across" },
                { answer: "GOAL", clue: "Point scored in many sports", direction: "down" }
            ] },
            { words: [
                { answer: "TEAM", clue: "Group of players competing together", direction: "across" },
                { answer: "RACE", clue: "Competition of speed", direction: "down" }
            ] },
            { words: [
                { answer: "SWIM", clue: "Move through water using limbs", direction: "across" },
                { answer: "COURT", clue: "Marked area for playing a game", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "STADIUM", clue: "Large venue for sports events", direction: "across" },
                { answer: "REFEREE", clue: "Official who enforces the rules", direction: "down" }
            ] },
            { words: [
                { answer: "OLYMPICS", clue: "International multi-sport event", direction: "across" },
                { answer: "MARATHON", clue: "Long-distance running race", direction: "down" }
            ] },
            { words: [
                { answer: "DEFENSE", clue: "Strategy to prevent the opponent from scoring", direction: "across" },
                { answer: "ATHLETE", clue: "A person who competes in sports", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "BADMINTON", clue: "Racquet sport played with a shuttlecock", direction: "across" },
                { answer: "GYMNASTICS", clue: "Sport involving acrobatic body movements", direction: "down" }
            ] },
            { words: [
                { answer: "DECATHLON", clue: "Athletic contest with ten events", direction: "across" },
                { answer: "ENDURANCE", clue: "Ability to sustain prolonged physical effort", direction: "down" }
            ] },
            { words: [
                { answer: "TOURNAMENT", clue: "Series of contests for a championship", direction: "across" },
                { answer: "CHAMPIONSHIP", clue: "Contest to determine the best competitor", direction: "down" }
            ] }
        ]
    },
    geography: {
        label: "Geography",
        icon: "🌍",
        easy: [
            { words: [
                { answer: "RIVER", clue: "Flowing body of water", direction: "across" },
                { answer: "HILL", clue: "Small raised landform", direction: "down" }
            ] },
            { words: [
                { answer: "OCEAN", clue: "Large body of salt water", direction: "across" },
                { answer: "ISLAND", clue: "Land surrounded by water", direction: "down" }
            ] },
            { words: [
                { answer: "DESERT", clue: "Dry, arid land region", direction: "across" },
                { answer: "VALLEY", clue: "Low area between hills", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "CONTINENT", clue: "Large landmass on Earth", direction: "across" },
                { answer: "PENINSULA", clue: "Land surrounded by water on three sides", direction: "down" }
            ] },
            { words: [
                { answer: "EQUATOR", clue: "Imaginary line dividing Earth into hemispheres", direction: "across" },
                { answer: "GLACIER", clue: "Large mass of slow-moving ice", direction: "down" }
            ] },
            { words: [
                { answer: "LATITUDE", clue: "Distance north or south of the equator", direction: "across" },
                { answer: "PLATEAU", clue: "Flat elevated landform", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "ARCHIPELAGO", clue: "Group or chain of islands", direction: "across" },
                { answer: "HEMISPHERE", clue: "Half of the Earth's surface", direction: "down" }
            ] },
            { words: [
                { answer: "TOPOGRAPHY", clue: "Detailed mapping of land features", direction: "across" },
                { answer: "ISTHMUS", clue: "Narrow strip of land connecting two larger areas", direction: "down" }
            ] },
            { words: [
                { answer: "METROPOLIS", clue: "A very large or capital city", direction: "across" },
                { answer: "TERRITORY", clue: "An area under the control of a ruler or state", direction: "down" }
            ] }
        ]
    },
    movies: {
        label: "Movies",
        icon: "🎬",
        easy: [
            { words: [
                { answer: "ACTOR", clue: "Person who performs in a film", direction: "across" },
                { answer: "HERO", clue: "Main heroic character", direction: "down" }
            ] },
            { words: [
                { answer: "SCENE", clue: "A single shot or sequence in a film", direction: "across" },
                { answer: "PLOT", clue: "The main storyline", direction: "down" }
            ] },
            { words: [
                { answer: "SCRIPT", clue: "Written text of a film's dialogue", direction: "across" },
                { answer: "STAR", clue: "A famous leading actor", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "DIRECTOR", clue: "Person who oversees a film's creation", direction: "across" },
                { answer: "SEQUEL", clue: "Film that continues a previous story", direction: "down" }
            ] },
            { words: [
                { answer: "ANIMATION", clue: "Technique of creating moving images from drawings", direction: "across" },
                { answer: "PRODUCER", clue: "Person who finances and organizes a film", direction: "down" }
            ] },
            { words: [
                { answer: "SCREENPLAY", clue: "Written script with scenes and dialogue", direction: "across" },
                { answer: "TRAILER", clue: "Short preview clip of a movie", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "CINEMATOGRAPHY", clue: "Art of camera and lighting in filmmaking", direction: "across" },
                { answer: "BLOCKBUSTER", clue: "A film with huge commercial success", direction: "down" }
            ] },
            { words: [
                { answer: "DOCUMENTARY", clue: "Non-fiction film based on real events", direction: "across" },
                { answer: "SOUNDTRACK", clue: "Music recorded for a film", direction: "down" }
            ] },
            { words: [
                { answer: "CHOREOGRAPHY", clue: "Arrangement of dance movements for a scene", direction: "across" },
                { answer: "NARRATIVE", clue: "The story told within a film", direction: "down" }
            ] }
        ]
    },
    history: {
        label: "History",
        icon: "📜",
        easy: [
            { words: [
                { answer: "KING", clue: "Male ruler of a kingdom", direction: "across" },
                { answer: "WAR", clue: "Armed conflict between groups", direction: "down" }
            ] },
            { words: [
                { answer: "FLAG", clue: "Symbol representing a nation", direction: "across" },
                { answer: "YEAR", clue: "Twelve-month time period", direction: "down" }
            ] },
            { words: [
                { answer: "FORT", clue: "Defensive military structure", direction: "across" },
                { answer: "TOMB", clue: "Place where a body is buried", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "EMPIRE", clue: "Large territory ruled by one authority", direction: "across" },
                { answer: "COLONY", clue: "Territory controlled by a distant country", direction: "down" }
            ] },
            { words: [
                { answer: "REVOLUTION", clue: "Sudden overthrow of a government", direction: "across" },
                { answer: "ARTIFACT", clue: "Object made by humans in the past", direction: "down" }
            ] },
            { words: [
                { answer: "MONARCHY", clue: "Government ruled by a king or queen", direction: "across" },
                { answer: "TREATY", clue: "Formal agreement between nations", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "RENAISSANCE", clue: "Period of cultural rebirth in Europe", direction: "across" },
                { answer: "INDEPENDENCE", clue: "Freedom from external control", direction: "down" }
            ] },
            { words: [
                { answer: "CIVILIZATION", clue: "Complex society with cities and culture", direction: "across" },
                { answer: "ARCHAEOLOGY", clue: "Study of human history through artifacts", direction: "down" }
            ] },
            { words: [
                { answer: "REVOLUTIONARY", clue: "Person involved in radical political change", direction: "across" },
                { answer: "COLONIZATION", clue: "Process of settling and controlling a new region", direction: "down" }
            ] }
        ]
    },
    animals: {
        label: "Animals",
        icon: "🐾",
        easy: [
            { words: [
                { answer: "CAT", clue: "Common pet that meows", direction: "across" },
                { answer: "DOG", clue: "Loyal pet known for barking", direction: "down" }
            ] },
            { words: [
                { answer: "LION", clue: "Large wild cat known as the king of the jungle", direction: "across" },
                { answer: "FISH", clue: "Aquatic animal with gills", direction: "down" }
            ] },
            { words: [
                { answer: "BIRD", clue: "Animal with feathers and wings", direction: "across" },
                { answer: "BEAR", clue: "Large furry mammal found in forests", direction: "down" }
            ] }
        ],
        medium: [
            { words: [
                { answer: "ELEPHANT", clue: "Largest land mammal with a trunk", direction: "across" },
                { answer: "GIRAFFE", clue: "Tallest land animal with a long neck", direction: "down" }
            ] },
            { words: [
                { answer: "DOLPHIN", clue: "Intelligent marine mammal", direction: "across" },
                { answer: "PENGUIN", clue: "Flightless bird that lives in cold climates", direction: "down" }
            ] },
            { words: [
                { answer: "LEOPARD", clue: "Spotted big cat known for stealth", direction: "across" },
                { answer: "OCTOPUS", clue: "Eight-armed sea creature", direction: "down" }
            ] }
        ],
        hard: [
            { words: [
                { answer: "CHIMPANZEE", clue: "Great ape closely related to humans", direction: "across" },
                { answer: "RHINOCEROS", clue: "Large mammal with a thick horned snout", direction: "down" }
            ] },
            { words: [
                { answer: "CHAMELEON", clue: "Lizard known for changing color", direction: "across" },
                { answer: "HIPPOPOTAMUS", clue: "Large semi-aquatic mammal", direction: "down" }
            ] },
            { words: [
                { answer: "ORANGUTAN", clue: "Large ape native to Southeast Asia", direction: "across" },
                { answer: "CROCODILE", clue: "Large reptile that lives in rivers", direction: "down" }
            ] }
        ]
    }
};

const difficultyMeta = {
    easy: { label: "Easy", points: 10, accent: "#22c55e" },
    medium: { label: "Medium", points: 20, accent: "#f59e0b" },
    hard: { label: "Hard", points: 30, accent: "#ef4444" }
};

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
let selectedTopic = null;
let selectedDifficulty = null;
let activePuzzles = [];
let currentPuzzleIndex = 0;
let score = 0;
let timerInterval;
let seconds = 0;
let timerRunning = false;

// ---------------------------------------------------------------------------
// DOM references
// ---------------------------------------------------------------------------
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const topicGrid = document.getElementById("topicGrid");
const difficultyGroup = document.getElementById("difficultyGroup");
const startBtn = document.getElementById("startBtn");
const changeTopicBtn = document.getElementById("changeTopicBtn");
const activeTopicEl = document.getElementById("activeTopic");
const activeDifficultyEl = document.getElementById("activeDifficulty");

const grid = document.getElementById("grid");
const acrossList = document.getElementById("acrossClues");
const downList = document.getElementById("downClues");
const result = document.getElementById("result");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const themeToggle = document.getElementById("themeToggle");
const timerToggle = document.getElementById("timerToggle");

// ---------------------------------------------------------------------------
// Setup screen: build topic cards and difficulty buttons
// ---------------------------------------------------------------------------
function renderSetupScreen() {
    topicGrid.innerHTML = "";
    Object.keys(topicData).forEach(key => {
        const topic = topicData[key];
        const card = document.createElement("button");
        card.type = "button";
        card.className = "topic-card";
        card.dataset.topic = key;
        card.setAttribute("role", "radio");
        card.setAttribute("aria-checked", "false");
        card.innerHTML = `<span class="topic-icon">${topic.icon}</span><span class="topic-name">${topic.label}</span>`;
        card.addEventListener("click", () => {
            selectedTopic = key;
            document.querySelectorAll(".topic-card").forEach(c => {
                c.classList.remove("selected");
                c.setAttribute("aria-checked", "false");
            });
            card.classList.add("selected");
            card.setAttribute("aria-checked", "true");
            evaluateStartReadiness();
        });
        topicGrid.appendChild(card);
    });

    difficultyGroup.innerHTML = "";
    Object.keys(difficultyMeta).forEach(key => {
        const meta = difficultyMeta[key];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `difficulty-btn difficulty-${key}`;
        btn.dataset.difficulty = key;
        btn.setAttribute("role", "radio");
        btn.setAttribute("aria-checked", "false");
        btn.textContent = meta.label;
        btn.addEventListener("click", () => {
            selectedDifficulty = key;
            document.querySelectorAll(".difficulty-btn").forEach(b => {
                b.classList.remove("selected");
                b.setAttribute("aria-checked", "false");
            });
            btn.classList.add("selected");
            btn.setAttribute("aria-checked", "true");
            evaluateStartReadiness();
        });
        difficultyGroup.appendChild(btn);
    });
}

function evaluateStartReadiness() {
    startBtn.disabled = !(selectedTopic && selectedDifficulty);
}

startBtn.addEventListener("click", () => {
    if (!selectedTopic || !selectedDifficulty) return;
    activePuzzles = topicData[selectedTopic][selectedDifficulty];
    currentPuzzleIndex = 0;
    score = 0;
    seconds = 0;
    scoreEl.textContent = `⭐ Score: ${score}`;
    updateTimerDisplay();
    stopTimer();

    const topic = topicData[selectedTopic];
    const meta = difficultyMeta[selectedDifficulty];
    activeTopicEl.textContent = `${topic.icon} ${topic.label}`;
    activeDifficultyEl.textContent = `🎯 ${meta.label}`;
    activeDifficultyEl.style.background = meta.accent;

    setupScreen.hidden = true;
    gameScreen.hidden = false;

    loadPuzzle(currentPuzzleIndex);
});

changeTopicBtn.addEventListener("click", () => {
    stopTimer();
    gameScreen.hidden = true;
    setupScreen.hidden = false;
    selectedTopic = null;
    selectedDifficulty = null;
    document.querySelectorAll(".topic-card, .difficulty-btn").forEach(el => {
        el.classList.remove("selected");
        el.setAttribute("aria-checked", "false");
    });
    evaluateStartReadiness();
});

// ---------------------------------------------------------------------------
// Timer
// ---------------------------------------------------------------------------
function updateTimerDisplay() {
    let mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    let secs = String(seconds % 60).padStart(2, "0");
    timerEl.textContent = `⏱ Time: ${mins}:${secs}`;
}

function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
    timerRunning = true;
    timerToggle.textContent = "⏸️";
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
    timerToggle.textContent = "▶️";
}

timerToggle.addEventListener("click", () => {
    if (timerRunning) stopTimer();
    else startTimer();
});

// ---------------------------------------------------------------------------
// Puzzle loading
// ---------------------------------------------------------------------------
function loadPuzzle(index) {
    grid.innerHTML = "";
    acrossList.innerHTML = "";
    downList.innerHTML = "";
    const puzzle = activePuzzles[index];

    puzzle.words.forEach((word, wordIndex) => {
        const row = document.createElement("div");
        row.classList.add("word-row");

        for (let i = 0; i < word.answer.length; i++) {
            const input = document.createElement("input");
            input.maxLength = 1;

            input.addEventListener("input", () => {
                const val = input.value.toUpperCase();

                if (val === word.answer[i]) {
                    input.classList.add("correct");
                    input.classList.remove("incorrect");
                } else {
                    input.classList.add("incorrect");
                    input.classList.remove("correct");
                }
                if (input.value.length >= 1 && input.nextElementSibling) {
                    input.nextElementSibling.focus();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && input.value.length === 0 && input.previousElementSibling) {
                    input.previousElementSibling.focus();
                }
            });

            row.appendChild(input);
        }
        grid.appendChild(row);

        const clueItem = document.createElement("li");
        clueItem.textContent = `${wordIndex + 1}. ${word.clue}`;
        if (word.direction === "down") {
            downList.appendChild(clueItem);
        } else {
            acrossList.appendChild(clueItem);
        }
    });

    const topic = topicData[selectedTopic];
    const meta = difficultyMeta[selectedDifficulty];
    result.textContent = `${topic.label} · ${meta.label} — Puzzle ${index + 1} of ${activePuzzles.length}`;
}

// ---------------------------------------------------------------------------
// Check answers
// ---------------------------------------------------------------------------
document.getElementById("checkBtn").addEventListener("click", () => {
    const rows = document.querySelectorAll(".word-row");
    let allCorrect = true;

    rows.forEach((row, index) => {
        let userWord = "";
        row.querySelectorAll("input").forEach(input => {
            userWord += input.value.toUpperCase();
        });

        if (userWord !== activePuzzles[currentPuzzleIndex].words[index].answer) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        const meta = difficultyMeta[selectedDifficulty];
        score += meta.points;
        scoreEl.textContent = `⭐ Score: ${score}`;

        if (currentPuzzleIndex < activePuzzles.length - 1) {
            result.textContent = "🎉 Correct! Loading next puzzle...";
            currentPuzzleIndex++;
            loadPuzzle(currentPuzzleIndex);
        } else {
            const topic = topicData[selectedTopic];
            result.innerHTML = `<div class="trophy">🏆</div><p>Congratulations! You solved every ${meta.label.toLowerCase()} ${topic.label.toLowerCase()} puzzle!</p>`;
            stopTimer();
        }
    } else {
        result.textContent = "❌ Some answers are incorrect. Try again.";
    }
});

// ---------------------------------------------------------------------------
// Reset puzzle
// ---------------------------------------------------------------------------
document.getElementById("resetBtn").addEventListener("click", () => {
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
        input.classList.remove("correct", "incorrect");
    });

    loadPuzzle(currentPuzzleIndex);
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
});

// ---------------------------------------------------------------------------
// Theme toggle
// ---------------------------------------------------------------------------
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

// ---------------------------------------------------------------------------
// Initialize
// ---------------------------------------------------------------------------
renderSetupScreen();
updateTimerDisplay();