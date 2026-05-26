const components = document.querySelectorAll(".component");
const canvas = document.getElementById("canvas");
const svg = document.getElementById("connections");

let draggedType = "";
let selectedNode = null;
let connections = [];

/* Drag Start */

components.forEach(component => {

    component.addEventListener("dragstart", (e) => {
        draggedType = component.dataset.type;
    });

});

/* Allow Drop */

canvas.addEventListener("dragover", (e) => {
    e.preventDefault();
});

/* Drop */

canvas.addEventListener("drop", (e) => {

    e.preventDefault();

    const node = document.createElement("div");

    node.classList.add("node");
    node.innerText = draggedType;

    node.style.left = `${e.offsetX}px`;
    node.style.top = `${e.offsetY}px`;

    canvas.appendChild(node);

    makeDraggable(node);

    node.addEventListener("click", () => {
        selectNode(node);
    });

});

/* Node Selection */

function selectNode(node) {

    if (!selectedNode) {

        selectedNode = node;
        node.classList.add("selected");

    } else {

        createConnection(selectedNode, node);

        selectedNode.classList.remove("selected");
        selectedNode = null;
    }
}

/* Create SVG Connection */

function createConnection(node1, node2) {

    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    svg.appendChild(line);

    const connection = {
        line,
        node1,
        node2
    };

    connections.push(connection);

    updateLine(connection);
}

/* Update Line Position */

function updateLine(connection) {

    const rect1 = connection.node1.getBoundingClientRect();
    const rect2 = connection.node2.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - canvasRect.left;
    const y1 = rect1.top + rect1.height / 2 - canvasRect.top;

    const x2 = rect2.left + rect2.width / 2 - canvasRect.left;
    const y2 = rect2.top + rect2.height / 2 - canvasRect.top;

    connection.line.setAttribute("x1", x1);
    connection.line.setAttribute("y1", y1);

    connection.line.setAttribute("x2", x2);
    connection.line.setAttribute("y2", y2);
}

/* Draggable Nodes */

function makeDraggable(node) {

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    node.addEventListener("mousedown", (e) => {

        isDragging = true;

        offsetX = e.offsetX;
        offsetY = e.offsetY;
    });

    document.addEventListener("mousemove", (e) => {

        if (!isDragging) return;

        const canvasRect = canvas.getBoundingClientRect();

        node.style.left = `${e.clientX - canvasRect.left - offsetX}px`;
        node.style.top = `${e.clientY - canvasRect.top - offsetY}px`;

        connections.forEach(connection => {
            updateLine(connection);
        });
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
}

/* Dark Mode */

const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeToggle.innerText = "☀️ Light Mode";
    } else {
        themeToggle.innerText = "🌙 Dark Mode";
    }
});

/* Export Diagram */

document.getElementById("exportBtn")
    .addEventListener("click", () => {

        html2canvas(canvas).then(canvasImage => {

            const link = document.createElement("a");

            link.download = "system-design-diagram.png";

            link.href = canvasImage.toDataURL();

            link.click();
        });
    });