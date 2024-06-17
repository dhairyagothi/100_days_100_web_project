// snake is an array that stores the segments of the snake. Initially, it has one segment located at (200, 200).
let snake = [{ top: 200, left: 200 }];
let food = null;
let score = 0;
let highScore = 0;
let speed =100;
//Create a object named direction 
let direction = { key: 'ArrowRight', dx: 20, dy: 0 };
 
//since we are not targetting any specfic tag and we want to note the key pressed we created a eventListener

//And the direction is only changed if the absolute value of dx is not same

//left and right dx:20 ,top and left dx:0 and the snake is not allowed to do a 180degree so if the snake is moving towards right direction it can only move in top or bottom direction not towards left direction
window.addEventListener('keydown', e => {
    const newDirection = getDirection(e.key);
    const allowedChange = Math.abs(direction.dx) !== Math.abs(newDirection.dx);
    if (allowedChange) direction = newDirection;
});

//based on which we press on our keyboard the position are returned 
function getDirection(key) {
    switch (key) {
        case 'ArrowUp' || 'w': 
            return { key, dx: 0, dy: -20 };
        case 'ArrowDown' || 's':
            return { key, dx: 0, dy: 20 };
        case 'ArrowLeft' || 'a':
            return { key, dx: -20, dy: 0 };
        case 'ArrowRight' || 'd': 
            return { key, dx: 20, dy: 0 };
        default:
            return direction;
    }
}
//copys the snake object and stores in the head object and based on the above function we have input of which key the user pressed and based on that we increment the values in the head 
function moveSnake() {
    const head = Object.assign({}, snake[0]); // This line creates a copy of the first element in the snake array (which represents the head of the snake) using Object.assign.
    head.top += direction.dy;
    head.left += direction.dx;
    // direction.dy and direction.dx represent the change in the vertical and horizontal positions, respectively.
    // By adding direction.dy to head.top and direction.dx to head.left, the new position of the head is calculated.
    snake.unshift(head);
    //opposite of push function inserts element at the start of the array

    //if the snake's head or the 0th element goes out of the boundary of the game reposition the snake 

    // For example if the position of the head of the snake's top is less than 0 then reposition it at the bottom of the boundary 
    if (snake[0].top < 0) snake[0].top = 380;
    if (snake[0].left < 0) snake[0].left = 380;
    if (snake[0].top > 380) snake[0].top = 0;
    if (snake[0].left > 380) snake[0].left = 0;

    // if the snake didn't ate any food to keep the length same we remove the last element from the array
    if(!eatFood()) snake.pop();
}
//Randomly generating food position using math.random function which generates a random value between 0 and 1 
//so the function will be generating a random value between 0 and 400
function randomFood() {
    food = {
        top: Math.floor(Math.random() * 20) * 20,
        left: Math.floor(Math.random() * 20) * 20
    };
}

//If the position of the snake's head(top and left) matches with the food position that means the snake ate the food so make food=null and if it is not the case then return false
function eatFood() {
  
    if (snake[0].top === food.top && snake[0].left === food.left) {
        food = null;
        return true;
    }
    return false;
}


//changes the score

function updateScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
    document.getElementById('high-score').innerText = 'High Score: ' + highScore;
}


//If at any point and time in the game if the head position(top and left) has the same position as any one of the element in the snake array (overlapping) then game over
function gameOver() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].top === snake[0].top && snake[i].left === snake[0].left)
            return true;
    }
    return false;
}

// Main Game Loop
// Checks for game over, updates scores, moves the snake, generates food, and calls itself recursively with a delay determined by the speed.
function gameLoop() {
    if (gameOver()) {
      alert("Game over!");

      if (score > highScore) {
        highScore = score;
      }

      //resetting everything
      score = 0;
      speed = 100;
      snake = [{ top: 200, left: 200 }];
      direction = { key: "ArrowRight", dx: 20, dy: 0 };
      food = null;
      randomFood();
    }
  
    setTimeout(() => {
      document.getElementById("game-board").innerHTML = "";
      moveSnake();
      if (!food) {
        randomFood();
        //updating the score by one 
        score += 1;
        //decrease the speed of the snake as the length of the speed of the snake is increasing
        speed = speed - 2;
        
      }
      if (eatFood()) {
        document.getElementById("score").innerHTML = `Score :${score}`;
      }
      updateScore();
      drawSnake();
      drawFood();
      gameLoop();
    }, speed);
  }
  
  drawSnake();
  randomFood();
  gameLoop();
  
  function drawSnake() {
    snake.forEach((item, index) => {

      //creates a new div using createElement and add class=snake and if it is the first item then add head to its class list and then append it to the game-board div 
      const snakeElement = document.createElement("div");
      snakeElement.style.top = `${item.top}px`;
      snakeElement.style.left = `${item.left}px`;
      snakeElement.classList.add("snake");
      if (index === 0) snakeElement.classList.add("head");
      if (index === snake.length - 1) snakeElement.classList.add("head");
      document.getElementById("game-board").appendChild(snakeElement);
    });
  }
  
    //same as draw snake creates div and append it to the the game board div
  function drawFood() {
    const foodElement = document.createElement("div");
    foodElement.style.top = `${food.top}px`;
    foodElement.style.left = `${food.left}px`;
    foodElement.classList.add("food");
    document.getElementById("game-board").appendChild(foodElement);
  }



