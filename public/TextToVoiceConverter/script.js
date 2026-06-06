/* =========================
   ELEMENTS
========================= */

// TEXT TO SPEECH
const textInput = document.getElementById("text-input");
const convertBtn = document.getElementById("convert-btn");
const stopBtnText = document.getElementById("stop-btn-text");
const clearTextBtn = document.getElementById("clear-text");

const ttsLanguage = document.getElementById("tts-language");
const voiceSelect = document.getElementById("voice-select");

const charCount = document.getElementById("char-count");
const speakingStatus = document.getElementById("speaking-status");

// VOICE TO TEXT
const startBtn = document.getElementById("start-btn");
const stopBtnVoice = document.getElementById("stop-btn-voice");
const output = document.getElementById("output");
const sttLanguage = document.getElementById("stt-language");

const listeningStatus = document.getElementById("listening-status");

// OTHER
const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");
const clearOutputBtn = document.getElementById("clear-output");

const themeToggle = document.getElementById("theme-toggle");

/* =========================
   SPEECH SYNTHESIS SETUP
========================= */

const synth = window.speechSynthesis;
let voices = [];

// Load voices (Chrome fix included)
function loadVoices() {
  voices = synth.getVoices();
  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

loadVoices();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices;
}

/* =========================
   CHARACTER COUNT
========================= */

textInput.addEventListener("input", () => {
  charCount.textContent = `Characters: ${textInput.value.length}`;
});

/* =========================
   TEXT → SPEECH
========================= */

convertBtn.addEventListener("click", () => {
  const text = textInput.value.trim();

  if (!text) {
    alert("Please enter text first.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // language
  utterance.lang = ttsLanguage.value;

  // voice selection
  if (voices[voiceSelect.value]) {
    utterance.voice = voices[voiceSelect.value];
  }

  synth.cancel(); // stop previous speech

  synth.speak(utterance);

  speakingStatus.textContent = "🔊 Speaking...";
  convertBtn.disabled = true;
  stopBtnText.disabled = false;

  utterance.onend = () => {
    speakingStatus.textContent = "✅ Finished";
    convertBtn.disabled = false;
    stopBtnText.disabled = true;
  };
});

/* =========================
   STOP SPEECH
========================= */

stopBtnText.addEventListener("click", () => {
  synth.cancel();
  speakingStatus.textContent = "⛔ Stopped";

  convertBtn.disabled = false;
  stopBtnText.disabled = true;
});

/* =========================
   CLEAR TEXT
========================= */

clearTextBtn.addEventListener("click", () => {
  textInput.value = "";
  charCount.textContent = "Characters: 0";
  speakingStatus.textContent = "";
});

/* =========================
   SPEECH → TEXT (RECOGNITION)
========================= */

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    output.value = transcript;
  };

  recognition.onerror = (e) => {
    console.error("Speech recognition error:", e.error);
    listeningStatus.textContent = "❌ Error occurred";
  };

  startBtn.addEventListener("click", () => {
    recognition.lang = sttLanguage.value;
    recognition.start();

    listeningStatus.textContent = "🎤 Listening...";
    startBtn.disabled = true;
    stopBtnVoice.disabled = false;
  });

  stopBtnVoice.addEventListener("click", () => {
    recognition.stop();

    listeningStatus.textContent = "⛔ Stopped";
    startBtn.disabled = false;
    stopBtnVoice.disabled = true;
  });
} else {
  listeningStatus.textContent =
    "❌ Speech Recognition not supported in this browser.";
}

/* =========================
   COPY OUTPUT
========================= */

copyBtn.addEventListener("click", async () => {
  if (!output.value.trim()) {
    alert("Nothing to copy!");
    return;
  }

  await navigator.clipboard.writeText(output.value);
  alert("Copied successfully!");
});

/* =========================
   DOWNLOAD OUTPUT
========================= */

downloadBtn.addEventListener("click", () => {
  if (!output.value.trim()) {
    alert("Nothing to download!");
    return;
  }

  const blob = new Blob([output.value], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "speech-text.txt";
  a.click();
});

/* =========================
   CLEAR OUTPUT
========================= */

clearOutputBtn.addEventListener("click", () => {
  output.value = "";
  listeningStatus.textContent = "";
});

/* =========================
   THEME TOGGLE
========================= */

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  themeToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});