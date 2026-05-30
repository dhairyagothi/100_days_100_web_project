/**
 * Palindrome Check Logic
 * Triggered only on Button Click
 */

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('inputString');
    const checkBtn = document.getElementById('checkBtn');
    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const resultIcon = document.getElementById('resultIcon');
    const clearBtn = document.getElementById('clearBtn');
    const characterContainer = document.getElementById('characterContainer');
const processedText = document.getElementById('processedText');
const comparisonCount = document.getElementById('comparisonCount');
const educationalToggle = document.getElementById('educationalToggle');

let educationalMode = true;
educationalToggle.addEventListener('click', () => {
    educationalMode = !educationalMode;

    educationalToggle.innerText = educationalMode
        ? "Educational Mode: ON"
        : "Educational Mode: OFF";
});

    // Action on Button Click
    checkBtn.addEventListener('click', () => {
    const val = input.value.trim();
    
    if (!val) {
        alert("Please enter some text first!");
        return;
    }

    // Function to find the shortest palindrome addition
    const makeShortestPalindrome = (str) => {
        // Check if a substring is a palindrome
        const isPalindrome = (s) => s === s.split('').reverse().join('');

        // Find the longest palindrome suffix
        for (let i = 0; i < str.length; i++) {
            const suffix = str.slice(i);
            if (isPalindrome(suffix)) {
                // Take the prefix (the part before the palindrome), 
                // reverse it, and add it to the end.
                const prefix = str.slice(0, i);
                const neededAddition = prefix.split('').reverse().join('');
                return str + neededAddition;
            }
        }
        return str;
    };

    const palindromeResult = makeShortestPalindrome(val.toLowerCase());
    const cleanedText = palindromeResult
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

processedText.innerHTML =
    `Processed String: <strong>${cleanedText}</strong>`;

characterContainer.innerHTML = "";

let comparisons = 0;

cleanedText.split('').forEach((char, index) => {
    const charBox = document.createElement('div');

    charBox.classList.add('char-box');
    charBox.innerText = char;

    characterContainer.appendChild(charBox);
});

const charBoxes = document.querySelectorAll('.char-box');

let left = 0;
let right = cleanedText.length - 1;

const interval = setInterval(() => {

    if (left >= right) {
        clearInterval(interval);
        comparisonCount.innerText =
            `Comparisons: ${comparisons}`;
        return;
    }

    comparisons++;

    charBoxes[left].classList.add('active');
    charBoxes[right].classList.add('active');

    setTimeout(() => {

        if (cleanedText[left] === cleanedText[right]) {
            charBoxes[left].classList.add('match');
            charBoxes[right].classList.add('match');
        } else {
            charBoxes[left].classList.add('mismatch');
            charBoxes[right].classList.add('mismatch');
        }

        charBoxes[left].classList.remove('active');
        charBoxes[right].classList.remove('active');

        left++;
        right--;

        comparisonCount.innerText =
            `Comparisons: ${comparisons}`;

    }, educationalMode ? 500 : 0);

}, educationalMode ? 800 : 0);

    // Update UI
    resultBox.className = "result-container mt-4 text-center success-bg";
    resultText.innerText = `Result: ${palindromeResult}`;
    resultIcon.innerText = "🎯";

    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
});


   clearBtn.addEventListener('click', () => {

    input.value = '';

    resultBox.className =
        "result-container mt-4 text-center";

    resultText.innerText =
        "Waiting for you to click generate...";

    resultIcon.innerText = "⌨️";

    characterContainer.innerHTML = "";

    processedText.innerHTML = "";

    comparisonCount.innerText =
        "Comparisons: 0";
});
});
