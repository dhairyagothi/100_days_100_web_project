const micBtn = document.getElementById('mic-btn');
const micIcon = micBtn.querySelector('i');
const visualizer = document.getElementById('visualizer');
const statusText = document.getElementById('status-text');
const subStatus = document.getElementById('sub-status');

// States: 'idle', 'listening', 'thinking', 'speaking'
let currentState = 'idle';
let stateTimeout = null;

const states = {
    idle: {
        text: "Hi, how can I help?",
        sub: "System Idle",
        class: "",
        micClass: "ph-fill ph-microphone"
    },
    listening: {
        text: "Listening...",
        sub: "Awaiting input",
        class: "state-listening",
        micClass: "ph-fill ph-stop"
    },
    thinking: {
        text: "Processing...",
        sub: "Analyzing request",
        class: "state-thinking",
        micClass: "ph-fill ph-microphone"
    },
    speaking: {
        text: "Here is what I found.",
        sub: "Responding",
        class: "state-speaking",
        micClass: "ph-fill ph-microphone"
    }
};

function changeState(newState) {
    currentState = newState;
    const stateData = states[newState];

    // Clear old state classes
    visualizer.className = 'ai-visualizer';
    if (stateData.class) {
        visualizer.classList.add(stateData.class);
    }

    // Update text with a fade effect
    statusText.style.opacity = '0';
    setTimeout(() => {
        statusText.textContent = stateData.text;
        subStatus.textContent = stateData.sub;
        statusText.style.opacity = '1';
    }, 200);

    // Update Mic Icon
    micIcon.className = stateData.micClass;
    
    if (newState === 'listening') {
        micBtn.classList.add('mic-active');
    } else {
        micBtn.classList.remove('mic-active');
    }
}

// Simulate the interaction flow
micBtn.addEventListener('click', () => {
    clearTimeout(stateTimeout);

    if (currentState === 'idle' || currentState === 'speaking') {
        // Start Listening
        changeState('listening');
    } 
    else if (currentState === 'listening') {
        // User stopped speaking -> AI thinks
        changeState('thinking');
        
        // After 3 seconds of thinking, it speaks
        stateTimeout = setTimeout(() => {
            changeState('speaking');
            
            // After 4 seconds of speaking, go back to idle
            stateTimeout = setTimeout(() => {
                changeState('idle');
            }, 4000);
            
        }, 3000);
    }
    else if (currentState === 'thinking') {
        // User interrupted thinking
        changeState('idle');
    }
});

// Interactive hover effects on the orb
const orb = document.querySelector('.orb');
document.addEventListener('mousemove', (e) => {
    if(currentState !== 'idle') return;
    
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    orb.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
});
