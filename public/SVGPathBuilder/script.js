const canvas = document.getElementById('draw-canvas');
const pathElement = document.getElementById('svg-path');
const codeOutput = document.getElementById('code-output');
const clearBtn = document.getElementById('clear-btn');
const copyBtn = document.getElementById('copy-btn');

let points = [];
let draggingPoint = null;
let svgRect = canvas.getBoundingClientRect();

window.addEventListener('resize', () => {
    svgRect = canvas.getBoundingClientRect();
});

function generatePathString() {
    if (points.length === 0) return "";
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const x_mid = (points[i].x + points[i + 1].x) / 2;
        const y_mid = (points[i].y + points[i + 1].y) / 2;

        if (i === 0) {
            d += ` L ${x_mid} ${y_mid}`;
        } else {
            d += ` Q ${points[i].x} ${points[i].y} ${x_mid} ${y_mid}`;
        }
    }

    const last = points[points.length - 1];
    d += ` L ${last.x} ${last.y}`;

    return d;
}

function updateUI() {
    const d = generatePathString();
    pathElement.setAttribute('d', d);

    const rawSVG = `<svg viewBox="0 0 ${Math.round(svgRect.width)} ${Math.round(svgRect.height)}" xmlns="http://www.w3.org/2000/svg">\n  <path d="${d}" fill="none" stroke="currentColor" stroke-width="2"/>\n</svg>`;
    codeOutput.textContent = points.length > 0 ? rawSVG : "";

    const existingNodes = canvas.querySelectorAll('.node');
    existingNodes.forEach(node => node.remove());

    points.forEach((point, index) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);
        circle.setAttribute('r', 6);
        circle.classList.add('node');

        circle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            draggingPoint = point;
        });

        canvas.appendChild(circle);
    });
}

canvas.addEventListener('mousedown', (e) => {
    if (draggingPoint) return;

    const x = Math.round(e.clientX - svgRect.left);
    const y = Math.round(e.clientY - svgRect.top);

    points.push({ x, y });
    updateUI();
});

window.addEventListener('mousemove', (e) => {
    if (!draggingPoint) return;

    draggingPoint.x = Math.round(e.clientX - svgRect.left);
    draggingPoint.y = Math.round(e.clientY - svgRect.top);
    draggingPoint.x = Math.max(0, Math.min(draggingPoint.x, svgRect.width));
    draggingPoint.y = Math.max(0, Math.min(draggingPoint.y, svgRect.height));

    updateUI();
});

window.addEventListener('mouseup', () => {
    draggingPoint = null;
});

clearBtn.addEventListener('click', () => {
    points = [];
    updateUI();
});

copyBtn.addEventListener('click', async () => {
    if (points.length === 0) return;
    try {
        await navigator.clipboard.writeText(codeOutput.textContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        copyBtn.style.backgroundColor = "#4CAF50";
        copyBtn.style.borderColor = "#4CAF50";

        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = "";
            copyBtn.style.borderColor = "";
        }, 2000);
    } catch (err) {
        console.error('Failed to copy!', err);
    }
});

updateUI();