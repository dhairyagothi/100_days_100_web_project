function addTask() {
  const input = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');

  const task = input.value.trim();

  if (!task) {
    input.focus();
    return;
  }

  const li = document.createElement('li');

  li.textContent = task;

  taskList.appendChild(li);

  input.value = '';

  input.focus();
}
document
  .getElementById('taskInput')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  });

function showPage(pageId) {
  document
    .querySelectorAll('.page')
    .forEach((p) => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  pageId === 'life' ? startLife() : stopLife();
}

const canvas = document.getElementById('lifeCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 40,
  cellSize = 10;
let grid = Array.from({ length: gridSize }, () =>
  Array(gridSize)
    .fill(0)
    .map(() => (Math.random() > 0.8 ? 1 : 0))
);
let lifeInterval = null;

function draw() {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 400, 400);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize - 1,
          cellSize - 1
        );
      }
    }
  }
}

function updateLife() {
  let next = grid.map((arr) => [...arr]);
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let neighbors = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          let ny = y + i,
            nx = x + j;
          if (ny >= 0 && ny < gridSize && nx >= 0 && nx < gridSize)
            neighbors += grid[ny][nx];
        }
      }
      if (grid[y][x] === 1) {
        if (neighbors < 2 || neighbors > 3) next[y][x] = 0;
      } else {
        if (neighbors === 3) next[y][x] = 1;
      }
    }
  }
  grid = next;
  draw();
}

function startLife() {
  if (!lifeInterval) lifeInterval = setInterval(updateLife, 150);
}
function stopLife() {
  clearInterval(lifeInterval);
  lifeInterval = null;
}
