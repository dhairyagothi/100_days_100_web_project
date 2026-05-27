const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const message = document.getElementById("message");
let currentPalette = [];

// Generate a random hex color
function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Generate palette of colors
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
        colorDiv.addEventListener("click", () => copyColor(color));
        palette.appendChild(colorDiv);
    }

    // Update background gradient dynamically
    const bg1 = getRandomColor();
    const bg2 = getRandomColor();

    document.body.style.background =
        `linear-gradient(135deg, ${bg1}, ${bg2})`;
}

// Copy color to clipboard
function copyColor(color) {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(color)
            .then(() => {
                showMessage(`Copied ${color}! 🎨`);
            })
            .catch(() => {
                fallbackCopyText(color);
            });

    } else {
        // Fallback for unsupported browsers
        fallbackCopyText(color);
    }
}

function fallbackCopyText(text) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        if (successful) {
            showMessage(`Copied ${text}! 🎨`);
        } else {
            showMessage("Copy failed. Please copy manually.");
        }
    } catch (error) {
        console.error("Fallback copy failed:", error);
        showMessage("Clipboard not supported in this browser.");
    }
}

function showMessage(text) {
    message.textContent = text;
    message.classList.add("show");
    setTimeout(() => {
        message.classList.remove("show");
    }, 1500);
}

function downloadPalette() {
    if (currentPalette.length === 0) {
        showMessage("No palette available to download.");
        return;
    }

    const paletteText = currentPalette.join("\n");
    const blob = new Blob([paletteText], {
        type: "text/plain"
    });

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


// Initialize on page load
generatePalette();
generateBtn.addEventListener("click", generatePalette);
const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", downloadPalette);
