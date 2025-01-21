document.addEventListener('DOMContentLoaded', () => {
    const sendButton = document.getElementById('send-btn');
    const inputField = document.getElementById('prompt-input');
    const outputContainer = document.getElementById('output-container');

    function sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    function createChatMessage(message, isUser) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
        messageElement.innerHTML = sanitizeInput(message);
        outputContainer.appendChild(messageElement);
        outputContainer.scrollTop = outputContainer.scrollHeight; 
    }

    function generateAIResponse(userMessage) {
        const responses = {
            hello: 'Hello! How can I assist you today?',
            'how are you': "I am just a program, but I'm here to help!",
            bye: 'Goodbye! Have a great day!',
            help: 'Sure! Let me know what you need help with.',
        };
        const lowerCaseMessage = userMessage.toLowerCase();
        for (const key in responses) {
            if (lowerCaseMessage.includes(key)) {
                return responses[key];
            }
        }
        return `I'm not sure how to respond to that. You said: "${userMessage}"`;
    }

    function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            createChatMessage(userMessage, true);
            inputField.value = '';
            setTimeout(() => {
                const aiResponse = generateAIResponse(userMessage); 
                createChatMessage(aiResponse, false);
            }, 300);
        }
    }

    sendButton.addEventListener('click', sendMessage);

    inputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
            event.preventDefault();
        }
    });

    inputField.focus();
});
