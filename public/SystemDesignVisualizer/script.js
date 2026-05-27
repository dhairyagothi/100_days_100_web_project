const canvas = document.getElementById("canvas");

let zIndexCounter = 1;

function addNode(type) {
  const node = document.createElement("div");

  node.classList.add("node");
  node.innerText = type;

  node.style.left = Math.random() * 800 + "px";
  node.style.top = Math.random() * 400 + "px";

  node.style.zIndex = zIndexCounter++;

  canvas.appendChild(node);

  makeDraggable(node);
}

function makeDraggable(element) {
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;

  element.addEventListener("mousedown", (e) => {
    isDragging = true;

    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;

    element.style.cursor = "grabbing";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    element.style.left = e.clientX - offsetX + "px";
    element.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    element.style.cursor = "grab";
  });
}

function clearBoard() {
  canvas.innerHTML = "";
}
