const GHOSTS = {
  blinky: {
    CANVAS_CONTEXT: null,
    POSITION_X: 276,
    POSITION_Y: 204,
    DIRECTION: 1,
    COLOR: "#ed1b24",
    MOVING_TIMER: -1,
    MOVING: false,
    BODY_STATE: 0,
    STATE: 0,
    EAT_TIMER: null,
    AFFRAID_TIMER: null,
    AFFRAID_STATE: 0,
    TUNNEL: false,
  },
  pinky: {
    CANVAS_CONTEXT: null,
    POSITION_X: 276,
    POSITION_Y: 258,
    DIRECTION: 2,
    COLOR: "#feaec9",
    MOVING_TIMER: -1,
    MOVING: false,
    BODY_STATE: 1,
    STATE: 0,
    EAT_TIMER: null,
    AFFRAID_TIMER: null,
    AFFRAID_STATE: 0,
    TUNNEL: false,
  },
  inky: {
    CANVAS_CONTEXT: null,
    POSITION_X: 238,
    POSITION_Y: 258,
    DIRECTION: 3,
    COLOR: "#4adecb",
    MOVING_TIMER: -1,
    MOVING: false,
    BODY_STATE: 2,
    STATE: 0,
    EAT_TIMER: null,
    AFFRAID_TIMER: null,
    AFFRAID_STATE: 0,
    TUNNEL: false,
  },
  clyde: {
    CANVAS_CONTEXT: null,
    POSITION_X: 314,
    POSITION_Y: 258,
    DIRECTION: 4,
    COLOR: "#f99c00",
    MOVING_TIMER: -1,
    MOVING: false,
    BODY_STATE: 3,
    STATE: 0,
    EAT_TIMER: null,
    AFFRAID_TIMER: null,
    AFFRAID_STATE: 0,
    TUNNEL: false,
  },
};

var GHOST_BLINKY_COLOR = GHOSTS.blinky.COLOR;
var GHOST_PINKY_COLOR = GHOSTS.pinky.COLOR;
var GHOST_INKY_COLOR = GHOSTS.inky.COLOR;
var GHOST_CLYDE_COLOR = GHOSTS.clyde.COLOR;

var GHOST_AFFRAID_COLOR = "#2d3eff";
var GHOST_AFFRAID_FINISH_COLOR = "#fff";
var GHOST_POSITION_STEP = 2;
var GHOST_MOVING_SPEED = 15;
var GHOST_TUNNEL_MOVING_SPEED = 35;
var GHOST_AFFRAID_MOVING_SPEED = 40;
var GHOST_EAT_MOVING_SPEED = 6;
var GHOST_AFFRAID_TIME = 8500;
var GHOST_EAT_TIME = 5500;
var GHOST_BODY_STATE_MAX = 6;

function initGhosts() {
  initGhost("blinky");
  initGhost("pinky");
  initGhost("inky");
  initGhost("clyde");
}
function initGhost(ghost) {
  var canvas = document.getElementById("canvas-ghost-" + ghost);
  canvas.setAttribute("width", "550");
  canvas.setAttribute("height", "550");
  if (canvas.getContext) {
    GHOSTS[ghost].CANVAS_CONTEXT = canvas.getContext("2d");
  }
}
function resetGhosts() {
  stopGhosts();

  GHOSTS.blinky.POSITION_X = 276;
  GHOSTS.blinky.POSITION_Y = 204;
  GHOSTS.blinky.DIRECTION = 1;
  GHOSTS.blinky.MOVING_TIMER = -1;
  GHOSTS.blinky.MOVING = false;
  GHOSTS.blinky.BODY_STATE = 0;
  GHOSTS.blinky.STATE = 0;
  GHOSTS.blinky.EAT_TIMER = null;
  GHOSTS.blinky.AFFRAID_TIMER = null;
  GHOSTS.blinky.AFFRAID_STATE = 0;

  GHOSTS.pinky.POSITION_X = 276;
  GHOSTS.pinky.POSITION_Y = 258;
  GHOSTS.pinky.DIRECTION = 2;
  GHOSTS.pinky.MOVING_TIMER = -1;
  GHOSTS.pinky.MOVING = false;
  GHOSTS.pinky.BODY_STATE = 1;
  GHOSTS.pinky.STATE = 0;
  GHOSTS.pinky.EAT_TIMER = null;
  GHOSTS.pinky.AFFRAID_TIMER = null;
  GHOSTS.pinky.AFFRAID_STATE = 0;

  GHOSTS.inky.POSITION_X = 238;
  GHOSTS.inky.POSITION_Y = 258;
  GHOSTS.inky.DIRECTION = 3;
  GHOSTS.inky.MOVING_TIMER = -1;
  GHOSTS.inky.MOVING = false;
  GHOSTS.inky.BODY_STATE = 2;
  GHOSTS.inky.STATE = 0;
  GHOSTS.inky.EAT_TIMER = null;
  GHOSTS.inky.AFFRAID_TIMER = null;
  GHOSTS.inky.AFFRAID_STATE = 0;

  GHOSTS.clyde.POSITION_X = 314;
  GHOSTS.clyde.POSITION_Y = 258;
  GHOSTS.clyde.DIRECTION = 4;
  GHOSTS.clyde.MOVING_TIMER = -1;
  GHOSTS.clyde.MOVING = false;
  GHOSTS.clyde.BODY_STATE = 3;
  GHOSTS.clyde.STATE = 0;
  GHOSTS.clyde.EAT_TIMER = null;
  GHOSTS.clyde.AFFRAID_TIMER = null;
  GHOSTS.clyde.AFFRAID_STATE = 0;
}

function getGhostCanevasContext(ghost) {
  return GHOSTS[ghost].CANVAS_CONTEXT;
}

function drawGhosts() {
  drawGhost("blinky");
  drawGhost("pinky");
  drawGhost("inky");
  drawGhost("clyde");
}
function drawGhost(ghost) {
  var ctx = getGhostCanevasContext(ghost);

  if (GHOSTS[ghost].STATE === 0) {
    ctx.fillStyle = GHOSTS[ghost].COLOR;
  } else {
    if (GHOSTS[ghost].AFFRAID_STATE === 1) {
      ctx.fillStyle = GHOST_AFFRAID_FINISH_COLOR;
    } else {
      ctx.fillStyle = GHOST_AFFRAID_COLOR;
    }
  }
  drawHelperGhost(
    ctx,
    GHOSTS[ghost].POSITION_X,
    GHOSTS[ghost].POSITION_Y,
    GHOSTS[ghost].DIRECTION,
    GHOSTS[ghost].BODY_STATE,
    GHOSTS[ghost].STATE,
    GHOSTS[ghost].AFFRAID_STATE,
  );

  ctx.closePath();
}

function affraidGhosts() {
  playWazaSound();

  SCORE_GHOST_COMBO = 200;

  affraidGhost("blinky");
  affraidGhost("pinky");
  affraidGhost("inky");
  affraidGhost("clyde");
}
function affraidGhost(ghost) {
  if (GHOSTS[ghost].AFFRAID_TIMER !== null) {
    GHOSTS[ghost].AFFRAID_TIMER.cancel();
    GHOSTS[ghost].AFFRAID_TIMER = null;
  }
  GHOSTS[ghost].AFFRAID_STATE = 0;
  if (
    GHOSTS[ghost].STATE === 0 ||
    GHOSTS[ghost].STATE === 1
  ) {
    stopGhost(ghost);
    GHOSTS[ghost].STATE = 1;
    moveGhost(ghost);
    GHOSTS[ghost].AFFRAID_TIMER = new Timer(
      () => cancelAffraidGhost(ghost),
      GHOST_AFFRAID_TIME,
    );
  }
}
function cancelAffraidGhost(ghost) {
  if (GHOSTS[ghost].STATE === 1) {
    GHOSTS[ghost].AFFRAID_TIMER.cancel();
    GHOSTS[ghost].AFFRAID_TIMER = null;
    stopGhost(ghost);
    GHOSTS[ghost].STATE = 0;
    moveGhost(ghost);
    testStateGhosts();
  }
}
function testStateGhosts() {
  if (
    GHOSTS.blinky.STATE === 1 ||
    GHOSTS.pinky.STATE === 1 ||
    GHOSTS.inky.STATE === 1 ||
    GHOSTS.clyde.STATE === 1
  ) {
    playWazaSound();
  } else if (
    GHOSTS.blinky.STATE === -1 ||
    GHOSTS.pinky.STATE === -1 ||
    GHOSTS.inky.STATE === -1 ||
    GHOSTS.clyde.STATE === -1
  ) {
    playGhostEatenSound();
  } else {
    playSirenSound();
  }
}

function startEatGhost(ghost) {
  if (!LOCK) {
    playEatGhostSound();

    LOCK = true;

    if (GHOSTS[ghost].AFFRAID_TIMER !== null) {
      GHOSTS[ghost].AFFRAID_TIMER.cancel();
      GHOSTS[ghost].AFFRAID_TIMER = null;
    }

    score(SCORE_GHOST_COMBO, ghost);

    pauseGhosts();
    pausePacman();

    setTimeout(() => eatGhost(ghost), 600);
  }
}

function eatGhost(ghost) {
  playGhostEatenSound();

  if (GHOSTS[ghost].STATE === 1) {
    $("#board span.combo").remove();
    GHOSTS[ghost].STATE = -1;
    GHOSTS[ghost].EAT_TIMER = new Timer(
      () => cancelEatGhost(ghost),
      GHOST_EAT_TIME,
    );
    GHOSTS[ghost].EAT_TIMER.pause();
  }
  resumeGhosts();
  resumePacman();
  LOCK = false;
}
function cancelEatGhost(ghost) {
  if (GHOSTS[ghost].STATE === -1) {
    GHOSTS[ghost].EAT_TIMER = null;
    stopGhost(ghost);
    GHOSTS[ghost].STATE = 0;
    moveGhost(ghost);
    testStateGhosts();
  }
}

function moveGhosts() {
  moveGhost("blinky");
  moveGhost("pinky");
  moveGhost("inky");
  moveGhost("clyde");
}
function moveGhost(ghost) {
  if (GHOSTS[ghost].MOVING === false) {
    GHOSTS[ghost].MOVING = true;

    var speed = -1;
    if (GHOSTS[ghost].STATE === 1) {
      speed = GHOST_AFFRAID_MOVING_SPEED;
    } else if (GHOSTS[ghost].STATE === 0) {
      if (GHOSTS[ghost].TUNNEL === false) {
        speed = GHOST_MOVING_SPEED;
      } else {
        speed = GHOST_TUNNEL_MOVING_SPEED;
      }
    } else {
      speed = GHOST_EAT_MOVING_SPEED;
    }
    GHOSTS[ghost].MOVING_TIMER = setInterval(
      () => moveGhost(ghost),
      speed,
    );
  } else {
    changeDirection(ghost);

    if (GHOSTS[ghost].AFFRAID_TIMER !== null) {
      var remain = GHOSTS[ghost].AFFRAID_TIMER.remain();
      if (
        (remain >= 2500 && remain < 3000) ||
        (remain >= 1500 && remain <= 2000) ||
        (remain >= 500 && remain <= 1000) ||
        remain < 0
      ) {
        GHOSTS[ghost].AFFRAID_STATE = 1;
      } else if (
        (remain > 2000 && remain < 2500) ||
        (remain > 1000 && remain < 1500) ||
        (remain >= 0 && remain < 500)
      ) {
        GHOSTS[ghost].AFFRAID_STATE = 0;
      }
    }

    if (canMoveGhost(ghost)) {
      eraseGhost(ghost);

      if (GHOSTS[ghost].BODY_STATE < GHOST_BODY_STATE_MAX) {
        GHOSTS[ghost].BODY_STATE++;
      } else {
        GHOSTS[ghost].BODY_STATE = 0;
      }

      if (GHOSTS[ghost].DIRECTION === 1) {
        GHOSTS[ghost].POSITION_X += GHOST_POSITION_STEP;
      } else if (GHOSTS[ghost].DIRECTION === 2) {
        GHOSTS[ghost].POSITION_Y += GHOST_POSITION_STEP;
      } else if (GHOSTS[ghost].DIRECTION === 3) {
        GHOSTS[ghost].POSITION_X -= GHOST_POSITION_STEP;
      } else if (GHOSTS[ghost].DIRECTION === 4) {
        GHOSTS[ghost].POSITION_Y -= GHOST_POSITION_STEP;
      }

      if (
        GHOSTS[ghost].POSITION_X === 2 &&
        GHOSTS[ghost].POSITION_Y === 258
      ) {
        GHOSTS[ghost].POSITION_X = 548;
        GHOSTS[ghost].POSITION_Y = 258;
      } else if (
        GHOSTS[ghost].POSITION_X === 548 &&
        GHOSTS[ghost].POSITION_Y === 258
      ) {
        GHOSTS[ghost].POSITION_X = 2;
        GHOSTS[ghost].POSITION_Y = 258;
      }

      drawGhost(ghost);

      testGhostPacman(ghost);

      if (
        GHOSTS[ghost].BODY_STATE === 3 &&
        GHOSTS[ghost].STATE !== -1
      ) {
        if (!PACMAN_MOVING) {
          testGhostPacman(ghost);
        }
        testGhostTunnel(ghost);
      }
    } else {
      GHOSTS[ghost].DIRECTION = oneDirection();
    }
  }
}

function testGhostTunnel(ghost) {
  if (GHOSTS[ghost].STATE === 0) {
    if (
      isInTunnel(ghost) &&
      GHOSTS[ghost].TUNNEL === false
    ) {
      stopGhost(ghost);
      GHOSTS[ghost].TUNNEL = true;
      moveGhost(ghost);
    } else if (
      !isInTunnel(ghost) &&
      GHOSTS[ghost].TUNNEL === true
    ) {
      stopGhost(ghost);
      GHOSTS[ghost].TUNNEL = false;
      moveGhost(ghost);
    }
  }
}
function isInTunnel(ghost) {
  if (
    GHOSTS[ghost].POSITION_X >= 2 &&
    GHOSTS[ghost].POSITION_X <= 106 &&
    GHOSTS[ghost].POSITION_Y === 258
  ) {
    return true;
  } else if (
    GHOSTS[ghost].POSITION_X >= 462 &&
    GHOSTS[ghost].POSITION_X <= 548 &&
    GHOSTS[ghost].POSITION_Y === 258
  ) {
    return true;
  }
}

function changeDirection(ghost) {
  var direction = GHOSTS[ghost].DIRECTION;
  var state = GHOSTS[ghost].STATE;
  var ghostX = GHOSTS[ghost].POSITION_X;
  var ghostY = GHOSTS[ghost].POSITION_Y;

  var tryDirection = oneDirection();

  if (state === 0 || state === 1) {
    if (ghostX != 276 && ghostY != 258) {
      var pacmanX = PACMAN_POSITION_X;
      var pacmanY = PACMAN_POSITION_Y;
      var axe = oneAxe();
      if (ghost === "blinky") {
        var nothing = whatsYourProblem();
        if (nothing < 6) {
          tryDirection = getRightDirection(
            axe,
            ghostX,
            ghostY,
            pacmanX,
            pacmanY,
          );
          if (
            !(
              canMoveGhost(ghost, tryDirection) &&
              direction != tryDirection - 2 &&
              direction != tryDirection + 2
            )
          ) {
            axe++;
            if (axe > 2) axe = 1;
            tryDirection = getRightDirection(
              axe,
              ghostX,
              ghostY,
              pacmanX,
              pacmanY,
            );
          }
        }
      } else if (ghost === "pinky") {
        var nothing = whatsYourProblem();
        if (nothing < 3) {
          tryDirection = getRightDirection(
            axe,
            ghostX,
            ghostY,
            pacmanX,
            pacmanY,
          );
          if (
            !(
              canMoveGhost(ghost, tryDirection) &&
              direction != tryDirection - 2 &&
              direction != tryDirection + 2
            )
          ) {
            axe++;
            if (axe > 2) axe = 1;
            tryDirection = getRightDirection(
              axe,
              ghostX,
              ghostY,
              pacmanX,
              pacmanY,
            );
          }
          tryDirection = reverseDirection(tryDirection);
        }
      } else if (ghost === "inky") {
        var good = anyGoodIdea();
        if (good < 3) {
          tryDirection = getRightDirection(
            axe,
            ghostX,
            ghostY,
            pacmanX,
            pacmanY,
          );
          if (
            !(
              canMoveGhost(ghost, tryDirection) &&
              direction != tryDirection - 2 &&
              direction != tryDirection + 2
            )
          ) {
            axe++;
            if (axe > 2) axe = 1;
            tryDirection = getRightDirection(
              axe,
              ghostX,
              ghostY,
              pacmanX,
              pacmanY,
            );
          }
        }
      }
    }
    if (state === 1) {
      tryDirection = reverseDirection(tryDirection);
    }
  } else {
    var axe = oneAxe();
    tryDirection = getRightDirectionForHome(axe, ghostX, ghostY);
    if (
      canMoveGhost(ghost, tryDirection) &&
      direction != tryDirection - 2 &&
      direction != tryDirection + 2
    ) {
    } else {
      axe++;
      if (axe > 2) axe = 1;
      tryDirection = getRightDirectionForHome(axe, ghostX, ghostY);
    }
  }

  if (
    canMoveGhost(ghost, tryDirection) &&
    direction != tryDirection - 2 &&
    direction != tryDirection + 2
  ) {
    GHOSTS[ghost].DIRECTION = tryDirection;
  }
}

function getRightDirectionForHome(axe, ghostX, ghostY) {
  var homeX = 276;
  var homeY = 204;

  if (ghostY === 204 && ghostX === 276) {
    return 2;
  } else if (ghostX === 276 && ghostY === 258) {
    return oneDirectionX();
  } else {
    if (axe === 1) {
      if (ghostX > homeX) {
        return 3;
      } else {
        return 1;
      }
    } else {
      if (ghostY > homeY) {
        return 4;
      } else {
        return 2;
      }
    }
  }
}
function getRightDirection(axe, ghostX, ghostY, pacmanX, pacmanY) {
  if (axe === 1) {
    if (ghostX > pacmanX) {
      return 3;
    } else {
      return 1;
    }
  } else {
    if (ghostY > pacmanY) {
      return 4;
    } else {
      return 2;
    }
  }
}
function reverseDirection(direction) {
  if (direction > 2) return direction - 2;
  else return direction + 2;
}

function eraseGhost(ghost) {
  var ctx = getGhostCanevasContext(ghost);

  ctx.clearRect(
    GHOSTS[ghost].POSITION_X - 17,
    GHOSTS[ghost].POSITION_Y - 17,
    34,
    34,
  );
}
function eraseGhosts() {
  eraseGhost("blinky");
  eraseGhost("pinky");
  eraseGhost("inky");
  eraseGhost("clyde");
}

function canMoveGhost(ghost, direction) {
  if (!direction) {
    direction = GHOSTS[ghost].DIRECTION;
  }
  var positionX = GHOSTS[ghost].POSITION_X;
  var positionY = GHOSTS[ghost].POSITION_Y;
  var state = GHOSTS[ghost].STATE;

  if (positionX === 276 && positionY === 204 && direction === 2 && state === 0)
    return false;

  if (direction === 1) {
    positionX += GHOST_POSITION_STEP;
  } else if (direction === 2) {
    positionY += GHOST_POSITION_STEP;
  } else if (direction === 3) {
    positionX -= GHOST_POSITION_STEP;
  } else if (direction === 4) {
    positionY -= GHOST_POSITION_STEP;
  }

  for (var i = 0, imax = PATHS.length; i < imax; i++) {
    var p = PATHS[i];

    var startX = p.split("-")[0].split(",")[0];
    var startY = p.split("-")[0].split(",")[1];
    var endX = p.split("-")[1].split(",")[0];
    var endY = p.split("-")[1].split(",")[1];

    if (
      positionX >= startX &&
      positionX <= endX &&
      positionY >= startY &&
      positionY <= endY
    ) {
      return true;
    }
  }

  return false;
}

function oneDirection() {
  return Math.floor(Math.random() * (4 - 1 + 1) + 1);
}
function oneDirectionX() {
  var direction = oneDirection();
  if (direction === 4 || direction === 2) direction -= 1;
  return direction;
}
function oneDirectionY() {
  var direction = oneDirection();
  if (direction === 3 || direction === 1) direction -= 1;
  return direction;
}

function stopGhost(ghost) {
  if (GHOSTS[ghost].STATE === 1) {
    if (GHOSTS[ghost].AFFRAID_TIMER !== null) {
      GHOSTS[ghost].AFFRAID_TIMER.cancel();
    }
    GHOSTS[ghost].AFFRAID_TIMER = null;
    GHOSTS[ghost].STATE = 0;
  } else if (GHOSTS[ghost].STATE === -1) {
    if (GHOSTS[ghost].EAT_TIMER !== null) {
      GHOSTS[ghost].EAT_TIMER.cancel();
    }
    GHOSTS[ghost].EAT_TIMER = null;
    GHOSTS[ghost].STATE = 0;
  }

  if (GHOSTS[ghost].MOVING_TIMER !== -1) {
    clearInterval(GHOSTS[ghost].MOVING_TIMER);
    GHOSTS[ghost].MOVING_TIMER = -1;
    GHOSTS[ghost].MOVING = false;
  }
}
function stopGhosts() {
  stopGhost("blinky");
  stopGhost("pinky");
  stopGhost("inky");
  stopGhost("clyde");
}

function pauseGhost(ghost) {
  if (GHOSTS[ghost].STATE === 1) {
    if (GHOSTS[ghost].AFFRAID_TIMER !== null) {
      GHOSTS[ghost].AFFRAID_TIMER.pause();
    }
  } else if (GHOSTS[ghost].STATE === -1) {
    if (GHOSTS[ghost].EAT_TIMER !== null) {
      GHOSTS[ghost].EAT_TIMER.pause();
    }
  }

  if (GHOSTS[ghost].MOVING_TIMER !== -1) {
    clearInterval(GHOSTS[ghost].MOVING_TIMER);
    GHOSTS[ghost].MOVING_TIMER = -1;
    GHOSTS[ghost].MOVING = false;
  }
}
function pauseGhosts() {
  pauseGhost("blinky");
  pauseGhost("pinky");
  pauseGhost("inky");
  pauseGhost("clyde");
}

function resumeGhost(ghost) {
  if (GHOSTS[ghost].STATE === 1) {
    if (GHOSTS[ghost].AFFRAID_TIMER !== null) {
      GHOSTS[ghost].AFFRAID_TIMER.resume();
    }
  } else if (GHOSTS[ghost].STATE === -1) {
    if (GHOSTS[ghost].EAT_TIMER !== null) {
      GHOSTS[ghost].EAT_TIMER.resume();
    }
  }
  moveGhost(ghost);
}
function resumeGhosts() {
  resumeGhost("blinky");
  resumeGhost("pinky");
  resumeGhost("inky");
  resumeGhost("clyde");
}

function drawHelperGhost(ctx, x, y, d, b, s, a) {
  if (s != -1) {
    ctx.beginPath();
    ctx.moveTo(x - 15, y + 16);
    ctx.lineTo(x - 15, y + 16 - 18);
    ctx.bezierCurveTo(
      x - 15,
      y + 16 - 26,
      x - 15 + 6,
      y + 16 - 32,
      x - 15 + 14,
      y + 16 - 32,
    );
    ctx.bezierCurveTo(
      x - 15 + 22,
      y + 16 - 32,
      x - 15 + 28,
      y + 16 - 26,
      x - 15 + 28,
      y + 16 - 18,
    );
    ctx.lineTo(x - 15 + 28, y + 16);
    if (b < 4) {
      ctx.lineTo(x - 15 + 23.333, y + 16 - 5.333);
      ctx.lineTo(x - 15 + 18.666, y + 16);
      ctx.lineTo(x - 15 + 14, y + 16 - 5.333);
      ctx.lineTo(x - 15 + 9.333, y + 16);
      ctx.lineTo(x - 15 + 4.666, y + 16 - 5.333);
    } else {
      ctx.lineTo(x - 15 + 24.333, y + 16 - 5.333);
      ctx.lineTo(x - 15 + 20.666, y + 16);
      ctx.lineTo(x - 15 + 17.333, y + 16 - 5.333);
      ctx.lineTo(x - 15 + 12.666, y + 16);
      ctx.lineTo(x - 15 + 9, y + 16 - 5.333);
      ctx.lineTo(x - 15 + 5.333, y + 16);
      ctx.lineTo(x - 15 + 2.666, y + 16 - 5.333);
    }
    ctx.lineTo(x - 15, y + 16);
    ctx.fill();
  }

  var eyesX = 0;
  var eyesY = 0;

  if (d === 4) {
    eyesY = -5;
  } else if (d === 1) {
    eyesX = +2;
  } else if (d === 2) {
    eyesY = 0;
    eyesY = +5;
  } else if (d === 3) {
    eyesX = -3;
  }

  if (s === 0 || s === -1) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x - 15 + 8 + eyesX, y + 16 - 24 + eyesY);
    ctx.bezierCurveTo(
      x - 15 + 5 + eyesX,
      y + 16 - 24 + eyesY,
      x - 15 + 4 + eyesX,
      y + 16 - 21 + eyesY,
      x - 15 + 4 + eyesX,
      y + 16 - 19 + eyesY,
    );
    ctx.bezierCurveTo(
      x - 15 + 4 + eyesX,
      y + 16 - 17 + eyesY,
      x - 15 + 5 + eyesX,
      y + 16 - 14 + eyesY,
      x - 15 + 8 + eyesX,
      y + 16 - 14 + eyesY,
    );
    ctx.bezierCurveTo(
      x - 15 + 11 + eyesX,
      y + 16 - 14 + eyesY,
      x - 15 + 12 + eyesX,
      y + 16 - 17 + eyesY,
      x - 15 + 12 + eyesX,
      y + 16 - 19 + eyesY,
    );
    ctx.bezierCurveTo(
      x - 15 + 12 + eyesX,
      y + 16 - 21 + eyesY,
      x - 15 + 11 + eyesX,
      y + 16 - 24 + eyesY,
      x - 15 + 8 + eyesX,
      y + 16 - 24 + eyesY,
    );

    ctx.moveTo(x - 15 + 20 + eyesX, y + 16 - 24 + eyesY);
    ctx.bezierCurveTo(
      x - 15 + 17 + eyesX,
      y + 16 - 24 + eyesY,
      x - 15 + 16 + eyesX,
      y + 16 - 21 + eyesY,
      x - 15 + 16 + eyesX,
      y + 16 - 19 + eyesY,
    );
    ctx.bezierCurveTo(
      x - 15 + 16 + eyesX,
      y + 16 - 17 + eyesY,
      x - 15 + 17 + eyesX,
      y + 16 - 14 + eyesY,
      x - 15 + 20 + eyesX,
      y + 16 - 14 + eyesY,
    );
    ctx.bezierCurveTo(
      x - 15 + 23 + eyesX,
      y + 16 - 14 + eyesY,
      x - 15 + 24 + eyesX,
      y + 16 - 17 + eyesY,
      x - 15 + 24 + eyesX,
      y + 16 - 19 + eyesY,
    );
    ctx.bezierCurveTo(
      x - 15 + 24 + eyesX,
      y + 16 - 21 + eyesY,
      x - 15 + 23 + eyesX,
      y + 16 - 24 + eyesY,
      x - 15 + 20 + eyesX,
      y + 16 - 24 + eyesY,
    );
    ctx.fill();

    if (d === 4) {
      eyesY = -9;
      eyesX = 2;
    } else if (d === 1) {
      eyesX = +6;
    } else if (d === 2) {
      eyesY = +8;
      eyesX = 2;
    } else if (d === 3) {
    }

    ctx.fillStyle = "#0000fa";
    ctx.beginPath();
    ctx.arc(x - 15 + 18 + eyesX, y + 16 - 18 + eyesY, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - 15 + 6 + eyesX, y + 16 - 18 + eyesY, 2, 0, Math.PI * 2, true);
    ctx.fill();
  } else {
    if (a === 1) {
      ctx.fillStyle = "#ee2933";
    } else {
      ctx.fillStyle = "#e5bed0";
    }
    ctx.beginPath();
    ctx.arc(x - 15 + 18, y + 13 - 17, 2, 0, Math.PI * 2, true);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x - 15 + 10, y + 13 - 17, 2, 0, Math.PI * 2, true);
    ctx.fill();

    if (a === 1) {
      ctx.strokeStyle = "#ee2933";
    } else {
      ctx.strokeStyle = "#e5bed0";
    }
    ctx.beginPath();
    ctx.lineTo(x - 14.333 + 24, y + 6);

    ctx.lineTo(x - 14.333 + 21, y + 6 - 3);
    ctx.lineTo(x - 14.333 + 17, y + 6);

    ctx.lineTo(x - 14.333 + 14, y + 6 - 3);
    ctx.lineTo(x - 14.333 + 10, y + 6);

    ctx.lineTo(x - 14.333 + 7, y + 6 - 3);
    ctx.lineTo(x - 14.333 + 3, y + 6);
    ctx.stroke();
  }
}
