let stats = JSON.parse(localStorage.getItem("stats")) || {
    total: 0,
    xWins: 0,
    oWins: 0,
    draws: 0
};

function updateUI() {
    document.getElementById("totalGames").textContent = stats.total;
    document.getElementById("xWins").textContent = stats.xWins;
    document.getElementById("oWins").textContent = stats.oWins;
    document.getElementById("draws").textContent = stats.draws;

    let winRateX = stats.total === 0 ? 0 : ((stats.xWins / stats.total) * 100).toFixed(1);
    document.getElementById("winRateX").textContent = winRateX + "%";
}

function saveStats() {
    localStorage.setItem("stats", JSON.stringify(stats));
}

document.getElementById("resetStats").addEventListener("click", () => {
    stats = { total: 0, xWins: 0, oWins: 0, draws: 0 };
    saveStats();
    updateUI();
});

updateUI();