const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const message = document.getElementById("message");

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
    for (let i = 0; i < 5; i++) {
        const color = getRandomColor();
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
    document.body.style.background = `linear-gradient(135deg, ${bg1}, ${bg2})`;
}

// Copy color to clipboard
function copyColor(color) {
    navigator.clipboard.writeText(color);
    message.textContent = `Copied ${color}! 🎨`;
    message.classList.add("show");
    setTimeout(() => {
        message.classList.remove("show");
    }, 1500);
}

// Initialize on page load
generatePalette();
generateBtn.addEventListener("click", generatePalette);
