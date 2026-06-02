const userInput = document.getElementById("userInput");
const themeToggle = document.getElementById("themeToggle");
const pagesContainer = document.getElementById("pagesContainer");
const soundToggle = document.getElementById("soundToggle");
const pageCounter = document.getElementById("pageCounter");
const downloadPDF = document.getElementById("downloadPDF");
const copyBtn = document.getElementById("copyBtn");
const pasteBtn = document.getElementById("pasteBtn");
const importTxtBtn = document.getElementById("importTxtBtn");
const txtFileInput = document.getElementById("txtFileInput");
const wordCountEl = document.getElementById("wordCount");
const charCountEl = document.getElementById("charCount");
let audioCtx;
let currentPage = 0;
let paperContent = "";
let soundEnabled = true;
let capsLockEnabled = false;
let capsLockKey;
let shiftEnabled = false; // tracks on-screen SHIFT state (one-shot)
let shiftKeyEl; // reference to the on-screen SHIFT button

document.addEventListener("DOMContentLoaded", () => {
  capsLockKey = document.querySelector(".caps-lock");
  shiftKeyEl = document.querySelector(".shift-key");

  /* ---------- Onscreen Keys ---------- */
  document.querySelectorAll(".key").forEach((key) => {
    key.onclick = () => {
      const ch = key.dataset.char;
      if (ch === "BACKSPACE") {
        deleteCharFromPaper();
        return;
      }
      if (ch === "ENTER") {
        paperContent += "\n";
        getCurrentText().textContent = paperContent;
        playReturn();
        updateCopyButtonState();
        updateCounters();
        return;
      }
      if (ch === "SPACE") {
        addCharToPaper(" ");
        resetShift();
        return;
      }
      if (ch === "TAB") {
        // Tab inserts four spaces on the paper (classic typewriter behaviour)
        addCharToPaper("    ");
        return;
      }
      if (ch === "CAPSLOCK") {
        capsLockEnabled = !capsLockEnabled;
        capsLockKey.setAttribute("aria-pressed", capsLockEnabled);
        capsLockKey.classList.toggle("pressed", capsLockEnabled);
        return;
      }
      if (ch === "SHIFT") {
        // One-shot toggle: highlight stays until next character is typed
        shiftEnabled = !shiftEnabled;
        shiftKeyEl.setAttribute("aria-pressed", shiftEnabled);
        shiftKeyEl.classList.toggle("pressed", shiftEnabled);
        return;
      }

      // ---- Dual-character keys (numbers row + symbol rows) ----
      const shiftChar = key.dataset.shift;
      if (shiftChar !== undefined) {
        // For these keys, CapsLock has NO effect — only SHIFT matters
        const charToAdd = shiftEnabled ? shiftChar : ch;
        addCharToPaper(charToAdd);
        resetShift();
        return;
      }

      // ---- Letter keys: apply CapsLock XOR Shift ----
      const shouldBeUpper = capsLockEnabled !== shiftEnabled;
      addCharToPaper(shouldBeUpper ? ch.toUpperCase() : ch.toLowerCase());
      resetShift();
    };
  });
});

/* ---------- Pages ---------- */

function getCurrentText() {
  return document.querySelectorAll(".typewriterText")[currentPage];
}

function createPage() {
  paperContent = "";
  currentPage++;
  const page = document.createElement("div");
  page.className = "paper-sheet page";
  page.innerHTML = `<span class="typewriterText"></span><span class="cursor-paper"></span>`;
  pagesContainer.appendChild(page);
  pageCounter.innerText = `Page ${currentPage + 1}`;
}

/* ---------- AUDIO ---------- */

function getAudioCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }
  return audioCtx;
}

function playClick(noiseVol, freq1, freq2, dur) {
  if (!soundEnabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.setValueAtTime(freq1, now);
  osc.frequency.exponentialRampToValueAtTime(freq2, now + dur);
  gain.gain.setValueAtTime(noiseVol, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
  osc.start(now);
  osc.stop(now + dur);
}

function playKeyClick() {
  playClick(0.55, 900, 200, 0.035);
}

function playHeavyKey() {
  playClick(0.4, 140, 75, 0.12);
}

function playSpaceClick() {
  playHeavyKey();
}

function playReturn() {
  playHeavyKey();
}

function playBackspace() {
  playHeavyKey();
}

/* ---------- Typing ---------- */

function addCharToPaper(ch) {
  paperContent += ch;
  getCurrentText().textContent = paperContent;
  if (ch === " ") {
    playSpaceClick();
    flashKey("SPACE");
  } else {
    playKeyClick();
    if (ch !== "\n") {
      if (ch === "    ") {
        flashKey("TAB");
      } else {
        flashKey(ch.toUpperCase());
      }
    }
  }

  /* check actual page overflow */
  let page = document.querySelectorAll(".paper-sheet")[currentPage];
  if (page.scrollHeight > page.clientHeight) {
    /* create new page */
    createPage();
    /* continue typing on new page */
    paperContent = "";
    getCurrentText().textContent = paperContent;
  }

  updateCopyButtonState();
  updateCounters();
}

function resetShift() {
  if (!shiftEnabled) return;
  shiftEnabled = false;
  if (shiftKeyEl) {
    shiftKeyEl.setAttribute("aria-pressed", false);
    shiftKeyEl.classList.remove("pressed");
  }
}

function deleteCharFromPaper() {
  if (paperContent.length === 0) return;
  paperContent = paperContent.slice(0, -1);
  getCurrentText().textContent = paperContent;
  playBackspace();
  updateCopyButtonState();
  updateCounters();
}

/* ---------- Flash ---------- */

function flashKey(char) {
  const key = document.querySelector(`.key[data-char="${char}"]`);
  if (!key) return;
  key.classList.add("pressed");
  setTimeout(() => {
    key.classList.remove("pressed");
  }, 130);
}

/* ---------- Keyboard ---------- */
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
    e.preventDefault();

    navigator.clipboard.readText().then((text) => {
      if (!text.trim()) return;

      paperContent += "\n" + text;
      getCurrentText().textContent = paperContent;

      updateCopyButtonState();
      updateCounters();

      showPdfToast("Text pasted successfully!");
    });

    return;
  }
  if (e.key === "Backspace") {
    e.preventDefault();
    deleteCharFromPaper();
    flashKey("BACKSPACE");
    return;
  }
  if (e.key === "Enter") {
    e.preventDefault();
    paperContent += "\n";
    getCurrentText().textContent = paperContent;
    playReturn();
    flashKey("ENTER");
    updateCopyButtonState();
    updateCounters();
    return;
  }
  if (e.key === "CapsLock") {
    e.preventDefault();
    capsLockEnabled = !capsLockEnabled;
    if (capsLockKey) {
      capsLockKey.setAttribute("aria-pressed", capsLockEnabled);
      capsLockKey.classList.toggle("pressed", capsLockEnabled);
    }
    return;
  }
  if (e.key === " ") {
    e.preventDefault();
    addCharToPaper(" ");
    return;
  }
  if (e.key === "Tab") {
    e.preventDefault();
    addCharToPaper("    "); // 4 spaces = one tab stop
    flashKey("TAB");
    return;
  }

  if (e.key.length === 1) {
    e.preventDefault();
    // e.shiftKey tells us if Shift is held at the moment of the keypress.
    // CapsLock XOR Shift gives the correct case behaviour:
    const shouldBeUpper = capsLockEnabled !== e.shiftKey; // XOR
    const charToAdd = shouldBeUpper ? e.key.toUpperCase() : e.key.toLowerCase();
    addCharToPaper(charToAdd);
  }
});

/* ---------- Sound Toggle ---------- */

soundToggle.onclick = () => {
  soundEnabled = !soundEnabled;
  soundToggle.innerText = soundEnabled ? "🔊 Sound ON" : "🔇 Sound OFF";
};

/* ---------- PDF ---------- */

// Toast notification helper
const pdfToast = document.getElementById("pdfToast");
function showPdfToast(msg, isSuccess = true) {
  if (!pdfToast) return;
  pdfToast.textContent = msg;
  pdfToast.classList.add("show");

  if (isSuccess) {
    pdfToast.style.border = "1px solid rgba(59, 130, 246, 0.4)";
    pdfToast.style.background = "rgba(15, 23, 42, 0.95)";
  } else {
    pdfToast.style.border = "1px solid rgba(239, 68, 68, 0.4)";
    pdfToast.style.background = "rgba(28, 10, 10, 0.95)";
  }

  setTimeout(() => {
    pdfToast.classList.remove("show");
  }, 3000);
}

// Carriage Bar Reset Button
const clearPaperBtn = document.getElementById("clearPaperBtn");
if (clearPaperBtn) {
  clearPaperBtn.addEventListener("click", () => {
    const fullText = getAllTextFromAllPages();
    if (fullText.trim().length === 0) {
      showPdfToast("Paper is already clean!");
      return;
    }
    if (confirm("Are you sure you want to clear all typed paper pages?")) {
      pagesContainer.innerHTML = `
                <div class="paper-sheet page active-page">
                    <span class="typewriterText"></span>
                    <span class="cursor-paper"></span>
                </div>
            `;
      currentPage = 0;
      paperContent = "";
      userInput.value = "";
      pageCounter.innerText = "Page 1";
      updateCopyButtonState();
      updateCounters();
      showPdfToast("All pages cleared!");
      playHeavyKey();
    }
  });
}

// Premium Themed PDF Export
function exportThemedPDF() {
  const fullText = getAllTextFromAllPages();
  if (fullText.trim().length === 0) {
    showPdfToast("Type some text first before exporting!", false);
    return;
  }

  showPdfToast("Generating styled PDF...");

  setTimeout(() => {
    try {
      // Robust cross-version resolution of the jsPDF constructor
      let jsPDFClass = null;
      if (typeof window !== "undefined") {
        if (window.jspdf && window.jspdf.jsPDF) {
          jsPDFClass = window.jspdf.jsPDF;
        } else if (window.jsPDF) {
          jsPDFClass = window.jsPDF;
        }
      }

      if (!jsPDFClass) {
        showPdfToast(
          "PDF library (jsPDF) not loaded yet. Check your connection!",
          false,
        );
        return;
      }

      const doc = new jsPDFClass({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      const themeElem = document.getElementById("pdfTheme");
      const titleElem = document.getElementById("pdfTitle");
      const authorElem = document.getElementById("pdfAuthor");

      const selectedTheme = themeElem ? themeElem.value : "vintage";
      const docTitle = titleElem ? titleElem.value.trim() : "";
      const docAuthor = authorElem ? authorElem.value.trim() : "";

      // Adjust layout parameters based on template theme
      let marginLeft = 20;
      let marginRight = 20;
      let marginTop = 35;
      let marginBottom = 25;

      let bgRGB = [253, 251, 247];
      let inkRGB = [45, 45, 45];
      let fontName = "courier";
      let fontStyle = "normal";
      let lineSpacing = 8.5;

      if (selectedTheme === "vintage") {
        bgRGB = [253, 248, 240];
        inkRGB = [62, 46, 32];
        fontName = "courier";
        lineSpacing = 9.0;
      } else if (selectedTheme === "editorial") {
        bgRGB = [255, 255, 255];
        inkRGB = [31, 31, 31];
        fontName = "times";
        lineSpacing = 7.5;
        marginTop = 38;
      } else if (selectedTheme === "modern") {
        bgRGB = [250, 249, 246];
        inkRGB = [15, 23, 42];
        fontName = "helvetica";
        lineSpacing = 8.0;
        marginLeft = 24;
      }

      const contentWidth = pageWidth - marginLeft - marginRight;
      let pageNum = 1;

      // Header, border, and footer graphics builder
      function drawPageTemplate(currentPNum) {
        doc.setFillColor(bgRGB[0], bgRGB[1], bgRGB[2]);
        doc.rect(0, 0, pageWidth, pageHeight, "F");

        if (selectedTheme === "vintage") {
          doc.setDrawColor(140, 110, 85);
          doc.setLineWidth(0.4);
          doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
          doc.rect(11.5, 11.5, pageWidth - 23, pageHeight - 23);

          doc.setFillColor(140, 110, 85);
          doc.rect(9, 9, 6, 2, "F");
          doc.rect(9, 9, 2, 6, "F");
          doc.rect(pageWidth - 15, 9, 6, 2, "F");
          doc.rect(pageWidth - 11, 9, 2, 6, "F");
          doc.rect(9, pageHeight - 11, 6, 2, "F");
          doc.rect(9, pageHeight - 15, 2, 6, "F");
          doc.rect(pageWidth - 15, pageHeight - 11, 6, 2, "F");
          doc.rect(pageWidth - 11, pageHeight - 15, 2, 6, "F");

          doc.setFont("courier", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(140, 110, 85);
          doc.text("— TYPEWRITER MANUSCRIPT —", pageWidth / 2, 17, {
            align: "center",
          });

          doc.setFont("courier", "normal");
          doc.text(`- Page ${currentPNum} -`, pageWidth / 2, pageHeight - 14, {
            align: "center",
          });

          if (currentPNum === 1) {
            doc.setDrawColor(162, 72, 87);
            doc.setLineWidth(0.6);
            doc.circle(pageWidth - 30, pageHeight - 34, 12, "S");
            doc.circle(pageWidth - 30, pageHeight - 34, 10, "S");

            doc.setFont("courier", "bold");
            doc.setFontSize(7);
            doc.setTextColor(162, 72, 87);

            const today = new Date();
            const stampDate = today.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });
            doc.text(
              stampDate.toUpperCase(),
              pageWidth - 30,
              pageHeight - 32.5,
              { align: "center" },
            );
          }
        } else if (selectedTheme === "editorial") {
          doc.setDrawColor(40, 40, 40);
          doc.setLineWidth(0.4);
          doc.rect(12, 12, pageWidth - 24, pageHeight - 24);
          doc.setLineWidth(0.2);
          doc.rect(13.2, 13.2, pageWidth - 26.4, pageHeight - 26.4);

          doc.setFont("times", "italic");
          doc.setFontSize(9.5);
          doc.setTextColor(80, 80, 80);
          doc.text("From the Desk of the Author", pageWidth / 2, 20, {
            align: "center",
          });

          doc.setDrawColor(160, 160, 160);
          doc.setLineWidth(0.2);
          doc.line(35, 23, pageWidth - 35, 23);

          doc.setFont("times", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(80, 80, 80);
          doc.text(`Page ${currentPNum}`, pageWidth - 20, pageHeight - 16, {
            align: "right",
          });

          const today = new Date().toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          });
          doc.text(today, 20, pageHeight - 16);
        } else if (selectedTheme === "modern") {
          doc.setFillColor(59, 130, 246);
          doc.rect(12, 12, 4, pageHeight - 24, "F");

          doc.setFont("helvetica", "bold");
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139);
          doc.text("TYPEWRITER CORE // FRONTEND LABS", 22, 18);

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          doc.text(
            `${currentPNum.toString().padStart(2, "0")}`,
            pageWidth - 20,
            pageHeight - 16,
            { align: "right" },
          );

          const today = new Date().toLocaleDateString();
          doc.text(`EXPORT DATE: ${today}`, 22, pageHeight - 16);
        }
      }

      drawPageTemplate(pageNum);

      let currentY = marginTop;
      if (docTitle || docAuthor) {
        if (selectedTheme === "vintage") {
          if (docTitle) {
            doc.setFont("courier", "bold");
            doc.setFontSize(20);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            doc.text(docTitle.toUpperCase(), pageWidth / 2, currentY, {
              align: "center",
            });
            currentY += 10;
          }
          if (docAuthor) {
            doc.setFont("courier", "italic");
            doc.setFontSize(11);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            doc.text(`by ${docAuthor}`, pageWidth / 2, currentY, {
              align: "center",
            });
            currentY += 8;
          }
          doc.setDrawColor(140, 110, 85);
          doc.setLineWidth(0.3);
          doc.line(
            marginLeft + 15,
            currentY,
            pageWidth - marginRight - 15,
            currentY,
          );
          currentY += 12;
        } else if (selectedTheme === "editorial") {
          if (docTitle) {
            doc.setFont("times", "bold");
            doc.setFontSize(22);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            doc.text(docTitle, pageWidth / 2, currentY, { align: "center" });
            currentY += 10;
          }
          if (docAuthor) {
            doc.setFont("times", "italic");
            doc.setFontSize(12);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            doc.text(`Written by ${docAuthor}`, pageWidth / 2, currentY, {
              align: "center",
            });
            currentY += 8;
          }
          doc.setDrawColor(60, 60, 60);
          doc.setLineWidth(0.4);
          doc.line(
            marginLeft + 10,
            currentY,
            pageWidth - marginRight - 10,
            currentY,
          );
          doc.setLineWidth(0.15);
          doc.line(
            marginLeft + 10,
            currentY + 1.0,
            pageWidth - marginRight - 10,
            currentY + 1.0,
          );
          currentY += 12;
        } else if (selectedTheme === "modern") {
          if (docTitle) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(24);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            doc.text(docTitle, marginLeft + 2, currentY);
            currentY += 10;
          }
          if (docAuthor) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(100, 116, 139);
            doc.text(`By ${docAuthor}`, marginLeft + 2, currentY);
            currentY += 8;
          }
          doc.setFillColor(226, 232, 240);
          doc.rect(marginLeft + 2, currentY, contentWidth - 4, 1.2, "F");
          currentY += 12;
        }
      }

      const paragraphs = fullText.split("\n");
      doc.setFont(fontName, fontStyle);
      doc.setFontSize(selectedTheme === "vintage" ? 12 : 11);
      doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);

      paragraphs.forEach((pText) => {
        if (pText.trim() === "") {
          currentY += lineSpacing;
          if (currentY > pageHeight - marginBottom) {
            doc.addPage();
            pageNum++;
            drawPageTemplate(pageNum);
            doc.setFont(fontName, fontStyle);
            doc.setFontSize(selectedTheme === "vintage" ? 12 : 11);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            currentY = marginTop - 10;
          }
          return;
        }

        const lines = doc.splitTextToSize(pText, contentWidth);
        lines.forEach((line) => {
          if (selectedTheme === "modern") {
            doc.text(line, marginLeft + 2, currentY);
          } else {
            doc.text(line, marginLeft, currentY);
          }
          currentY += lineSpacing;

          if (currentY > pageHeight - marginBottom) {
            doc.addPage();
            pageNum++;
            drawPageTemplate(pageNum);
            doc.setFont(fontName, fontStyle);
            doc.setFontSize(selectedTheme === "vintage" ? 12 : 11);
            doc.setTextColor(inkRGB[0], inkRGB[1], inkRGB[2]);
            currentY = marginTop - 10;
          }
        });
      });

      doc.setProperties({
        title: docTitle || "Typewriter Manuscript",
        author: docAuthor || "Typewriter Artist",
        creator: "100 Days 100 Web Projects",
      });

      const filename =
        (docTitle
          ? docTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")
          : "manuscript") + ".pdf";
      doc.save(filename);
      showPdfToast("Downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error: ", err);
      showPdfToast("Failed to generate PDF: " + err.message, false);
    }
  }, 400);
}

// Hook up both PDF download buttons
const exportPdfBtn = document.getElementById("exportPdfBtn");
if (exportPdfBtn) exportPdfBtn.onclick = exportThemedPDF;
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
});

// Paste Text Feature
if (pasteBtn) {
  pasteBtn.addEventListener("click", async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (!text.trim()) {
        alert("Clipboard is empty!");
        return;
      }

      paperContent += text;
      getCurrentText().textContent = paperContent;

      updateCopyButtonState();
      updateCounters();

      showPdfToast("Text pasted successfully!");
    } catch (err) {
      console.error(err);
      alert("Unable to access clipboard.");
    }
  });
}

// Import TXT Feature
if (importTxtBtn && txtFileInput) {
  importTxtBtn.addEventListener("click", () => {
    txtFileInput.click();
  });

  txtFileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      paperContent += event.target.result;
      getCurrentText().textContent = paperContent;

      updateCopyButtonState();
      updateCounters();

      showPdfToast("Text file imported successfully!");
    };

    reader.readAsText(file);
  });
}
