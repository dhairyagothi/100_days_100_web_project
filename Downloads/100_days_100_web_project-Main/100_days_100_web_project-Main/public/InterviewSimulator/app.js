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
let timeLeft = 60;
const totalTime = 60;
let timer;

// DOM Elements
const questionText = document.getElementById("question");
const questionCount = document.getElementById("question-count");
const stressLevel = document.getElementById("stress-level");
const timerText = document.getElementById("timer");
const answerBox = document.getElementById("answer");

const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

// Progress bars
const questionProgress = document.getElementById("question-progress");
const stressProgress = document.getElementById("stress-progress");
const timerProgress = document.getElementById("timer-progress");

// Voice Control Elements
const micBtn = document.getElementById("mic-btn");
const micStatus = document.getElementById("mic-status");
const recordingIndicator = document.getElementById("recording-indicator");

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isRecording = false;
let finalTranscriptState = '';

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    isRecording = true;
    micBtn.classList.add("recording");
    micStatus.innerText = "Listening...";
    recordingIndicator.classList.remove("hidden");
    answerBox.focus();
  };

  recognition.onresult = (event) => {
    let interimTranscript = '';
    let currentFinal = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        currentFinal += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }

    finalTranscriptState += currentFinal;
    answerBox.value = finalTranscriptState + interimTranscript;
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    stopRecording();
    if(event.error === 'not-allowed') {
      micStatus.innerText = "Microphone access denied";
    } else if (event.error === 'network') {
      micStatus.innerText = "Network/Security error";
      alert("Speech Recognition failed with a 'network' error. This usually happens if you are accessing the site via an IP address (like 192.168.x.x) over HTTP instead of localhost or HTTPS. The Web Speech API requires a secure context (HTTPS or localhost) to function.");
    } else {
      micStatus.innerText = `Error: ${event.error}`;
    }
  };

  recognition.onend = () => {
    stopRecording();
  };
}

function stopRecording() {
  if (isRecording && recognition) {
    recognition.stop();
  }
  isRecording = false;
  micBtn.classList.remove("recording");
  micStatus.innerText = "Click mic to speak";
  recordingIndicator.classList.add("hidden");
}

micBtn.addEventListener("click", () => {
  if (!SpeechRecognition) {
    alert("Speech Recognition API is not supported in this browser. Please use Chrome or Edge.");
    return;
  }

  if (isRecording) {
    stopRecording();
  } else {
    // Save current text area content so we append to it
    finalTranscriptState = answerBox.value;
    if (finalTranscriptState.length > 0 && !finalTranscriptState.endsWith(' ')) {
      finalTranscriptState += ' ';
    }
    try {
      recognition.start();
    } catch(e) {
      console.log("Recognition already started or error:", e);
    }
  }
});

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerText.innerText = `${timeLeft}s`;

    // Update progress bar
    let timePercent = (timeLeft / totalTime) * 100;
    timerProgress.style.width = `${timePercent}%`;
    
    timerProgress.className = "progress-fill";
    if (timeLeft > 15) {
      timerProgress.classList.add("success");
    } else if (timeLeft > 5) {
      timerProgress.classList.add("warning");
    } else {
      timerProgress.classList.add("danger");
    }

    if (timeLeft <= 10) {
      stress += 2;
      updateStress();
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      stopRecording();
      
      let answerLength = answerBox.value.trim().length;
      if (answerLength < 20) {
        alert("Time's up! The interviewer looks disappointed with your short answer.");
      } else {
        alert("Time's up! Moving to the next question.");
      }
      
      nextQuestion();
    }

  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = totalTime;
  timerText.innerText = `${timeLeft}s`;
  timerProgress.style.width = "100%";
  timerProgress.className = "progress-fill success";
  startTimer();
}

function updateStress() {
  if (stress > 100) stress = 100;
  if (stress < 0) stress = 0;

  stressLevel.innerText = `${stress}%`;
  stressProgress.style.width = `${stress}%`;

  // Change color based on stress
  stressProgress.className = "progress-fill";
  if (stress < 40) {
    stressProgress.classList.add("success");
  } else if (stress < 70) {
    stressProgress.classList.add("warning");
  } else {
    stressProgress.classList.add("danger");
  }

  // Visual background feedback
  if (stress >= 70) {
    document.body.style.background = "linear-gradient(135deg, #450a0a, #0f172a)";
  } else {
    document.body.style.background = "var(--bg-color)";
  }
}

function loadQuestion() {
  questionText.innerText = questions[currentQuestion];
  questionCount.innerText = `${currentQuestion + 1}/${questions.length}`;
  
  let qPercent = ((currentQuestion + 1) / questions.length) * 100;
  questionProgress.style.width = `${qPercent}%`;

  answerBox.value = "";
  finalTranscriptState = "";
  stopRecording();
  resetTimer();
}

function nextQuestion() {
  let answerLength = answerBox.value.trim().length;

  if (answerLength < 20) {
    stress += 15;
  } else {
    stress -= 5;
  }

  updateStress();

  currentQuestion++;

  if (currentQuestion >= questions.length) {
    clearInterval(timer);
    stopRecording();

    let finalMessage = "";
    if (stress < 30) {
      finalMessage = "Excellent performance. You stayed calm under pressure.";
    } else if (stress < 70) {
      finalMessage = "Decent performance, but pressure affected your answers.";
    } else {
      finalMessage = "You panicked. Your communication collapsed under stress.";
    }

    setTimeout(() => {
      alert(`Interview Complete!\n\nFinal Stress Level: ${stress}%\n${finalMessage}`);
    }, 100);

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

// Initialize
updateStress();
loadQuestion();