document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    
    // Modal Elements
    const apiKeyModal = document.getElementById('api-key-modal');
    const apiKeyInput = document.getElementById('api-key-input');
    const saveKeyBtn = document.getElementById('save-key-btn');
    const settingsBtn = document.getElementById('settings-btn');

    // State
    // Check if we already have a key saved in the current browser session
    let GEMINI_API_KEY = sessionStorage.getItem('gemini_api_key') || '';

    // Initialize Modal
    if (!GEMINI_API_KEY) {
        apiKeyModal.style.display = 'flex';
    }

    // Handle Saving API Key
    saveKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            GEMINI_API_KEY = key;
            sessionStorage.setItem('gemini_api_key', key);
            apiKeyModal.style.display = 'none';
            apiKeyInput.value = ''; // Clear the input
        } else {
            alert('Please enter a valid API key.');
        }
    });

    // Handle reopening settings to change key
    settingsBtn.addEventListener('click', () => {
        apiKeyModal.style.display = 'flex';
    });

    // Helper to get current time
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Enhanced Message Function (Matches new HTML structure)
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        // Decide icon based on sender
        const iconClass = sender === 'bot' ? 'fa-robot' : 'fa-user';
        
        // Build the inner HTML structure
        messageDiv.innerHTML = `
            <div class="avatar"><i class="fa-solid ${iconClass}"></i></div>
            <div class="message-wrapper">
                <div class="message-content">
                    <p>${text.replace(/\n/g, '<br>')}</p>
                </div>
                <span class="timestamp">${getCurrentTime()}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Handle AI API Call
    async function fetchAIResponse(userMessage) {
        if (!GEMINI_API_KEY) {
            addMessage("Please click the gear icon to enter your Gemini API key first.", "bot");
            return;
        }

        // Add a temporary loading indicator
        addMessage("Thinking...", "bot");
        const loadingMessage = chatMessages.lastElementChild;

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful, friendly, and concise AI assistant. Respond to this: ${userMessage}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text;

            // Remove loading and show actual response
            loadingMessage.remove();
            addMessage(aiText, "bot");

        } catch (error) {
            loadingMessage.remove();
            
            // Helpful error handling if the key is invalid
            if (error.message.includes('400')) {
                addMessage("API Error. Please check if your API key is correct in the settings.", "bot");
            } else {
                addMessage("Sorry, I encountered an error connecting to the server.", "bot");
            }
            console.error("Gemini API Error:", error);
        }
    }

    // Event Listeners for Sending Messages
    sendBtn.addEventListener('click', () => {
        const text = userInput.value.trim();
        if (text) {
            addMessage(text, "user");
            userInput.value = '';
            fetchAIResponse(text);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
});