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
  lowEffortConfirmations: {},
};

const DIFFICULTY_SETTINGS = {
  Beginner: { time: 90, stressIncrement: 5 },
  Intermediate: { time: 60, stressIncrement: 10 },
  Advanced: { time: 45, stressIncrement: 15 },
};

const PLACEHOLDER_API_KEYS = new Set([
  '',
  'YOUR_KEY',
  'YOUR_API_KEY',
  'PASTE_YOUR_GROQ_API_KEY_HERE',
]);

const DEFAULT_GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';

const LOW_EFFORT_RESPONSES = new Set([
  'aaa',
  'asdf',
  'idk',
  'i dont know',
  "i don't know",
  'na',
  'n/a',
  'none',
  'qwerty',
  'random',
  'skip',
  'test',
  'testing',
  'xyz',
]);

const RELEVANCE_STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'can',
  'do',
  'for',
  'how',
  'in',
  'is',
  'of',
  'on',
  'or',
  'the',
  'to',
  'what',
  'when',
  'where',
  'with',
  'you',
  'your',
]);

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
  if (!state.recognition) return;
  const wasRecording = state.isRecording;

  state.isRecording = false;
  UI.micBtn.classList.remove('recording');
  UI.recordingIndicator.classList.add('hidden');
  UI.micStatus.textContent = 'Click mic to speak';
  if (wasRecording) state.recognition.stop();
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
  state.lowEffortConfirmations = {};

  UI.setupPanel.classList.add('hidden');
  UI.interviewBox.classList.remove('hidden');

  displayQuestion();
}

async function fetchQuestionsFromGroq() {
  const role = UI.roleSelect.value;
  const type = UI.interviewType.value;
  const difficulty = UI.difficultySelect.value;
  const groqConfig = getGroqConfig();

  if (!groqConfig) {
    // Placeholder or missing keys are expected in local demos, so skip the
    // remote request and keep the simulator usable with internal questions.
    alert(
      'Groq question generation is running in fallback mode because no valid API key is configured. Using internal interview questions instead.'
    );
    state.questions = getFallbackQuestions(role, type, difficulty);
    return true;
  }

  const systemPrompt = `You are an expert technical interviewer system. Generate exactly 5 targeted interview questions matching requested parameters. Return output strictly as a JSON object containing a property "questions" which maps to an array of strings. Do not include markdown codeblocks or wrapper prose. Example structure: {"questions": ["Q1", "Q2"]}`;
  const userPrompt = `Generate a 5-question interview list for a ${role} position. Interview focus type: ${type}. Difficulty setting requirement: ${difficulty}.`;

  try {
    const response = await fetch(groqConfig.apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: groqConfig.model,
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
      'Unable to reach Groq question generation right now. Using internal fallback questions so the interview can continue.'
    );
    state.questions = getFallbackQuestions(role, type, difficulty);
    return true;
  }
}

function isGroqApiConfigured() {
  return Boolean(getGroqConfig());
}

function getGroqConfig() {
  const fileConfig = typeof CONFIG !== 'undefined' ? CONFIG : {};
  const apiKey = String(fileConfig.GROQ_API_KEY || '').trim();

  if (!isUsableGroqKey(apiKey)) return null;

  return {
    apiKey,
    apiUrl: fileConfig.GROQ_API_URL || DEFAULT_GROQ_API_URL,
    model: fileConfig.MODEL || DEFAULT_GROQ_MODEL,
  };
}

function isUsableGroqKey(apiKey) {
  return apiKey.length > 0 && !PLACEHOLDER_API_KEYS.has(apiKey);
}

function getFallbackQuestions(role, type, difficulty) {
  return [
    `Can you explain your core technical stack and background as a ${role}?`,
    `Describe a complex problem you solved recently under a ${difficulty} environment context.`,
    `How do you approach performance optimization when handling a ${type} delivery loop?`,
    'What is your approach to handling cross-functional team disagreements?',
    'Where do you see your engineering skills evolving over the next year?',
  ];
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
      handleNextQuestion({ skipLowEffortWarning: true });
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
  const words = getWordCount(UI.answerInput.value);
  UI.charCounter.textContent = `${count} characters | ${words} words`;
}

function handleNextQuestion(options = {}) {
  state.answers[state.currentQuestionIndex] = UI.answerInput.value;

  if (shouldWarnForLowEffortAnswer(options)) {
    const canContinue = confirm(
      'Your response appears very short or low effort. Are you sure you want to continue?'
    );

    if (!canContinue) return;
    state.lowEffortConfirmations[state.currentQuestionIndex] = true;
  }

  calculateStress();

  if (state.currentQuestionIndex < state.questions.length - 1) {
    state.currentQuestionIndex++;
    displayQuestion();
  } else {
    completeInterview();
  }
}

function shouldWarnForLowEffortAnswer(options) {
  if (options.skipLowEffortWarning || state.isRecording) return false;
  if (state.lowEffortConfirmations[state.currentQuestionIndex]) return false;
  if (!isLowEffortAnswer(state.answers[state.currentQuestionIndex] || '')) {
    return false;
  }

  return true;
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
  } else if (isLowEffortAnswer(answer)) {
    // Low-effort responses should increase pressure instead of being treated
    // like valid answers simply because the field contains text.
    state.stressValue += Math.ceil(increment * 0.75);
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

function getWordCount(answer) {
  const trimmedAnswer = answer.trim();
  return trimmedAnswer ? trimmedAnswer.split(/\s+/).length : 0;
}

function normalizeAnswer(answer) {
  return answer
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isLowEffortAnswer(answer) {
  const normalizedAnswer = normalizeAnswer(answer);
  const compactAnswer = normalizedAnswer.replace(/\s/g, '');
  const words = normalizedAnswer ? normalizedAnswer.split(/\s+/) : [];
  const uniqueWords = new Set(words);

  if (!normalizedAnswer) return true;
  if (getWordCount(answer) < 4) return true;
  if (LOW_EFFORT_RESPONSES.has(normalizedAnswer)) return true;
  if (/^([a-z0-9])\1{2,}$/.test(compactAnswer)) return true;
  if (/(.)\1{4,}/.test(compactAnswer) && getWordCount(answer) <= 6) {
    return true;
  }
  if (words.length >= 2 && uniqueWords.size === 1) return true;
  if (words.length >= 4 && uniqueWords.size / words.length <= 0.35) {
    return true;
  }
  if (/^(asdf|qwer|qwerty|zxcv|hjkl|jkl|xyz)+$/i.test(compactAnswer)) {
    return true;
  }

  return false;
}

function evaluateLocalConfidence() {
  const totalQuestions = state.questions.length || 1;
  const answers = state.questions.map((_, index) => state.answers[index] || '');
  const answerEvaluations = state.questions.map((question, index) =>
    evaluateLocalAnswerRelevance(question, answers[index], index)
  );
  const wordCounts = answers.map(getWordCount);
  const unansweredCount = answers.filter(
    (answer) => answer.trim().length === 0
  ).length;
  const lowEffortCount = answers.filter(
    (answer) => answer.trim() && isLowEffortAnswer(answer)
  ).length;
  const averageRelevanceScore =
    answerEvaluations.reduce(
      (sum, evaluation) => sum + evaluation.relevanceScore,
      0
    ) / totalQuestions;
  const meaningfulCount = Math.max(
    totalQuestions - unansweredCount - lowEffortCount,
    0
  );
  const averageWordCount =
    wordCounts.reduce((sum, count) => sum + count, 0) / totalQuestions;
  const lowEffortPercent = lowEffortCount / totalQuestions;
  const unansweredPercent = unansweredCount / totalQuestions;
  const meaningfulPercent = meaningfulCount / totalQuestions;

  // Local fallback scoring blends answer depth, answer quality, stress, and
  // unanswered questions so confidence is never derived from stress alone.
  const lengthScore = Math.min(averageWordCount * 2, 45);
  const qualityScore = meaningfulPercent * 20;
  const relevanceScore = averageRelevanceScore * 0.25;
  const composureScore = (100 - state.stressValue) * 0.15;
  const penaltyScore = lowEffortPercent * 30 + unansweredPercent * 35;
  const confidenceScore = clampScore(Math.round(lengthScore + qualityScore + relevanceScore + composureScore - penaltyScore));

  const strengths = [];
  const areasForImprovement = [];
  
  if (averageWordCount > 20) strengths.push("Detailed explanations");
  if (meaningfulPercent > 0.5) strengths.push("Good effort in answering");
  if (state.stressValue < 40) strengths.push("Maintained composure");
  
  if (lowEffortPercent > 0.3) areasForImprovement.push("Incomplete answers");
  if (unansweredPercent > 0) areasForImprovement.push("Missed questions");
  if (averageWordCount <= 20) areasForImprovement.push("Lack of technical depth");
  if (strengths.length === 0) strengths.push("Completed the interview");

  return {
    scores: {
      technicalKnowledge: clampScore(Math.round(lengthScore + averageRelevanceScore * 0.5)),
      communication: clampScore(Math.round(qualityScore * 2 + averageWordCount)),
      problemSolving: clampScore(Math.round(relevanceScore * 2 + meaningfulPercent * 50)),
      confidence: confidenceScore,
      stress: state.stressValue
    },
    overallFeedback: buildLocalEvaluationSummary({
      averageWordCount, averageRelevanceScore, lowEffortCount, meaningfulCount, totalQuestions, unansweredCount
    }),
    strengths: strengths,
    areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement : ["Provide more examples"],
    recommendedLearning: ["System Design Fundamentals", "Mock Interview Practice", "Core Technical Concepts"],
    answerEvaluations: answerEvaluations
  };
}

function evaluateLocalAnswerRelevance(question, answer, index) {
  if (!answer.trim()) {
    return {
      questionIndex: index,
      rating: "Poor",
      strengths: [],
      missingConcepts: ["Core topic of the question"],
      improvementSuggestions: ["Ensure you provide at least a basic answer rather than leaving it blank."],
      sampleStrongAnswer: "A strong answer would directly address the question with technical depth and practical examples.",
      relevanceScore: 0,
      correctnessScore: 0,
      answeredQuestion: false,
      feedback:
        'No answer was recorded, so this question could not be evaluated.',
    };
  }

  if (isLowEffortAnswer(answer)) {
    return {
      questionIndex: index,
      rating: "Poor",
      strengths: [],
      missingConcepts: ["Technical specifics", "Clear explanation"],
      improvementSuggestions: ["Avoid very short or low-effort answers. Elaborate on your points."],
      sampleStrongAnswer: "A strong answer would directly address the question with technical depth and practical examples.",
      relevanceScore: 0,
      correctnessScore: 0,
      answeredQuestion: false,
      feedback:
        'The response looks too short or repetitive to answer the question.',
    };
  }

  const questionKeywords = getSignificantTerms(question);
  const answerTerms = new Set(getSignificantTerms(answer));
  const matchedTerms = questionKeywords.filter((term) => answerTerms.has(term));
  const overlapRatio = questionKeywords.length > 0 ? matchedTerms.length / questionKeywords.length : 0;
  const relevanceScore = clampScore(overlapRatio * 70 + Math.min(getWordCount(answer), 15) * 2);
  const answeredQuestion = relevanceScore >= 35;
  
  let rating = "Fair";
  if (relevanceScore > 70) rating = "Excellent";
  else if (relevanceScore > 50) rating = "Good";
  else if (!answeredQuestion) rating = "Poor";

  return {
    questionIndex: index,
    rating: rating,
    strengths: answeredQuestion ? ["Attempted the topic", "Used relevant keywords"] : [],
    missingConcepts: answeredQuestion ? [] : ["Specifics requested in the prompt"],
    improvementSuggestions: ["Include concrete examples from past projects", "Structure your answer using the STAR method"],
    sampleStrongAnswer: "A strong answer would detail a specific scenario, the actions taken, and the measurable results achieved, relating closely to the technical stack.",
    relevanceScore: relevanceScore
  };
}

function getSignificantTerms(text) {
  return normalizeAnswer(text)
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        !RELEVANCE_STOP_WORDS.has(word) &&
        !/^\d+$/.test(word)
    );
}

function buildLocalEvaluationSummary(metrics) {
  const averageWords = Math.round(metrics.averageWordCount);

  if (metrics.unansweredCount === metrics.totalQuestions) {
    return 'Local evaluation found no recorded answers, so confidence is very low. Complete responses are needed before the simulator can infer readiness.';
  }

  if (metrics.meaningfulCount === 0) {
    return 'Local evaluation found only empty or low-effort responses. Confidence is very low because the answers do not provide enough substance for interview readiness.';
  }

  return `Local evaluation reviewed ${metrics.totalQuestions} responses with an average length of ${averageWords} words and average question relevance of ${Math.round(metrics.averageRelevanceScore)}%. ${metrics.meaningfulCount} response(s) appeared meaningful, ${metrics.lowEffortCount} looked low effort, and ${metrics.unansweredCount} were unanswered.`;
}

function clampScore(score) {
  const numericScore = Number.isFinite(Number(score)) ? Number(score) : 0;
  return Math.max(0, Math.min(100, Math.round(numericScore)));
}

function mergeEvaluations(remote, local) {
  if (!remote || !remote.scores) return local;
  return {
    scores: remote.scores || local.scores,
    overallFeedback: remote.overallFeedback || local.overallFeedback,
    strengths: remote.strengths || local.strengths,
    areasForImprovement: remote.areasForImprovement || local.areasForImprovement,
    recommendedLearning: remote.recommendedLearning || local.recommendedLearning,
    answerEvaluations: (remote.answerEvaluations || local.answerEvaluations).map((remEval, idx) => {
      const locEval = local.answerEvaluations.find(e => e.questionIndex === idx) || local.answerEvaluations[idx] || {};
      if (!remEval) return locEval;
      return {
        questionIndex: idx,
        rating: remEval.rating || locEval.rating || 'Fair',
        strengths: remEval.strengths || locEval.strengths || [],
        missingConcepts: remEval.missingConcepts || locEval.missingConcepts || [],
        improvementSuggestions: remEval.improvementSuggestions || locEval.improvementSuggestions || [],
        sampleStrongAnswer: remEval.sampleStrongAnswer || locEval.sampleStrongAnswer || ''
      };
    })
  };
}

function formatAnswerEvaluation(evaluation) {
  if (!evaluation) return 'No evaluation data was available for this answer.';

  const answeredLabel = evaluation.answeredQuestion
    ? 'Answered the question'
    : 'Did not clearly answer the question';

  return `${answeredLabel}. Relevance: ${evaluation.relevanceScore}%. Correctness: ${evaluation.correctnessScore}%. ${evaluation.feedback}`;
}

async function completeInterview() {
  clearInterval(state.timerInterval);
  stopRecording();
  state.isInterviewActive = false;

  if (UI.summaryContent) {
    const loadingState = document.createElement('div');
    const loadingIcon = document.createElement('i');
    const loadingText = document.createElement('p');

    loadingState.style.cssText = 'text-align: center; padding: 40px 0;';
    loadingIcon.className = 'fa-solid fa-spinner fa-spin';
    loadingIcon.style.cssText = 'font-size: 2.5rem; color: #7c63ff; margin-bottom: 16px;';
    loadingText.textContent = 'Analyzing candidate performance metrics and structuring detailed evaluation responses...';

    loadingState.append(loadingIcon, loadingText);
    clearElement(UI.summaryContent);
    UI.summaryContent.appendChild(loadingState);
  }
  openModal();

  const breakdownArray = state.questions.map((q, idx) => ({
    question: q,
    candidateAnswer: state.answers[idx] || '',
  }));

  const systemPrompt = `You are an elite, strict HR and technical evaluation engine. Analyze the given list of questions and candidate answers for a ${UI.roleSelect.value} position at a ${UI.difficultySelect.value} difficulty level.
    Evaluate whether each answer literally addresses its paired question and whether the answer is technically or behaviorally correct for that question. Penalize generic, unrelated, empty, or low-effort responses. Return output strictly as a JSON object matching this schema:
    {
      "scores": {
        "technicalKnowledge": number (0-100),
        "communication": number (0-100),
        "problemSolving": number (0-100),
        "confidence": number (0-100),
        "stress": number (0-100)
      },
      "overallFeedback": "string",
      "strengths": ["string"],
      "areasForImprovement": ["string"],
      "recommendedLearning": ["string"],
      "answerEvaluations": [
        {
          "questionIndex": number,
          "rating": "Poor" | "Fair" | "Good" | "Excellent",
          "strengths": ["string"],
          "missingConcepts": ["string"],
          "improvementSuggestions": ["string"],
          "sampleStrongAnswer": "string"
        }
      ]
    }`;

  const userPrompt = `System UI measured runtime stress value was: ${state.stressValue}%. Here is the exact performance breakdown: ${JSON.stringify(breakdownArray)}`;

  let finalEvaluation = evaluateLocalConfidence();
  const groqConfig = getGroqConfig();

  if (groqConfig) {
    try {
      const response = await fetch(groqConfig.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: groqConfig.model,
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
        const parsedGroq = JSON.parse(data.choices[0].message.content);
        finalEvaluation = mergeEvaluations(parsedGroq, finalEvaluation);
      }
    } catch (e) {
      console.error('Failed executing dynamic remote assessment analytics:', e);
    }
  } else {
    console.info('Groq evaluation skipped: using local detailed confidence analysis.');
  }

  saveInterviewHistory({
    role: UI.roleSelect.value,
    difficulty: UI.difficultySelect.value,
    interviewType: 'Mock Interview',
    questions: state.questions,
    answers: state.answers,
    evaluation: finalEvaluation,
    completedAt: new Date().toLocaleString()
  });

  if (UI.summaryContent) {
    clearElement(UI.summaryContent);
    
    // Overall Performance Summary
    const scoreGrid = document.createElement('div');
    scoreGrid.className = 'score-grid';
    scoreGrid.append(
      createMetricCard('Technical Knowledge', `${finalEvaluation.scores.technicalKnowledge}%`),
      createMetricCard('Communication', `${finalEvaluation.scores.communication}%`),
      createMetricCard('Problem Solving', `${finalEvaluation.scores.problemSolving}%`),
      createMetricCard('Confidence', `${finalEvaluation.scores.confidence}%`),
      createMetricCard('Stress Level', `${finalEvaluation.scores.stress}%`)
    );

    // Feedback Section
    const feedbackBox = document.createElement('div');
    feedbackBox.className = 'feedback-section glass-card';
    feedbackBox.innerHTML = `
      <h4>Overall Feedback</h4>
      <p>${finalEvaluation.overallFeedback}</p>
      
      <div class="feedback-lists">
        <div class="strengths-list">
          <h5><i class="fa-solid fa-arrow-trend-up"></i> Key Strengths</h5>
          <ul>${finalEvaluation.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="improvements-list">
          <h5><i class="fa-solid fa-bullseye"></i> Areas for Improvement</h5>
          <ul>${finalEvaluation.areasForImprovement.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
      </div>
      
      <div class="learning-list">
        <h5><i class="fa-solid fa-book-open-reader"></i> Recommended Learning Topics</h5>
        <div class="tags-container">
          ${finalEvaluation.recommendedLearning.map(s => `<span class="learning-tag">${s}</span>`).join('')}
        </div>
      </div>
    `;

    // Question-wise Breakdown
    const reviewList = document.createElement('div');
    reviewList.className = 'review-list';
    reviewList.innerHTML = `<h4>Detailed Question Breakdown</h4>`;

    state.questions.forEach((question, index) => {
      const answer = state.answers[index] || 'No input recorded inside the temporal limits.';
      const answerEval = finalEvaluation.answerEvaluations.find(e => e.questionIndex === index) || {};
      
      const reviewItem = document.createElement('div');
      reviewItem.className = 'detailed-review-card glass-card';
      
      const ratingClass = answerEval.rating ? answerEval.rating.toLowerCase() : 'fair';

      reviewItem.innerHTML = `
        <div class="review-header">
          <span class="q-number">Q${index + 1}</span>
          <span class="rating-badge rating-${ratingClass}">${answerEval.rating || 'Fair'}</span>
        </div>
        <div class="review-q-text"><strong>Question:</strong> ${question}</div>
        <div class="review-a-text"><strong>Your Answer:</strong> ${answer}</div>
        
        <div class="review-eval-details">
          ${answerEval.strengths && answerEval.strengths.length ? `
            <div class="detail-group positive">
              <strong><i class="fa-solid fa-check"></i> Strengths:</strong>
              <ul>${answerEval.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          ` : ''}
          
          ${answerEval.missingConcepts && answerEval.missingConcepts.length ? `
            <div class="detail-group negative">
              <strong><i class="fa-solid fa-xmark"></i> Missing Concepts:</strong>
              <ul>${answerEval.missingConcepts.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          ` : ''}
          
          ${answerEval.improvementSuggestions && answerEval.improvementSuggestions.length ? `
            <div class="detail-group info">
              <strong><i class="fa-solid fa-lightbulb"></i> How to Improve:</strong>
              <ul>${answerEval.improvementSuggestions.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
          ` : ''}
          
          ${answerEval.sampleStrongAnswer ? `
            <div class="sample-answer">
              <strong><i class="fa-solid fa-star"></i> Sample Strong Answer:</strong>
              <p>${answerEval.sampleStrongAnswer}</p>
            </div>
          ` : ''}
        </div>
      `;
      
      reviewList.appendChild(reviewItem);
    });

    UI.summaryContent.append(scoreGrid, feedbackBox, reviewList);
  }
}

function saveInterviewHistory(session) {
    const history = JSON.parse(
        localStorage.getItem("interview-history")
    ) || [];

    history.unshift(session);

    localStorage.setItem(
        "interview-history",
        JSON.stringify(history.slice(0, 20))
    );

    renderInterviewHistory();
}

function renderInterviewHistory() {
    const history = JSON.parse(localStorage.getItem("interview-history")) || [];
    if (!UI.historyContainer) return;
    UI.historyContainer.innerHTML = "";

    history.forEach((session) => {
        const conf = session.confidenceScore ?? session.evaluation?.scores?.confidence ?? 0;
        const str = session.stressScore ?? session.evaluation?.scores?.stress ?? 0;

        const card = document.createElement("div");
        card.className = "history-card";

        const title = document.createElement("h4");
        title.textContent = session.role;

        const difficulty = document.createElement("p");
        difficulty.textContent = session.difficulty;

        const confidence = document.createElement("p");
        confidence.textContent = `Confidence: ${conf}%`;

        const stress = document.createElement("p");
        stress.textContent = `Stress: ${str}%`;

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
    if (!history.length || !UI.historyStats) return;

    const avgConfidence = Math.round(
        history.reduce((sum, item) => {
            const conf = item.confidenceScore ?? item.evaluation?.scores?.confidence ?? 0;
            return sum + conf;
        }, 0) / history.length
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
  state.lowEffortConfirmations = {};

  UI.interviewBox.classList.add('hidden');
  UI.setupPanel.classList.remove('hidden');
}
