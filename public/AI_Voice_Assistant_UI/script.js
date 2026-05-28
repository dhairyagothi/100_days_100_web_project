// DOM Elements
const micBtn = document.getElementById('mic-btn');
const micIcon = micBtn.querySelector('i');
const visualizer = document.getElementById('visualizer');
const statusText = document.getElementById('status-text');
const subStatus = document.getElementById('sub-status');
const clearBtn = document.getElementById('clear-btn');
const settingsBtn = document.getElementById('settings-btn');
const orb = document.querySelector('.orb');

// Settings Modal Elements
const settingsModal = document.getElementById('settings-modal');
const settingsClose = document.getElementById('settings-close');
const settingsSave = document.getElementById('settings-save');
const voiceSelect = document.getElementById('voice-select');
const rateSlider = document.getElementById('rate-slider');
const rateVal = document.getElementById('rate-val');
const pitchSlider = document.getElementById('pitch-slider');
const pitchVal = document.getElementById('pitch-val');
const providerSelect = document.getElementById('provider-select');
const keyGroup = document.getElementById('key-group');
const keyLabel = document.getElementById('key-label');
const apiKeyInput = document.getElementById('api-key-input');
const keyHelp = document.getElementById('key-help');

// Transcript Elements
const transcriptContainer = document.getElementById('transcript-container');
const transcriptText = document.getElementById('transcript-text');
const waveElements = document.querySelectorAll('.wave');

// State Variables
let currentState = 'idle'; // 'idle', 'listening', 'thinking', 'speaking'
let recognition = null;
let synth = window.speechSynthesis;
let audioContext = null;
let analyser = null;
let dataArray = null;
let sourceNode = null;
let animationFrameId = null;
let speakingSimFrameId = null;
let currentUtterance = null;

// Settings Config
let config = {
    provider: localStorage.getItem('assistant_provider') || 'local',
    apiKey: localStorage.getItem('assistant_api_key') || '',
    voiceName: localStorage.getItem('assistant_voice') || '',
    rate: parseFloat(localStorage.getItem('assistant_rate')) || 1.0,
    pitch: parseFloat(localStorage.getItem('assistant_pitch')) || 1.0
};

// --- Settings & Modal Logic ---

function initSettings() {
    // Populate provider select
    providerSelect.value = config.provider;
    
    // Populate API key input
    apiKeyInput.value = config.apiKey;
    
    // Set sliders
    rateSlider.value = config.rate;
    rateVal.textContent = `${config.rate.toFixed(1)}x`;
    pitchSlider.value = config.pitch;
    pitchVal.textContent = config.pitch.toFixed(1);

    // Setup provider view toggling
    updateKeyGroupVisibility();
    providerSelect.addEventListener('change', () => {
        updateKeyGroupVisibility();
    });

    // Setup slider listeners
    rateSlider.addEventListener('input', (e) => {
        rateVal.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
    });
    pitchSlider.addEventListener('input', (e) => {
        pitchVal.textContent = parseFloat(e.target.value).toFixed(1);
    });

    // Populate voices
    populateVoices();
    if (synth && typeof synth.addEventListener === 'function') {
        synth.addEventListener('voiceschanged', populateVoices);
    } else if (synth) {
        synth.onvoiceschanged = populateVoices;
    }

    // Modal open/close
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });
    
    const closeModal = () => {
        settingsModal.classList.remove('active');
    };
    
    settingsClose.addEventListener('click', closeModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeModal();
    });

    // Save Settings
    settingsSave.addEventListener('click', () => {
        config.provider = providerSelect.value;
        config.apiKey = apiKeyInput.value.trim();
        config.voiceName = voiceSelect.value;
        config.rate = parseFloat(rateSlider.value);
        config.pitch = parseFloat(pitchSlider.value);

        localStorage.setItem('assistant_provider', config.provider);
        localStorage.setItem('assistant_api_key', config.apiKey);
        localStorage.setItem('assistant_voice', config.voiceName);
        localStorage.setItem('assistant_rate', config.rate);
        localStorage.setItem('assistant_pitch', config.pitch);

        closeModal();
        updateSubStatus("Settings Saved");
        setTimeout(() => updateSubStatus("System Idle"), 2000);
    });
}

function updateKeyGroupVisibility() {
    const val = providerSelect.value;
    if (val === 'local') {
        keyGroup.style.display = 'none';
    } else {
        keyGroup.style.display = 'flex';
        if (val === 'gemini') {
            keyLabel.textContent = "Gemini API Key";
            apiKeyInput.placeholder = "AIzaSy...";
            keyHelp.textContent = "Provide your Gemini API key (starts with AIzaSy) to enable real-time replies.";
        } else if (val === 'nvidia') {
            keyLabel.textContent = "NVIDIA NIM API Key";
            apiKeyInput.placeholder = "nvapi-...";
            keyHelp.textContent = "Provide your NVIDIA API key (starts with nvapi-) to enable llama-3.3-70b real-time replies.";
        }
    }
}

function populateVoices() {
    if (!synth) return;
    const voices = synth.getVoices();
    voiceSelect.innerHTML = '';
    
    if (voices.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Default System Voice';
        voiceSelect.appendChild(opt);
        return;
    }

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [Default]' : ''}`;
        
        if (voice.name === config.voiceName) {
            option.selected = true;
        }
        voiceSelect.appendChild(option);
    });
}

// --- Status Updates ---

function changeState(newState) {
    currentState = newState;
    visualizer.className = 'ai-visualizer';
    transcriptText.className = '';

    if (newState !== 'idle') {
        if (orb) orb.style.transform = '';
    }

    // Stop active synthesis/recognition if returning to idle
    if (newState === 'idle') {
        stopVoiceSynthesis();
        stopAudioAnalysis();
        stopSpeakingSimulation();
        micIcon.className = "ph-fill ph-microphone";
        micBtn.classList.remove('mic-active');
        statusText.textContent = "Hi, how can I help?";
        updateSubStatus("System Idle");
    } 
    else if (newState === 'listening') {
        visualizer.classList.add('state-listening');
        transcriptText.className = 'active-listen';
        micIcon.className = "ph-fill ph-stop";
        micBtn.classList.add('mic-active');
        statusText.textContent = "Listening...";
        updateSubStatus("Awaiting voice input");
    } 
    else if (newState === 'thinking') {
        visualizer.classList.add('state-thinking');
        micIcon.className = "ph-fill ph-microphone";
        micBtn.classList.remove('mic-active');
        statusText.textContent = "Processing...";
        updateSubStatus("Analyzing voice request");
    } 
    else if (newState === 'speaking') {
        visualizer.classList.add('state-speaking');
        transcriptText.className = 'active-speak';
        micIcon.className = "ph-fill ph-microphone";
        micBtn.classList.remove('mic-active');
        statusText.textContent = "Responding...";
        updateSubStatus("Speaking response");
    }
}

function updateSubStatus(text) {
    subStatus.textContent = text;
}

function setTranscript(text, isActiveListen = false) {
    transcriptText.textContent = text;
    if (isActiveListen) {
        transcriptText.className = 'active-listen';
    }
    transcriptContainer.scrollTop = transcriptContainer.scrollHeight;
}

// --- Speech Recognition (STT) ---

function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        setTranscript("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
        return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        changeState('listening');
        setTranscript("Start speaking...", true);
        startAudioAnalysis();
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        if (finalTranscript) {
            setTranscript(finalTranscript);
            processUserRequest(finalTranscript);
        } else if (interimTranscript) {
            setTranscript(interimTranscript, true);
        }
    };

    recognition.onerror = (event) => {
        console.error("STT Error:", event.error);
        if (event.error === 'no-speech') {
            setTranscript("No speech detected. Tap the mic to try again.");
        } else {
            setTranscript(`Recognition error: ${event.error}`);
        }
        changeState('idle');
    };

    recognition.onend = () => {
        if (currentState === 'listening') {
            changeState('idle');
        }
    };
}

// --- Web Audio API Analyser (For Mic Input Visualization) ---

async function startAudioAnalysis() {
    stopAudioAnalysis();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64; // Small size for responsive, smooth frequency bins
        
        sourceNode = audioContext.createMediaStreamSource(stream);
        sourceNode.connect(analyser);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        visualizeMicInput();
    } catch (err) {
        console.error("Audio Analysis failed:", err);
    }
}

function visualizeMicInput() {
    if (!analyser || currentState !== 'listening') return;
    
    animationFrameId = requestAnimationFrame(visualizeMicInput);
    analyser.getByteFrequencyData(dataArray);
    
    // Map frequency bands to the 15 wave elements
    const numWaves = waveElements.length;
    for (let i = 0; i < numWaves; i++) {
        // Sample frequencies smoothly across the spectrum
        const dataIdx = Math.floor((i / numWaves) * dataArray.length);
        const value = dataArray[dataIdx] || 0;
        
        // Scale frequency value (0-255) to height (12px to 90px)
        const scaleVal = 12 + (value / 255) * 78;
        waveElements[i].style.height = `${scaleVal}px`;
    }
}

// Call NVIDIA NIM API via local proxy (with direct client-side fallback if proxy is unavailable)
function stopAudioAnalysis() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    if (sourceNode) {
        sourceNode.disconnect();
        sourceNode = null;
    }
    if (audioContext && audioContext.state !== 'closed') {
        audioContext.close();
        audioContext = null;
    }
    analyser = null;
    resetWaveHeights();
}

function resetWaveHeights() {
    waveElements.forEach(wave => {
        wave.style.height = '';
    });
}

// --- Speech Synthesis (TTS) & Speaking Wave Simulation ---

function speakResponse(text) {
    if (!synth) {
        setTranscript(`[Voice not supported]: ${text}`);
        changeState('idle');
        return;
    }

    stopVoiceSynthesis();
    changeState('speaking');
    setTranscript(text);

    currentUtterance = new SpeechSynthesisUtterance(text);
    
    // Apply configurations
    const voices = synth.getVoices();
    if (config.voiceName) {
        const voice = voices.find(v => v.name === config.voiceName);
        if (voice) currentUtterance.voice = voice;
    }
    currentUtterance.rate = config.rate;
    currentUtterance.pitch = config.pitch;

    currentUtterance.onstart = () => {
        startSpeakingSimulation();
    };

    currentUtterance.onend = () => {
        changeState('idle');
    };

    currentUtterance.onerror = (e) => {
        console.error("TTS Error:", e);
        changeState('idle');
    };

    synth.speak(currentUtterance);
}

function startSpeakingSimulation() {
    stopSpeakingSimulation();
    let time = 0;

    function animateSpeak() {
        if (currentState !== 'speaking') return;
        speakingSimFrameId = requestAnimationFrame(animateSpeak);
        time += 0.2;

        const numWaves = waveElements.length;
        for (let i = 0; i < numWaves; i++) {
            // Generate synthetic voice wave visualizer combining multiple sine waves
            const factor = Math.sin(time + i * 0.4) * Math.cos(time * 0.5 - i * 0.2);
            const absoluteFactor = Math.abs(factor);
            const height = 15 + absoluteFactor * 60;
            waveElements[i].style.height = `${height}px`;
        }
    }

    animateSpeak();
}

function stopSpeakingSimulation() {
    if (speakingSimFrameId) {
        cancelAnimationFrame(speakingSimFrameId);
        speakingSimFrameId = null;
    }
    resetWaveHeights();
}

function stopVoiceSynthesis() {
    if (synth && synth.speaking) {
        synth.cancel();
    }
}

// --- Conversational Logic & API Calls ---

async function processUserRequest(prompt) {
    changeState('thinking');
    
    if (config.provider === 'gemini' && config.apiKey) {
        await fetchGeminiResponse(prompt);
    } else if (config.provider === 'nvidia' && config.apiKey) {
        await fetchNvidiaResponse(prompt);
    } else {
        // Fallback to local rule engine
        setTimeout(() => {
            const reply = getLocalRuleResponse(prompt);
            speakResponse(reply);
        }, 1200);
    }
}

// Local rule based matching for standard commands
function getLocalRuleResponse(prompt) {
    const text = prompt.toLowerCase().trim();

    if (text.includes('hello') || text.includes('hi ') || text === 'hi') {
        return "Hello! I am your AI Voice Assistant. You can provide a Gemini or NVIDIA API Key in my settings for live AI replies, or ask me local questions like time, date, or jokes.";
    }
    if (text.includes('time')) {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `The current local time is ${timeStr}.`;
    }
    if (text.includes('date') || text.includes('day')) {
        const dateStr = new Date().toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return `Today is ${dateStr}.`;
    }
    if (text.includes('joke')) {
        const jokes = [
            "Why do programmers wear glasses? Because they can't C sharp!",
            "There are 10 types of people in the world: those who understand binary, and those who don't.",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
            "Why did the database administrator leave the restaurant? Because the table layout was bad."
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    if (text.includes('gssoc') || text.includes('girlscript')) {
        return "GirlScript Summer of Code 2026 is an amazing open source event! I see that you are currently developing the Impact Intel dashboard and scouting issue number 271 for Checkora. Keep up the great work!";
    }
    if (text.includes('status') || text.includes('system')) {
        return "All local modules are online. STT and TTS engines are fully functional. Micro-animations and sound-analyzers are active.";
    }
    if (text.includes('calculate') || text.includes('plus') || text.includes('minus') || text.includes('multiply')) {
        try {
            // Clean simple math string
            const cleaned = text
                .replace(/calculate/g, '')
                .replace(/plus/g, '+')
                .replace(/minus/g, '-')
                .replace(/multiply/g, '*')
                .replace(/divided by/g, '/')
                .replace(/times/g, '*');
            const result = eval(cleaned.replace(/[^0-9+\-*/().\s]/g, ''));
            if (result !== undefined && !isNaN(result)) {
                return `The result is ${result}.`;
            }
        } catch (e) {
            // fallthrough
        }
    }
    
    return "I heard you say: " + prompt + ". Add an API Key in the settings panel to activate real-time AI replies!";
}

// Call Gemini API via local proxy (with direct client-side fallback if proxy is unavailable)
async function fetchGeminiResponse(prompt) {
    try {
        let response;
        try {
            response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: config.apiKey,
                    contents: [{
                        parts: [{
                            text: `You are a helpful, brief voice assistant. Keep answers natural, short (1-2 sentences), and friendly since they will be read aloud. User prompt: ${prompt}`
                        }]
                    }]
                })
            });
        } catch (e) {
            // Local proxy route unavailable or failed, fallback to direct browser fetch
        }

        if (!response || response.status === 404) {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful, brief voice assistant. Keep answers natural, short (1-2 sentences), and friendly since they will be read aloud. User prompt: ${prompt}`
                        }]
                    }]
                })
            });
        }

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error?.message || `HTTP ${response.status}`;
            speakResponse(`Gemini API error. ${errMsg}`);
            return;
        }

        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (replyText) {
            speakResponse(replyText.trim());
        } else {
            speakResponse("I couldn't generate a response. Please try again.");
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        speakResponse("I had trouble connecting to Gemini. Check your internet or API key.");
    }
}

// Call NVIDIA NIM API via local proxy (with direct client-side fallback if proxy is unavailable)
async function fetchNvidiaResponse(prompt) {
    try {
        let response;
        try {
            response = await fetch('/api/nvidia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    apiKey: config.apiKey,
                    model: 'meta/llama-3.3-70b-instruct',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful, brief voice assistant. Keep answers natural, short (1-2 sentences), and friendly since they will be read aloud.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.5,
                    top_p: 1,
                    max_tokens: 128
                })
            });
        } catch (e) {
            // Local proxy route unavailable or failed, fallback to direct browser fetch
        }

        if (!response || response.status === 404) {
            response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                body: JSON.stringify({
                    model: 'meta/llama-3.3-70b-instruct',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful, brief voice assistant. Keep answers natural, short (1-2 sentences), and friendly since they will be read aloud.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.5,
                    top_p: 1,
                    max_tokens: 128
                })
            });
        }

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            const errMsg = errData.error?.message || `HTTP ${response.status}`;
            speakResponse(`NVIDIA API error. ${errMsg}`);
            return;
        }

        const data = await response.json();
        const replyText = data.choices?.[0]?.message?.content;
        
        if (replyText) {
            speakResponse(replyText.trim());
        } else {
            speakResponse("I couldn't generate a response. Please try again.");
        }
    } catch (error) {
        console.error("NVIDIA API Error:", error);
        speakResponse("I had trouble connecting to NVIDIA. Check your internet or API key.");
    }
}

// --- Event Handlers & Initializations ---

micBtn.addEventListener('click', () => {
    if (currentState === 'idle') {
        if (!recognition) {
            initSpeechRecognition();
        }
        if (recognition) {
            try {
                recognition.start();
            } catch (e) {
                console.warn(e);
            }
        }
    } else {
        changeState('idle');
    }
});

clearBtn.addEventListener('click', () => {
    stopVoiceSynthesis();
    stopAudioAnalysis();
    stopSpeakingSimulation();
    changeState('idle');
    setTranscript("Tap the mic to speak...");
});

// Interactive hover effects on the orb
document.addEventListener('mousemove', (e) => {
    if (currentState !== 'idle') return;
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    if (orb) orb.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
});

// Initialize Settings
initSettings();
