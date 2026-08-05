document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const brushBtn = document.getElementById("brush");
    const eraserBtn = document.getElementById("eraser");
    const lineBtn = document.getElementById("lineTool");
    const rectBtn = document.getElementById("rectTool");
    const circleBtn = document.getElementById("circleTool");
    const pickerBtn = document.getElementById("pickerTool");
    const brushSizeInput = document.getElementById("brushSize");
    const widthVal = document.querySelector(".width-val");
    const colorPicker = document.getElementById("color-picker");
    const bgColorPicker = document.getElementById("bg-color");
    const fillBtn = document.getElementById("fillCanvas");
    const clearBtn = document.querySelector(".clear");
    const undoBtn = document.getElementById("undo");
    const redoBtn = document.getElementById("redo");
    const downloadBtn = document.getElementById("download");
    const openBtn = document.getElementById("openImage");
    const imageLoader = document.getElementById("imageLoader");
    const currentToolText = document.getElementById("currentTool");
    const mousePosText = document.getElementById("mousePos");
    const canvasSizeText = document.getElementById("canvasSize");
    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let currentTool = "brush";
    let undoStack = [];
    let redoStack = [];
    let snapshot = null;
    function initCanvas() {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight - 80;
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = brushSizeInput.value;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        canvasSizeText.textContent = `${canvas.width} × ${canvas.height} px`;
        saveState();
    }
    function saveState() {
        if (undoStack.length >= 30) undoStack.shift();
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        redoStack = [];
    }
    function handleUndo() {
        if (undoStack.length > 1) {
            redoStack.push(undoStack.pop());
            const state = undoStack[undoStack.length - 1];
            ctx.putImageData(state, 0, 0);
        }
    }
    function handleRedo() {
        if (redoStack.length > 0) {
            const state = redoStack.pop();
            undoStack.push(state);
            ctx.putImageData(state, 0, 0);
        }
    }
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (canvas.width / rect.width),
            y: (e.clientY - rect.top) * (canvas.height / rect.height)
        };
    }
    function setActiveTool(toolId, toolName) {
        document.querySelectorAll(".tool").forEach(t => t.classList.remove("active"));
        document.getElementById(toolId).classList.add("active");
        currentTool = toolId;
        currentToolText.textContent = toolName;
    }
    function startDraw(e) {
        isDrawing = true;
        const pos = getMousePos(e);
        startX = pos.x;
        startY = pos.y;
        ctx.beginPath();
        if (currentTool === "brush") {
            ctx.strokeStyle = colorPicker.value;
            ctx.lineWidth = brushSizeInput.value;
            ctx.moveTo(startX, startY);
        } else if (currentTool === "eraser") {
            ctx.strokeStyle = bgColorPicker.value;
            ctx.lineWidth = brushSizeInput.value;
            ctx.moveTo(startX, startY);
        }
        snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    function drawing(e) {
        const pos = getMousePos(e);
        mousePosText.textContent = `X:${Math.round(pos.x)} Y:${Math.round(pos.y)}`;
        if (!isDrawing) return;
        if (currentTool === "brush" || currentTool === "eraser") {
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else {
            ctx.putImageData(snapshot, 0, 0);
            ctx.lineWidth = brushSizeInput.value;
            ctx.strokeStyle = colorPicker.value;
            if (currentTool === "lineTool") {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            } else if (currentTool === "rectTool") {
                ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
            } else if (currentTool === "circleTool") {
                ctx.beginPath();
                let radius = Math.sqrt(Math.pow(startX - pos.x, 2) + Math.pow(startY - pos.y, 2));
                ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }
    function stopDraw() {
        if (isDrawing) {
            isDrawing = false;
            saveState();
        }
    }
    function pickColor(e) {
        if (currentTool !== "pickerTool") return;
        const pos = getMousePos(e);
        const pixel = ctx.getImageData(pos.x, pos.y, 1, 1).data;
        const hex = "#" + (("1000000" + ((pixel[0] << 16) | (pixel[1] << 8) | pixel[2]).toString(16)).slice(-6));
        colorPicker.value = hex;
        setActiveTool("brush", "Brush");
    }
    brushBtn.addEventListener("click", () => setActiveTool("brush", "Brush"));
    eraserBtn.addEventListener("click", () => setActiveTool("eraser", "Eraser"));
    lineBtn.addEventListener("click", () => setActiveTool("lineTool", "Line"));
    rectBtn.addEventListener("click", () => setActiveTool("rectTool", "Rectangle"));
    circleBtn.addEventListener("click", () => setActiveTool("circleTool", "Circle"));
    pickerBtn.addEventListener("click", () => setActiveTool("pickerTool", "Color Picker"));
    brushSizeInput.addEventListener("input", () => widthVal.textContent = brushSizeInput.value);
    bgColorPicker.addEventListener("change", () => {
        const oldBg = undoStack[undoStack.length - 1];
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (oldBg) ctx.putImageData(oldBg, 0, 0);
    });
    fillBtn.addEventListener("click", () => {
        ctx.fillStyle = colorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    });
    clearBtn.addEventListener("click", () => {
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    });
    undoBtn.addEventListener("click", handleUndo);
    redoBtn.addEventListener("click", handleRedo);
    downloadBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
    openBtn.addEventListener("click", () => imageLoader.click());
    imageLoader.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = bgColorPicker.value;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                let x = (canvas.width / 2) - (img.width / 2) * scale;
                let y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                saveState();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);
    canvas.addEventListener("click", pickColor);
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === "z") {
            e.preventDefault();
            handleUndo();
        } else if (e.ctrlKey && e.key.toLowerCase() === "y") {
            e.preventDefault();
            handleRedo();
        } else if (e.ctrlKey && e.key.toLowerCase() === "s") {
            e.preventDefault();
            downloadBtn.click();
        }
    });
    window.addEventListener("resize", () => {
        const tempImg = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight - 80;
        ctx.fillStyle = bgColorPicker.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(tempImg, 0, 0);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        canvasSizeText.textContent = `${canvas.width} × ${canvas.height} px`;
    });
    initCanvas();
});
