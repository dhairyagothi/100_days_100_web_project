const canvasElement = document.getElementById("main-drawing-board");
const ctxContext = canvasElement.getContext("2d");

const brushColorInput = document.getElementById("brush-color");
const brushWeightInput = document.getElementById("brush-weight");
const weightValDisplay = document.getElementById("weight-val");

const btnDrawMode = document.getElementById("tool-draw");
const btnEraseMode = document.getElementById("tool-erase");
const btnClearBoard = document.getElementById("clear-board-btn");

// Tracking execution system states
let isUserPaintingActive = false;
let currentOperationalMode = "draw"; // Supported configurations parameters: "draw" | "erase"
let cachedLastCoordinateX = 0;
let cachedLastCoordinateY = 0;

function handleWorkspaceRescale() {
  // Read operational surface bounding rectangle size values
  const boundingBox = canvasElement.parentElement.getBoundingClientRect();

  // Save current drawing path contents before viewport dimension change clears context cache
  const temporaryCanvasBuffer = document.createElement("canvas");
  temporaryCanvasBuffer.width = canvasElement.width;
  temporaryCanvasBuffer.height = canvasElement.height;
  const tempCtx = temporaryCanvasBuffer.getContext("2d");
  tempCtx.drawImage(canvasElement, 0, 0);

  // Synchronize high-definition raster matrix dimensions to view dimensions
  canvasElement.width = boundingBox.width;
  canvasElement.height = boundingBox.height;

  // Set contextual line joints rendering properties cleanly
  ctxContext.lineCap = "round";
  ctxContext.lineJoin = "round";

  // Restore path content structures onto resized viewport context layer
  ctxContext.drawImage(temporaryCanvasBuffer, 0, 0);
}

function establishLineTrace(event) {
  // Prevent default tracking on mobile view screen matrices
  if (event.cancelable) event.preventDefault();

  // Map pointer tracking calculations accurately depending on event layer structures
  const clientX = event.touches ? event.touches[0].clientX : event.clientX;
  const clientY = event.touches ? event.touches[0].clientY : event.clientY;

  const currentRectOffset = canvasElement.getBoundingClientRect();
  const currentCoordinateX = clientX - currentRectOffset.left;
  const currentCoordinateY = clientY - currentRectOffset.top;

  if (!isUserPaintingActive) {
    cachedLastCoordinateX = currentCoordinateX;
    cachedLastCoordinateY = currentCoordinateY;
    return;
  }

  ctxContext.beginPath();
  ctxContext.moveTo(cachedLastCoordinateX, cachedLastCoordinateY);
  ctxContext.lineTo(currentCoordinateX, currentCoordinateY);

  // Set composition configurations depending on mode toggle values
  if (currentOperationalMode === "erase") {
    ctxContext.strokeStyle = "#090d16"; // Draw matching body clear background fill tracks
    ctxContext.lineWidth = brushWeightInput.value * 2; // Provide a larger stroke surface window for erasing
  } else {
    ctxContext.strokeStyle = brushColorInput.value;
    ctxContext.lineWidth = brushWeightInput.value;
  }

  ctxContext.stroke();

  // Cache coordinate markers for the next continuous drawing line segment calculation loops
  cachedLastCoordinateX = currentCoordinateX;
  cachedLastCoordinateY = currentCoordinateY;
}

function startDrawingSequence(e) {
  isUserPaintingActive = true;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const currentRectOffset = canvasElement.getBoundingClientRect();

  cachedLastCoordinateX = clientX - currentRectOffset.left;
  cachedLastCoordinateY = currentRectOffset.top;
}

function terminateDrawingSequence() {
  isUserPaintingActive = false;
}

// Sliders and interaction trackers adjustments row mapping observers
brushWeightInput.addEventListener("input", (e) => {
  weightValDisplay.textContent = `${e.target.value}px`;
});

btnDrawMode.addEventListener("click", () => {
  currentOperationalMode = "draw";
  btnEraseMode.classList.remove("active");
  btnDrawMode.classList.add("active");
});

btnEraseMode.addEventListener("click", () => {
  currentOperationalMode = "erase";
  btnDrawMode.classList.remove("active");
  btnEraseMode.classList.add("active");
});

btnClearBoard.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the whiteboard canvas?")) {
    ctxContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
  }
});

// Primary canvas hardware event interaction tracking hooks
canvasElement.addEventListener("mousedown", startDrawingSequence);
canvasElement.addEventListener("mousemove", establishLineTrace);
canvasElement.addEventListener("mouseup", terminateDrawingSequence);
canvasElement.addEventListener("mouseleave", terminateDrawingSequence);

// Touch device support for mobile and tablet testing tracks
canvasElement.addEventListener("touchstart", startDrawingSequence, {
  passive: false,
});
canvasElement.addEventListener("touchmove", establishLineTrace, {
  passive: false,
});
canvasElement.addEventListener("touchend", terminateDrawingSequence);

// Layout structural monitoring event observers
window.addEventListener("resize", handleWorkspaceRescale);

// Initialization sequence trigger
handleWorkspaceRescale();
