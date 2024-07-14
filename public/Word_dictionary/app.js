
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let startSpeakBtn = document.querySelector('#startSpeak');
let stopSpeakBtn = document.querySelector('#stopSpeak');
let apiKey = 'put API key Here';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let wordBox = document.querySelector('.words_and_meaning');
let i = 0;
let oldLength = 0;

function myFunction() {
    let elem = $('#input');
    let str = elem.val();
    if (oldLength != elem.val().length) {
        oldLength = elem.val().length;
        let strTosearch;
        if (i != 0) {
            strTosearch = str.slice(str.lastIndexOf(" ") + 1, str.length);
        } else {
            strTosearch = str;

        }
        getData(strTosearch);
        i++;
    }
}

setInterval(myFunction, 5000);

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.continuous = true;

recognition.addEventListener('result', e => {
    let transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
    
    document.getElementById("input").value = transcript;
});

startSpeakBtn.addEventListener('click', function() {
    recognition.start();
});

stopSpeakBtn.addEventListener('click', function() {
    recognition.stop();
});

searchBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // clear data 
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    // Get input data
    let word = input.value.trim();
    // call API get data
    if (word === '') {
        alert('Word is required');
        return;
    }
    let wordTosearch = "";
    if (i != 0) {
        wordTosearch = word.slice(word.lastIndexOf(" ") + 1, word.length);
    } else {
        wordTosearch = word;
    }

    getData(wordTosearch);
    i++;
});

async function getData(word) {
    if (!word) {
        return;
    }

    loading.style.display = 'block';
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data = await response.json();

    loading.style.display = 'none';

    if (!data.length) {
        notFound.innerText = 'No result found';
        return;
    }

    if (typeof data[0] === 'string') {
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerText = element;
            notFound.appendChild(suggestion);
        });
        return;
    }

    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    let words = document.createElement('span');
    let meaning = document.createElement('span');
    let br = document.createElement('br');

    words.classList.add('suggested');
    meaning.classList.add('suggested');
    words.innerHTML = word;
    meaning.innerHTML = definition;

    wordBox.appendChild(words);
    wordBox.appendChild(meaning);
    wordBox.appendChild(br);
}
