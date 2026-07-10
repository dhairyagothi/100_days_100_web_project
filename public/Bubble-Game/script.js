let time = 60;
let score = 0;
let hit = 0;
let level = 1;
let completedLevels = localStorage.getItem("completedLevels")
    ? parseInt(localStorage.getItem("completedLevels"))
    : 0;

let timer;
let running = false;

// Initial display
document.querySelector(".score").innerText = score;
document.querySelector(".time").innerText = time;
document.getElementById("level").innerText = level;
document.getElementById("completed").innerText = completedLevels;

function makeBubble() {
    let clutter = "";
    for (let i = 1; i <= 168; i++) {
        let rn = Math.floor(Math.random() * 10);
        clutter += `<div class="bubble">${rn}</div>`;
    }
    document.querySelector("#pbtm").innerHTML = clutter;
}

function updateTimer() {
    if (time > 0) {
        time--;
        document.querySelector(".time").innerText = time;
    } else {
        clearInterval(timer);
        running = false;
        document.querySelector("#pbtm").innerHTML = `<h1>Level ${level} Complete!</h1>`;
        nextLevel();
        document.getElementById("timer-btn").innerText = "▶ Start Next";
    }
}

function toggleTimer() {
    if (!running) {
        timer = setInterval(updateTimer, 1000);
        running = true;
        document.getElementById("timer-btn").innerText = "started";
    }
}

function getNewHit() {
    hit = Math.floor(Math.random() * 10);
    document.querySelector(".hit").innerText = hit;
}

function increaseScore() {
    score += 10;
    document.querySelector(".score").innerText = score;

    // Flash effect on score box
    let scoreBox = document.querySelector(".score");
    scoreBox.style.backgroundColor = "limegreen";
    setTimeout(() => {
        scoreBox.style.backgroundColor = "";
    }, 300);
}

function nextLevel() {
    completedLevels++;
    level++;
    localStorage.setItem("completedLevels", completedLevels);
    document.getElementById("level").innerText = level;
    document.getElementById("completed").innerText = completedLevels;
    time = 60; // reset timer
    document.querySelector(".time").innerText = time;
    makeBubble();
    getNewHit();
}

document.querySelector("#pbtm").addEventListener("click", function (details) {
    if (!details.target.classList.contains("bubble")) return;

    let det = Number(details.target.innerText);

    if (det === hit) {
        increaseScore();

        // Correct bubble feedback
        details.target.style.backgroundColor = "limegreen";
        details.target.style.transform = "scale(1.3)";
        setTimeout(() => {
            makeBubble();
            getNewHit();
        }, 200);
    } else {
        // Wrong bubble feedback
        details.target.style.backgroundColor = "red";
        details.target.style.animation = "shake 0.3s";
        setTimeout(() => {
            details.target.style.backgroundColor = "";
            details.target.style.animation = "";
        }, 300);
    }
});

// Theme toggle
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
});

// Timer button
document.getElementById("timer-btn").addEventListener("click", toggleTimer);

// Initialize board immediately
makeBubble();
getNewHit();


// Modal logic
const rulesBtn = document.getElementById("rules-btn");
const rulesModal = document.getElementById("rules-modal");

rulesBtn.addEventListener("click", () => {
    rulesModal.style.display = "flex"; // show modal
});

window.addEventListener("click", (event) => {
    if (event.target === rulesModal) {
        rulesModal.style.display = "none"; // close when clicking outside
    }
});