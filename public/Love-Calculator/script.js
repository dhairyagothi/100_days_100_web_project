
let isCalculating = false;

window.onload = function () {
    const button = document.getElementById("calculate");
    button.addEventListener("click", calculateLove);
       // Existing logic plus new features
const introScreen = document.getElementById('introScreen');
const calcScreen = document.getElementById('calcScreen');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const themeSelector = document.getElementById('themeSelector');

// Navigation Logic
yesBtn.addEventListener('click', () => {
    introScreen.classList.add('hidden');
    calcScreen.classList.remove('hidden');
});

// Playful "No" Button
noBtn.addEventListener('mouseover', () => {
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 150);
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${x}px`;
    noBtn.style.top = `${y}px`;
});

// Theme Switcher
themeSelector.addEventListener('change', (e) => {
    document.body.className = e.target.value;
});

// --- DYNAMIC EMOJI INPUT LOGIC ---
const fnameInput = document.getElementById("fname");
const cnameInput = document.getElementById("cname");

const yourEmojis = ['😌', '🙈', '😳', '😎', '🤪', '🙂‍↔️'];
const crushEmojis = ['🥰', '😘', '😚', '😍', '😋', '🤩', '😻'];

// Function to update input style with emoji
function updateEmojiOnInput(inputElement, displayId, emojiArray) {
       const displaySpan = document.getElementById(displayId);
       if (inputElement.value.length > 0) {
           displaySpan.textContent = emojiArray[Math.floor(Math.random() * emojiArray.length)];
       } else {
           displaySpan.textContent = "";
       }
   }
   // Call it like this:
   fnameInput.addEventListener("input", () => updateEmojiOnInput(fnameInput, 'fname-emoji', yourEmojis));
cnameInput.addEventListener("input", () => updateEmojiOnInput(cnameInput,'cname-emoji', crushEmojis));
// --- END OF DYNAMIC EMOJI LOGIC ---

// --- MUSIC BLOCK ---
const musicToggle = document.getElementById("musicToggle");
const songList = document.getElementById("songList");
const audioPlayer = document.getElementById("audioPlayer");
const stopMusic = document.getElementById("stopMusic");

// Toggle the visibility of the song list
musicToggle.addEventListener("click", () => {
    songList.classList.toggle("hidden");
});

// Stop Music Logic
stopMusic.addEventListener("click", () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0; // Reset to start
    songList.classList.add("hidden");
});

// Play Song Logic
// We select all song divs EXCEPT the stop button
songList.querySelectorAll("div:not(#stopMusic)").forEach(song => {
    song.addEventListener("click", () => {
        const src = song.getAttribute("data-src");
        if (src) {
            audioPlayer.src = encodeURI(src);
        }
        audioPlayer.play();
        songList.classList.add("hidden");
    });
});

    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
        toggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            localStorage.setItem(
                "theme",
                document.body.classList.contains("dark")
            );
        });
    }

    if (localStorage.getItem("theme") === "true") {
        document.body.classList.add("dark");
    }
};
/* Enter key support */

document.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        calculateLove();
    }
});



/* Main Love Calculator Function */

function calculateLove() {
    if (isCalculating) return;

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

    isCalculating = true;

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

            emoji = '<i class="fas fa-heart-broken fa-beat" style="color: #ef4444;"></i>';

            msg = lowMessages[
                Math.floor(Math.random() * lowMessages.length)
            ];
            updateBackgroundEmojis(['😭']); 

        } else if (loveIndex <= 60) {

            emoji = '<i class="fas fa-heart fa-bounce" style="color: #fbbf24;"></i>';

            msg = mediumMessages[
                Math.floor(Math.random() * mediumMessages.length)
            ];
            updateBackgroundEmojis(['🤓', '🙈', '🫧']); 

        } else if (loveIndex <= 90) {

            emoji = '<i class="fas fa-heart fa-pulse" style="color: #ec4899;"></i>';

            msg = highMessages[
                Math.floor(Math.random() * highMessages.length)
            ];
            updateBackgroundEmojis(['😍', '🥰', '❤️']); 

        } else {

            emoji = '<i class="fas fa-fire fa-flashing" style="color: #f97316;"></i>';

            msg = soulmateMessages[
                Math.floor(Math.random() * soulmateMessages.length)
            ];
            updateBackgroundEmojis(['❤️', '💕']);
        }

        // Display result
        const resultMsgEl = document.getElementById("result-message");
        resultMsgEl.innerHTML = `${emoji} <span style="font-size: 3rem; margin: 0 15px;">${loveIndex}%</span> ${emoji}`;

        document.getElementById("result-percentage").textContent =
            `${yourName} & ${crushName} — ${msg}`;

        // Show animated result
        footer.classList.add("show-result");

        // Toggle buttons
        isCalculating = false;
        
    }, 1800);

 

}
//Adding changing background emojis
function updateBackgroundEmojis(emojis) {
    const heartsContainer = document.querySelector(".hearts");
    heartsContainer.innerHTML = ""; // Clear existing hearts
    
    for (let i = 0; i < 20; i++) { // Generating 20 emojis
        const span = document.createElement("span");
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = `${Math.random() * 95}%`;
        span.style.animationDuration = `${Math.random() * 5 + 5}s`;
        span.style.fontSize = `${Math.random() * 20 + 20}px`;
        heartsContainer.appendChild(span);
    }
}
