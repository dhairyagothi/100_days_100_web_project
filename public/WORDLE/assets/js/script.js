"use strict";

let playing = true;
let row = 1;
let col = 1;
let inputWord = "";

// Function to get a random word from the shuffledWords array
function getRandomWord() {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomIndex = array[0] % allowedWords.length;
    return allowedWords[randomIndex].toUpperCase();
}

let secretWord = getRandomWord();
let currentBox = "b11";

// Selecting elements
const enterButton = document.querySelector(".enter");
const backButton = document.querySelector("#Backspace");
const message = document.querySelector("#message");
const closeInfo = document.querySelector("#closeInfo");
const info = document.querySelector(".info");
const closeStats = document.querySelector("#closeStats");
const stats = document.querySelector(".stats");
const closeResult = document.querySelector("#closeResult");
const resetbutton=document.querySelector("#reset");
const wordsTable = document.querySelector(".words");

// Generate grid dynamically
const generateGrid = function () {
    wordsTable.innerHTML = "";
    for (let r = 1; r <= 6; r++) {
        const tr = document.createElement("tr");
        tr.className = "inputRow";
        for (let c = 1; c <= secretWord.length; c++) {
            const td = document.createElement("td");
            const input = document.createElement("input");
            input.className = "inputBox";
            input.id = `b${r}${c}`;
            input.maxLength = 1;
            input.autocomplete = "off"; // STOPS THE BROWSER AUTOCOMPLETE POPUP
            td.appendChild(input);
            tr.appendChild(td);
        }
        wordsTable.appendChild(tr);
    }
};
generateGrid();

// Function to change control based on input
const changeControl = function (type) {
    if (row === 7) {
        playing = false;
        message.textContent = secretWord;
        message.classList.remove("hidden");
    } else {
        const c = Number(currentBox.slice(2));
        if (type < 0) {
            if (c > 1)
                currentBox = `b${row}${c - 1}`;
        } else {
            if (c < secretWord.length)
                currentBox = `b${row}${c + 1}`;
        }
    }
};

// Function to get the value of a specific input box
const getBoxValue = function (elementId) {
    return document.querySelector(`#${elementId}`).value;
};
const checkWord = function (word) {
    for (let i = 0; i < secretWord.length; i++) {
        const box = document.querySelector(`#b${row}${i + 1}`);
        const keyBtn = document.querySelector(`#${word[i]}`);

        setTimeout(() => {
            box.classList.add("flip");

            setTimeout(() => {
                if (word[i] === secretWord[i]) {
                    box.classList.add("green");
                    keyBtn.classList.remove("yellow", "grey");
                    keyBtn.classList.add("green");
                } else if (secretWord.includes(word[i])) {
                    box.classList.add("yellow");
                    if (!keyBtn.classList.contains("green")) {
                        keyBtn.classList.remove("grey");
                        keyBtn.classList.add("yellow");
                    }
                } else {
                    box.classList.add("grey");
                    if (!keyBtn.classList.contains("green") && !keyBtn.classList.contains("yellow")) {
                        keyBtn.classList.add("grey");
                    }
                }
            }, 250); 
        }, i * 300);
    }

    // Wait until the very last box has finished animating before deciding if they won or lost
    const totalAnimationTime = (secretWord.length * 300) + 250;
    
    setTimeout(() => {
        if (word === secretWord) {
            message.innerHTML = `${appreciation[row - 1]}! <br><br><button id="nextWordBtn" class="button" style="margin:auto;">Next Word ➔</button>`;
            message.classList.remove("hidden");
            document.getElementById("nextWordBtn").addEventListener("click", () => location.reload());
            updateStats(true);
        } else if (row === 6) {
            message.innerHTML = `Word was: ${secretWord}<br><br><button id="nextWordBtn" class="button" style="margin:auto;">Next Word ➔</button>`;
            message.classList.remove("hidden");
            document.getElementById("nextWordBtn").addEventListener("click", () => location.reload());
            updateStats(false);
        } else {
            row++;
            currentBox = `b${row}1`;
            playing = true; // Unlock the board for the next guess
        }
    }, totalAnimationTime);
};

// Event listener for the enter button
enterButton.addEventListener("click", function () {
    if (playing) {
        let inputWord = "";
        for (let i = 1; i <= secretWord.length; i++) {
            let boxId = `#b${row}${i}`;
            if (document.querySelector(boxId).value !== "") {
                inputWord += document.querySelector(boxId).value;
            }
        }

        if (inputWord.length === secretWord.length) {
            if (allowedWords.includes(inputWord.toLowerCase())) {
                playing = false;
                checkWord(inputWord);
            } else {
                message.textContent = "Word not in list";
                const currentRowElem = document.querySelectorAll('.inputRow')[row - 1];
                currentRowElem.classList.add('shake');
                setTimeout(() => currentRowElem.classList.remove('shake'), 400);
                message.classList.remove("hidden");
                setTimeout(() => message.classList.add("hidden"), 1000);
            }
        } else {
            message.textContent = "Not enough letters";
            const currentRowElem = document.querySelectorAll('.inputRow')[row - 1];
            currentRowElem.classList.add('shake');
            setTimeout(() => currentRowElem.classList.remove('shake'), 400);
            message.classList.remove("hidden");
            setTimeout(() => message.classList.add("hidden"), 1000);
        }
    }
});

// Event listener for the back button
backButton.addEventListener("click", function () {
    if (!playing) return;
    const boxValue = getBoxValue(currentBox);
    if (boxValue === "") {
        changeControl(-1);
    }
    document.querySelector(`#${currentBox}`).value = "";
});

// Event listeners for virtual keyboard buttons
for (const alphabet of alphabets) {
    document.querySelector(`#${alphabet}`).addEventListener("click", function () {
        if (Number(currentBox.slice(2)) <= secretWord.length && getBoxValue(currentBox) === "" && playing === true) {
            const box = document.querySelector(`#${currentBox}`);
            box.value = alphabet;
            box.classList.add('filled');
            setTimeout(() => box.classList.remove('filled'), 150);
            changeControl(1);
        }
    });
}

// Event listener for physical keyboard input
document.addEventListener("keydown", function (event) {
    if (event.key === "Backspace") {
        event.preventDefault();
        backButton.click();
        return;
    }
    if (event.key === "Enter") {
        event.preventDefault();
        enterButton.click();
        return;
    }
    const key = event.key.toUpperCase();
    if (playing && key.length === 1 && key >= 'A' && key <= 'Z') {
        event.preventDefault(); // Prevent lowercase letters if a user focuses on the input manually
        if (Number(currentBox.slice(2)) <= secretWord.length && getBoxValue(currentBox) === "") {
            const box = document.querySelector(`#${currentBox}`);
            box.value = key;
            box.classList.add('filled');
            setTimeout(() => box.classList.remove('filled'), 150);
            changeControl(1);
        }
    }
});

// Show rules only on first ever visit
if (!localStorage.getItem('visited')) {
    document.querySelector("#rules").classList.remove("hidden");
    localStorage.setItem('visited', 'true');
}

// Event listener for closing the rules popup with X
document.querySelector("#closeInfo").addEventListener("click", function () {
    document.querySelector("#rules").classList.add("hidden");
});

// Click anywhere outside a popup to close it
document.addEventListener("click", function(event) {
    const rules = document.querySelector("#rules");
    const statsPopup = document.querySelector("#stats");
    const infoBtn = document.querySelector(".info");
    const statsBtn = document.querySelector(".stats.nav__icon");

    if (!rules.classList.contains("hidden") && !rules.contains(event.target) && event.target !== infoBtn) {
        rules.classList.add("hidden");
    }
    if (!statsPopup.classList.contains("hidden") && !statsPopup.contains(event.target) && event.target !== statsBtn) {
        statsPopup.classList.add("hidden");
    }
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
if (closeResult) {
    closeResult.addEventListener("click", function () {
        document.querySelector("#result").classList.add("hidden");
    });
}

if (resetbutton) {
    resetbutton.addEventListener("click", function () {
        // Clear wins and losses statistics from localStorage
        localStorage.removeItem("wins");
        localStorage.removeItem("losses");

        // Refresh the page
        location.reload();
    });
}

// adds a stats 
function updateStats(won) {
    // Get existing stats or create new ones
    let stats = JSON.parse(localStorage.getItem('wordleStats')) || { played: 0, wins: 0, currentStreak: 0, maxStreak: 0 };
    
    stats.played++;
    if (won) {
        stats.wins++;
        stats.currentStreak++;
        if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
    } else {
        stats.currentStreak = 0; // Reset streak on loss
    }
    localStorage.setItem('wordleStats', JSON.stringify(stats));
    
    // Update the Stats popup HTML
    let winPct = Math.round((stats.wins / stats.played) * 100);
    const statsHTML = `
        <p class='crossOuter'><button class='cross' id='closeStats'>&#9587</button></p>
        <p><strong>STATISTICS</strong></p>
        <p>${stats.played} &emsp;&emsp;&emsp;${winPct}% &emsp;&emsp;&emsp;${stats.currentStreak} &emsp;&emsp;&emsp;${stats.maxStreak}</p>
        <p class='mini'>Played - Win% - Current Streak - Max Streak</p>
    `;
    document.querySelector("#stats").innerHTML = statsHTML;
    
    // Reattach the close button listener since we replaced the HTML
    document.querySelector('#closeStats').addEventListener('click', () => document.querySelector("#stats").classList.add("hidden"));
}

document.querySelector(".stats.nav__icon").addEventListener("click", function() {
    updateStats(false);
});

// theme toggle

const themeToggle = document.querySelector("#themeToggle");

// Check if they had dark mode on previously
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// Toggle on click
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "true");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("darkMode", "false");
        themeToggle.textContent = "🌙";
    }
});