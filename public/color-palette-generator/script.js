const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const message = document.getElementById("message");

function getRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
}

let currentPalette = [];
let messageTimer;

function generatePalette() {
    if (!palette) return;

    palette.innerHTML = "";
    currentPalette = [];

    for (let i = 0; i < 5; i++) {
        const color = getRandomColor();

        currentPalette.push(color);

        const colorDiv = document.createElement("div");
        colorDiv.classList.add("color");
        colorDiv.style.backgroundColor = color;
        colorDiv.textContent = color;

        colorDiv.tabIndex = 0;
        colorDiv.setAttribute("aria-label", `Copy color ${color}`);

        colorDiv.addEventListener("click", () => copyColor(color));

        colorDiv.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                copyColor(color);
            }
        });

        palette.appendChild(colorDiv);
    }

    localStorage.setItem(
        "lastPalette",
        JSON.stringify(currentPalette)
    );

    document.body.style.background = `linear-gradient(135deg, ${getRandomColor()}, ${getRandomColor()})`;
}

function copyColor(color) {
    navigator.clipboard.writeText(color)
        .then(() => showMessage(`${color} copied!`))
        .catch(() => showMessage("Copy failed"));
}

function showMessage(text) {
    if (!message) return;

    clearTimeout(messageTimer);

    message.textContent = text;
    message.classList.add("show");

    messageTimer = setTimeout(() => {
        message.classList.remove("show");
    }, 1500);
}

function downloadPalette() {
    if (currentPalette.length === 0) {
        showMessage("No palette available to download.");
        return;
    }

    const blob = new Blob(
        [currentPalette.join("\n")],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "color-palette.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    showMessage("Palette downloaded successfully! 🎨");
}

generatePalette();

generateBtn?.addEventListener("click", generatePalette);
downloadBtn?.addEventListener("click", downloadPalette);