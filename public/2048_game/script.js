document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
  
    let squares = [];
    let score = 0;
  
    function createBoard() {
      for (let i = 0; i < 16; i++) {
        let square = document.createElement('div');
        square.innerHTML = 0;
        gridDisplay.appendChild(square);
        squares.push(square);
      }
      generateTwo();
      generateTwo();
    }
    createBoard();
  
    function generateTwo() {
      let random = Math.floor(Math.random() * squares.length);
      if (squares[random].innerHTML == 0) {
        squares[random].innerHTML = 2;
        checkLose();
      } else generateTwo();
    }
  
    function moveRight() {
      for (let i = 0; i < 16; i++) {
        if (i % 4 == 0) {
          let totalOne = parseInt(squares[i].innerHTML);
          let totalTwo = parseInt(squares[i + 1].innerHTML);
          let totalThree = parseInt(squares[i + 2].innerHTML);
          let totalFour = parseInt(squares[i + 3].innerHTML);
          let row = [totalOne, totalTwo, totalThree, totalFour];
  
          let filteredRow = row.filter(x => x != 0);
          let missing = 4 - filteredRow.length;
          let zeros = Array(missing).fill(0);
          let newRow = zeros.concat(filteredRow);
  
          squares[i].innerHTML = newRow[0];
          squares[i + 1].innerHTML = newRow[1];
          squares[i + 2].innerHTML = newRow[2];
          squares[i + 3].innerHTML = newRow[3];
        }
      }
    }
  
    function moveLeft() {
      for (let i = 0; i < 16; i++) {
        if (i % 4 == 0) {
          let totalOne = parseInt(squares[i].innerHTML);
          let totalTwo = parseInt(squares[i + 1].innerHTML);
          let totalThree = parseInt(squares[i + 2].innerHTML);
          let totalFour = parseInt(squares[i + 3].innerHTML);
          let row = [totalOne, totalTwo, totalThree, totalFour];
  
          let filteredRow = row.filter(x => x != 0);
          let missing = 4 - filteredRow.length;
          let zeros = Array(missing).fill(0);
          let newRow = filteredRow.concat(zeros);
  
          squares[i].innerHTML = newRow[0];
          squares[i + 1].innerHTML = newRow[1];
          squares[i + 2].innerHTML = newRow[2];
          squares[i + 3].innerHTML = newRow[3];
        }
      }
    }
  
    function sumRow() {
      for (let i = 0; i < 15; i++) {
        if (squares[i].innerHTML == squares[i + 1].innerHTML) {
          let combineNum = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
          squares[i].innerHTML = combineNum;
          squares[i + 1].innerHTML = 0;
          score += combineNum;
          scoreDisplay.innerHTML = score;
        }
      }
    }
  
    function moveDown() {
      for (let i = 0; i < 4; i++) {
        let totalOne = parseInt(squares[i].innerHTML);
        let totalTwo = parseInt(squares[i + 4].innerHTML);
        let totalThree = parseInt(squares[i + 4 * 2].innerHTML);
        let totalFour = parseInt(squares[i + 4 * 3].innerHTML);
        let column = [totalOne, totalTwo, totalThree, totalFour];
  
        let filteredColumn = column.filter(x => x != 0);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill(0);
        let newColumn = zeros.concat(filteredColumn);
  
        squares[i].innerHTML = newColumn[0];
        squares[i + 4].innerHTML = newColumn[1];
        squares[i + 4 * 2].innerHTML = newColumn[2];
        squares[i + 4 * 3].innerHTML = newColumn[3];
      }
    }
  
    function moveUp() {
      for (let i = 0; i < 4; i++) {
        let totalOne = parseInt(squares[i].innerHTML);
        let totalTwo = parseInt(squares[i + 4].innerHTML);
        let totalThree = parseInt(squares[i + 4 * 2].innerHTML);
        let totalFour = parseInt(squares[i + 4 * 3].innerHTML);
        let column = [totalOne, totalTwo, totalThree, totalFour];
  
        let filteredColumn = column.filter(x => x != 0);
        let missing = 4 - filteredColumn.length;
        let zeros = Array(missing).fill(0);
        let newColumn = filteredColumn.concat(zeros);
  
        squares[i].innerHTML = newColumn[0];
        squares[i + 4].innerHTML = newColumn[1];
        squares[i + 4 * 2].innerHTML = newColumn[2];
        squares[i + 4 * 3].innerHTML = newColumn[3];
      }
    }
  
    function sumColumn() {
      for (let i = 0; i < 12; i++) {
        if (squares[i].innerHTML == squares[i + 4].innerHTML) {
          let combineNum = parseInt(squares[i].innerHTML) + parseInt(squares[i + 4].innerHTML);
          squares[i].innerHTML = combineNum;
          squares[i + 4].innerHTML = 0;
          score += combineNum;
          scoreDisplay.innerHTML = score;
        }
      }
      checkWin();
    }
  
    function control(event) {
      if (event.keyCode === 39) {
        keyRight();
      } else if (event.keyCode === 37) {
        keyLeft();
      } else if (event.keyCode === 38) {
        keyUp();
      } else if (event.keyCode === 40) {
        keyDown();
      }
    }
    document.addEventListener('keyup', control);
  
    function keyRight() {
      moveRight();
      sumRow();
      moveRight();
      generateTwo();
    }
  
    function keyLeft() {
      moveLeft();
      sumRow();
      moveLeft();
      generateTwo();
    }
  
    function keyDown() {
      moveDown();
      sumColumn();
      moveDown();
      generateTwo();
    }
  
    function keyUp() {
      moveUp();
      sumColumn();
      moveUp();
      generateTwo();
    }
  
    function checkWin() {
      for (let i = 0; i < 16; i++) {
        if (squares[i].innerHTML == 2048) {
          alert('Congratulations!! Refresh the page to play again.');
          document.removeEventListener('keyup', control);
        }
      }
    }
  
    function checkLose() {
      let numZeros = 0;
      for (let i = 0; i < 16; i++) {
        if (squares[i].innerHTML == 0) {
          numZeros++;
        }
      }
      if (numZeros === 0) {
        alert('Game Over!! Refresh the page to play again.');
        document.removeEventListener('keyup', control);
      }
    }
  });
  