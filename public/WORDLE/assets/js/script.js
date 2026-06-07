"use strict";

let playing = true;
let row = 1;
let col = 1;
let inputWord = "";

// Function to get a random word from the shuffledWords array
function getRandomWord() {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return shuffledWords[31 * (month + 1) + day].toUpperCase();
}

let secretWord = getRandomWord();
let currentBox = "b11";

// Selecting elements
const enterButton = document.querySelector(".enter");
const backButton = document.querySelector("#back");
const message = document.querySelector("#message");
const closeInfo = document.querySelector("#closeInfo");
const info = document.querySelector(".info");
const closeStats = document.querySelector("#closeStats");
const stats = document.querySelector(".stats");
const closeResult = document.querySelector("#closeResult");
const resetbutton = document.querySelector("#reset");

// Function to change control based on input
const changeControl = function (type) {
    if (row === 7) {
        playing = false;
        message.textContent = secretWord;
        message.classList.remove("hidden");
    } else {
        if (type < 0) {
            if (Number(currentBox[2]) > 1)
                currentBox = `b${row}${Number(currentBox[2]) - 1}`;
        } else {
            if (Number(currentBox[2]) < 5)
                currentBox = `b${row}${Number(currentBox[2]) + 1}`;
        }
    }
};

// Function to get the value of a specific input box
const getBoxValue = function (elementId) {
    return document.querySelector(`#${elementId}`).value;
};

/**
 * Fix for issue #6151 — Duplicate letter keyboard color hints
 * ─────────────────────────────────────────────────────────────
 * The original implementation used a single-pass loop that called
 * secretWord.includes(word[i]) without accounting for how many times
 * a letter appears in the secret word. This caused duplicate letters
 * in a guess to be over-coloured (e.g. both 'E's in "SPEED" marked
 * yellow even when the secret word only contains one 'E').
 *
 * Fix uses the official Wordle two-pass algorithm:
 *   Pass 1 — mark greens and decrement available letter counts.
 *   Pass 2 — mark yellows only when remaining count > 0, else grey.
 *
 * Keyboard key colour priority: green > yellow > grey.
 * A key already marked green is NEVER downgraded by a later guess.
 */
const checkWord = function (word) {
    // Build a frequency map of available letters in the secret word
    const letterCount = {};
    for (const ch of secretWord) {
        letterCount[ch] = (letterCount[ch] || 0) + 1;
    }

    // Result array: "green" | "yellow" | "grey"
    const result = new Array(5).fill("grey");

    // ── Pass 1: greens ────────────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
        if (word[i] === secretWord[i]) {
            result[i] = "green";
            letterCount[word[i]]--;          // consume one occurrence
        }
    }

    // ── Pass 2: yellows ───────────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
        if (result[i] === "green") continue; // already handled
        if (letterCount[word[i]] > 0) {
            result[i] = "yellow";
            letterCount[word[i]]--;
        }
        // else remains "grey"
    }

    // ── Apply tile colours ────────────────────────────────────────────
    for (let i = 0; i < 5; i++) {
        document.querySelector(`#b${row}${i + 1}`).classList.add(result[i]);
    }

    // ── Apply keyboard key colours (green > yellow > grey, no downgrades) ──
    for (let i = 0; i < 5; i++) {
        const keyEl = document.querySelector(`#${word[i]}`);
        if (!keyEl) continue;

        // Never downgrade a key that is already green
        if (keyEl.classList.contains("green")) continue;

        if (result[i] === "green") {
            keyEl.classList.remove("yellow", "grey");
            keyEl.classList.add("green");
        } else if (result[i] === "yellow" && !keyEl.classList.contains("yellow")) {
            keyEl.classList.remove("grey");
            keyEl.classList.add("yellow");
        } else if (result[i] === "grey" && !keyEl.classList.contains("yellow")) {
            keyEl.classList.add("grey");
        }
    }

    // ── Win check ─────────────────────────────────────────────────────
    if (word === secretWord) {
        message.textContent = appreciation[row - 1];
        message.classList.remove("hidden");
        setTimeout(function () {
            message.classList.add("hidden");
            document.querySelector("#result").classList.remove("hidden");
        }, 1000);
        playing = false;
    }
};

// Event listener for the enter button
enterButton.addEventListener("click", function () {
    if (playing) {
        for (let i = 1; i <= 5; i++) {
            let boxId = `#b${row}${i}`;
            if (document.querySelector(boxId).value !== "") {
                inputWord = inputWord + document.querySelector(boxId).value;
            }
        }

        if (inputWord.length === 5) {
            if (allowedWords.includes(inputWord.toLowerCase())) {
                checkWord(inputWord);
                inputWord = "";
                if (row < 7) {
                    row++;
                    currentBox = `b${row}0`;
                    changeControl(1);
                }
            } else {
                inputWord = "";
                message.textContent = "Word not in list";
                message.classList.remove("hidden");
                setTimeout(function () {
                    message.classList.add("hidden");
                }, 1000);
            }
        } else {
            inputWord = "";
            message.textContent = "Not enough letters";
            message.classList.remove("hidden");
            setTimeout(function () {
                message.classList.add("hidden");
            }, 1000);
        }
    }
});

// Event listener for the back button
backButton.addEventListener("click", function () {
    const boxValue = getBoxValue(currentBox);
    if (boxValue === "") changeControl(-1);
    document.querySelector(`#${currentBox}`).value = "";
});

// Event listeners for virtual keyboard buttons
for (const alphabet of alphabets) {
    document.querySelector(`#${alphabet}`).addEventListener("click", function () {
        if (Number(currentBox[2]) <= 5 && getBoxValue(currentBox) === "" && playing === true) {
            document.querySelector(`#${currentBox}`).value = alphabet;
            changeControl(1);
        }
    });
}

// Event listener for physical keyboard input
document.addEventListener("keydown", function (event) {
    const key = event.key.toUpperCase();
    if (playing && key.length === 1 && key >= 'A' && key <= 'Z') {
        if (Number(currentBox[2]) <= 5 && getBoxValue(currentBox) === "") {
            document.querySelector(`#${currentBox}`).value = key;
            changeControl(1);
        }
    }
});

// Event listener for closing the rules popup
document.addEventListener("DOMContentLoaded", function () {
    const closeInfo = document.querySelector("#closeInfo");
    const rulesPopup = document.querySelector("#rules");

    closeInfo.addEventListener("click", function () {
        rulesPopup.classList.add("hidden");
    });
});

// Event listener for showing the rules popup
info.addEventListener("click", function () {
    document.querySelector("#rules").classList.remove("hidden");
});

// Event listener for closing the stats popup
closeStats.addEventListener("click", function () {
    document.querySelector("#stats").classList.add("hidden");
});

// Event listener for showing the stats popup
stats.addEventListener("click", function () {
    document.querySelector("#stats").classList.remove("hidden");
});

// Event listener for closing the result popup
closeResult.addEventListener("click", function () {
    document.querySelector("#result").classList.add("hidden");
});

resetbutton.addEventListener("click", function () {
    localStorage.removeItem("wins");
    localStorage.removeItem("losses");
    location.reload();
});
