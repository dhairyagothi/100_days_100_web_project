document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#input');
    const searchBtn = document.querySelector('#search');
    const apiUrl = '';  // Your API key here
    const notFound = document.querySelector('.not__found');
    const defBox = document.querySelector('.def');
    const audioBox = document.querySelector('.audio');
    const loading = document.querySelector('.loading');
    const wordBox = document.querySelector('.words_and_meaning');
    let oldLength = 0;

    function myFunction() {
        const str = input.value;
        if (oldLength !== str.length) {
            oldLength = str.length;
            const strToSearch = str.split(' ').pop();
            getData(strToSearch);
        }
    }

    setInterval(myFunction, 5000);

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.addEventListener('result', e => {
            const transcript = Array.from(e.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            input.value = transcript;
        });

        recognition.addEventListener('end', recognition.start);
        recognition.start();
    } else {
        console.log('Speech Recognition API not supported in this browser.');
    }

    searchBtn.addEventListener('click', e => {
        e.preventDefault();
        clearData();
        const word = input.value.trim();
        if (word === '') {
            alert('Word is required');
            return;
        }
        const wordToSearch = word.split(' ').pop();
        getData(wordToSearch);
    });

    function clearData() {
        audioBox.innerHTML = '';
        notFound.innerText = '';
        defBox.innerText = '';
    }

    async function getData(word) {
        loading.style.display = 'block';
        try {
            const response = await fetch(`${apiUrl}?word=${word}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            loading.style.display = 'none';
            if (!data.length) {
                notFound.innerText = 'No result found';
                return;
            }
            if (typeof data[0] === 'string') {
                displaySuggestions(data);
                return;
            }
            displayDefinition(data[0], word);
        } catch (error) {
            loading.style.display = 'none';
            notFound.innerText = 'Error fetching data';
            console.error('Error fetching data:', error);
        }
    }

    function displaySuggestions(suggestions) {
        const heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        suggestions.forEach(suggestion => {
            const suggestionElement = document.createElement('span');
            suggestionElement.classList.add('suggested');
            suggestionElement.innerText = suggestion;
            notFound.appendChild(suggestionElement);
        });
    }

    function displayDefinition(data, word) {
        const definition = data.shortdef[0];
        defBox.innerText = definition;

        const wordElement = document.createElement('span');
        const meaningElement = document.createElement('span');
        const br = document.createElement('br');

        wordElement.classList.add('suggested');
        meaningElement.classList.add('suggested');
        wordElement.innerHTML = word;
        meaningElement.innerHTML = definition;

        wordBox.appendChild(wordElement);
        wordBox.appendChild(meaningElement);
        wordBox.appendChild(br);
    }
});

// Voice search functionality
document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const output = document.getElementById('output');
    const status = document.getElementById('status');
    const input = document.querySelector('#input');
    const apiUrl = 'put your API key here';  // Your API key here

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        status.textContent = 'Speech Recognition API is not supported in this browser.';
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        status.textContent = 'Listening...';
    };

    recognition.onend = () => {
        status.textContent = 'Stopped listening.';
    };

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        output.value = transcript;
        input.value = transcript;  // Pass transcript to input field

        // Automatically trigger search after a short delay
        setTimeout(() => {
            searchBtn.click();
        }, 1000);
        
        console.log('Transcript:', transcript); // Log transcript for debugging
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        status.textContent = 'Error occurred in recognition: ' + event.error;
    };

    startBtn.addEventListener('click', () => {
        output.value = ''; // Clear the output textarea
        recognition.start();
    });

    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
});
