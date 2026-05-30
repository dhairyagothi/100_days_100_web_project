const fileInput = document.getElementById("fileInput");
const outputDiv = document.getElementById("output");
const imagePreview = document.getElementById("imagePreview");
const pdfCanvas = document.getElementById("pdfCanvas");
const loader = document.getElementById("loader");
const languageSelect = document.getElementById("languageSelect");
const downloadBtn = document.getElementById("downloadBtn");
const dropArea = document.getElementById("dropArea");
const browseBtn = document.getElementById("browseBtn");

let extractedText = "";
/*Browse Button*/
browseBtn.addEventListener("click", () => {
  fileInput.click();
});

/*Drag and Drop*/
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("bg-white/20");
});
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("bg-white/20");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("bg-white/20");
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
  }
});
/*Main OCR Function*/
async function convertFile() {
  const file = fileInput.files[0];
  if (!file) {
    outputDiv.innerText = "Please upload an image or PDF file.";
    return;
  }
  const language = languageSelect.value;
  loader.classList.remove("hidden");
  outputDiv.innerText = "Processing...";
  extractedText = "";
  try {
    if (file.type === "application/pdf") {
      await processPDF(file, language);
    } else {
      await processImage(file, language);
    }
    downloadBtn.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    outputDiv.innerText = "Error processing file.";
  } finally {
    loader.classList.add("hidden");
  }
}

/*Process Image*/
async function processImage(file, language) {
  showImagePreview(file);
  const {
    data: { text },
  } = await Tesseract.recognize(file, language, {
    logger: (m) => {
      if (m.status === "recognizing text") {
        outputDiv.innerText =
          "OCR Progress: " + Math.round(m.progress * 100) + "%";
      }
    },
  });
  extractedText = text;
  outputDiv.innerText = text;
}

/*Process PDF*/
async function processPDF(file, language) {
  imagePreview.classList.add("hidden");
  pdfCanvas.classList.remove("hidden");
  const fileReader = new FileReader();
  fileReader.onload = async function () {
    const typedArray = new Uint8Array(this.result);
    const pdf = await pdfjsLib.getDocument(typedArray).promise;
    let finalText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      outputDiv.innerText = `Processing PDF Page ${pageNum}...`;
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = pdfCanvas;
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      const {
        data: { text },
      } = await Tesseract.recognize(canvas, language);
      finalText += `\n\n--- Page ${pageNum} ---\n\n`;
      finalText += text;
    }
    extractedText = finalText;
    outputDiv.innerText = finalText;
  };
  fileReader.readAsArrayBuffer(file);
}
/*Image Preview*/
function showImagePreview(file) {
  pdfCanvas.classList.add("hidden");
  imagePreview.src = URL.createObjectURL(file);
  imagePreview.classList.remove("hidden");
}

/*Download Text*/
downloadBtn.addEventListener("click", () => {
  if (!extractedText) return;
  const blob = new Blob([extractedText], {
    type: "text/plain",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "extracted-text.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
