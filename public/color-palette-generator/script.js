const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const message = document.getElementById("message");

let currentPalette = [];
let messageTimer;

function generatePalette() {
    palette.innerHTML = "";
    currentPalette = [];

    for (let i = 0; i < 5; i++) {
        const color = getRandomColor();

        currentPalette.push(color);

        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color");
        colorDiv.style.background = color;
        colorDiv.textContent = color;

        // Mouse click support
        colorDiv.addEventListener("click", () => copyColor(color));

        // Keyboard accessibility
        colorDiv.tabIndex = 0;
        colorDiv.setAttribute(
            "aria-label",
            `Copy color ${color}`
        );

        colorDiv.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                copyColor(color);
            }
        });

        palette.appendChild(colorDiv);
    }

    // Save latest palette
    localStorage.setItem(
        "lastPalette",
        JSON.stringify(currentPalette)
    );

    // Dynamic background
    const bg1 = getRandomColor();
    const bg2 = getRandomColor();

    document.body.style.background =
        `linear-gradient(135deg, ${bg1}, ${bg2})`;
}

function showMessage(text) {
    clearTimeout(messageTimer);

    message.textContent = text;
    message.classList.add("show");

    messageTimer = setTimeout(() => {
        message.classList.remove("show");
    }, 1500);
}

function downloadPalette() {
    try {
        if (currentPalette.length === 0) {
            showMessage("No palette available to download.");
            return;
        }

        const paletteText = currentPalette.join("\n");

        const blob = new Blob(
            [paletteText],
            { type: "text/plain" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "color-palette.txt";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showMessage("Palette downloaded successfully! 🎨");
    }
    catch (error) {
        console.error("Download failed:", error);
        showMessage("Download failed");
    }
}

// Initialize page
generatePalette();

generateBtn.addEventListener(
    "click",
    generatePalette
);

if (downloadBtn) {
    downloadBtn.addEventListener(
        "click",
        downloadPalette
    );
}