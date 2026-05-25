const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const message = document.getElementById("message");

// Track current palette colors
let currentColors = [];

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
    currentColors = [];
    for (let i = 0; i < 5; i++) {
        const color = getRandomColor();
        currentColors.push(color);
        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color");
        colorDiv.style.background = color;
        colorDiv.textContent = color;
        colorDiv.addEventListener("click", () => copyColor(color));
        palette.appendChild(colorDiv);
    }
    const bg1 = getRandomColor();
    const bg2 = getRandomColor();
    document.body.style.background = `linear-gradient(135deg, ${bg1}, ${bg2})`;
}

// Copy color to clipboard with secure context check and fallback
async function copyColor(color) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(color);
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = color;
            textArea.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const success = document.execCommand("copy");
            document.body.removeChild(textArea);
            if (!success) throw new Error("execCommand failed");
        }
        showMessage(`Copied ${color}! 🎨`);
    } catch (err) {
        showMessage(`❌ Copy failed. Try manually: ${color}`);
        console.error("Clipboard error:", err);
    }
}

// Download current palette as .txt file
function downloadPalette() {
    if (currentColors.length === 0) {
        showMessage("Generate a palette first!");
        return;
    }
    const content = currentColors.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "palette.txt";
    link.click();
    URL.revokeObjectURL(link.href);
    showMessage("⬇ Palette downloaded!");
}

// Show feedback message
function showMessage(text) {
    message.textContent = text;
    message.classList.add("show");
    setTimeout(() => message.classList.remove("show"), 2000);
}

// Initialize
generatePalette();
generateBtn.addEventListener("click", generatePalette);
downloadBtn.addEventListener("click", downloadPalette);
