// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("change", () => {
    document.body.classList.toggle("light");
});

const wheel = document.querySelector(".wheel");
const spinBtn = document.getElementById("spinBtn");
const winnerText = document.getElementById("winnerText");
const winnerEmoji = document.getElementById("winnerEmoji");
const historyList = document.getElementById("historyList");
const removeBtn = document.querySelector(".remove-result-btn");
const options = [
    { name: "Pizza", emoji: "🍕" },
    { name: "Burger", emoji: "🍔" },
    { name: "Pasta", emoji: "🍝" },
    { name: "Momos", emoji: "🥟" },
    { name: "Sandwich", emoji: "🥪" },
    { name: "Ice Cream", emoji: "🍨" },
    { name: "learn DSA", emoji: "💻" },
    { name: "Open Source", emoji: "💻" }
];

// SPIN WHEEL

let isSpinning = false;

spinBtn.addEventListener("click", () => {

    if (isSpinning) return;
    isSpinning = true;
    spinBtn.textContent = "SPINNING...";
    const randomIndex = Math.floor(
        Math.random() * options.length
    );
    const segmentSize = 360 / options.length;
const targetAngle =
        360 -
        (randomIndex * segmentSize) -
        (segmentSize / 2);

    const rotation =
        3600 + targetAngle;

    wheel.style.transform =
        `rotate(${rotation}deg)`;

    setTimeout(() => {

        // Update Result
winnerText.textContent =
    options[randomIndex].name;

winnerText.classList.remove("winner-animate");

void winnerText.offsetWidth;

winnerText.classList.add("winner-animate");
        winnerEmoji.textContent =
            options[randomIndex].emoji;
launchConfetti();
        // Remove placeholder history

        if (
            historyList.querySelector(".history-empty")
        ) {
            historyList.innerHTML = "";
        }

        // Add history item

        const historyItem =
            document.createElement("li");

        historyItem.textContent =
            `${options[randomIndex].emoji} ${options[randomIndex].name}`;

        historyList.prepend(historyItem);

        spinBtn.textContent = "SPIN";

        isSpinning = false;

    }, 5000);

});

// REMOVE RESULT

removeBtn.addEventListener("click", () => {

    winnerText.textContent =
        "Spin the wheel!";
    winnerEmoji.textContent =
        "🎯";

    historyList.innerHTML = `
        <li class="history-empty">
            No spins yet
        </li>
    `;

});

function launchConfetti() {
const duration = 3000;
    const end = Date.now() + duration;
    (function frame() {

        confetti({
            particleCount: 6,
            angle: 60,
            spread: 60,
            origin: { x: 0 }
        });

        confetti({
            particleCount: 6,
            angle: 120,
            spread: 60,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }

    })();
}
