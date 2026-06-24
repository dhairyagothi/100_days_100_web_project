const fileInput = document.getElementById("fileInput");
const outputDiv = document.getElementById("output");
const outputTextarea = document.getElementById("outputTextarea");
const imagePreview = document.getElementById("imagePreview");
const pdfCanvas = document.getElementById("pdfCanvas");
const langSelect = document.getElementById("langSelect");
const downloadBtn = document.getElementById("downloadBtn");
const processBtn = document.getElementById("processBtn");

const ocrProgress = document.getElementById("ocrProgress");
const progressFill = document.getElementById("progressFill");
const progressStatus = document.getElementById("progressStatus");

const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const fileMetadata = document.getElementById("fileMetadata");
const fileDetails = document.getElementById("fileDetails");
const previewPlaceholder = document.getElementById("previewPlaceholder");

const statsSection = document.getElementById("statsSection");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const readingTime = document.getElementById("readingTime");
const ocrAccuracy = document.getElementById("ocrAccuracy");

const ttsPanel = document.getElementById("ttsPanel");
const speechStatus = document.getElementById("speechStatus");
const voiceSelect = document.getElementById("voiceSelect");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");
const rateSlider = document.getElementById("rateSlider");
const pitchSlider = document.getElementById("pitchSlider");

let selectedFile = null;
let synth = window.speechSynthesis;
let voices = [];

function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";
    voices.forEach((voice) => {
        const option = document.createElement("option");
        option.textContent = `${voice.name} (${voice.lang})`;
        option.setAttribute("data-lang", voice.lang);
        option.setAttribute("data-name", voice.name);
        voiceSelect.appendChild(option);
    });
}

if (synth) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
}

if (fileInput && fileInput.parentNode) {
    fileInput.parentNode.addEventListener("click", (e) => {
        if (e.target !== fileInput) {
            fileInput.click();
        }
    });

    fileInput.parentNode.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileInput.parentNode.classList.add("drag-over");
    });

    fileInput.parentNode.addEventListener("dragleave", () => {
        fileInput.parentNode.classList.remove("drag-over");
    });

    fileInput.parentNode.addEventListener("drop", (e) => {
        e.preventDefault();
        fileInput.parentNode.classList.remove("drag-over");
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFileSelection(e.dataTransfer.files[0]);
        }
    });
}

fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
        handleFileSelection(e.target.files[0]);
    }
});

function handleFileSelection(file) {
    selectedFile = file;
    if (fileMetadata) fileMetadata.classList.remove("hidden");
    if (fileDetails) {
        fileDetails.innerHTML = `
            <div><strong>Name:</strong> ${file.name}</div>
            <div><strong>Size:</strong> ${(file.size / 1024).toFixed(1)} KB</div>
            <div><strong>Type:</strong> ${file.type || "Unknown"}</div>
        `;
    }
    processBtn.disabled = false;
    
    if (previewPlaceholder) previewPlaceholder.classList.add("hidden");
    if (imagePreview) imagePreview.classList.add("hidden");
    if (pdfCanvas) pdfCanvas.classList.add("hidden");

    if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (imagePreview) {
                imagePreview.src = e.target.result;
                imagePreview.classList.remove("hidden");
            }
        };
        reader.readAsDataURL(file);
    } else if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = function (e) {
            const typedarray = new Uint8Array(e.target.result);
            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                pdf.getPage(1).then(page => {
                    const viewport = page.getViewport({ scale: 1.5 });
                    const context = pdfCanvas.getContext("2d");
                    pdfCanvas.height = viewport.height;
                    pdfCanvas.width = viewport.width;
                    page.render({ canvasContext: context, viewport: viewport }).promise.then(() => {
                        if (pdfCanvas) pdfCanvas.classList.remove("hidden");
                    });
                });
            });
        };
        reader.readAsArrayBuffer(file);
    }
}

processBtn.addEventListener("click", async () => {
    if (!selectedFile) return;

    if (ocrProgress) ocrProgress.classList.remove("hidden");
    processBtn.disabled = true;
    if (progressFill) progressFill.value = 10;
    if (progressStatus) progressStatus.textContent = "10% (Initializing)";
    
    try {
        if (selectedFile.type === "application/pdf") {
            if (progressStatus) progressStatus.textContent = "Parsing PDF structure...";
            if (progressFill) progressFill.value = 30;
            
            const reader = new FileReader();
            reader.onload = function (e) {
                const typedarray = new Uint8Array(e.target.result);
                pdfjsLib.getDocument(typedarray).promise.then(async pdf => {
                    let compiledText = "";
                    let totalConfidence = 0;
                    
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        if (progressStatus) progressStatus.textContent = `Processing PDF page ${pageNum} of ${pdf.numPages}...`;
                        if (progressFill) progressFill.value = Math.floor((pageNum / pdf.numPages) * 60) + 30;
                        
                        const page = await pdf.getPage(pageNum);
                        const viewport = page.getViewport({ scale: 2.0 });
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        
                        const worker = await Tesseract.createWorker(langSelect.value);
                        const { data: { text, confidence } } = await worker.recognize(canvas.toDataURL());
                        compiledText += `\n\n--- Page ${pageNum} ---\n\n` + text;
                        totalConfidence += confidence;
                        await worker.terminate();
                    }
                    
                    if (progressFill) progressFill.value = 100;
                    if (progressStatus) progressStatus.textContent = "100% (Complete)";
                    
                    if (outputTextarea) outputTextarea.value = compiledText;
                    if (outputDiv) outputDiv.innerText = compiledText;
                    
                    if (ocrAccuracy) ocrAccuracy.textContent = `${Math.round(totalConfidence / pdf.numPages)}%`;
                    if (statsSection) statsSection.classList.remove("hidden");
                    updateAnalytics(compiledText);
                    toggleTtsPanel(compiledText);
                    if (downloadBtn) downloadBtn.classList.remove("hidden");
                    processBtn.disabled = false;
                });
            };
            reader.readAsArrayBuffer(selectedFile);
            return;
        }

        const reader = new FileReader();
        reader.onload = async function() {
            const img = new Image();
            img.onload = async function() {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = img.width * 2;
                canvas.height = img.height * 2;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
                    const binary = brightness > 128 ? 255 : 0;
                    data[i] = binary;
                    data[i + 1] = binary;
                    data[i + 2] = binary;
                }
                ctx.putImageData(imgData, 0, 0);

                if (progressStatus) progressStatus.textContent = "40% (Booting OCR Engine)";
                if (progressFill) progressFill.value = 40;

                const worker = await Tesseract.createWorker(langSelect.value);
                
                if (progressStatus) progressStatus.textContent = "70% (Running Engine Recognition)";
                if (progressFill) progressFill.value = 70;

                const { data: { text, confidence } } = await worker.recognize(canvas.toDataURL());
                
                if (progressFill) progressFill.value = 100;
                if (progressStatus) progressStatus.textContent = "100% (Complete)";
                
                if (outputTextarea) outputTextarea.value = text;
                if (outputDiv) outputDiv.innerText = text;
                
                if (ocrAccuracy) ocrAccuracy.textContent = `${confidence}%`;
                if (statsSection) statsSection.classList.remove("hidden");
                updateAnalytics(text);
                toggleTtsPanel(text);
                if (downloadBtn) downloadBtn.classList.remove("hidden");
                
                await worker.terminate();
                processBtn.disabled = false;
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(selectedFile);

    } catch (error) {
        if (progressStatus) progressStatus.textContent = "Error occurred during processing.";
        processBtn.disabled = false;
    }
});

function updateAnalytics(text) {
    const fallbackVal = outputTextarea ? outputTextarea.value : (outputDiv ? outputDiv.innerText : "");
    const workingText = text || fallbackVal;
    if (!workingText || workingText.trim() === "" || workingText.startsWith("Upload a file")) {
        if (wordCount) wordCount.textContent = "0";
        if (charCount) charCount.textContent = "0";
        if (readingTime) readingTime.textContent = "0m";
        return;
    }
    const cleanText = workingText.trim();
    const words = cleanText.split(/\s+/).filter(w => w.length > 0).length;
    const chars = cleanText.length;
    const time = Math.ceil(words / 200);

    if (wordCount) wordCount.textContent = words;
    if (charCount) charCount.textContent = chars;
    if (readingTime) readingTime.textContent = `${time}m`;
}

function toggleTtsPanel(text) {
    const fallbackVal = outputTextarea ? outputTextarea.value : (outputDiv ? outputDiv.innerText : "");
    const workingText = text || fallbackVal;
    if (workingText && workingText.trim() && !workingText.startsWith("Upload a file") && synth) {
        if (ttsPanel) ttsPanel.classList.remove("hidden");
        if (voiceSelect && voiceSelect.children.length === 0) {
            loadVoices();
        }
    } else {
        if (ttsPanel) ttsPanel.classList.add("hidden");
    }
}

const inputEventElement = outputTextarea || outputDiv;
if (inputEventElement) {
    inputEventElement.addEventListener("input", () => {
        const val = outputTextarea ? outputTextarea.value : outputDiv.innerText;
        updateAnalytics(val);
        toggleTtsPanel(val);
    });
}

if (copyBtn) {
    copyBtn.addEventListener("click", () => {
        const val = outputTextarea ? outputTextarea.value : (outputDiv ? outputDiv.innerText : "");
        if (!val || val.startsWith("Upload a file")) return;
        navigator.clipboard.writeText(val);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = "Copied!";
        setTimeout(() => copyBtn.innerHTML = originalText, 2000);
    });
}

if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
        const val = outputTextarea ? outputTextarea.value : (outputDiv ? outputDiv.innerText : "");
        if (!val || val.startsWith("Upload a file")) return;
        const blob = new Blob([val], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ocr-extracted-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    });
}

if (clearBtn) {
    clearBtn.addEventListener("click", () => {
        const defaultMsg = "Upload a file and click Extract Text to begin...";
        if (outputTextarea) outputTextarea.value = "";
        if (outputDiv) outputDiv.innerText = defaultMsg;
        
        selectedFile = null;
        fileInput.value = "";
        if (fileMetadata) fileMetadata.classList.add("hidden");
        if (ocrProgress) ocrProgress.classList.add("hidden");
        if (statsSection) statsSection.classList.add("hidden");
        if (downloadBtn) downloadBtn.classList.add("hidden");
        if (imagePreview) imagePreview.classList.add("hidden");
        if (pdfCanvas) pdfCanvas.classList.add("hidden");
        if (previewPlaceholder) previewPlaceholder.classList.remove("hidden");
        processBtn.disabled = true;
        if (synth) {
            synth.cancel();
            if (speechStatus) speechStatus.textContent = "Ready to Speak";
        }
        updateAnalytics("");
        toggleTtsPanel("");
    });
}

if (speakBtn) {
    speakBtn.addEventListener("click", () => {
        const val = outputTextarea ? outputTextarea.value : (outputDiv ? outputDiv.innerText : "");
        if (!val || val.startsWith("Upload a file")) return;
        if (synth.speaking && synth.paused) {
            synth.resume();
            if (speechStatus) speechStatus.textContent = "Speaking...";
            return;
        }
        if (synth.speaking) synth.cancel();

        const utterance = new SpeechSynthesisUtterance(val);
        const selectedOption = voiceSelect ? voiceSelect.selectedOptions[0] : null;
        const selectedVoiceName = selectedOption ? selectedOption.getAttribute("data-name") : null;
        
        utterance.voice = voices.find(v => v.name === selectedVoiceName);
        if (rateSlider) utterance.rate = parseFloat(rateSlider.value);
        if (pitchSlider) utterance.pitch = parseFloat(pitchSlider.value);
        
        utterance.onend = () => { if (speechStatus) speechStatus.textContent = "Ready to Speak"; };
        utterance.onerror = () => { if (speechStatus) speechStatus.textContent = "Ready to Speak"; };
        
        if (speechStatus) speechStatus.textContent = "Speaking...";
        synth.speak(utterance);
    });
}

if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            if (speechStatus) speechStatus.textContent = "Paused";
        }
    });
}

if (stopBtn) {
    stopBtn.addEventListener("click", () => {
        if (synth.speaking) {
            synth.cancel();
            if (speechStatus) speechStatus.textContent = "Ready to Speak";
        }
    });
}