const canvas = document.getElementById("draw-canvas");
const pathElement = document.getElementById("svg-path");
const codeOutput = document.getElementById("code-output");
const clearBtn = document.getElementById("clear-btn");
const copyBtn = document.getElementById("copy-btn");

const NODE_RADIUS = 6;
const STROKE_WIDTH = 2;
const COPY_TIMEOUT = 2000;

let points = [];
let draggingPoint = null;
let svgRect = canvas.getBoundingClientRect();

function updateCanvasRect() {
    svgRect = canvas.getBoundingClientRect();
}

window.addEventListener("resize", updateCanvasRect);
window.addEventListener("scroll", updateCanvasRect);

function generatePathString() {
    if (points.length === 0) return "";
    if (points.length === 1) {
        return `M ${points[0].x} ${points[0].y}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const midX = (points[i].x + points[i + 1].x) / 2;
        const midY = (points[i].y + points[i + 1].y) / 2;

        if (i === 0) {
            d += ` L ${midX} ${midY}`;
        } else {
            d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
        }
    }

    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;

    return d;
}

function updateUI() {
    const d = generatePathString();

    pathElement.setAttribute("d", d);

    codeOutput.textContent =
        points.length > 0
            ? `<svg viewBox="0 0 ${Math.round(svgRect.width)} ${Math.round(svgRect.height)}" xmlns="http://www.w3.org/2000/svg">
  <path d="${d}" fill="none" stroke="currentColor" stroke-width="${STROKE_WIDTH}"/>
</svg>`
            : "";

    canvas.querySelectorAll(".node").forEach((node) => node.remove());

    points.forEach((point) => {
        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", NODE_RADIUS);

        circle.classList.add("node");
        circle.setAttribute("tabindex", "0");
        circle.setAttribute("aria-label", "Control Point");

        circle.addEventListener("pointerdown", (event) => {
            event.stopPropagation();
            draggingPoint = point;
        });

        canvas.appendChild(circle);
    });
}

canvas.addEventListener("pointerdown", (event) => {
    updateCanvasRect();

    if (draggingPoint) return;

    const x = Math.round(event.clientX - svgRect.left);
    const y = Math.round(event.clientY - svgRect.top);

    points.push({ x, y });

    updateUI();
});

window.addEventListener("pointermove", (event) => {
    if (!draggingPoint) return;

    draggingPoint.x = Math.max(
        0,
        Math.min(
            Math.round(event.clientX - svgRect.left),
            svgRect.width
        )
    );

    draggingPoint.y = Math.max(
        0,
        Math.min(
            Math.round(event.clientY - svgRect.top),
            svgRect.height
        )
    );

    updateUI();
});

window.addEventListener("pointerup", () => {
    draggingPoint = null;
});

window.addEventListener("pointercancel", () => {
    draggingPoint = null;
});

window.addEventListener("mouseleave", () => {
    draggingPoint = null;
});

clearBtn.addEventListener("click", () => {
    points = [];
    updateUI();
});

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            const textArea = document.createElement("textarea");

            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";

            document.body.appendChild(textArea);

            textArea.focus();
            textArea.select();

            document.execCommand("copy");

            document.body.removeChild(textArea);
        }

        const originalText = copyBtn.textContent;

        copyBtn.textContent = "Copied!";
        copyBtn.style.backgroundColor = "#4CAF50";
        copyBtn.style.borderColor = "#4CAF50";

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = "";
            copyBtn.style.borderColor = "";
        }, COPY_TIMEOUT);
    } catch (error) {
        console.error("Copy failed:", error);
        alert("Failed to copy SVG code.");
    }
}

copyBtn.addEventListener("click", () => {
    if (points.length === 0) return;

    copyToClipboard(codeOutput.textContent);
});

updateUI();