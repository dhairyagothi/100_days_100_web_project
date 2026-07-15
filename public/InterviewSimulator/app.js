/* ============================================================
   INTERVIEW SIMULATOR — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const STORAGE = {
  settings  : 'interview_settings',
  history   : 'interview_history',
  bookmarks : 'interview_bookmarks'
};

const CATEGORY_COLORS = {
  technical    : '#6366f1',
  behavioral   : '#ec4899',
  hr           : '#f97316',
  dsa          : '#38bdf8',
  'system-design': '#8b5cf6'
};

const CATEGORY_LABELS = {
  technical    : '💻 Technical',
  behavioral   : '🧠 Behavioral',
  hr           : '👔 HR',
  dsa          : '📊 DSA',
  'system-design': '🏗️ System Design'
};

const TIPS = [
  "Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
  "Always clarify the problem before jumping into a solution.",
  "Think out loud — interviewers want to understand your thought process.",
  "Ask clarifying questions to show your communication skills.",
  "Practice explaining complex concepts in simple terms.",
  "Start with a brute-force solution, then optimize.",
  "Research the company and role before every interview.",
  "Prepare 2–3 questions to ask the interviewer at the end.",
  "Be honest about what you don't know — show willingness to learn.",
  "Use concrete examples and metrics when talking about past experience.",
  "Structure your answers with a clear beginning, middle, and end.",
  "Stay calm — take a breath before answering tough questions.",
  "Highlight your impact, not just your responsibilities.",
  "Practice coding problems out loud to simulate real interviews.",
  "Follow up every interview with a thank-you note."
];

const QUESTIONS = [
  // Technical
  { id: 1, category: 'technical', difficulty: 'easy',
    question: "What is the difference between `==` and `===` in JavaScript?",
    answer: "`==` compares values with type coercion (e.g., '5' == 5 is true), while `===` compares both value and type strictly (e.g., '5' === 5 is false). Always prefer `===` to avoid unexpected behavior." },
  { id: 2, category: 'technical', difficulty: 'medium',
    question: "Explain the concept of closures in JavaScript with an example.",
    answer: "A closure is a function that retains access to its outer scope even after the outer function has returned. Example: function counter() { let count = 0; return () => ++count; } — the inner function closes over 'count' and remembers it across calls." },
  { id: 3, category: 'technical', difficulty: 'hard',
    question: "What are the SOLID principles in software engineering?",
    answer: "SOLID stands for: Single Responsibility (one reason to change), Open/Closed (open for extension, closed for modification), Liskov Substitution (subtypes must be substitutable), Interface Segregation (specific interfaces over general ones), Dependency Inversion (depend on abstractions, not concretions)." },
  { id: 4, category: 'technical', difficulty: 'medium',
    question: "What is the difference between REST and GraphQL?",
    answer: "REST uses multiple endpoints with fixed data shapes; GraphQL uses a single endpoint where clients specify exactly what data they need. GraphQL reduces over-fetching and under-fetching but adds complexity. REST is simpler and more widely adopted." },
  { id: 5, category: 'technical', difficulty: 'easy',
    question: "What is the difference between SQL and NoSQL databases?",
    answer: "SQL databases are relational with fixed schemas and use structured query language (e.g., MySQL, PostgreSQL). NoSQL databases are non-relational, flexible in schema, and optimized for scale (e.g., MongoDB, Redis). Choice depends on data structure and scalability needs." },
  { id: 6, category: 'technical', difficulty: 'hard',
    question: "Explain how event loop works in Node.js.",
    answer: "Node.js uses a single-threaded event loop with a non-blocking I/O model. The event loop continuously checks the call stack and callback queue. When the call stack is empty, it picks callbacks from the queue. Phases include timers, I/O callbacks, idle, poll, check (setImmediate), and close callbacks." },

  // Behavioral
  { id: 7, category: 'behavioral', difficulty: 'easy',
    question: "Tell me about a time you faced a difficult challenge at work. How did you handle it?",
    answer: "Use STAR: Describe the Situation and Task clearly, explain the specific Actions you took (focus on your role), and highlight the Result with measurable impact. Show resilience, problem-solving, and what you learned." },
  { id: 8, category: 'behavioral', difficulty: 'medium',
    question: "Describe a situation where you had to work with a difficult team member.",
    answer: "Focus on empathy and communication. Explain how you identified the root cause of friction, approached the person respectfully, found common ground, and resolved the issue. Emphasize teamwork and a positive outcome." },
  { id: 9, category: 'behavioral', difficulty: 'easy',
    question: "Tell me about a time you showed leadership.",
    answer: "Choose an example where you took initiative, guided others, or made decisions under pressure. Use STAR format. Highlight your influence even if you weren't in a formal leadership role. Show impact on the team or project outcome." },
  { id: 10, category: 'behavioral', difficulty: 'medium',
    question: "Give an example of when you had to meet a tight deadline.",
    answer: "Describe the context, the pressures involved, and how you prioritized tasks. Mention tools or techniques used (time-boxing, delegation, communication). Highlight that you delivered on time without compromising quality." },

  // HR
  { id: 11, category: 'hr', difficulty: 'easy',
    question: "Tell me about yourself.",
    answer: "Keep it professional and structured: present (current role/skills), past (relevant experience), future (why this role). Tailor it to the job. Keep it under 2 minutes. Show enthusiasm for the opportunity." },
  { id: 12, category: 'hr', difficulty: 'easy',
    question: "What are your greatest strengths and weaknesses?",
    answer: "For strengths, pick ones relevant to the role with examples. For weaknesses, be honest but show self-awareness and what you're doing to improve. Avoid clichés like 'I work too hard'." },
  { id: 13, category: 'hr', difficulty: 'medium',
    question: "Where do you see yourself in 5 years?",
    answer: "Show ambition aligned with company growth. Talk about mastering your role, taking on leadership, and growing within the organization. Avoid saying you want their boss's job or that you're unsure." },
  { id: 14, category: 'hr', difficulty: 'easy',
    question: "Why do you want to work here?",
    answer: "Research the company. Mention specific things: culture, mission, products, tech stack, or recent achievements. Connect their values to your career goals. Show genuine interest, not just desperation." },
  { id: 15, category: 'hr', difficulty: 'medium',
    question: "What is your expected salary?",
    answer: "Research market rates for the role and location. Give a range based on your experience and research. You can also ask about their budget first. Be confident, not apologetic. Keep room for negotiation." },

  // DSA
  { id: 16, category: 'dsa', difficulty: 'easy',
    question: "What is the time complexity of binary search and why?",
    answer: "Binary search has O(log n) time complexity because it halves the search space with each comparison. Starting with n elements, after k steps only n/2^k elements remain. When n/2^k = 1, k = log₂(n). Space complexity is O(1) iteratively, O(log n) recursively." },
  { id: 17, category: 'dsa', difficulty: 'medium',
    question: "Explain the difference between BFS and DFS with their use cases.",
    answer: "BFS (Breadth-First Search) explores level by level using a queue — best for shortest path problems. DFS (Depth-First Search) explores as deep as possible using a stack/recursion — best for cycle detection, topological sort, and connected components." },
  { id: 18, category: 'dsa', difficulty: 'hard',
    question: "How does dynamic programming differ from recursion? When would you use it?",
    answer: "DP stores results of subproblems (memoization/tabulation) to avoid redundant computation, reducing time from exponential to polynomial. Use DP when a problem has overlapping subproblems and optimal substructure — e.g., Fibonacci, knapsack, longest common subsequence." },
  { id: 19, category: 'dsa', difficulty: 'medium',
    question: "What is a hash map and when would you use one?",
    answer: "A hash map stores key-value pairs with O(1) average-case insertion, deletion, and lookup using a hash function. Use it for frequency counting, caching, two-sum style problems, and deduplication. Worst-case is O(n) due to collisions." },
  { id: 20, category: 'dsa', difficulty: 'hard',
    question: "Explain how you would detect a cycle in a linked list.",
    answer: "Use Floyd's Cycle Detection (Tortoise and Hare): two pointers at different speeds. Move slow by 1, fast by 2. If they meet, a cycle exists. Time: O(n), Space: O(1). Alternative: use a HashSet to track visited nodes — O(n) time and space." },

  // System Design
  { id: 21, category: 'system-design', difficulty: 'medium',
    question: "How would you design a URL shortener like bit.ly?",
    answer: "Key components: API to generate short URLs (base62 encode a counter or hash), NoSQL DB for mappings, cache (Redis) for popular URLs, load balancer, CDN. Handle: collision detection, expiry, analytics. Scale: horizontal scaling, consistent hashing, read replicas." },
  { id: 22, category: 'system-design', difficulty: 'hard',
    question: "Design a notification system that handles millions of users.",
    answer: "Components: API layer, message queue (Kafka/RabbitMQ), notification workers per channel (push, email, SMS), user preference service, retry mechanism, rate limiter, delivery tracker. Use fan-out pattern for broadcasts, store notifications in DB for history." },
  { id: 23, category: 'system-design', difficulty: 'medium',
    question: "What is horizontal vs vertical scaling? When would you use each?",
    answer: "Vertical scaling: adding more resources (CPU/RAM) to a single server — simpler but has limits and single point of failure. Horizontal scaling: adding more servers — handles more load, better fault tolerance but requires load balancing and stateless design." },
  { id: 24, category: 'system-design', difficulty: 'hard',
    question: "How would you design a real-time chat application?",
    answer: "Use WebSockets for real-time bidirectional communication. Components: connection manager, message broker (Kafka), message DB (Cassandra for scale), presence service, notification service, media service (S3 for attachments). Handle: message ordering, delivery receipts, offline messages." },
  { id: 25, category: 'system-design', difficulty: 'medium',
    question: "Explain CAP theorem and its implications for distributed systems.",
    answer: "CAP theorem: a distributed system can only guarantee 2 of 3 — Consistency (all nodes see same data), Availability (every request gets a response), Partition Tolerance (system works despite network failures). In practice, partition tolerance is required, so you choose between CP (e.g., HBase) and AP (e.g., Cassandra)." }
];

// ── State ──────────────────────────────────────────────────────
let settings  = { theme: 'dark', streak: 0, lastDate: null };
let history   = [];
let bookmarks = [];

let sessionQuestions = [];
let sessionIdx       = 0;
let sessionAnswered  = 0;
let sessionSkipped   = 0;
let sessionRatings   = [];
let selectedDiff     = 'all';
let selectedTime     = 0;
let timerInterval    = null;
let timerRemaining   = 0;
let selectedRating   = 0;
let sessionActive    = false;

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadData();
  applyTheme();
  loadTip();
  renderStats();
  renderCatProgress();
  renderBookmarks();
  renderHistoryPanel();
  bindEvents();
}

// ── Storage ────────────────────────────────────────────────────
function loadData() {
  try {
    settings  = { theme:'dark', streak:0, lastDate:null, ...JSON.parse(localStorage.getItem(STORAGE.settings)  || '{}') };
    history   = JSON.parse(localStorage.getItem(STORAGE.history)   || '[]');
    bookmarks = JSON.parse(localStorage.getItem(STORAGE.bookmarks) || '[]');
  } catch(e) {}
}
function saveSettings() { localStorage.setItem(STORAGE.settings,  JSON.stringify(settings));  }
function saveHistory()  { localStorage.setItem(STORAGE.history,   JSON.stringify(history));   }
function saveBookmarks(){ localStorage.setItem(STORAGE.bookmarks, JSON.stringify(bookmarks)); }

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  $('themeToggle').querySelector('i').className =
    settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);
  $('resetBtn').addEventListener('click', resetAll);
  $('historyBtn').addEventListener('click', openHistoryModal);
  $('historyModalClose').addEventListener('click', () => {
    $('historyModal').classList.remove('open');
    document.body.style.overflow = '';
  });
  $('historyModal').addEventListener('click', e => {
    if(e.target === $('historyModal')) {
      $('historyModal').classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('.diff-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.diff-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedDiff = tab.dataset.diff;
    });
  });

  document.querySelectorAll('.timer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.timer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedTime = parseInt(tab.dataset.time);
    });
  });

  $('startSessionBtn').addEventListener('click', startSession);
  $('skipBtn').addEventListener('click', skipQuestion);
  $('bookmarkBtn').addEventListener('click', toggleBookmark);
  $('revealBtn').addEventListener('click', revealAnswer);
  $('submitAnswerBtn').addEventListener('click', submitAnswer);
  $('nextBtn').addEventListener('click', nextQuestion);
  $('restartBtn').addEventListener('click', () => {
    $('sessionComplete').classList.add('hidden');
    $('welcomeCard').classList.remove('hidden');
    sessionActive = false;
  });
  $('refreshTip').addEventListener('click', loadTip);

  // Star Rating
  const stars = $('starRating').querySelectorAll('i');
  stars.forEach(star => {
    star.addEventListener('mouseover', () => highlightStars(parseInt(star.dataset.val)));
    star.addEventListener('mouseout',  () => highlightStars(selectedRating));
    star.addEventListener('click',     () => {
      selectedRating = parseInt(star.dataset.val);
      highlightStars(selectedRating);
    });
  });

  // Word count
  $('answerInput').addEventListener('input', () => {
    const words = $('answerInput').value.trim().split(/\s+/).filter(w => w).length;
    $('wordCount').textContent = `${words} word${words !== 1 ? 's' : ''}`;
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
      $('historyModal').classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ── Session ────────────────────────────────────────────────────
function startSession() {
  const category = $('categorySelect').value;
  let pool = [...QUESTIONS];

  if(category !== 'all') pool = pool.filter(q => q.category === category);
  if(selectedDiff !== 'all') pool = pool.filter(q => q.difficulty === selectedDiff);

  if(pool.length === 0) {
    showToast('No questions match your filters. Try different settings.', 'error');
    return;
  }

  // Shuffle
  pool.sort(() => Math.random() - 0.5);
  sessionQuestions = pool.slice(0, Math.min(pool.length, 10));
  sessionIdx       = 0;
  sessionAnswered  = 0;
  sessionSkipped   = 0;
  sessionRatings   = [];
  sessionActive    = true;

  $('welcomeCard').classList.add('hidden');
  $('sessionComplete').classList.add('hidden');
  $('questionCard').classList.remove('hidden');

  updateProgressRing();
  showQuestion();
  showToast(`Session started with ${sessionQuestions.length} questions!`, 'success');
}

function showQuestion() {
  if(sessionIdx >= sessionQuestions.length) {
    endSession(); return;
  }

  const q = sessionQuestions[sessionIdx];
  selectedRating = 0;

  // Reset UI
  $('answerInput').value = '';
  $('wordCount').textContent = '0 words';
  $('modelAnswer').classList.add('hidden');
  $('ratingWrap').classList.add('hidden');
  highlightStars(0);

  // Fill question info
  const color = CATEGORY_COLORS[q.category] || '#6366f1';
  $('qCategory').textContent = CATEGORY_LABELS[q.category] || q.category;
  $('qCategory').style.background = color + '22';
  $('qCategory').style.color      = color;
  $('qCategory').style.border     = `1px solid ${color}`;

  $('qDifficulty').textContent  = cap(q.difficulty);
  $('qDifficulty').className    = `q-diff diff-${q.difficulty}`;
  $('qNumber').textContent      = `Q${sessionIdx + 1} of ${sessionQuestions.length}`;
  $('questionText').textContent = q.question;
  $('modelAnswerText').textContent = q.answer;

  // Bookmark state
  const isBookmarked = bookmarks.some(b => b.id === q.id);
  $('bookmarkBtn').className = `q-action-btn${isBookmarked ? ' bookmarked' : ''}`;
  $('bookmarkBtn').querySelector('i').className =
    isBookmarked ? 'fas fa-bookmark' : 'far fa-bookmark';

  // Timer
  if(selectedTime > 0) {
    startTimer(selectedTime);
  } else {
    $('timerBarWrap').classList.add('hidden');
  }
}

// ── Timer ──────────────────────────────────────────────────────
function startTimer(seconds) {
  clearInterval(timerInterval);
  timerRemaining = seconds;
  $('timerBarWrap').classList.remove('hidden');
  updateTimerBar(seconds, seconds);

  timerInterval = setInterval(() => {
    timerRemaining--;
    updateTimerBar(timerRemaining, seconds);
    if(timerRemaining <= 0) {
      clearInterval(timerInterval);
      showToast("Time's up! Submitting answer.", 'info');
      submitAnswer();
    }
  }, 1000);
}

function updateTimerBar(remaining, total) {
  const pct = (remaining / total) * 100;
  $('timerBar').style.width = pct + '%';
  $('timerBar').className   = `timer-bar${pct < 30 ? ' warning' : ''}`;
  const m = Math.floor(remaining / 60);
  const s = (remaining % 60).toString().padStart(2, '0');
  $('timerText').textContent = `${m}:${s}`;
}

function stopTimer() {
  clearInterval(timerInterval);
  $('timerBarWrap').classList.add('hidden');
}

// ── Question Actions ───────────────────────────────────────────
function revealAnswer() {
  $('modelAnswer').classList.remove('hidden');
  $('revealBtn').disabled = true;
  $('revealBtn').style.opacity = '0.5';
}

function submitAnswer() {
  stopTimer();
  const answer = $('answerInput').value.trim();
  if(!answer) { showToast('Please write your answer first.', 'error'); return; }

  $('modelAnswer').classList.remove('hidden');
  $('ratingWrap').classList.remove('hidden');
  $('submitAnswerBtn').disabled = true;
  $('revealBtn').disabled       = true;
}

function skipQuestion() {
  stopTimer();
  sessionSkipped++;
  sessionIdx++;
  updateProgressRing();
  if(sessionIdx >= sessionQuestions.length) { endSession(); return; }
  showQuestion();
  showToast('Question skipped.', 'info');
}

function nextQuestion() {
  if(selectedRating === 0) { showToast('Please rate your answer before continuing.', 'error'); return; }

  const q      = sessionQuestions[sessionIdx];
  const answer = $('answerInput').value.trim();

  // Save to history
  const entry = {
    id      : '_' + Date.now(),
    qId     : q.id,
    question: q.question,
    answer,
    rating  : selectedRating,
    category: q.category,
    difficulty: q.difficulty,
    date    : new Date().toISOString()
  };
  history.unshift(entry);
  if(history.length > 100) history.pop();
  saveHistory();

  sessionRatings.push(selectedRating);
  sessionAnswered++;
  sessionIdx++;

  updateStreak();
  updateProgressRing();
  renderStats();
  renderHistoryPanel();
  renderCatProgress();

  $('submitAnswerBtn').disabled = false;
  $('revealBtn').disabled       = false;
  $('revealBtn').style.opacity  = '1';

  if(sessionIdx >= sessionQuestions.length) { endSession(); return; }
  showQuestion();
}

// ── Progress Ring ──────────────────────────────────────────────
function updateProgressRing() {
  const total    = sessionQuestions.length;
  const done     = sessionAnswered + sessionSkipped;
  const pct      = total > 0 ? done / total : 0;
  const circ     = 2 * Math.PI * 40;
  const offset   = circ * (1 - pct);
  $('progressRing').style.strokeDashoffset = offset;
  $('progVal').textContent   = done;
  $('progTotal').textContent = `/ ${total}`;
  $('pmAnswered').textContent = `${sessionAnswered} Answered`;
  $('pmSkipped').textContent  = `${sessionSkipped} Skipped`;
}

// ── End Session ────────────────────────────────────────────────
function endSession() {
  stopTimer();
  $('questionCard').classList.add('hidden');
  $('sessionComplete').classList.remove('hidden');

  const avg = sessionRatings.length > 0
    ? (sessionRatings.reduce((a,b) => a+b, 0) / sessionRatings.length).toFixed(1)
    : '0.0';

  $('csAttempted').textContent = sessionAnswered;
  $('csSkipped').textContent   = sessionSkipped;
  $('csAvgRating').textContent = avg;
  $('completeSub').textContent =
    `You answered ${sessionAnswered} question${sessionAnswered !== 1 ? 's' : ''} with an average rating of ${avg}/5.`;

  // Rating breakdown
  const breakdown = $('ratingBreakdown');
  breakdown.innerHTML = '';
  const max = Math.max(...[1,2,3,4,5].map(v => sessionRatings.filter(r => r === v).length), 1);
  [5,4,3,2,1].forEach(v => {
    const count = sessionRatings.filter(r => r === v).length;
    const pct   = (count / max) * 100;
    const stars  = '★'.repeat(v) + '☆'.repeat(5-v);
    const row    = document.createElement('div');
    row.className = 'rb-row';
    row.innerHTML = `
      <span class="rb-stars">${stars}</span>
      <div class="rb-bar-wrap"><div class="rb-bar" style="width:0%" data-pct="${pct}"></div></div>
      <span class="rb-count">${count}</span>
    `;
    breakdown.appendChild(row);
  });
  requestAnimationFrame(() => {
    breakdown.querySelectorAll('.rb-bar').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, 100);
    });
  });

  sessionActive = false;
  showToast('Session complete! Great work 🎉', 'success');
}

// ── Bookmark ───────────────────────────────────────────────────
function toggleBookmark() {
  const q   = sessionQuestions[sessionIdx];
  if(!q) return;
  const idx = bookmarks.findIndex(b => b.id === q.id);
  if(idx === -1) {
    bookmarks.unshift({ id: q.id, question: q.question, category: q.category });
    $('bookmarkBtn').classList.add('bookmarked');
    $('bookmarkBtn').querySelector('i').className = 'fas fa-bookmark';
    showToast('Question bookmarked!', 'success');
  } else {
    bookmarks.splice(idx, 1);
    $('bookmarkBtn').classList.remove('bookmarked');
    $('bookmarkBtn').querySelector('i').className = 'far fa-bookmark';
    showToast('Bookmark removed.', 'info');
  }
  saveBookmarks();
  renderBookmarks();
  renderStats();
}

function renderBookmarks() {
  const list  = $('bookmarkList');
  const empty = $('bmEmpty');
  list.querySelectorAll('.bm-item').forEach(i => i.remove());
  $('bookmarkCount').textContent = bookmarks.length;
  $('totalBookmarks').textContent = bookmarks.length;

  if(bookmarks.length === 0) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';

  bookmarks.slice(0,10).forEach(b => {
    const el = document.createElement('div');
    el.className = 'bm-item';
    el.innerHTML = `<i class="fas fa-bookmark"></i><span>${escapeHTML(b.question)}</span>`;
    list.appendChild(el);
  });
}

// ── Stats ──────────────────────────────────────────────────────
function renderStats() {
  $('totalAttempted').textContent = history.length;
  $('totalBookmarks').textContent = bookmarks.length;
  $('streakCount').textContent    = settings.streak || 0;

  const avg = history.length > 0
    ? (history.reduce((s,h) => s + h.rating, 0) / history.length).toFixed(1)
    : '0.0';
  $('avgRating').textContent = avg;
}

// ── Category Progress ──────────────────────────────────────────
function renderCatProgress() {
  const el = $('catProgress');
  el.innerHTML = '';
  const categories = ['technical','behavioral','hr','dsa','system-design'];
  const counts     = {};
  categories.forEach(c => { counts[c] = history.filter(h => h.category === c).length; });
  const max = Math.max(...Object.values(counts), 1);

  if(history.length === 0) {
    el.innerHTML = '<p class="cp-empty">No attempts yet.</p>'; return;
  }

  categories.forEach(c => {
    const count = counts[c];
    if(count === 0) return;
    const pct   = (count / max) * 100;
    const color = CATEGORY_COLORS[c];
    const row   = document.createElement('div');
    row.className = 'cp-row';
    row.innerHTML = `
      <div class="cp-dot" style="background:${color}"></div>
      <span class="cp-name">${CATEGORY_LABELS[c].replace(/[^\w\s]/g,'').trim()}</span>
      <div class="cp-bar-wrap">
        <div class="cp-bar-fill" style="width:0%;background:${color}" data-pct="${pct}"></div>
      </div>
      <span class="cp-count">${count}</span>
    `;
    el.appendChild(row);
  });

  requestAnimationFrame(() => {
    el.querySelectorAll('.cp-bar-fill').forEach(b => {
      setTimeout(() => { b.style.width = b.dataset.pct + '%'; }, 80);
    });
  });
}

// ── History Panel ──────────────────────────────────────────────
function renderHistoryPanel() {
  const list  = $('historyList');
  const empty = $('histEmpty');
  list.querySelectorAll('.hist-item').forEach(i => i.remove());

  if(history.length === 0) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';

  history.slice(0, 8).forEach(h => {
    const el = document.createElement('div');
    el.className = 'hist-item';
    el.innerHTML = `
      <div class="hist-q">${escapeHTML(h.question)}</div>
      <div class="hist-meta">
        <span class="hist-stars">${'★'.repeat(h.rating)}${'☆'.repeat(5-h.rating)}</span>
        <span class="hist-cat">${CATEGORY_LABELS[h.category]?.split(' ')[1] || h.category}</span>
      </div>
    `;
    list.appendChild(el);
  });
}

// ── History Modal ──────────────────────────────────────────────
function openHistoryModal() {
  const body  = $('historyModalBody');
  body.innerHTML = '';

  if(history.length === 0) {
    body.innerHTML = '<div class="modal-empty">No answers recorded yet.</div>';
  } else {
    history.forEach(h => {
      const el = document.createElement('div');
      el.className = 'modal-hist-item';
      const dateStr = new Date(h.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
      el.innerHTML = `
        <div class="mhi-q">${escapeHTML(h.question)}</div>
        <div class="mhi-ans">${escapeHTML(h.answer)}</div>
        <div class="mhi-meta">
          <span class="mhi-stars">${'★'.repeat(h.rating)}${'☆'.repeat(5-h.rating)}</span>
          <span class="mhi-cat">${h.category}</span>
          <span class="mhi-date">${dateStr}</span>
        </div>
      `;
      body.appendChild(el);
    });
  }

  $('historyModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ── Streak ─────────────────────────────────────────────────────
function updateStreak() {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if(settings.lastDate === today) return;
  settings.streak = settings.lastDate === yesterday
    ? (settings.streak || 0) + 1 : 1;
  settings.lastDate = today;
  saveSettings();
}

// ── Stars ──────────────────────────────────────────────────────
function highlightStars(val) {
  $('starRating').querySelectorAll('i').forEach(s => {
    const v = parseInt(s.dataset.val);
    s.classList.toggle('active', v <= val);
  });
}

// ── Tips ───────────────────────────────────────────────────────
function loadTip() {
  $('tipText').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
}

// ── Reset ──────────────────────────────────────────────────────
function resetAll() {
  if(!confirm('Reset all interview data? This cannot be undone.')) return;
  history = []; bookmarks = [];
  settings = { theme: settings.theme, streak: 0, lastDate: null };
  saveHistory(); saveBookmarks(); saveSettings();
  stopTimer(); sessionActive = false;
  $('questionCard').classList.add('hidden');
  $('sessionComplete').classList.add('hidden');
  $('welcomeCard').classList.remove('hidden');
  renderStats(); renderCatProgress(); renderBookmarks(); renderHistoryPanel();
  showToast('All data reset.', 'error');
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type === 'success' ? 'fa-check-circle' :
    type === 'error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  $('toast').className = `toast ${type} show`;
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3000);
}

// ── Helpers ────────────────────────────────────────────────────
function cap(str)      { return str.charAt(0).toUpperCase() + str.slice(1); }
function escapeHTML(s) {
  const el = document.createElement('div');
  el.textContent = s || ''; return el.innerHTML;
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);