// TEXT TO SPEECH

const textInput = document.getElementById("text-input");
const convertBtn = document.getElementById("convert-btn");
const stopBtnText = document.getElementById("stop-btn-text");
const ttsLanguage = document.getElementById("tts-language");

const speechSynthesisObj = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

// =========================================
// ELEMENT SELECTORS
// =========================================

const textInput = document.getElementById("text-input");
const convertBtn = document.getElementById("convert-btn");
const stopBtnText = document.getElementById("stop-btn-text");
const ttsLanguage = document.getElementById("tts-language");

const speechSynthesisObj = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

convertBtn.addEventListener("click", () => {
    const text = textInput.value.trim();

    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    utterance.text = text;
    utterance.lang = ttsLanguage.value;

    speechSynthesisObj.speak(utterance);

    convertBtn.disabled = true;
    stopBtnText.disabled = false;
});

utterance.onend = () => {
    convertBtn.disabled = false;
    stopBtnText.disabled = true;
};

stopBtnText.addEventListener("click", () => {
    speechSynthesisObj.cancel();

    convertBtn.disabled = false;
    stopBtnText.disabled = true;
});


// VOICE TO TEXT

const startBtn = document.getElementById("start-btn");
const stopBtnVoice = document.getElementById("stop-btn-voice");
const output = document.getElementById("output");
const sttLanguage = document.getElementById("stt-language");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Speech Recognition not supported in this browser.");
} else {

    const recognition = new SpeechRecognition();
const clearTextBtn = document.getElementById("clear-text");

const ttsLanguage = document.getElementById("tts-language");
const sttLanguage = document.getElementById("stt-language");

const voiceSelect = document.getElementById("voice-select");

const output = document.getElementById("output");

const startBtn = document.getElementById("start-btn");
const stopBtnVoice = document.getElementById("stop-btn-voice");

const copyBtn = document.getElementById("copy-btn");
const downloadBtn = document.getElementById("download-btn");
const clearOutputBtn = document.getElementById("clear-output");

const charCount = document.getElementById("char-count");

const speakingStatus =
    document.getElementById("speaking-status");

const listeningStatus =
    document.getElementById("listening-status");

const themeToggle =
    document.getElementById("theme-toggle");

// =========================================
// LANGUAGES
// =========================================

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

// =========================================
// LOAD LANGUAGES
// =========================================

function loadLanguages() {

    ttsLanguage.innerHTML = "";
    sttLanguage.innerHTML = "";

    Object.entries(languageMap).forEach(
        ([code, name]) => {

            const option1 =
                document.createElement("option");

            option1.value = code;
            option1.textContent = name;

            ttsLanguage.appendChild(option1);

            const option2 =
                document.createElement("option");

            option2.value = code;
            option2.textContent = name;

            sttLanguage.appendChild(option2);
        }
    );
}

loadLanguages();

// =========================================
// LOAD VOICES
// =========================================

let voices = [];

function loadVoices() {

    voices = speechSynthesis.getVoices();

    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {

        const option =
            document.createElement("option");

        option.value = index;

        option.textContent =
            `${voice.name} (${voice.lang})`;

        voiceSelect.appendChild(option);
    });
}

speechSynthesis.onvoiceschanged =
    loadVoices;

loadVoices();

// =========================================
// CHARACTER COUNT
// =========================================

textInput.addEventListener(
    "input",
    () => {

        charCount.textContent =
            `Characters: ${textInput.value.length}`;
    }
);

// =========================================
// TEXT TO SPEECH
// =========================================

convertBtn.addEventListener(
    "click",
    () => {

        const text =
            textInput.value.trim();

        if (!text) {

            alert(
                "Please enter some text."
            );

            return;
        }

        const utterance =
            new SpeechSynthesisUtterance(
                text
            );

        utterance.lang =
            ttsLanguage.value;

        if (
            voices.length > 0 &&
            voiceSelect.value !== ""
        ) {
            utterance.voice =
                voices[
                    parseInt(
                        voiceSelect.value
                    )
                ];
        }

        speechSynthesis.speak(
            utterance
        );

        speakingStatus.innerHTML =
            "🟢 Speaking...";

        convertBtn.disabled = true;
        stopBtnText.disabled = false;

        utterance.onend = () => {

            speakingStatus.innerHTML =
                "✅ Completed";

            convertBtn.disabled = false;
            stopBtnText.disabled = true;
        };
    }
);

// =========================================
// STOP SPEECH
// =========================================

stopBtnText.addEventListener(
    "click",
    () => {

        speechSynthesis.cancel();

        speakingStatus.innerHTML =
            "⛔ Stopped";

        convertBtn.disabled = false;
        stopBtnText.disabled = true;
    }
);

// =========================================
// CLEAR INPUT
// =========================================

clearTextBtn.addEventListener(
    "click",
    () => {

        textInput.value = "";

        charCount.textContent =
            "Characters: 0";

        speakingStatus.innerHTML = "";
    }
);

// =========================================
// SPEECH RECOGNITION
// =========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

if (!SpeechRecognition) {

    listeningStatus.innerHTML =
        "❌ Speech Recognition Not Supported";

} else {

    const recognition =
        new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
        let transcript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        output.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };

    startBtn.addEventListener("click", () => {

        recognition.lang = sttLanguage.value;

        recognition.start();

        startBtn.disabled = true;
        stopBtnVoice.disabled = false;
    });

    stopBtnVoice.addEventListener("click", () => {

        recognition.stop();

        startBtn.disabled = false;
        stopBtnVoice.disabled = true;
    });
}
    recognition.onresult =
        (event) => {

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0]
                    .transcript;
            }

            output.value =
                transcript;
        };

    recognition.onerror =
        (event) => {

            console.error(
                event.error
            );
        };

    startBtn.addEventListener(
        "click",
        () => {

            recognition.lang =
                sttLanguage.value;

            recognition.start();

            listeningStatus.innerHTML =
                "🎤 Listening...";

            startBtn.disabled = true;
            stopBtnVoice.disabled = false;
        }
    );

    stopBtnVoice.addEventListener(
        "click",
        () => {

            recognition.stop();

            listeningStatus.innerHTML =
                "⛔ Stopped";

            startBtn.disabled = false;
            stopBtnVoice.disabled = true;
        }
    );
}

// =========================================
// COPY OUTPUT
// =========================================

copyBtn.addEventListener(
    "click",
    async () => {

        if (
            output.value.trim() === ""
        ) {
            alert(
                "No text available."
            );

            return;
        }

        try {

            await navigator.clipboard.writeText(
                output.value
            );

            alert(
                "Copied Successfully!"
            );

        } catch (error) {

            console.error(error);
        }
    }
);

// =========================================
// DOWNLOAD OUTPUT
// =========================================

downloadBtn.addEventListener(
    "click",
    () => {

        if (
            output.value.trim() === ""
        ) {
            alert(
                "No transcript available."
            );

            return;
        }

        const blob =
            new Blob(
                [output.value],
                {
                    type:
                        "text/plain"
                }
            );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(
                blob
            );

        link.download =
            "transcript.txt";

        link.click();
    }
);

// =========================================
// CLEAR OUTPUT
// =========================================

clearOutputBtn.addEventListener(
    "click",
    () => {

        output.value = "";

        listeningStatus.innerHTML = "";
    }
);

// =========================================
// DARK MODE
// =========================================

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        if (
            document.body.classList.contains(
                "dark"
            )
        ) {

            themeToggle.innerHTML =
                "☀️";

        } else {

            themeToggle.innerHTML =
                "🌙";
        }
    }
);
