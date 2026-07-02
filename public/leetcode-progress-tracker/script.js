// DOM Elements
const totalSolved = document.getElementById('totalSolved');
const easySolved = document.getElementById('easySolved');
const mediumSolved = document.getElementById('mediumSolved');
const hardSolved = document.getElementById('hardSolved');
const streakCount = document.getElementById('streakCount');
const rankingCount = document.getElementById('rankingCount');
const acceptanceRate = document.getElementById('acceptanceRate');

const form = document.getElementById('problemForm');
const problemList = document.getElementById('problemList');
const themeToggle = document.getElementById('themeToggle');

// Live Fetch Elements
const leetcodeUsernameInput = document.getElementById('leetcodeUsername');
const fetchStatsBtn = document.getElementById('fetchStatsBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const userProfileCard = document.getElementById('userProfileCard');
const userAvatar = document.getElementById('userAvatar');
const userRealName = document.getElementById('userRealName');
const userUsername = document.getElementById('userUsername');

// Insights & Recommendations Elements
const insightsSection = document.getElementById('insightsSection');
const strongAreasText = document.getElementById('strongAreas');
const weakAreasText = document.getElementById('weakAreas');
const recommendationsList = document.getElementById('recommendationsList');

let problems = JSON.parse(localStorage.getItem('leetcodeProblems')) || [];

let streak = Number(localStorage.getItem('leetcodeStreak')) || 0;

streakCount.textContent = streak;

/* THEME TOGGLE */
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');

  themeToggle.innerHTML = document.body.classList.contains('light')
    ? '<i class="ri-sun-line"></i>'
    : '<i class="ri-moon-line"></i>';

  refreshChartTheme();
});

/* RENDER RECENT PROBLEMS (Manual / Offline list) */
function renderProblems() {
  problemList.innerHTML = '';
  if (problems.length === 0) {
    problemList.innerHTML =
      '<div class="problem-item" style="justify-content: center;"><p style="color: var(--secondary);">No recent problems added.</p></div>';
    return;
  }
  [...problems]
    .reverse()
    .slice(0, 10)
    .forEach((problem) => {
      const div = document.createElement('div');
      div.className = 'problem-item';
      div.innerHTML = `
      <h3>${problem.name}</h3>
      <span class="problem-difficulty ${problem.difficulty.toLowerCase()}">
        ${problem.difficulty}
      </span>
    `;
      problemList.appendChild(div);
    });
}

/* UPDATE LOCAL STATS FROM MANUAL INPUT */
function updateStats() {
  const easy = problems.filter((p) => p.difficulty === 'Easy').length;
  const medium = problems.filter((p) => p.difficulty === 'Medium').length;
  const hard = problems.filter((p) => p.difficulty === 'Hard').length;

  totalSolved.textContent = problems.length;
  easySolved.textContent = easy;
  mediumSolved.textContent = medium;
  hardSolved.textContent = hard;

  updateCharts(easy, medium, hard);
}

/* FORM SUBMIT (Manual Override) */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('problemName').value;
  const difficulty = document.getElementById('difficulty').value;

  problems.push({ name, difficulty });
  streak++;

  localStorage.setItem('leetcodeProblems', JSON.stringify(problems));
  localStorage.setItem('leetcodeStreak', streak);
  streakCount.textContent = streak;

  renderProblems();
  updateStats();
  form.reset();
});

/* CURATED PROBLEM LIST FOR RECOMMENDATIONS */
const curatedProblems = {
  Array: [
    {
      name: 'Two Sum',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/two-sum/',
    },
    {
      name: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    },
    {
      name: 'Product of Array Except Self',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/product-of-array-except-self/',
    },
  ],
  String: [
    {
      name: 'Valid Anagram',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/valid-anagram/',
    },
    {
      name: 'Valid Palindrome',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/valid-palindrome/',
    },
    {
      name: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    },
  ],
  'Hash Table': [
    {
      name: 'Two Sum',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/two-sum/',
    },
    {
      name: 'Top K Frequent Elements',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/top-k-frequent-elements/',
    },
  ],
  'Dynamic Programming': [
    {
      name: 'Climbing Stairs',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/climbing-stairs/',
    },
    {
      name: 'Coin Change',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/coin-change/',
    },
    {
      name: 'Longest Common Subsequence',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/longest-common-subsequence/',
    },
  ],
  Tree: [
    {
      name: 'Invert Binary Tree',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/invert-binary-tree/',
    },
    {
      name: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    },
    {
      name: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    },
  ],
  'Binary Tree': [
    {
      name: 'Invert Binary Tree',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/invert-binary-tree/',
    },
    {
      name: 'Maximum Depth of Binary Tree',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
    },
    {
      name: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
    },
  ],
  'Graph Theory': [
    {
      name: 'Number of Islands',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/number-of-islands/',
    },
    {
      name: 'Clone Graph',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/clone-graph/',
    },
  ],
  'Two Pointers': [
    {
      name: 'Valid Palindrome',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/valid-palindrome/',
    },
    {
      name: 'Container With Most Water',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/container-with-most-water/',
    },
  ],
  'Sliding Window': [
    {
      name: 'Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
    },
    {
      name: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    },
  ],
  'Binary Search': [
    {
      name: 'Binary Search',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/binary-search/',
    },
    {
      name: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
    },
  ],
  Stack: [
    {
      name: 'Valid Parentheses',
      difficulty: 'Easy',
      url: 'https://leetcode.com/problems/valid-parentheses/',
    },
    {
      name: 'Min Stack',
      difficulty: 'Medium',
      url: 'https://leetcode.com/problems/min-stack/',
    },
  ],
};

// Target key topics to evaluate
const CORE_TOPICS = [
  'Array',
  'String',
  'Dynamic Programming',
  'Tree',
  'Graph Theory',
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Stack',
];

/* FETCH LIVE DATA */
fetchStatsBtn.addEventListener('click', async () => {
  const username = leetcodeUsernameInput.value.trim();
  if (!username) {
    showError('Please enter a LeetCode username.');
    return;
  }

  showLoading();

  try {
    // 1. Fetch Profile Info
    const profileRes = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}`
    );
    if (!profileRes.ok) throw new Error('Could not find LeetCode profile.');
    const profileData = await profileRes.json();

    if (profileData.errors || profileData.message === 'User not found') {
      throw new Error('LeetCode profile not found. Verify the username.');
    }

    // 2. Fetch Solved Stats
    const solvedRes = await fetch(
      `https://alfa-leetcode-api.onrender.com/${username}/solved`
    );
    if (!solvedRes.ok) throw new Error('Could not fetch solved statistics.');
    const solvedData = await solvedRes.json();

    // 3. Fetch Skill Stats (Topics)
    let skillData = { fundamental: [], intermediate: [], advanced: [] };
    try {
      const skillRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}/skill`
      );
      if (skillRes.ok) {
        skillData = await skillRes.json();
      }
    } catch (e) {
      console.warn('Could not fetch topic skill stats, using defaults.', e);
    }

    // 4. Fetch Submission Calendar
    let calendarData = {
      activeYears: [],
      streak: 0,
      totalActiveDays: 0,
      submissionCalendar: '{}',
    };
    try {
      const calendarRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/${username}/calendar`
      );
      if (calendarRes.ok) {
        calendarData = await calendarRes.json();
      }
    } catch (e) {
      console.warn('Could not fetch calendar stats.', e);
    }

    // Update UI with Live Stats
    displayUserProfile(profileData);
    displayStats(solvedData, profileData, calendarData);
    processTopicInsights(skillData);
    trackProgressHistory(username, solvedData.solvedProblem);
    renderSubmissionCalendar(calendarData);

    hideError();
  } catch (error) {
    showError(error.message || 'An error occurred while fetching data.');
  } finally {
    hideLoading();
  }
});

function showLoading() {
  loadingIndicator.classList.remove('hidden');
  errorMessage.classList.add('hidden');
  fetchStatsBtn.disabled = true;
}

function hideLoading() {
  loadingIndicator.classList.add('hidden');
  fetchStatsBtn.disabled = false;
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
}

function displayUserProfile(data) {
  userProfileCard.classList.remove('hidden');
  userAvatar.src =
    data.avatar ||
    'https://assets.leetcode.com/users/leetcode/avatar_1568224780.png';
  userRealName.textContent = data.name || data.username;
  userUsername.textContent = `@${data.username}`;
}

function displayStats(solvedData, profileData, calendarData) {
  totalSolved.textContent = solvedData.solvedProblem || 0;
  easySolved.textContent = solvedData.easySolved || 0;
  mediumSolved.textContent = solvedData.mediumSolved || 0;
  hardSolved.textContent = solvedData.hardSolved || 0;
  rankingCount.textContent = profileData.ranking
    ? profileData.ranking.toLocaleString()
    : 'N/A';

  // Use live calendar streak if available, otherwise fallback to local/manual streak
  streakCount.textContent =
    calendarData && calendarData.streak ? calendarData.streak : streak;

  // Calculate Acceptance Rate
  const acAll = solvedData.acSubmissionNum.find((x) => x.difficulty === 'All');
  const totalAll = solvedData.totalSubmissionNum.find(
    (x) => x.difficulty === 'All'
  );
  if (acAll && totalAll && totalAll.submissions > 0) {
    const rate = ((acAll.submissions / totalAll.submissions) * 100).toFixed(2);
    acceptanceRate.textContent = `${rate}%`;
  } else {
    acceptanceRate.textContent = 'N/A';
  }

  updateCharts(
    solvedData.easySolved || 0,
    solvedData.mediumSolved || 0,
    solvedData.hardSolved || 0
  );
}

/* PROCESS TOPICS & GENERATE PERSONALIZED RECOMMENDATIONS */
function processTopicInsights(skillData) {
  // Combine all topic arrays
  const allSkills = [
    ...(skillData.fundamental || []),
    ...(skillData.intermediate || []),
    ...(skillData.advanced || []),
  ];

  // Map user skill solve counts
  const skillMap = {};
  allSkills.forEach((skill) => {
    skillMap[skill.tagName] = skill.problemsSolved;
  });

  // Calculate top topics (Strong Areas)
  const sortedSkills = Object.entries(skillMap).sort((a, b) => b[1] - a[1]);

  const strongTopics = sortedSkills
    .slice(0, 3)
    .map((x) => `${x[0]} (${x[1]} solved)`);
  strongAreasText.textContent =
    strongTopics.length > 0
      ? strongTopics.join(', ')
      : 'No topic data available yet.';

  // Find Focus Areas (Weakest from CORE_TOPICS)
  const weakTopics = [];
  CORE_TOPICS.forEach((topic) => {
    const solved = skillMap[topic] || 0;
    weakTopics.push({ name: topic, solved });
  });

  // Sort ascending (lowest solves first)
  weakTopics.sort((a, b) => a.solved - b.solved);

  const focusTopics = weakTopics.slice(0, 3);
  const weakText = focusTopics
    .map((x) => `${x.name} (${x.solved} solved)`)
    .join(', ');
  weakAreasText.textContent = weakText || 'Keep practicing all areas!';

  // Generate recommendations
  recommendationsList.innerHTML = '';
  insightsSection.classList.remove('hidden');

  let recommendationsCount = 0;
  focusTopics.forEach((topic) => {
    const pool = curatedProblems[topic.name] || [];
    pool.forEach((prob) => {
      if (recommendationsCount < 4) {
        const item = document.createElement('div');
        item.className = 'rec-item';
        item.innerHTML = `
          <div class="rec-info">
            <h4>${prob.name}</h4>
            <span>Topic: <strong>${topic.name}</strong> | Difficulty: <span class="problem-difficulty ${prob.difficulty.toLowerCase()}">${prob.difficulty}</span></span>
          </div>
          <a href="${prob.url}" target="_blank" class="rec-link">
            Solve <i class="ri-external-link-line"></i>
          </a>
        `;
        recommendationsList.appendChild(item);
        recommendationsCount++;
      }
    });
  });

  // Build top 8 categories for the radar/bar chart
  const topTopicsForChart = CORE_TOPICS.map((topic) => {
    return { topic, count: skillMap[topic] || 0 };
  });

  updateTopicChart(topTopicsForChart);
}

/* HEATMAP CALENDAR RENDERER */
function renderSubmissionCalendar(calendarData) {
  const heatmapSection = document.getElementById('heatmapSection');
  const calendarGrid = document.getElementById('calendarGrid');
  const calendarMonths = document.getElementById('calendarMonths');

  calendarGrid.innerHTML = '';
  calendarMonths.innerHTML = '';
  heatmapSection.classList.remove('hidden');

  // Parse calendar submissions
  const submissions = JSON.parse(calendarData.submissionCalendar || '{}');

  // Normalize timestamps (seconds) to YYYY-MM-DD date strings
  const submissionMap = {};
  for (let timestamp in submissions) {
    const date = new Date(Number(timestamp) * 1000);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    submissionMap[dateKey] =
      (submissionMap[dateKey] || 0) + submissions[timestamp];
  }

  const today = new Date();

  // Set starting date: 364 days ago
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364);
  // Align startDate to Sunday (the beginning row in the column)
  const startDayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDayOfWeek);

  // Align end date to Saturday of the current week
  const endDate = new Date(today);
  const endDayOfWeek = endDate.getDay();
  endDate.setDate(endDate.getDate() + (6 - endDayOfWeek));

  const totalDays =
    Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const totalWeeks = Math.ceil(totalDays / 7);

  let currentDate = new Date(startDate);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let lastMonthName = '';

  // Draw week columns
  for (let w = 0; w < totalWeeks; w++) {
    const col = document.createElement('div');
    col.className = 'calendar-column';

    // Track month label alignment based on column beginning
    const firstDayOfWeek = new Date(currentDate);
    const monthName = months[firstDayOfWeek.getMonth()];

    if (monthName !== lastMonthName) {
      const monthSpan = document.createElement('span');
      monthSpan.className = 'month-label';
      monthSpan.textContent = monthName;

      const colWidth = 15; // 12px cell + 3px gap
      monthSpan.style.left = `${w * colWidth}px`;
      calendarMonths.appendChild(monthSpan);
      lastMonthName = monthName;
    }

    for (let d = 0; d < 7; d++) {
      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      const count = submissionMap[dateKey] || 0;

      const cell = document.createElement('div');
      cell.className = 'calendar-day';

      // Assign GitHub heatmap level colors
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 9) level = 3;
      else if (count > 9) level = 4;

      cell.classList.add(`level-${level}`);

      // Setup Tooltip format
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const dateFormatted = currentDate.toLocaleDateString(undefined, options);
      cell.setAttribute(
        'data-tooltip',
        `${count === 0 ? 'No' : count} submission${count !== 1 ? 's' : ''} on ${dateFormatted}`
      );

      col.appendChild(cell);

      // Advance date
      currentDate.setDate(currentDate.getDate() + 1);
    }
    calendarGrid.appendChild(col);
  }
}

/* HISTORY PROGRESS SNAPS */
function trackProgressHistory(username, currentSolvedCount) {
  const historyKey = `leetcode_history_${username}`;
  let history = JSON.parse(localStorage.getItem(historyKey)) || [];

  const todayStr = new Date().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  // Find if we already have today's entry
  const todayEntry = history.find((entry) => entry.date === todayStr);

  if (todayEntry) {
    todayEntry.solved = currentSolvedCount;
  } else {
    history.push({ date: todayStr, solved: currentSolvedCount });
  }

  // Keep last 7 data points
  if (history.length > 7) {
    history = history.slice(-7);
  }

  localStorage.setItem(historyKey, JSON.stringify(history));
  updateProgressHistoryChart(history);
}

// Generate mock history if needed for aesthetic presentation on first fetch
function getVisualHistory(history) {
  if (history.length > 0) return history;
  const list = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    list.push({ date: dateStr, solved: 0 });
  }
  return list;
}

/* CHARTS */
const difficultyCtx = document.getElementById('difficultyChart');
const topicCtx = document.getElementById('topicChart');
const progressCtx = document.getElementById('progressChart');

let difficultyChart;
let topicChart;
let progressChart;

function refreshChartTheme() {
  const styles = getComputedStyle(document.body);

  const textColor = styles.getPropertyValue('--text').trim();
  const secondaryColor = styles.getPropertyValue('--secondary').trim();
  const borderColor = styles.getPropertyValue('--border').trim();

  if (difficultyChart) {
    difficultyChart.options.plugins.legend.labels.color = textColor;
    difficultyChart.update();
  }

  if (topicChart) {
    topicChart.options.scales.r.grid.color = borderColor;
    topicChart.options.scales.r.angleLines.color = borderColor;
    topicChart.options.scales.r.pointLabels.color = textColor;
    topicChart.update();
  }

  if (progressChart) {
    progressChart.options.plugins.legend.labels.color = textColor;
    progressChart.options.scales.x.ticks.color = secondaryColor;
    progressChart.options.scales.y.ticks.color = secondaryColor;
    progressChart.options.scales.y.grid.color = borderColor;
    progressChart.update();
  }
}

function updateCharts(easy, medium, hard) {
  if (difficultyChart) {
    difficultyChart.destroy();
  }

  difficultyChart = new Chart(difficultyCtx, {
    type: 'doughnut',
    data: {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [
        {
          data: [easy, medium, hard],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text'),
          },
        },
      },
    },
  });
}

function updateTopicChart(topicData) {
  if (topicChart) {
    topicChart.destroy();
  }

  const labels = topicData.map((x) => x.topic);
  const data = topicData.map((x) => x.count);

  topicChart = new Chart(topicCtx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Problems Solved',
          data: data,
          backgroundColor: 'rgba(37, 99, 235, 0.2)',
          borderColor: '#2563eb',
          pointBackgroundColor: '#2563eb',
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          grid: {
            color: getComputedStyle(document.body).getPropertyValue('--border'),
          },
          angleLines: {
            color: getComputedStyle(document.body).getPropertyValue('--border'),
          },
          ticks: { display: false },
          pointLabels: {
            color: getComputedStyle(document.body).getPropertyValue('--text'),
            font: { size: 10 },
          },
        },
      },
      plugins: {
        legend: { display: false },
      },
    },
  });
}

function updateProgressHistoryChart(history) {
  if (progressChart) {
    progressChart.destroy();
  }

  const visualData = getVisualHistory(history);
  const labels = visualData.map((x) => x.date);
  const data = visualData.map((x) => x.solved);

  progressChart = new Chart(progressCtx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Total Solved Trend',
          data: data,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: '#3b82f6',
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          grid: { color: 'transparent' },
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue(
              '--secondary'
            ),
          },
        },
        y: {
          grid: {
            color: getComputedStyle(document.body).getPropertyValue('--border'),
          },
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue(
              '--secondary'
            ),
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text'),
          },
        },
      },
    },
  });
}

// Initial render of empty / offline progress state
renderProblems();
updateStats();
updateProgressHistoryChart([]);
