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
