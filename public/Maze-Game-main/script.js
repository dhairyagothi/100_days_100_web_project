function rand(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showToast(message, type = 'info', duration = 2600) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

function updateStatus(message) {
  const statusText = document.getElementById('statusText');
  if (statusText) statusText.textContent = message;
}

function updateLevelText(level) {
  const levelText = document.getElementById('levelText');
  if (levelText) levelText.textContent = level;
}

function updateMoveDisplay(count) {
  const moveCount = document.getElementById('moveCount');
  if (moveCount) moveCount.textContent = count;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${secs}`;
}

function updateTimerDisplay(seconds) {
  const timerText = document.getElementById('timerText');
  if (timerText) timerText.textContent = formatTime(seconds);
}

function stopTimer() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function resetTimer() {
  elapsedSeconds = 0;
  updateTimerDisplay(elapsedSeconds);
  stopTimer();
}

function startTimer() {
  resetTimer();
  timerIntervalId = setInterval(() => {
    elapsedSeconds += 1;
    updateTimerDisplay(elapsedSeconds);
  }, 1000);
}

function showModal(title, message, moves) {
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent = message;
  document.getElementById('moves').textContent = `Moves: ${moves}`;
  document.getElementById('Message-Container').classList.add('visible');
}

function closeModal() {
  const modal = document.getElementById('Message-Container');
  if (modal) {
    modal.classList.remove('visible');
  }

  if (isGameOver) {
    isGameOver = false;
    startGame();
  }
}

function toggleVisibility(id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.toggle('visible');
  }
}

function Maze(width, height) {
  let mazeMap;
  const dirs = ['n', 's', 'e', 'w'];
  const modDir = {
    n: { y: -1, x: 0, o: 's' },
    s: { y: 1, x: 0, o: 'n' },
    e: { y: 0, x: 1, o: 'w' },
    w: { y: 0, x: -1, o: 'e' }
  };
  let startCoord, endCoord;

  this.map = () => mazeMap;
  this.startCoord = () => startCoord;
  this.endCoord = () => endCoord;

  function genMap() {
    mazeMap = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => ({
        n: false,
        s: false,
        e: false,
        w: false,
        visited: false,
        priorPos: null
      }))
    );
  }

  function defineMaze() {
    let isComplete = false;
    let cellsVisited = 1;
    let numLoops = 0;
    let maxLoops = 0;
    let pos = { x: 0, y: 0 };
    const numCells = width * height;

    while (!isComplete) {
      mazeMap[pos.x][pos.y].visited = true;
      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;

      let moved = false;
      for (let index = 0; index < dirs.length; index++) {
        const direction = dirs[index];
        const nx = pos.x + modDir[direction].x;
        const ny = pos.y + modDir[direction].y;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && !mazeMap[nx][ny].visited) {
          mazeMap[pos.x][pos.y][direction] = true;
          mazeMap[nx][ny][modDir[direction].o] = true;
          mazeMap[nx][ny].priorPos = pos;
          pos = { x: nx, y: ny };
          cellsVisited++;
          moved = true;
          break;
        }
      }

      if (!moved) {
        pos = mazeMap[pos.x][pos.y].priorPos;
      }

      if (cellsVisited === numCells) {
        isComplete = true;
      }
    }
  }

  function defineStartEnd() {
    const option = rand(4);
    switch (option) {
      case 0:
        startCoord = { x: 0, y: 0 };
        endCoord = { x: width - 1, y: height - 1 };
        break;
      case 1:
        startCoord = { x: 0, y: height - 1 };
        endCoord = { x: width - 1, y: 0 };
        break;
      case 2:
        startCoord = { x: width - 1, y: 0 };
        endCoord = { x: 0, y: height - 1 };
        break;
      default:
        startCoord = { x: width - 1, y: height - 1 };
        endCoord = { x: 0, y: 0 };
        break;
    }
  }

  genMap();
  defineStartEnd();
  defineMaze();
}

function DrawMaze(maze, ctx, cellSize) {
  const map = maze.map();
  let size = cellSize;
  ctx.lineWidth = size / 40;
  ctx.strokeStyle = '#7fd5ff';

  this.redrawMaze = function (newSize) {
    size = newSize;
    ctx.lineWidth = size / 50;
    this.render(0);
  };

  function drawCell(xCord, yCord, cell) {
    const x = xCord * size;
    const y = yCord * size;
    if (!cell.n) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size, y);
      ctx.stroke();
    }
    if (!cell.s) {
      ctx.beginPath();
      ctx.moveTo(x, y + size);
      ctx.lineTo(x + size, y + size);
      ctx.stroke();
    }
    if (!cell.e) {
      ctx.beginPath();
      ctx.moveTo(x + size, y);
      ctx.lineTo(x + size, y + size);
      ctx.stroke();
    }
    if (!cell.w) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + size);
      ctx.stroke();
    }
  }

  function drawMap() {
    ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
    ctx.save();
    ctx.shadowColor = 'rgba(96, 212, 255, 0.25)';
    ctx.shadowBlur = size / 14;
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        drawCell(x, y, map[x][y]);
      }
    }
    ctx.restore();
  }

  function drawGoalPortal(time) {
    const coord = maze.endCoord();
    const centerX = coord.x * size + size / 2;
    const centerY = coord.y * size + size / 2;
    const pulse = 4 + Math.sin(time / 300) * 2;
    const radius = size * 0.28;

    const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.2, centerX, centerY, radius + pulse);
    gradient.addColorStop(0, 'rgba(152, 128, 255, 0.9)');
    gradient.addColorStop(0.4, 'rgba(96, 212, 255, 0.35)');
    gradient.addColorStop(1, 'rgba(15, 22, 56, 0)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + pulse, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#8e6cff';
    ctx.lineWidth = size * 0.05;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d3f1ff';
    for (let i = 0; i < 5; i++) {
      const angle = i * (Math.PI * 2) / 5 + time / 800;
      ctx.beginPath();
      ctx.moveTo(centerX + Math.cos(angle) * radius * 0.6, centerY + Math.sin(angle) * radius * 0.6);
      ctx.lineTo(centerX + Math.cos(angle) * radius * 0.95, centerY + Math.sin(angle) * radius * 0.95);
      ctx.stroke();
    }
  }

  function drawMapBackground() {
    ctx.fillStyle = 'rgba(5, 10, 25, 0.12)';
    ctx.fillRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  }

  this.render = function (time) {
    drawMapBackground();
    drawMap();
    drawGoalPortal(time);
  };

  this.render(0);
}

function Player(maze, canvas, cellSize, onComplete) {
  const ctx = canvas.getContext('2d');
  const self = this;
  const map = maze.map();
  let cellCoords = { x: maze.startCoord().x, y: maze.startCoord().y };
  let size = cellSize;
  const halfCellSize = size / 2;
  let moves = 0;
  let hasWon = false;

  this.redrawPlayer = function (newSize) {
    size = newSize;
    drawPlayerOrb(cellCoords);
  };

  function drawPlayerOrb(coord) {
    const x = coord.x * size + size / 2;
    const y = coord.y * size + size / 2;
    const radius = Math.max(size * 0.16, 6);
    const gradient = ctx.createRadialGradient(x, y, radius * 0.2, x, y, radius);
    gradient.addColorStop(0, 'rgba(255, 249, 196, 0.95)');
    gradient.addColorStop(0.6, 'rgba(255, 162, 59, 0.85)');
    gradient.addColorStop(1, 'rgba(255, 72, 103, 0.55)');

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 196, 129, 0.85)';
    ctx.lineWidth = Math.max(size * 0.015, 1.5);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.arc(x, y, radius * 0.6, 0, 2 * Math.PI);
    ctx.stroke();

    if (!hasWon && coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
      hasWon = true;
      onComplete(moves);
      self.unbindKeyDown();
    }
  }

  function removeSprite(coord) {
    const offsetLeft = size / 50;
    const offsetRight = size / 25;
    ctx.clearRect(
      coord.x * size + offsetLeft,
      coord.y * size + offsetLeft,
      size - offsetRight,
      size - offsetRight
    );
  }

  function check(e) {
    if (isGameOver) {
      return;
    }

    const keyCode = e.keyCode || e.which;
    if ([37, 38, 39, 40, 65, 68, 83, 87].includes(keyCode) && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const cell = map[cellCoords.x][cellCoords.y];
    let moved = false;

    switch (keyCode) {
      case 65:
      case 37:
        if (cell.w) {
          removeSprite(cellCoords);
          cellCoords = { x: cellCoords.x - 1, y: cellCoords.y };
          drawPlayerOrb(cellCoords);
          moved = true;
        }
        break;
      case 87:
      case 38:
        if (cell.n) {
          removeSprite(cellCoords);
          cellCoords = { x: cellCoords.x, y: cellCoords.y - 1 };
          drawPlayerOrb(cellCoords);
          moved = true;
        }
        break;
      case 68:
      case 39:
        if (cell.e) {
          removeSprite(cellCoords);
          cellCoords = { x: cellCoords.x + 1, y: cellCoords.y };
          drawPlayerOrb(cellCoords);
          moved = true;
        }
        break;
      case 83:
      case 40:
        if (cell.s) {
          removeSprite(cellCoords);
          cellCoords = { x: cellCoords.x, y: cellCoords.y + 1 };
          drawPlayerOrb(cellCoords);
          moved = true;
        }
        break;
    }

    if (moved) {
      moves++;
      updateMoveDisplay(moves);      ensurePlayerVisible(cellCoords);    } else if ([65, 68, 83, 87, 37, 38, 39, 40].includes(e.keyCode)) {
      showToast('Blocked! You cannot move through a wall.', 'warning');
    }
  }

  this.bindKeyDown = function () {
    window.addEventListener('keydown', check, false);
    if (window.jQuery && typeof $.fn.swipe === 'function') {
      $('#view').swipe({
        swipe: function (event, direction) {
          switch (direction) {
            case 'up':
              check({ keyCode: 38 });
              break;
            case 'down':
              check({ keyCode: 40 });
              break;
            case 'left':
              check({ keyCode: 37 });
              break;
            case 'right':
              check({ keyCode: 39 });
              break;
          }
        },
        threshold: 0
      });

    };
  
    this.unbindKeyDown = function() {
      window.removeEventListener("keydown", check, false);
      $("#view").swipe("destroy");
    };
  
    drawSprite(maze.startCoord());
  
    this.bindKeyDown();
  }
  
  var mazeCanvas = document.getElementById("mazeCanvas");
  var ctx = mazeCanvas.getContext("2d");
  var sprite;
  var finishSprite;
  var maze, draw, player;
  var cellSize;
  var difficulty;
  // sprite.src = 'media/sprite.png';
  
  window.onload = function() {
    document.getElementById("mazeContainer").classList.add("preview");
    let viewWidth = $("#view").width();
    let viewHeight = $("#view").height();
    if (viewHeight < viewWidth) {
      ctx.canvas.width = viewHeight - viewHeight / 100;
      ctx.canvas.height = viewHeight - viewHeight / 100;
    } else {
      ctx.canvas.width = viewWidth - viewWidth / 100;
      ctx.canvas.height = viewWidth - viewWidth / 100;
    }
  
    //Load and edit sprites
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () => {
      if(completeOne === true && completeTwo === true)
         {
           console.log("Runs");
          // setTimeout(function(){
          //   makeMaze();
           //}, 500);         
         }
    };
    sprite = new Image();
    sprite.src =
      "./key.png" +
      "?" +
      new Date().getTime();
    sprite.setAttribute("crossOrigin", " ");
    sprite.onload = function() {
      sprite = changeBrightness(1.2, sprite);
      completeOne = true;
      console.log(completeOne);
      isComplete();
    };
  
    finishSprite = new Image();
    finishSprite.src = "./home.png"+
    "?" +
    new Date().getTime();
    finishSprite.setAttribute("crossOrigin", " ");
    finishSprite.onload = function() {
      finishSprite = changeBrightness(1.1, finishSprite);
      completeTwo = true;
      console.log(completeTwo);
      isComplete();
    };
    
=======
    }

  };

  this.unbindKeyDown = function () {
    window.removeEventListener('keydown', check, false);
    if (window.jQuery && typeof $.fn.swipe === 'function') {
      try {
        $('#view').swipe('destroy');
      } catch (error) {
        // swipe may not be initialized yet
      }
    }
  };

  drawPlayerOrb(maze.startCoord());
  this.bindKeyDown();
}

const mazeCanvas = document.getElementById('mazeCanvas');
const ctx = mazeCanvas.getContext('2d');
let maze;
let draw;
let player;
let cellSize = 0;
let difficulty = 10;
let animationFrameId = null;
let currentLevel = 'Easy';
let isGameActive = false;
let isGameOver = false;
let elapsedSeconds = 0;
let timerIntervalId = null;

const startButton = document.getElementById('startMazeBtn');
const restartButton = document.getElementById('restartMazeBtn');
const diffSelect = document.getElementById('diffSelect');
const okBtn = document.getElementById('okBtn');

function resizeCanvas() {
  const board = document.getElementById('view');
  const availableWidth = board.clientWidth - 36;
  const availableHeight = window.innerHeight - 280;
  const size = Math.min(availableWidth, availableHeight, 860);
  mazeCanvas.width = size;
  mazeCanvas.height = size;
  if (difficulty) {
    cellSize = mazeCanvas.width / difficulty;
  }
  if (draw && player) {
    draw.redrawMaze(cellSize);
    player.redrawPlayer(cellSize);
  }
}

function ensurePlayerVisible(coord) {
  const container = document.getElementById('mazeContainer');
  if (!container || !coord) {
    return;
  }

  const playerCenterX = coord.x * cellSize + cellSize / 2;
  const playerCenterY = coord.y * cellSize + cellSize / 2;

  const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
  const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
  const targetLeft = Math.max(0, Math.min(maxScrollLeft, playerCenterX - container.clientWidth / 2));
  const targetTop = Math.max(0, Math.min(maxScrollTop, playerCenterY - container.clientHeight / 2));

  container.scrollTo({ left: targetLeft, top: targetTop, behavior: 'smooth' });
}

function resetGameState() {
  cancelRenderLoop();
  stopTimer();
  if (player) {
    player.unbindKeyDown();
    player = null;
  }
  maze = null;
  draw = null;
  isGameActive = false;
  isGameOver = false;
  elapsedSeconds = 0;
  updateMoveDisplay(0);
  updateTimerDisplay(elapsedSeconds);
  ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
  updateStatus('Ready to start');
}

function handleDifficultyChange() {
  const selectedDifficulty = Number(diffSelect.value);
  if (!selectedDifficulty || selectedDifficulty <= 0) {
    showToast('Please select a valid difficulty level.', 'warning');
    return;
  }

  currentLevel = diffSelect.options[diffSelect.selectedIndex].text;
  updateLevelText(currentLevel);
  updateStatus(`Selected ${currentLevel}`);
  showToast(`Difficulty set to ${currentLevel}`, 'info');

  difficulty = selectedDifficulty;
  cellSize = mazeCanvas.width / difficulty;

  if (isGameActive || isGameOver) {
    startGame();
  } else {
    resetGameState();
  }
}

function onMazeComplete(moves) {
  if (isGameOver) {
    return;
  }

  isGameOver = true;
  isGameActive = false;
  stopTimer();
  updateStatus('Maze completed! Ready for another run.');
  showModal('Congratulations!', 'You escaped the maze.', moves);
  showToast('Maze completed successfully 🎉', 'success');
}

function cancelRenderLoop() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function startRenderLoop() {
  cancelRenderLoop();
  if (draw) {
    draw.render(0);
  }
  if (player) {
    player.redrawPlayer(cellSize);
  }
  const loop = (time) => {
    if (draw) {
      draw.render(time);
    }
    if (player) {
      player.redrawPlayer(cellSize);
    }
    animationFrameId = requestAnimationFrame(loop);
  };

  
  function makeMaze() {
     const mazeContainer = document.getElementById("mazeContainer");

    mazeContainer.classList.remove("preview");
    mazeContainer.classList.add("active");
    if (player != undefined) {
      player.unbindKeyDown();
      player = null;
    }
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
    }
  }

  function startGame() {
  const mazeContainer = document.getElementById("mazeContainer");

  mazeContainer.classList.remove("preview");
  mazeContainer.classList.add("active");

  makeMaze();
=======
  animationFrameId = requestAnimationFrame(loop);
}

function startGame() {
  const selectedDifficulty = Number(diffSelect.value);
  if (!selectedDifficulty || selectedDifficulty <= 0) {
    showToast('Please select a valid difficulty level.', 'warning');
    return;
  }

  currentLevel = diffSelect.options[diffSelect.selectedIndex].text;
  updateLevelText(currentLevel);
  difficulty = selectedDifficulty;
  cellSize = mazeCanvas.width / difficulty;

  resetGameState();

  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize);
  player = new Player(maze, mazeCanvas, cellSize, onMazeComplete);

  isGameActive = true;
  isGameOver = false;

  updateStatus(`Playing ${currentLevel} mode`);
  updateMoveDisplay(0);
  startTimer();
  showToast(`Game started: ${currentLevel}`, 'success');
  startButton.textContent = 'Restart';
  restartButton.disabled = false;
  diffSelect.blur();
  startRenderLoop();
}

function initialize() {
  const modalOverlay = document.getElementById('Message-Container');

  resizeCanvas();
  handleDifficultyChange();
  startButton.disabled = false;
  restartButton.disabled = true;
  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', startGame);
  diffSelect.addEventListener('change', handleDifficultyChange);

  if (okBtn) {
    okBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('beforeunload', stopTimer);
  showToast('Ready to play! Select a difficulty and start.', 'info', 3200);
}

if (document.readyState === 'loading') {
  window.addEventListener('load', initialize);
} else {
  initialize();

}
