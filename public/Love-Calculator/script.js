
window.onload = function () {
    const button = document.getElementById("calculate");
    button.addEventListener("click", calculateLove);
};
/* Enter key support */

document.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        calculateLove();
    }
});



/* Main Love Calculator Function */

function calculateLove() {

    // Get input values
    const yourName = document.getElementById("fname").value.trim();
    const crushName = document.getElementById("cname").value.trim();

    // Footer section for animation
    const footer = document.querySelector(".footer");

    // Loading text element
    const loading = document.getElementById("loading");

    // Input validation
    const namePattern = /^[A-Za-z\s]+$/;

    // Empty input validation
    if (!yourName || !crushName) {

        document.getElementById("result-message").textContent =
            "Please enter both names!";

        footer.classList.add("show-result");

        return;
    }

    // Invalid character validation
    if (!namePattern.test(yourName) || !namePattern.test(crushName)) {

        document.getElementById("result-message").textContent =
            "Please enter valid names only!";

        footer.classList.add("show-result");

        return;
    }

    // Show loading animation
    loading.classList.remove("hidden");

    // Hide previous result
    footer.classList.remove("show-result");

    // Delay for loading effect
    setTimeout(() => {

        // Hide loading
        loading.classList.add("hidden");

        // Combine names
        const combined = (yourName + crushName).toLowerCase();

        // Store character frequencies
        const letterCounts = {};

        // Count repeated letters
        for (const letter of combined) {

            if (letter !== " ") {

                letterCounts[letter] =
                    (letterCounts[letter] || 0) + 1;
            }
        }

        // Improved compatibility score
        let weightedScore = 0;

        // Repeated characters matter more
        Object.values(letterCounts).forEach(count => {

            weightedScore += count * count;
        });

        // Add name length factor
        weightedScore += combined.length * 3;

        // Final percentage
        const loveIndex = weightedScore % 101;

        // Romantic dynamic messages
        const lowMessages = [
            "Better as friends maybe 💔",
            "This could be difficult!",
            "Not the strongest match!"
        ];

        const mediumMessages = [
            "There's potential 💛",
            "Cute connection detected!",
            "Interesting chemistry!"
        ];

        const highMessages = [
            "Great match 💕",
            "You both look adorable together!",
            "Strong compatibility!"
        ];

        const soulmateMessages = [
            "Soulmates ❤️‍🔥",
            "A match made in heaven!",
            "Destiny brought you together 💖"
        ];

        let emoji = "";
        let msg = "";

        // Result categories
        if (loveIndex <= 30) {

            emoji = "💔";

            msg = lowMessages[
                Math.floor(Math.random() * lowMessages.length)
            ];

        } else if (loveIndex <= 60) {

            emoji = "💛";

            msg = mediumMessages[
                Math.floor(Math.random() * mediumMessages.length)
            ];

        } else if (loveIndex <= 90) {

            emoji = "💕";

            msg = highMessages[
                Math.floor(Math.random() * highMessages.length)
            ];

        } else {

            emoji = "❤️‍🔥";

            msg = soulmateMessages[
                Math.floor(Math.random() * soulmateMessages.length)
            ];
        }

        // Display result
        document.getElementById("result-message").textContent =
            `${emoji} ${loveIndex}% ${emoji}`;

        document.getElementById("result-percentage").textContent =
            `${yourName} & ${crushName} — ${msg}`;

        // Show animated result
        footer.classList.add("show-result");

        // Toggle buttons
        
    }, 1800);
}