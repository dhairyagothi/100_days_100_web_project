const columns = ['A', 'B', 'C', 'D', 'E'];
let bomblist = [];
let attemptlist = [];
let gameOver = false;

const boardDiv = document.getElementById('board');
const messageDiv = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// Generate 4 unique random bomb coordinates
function generateBombs() {
    bomblist = [];
    while (bomblist.length < 4) {
        let randomCol = columns[Math.floor(Math.random() * 5)];
        let randomRow = Math.floor(Math.random() * 5) + 1;
        let bombCoord = `${randomCol} ${randomRow}`;
        
        if (!bomblist.includes(bombCoord)) {
            bomblist.push(bombCoord);
        }
    }
}

// Find neighbors matching Python algorithm logic
function getNeighbours(coord) {
    let parts = coord.split(' ');
    let colIndex = columns.indexOf(parts[0]);
    let rowIndex = parseInt(parts[1]);

    let validCols = [colIndex - 1, colIndex + 1, colIndex].filter(c => c >= 0 && c < 5);
    let validRows = [rowIndex - 1, rowIndex + 1, rowIndex].filter(r => r >= 1 && r <= 5);

    let neighbours = [];
    for (let c of validCols) {
        for (let r of validRows) {
            neighbours.push(`${columns[c]} ${r}`);
        }
    }
    
    let selfIndex = neighbours.indexOf(coord);
    if (selfIndex !== -1) {
        neighbours.splice(selfIndex, 1);
    }
    return neighbours;
}

// Count surrounding bombs
function getBombCount(coord) {
    if (bomblist.includes(coord)) return '*';
    
    let neighbours = getNeighbours(coord);
    let count = 0;
    for (let n of neighbours) {
        if (bomblist.includes(n)) {
            count++;
        }
    }
    return count;
}

// Handle square click interaction
function handleCellClick(coord) {
    if (gameOver || attemptlist.includes(coord)) return;

    let cellElement = document.getElementById(coord);
    cellElement.classList.add('revealed');

    if (bomblist.includes(coord)) {
        gameOver = true;
        messageDiv.innerText = 'YOU LOST :(';
        messageDiv.style.color = '#ff4d4d';
        revealAllBombs();
        restartBtn.style.display = 'inline-block';
    } else {
        attemptlist.push(coord);
        let count = getBombCount(coord);
        cellElement.innerText = count === 0 ? '' : count;
        
        if (attemptlist.length === 21) {
            gameOver = true;
            messageDiv.innerText = 'YOU WIN!!!!';
            messageDiv.style.color = '#28a745';
            revealAllBombs();
            restartBtn.style.display = 'inline-block';
        }
    }
}

// Reveal all hidden bombs at game over
function revealAllBombs() {
    for (let bomb of bomblist) {
        let cellElement = document.getElementById(bomb);
        cellElement.classList.add('revealed', 'bomb');
        cellElement.innerText = '*';
    }
}

// Initialize board and reset game variables
function initGame() {
    bomblist = [];
    attemptlist = [];
    gameOver = false;
    messageDiv.innerText = '';
    restartBtn.style.display = 'none';
    boardDiv.innerHTML = ''; 

    generateBombs();

    // Create top row column headers
    let cornerSpace = document.createElement('div');
    boardDiv.appendChild(cornerSpace);
    for (let c of columns) {
        let label = document.createElement('div');
        label.className = 'label';
        label.innerText = c;
        boardDiv.appendChild(label);
    }

    // Create grid layout with buttons
    for (let r = 1; r <= 5; r++) {
        let rowLabel = document.createElement('div');
        rowLabel.className = 'label';
        rowLabel.innerText = r;
        boardDiv.appendChild(rowLabel);

        for (let c = 0; c < 5; c++) {
            let coord = `${columns[c]} ${r}`;
            let btn = document.createElement('button');
            btn.className = 'cell';
            btn.id = coord;
            btn.addEventListener('click', () => handleCellClick(coord));
            boardDiv.appendChild(btn);
        }
    }
}

// Attach restart listener and start game
restartBtn.addEventListener('click', initGame);
initGame();
