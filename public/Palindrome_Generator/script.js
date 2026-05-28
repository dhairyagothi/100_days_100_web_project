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

    // Action on Button Click
    checkBtn.addEventListener('click', () => {
    const val = input.value.trim();
    
    if (!val) {
        alert("Please enter some text first!");
        return;
    }

    // Function to dynamically generate a palindrome
    const generatePalindrome = (str) => {
        if (!str) return '';
        const reversed = str.split('').reverse().join('');
        return str + reversed;
    };

    const palindromeResult = generatePalindrome(val);

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
        resultBox.className = "result-container mt-4 text-center";
        resultText.innerText = "Waiting for you to click check...";
        resultIcon.innerText = "⌨️";
    });
});
