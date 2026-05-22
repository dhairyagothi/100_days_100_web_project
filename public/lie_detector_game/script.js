const answerInput = document.getElementById("answerInput");

const analyzeBtn = document.getElementById("analyzeBtn");

const scanner = document.getElementById("scanner");

const result = document.getElementById("result");

const truthPercent = document.getElementById("truthPercent");

const message = document.getElementById("message");

const retryBtn = document.getElementById("retryBtn");

const questionText =
  document.getElementById("questionText");

const customQuestion =
  document.getElementById("customQuestion");

const setQuestionBtn =
  document.getElementById("setQuestionBtn");


const randomQuestions = [

  "Did you secretly eat food at midnight?",

  "Did you ignore someone's message intentionally?",

  "Did you copy homework from a friend?",

  "Have you ever blamed WiFi for your own mistake?",

  "Did you pretend to study while watching reels?",

  "Did you stalk someone on social media recently?",

  "Did you laugh at your own joke today?",

  "Have you ever lied about being busy?",

  "Did you secretly skip an alarm today?"

];

questionText.innerText =

  randomQuestions[
    Math.floor(Math.random() * randomQuestions.length)
  ];


let startTime = 0;

let backspaceCount = 0;

let pauseCount = 0;

let lastKeyTime = 0;


/* =========================
   TRACK TYPING START
========================= */

answerInput.addEventListener("focus", () => {

  startTime = Date.now();

});


/* =========================
   TRACK TYPING BEHAVIOR
========================= */

answerInput.addEventListener("keydown", (e) => {

  const currentTime = Date.now();

  if(e.key === "Backspace"){
    backspaceCount++;
  }

  if(lastKeyTime !== 0){

    const difference = currentTime - lastKeyTime;

    if(difference > 1000){
      pauseCount++;
    }

  }

  lastKeyTime = currentTime;

});


/* =========================
   ANALYZE BUTTON
========================= */

analyzeBtn.addEventListener("click", () => {

  const text = answerInput.value.trim();

  if(text === ""){
    alert("Please type an answer first!");
    return;
  }

  scanner.classList.remove("hidden");

  result.classList.add("hidden");

  setTimeout(() => {

    scanner.classList.add("hidden");

    generateResult();

  }, 3000);

});


/* =========================
   GENERATE RESULT
========================= */

function generateResult(){

  const typingTime =
    (Date.now() - startTime) / 1000;

  let truthScore = 50;

  // faster typing = more suspicious
  if(typingTime < 5){
    truthScore -= 20;
  }

  // too many backspaces = suspicious
  truthScore -= backspaceCount * 5;

  // too many pauses = suspicious
  truthScore -= pauseCount * 7;

  // random humor factor
  truthScore += Math.floor(Math.random() * 30);

  // limit score
  if(truthScore > 100){
    truthScore = 100;
  }

  if(truthScore < 0){
    truthScore = 0;
  }

  truthPercent.innerText =
    `Truth Level: ${truthScore}%`;

  const funnyMessages = [

    "🚨 Suspicious activity detected",

    "🤨 Definitely hiding something",

    "🫣 AI detected nervous typing",

    "😎 Surprisingly honest human",

    "👀 We are watching you",

    "🧠 Truth circuits activated",

    "😂 Even AI is confused",

    "🕵️ Micro-expression analysis failed"

  ];

  const randomMessage =
    funnyMessages[
      Math.floor(Math.random() * funnyMessages.length)
    ];

  message.innerText = randomMessage;

  result.classList.remove("hidden");

}


/* =========================
   RESET GAME
========================= */

retryBtn.addEventListener("click", () => {

  answerInput.value = "";

  backspaceCount = 0;

  pauseCount = 0;

  lastKeyTime = 0;

  startTime = 0;

  result.classList.add("hidden");

});

setQuestionBtn.addEventListener("click", () => {

  const newQuestion =
    customQuestion.value.trim();

  if(newQuestion !== ""){

    questionText.innerText = newQuestion;

    customQuestion.value = "";

  }

});