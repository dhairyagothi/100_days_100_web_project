let randomNumber = parseInt(Math.random() * 100 + 1);

const submit = document.querySelector("#subt")
const userInput = document.querySelector("#guessField")
const guessSlot = document.querySelector(".guesses")
const remaining = document.querySelector(".lastResult")
const lowOrHi = document.querySelector(".lowOrHi")
const StartOver = document.querySelector(".resultParas")

const p = document.createElement("p")

let prevGuess = []
let numGuess = 1;

let playGame = true;

if(playGame){
    submit.addEventListener("click", function(e){
    e.preventDefault()
    const guess = parseInt(userInput.value)
    validateGuess(guess)
    })
}

function toggleTheme() {
    document.body.classList.toggle("dark");

    const btn = document.querySelector(".theme-toggle");

    if (document.body.classList.contains("dark")) {
        btn.innerHTML = "☀️";
    } else {
        btn.innerHTML = "🌙";
    }
}

function validateGuess(guess){
    if(isNaN(guess)){
        alert("Please enter a valid number")
    } else if(guess<=0){
        alert("Please enter a number greater than 0")
    } else if(guess>100){
        alert("Please enter a number less than 100")
    } else {
        prevGuess.push(guess)
    } if(numGuess>10){
        displayGuess(guess)
        displayMessage(`Game Over. Random Number Was ${randomNumber}`)
        endGame()
    } else {
        displayGuess(guess)
        checkGuess(guess)
    }
}

function checkGuess(guess){
    if(guess === randomNumber){
        displayMessage(`You Win`)
        endGame()
    } else if (guess < randomNumber) {
        displayMessage(`Number is too low`)
    } else if (guess > randomNumber) {
        displayMessage(`Number is too high`)
    }
}

function displayGuess(guess){
    userInput.value = ''
    guessSlot.innerHTML += `${guess} `
    numGuess++;
    remaining.innerHTML = `${11 - numGuess}` 
}

function displayMessage(message){
    lowOrHi.innerHTML = `<h2>${message}</h2>`
}

function endGame(){
    userInput.value = ''
    userInput.setAttribute('disabled', '')
    p.classList.add('button')
    p.innerHTML = `<h2 id="newGame">Start New Game</h2>`;
    StartOver.appendChild(p)
    playGame = false;
    newGame();
}

function newGame(){
    const newGameButton = document.querySelector("#newGame")
    newGameButton.style.textDecoration = "underline";
    newGameButton.style.cursor = "pointer";
    newGameButton.addEventListener("click", function(e){
        randomNumber = parseInt(Math.random() * 100 + 1);
        prevGuess = []
        numGuess = 1
        guessSlot.innerHTML = ""
        remaining.innerHTML = `${11 - numGuess}`
        userInput.removeAttribute('disabled')
        StartOver.removeChild(p)
        playGame = true;
    })
}