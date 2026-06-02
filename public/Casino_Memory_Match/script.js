class SoundEngine {
    constructor() {
        this.context = null;
    }

    ensureContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    play(type) {
        this.ensureContext();
        const now = this.context.currentTime;
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        const tones = {
            flip: [520, 0.06, "triangle"],
            match: [880, 0.12, "sine"],
            miss: [180, 0.16, "sawtooth"],
            win: [1040, 0.22, "sine"]
        };
        const [frequency, duration, wave] = tones[type] || tones.flip;

        oscillator.type = wave;
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.16, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        oscillator.connect(gain);
        gain.connect(this.context.destination);
        oscillator.start(now);
        oscillator.stop(now + duration);
    }
}

class ConfettiBurst {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.particles = [];
        this.running = false;
        window.addEventListener("resize", () => this.resize());
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    launch() {
        this.resize();
        this.particles = Array.from({ length: 150 }, () => ({
            x: this.canvas.width / 2,
            y: this.canvas.height * 0.36,
            vx: (Math.random() - 0.5) * 10,
            vy: Math.random() * -8 - 3,
            size: Math.random() * 7 + 4,
            spin: Math.random() * 0.3,
            angle: Math.random() * Math.PI,
            color: Math.random() > 0.45 ? "#FFD700" : "#DC143C",
            life: 120
        }));

        if (!this.running) {
            this.running = true;
            requestAnimationFrame(() => this.frame());
        }
    }

    frame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(piece => piece.life > 0);

        this.particles.forEach(piece => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vy += 0.17;
            piece.angle += piece.spin;
            piece.life--;

            this.ctx.save();
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate(piece.angle);
            this.ctx.fillStyle = piece.color;
            this.ctx.globalAlpha = Math.max(piece.life / 120, 0);
            this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.62);
            this.ctx.restore();
        });

        if (this.particles.length) {
            requestAnimationFrame(() => this.frame());
        } else {
            this.running = false;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

class MemoryMatchGame {
    constructor() {
        this.board = document.getElementById("gameBoard");
        this.scoreNode = document.getElementById("score");
        this.movesNode = document.getElementById("moves");
        this.timerNode = document.getElementById("timer");
        this.highScoreNode = document.getElementById("highScore");
        this.statusNode = document.getElementById("statusText");
        this.winOverlay = document.getElementById("winOverlay");
        this.winSummary = document.getElementById("winSummary");
        this.sound = new SoundEngine();
        this.confetti = new ConfettiBurst(document.getElementById("confettiCanvas"));
        this.cards = [];
        this.openCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.seconds = 0;
        this.timer = null;
        this.locked = false;
        this.started = false;
        this.highScore = Number(localStorage.getItem("royalMemoryHighScore")) || 0;
        this.deckSeed = [
            { rank: "A", suit: "♠", color: "black" },
            { rank: "K", suit: "♥", color: "red" },
            { rank: "Q", suit: "♦", color: "red" },
            { rank: "J", suit: "♣", color: "black" },
            { rank: "10", suit: "♠", color: "black" },
            { rank: "9", suit: "♥", color: "red" }
        ];
    }

    init() {
        this.bindEvents();
        this.newGame();
    }

    bindEvents() {
        document.getElementById("restartBtn").addEventListener("click", () => this.newGame());
        document.getElementById("playAgainBtn").addEventListener("click", () => this.newGame());
        document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "/";
});

        const modal = document.getElementById("howToPlayModal");
        document.getElementById("howToPlayBtn").addEventListener("click", () => {
            modal.classList.add("open");
            modal.setAttribute("aria-hidden", "false");
        });
        document.getElementById("closeModal").addEventListener("click", () => {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
        });
        modal.addEventListener("click", event => {
            if (event.target === modal) {
                modal.classList.remove("open");
                modal.setAttribute("aria-hidden", "true");
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key.toLowerCase() === "r") this.newGame();
            if (event.code === "Space") {
                event.preventDefault();
                this.flipNextAvailableCard();
            }
            if (event.key === "Escape") {
                modal.classList.remove("open");
                modal.setAttribute("aria-hidden", "true");
            }
        });
    }

    newGame() {
        clearInterval(this.timer);
        this.cards = this.createDeck();
        this.openCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.seconds = 0;
        this.locked = false;
        this.started = false;
        this.winOverlay.classList.remove("open");
        this.winOverlay.setAttribute("aria-hidden", "true");
        this.statusNode.textContent = "Press Space or tap a card to begin.";
        this.render();
        this.updateHud();
    }

    createDeck() {
        const paired = this.deckSeed.flatMap((card, pairIndex) => [
            { ...card, id: `${pairIndex}-a`, pairId: pairIndex, matched: false },
            { ...card, id: `${pairIndex}-b`, pairId: pairIndex, matched: false }
        ]);
        return this.fisherYates(paired);
    }

    fisherYates(items) {
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    render() {
        this.board.innerHTML = "";
        this.cards.forEach((card, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "memory-card";
            button.dataset.id = card.id;
            button.style.animationDelay = `${index * 55}ms`;
            button.setAttribute("aria-label", "Face down playing card");
            button.innerHTML = `
                <span class="memory-card-inner">
                    <span class="card-face card-back"></span>
                    <span class="card-face card-front ${card.color}">
                        <span class="rank">${card.rank}</span>
                        <span class="suit">${card.suit}</span>
                        <span class="rank bottom">${card.rank}</span>
                    </span>
                </span>
            `;
            button.addEventListener("click", () => this.flipCard(card.id));
            this.board.appendChild(button);
        });
    }

    flipCard(cardId) {
        if (this.locked) return;
        const card = this.cards.find(item => item.id === cardId);
        const element = this.cardElement(cardId);
        if (!card || card.matched || this.openCards.includes(card) || !element) return;

        this.startTimer();
        element.classList.add("flipped");
        element.setAttribute("aria-label", `${card.rank} of ${card.suit}`);
        this.openCards.push(card);
        this.sound.play("flip");

        if (this.openCards.length === 2) {
            this.moves++;
            this.updateHud();
            this.checkPair();
        }
    }

    checkPair() {
        const [first, second] = this.openCards;
        this.locked = true;

        if (first.pairId === second.pairId) {
            setTimeout(() => {
                first.matched = true;
                second.matched = true;
                this.cardElement(first.id).classList.add("matched");
                this.cardElement(second.id).classList.add("matched");
                this.matchedPairs++;
                this.score += Math.max(120 - this.moves * 2, 40);
                this.statusNode.textContent = "Matched. The table approves.";
                this.sound.play("match");
                this.bump(this.scoreNode);
                this.openCards = [];
                this.locked = false;
                this.updateHud();
                this.checkWin();
            }, 420);
            return;
        }

        setTimeout(() => {
            this.cardElement(first.id).classList.remove("flipped");
            this.cardElement(second.id).classList.remove("flipped");
            this.score = Math.max(this.score - 10, 0);
            this.statusNode.textContent = "No match. Watch the table closely.";
            this.sound.play("miss");
            this.openCards = [];
            this.locked = false;
            this.updateHud();
        }, 850);
    }

    checkWin() {
        if (this.matchedPairs !== this.deckSeed.length) return;
        clearInterval(this.timer);
        const timeBonus = Math.max(240 - this.seconds, 0);
        const finalScore = this.score + timeBonus;
        this.score = finalScore;
        if (finalScore > this.highScore) {
            this.highScore = finalScore;
            localStorage.setItem("royalMemoryHighScore", String(finalScore));
        }
        this.updateHud();
        this.sound.play("win");
        this.confetti.launch();
        this.winSummary.textContent = `Score ${finalScore} in ${this.formatTime(this.seconds)} with ${this.moves} moves.`;
        this.winOverlay.classList.add("open");
        this.winOverlay.setAttribute("aria-hidden", "false");
    }

    startTimer() {
        if (this.started) return;
        this.started = true;
        this.timer = setInterval(() => {
            this.seconds++;
            this.updateHud();
        }, 1000);
    }

    updateHud() {
        this.scoreNode.textContent = this.score;
        this.movesNode.textContent = this.moves;
        this.timerNode.textContent = this.formatTime(this.seconds);
        this.highScoreNode.textContent = this.highScore;
    }

    flipNextAvailableCard() {
        const next = this.cards.find(card => !card.matched && !this.openCards.includes(card));
        if (next) this.flipCard(next.id);
    }

    cardElement(cardId) {
        return this.board.querySelector(`[data-id="${cardId}"]`);
    }

    formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
        const seconds = (totalSeconds % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    }

    bump(node) {
        node.classList.remove("bump");
        requestAnimationFrame(() => {
            node.classList.add("bump");
            setTimeout(() => node.classList.remove("bump"), 240);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MemoryMatchGame().init();
});
