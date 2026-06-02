// Mode select (PC only)
const CHOICES = { rock: "✊", paper: "✋", scissors: "✌️" };
const beats = { rock: "scissors", scissors: "paper", paper: "rock" };
const state = {
    mode: "pc", totalRounds: 3, round: 1,
    scoreYou: 0, scoreOpp: 0,
    yourChoice: null, oppChoice: null,
};

const $ = id => document.getElementById(id);
const screens = ["setupScreen", "playingScreen", "resultScreen", "matchEndScreen"];
function show(id) { screens.forEach(s => $(s).classList.toggle("hidden", s !== id)); }

// Theme
$("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    $("themeToggle").textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

function updateOppLabels() {
    $("oppLabel").textContent = "PC Score";
    $("oppPickLabel").textContent = "PC Chose";
    $("youLabel").textContent = "You Chose";
}

function renderScores() {
    $("scoreYou").textContent = state.scoreYou;
    $("scoreOpp").textContent = state.scoreOpp;
}

function startGame() {
    const n = Math.min(10, Math.max(1, parseInt($("roundsInput").value) || 1));
    state.totalRounds = n;
    state.round = 1; state.scoreYou = 0; state.scoreOpp = 0;
    state.yourChoice = null; state.oppChoice = null;
    renderScores();
    $("roundNum").textContent = state.round;
    $("roundTotal").textContent = state.totalRounds;
    $("turnInfo").textContent = "";
    show("playingScreen");
}
$("startBtn").addEventListener("click", startGame);

document.querySelectorAll(".choice-btn").forEach(b => {
    b.addEventListener("click", () => pick(b.dataset.choice));
});

function pick(c) {
    const keys = Object.keys(CHOICES);
    const opp = keys[Math.floor(Math.random() * 3)];
    resolve(c, opp);
}

function resolve(you, opp) {
    state.yourChoice = you; state.oppChoice = opp;
    if (you !== opp) {
        if (beats[you] === opp) state.scoreYou++;
        else state.scoreOpp++;
    }
    renderScores();
    $("yourPick").textContent = CHOICES[you];
    $("oppPick").textContent = CHOICES[opp];
    const t = $("resultTitle");
    t.className = "result-title";
    if (you === opp) { t.textContent = "It's a Tie!"; t.classList.add("draw"); }
    else if (beats[you] === opp) { t.textContent = "You Win!"; t.classList.add("win"); }
    else { t.textContent = "You Lost!"; t.classList.add("lose"); }
    // Always show result screen, change button text on last round
    if (state.round >= state.totalRounds) {
        $("nextBtn").textContent = "See Results";
    } else {
        $("nextBtn").textContent = "Next Round";
    }
    show("resultScreen");
}

$("nextBtn").addEventListener("click", () => {
    if (state.round >= state.totalRounds) {
        showMatchEnd();
    } else {
        state.round++;
        $("roundNum").textContent = state.round;
        $("turnInfo").textContent = "";
        show("playingScreen");
    }
});
$("quitBtn").addEventListener("click", goHome);
$("homeBtn").addEventListener("click", goHome);

function goHome() {
    state.round = 1;
    state.scoreYou = 0;
    state.scoreOpp = 0;
    state.yourChoice = null;
    state.oppChoice = null;
    renderScores();
    $("nextBtn").textContent = "Next Round";
    show("setupScreen");
}

function showMatchEnd() {
    let title;
    if (state.scoreYou > state.scoreOpp) title = "You Won the Match!";
    else if (state.scoreYou < state.scoreOpp) title = "PC Won the Match!";
    else title = "It's a Draw!";
    $("matchTitle").textContent = title;
    $("matchSubtitle").textContent = `Final Score: You ${state.scoreYou} - PC ${state.scoreOpp}`;
    show("matchEndScreen");
}

// Rules modal
$("rulesBtn").addEventListener("click", () => $("rulesModal").classList.add("active"));
$("closeRules").addEventListener("click", () => $("rulesModal").classList.remove("active"));
$("rulesModal").addEventListener("click", e => {
    if (e.target.id === "rulesModal") e.currentTarget.classList.remove("active");
});

updateOppLabels();
