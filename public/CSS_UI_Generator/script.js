const btnGlass = document.getElementById('btn-glass');
const btnNeu = document.getElementById('btn-neumorphism');
const glassControls = document.getElementById('glass-controls');
const neuControls = document.getElementById('neu-controls');
const previewContainer = document.getElementById('preview-container');
const previewEl = document.getElementById('preview-el');
const cssOutput = document.getElementById('css-output');
const copyBtn = document.getElementById('copy-btn');

// Glassmorphism Inputs
const glassBlur = document.getElementById('glass-blur');
const glassOpacity = document.getElementById('glass-opacity');
const glassOutline = document.getElementById('glass-outline');
const glassColor = document.getElementById('glass-color');

// Neumorphism Inputs
const neuDist = document.getElementById('neu-dist');
const neuBlur = document.getElementById('neu-blur');
const neuIntensity = document.getElementById('neu-intensity');
const neuBg = document.getElementById('neu-bg');

let currentMode = 'glass'; // 'glass' or 'neu'

// Event Listeners for Mode Toggle
btnGlass.addEventListener('click', () => {
    currentMode = 'glass';
    btnGlass.classList.add('active');
    btnNeu.classList.remove('active');
    glassControls.classList.add('active');
    neuControls.classList.remove('active');
    previewContainer.classList.add('glass-bg');
    previewContainer.style.background = '';
    updatePreview();
});

btnNeu.addEventListener('click', () => {
    currentMode = 'neu';
    btnNeu.classList.add('active');
    btnGlass.classList.remove('active');
    neuControls.classList.add('active');
    glassControls.classList.remove('active');
    previewContainer.classList.remove('glass-bg');
    updatePreview();
});

// Hex to RGB helper
function hexToRgb(hex) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r}, ${g}, ${b}`;
}

// Lighten/Darken helper for Neumorphism
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Main Update Function
function updatePreview() {
    let cssText = '';

    if (currentMode === 'glass') {
        // Update Labels
        document.getElementById('val-blur').textContent = `${glassBlur.value}px`;
        document.getElementById('val-opacity').textContent = glassOpacity.value;
        document.getElementById('val-outline').textContent = `${glassOutline.value}px`;

        // Calculate Values
        const blurVal = glassBlur.value;
        const opacityVal = glassOpacity.value;
        const outlineVal = glassOutline.value;
        const rgbColor = hexToRgb(glassColor.value);

        // Apply Styles
        previewEl.style.background = `rgba(${rgbColor}, ${opacityVal})`;
        previewEl.style.backdropFilter = `blur(${blurVal}px)`;
        previewEl.style.webkitBackdropFilter = `blur(${blurVal}px)`;
        previewEl.style.border = `${outlineVal}px solid rgba(255, 255, 255, 0.18)`;
        previewEl.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
        previewEl.style.color = '#ffffff';

        // Generate CSS Code
        cssText = `/* Glassmorphism CSS */
.glass-panel {
    background: rgba(${rgbColor}, ${opacityVal});
    backdrop-filter: blur(${blurVal}px);
    -webkit-backdrop-filter: blur(${blurVal}px);
    border: ${outlineVal}px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    border-radius: 20px;
}`;
    } else {
        // Update Labels
        document.getElementById('val-dist').textContent = `${neuDist.value}px`;
        document.getElementById('val-neu-blur').textContent = `${neuBlur.value}px`;
        document.getElementById('val-intensity').textContent = neuIntensity.value;

        // Calculate Values
        const dist = neuDist.value;
        const blur = neuBlur.value;
        const intensity = parseFloat(neuIntensity.value);
        const bgColor = neuBg.value;

        // Neumorphism relies on light and dark shadows
        // We create a lighter shade and a darker shade based on intensity
        const darkColor = `rgba(0, 0, 0, ${intensity})`;
        const lightColor = `rgba(255, 255, 255, ${intensity + 0.5})`; // White usually needs more opacity

        // Apply Styles
        previewContainer.style.background = bgColor;
        previewEl.style.background = bgColor;
        previewEl.style.backdropFilter = 'none';
        previewEl.style.webkitBackdropFilter = 'none';
        previewEl.style.border = 'none';
        previewEl.style.boxShadow = `${dist}px ${dist}px ${blur}px ${darkColor}, -${dist}px -${dist}px ${blur}px ${lightColor}`;
        
        // Adjust text color based on background luminance (simple check)
        const rgb = hexToRgb(bgColor).split(',');
        const luminance = 0.299*rgb[0] + 0.587*rgb[1] + 0.114*rgb[2];
        previewEl.style.color = luminance > 128 ? '#333333' : '#ffffff';

        // Generate CSS Code
        cssText = `/* Neumorphism CSS */
.neu-panel {
    background: ${bgColor};
    box-shadow: ${dist}px ${dist}px ${blur}px ${darkColor},
                -${dist}px -${dist}px ${blur}px ${lightColor};
    border-radius: 20px;
}`;
    }

    cssOutput.textContent = cssText;
}

// Add Event Listeners to all inputs
const allInputs = document.querySelectorAll('input[type="range"], input[type="color"]');
allInputs.forEach(input => {
    input.addEventListener('input', updatePreview);
});

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cssOutput.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="ph ph-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    });
});

// Initialize
previewContainer.classList.add('glass-bg');
updatePreview();
