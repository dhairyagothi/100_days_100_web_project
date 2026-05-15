function rand(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function displayVictoryMess(moves) {
  document.getElementById("moves").innerHTML = "You finished the maze in " + moves + " moves!";
  toggleVisablity("Message-Container");
}

function toggleVisablity(id) {
  const element = document.getElementById(id);
  if (element.classList.contains("visible")) {
    element.classList.remove("visible");
  } else {
    element.classList.add("visible");
  }
}

function Maze(Width, Height) {
  var mazeMap;
  var width = Width;
  var height = Height;
  var startCoord, endCoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: { y: -1, x: 0, o: "s" },
    s: { y: 1, x: 0, o: "n" },
    e: { y: 0, x: 1, o: "w" },
    w: { y: 0, x: -1, o: "e" }
  };

  this.map = function() { return mazeMap; };
  this.startCoord = function() { return startCoord; };
  this.endCoord = function() { return endCoord; };

  function genMap() {
    mazeMap = new Array(height);
    for (let y = 0; y < height; y++) {
      mazeMap[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        mazeMap[y][x] = {
          n: false, s: false, e: false, w: false,
          visited: false,
          priorPos: null
        };
      }
    }
  }

  function defineMaze() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = { x: 0, y: 0 };
    var numCells = width * height;
    
    while (!isComp) {
      move = false;
      mazeMap[pos.y][pos.x].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(dirs);
        maxLoops = Math.round(rand(height / 8));
        numLoops = 0;
      }
      numLoops++;

      for (let index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          if (!mazeMap[ny][nx].visited) {
            mazeMap[pos.y][pos.x][direction] = true;
            mazeMap[ny][nx][modDir[direction].o] = true;
            mazeMap[ny][nx].priorPos = { x: pos.x, y: pos.y };
            pos = { x: nx, y: ny };
            cellsVisited++;
            move = true;
            break;
          }
        }
      }

      if (!move) {
        pos = mazeMap[pos.y][pos.x].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }

  function defineStartEnd() {
    switch (rand(4)) {
      case 0:
        startCoord = { x: 0, y: 0 };
        endCoord = { x: width - 1, y: height - 1 };
        break;
      case 1:
        startCoord = { x: width - 1, y: 0 };
        endCoord = { x: 0, y: height - 1 };
        break;
      case 2:
        startCoord = { x: 0, y: height - 1 };
        endCoord = { x: width - 1, y: 0 };
        break;
      case 3:
        startCoord = { x: width - 1, y: height - 1 };
        endCoord = { x: 0, y: 0 };
        break;
    }
  }

  genMap();
  defineStartEnd();
  defineMaze();
}

function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
  var map = Maze.map();
  var cellSize = cellsize;
  
  this.redrawMaze = function(size) {
    cellSize = size;
  };

  this.draw = function(playerX, playerY) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw Maze Walls
    ctx.strokeStyle = "#00ff88"; // Matching accent color
    ctx.lineWidth = cellSize / 20;
    ctx.lineCap = "round";
    ctx.shadowBlur = 0;

    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        var cell = map[y][x];
        var screenX = x * cellSize;
        var screenY = y * cellSize;

        if (!cell.n) { ctx.beginPath(); ctx.moveTo(screenX, screenY); ctx.lineTo(screenX + cellSize, screenY); ctx.stroke(); }
        if (!cell.s) { ctx.beginPath(); ctx.moveTo(screenX, screenY + cellSize); ctx.lineTo(screenX + cellSize, screenY + cellSize); ctx.stroke(); }
        if (!cell.e) { ctx.beginPath(); ctx.moveTo(screenX + cellSize, screenY); ctx.lineTo(screenX + cellSize, screenY + cellSize); ctx.stroke(); }
        if (!cell.w) { ctx.beginPath(); ctx.moveTo(screenX, screenY); ctx.lineTo(screenX, screenY + cellSize); ctx.stroke(); }
      }
    }

    // Draw End House with pulse effect
    var endCoord = Maze.endCoord();
    var pulse = 1 + Math.sin(Date.now() / 300) * 0.05;
    var endPadding = (cellSize * 0.15) / pulse;
    
    ctx.shadowColor = "#f43f5e";
    ctx.shadowBlur = 15;
    ctx.drawImage(
      endSprite,
      endCoord.x * cellSize + endPadding,
      endCoord.y * cellSize + endPadding,
      cellSize - endPadding * 2,
      cellSize - endPadding * 2
    );
    ctx.shadowBlur = 0;
  };
}

function Player(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var moves = 0;
  var player = this;
  var map = maze.map();
  var isDestroyed = false;
  
  // Grid coordinates
  var gridX = maze.startCoord().x;
  var gridY = maze.startCoord().y;
  
  // Visual/Animated coordinates
  var visualX = gridX;
  var visualY = gridY;
  
  var cellSize = _cellsize;

  this.redrawPlayer = function(_cellsize) {
    cellSize = _cellsize;
  };

  function animate() {
    if (isDestroyed) return;

    // Smooth interpolation
    var speed = 0.25;
    var dx = gridX - visualX;
    var dy = gridY - visualY;
    
    if (Math.abs(dx) > 0.01) visualX += dx * speed; else visualX = gridX;
    if (Math.abs(dy) > 0.01) visualY += dy * speed; else visualY = gridY;

    // Redraw entire scene via draw object
    draw.draw(visualX, visualY);

    // Draw Player
    var padding = cellSize * 0.15;
    ctx.shadowColor = "#00bdff";
    ctx.shadowBlur = 10;
    ctx.drawImage(
      sprite,
      visualX * cellSize + padding,
      visualY * cellSize + padding,
      cellSize - padding * 2,
      cellSize - padding * 2
    );
    ctx.shadowBlur = 0;

    if (gridX === maze.endCoord().x && gridY === maze.endCoord().y && Math.abs(gridX - visualX) < 0.01 && Math.abs(gridY - visualY) < 0.01) {
      onComplete(moves);
      player.unbindKeyDown();
      return; 
    }

    requestAnimationFrame(animate);
  }

  function move(dir) {
    var cell = map[gridY][gridX];
    var moved = false;
    
    if (dir === "w" && cell.w) { gridX -= 1; moved = true; }
    else if (dir === "n" && cell.n) { gridY -= 1; moved = true; }
    else if (dir === "e" && cell.e) { gridX += 1; moved = true; }
    else if (dir === "s" && cell.s) { gridY += 1; moved = true; }

    if (moved) {
      moves++;
      return true;
    }
    return false;
  }

  function moveUntilWall(dir) {
    let movedAny = false;
    while (move(dir)) {
      movedAny = true;
      let cell = map[gridY][gridX];
      let paths = (cell.n?1:0) + (cell.s?1:0) + (cell.e?1:0) + (cell.w?1:0);
      if (paths > 2) break; 
      if (gridX === maze.endCoord().x && gridY === maze.endCoord().y) break;
    }
    return movedAny;
  }

  function handleInput(e) {
    var key = e.keyCode;
    if (key === 37 || key === 65) move("w");
    else if (key === 38 || key === 87) move("n");
    else if (key === 39 || key === 68) move("e");
    else if (key === 40 || key === 83) move("s");
  }

  this.bindKeyDown = function() {
    window.addEventListener("keydown", handleInput, false);
    $("#view").swipe({
      swipe: function(event, direction) {
        if (direction === "left") moveUntilWall("w");
        else if (direction === "up") moveUntilWall("n");
        else if (direction === "right") moveUntilWall("e");
        else if (direction === "down") moveUntilWall("s");
      },
      threshold: 30
    });
  };

  this.unbindKeyDown = function() {
    isDestroyed = true;
    window.removeEventListener("keydown", handleInput, false);
    try { $("#view").swipe("destroy"); } catch(e) {}
  };

  this.bindKeyDown();
  requestAnimationFrame(animate);
}

var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite = new Image();
var finishSprite = new Image();
var maze, draw, player;
var cellSize, difficulty;

function updateCanvasSize() {
  let size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 800);
  mazeCanvas.width = size;
  mazeCanvas.height = size;
  if (maze) {
    cellSize = mazeCanvas.width / difficulty;
    if (draw) draw.redrawMaze(cellSize);
    if (player) player.redrawPlayer(cellSize);
  }
}

window.onload = function() {
  updateCanvasSize();
  
  let loadedCount = 0;
  const onImageLoad = () => {
    loadedCount++;
    if (loadedCount === 2) makeMaze();
  };

  sprite.src = "./key.png?" + new Date().getTime();
  sprite.onload = onImageLoad;
  finishSprite.src = "./home.png?" + new Date().getTime();
  finishSprite.onload = onImageLoad;
};

window.onresize = updateCanvasSize;

function makeMaze() {
  if (player) player.unbindKeyDown();
  
  var e = document.getElementById("diffSelect");
  difficulty = parseInt(e.options[e.selectedIndex].value);
  cellSize = mazeCanvas.width / difficulty;
  
  maze = new Maze(difficulty, difficulty);
  draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
  player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
  
  document.getElementById("mazeContainer").style.opacity = "1";
}
