const typewriterText = document.getElementById("typewriterText");
const userInput = document.getElementById("userInput");
const themeToggle = document.getElementById("themeToggle");
const capsLockKey = document.querySelector('[data-char="CAPSLOCK"]');

let audioCtx = null;
let paperContent = "";
let capsLockEnabled = false;

function getAudioCtx() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            audioCtx = null;
        }
    }

    if (audioCtx && audioCtx.state === "suspended") {
        audioCtx.resume().catch(() => {});
    }

    return audioCtx;
}

function playClick(noiseVol, freq1, freq2, dur) {
    const ctx = getAudioCtx();
    if (!ctx) return;

    try {
        const now = ctx.currentTime;
        const bufSize = Math.ceil(ctx.sampleRate * dur);
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
        const data = buf.getChannelData(0);

        for (let i = 0; i < bufSize; i++) {
            const env = Math.pow(1 - i / bufSize, 3);
            data[i] = (Math.random() * 2 - 1) * env;
        }

        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        const hpf = ctx.createBiquadFilter();

        hpf.type = "highpass";
        hpf.frequency.value = 800;

        noise.buffer = buf;
        noiseGain.gain.setValueAtTime(noiseVol, now);
        noise.connect(hpf);
        hpf.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(freq1, now);
        osc.frequency.exponentialRampToValueAtTime(freq2, now + dur);

        gain.gain.setValueAtTime(noiseVol * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        osc.start(now);
        osc.stop(now + dur);
    } catch (error) {
        // Silent fail for browsers that block audio setup
    }
}

function playKeyClick() {
    playClick(0.55, 900, 200, 0.035);
}

function playHeavyKey() {
    playClick(0.40, 140, 75, 0.12);
}

function playSpaceClick() {
    playHeavyKey();
}

function playReturn() {
    playHeavyKey();
}

function playBackspace() {
    playHeavyKey();
}

function renderPaper() {
    typewriterText.textContent = paperContent;
}

function syncInput() {
    if (userInput.value !== paperContent) {
        userInput.value = paperContent;
    }
}

function isLetter(char) {
    return /^[a-z]$/i.test(char);
}

function setCapsLockState(nextState) {
    capsLockEnabled = Boolean(nextState);

    if (capsLockKey) {
        capsLockKey.classList.toggle("active", capsLockEnabled);
        capsLockKey.setAttribute("aria-pressed", String(capsLockEnabled));
    }
}

function toggleCapsLock() {
    setCapsLockState(!capsLockEnabled);
    flashKey("CAPSLOCK");
}

function transformLetter(letter, shiftKey = false) {
    const base = letter.toLowerCase();
    const upper = capsLockEnabled !== shiftKey;
    return upper ? base.toUpperCase() : base.toLowerCase();
}

function getKeyElement(token) {
    const normalized = token === " "
        ? "SPACE"
        : token.length === 1 && isLetter(token)
            ? token.toLowerCase()
            : token.toUpperCase();

    return Array.from(document.querySelectorAll(".key")).find((btn) => btn.dataset.char === normalized) || null;
}

function flashKey(token) {
    const key = getKeyElement(token);
    if (!key) return;

    key.classList.add("pressed");
    setTimeout(() => key.classList.remove("pressed"), 130);
}

function insertText(text, shouldFlash = true) {
    if (typeof text !== "string" || text.length === 0) return;

    paperContent += text;
    renderPaper();
    syncInput();

    if (text === " ") {
        playSpaceClick();
        if (shouldFlash) flashKey("SPACE");
        return;
    }

    if (text === "\n") {
        playReturn();
        if (shouldFlash) flashKey("ENTER");
        return;
    }

    playKeyClick();
    if (shouldFlash) flashKey(text);
}

function deleteCharFromPaper() {
    if (paperContent.length === 0) return;

    paperContent = paperContent.slice(0, -1);
    renderPaper();
    syncInput();
    playBackspace();
    flashKey("BACKSPACE");
}

function handleButtonPress(char) {
    if (char === "CAPSLOCK") {
        toggleCapsLock();
        return;
    }

    if (char === "BACKSPACE") {
        deleteCharFromPaper();
        userInput.focus();
        return;
    }

    if (char === "ENTER") {
        insertText("\n");
        userInput.focus();
        return;
    }

    if (char === "SPACE") {
        insertText(" ");
        userInput.focus();
        return;
    }

    if (isLetter(char)) {
        insertText(transformLetter(char, false));
        userInput.focus();
        return;
    }

    insertText(char);
    userInput.focus();
}

function toggleTheme() {
    const isLight = document.body.classList.toggle("light-theme");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
}

document.querySelectorAll(".key").forEach((key) => {
    const trigger = (event) => {
        event.preventDefault();
        handleButtonPress(key.dataset.char);
    };

    key.addEventListener("mousedown", trigger);
    key.addEventListener("touchstart", trigger, { passive: false });
});

userInput.addEventListener("input", () => {
    paperContent = userInput.value;
    renderPaper();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "CapsLock") {
        event.preventDefault();
        toggleCapsLock();
        return;
    }

    const isTypingField = event.target === userInput;

    if (event.key === "Backspace") {
        flashKey("BACKSPACE");

        if (!isTypingField) {
            event.preventDefault();
            deleteCharFromPaper();
        } else {
            playBackspace();
        }

        return;
    }

    if (event.key === "Enter") {
        flashKey("ENTER");

        if (!isTypingField) {
            event.preventDefault();
            insertText("\n");
        } else {
            playReturn();
        }

        return;
    }

    if (event.key === " ") {
        flashKey("SPACE");

        if (!isTypingField) {
            event.preventDefault();
            insertText(" ");
        } else {
            playSpaceClick();
        }

        return;
    }

    if (event.key.length === 1) {
        if (isLetter(event.key)) {
            flashKey(event.key);

            if (!isTypingField) {
                event.preventDefault();
                insertText(transformLetter(event.key, event.shiftKey));
            } else {
                playKeyClick();
            }

            return;
        }

        flashKey(event.key);

        if (!isTypingField) {
            event.preventDefault();
            insertText(event.key);
        } else {
            playKeyClick();
        }
    }
});

themeToggle.addEventListener("click", toggleTheme);
themeToggle.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleTheme();
    }
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "☀️";
}

setCapsLockState(false);
paperContent = userInput.value || "";
renderPaper();
syncInput();