// Define 10 puzzles with increasing difficulty
const puzzles = [
    {
        words: [{ answer: "HTML" }, { answer: "CSS" }, { answer: "JAVASCRIPT" }],
        clues: {
            across: ["1. Markup language", "2. Styles web pages"],
            down: ["3. Programming language of the web"]
        }
    },
    {
        words: [{ answer: "PYTHON" }, { answer: "DJANGO" }],
        clues: {
            across: ["1. Popular scripting language", "2. Python web framework"],
            down: []
        }
    },
    {
        words: [{ answer: "DATABASE" }, { answer: "MYSQL" }],
        clues: {
            across: ["1. Stores structured data", "2. Open-source relational DB"],
            down: []
        }
    },
    {
        words: [{ answer: "REACT" }, { answer: "COMPONENT" }],
        clues: {
            across: ["1. JS library for UI", "2. Reusable building block"],
            down: []
        }
    },
    {
        words: [{ answer: "ALGORITHM" }, { answer: "BINARY" }],
        clues: {
            across: ["1. Step-by-step procedure", "2. Base-2 number system"],
            down: []
        }
    },
    {
        words: [{ answer: "NETWORK" }, { answer: "PACKET" }],
        clues: {
            across: ["1. Computers connected together", "2. Unit of data transfer"],
            down: []
        }
    },
    {
        words: [{ answer: "SECURITY" }, { answer: "ENCRYPTION" }],
        clues: {
            across: ["1. Protecting systems", "2. Encoding information"],
            down: []
        }
    },
    {
        words: [{ answer: "FUNCTION" }, { answer: "VARIABLE" }],
        clues: {
            across: ["1. Block of reusable code", "2. Stores a value"],
            down: []
        }
    },
    {
        words: [{ answer: "OPERATING" }, { answer: "SYSTEM" }],
        clues: {
            across: ["1. Software managing hardware", "2. Windows, Linux, macOS"],
            down: []
        }
    },
    {
        words: [{ answer: "ARTIFICIAL" }, { answer: "INTELLIGENCE" }],
        clues: {
            across: ["1. Machines that think", "2. AI full form"],
            down: []
        }
    }
];

let currentPuzzleIndex = 0;
let score = 0;
let timerInterval;
let seconds = 0;
let timerRunning = false;

const grid = document.getElementById("grid");
const result = document.getElementById("result");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const themeToggle = document.getElementById("themeToggle");
const timerToggle = document.getElementById("timerToggle");

// Timer functions
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

// Load puzzle dynamically
function loadPuzzle(index) {
    grid.innerHTML = "";
    const puzzle = puzzles[index];

    puzzle.words.forEach(word => {
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
            });

            row.appendChild(input);
        }
        grid.appendChild(row);
    });

    result.textContent = `Puzzle ${index + 1} of ${puzzles.length}`;
}

// Check answers
document.getElementById("checkBtn").addEventListener("click", () => {
    const rows = document.querySelectorAll(".word-row");
    let allCorrect = true;

    rows.forEach((row, index) => {
        let userWord = "";
        row.querySelectorAll("input").forEach(input => {
            userWord += input.value.toUpperCase();
        });

        if (userWord !== puzzles[currentPuzzleIndex].words[index].answer) {
            allCorrect = false;
        }
    });

    if (allCorrect) {
        score += 10;
        scoreEl.textContent = `⭐ Score: ${score}`;

        if (currentPuzzleIndex < puzzles.length - 1) {
            result.textContent = "🎉 Correct! Loading next puzzle...";
            currentPuzzleIndex++;
            loadPuzzle(currentPuzzleIndex);
        } else {
          result.innerHTML = '<div class="trophy">🏆</div><p>Congratulations! You solved all puzzles!</p>';
          stopTimer();
        }
    } else {
        result.textContent = "❌ Some answers are incorrect. Try again.";
    }
});

// Reset puzzle
document.getElementById("resetBtn").addEventListener("click", () => {
    document.querySelectorAll("input").forEach(input => {
        input.value = "";
        input.classList.remove("correct", "incorrect");
    });

    result.textContent = "";
    stopTimer();
    seconds = 0;
    updateTimerDisplay();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

// Initialize first puzzle
loadPuzzle(currentPuzzleIndex);
updateTimerDisplay();
