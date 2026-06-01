const typewriterText = document.getElementById("typewriterText");
const userInput = document.getElementById("userInput");
const themeToggle = document.getElementById("themeToggle");
//Sound-Toggle Button Feature added***********************************
const soundToggle = document.getElementById("soundToggle");
//Theme-toggle Feature Added
const themeSelector = document.getElementById("themeSelector");
const resetBtn = document.getElementById("resetBtn");


// ---- Audio ----
let audioCtx;

let soundEnabled = true;

function getAudioCtx() {
    if (!audioCtx) {
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
        }
    }
    return audioCtx;
}

// Realistic typewriter clack — sharp noise burst + pitched transient


//Replaced playclick() Function.
function playClick(noiseVol, freq1, freq2, dur) {

    // STOP SOUND IF MUTED
    if (!soundEnabled) return;

    const ctx = getAudioCtx();

    if (!ctx) return;

    try {

        const now = ctx.currentTime;

        const bufSize =
            Math.ceil(ctx.sampleRate * dur);

        const buf =
            ctx.createBuffer(
                1,
                bufSize,
                ctx.sampleRate
            );

        const data =
            buf.getChannelData(0);

        for (let i = 0; i < bufSize; i++) {

            const env =
                Math.pow(1 - i / bufSize, 3);

            data[i] =
                (Math.random() * 2 - 1) * env;
        }

        const noise =
            ctx.createBufferSource();

        const noiseGain =
            ctx.createGain();

        const hpf =
            ctx.createBiquadFilter();

        hpf.type = 'highpass';

        hpf.frequency.value = 800;

        noise.buffer = buf;

        noiseGain.gain.setValueAtTime(
            noiseVol,
            now
        );

        noise.connect(hpf);

        hpf.connect(noiseGain);

        noiseGain.connect(ctx.destination);

        noise.start(now);

        const osc =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        osc.connect(gain);

        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(
            freq1,
            now
        );

        osc.frequency.exponentialRampToValueAtTime(
            freq2,
            now + dur
        );

        gain.gain.setValueAtTime(
            noiseVol * 0.5,
            now
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            now + dur
        );

        osc.start(now);

        osc.stop(now + dur);

    } catch (e) {
    }
}

// Letters & numbers: sharp crisp clack — same sound for all
function playKeyClick() {
    playClick(0.55, 900, 200, 0.035);
}

// RET, SPACE, DEL: one unified heavy thud — clearly different from letter keys
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

// ---- Live typing on paper ----
// The paper shows what the user types character by character with the sound.
// Input box is synced.

let paperContent = '';

let startTime = null;

const wpmDisplay =
    document.getElementById("wpm");

const charDisplay =
    document.getElementById("charCount");

const timerDisplay =
    document.getElementById("timer");

function scrollPaperToBottom() {
    const paperSheet = document.querySelector('.paper-sheet');

    paperSheet.scrollTo({
        top: paperSheet.scrollHeight,
        behavior: "smooth"
    });
}

function addCharToPaper(ch) {

    // START TIMER
    if (!startTime) {
        startTime = new Date();
    }

    paperContent += ch;

    typewriterText.textContent = paperContent;
    //Saved Paper content
    localStorage.setItem(
        "savedPaper",
        paperContent
    );

    scrollPaperToBottom();

    if (ch === ' ')
        playSpaceClick();

    else
        playKeyClick();

    if (ch !== '\n')
        flashKey(ch.toUpperCase());

    updateStats();
}


function deleteCharFromPaper() {

    if (paperContent.length === 0)
        return;

    paperContent = paperContent.slice(0, -1);

    typewriterText.textContent = paperContent;
    /*Save After Delete*/
    localStorage.setItem(
        "savedPaper",
        paperContent
    );

    scrollPaperToBottom();

    playBackspace();

    updateStats();
}

function clearPaper() {

    paperContent = '';

    typewriterText.textContent = '';
    /*Save data On Reset*/
    localStorage.removeItem(
        "savedPaper");

    startTime = null;

    updateStats();
}

function updateStats() {

    // CHARACTER COUNT
    charDisplay.textContent =
        paperContent.length;

    // TIMER
    let seconds = 0;

    if (startTime) {

        seconds =
            Math.floor(
                (new Date() - startTime) / 1000
            );
    }

    timerDisplay.textContent =
        `${seconds}s`;

    // WORD COUNT
    const words =
        paperContent
            .trim()
            .split(/\s+/)
            .filter(word => word !== "")
            .length;

    // WPM
    const minutes =
        seconds / 60;

    const wpm =
        minutes > 0
            ? Math.round(words / minutes)
            : 0;

    wpmDisplay.textContent =
        wpm;
}

// ---- Flash key highlight ----
function flashKey(char) {
    const key = document.querySelector(`.key[data-char="${char}"]`);
    if (!key) return;
    key.classList.add('pressed');
    setTimeout(() => key.classList.remove('pressed'), 130);
}

// ---- Physical keyboard → paper ----
document.addEventListener('keydown', (e) => {

    // Prevent typing directly inside input field
    e.preventDefault();

    if (e.key === 'Backspace') {
        deleteCharFromPaper();
        flashKey('BACKSPACE');
        return;
    }

    if (e.key === 'Enter') {
        paperContent += '\n';
        typewriterText.textContent = paperContent;
        scrollPaperToBottom();
        playReturn();
        flashKey('ENTER');
        return;
    }

    // Allow both uppercase and lowercase typing
    if (e.key.length === 1) {
        addCharToPaper(e.key);

        // Highlight matching virtual key
        flashKey(e.key.toUpperCase());
    }
});

// Allows User to write special Character and symbols

// ---- On-screen keys → paper ----
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const ch = key.dataset.char;
        if (ch === 'BACKSPACE') {
            deleteCharFromPaper();
            return;
        }
        if (ch === 'ENTER') {
            paperContent += '\n';
            typewriterText.textContent = paperContent;
            /*Auto save Feature**********************************/
            localStorage.setItem(
                "savedPaper",
                paperContent
            );
            scrollPaperToBottom();
            scrollPaperToBottom();
            playReturn();
            return;
        }
        addCharToPaper(ch === ' ' ? ' ' : ch);
    });

    key.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const ch = key.dataset.char;
        if (ch === 'BACKSPACE') {
            deleteCharFromPaper();
            return;
        }
        if (ch === 'ENTER') {
            paperContent += '\n';
            typewriterText.textContent = paperContent;
            playReturn();
            return;
        }
        addCharToPaper(ch === ' ' ? ' ' : ch);
    }, {passive: false});
});

// ---- Theme toggle ----
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    themeToggle.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

/*Multiple-Theme-toggle----*/
themeSelector.addEventListener("change", () => {

    // REMOVE OLD THEMES
    document.body.classList.remove(
        "light-theme",
        "vintage-theme",
        "terminal-theme",
        "newspaper-theme",
        "cyberpunk-theme"
    );

    const selectedTheme =
        themeSelector.value;

    // APPLY SELECTED THEME
    if (selectedTheme !== "dark") {

        document.body.classList.add(
            `${selectedTheme}-theme`
        );
    }

    // SAVE THEME
    localStorage.setItem(
        "selectedTheme",
        selectedTheme
    );
});

//----Sound toggle --------
soundToggle.addEventListener("click", () => {

    soundEnabled = !soundEnabled;

    if (soundEnabled) {

        soundToggle.textContent =
            "🔊 Sound ON";
    } else {

        soundToggle.textContent =
            "🔇 Sound OFF";
    }
});

resetBtn.addEventListener('click', () => {
    clearPaper();
    userInput.value = '';
});

const savedTheme =
    localStorage.getItem("selectedTheme");

if (savedTheme) {

    themeSelector.value = savedTheme;

    if (savedTheme !== "dark") {

        document.body.classList.add(
            `${savedTheme}-theme`
        );
    }
}

setInterval(() => {

    if (paperContent.length > 0) {

        updateStats();
    }

}, 1000);
/*Restore Saved Content on Reload*/
const savedPaper = localStorage.getItem("savedPaper");

if (savedPaper) {

    paperContent = savedPaper;

    typewriterText.textContent = paperContent;
}