let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [

{
    question:"What is HTML?",
    answer:"HyperText Markup Language",
    hint:"Starts with 'H' and has 3 words."
},

{
    question:"Which HTML tag is used to create a hyperlink?",
    answer:"<a>",
    hint:"Starts with '<a' and contains 3 characters."
},

{
    question:"Which HTML tag is used to insert an image?",
    answer:"<img>",
    hint:"Starts with '<i' and contains 5 characters."
},

{
    question:"Which HTML element is used to create a form?",
    answer:"<form>",
    hint:"Starts with '<f' and contains 6 characters."
},

{
    question:"Which HTML tag is used for the largest heading?",
    answer:"<h1>",
    hint:"Starts with '<h' and contains 4 characters."
},

{
    question:"What is CSS?",
    answer:"Cascading Style Sheets",
    hint:"Starts with 'C' and has 3 words."
},

{
    question:"Which CSS property changes the text color?",
    answer:"color",
    hint:"Starts with 'c' and has 5 characters."
},

{
    question:"Which CSS property changes the background color?",
    answer:"background-color",
    hint:"Starts with 'b' and has a hyphen."
},

{
    question:"Which CSS property is used to make corners rounded?",
    answer:"border-radius",
    hint:"Starts with 'b' and has a hyphen."
},

{
    question:"Which CSS property is used to align items horizontally in Flexbox?",
    answer:"justify-content",
    hint:"Starts with 'j' and has a hyphen."
},

{
    question:"Which keyword is used to declare a variable in JavaScript?",
    answer:"let",
    hint:"Starts with 'l' and has 3 characters."
},

{
    question:"Which function displays a popup message?",
    answer:"alert()",
    hint:"Starts with 'a' and ends with '()'."
},

{
    question:"Which method is used to select an element by its ID?",
    answer:"document.getElementById()",
    hint:"Starts with 'document.' and contains 'get'."
},

{
    question:"Which event occurs when a button is clicked?",
    answer:"click",
    hint:"Starts with 'c' and has 5 characters."
},

{
    question:"Which object is used to store data in the browser permanently?",
    answer:"localStorage",
    hint:"Starts with 'l' and has 'Storage'."
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
let isAnswered = false;

const question=document.getElementById("question");
const answer=document.getElementById("answer");
const userAnswer=document.getElementById("userAnswer");
const result=document.getElementById("result");
const hintText = document.getElementById("hintText");

const showBtn=document.getElementById("showBtn");
const checkBtn=document.getElementById("checkBtn");
const hintBtn=document.getElementById("hintBtn");

const prevBtn=document.getElementById("prevBtn");
const nextBtn=document.getElementById("nextBtn");

const questionInput=document.getElementById("questionInput");
const answerInput=document.getElementById("answerInput");
const hintInput=document.getElementById("hintInput");

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
const finalBestScoreEl = document.getElementById("final-best-score");
const playAgainBtn = document.getElementById("play-again-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

function saveCards(){
    localStorage.setItem("flashcards",JSON.stringify(flashcards));
}

// Generate a hint from the answer
function generateHint(answerText) {
    const trimmedAnswer = answerText.trim();
    const firstPart = trimmedAnswer.substring(0, Math.min(2, trimmedAnswer.length));
    const length = trimmedAnswer.length;
    return `Starts with "${firstPart}" and contains ${length} character${length !== 1 ? 's' : ''}.`;
}

// Get hint for current card
function getHint() {
    const card = flashcards[currentIndex];
    if (card.hint && card.hint.trim() !== "") {
        return card.hint;
    } else {
        return generateHint(card.answer);
    }
}

// Update card display logic
function updateCardDisplay() {
    isAnswered = false;
    const card = flashcards[currentIndex];
    question.innerText = card.question;
    answer.innerText = "Correct Answer: " + card.answer;
    answer.classList.add("hidden");
    hintText.classList.add("hidden");
    userAnswer.value = "";
    result.innerHTML = "";
    showBtn.classList.add("hidden");
    checkBtn.disabled = false;
    hintBtn.disabled = false;
    userAnswer.disabled = false;
}
updateCardDisplay();

// Load best timed score
function loadBestTimedScore() {
    const best = localStorage.getItem("bestTimedScore");
    if (best) {
        bestTimedScoreEl.textContent = best;
    } else {
        bestTimedScoreEl.textContent = "0";
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
    
    // Set initial stats display
    countdownEl.textContent = timeLeft;
    updateTimedStats();
    updateCardDisplay();
    
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
    disableQuizButtons();
    
    // Calculate final score and stats
    const finalScore = timedCorrect;
    const accuracy = timedAttempted > 0 
        ? Math.round((timedCorrect / timedAttempted) * 100) 
        : 0;
    
    // Update best score
    let bestScore = parseInt(localStorage.getItem("bestTimedScore") || 0);
    if (finalScore > bestScore) {
        bestScore = finalScore;
        localStorage.setItem("bestTimedScore", bestScore);
        bestTimedScoreEl.textContent = bestScore;
    }
    
    finalScoreEl.textContent = finalScore;
    finalCorrectEl.textContent = timedCorrect;
    finalWrongEl.textContent = timedWrong;
    finalAccuracyEl.textContent = accuracy + "%";
    finalBestScoreEl.textContent = bestScore;
    
    showResultsModal();
    disableEditing(false); // Re-enable editing
}

function disableQuizButtons() {
    checkBtn.disabled = true;
    hintBtn.disabled = true;
    userAnswer.disabled = true;
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
        updateCardDisplay();
    }, 300);
}

function disableEditing(isDisabled) {
    questionInput.disabled = isDisabled;
    answerInput.disabled = isDisabled;
    hintInput.disabled = isDisabled;
    addBtn.disabled = isDisabled;
    editBtn.disabled = isDisabled;
    deleteBtn.disabled = isDisabled;
    prevBtn.disabled = isDisabled;
    nextBtn.disabled = isDisabled;
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
checkBtn.onclick = function() {
    if (flashcards.length === 0) return;

    const normalize = (text) =>
    text.trim().replace(/\s+/g, " ").toLowerCase();

let user = normalize(userAnswer.value);
let correct = normalize(flashcards[currentIndex].answer);

    if (user == "") {
        alert("Please type your answer.");
        return;
    }
    let isCorrect = (user === correct);
    isAnswered = true;
    checkBtn.disabled = true;
    hintBtn.disabled = true;

    if(isCorrect){
        result.innerHTML="✅ Correct!";
        result.style.color="green";
        showBtn.classList.add("hidden");

        if(isTimedMode){
            timedCorrect++;
            timedAttempted++;
            updateTimedStats();
        }
        // Auto next card after 1 second
        setTimeout(() => {
            if(isTimedMode){
                currentIndex++;
                if(currentIndex >= flashcards.length){
                    currentIndex = 0;
                }
            } else {
                currentIndex++;
                if(currentIndex >= flashcards.length){
                    currentIndex = 0;
                }
            }
            updateCardDisplay();
        }, 1000);
    }else{
        result.innerHTML="❌ Incorrect! Try again or reveal the answer.";
        result.style.color="red";
        showBtn.classList.remove("hidden");
        
        if(isTimedMode){
            timedWrong++;
            timedAttempted++;
            updateTimedStats();
        }
    }
};

nextBtn.onclick=function(){
    if(isTimedMode) return;
    currentIndex++;
    if(currentIndex>=flashcards.length){
        currentIndex=0;
    }
    updateCardDisplay();
};

prevBtn.onclick=function(){
    if(isTimedMode) return;
    currentIndex--;
    if(currentIndex<0){
        currentIndex=flashcards.length-1;
    }
    updateCardDisplay();
};

addBtn.onclick=function(){
    let q=questionInput.value.trim();
    let a=answerInput.value.trim();
    let h=hintInput.value.trim();
    if(q==""||a==""){
        alert("Please enter question and answer.");
        return;
    }
    flashcards.push({
        question:q,
        answer:a,
        hint:h
    });
    saveCards();
    questionInput.value="";
    answerInput.value="";
    hintInput.value="";
    currentIndex=flashcards.length-1;
    updateCardDisplay();
};

editBtn.onclick=function(){
    let q=questionInput.value.trim();
    let a=answerInput.value.trim();
    let h=hintInput.value.trim();
    if(q==""||a==""){
        alert("Please enter updated question and answer.");
        return;
    }
    flashcards[currentIndex].question=q;
    flashcards[currentIndex].answer=a;
    flashcards[currentIndex].hint=h;
    saveCards();
    updateCardDisplay();
    questionInput.value="";
    answerInput.value="";
    hintInput.value="";
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
    updateCardDisplay();
};
