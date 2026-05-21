const API_URL =
"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";


/* ELEMENTS */

const promptInput =
document.getElementById('prompt-input');

const sendBtn =
document.getElementById('send-btn');

const outputContainer =
document.getElementById('output-container');

const imageInput =
document.getElementById('image-input');

const previewImg =
document.getElementById('preview-img');

const apiKeyInput =
document.getElementById('api-key-input');

const saveKeyBtn =
document.getElementById('save-key-btn');


/* VARIABLES */

let geminiApiKey =
localStorage.getItem('gemini_api_key') || '';

let selectedImageBase64 = null;

let lastPrompt = '';


/* LOAD API KEY */

if(geminiApiKey){
    apiKeyInput.value = geminiApiKey;
}


/* SAVE KEY */

saveKeyBtn.addEventListener('click',()=>{

    geminiApiKey =
    apiKeyInput.value.trim();

    if(geminiApiKey){

        localStorage.setItem(
            'gemini_api_key',
            geminiApiKey
        );

        showToast('API Key Saved!');
    }
});


/* IMAGE */

imageInput.addEventListener('change',()=>{

    const file =
    imageInput.files[0];

    if(file){

        const reader =
        new FileReader();

        reader.onload = (e)=>{

            selectedImageBase64 =
            e.target.result.split(',')[1];

            previewImg.src =
            e.target.result;

            previewImg.style.display =
            'block';
        };

        reader.readAsDataURL(file);
    }
});


/* TOAST */

function showToast(message){

    const toast =
    document.getElementById('toast');

    toast.innerText = message;

    toast.style.display = 'block';

    setTimeout(()=>{

        toast.style.display = 'none';

    },3000);
}


/* MESSAGE */

function appendMessage(role,text){

    const msgDiv =
    document.createElement('div');

    msgDiv.className =
    `${role}-message chat-message`;

    if(role === 'ai'){

        msgDiv.innerHTML =
        marked.parse(text);

        msgDiv
        .querySelectorAll('pre code')
        .forEach((block)=>{

            hljs.highlightElement(block);
        });


        /* COPY BUTTON */

        msgDiv
        .querySelectorAll('pre')
        .forEach(pre=>{

            const copyBtn =
            document.createElement('button');

            copyBtn.className =
            'copy-btn';

            copyBtn.innerText =
            'Copy';

            copyBtn.onclick = ()=>{

                const code =
                pre.querySelector('code');

                navigator.clipboard.writeText(
                    code
                    ? code.innerText
                    : pre.innerText
                );

                copyBtn.innerText =
                'Copied!';

                setTimeout(()=>{

                    copyBtn.innerText =
                    'Copy';

                },2000);
            };

            pre.appendChild(copyBtn);
        });

    }else{

        msgDiv.innerText = text;
    }

    outputContainer.appendChild(msgDiv);

    outputContainer.scrollTop =
    outputContainer.scrollHeight;

    saveChatHistory();
}


/* HISTORY */

function saveChatHistory(){

    localStorage.setItem(
        'nebula_chat_history',
        outputContainer.innerHTML
    );
}

function loadChatHistory(){

    const history =
    localStorage.getItem(
        'nebula_chat_history'
    );

    if(history){

        outputContainer.innerHTML =
        history;
    }
}

loadChatHistory();


/* AI RESPONSE */

async function getAIResponse(
    prompt,
    imageBase64
){

    if(!geminiApiKey){

        showToast(
            'Enter Gemini API Key'
        );

        return;
    }

    lastPrompt = prompt;


    /* LOADING */

    const loadingDiv =
    document.createElement('div');

    loadingDiv.className =
    'loading chat-message ai-message';

    loadingDiv.innerHTML = `
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
    `;

    outputContainer.appendChild(
        loadingDiv
    );

    outputContainer.scrollTop =
    outputContainer.scrollHeight;


    try{

        const contents = [{
            parts:[
                {
                    text:
                    prompt ||
                    "What is in this image?"
                }
            ]
        }];


        if(imageBase64){

            contents[0].parts.push({

                inline_data:{

                    mime_type:"image/jpeg",

                    data:imageBase64
                }
            });
        }


        const response =
        await fetch(
            `${API_URL}?key=${geminiApiKey}`,
            {
                method:'POST',

                headers:{
                    'Content-Type':
                    'application/json'
                },

                body:JSON.stringify({
                    contents
                })
            }
        );


        if(!response.ok){

            const errorData =
            await response.json();

            throw new Error(
                errorData.error?.message
            );
        }


        const data =
        await response.json();

        loadingDiv.remove();


        const aiText =
        data.candidates?.[0]
        ?.content?.parts?.[0]?.text;


        if(aiText){

            appendMessage(
                'ai',
                aiText
            );

        }else{

            appendMessage(
                'ai',
                'No response from AI'
            );
        }

    }catch(error){

        loadingDiv.remove();

        appendMessage(
            'ai',
            `Error: ${error.message}`
        );

        showToast(error.message);

        console.error(error);
    }
}


/* SEND */

sendBtn.addEventListener('click',()=>{

    const text =
    promptInput.value.trim();

    if(text || selectedImageBase64){

        appendMessage(
            'user',
            text || 'Sent an image'
        );

        getAIResponse(
            text,
            selectedImageBase64
        );

        promptInput.value = '';

        imageInput.value = '';

        selectedImageBase64 = null;

        previewImg.style.display =
        'none';
    }
});


/* ENTER */

promptInput.addEventListener(
    'keypress',
    (e)=>{

        if(e.key === 'Enter'){

            sendBtn.click();
        }
    }
);


/* CLEAR */

document
.getElementById('clear-chat-btn')
.addEventListener('click',()=>{

    outputContainer.innerHTML = '';

    localStorage.removeItem(
        'nebula_chat_history'
    );

    showToast('Chat Cleared!');
});


/* EXPORT */

document
.getElementById('export-btn')
.addEventListener('click',()=>{

    const chatText =
    outputContainer.innerText;

    const blob =
    new Blob(
        [chatText],
        {
            type:'text/plain'
        }
    );

    const a =
    document.createElement('a');

    a.href =
    URL.createObjectURL(blob);

    a.download =
    'nebula-chat.txt';

    a.click();

    showToast('Chat Exported!');
});


/* RETRY */

document
.getElementById('retry-btn')
.addEventListener('click',()=>{

    if(lastPrompt){

        getAIResponse(
            lastPrompt,
            selectedImageBase64
        );
    }
});


/* MIC */

const recognition =
new webkitSpeechRecognition();

recognition.continuous = false;

recognition.lang = 'en-US';

document
.getElementById('mic-btn')
.addEventListener('click',()=>{

    recognition.start();
});

recognition.onresult = (event)=>{

    promptInput.value =
    event.results[0][0].transcript;
};


/* THEME */

const themeToggle =
document.getElementById('theme-toggle');

if(
    localStorage.getItem('theme')
    === 'light'
){

    document.body.classList.add(
        'light-mode'
    );

    themeToggle.innerHTML = '☀️';
}

themeToggle.addEventListener('click',()=>{

    document.body.classList.toggle(
        'light-mode'
    );

    if(
        document.body.classList.contains(
            'light-mode'
        )
    ){

        localStorage.setItem(
            'theme',
            'light'
        );

        themeToggle.innerHTML = '☀️';

    }else{

        localStorage.setItem(
            'theme',
            'dark'
        );

        themeToggle.innerHTML = '🌙';
    }
});