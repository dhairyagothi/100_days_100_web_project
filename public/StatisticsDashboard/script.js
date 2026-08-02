/* ==========================================================
   Statistics Dashboard
   ----------------------------------------------------------
   This script is responsible for:
   1. Loading statistics from localStorage
   2. Updating the dashboard
   3. Managing user inputs
   4. Saving statistics
   5. Resetting statistics
   ========================================================== */
/* ==========================================================
   Default Statistics Object
   ========================================================== */
let stats = {
    total: 0,
    xWins: 0,
    oWins: 0,
    draws: 0
};
/* ==========================================================
   Frequently Used DOM Elements
   ========================================================== */
const totalInput = document.getElementById("totalGamesInput");
const xWinsInput = document.getElementById("xWinsInput");
const oWinsInput = document.getElementById("oWinsInput");
const drawsInput = document.getElementById("drawsInput");
const totalDisplay = document.getElementById("totalGamesDisplay");
const xWinsDisplay = document.getElementById("xWinsDisplay");
const oWinsDisplay = document.getElementById("oWinsDisplay");
const drawsDisplay = document.getElementById("drawsDisplay");
const winRateDisplay = document.getElementById("winRateX");
const saveBtn = document.getElementById("saveStats");
const resetBtn = document.getElementById("resetStats");
const messageBox = document.getElementById("messageBox");
/* ==========================================================
   Load Statistics From localStorage
   ========================================================== */
function loadStats() {
    const savedStats = localStorage.getItem("stats");
    if (savedStats) {
        stats = JSON.parse(savedStats);
    }
    updateInputs();
    updateSummary();
}
/* ==========================================================
   Update Input Fields
   ========================================================== */
function updateInputs() {
    totalInput.value = stats.total;
    xWinsInput.value = stats.xWins;
    oWinsInput.value = stats.oWins;
    drawsInput.value = stats.draws;
}
/* ==========================================================
   Update Summary Cards
   ========================================================== */
function updateSummary() {
    totalDisplay.textContent = stats.total;
    xWinsDisplay.textContent = stats.xWins;
    oWinsDisplay.textContent = stats.oWins;
    drawsDisplay.textContent = stats.draws;
    const winRate =
        stats.total === 0
            ? 0
            : ((stats.xWins / stats.total) * 100).toFixed(1);
    winRateDisplay.textContent = `${winRate}%`;
}
/* ==========================================================
   Save Statistics
   ========================================================== */
function saveStatistics() {
    stats.total = Number(totalInput.value);
    stats.xWins = Number(xWinsInput.value);
    stats.oWins = Number(oWinsInput.value);
    stats.draws = Number(drawsInput.value);
    /* Prevent negative values */
    stats.total = Math.max(0, stats.total);
    stats.xWins = Math.max(0, stats.xWins);
    stats.oWins = Math.max(0, stats.oWins);
    stats.draws = Math.max(0, stats.draws);
    /* Optional validation */
    if (
        stats.xWins + stats.oWins + stats.draws >
        stats.total
    ) {
        showMessage(
            "Total Games cannot be less than Wins + Draws.",
            true
        );
        return;
    }
    localStorage.setItem("stats", JSON.stringify(stats));
    updateInputs();
    updateSummary();
    showMessage("Statistics saved successfully.");
}
/* ==========================================================
   Reset Statistics
   ========================================================== */
function resetStatistics() {
    const confirmReset = confirm(
        "Are you sure you want to reset all statistics?"
    );
    if (!confirmReset) return;
    stats = {
        total: 0,
        xWins: 0,
        oWins: 0,
        draws: 0
    };
    localStorage.setItem("stats", JSON.stringify(stats));
    updateInputs();
    updateSummary();
    showMessage("Statistics reset successfully.");
}
/* ==========================================================
   Increment & Decrement Buttons
   ========================================================== */
const increaseButtons =
    document.querySelectorAll(".increase");
const decreaseButtons =
    document.querySelectorAll(".decrease");
/* Increase */
increaseButtons.forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(
            button.dataset.target
        );
        input.value = Number(input.value) + 1;
    });
});
/* Decrease */
decreaseButtons.forEach(button => {
    button.addEventListener("click", () => {
        const input = document.getElementById(
            button.dataset.target
        );
        if (Number(input.value) > 0) {
            input.value = Number(input.value) - 1;
        }
    });
});
/* ==========================================================
   Live Summary Update
   ========================================================== */
const allInputs = document.querySelectorAll("input");
allInputs.forEach(input => {
    input.addEventListener("input", () => {
        stats.total = Number(totalInput.value);
        stats.xWins = Number(xWinsInput.value);
        stats.oWins = Number(oWinsInput.value);
        stats.draws = Number(drawsInput.value);
        updateSummary();
    });
});
/* ==========================================================
   Notification Message
   ========================================================== */
function showMessage(message, isError = false) {
    messageBox.textContent = message;
    messageBox.style.color =
        isError ? "#dc2626" : "#16a34a";
    setTimeout(() => {
        messageBox.textContent = "";
    }, 3000);
}
/* ==========================================================
   Button Events
   ========================================================== */
saveBtn.addEventListener(
    "click",
    saveStatistics
);
resetBtn.addEventListener(
    "click",
    resetStatistics
);
/* ==========================================================
   Initialize Dashboard
   ========================================================== */
loadStats();