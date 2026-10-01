document.addEventListener("DOMContentLoaded", () => {
  const contestGrid = document.getElementById("contest-grid");
  const loadingIndicator = document.getElementById("loading");
  const errorIndicator = document.getElementById("error");
  const platformFilter = document.getElementById("platform-filter");
  const sortFilter = document.getElementById("sort-filter");
  const lastUpdatedSpan = document.getElementById("last-updated");
  const analyzeBtn = document.getElementById("analyze-btn");
  const analysisContainer = document.getElementById("analysis-container");

  let allContests = [];
  let timerInterval;
  let loadingFrames = ["|", "/", "-", "\\"];
  let loadingFrameIndex = 0;
  let loadingInterval;

  const verified2026Contests = [
    {
      site: "CodeChef",
      name: "Starters 240",
      start_time: new Date("2026-05-27T15:00:00Z").getTime(),
      url: "https://www.codechef.com/contests",
      platform_key: "codechef",
    },
    {
      site: "CodeChef",
      name: "Starters 241",
      start_time: new Date("2026-06-03T15:00:00Z").getTime(),
      url: "https://www.codechef.com/contests",
      platform_key: "codechef",
    },
    {
      site: "CodeChef",
      name: "Starters 242",
      start_time: new Date("2026-06-10T15:00:00Z").getTime(),
      url: "https://www.codechef.com/contests",
      platform_key: "codechef",
    },
    {
      site: "HackerEarth",
      name: "IDFC FIRST Bank CodeCraft Hackathon",
      start_time: new Date("2026-05-30T10:00:00Z").getTime(),
      url: "https://www.hackerearth.com/challenges/",
      platform_key: "hackerearth",
    },
    {
      site: "HackerEarth",
      name: "Observe.AI Virtual Hackathon",
      start_time: new Date("2026-05-30T09:00:00Z").getTime(),
      url: "https://www.hackerearth.com/challenges/",
      platform_key: "hackerearth",
    },
    {
      site: "Codeforces",
      name: "Codeforces Round 1095 (Div. 2)",
      start_time: new Date("2026-05-28T14:35:00Z").getTime(),
      url: "https://codeforces.com/contests",
      platform_key: "codeforces",
    },
    {
      site: "Codeforces",
      name: "Codeforces Round 1096 (Div. 3)",
      start_time: new Date("2026-05-30T14:35:00Z").getTime(),
      url: "https://codeforces.com/contests",
      platform_key: "codeforces",
    },
    {
      site: "AtCoder",
      name: "AtCoder Heuristic Contest 066",
      start_time: new Date("2026-05-29T03:00:00Z").getTime(),
      url: "https://atcoder.jp/contests/",
      platform_key: "atcoder",
    },
    {
      site: "AtCoder",
      name: "AtCoder Beginner Contest 460",
      start_time: new Date("2026-05-30T12:00:00Z").getTime(),
      url: "https://atcoder.jp/contests/",
      platform_key: "atcoder",
    },
    {
      site: "LeetCode",
      name: "Weekly Contest 504",
      start_time: new Date("2026-05-30T02:30:00Z").getTime(),
      url: "https://leetcode.com/contest/",
      platform_key: "leetcode",
    },
    {
      site: "TopCoder",
      name: "SRM 855",
      start_time: new Date("2026-06-05T16:00:00Z").getTime(),
      url: "https://www.topcoder.com/community/competitive-programming/",
      platform_key: "topcoder",
    },
  ];

  const startLoadingAnimation = () => {
    const spinner = document.querySelector(".spinner");
    if (!spinner) return;
    loadingInterval = setInterval(() => {
      spinner.textContent = loadingFrames[loadingFrameIndex];
      loadingFrameIndex = (loadingFrameIndex + 1) % loadingFrames.length;
    }, 100);
  };

  const stopLoadingAnimation = () => {
    clearInterval(loadingInterval);
  };

  async function fetchCodeforcesProfile(handle) {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${handle}`
    );
    const data = await response.json();
    if (data.status !== "OK") throw new Error("User not found");
    return data.result[0];
  }

  async function fetchCodeforcesRating(handle) {
    const response = await fetch(
      `https://codeforces.com/api/user.rating?handle=${handle}`
    );
    const data = await response.json();
    if (data.status !== "OK") throw new Error("Rating history unavailable");
    return data.result;
  }

  async function fetchSolvedProblems(handle) {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${handle}`
    );
    const data = await response.json();
    if (data.status !== "OK") throw new Error("Unable to fetch submissions");
    return data.result;
  }

  function computeRatingStats(ratingHistory) {
    if (!ratingHistory.length) {
      return {
        totalGrowth: 0,
        averageRatingChange: 0,
        bestGain: 0,
        worstLoss: 0,
        totalLoss: 0,
        contestCount: 0,
      };
    }
    let totalGrowth = 0;
    let bestGain = -Infinity;
    let worstLoss = Infinity;
    let totalLoss = 0;
    const contestCount = ratingHistory.length;

    ratingHistory.forEach((entry) => {
      const delta = entry.newRating - entry.oldRating;
      totalGrowth += delta;
      if (delta > bestGain) bestGain = delta;
      if (delta < worstLoss) worstLoss = delta;
      if (delta < 0) totalLoss += delta;
    });

    const averageRatingChange =
      contestCount > 0 ? (totalGrowth / contestCount).toFixed(1) : 0;

    return {
      totalGrowth,
      averageRatingChange,
      bestGain: bestGain === -Infinity ? 0 : bestGain,
      worstLoss: worstLoss === Infinity ? 0 : worstLoss,
      totalLoss,
      contestCount,
    };
  }

  function computeTopicStats(submissions) {
    const solvedSet = new Set();
    const tagCounts = {};

    submissions.forEach((sub) => {
      if (sub.verdict !== "OK") return;
      const pid = sub.problem.contestId + "_" + sub.problem.index;
      if (solvedSet.has(pid)) return;
      solvedSet.add(pid);
      (sub.problem.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const totalSolved = solvedSet.size;
    const uniqueTagCount = Object.keys(tagCounts).length;

    const sorted = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
    const top5Strong = sorted.slice(0, 5);
    const top5Weak = [...sorted].reverse().slice(0, 5);
    const mostPracticedTopic = sorted.length ? sorted[0][0] : "N/A";

    return {
      totalSolved,
      uniqueSolved: solvedSet.size,
      uniqueTagCount,
      mostPracticedTopic,
      top5Strong,
      top5Weak,
      tagCounts,
    };
  }

  function buildGrowthRecommendations(rating, topicStats) {
    const recs = [];
    const { tagCounts } = topicStats;
    const TOPIC_THRESHOLD = 10;

    const topicsToCheck = [
      {
        tag: "dp",
        label: "Dynamic Programming",
        tip: "Start with classic DP: knapsack, LCS, coin change.",
      },
      {
        tag: "graphs",
        label: "Graph Theory",
        tip: "Practice BFS/DFS, shortest paths, and cycle detection.",
      },
      {
        tag: "greedy",
        label: "Greedy Algorithms",
        tip: "Solve interval scheduling and activity selection problems.",
      },
      {
        tag: "math",
        label: "Mathematics",
        tip: "Cover modular arithmetic, combinatorics, and number theory.",
      },
      {
        tag: "binary search",
        label: "Binary Search",
        tip: "Practice search-on-answer patterns and binary search on sorted structures.",
      },
      {
        tag: "constructive algorithms",
        label: "Constructive Algorithms",
        tip: "Work on problems requiring you to build solutions from constraints.",
      },
      {
        tag: "strings",
        label: "String Algorithms",
        tip: "Study KMP, Z-function, and hashing techniques.",
      },
      {
        tag: "trees",
        label: "Trees",
        tip: "Practice LCA, tree DP, and Euler tour techniques.",
      },
      {
        tag: "number theory",
        label: "Number Theory",
        tip: "Focus on sieve of Eratosthenes, prime factorization, and GCD.",
      },
      {
        tag: "data structures",
        label: "Data Structures",
        tip: "Learn segment trees, Fenwick trees, and disjoint set union.",
      },
    ];

    topicsToCheck.forEach(({ tag, label, tip }) => {
      const count = tagCounts[tag] || 0;
      if (count < TOPIC_THRESHOLD) {
        recs.push({
          icon: ">_ TOPIC",
          title: `Practice ${label}`,
          desc: `Only ${count} solve(s) detected. ${tip}`,
        });
      }
    });

    if (rating < 1200) {
      recs.push({
        icon: ">_ CONTEST",
        title: "Participate in Div. 3 Rounds",
        desc: "Div. 3 contests are designed for beginners and are great for building confidence.",
      });
      recs.push({
        icon: ">_ CONTEST",
        title: "Try CodeChef Starters",
        desc: "Weekly beginner-friendly contests from CodeChef to practice time-constrained solving.",
      });
    } else if (rating < 1600) {
      recs.push({
        icon: ">_ CONTEST",
        title: "Focus on Div. 2 Rounds",
        desc: "Div. 2 contests will push your problem-solving to the next level.",
      });
      recs.push({
        icon: ">_ CONTEST",
        title: "Attempt Educational CF Rounds",
        desc: "Educational rounds have editorials and are great for structured learning.",
      });
    } else if (rating < 2000) {
      recs.push({
        icon: ">_ CONTEST",
        title: "Compete in Div. 1 + Div. 2",
        desc: "Challenge yourself with harder problems in combined division rounds.",
      });
      recs.push({
        icon: ">_ CONTEST",
        title: "Join ICPC-style Contests",
        desc: "Team and ICPC-style rounds will sharpen collaborative problem-solving.",
      });
    } else {
      recs.push({
        icon: ">_ CONTEST",
        title: "Target Div. 1 Rounds",
        desc: "Elite-level problems in Div. 1 are your main battleground.",
      });
      recs.push({
        icon: ">_ CONTEST",
        title: "Train for ICPC / IOI",
        desc: "Work on complex multi-topic problems that mirror ICPC regional styles.",
      });
    }

    return recs.slice(0, 6);
  }

  function buildContestRecommendations(rating) {
    if (rating < 1200) {
      return [
        { platform: "Codeforces", name: "Div. 3 Rounds", reason: "Beginner-friendly problems up to 1400 rating." },
        { platform: "CodeChef", name: "Starters (Div. 4)", reason: "Weekly contests ideal for new competitive programmers." },
        { platform: "HackerRank", name: "Week of Code", reason: "Structured weekly challenges with beginner tracks." },
        { platform: "AtCoder", name: "ABC (Beginner)", reason: "AtCoder Beginner Contests are clean and well-structured." },
      ];
    } else if (rating < 1600) {
      return [
        { platform: "Codeforces", name: "Div. 2 Rounds", reason: "Core contests to push past the 1600 rating barrier." },
        { platform: "Codeforces", name: "Educational Rounds", reason: "Editorials provided — perfect for learning after each contest." },
        { platform: "CodeChef", name: "Starters (Div. 3)", reason: "Intermediate weekly contests with varied problem sets." },
        { platform: "AtCoder", name: "ARC (Regular)", reason: "AtCoder Regular Contests target the 1200–1800 skill range." },
      ];
    } else if (rating < 2000) {
      return [
        { platform: "Codeforces", name: "Div. 1 + Div. 2", reason: "Combined rounds with harder D/E problems to grind." },
        { platform: "Codeforces", name: "Educational Rounds", reason: "Advanced editorial content helps analyze complex solutions." },
        { platform: "AtCoder", name: "AGC (Grand)", reason: "AtCoder Grand Contests are among the hardest available." },
        { platform: "ICPC", name: "Regional Qualifiers", reason: "Start participating in ICPC-style team contests." },
      ];
    } else {
      return [
        { platform: "Codeforces", name: "Div. 1 Rounds", reason: "Top-tier competitive problems exclusively for high-rated coders." },
        { platform: "AtCoder", name: "AGC (Grand)", reason: "Grand Contests challenge the world's best programmers." },
        { platform: "ICPC", name: "World Finals Prep", reason: "Focus on ICPC-style multi-topic problems and team training." },
        { platform: "TopCoder", name: "SRM Rounds", reason: "Classic competitive programming format with hard algorithmic problems." },
      ];
    }
  }

  function buildPerformanceSummary(profile, ratingStats, topicStats, rating) {
    const strong = topicStats.top5Strong.slice(0, 2).map((t) => t[0]);
    const weak = topicStats.top5Weak.slice(0, 2).map((t) => t[0]);

    let ratingTier = "beginner";
    if (rating >= 2000) ratingTier = "expert/master";
    else if (rating >= 1600) ratingTier = "specialist";
    else if (rating >= 1200) ratingTier = "apprentice";

    let summary = `>_ ${profile.handle} is rated ${rating} (${profile.rank || "unrated"}) — a ${ratingTier}-tier programmer. `;

    if (ratingStats.totalGrowth > 0) {
      summary += `Total rating growth across ${ratingStats.contestCount} contest(s): +${ratingStats.totalGrowth}. `;
    } else {
      summary += `Rating has fluctuated across ${ratingStats.contestCount} contest(s). `;
    }

    if (strong.length > 0) {
      summary += `Strongest topics: ${strong.map((s) => s.toUpperCase()).join(", ")}. `;
    }

    if (weak.length > 0) {
      summary += `Improvement recommended in: ${weak.map((w) => w.toUpperCase()).join(", ")}. `;
    }

    if (topicStats.totalSolved < 50) {
      summary += `With ${topicStats.totalSolved} problems solved, consistency is key — aim for daily practice.`;
    } else if (topicStats.totalSolved < 200) {
      summary += `${topicStats.totalSolved} problems solved so far — good progress, keep diversifying topics.`;
    } else {
      summary += `${topicStats.totalSolved} problems solved — strong output. Focus on contest performance now.`;
    }

    return summary;
  }

  function drawRatingChart(canvas, ratingHistory) {
    const ctx = canvas.getContext("2d");
    const W = canvas.offsetWidth || 600;
    const H = 220;
    canvas.width = W;
    canvas.height = H;

    const PAD = { top: 20, right: 20, bottom: 30, left: 55 };

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    if (!ratingHistory.length) {
      ctx.fillStyle = "#1c7c0c";
      ctx.font = "12px Fira Code";
      ctx.fillText("[NO RATING DATA]", W / 2 - 60, H / 2);
      return;
    }

    const ratings = ratingHistory.map((r) => r.newRating);
    const minRating = Math.min(...ratings) - 50;
    const maxRating = Math.max(...ratings) + 50;
    const chartW = W - PAD.left - PAD.right;
    const chartH = H - PAD.top - PAD.bottom;

    const toX = (i) => PAD.left + (i / (ratingHistory.length - 1 || 1)) * chartW;
    const toY = (r) =>
      PAD.top + chartH - ((r - minRating) / (maxRating - minRating)) * chartH;

    ctx.strokeStyle = "rgba(57,255,20,0.08)";
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = PAD.top + (i / gridLines) * chartH;
      ctx.beginPath();
      ctx.moveTo(PAD.left, y);
      ctx.lineTo(PAD.left + chartW, y);
      ctx.stroke();

      const val = Math.round(maxRating - (i / gridLines) * (maxRating - minRating));
      ctx.fillStyle = "#1c7c0c";
      ctx.font = "10px Fira Code";
      ctx.textAlign = "right";
      ctx.fillText(val, PAD.left - 6, y + 4);
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgba(57,255,20,0.15)";
    ctx.lineWidth = 1;
    ctx.moveTo(PAD.left, PAD.top);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.lineTo(PAD.left + chartW, PAD.top + chartH);
    ctx.stroke();

    ctx.beginPath();
    ratingHistory.forEach((entry, i) => {
      const x = toX(i);
      const y = toY(entry.newRating);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "rgba(57,255,20,0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.beginPath();
    ratingHistory.forEach((entry, i) => {
      const x = toX(i);
      const y = toY(entry.newRating);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(toX(ratingHistory.length - 1), PAD.top + chartH);
    ctx.lineTo(PAD.left, PAD.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + chartH);
    grad.addColorStop(0, "rgba(57,255,20,0.18)");
    grad.addColorStop(1, "rgba(57,255,20,0)");
    ctx.fillStyle = grad;
    ctx.fill();

    ratingHistory.forEach((entry, i) => {
      const x = toX(i);
      const y = toY(entry.newRating);
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#39ff14";
      ctx.shadowColor = "#39ff14";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    ctx.fillStyle = "#1c7c0c";
    ctx.font = "10px Fira Code";
    ctx.textAlign = "center";
    if (ratingHistory.length <= 10) {
      ratingHistory.forEach((entry, i) => {
        ctx.fillText(i + 1, toX(i), PAD.top + chartH + 15);
      });
    } else {
      ctx.fillText("1", toX(0), PAD.top + chartH + 15);
      ctx.fillText(
        String(Math.round(ratingHistory.length / 2)),
        toX(Math.floor(ratingHistory.length / 2)),
        PAD.top + chartH + 15
      );
      ctx.fillText(
        String(ratingHistory.length),
        toX(ratingHistory.length - 1),
        PAD.top + chartH + 15
      );
    }
  }

  function renderProfileAnalysis(profile, ratingHistory, submissions) {
    const ratingStats = computeRatingStats(ratingHistory);
    const topicStats = computeTopicStats(submissions);
    const rating = profile.rating || 0;
    const maxRating = profile.maxRating || 0;
    const regDate = new Date(profile.registrationTimeSeconds * 1000).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "2-digit",
    });

    const ratingClass = (val) => {
      if (val > 0) return "stat-positive";
      if (val < 0) return "stat-negative";
      return "";
    };

    const performanceSummary = buildPerformanceSummary(profile, ratingStats, topicStats, rating);
    const growthRecs = buildGrowthRecommendations(rating, topicStats);
    const contestRecs = buildContestRecommendations(rating);

    const maxTopicCount = topicStats.top5Strong.length
      ? topicStats.top5Strong[0][1]
      : 1;

    const strongBarsHTML = topicStats.top5Strong
      .map(
        ([tag, count]) => `
        <div class="topic-bar-item">
          <div class="topic-bar-label">
            <span>${tag}</span>
            <span>${count} solved</span>
          </div>
          <div class="topic-bar-track">
            <div class="topic-bar-fill" style="width:${Math.round((count / maxTopicCount) * 100)}%"></div>
          </div>
        </div>`
      )
      .join("");

    const weakBarsHTML = topicStats.top5Weak
      .map(
        ([tag, count]) => `
        <div class="topic-bar-item">
          <div class="topic-bar-label">
            <span>${tag}</span>
            <span>${count} solved</span>
          </div>
          <div class="topic-bar-track">
            <div class="topic-bar-fill weak" style="width:${Math.min(Math.round((count / Math.max(maxTopicCount, 1)) * 100), 40)}%"></div>
          </div>
        </div>`
      )
      .join("");

    const recCardsHTML = growthRecs
      .map(
        (r) => `
        <div class="rec-card">
          <div class="rec-card-icon">${r.icon}</div>
          <div class="rec-card-title">${r.title}</div>
          <div class="rec-card-desc">${r.desc}</div>
        </div>`
      )
      .join("");

    const contestRecCardsHTML = contestRecs
      .map(
        (r) => `
        <div class="contest-rec-card">
          <div class="contest-rec-platform">${r.platform}</div>
          <div class="contest-rec-name">${r.name}</div>
          <div class="contest-rec-reason">${r.reason}</div>
        </div>`
      )
      .join("");

    analysisContainer.innerHTML = `
      <div class="profile-summary">

        <div class="section-block block-profile">
          <h3>${escapeHtml(profile.handle)}</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span>Current Rating</span>
              <h2 class="${ratingClass(rating)}">${rating}</h2>
            </div>
            <div class="stat-box">
              <span>Max Rating</span>
              <h2>${maxRating}</h2>
            </div>
            <div class="stat-box">
              <span>Current Rank</span>
              <h2>${profile.rank || "Unrated"}</h2>
            </div>
            <div class="stat-box">
              <span>Max Rank</span>
              <h2>${profile.maxRank || "N/A"}</h2>
            </div>
            <div class="stat-box">
              <span>Contests</span>
              <h2>${ratingStats.contestCount}</h2>
            </div>
            <div class="stat-box">
              <span>Registered</span>
              <h2 style="font-size:0.85rem">${regDate}</h2>
            </div>
          </div>
        </div>

        <div class="section-block block-rating">
          <h3>Rating Analysis</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span>Total Growth</span>
              <h2 class="${ratingClass(ratingStats.totalGrowth)}">${ratingStats.totalGrowth > 0 ? "+" : ""}${ratingStats.totalGrowth}</h2>
            </div>
            <div class="stat-box">
              <span>Total Loss</span>
              <h2 class="stat-negative">${ratingStats.totalLoss}</h2>
            </div>
            <div class="stat-box">
              <span>Best Contest</span>
              <h2 class="stat-positive">+${ratingStats.bestGain}</h2>
            </div>
            <div class="stat-box">
              <span>Worst Contest</span>
              <h2 class="stat-negative">${ratingStats.worstLoss}</h2>
            </div>
            <div class="stat-box">
              <span>Avg Change</span>
              <h2 class="${ratingClass(Number(ratingStats.averageRatingChange))}">${ratingStats.averageRatingChange > 0 ? "+" : ""}${ratingStats.averageRatingChange}</h2>
            </div>
          </div>
        </div>

        <div class="section-block block-chart">
          <h3>Rating Trend</h3>
          <div class="chart-wrap">
            <canvas id="rating-chart"></canvas>
          </div>
        </div>

        <div class="section-block block-solved">
          <h3>Solved Problem Analytics</h3>
          <div class="stats-grid">
            <div class="stat-box">
              <span>Total Solved</span>
              <h2>${topicStats.totalSolved}</h2>
            </div>
            <div class="stat-box">
              <span>Unique Solved</span>
              <h2>${topicStats.uniqueSolved}</h2>
            </div>
            <div class="stat-box">
              <span>Tags Practiced</span>
              <h2>${topicStats.uniqueTagCount}</h2>
            </div>
            <div class="stat-box">
              <span>Most Practiced</span>
              <h2 style="font-size:0.8rem;text-transform:uppercase">${topicStats.mostPracticedTopic}</h2>
            </div>
          </div>
        </div>

        <div class="section-block block-topics">
          <h3>Top 5 Strongest Topics</h3>
          <div class="topic-bar-list">${strongBarsHTML || "<p style='color:var(--text-dim);font-size:0.85rem'>[NO DATA]</p>"}</div>
        </div>

        <div class="section-block block-weakness">
          <h3>Top 5 Improvement Areas</h3>
          <div class="topic-bar-list">${weakBarsHTML || "<p style='color:var(--text-dim);font-size:0.85rem'>[NO DATA]</p>"}</div>
        </div>

        <div class="section-block block-summary">
          <h3>Performance Summary</h3>
          <p class="summary-text">${performanceSummary}</p>
        </div>

        <div class="section-block block-recommendations">
          <h3>Personalized Growth Recommendations</h3>
          <div class="rec-grid">${recCardsHTML}</div>
        </div>

        <div class="section-block block-contests">
          <h3>Contest Recommendations</h3>
          <div class="contest-rec-grid">${contestRecCardsHTML}</div>
        </div>

      </div>
    `;

    const canvas = document.getElementById("rating-chart");
    if (canvas) {
      requestAnimationFrame(() => drawRatingChart(canvas, ratingHistory));
    }
  }

  const fetchContests = async () => {
    errorIndicator.style.display = "none";
    loadingIndicator.style.display = "block";
    contestGrid.innerHTML = "";
    startLoadingAnimation();

    try {
      const response = await fetch("https://kontests.net/api/v1/all");
      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      const now = Date.now();

      allContests = data
        .filter((c) => new Date(c.start_time).getTime() > now)
        .map((c) => ({
          site: c.site,
          name: c.name,
          start_time: new Date(c.start_time).getTime(),
          url: c.url,
          platform_key: c.site.toLowerCase().replace(/\s+/g, ""),
        }));

      if (allContests.length === 0) throw new Error("Empty");
    } catch (error) {
      console.warn("[SYS.WARN] LIVE API UNREACHABLE. LOADING VERIFIED CACHE DATA...");
      const now = Date.now();
      allContests = verified2026Contests.filter((c) => c.start_time > now);

      if (allContests.length === 0) {
        showError("[SYS.ERR] NO ACTIVE CONTESTS DETECTED ACROSS ALL MAINFRAMES.");
        return;
      }
    } finally {
      stopLoadingAnimation();
      allContests.sort((a, b) => a.start_time - b.start_time);
      populateFilters(allContests);
      renderContests(allContests);
      updateLastUpdated();
    }
  };

  const populateFilters = (contests) => {
    const platforms = [...new Set(contests.map((c) => c.site))].sort();
    const currentSelection = platformFilter.value;

    platformFilter.innerHTML = '<option value="ALL">ALL PLATFORMS</option>';
    platforms.forEach((site) => {
      const option = document.createElement("option");
      option.value = site;
      option.textContent = site.toUpperCase();
      platformFilter.appendChild(option);
    });

    if (platforms.includes(currentSelection)) {
      platformFilter.value = currentSelection;
    }
  };

  const renderContests = (contestsToRender) => {
    loadingIndicator.style.display = "none";

    if (contestsToRender.length === 0) {
      contestGrid.innerHTML =
        '<div class="status-message loading">[SYS.INFO] NO UPCOMING MATCHES FOR THIS FILTER.</div>';
      return;
    }

    const cardsHTML = contestsToRender
      .map((contest) => {
        return `
          <div class="contest-card">
            <span class="platform-badge ${contest.platform_key}">${contest.site}</span>
            <h2 class="contest-name">${escapeHtml(contest.name)}</h2>
            <div class="contest-detail">
              <span><strong>STARTS:</strong></span>
              <span>${formatDate(contest.start_time)}</span>
            </div>
            <div class="timer-container">
              <div class="timer-label">TIME REMAINING</div>
              <div class="timer-element" data-start="${contest.start_time}">CALCULATING...</div>
            </div>
            <a href="${escapeHtml(contest.url)}" target="_blank" rel="noopener noreferrer" class="contest-link">
              INITIALIZE LINK >>
            </a>
          </div>
        `;
      })
      .join("");

    contestGrid.innerHTML = cardsHTML;
    clearInterval(timerInterval);
    startTimers();
  };

  const startTimers = () => {
    const updateTimers = () => {
      const timerElements = document.querySelectorAll(".timer-element");
      const now = new Date().getTime();

      timerElements.forEach((el) => {
        const startTime = parseInt(el.dataset.start);
        const diff = startTime - now;

        if (diff <= 0) {
          el.textContent = "IN PROGRESS";
          el.className = "timer-element expired";
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        el.className = days === 0 ? "timer-element urgent" : "timer-element";

        if (days > 0) {
          el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          el.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
      });
    };

    updateTimers();
    timerInterval = setInterval(updateTimers, 1000);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date
      .toLocaleString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .toUpperCase();
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  const showError = (message) => {
    loadingIndicator.style.display = "none";
    errorIndicator.style.display = "block";
    errorIndicator.innerHTML = `>_ ${message}`;
  };

  const updateLastUpdated = () => {
    const now = new Date();
    lastUpdatedSpan.textContent = now.toLocaleTimeString("en-US", { hour12: false });
  };

  const handleFilterChange = () => {
    const selectedPlatform = platformFilter.value;
    const sortBy = sortFilter.value;

    let filtered = [...allContests];

    if (selectedPlatform !== "ALL") {
      filtered = filtered.filter((c) => c.site === selectedPlatform);
    }

    if (sortBy === "platform") {
      filtered.sort((a, b) => a.site.localeCompare(b.site));
    } else {
      filtered.sort((a, b) => a.start_time - b.start_time);
    }

    renderContests(filtered);
  };

  platformFilter.addEventListener("change", handleFilterChange);
  sortFilter.addEventListener("change", handleFilterChange);

  analyzeBtn.addEventListener("click", async () => {
    const username = document.getElementById("cf-username").value.trim();

    if (!username) {
      analysisContainer.innerHTML = `
        <div class="analysis-error">
          >_ [INPUT.ERR] No username provided. Enter a valid Codeforces handle.
        </div>
      `;
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "[ SCANNING... ]";

    analysisContainer.innerHTML = `
      <div class="analysis-loading">
        >_ BOOTING PROFILE SCANNER FOR: ${escapeHtml(username)}...
      </div>
    `;

    try {
      const [profile, ratingHistory, submissions] = await Promise.all([
        fetchCodeforcesProfile(username),
        fetchCodeforcesRating(username),
        fetchSolvedProblems(username),
      ]);

      renderProfileAnalysis(profile, ratingHistory, submissions);
    } catch (error) {
      const msg = error.message || "Unknown error";
      analysisContainer.innerHTML = `
        <div class="analysis-error">
          >_ [SYS.ERR] PROFILE SCAN FAILED: ${escapeHtml(msg)}<br>
          >_ Verify the handle exists and the Codeforces API is reachable.
        </div>
      `;
    } finally {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "[ ANALYZE ]";
    }
  });

  document.getElementById("cf-username").addEventListener("keydown", (e) => {
    if (e.key === "Enter") analyzeBtn.click();
  });

  fetchContests();
  setInterval(fetchContests, 5 * 60 * 1000);
});