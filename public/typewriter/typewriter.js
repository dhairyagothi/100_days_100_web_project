const typewriter = document.querySelector(".text");

const userInput = document.getElementById("userInput");
const addTextButton = document.getElementById("addText");
const deleteTextButton = document.getElementById("deleteText");
const pauseResumeButton = document.getElementById("pauseResume");
const speedSlider = document.getElementById("speedSlider");
const toggleThemeButton = document.getElementById("toggleTheme");
const changeBackgroundButton = document.getElementById("changeBackground");

const defaultPhrases = [
    "Freelancer",
    "Blogger",
    "Developer",
    "Designer",
    "Creator"
];

let phrases = [...defaultPhrases];

let displayedPhrases = [];

let phraseIndex = 0;
let charIndex = 0;

let currentPhrase = "";
let isDeleting = false;

let typingSpeed = 100;

let isPaused = false;

let typingTimeout;

function type() {

    if (isPaused) return;

    currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typewriter.textContent = currentPhrase.slice(0, charIndex--);
    } else {
        typewriter.textContent = currentPhrase.slice(0, charIndex++);
    }

    if (!isDeleting && charIndex === currentPhrase.length + 1) {

        setTimeout(() => {
            isDeleting = true;
        }, 1500);

    } else if (isDeleting && charIndex < 0) {

        isDeleting = false;

        displayedPhrases.push(currentPhrase);

        if (displayedPhrases.length === phrases.length) {
            displayedPhrases = [];
        }
    }

        phraseIndex = (phraseIndex + 1) % phrases.length;

        while (displayedPhrases.includes(phrases[phraseIndex])) {
            phraseIndex = (phraseIndex + 1) % phrases.length;
        }
    }

    typingTimeout = setTimeout(
        type,
        isDeleting ? typingSpeed / 2 : typingSpeed
    );
}

addTextButton.addEventListener("click", () => {

    const newText = userInput.value.trim();

    if (!newText) return;

    if (!phrases.includes(newText)) {

        phrases.push(newText);

        userInput.value = "";

        isPaused = false;
        isDeleting = false;

        charIndex = 0;

        phraseIndex = phrases.length - 1;

        clearTimeout(typingTimeout);

        type();

        pauseResumeButton.textContent = "Pause";
    }
}

deleteTextButton.addEventListener("click", () => {

    if (phrases.length > defaultPhrases.length) {

        const lastPhrase = phrases.pop();

        displayedPhrases = displayedPhrases.filter(
            phrase => phrase !== lastPhrase
        );

        if (phraseIndex >= phrases.length) {
            phraseIndex = 0;
        }
    }

pauseResumeButton.addEventListener("click", () => {

    isPaused = !isPaused;

    pauseResumeButton.textContent = isPaused
        ? "Resume"
        : "Pause";

    if (!isPaused) {
        type();
    } else {
        clearTimeout(typingTimeout);
    }
  }, 400);
}

// ── Export button → format picker modal ────────────────────────────────────
const exportModal        = document.getElementById("exportModal");
const exportModalCancel  = document.getElementById("exportModalCancel");
const exportAsPdfBtn     = document.getElementById("exportAsPdfBtn");
const exportAsTxtBtn     = document.getElementById("exportAsTxtBtn");

function openExportModal()  { if (exportModal) exportModal.classList.add("is-open");    }
function closeExportModal() { if (exportModal) exportModal.classList.remove("is-open"); }

function exportAsTxt() {
  const text = getAllTextFromAllPages();
  if (!text.trim()) {
    showPdfToast("Type some text first before exporting!", false);
    return;
  }
  const titleEl = document.getElementById("pdfTitle");
  const baseName = (titleEl && titleEl.value.trim())
    ? titleEl.value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_")
    : "manuscript";
  const blob = new Blob([text], { type: "text/plain" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = baseName + ".txt";
  a.click();
  URL.revokeObjectURL(url);
  showPdfToast("Plain-text file downloaded!");
}

const exportPdfBtn = document.getElementById("exportPdfBtn");
if (exportPdfBtn) exportPdfBtn.onclick = openExportModal;
if (exportModalCancel) exportModalCancel.addEventListener("click", closeExportModal);
if (exportAsPdfBtn) exportAsPdfBtn.addEventListener("click", () => { closeExportModal(); exportThemedPDF(); });
if (exportAsTxtBtn) exportAsTxtBtn.addEventListener("click", () => { closeExportModal(); exportAsTxt(); });
if (exportModal) exportModal.addEventListener("click", (e) => { if (e.target === exportModal) closeExportModal(); });

// ── Download PDF button → always downloads PDF directly ────────────────────
downloadPDF.onclick = exportThemedPDF;

/* ---------- Theme ---------- */

themeToggle.onclick = () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
};

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "☀️";
}

/* ---------- Style Switcher — live paper font & appearance ---------- */
const pdfThemeSelect = document.getElementById("pdfTheme");
if (pdfThemeSelect) {
  // Apply on change
  pdfThemeSelect.addEventListener("change", () => {
    pagesContainer.setAttribute("data-style", pdfThemeSelect.value);
  });
  // Apply initial value on load (default in HTML select is "vintage")
  pagesContainer.setAttribute("data-style", pdfThemeSelect.value);
}

/* ---------- Word & Character Counters ---------- */

function updateCounters() {
  const fullText = getAllTextFromAllPages();
  const charCount = fullText.length;
  const words = fullText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  wordCountEl.textContent = `Words: ${wordCount}`;
  charCountEl.textContent = `Characters: ${charCount}`;
}

/* ---------- Copy to Clipboard ---------- */

function getAllTextFromAllPages() {
  const allPages = document.querySelectorAll(".typewriterText");
  let fullText = "";
  allPages.forEach((pageText, index) => {
    if (index > 0) {
      fullText += "\n";
    }
    fullText += pageText.textContent;
  });
  return fullText;
}

function updateCopyButtonState() {
  const fullText = getAllTextFromAllPages();
  copyBtn.disabled = fullText.trim() === "";
}

copyBtn.onclick = async () => {
  try {
    const fullText = getAllTextFromAllPages();
    await navigator.clipboard.writeText(fullText);

    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";
    copyBtn.disabled = true;

    setTimeout(() => {
      copyBtn.textContent = originalText;
      updateCopyButtonState();
    }, 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  updateCopyButtonState();
  updateCounters();
  renderPaper();
});

// Paste Text Feature
if (pasteBtn) {
  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();

toggleThemeButton.addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

    const currentTheme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";

    localStorage.setItem("theme", currentTheme);
});

changeBackgroundButton.addEventListener("click", () => {

    const colors = [
        "#1a1a1a",
        "#2a2a2a",
        "#3a3a3a",
        "#4a4a4a",
        "#5a5a5a"
    ];

    const randomColor =
        colors[Math.floor(Math.random() * colors.length)];

    document.body.style.backgroundColor = randomColor;
});

window.addEventListener("load", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }

    type();
});
