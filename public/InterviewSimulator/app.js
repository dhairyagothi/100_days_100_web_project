// app.js

const questions = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "What are your strengths and weaknesses?",
  "Explain a challenging project you worked on.",
  "Where do you see yourself in 5 years?"
];

let currentQuestion = 0;
let stress = 0;
let timeLeft = 30;
let timer;

const questionText = document.getElementById("question");
const questionCount = document.getElementById("question-count");
const stressLevel = document.getElementById("stress-level");
const timerText = document.getElementById("timer");
const answerBox = document.getElementById("answer");

const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

function loadQuestion() {

  questionText.innerText = questions[currentQuestion];

  questionCount.innerText = `${currentQuestion + 1}/${questions.length}`;

  answerBox.value = "";

  resetTimer();
}

function startTimer() {

  timer = setInterval(() => {

    timeLeft--;

    timerText.innerText = timeLeft;

    if(timeLeft <= 10){
      stress += 2;
      updateStress();
    }

    if(timeLeft <= 0){
      clearInterval(timer);

      alert("Time's up. The interviewer looks disappointed.");

      nextQuestion();
    }

  },1000);
}

function resetTimer() {

  clearInterval(timer);

  timeLeft = 30;

  timerText.innerText = timeLeft;

  startTimer();
}

function updateStress() {

  if(stress > 100){
    stress = 100;
  }

  stressLevel.innerText = `${stress}%`;

  if(stress >= 70){
    document.body.style.background = "#2d0d0d";
  }
  else{
    document.body.style.background = "#0d1117";
  }
}

function nextQuestion() {

  let answerLength = answerBox.value.trim().length;

  if(answerLength < 20){
    stress += 15;
  }
  else{
    stress -= 5;
  }

  if(stress < 0){
    stress = 0;
  }

  updateStress();

  currentQuestion++;

  if(currentQuestion >= questions.length){

    clearInterval(timer);

    let finalMessage = "";

    if(stress < 30){
      finalMessage = "Excellent performance. You stayed calm under pressure.";
    }
    else if(stress < 70){
      finalMessage = "Decent performance, but pressure affected your answers.";
    }
    else{
      finalMessage = "You panicked. Your communication collapsed under stress.";
    }

    alert(finalMessage);

    return;
  }

  loadQuestion();
}

nextBtn.addEventListener("click", nextQuestion);

restartBtn.addEventListener("click", () => {

  currentQuestion = 0;
  stress = 0;

  updateStress();

  loadQuestion();
});

loadQuestion();