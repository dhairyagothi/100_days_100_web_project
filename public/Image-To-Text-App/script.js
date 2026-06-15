const fileInput = document.getElementById("fileInput");
const outputDiv = document.getElementById("output");
const imagePreview = document.getElementById("imagePreview");
const pdfCanvas = document.getElementById("pdfCanvas");
const loader = document.getElementById("loader");
const languageSelect = document.getElementById("languageSelect");
const downloadBtn = document.getElementById("downloadBtn");
const dropArea = document.getElementById("dropArea");
const browseBtn = document.getElementById("browseBtn");

const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const fileName = document.getElementById("fileName");
const previewPlaceholder = document.getElementById("previewPlaceholder");

let extractedText = "";

/* Browse */
browseBtn.addEventListener("click", () => {
  fileInput.click();
});

/* File Change */
fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) {
    fileName.innerText = `Selected: ${fileInput.files[0].name}`;
  }
});

/* Drag & Drop */
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("bg-white/10");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("bg-white/10");
const fileInput = document.getElementById('fileInput');
const outputDiv = document.getElementById('output');
const imagePreview = document.getElementById('imagePreview');
const pdfCanvas = document.getElementById('pdfCanvas');
const loader = document.getElementById('loader');
const languageSelect = document.getElementById('languageSelect');
const downloadBtn = document.getElementById('downloadBtn');
const dropArea = document.getElementById('dropArea');
const browseBtn = document.getElementById('browseBtn');
const ttsControls = document.getElementById('ttsControls');

const playBtn = document.getElementById('playBtn');

const pauseBtn = document.getElementById('pauseBtn');

const resumeBtn = document.getElementById('resumeBtn');

const stopBtn = document.getElementById('stopBtn');

const voiceSelect = document.getElementById('voiceSelect');

const rateControl = document.getElementById('rateControl');

const pitchControl = document.getElementById('pitchControl');

let extractedText = '';
let speechUtterance = null;
let voices = [];

/*Browse Button*/
browseBtn.addEventListener('click', () => {
  fileInput.click();
});

/*Drag and Drop*/
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('bg-white/20');
});
dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('bg-white/20');
});

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();

  dropArea.classList.remove("bg-white/10");

  dropArea.classList.remove('bg-white/20');
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    fileName.innerText = `Selected: ${e.dataTransfer.files[0].name}`;
  }
});

/* Main OCR */
async function convertFile() {
  const file = fileInput.files[0];

  if (!file) {
    outputDiv.innerText = "Please upload a file first.";
    return;
  }

  loader.classList.remove("hidden");
  progressContainer.classList.remove("hidden");

  extractedText = "";
  outputDiv.innerText = "Starting OCR...";

  try {

    if (file.type === "application/pdf") {
      await processPDF(file);
    outputDiv.innerText = 'Please upload an image or PDF file.';
    return;
  }
  const language = languageSelect.value;
  loader.classList.remove('hidden');
  outputDiv.innerText = 'Processing...';
  extractedText = '';
  try {
    if (file.type === 'application/pdf') {
      await processPDF(file, language);
    } else {
      await processImage(file);
    }

    downloadBtn.classList.remove("hidden");

    downloadBtn.classList.remove('hidden');
  } catch (error) {
    console.error(error);
    outputDiv.innerText = 'Error processing file.';
  } finally {
    loader.classList.add('hidden');
  }
}

/* Process Image */
async function processImage(file) {

  showImagePreview(file);

  const language = languageSelect.value;

  const {
    data: { text },
  } = await Tesseract.recognize(file, language, {

    logger: (m) => {

      if (m.status === "recognizing text") {

        const progress = Math.round(m.progress * 100);

        progressBar.style.width = `${progress}%`;
        progressText.innerText = `${progress}%`;

      if (m.status === 'recognizing text') {
        outputDiv.innerText =
          'OCR Progress: ' + Math.round(m.progress * 100) + '%';
      }
    },
  });

  extractedText = text;
  outputDiv.innerText = text;
  ttsControls.classList.remove('hidden');
}

/* Process PDF */
async function processPDF(file) {

  imagePreview.classList.add("hidden");
  pdfCanvas.classList.remove("hidden");
  previewPlaceholder.classList.add("hidden");

/*Process PDF*/
async function processPDF(file, language) {
  imagePreview.classList.add('hidden');
  pdfCanvas.classList.remove('hidden');
  const fileReader = new FileReader();

  fileReader.onload = async function () {

    const typedArray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    let finalText = "";

    let finalText = '';
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {

      outputDiv.innerText = `Processing Page ${pageNum}...`;

      const page = await pdf.getPage(pageNum);

      const viewport = page.getViewport({ scale: 2 });

      const canvas = pdfCanvas;

      const context = canvas.getContext("2d");

      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const {
        data: { text },
      } = await Tesseract.recognize(canvas, languageSelect.value);

      finalText += `\n\n--- Page ${pageNum} ---\n\n`;
      finalText += text;
    }

    extractedText = finalText;
    outputDiv.innerText = finalText;
    ttsControls.classList.remove('hidden');
  };

  fileReader.readAsArrayBuffer(file);
}

/* Preview */
function showImagePreview(file) {

  previewPlaceholder.classList.add("hidden");

  pdfCanvas.classList.add("hidden");

  imagePreview.src = URL.createObjectURL(file);

  imagePreview.classList.remove("hidden");
}

/* Download */
downloadBtn.addEventListener("click", () => {

  pdfCanvas.classList.add('hidden');
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove('hidden');
}

function loadVoices() {
  voices = speechSynthesis.getVoices();

  voiceSelect.innerHTML = '';

  voices.forEach((voice, index) => {
    const option = document.createElement('option');

    option.value = index;

    option.textContent = `${voice.name} (${voice.lang})`;

    voiceSelect.appendChild(option);
  });
}

speechSynthesis.onvoiceschanged = loadVoices;

loadVoices();

playBtn.addEventListener('click', () => {
  if (!extractedText.trim()) return;

  speechSynthesis.cancel();

  speechUtterance = new SpeechSynthesisUtterance(extractedText);

  speechUtterance.rate = parseFloat(rateControl.value);

  speechUtterance.pitch = parseFloat(pitchControl.value);

  speechUtterance.voice = voices[voiceSelect.value];

  speechSynthesis.speak(speechUtterance);
});

pauseBtn.addEventListener('click', () => speechSynthesis.pause());

resumeBtn.addEventListener('click', () => speechSynthesis.resume());

stopBtn.addEventListener('click', () => speechSynthesis.cancel());

/*Download Text*/
downloadBtn.addEventListener('click', () => {
  if (!extractedText) return;

  const blob = new Blob([extractedText], {
    type: 'text/plain',
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "extracted-text.txt";

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'extracted-text.txt';
  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
});

/* Copy */
copyBtn.addEventListener("click", async () => {

  if (!extractedText) return;

  await navigator.clipboard.writeText(extractedText);

  copyBtn.innerText = "Copied!";

  setTimeout(() => {
    copyBtn.innerText = "Copy";
  }, 2000);
});

/* Clear */
clearBtn.addEventListener("click", () => {

  extractedText = "";

  outputDiv.innerText = "Upload a file to begin OCR...";

  imagePreview.classList.add("hidden");

  pdfCanvas.classList.add("hidden");

  previewPlaceholder.classList.remove("hidden");

  fileName.innerText = "";

  progressBar.style.width = "0%";

  progressText.innerText = "0%";

  downloadBtn.classList.add("hidden");
});