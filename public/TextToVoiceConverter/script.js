// ==========================================================================
// DOM ELEMENT SELECTORS
// ==========================================================================
const themeToggle = document.getElementById("theme-toggle");

// Text to Speech (TTS) Elements
const ttsLanguage = document.getElementById("tts-language");
const voiceSelect = document.getElementById("voice-select");
const textInput = document.getElementById("text-input");
const charCount = document.getElementById("char-count");
const convertBtn = document.getElementById("convert-btn");
const stopBtnText = document.getElementById("stop-btn-text");
const clearTextBtn = document.getElementById("clear-text");
const speakingStatus = document.getElementById("speaking-status");

// Speech to Text (STT) Elements
const sttLanguage = document.getElementById("stt-language");
const startBtn = document.getElementById("start-btn");
const stopBtnVoice = document.getElementById("stop-btn-voice");
const output = document.getElementById("output");
const listeningStatus = document.getElementById("listening-status");
const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");
const clearOutputBtn = document.getElementById("clear-output");

// ==========================================================================
// STATIC CONFIGURATION: LANGUAGE LIST
// ==========================================================================
const languageMap = {
    "en-US": "🇺🇸 English (US)",
    "en-GB": "🇬🇧 English (UK)",
    "en-IN": "🇮🇳 English (India)",
    "hi-IN": "🇮🇳 Hindi",
    "gu-IN": "🇮🇳 Gujarati",
    "bn-IN": "🇮🇳 Bengali",
    "mr-IN": "🇮🇳 Marathi",
    "ta-IN": "🇮🇳 Tamil",
    "te-IN": "🇮🇳 Telugu",
    "fr-FR": "🇫🇷 French",
    "de-DE": "🇩🇪 German",
    "es-ES": "🇪🇸 Spanish",
    "it-IT": "🇮🇹 Italian",
    "pt-BR": "🇧🇷 Portuguese",
    "ru-RU": "🇷🇺 Russian",
    "ja-JP": "🇯🇵 Japanese",
    "ko-KR": "🇰🇷 Korean",
    "zh-CN": "🇨🇳 Chinese",
    "ar-SA": "🇸🇦 Arabic"
};

// Populate dropdowns with supported languages
function populateLanguageDropdowns() {
    ttsLanguage.innerHTML = "";
    sttLanguage.innerHTML = "";

    Object.entries(languageMap).forEach(([code, name]) => {
        const option1 = document.createElement("option");
        option1.value = code;
        option1.textContent = name;
        ttsLanguage.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = code;
        option2.textContent = name;
        sttLanguage.appendChild(option2);
    });
}

// ==========================================================================
// SPEECH SYNTHESIS (TEXT TO SPEECH)
// ==========================================================================
let allVoices = [];

function populateVoices() {
    if (!window.speechSynthesis) return;
    
    allVoices = window.speechSynthesis.getVoices();
    const selectedLang = ttsLanguage.value; // e.g. "en-US"
    const langPrefix = selectedLang.split('-')[0].toLowerCase();
    
    voiceSelect.innerHTML = "";
    
    // Filter voices matching selected language prefix, e.g. "en"
    const filtered = allVoices.filter(voice => {
        const voiceLang = voice.lang.toLowerCase().replace('_', '-');
        return voiceLang.startsWith(langPrefix) || voiceLang.includes(langPrefix);
    });
    
    // Fallback to all voices if no matching language prefix is found
    const displayedVoices = filtered.length > 0 ? filtered : allVoices;
    
    if (displayedVoices.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No voices available";
        voiceSelect.appendChild(option);
        return;
    }
    
    displayedVoices.forEach(voice => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Update voice list when speech synthesis load finishes or language dropdown changes
if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
    ttsLanguage.addEventListener("change", populateVoices);
}

// TTS execution
convertBtn.addEventListener("click", () => {
    const text = textInput.value.trim();
    if (!text) {
        alert("Please enter some text to convert to speech.");
        return;
    }
    
    // Cancel any currently running speech synthesis
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = ttsLanguage.value;
    
    const selectedVoiceName = voiceSelect.value;
    if (selectedVoiceName) {
        const matchVoice = allVoices.find(v => v.name === selectedVoiceName);
        if (matchVoice) {
            utterance.voice = matchVoice;
        }
    }
    
    utterance.onstart = () => {
        speakingStatus.textContent = "🟢 Speaking...";
        speakingStatus.className = "status-badge active-speak";
        convertBtn.disabled = true;
        stopBtnText.disabled = false;
    };
    
    utterance.onend = () => {
        speakingStatus.textContent = "Ready";
        speakingStatus.className = "status-badge";
        convertBtn.disabled = false;
        stopBtnText.disabled = true;
    };
    
    utterance.onerror = (event) => {
        console.error("SpeechSynthesis error:", event);
        speakingStatus.textContent = "Ready";
        speakingStatus.className = "status-badge";
        convertBtn.disabled = false;
        stopBtnText.disabled = true;
    };
    
    window.speechSynthesis.speak(utterance);
});

// TTS stop speaking
stopBtnText.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    speakingStatus.textContent = "Ready";
    speakingStatus.className = "status-badge";
    convertBtn.disabled = false;
    stopBtnText.disabled = true;
});

// TTS clear text input
clearTextBtn.addEventListener("click", () => {
    textInput.value = "";
    charCount.textContent = "Characters: 0";
    window.speechSynthesis.cancel();
    speakingStatus.textContent = "Ready";
    speakingStatus.className = "status-badge";
    convertBtn.disabled = false;
    stopBtnText.disabled = true;
});

// Calculate characters count in real time
textInput.addEventListener("input", () => {
    charCount.textContent = `Characters: ${textInput.value.length}`;
});

// ==========================================================================
// SPEECH RECOGNITION (SPEECH TO TEXT)
// ==========================================================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isListening = false;

if (!SpeechRecognition) {
    listeningStatus.textContent = "Unsupported";
    listeningStatus.style.background = "rgba(239, 68, 68, 0.1)";
    listeningStatus.style.color = "#ef4444";
    startBtn.disabled = true;
} else {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
        isListening = true;
        listeningStatus.textContent = "🎙️ Listening";
        listeningStatus.className = "status-badge active-listen";
        startBtn.classList.add("recording");
        startBtn.disabled = true;
        stopBtnVoice.disabled = false;
    };
    
    recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        output.value = transcript;
        // Keep output textarea scrolled to bottom
        output.scrollTop = output.scrollHeight;
    };
    
    recognition.onend = () => {
        isListening = false;
        listeningStatus.textContent = "Ready";
        listeningStatus.className = "status-badge";
        startBtn.classList.remove("recording");
        startBtn.disabled = false;
        stopBtnVoice.disabled = true;
    };
    
    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
            alert("Microphone access is denied. Please enable microphone permissions in your browser.");
        }
        isListening = false;
        listeningStatus.textContent = "Ready";
        listeningStatus.className = "status-badge";
        startBtn.classList.remove("recording");
        startBtn.disabled = false;
        stopBtnVoice.disabled = true;
    };
    
    startBtn.addEventListener("click", () => {
        recognition.lang = sttLanguage.value;
        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start speech recognition:", e);
        }
    });
    
    stopBtnVoice.addEventListener("click", () => {
        try {
            recognition.stop();
        } catch (e) {
            console.error("Failed to stop speech recognition:", e);
        }
    });
}

// Clear STT transcript text
clearOutputBtn.addEventListener("click", () => {
    output.value = "";
    if (recognition && isListening) {
        recognition.stop();
    }
    listeningStatus.textContent = "Ready";
    listeningStatus.className = "status-badge";
});

// Copy transcript text to clipboard
copyBtn.addEventListener("click", async () => {
    const text = output.value.trim();
    if (!text) {
        alert("There is no transcript output to copy.");
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span class="btn-icon">✓</span> Copied!`;
        copyBtn.disabled = true;
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.disabled = false;
        }, 1500);
    } catch (err) {
        console.error("Clipboard copy failed:", err);
        alert("Failed to copy text to clipboard.");
    }
});

// Download transcript as plain text file (.txt)
downloadBtn.addEventListener("click", () => {
    const text = output.value.trim();
    if (!text) {
        alert("There is no transcript to download.");
        return;
    }
    
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "speech_transcript.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

// ==========================================================================
// PERSISTENT THEME SYSTEM (DARK & LIGHT)
// ==========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeToggle.textContent = "☀️";
    } else {
        document.body.classList.remove("dark");
        themeToggle.textContent = "🌙";
    }
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// ==========================================================================
// APP INITIALIZATION
// ==========================================================================
populateLanguageDropdowns();
populateVoices();
initTheme();
