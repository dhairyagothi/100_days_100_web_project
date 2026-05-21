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
let performanceData = [];

const questionText = document.getElementById("question");
const questionCount = document.getElementById("question-count");
const stressLevel = document.getElementById("stress-level");
const timerText = document.getElementById("timer");
const answerBox = document.getElementById("answer");

const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

// New DOM elements for results
const resultsContainer = document.getElementById("results-container");
const interviewBox = document.getElementById("interview-box");
const mainTopBar = document.getElementById("main-top-bar");

const resultsAttempted = document.getElementById("results-attempted");
const resultsAccuracy = document.getElementById("results-accuracy");
const resultsCorrect = document.getElementById("results-correct");
const resultsIncorrect = document.getElementById("results-incorrect");
const resultsAvgTime = document.getElementById("results-avg-time");

const questionsBreakdown = document.getElementById("questions-breakdown");
const feedbackSummary = document.getElementById("feedback-summary");
const suggestionsList = document.getElementById("suggestions-list");
const resultsRestartBtn = document.getElementById("results-restart-btn");

function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

      nextQuestion(true);
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

function nextQuestion(isTimeout = false) {
  const timeoutOccurred = (isTimeout === true);
  const answerText = answerBox.value.trim();
  const answerLength = answerText.length;
  let timeTaken = 30 - timeLeft;

  // Determine status
  let status = "Correct";
  if (timeoutOccurred) {
    status = "Timed Out";
    timeTaken = 30;
  } else if (answerLength < 30) {
    status = "Weak";
  }

  // Record performance data
  performanceData.push({
    question: questions[currentQuestion],
    answer: timeoutOccurred ? "" : answerText,
    timeTaken: timeTaken,
    status: status,
    stressLevel: stress
  });

  // Adjust stress
  if (timeoutOccurred || answerLength < 20) {
    stress += 15;
  } else {
    stress -= 5;
  }

  if (stress < 0) {
    stress = 0;
  }
  if (stress > 100) {
    stress = 100;
  }

  updateStress();

  currentQuestion++;

  if (currentQuestion >= questions.length) {
    clearInterval(timer);
    showResults();
    return;
  }

  loadQuestion();
}

function showResults() {
  clearInterval(timer);
  
  // Set body background to default dark theme for cleaner results view
  document.body.style.background = "#0d1117";

  // Hide main view
  mainTopBar.classList.add("hidden");
  interviewBox.classList.add("hidden");

  // Show results
  resultsContainer.classList.remove("hidden");

  // Stats calculation
  const totalQuestions = questions.length;
  const correctCount = performanceData.filter(d => d.status === "Correct").length;
  const incorrectCount = performanceData.filter(d => d.status === "Weak" || d.status === "Timed Out").length;
  const accuracy = Math.round((correctCount / totalQuestions) * 100);

  let totalTime = 0;
  performanceData.forEach(d => totalTime += d.timeTaken);
  const avgTime = Math.round(totalTime / totalQuestions);

  // Update stats DOM
  resultsAttempted.innerText = `${performanceData.length}/${totalQuestions}`;
  resultsAccuracy.innerText = `${accuracy}%`;
  resultsCorrect.innerText = correctCount;
  resultsIncorrect.innerText = incorrectCount;
  resultsAvgTime.innerText = `${avgTime}s`;

  // Populate breakdown
  questionsBreakdown.innerHTML = "";
  performanceData.forEach((data, index) => {
    const item = document.createElement("div");
    item.className = "breakdown-item";

    let statusClass = "correct";
    let statusLabel = "Detailed Response";
    if (data.status === "Timed Out") {
      statusClass = "timeout";
      statusLabel = "Timed Out";
    } else if (data.status === "Weak") {
      statusClass = "weak";
      statusLabel = "Weak Response";
    }

    item.innerHTML = `
      <div class="breakdown-header">
        <h4>Question ${index + 1}</h4>
        <span class="status-badge status-${statusClass}">${statusLabel}</span>
      </div>
      <div class="question-text">${escapeHTML(data.question)}</div>
      <div class="user-answer">${data.answer ? escapeHTML(data.answer) : "<i>No answer provided.</i>"}</div>
      <div class="time-meta">
        <span>Time taken: <strong>${data.timeTaken}s</strong></span>
        <span>Stress level: <strong>${data.stressLevel}%</strong></span>
      </div>
    `;
    questionsBreakdown.appendChild(item);
  });

  // Generate feedback
  let summary = "";
  let suggestions = [];

  // Composure/Stress feedback
  if (stress >= 70) {
    summary += "Your stress level was high by the end of the interview. Managing pressure is critical for clear communication. ";
    suggestions.push("<strong>Manage Stress:</strong> Take a deep breath before you start speaking. Pause for 2-3 seconds to outline your answer mentally.");
    suggestions.push("<strong>Mock Interviews:</strong> Practice mock sessions or record yourself to build familiarity with high-pressure interview environments.");
  } else if (stress >= 30) {
    summary += "You managed your stress reasonably well, though the timer and questions put some pressure on you. ";
    suggestions.push("<strong>Pacing:</strong> Monitor the timer but do not rush. Summarize your thoughts cleanly rather than trailing off.");
  } else {
    summary += "Great job! You stayed calm and composed throughout the simulator session. ";
    suggestions.push("<strong>Confidence:</strong> Maintaining this composure in real-world interviews makes a highly professional impression.");
  }

  // Quality of responses feedback
  const weakCount = performanceData.filter(d => d.status === "Weak").length;
  const timeoutCount = performanceData.filter(d => d.status === "Timed Out").length;

  if (weakCount > 0) {
    summary += "A few of your answers were brief. Expanding your responses with concrete details is key. ";
    suggestions.push("<strong>Use STAR Method:</strong> For behavioral prompts, structure your answers as: Situation, Task, Action, and Result.");
    suggestions.push("<strong>Add Detail:</strong> Don't just list skills; share real-world stories or instances of how you successfully resolved challenges.");
  }

  if (timeoutCount > 0) {
    summary += "You ran out of time on some questions. ";
    suggestions.push("<strong>Time Budgeting:</strong> Keep your answers structured and to the point. Focus on delivering the core value in the first 20 seconds.");
  }

  if (correctCount === totalQuestions) {
    summary += "Every single answer was detailed and submitted within the time limit. Outstanding performance!";
  }

  feedbackSummary.innerText = summary;

  // Render suggestions
  suggestionsList.innerHTML = "";
  suggestions.forEach(s => {
    const li = document.createElement("li");
    li.innerHTML = s;
    suggestionsList.appendChild(li);
  });
}

function restartInterview() {
  currentQuestion = 0;
  stress = 0;
  performanceData = [];

  updateStress();

  mainTopBar.classList.remove("hidden");
  interviewBox.classList.remove("hidden");
  resultsContainer.classList.add("hidden");

  loadQuestion();
}

nextBtn.addEventListener("click", () => nextQuestion(false));
restartBtn.addEventListener("click", restartInterview);
resultsRestartBtn.addEventListener("click", restartInterview);

loadQuestion();