// ================================
// Palette Lab - script.js
// Part 1: Upload, Drag & Drop, Preview
// ================================

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const paletteContainer = document.getElementById("paletteContainer");
const copyAllBtn = document.getElementById("copyAll");
const themeToggle = document.getElementById("themeToggle");
const dropZone = document.getElementById("dropZone");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let currentPalette = [];

// -------------------------------
// Upload Image
// -------------------------------

imageInput.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image")) {
        alert("Please upload an image.");
        return;
    }

    loadImage(file);
});

// -------------------------------
// Drag & Drop
// -------------------------------

["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.add("drag-over");
    });
});

["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
        dropZone.classList.remove("drag-over");
    });
});

dropZone.addEventListener("drop", e => {

    const file = e.dataTransfer.files[0];

    if (!file) return;

    if (!file.type.startsWith("image")) {
        alert("Please upload an image.");
        return;
    }

    loadImage(file);

});

// -------------------------------
// Load Image
// -------------------------------

function loadImage(file) {

    const reader = new FileReader();

    reader.onload = function (event) {

        previewImage.src = event.target.result;
        previewImage.style.display = "block";

        const img = new Image();

        img.onload = function () {

            extractPalette(img);

        };

        img.src = event.target.result;

    };

    reader.readAsDataURL(file);

}

// -------------------------------
// Resize Canvas
// -------------------------------

function prepareCanvas(img) {

    const MAX_SIZE = 250;

    let width = img.width;
    let height = img.height;

    if (width > height) {

        if (width > MAX_SIZE) {

            height *= MAX_SIZE / width;
            width = MAX_SIZE;

        }

    } else {

        if (height > MAX_SIZE) {

            width *= MAX_SIZE / height;
            height = MAX_SIZE;

        }

    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

}

// -------------------------------
// Extract Palette
// -------------------------------

function extractPalette(img) {

    prepareCanvas(img);

    const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const pixels = imageData.data;

    const buckets = new Map();

    processPixels(pixels, buckets);

}

// ================================
// Palette Lab - script.js
// Part 2: Color Extraction Algorithm
// ================================

// --------------------------------------
// Process Pixels
// --------------------------------------

function processPixels(pixels, buckets) {

    // Skip every 4th pixel for better performance
    for (let i = 0; i < pixels.length; i += 16) {

        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];
        let a = pixels[i + 3];

        // Ignore transparent pixels
        if (a < 125) continue;

        // Quantize colors
        r = Math.floor(r / 16) * 16;
        g = Math.floor(g / 16) * 16;
        b = Math.floor(b / 16) * 16;

        const key = `${r},${g},${b}`;

        if (buckets.has(key)) {
            buckets.set(key, buckets.get(key) + 1);
        } else {
            buckets.set(key, 1);
        }
    }

    findDominantColors(buckets);

}

// --------------------------------------
// Find Top Colors
// --------------------------------------

function findDominantColors(buckets) {

    const sortedColors = [...buckets.entries()]
        .sort((a, b) => b[1] - a[1]);

    currentPalette = [];

    const MAX_COLORS = 6;

    for (let i = 0; i < MAX_COLORS && i < sortedColors.length; i++) {

        const rgb = sortedColors[i][0].split(",");

        const r = Number(rgb[0]);
        const g = Number(rgb[1]);
        const b = Number(rgb[2]);

        currentPalette.push(rgbToHex(r, g, b));

    }

    renderPalette();

}

// --------------------------------------
// RGB → HEX
// --------------------------------------

function rgbToHex(r, g, b) {

    return (
        "#" +
        [r, g, b]
            .map(value =>
                value
                    .toString(16)
                    .padStart(2, "0")
            )
            .join("")
            .toUpperCase()
    );

}

// --------------------------------------
// HEX → RGB (Future Use)
// --------------------------------------

function hexToRgb(hex) {

    hex = hex.replace("#", "");

    return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
    };

}

// --------------------------------------
// Remove Similar Colors
// --------------------------------------

function colorDistance(c1, c2) {

    return Math.sqrt(

        Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2)

    );

}

// This function can be used later to
// filter nearly identical colors if needed.
function filterSimilarColors(colors) {

    const filtered = [];

    colors.forEach(color => {

        const rgb = hexToRgb(color);

        const exists = filtered.some(existing => {

            const existingRGB = hexToRgb(existing);

            return colorDistance(rgb, existingRGB) < 40;

        });

        if (!exists) {
            filtered.push(color);
        }

    });

    return filtered;

}

// ================================
// Palette Lab - script.js
// Part 3: UI Rendering, Copy, Theme
// ================================

// --------------------------------------
// Render Palette
// --------------------------------------

function renderPalette() {

    paletteContainer.innerHTML = "";

    if (currentPalette.length === 0) {
        paletteContainer.innerHTML = `
            <p class="empty-message">
                Upload an image to generate a color palette.
            </p>
        `;
        return;
    }

    currentPalette.forEach(hex => {

        const card = document.createElement("div");
        card.className = "color-card";

        card.innerHTML = `
            <div class="swatch" style="background:${hex}"></div>

            <h3>${hex}</h3>

            <button class="copy-btn">
                Copy
            </button>
        `;

        const button = card.querySelector(".copy-btn");

        button.addEventListener("click", () => {

            copyColor(hex);

        });

        paletteContainer.appendChild(card);

    });

}

// --------------------------------------
// Copy Single Color
// --------------------------------------

function copyColor(hex) {

    navigator.clipboard.writeText(hex)
        .then(() => {

            showToast(`${hex} copied!`);

        })
        .catch(() => {

            alert("Unable to copy.");

        });

}

// --------------------------------------
// Copy Entire Palette
// --------------------------------------

copyAllBtn.addEventListener("click", () => {

    if (currentPalette.length === 0) {

        showToast("No palette available.");

        return;

    }

    navigator.clipboard.writeText(
        currentPalette.join("\n")
    );

    showToast("Palette copied!");

});

// --------------------------------------
// Toast Notification
// --------------------------------------

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (toast) {
        toast.remove();
    }

    toast = document.createElement("div");

    toast.className = "toast";

    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 50);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 1800);

}

// --------------------------------------
// Theme
// --------------------------------------

function setTheme(theme) {

    document.body.classList.toggle(
        "dark",
        theme === "dark"
    );

    themeToggle.textContent =
        theme === "dark" ? "☀️" : "🌙";

    localStorage.setItem("theme", theme);

}

const savedTheme =
    localStorage.getItem("theme") || "light";

setTheme(savedTheme);

themeToggle.addEventListener("click", () => {

    const nextTheme =
        document.body.classList.contains("dark")
            ? "light"
            : "dark";

    setTheme(nextTheme);

});

// --------------------------------------
// Keyboard Shortcuts
// --------------------------------------

document.addEventListener("keydown", (e) => {

    if (e.ctrlKey && e.key.toLowerCase() === "d") {

        e.preventDefault();

        themeToggle.click();

    }

});

// --------------------------------------
// Initial Empty State
// --------------------------------------

renderPalette();