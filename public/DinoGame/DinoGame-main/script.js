const dino = document.getElementById("dino");
const gameCanvas = document.getElementById("gameCanvas");
const gameOverText = document.getElementById("gameover");
const scoreText = document.getElementById("score");
const finalScoreText = document.getElementById("finalScore");
const bestScoreText = document.getElementById("bestScore");
const speedText = document.getElementById("speed");
const levelText = document.getElementById("level");
const comboText = document.getElementById("combo");
const powerStatusText = document.getElementById("powerStatus");
const coinsText = document.getElementById("coins");
const missionText = document.getElementById("missionText");
const missionProgress = document.getElementById("missionProgress");
const particles = document.getElementById("particles");
const pageBody = document.body;
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const soundToggle = document.getElementById("soundToggle");
const pauseBtn = document.getElementById("pauseBtn");
const difficultySelect = document.getElementById("difficulty");
const bossBanner = document.getElementById("bossBanner");
const shopBtn = document.getElementById("shopBtn");
const shopModal = document.getElementById("shopModal");
const shopClose = document.getElementById("shopClose");
const shopList = document.getElementById("shopList");
const shopCoins = document.getElementById("coinCount");

let gameRunning = false;
let obstacles = [];
let score = 0;
let bestScore = Number(localStorage.getItem("dinoBest")) || 0;
let lastTime = 0;
let spawnTimer = 0;
let scoreTimer = 0;
let elapsedTime = 0;
let baseSpeed = 240;
let currentSpeed = baseSpeed;
let spawnGap = 2000;
let soundEnabled = true;
let audioCtx = null;
let paused = false;
let difficulty = "normal";
let combo = 0;
let powerups = [];
let powerupTimer = 0;
let powerupGap = 9000;
let activePower = null;
let shieldActive = false;
let slowActive = false;
let doubleActive = false;
let jumpCount = 0;
let mission = null;
let dustTimer = 0;
let coins = Number(localStorage.getItem("dinoCoins")) || 0;
let coinAccumulator = 0;
let ownedSkins = JSON.parse(localStorage.getItem("dinoSkins") || "[\"default\"]");
let equippedSkin = localStorage.getItem("dinoEquipped") || "default";
let bossActive = false;
let bossTimer = 0;
let nextBossTime = 60;
let bossWarning = false;

const difficultySettings = {
    easy: { baseSpeed: 200, spawnGap: 2400 },
    normal: { baseSpeed: 240, spawnGap: 2000 },
    hard: { baseSpeed: 285, spawnGap: 1700 }
};

const missionTemplates = [
    { type: "jumps", target: 6, text: "Jump 6 times" },
    { type: "time", target: 18, text: "Survive 18s" },
    { type: "score", target: 150, text: "Reach 150 score" },
    { type: "combo", target: 3, text: "Get 3 combo" }
];

const powerupTypes = ["shield", "slow", "double"];

const skinCatalog = [
    { id: "default", name: "Default", price: 0, desc: "Classic runner" },
    { id: "neon", name: "Neon Dash", price: 12, desc: "Electric glow" },
    { id: "sunset", name: "Sunset", price: 18, desc: "Warm dusk fade" },
    { id: "ghost", name: "Ghost", price: 24, desc: "Light as air" }
];

bestScoreText.textContent = bestScore;
coinsText.textContent = coins;
shopCoins.textContent = coins;
applySkin(equippedSkin);

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playTone(freq, duration, type = "sine") {
    if (!soundEnabled) return;
    initAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function addScore(points, applyCombo = false) {
    let multiplier = 1;
    if (applyCombo) multiplier += Math.min(combo, 10) * 0.1;
    if (doubleActive) multiplier *= 2;
    const gained = Math.round(points * multiplier);
    score += gained;
    scoreText.textContent = score;
    bumpScore();
    coinAccumulator += gained;
    while (coinAccumulator >= 50) {
        addCoins(1);
        coinAccumulator -= 50;
    }
}

function addCoins(amount) {
    coins += amount;
    coinsText.textContent = coins;
    shopCoins.textContent = coins;
    localStorage.setItem("dinoCoins", String(coins));
}

function applySkin(skinId) {
    dino.classList.remove("skin-neon", "skin-sunset", "skin-ghost");
    if (skinId !== "default") dino.classList.add("skin-" + skinId);
    equippedSkin = skinId;
    localStorage.setItem("dinoEquipped", skinId);
    renderShop();
}

function renderShop() {
    if (!shopList) return;
    shopCoins.textContent = coins;
    shopList.innerHTML = "";
    skinCatalog.forEach(skin => {
        const item = document.createElement("div");
        item.className = "shop-item";
        const owned = ownedSkins.includes(skin.id);
        const equipped = equippedSkin === skin.id;
        item.innerHTML = `
            <div>
                <div class="name"><span class="skin-preview skin-${skin.id}"></span>${skin.name}</div>
                <div class="desc">${skin.desc}</div>
            </div>
            <div class="actions">
                <span class="price">${owned ? (equipped ? "Equipped" : "Owned") : skin.price + " coins"}</span>
                ${owned ? `<button data-equip="${skin.id}">${equipped ? "Equipped" : "Equip"}</button>` : `<button data-buy="${skin.id}">Buy</button>`}
            </div>
        `;
        shopList.appendChild(item);
    });
}

function setCombo(value) {
    combo = Math.max(0, value);
    comboText.textContent = combo + "x";
    if (combo >= 3) {
        gameCanvas.classList.add("combo-glow");
    } else {
        gameCanvas.classList.remove("combo-glow");
    }
}

function setPowerStatus(text) {
    powerStatusText.textContent = text;
}

function pickMission() {
    const choice = missionTemplates[Math.floor(Math.random() * missionTemplates.length)];
    mission = {
        type: choice.type,
        target: choice.target,
        text: choice.text,
        complete: false
    };
    missionText.textContent = mission.text;
    missionProgress.style.width = "0%";
}

function updateMission(progress) {
    if (!mission || mission.complete) return;
    const pct = Math.min(100, Math.round((progress / mission.target) * 100));
    missionProgress.style.width = pct + "%";
    if (progress >= mission.target) {
        mission.complete = true;
        missionText.textContent = "Mission complete! +100";
        addScore(100, false);
        addCoins(2);
        playTone(760, 0.16, "triangle");
        setTimeout(pickMission, 800);
    }
}

function makeObstacle(extraOffset = 0, forcedType = null) {
    const obs = document.createElement("div");
    const type = pickObstacleType(forcedType);
    obs.className = "dynamic-obstacle " + type.className;
    obs.style.top = type.top + "px";
    gameCanvas.appendChild(obs);
    const startX = gameCanvas.offsetWidth + 10 + extraOffset;
    obstacles.push({ el: obs, x: startX });
}

function moveObstacles(delta) {
    const deltaSec = delta / 1000;
    const passX = dino.offsetLeft + 40;
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= currentSpeed * deltaSec;
        obs.el.style.left = obs.x + "px";
        if (!obs.passed && obs.x < passX) {
            obs.passed = true;
            if (dino.classList.contains("animD")) {
                setCombo(combo + 1);
            } else {
                setCombo(0);
            }
        }
        if (obs.x < -80) {
            gameCanvas.removeChild(obs.el);
            obstacles.splice(i, 1);
            addScore(10, true);
            if (score % 50 === 0) playTone(880, 0.12, "triangle");
        }
    }
}

function checkHit() {
    for (const obs of obstacles) {
        if (obs.x > 15 && obs.x < 170) {
            const dinoRect = dino.getBoundingClientRect();
            const obsRect = obs.el.getBoundingClientRect();
            const dinoPad = { x: 18, y: 12 };
            const obsPad = { x: 10, y: 8 };
            const dinoHit = {
                left: dinoRect.left + dinoPad.x,
                right: dinoRect.right - dinoPad.x,
                top: dinoRect.top + dinoPad.y,
                bottom: dinoRect.bottom - dinoPad.y
            };
            const obsHit = {
                left: obsRect.left + obsPad.x,
                right: obsRect.right - obsPad.x,
                top: obsRect.top + obsPad.y,
                bottom: obsRect.bottom - obsPad.y
            };
            if (dinoHit.bottom > obsHit.top &&
                dinoHit.right > obsHit.left &&
                dinoHit.left < obsHit.right &&
                dinoHit.top < obsHit.bottom) {
                if (shieldActive) {
                    shieldActive = false;
                    clearActivePower();
                    setCombo(0);
                    gameCanvas.removeChild(obs.el);
                    obstacles = obstacles.filter(item => item !== obs);
                    playTone(420, 0.12, "square");
                    return;
                }
                endGame();
            }
        }
    }
}

function updateDifficulty() {
    const level = Math.floor(elapsedTime / 6) + 1;
    currentSpeed = baseSpeed + (level - 1) * 25;
    spawnGap = Math.max(650, difficultySettings[difficulty].spawnGap - (level - 1) * 120);
    if (bossActive) {
        currentSpeed *= 1.35;
        spawnGap *= 0.55;
    }
    if (slowActive) {
        currentSpeed *= 0.7;
        spawnGap *= 1.2;
    }
    speedText.textContent = (currentSpeed / baseSpeed).toFixed(1) + "x";
    levelText.textContent = level;
}

function startBossWave() {
    bossActive = true;
    bossTimer = 0;
    bossBanner.textContent = "Boss Wave!";
    bossBanner.classList.add("show");
    gameCanvas.classList.add("boss-wave");
    setTimeout(() => bossBanner.classList.remove("show"), 1800);
}

function endBossWave() {
    bossActive = false;
    bossTimer = 0;
    nextBossTime += 60;
    addCoins(3);
    gameCanvas.classList.remove("boss-wave");
}

function endGame() {
    gameRunning = false;
    finalScoreText.textContent = score;
    gameOverText.classList.add("over");
    restartBtn.style.display = "inline-block";
    playTone(180, 0.3, "sawtooth");
    dino.classList.remove("running");
    clearActivePower();
    setCombo(0);

    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("dinoBest", String(bestScore));
        bestScoreText.textContent = bestScore;
    }
}

function clearObstacles() {
    obstacles.forEach(obs => gameCanvas.removeChild(obs.el));
    obstacles = [];
}

function clearPowerups() {
    powerups.forEach(item => gameCanvas.removeChild(item.el));
    powerups = [];
}

function spawnPowerup() {
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    const el = document.createElement("div");
    el.className = "powerup " + type;
    el.textContent = type === "shield" ? "S" : type === "slow" ? "T" : "X";
    el.style.top = "280px";
    gameCanvas.appendChild(el);
    const startX = gameCanvas.offsetWidth + 10;
    powerups.push({ el, x: startX, type });
}

function movePowerups(delta) {
    const deltaSec = delta / 1000;
    for (let i = powerups.length - 1; i >= 0; i--) {
        const item = powerups[i];
        item.x -= currentSpeed * 0.8 * deltaSec;
        item.el.style.left = item.x + "px";
        if (item.x < -60) {
            gameCanvas.removeChild(item.el);
            powerups.splice(i, 1);
        }
    }
}

function checkPowerupPickup() {
    const dinoRect = dino.getBoundingClientRect();
    for (let i = powerups.length - 1; i >= 0; i--) {
        const item = powerups[i];
        const itemRect = item.el.getBoundingClientRect();
        if (dinoRect.right > itemRect.left &&
            dinoRect.left < itemRect.right &&
            dinoRect.bottom > itemRect.top &&
            dinoRect.top < itemRect.bottom) {
            applyPowerup(item.type);
            gameCanvas.removeChild(item.el);
            powerups.splice(i, 1);
        }
    }
}

function applyPowerup(type) {
    clearActivePower();
    const duration = type === "shield" ? 12 : type === "slow" ? 8 : 10;
    activePower = { type, expiresAt: elapsedTime + duration };
    shieldActive = type === "shield";
    slowActive = type === "slow";
    doubleActive = type === "double";
    setPowerStatus(type === "shield" ? "Shield" : type === "slow" ? "Slow" : "Double");
    playTone(640, 0.12, "triangle");
}

function updatePowerupTimers() {
    if (activePower && elapsedTime >= activePower.expiresAt) {
        clearActivePower();
    }
}

function clearActivePower() {
    activePower = null;
    shieldActive = false;
    slowActive = false;
    doubleActive = false;
    setPowerStatus("None");
}

function restartGame() {
    clearObstacles();
    gameOverText.classList.remove("over");
    startGame();
}

function jump() {
    if (!dino.classList.contains("animD")) {
        dino.classList.add("animD");
        playTone(520, 0.08, "square");
        jumpCount += 1;
        setTimeout(() => dino.classList.remove("animD"), 900);
    }
}

function startGame() {
    gameRunning = true;
    score = 0;
    elapsedTime = 0;
    spawnTimer = 0;
    scoreTimer = 0;
    lastTime = 0;
    powerupTimer = 0;
    dustTimer = 0;
    jumpCount = 0;
    bossActive = false;
    bossTimer = 0;
    nextBossTime = 60;
    bossWarning = false;
    setDifficulty(difficultySelect.value);
    currentSpeed = baseSpeed;
    spawnGap = difficultySettings[difficulty].spawnGap;
    scoreText.textContent = score;
    bumpScore();
    speedText.textContent = "1.0x";
    levelText.textContent = "1";
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    gameOverText.classList.remove("over");
    dino.classList.add("running");
    clearObstacles();
    clearPowerups();
    clearActivePower();
    setCombo(0);
    pickMission();
    pageBody.classList.remove("night");
    bossBanner.classList.remove("show");
    gameCanvas.classList.remove("boss-wave");
    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!gameRunning || paused) return;
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    elapsedTime += delta / 1000;
    spawnTimer += delta;
    scoreTimer += delta;
    powerupTimer += delta;
    dustTimer += delta;

    if (spawnTimer >= spawnGap) {
        if (bossActive && Math.random() > 0.55) {
            makeObstacle(0, "boss");
            makeObstacle(120, "boss");
        } else {
            makeObstacle(0, bossActive ? "boss" : null);
        }
        spawnTimer = 0;
    }

    if (scoreTimer >= 1000) {
        addScore(1, false);
        scoreTimer = 0;
    }

    if (powerupTimer >= powerupGap) {
        spawnPowerup();
        powerupTimer = 0;
        powerupGap = 7000 + Math.random() * 6000;
    }

    if (dustTimer >= 120) {
        spawnDust();
        dustTimer = 0;
    }

    if (!bossActive && !bossWarning && elapsedTime >= nextBossTime - 2) {
        bossWarning = true;
        bossBanner.textContent = "Boss Wave Incoming!";
        bossBanner.classList.add("show");
        setTimeout(() => bossBanner.classList.remove("show"), 1500);
    }

    if (!bossActive && elapsedTime >= nextBossTime) {
        bossWarning = false;
        startBossWave();
    }

    if (bossActive) {
        bossTimer += delta / 1000;
        if (bossTimer >= 10) {
            endBossWave();
        }
    }

    pageBody.classList.toggle("night", Math.floor(elapsedTime / 18) % 2 === 1);

    updateDifficulty();
    moveObstacles(delta);
    movePowerups(delta);
    checkPowerupPickup();
    checkHit();
    updatePowerupTimers();

    if (mission) {
        const progress = mission.type === "jumps" ? jumpCount :
            mission.type === "time" ? Math.floor(elapsedTime) :
                mission.type === "combo" ? combo : score;
        updateMission(progress);
    }
    requestAnimationFrame(gameLoop);
}

function pickObstacleType(mode) {
    const allowBirds = elapsedTime > 10;
    const roll = Math.random();
    if (mode === "boss") {
        if (roll > 0.7) return { className: "obstacle-boulder", top: 330 };
        if (roll > 0.4) return { className: "obstacle-tall", top: 310 };
        return { className: "obstacle-stone", top: 360 };
    }
    if (allowBirds && roll > 0.75) {
        return { className: "obstacle-bird", top: 240 };
    }
    if (roll > 0.55) {
        return { className: "obstacle-tall", top: 310 };
    }
    if (roll > 0.3) {
        return { className: "obstacle-stone", top: 360 };
    }
    return { className: "", top: 340 };
}

function setDifficulty(value) {
    difficulty = value;
    baseSpeed = difficultySettings[difficulty].baseSpeed;
}

document.addEventListener("keydown", e => {
    if (e.code === "Space") {
        e.preventDefault();
        if (!gameRunning) startGame();
        jump();
    }
    if (e.code === "KeyP") {
        togglePause();
    }
});

gameCanvas.addEventListener("pointerdown", () => {
    if (!gameRunning) startGame();
    jump();
});

soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
    if (soundEnabled) playTone(660, 0.1, "triangle");
});

pauseBtn.addEventListener("click", togglePause);

difficultySelect.addEventListener("change", e => {
    setDifficulty(e.target.value);
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

shopBtn.addEventListener("click", () => {
    shopModal.classList.add("open");
    shopModal.setAttribute("aria-hidden", "false");
    renderShop();
    if (gameRunning && !paused) togglePause();
});

shopClose.addEventListener("click", () => {
    shopModal.classList.remove("open");
    shopModal.setAttribute("aria-hidden", "true");
});

shopList.addEventListener("click", e => {
    const buyId = e.target.getAttribute("data-buy");
    const equipId = e.target.getAttribute("data-equip");
    if (buyId) {
        const skin = skinCatalog.find(item => item.id === buyId);
        if (skin && coins >= skin.price) {
            coins -= skin.price;
            coinsText.textContent = coins;
            localStorage.setItem("dinoCoins", String(coins));
            if (!ownedSkins.includes(buyId)) ownedSkins.push(buyId);
            localStorage.setItem("dinoSkins", JSON.stringify(ownedSkins));
            applySkin(buyId);
        }
        renderShop();
    }
    if (equipId) {
        applySkin(equipId);
    }
});

function togglePause() {
    if (!gameRunning) return;
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
    if (!paused) {
        lastTime = 0;
        dino.classList.add("running");
        requestAnimationFrame(gameLoop);
    } else {
        dino.classList.remove("running");
    }
}

function bumpScore() {
    scoreText.classList.remove("bump");
    void scoreText.offsetWidth;
    scoreText.classList.add("bump");
}

function spawnDust() {
    if (!particles) return;
    const dust = document.createElement("span");
    dust.className = "dust";
    const dinoRect = dino.getBoundingClientRect();
    const canvasRect = gameCanvas.getBoundingClientRect();
    dust.style.left = (dinoRect.left - canvasRect.left + 30) + "px";
    dust.style.top = (dinoRect.top - canvasRect.top + 80) + "px";
    particles.appendChild(dust);
    dust.addEventListener("animationend", () => dust.remove());
}
