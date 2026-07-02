// --------------------------------------------------------------------------
// 1. Data Store / Mock Databases
// --------------------------------------------------------------------------

const COMPANY_QUESTIONS = [
  // GOOGLE
  {
    id: "google-1",
    name: "Two Sum",
    company: "Google",
    difficulty: "Easy",
    category: "Arrays & Hashing",
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: "Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].",
    constraints: "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
    starterCode: {
      javascript: "function twoSum(nums, target) {\n    // Write your code here\n    \n}",
      python: "def twoSum(nums, target):\n    # Write your code here\n    pass",
      cpp: "vector<int> twoSum(vector<int>& nums, int target) {\n    // Write your code here\n    \n}",
      java: "public int[] twoSum(int[] nums, int target) {\n    // Write your code here\n    \n}"
    },
    testCase: {
      input: [[2, 7, 11, 15], 9],
      runner: function (userFnStr) {
        try {
          const fn = new Function('nums', 'target', userFnStr + '\nreturn twoSum(nums, target);');
          const res = fn([2, 7, 11, 15], 9);
          if (Array.isArray(res) && ((res[0] === 0 && res[1] === 1) || (res[0] === 1 && res[1] === 0))) {
            return { success: true, message: "Test Case Passed! Input: [2,7,11,15], Target: 9 -> Output: " + JSON.stringify(res) };
          }
          return { success: false, error: "Test Case Failed. Expected: [0,1], Got: " + JSON.stringify(res) };
        } catch (e) {
          return { success: false, error: "Runtime Error: " + e.message };
        }
      }
    }
  },
  {
    id: "google-2",
    name: "Median of Two Sorted Arrays",
    company: "Google",
    difficulty: "Hard",
    category: "Binary Search",
    desc: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    examples: "Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000\nExplanation: merged array = [1,2,3] and median is 2.",
    constraints: "nums1.length == m, nums2.length == n\n0 <= m, n <= 1000\n1 <= m + n <= 2000",
    starterCode: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n    \n}",
      python: "def findMedianSortedArrays(nums1, nums2):\n    # Write your code here\n    pass",
      cpp: "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Write your code here\n    \n}",
      java: "public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    // Write your code here\n    \n}"
    }
  },
  {
    id: "google-3",
    name: "Logger Rate Limiter",
    company: "Google",
    difficulty: "Easy",
    category: "Design",
    desc: "Design a logger system that receives a stream of messages along with their timestamps. Each unique message should only be printed at most once every 10 seconds (i.e. a message printed at timestamp t will prevent other identical messages from being printed until t + 10).",
    examples: "Logger logger = new Logger();\nlogger.shouldPrintMessage(1, \"foo\"); // return true\nlogger.shouldPrintMessage(2, \"bar\"); // return true\nlogger.shouldPrintMessage(3, \"foo\"); // return false (t=1 < 1+10)",
    constraints: "0 <= timestamp <= 10^9\nAt most 10^4 calls will be made.",
    starterCode: {
      javascript: "class Logger {\n    constructor() {\n        this.map = new Map();\n    }\n    shouldPrintMessage(timestamp, message) {\n        if (!this.map.has(message) || timestamp >= this.map.get(message) + 10) {\n            this.map.set(message, timestamp);\n            return true;\n        }\n        return false;\n    }\n}",
      python: "class Logger:\n    def __init__(self):\n        pass"
    }
  },
  // META
  {
    id: "meta-1",
    name: "Subarray Sum Equals K",
    company: "Meta",
    difficulty: "Medium",
    category: "Arrays & Hashing",
    desc: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    examples: "Input: nums = [1,1,1], k = 2\nOutput: 2\nExplanation: [1,1] appears twice.",
    constraints: "1 <= nums.length <= 2 * 10^4\n-1000 <= nums[i] <= 1000\n-10^7 <= k <= 10^7",
    starterCode: {
      javascript: "function subarraySum(nums, k) {\n    // Write your code here\n    \n}",
      python: "def subarraySum(nums: List[int], k: int) -> int:\n    pass"
    }
  },
  {
    id: "meta-2",
    name: "Lowest Common Ancestor of a Binary Tree",
    company: "Meta",
    difficulty: "Medium",
    category: "Trees",
    desc: "Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.",
    examples: "Input: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1\nOutput: 3\nExplanation: The LCA of nodes 5 and 1 is 3.",
    starterCode: {
      javascript: "function lowestCommonAncestor(root, p, q) {\n    // Write your code here\n    \n}"
    }
  },
  // AMAZON
  {
    id: "amazon-1",
    name: "LRU Cache",
    company: "Amazon",
    difficulty: "Hard",
    category: "Design",
    desc: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
    examples: "LRUCache lRUCache = new LRUCache(2);\nlRUCache.put(1, 1); \nlRUCache.put(2, 2); \nlRUCache.get(1);    // returns 1\nlRUCache.put(3, 3); // evicts key 2\nlRUCache.get(2);    // returns -1 (not found)",
    starterCode: {
      javascript: "class LRUCache {\n    constructor(capacity) {\n        \n    }\n    get(key) {\n        \n    }\n    put(key, value) {\n        \n    }\n}"
    }
  },
  {
    id: "amazon-2",
    name: "K Closest Points to Origin",
    company: "Amazon",
    difficulty: "Medium",
    category: "Heap / Priority Queue",
    desc: "Given an array of `points` where `points[i] = [xi, yi]` and an integer `k`, return the `k` closest points to the origin (0, 0) on the XY plane.",
    examples: "Input: points = [[1,3],[-2,2]], k = 1\nOutput: [[-2,2]]",
    starterCode: {
      javascript: "function kClosest(points, k) {\n    // Write your code here\n    \n}"
    }
  },
  // MICROSOFT
  {
    id: "microsoft-1",
    name: "Spiral Matrix",
    company: "Microsoft",
    difficulty: "Medium",
    category: "Arrays & Matrix",
    desc: "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
    examples: "Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]",
    starterCode: {
      javascript: "function spiralOrder(matrix) {\n    // Write your code here\n    \n}"
    }
  },
  {
    id: "microsoft-2",
    name: "Search a 2D Matrix",
    company: "Microsoft",
    difficulty: "Medium",
    category: "Binary Search",
    desc: "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix `matrix` which is sorted row-wise and column-wise.",
    examples: "Input: matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3\nOutput: true",
    starterCode: {
      javascript: "function searchMatrix(matrix, target) {\n    // Write your code here\n    \n}"
    }
  }
];

const DSA_CURRICULUM = [
  {
    id: "dsa-arrays",
    title: "Arrays & Hashing",
    desc: "Master layout storage indexing, sequence maps, tracking subsets, and frequency tables.",
    cheatSheet: "Hashing provides O(1) lookups at the expense of memory. Use Two-Sum hash matching. Prefix/suffix arrays help count range sums in constant time.",
    questions: [
      { id: "dsa-1", name: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/" },
      { id: "dsa-2", name: "Valid Anagram", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/" },
      { id: "dsa-3", name: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/" },
      { id: "dsa-4", name: "Group Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/" },
      { id: "dsa-5", name: "Top K Frequent Elements", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/" }
    ]
  },
  {
    id: "dsa-pointers",
    title: "Two Pointers",
    desc: "Optimize search spaces on sorted inputs by reducing loop overhead.",
    cheatSheet: "Maintain left and right markers. Move them inwards based on target comparison. Reduces O(N^2) complexity to O(N).",
    questions: [
      { id: "dsa-6", name: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/" },
      { id: "dsa-7", name: "Two Sum II - Input Array Is Sorted", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { id: "dsa-8", name: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/" },
      { id: "dsa-9", name: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/" }
    ]
  },
  {
    id: "dsa-window",
    title: "Sliding Window",
    desc: "Scan contiguous sub-ranges dynamically using dual boundary expansion.",
    cheatSheet: "Use when calculating subarray stats. Move right index to expand, and shrink left index when constraint is violated.",
    questions: [
      { id: "dsa-10", name: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { id: "dsa-11", name: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { id: "dsa-12", name: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/" }
    ]
  },
  {
    id: "dsa-trees",
    title: "Trees",
    desc: "Understand depth-first, breadth-first traversals, and self-balancing BST systems.",
    cheatSheet: "Use recursion for DFS (Inorder, Preorder, Postorder). Use queues for Level Order BFS traversal. Height of BST is O(log N) if balanced.",
    questions: [
      { id: "dsa-13", name: "Invert Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/" },
      { id: "dsa-14", name: "Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { id: "dsa-15", name: "Same Tree", difficulty: "Easy", link: "https://leetcode.com/problems/same-tree/" },
      { id: "dsa-16", name: "Binary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" }
    ]
  },
  {
    id: "dsa-dp",
    title: "Dynamic Programming",
    desc: "Solve complex tasks by breaking them down into optimized, memoized sub-problems.",
    cheatSheet: "Identify overlapping subproblems and optimal substructure. Decide between Top-down memoization (recursion + cache) or Bottom-up tabulation (iterative array).",
    questions: [
      { id: "dsa-17", name: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/" },
      { id: "dsa-18", name: "Coin Change", difficulty: "Medium", link: "https://leetcode.com/problems/coin-change/" },
      { id: "dsa-19", name: "Longest Increasing Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-increasing-subsequence/" }
    ]
  }
];

const FLASHCARDS_DECKS = {
  "dsa-patterns": {
    name: "DSA Patterns",
    cards: [
      { id: "f-1", cat: "Arrays", q: "What is the average and worst-case time complexity of searching in a Hash Map?", a: "<p><strong>Average:</strong> O(1) time complexity.</p><p><strong>Worst-case:</strong> O(N) time complexity. This degrades when hash collisions occur, mapping elements to the same bucket where they have to be searched linearly.</p>" },
      { id: "f-2", cat: "Sorting", q: "Why is QuickSort preferred over MergeSort for sorting arrays in-place?", a: "<p>QuickSort does not require extra space (O(log N) stack frames), while MergeSort requires auxiliary space (O(N)) to merge arrays. However, MergeSort is stable and guarantees O(N log N) worst-case time complexity.</p>" },
      { id: "f-3", cat: "Bit Manipulation", q: "How do you check if an integer is a power of two in O(1) time?", a: "<p>Perform the bitwise operation: <code>(n & (n - 1)) == 0</code> (where n > 0).</p><p>This clears the lowest set bit. A power of two has exactly one set bit in binary form.</p>" }
    ]
  },
  "sys-design": {
    name: "System Design Concepts",
    cards: [
      { id: "f-4", cat: "Scalability", q: "What is the difference between Horizontal and Vertical scaling?", a: "<p><strong>Vertical (Scale-up):</strong> Adding more power (CPU, RAM) to an existing single machine.</p><p><strong>Horizontal (Scale-out):</strong> Adding more machines to your network resource pool, routing traffic via load balancers.</p>" },
      { id: "f-5", cat: "Databases", q: "Explain the CAP Theorem.", a: "<p>The theorem states that a distributed system can guarantee at most two out of three properties:</p><ul><li><strong>Consistency:</strong> Every read receives the most recent write or an error.</li><li><strong>Availability:</strong> Every request receives a non-error response.</li><li><strong>Partition Tolerance:</strong> The system continues to operate despite network messages drop.</li></ul>" },
      { id: "f-6", cat: "Caching", q: "What is Cache Penetrability and how do you resolve it?", a: "<p><strong>Problem:</strong> Requests query keys that do not exist in the cache OR DB, hitting the DB every time.</p><p><strong>Solution:</strong> Cache the empty results with a short TTL, or use a <strong>Bloom Filter</strong> to check key existence before accessing the cache/DB layer.</p>" }
    ]
  },
  "behavioral": {
    name: "STAR Framework (Behavioral)",
    cards: [
      { id: "f-7", cat: "Structure", q: "What does the STAR acronym stand for?", a: "<p><strong>S - Situation:</strong> Describe the context and background.</p><p><strong>T - Task:</strong> State the problem, goals, or requirements.</p><p><strong>A - Action:</strong> Describe what <em>you</em> did specifically, details of execution.</p><p><strong>R - Result:</strong> Share metrics, outcomes, deliverables, lessons learned.</p>" },
      { id: "f-8", cat: "Conflict Resolution", q: "How should you answer: 'Tell me about a time you disagreed with a manager?'", a: "<p>Focus on professional collaboration. Do not complain. Emphasize how you gathered data, discussed options calmly, disagreed and committed, or arrived at a data-backed compromise that prioritized customer success.</p>" }
    ]
  }
};

const MOCK_QUESTIONS = {
  behavioral: [
    "Tell me about a time when you were faced with a tight deadline and how you handled the situation.",
    "Describe a challenging technical problem you solved recently and how you walked through the architecture.",
    "Tell me about a time you disagreed with a colleague or manager. How did you resolve it?"
  ],
  dsa: [
    "Explain how you would design an algorithm to detect a cycle in a directed graph. Walk through the complexity.",
    "Explain the sliding window technique. When would you use it over a standard double loop?",
    "Describe how a binary heap operates. What are the insert and extract-min time complexities?"
  ],
  "system-design": [
    "Design a URL Shortener like Bitly. How do you scale redirect links to 10,000 requests per second?",
    "Design a real-time messaging system like WhatsApp. How do you handle offline queues and push notifications?",
    "Design a rate limiter for a public API. Which algorithm (Token Bucket, Leaky Bucket, Sliding Window Log) would you use?"
  ]
};

// --------------------------------------------------------------------------
// 2. Local Storage State Initialization
// --------------------------------------------------------------------------

const state = {
  theme: localStorage.getItem("theme") || "dark",
  solvedQuestions: JSON.parse(localStorage.getItem("solvedQuestions")) || [],
  customQuestions: JSON.parse(localStorage.getItem("customQuestions")) || [],
  notes: JSON.parse(localStorage.getItem("notes")) || [
    {
      id: "note-init-1",
      title: "Binary Tree DFS Patterns",
      folder: "DSA",
      content: "# Binary Tree Depth-First Search\n\nDFS is commonly implemented recursively. The main recursion patterns are:\n\n* **Inorder**: Left, Node, Right (yields sorted elements in BST)\n* **Preorder**: Node, Left, Right (useful for copying trees)\n* **Postorder**: Left, Right, Node (useful for deletion)\n\n### Sample Code (JavaScript):\n```javascript\nfunction inorder(root) {\n    if (!root) return;\n    inorder(root.left);\n    console.log(root.val);\n    inorder(root.right);\n}\n```",
      updatedAt: new Date().toISOString()
    }
  ],
  flashcardSRS: JSON.parse(localStorage.getItem("flashcardSRS")) || {},
  mockHistory: JSON.parse(localStorage.getItem("mockHistory")) || [],
  streakCount: parseInt(localStorage.getItem("streakCount")) || 1,
  lastActiveDate: localStorage.getItem("lastActiveDate") || new Date().toDateString(),
  activityHistory: JSON.parse(localStorage.getItem("activityHistory")) || {}
};

// Update activity tracking
function trackDailyActivity() {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Track this day in heatmap
  const dateKey = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  state.activityHistory[dateKey] = (state.activityHistory[dateKey] || 0) + 1;
  localStorage.setItem("activityHistory", JSON.stringify(state.activityHistory));

  if (state.lastActiveDate !== today) {
    if (state.lastActiveDate === yesterday) {
      state.streakCount += 1;
    } else {
      state.streakCount = 1;
    }
    state.lastActiveDate = today;
    localStorage.setItem("streakCount", state.streakCount);
    localStorage.setItem("lastActiveDate", state.lastActiveDate);
  }
}

function saveState(key) {
  localStorage.setItem(key, JSON.stringify(state[key]));
}

// --------------------------------------------------------------------------
// 3. Tab Navigation & Core Rendering View Switch
// --------------------------------------------------------------------------

const navItems = document.querySelectorAll(".nav-item");
const contentViews = document.querySelectorAll(".content-view");
const pageTitleEl = document.getElementById("page-title");

navItems.forEach(item => {
  item.addEventListener("click", () => {
    const tabId = item.getAttribute("data-tab");

    // Switch navigation states
    navItems.forEach(nav => nav.classList.remove("active"));
    item.classList.add("active");

    // Switch views
    contentViews.forEach(view => view.classList.remove("active"));
    const activeView = document.getElementById(`view-${tabId}`);
    if (activeView) activeView.classList.add("active");

    // Update title
    const headerTitle = item.querySelector("span").textContent;
    pageTitleEl.textContent = headerTitle;

    // Trigger tab specific load functions
    onTabLoad(tabId);
  });
});

function onTabLoad(tabId) {
  trackDailyActivity();
  updateStreakDisplay();

  if (tabId === "dashboard") {
    renderDashboard();
  } else if (tabId === "company-questions") {
    renderCompanies();
  } else if (tabId === "dsa-tracker") {
    renderDSATracker();
  } else if (tabId === "notes") {
    renderNotesManager();
  } else if (tabId === "flashcards") {
    renderFlashcardDecks();
  }
}

// Streak Badge Display
function updateStreakDisplay() {
  document.getElementById("streak-count").textContent = state.streakCount;
}

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  if (document.body.classList.contains("light-theme")) {
    document.body.classList.remove("light-theme");
    state.theme = "dark";
  } else {
    document.body.classList.add("light-theme");
    state.theme = "light";
  }
  localStorage.setItem("theme", state.theme);
});

// Init theme on load
if (state.theme === "light") {
  document.body.classList.add("light-theme");
}

// --------------------------------------------------------------------------
// 4. Custom Markdown Parser (Lightweight regex replacement)
// --------------------------------------------------------------------------

function compileMarkdown(text) {
  if (!text) return '<p class="empty-state-preview">Live preview will compile here as you type...</p>';

  // Escape HTML tags to protect script execution and security alerts
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');

  // Fenced Code blocks
  html = html.replace(/```(?:javascript|python|cpp|java)?([\s\S]*?)```/gm, '<pre><code>$1</code></pre>');

  // Inline code tags
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Anchors / links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

  // Bullet lists
  html = html.replace(/^\s*-\s*(.*$)/gim, '<li>$1</li>');
  // Group lists together in UL
  html = html.replace(/(<li>[\s\S]*?<\/li>)/gm, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, ''); // Join consecutive lists

  // Break lines
  html = html.replace(/\n/g, '<br />');

  return html;
}

// --------------------------------------------------------------------------
// 5. Dashboard Controller
// --------------------------------------------------------------------------

let chartInstance = null;

function renderDashboard() {
  // Stat counters
  const totalDSA = DSA_CURRICULUM.reduce((sum, mod) => sum + mod.questions.length, 0);
  const solvedDSA = state.solvedQuestions.filter(id => id.startsWith("dsa-")).length;
  document.getElementById("dashboard-dsa-count").textContent = `${solvedDSA}/${totalDSA}`;
  document.getElementById("dashboard-dsa-fill").style.width = `${totalDSA > 0 ? (solvedDSA / totalDSA) * 100 : 0}%`;

  const companyQsList = getCompleteCompanyQuestions();
  const solvedCompany = companyQsList.filter(q => state.solvedQuestions.includes(q.id)).length;
  document.getElementById("dashboard-company-count").textContent = `${solvedCompany}/${companyQsList.length}`;
  document.getElementById("dashboard-company-fill").style.width = `${companyQsList.length > 0 ? (solvedCompany / companyQsList.length) * 100 : 0}%`;

  document.getElementById("dashboard-mock-count").textContent = state.mockHistory.length;

  const totalMasteredFlash = Object.values(state.flashcardSRS).filter(s => s === "gotit").length;
  document.getElementById("dashboard-flash-count").textContent = totalMasteredFlash;

  // Activity Heatmap rendering
  renderActivityTiles();

  // Recommendations logic
  renderDashboardRecommendations(solvedDSA, solvedCompany);

  // Recent notes loading
  renderRecentNotes();

  // Draw Performance Canvas Chart
  setTimeout(drawDashboardCanvasChart, 100);
}

function renderActivityTiles() {
  const container = document.getElementById("streak-grid-tiles");
  container.innerHTML = "";

  const today = new Date();
  const tilesCount = 371; // 53 weeks * 7 days
  const startDate = new Date(today.getTime() - (tilesCount - 1) * 86400000);

  for (let i = 0; i < tilesCount; i++) {
    const current = new Date(startDate.getTime() + i * 86400000);
    const dateKey = current.toISOString().split("T")[0];
    const level = Math.min(state.activityHistory[dateKey] || 0, 3);

    const tile = document.createElement("div");
    tile.className = "streak-tile";
    tile.setAttribute("data-level", level);
    tile.title = `${current.toDateString()}: ${state.activityHistory[dateKey] || 0} activities`;
    container.appendChild(tile);
  }
}

function renderDashboardRecommendations(solvedDSA, solvedCompany) {
  const recList = document.getElementById("dashboard-rec-list");
  recList.innerHTML = "";

  const recommendations = [];

  // Suggest DSA Module if not 100% complete
  for (let module of DSA_CURRICULUM) {
    const solvedModCount = module.questions.filter(q => state.solvedQuestions.includes(q.id)).length;
    if (solvedModCount < module.questions.length) {
      recommendations.push({
        title: `Progress in ${module.title}`,
        type: "dsa",
        meta: `${solvedModCount} of ${module.questions.length} completed`
      });
      break;
    }
  }

  // Suggest a flashcard review
  const activeSRSKeys = Object.keys(state.flashcardSRS);
  if (activeSRSKeys.length === 0) {
    recommendations.push({
      title: "Revise Terminology",
      type: "flashcards",
      meta: "Initialize your flashcard decks"
    });
  } else {
    recommendations.push({
      title: "Review Flashcards",
      type: "flashcards",
      meta: `${activeSRSKeys.length} cards currently in rotation`
    });
  }

  // Suggest Mock Interview if none done yet
  if (state.mockHistory.length === 0) {
    recommendations.push({
      title: "Practice Mock Interview",
      type: "mock",
      meta: "Run a short 5-minute Behavioral mock"
    });
  } else {
    recommendations.push({
      title: "Boost Interview Confidence",
      type: "mock",
      meta: "Try a new Technical DSA track"
    });
  }

  // Render suggestion elements
  recommendations.forEach(rec => {
    const div = document.createElement("div");
    div.className = "rec-item";
    div.innerHTML = `
      <div class="rec-item-title">${rec.title}</div>
      <span class="subtext">${rec.meta}</span>
    `;
    recList.appendChild(div);
  });
}

function renderRecentNotes() {
  const listEl = document.getElementById("dashboard-recent-notes");
  listEl.innerHTML = "";

  // Sort notes by updated date
  const sorted = [...state.notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3);

  if (sorted.length === 0) {
    listEl.innerHTML = '<p class="subtext">No notes created yet. Open Notes Manager tab to write one!</p>';
    return;
  }

  sorted.forEach(note => {
    const div = document.createElement("div");
    div.className = "mini-note-item";
    div.innerHTML = `
      <div class="note-meta-title">📝 ${note.title}</div>
      <span class="badge uppercase" style="background: rgba(139, 92, 246, 0.1); color: var(--color-primary);">${note.folder}</span>
    `;
    div.addEventListener("click", () => {
      document.getElementById("nav-notes").click();
      selectNoteById(note.id);
    });
    listEl.appendChild(div);
  });
}

// Custom canvas chart plotting
function drawDashboardCanvasChart() {
  const canvas = document.getElementById("dashboardChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  // Adjust resolutions for high DPI
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio;
  canvas.height = 260 * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);

  const w = rect.width;
  const h = 260;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Data: count solved questions per topic category
  const categories = ["Arrays", "Two Pointers", "Sliding Window", "Trees", "DP", "Design"];
  const totalCounts = [5, 4, 3, 4, 3, 2]; // Standard ratios
  const solvedCounts = [
    state.solvedQuestions.filter(id => id.includes("arrays") || id === "dsa-3" || id === "google-1" || id === "meta-1" || id === "microsoft-1").length,
    state.solvedQuestions.filter(id => id.includes("pointers") || id === "google-4").length,
    state.solvedQuestions.filter(id => id.includes("window")).length,
    state.solvedQuestions.filter(id => id.includes("trees") || id === "meta-2").length,
    state.solvedQuestions.filter(id => id.includes("dp")).length,
    state.solvedQuestions.filter(id => id.includes("design") || id === "google-3" || id === "amazon-1").length
  ];

  // Draw chart grids
  const paddingX = 40;
  const paddingY = 30;
  const graphH = h - paddingY * 2;
  const graphW = w - paddingX * 2;
  const barWidth = Math.min(50, graphW / categories.length - 15);
  const colSpacing = graphW / categories.length;

  // Grid Lines
  ctx.strokeStyle = state.theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  ctx.lineWidth = 1;
  ctx.fillStyle = state.theme === "dark" ? "#6b7280" : "#4b5563";
  ctx.font = "10px sans-serif";

  for (let i = 0; i <= 4; i++) {
    const yVal = paddingY + (graphH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(paddingX, yVal);
    ctx.lineTo(w - paddingX, yVal);
    ctx.stroke();

    // Label
    const valueRepresented = 4 - i;
    ctx.fillText(valueRepresented.toString(), paddingX - 18, yVal + 3);
  }

  // Draw Bars
  categories.forEach((cat, idx) => {
    const cx = paddingX + idx * colSpacing + (colSpacing - barWidth) / 2;
    const maxVal = Math.max(totalCounts[idx], 1);
    const solvedVal = solvedCounts[idx];
    const valPercent = solvedVal / maxVal;

    const barHeight = Math.max(5, graphH * valPercent);
    const cy = paddingY + graphH - barHeight;

    // Draw Background Bar
    ctx.fillStyle = state.theme === "dark" ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)";
    ctx.fillRect(cx, paddingY, barWidth, graphH);

    // Draw Glowing Active Bar Gradient
    const grad = ctx.createLinearGradient(cx, cy, cx, cy + barHeight);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(1, '#ec4899');

    ctx.fillStyle = grad;
    // Rounded bar top
    ctx.beginPath();
    ctx.roundRect(cx, cy, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Labels
    ctx.fillStyle = state.theme === "dark" ? "#9ca3af" : "#4b5563";
    ctx.textAlign = "center";
    ctx.fillText(cat, cx + barWidth / 2, paddingY + graphH + 15);
  });
}

// Helper to get total company questions list
function getCompleteCompanyQuestions() {
  return [...COMPANY_QUESTIONS, ...state.customQuestions];
}

// --------------------------------------------------------------------------
// 6. Company Questions Controller
// --------------------------------------------------------------------------

const companyGrid = document.getElementById("companies-cards-grid");
const companySelectionScreen = document.getElementById("company-selection");
const companyQuestionsDetailScreen = document.getElementById("company-question-list");
const companyQsTbody = document.getElementById("company-questions-tbody");

function renderCompanies() {
  companySelectionScreen.classList.remove("hidden");
  companyQuestionsDetailScreen.classList.add("hidden");
  companyGrid.innerHTML = "";

  const companiesList = ["Google", "Meta", "Amazon", "Microsoft", "Netflix", "Apple"];
  const allQs = getCompleteCompanyQuestions();

  companiesList.forEach(comp => {
    const totalQs = allQs.filter(q => q.company === comp).length;
    const solvedCount = allQs.filter(q => q.company === comp && state.solvedQuestions.includes(q.id)).length;

    const card = document.createElement("div");
    card.className = "company-card";
    card.innerHTML = `
      <div class="company-logo-wrapper">
        <svg class="company-logo" viewBox="0 0 24 24">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
        </svg>
      </div>
      <h3>${comp}</h3>
      <span class="qs-count">${solvedCount} / ${totalQs} Solved</span>
    `;
    card.addEventListener("click", () => showCompanyQuestions(comp));
    companyGrid.appendChild(card);
  });
}

let activeCompany = "";

function showCompanyQuestions(company) {
  activeCompany = company;
  companySelectionScreen.classList.add("hidden");
  companyQuestionsDetailScreen.classList.remove("hidden");
  document.getElementById("selected-company-title").textContent = `${company} Questions`;

  // Render filters and list
  filterCompanyQuestions();
}

// Filters listeners
document.getElementById("company-q-search").addEventListener("input", filterCompanyQuestions);
document.getElementById("company-q-difficulty").addEventListener("change", filterCompanyQuestions);
document.getElementById("company-q-status").addEventListener("change", filterCompanyQuestions);
document.getElementById("btn-company-back").addEventListener("click", () => {
  renderCompanies();
});

function filterCompanyQuestions() {
  const query = document.getElementById("company-q-search").value.toLowerCase();
  const difficulty = document.getElementById("company-q-difficulty").value;
  const status = document.getElementById("company-q-status").value;

  const allQs = getCompleteCompanyQuestions().filter(q => q.company === activeCompany);

  const filtered = allQs.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(query) || q.category.toLowerCase().includes(query);
    const matchesDiff = difficulty === "all" || q.difficulty === difficulty;
    const matchesStatus = status === "all" ||
      (status === "solved" && state.solvedQuestions.includes(q.id)) ||
      (status === "unsolved" && !state.solvedQuestions.includes(q.id));
    return matchesSearch && matchesDiff && matchesStatus;
  });

  const solvedCount = allQs.filter(q => state.solvedQuestions.includes(q.id)).length;
  document.getElementById("company-progress-text").textContent = `${solvedCount} of ${allQs.length} completed`;

  renderQuestionsTable(filtered);
}

function renderQuestionsTable(questions) {
  companyQsTbody.innerHTML = "";

  if (questions.length === 0) {
    companyQsTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No questions match the selected filters.</td></tr>`;
    return;
  }

  questions.forEach(q => {
    const isSolved = state.solvedQuestions.includes(q.id);
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>
        <input type="checkbox" class="checkbox-custom" ${isSolved ? "checked" : ""} disabled data-id="${q.id}">
      </td>
      <td class="row-q-name">${q.name}</td>
      <td>${q.category}</td>
      <td>
        <span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
      </td>
      <td>
        <a href="${q.link || '#'}" target="_blank">${q.link ? "Leetcode Link ↗" : "Local Challenge"}</a>
      </td>
      <td>
        <button class="secondary-btn solve-btn-action" data-id="${q.id}">Solve</button>
      </td>
    `;

    // Solve button open workspace
    tr.querySelector(".solve-btn-action").addEventListener("click", () => {
      openCodingWorkspace(q);
    });

    companyQsTbody.appendChild(tr);
  });
}

function toggleQuestionSolved(id, isChecked) {
  if (isChecked) {
    if (!state.solvedQuestions.includes(id)) state.solvedQuestions.push(id);
  } else {
    state.solvedQuestions = state.solvedQuestions.filter(x => x !== id);
  }
  saveState("solvedQuestions");
  filterCompanyQuestions();
}

// --------------------------------------------------------------------------
// 7. Interactive Code Editor & Coding Workspace
// --------------------------------------------------------------------------

const codingWorkspace = document.getElementById("coding-workspace-overlay");
const editorTextarea = document.getElementById("editor-code-textarea");
const terminalOutput = document.getElementById("terminal-output-body");
const workspaceNotes = document.getElementById("coding-question-notes");

let activeWorkspaceQuestion = null;

function openCodingWorkspace(q) {
  activeWorkspaceQuestion = q;
  codingWorkspace.classList.remove("hidden");

  document.getElementById("coding-question-title").textContent = `Solve: ${q.name}`;
  const diffEl = document.getElementById("coding-question-diff");
  diffEl.textContent = q.difficulty;
  diffEl.className = `badge ${q.difficulty.toLowerCase()}`;
  document.getElementById("coding-question-company").textContent = q.company;

  document.getElementById("coding-question-desc").innerHTML = compileMarkdown(q.desc);
  document.getElementById("coding-question-examples").innerHTML = `<pre>${q.examples || "No examples loaded."}</pre>`;

  const constraintsEl = document.getElementById("coding-question-constraints");
  constraintsEl.innerHTML = "";
  if (q.constraints) {
    q.constraints.split("\n").forEach(c => {
      const li = document.createElement("li");
      li.textContent = c;
      constraintsEl.appendChild(li);
    });
  } else {
    constraintsEl.innerHTML = "<li>No specific constraints loaded.</li>";
  }

  // Load private note if any
  const noteKey = `sol-note-${q.id}`;
  workspaceNotes.value = localStorage.getItem(noteKey) || "";

  // Reset editor template
  const langSelect = document.getElementById("editor-lang-select");
  langSelect.value = "javascript";
  loadCodeTemplate();

  // Clear terminal
  terminalOutput.innerHTML = `<span class="stdout-msg">Compiler simulator ready. Press 'Run Test Cases' to validate code.</span>`;
}

// Language Picker listener
document.getElementById("editor-lang-select").addEventListener("change", loadCodeTemplate);
document.getElementById("btn-reset-code").addEventListener("click", loadCodeTemplate);

function loadCodeTemplate() {
  if (!activeWorkspaceQuestion) return;
  const lang = document.getElementById("editor-lang-select").value;
  const code = activeWorkspaceQuestion.starterCode && activeWorkspaceQuestion.starterCode[lang]
    ? activeWorkspaceQuestion.starterCode[lang]
    : `// Code template not available for ${lang}.\n// Feel free to draft your implementation here.`;

  editorTextarea.value = code;
}

// Auto sync solver private notes
workspaceNotes.addEventListener("input", () => {
  if (activeWorkspaceQuestion) {
    localStorage.setItem(`sol-note-${activeWorkspaceQuestion.id}`, workspaceNotes.value);
  }
});

// Helper to automatically mark a question as solved
function markActiveQuestionAsSolved() {
  if (activeWorkspaceQuestion) {
    if (!state.solvedQuestions.includes(activeWorkspaceQuestion.id)) {
      state.solvedQuestions.push(activeWorkspaceQuestion.id);
      saveState("solvedQuestions");
      trackDailyActivity();
      if (activeCompany) showCompanyQuestions(activeCompany);
      renderDashboard();
    }
  }
}

// Run Simulation Terminal logic
document.getElementById("btn-run-code").addEventListener("click", () => {
  if (!activeWorkspaceQuestion) return;

  const lang = document.getElementById("editor-lang-select").value;
  const userCode = editorTextarea.value;

  terminalOutput.innerHTML = '<span class="stdout-msg">Running tests...</span>';

  setTimeout(() => {
    if (lang === "javascript") {
      if (activeWorkspaceQuestion.testCase && activeWorkspaceQuestion.testCase.runner) {
        const testResult = activeWorkspaceQuestion.testCase.runner(userCode);
        if (testResult.success) {
          terminalOutput.innerHTML = `<span class="success-msg">✓ SUCCESS: All internal test cases passed!</span><br><span class="stdout-msg">${testResult.message}</span><br><span class="success-msg">✓ Question automatically marked as solved!</span>`;
          markActiveQuestionAsSolved();
        } else {
          terminalOutput.innerHTML = `<span class="error-msg">✗ FAILED: ${testResult.error}</span>`;
        }
      } else {
        // Fallback Javascript check
        try {
          new Function(userCode);
          terminalOutput.replaceChildren();

          const msg = document.createElement("span");
          msg.className = "success-msg";
          msg.textContent = "✓ Syntax Valid: Code parsed correctly, no execution test cases bound.";

          terminalOutput.appendChild(msg);
        } catch (e) {
          terminalOutput.replaceChildren();

          const msg = document.createElement("span");
          msg.className = "error-msg";
          msg.textContent = `✗ Compiler Syntax Error: ${e.message}`;

          terminalOutput.appendChild(msg);
        }
      }
    } else {
      // Python, C++, Java Mock compilers
      terminalOutput.replaceChildren();

      const line1 = document.createElement("span");
      line1.className = "stdout-msg";
      line1.textContent = `Simulating compiler pipeline for static ${lang.toUpperCase()} source...`;

      const br1 = document.createElement("br");

      const line2 = document.createElement("span");
      line2.className = "success-msg";
      line2.textContent = "✓ Success: Compiled with code analyzer (0 Warnings).";

      const br2 = document.createElement("br");

      const line3 = document.createElement("span");
      line3.className = "stdout-msg";
      line3.textContent = "Run tests completed successfully. (Mock evaluation completed)";

      terminalOutput.append(line1, br1, line2, br2, line3);
    }
  }, 400);
});

// Submit code
document.getElementById("btn-submit-code").addEventListener("click", () => {
  if (!activeWorkspaceQuestion) return;

  const lang = document.getElementById("editor-lang-select").value;
  const userCode = editorTextarea.value;

  // Validate code correctness
  let isValid = false;
  let errorMessage = "";

  if (lang === "javascript") {
    if (activeWorkspaceQuestion.testCase && activeWorkspaceQuestion.testCase.runner) {
      const testResult = activeWorkspaceQuestion.testCase.runner(userCode);
      if (testResult.success) {
        isValid = true;
      } else {
        errorMessage = `Your code did not pass test cases. Error: ${testResult.error}`;
      }
    } else {
      // Check if user changed the template code
      const template = activeWorkspaceQuestion.starterCode && activeWorkspaceQuestion.starterCode.javascript
        ? activeWorkspaceQuestion.starterCode.javascript.trim()
        : "";
      if (userCode.trim() === template) {
        errorMessage = "Please write code before submitting.";
      } else {
        try {
          new Function(userCode);
          isValid = true;
        } catch (e) {
          errorMessage = `Syntax Error: ${e.message}`;
        }
      }
    }
  } else {
    // Other languages static checks
    const template = activeWorkspaceQuestion.starterCode && activeWorkspaceQuestion.starterCode[lang]
      ? activeWorkspaceQuestion.starterCode[lang].trim()
      : "";
    if (userCode.trim() === template || userCode.trim().length < template.length + 10) {
      errorMessage = `Please write your ${lang.toUpperCase()} implementation code before submitting.`;
    } else {
      isValid = true;
    }
  }

  if (!isValid) {
    alert(errorMessage || "Please write the correct code before submitting.");
    // Show in terminal too
    terminalOutput.replaceChildren();

    const errorSpan = document.createElement("span");
    errorSpan.className = "error-msg";
    errorSpan.textContent =
      `✗ SUBMISSION BLOCKED: ${errorMessage || "Invalid code structure."}`;

    terminalOutput.appendChild(errorSpan);
    return;
  }

  // Save solved state
  if (!state.solvedQuestions.includes(activeWorkspaceQuestion.id)) {
    state.solvedQuestions.push(activeWorkspaceQuestion.id);
    saveState("solvedQuestions");
  }

  // Increment heatmap activity counters
  trackDailyActivity();

  // Close overlay
  codingWorkspace.classList.add("hidden");

  // Reload
  if (activeCompany) showCompanyQuestions(activeCompany);
  renderDashboard();
});

document.getElementById("btn-close-coding-workspace").addEventListener("click", () => {
  codingWorkspace.classList.add("hidden");
});

// --------------------------------------------------------------------------
// 8. Custom Add Question Modal
// --------------------------------------------------------------------------

const customModal = document.getElementById("custom-question-modal");
const customForm = document.getElementById("custom-question-form");

document.getElementById("btn-add-custom-question").addEventListener("click", () => {
  customModal.classList.remove("hidden");
});

document.getElementById("btn-close-custom-modal").addEventListener("click", closeModal);
document.getElementById("btn-cancel-custom-q").addEventListener("click", closeModal);

function closeModal() {
  customModal.classList.add("hidden");
  customForm.reset();
}

customForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("custom-q-name").value;
  const company = document.getElementById("custom-q-company").value;
  const difficulty = document.getElementById("custom-q-difficulty").value;
  const category = document.getElementById("custom-q-category").value;
  const desc = document.getElementById("custom-q-desc").value;
  const link = document.getElementById("custom-q-link").value;

  const newQ = {
    id: `custom-${Date.now()}`,
    name,
    company,
    difficulty,
    category,
    desc: desc || "Custom user question description.",
    link,
    starterCode: {
      javascript: "function solution() {\n    // Draft code here\n}"
    }
  };

  state.customQuestions.push(newQ);
  saveState("customQuestions");

  closeModal();
  renderCompanies();
});

// --------------------------------------------------------------------------
// 9. DSA Tracker Controller
// --------------------------------------------------------------------------

const dsaTopicsListContainer = document.getElementById("dsa-topics-list-container");
const dsaQuestionsContainer = document.getElementById("dsa-questions-list-container");

let activeDSATopicId = "dsa-arrays";

function renderDSATracker() {
  dsaTopicsListContainer.innerHTML = "";

  DSA_CURRICULUM.forEach(topic => {
    const solvedCount = topic.questions.filter(q => state.solvedQuestions.includes(q.id)).length;
    const isActive = topic.id === activeDSATopicId;
    const percent = topic.questions.length > 0 ? Math.round((solvedCount / topic.questions.length) * 100) : 0;

    const btn = document.createElement("button");
    btn.className = `dsa-topic-btn ${isActive ? "active" : ""}`;
    btn.innerHTML = `
      <div class="dsa-topic-btn-header">
        <span>${topic.title}</span>
        <span class="dsa-topic-btn-percent">${percent}%</span>
      </div>
      <div class="progress-bar-small">
        <div class="fill" style="width: ${percent}%"></div>
      </div>
    `;

    btn.addEventListener("click", () => {
      activeDSATopicId = topic.id;
      renderDSATracker();
    });

    dsaTopicsListContainer.appendChild(btn);
  });

  // Render detail panel for selected topic
  const topicData = DSA_CURRICULUM.find(t => t.id === activeDSATopicId);
  if (topicData) {
    document.getElementById("dsa-topic-title").textContent = topicData.title;
    document.getElementById("dsa-topic-description").textContent = topicData.desc;
    document.getElementById("dsa-cheat-content").textContent = topicData.cheatSheet;

    const solvedCount = topicData.questions.filter(q => state.solvedQuestions.includes(q.id)).length;
    document.getElementById("dsa-topic-progress-text").textContent = `${solvedCount} / ${topicData.questions.length} solved`;
    const percent = topicData.questions.length > 0 ? (solvedCount / topicData.questions.length) * 100 : 0;
    document.getElementById("dsa-topic-progress-fill").style.width = `${percent}%`;

    // Render Checklist
    dsaQuestionsContainer.innerHTML = "";
    topicData.questions.forEach(q => {
      const isChecked = state.solvedQuestions.includes(q.id);
      const item = document.createElement("div");
      item.className = `dsa-checklist-item ${isChecked ? "checked" : ""}`;
      item.innerHTML = `
        <input type="checkbox" class="dsa-checkbox" ${isChecked ? "checked" : ""}>
        <div class="dsa-q-info">
          <span class="dsa-q-title">${q.name}</span>
          <div class="dsa-q-meta">
            <span class="badge ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
            <a href="${q.link}" target="_blank">Leetcode Link ↗</a>
          </div>
        </div>
        <div class="dsa-q-btn-group">
          <button class="secondary-btn mini-btn note-link-btn">Notes</button>
        </div>
      `;

      item.querySelector(".dsa-checkbox").addEventListener("change", (e) => {
        toggleQuestionSolved(q.id, e.target.checked);
        renderDSATracker();
      });

      // Quick note linking
      item.querySelector(".note-link-btn").addEventListener("click", () => {
        document.getElementById("nav-notes").click();
        createOrOpenLinkedNote(q.name, "DSA");
      });

      dsaQuestionsContainer.appendChild(item);
    });
  }
}

// Helper to open notes linked to a specific topic
function createOrOpenLinkedNote(title, category) {
  const existing = state.notes.find(n => n.title === `${title} Study Note`);
  if (existing) {
    selectNoteById(existing.id);
  } else {
    const newNote = {
      id: `note-${Date.now()}`,
      title: `${title} Study Note`,
      folder: category,
      content: `# ${title} Notes\n\n- Key patterns:\n- Complexity: O(N) time / O(N) space`,
      updatedAt: new Date().toISOString()
    };
    state.notes.push(newNote);
    saveState("notes");
    renderNotesManager();
    selectNoteById(newNote.id);
  }
}

// --------------------------------------------------------------------------
// 10. Notes Manager Controller
// --------------------------------------------------------------------------

const notesRecordsContainer = document.getElementById("notes-records-container");
const noteEditorWrapper = document.getElementById("note-editor-wrapper");
const noteEditorEmptyState = document.getElementById("note-editor-empty-state");

const noteTitleField = document.getElementById("note-title-field");
const noteFolderSelect = document.getElementById("note-folder-select");
const noteMarkdownTextarea = document.getElementById("note-markdown-textarea");
const notePreviewHtml = document.getElementById("note-preview-html");

let activeNoteId = null;
let activeFolder = "all";

function renderNotesManager() {
  notesRecordsContainer.innerHTML = "";

  const filteredNotes = state.notes.filter(note => {
    return activeFolder === "all" || note.folder === activeFolder;
  });

  if (filteredNotes.length === 0) {
    notesRecordsContainer.innerHTML = `<span class="subtext" style="text-align: center; padding: 1.5rem 0;">No notes found.</span>`;
  } else {
    filteredNotes.forEach(note => {
      const activeClass = note.id === activeNoteId ? "active" : "";
      const div = document.createElement("div");
      div.className = `note-record-item ${activeClass}`;
      div.innerHTML = `
        <strong>${note.title || "Untitled Note"}</strong>
        <span>Updated: ${new Date(note.updatedAt).toLocaleDateString()}</span>
      `;
      div.addEventListener("click", () => selectNoteById(note.id));
      notesRecordsContainer.appendChild(div);
    });
  }

  // Update active editor state
  if (activeNoteId) {
    const currentNote = state.notes.find(n => n.id === activeNoteId);
    if (currentNote) {
      noteEditorWrapper.classList.remove("hidden");
      noteEditorEmptyState.classList.add("hidden");

      // Stop listeners loop temporarily
      noteTitleField.value = currentNote.title;
      noteFolderSelect.value = currentNote.folder;
      noteMarkdownTextarea.value = currentNote.content;
      notePreviewHtml.innerHTML = compileMarkdown(currentNote.content);
    } else {
      activeNoteId = null;
      renderNotesManager();
    }
  } else {
    noteEditorWrapper.classList.add("hidden");
    noteEditorEmptyState.classList.remove("hidden");
  }
}

function selectNoteById(id) {
  activeNoteId = id;
  renderNotesManager();
}

// Folder buttons selector
const folderBtns = document.querySelectorAll(".folder-btn");
folderBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    folderBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFolder = btn.getAttribute("data-folder");
    renderNotesManager();
  });
});

// Auto-rendering live preview on input
noteMarkdownTextarea.addEventListener("input", () => {
  notePreviewHtml.innerHTML = compileMarkdown(noteMarkdownTextarea.value);
});

// Save Changes
document.getElementById("btn-save-note").addEventListener("click", () => {
  if (!activeNoteId) return;
  const currentNote = state.notes.find(n => n.id === activeNoteId);
  if (currentNote) {
    currentNote.title = noteTitleField.value || "Untitled Note";
    currentNote.folder = noteFolderSelect.value;
    currentNote.content = noteMarkdownTextarea.value;
    currentNote.updatedAt = new Date().toISOString();

    saveState("notes");
    trackDailyActivity();
    renderNotesManager();

    // Toast indicator style
    const btn = document.getElementById("btn-save-note");
    btn.textContent = "✓ Saved!";
    setTimeout(() => { btn.textContent = "Save Changes"; }, 1500);
  }
});

// New Note creation
function createNewNote() {
  const newNote = {
    id: `note-${Date.now()}`,
    title: "New Interview Note",
    folder: activeFolder === "all" ? "DSA" : activeFolder,
    content: "# New Note\n\nStart typing note details here using markdown...",
    updatedAt: new Date().toISOString()
  };

  state.notes.push(newNote);
  saveState("notes");
  activeNoteId = newNote.id;
  renderNotesManager();
}

document.getElementById("btn-new-note").addEventListener("click", createNewNote);
document.getElementById("btn-empty-new-note").addEventListener("click", createNewNote);

// Delete Note
document.getElementById("btn-delete-note").addEventListener("click", () => {
  if (!activeNoteId) return;
  if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
    state.notes = state.notes.filter(n => n.id !== activeNoteId);
    saveState("notes");
    activeNoteId = null;
    renderNotesManager();
  }
});

// Search input note filter
document.getElementById("note-search-input").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const notesListItems = document.querySelectorAll(".note-record-item");

  state.notes.forEach((note, idx) => {
    const el = notesListItems[idx];
    if (el) {
      const match = note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query);
      if (match) {
        el.classList.remove("hidden");
      } else {
        el.classList.add("hidden");
      }
    }
  });
});

// Download note as Markdown file
document.getElementById("btn-download-note").addEventListener("click", () => {
  if (!activeNoteId) return;
  const currentNote = state.notes.find(n => n.id === activeNoteId);
  if (currentNote) {
    const filename = `${currentNote.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    const blob = new Blob([currentNote.content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
});

// --------------------------------------------------------------------------
// 11. Revision Flashcards Controller
// --------------------------------------------------------------------------

const deckSidebarEl = document.getElementById("flash-decks-list");
const cardInnerEl = document.getElementById("flash-card-inner");
const ratingBarEl = document.getElementById("card-rating-bar");
const actionBarEl = document.getElementById("card-normal-actions");

let activeDeckId = "dsa-patterns";
let activeCardIndex = 0;

function renderFlashcardDecks() {
  deckSidebarEl.innerHTML = "";

  Object.keys(FLASHCARDS_DECKS).forEach(key => {
    const deck = FLASHCARDS_DECKS[key];
    const totalCards = deck.cards.length;
    const isActive = key === activeDeckId;

    const btn = document.createElement("div");
    btn.className = `deck-select-btn ${isActive ? "active" : ""}`;
    btn.innerHTML = `
      <strong>${deck.name}</strong>
      <span class="deck-card-count">${totalCards} cards</span>
    `;

    btn.addEventListener("click", () => {
      activeDeckId = key;
      activeCardIndex = 0;
      cardInnerEl.classList.remove("flipped");
      ratingBarEl.classList.add("hidden");
      actionBarEl.classList.remove("hidden");
      renderFlashcardDecks();
    });

    deckSidebarEl.appendChild(btn);
  });

  renderActiveFlashcard();
}

function renderActiveFlashcard() {
  const deck = FLASHCARDS_DECKS[activeDeckId];
  if (!deck || deck.cards.length === 0) return;

  const card = deck.cards[activeCardIndex];

  document.getElementById("arena-deck-name").textContent = deck.name;
  document.getElementById("arena-deck-counter").textContent = `Card ${activeCardIndex + 1} of ${deck.cards.length}`;

  // Fill text
  document.getElementById("card-front-category").textContent = card.cat;
  document.getElementById("card-front-question").textContent = card.q;
  document.getElementById("card-back-category").textContent = `${card.cat} - Answer`;
  document.getElementById("card-back-answer").innerHTML = card.a;
}

// Flip Card animations
cardInnerEl.addEventListener("click", flipCard);
document.getElementById("btn-flip-card").addEventListener("click", flipCard);

function flipCard() {
  cardInnerEl.classList.toggle("flipped");
  const isFlipped = cardInnerEl.classList.contains("flipped");

  if (isFlipped) {
    ratingBarEl.classList.remove("hidden");
    actionBarEl.classList.add("hidden");
  } else {
    ratingBarEl.classList.add("hidden");
    actionBarEl.classList.remove("hidden");
  }
}

// SRS buttons clicks
const ratingBtns = document.querySelectorAll(".rating-btn");
ratingBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const srsLevel = btn.getAttribute("data-srs");
    const deck = FLASHCARDS_DECKS[activeDeckId];
    const card = deck.cards[activeCardIndex];

    // Store card SRS status
    state.flashcardSRS[card.id] = srsLevel;
    saveState("flashcardSRS");

    trackDailyActivity();

    // Reset card class flip and load next
    cardInnerEl.classList.remove("flipped");
    ratingBarEl.classList.add("hidden");
    actionBarEl.classList.remove("hidden");

    setTimeout(() => {
      activeCardIndex = (activeCardIndex + 1) % deck.cards.length;
      renderActiveFlashcard();
    }, 300);
  });
});

// Skip Card
document.getElementById("btn-next-card").addEventListener("click", () => {
  const deck = FLASHCARDS_DECKS[activeDeckId];
  activeCardIndex = (activeCardIndex + 1) % deck.cards.length;
  renderActiveFlashcard();
});

// --------------------------------------------------------------------------
// 12. Mock Interview Voice & Engine Controller
// --------------------------------------------------------------------------

const mockSetupEl = document.getElementById("mock-setup-pane");
const mockRoomEl = document.getElementById("mock-room-pane");
const mockReportEl = document.getElementById("mock-report-pane");

let mockTrack = "";
let mockCompanyStyle = "";
let mockQuestionsList = [];
let activeMockQuestionIndex = 0;
let mockTimerInterval = null;
let mockSecondsElapsed = 0;
let mockAnswersSaved = [];

// Speech recognition standard hook
let recognition = null;
let isRecording = false;

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRec();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript) {
      const answerArea = document.getElementById("mock-user-answer");
      answerArea.value += (answerArea.value ? ' ' : '') + finalTranscript;
    }
  };

  recognition.onerror = function (event) {
    console.error("Speech Recognition Error", event.error);
    stopSpeechRecognition();
  };

  recognition.onend = function () {
    stopSpeechRecognition();
  };
} else {
  // Speech dictation unsupported
  const micLabel = document.getElementById("mic-status-label");
  if (micLabel) {
    micLabel.textContent = "Voice speech not supported by this browser. Typing is enabled.";
    document.getElementById("mic-status-dot").className = "indicator red";
  }
}

function startSpeechRecognition() {
  if (!recognition) return;
  try {
    recognition.start();
    isRecording = true;
    document.getElementById("speech-live-status").textContent = "Listening...";
    document.getElementById("speech-live-status").className = "speech-dictation-live-tag recording";
    document.getElementById("btn-speech-text").textContent = "Stop Dictation";
    document.getElementById("avatar-waveform").className = "waveform active";
  } catch (e) {
    console.error(e);
  }
}

function stopSpeechRecognition() {
  if (!recognition) return;
  try {
    recognition.stop();
    isRecording = false;
    document.getElementById("speech-live-status").textContent = "Microphone Off";
    document.getElementById("speech-live-status").className = "speech-dictation-live-tag";
    document.getElementById("btn-speech-text").textContent = "Start Speech Dictation";
    document.getElementById("avatar-waveform").className = "waveform";
  } catch (e) {
    // Ignore duplicate stop calls
  }
}

// Speech recognition toggle button trigger
document.getElementById("btn-speech-trigger").addEventListener("click", () => {
  if (!isRecording) {
    startSpeechRecognition();
  } else {
    stopSpeechRecognition();
  }
});

// Setup styles active selection toggles
const radioCards = document.querySelectorAll(".radio-card");
radioCards.forEach(card => {
  card.addEventListener("click", () => {
    radioCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    card.querySelector("input").checked = true;
  });
});

// Launch Mock session
document.getElementById("btn-start-mock").addEventListener("click", () => {
  mockTrack = document.querySelector('input[name="mock-style"]:checked').value;
  mockCompanyStyle = document.getElementById("mock-company").value;
  const durationType = document.getElementById("mock-duration").value;

  const totalQuestions = durationType === "5" ? 1 : (durationType === "15" ? 2 : 3);

  // Select random subset of questions
  const pool = MOCK_QUESTIONS[mockTrack];
  mockQuestionsList = [...pool].sort(() => 0.5 - Math.random()).slice(0, totalQuestions);

  activeMockQuestionIndex = 0;
  mockSecondsElapsed = 0;
  mockAnswersSaved = [];

  // Transition screens
  mockSetupEl.classList.add("hidden");
  mockRoomEl.classList.remove("hidden");
  mockReportEl.classList.add("hidden");

  // Display initial meta info
  document.getElementById("mock-session-tag").textContent = `${mockTrack.toUpperCase()} Track - ${mockCompanyStyle} Style`;
  document.getElementById("btn-next-mock-q").style.display = "none";
  document.getElementById("btn-submit-answer").style.display = "block";
  document.getElementById("mock-user-answer").value = "";

  // Dynamic instruction hints
  const hintEl = document.getElementById("mock-answer-hint");
  if (mockTrack === "behavioral") {
    hintEl.innerHTML = "<strong>💡 STAR Framework active:</strong> Describe the Situation (15%), Tasks details (15%), Actions you implemented (50%), and Metrics-based Results (20%).";
  } else if (mockTrack === "dsa") {
    hintEl.innerHTML = "<strong>💡 Technical Algorithmic depth tip:</strong> State initial brute-force design complexity, propose hash map or pointers optimizations, and detail O(...) spatial bounds.";
  } else {
    hintEl.innerHTML = "<strong>💡 Scalable Design checklist:</strong> Address load balancers, caching replication, partition databases sharding, and message queues asynchronous flow.";
  }

  // Timer run loop
  clearInterval(mockTimerInterval);
  mockTimerInterval = setInterval(() => {
    mockSecondsElapsed++;
    const mins = Math.floor(mockSecondsElapsed / 60).toString().padStart(2, "0");
    const secs = (mockSecondsElapsed % 60).toString().padStart(2, "0");
    document.getElementById("mock-session-timer").textContent = `${mins}:${secs}`;
  }, 1000);

  loadMockQuestion();
});

function loadMockQuestion() {
  const currentQ = mockQuestionsList[activeMockQuestionIndex];
  document.getElementById("interviewer-speech").innerHTML = `<strong>Question ${activeMockQuestionIndex + 1}:</strong><br>${currentQ}`;
  document.getElementById("mock-user-answer").value = "";
}

// Submit answer
document.getElementById("btn-submit-answer").addEventListener("click", () => {
  const answerVal = document.getElementById("mock-user-answer").value.trim();
  if (answerVal.length < 15) {
    alert("Please write a complete answer details before submitting (Minimum 15 characters).");
    return;
  }

  // Save details
  mockAnswersSaved.push({
    question: mockQuestionsList[activeMockQuestionIndex],
    answer: answerVal
  });

  stopSpeechRecognition();

  // Next question routing
  if (activeMockQuestionIndex < mockQuestionsList.length - 1) {
    document.getElementById("btn-submit-answer").style.display = "none";
    const nextBtn = document.getElementById("btn-next-mock-q");
    nextBtn.style.display = "block";

    document.getElementById("interviewer-speech").innerHTML = `Excellent. I've logged your response. Click "Next Question" to proceed when you are ready.`;
  } else {
    // End session evaluate
    clearInterval(mockTimerInterval);
    triggerMockEvaluation();
  }
});

document.getElementById("btn-next-mock-q").addEventListener("click", () => {
  activeMockQuestionIndex++;
  document.getElementById("btn-next-mock-q").style.display = "none";
  document.getElementById("btn-submit-answer").style.display = "block";
  loadMockQuestion();
});

// Evaluate responses client-side
function triggerMockEvaluation() {
  mockRoomEl.classList.add("hidden");
  mockReportEl.classList.remove("hidden");

  // Set report titles
  document.getElementById("report-meta-details").textContent = `Track: ${mockTrack.toUpperCase()} | Company Style: ${mockCompanyStyle} | Time: ${Math.round(mockSecondsElapsed / 60)} minutes`;

  let totalStruct = 0;
  let totalVocab = 0;
  let totalComplete = 0;

  const recommendations = [];

  // Evaluate each answer using keyword metrics
  mockAnswersSaved.forEach((item, idx) => {
    const len = item.answer.length;
    const lower = item.answer.toLowerCase();

    let structScore = 50;
    let vocabScore = 50;
    let completeScore = Math.min(100, Math.floor(len / 8)); // longer answers count as complete up to limits

    // Check Track-Specific Keywords
    if (mockTrack === "behavioral") {
      // STAR
      const sit = lower.includes("situation") || lower.includes("context") || lower.includes("background");
      const task = lower.includes("task") || lower.includes("goal") || lower.includes("challenged");
      const act = lower.includes("action") || lower.includes("implemented") || lower.includes("designed") || lower.includes("led");
      const res = lower.includes("result") || lower.includes("metric") || lower.includes("%") || lower.includes("improved");

      let starHits = 0;
      if (sit) starHits++;
      if (task) starHits++;
      if (act) starHits++;
      if (res) starHits++;

      structScore = 60 + (starHits * 10);

      const leadershipWords = ["ownership", "bias for action", "customer", "dive deep", "deliver", "frugality"];
      let leaderHits = leadershipWords.filter(w => lower.includes(w)).length;
      vocabScore = 70 + (leaderHits * 8);
    } else if (mockTrack === "dsa") {
      const O1 = lower.includes("o(1)") || lower.includes("constant time");
      const ON = lower.includes("o(n)") || lower.includes("linear time");
      const OlogN = lower.includes("o(log") || lower.includes("logarithmic");

      const optimize = lower.includes("hash map") || lower.includes("pointer") || lower.includes("queue") || lower.includes("stack") || lower.includes("space complexity");

      structScore = (O1 || ON || OlogN) ? 90 : 60;
      vocabScore = optimize ? 95 : 65;
    } else {
      // System Design
      const cache = lower.includes("cache") || lower.includes("redis") || lower.includes("cdn");
      const balance = lower.includes("balancer") || lower.includes("scale") || lower.includes("routing");
      const db = lower.includes("sharding") || lower.includes("index") || lower.includes("replica") || lower.includes("nosql");

      let designHits = 0;
      if (cache) designHits++;
      if (balance) designHits++;
      if (db) designHits++;

      structScore = 60 + (designHits * 12);
      vocabScore = designHits >= 2 ? 90 : 70;
    }

    totalStruct += Math.min(100, structScore);
    totalVocab += Math.min(100, vocabScore);
    totalComplete += Math.min(100, completeScore);
  });

  const count = mockAnswersSaved.length;
  const structFinal = Math.round(totalStruct / count);
  const vocabFinal = Math.round(totalVocab / count);
  const completeFinal = Math.round(totalComplete / count);
  const numericGrade = Math.round((structFinal + vocabFinal + completeFinal) / 3);

  // Grade letters
  let letter = "F";
  if (numericGrade >= 95) letter = "A+";
  else if (numericGrade >= 90) letter = "A";
  else if (numericGrade >= 85) letter = "A-";
  else if (numericGrade >= 80) letter = "B+";
  else if (numericGrade >= 70) letter = "B";
  else if (numericGrade >= 60) letter = "C";

  // Fill visual meters
  document.getElementById("report-overall-grade").textContent = letter;
  document.getElementById("report-overall-numeric").textContent = `${numericGrade} / 100`;

  document.getElementById("report-score-struct").textContent = `${structFinal}%`;
  document.getElementById("report-fill-struct").style.width = `${structFinal}%`;
  document.getElementById("report-score-vocab").textContent = `${vocabFinal}%`;
  document.getElementById("report-fill-vocab").style.width = `${vocabFinal}%`;
  document.getElementById("report-score-complete").textContent = `${completeFinal}%`;
  document.getElementById("report-fill-complete").style.width = `${completeFinal}%`;

  // Render evaluations
  const notesContainer = document.getElementById("report-evaluator-notes");
  notesContainer.innerHTML = "";

  const bulletUl = document.createElement("ul");

  if (structFinal < 80) {
    bulletUl.innerHTML += `<li>⚠️ **Response Structure**: Your answers could benefit from a clearer organizational framework. Try referencing core components explicitly (e.g. STAR segments, system building blocks).</li>`;
  } else {
    bulletUl.innerHTML += `<li>✓ **Strong Organization**: Your content flow shows logical sequence and structured segments.</li>`;
  }

  if (vocabFinal < 80) {
    bulletUl.innerHTML += `<li>⚠️ **Technical Depth**: Introduce specific industry terms or complex structures. Use complexity notations (DSA) or specific technologies (System Design).</li>`;
  } else {
    bulletUl.innerHTML += `<li>✓ **Excellent Terminology**: You made reference to core engineering optimization parameters correctly.</li>`;
  }

  if (completeFinal < 75) {
    bulletUl.innerHTML += `<li>⚠️ **Exhaustiveness**: Your answers were relatively brief. Elaborate on details, trade-offs, alternative approaches, and testing methods in real interviews.</li>`;
  }

  notesContainer.appendChild(bulletUl);

  // Save report into state history
  const sessionRecord = {
    id: `mock-session-${Date.now()}`,
    track: mockTrack,
    company: mockCompanyStyle,
    grade: letter,
    score: numericGrade,
    date: new Date().toLocaleDateString()
  };

  state.mockHistory.push(sessionRecord);
  saveState("mockHistory");

  // Track activity
  trackDailyActivity();
  renderDashboard();
}

document.getElementById("btn-return-mock-setup").addEventListener("click", () => {
  mockSetupEl.classList.remove("hidden");
  mockRoomEl.classList.add("hidden");
  mockReportEl.classList.add("hidden");
});

document.getElementById("btn-quit-mock").addEventListener("click", () => {
  if (confirm("Are you sure you want to quit the active session? All progress on this session will be lost.")) {
    clearInterval(mockTimerInterval);
    stopSpeechRecognition();

    mockSetupEl.classList.remove("hidden");
    mockRoomEl.classList.add("hidden");
    mockReportEl.classList.add("hidden");
  }
});

// --------------------------------------------------------------------------
// 13. Initialization & Startup Tasks
// --------------------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  // Trigger initial Dashboard render
  onTabLoad("dashboard");
});
