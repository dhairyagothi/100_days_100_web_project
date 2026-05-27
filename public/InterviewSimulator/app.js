const questions = [
  "Tell me about yourself.",
  "Why should we hire you?",
  "What are your strengths and weaknesses?",
  "Explain a challenging project you worked on.",
  "Where do you see yourself in 5 years?"
];

let selectedRole = "";
let aiQuestions = [];
let currentQuestion = 0;
let stress = 0;
let timeLeft = 60;
let timer;
let userAnswers = [];

const totalTime = 60;

const questionCount =
  document.getElementById("question-count");

const stressLevel =
  document.getElementById("stress-level");

const timerText =
  document.getElementById("timer");

const answerBox =
  document.getElementById("answer");

const nextBtn =
  document.getElementById("next-btn");

const restartBtn =
  document.getElementById("restart-btn");

const roleSelect =
  document.getElementById("role-select");

const startAiBtn =
  document.getElementById("start-ai-btn");

const difficultySelect =
  document.getElementById("difficulty-select");

const interviewType =
  document.getElementById("interview-type");

const chatContainer =
  document.getElementById("chat-container");

const questionProgress =
  document.getElementById("question-progress");

const stressProgress =
  document.getElementById("stress-progress");

const timerProgress =
  document.getElementById("timer-progress");

const micBtn =
  document.getElementById("mic-btn");

const micStatus =
  document.getElementById("mic-status");

const recordingIndicator =
  document.getElementById("recording-indicator");

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition;

let isRecording = false;

let finalTranscriptState = "";

function addAIMessage(message) {

  const msg =
    document.createElement("div");

  msg.className =
    "ai-message";

  msg.innerHTML =
    `
      <div class="message-label">
        🤖 AI Interviewer
      </div>

      <div class="message-content">
        ${formatMarkdown(message)}
      </div>
    `;

  chatContainer.appendChild(msg);

  chatContainer.scrollTop =
    chatContainer.scrollHeight;

}

function addUserMessage(message) {

  const msg =
    document.createElement("div");

  msg.className =
    "user-message";

  msg.innerHTML =
    `
      <div class="message-label">
        👤 You
      </div>

      <div class="message-content">
        ${formatMarkdown(message)}
      </div>
    `;

  chatContainer.appendChild(msg);

  chatContainer.scrollTop =
    chatContainer.scrollHeight;

}

function addThinkingMessage() {

  const msg =
    document.createElement("div");

  msg.className =
    "thinking-message";

  msg.id =
    "thinking-message";

  msg.innerHTML =
    `
      <div class="message-label">
        🤖 AI Interviewer
      </div>

      <div class="message-content">
        AI is analyzing...
      </div>
    `;

  chatContainer.appendChild(msg);

  chatContainer.scrollTop =
    chatContainer.scrollHeight;

}

function removeThinkingMessage() {

  const thinking =
    document.getElementById(
      "thinking-message"
    );

  if (thinking) {
    thinking.remove();
  }

}

async function generateAIQuestions() {

  selectedRole =
    roleSelect.value;

  const difficulty =
    difficultySelect.value;

  const type =
    interviewType.value;

  startAiBtn.innerHTML =
    "Generating...";

  startAiBtn.disabled = true;

  chatContainer.innerHTML = "";

  addThinkingMessage();

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${GROQ_API_KEY}`

        },

        body: JSON.stringify({

          model:
            "llama-3.1-8b-instant",

          messages: [

            {

              role: "system",

              content:
`You are a professional interviewer conducting a realistic ${type} interview for a ${selectedRole} role.

Difficulty level: ${difficulty}

Generate exactly 5 conversational interview questions.

Structure:
1. Friendly introduction
2. Experience/project discussion
3. Practical field-related question
4. Scenario/problem-solving question
5. Career/behavioral closing question

Rules:
- Human-like tone
- Conversational style
- Questions should smoothly transition naturally
- Avoid textbook theory questions
- Focus on realistic interviews
- One question per line
- No numbering
- No explanations`

            }

          ]

        })

      }
    );

    const data =
      await response.json();

    removeThinkingMessage();

    const content =
      data.choices[0].message.content;

    aiQuestions =
      content
      .split("\n")
      .filter(q => q.trim() !== "");

    questions.length = 0;

    aiQuestions.forEach(q => {
      questions.push(q);
    });

    currentQuestion = 0;

    stress = 0;

    userAnswers = [];

    updateStress();

    loadQuestion();

    startAiBtn.innerHTML =
      "Interview Ready";

  }

  catch(error) {

    removeThinkingMessage();

    console.error(error);

    alert(
      "Failed to generate AI questions."
    );

    startAiBtn.innerHTML =
      "Start AI Interview";

  }

}

if (SpeechRecognition) {

  recognition =
    new SpeechRecognition();

  recognition.continuous = true;

  recognition.interimResults = true;

  recognition.lang = "en-US";

  recognition.onstart = () => {

    isRecording = true;

    micBtn.classList.add(
      "recording"
    );

    micStatus.innerText =
      "Listening...";

    recordingIndicator.classList.remove(
      "hidden"
    );

    answerBox.focus();

  };

  recognition.onresult =
    (event) => {

      let interimTranscript = "";

      let currentFinal = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {

        const transcript =
          event.results[i][0].transcript;

        if (
          event.results[i].isFinal
        ) {

          currentFinal +=
            transcript + " ";

        }

        else {

          interimTranscript +=
            transcript;

        }

      }

      finalTranscriptState +=
        currentFinal;

      answerBox.value =
        finalTranscriptState +
        interimTranscript;

    };

  recognition.onend = () => {

    stopRecording();

  };

}

function stopRecording() {

  if (
    isRecording &&
    recognition
  ) {

    recognition.stop();

  }

  isRecording = false;

  micBtn.classList.remove(
    "recording"
  );

  micStatus.innerText =
    "Click mic to speak";

  recordingIndicator.classList.add(
    "hidden"
  );

}

micBtn.addEventListener(
  "click",
  () => {

    if (!SpeechRecognition) {

      alert(
        "Speech Recognition is not supported."
      );

      return;

    }

    if (isRecording) {

      stopRecording();

    }

    else {

      finalTranscriptState =
        answerBox.value;

      if (
        finalTranscriptState.length > 0 &&
        !finalTranscriptState.endsWith(" ")
      ) {

        finalTranscriptState += " ";

      }

      recognition.start();

    }

  }
);

function startTimer() {

  timer =
    setInterval(() => {

      timeLeft--;

      timerText.innerText =
        `${timeLeft}s`;

      let timePercent =
        (timeLeft / totalTime) * 100;

      timerProgress.style.width =
        `${timePercent}%`;

      if (timeLeft <= 10) {

        stress += 2;

        updateStress();

      }

      if (timeLeft <= 0) {

        clearInterval(timer);

        nextQuestion();

      }

    }, 1000);

}

function resetTimer() {

  clearInterval(timer);

  timeLeft = totalTime;

  timerText.innerText =
    `${timeLeft}s`;

  timerProgress.style.width =
    "100%";

  startTimer();

}

function updateStress() {

  if (stress > 100)
    stress = 100;

  if (stress < 0)
    stress = 0;

  stressLevel.innerText =
    `${stress}%`;

  stressProgress.style.width =
    `${stress}%`;

}

function loadQuestion() {

  addAIMessage(
    questions[currentQuestion]
  );

  questionCount.innerText =
    `${currentQuestion + 1}/${questions.length}`;

  let qPercent =
    (
      (currentQuestion + 1)
      /
      questions.length
    ) * 100;

  questionProgress.style.width =
    `${qPercent}%`;

  answerBox.value = "";

  finalTranscriptState = "";

  stopRecording();

  resetTimer();

}
function formatMarkdown(text) {

  return text

    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    .replace(/\n/g, "<br>");

}
async function generateFinalReport() {

  addThinkingMessage();

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Authorization":
            `Bearer ${GROQ_API_KEY}`

        },

        body: JSON.stringify({

          model:
            "llama-3.1-8b-instant",

          messages: [

            {

              role: "system",

              content:
`You are an expert interview evaluator.

Analyze this mock interview.

Give:
1. Communication Score (/10)
2. Technical Confidence (/10)
3. Strengths
4. Weaknesses
5. Final Hiring Recommendation

Rules:
- concise
- professional
- realistic
- recruiter-like
- easy to read`

            },

            {

              role: "user",

              content:
`
Role: ${selectedRole}

Answers:
${userAnswers.join("\n\n")}
`

            }

          ]

        })

      }
    );

    const data =
      await response.json();

    removeThinkingMessage();

    addAIMessage(
      data.choices[0].message.content
    );

  }

  catch(error) {

    removeThinkingMessage();

    addAIMessage(
      "Unable to generate final report."
    );

  }

}

async function nextQuestion() {

  const answer =
    answerBox.value.trim();

  if (answer === "") return;

  userAnswers.push(answer);

  addUserMessage(answer);

  let answerLength =
    answer.length;

  if (answerLength < 20) {

    stress += 15;

  }

  else {

    stress -= 5;

  }

  updateStress();

  currentQuestion++;

  answerBox.value = "";

  if (
    currentQuestion >= questions.length
  ) {

    clearInterval(timer);

    stopRecording();

    addThinkingMessage();

    setTimeout(async () => {

      removeThinkingMessage();

      addAIMessage(
        "Interview completed successfully. Generating your final AI evaluation report..."
      );

      await generateFinalReport();

    }, 1500);

    return;

  }

  setTimeout(() => {

    loadQuestion();

  }, 1200);

}

restartBtn.addEventListener(
  "click",
  () => {

    currentQuestion = 0;

    stress = 0;

    userAnswers = [];

    chatContainer.innerHTML = "";

    updateStress();

    loadQuestion();

  }
);

nextBtn.addEventListener(
  "click",
  nextQuestion
);

startAiBtn.addEventListener(
  "click",
  generateAIQuestions
);

updateStress();