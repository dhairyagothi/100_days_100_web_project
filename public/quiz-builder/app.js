(function () {
  'use strict';

  const STORAGE_KEY = 'quizcraft_data_v1';

  // ==========================================================================
  // 1. Built-in Preset Templates
  // ==========================================================================
  const PRESET_QUIZZES = {
    web_dev: {
      id: 'quiz_preset_web',
      title: 'Web Development Basics',
      category: 'Technology',
      description: 'Test your foundational knowledge of HTML5, CSS3, and JavaScript ES6.',
      timeLimit: 5,
      questions: [
        {
          id: 'q_w1',
          type: 'mcq',
          prompt: 'What does HTML stand for?',
          options: [
            'HyperText Markup Language',
            'High Tech Machine Language',
            'Hyperlink Text Master Language',
            'Home Tool Markup Language'
          ],
          correctAnswerIndex: 0,
          explanation: 'HTML stands for HyperText Markup Language, the standard markup language for documents designed to be displayed in a web browser.'
        },
        {
          id: 'q_w2',
          type: 'mcq',
          prompt: 'Which CSS property is used to change the background color of an element?',
          options: ['color', 'background-color', 'bgcolor', 'fill-style'],
          correctAnswerIndex: 1,
          explanation: 'The background-color property sets the background color of an element in CSS.'
        },
        {
          id: 'q_w3',
          type: 'tf',
          prompt: 'JavaScript is a single-threaded programming language.',
          options: ['True', 'False'],
          correctAnswerIndex: 0,
          explanation: 'JavaScript runs on a single main thread using an event loop model for asynchronous operations.'
        },
        {
          id: 'q_w4',
          type: 'mcq',
          prompt: 'Which ES6 keyword is used to declare a block-scoped variable that can be reassigned?',
          options: ['var', 'const', 'let', 'static'],
          correctAnswerIndex: 2,
          explanation: 'The "let" keyword declares a block-scoped local variable, optionally initializing it to a value.'
        },
        {
          id: 'q_w5',
          type: 'mcq',
          prompt: 'Which array method adds one or more elements to the end of an array?',
          options: ['pop()', 'unshift()', 'push()', 'shift()'],
          correctAnswerIndex: 2,
          explanation: 'The push() method adds the specified elements to the end of an array and returns the new length of the array.'
        }
      ]
    },
    science: {
      id: 'quiz_preset_sci',
      title: 'General Science & Universe',
      category: 'Science',
      description: 'Explore fundamental facts in physics, astronomy, and biology.',
      timeLimit: 5,
      questions: [
        {
          id: 'q_s1',
          type: 'mcq',
          prompt: 'Which planet in our solar system is known as the Red Planet?',
          options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
          correctAnswerIndex: 2,
          explanation: 'Mars is known as the Red Planet due to the iron oxide (rust) on its surface.'
        },
        {
          id: 'q_s2',
          type: 'tf',
          prompt: 'Light travels faster than sound.',
          options: ['True', 'False'],
          correctAnswerIndex: 0,
          explanation: 'Light travels at approximately 300,000 km/s in a vacuum, whereas sound travels at around 343 m/s in air.'
        },
        {
          id: 'q_s3',
          type: 'mcq',
          prompt: 'What is the chemical symbol for Gold on the Periodic Table?',
          options: ['Go', 'Au', 'Ag', 'Gd'],
          correctAnswerIndex: 1,
          explanation: 'Au comes from the Latin word for gold, "Aurum".'
        },
        {
          id: 'q_s4',
          type: 'mcq',
          prompt: 'How many bones are in an adult human body?',
          options: ['186', '206', '216', '300'],
          correctAnswerIndex: 1,
          explanation: 'An adult human skeleton consists of 206 bones.'
        },
        {
          id: 'q_s5',
          type: 'mcq',
          prompt: 'What fundamental force keeps planets in orbit around the Sun?',
          options: ['Magnetism', 'Friction', 'Gravity', 'Nuclear Force'],
          correctAnswerIndex: 2,
          explanation: 'Gravitational attraction pulls planets toward the Sun, keeping them in steady orbits.'
        }
      ]
    },
    world_trivia: {
      id: 'quiz_preset_tri',
      title: 'World Geography & History',
      category: 'General',
      description: 'Fun trivia questions about world capitals, oceans, and landmark history.',
      timeLimit: 5,
      questions: [
        {
          id: 'q_t1',
          type: 'mcq',
          prompt: 'What is the capital city of Japan?',
          options: ['Kyoto', 'Osaka', 'Tokyo', 'Hiroshima'],
          correctAnswerIndex: 2,
          explanation: 'Tokyo has been the official capital city of Japan since 1868.'
        },
        {
          id: 'q_t2',
          type: 'mcq',
          prompt: 'Which is the largest ocean on Earth?',
          options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
          correctAnswerIndex: 3,
          explanation: 'The Pacific Ocean is the largest and deepest ocean basin on Earth.'
        },
        {
          id: 'q_t3',
          type: 'tf',
          prompt: 'Mount Everest is the highest mountain above sea level on Earth.',
          options: ['True', 'False'],
          correctAnswerIndex: 0,
          explanation: 'Mount Everest stands at 8,848.86 meters above sea level.'
        },
        {
          id: 'q_t4',
          type: 'mcq',
          prompt: 'Which country is famous for inventing modern pizza?',
          options: ['Greece', 'Italy', 'France', 'Spain'],
          correctAnswerIndex: 1,
          explanation: 'Modern pizza originated in Naples, Italy, in the 18th century.'
        },
        {
          id: 'q_t5',
          type: 'mcq',
          prompt: 'What is the official language spoken in Brazil?',
          options: ['Spanish', 'Portuguese', 'English', 'French'],
          correctAnswerIndex: 1,
          explanation: 'Brazil is the only Portuguese-speaking nation in the Americas.'
        }
      ]
    }
  };

  // ==========================================================================
  // 2. Application State
  // ==========================================================================
  let state = {
    quizzes: [],
    activeView: 'dashboard', // 'dashboard' | 'editor' | 'player' | 'results'
    activeCategory: 'all',
    searchQuery: '',
    theme: 'light',
    
    // Editor State
    editingQuiz: null,

    // Active Player State
    player: {
      quiz: null,
      currentQuestionIndex: 0,
      userAnswers: {}, // { questionId: selectedOptionIndex }
      timeRemaining: 0,
      timerInterval: null,
      startTime: 0,
      endTime: 0
    }
  };

  // ==========================================================================
  // 3. Local Storage Persistence & Initialization
  // ==========================================================================
  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state.quizzes = parsed.quizzes || [];
      }
    } catch (err) {
      console.warn('Failed to load quizzes from localStorage:', err);
    }

    const savedTheme = localStorage.getItem('quizcraft_theme') || 'light';
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', state.theme);

    // Seed default template quizzes if none exist
    if (!state.quizzes || state.quizzes.length === 0) {
      state.quizzes = [
        JSON.parse(JSON.stringify(PRESET_QUIZZES.web_dev)),
        JSON.parse(JSON.stringify(PRESET_QUIZZES.science)),
        JSON.parse(JSON.stringify(PRESET_QUIZZES.world_trivia))
      ];
      saveState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ quizzes: state.quizzes }));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }

  function generateId(prefix = 'qz') {
    return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // 4. Dashboard View Renderer
  // ==========================================================================
  function renderDashboardView() {
    const grid = document.getElementById('quizGrid');
    if (!grid) return;

    let filtered = [...state.quizzes];

    // Filter by Category
    if (state.activeCategory !== 'all') {
      filtered = filtered.filter(q => q.category === state.activeCategory);
    }

    // Filter by Search Query
    const query = state.searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(q =>
        q.title.toLowerCase().includes(query) ||
        (q.description && q.description.toLowerCase().includes(query)) ||
        (q.category && q.category.toLowerCase().includes(query))
      );
    }

    grid.innerHTML = '';

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 60px 20px; color:var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size:3rem; margin-bottom:12px; opacity:0.5;"></i>
          <h3>No Quizzes Found</h3>
          <p style="font-size:0.9rem; margin-top:4px;">Create a new quiz or load a template to get started!</p>
        </div>
      `;
      return;
    }

    filtered.forEach(quiz => {
      const card = document.createElement('div');
      card.className = 'quiz-card';

      const qCount = (quiz.questions || []).length;
      const timeText = quiz.timeLimit > 0 ? `${quiz.timeLimit} Mins` : 'Untimed';

      card.innerHTML = `
        <div>
          <div class="quiz-card-header">
            <span class="category-pill">${quiz.category || 'General'}</span>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;"><i class="fa-regular fa-clock"></i> ${timeText}</span>
          </div>

          <h3 class="quiz-card-title">${escapeHTML(quiz.title)}</h3>
          <p class="quiz-card-desc">${escapeHTML(quiz.description || 'No description provided.')}</p>

          <div class="quiz-card-meta">
            <span><i class="fa-solid fa-list-check"></i> ${qCount} Question${qCount === 1 ? '' : 's'}</span>
          </div>
        </div>

        <div class="quiz-card-footer">
          <button class="btn btn-primary btn-sm play-quiz-btn"><i class="fa-solid fa-play"></i> Play Quiz</button>
          <div class="quiz-card-actions">
            <button class="btn btn-icon btn-sm edit-quiz-btn" title="Edit Quiz"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-icon btn-sm export-json-btn" title="Export JSON"><i class="fa-solid fa-download"></i></button>
            <button class="btn btn-icon btn-sm delete-quiz-btn" title="Delete Quiz"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;

      card.querySelector('.play-quiz-btn').addEventListener('click', () => startQuizPlayer(quiz));
      card.querySelector('.edit-quiz-btn').addEventListener('click', () => openQuizEditor(quiz));
      card.querySelector('.export-json-btn').addEventListener('click', () => exportQuizJSON(quiz));
      card.querySelector('.delete-quiz-btn').addEventListener('click', () => deleteQuiz(quiz.id));

      grid.appendChild(card);
    });

    const footerCount = document.getElementById('footerQuizCount');
    if (footerCount) footerCount.textContent = `${state.quizzes.length} Quizzes Available`;
  }

  // ==========================================================================
  // 5. Quiz Creator / Editor Engine
  // ==========================================================================
  function openQuizEditor(quizToEdit = null) {
    if (quizToEdit) {
      state.editingQuiz = JSON.parse(JSON.stringify(quizToEdit));
      document.getElementById('editorHeading').innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Quiz`;
    } else {
      state.editingQuiz = {
        id: generateId('qz'),
        title: '',
        category: 'Technology',
        description: '',
        timeLimit: 5,
        questions: [
          {
            id: generateId('q'),
            type: 'mcq',
            prompt: '',
            options: ['', '', '', ''],
            correctAnswerIndex: 0,
            explanation: ''
          }
        ]
      };
      document.getElementById('editorHeading').innerHTML = `<i class="fa-solid fa-plus-circle"></i> Create New Quiz`;
    }

    // Populate Metadata
    document.getElementById('editingQuizId').value = state.editingQuiz.id;
    document.getElementById('quizTitle').value = state.editingQuiz.title;
    document.getElementById('quizCategory').value = state.editingQuiz.category || 'Technology';
    document.getElementById('quizDescription').value = state.editingQuiz.description || '';
    document.getElementById('quizTimeLimit').value = String(state.editingQuiz.timeLimit || 0);

    renderQuestionsBuilderList();

    // Switch View
    switchView('editor');
  }

  function renderQuestionsBuilderList() {
    const container = document.getElementById('questionsContainer');
    const badge = document.getElementById('questionCountBadge');
    if (!container) return;

    const questions = state.editingQuiz.questions || [];
    if (badge) badge.textContent = String(questions.length);

    container.innerHTML = '';

    questions.forEach((q, qIndex) => {
      const qCard = document.createElement('div');
      qCard.className = 'question-builder-card';

      let optionsHTML = '';
      if (q.type === 'mcq') {
        q.options.forEach((optText, optIdx) => {
          optionsHTML += `
            <div class="builder-option-item">
              <label class="correct-radio-label">
                <input type="radio" name="correct_ans_${q.id}" value="${optIdx}" ${q.correctAnswerIndex === optIdx ? 'checked' : ''}> Correct
              </label>
              <input type="text" class="form-control opt-input" data-opt-idx="${optIdx}" value="${escapeHTML(optText)}" placeholder="Option ${optIdx + 1}">
            </div>
          `;
        });
      } else if (q.type === 'tf') {
        optionsHTML = `
          <div class="builder-option-item">
            <label class="correct-radio-label">
              <input type="radio" name="correct_ans_${q.id}" value="0" ${q.correctAnswerIndex === 0 ? 'checked' : ''}> True
            </label>
          </div>
          <div class="builder-option-item">
            <label class="correct-radio-label">
              <input type="radio" name="correct_ans_${q.id}" value="1" ${q.correctAnswerIndex === 1 ? 'checked' : ''}> False
            </label>
          </div>
        `;
      }

      qCard.innerHTML = `
        <div class="question-builder-head">
          <span class="q-badge-num">Question ${qIndex + 1} (${q.type.toUpperCase()})</span>
          ${questions.length > 1 ? `<button type="button" class="btn btn-sm btn-danger remove-q-btn"><i class="fa-solid fa-trash"></i> Delete</button>` : ''}
        </div>

        <div class="form-group">
          <label>Question Prompt <span class="required">*</span></label>
          <input type="text" class="prompt-input" value="${escapeHTML(q.prompt)}" placeholder="Enter your question here..." required>
        </div>

        <div class="form-group">
          <label>Answer Options & Select Correct Answer</label>
          <div class="builder-options-list">${optionsHTML}</div>
        </div>

        <div class="form-group">
          <label>Explanation / Feedback (Optional)</label>
          <input type="text" class="explanation-input" value="${escapeHTML(q.explanation || '')}" placeholder="Explanation shown during review...">
        </div>
      `;

      // Prompt change listener
      qCard.querySelector('.prompt-input').addEventListener('input', (e) => {
        state.editingQuiz.questions[qIndex].prompt = e.target.value;
      });

      // Explanation change listener
      qCard.querySelector('.explanation-input').addEventListener('input', (e) => {
        state.editingQuiz.questions[qIndex].explanation = e.target.value;
      });

      // Options text change
      qCard.querySelectorAll('.opt-input').forEach(input => {
        input.addEventListener('input', (e) => {
          const optIdx = parseInt(input.getAttribute('data-opt-idx'), 10);
          state.editingQuiz.questions[qIndex].options[optIdx] = e.target.value;
        });
      });

      // Radio correct answer selection
      qCard.querySelectorAll(`input[name="correct_ans_${q.id}"]`).forEach(radio => {
        radio.addEventListener('change', (e) => {
          state.editingQuiz.questions[qIndex].correctAnswerIndex = parseInt(e.target.value, 10);
        });
      });

      // Remove question button
      const removeBtn = qCard.querySelector('.remove-q-btn');
      if (removeBtn) {
        removeBtn.addEventListener('click', () => {
          state.editingQuiz.questions.splice(qIndex, 1);
          renderQuestionsBuilderList();
        });
      }

      container.appendChild(qCard);
    });
  }

  function handleSaveQuiz() {
    const title = document.getElementById('quizTitle').value.trim();
    if (!title) {
      alert('Please enter a Quiz Title.');
      return;
    }

    state.editingQuiz.title = title;
    state.editingQuiz.category = document.getElementById('quizCategory').value;
    state.editingQuiz.description = document.getElementById('quizDescription').value.trim();
    state.editingQuiz.timeLimit = parseInt(document.getElementById('quizTimeLimit').value, 10);

    // Validate questions prompt
    for (let i = 0; i < state.editingQuiz.questions.length; i++) {
      if (!state.editingQuiz.questions[i].prompt.trim()) {
        alert(`Please enter a prompt for Question ${i + 1}.`);
        return;
      }
    }

    // Save or Update in state.quizzes
    const existingIdx = state.quizzes.findIndex(q => q.id === state.editingQuiz.id);
    if (existingIdx !== -1) {
      state.quizzes[existingIdx] = state.editingQuiz;
    } else {
      state.quizzes.push(state.editingQuiz);
    }

    saveState();
    switchView('dashboard');
    renderDashboardView();
  }

  function deleteQuiz(quizId) {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    state.quizzes = state.quizzes.filter(q => q.id !== quizId);
    saveState();
    renderDashboardView();
  }

  // ==========================================================================
  // 6. Interactive Quiz Player Engine
  // ==========================================================================
  function startQuizPlayer(quiz) {
    state.player = {
      quiz: JSON.parse(JSON.stringify(quiz)),
      currentQuestionIndex: 0,
      userAnswers: {},
      timeRemaining: (quiz.timeLimit || 0) * 60,
      timerInterval: null,
      startTime: Date.now(),
      endTime: null
    };

    document.getElementById('playerQuizTitle').textContent = quiz.title;

    // Start Timer if timed
    if (state.player.timeRemaining > 0) {
      document.getElementById('playerTimerBadge').classList.remove('hidden');
      updateTimerDisplay();
      state.player.timerInterval = setInterval(() => {
        state.player.timeRemaining--;
        updateTimerDisplay();
        if (state.player.timeRemaining <= 0) {
          clearInterval(state.player.timerInterval);
          alert('Time is up! Submitting your answers now.');
          submitQuizPlayer();
        }
      }, 1000);
    } else {
      document.getElementById('playerTimerBadge').classList.add('hidden');
    }

    switchView('player');
    renderPlayerQuestion();
  }

  function updateTimerDisplay() {
    const timerText = document.getElementById('playerTimerText');
    if (!timerText) return;
    const mins = Math.floor(state.player.timeRemaining / 60);
    const secs = state.player.timeRemaining % 60;
    const pad = n => String(n).padStart(2, '0');
    timerText.textContent = `${pad(mins)}:${pad(secs)}`;
  }

  function renderPlayerQuestion() {
    const player = state.player;
    const q = player.quiz.questions[player.currentQuestionIndex];
    if (!q) return;

    const totalQ = player.quiz.questions.length;
    document.getElementById('playerQuestionCounter').textContent = `Question ${player.currentQuestionIndex + 1} of ${totalQ}`;
    document.getElementById('playerQuestionNumber').textContent = `Q${player.currentQuestionIndex + 1}`;
    document.getElementById('playerQuestionText').textContent = q.prompt;

    // Progress Bar
    const progressPercent = Math.round(((player.currentQuestionIndex + 1) / totalQ) * 100);
    document.getElementById('playerProgressFill').style.width = `${progressPercent}%`;

    // Options Grid
    const optionsGrid = document.getElementById('playerOptionsGrid');
    optionsGrid.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    const currentAnswer = player.userAnswers[q.id];

    q.options.forEach((optText, idx) => {
      const isSelected = currentAnswer === idx;
      const optCard = document.createElement('div');
      optCard.className = `option-card ${isSelected ? 'selected' : ''}`;

      optCard.innerHTML = `
        <div class="option-letter-badge">${letters[idx] || (idx + 1)}</div>
        <span class="option-text">${escapeHTML(optText)}</span>
      `;

      optCard.addEventListener('click', () => {
        player.userAnswers[q.id] = idx;
        renderPlayerQuestion();
      });

      optionsGrid.appendChild(optCard);
    });

    // Prev / Next / Submit Buttons
    const prevBtn = document.getElementById('playerPrevBtn');
    const nextBtn = document.getElementById('playerNextBtn');
    const submitBtn = document.getElementById('playerSubmitBtn');

    prevBtn.disabled = player.currentQuestionIndex === 0;

    if (player.currentQuestionIndex === totalQ - 1) {
      nextBtn.classList.add('hidden');
      submitBtn.classList.remove('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      submitBtn.classList.add('hidden');
    }
  }

  function submitQuizPlayer() {
    if (state.player.timerInterval) {
      clearInterval(state.player.timerInterval);
    }
    state.player.endTime = Date.now();

    renderQuizResults();
    switchView('results');
  }

  // ==========================================================================
  // 7. Quiz Results & Review Engine
  // ==========================================================================
  function renderQuizResults() {
    const player = state.player;
    const questions = player.quiz.questions;
    let correctCount = 0;

    questions.forEach(q => {
      if (player.userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 70;

    // Time Taken Calculation
    const timeTakenMs = (player.endTime || Date.now()) - player.startTime;
    const totalSecs = Math.floor(timeTakenMs / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const pad = n => String(n).padStart(2, '0');
    const timeTakenStr = `${pad(mins)}:${pad(secs)}`;

    // Update Result UI Elements
    const badgeIcon = document.getElementById('resultsBadgeIcon');
    const gradeTitle = document.getElementById('resultsGradeTitle');
    const subtext = document.getElementById('resultsSubtext');

    if (passed) {
      badgeIcon.className = 'results-icon pass';
      badgeIcon.innerHTML = `<i class="fa-solid fa-trophy"></i>`;
      gradeTitle.textContent = 'Passed with flying colors!';
      subtext.textContent = `You scored ${percentage}%. Excellent job!`;
    } else {
      badgeIcon.className = 'results-icon fail';
      badgeIcon.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      gradeTitle.textContent = 'Keep practicing!';
      subtext.textContent = `You scored ${percentage}%. Review answers below and try again.`;
    }

    document.getElementById('resultsPercentage').textContent = `${percentage}%`;
    document.getElementById('resultsScoreFraction').textContent = `${correctCount} / ${questions.length}`;
    document.getElementById('resultsTimeTaken').textContent = timeTakenStr;

    // Render Answer Review List
    const reviewList = document.getElementById('answerReviewList');
    if (!reviewList) return;

    reviewList.innerHTML = '';

    questions.forEach((q, idx) => {
      const userAnsIdx = player.userAnswers[q.id];
      const isCorrect = userAnsIdx === q.correctAnswerIndex;
      const reviewItem = document.createElement('div');
      reviewItem.className = `review-item ${isCorrect ? 'correct-item' : 'wrong-item'}`;

      const userAnsText = userAnsIdx !== undefined ? q.options[userAnsIdx] : 'Not Answered';
      const correctAnsText = q.options[q.correctAnswerIndex];

      reviewItem.innerHTML = `
        <div class="review-q-title">
          ${isCorrect ? `<i class="fa-solid fa-circle-check" style="color:var(--success);"></i>` : `<i class="fa-solid fa-circle-xmark" style="color:var(--danger);"></i>`}
          Q${idx + 1}. ${escapeHTML(q.prompt)}
        </div>
        <div class="review-ans-info">
          <span><strong>Your Answer:</strong> <span style="color:${isCorrect ? 'var(--success)' : 'var(--danger)'};">${escapeHTML(userAnsText)}</span></span>
          ${!isCorrect ? `<span><strong>Correct Answer:</strong> <span style="color:var(--success);">${escapeHTML(correctAnsText)}</span></span>` : ''}
        </div>
        ${q.explanation ? `<div class="review-explanation"><i class="fa-solid fa-lightbulb"></i> ${escapeHTML(q.explanation)}</div>` : ''}
      `;

      reviewList.appendChild(reviewItem);
    });
  }

  // ==========================================================================
  // 8. Export & Import JSON
  // ==========================================================================
  function exportQuizJSON(quiz) {
    const blob = new Blob([JSON.stringify(quiz, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${quiz.title.replace(/\s+/g, '_')}_quiz.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ==========================================================================
  // 9. View Switcher & Event Handlers
  // ==========================================================================
  function switchView(viewName) {
    state.activeView = viewName;
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.view-nav .nav-btn').forEach(b => b.classList.remove('active'));

    const activePanel = document.getElementById(`${viewName}View`);
    if (activePanel) activePanel.classList.add('active');

    const navBtn = document.querySelector(`.view-nav .nav-btn[data-view="${viewName}"]`);
    if (navBtn) navBtn.classList.add('active');
  }

  function bindEvents() {
    // Navigation Tabs
    document.querySelectorAll('.view-nav .nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.getAttribute('data-view');
        if (view === 'editor') {
          openQuizEditor(null);
        } else if (view === 'templates') {
          document.getElementById('templatesModal').classList.remove('hidden');
        } else {
          switchView(view);
          if (view === 'dashboard') renderDashboardView();
        }
      });
    });

    // Brand logo returns home
    document.getElementById('brandHomeBtn').addEventListener('click', () => {
      switchView('dashboard');
      renderDashboardView();
    });

    // Theme Switcher
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('quizcraft_theme', state.theme);

      const icon = document.querySelector('#themeToggleBtn i');
      if (icon) {
        icon.className = state.theme === 'light' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      }
    });

    // Category Filter Chips
    document.querySelectorAll('#categoryFilters .filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#categoryFilters .filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.activeCategory = chip.getAttribute('data-category');
        renderDashboardView();
      });
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');

    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      clearSearchBtn.classList.toggle('hidden', !state.searchQuery);
      renderDashboardView();
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.classList.add('hidden');
      renderDashboardView();
    });

    // Editor Buttons
    document.getElementById('quickCreateBtn').addEventListener('click', () => openQuizEditor(null));
    document.getElementById('cancelEditorBtn').addEventListener('click', () => {
      switchView('dashboard');
      renderDashboardView();
    });
    document.getElementById('saveQuizBtn').addEventListener('click', handleSaveQuiz);

    // Add MCQ / TF Question Buttons in Editor
    document.getElementById('addMcqBtn').addEventListener('click', () => {
      state.editingQuiz.questions.push({
        id: generateId('q'),
        type: 'mcq',
        prompt: '',
        options: ['', '', '', ''],
        correctAnswerIndex: 0,
        explanation: ''
      });
      renderQuestionsBuilderList();
    });

    document.getElementById('addTfBtn').addEventListener('click', () => {
      state.editingQuiz.questions.push({
        id: generateId('q'),
        type: 'tf',
        prompt: '',
        options: ['True', 'False'],
        correctAnswerIndex: 0,
        explanation: ''
      });
      renderQuestionsBuilderList();
    });

    // Player Buttons
    document.getElementById('playerPrevBtn').addEventListener('click', () => {
      if (state.player.currentQuestionIndex > 0) {
        state.player.currentQuestionIndex--;
        renderPlayerQuestion();
      }
    });

    document.getElementById('playerNextBtn').addEventListener('click', () => {
      if (state.player.currentQuestionIndex < state.player.quiz.questions.length - 1) {
        state.player.currentQuestionIndex++;
        renderPlayerQuestion();
      }
    });

    document.getElementById('playerSubmitBtn').addEventListener('click', () => {
      if (confirm('Are you ready to submit your quiz answers?')) {
        submitQuizPlayer();
      }
    });

    // Results Buttons
    document.getElementById('retakeQuizBtn').addEventListener('click', () => {
      startQuizPlayer(state.player.quiz);
    });

    document.getElementById('backToDashboardBtn').addEventListener('click', () => {
      switchView('dashboard');
      renderDashboardView();
    });

    // Templates Modal
    document.getElementById('navTemplatesBtn').addEventListener('click', () => {
      document.getElementById('templatesModal').classList.remove('hidden');
    });
    document.getElementById('closeTemplatesModal').addEventListener('click', () => {
      document.getElementById('templatesModal').classList.add('hidden');
    });

    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-template');
        const template = PRESET_QUIZZES[key];
        if (template) {
          const copied = JSON.parse(JSON.stringify(template));
          copied.id = generateId('qz');
          state.quizzes.push(copied);
          saveState();
          document.getElementById('templatesModal').classList.add('hidden');
          switchView('dashboard');
          renderDashboardView();
        }
      });
    });

    // Modal Backdrop Click
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
      });
    });

    // Keyboard Navigation for Quiz Player (1-4 for options, Enter for Next/Submit)
    document.addEventListener('keydown', (e) => {
      if (state.activeView === 'player') {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= 4) {
          const optIdx = keyNum - 1;
          const q = state.player.quiz.questions[state.player.currentQuestionIndex];
          if (q && q.options[optIdx] !== undefined) {
            state.player.userAnswers[q.id] = optIdx;
            renderPlayerQuestion();
          }
        } else if (e.key === 'Enter') {
          const totalQ = state.player.quiz.questions.length;
          if (state.player.currentQuestionIndex < totalQ - 1) {
            state.player.currentQuestionIndex++;
            renderPlayerQuestion();
          }
        }
      }
    });
  }

  // ==========================================================================
  // 10. Initialization
  // ==========================================================================
  function init() {
    loadState();
    bindEvents();
    renderDashboardView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
