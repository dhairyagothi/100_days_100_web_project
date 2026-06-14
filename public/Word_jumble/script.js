const words = [
    { word: "javascript", hint: "A popular scripting programming language for the web." },
    { word: "computer", hint: "An electronic device for storing and processing data." },
    { word: "garden", hint: "A space designated for the cultivation of plants and flowers." },
    { word: "library", hint: "A building or room containing collections of books." },
    { word: "astronaut", hint: "A person trained to travel in a spacecraft." },
    { word: "balloon", hint: "A brightly colored rubber bag filled with air or gas." },
    { word: "desert", hint: "A barren area of landscape where little precipitation occurs." },
    { word: "airplane", hint: "A powered flying vehicle with fixed wings." },
    { word: "avocado", hint: "A pear-shaped green fruit with a large stone." },
    { word: "aquarium", hint: "A transparent tank of water for fish." },
    { word: "backpack", hint: "A bag with straps that goes on your back." },
    { word: "bamboo", hint: "A giant woody grass eaten by giant pandas." },
    { word: "bicycle", hint: "A vehicle with two wheels pedaled by feet." },
    { word: "blanket", hint: "A large piece of woolen fabric used for warmth." },
    { word: "blizzard", hint: "A severe snowstorm with high winds." },
    { word: "bonsai", hint: "The art of growing ornamental, miniature trees." },
    { word: "butterfly", hint: "An insect with large, often brightly colored wings." },
    { word: "cactus", hint: "A succulent plant with thick fleshy stems and spines." },
    { word: "calendar", hint: "A chart showing the days, weeks, and months." },
    { word: "camera", hint: "A device for recording visual images or videos." },
    { word: "candle", hint: "A cylinder of wax with a central wick." },
    { word: "canyon", hint: "A deep gorge, typically one with a river." },
    { word: "caravan", hint: "A vehicle equipped for living in, pulled by a car." },
    { word: "castle", hint: "A large fortified building or historical residence." },
    { word: "cheetah", hint: "A large spotted cat, the fastest land animal." },
    { word: "chocolate", hint: "A sweet food preparation made from roasted cacao seeds." },
    { word: "cinema", hint: "A theater where motion pictures are shown." },
    { word: "compass", hint: "An instrument containing a magnetized pointer showing direction." },
    { word: "cooking", hint: "The practice or skill of preparing food." },
    { word: "crystal", hint: "A clear, transparent mineral resembling ice." },
    { word: "diamond", hint: "A precious stone consisting of a clear crystalline carbon." },
    { word: "dinosaur", hint: "A fossil reptile of the Mesozoic era." },
    { word: "dolphin", hint: "A small gregarious toothed whale known for intelligence." },
    { word: "dragon", hint: "A mythical monster like a giant winged reptile." },
    { word: "eclipse", hint: "An obscuring of the light from one celestial body." },
    { word: "elephant", hint: "A very large plant-eating mammal with a trunk." },
    { word: "emerald", hint: "A bright green precious stone or jewel." },
    { word: "espresso", hint: "Strong black coffee made by forcing steam through beans." },
    { word: "feather", hint: "The epidermal growths forming the distinctive outer covering of birds." },
    { word: "firefly", hint: "A soft-bodied beetle that glows in the dark." },
    { word: "flamingo", hint: "A tall wading bird with mainly pink plumage." },
    { word: "forest", hint: "A large area covered chiefly with trees." },
    { word: "fountain", hint: "An ornamental structure in a pool that spurts water." },
    { word: "galaxy", hint: "A system of millions or billions of stars." },
    { word: "glacier", hint: "A slowly moving mass or river of ice." },
    { word: "goggles", hint: "Close-fitting glasses with side shields for eye protection." },
    { word: "gorilla", hint: "A heavily built ape, the largest living primate." },
    { word: "guitar", hint: "A stringed musical instrument played with fingers or a plectrum." },
    { word: "hammock", hint: "A bed made of canvas or netting suspended by cords." },
    { word: "harvest", hint: "The process or period of gathering in crops." },
    { word: "helicopter", hint: "An aircraft with overhead rotors for vertical lift." },
    { word: "horizon", hint: "The line at which the earth's surface and sky appear to meet." },
    { word: "hurricane", hint: "A storm with a violent wind, in particular a tropical cyclone." },
    { word: "iceberg", hint: "A large floating mass of ice detached from a glacier." },
    { word: "island", hint: "A piece of land completely surrounded by water." },
    { word: "jacket", hint: "An outer garment extending either to the waist or the hips." },
    { word: "jungle", hint: "An area of land overgrown with dense forest." },
    { word: "kangaroo", hint: "A large marsupial with strong hind legs for leaping." },
    { word: "keyboard", hint: "A panel of keys used to operate a computer." },
    { word: "lantern", hint: "A lamp with a transparent case protecting the flame." },
    { word: "leopard", hint: "A large solitary cat with a yellowish-brown spotted coat." },
    { word: "lighthouse", hint: "A tower with a bright light to guide ships." },
    { word: "lizard", hint: "A reptile that typically has a long body and tail." },
    { word: "luggage", hint: "Suitcases or bags containing a traveler's belongings." },
    { word: "magnet", hint: "A piece of iron that attracts other iron items." },
    { word: "mansion", hint: "A large, impressive, and expensive house." },
    { word: "marathon", hint: "A long-distance running race, strictly 26.2 miles." },
    { word: "microscope", hint: "An optical instrument used for viewing very small objects." },
    { word: "mirror", hint: "A surface that reflects a clear image." },
    { word: "monsoon", hint: "A seasonal prevailing wind bringing heavy rain." },
    { word: "mountain", hint: "A large natural elevation of the earth's surface." },
    { word: "museum", hint: "A building in which objects of interest are stored and exhibited." },
    { word: "necklace", hint: "An ornamental chain or string of beads worn round the neck." },
    { word: "notebook", hint: "A book with blank pages for writing notes." },
    { word: "ocean", hint: "A very large expanse of sea, in particular, each of the main areas." },
    { word: "octopus", hint: "A sea creature with eight long arms." },
    { word: "orchard", hint: "A piece of land planted with fruit trees." },
    { word: "origami", hint: "The Japanese art of folding paper into shapes." },
    { word: "ostrich", hint: "A flightless swift-running African bird, the largest living bird." },
    { word: "painting", hint: "The action or skill of using paint to create art." },
    { word: "palette", hint: "A thin board on which an artist mixes colors." },
    { word: "panther", hint: "A leopard, especially a black one." },
    { word: "passport", hint: "An official travel document issued by a government." },
    { word: "penguin", hint: "A large flightless seabird of the southern hemisphere." },
    { word: "perfume", hint: "A fragrant liquid typically made from essential oils." },
    { word: "pyramid", hint: "A monumental structure with a square base and sloping sides." },
    { word: "rainbow", hint: "An arch of colors formed in the sky by rain reflections." },
    { word: "savanna", hint: "A grassy plain in tropical regions with few trees." },
    { word: "scooter", hint: "A light two-wheeled vehicle with a motor or footboard." },
    { word: "sculpture", hint: "The art of making two- or three-dimensional abstract forms." },
    { word: "shadow", hint: "A dark area produced by a body coming between light rays." },
    { word: "skeleton", hint: "An internal or external framework of bone or cartilage." },
    { word: "skyline", hint: "An outline of land and buildings defined against the sky." },
    { word: "spaceship", hint: "A spacecraft designed to carry a crew into interstellar zones." },
    { word: "squirrel", hint: "An agile tree-dwelling rodent with a bushy tail." },
    { word: "submarine", hint: "A warship designed to operate completely underwater." },
    { word: "telescope", hint: "An optical instrument designed to make distant objects appear nearer." },
    { word: "theater", hint: "A building or outdoor area in which plays are performed." },
    { word: "thunder", hint: "A loud rumbling noise heard after a lightning flash." },
    { word: "tornado", hint: "A mobile, destructive vortex of violently rotating winds." },
    { word: "treasure", hint: "A quantity of precious metals, gems, or valuable objects." },
    { word: "umbrella", hint: "A folding cloth canopy on a metallic frame for rain." },
    { word: "volcano", hint: "A mountain or hill having a crater through which lava erupts." },
    { word: "waterfall", hint: "A cascade of water falling from a height." },
    { word: "zeppelin", hint: "A large German dirigible airship of the early 20th century." }
];


let correctWord = "";
let score = 0;
let highScore = localStorage.getItem("jumbleHighScore") || 0; 
let isNewHighScore = false;

let wrongGuesses = 0;
let skipsLeft = 3;
const maxWrongAllowed = 3;

let timer;
const maxTime = 30;
let timeLeft = maxTime;

// Main View UI Elements
const scrambledWordEl = document.getElementById("scrambled-word");
const hintTextEl = document.getElementById("hint-text");
const userInputEl = document.getElementById("user-input");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score-count");
const livesEl = document.getElementById("lives-count");
const skipsEl = document.getElementById("skips-left");
const messageEl = document.getElementById("message");

const checkBtn = document.getElementById("check-btn");
const refreshBtn = document.getElementById("refresh-btn");
const resetBtn = document.getElementById("reset-btn");

// Custom Modal Overlay Elements
const modalOverlay = document.getElementById("game-over-modal");
const modalIcon = document.getElementById("modal-icon");
const modalTitle = document.getElementById("modal-title");
const modalAppraisal = document.getElementById("modal-appraisal");
const modalFinalScore = document.getElementById("modal-final-score");
const modalBestScore = document.getElementById("modal-best-score");
const modalActionBtn = document.getElementById("modal-action-btn");

function initGame() {
    clearInterval(timer);
    
    let randomObj = words[Math.floor(Math.random() * words.length)];
    correctWord = randomObj.word;
    
    let wordArray = correctWord.split("");
    for (let i = wordArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    
    if (wordArray.join("") === correctWord) {
        return initGame();
    }

    scrambledWordEl.textContent = wordArray.join("");
    hintTextEl.textContent = randomObj.hint;
    userInputEl.value = "";
    userInputEl.disabled = false;
    checkBtn.disabled = false;
    messageEl.textContent = "";
    messageEl.className = "message";
    
    skipsEl.textContent = skipsLeft;
    refreshBtn.disabled = skipsLeft <= 0;
    
    updateLivesDisplay();
    updateScoreDisplay();
    
    timeLeft = maxTime;
    timerEl.textContent = `${timeLeft}s`;
    startTimer();
    
    userInputEl.focus();
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerEl.textContent = `${timeLeft}s`;
        } else {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function checkWord() {
    let userWord = userInputEl.value.toLowerCase().trim();
    
    if (!userWord) {
        showMessage("Type a word first!", "incorrect");
        return;
    }

    if (userWord === correctWord) {
        score += 10;
        
        // Evaluate and flag high score transformations live
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("jumbleHighScore", highScore);
            isNewHighScore = true;
        }
        
        updateScoreDisplay();
        showMessage(`🎉 Brilliant! Word was: ${correctWord.toUpperCase()}`, "correct");
        disableInputs();
        setTimeout(initGame, 1600);
    } else {
        wrongGuesses++;
        updateLivesDisplay();
        
        if (wrongGuesses >= maxWrongAllowed) {
            triggerEndScreen(false); // Game Over by Loss
        } else {
            showMessage(`❌ Incorrect guess! ${maxWrongAllowed - wrongGuesses} attempts left.`, "incorrect");
            userInputEl.value = "";
            userInputEl.focus();
        }
    }
}

function handleSkip() {
    if (skipsLeft > 0) {
        skipsLeft--;
        initGame();
    }
}

function handleTimeOut() {
    wrongGuesses++;
    updateLivesDisplay();
    
    if (wrongGuesses >= maxWrongAllowed) {
        triggerEndScreen(true); // Game Over by running out of time
    } else {
        showMessage(`⏰ Timeout! Next word loading...`, "incorrect");
        setTimeout(initGame, 1600);
    }
}

// Complex appraisal feedback builder engine based on performance results
function triggerEndScreen(isTimeoutReason) {
    clearInterval(timer);
    disableInputs();
    refreshBtn.disabled = true;

    // Load data onto end display card
    modalFinalScore.textContent = score;
    modalBestScore.textContent = highScore;

    // Determine performance appraisal text
    if (isNewHighScore) {
        modalIcon.textContent = "🏆";
        modalTitle.textContent = "New High Score!";
        modalTitle.style.color = "#2ecc71";
        modalAppraisal.textContent = `Incredible performance! You crushed your previous record and set a new gold standard of ${score} points!`;
    } else if (score === 0) {
        modalIcon.textContent = "💤";
        modalTitle.textContent = "Oops, Zero Points!";
        modalTitle.style.color = "#e74c3c";
        modalAppraisal.textContent = "Don't worry, everyone starts somewhere. Check out the hints on the next run!";
    } else if (score >= highScore * 0.75) {
        modalIcon.textContent = "🔥";
        modalTitle.textContent = "So Close!";
        modalTitle.style.color = "#3a86ff";
        modalAppraisal.textContent = `Excellent run! You were right on the heels of your all-time high score. Keep pushing!`;
    } else {
        modalIcon.textContent = isTimeoutReason ? "⏰" : "🎮";
        modalTitle.textContent = "Game Over!";
        modalTitle.style.color = "#ffffff";
        modalAppraisal.textContent = `Good effort! You managed to score ${score} points this round. Can you beat it next time?`;
    }

    // Bring up structural overlay
    modalOverlay.classList.remove("hidden");
}

function closeEndScreen() {
    modalOverlay.classList.add("hidden");
    resetFullGame();
}

function updateLivesDisplay() {
    let hearts = "";
    for (let i = 0; i < maxWrongAllowed - wrongGuesses; i++) {
        hearts += "❤️";
    }
    livesEl.textContent = hearts || "💀";
}

function updateScoreDisplay() {
    scoreEl.innerHTML = `${score} <span style="opacity: 0.5; font-size:11px; font-weight:normal; margin-left:4px;">(Record: ${highScore})</span>`;
}

function showMessage(text, statusClass) {
    messageEl.textContent = text;
    messageEl.className = `message ${statusClass}`;
}

function disableInputs() {
    userInputEl.disabled = true;
    checkBtn.disabled = true;
}

function resetFullGame() {
    score = 0;
    wrongGuesses = 0;
    skipsLeft = 3;
    isNewHighScore = false;
    initGame();
}

// Event Configurations Bindings
checkBtn.addEventListener("click", checkWord);
refreshBtn.addEventListener("click", handleSkip);
resetBtn.addEventListener("click", resetFullGame);
modalActionBtn.addEventListener("click", closeEndScreen);

userInputEl.addEventListener("keyup", (e) => {
    if (e.key === "Enter" && !userInputEl.disabled) checkWord();
});

window.onload = initGame;

// Quit Game
document.getElementById("quitBtn").addEventListener("click", () => {
  clearInterval(timer); 
  alert("Game Over! Thanks for playing.");
  document.getElementById("jumble").textContent = "";
  document.getElementById("hint").textContent = "";
  document.getElementById("score").textContent = "Score: 0 (Record: 0)";
});

// ==========================
// Theme Toggle
// ==========================

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme") || "dark";

if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "🌙";
} else {
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");

  const isLight = document.body.classList.contains("light-theme");

  themeToggle.textContent = isLight ? "🌙" : "☀️";

  localStorage.setItem(
    "theme",
    isLight ? "light" : "dark"
  );
});