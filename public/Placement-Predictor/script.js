let placementChart;
let skillsChart;
const progressCircle = document.getElementById("progressCircle");
const radius = 75;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;
progressCircle.style.strokeDashoffset = circumference;
const predictBtn = document.getElementById("predictBtn");

predictBtn.addEventListener("click", () => {
  const cgpa = parseFloat(document.getElementById("cgpa").value);
  const dsa = parseInt(document.getElementById("dsa").value);
  const projects = parseInt(document.getElementById("projects").value);
  const communication = document.getElementById("communication").value;
  const internship = document.getElementById("internship").value;
  const stack = document.getElementById("stack").value;

  if (
    isNaN(cgpa) ||
    isNaN(dsa) ||
    isNaN(projects) ||
    communication === "" ||
    internship === "" ||
    stack === ""
  ) {
    alert("Please fill all fields properly");
    return;
  }

  let score = 0;
  score += cgpa * 5;
  score += dsa * 4;
  score += projects * 3;

  if (communication === "Excellent") score += 15;
  else if (communication === "Good") score += 10;
  else if (communication === "Average") score += 5;

  if (internship === "Yes") score += 15;

  if (stack === "AI / ML") score += 10;
  else if (stack === "Web Development") score += 8;
  else if (stack === "Data Science") score += 9;

  if (score > 100) score = 100;

  let packageValue = 0;
  if (score >= 85) {
    packageValue = 12 + (dsa * 0.6);
  } else if (score >= 70) {
    packageValue = 8 + (dsa * 0.4);
  } else if (score >= 55) {
    packageValue = 5 + (dsa * 0.3);
  } else {
    packageValue = 2 + (dsa * 0.2);
  }
  let badge = "Needs Improvement";

  if(score >= 80){
    badge = "Excellent🫡";
  }
  else if(score >= 60){
    badge = "Strong👌";
  }
  else if(score >= 40){
    badge = "Average🙂";
  }

  document.getElementById("profileBadge").textContent = badge;

  if (stack === "AI / ML") {
    packageValue += 3;
  } else if (stack === "Data Science") {
    packageValue += 2.5;
  } else if (stack === "Cyber Security") {
    packageValue += 2;
  } else if (stack === "Web Development") {
    packageValue += 1.5;
  }

  if (internship === "Yes") {
    packageValue += 1.5;
  }

  if (projects >= 5) {
    packageValue += 1;
  }

  if (packageValue > 25) {
    packageValue = 25;
  }

  packageValue = packageValue.toFixed(1);

  // Dynamic feedback and multi-vector recommendations engine
  let suggestion = "";
  const recommendations = [];

  if (score >= 80) {
    suggestion = "Placement Ready (Core Strength) 🚀";
  } else if (score >= 60) {
    suggestion = "High Potential (DSA & Projects Boost) ⚡";
  } else {
    suggestion = "Action Required (Academics & Skill Building) 🛠️";
  }

  // 1. DSA Vector Analysis
  if (dsa < 7) {
    recommendations.push({
      type: 'danger',
      icon: '💻',
      title: 'Accelerate DSA Problem Solving',
      description: `Your DSA rating of ${dsa}/10 is currently below baseline product company standard. Target mastering arrays, hash maps, two pointers, trees, and dynamic programming.`,
      links: [
        { text: 'Solve on LeetCode', url: 'https://leetcode.com' },
        { text: 'Compete on Codeforces', url: 'https://codeforces.com' },
        { text: 'Learn on GeeksforGeeks', url: 'https://www.geeksforgeeks.org' }
      ]
    });
  } else if (dsa >= 7 && dsa < 9) {
    recommendations.push({
      type: 'warning',
      icon: '⚡',
      title: 'Advance to Complex DSA Topics',
      description: `Your DSA rating of ${dsa}/10 is solid! To unlock premium ₹12+ LPA tiers, practice advanced greedy methods, graph search algorithms, and competitive programming grids.`,
      links: [
        { text: 'LeetCode Medium Problems', url: 'https://leetcode.com/problemset/all/?difficulty=MEDIUM' }
      ]
    });
  }

  // 2. Projects & Tech Stack Vector Analysis
  if (projects < 2) {
    let customPrompt = "Build at least 2 full-lifecycle project pieces.";
    if (stack === 'Web Development') {
      customPrompt = "Develop a responsive full-stack platform (e.g., modern E-commerce or collaborative real-time SaaS dashboard) using React, Node.js, and MongoDB.";
    } else if (stack === 'AI / ML') {
      customPrompt = "Build and train a custom Deep Learning classifier or NLP model using PyTorch, and host it as an API service.";
    } else if (stack === 'Android Development') {
      customPrompt = "Create a modern native Android application utilizing Jetpack Compose, state caching, and public REST API integrations.";
    } else if (stack === 'Cyber Security') {
      customPrompt = "Create a custom vulnerability scanning utility or a secure end-to-end cryptography keychain.";
    } else if (stack === 'Data Science') {
      customPrompt = "Design an interactive analytics suite in Streamlit executing advanced statistical modeling on large public datasets.";
    }

    recommendations.push({
      type: 'danger',
      icon: '🛠️',
      title: 'Expand Practical Portfolio',
      description: `You have completed only ${projects} project(s). Recruiters seek robust proof of skill. Action item: ${customPrompt}`,
      links: [
        { text: 'Explore Project Ideas', url: 'https://github.com/explore' }
      ]
    });
  } else if (projects >= 2 && projects < 4) {
    recommendations.push({
      type: 'warning',
      icon: '📂',
      title: 'Optimize & Host Projects',
      description: `Your ${projects} projects are good. Stand out by hosting code repositories publicly on GitHub, deploying them live on web hosting, and writing rich readmes with architecture flowcharts.`,
      links: [
        { text: 'Deploy on Vercel', url: 'https://vercel.com' },
        { text: 'Deploy on Render', url: 'https://render.com' }
      ]
    });
  }

  // 3. Tech Stack Specific Roadmap
  if (stack) {
    let roadmapUrl = 'https://roadmap.sh';
    let label = 'Roadmaps';
    if (stack === 'Web Development') { roadmapUrl = 'https://roadmap.sh/frontend'; label = 'Frontend Developer Roadmap'; }
    else if (stack === 'AI / ML') { roadmapUrl = 'https://roadmap.sh/ai-data-scientist'; label = 'AI/ML & Data Engineering Roadmap'; }
    else if (stack === 'Android Development') { roadmapUrl = 'https://roadmap.sh/android'; label = 'Android Developer Roadmap'; }
    else if (stack === 'Cyber Security') { roadmapUrl = 'https://roadmap.sh/cyber-security'; label = 'Cyber Security Specialist Roadmap'; }
    else if (stack === 'Data Science') { roadmapUrl = 'https://roadmap.sh/ai-data-scientist'; label = 'Data Science Roadmap'; }

    recommendations.push({
      type: 'success',
      icon: '🌐',
      title: `Master ${stack}`,
      description: `Deepen your conceptual knowledge in ${stack} following optimized standard developer roadmaps.`,
      links: [
        { text: label, url: roadmapUrl }
      ]
    });
  }

  // 4. CGPA Vector Analysis
  if (cgpa < 7.0) {
    recommendations.push({
      type: 'warning',
      icon: '📚',
      title: 'Strengthen Academic Backing',
      description: `Your CGPA of ${cgpa} is below 7.0. While some companies screen strictly on GPA, you can bypass this limitation through open-source contributions, high hacker ratings, and solid hackathon showcases.`,
      links: []
    });
  }

  // 5. Communication Vector Analysis
  if (communication === "Average" || communication === "Poor") {
    recommendations.push({
      type: 'danger',
      icon: '🗣️',
      title: 'Refine Technical Communication',
      description: `Rating communication as ${communication} shows a potential bottleneck. Interviews require comfortable narration of your logic, resume details, and problem-solving approach.`,
      links: [
        { text: 'Practice Peer Mock Rounds', url: 'https://www.pramp.com' },
        { text: 'Prepare System Design Speaking', url: 'https://interviewing.io' }
      ]
    });
  }

  // 6. Internship Experience Vector Analysis
  if (internship === "No") {
    recommendations.push({
      type: 'warning',
      icon: '🏢',
      title: 'Gain Hands-On Experience',
      description: 'Lack of internship experience is a key differentiator. Apply for remote internships, work on micro-tasks, or join corporate open-source projects.',
      links: [
        { text: 'Find Internships on Internshala', url: 'https://internshala.com' },
        { text: 'Apply on Wellfound (AngelList)', url: 'https://wellfound.com' }
      ]
    });
  }

  // 7. Elite Profile Spotlight
  if (recommendations.filter(r => r.type === 'danger').length === 0 && score >= 85) {
    recommendations.push({
      type: 'success',
      icon: '🏆',
      title: 'High-Impact Ready (Top Tier Focus)',
      description: 'Outstanding profile metrics! You are in excellent standing for premier tier product placements. Allocate your study time on high-level system design, system load architectures, and low-level object designs.',
      links: [
        { text: 'ByteByteGo System Design', url: 'https://bytebytego.com' },
        { text: 'NeetCode Advanced practice', url: 'https://neetcode.io' }
      ]
    });
  }

  // Render metrics
  document.getElementById("placementChance").textContent = `${score}%`;
  const circle = document.getElementById("progressCircle");
  const meterScore = document.getElementById("meterScore");

  const offset = circumference - (score / 100) * circumference;
  circle.style.strokeDashoffset = offset;
  meterScore.textContent = `${score}%`;

  if (score >= 80) {
    circle.style.stroke = "#10b981";
    circle.style.filter = "drop-shadow(0 0 12px rgba(16,185,129,0.8))";
  } else if (score >= 60) {
    circle.style.stroke = "#f59e0b";
    circle.style.filter = "drop-shadow(0 0 12px rgba(245,158,11,0.8))";
  } else {
    circle.style.stroke = "#ef4444";
    circle.style.filter = "drop-shadow(0 0 12px rgba(239,68,68,0.8))";
  }

  document.getElementById("expectedPackage").textContent = `₹${packageValue} LPA`;
  document.getElementById("suggestion").textContent = suggestion;

  // Programmatically inject personalized recommendations
  const recListEl = document.getElementById("recommendationsList");
  const recContainerEl = document.getElementById("recommendationsContainer");
  recListEl.innerHTML = "";

  if (recommendations.length > 0) {
    recommendations.forEach(rec => {
      let linksHtml = "";
      if (rec.links && rec.links.length > 0) {
        linksHtml = `<div class="rec-links">` +
          rec.links.map(l => `<a href="${l.url}" target="_blank" class="rec-link">${l.text} ↗</a>`).join("") +
          `</div>`;
      }
      const itemHtml = `
        <div class="rec-item ${rec.type}">
          <span class="rec-icon">${rec.icon}</span>
          <div class="rec-content">
            <h4 class="rec-title">${rec.title}</h4>
            <p class="rec-description">${rec.description}</p>
            ${linksHtml}
          </div>
        </div>
      `;
      recListEl.innerHTML += itemHtml;
    });
    recContainerEl.style.display = "block";
  } else {
    recContainerEl.style.display = "none";
  }

  document.getElementById("resultBox").style.display = "block";
  const textColor = document.body.classList.contains("dark-mode")
    ? "#f8fafc"
    : "#64748b";

  const gridColor = document.body.classList.contains("dark-mode")
    ? "#475569"
    : "#e2e8f0";
  if (placementChart) placementChart.destroy();

  if (skillsChart) skillsChart.destroy();
  const placementCtx = document
  .getElementById("placementChart")
  .getContext("2d");

placementChart = new Chart(placementCtx, {
  type: "bar",

  data: {
    labels: ["Placement Chance", "Expected Package"],

    datasets: [{
      label: "Prediction Metrics",

      data: [score, packageValue],

      borderRadius: 10
    }]
  },

  options: {
    responsive: true,

    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },

    scales: {
      y: {
        ticks: {
          color: textColor
        },

        grid: {
          color: gridColor
        }
      },

      x: {
        ticks: {
          color: textColor
        },

        grid: {
          color: gridColor
        }
      }
    }
  }
});
const skillsCtx = document
  .getElementById("skillsChart")
  .getContext("2d");

skillsChart = new Chart(skillsCtx, {
  type: "radar",

  data: {
    labels: [
      "CGPA",
      "DSA",
      "Projects",
      "Communication",
      "Internship"
    ],

    datasets: [{
      label: "Skill Analysis",

      data: [
        cgpa,

        dsa,

        projects > 10 ? 10 : projects,

        communication === "Excellent"
          ? 10
          : communication === "Good"
          ? 7
          : communication === "Average"
          ? 5
          : 2,

        internship === "Yes"
          ? 10
          : 3
      ]
    }]
  },

  options: {
    responsive: true,

    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 10,

        ticks: {
          color: textColor,
          backdropColor: "transparent"
        },

        pointLabels: {
          color: textColor
        },

        grid: {
          color: gridColor
        },

        angleLines: {
          color: gridColor
        }
      }
    },

    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    }
  }
});
});


const themeCheckbox = document.getElementById("themeCheckbox");
const savedTheme = localStorage.getItem("placementTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeCheckbox.checked = true;
} else {
  themeCheckbox.checked = false;
}
document.getElementById("predictionTime").textContent =
new Date().toLocaleString();

themeCheckbox.addEventListener("change", () => {
  if (themeCheckbox.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("placementTheme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("placementTheme", "light");
  }
  
  if (document.getElementById("resultBox").style.display === "block") {
    predictBtn.click();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    predictBtn.click();
  }
});
