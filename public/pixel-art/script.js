const grid = document.getElementById("pixel-grid");
const widthInput = document.getElementById("width-input");
const heightInput = document.getElementById("height-input");
const sizeBtn = document.getElementById("size-btn");
const colorPicker = document.getElementById("color-picker");
const rubberBtn = document.getElementById("rubber-btn");
const clearBtn = document.getElementById("clear-btn");

let isDrawing = false;
let isRubberMode = false;
const CELL_SIZE = 25;

function makeGrid() {
  grid.innerHTML = "";

  const width = parseInt(widthInput.value) || 16;
  const height = parseInt(heightInput.value) || 16;

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
