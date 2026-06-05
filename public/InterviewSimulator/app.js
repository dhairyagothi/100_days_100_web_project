const UI = {
  themeToggle: document.getElementById('theme-toggle'),
  roleSelect: document.getElementById('role-select'),
  difficultySelect: document.getElementById('difficulty-select'),
  interviewType: document.getElementById('interview-type'),
  startBtn: document.getElementById('start-ai-btn'),
  micBtn: document.getElementById('mic-btn'),
  micStatus: document.getElementById('mic-status'),
  recordingIndicator: document.getElementById('recording-indicator'),
  answerInput: document.getElementById('answer'),
  nextBtn: document.getElementById('next-btn'),
  restartBtn: document.getElementById('restart-btn'),
  chatContainer: document.getElementById('chat-container'),
  questionCount: document.getElementById('question-count'),
  questionProgress: document.getElementById('question-progress'),
  stressLevel: document.getElementById('stress-level'),
  stressProgress: document.getElementById('stress-progress'),
  timer: document.getElementById('timer'),
  timerProgress: document.getElementById('timer-progress'),
  charCounter: document.getElementById('char-counter'),
  prevBtn: document.getElementById('prev-btn'),
  setupPanel: document.querySelector('.role-selection'),
  interviewBox: document.querySelector('.interview-box'),
  modal: document.getElementById('completion-modal'),
  modalClose: document.getElementById('modal-close'),
  summaryContent: document.getElementById('summary-content'),

historyContainer:
    document.getElementById(
        'history-container'
    ),

historyStats:
    document.getElementById(
        'history-stats'
    ),

clearHistoryBtn:
    document.getElementById(
        'clear-history-btn'
    ),

  historyContainer: document.getElementById('history-container'),

  historyStats: document.getElementById('history-stats'),

  clearHistoryBtn: document.getElementById('clear-history-btn'),

  historyContainer: document.getElementById('history-container'),

  historyStats: document.getElementById('history-stats'),

  clearHistoryBtn: document.getElementById('clear-history-btn'),
};

let state = {
  isInterviewActive: false,
  currentQuestionIndex: 0,
  questions: [],
  answers: {},
  timerInterval: null,
  timeLeft: 60,
  maxTime: 60,
  stressValue: 0,
  recognition: null,
  isRecording: false,
};

const DIFFICULTY_SETTINGS = {
  Beginner: { time: 90, stressIncrement: 5 },
  Intermediate: { time: 60, stressIncrement: 10 },
  Advanced: { time: 45, stressIncrement: 15 },
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initPreferences();
  initSpeechRecognition();
  setupEventListeners();
  renderInterviewHistory();
});

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeToggleIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggleIcon(newTheme);
}

function updateThemeToggleIcon(theme) {
  if (!UI.themeToggle) return;
  const icon = UI.themeToggle.querySelector('i');
  if (theme === 'light') {
    icon.className = 'fa-solid fa-moon';
  } else {
    icon.className = 'fa-solid fa-sun';
  }
}

function initPreferences() {
  if (localStorage.getItem('pref-role'))
    UI.roleSelect.value = localStorage.getItem('pref-role');
  if (localStorage.getItem('pref-difficulty'))
    UI.difficultySelect.value = localStorage.getItem('pref-difficulty');
  if (localStorage.getItem('pref-type'))
    UI.interviewType.value = localStorage.getItem('pref-type');
}

function savePreferences() {
  localStorage.setItem('pref-role', UI.roleSelect.value);
  localStorage.setItem('pref-difficulty', UI.difficultySelect.value);
  localStorage.setItem('pref-type', UI.interviewType.value);
}

function setupEventListeners() {
  if (UI.themeToggle) UI.themeToggle.addEventListener('click', toggleTheme);
  UI.startBtn.addEventListener('click', startInterview);
  UI.nextBtn.addEventListener('click', handleNextQuestion);
  if (UI.prevBtn) UI.prevBtn.addEventListener('click', handlePreviousQuestion);
  UI.restartBtn.addEventListener('click', resetInterview);
  UI.micBtn.addEventListener('click', toggleVoiceInput);

  UI.answerInput.addEventListener('input', () => {
    updateCharacterCount();
    state.answers[state.currentQuestionIndex] = UI.answerInput.value;
  });

  if (UI.modalClose) UI.modalClose.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => {
    if (e.target === UI.modal) closeModal();
  });

  if (UI.clearHistoryBtn) {

    UI.clearHistoryBtn.addEventListener(
        'click',
        clearInterviewHistory
    );

}

  document.addEventListener('keydown', (e) => {
    if (!state.isInterviewActive) return;
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleNextQuestion();
    }
    if (e.ctrlKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      if (UI.prevBtn && !UI.prevBtn.disabled) handlePreviousQuestion();
    }
  });
}

function initSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    state.recognition = new SpeechRecognition();
    state.recognition.continuous = true;
    state.recognition.interimResults = true;
    state.recognition.lang = 'en-US';

    state.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        UI.answerInput.value +=
          (UI.answerInput.value ? ' ' : '') + finalTranscript;
        state.answers[state.currentQuestionIndex] = UI.answerInput.value;
        updateCharacterCount();
      }
    };

    state.recognition.onerror = () => {
      stopRecording();
    };
    state.recognition.onend = () => {
      if (state.isRecording) stopRecording();
    };
  } else {
    UI.micBtn.style.display = 'none';
    UI.micStatus.textContent = 'Voice input not supported';
  }
}

function toggleVoiceInput() {
  if (!state.recognition) return;
  if (state.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  state.isRecording = true;
  UI.micBtn.classList.add('recording');
  UI.recordingIndicator.classList.remove('hidden');
  UI.micStatus.textContent = 'Listening...';
  state.recognition.start();
}

function stopRecording() {
  state.isRecording = false;
  UI.micBtn.classList.remove('recording');
  UI.recordingIndicator.classList.add('hidden');
  UI.micStatus.textContent = 'Click mic to speak';
  state.recognition.stop();
}

async function startInterview() {
  savePreferences();
  UI.startBtn.disabled = true;
  UI.startBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Generating...`;

  const questionsLoaded = await fetchQuestionsFromGroq();

  UI.startBtn.disabled = false;
  UI.startBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Initialize Simulator`;

  if (!questionsLoaded) return;

  state.isInterviewActive = true;
  state.currentQuestionIndex = 0;
  state.answers = {};
  state.stressValue = 0;

  UI.setupPanel.classList.add('hidden');
  UI.interviewBox.classList.remove('hidden');

  displayQuestion();
}

async function fetchQuestionsFromGroq() {
  const role = UI.roleSelect.value;
  const type = UI.interviewType.value;
  const difficulty = UI.difficultySelect.value;

  const systemPrompt = `You are an expert technical interviewer system. Generate exactly 5 targeted interview questions matching requested parameters. Return output strictly as a JSON object containing a property "questions" which maps to an array of strings. Do not include markdown codeblocks or wrapper prose. Example structure: {"questions": ["Q1", "Q2"]}`;
  const userPrompt = `Generate a 5-question interview list for a ${role} position. Interview focus type: ${type}. Difficulty setting requirement: ${difficulty}.`;

  try {
    const response = await fetch(CONFIG.GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);

    const data = await response.json();
    const jsonResponse = JSON.parse(data.choices[0].message.content);
    const questionsArray =
      jsonResponse.questions || Object.values(jsonResponse)[0];

    if (Array.isArray(questionsArray) && questionsArray.length > 0) {
      state.questions = questionsArray;
      return true;
    }
    throw new Error('Parsed object did not contain structural string matrix.');
  } catch (error) {
    console.error('Groq Engine Request Failure:', error);
    alert(
      'Unable to fetch dynamic queries. Falling back to internal defaults.'
    );
    state.questions = [
      `Can you explain your core technical stack and background as a ${role}?`,
      `Describe a complex problem you solved recently under a ${difficulty} environment context.`,
      `How do you approach performance optimization when handling a ${type} delivery loop?`,
      'What is your approach to handling cross-functional team disagreements?',
      'Where do you see your engineering skills evolving over the next year?',
    ];
    return true;
  }
}

function clearElement(element) {
  element.textContent = '';
}

function createMetricCard(titleText, valueText) {
  const card = document.createElement('div');
  const title = document.createElement('h4');
  const value = document.createElement('p');

  card.className = 'metric-card';
  title.textContent = titleText;
  value.className = 'metric-val';
  value.textContent = valueText;

  card.append(title, value);
  return card;
}

function appendPrefixedText(parent, prefixText, valueText) {
  const prefix = document.createElement('strong');

  prefix.textContent = prefixText;
  parent.append(prefix, ` ${valueText}`);
}

function displayQuestion() {
  stopRecording();
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const message = document.createElement('div');
  const questionText = document.createElement('p');

  message.className = 'chat-message bot-message entry-animation';
  questionText.textContent = currentQuestion;
  message.appendChild(questionText);

  clearElement(UI.chatContainer);
  UI.chatContainer.appendChild(message);

  UI.answerInput.value = state.answers[state.currentQuestionIndex] || '';
  updateCharacterCount();
  updateProgress();
  startTimer();
}

function startTimer() {
  clearInterval(state.timerInterval);
  const difficulty = UI.difficultySelect.value;
  state.maxTime = DIFFICULTY_SETTINGS[difficulty]?.time || 60;
  state.timeLeft = state.maxTime;

  updateTimerDisplay();

  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.timerInterval);
      handleNextQuestion();
    }
  }, 1000);
}

function updateTimerDisplay() {
  UI.timer.textContent = `${state.timeLeft}s`;
  const percentage = (state.timeLeft / state.maxTime) * 100;
  UI.timerProgress.style.width = `${percentage}%`;

  if (percentage < 25) {
    UI.timerProgress.className = 'progress-fill danger';
  } else if (percentage < 60) {
    UI.timerProgress.className = 'progress-fill warning';
  } else {
    UI.timerProgress.className = 'progress-fill success';
  }
}

function updateProgress() {
  const total = state.questions.length;
  const current = state.currentQuestionIndex + 1;

  UI.questionCount.textContent = `${current}/${total}`;
  const percentage = (current / total) * 100;
  UI.questionProgress.style.width = `${percentage}%`;

  if (UI.prevBtn) UI.prevBtn.disabled = state.currentQuestionIndex === 0;

  if (state.currentQuestionIndex === total - 1) {
    UI.nextBtn.querySelector('span').textContent = 'Finish Interview';
  } else {
    UI.nextBtn.querySelector('span').textContent = 'Send Answer';
  }
}

function updateCharacterCount() {
  if (!UI.charCounter) return;
  const count = UI.answerInput.value.length;
  const words = UI.answerInput.value.trim()
    ? UI.answerInput.value.trim().split(/\s+/).length
    : 0;
  UI.charCounter.textContent = `${count} characters | ${words} words`;
}

function handleNextQuestion() {
  state.answers[state.currentQuestionIndex] = UI.answerInput.value;
  calculateStress();

  if (state.currentQuestionIndex < state.questions.length - 1) {
    state.currentQuestionIndex++;
    displayQuestion();
  } else {
    completeInterview();
  }
}

function handlePreviousQuestion() {
  if (state.currentQuestionIndex > 0) {
    state.answers[state.currentQuestionIndex] = UI.answerInput.value;
    state.currentQuestionIndex--;
    displayQuestion();
  }
}

function calculateStress() {
  const difficulty = UI.difficultySelect.value;
  const increment = DIFFICULTY_SETTINGS[difficulty]?.stressIncrement || 10;
  const answer = state.answers[state.currentQuestionIndex] || '';

  if (answer.trim().length === 0) {
    state.stressValue += increment;
  } else if (state.timeLeft < 10) {
    state.stressValue += Math.floor(increment / 2);
  } else {
    state.stressValue -= Math.floor(increment / 3);
  }

  state.stressValue = Math.max(0, Math.min(100, state.stressValue));

  UI.stressLevel.textContent = `${state.stressValue}%`;
  UI.stressProgress.style.width = `${state.stressValue}%`;

  if (state.stressValue > 70) {
    UI.stressProgress.className = 'progress-fill danger';
  } else if (state.stressValue > 40) {
    UI.stressProgress.className = 'progress-fill warning';
  } else {
    UI.stressProgress.className = 'progress-fill success';
  }
}

async function completeInterview() {
  clearInterval(state.timerInterval);
  stopRecording();
  state.isInterviewActive = false;

  // Trigger modal immediately with a skeleton loading state
  if (UI.summaryContent) {
   
    const loadingState = document.createElement('div');
    const loadingIcon = document.createElement('i');
    const loadingText = document.createElement('p');

    loadingState.style.cssText = 'text-align: center; padding: 40px 0;';
    loadingIcon.className = 'fa-solid fa-spinner fa-spin';
    loadingIcon.style.cssText =
      'font-size: 2.5rem; color: #7c63ff; margin-bottom: 16px;';
    loadingText.textContent =
      'Analyzing candidate performance metrics and structuring evaluation responses via Groq AI...';

    loadingState.append(loadingIcon, loadingText);
    clearElement(UI.summaryContent);
    UI.summaryContent.appendChild(loadingState);
  }
  openModal();

  // Prepare content diagnostics array for LLM processing
  const breakdownArray = state.questions.map((q, idx) => ({
    question: q,
    candidateAnswer: state.answers[idx] || '',
  }));

  const systemPrompt = `You are an elite, strict HR and technical evaluation engine. Analyze the given list of questions and candidate answers for a ${UI.roleSelect.value} position at a ${UI.difficultySelect.value} difficulty level.
    You must compute an objective integer value for confidenceScore between 0 and 100 based on answer accuracy and completeness. CRITICAL: If all or most answers are empty string or represent minimal effort, your confidenceScore MUST be exceptionally low (e.g., 0 to 15%). Provide a constructive analysis text summary block detailing concrete assessment patterns. Return output strictly as a JSON object matching this schema:
    {"confidenceScore": number, "evaluationAssessment": "string"}`;

  const userPrompt = `System UI measured runtime stress value was: ${state.stressValue}%. Here is the exact performance breakdown: ${JSON.stringify(breakdownArray)}`;

  let confidenceScore = 100 - Math.floor(state.stressValue * 0.6);
  let descriptiveMetrics =
    'Diagnostic complete. General performance criteria fulfilled.';

  try {
    const response = await fetch(CONFIG.GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: CONFIG.MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const parsedGrok = JSON.parse(data.choices[0].message.content);
      confidenceScore = parsedGrok.confidenceScore ?? confidenceScore;
      descriptiveMetrics =
        parsedGrok.evaluationAssessment ?? descriptiveMetrics;
    }
  } catch (e) {
    console.error('Failed executing dynamic remote assessment analytics:', e);
  }
saveInterviewHistory({

  role: UI.roleSelect.value,

  difficulty:
      UI.difficultySelect.value,

  interviewType:
      UI.interviewType.value,

  questions:
      state.questions,

  answers:
      state.answers,

  confidenceScore:
      confidenceScore,

  stressScore:
      state.stressValue,

  evaluationAssessment:
      descriptiveMetrics,

  completedAt:
      new Date().toLocaleString()

});
  if (UI.summaryContent) {
    const metricGrid = document.createElement('div');
    const analysisBox = document.createElement('div');
    const analysisTitle = document.createElement('h4');
    const analysisText = document.createElement('p');
    const reviewList = document.createElement('div');
    const reviewTitle = document.createElement('h4');

    metricGrid.className = 'metric-grid';
    metricGrid.append(
      createMetricCard('Composure Baseline', `${100 - state.stressValue}%`),
      createMetricCard('Confidence Metric', `${confidenceScore}%`)
    );

    analysisBox.className = 'analysis-box';
    analysisTitle.textContent = 'Evaluation Assessment';
    analysisText.textContent = descriptiveMetrics;
    analysisBox.append(analysisTitle, analysisText);

    reviewList.className = 'review-list';
    reviewTitle.textContent = 'Responses Diagnostic Breakdown';
    reviewList.appendChild(reviewTitle);

    state.questions.forEach((question, index) => {
      const answer =
        state.answers[index] || 'No input recorded inside the temporal limits.';
      const reviewItem = document.createElement('div');
      const questionText = document.createElement('p');
      const answerText = document.createElement('p');

      reviewItem.className = 'review-item';
      questionText.className = 'review-q';
      answerText.className = 'review-a';
      appendPrefixedText(questionText, `Q${index + 1}:`, question);
      appendPrefixedText(answerText, 'Your Answer:', answer);
      reviewItem.append(questionText, answerText);
      reviewList.appendChild(reviewItem);
    });

    clearElement(UI.summaryContent);
    UI.summaryContent.append(metricGrid, analysisBox, reviewList);
  }
}

function saveInterviewHistory(session) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "interview-history"
            )
        ) || [];

    history.unshift(session);

    localStorage.setItem(
        "interview-history",
        JSON.stringify(
            history.slice(0, 20)
        )
    );

    renderInterviewHistory();
}

function renderInterviewHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "interview-history"
            )
        ) || [];

    if (!UI.historyContainer) return;

    UI.historyContainer.innerHTML = "";

    history.forEach((session) => {

        const card =
            document.createElement("div");

        card.className =
            "history-card";

        const title = document.createElement("h4");
title.textContent = session.role;

const difficulty = document.createElement("p");
difficulty.textContent = session.difficulty;

const confidence = document.createElement("p");
confidence.textContent =
  `Confidence: ${session.confidenceScore}%`;

const stress = document.createElement("p");
stress.textContent =
  `Stress: ${session.stressScore}%`;

const date = document.createElement("small");
date.textContent = session.completedAt;

card.appendChild(title);
card.appendChild(difficulty);
card.appendChild(confidence);
card.appendChild(stress);
card.appendChild(date);

        UI.historyContainer.appendChild(card);

    });

    renderHistoryStats(history);
}

function renderHistoryStats(history) {

    if (
        !history.length ||
        !UI.historyStats
    ) return;

    const avgConfidence =
        Math.round(
            history.reduce(
                (sum, item) =>
                    sum +
                    item.confidenceScore,
                0
            ) / history.length
        );

    UI.historyStats.innerHTML = `
        <div class="metric-card">
            <h4>Total Interviews</h4>
            <p>${history.length}</p>
        </div>

        <div class="metric-card">
            <h4>Average Confidence</h4>
            <p>${avgConfidence}%</p>
        </div>
    `;
}

function clearInterviewHistory() {

    localStorage.removeItem(
        "interview-history"
    );

    renderInterviewHistory();
}

function openModal() {
  if (UI.modal) {
    UI.modal.classList.add('active');
    UI.modal.setAttribute('aria-hidden', 'false');
  }
}

function closeModal() {
  if (UI.modal) {
    UI.modal.classList.remove('active');
    UI.modal.setAttribute('aria-hidden', 'true');
  }
  resetInterview();
}

function resetInterview() {
  clearInterval(state.timerInterval);
  stopRecording();
  state.isInterviewActive = false;
  state.currentQuestionIndex = 0;
  state.answers = {};
  state.stressValue = 0;

  UI.stressLevel.textContent = '0%';
  UI.stressProgress.style.width = '0%';
  UI.stressProgress.className = 'progress-fill success';
  UI.timer.textContent = '60s';
  UI.timerProgress.style.width = '100%';
  UI.timerProgress.className = 'progress-fill success';
  UI.answerInput.value = '';

  UI.interviewBox.classList.add('hidden');
  UI.setupPanel.classList.remove('hidden');
}
