document.addEventListener("DOMContentLoaded", () => {

    /* ── DOM REFS ──────────────────────────────────── */
    const leftPeopleEl   = document.getElementById("left-people");
    const rightPeopleEl  = document.getElementById("right-people");
    const boatPeopleEl   = document.getElementById("boat-people");
    const boatEl         = document.getElementById("boat");
    const messageEl      = document.getElementById("message");
    const guidanceEl     = document.getElementById("guidance");
    const moveCountEl    = document.getElementById("move-count");
    const timerEl        = document.getElementById("timer-display");
    const bestEl         = document.getElementById("best-display");
    const boatCapEl      = document.getElementById("boat-capacity");
    const leftCountEl    = document.getElementById("left-count");
    const rightCountEl   = document.getElementById("right-count");
    const hintsLeftEl    = document.getElementById("hints-left");
    const hintTextEl     = document.getElementById("hint-text");
    const startBtn       = document.getElementById("start-reset");
    const moveBoatBtn    = document.getElementById("move-boat");
    const hintBtn        = document.getElementById("hint-btn");
    const undoBtn        = document.getElementById("undo-btn");
    const themeToggle    = document.getElementById("theme-toggle");
    const instructionsBtn= document.getElementById("instructions-btn");
    const instructModal  = document.getElementById("instructions-modal");
    const closeModalBtn  = document.getElementById("close-modal");
    const modalStartBtn  = document.getElementById("modal-start-btn");
    const resultsModal   = document.getElementById("results-modal");
    const restartBtn     = document.getElementById("restart-btn");
    const resultTitle    = document.getElementById("result-title");
    const resultMessage  = document.getElementById("result-message");
    const resultIcon     = document.getElementById("result-icon");
    const finalMoveEl    = document.getElementById("final-move-count");
    const finalTimeEl    = document.getElementById("final-time");
    const optimalEl      = document.getElementById("optimal-moves");
    const efficiencyEl   = document.getElementById("efficiency-score");
    const starRatingEl   = document.getElementById("star-rating");
    const recordRow      = document.getElementById("record-row");
    const recordValueEl  = document.getElementById("record-value");
    const diffBtns       = document.querySelectorAll(".diff-btn");

    /* ── DIFFICULTY CONFIG ─────────────────────────── */
    const DIFFICULTY = {
        easy:   { count: 3, capacity: 2, optimal: 11, label: "Easy (3+3)" },
        medium: { count: 4, capacity: 2, optimal: 24, label: "Medium (4+4)" },
        hard:   { count: 5, capacity: 3, optimal: 15, label: "Hard (5+5)" },
    };

    let currentDiff = "easy";

    /* ── HINTS per difficulty ──────────────────────── */
    const HINTS = {
        easy: [
            "Try sending two tigers across first.",
            "Never leave sheep alone with more tigers on either bank.",
            "Sometimes bringing one tiger back creates room to balance both sides.",
        ],
        medium: [
            "With 4+4, you need to shuttle people back more carefully.",
            "Try to never leave any sheep with more tigers at any step.",
            "Bringing two tigers at once is safer than mixing sheep and tigers.",
        ],
        hard: [
            "A boat capacity of 3 helps — use it wisely!",
            "With 5+5, plan 3–4 moves ahead before you act.",
            "Returning two people sometimes frees the other bank faster.",
        ]
    };

    /* ── FLAVOR TEXT ───────────────────────────────── */
    const WIN_MESSAGES = [
        "Against all odds, every soul made it across. The river remembers.",
        "Masterfully done. The sheep breathe a sigh of relief.",
        "The tigers snarl, but even they respect this crossing.",
        "A flawless operation. You've outsmarted the jungle itself.",
    ];
    const LOSS_MESSAGES = [
        "The sheep never stood a chance… darkness falls on the riverbank.",
        "A terrible miscalculation. The river runs red tonight.",
        "The tigers win this round. Don't give up — try again!",
        "Oh no! The sheep were outnumbered. A brave but fatal mistake.",
    ];

    /* ── THEME ─────────────────────────────────────── */
    let isDark = true;
    themeToggle.addEventListener("click", () => {
        isDark = !isDark;
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
        themeToggle.textContent = isDark ? "🌙" : "☀️";
    });

    /* ── DIFFICULTY BUTTONS ─────────────────────────── */
    diffBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.dataset.diff === currentDiff) return;
            currentDiff = btn.dataset.diff;
            diffBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if (gameActive) startGame();
        });
    });

    /* ── GAME STATE ─────────────────────────────────── */
    let state = {};
    let history = [];      // for undo
    let gameActive = false;
    let timerInterval = null;
    let elapsedSeconds = 0;
    let hintsUsed = 0;
    let MAX_CAP = 2;
    let TOTAL = 3;

    const defaultState = () => ({
        leftM: TOTAL, leftC: TOTAL,
        rightM: 0,    rightC: 0,
        boatM: 0,     boatC: 0,
        boatSide: "left",
        isOver: false,
        moveCount: 0,
    });

    /* ── BEST SCORE ─────────────────────────────────── */
    const bestKey = () => `mc_best_${currentDiff}`;
    const getBest = () => {
        const v = localStorage.getItem(bestKey());
        return v ? parseInt(v) : null;
    };
    const saveBest = (moves) => {
        const prev = getBest();
        if (prev === null || moves < prev) {
            localStorage.setItem(bestKey(), moves);
            return true;
        }
        return false;
    };
    const refreshBestDisplay = () => {
        const b = getBest();
        bestEl.textContent = b !== null ? `${b} moves` : "—";
    };

    /* ── TIMER ──────────────────────────────────────── */
    const startTimer = () => {
        elapsedSeconds = 0;
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            elapsedSeconds++;
            timerEl.textContent = formatTime(elapsedSeconds);
        }, 1000);
    };
    const stopTimer = () => clearInterval(timerInterval);
    const formatTime = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

    /* ── STATUS MSG ─────────────────────────────────── */
    const setMsg = (text, type = "") => {
        messageEl.textContent = text;
        messageEl.className = type;
    };

    /* ── GUIDANCE ───────────────────────────────────── */
    const updateGuidance = () => {
        if (!gameActive || state.isOver) return;
        const pass = state.boatM + state.boatC;
        if (pass === 0) {
            guidanceEl.textContent = "Click a character on the same side as the boat to board them.";
        } else if (pass < MAX_CAP) {
            guidanceEl.textContent = `Boat has ${pass} passenger. Add one more or click "Move Boat".`;
        } else {
            guidanceEl.textContent = `Boat is full! Click "Move Boat" to cross.`;
        }
    };

    /* ── VALID STATE CHECK ──────────────────────────── */
    const isValidState = (s = state) => {
        if (s.leftM > 0  && s.leftC  > s.leftM)  return false;
        if (s.rightM > 0 && s.rightC > s.rightM) return false;
        return true;
    };

    /* ── START GAME ─────────────────────────────────── */
    const startGame = () => {
        const cfg = DIFFICULTY[currentDiff];
        TOTAL   = cfg.count;
        MAX_CAP = cfg.capacity;

        history = [];
        hintsUsed = 0;
        hintsLeftEl.textContent = 3;
        hintTextEl.textContent  = "";
        hintBtn.disabled  = false;
        undoBtn.disabled  = true;
        moveBoatBtn.disabled = false;
        gameActive = true;

        state = defaultState();
        stopTimer();
        startTimer();
        refreshBestDisplay();
        resultsModal.classList.remove("show");

        boatEl.classList.remove("boat-right");
        setMsg("Move the Sheep 🐑 and Tigers 🐯 safely across!", "success");
        guidanceEl.textContent = "Click a character on the same side as the boat to load them.";
        updateUI();
    };

    /* ── RENDER UI ──────────────────────────────────── */
    const updateUI = () => {
        leftPeopleEl.innerHTML  = "";
        rightPeopleEl.innerHTML = "";
        boatPeopleEl.innerHTML  = "";

        const makePersons = (container, numM, numC, fromBank) => {
            for (let i = 0; i < numM; i++) {
                const el = makePerson("missionary", fromBank);
                container.appendChild(el);
            }
            for (let i = 0; i < numC; i++) {
                const el = makePerson("cannibal", fromBank);
                container.appendChild(el);
            }
        };

        makePersons(leftPeopleEl,  state.leftM,  state.leftC,  "left");
        makePersons(rightPeopleEl, state.rightM, state.rightC, "right");
        makePersons(boatPeopleEl,  state.boatM,  state.boatC,  "boat");

        // Boat animation
        if (state.boatSide === "right") {
            boatEl.classList.add("boat-right");
        } else {
            boatEl.classList.remove("boat-right");
        }

        // Boat capacity badge
        const pass = state.boatM + state.boatC;
        boatCapEl.textContent = `${pass}/${MAX_CAP}`;

        // Bank count labels
        const leftTotal  = state.leftM  + state.leftC;
        const rightTotal = state.rightM + state.rightC;
        leftCountEl.textContent  = leftTotal  ? `${state.leftM}🐑 ${state.leftC}🐯` : "Empty";
        rightCountEl.textContent = rightTotal ? `${state.rightM}🐑 ${state.rightC}🐯` : "Empty";

        // Move count
        moveCountEl.textContent = state.moveCount;

        updateGuidance();
    };

    const makePerson = (type, bank) => {
        const el = document.createElement("div");
        el.classList.add("person", type);
        el.textContent = type === "missionary" ? "🐑" : "🐯";
        el.dataset.type = type;
        el.dataset.bank = bank;
        el.addEventListener("click", () => onPersonClick(el));
        // drag support
        el.setAttribute("draggable", "true");
        el.addEventListener("dragstart", onDragStart);
        return el;
    };

    /* ── CHECK WIN/LOSS ─────────────────────────────── */
    const checkGame = () => {
        if (!isValidState()) {
            state.isOver = true;
            gameActive = false;
            stopTimer();
            setMsg("The sheep were outnumbered… 😱 Game Over!", "error");

            // shake banks
            document.getElementById("left-bank").classList.add("danger");
            document.getElementById("right-bank").classList.add("danger");
            setTimeout(() => {
                document.getElementById("left-bank").classList.remove("danger");
                document.getElementById("right-bank").classList.remove("danger");
            }, 1100);

            setTimeout(() => showResults(false), 700);
            return;
        }

        if (state.rightM === TOTAL && state.rightC === TOTAL) {
            state.isOver = true;
            gameActive = false;
            stopTimer();
            setMsg(`🎉 Victory in ${state.moveCount} moves!`, "victory");
            launchConfetti();
            setTimeout(() => showResults(true), 900);
        }
    };

    /* ── RESULTS MODAL ──────────────────────────────── */
    const showResults = (isWin) => {
        resultsModal.classList.add("show");
        resultsModal.classList.remove("win", "loss");
        resultsModal.classList.add(isWin ? "win" : "loss");

        resultTitle.textContent   = isWin ? "Victory! 🎉" : "Game Over";
        resultMessage.textContent = isWin
            ? WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
            : LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];

        finalMoveEl.textContent = state.moveCount;
        finalTimeEl.textContent = formatTime(elapsedSeconds);

        if (isWin) {
            const cfg     = DIFFICULTY[currentDiff];
            const optimal = cfg.optimal;
            const moves   = state.moveCount;
            const eff     = Math.round((optimal / moves) * 100);
            optimalEl.textContent   = `${optimal} moves`;
            efficiencyEl.textContent = `${Math.min(eff, 100)}%`;

            const stars = moves <= optimal ? "⭐⭐⭐"
                        : moves <= optimal + 4 ? "⭐⭐"
                        : "⭐";
            starRatingEl.textContent = stars;

            const isNewBest = saveBest(moves);
            if (isNewBest) {
                recordRow.style.display = "flex";
                recordValueEl.textContent = `${moves} moves`;
                refreshBestDisplay();
            } else {
                recordRow.style.display = "none";
            }
        } else {
            optimalEl.textContent    = "—";
            efficiencyEl.textContent = "—";
            starRatingEl.textContent = "—";
            recordRow.style.display  = "none";
        }
    };

    /* ── PERSON CLICK ───────────────────────────────── */
    const onPersonClick = (el) => {
        if (!gameActive || state.isOver) return;
        const bank = el.dataset.bank;
        const type = el.dataset.type;

        if (bank !== state.boatSide && bank !== "boat") {
            setMsg("The boat isn't on that side!", "warning");
            el.classList.add("shake");
            setTimeout(() => el.classList.remove("shake"), 400);
            return;
        }

        if (bank === "boat") {
            // unload to current side
            movePerson("boat", state.boatSide, type);
        } else {
            // load onto boat
            movePerson(bank, "boat", type);
        }
    };

    /* ── MOVE PERSON ────────────────────────────────── */
    const movePerson = (from, to, type) => {
        const isMissionary = type === "missionary";

        // capacity check
        if (to === "boat" && state.boatM + state.boatC >= MAX_CAP) {
            setMsg(`Boat is full! Max ${MAX_CAP} passengers.`, "warning");
            return;
        }

        // save history for undo
        history.push(JSON.parse(JSON.stringify(state)));
        undoBtn.disabled = false;

        // adjust counts
        if (from === "left")  { isMissionary ? state.leftM--  : state.leftC--;  }
        if (from === "right") { isMissionary ? state.rightM-- : state.rightC--; }
        if (from === "boat")  { isMissionary ? state.boatM--  : state.boatC--;  }
        if (to === "left")    { isMissionary ? state.leftM++  : state.leftC++;  }
        if (to === "right")   { isMissionary ? state.rightM++ : state.rightC++; }
        if (to === "boat")    { isMissionary ? state.boatM++  : state.boatC++;  }

        updateUI();
    };

    /* ── MOVE BOAT ──────────────────────────────────── */
    moveBoatBtn.addEventListener("click", () => {
        if (!gameActive || state.isOver) return;

        const pass = state.boatM + state.boatC;
        if (pass === 0) {
            setMsg("At least one passenger needed to sail!", "warning");
            return;
        }

        history.push(JSON.parse(JSON.stringify(state)));
        undoBtn.disabled = false;

        // unload to destination
        const dest = state.boatSide === "left" ? "right" : "left";
        if (dest === "right") {
            state.rightM += state.boatM;
            state.rightC += state.boatC;
        } else {
            state.leftM += state.boatM;
            state.leftC += state.boatC;
        }

        state.boatM = 0;
        state.boatC = 0;
        state.boatSide = dest;
        state.moveCount++;
        moveCountEl.textContent = state.moveCount;

        setMsg(`⛵ Boat arrived at the ${dest} bank.`, "success");
        updateUI();
        checkGame();
    });

    /* ── UNDO ───────────────────────────────────────── */
    undoBtn.addEventListener("click", () => {
        if (history.length === 0) return;
        state = history.pop();
        gameActive = true;
        if (history.length === 0) undoBtn.disabled = true;
        setMsg("Undone! Try a different move.", "warning");
        updateUI();
    });

    /* ── HINTS ──────────────────────────────────────── */
    hintBtn.addEventListener("click", () => {
        if (hintsUsed >= 3) return;
        hintTextEl.textContent = HINTS[currentDiff][hintsUsed];
        hintsUsed++;
        hintsLeftEl.textContent = 3 - hintsUsed;
        if (hintsUsed === 3) hintBtn.disabled = true;
    });

    /* ── DRAG & DROP ────────────────────────────────── */
    let dragType = null;
    let dragFrom = null;

    const onDragStart = (e) => {
        if (!gameActive || state.isOver) { e.preventDefault(); return; }
        dragType = e.target.dataset.type;
        dragFrom = e.target.dataset.bank;
    };

    const setupDrop = (el, bank) => {
        el.addEventListener("dragover", e => e.preventDefault());
        el.addEventListener("drop", e => {
            e.preventDefault();
            if (!dragType) return;
            if (bank === "boat") {
                movePerson(dragFrom, "boat", dragType);
            } else if (dragFrom === "boat") {
                movePerson("boat", bank, dragType);
            }
            dragType = null;
            dragFrom = null;
        });
    };
    setupDrop(leftPeopleEl,  "left");
    setupDrop(rightPeopleEl, "right");
    setupDrop(boatPeopleEl,  "boat");

    /* ── MODALS ─────────────────────────────────────── */
    const showModal  = el => el.classList.add("show");
    const hideModal  = el => el.classList.remove("show");

    instructionsBtn.addEventListener("click", () => showModal(instructModal));
    closeModalBtn.addEventListener("click", () => {
        hideModal(instructModal);
        if (!gameActive) startGame();
    });
    modalStartBtn.addEventListener("click", () => {
        hideModal(instructModal);
        startGame();
    });
    window.addEventListener("click", e => {
        if (e.target === instructModal)  { hideModal(instructModal); if (!gameActive) startGame(); }
        if (e.target === resultsModal)   hideModal(resultsModal);
    });
    restartBtn.addEventListener("click", startGame);
    startBtn.addEventListener("click", startGame);

    /* ── CONFETTI ───────────────────────────────────── */
    const launchConfetti = () => {
        const colors = ["#f6c90e","#667eea","#56ab2f","#fc5c7d","#4facfe","#a8e063","#ff9a3d"];
        for (let i = 0; i < 80; i++) {
            setTimeout(() => {
                const p = document.createElement("div");
                p.classList.add("confetti-particle");
                p.style.left    = `${Math.random() * 100}vw`;
                p.style.top     = `-10px`;
                p.style.background = colors[Math.floor(Math.random() * colors.length)];
                p.style.width   = `${6 + Math.random() * 8}px`;
                p.style.height  = `${6 + Math.random() * 8}px`;
                p.style.animationDuration = `${1.5 + Math.random() * 2}s`;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 3500);
            }, i * 30);
        }
    };

    /* ── INIT ───────────────────────────────────────── */
    refreshBestDisplay();
    showModal(instructModal);
    updateUI();
});