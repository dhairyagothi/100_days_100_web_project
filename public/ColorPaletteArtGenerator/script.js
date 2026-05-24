const imageUpload = document.getElementById('imageUpload');
const statusMsg = document.getElementById('statusMsg');
const resultSection = document.getElementById('resultSection');
const previewImage = document.getElementById('previewImage');
const swatchesContainer = document.getElementById('swatchesContainer');
const toast = document.getElementById('toast');

const colorThief = new ColorThief();

imageUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        if (!file.type.match('image.*')) {
            statusMsg.textContent = "Please select a valid image file (JPG, PNG, WEBP).";
            statusMsg.style.color = "#ba1a1a"; // Error color
            return;
        }

        statusMsg.textContent = `Processing ${file.name}...`;
        statusMsg.style.color = "var(--md-sys-color-on-surface-variant)";
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
            resultSection.style.display = 'flex';
        };

        reader.readAsDataURL(file);
    }
});

previewImage.addEventListener('load', function () {
    try {

        const palette = colorThief.getPalette(previewImage, 6);
        renderPalette(palette);
        statusMsg.textContent = "Palette generated successfully!";
    } catch (error) {
        console.error("Extraction failed:", error);
        statusMsg.textContent = "Failed to extract colors. Please try a different image.";
    }
});


function renderPalette(paletteArray) {
    swatchesContainer.innerHTML = '';

    paletteArray.forEach(color => {
        const [r, g, b] = color;
        const hex = rgbToHex(r, g, b);

        const wrapper = document.createElement('div');
        wrapper.className = 'swatch-wrapper';
        wrapper.onclick = () => copyToClipboard(hex);

        const swatch = document.createElement('div');
        swatch.className = 'swatch';
        swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

        const label = document.createElement('span');
        label.className = 'swatch-label';
        label.textContent = hex;

        wrapper.appendChild(swatch);
        wrapper.appendChild(label);
        swatchesContainer.appendChild(wrapper);
    });
}


function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}


function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied ${text}`);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}