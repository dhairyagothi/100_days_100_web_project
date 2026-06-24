const grid = document.getElementById("pixel-grid");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
const sizeBtn = document.getElementById("size-btn");
const colorPicker = document.getElementById("color-picker");
const rubberBtn = document.getElementById("rubber-btn");
const clearBtn = document.getElementById("clear-btn");
let width = parseInt(widthInput.value) || 16;
let height = parseInt(heightInput.value) || 16;
const templateSelect = document.getElementById("template-select");
const loadTemplateBtn = document.getElementById("load-template-btn");

let isDrawing = false;
let isRubberMode = false;
const CELL_SIZE = 25;

const downloadBtn =
document.getElementById("download-btn");

downloadBtn.addEventListener(
    "click",
    downloadPixelArt
);

function downloadPixelArt() {

    const width =
        parseInt(widthInput.value) || 16;

    const height =
        parseInt(heightInput.value) || 16;

    const cells =
        document.querySelectorAll(".cell");

    const canvas =
        document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const ctx =
        canvas.getContext("2d");

    cells.forEach((cell, index) => {

        const row =
            Math.floor(index / width);

        const col =
            index % width;

        const color =
            getComputedStyle(cell)
            .backgroundColor;

        ctx.fillStyle =
            color === "rgba(0, 0, 0, 0)"
                ? "#ffffff"
                : color;

        ctx.fillRect(
            col,
            row,
            1,
            1
        );
    });

    const exportCanvas =
        document.createElement("canvas");

    const scale = 20;

    exportCanvas.width =
        width * scale;

    exportCanvas.height =
        height * scale;

    const exportCtx =
        exportCanvas.getContext("2d");

    exportCtx.imageSmoothingEnabled =
        false;

    exportCtx.drawImage(
        canvas,
        0,
        0,
        exportCanvas.width,
        exportCanvas.height
    );

    const link =
        document.createElement("a");

    link.download =
        "pixel-art.png";

    link.href =
        exportCanvas.toDataURL("image/png");

    link.click();
}

function makeGrid() {
  grid.innerHTML = "";

  let width = parseInt(widthInput.value) || 16;
  let height = parseInt(heightInput.value) || 16;

  console.log(width, height);

  if(width > 64 || width < 0){
    alert(`Please enter width between 1 and 64`);
    widthInput.value = 16;
    width = 16;
  }

  if(height > 64 || height < 0){
    alert(`Please enter height between 1 and 64`);
    heightInput.value = 16;
    height = 16;
  }

  grid.style.gridTemplateColumns = `repeat(${width}, ${CELL_SIZE}px)`;
  grid.style.gridTemplateRows = `repeat(${height}, ${CELL_SIZE}px)`;

  for (let i = 0; i < width * height; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    cell.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isDrawing = true;
      colorize(cell);
    });

    cell.addEventListener("mouseenter", () => {
      if (isDrawing) {
        colorize(cell);
      }
    });

    grid.appendChild(cell);
  }
}

function colorize(element) {
  if (isRubberMode) {
    element.style.backgroundColor = "transparent";
  } else {
    element.style.backgroundColor = colorPicker.value;
  }
}

function clearGrid() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.style.backgroundColor = "transparent"));
}

window.addEventListener("mouseup", () => {
  isDrawing = false;
});

rubberBtn.addEventListener("click", () => {
  isRubberMode = !isRubberMode;
  rubberBtn.classList.toggle("active", isRubberMode);
});

colorPicker.addEventListener("input", () => {
  isRubberMode = false;
  rubberBtn.classList.remove("active");
});

sizeBtn.addEventListener("click", makeGrid);
clearBtn.addEventListener("click", clearGrid);

makeGrid();

const templates = {
    flower: [
        [0,0,1,1,0,0],
        [0,1,2,2,1,0],
        [1,2,2,2,2,1],
        [0,1,2,2,1,0],
        [0,0,3,3,0,0]
    ],

    heart: [
        [1,1,0,0,1,1],
        [1,1,1,1,1,1],
        [1,1,1,1,1,1],
        [0,1,1,1,1,0],
        [0,0,1,1,0,0]
    ]
};

function loadTemplate() {

    const templateName = templateSelect.value;

    if (!templateName) {
        alert("Select a template");
        return;
    }

    const template = templates[templateName];

    grid.innerHTML = "";

    const rows = template.length;
    const cols = template[0].length;

    grid.style.gridTemplateColumns =
        `repeat(${cols}, ${CELL_SIZE}px)`;

    grid.style.gridTemplateRows =
        `repeat(${rows}, ${CELL_SIZE}px)`;

    template.forEach(row => {
        row.forEach(value => {

            const cell = document.createElement("div");

            cell.classList.add("cell");

            if (value !== 0) {
                cell.textContent = value;
            }

            /* DRAWING SUPPORT */

            cell.addEventListener("mousedown", (e) => {
                e.preventDefault();
                isDrawing = true;
                colorize(cell);
            });

            cell.addEventListener("mouseenter", () => {
                if (isDrawing) {
                    colorize(cell);
                }
            });

            grid.appendChild(cell);

        });
    });
}

loadTemplateBtn.addEventListener("click", loadTemplate);