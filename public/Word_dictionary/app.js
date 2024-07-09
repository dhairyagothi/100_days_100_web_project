let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '771aa8f7-d363-4ff0-a824-10181a86ac47';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let wordBox = document.querySelector('.words_and_meaning');
//const tableBody = document.querySelector('#tableData');
let i = 0;
let oldLength = 0;

function myFunction() {
    let elem = $('#input');
    let str = elem.val();
    // alert(elem.val() + " " + oldLength); // Comment out or remove this line
    if (oldLength != elem.val().length) {
        oldLength = elem.val().length;
        let strTosearch;
        if (i != 0) {
            strTosearch = str.slice(str.lastIndexOf(" ") + 1, str.length);
        } else {
            strTosearch = str;
        }
        getData(strTosearch);
        // alert(elem.val()); // Comment out or remove this line
        i++;
    }
}

setInterval(myFunction, 5000);

var speech = true;
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
    // console.log(transcript); // Optional: Keep for debugging
});

recognition.start();
recognition.addEventListener('end', recognition.start);

searchBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // clear data 
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    // Get input data
    let word = input.value;
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
    // document.getElementById("input").value = ""; // Optional: Uncomment to clear input after search
});

async function getData(word) {
    loading.style.display = 'block';
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data = await response.json();

    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = 'No result found';
        return;
    }

    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
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

    loading.style.display = 'none';
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
