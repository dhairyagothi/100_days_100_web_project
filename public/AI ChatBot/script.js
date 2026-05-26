const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const promptInput = document.getElementById('prompt-input');
const sendBtn = document.getElementById('send-btn');
const outputContainer = document.getElementById('output-container');
const imageInput = document.getElementById('image-input');
const previewImg = document.getElementById('preview-img');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');

let geminiApiKey = localStorage.getItem('gemini_api_key') || '';
if (geminiApiKey) {
    apiKeyInput.value = geminiApiKey;
}

saveKeyBtn.addEventListener('click', () => {
    geminiApiKey = apiKeyInput.value.trim();
    if (geminiApiKey) {
        localStorage.setItem('gemini_api_key', geminiApiKey);
        alert('API Key saved!');
    } else {
        alert('Please enter a valid API key.');
    }
});

let selectedImageBase64 = null;

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImageBase64 = e.target.result.split(',')[1];
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

function appendMessage(role, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `${role}-message chat-message`;

    if (role === 'ai') {
        msgDiv.innerHTML = marked.parse(text);
        // Add copy button to code blocks
        msgDiv.querySelectorAll('pre').forEach(pre => {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-btn';
            copyBtn.innerText = 'Copy';
            copyBtn.onclick = () => {
                const code = pre.querySelector('code');
                navigator.clipboard.writeText(code ? code.innerText : pre.innerText);
                copyBtn.innerText = 'Copied!';
                setTimeout(() => copyBtn.innerText = 'Copy', 2000);
            };
            pre.appendChild(copyBtn);
        });
    } else {
        msgDiv.innerText = text;
    }

    outputContainer.appendChild(msgDiv);
    outputContainer.scrollTop = outputContainer.scrollHeight;
    return msgDiv;
}

async function getAIResponse(prompt, imageBase64) {
    if (!geminiApiKey) {
        alert('Please enter your Gemini API Key first!');
        return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading chat-message ai-message';
    loadingDiv.innerHTML = `
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
    `;
    outputContainer.appendChild(loadingDiv);
    outputContainer.scrollTop = outputContainer.scrollHeight;

    try {
        const contents = [{
            parts: [{ text: prompt || "What is in this image?" }]
        }];

        if (imageBase64) {
            contents[0].parts.push({
                inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                }
            });
        }

        const response = await fetch(`${API_URL}?key=${geminiApiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ contents })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (loadingDiv.parentNode) {
            outputContainer.removeChild(loadingDiv);
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            appendMessage('ai', data.candidates[0].content.parts[0].text);
        } else {
            throw new Error('No response from AI');
        }
    } catch (error) {
        if (loadingDiv.parentNode) {
            outputContainer.removeChild(loadingDiv);
        }
        appendMessage('ai', `**Error:** ${error.message}`);
        console.error("Gemini API Error:", error);
    }
}

sendBtn.addEventListener('click', () => {
    const text = promptInput.value.trim();
    if (text || selectedImageBase64) {
        appendMessage('user', text || 'Sent an image');
        getAIResponse(text, selectedImageBase64);

        // Reset inputs
        promptInput.value = '';
        imageInput.value = '';
        selectedImageBase64 = null;
        previewImg.style.display = 'none';
    }
});

promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
