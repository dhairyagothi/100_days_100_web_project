// AI Resume Reviewer - Core Javascript Logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // App State Variables
  let extractedText = '';
  let uploadedFileName = '';
  let uploadedFileSize = '';
  let reviewsHistory = [];
  let currentReview = null;

  // DOM Elements
  const htmlEl = document.documentElement;
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const fileStatusCard = document.getElementById('fileStatusCard');
  const fileNameEl = document.getElementById('fileName');
  const fileSizeEl = document.getElementById('fileSize');
  const btnRemoveFile = document.getElementById('btnRemoveFile');
  const jobDescText = document.getElementById('jobDescText');
  const jobRoleSelect = document.getElementById('jobRoleSelect');
  const btnAnalyze = document.getElementById('btnAnalyze');
  const btnClearForm = document.getElementById('btnClearForm');

  // Loader and Report Sections
  const inputSection = document.getElementById('inputSection');
  const analyzerLoader = document.getElementById('analyzerLoader');
  const loaderTitle = document.getElementById('loaderTitle');
  const loaderSubtext = document.getElementById('loaderSubtext');
  const reportContainer = document.getElementById('reportContainer');

  // Score Elements
  const scoreOverallRing = document.getElementById('scoreOverallRing');
  const scoreOverallText = document.getElementById('scoreOverallText');
  const scoreOverallVerdict = document.getElementById('scoreOverallVerdict');
  const scoreAtsRing = document.getElementById('scoreAtsRing');
  const scoreAtsText = document.getElementById('scoreAtsText');
  const scoreSkillsValue = document.getElementById('scoreSkillsValue');
  const scoreSkillsBar = document.getElementById('scoreSkillsBar');
  const scoreSkillsCounts = document.getElementById('scoreSkillsCounts');
  const scoreFormattingValue = document.getElementById('scoreFormattingValue');
  const scoreFormattingBar = document.getElementById('scoreFormattingBar');
  const scoreFormattingIssues = document.getElementById('scoreFormattingIssues');

  // Tab Panels and Buttons
  const tabSummary = document.getElementById('tabSummary');
  const tabSkills = document.getElementById('tabSkills');
  const tabAtsChecklist = document.getElementById('tabAtsChecklist');
  const tabGrammar = document.getElementById('tabGrammar');
  const tabTemplates = document.getElementById('tabTemplates');
  const tabAiFeedback = document.getElementById('tabAiFeedback');

  const panelSummary = document.getElementById('panelSummary');
  const panelSkills = document.getElementById('panelSkills');
  const panelAtsChecklist = document.getElementById('panelAtsChecklist');
  const panelGrammar = document.getElementById('panelGrammar');
  const panelTemplates = document.getElementById('panelTemplates');
  const panelAiFeedback = document.getElementById('panelAiFeedback');

  // Dynamic Lists / Elements inside report
  const summaryStrengthsList = document.getElementById('summaryStrengthsList');
  const summaryWeaknessesList = document.getElementById('summaryWeaknessesList');
  const matchedSkillsCount = document.getElementById('matchedSkillsCount');
  const matchedSkillsChips = document.getElementById('matchedSkillsChips');
  const missingSkillsCount = document.getElementById('missingSkillsCount');
  const missingSkillsChips = document.getElementById('missingSkillsChips');
  const atsChecklistGrid = document.getElementById('atsChecklistGrid');
  const grammarIssuesTableBody = document.getElementById('grammarIssuesTableBody');
  const templatesGrid = document.getElementById('templatesGrid');
  const btnRequestAiReview = document.getElementById('btnRequestAiReview');
  const aiLoader = document.getElementById('aiLoader');
  const aiResultBox = document.getElementById('aiResultBox');
  const aiConfigLabel = document.getElementById('aiConfigLabel');

  // Export buttons
  const btnDownloadReport = document.getElementById('btnDownloadReport');

  // Settings & Theme Elements
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const mobileThemeToggleBtn = document.getElementById('mobileThemeToggleBtn');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const mobileThemeIconSun = document.getElementById('mobileThemeIconSun');
  const mobileThemeIconMoon = document.getElementById('mobileThemeIconMoon');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');

  // History List Elements
  const historyList = document.getElementById('historyList');
  const btnClearHistory = document.getElementById('btnClearHistory');

  // Configure PDFJS Global Worker Source
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  // Industry Skills Database for Local Scans
  const SKILLS_DATABASE = {
    frontend: ["html", "html5", "css", "css3", "javascript", "typescript", "react", "vue", "angular", "next.js", "nextjs", "tailwind", "webpack", "vite", "redux", "sass", "jest", "bootstrap", "jquery", "nuxt", "gatsby", "sass", "less", "css grid", "flexbox", "graphql", "rest api", "cypress", "playwright", "eslint", "prettier"],
    backend: ["node.js", "nodejs", "express", "python", "django", "fastapi", "go", "golang", "java", "spring boot", "ruby", "rails", "php", "laravel", "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "graphql", "docker", "kubernetes", "aws", "gcp", "azure", "firebase", "rest api", "microservices", "grpc", "nest.js", "apollo", "prisma", "sequelize"],
    fullstack: ["html", "css", "javascript", "typescript", "react", "node.js", "nodejs", "express", "sql", "postgresql", "mongodb", "rest api", "git", "ci/cd", "aws", "docker", "next.js", "graphql", "tailwind", "redis", "kubernetes", "python", "angular", "vue", "github", "testing", "agile"],
    mobile: ["react native", "flutter", "swift", "swiftui", "objective-c", "kotlin", "java", "android sdk", "ios sdk", "xcode", "cocoapods", "app store connect", "google play console", "dart", "cordova", "ionic", "xamarin", "fastlane", "mobile design", "push notifications"],
    datascience: ["python", "r", "sql", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras", "machine learning", "deep learning", "nlp", "tableau", "powerbi", "statistics", "data mining", "hadoop", "spark", "hive", "matplotlib", "seaborn", "jupyter notebook", "probability", "big data"],
    productmanager: ["agile", "scrum", "product roadmap", "user stories", "jira", "a/b testing", "product analytics", "market research", "sql", "ux principles", "stakeholder management", "product strategy", "confluence", "trello", "user research", "kpis", "product lifecycle", "prds"],
    uiux: ["figma", "adobe xd", "sketch", "wireframing", "prototyping", "user research", "information architecture", "visual design", "interaction design", "design systems", "usability testing", "adobe illustrator", "photoshop", "invision", "heuristics", "typography", "color theory"],
    qa: ["selenium", "cypress", "playwright", "jest", "mocha", "postman", "automation testing", "manual testing", "bug tracking", "ci/cd", "load testing", "jmeter", "cucumber", "appium", "regression testing", "git", "jenkins", "test plans", "qa methodologies"],
    marketing: ["seo", "sem", "google analytics", "content marketing", "social media marketing", "copywriting", "email marketing", "crm", "hubspot", "mailchimp", "brand strategy", "ppc", "lead generation", "market research", "public relations", "adwords", "copywriter"],
    hr: ["recruiting", "talent acquisition", "onboarding", "employee relations", "performance management", "ats", "interviewing", "human resources", "labor law", "hris", "conflict resolution", "payroll", "training", "hiring", "compensation", "onboarding"]
  };

  const MODEL_OPTIONS = {
    gemini: [
      { value: 'gemini-1.5-flash', text: 'Gemini 1.5 Flash (Fast, General Purpose)' },
      { value: 'gemini-1.5-pro', text: 'Gemini 1.5 Pro (Deep Reasoning & Analysis)' }
    ],
    openai: [
      { value: 'gpt-4o-mini', text: 'GPT-4o-Mini (Fast, Cost-efficient)' },
      { value: 'gpt-4o', text: 'GPT-4o (High intelligence)' }
    ]
  };

  // --- INITIALIZATION ---
  initTheme();
  loadHistory();
  checkButtonState();

  // --- EVENT LISTENERS ---

  // File Upload Controls
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);

  // Drag and Drop
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  });

  btnRemoveFile.addEventListener('click', removeUploadedFile);
  jobDescText.addEventListener('input', checkButtonState);

  // Action Buttons
  btnAnalyze.addEventListener('click', performAnalysis);
  btnClearForm.addEventListener('click', resetForm);
  btnRequestAiReview.addEventListener('click', requestAiCritique);
  btnDownloadReport.addEventListener('click', exportToPdf);

  // History Actions
  btnClearHistory.addEventListener('click', clearAllHistory);

  // Responsive Sidebar Menu
  mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  // Close sidebar on option clicks inside mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 900 && !sidebar.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Tab switching
  const tabs = [tabSummary, tabSkills, tabAtsChecklist, tabGrammar, tabTemplates, tabAiFeedback];
  const panels = [panelSummary, panelSkills, panelAtsChecklist, panelGrammar, panelTemplates, panelAiFeedback];

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      panels[index].classList.add('active');

      // Update ARIA roles
      tabs.forEach((t, i) => {
        t.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    });
  });

  // --- THEME TOGGLE LOGIC ---
  function initTheme() {
    const savedTheme = localStorage.getItem('resume_theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    const handler = () => {
      const current = htmlEl.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('resume_theme', newTheme);
      updateThemeUI(newTheme);
    };

    themeToggleBtn.addEventListener('click', handler);
    mobileThemeToggleBtn.addEventListener('click', handler);
  }

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      themeIconSun.style.display = 'block';
      themeIconMoon.style.display = 'none';
      mobileThemeIconSun.style.display = 'block';
      mobileThemeIconMoon.style.display = 'none';
    } else {
      themeIconSun.style.display = 'none';
      themeIconMoon.style.display = 'block';
      mobileThemeIconSun.style.display = 'none';
      mobileThemeIconMoon.style.display = 'block';
    }
  }

  // Settings drawer and configurations are removed.

  // --- FILE SELECTION & EXTRACTION ---
  function handleFileSelect(e) {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }

  function removeUploadedFile() {
    extractedText = '';
    uploadedFileName = '';
    uploadedFileSize = '';
    fileInput.value = '';
    fileStatusCard.style.display = 'none';
    dropzone.style.display = 'flex';
    checkButtonState();
  }

  function checkButtonState() {
    const hasFile = extractedText.trim().length > 0;
    const hasJobDesc = jobDescText.value.trim().length > 0;
    btnAnalyze.disabled = !(hasFile && hasJobDesc);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function processFile(file) {
    const validExtensions = ['pdf', 'docx'];
    const extension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(extension)) {
      alert('Unsupported file format. Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    uploadedFileName = file.name;
    uploadedFileSize = formatBytes(file.size);

    // Show loading indicator in dropzone
    dropzone.style.display = 'none';
    fileStatusCard.style.display = 'flex';
    fileNameEl.textContent = uploadedFileName;
    fileSizeEl.textContent = `Extracting text... (${uploadedFileSize})`;

    const reader = new FileReader();

    if (extension === 'pdf') {
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        extractTextFromPdf(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    } else if (extension === 'docx') {
      reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        extractTextFromDocx(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  async function extractTextFromPdf(arrayBuffer) {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        text += pageText + '\n';
      }

      extractedText = text;
      fileSizeEl.textContent = `${uploadedFileSize} • PDF Text Extracted`;
      checkButtonState();
    } catch (err) {
      console.error(err);
      alert('Error extracting text from PDF file. Make sure it is not password protected or corrupted.');
      removeUploadedFile();
    }
  }

  async function extractTextFromDocx(arrayBuffer) {
    try {
      const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
      extractedText = result.value;

      if (!extractedText.trim()) {
        throw new Error("No text found in Word document.");
      }

      fileSizeEl.textContent = `${uploadedFileSize} • Word Text Extracted`;
      checkButtonState();
    } catch (err) {
      console.error(err);
      alert('Error extracting text from DOCX file. Make sure it is a valid MS Word document.');
      removeUploadedFile();
    }
  }

  // --- THE ANALYSIS CORE ENGINE (LOCAL PARSER) ---
  function performAnalysis() {
    if (!extractedText.trim() || !jobDescText.value.trim()) return;

    // Show Loader
    inputSection.style.display = 'none';
    analyzerLoader.style.display = 'flex';
    reportContainer.style.display = 'none';

    // Simulate phases of analysis with delays for dashboard premium feel
    const phases = [
      { text: "Reading extracted text tokens...", subtext: "Normalizing text casing and punctuation" },
      { text: "Scanning skillset overlaps...", subtext: "Analyzing target industry databases & job description keywords" },
      { text: "Performing ATS Formatting scan...", subtext: "Checking structural elements, contact detail formats & section layout" },
      { text: "Auditing writing styles...", subtext: "Checking passive voice structures and impact verb frequencies" },
      { text: "Saving review analytics...", subtext: "Creating dashboard reports and storing cache history" }
    ];

    let phaseIdx = 0;

    function runPhase() {
      if (phaseIdx < phases.length) {
        loaderTitle.textContent = phases[phaseIdx].text;
        loaderSubtext.textContent = phases[phaseIdx].subtext;
        phaseIdx++;
        setTimeout(runPhase, 400 + Math.random() * 400);
      } else {
        // Complete Analysis & Render
        const analysisResults = runLocalMetricsAnalysis(extractedText, jobDescText.value, jobRoleSelect.value);
        currentReview = analysisResults;
        saveReviewToHistory(analysisResults);
        renderReport(analysisResults);

        analyzerLoader.style.display = 'none';
        reportContainer.style.display = 'flex';
        inputSection.style.display = 'none';
      }
    }
    runPhase();
  }

  function runLocalMetricsAnalysis(resumeText, jdText, industry) {
    const resumeLower = resumeText.toLowerCase();
    const jdLower = jdText.toLowerCase();

    // 1. SKILLS EXTRACTION & COMPARISON
    const industrySkills = SKILLS_DATABASE[industry] || [];

    // Find skills which are explicitly required in the Job Description
    const jdRequiredSkills = industrySkills.filter(skill => {
      // Create exact word boundary check
      const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i');
      return regex.test(jdLower);
    });

    // Fallback if the JD has no industry match words, use all industry terms
    const targetSkills = jdRequiredSkills.length > 0 ? jdRequiredSkills : industrySkills;

    // Find which target skills are in the resume
    const matchedSkills = [];
    const missingSkills = [];

    targetSkills.forEach(skill => {
      const regex = new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'i');
      if (regex.test(resumeLower)) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    const skillsScore = targetSkills.length > 0
      ? Math.round((matchedSkills.length / targetSkills.length) * 100)
      : 70;

    // 2. ATS CHECKLIST SCAN
    // Check key section titles
    const sections = {
      contact: {
        title: "Contact Details",
        present: /\b(phone|email|contact|cell|mobile|linkedin|github|address)\b/i.test(resumeLower) || /@/.test(resumeLower),
        testName: "Email/Phone Contact details"
      },
      summary: {
        title: "Professional Summary",
        present: /\b(summary|objective|profile|about me|about|professional overview)\b/i.test(resumeLower),
        testName: "Executive Summary / Objective"
      },
      experience: {
        title: "Work Experience",
        present: /\b(experience|history|employment|work|career|professional background)\b/i.test(resumeLower),
        testName: "Professional Work Experience"
      },
      education: {
        title: "Education",
        present: /\b(education|academic|degree|university|college|school)\b/i.test(resumeLower),
        testName: "Education History"
      },
      skills: {
        title: "Skills",
        present: /\b(skills|technologies|expertise|capabilities|competencies|tools)\b/i.test(resumeLower),
        testName: "Skills List Area"
      },
      projects: {
        title: "Projects",
        present: /\b(projects|portfolio|personal projects|key implementations)\b/i.test(resumeLower),
        testName: "Projects / Implementations"
      }
    };

    let presentSectionsCount = 0;
    const checklistItems = [];

    for (const key in sections) {
      if (sections[key].present) presentSectionsCount++;
      checklistItems.push({
        name: sections[key].testName,
        sectionName: sections[key].title,
        status: sections[key].present
      });
    }

    // Contact info format audits
    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(resumeLower);
    const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText);
    const hasLinkedIn = /linkedin\.com\/in\/[\w.-]+/.test(resumeLower);
    const hasGitHub = /github\.com\/[\w.-]+/.test(resumeLower);

    checklistItems.push({ name: "Contains Email Address", status: hasEmail });
    checklistItems.push({ name: "Contains Phone Number", status: hasPhone });
    checklistItems.push({ name: "Contains LinkedIn Link", status: hasLinkedIn });
    checklistItems.push({ name: "Contains GitHub / Portfolio Link", status: hasGitHub });

    const totalChecklistPassed = checklistItems.filter(item => item.status).length;
    const atsScore = Math.round((totalChecklistPassed / checklistItems.length) * 100);

    // 3. WRITING, GRAMMAR & TONE ANALYSIS (Local NLP Rules)
    const grammarIssues = [];

    // Check Weak Verbs
    const weakVerbs = ["responsible for", "assisted with", "participated in", "worked on", "helped to", "duties included"];
    weakVerbs.forEach(verb => {
      const occurrences = (resumeLower.match(new RegExp(`\\b${escapeRegExp(verb)}\\b`, 'gi')) || []).length;
      if (occurrences > 0) {
        grammarIssues.push({
          category: "weak verb",
          snippet: `Found "${verb}" (${occurrences}x)`,
          suggestion: `Replace with a strong action verb (e.g. "Spearheaded", "Architected", "Pioneered", "Orchestrated").`
        });
      }
    });

    // Check Passive Voice Templates
    const passiveVoiceList = [
      { pattern: /\b(was|were) (built|managed|led|created|designed) by\b/gi, phrase: "was [verb] by" },
      { pattern: /\b(was|were) responsible for\b/gi, phrase: "was responsible for" }
    ];
    passiveVoiceList.forEach(item => {
      const occurrences = (resumeLower.match(item.pattern) || []).length;
      if (occurrences > 0) {
        grammarIssues.push({
          category: "passive voice",
          snippet: `Detected passive template: "${item.phrase}"`,
          suggestion: "Rewrite in active format. Instead of 'Systems were built by me', write 'Engineered systems...'"
        });
      }
    });

    // Check clichés and buzzwords
    const clichés = ["team player", "detail-oriented", "synergy", "go-getter", "think outside the box", "results-driven"];
    clichés.forEach(buzzword => {
      const occurrences = (resumeLower.match(new RegExp(`\\b${escapeRegExp(buzzword)}\\b`, 'gi')) || []).length;
      if (occurrences > 0) {
        grammarIssues.push({
          category: "buzzword",
          snippet: `Found cliché "${buzzword}"`,
          suggestion: "Avoid generic statements. Use specific stats and metrics (e.g., 'Boosted team efficiency by 20%') to prove this impact."
        });
      }
    });

    // Score deduction
    const baseFormattingScore = 100;
    const formattingScore = Math.max(20, baseFormattingScore - (grammarIssues.length * 8));

    // 4. OVERALL COMBINED MATCH SCORE
    const overallScore = Math.round((atsScore * 0.25) + (skillsScore * 0.50) + (formattingScore * 0.25));

    // 5. STRENGTHS & WEAKNESSES GENERATION
    const strengths = [];
    const weaknesses = [];

    // Formulate strengths
    if (skillsScore >= 75) {
      strengths.push("High density of matching technical skills for the target industry role.");
    } else if (skillsScore >= 50) {
      strengths.push("Good match with standard base industry skills, covers core developer tags.");
    }
    if (sections.experience.present) {
      strengths.push("Professional Experience section clearly structured to highlight career chronology.");
    }
    if (sections.education.present) {
      strengths.push("Academic background / Education details clearly listed.");
    }
    if (hasEmail && hasPhone) {
      strengths.push("Contact details are fully scan-compliant (Email & phone number present).");
    }

    // Formulate weaknesses
    if (missingSkills.length > 3) {
      weaknesses.push(`Missing key target keywords: ${missingSkills.slice(0, 3).join(', ')}. Include these to boost ATS indexing.`);
    }
    if (!sections.projects.present) {
      weaknesses.push("Missing a Projects section. Include a structured list of personal/professional projects to display applied skills.");
    }
    if (grammarIssues.length > 3) {
      weaknesses.push("Contains passive voice sentences and filler phrases which dilute the impact of achievements.");
    }
    if (!hasLinkedIn && !hasGitHub) {
      weaknesses.push("No digital portfolio link (LinkedIn/GitHub) detected. Adding links increases recruiter credibility.");
    }

    // Make sure we have at least one strengths/weaknesses
    if (strengths.length === 0) strengths.push("Contact details are formatted correctly.");
    if (weaknesses.length === 0) weaknesses.push("Consider expanding technical skills details to target specific job requirements.");

    // Guess seniority for Template recommendations
    const hasSeniorKeywords = /\b(senior|lead|manager|director|vp|principal|architect|head)\b/i.test(resumeLower);
    const yrsCount = resumeLower.match(/\b(years|yrs) (of )?experience\b/i);
    const yearsGuess = hasSeniorKeywords ? 6 : 2;

    return {
      id: 'rev_' + Date.now(),
      fileName: uploadedFileName,
      fileSize: uploadedFileSize,
      industry: industry,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      overallScore: overallScore,
      atsScore: atsScore,
      skillsScore: skillsScore,
      formattingScore: formattingScore,
      matchedSkills: matchedSkills,
      missingSkills: missingSkills,
      totalJdSkills: targetSkills.length,
      checklistItems: checklistItems,
      grammarIssues: grammarIssues,
      strengths: strengths,
      weaknesses: weaknesses,
      yearsGuess: yearsGuess
    };
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // --- REPORT RENDERING FUNCTIONS ---
  function renderReport(report) {
    // 1. Overall Score SVG Ring
    updateProgressCircle(scoreOverallRing, scoreOverallText, report.overallScore);
    updateProgressCircle(scoreAtsRing, scoreAtsText, report.atsScore);

    // Color code scores
    const overallColor = getScoreColorClass(report.overallScore);
    scoreOverallText.className = `circle-text ${overallColor}`;

    // Overall Verdict Description
    if (report.overallScore >= 75) {
      scoreOverallVerdict.textContent = "Excellent Match Profile";
      scoreOverallVerdict.className = "score-green";
    } else if (report.overallScore >= 50) {
      scoreOverallVerdict.textContent = "Moderate Match Profile";
      scoreOverallVerdict.className = "score-yellow";
    } else {
      scoreOverallVerdict.textContent = "Requires Optimization";
      scoreOverallVerdict.className = "score-red";
    }

    // Skills Overlap
    scoreSkillsValue.textContent = `${report.skillsScore}%`;
    scoreSkillsValue.className = `score-card-value ${getScoreColorClass(report.skillsScore)}`;
    scoreSkillsBar.className = `progress-bar-fill ${getScoreBgColorClass(report.skillsScore)}`;
    scoreSkillsBar.style.width = `${report.skillsScore}%`;
    scoreSkillsCounts.textContent = `${report.matchedSkills.length} matched / ${report.missingSkills.length} missing of target keywords`;

    // Writing/Format Score
    scoreFormattingValue.textContent = `${report.formattingScore}%`;
    scoreFormattingValue.className = `score-card-value ${getScoreColorClass(report.formattingScore)}`;
    scoreFormattingBar.className = `progress-bar-fill ${getScoreBgColorClass(report.formattingScore)}`;
    scoreFormattingBar.style.width = `${report.formattingScore}%`;
    scoreFormattingIssues.textContent = `${report.grammarIssues.length} suggestions active`;

    // 2. Strengths and Weaknesses (Summary Tab)
    summaryStrengthsList.innerHTML = '';
    report.strengths.forEach(str => {
      const li = document.createElement('li');
      li.textContent = str;
      summaryStrengthsList.appendChild(li);
    });

    summaryWeaknessesList.innerHTML = '';
    report.weaknesses.forEach(weak => {
      const li = document.createElement('li');
      li.textContent = weak;
      summaryWeaknessesList.appendChild(li);
    });

    // 3. Skills Gap Chips (Skills Tab)
    matchedSkillsCount.textContent = report.matchedSkills.length;
    matchedSkillsChips.innerHTML = '';
    if (report.matchedSkills.length === 0) {
      matchedSkillsChips.innerHTML = '<span style="font-size: 0.85rem; color: var(--text-muted);">No technical skills matched in the resume content.</span>';
    } else {
      report.matchedSkills.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'chip matching';
        chip.innerHTML = `<i data-lucide="check" class="chip-icon" style="width:12px;height:12px;"></i> ${skill.toUpperCase()}`;
        matchedSkillsChips.appendChild(chip);
      });
    }

    missingSkillsCount.textContent = report.missingSkills.length;
    missingSkillsChips.innerHTML = '';
    if (report.missingSkills.length === 0) {
      missingSkillsChips.innerHTML = '<span style="font-size: 0.85rem; color: var(--accent-success);">Great job! All target job description keywords are present in your resume.</span>';
    } else {
      report.missingSkills.forEach(skill => {
        const chip = document.createElement('span');
        chip.className = 'chip missing';
        chip.innerHTML = `<i data-lucide="plus" class="chip-icon" style="width:12px;height:12px;"></i> ${skill.toUpperCase()}`;
        missingSkillsChips.appendChild(chip);
      });
    }

    // 4. Checklist Scan Items (ATS Compliance Tab)
    atsChecklistGrid.innerHTML = '';
    report.checklistItems.forEach(item => {
      const div = document.createElement('div');
      div.className = 'checklist-item';

      const icon = item.status ? 'check-circle' : 'alert-triangle';
      const colorClass = item.status ? 'success' : 'fail';

      div.innerHTML = `
        <span class="checklist-status-icon ${colorClass}">
          <i data-lucide="${icon}" style="width: 20px; height: 20px;"></i>
        </span>
        <span class="checklist-name">${item.name}</span>
      `;
      atsChecklistGrid.appendChild(div);
    });

    // 5. Grammar & Impact Table (Writing Tab)
    grammarIssuesTableBody.innerHTML = '';
    if (report.grammarIssues.length === 0) {
      grammarIssuesTableBody.innerHTML = `
        <tr>
          <td colspan="3" style="text-align: center; color: var(--accent-success); padding: 2rem; font-weight: 600;">
            <i data-lucide="check" style="display:inline; vertical-align:middle; margin-right: 0.5rem;"></i> Awesome writing style! No weak verbs or passive structures detected.
          </td>
        </tr>
      `;
    } else {
      report.grammarIssues.forEach(issue => {
        const tr = document.createElement('tr');

        let catClass = 'content';
        if (issue.category === 'passive voice') catClass = 'grammar';
        if (issue.category === 'weak verb') catClass = 'formatting';

        tr.innerHTML = `
          <td><span class="badge-category ${catClass}">${issue.category}</span></td>
          <td style="font-weight: 600;">${issue.snippet}</td>
          <td>${issue.suggestion}</td>
        `;
        grammarIssuesTableBody.appendChild(tr);
      });
    }

    // 6. Template suggestions based on guessed years (Template tab)
    renderTemplateSuggestions(report.yearsGuess);

    // 7. Reset AI feedback panel state
    aiResultBox.style.display = 'none';
    aiLoader.style.display = 'none';

    btnRequestAiReview.innerHTML = '<i data-lucide="sparkles"></i> Generate Critique Report';

    // Refresh icons inside rendered fields
    lucide.createIcons();
  }

  function updateProgressCircle(ringEl, textEl, percentage) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius; // ~226
    const offset = circumference - (percentage / 100) * circumference;

    // Set ring style dash offset
    ringEl.style.strokeDashoffset = offset;
    textEl.textContent = `${percentage}%`;

    // Reset color classes
    const colorClass = getScoreColorClass(percentage);
    ringEl.setAttribute('class', `circle-bar ${colorClass}`);
  }

  function getScoreColorClass(score) {
    if (score >= 75) return 'score-green';
    if (score >= 50) return 'score-yellow';
    return 'score-red';
  }

  function getScoreBgColorClass(score) {
    if (score >= 75) return 'score-green-bg';
    if (score >= 50) return 'score-yellow-bg';
    return 'score-red-bg';
  }

  // Inject colors dynamically since they are custom variable classes
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .circle-bar.score-green { stroke: var(--accent-success); }
    .circle-bar.score-yellow { stroke: var(--accent-warning); }
    .circle-bar.score-red { stroke: var(--accent-danger); }
    .score-green-bg { background-color: var(--accent-success) !important; }
    .score-yellow-bg { background-color: var(--accent-warning) !important; }
    .score-red-bg { background-color: var(--accent-danger) !important; }
  `;
  document.head.appendChild(styleEl);

  function renderTemplateSuggestions(yearsGuess) {
    templatesGrid.innerHTML = '';

    const allTemplates = [
      {
        name: "Classic Chronological",
        desc: "Best for steady professional progress and clear work history. Highlights timelines, roles, and concrete metric impact.",
        icon: "calendar",
        type: "senior"
      },
      {
        name: "Skills-Focused (Functional)",
        desc: "Ideal for career switchers or candidates with work gaps. Puts project capabilities and technology stacks front and center.",
        icon: "cog",
        type: "junior"
      },
      {
        name: "Modern Hybrid",
        desc: "Best for tech professionals. Combines side-by-side skill badges, project hyperlinks, and professional experience timelines.",
        icon: "layout",
        type: "all"
      }
    ];

    allTemplates.forEach(tpl => {
      // Recommend tags based on seniority guess
      let badge = '';
      if (tpl.type === 'senior' && yearsGuess >= 5) {
        badge = '<span class="badge-category grammar" style="align-self:flex-start;">Recommended for you</span>';
      } else if (tpl.type === 'junior' && yearsGuess < 3) {
        badge = '<span class="badge-category grammar" style="align-self:flex-start;">Recommended for you</span>';
      } else if (tpl.type === 'all' && yearsGuess >= 3 && yearsGuess < 5) {
        badge = '<span class="badge-category grammar" style="align-self:flex-start;">Recommended for you</span>';
      }

      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-img-holder">
          <i data-lucide="${tpl.icon}"></i>
        </div>
        <div class="template-body">
          ${badge}
          <h5 class="template-name">${tpl.name}</h5>
          <p class="template-desc">${tpl.desc}</p>
          <button class="btn-template-use" onclick="alert('Creating template download configurations...')">Use Style</button>
        </div>
      `;
      templatesGrid.appendChild(card);
    });
  }

  // --- HISTORY MANAGEMENT ---
  function saveReviewToHistory(review) {
    // Delete older reviews of the same filename/role to avoid duplicate spam
    reviewsHistory = reviewsHistory.filter(item => !(item.fileName === review.fileName && item.industry === review.industry));

    // Add to front of queue
    reviewsHistory.unshift(review);

    // Keep max 6 items
    if (reviewsHistory.length > 6) {
      reviewsHistory.pop();
    }

    localStorage.setItem('resume_reviewer_history', JSON.stringify(reviewsHistory));
    loadHistory();
  }

  function loadHistory() {
    const rawHistory = localStorage.getItem('resume_reviewer_history');
    if (rawHistory) {
      reviewsHistory = JSON.parse(rawHistory);
    } else {
      reviewsHistory = [];
    }

    historyList.innerHTML = '';

    if (reviewsHistory.length === 0) {
      historyList.innerHTML = `
        <div class="history-card" style="cursor: default; opacity: 0.7;">
          <p style="font-size: 0.8rem; text-align: center; color: var(--text-muted);">No reviews yet. Analyze your first resume!</p>
        </div>
      `;
      return;
    }

    reviewsHistory.forEach(item => {
      const scoreColor = getScoreColorClass(item.overallScore);
      const card = document.createElement('div');
      card.className = 'history-card';
      card.setAttribute('data-id', item.id);

      card.innerHTML = `
        <div class="history-card-header">
          <span class="history-role" title="${item.fileName}">${item.fileName}</span>
          <span class="history-score-badge ${scoreColor}" style="border: 1px solid currentColor;">${item.overallScore}%</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top:0.25rem;">
          <span class="history-date">${item.industry.toUpperCase()}</span>
          <span class="history-date">${item.date.split(',')[0]}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        currentReview = item;
        renderReport(item);

        // Hide upload view if open
        inputSection.style.display = 'none';
        reportContainer.style.display = 'flex';

        // Highlight active sidebar review item visually
        document.querySelectorAll('.history-card').forEach(c => c.style.borderColor = 'var(--border-color)');
        card.style.borderColor = 'var(--accent-primary)';
      });

      historyList.appendChild(card);
    });
  }

  function clearAllHistory() {
    if (confirm('Clear all stored CV reviews? This cannot be undone.')) {
      localStorage.removeItem('resume_reviewer_history');
      reviewsHistory = [];
      loadHistory();
      resetForm();
    }
  }

  // --- RESET FORM ---
  function resetForm() {
    removeUploadedFile();
    jobDescText.value = '';
    jobRoleSelect.selectedIndex = 0;
    inputSection.style.display = 'grid';
    reportContainer.style.display = 'none';
    analyzerLoader.style.display = 'none';
    currentReview = null;
    checkButtonState();

    // Reset visual sidebar highlights
    document.querySelectorAll('.history-card').forEach(c => c.style.borderColor = 'var(--border-color)');
  }

  // --- AI FEEDBACK API INTEGRATION (DEEP CRITIQUE) ---
  async function requestAiCritique() {
    if (!currentReview) return;

    aiLoader.style.display = 'flex';
    aiResultBox.style.display = 'none';
    btnRequestAiReview.disabled = true;

    // Simulate high-quality local analysis critique
    setTimeout(() => {
      const localAiText = generateLocalMockAiCritique(currentReview);
      aiResultBox.textContent = localAiText; aiLoader.style.display = 'none';
      aiResultBox.style.display = 'block';
      btnRequestAiReview.disabled = false;
      lucide.createIcons();
    }, 1200);
  }

  function generateLocalMockAiCritique(review) {
    const roleCapitalized = review.industry.charAt(0).toUpperCase() + review.industry.slice(1);

    let html = `
      <h4>1. Strategic Executive Evaluation</h4>
      <p>Your resume matches the target <strong>${roleCapitalized} Developer</strong> description with a score of <strong>${review.overallScore}%</strong>. The document has a professional presentation, but currently lacks immediate focus, which might lead recruiters to skip reading. Bullet points must focus on business value and user impact instead of just detailing technical tasks. Adding a strong Summary statement at the top of the resume would improve initial readability.</p>
    `;

    html += `<h4>2. Technical Skills Checklist Gaps</h4><ul>`;
    if (review.missingSkills.length > 0) {
      review.missingSkills.slice(0, 5).forEach(skill => {
        html += `<li><strong>${skill.toUpperCase()}:</strong> Explicitly requested in the job description. Insert details of a past project or environment where you utilized this technology to pass ATS parameters.</li>`;
      });
    } else {
      html += `<li>Your resume is technically solid and matches all target industry core keywords! Focus on showcasing achievements and scale next.</li>`;
    }
    html += `</ul>`;

    html += `<h4>3. Concrete Bullet Action Upgrades</h4><ul>`;

    // Construct realistic modifications based on grammar warnings or simple bullet structures
    if (review.industry === 'frontend' || review.industry === 'fullstack') {
      html += `
        <li>
          <em>Original:</em> "Responsible for creating UI components using React and HTML."<br>
          <strong style="color:var(--accent-success);">Upgrade:</strong> "Architected and delivered 15+ modular React components, boosting front-end load speed by 35% and improving mobile responsive layout scores."
        </li>
        <li>
          <em>Original:</em> "Worked on fixing bugs and writing code tests."<br>
          <strong style="color:var(--accent-success);">Upgrade:</strong> "Spearheaded code refactoring and integrated Cypress test suites, decreasing regression bug rates by 22% in critical production pipelines."
        </li>
      `;
    } else if (review.industry === 'datascience') {
      html += `
        <li>
          <em>Original:</em> "Worked on data extraction and model building using Python."<br>
          <strong style="color:var(--accent-success);">Upgrade:</strong> "Designed high-throughput ETL data pipelines in Python, increasing feature extraction speeds by 40% and training models with 92% precision scores."
        </li>
      `;
    } else {
      html += `
        <li>
          <em>Original:</em> "Responsible for implementing features and fixing code bases."<br>
          <strong style="color:var(--accent-success);">Upgrade:</strong> "Spearheaded release of 4 core modules using standard backend patterns, reducing database response latency by 18%."
        </li>
      `;
    }
    html += `</ul>`;

    html += `<h4>4. ATS Formatting Warnings</h4><ul>`;
    const formatIssues = review.checklistItems.filter(item => !item.status);
    if (formatIssues.length > 0) {
      formatIssues.forEach(issue => {
        html += `<li><strong>Missing Check:</strong> Your resume text does not seem to contain: <em>"${issue.name}"</em>. High-performing ATS scanners parse files for standard labels. Make sure these headings are in clear textual forms without image filters.</li>`;
      });
    } else {
      html += `<li>Formatting passes all standard structural index tests! Ensure you save the file as a text-searchable PDF and avoid using nested layout boxes or graphic tables which can confuse parses.</li>`;
    }
    html += `</ul>`;

    return html;
  }

  // --- PDF EXPORT FUNCTION ---
  function exportToPdf() {
    if (!currentReview) return;

    // Configure html2pdf parameters
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `CV_Review_Report_${currentReview.fileName.split('.')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Temporarily apply printing classes or styles to make PDF render beautifully
    const element = document.createElement('div');
    element.style.color = '#1e293b';
    element.style.fontFamily = 'var(--font-body)';
    element.style.padding = '20px';
    element.style.background = '#ffffff';

    // Build dedicated HTML structure for printing
    element.replaceChildren();

    const titleBox = document.createElement("div");
    titleBox.style.cssText = "border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px;";

    const h1 = document.createElement("h1");
    h1.style.cssText = "color: #4f46e5; margin: 0; font-size: 24px; font-family: 'Outfit', sans-serif;";
    h1.textContent = "CV Genius - ATS Review Report";

    const p = document.createElement("p");
    p.style.cssText = "margin: 5px 0 0 0; color: #64748b; font-size: 12px;";
    p.textContent = `Generated on ${currentReview.date} for file: ${currentReview.fileName}`;

    titleBox.append(h1, p);
    element.appendChild(titleBox);

    const scoreBox = document.createElement("div");
    scoreBox.style.cssText = "display: flex; gap: 20px; margin-bottom: 25px;";

    [
      ["Overall Score", `${currentReview.overallScore}%`, "#4f46e5"],
      ["ATS Compliance", `${currentReview.atsScore}%`, "#0891b2"],
      ["Skills Match", `${currentReview.skillsScore}%`, "#059669"]
    ].forEach(([label, value, color]) => {
      const card = document.createElement("div");
      card.style.cssText = "border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; flex: 1; text-align: center;";

      const heading = document.createElement("h4");
      heading.style.cssText = "margin: 0 0 5px 0; color: #64748b; font-size: 11px; text-transform: uppercase;";
      heading.textContent = label;

      const span = document.createElement("span");
      span.style.cssText = `font-size: 28px; font-weight: 800; color: ${color};`;
      span.textContent = value;

      card.append(heading, span);
      scoreBox.appendChild(card);
    });

    element.appendChild(scoreBox);

    // Download PDF
    html2pdf().set(opt).from(element).save();
  }

});
