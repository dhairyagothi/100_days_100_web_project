let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [

{
    question:"What is HTML?",
    answer:"HyperText Markup Language"
},

{
    question:"Which HTML tag is used to create a hyperlink?",
    answer:"<a>"
},

{
    question:"Which HTML tag is used to insert an image?",
    answer:"<img>"
},

{
    question:"Which HTML element is used to create a form?",
    answer:"<form>"
},

{
    question:"Which HTML tag is used for the largest heading?",
    answer:"<h1>"
},

{
    question:"What is CSS?",
    answer:"Cascading Style Sheets"
},

{
    question:"Which CSS property changes the text color?",
    answer:"color"
},

{
    question:"Which CSS property changes the background color?",
    answer:"background-color"
},

{
    question:"Which CSS property is used to make corners rounded?",
    answer:"border-radius"
},

{
    question:"Which CSS property is used to align items horizontally in Flexbox?",
    answer:"justify-content"
},

{
    question:"Which keyword is used to declare a variable in JavaScript?",
    answer:"let"
},

{
    question:"Which function displays a popup message?",
    answer:"alert()"
},

{
    question:"Which method is used to select an element by its ID?",
    answer:"document.getElementById()"
},

{
    question:"Which event occurs when a button is clicked?",
    answer:"click"
},

{
    question:"Which object is used to store data in the browser permanently?",
    answer:"localStorage"
}

];

let currentIndex = 0;

// Timed Challenge Variables
let isTimedMode = false;
let timedInterval = null;
let timeLeft = 60;
let totalTime = 60;
let startTime = 0;
let timedCorrect = 0;
let timedWrong = 0;
let timedAttempted = 0;

const question=document.getElementById("question");
const answer=document.getElementById("answer");
const userAnswer=document.getElementById("userAnswer");
const result=document.getElementById("result");

const showBtn=document.getElementById("showBtn");
const checkBtn=document.getElementById("checkBtn");

const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");

const questionInput=document.getElementById("questionInput");
const answerInput=document.getElementById("answerInput");

const addBtn=document.getElementById("addBtn");
const editBtn=document.getElementById("editBtn");
const deleteBtn=document.getElementById("deleteBtn");

// Timed Challenge Elements
const timedSetup = document.getElementById("timed-setup");
const timedStats = document.getElementById("timed-stats");
const startTimedBtn = document.getElementById("start-timed-btn");
const timerOptions = document.getElementById("timer-options");
const countdownEl = document.getElementById("countdown");
const timedCorrectEl = document.getElementById("timed-correct");
const timedWrongEl = document.getElementById("timed-wrong");
const timedAttemptedEl = document.getElementById("timed-attempted");
const timedAccuracyEl = document.getElementById("timed-accuracy");
const bestTimedScoreEl = document.getElementById("best-timed-score");
const resultsModal = document.getElementById("results-modal");
const finalScoreEl = document.getElementById("final-score");
const finalCorrectEl = document.getElementById("final-correct");
const finalWrongEl = document.getElementById("final-wrong");
const finalAccuracyEl = document.getElementById("final-accuracy");
const finalTimeEl = document.getElementById("final-time");
const bestScoreItem = document.getElementById("best-score-item");
const newBestScoreEl = document.getElementById("new-best-score");
const playAgainBtn = document.getElementById("play-again-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

function saveCards(){

localStorage.setItem("flashcards",JSON.stringify(flashcards));

}

function displayCard(){

question.innerText=flashcards[currentIndex].question;

answer.innerText="Correct Answer: "+flashcards[currentIndex].answer;

answer.classList.add("hidden");

userAnswer.value="";

result.innerHTML="";

showBtn.innerText="Show Answer";

}

displayCard();

// Load best timed score
function loadBestTimedScore() {
    const best = localStorage.getItem("bestTimedScore");
    if (best) {
        bestTimedScoreEl.textContent = best;
    }
}
loadBestTimedScore();

// Timed Challenge Functions
function startTimedChallenge() {
    isTimedMode = true;
    timedCorrect = 0;
    timedWrong = 0;
    timedAttempted = 0;
    shuffle(flashcards); // Shuffle the deck for timed challenge
    currentIndex = 0;
    
    totalTime = parseInt(timerOptions.value);
    timeLeft = totalTime;
    startTime = Date.now();
    
    // Toggle UI elements
    timedSetup.hidden = true;
    timedStats.hidden = false;
    // Disable editing during timed mode
    disableEditing(true);
    closeResultsModal();
    
    updateTimedStats();
    displayCard();
    
    // Start timer
    timedInterval = setInterval(() => {
        timeLeft--;
        countdownEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endTimedChallenge();
        }
    }, 1000);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateTimedStats() {
    timedCorrectEl.textContent = timedCorrect;
    timedWrongEl.textContent = timedWrong;
    timedAttemptedEl.textContent = timedAttempted;
    
    const accuracy = timedAttempted > 0 
        ? Math.round((timedCorrect / timedAttempted) * 100) 
        : 0;
    timedAccuracyEl.textContent = accuracy + "%";
}

function endTimedChallenge() {
    isTimedMode = false;
    clearInterval(timedInterval);
    
    // Calculate final score and stats
    const finalScore = timedCorrect;
    const timePlayed = Math.round((Date.now() - startTime) / 1000);
    const accuracy = timedAttempted > 0 
        ? Math.round((timedCorrect / timedAttempted) * 100) 
        : 0;
    
    finalScoreEl.textContent = finalScore;
    finalCorrectEl.textContent = timedCorrect;
    finalWrongEl.textContent = timedWrong;
    finalAccuracyEl.textContent = accuracy + "%";
    finalTimeEl.textContent = timePlayed + "s";
    
    // Check for new best score
    const savedBest = parseInt(localStorage.getItem("bestTimedScore") || 0);
    if (finalScore > savedBest) {
        localStorage.setItem("bestTimedScore", finalScore);
        bestTimedScoreEl.textContent = finalScore;
        newBestScoreEl.textContent = finalScore;
        bestScoreItem.hidden = false;
    } else {
        bestScoreItem.hidden = true;
    }
    
    showResultsModal();
    disableEditing(false); // Re-enable editing
}

function showResultsModal() {
    resultsModal.classList.add("active");
    resultsModal.hidden = false;
}

function closeResultsModal() {
    resultsModal.classList.remove("active");
    setTimeout(() => {
        resultsModal.hidden = true;
        // Reset UI to normal mode
        timedSetup.hidden = false;
        timedStats.hidden = true;
        displayCard(); // Show normal mode card
    }, 300);
}

function disableEditing(isDisabled) {
    questionInput.disabled = isDisabled;
    answerInput.disabled = isDisabled;
    addBtn.disabled = isDisabled;
    editBtn.disabled = isDisabled;
    deleteBtn.disabled = isDisabled;
    prevBtn.disabled = isDisabled;
}

// Event listeners for timed challenge
startTimedBtn.addEventListener("click", startTimedChallenge);
playAgainBtn.addEventListener("click", startTimedChallenge);
closeModalBtn.addEventListener("click", closeResultsModal);
resultsModal.addEventListener("click", (e) => {
    if (e.target === resultsModal) {
        closeResultsModal();
    }
});

showBtn.onclick=function(){

if(answer.classList.contains("hidden")){

answer.classList.remove("hidden");

showBtn.innerText="Hide Answer";

}else{

answer.classList.add("hidden");

showBtn.innerText="Show Answer";

}

};

checkBtn.onclick=function(){

let user=userAnswer.value.trim().toLowerCase();

let correct=flashcards[currentIndex].answer.trim().toLowerCase();

if(user==""){

alert("Please type your answer.");

return;

}

let isCorrect = (user === correct);

if(isCorrect){

result.innerHTML="✅ Correct!";

result.style.color="green";

}else{

result.innerHTML="❌ Incorrect!";

result.style.color="red";

}

// If in timed mode, increment stats and move to next card
if(isTimedMode){
    if(isCorrect){
        timedCorrect++;
    }else{
        timedWrong++;
    }
    timedAttempted++;
    updateTimedStats();
    // Move to next card immediately
    currentIndex++;
    if(currentIndex >= flashcards.length){
        currentIndex = 0; // Loop the deck
    }
    displayCard();
}

};

nextBtn.onclick=function(){

currentIndex++;

if(currentIndex>=flashcards.length){

currentIndex=0;

}

displayCard();

};

prevBtn.onclick=function(){

currentIndex--;

if(currentIndex<0){

currentIndex=flashcards.length-1;

}

displayCard();

};

addBtn.onclick=function(){

let q=questionInput.value.trim();

let a=answerInput.value.trim();

if(q==""||a==""){

alert("Please enter question and answer.");

return;

}

flashcards.push({

question:q,

answer:a

});

saveCards();

questionInput.value="";

answerInput.value="";

currentIndex=flashcards.length-1;

displayCard();

};

editBtn.onclick=function(){

let q=questionInput.value.trim();

let a=answerInput.value.trim();

if(q==""||a==""){

alert("Please enter updated question and answer.");

return;

}

flashcards[currentIndex].question=q;

flashcards[currentIndex].answer=a;

saveCards();

displayCard();

questionInput.value="";

answerInput.value="";

};

deleteBtn.onclick=function(){

if(flashcards.length==1){

alert("At least one flashcard is required.");

return;

}

flashcards.splice(currentIndex,1);

if(currentIndex>=flashcards.length){

currentIndex=flashcards.length-1;

}

saveCards();

displayCard();

};