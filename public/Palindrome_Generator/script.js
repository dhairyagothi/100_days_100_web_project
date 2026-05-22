document.addEventListener('DOMContentLoaded', () => {

    const input = document.getElementById('inputString');
    const checkBtn = document.getElementById('checkBtn');
    const clearBtn = document.getElementById('clearBtn');

    const resultBox = document.getElementById('resultBox');
    const resultText = document.getElementById('resultText');
    const resultIcon = document.getElementById('resultIcon');

    // Check Button
    checkBtn.addEventListener('click', () => {

        const value = input.value.trim();

        // Empty Input
        if (value === '') {

            alert('Please enter some text!');
            return;
        }

        // Clean Input
        const cleaned = value.toLowerCase().replace(/\s/g, '');

        // Reverse
        const reversed = cleaned.split('').reverse().join('');

        // Palindrome Check
        if (cleaned === reversed) {

            resultBox.className =
                "result-container mt-4 text-center success-bg";

            resultText.innerText =
                `"${value}" is a Palindrome ✅`;

            resultIcon.innerText = "🎉";

            // Confetti
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 }
            });

        } else {

            resultBox.className =
                "result-container mt-4 text-center error-bg";

            resultText.innerText =
                `"${value}" is NOT a Palindrome ❌`;

            resultIcon.innerText = "❌";
        }

    });

    // Clear Button
    clearBtn.addEventListener('click', () => {

        input.value = '';

        resultBox.className =
            "result-container mt-4 text-center";

        resultText.innerText =
            "Waiting for you to click check...";

        resultIcon.innerText = "⌨️";

    });

});