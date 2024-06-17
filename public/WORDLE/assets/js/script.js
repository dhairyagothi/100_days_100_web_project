"use strict";
//initializing variables
let playing = true;
let row = 1;
let col = 1;
let inputWord = "";

//getting random secret word
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let secretWord = shuffledWords[31 * (month - 1) + day].toUpperCase();
let currentBox = "b11";

//selecting elements
const enterButton = document.querySelector(".enter");
const backButton = document.querySelector("#back");
const message = document.querySelector("#message");
const closeInfo = document.querySelector("#closeInfo");
const info = document.querySelector(".info");
const closeStats = document.querySelector("#closeStats");
const stats = document.querySelector(".stats");
const closeResult = document.querySelector("#closeResult");
//functions
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

const getBoxValue = function (elementId) {
    return document.querySelector(`#${elementId}`).value;
};

const checkWord = function (word) {
    for (let i = 0; i < 5; i++) {
        if (word[i] === secretWord[i]) {
            document.querySelector(`#b${row}${i + 1}`).classList.add("green");
            document.querySelector(`#${word[i]}`).classList.add("green");
        } else if (secretWord.includes(word[i])) {
            document.querySelector(`#b${row}${i + 1}`).classList.add("yellow");
            document.querySelector(`#${word[i]}`).classList.add("yellow");
        } else {
            document.querySelector(`#b${row}${i + 1}`).classList.add("grey");
            document.querySelector(`#${word[i]}`).classList.add("grey");
        }
    }
    if (word === secretWord) {
        message.textContent = appreciation[row - 1];
        message.classList.remove("hidden");
        setTimeout(function () {
            message.classList.add("hidden");
            result.classList.remove("hidden");
            // console.log("Show result");
        }, 1000);

        playing = false;
    }
};

//----------------eventlisteners--------------------------
//enter button
enterButton.addEventListener("click", function () {
    if (playing) {
        for (let i = 1; i <= 5; i++) {
            let boxId = `#b${row}${i}`;
            if (document.querySelector(boxId).value !== "") {
                inputWord = inputWord + document.querySelector(boxId).value;
            }
        }
        console.log(inputWord, inputWord.length);
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

//backbutton
backButton.addEventListener("click", function () {
    const boxValue = getBoxValue(currentBox);
    if (boxValue === "") changeControl(-1);
    document.querySelector(`#${currentBox}`).value = "";
});

//keyboard buttons
for (const alphabet of alphabets) {
    document
        .querySelector(`#${alphabet}`)
        .addEventListener("click", function () {
            if (
                Number(currentBox[2]) <= 5 &&
                getBoxValue(currentBox) === "" &&
                playing === true
            ) {
                document.querySelector(`#${currentBox}`).value = alphabet;
                changeControl(1);
            }
        });
}

//info close button
closeInfo.addEventListener("click", function () {
    document.querySelector("#rules").classList.add("hidden");
});

//rules info
info.addEventListener("click", function () {
    document.querySelector("#rules").classList.remove("hidden");
});

//stats close button
closeStats.addEventListener("click", function () {
    document.querySelector("#stats").classList.add("hidden");
});

//rules info
stats.addEventListener("click", function () {
    document.querySelector("#stats").classList.remove("hidden");
});

//close result
closeResult.addEventListener("click", function () {
    document.querySelector("#result").classList.add("hidden");
});
