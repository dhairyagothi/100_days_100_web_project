const gridContainer = document.getElementById('grid');

// Create 9x9 inputs
for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.oninput = (e) => {
        if (!/[1-9]/.test(e.target.value)) e.target.value = '';
    };
    gridContainer.appendChild(input);
}

function getGrid() {
    const inputs = gridContainer.getElementsByTagName('input');
    let board = [];
    for (let i = 0; i < 9; i++) {
        let row = [];
        for (let j = 0; j < 9; j++) {
            const val = inputs[i * 9 + j].value;
            row.push(val === '' ? 0 : parseInt(val));
        }
        board.push(row);
    }
    return board;
}

function setGrid(board) {
    const inputs = gridContainer.getElementsByTagName('input');
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            inputs[i * 9 + j].value = board[i][j] === 0 ? '' : board[i][j];
        }
    }
}

function isValid(board, r, c, k) {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(r / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(c / 3) + i % 3;
        if (board[r][i] == k || board[i][c] == k || board[m][n] == k) {
            return false;
        }
    }
    return true;
}

function solver(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] == 0) {
                for (let k = 1; k <= 9; k++) {
                    if (isValid(board, i, j, k)) {
                        board[i][j] = k;
                        if (solver(board)) return true;
                        board[i][j] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function solveSudoku() {
    let board = getGrid();
    if (solver(board)) {
        setGrid(board);
    } else {
        alert("No solution exists for this puzzle!");
    }
}

function clearGrid() {
    const inputs = gridContainer.getElementsByTagName('input');
    for (let input of inputs) input.value = '';
}