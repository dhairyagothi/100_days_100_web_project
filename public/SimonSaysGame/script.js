// script.js
const normalColours = ["red", "blue", "green", "yellow"];
const advancedColours = ["red", "blue", "green", "yellow", "purple", "cyan"];

let buttonColours = normalColours;
let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;
let highScore = localStorage.getItem("simonHighScore") || 0;
let isAdvanced = false;

// Audio context for generating sounds
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const sounds = {
    green: 329.63, // E4
    red: 261.63,   // C4
    yellow: 293.66,// D4
    blue: 392.00,  // G4
    purple: 440.00,// A4
    cyan: 493.88,  // B4
    wrong: 100     // Low freq for wrong
};

document.getElementById("high-score").innerText = highScore;

// Mode Toggle Event
const modeToggle = document.getElementById("mode-toggle");
const modeLabel = document.getElementById("mode-label");
const advancedBtns = document.querySelectorAll(".advanced-only");

modeToggle.addEventListener("change", function() {
    if(started) {
        startOver(); // Reset if playing
        document.getElementById("level-title").innerText = "Press Any Key to Start";
    }
    
    isAdvanced = this.checked;
    
    if (isAdvanced) {
        modeLabel.innerText = "Advanced Mode";
        modeLabel.style.color = "var(--red)";
        buttonColours = advancedColours;
        advancedBtns.forEach(btn => btn.classList.remove("hidden"));
    } else {
        modeLabel.innerText = "Normal Mode";
        modeLabel.style.color = "var(--text-light)";
        buttonColours = normalColours;
        advancedBtns.forEach(btn => btn.classList.add("hidden"));
        document.querySelector(".game-board").style.transform = "rotate(0deg)";
    }
});

function playTone(frequency, type = 'sine', duration = 0.2) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

document.addEventListener("keydown", startGame);
document.getElementById("level-title").addEventListener("click", startGame);

function startGame() {
    if (!started) {
        document.getElementById("level-title").innerText = "Level " + level;
        document.querySelector(".score-container").style.display = "block";
        nextSequence();
        started = true;
    }
}

const buttons = document.querySelectorAll(".btn");

buttons.forEach(btn => {
    btn.addEventListener("click", function(e) {
        if (!started) return;
        
        const userChosenColour = e.target.id;
        userClickedPattern.push(userChosenColour);

        playSound(userChosenColour);
        animatePress(userChosenColour);

        checkAnswer(userClickedPattern.length - 1);
    });
});

function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length){
            setTimeout(function () {
                nextSequence();
            }, 800); // Wait a bit before next sequence
        }
    } else {
        playSound("wrong");
        
        document.body.classList.add("game-over");
        document.getElementById("level-title").innerHTML = "Game Over, Press Any Key to Restart";

        setTimeout(function () {
            document.body.classList.remove("game-over");
        }, 200);

        if (level - 1 > highScore) {
            highScore = level - 1;
            localStorage.setItem("simonHighScore", highScore);
            document.getElementById("high-score").innerText = highScore;
        }

        startOver();
    }
}

function nextSequence() {
    userClickedPattern = [];
    level++;
    document.getElementById("level-title").innerText = "Level " + level;

    // Advanced feature: Rotate board randomly
    if (isAdvanced) {
        const rotations = [0, 90, 180, -90];
        const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];
        document.querySelector(".game-board").style.transform = `rotate(${randomRotation}deg)`;
    }

    const randomNumber = Math.floor(Math.random() * buttonColours.length);
    const randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    // Advanced feature: Faster playback speed
    let delay = isAdvanced ? Math.max(150, 600 - (level * 30)) : 500;

    let i = 0;
    const interval = setInterval(() => {
        const color = gamePattern[i];
        const targetBtn = document.getElementById(color);
        
        targetBtn.style.filter = "brightness(1.5)";
        targetBtn.style.transform = "scale(1.1)";
        playSound(color);
        
        setTimeout(() => {
            targetBtn.style.filter = "";
            targetBtn.style.transform = "";
        }, delay / 2);

        i++;
        if (i >= gamePattern.length) {
            clearInterval(interval);
        }
    }, delay);
}

function playSound(name) {
    if (name === "wrong") {
        playTone(sounds.wrong, 'sawtooth', 0.5);
    } else {
        playTone(sounds[name], 'sine');
    }
}

function animatePress(currentColor) {
    const btn = document.getElementById(currentColor);
    btn.classList.add("pressed");
    
    btn.style.color = `var(--${currentColor})`;

    setTimeout(function () {
        btn.classList.remove("pressed");
        btn.style.color = "";
    }, 150);
}

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    document.querySelector(".game-board").style.transform = "rotate(0deg)";
}
