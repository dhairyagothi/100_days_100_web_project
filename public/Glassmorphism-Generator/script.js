document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const root = document.documentElement;
    const blurInput = document.getElementById("blur");
    const opacityInput = document.getElementById("opacity");
    const colorInput = document.getElementById("color");
    const shadowInput = document.getElementById("shadow");

    const blurVal = document.getElementById("blur-val");
    const opacityVal = document.getElementById("opacity-val");
    const shadowVal = document.getElementById("shadow-val");

    const cssOutput = document.getElementById("css-output");
    const copyBtn = document.getElementById("copy-btn");
    const themeToggle = document.getElementById("theme-toggle");

    // Helper: Convert HEX to RGB
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Generate CSS and Update View
    function updateGlass() {
        const blur = blurInput.value;
        const opacity = opacityInput.value;
        const shadow = shadowInput.value;
        const hexColor = colorInput.value;
        const rgb = hexToRgb(hexColor);

        // Update Labels
        blurVal.textContent = `${blur}px`;
        opacityVal.textContent = opacity;
        shadowVal.textContent = shadow;

        // Update CSS Variables
        root.style.setProperty("--glass-r", rgb.r);
        root.style.setProperty("--glass-g", rgb.g);
        root.style.setProperty("--glass-b", rgb.b);
        root.style.setProperty("--glass-a", opacity);
        root.style.setProperty("--glass-blur", `${blur}px`);
        root.style.setProperty("--glass-shadow", shadow);

        // Generate CSS Code String
        const cssCode =
            `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, ${shadow});`;

        cssOutput.value = cssCode;
    }

    // Event Listeners for inputs
    [blurInput, opacityInput, colorInput, shadowInput].forEach(input => {
        input.addEventListener("input", updateGlass);
    });

    // Copy to Clipboard functionality
    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(cssOutput.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "Copied!";
            copyBtn.classList.add("copied");

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.classList.remove("copied");
            }, 2000);
        }).catch(err => {
            console.error("Failed to copy text: ", err);
        });
    });

    themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "☀️";
    } else {
        themeToggle.textContent = "🌙";
    }
});

    // Initial render
    updateGlass();
});