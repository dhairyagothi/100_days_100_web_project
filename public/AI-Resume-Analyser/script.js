const uploadBtn = document.getElementById('uploadBtn');

const resumeInput = document.getElementById('resumeInput');

const fileName = document.getElementById('fileName');

const downloadReportBtn = document.getElementById('downloadReportBtn');
const dropZone = document.getElementById('dropZone');

const dragText = document.querySelector('.drag-text');

const statType = document.getElementById('statType');

const statSize = document.getElementById('statSize');

const statModified = document.getElementById('statModified');

const statReadTime = document.getElementById('statReadTime');
const techBar = document.getElementById('techBar');

const projectsBar = document.getElementById('projectsBar');

const communicationBar = document.getElementById('communicationBar');

const experienceBar = document.getElementById('experienceBar');

const techScore = document.getElementById('techScore');

const projectsScore = document.getElementById('projectsScore');

const communicationScore = document.getElementById('communicationScore');

const experienceScore = document.getElementById('experienceScore');

const statWords = document.getElementById('statWords');

const statCharacters = document.getElementById('statCharacters');

const loadingSection =
  document.getElementById(
    "loadingSection"
  );

const resultsSection =
  document.getElementById(
    "resultsSection"
  );

const copySuggestionsBtn =
  document.getElementById(
    "copySuggestionsBtn"
  );
uploadBtn.addEventListener('click', () => {
  resumeInput.click();
});

resumeInput.addEventListener('change', () => {
  if (resumeInput.files.length > 0) {
    const file = resumeInput.files[0];

    fileName.textContent = file.name;

    updateStats(file);

    extractResumeContent(file);
  }
});

['dragenter', 'dragover'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();

    dropZone.classList.add('drag-over');

    dragText.textContent = 'Drop your resume here';
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();

    dropZone.classList.remove('drag-over');

    dragText.textContent = 'or drag & drop your resume here';
  });
});

dropZone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;

  if (files.length > 0) {
    resumeInput.files = files;

    updateStats(file);
    extractResumeContent(file);
    startAnalysis();
    fileName.textContent = files[0].name;

    updateStats(files[0]);
    extractResumeContent(files[0]);
  }
});

const progressCircle = document.getElementById('progressCircle');

const meterScore = document.getElementById('meterScore');

const radius = 85;

const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = circumference;

progressCircle.style.strokeDashoffset = circumference;

let currentATSScore = 0;
let resumeText = '';

function generateAnalysis(text = resumeText) {
  if (!text) return;

  const result = calculateATSScore(text);

  currentATSScore = result.totalScore;

  animateMeter(currentATSScore);

  updateBreakdown(result);

  generateChart(result);

  updateSuggestions(result);
}

function calculateATSScore(text) {
  const lower = text.toLowerCase();

  let score = 0;


  const sections = {
    skills: 20,
    experience: 20,
    projects: 15,
    education: 15,
    keywords: 20,
    structure: 10,
  };

  const hasSkills = /skills|technical skills/i.test(text);

  const hasExperience = /experience|work experience|employment/i.test(text);

  const hasProjects = /projects|project experience/i.test(text);

  const hasEducation = /education|qualification|degree/i.test(text);

  const atsKeywords = [
    'javascript',
    'react',
    'node',
    'api',
    'python',
    'sql',
    'html',
    'css',
    'git',
    'github',
  ];

  let keywordCount = 0;

  atsKeywords.forEach((keyword) => {
    if (lower.includes(keyword)) {
      keywordCount++;
    }
  });

  if (hasSkills) score += sections.skills;

  if (hasExperience) score += sections.experience;

  if (hasProjects) score += sections.projects;

  if (hasEducation) score += sections.education;

  score += Math.min(sections.keywords, keywordCount * 2);

  const wordCount = text.split(/\s+/).length;

  if (wordCount > 250) score += sections.structure;
  return {
    totalScore: score,
    technical: Math.min(100, 50 + keywordCount * 5),
    projects: hasProjects ? 90 : 40,
    communication: wordCount > 250 ? 80 : 50,
    experience: hasExperience ? 85 : 40,
    keywordCount,
  };
}

function startAnalysis() {

  resultsSection.style.display =
    "none";

  loadingSection.style.display =
    "block";


  setTimeout(() => {

    loadingSection.style.display =
      "none";

    resultsSection.style.display =
      "grid";


    generateAnalysis();

  }, 2500);

}



function animateMeter(score) {
  const offset = circumference - (score / 100) * circumference;

  setTimeout(() => {
    progressCircle.style.strokeDashoffset = offset;
  }, 300);

  meterScore.textContent = `${score}%`;

  if (score >= 85) {
    progressCircle.style.stroke = '#22c55e';
  } else if (score >= 70) {
    progressCircle.style.stroke = '#eab308';
  } else {
    progressCircle.style.stroke = '#ef4444';
  }
}

function updateBreakdown(data) {
  const technical = data.technical;

  const projects = data.projects;

  const communication = data.communication;

  const experience = data.experience;

  techBar.style.width = `${technical}%`;

  projectsBar.style.width = `${projects}%`;

  communicationBar.style.width = `${communication}%`;

  experienceBar.style.width = `${experience}%`;

  techScore.textContent = `${technical}%`;

  projectsScore.textContent = `${projects}%`;

  communicationScore.textContent = `${communication}%`;

  experienceScore.textContent = `${experience}%`;
}

let chart;

function generateChart(data) {
  const ctx = document.getElementById('skillsChart');

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: 'radar',

    data: {
      labels: [
        'Technical Skills',
        'Projects',
        'ATS Keywords',
        'Communication',
        'Experience',
      ],

      datasets: [
        {
          label: 'Resume Strength',

          data: [
            data.technical,
            data.projects,
            Math.min(100, data.keywordCount * 10),
            data.communication,
            data.experience,
          ],

          fill: true,

          borderWidth: 3,

          pointRadius: 5,
        },
      ],
    },

    options: {
      responsive: true,

      plugins: {
        legend: {
          labels: {
            color: '#f8fafc',
          },
        },
      },

      scales: {
        r: {
          suggestedMin: 0,

          suggestedMax: 100,

          ticks: {
            color: '#cbd5e1',

            backdropColor: 'transparent',
          },

          pointLabels: {
            color: '#f8fafc',

            font: {
              size: 14,
            },
          },

          grid: {
            color: 'rgba(255,255,255,0.1)',
          },

          angleLines: {
            color: 'rgba(255,255,255,0.1)',
          },
        },
      },
    },
  });
}

function updateSuggestions(data) {
  const suggestions = document.querySelector('.suggestions-grid');

  const items = [];

  if (data.projects < 60) {
    items.push('Add a dedicated projects section.');
  }

  if (data.experience < 60) {
    items.push('Include work experience details.');
  }

  if (data.keywordCount < 5) {
    items.push('Add more ATS keywords relevant to your role.');
  }

  if (data.communication < 60) {
    items.push('Expand resume summary and achievements.');
  }

  if (!items.length) {
    items.push('Excellent resume structure and ATS compatibility.');
  }

  suggestions.innerHTML = items
    .map(
      (item) => `
      <div class="suggestion-card">
        ${item}
      </div>
    `
    )
    .join('');
}

function updateStats(file) {
  statType.textContent = file.type || 'Unknown';

  statSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

  statModified.textContent = new Date(file.lastModified).toLocaleDateString();

  const estimatedMinutes = Math.max(1, Math.round(file.size / 50000));

  statReadTime.textContent = `${estimatedMinutes} min`;
}
async function extractResumeContent(file) {
  const extension = file.name.split('.').pop().toLowerCase();

  try {
    if (extension === 'pdf') {
      const text = await extractPDFText(file);

      resumeText = text;
      updateContentStats(text);
      generateAnalysis(text);
    } else if (extension === 'docx') {
      const text = await extractDOCXText(file);

      resumeText = text;
      updateContentStats(text);
      generateAnalysis(text);
    } else if (extension === 'txt') {
      const text = await extractTXTText(file);

      resumeText = text;
      updateContentStats(text);
      generateAnalysis(text);
    } else {
      statWords.textContent = 'Unsupported';

      statCharacters.textContent = 'Unsupported';
    }
  } catch (error) {
    console.error(error);

    statWords.textContent = 'Error';
    statCharacters.textContent = 'Error';
  }
}
function extractTXTText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.readAsText(file);
  });
}
async function extractDOCXText(file) {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({
    arrayBuffer,
  });

  return result.value;
}
async function extractPDFText(file) {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let text = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    const content = await page.getTextContent();

    text += content.items.map((item) => item.str).join(' ');

    text += ' ';
  }

  return text;
}
function updateContentStats(text) {
  const cleanText = text.trim();

  const words = cleanText ? cleanText.split(/\s+/).length : 0;

  const characters = cleanText.length;

  const readingTime = Math.max(1, Math.ceil(words / 200));

  statWords.textContent = words.toLocaleString();

  statCharacters.textContent = characters.toLocaleString();
}

resultsSection.style.display =
  "grid";

generateAnalysis();


const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('resumeTheme');

if (savedTheme === 'light') {
  document.body.classList.add('light-mode');

  themeToggle.textContent = '☀️';
} else {
  themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  const isLight = document.body.classList.contains('light-mode');

  localStorage.setItem('resumeTheme', isLight ? 'light' : 'dark');

  themeToggle.textContent = isLight ? '☀️' : '🌙';
});

downloadReportBtn.addEventListener('click', () => {
  const report = `
AI Resume Analyzer Report
=========================

ATS Score: ${currentATSScore}%

Resume Insights
---------------
Technical Skills: 88%
Projects: 82%
Communication: 74%
Experience: 68%

AI Suggestions
--------------
• Add more quantified project achievements.
• Include keywords like React, APIs, and Node.js.
• Improve resume summary section.
• Add GitHub and portfolio links.
`;

  const blob = new Blob([report], { type: 'text/plain' });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');

  a.href = url;

  a.download = 'resume-analysis-report.txt';

  a.click();

  URL.revokeObjectURL(url);
});
