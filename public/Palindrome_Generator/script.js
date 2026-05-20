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
        const val = input.value;
        
        if (!val.trim()) {
            alert("Please enter some text first!");
            return;
        }

        const cleanStr = val.toLowerCase().replace(/[^a-z0-9]/g, '');
        const isPal = cleanStr.length > 0 && cleanStr === cleanStr.split('').reverse().join('');

        if (isPal) {
            // Success Case
            resultBox.className = "result-container mt-4 text-center success-bg";
            resultText.innerText = "YAY! It's a Palindrome 🎉";
            resultIcon.innerText = "🎆";

            // Fataka effect
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            // Failure Case
            resultBox.className = "result-container mt-4 text-center error-bg";
            resultText.innerText = "Nope! This is not a palindrome ❌";
            resultIcon.innerText = "🧐";
        }
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        resultBox.className = "result-container mt-4 text-center";
        resultText.innerText = "Waiting for you to click check...";
        resultIcon.innerText = "⌨️";
    });
});
