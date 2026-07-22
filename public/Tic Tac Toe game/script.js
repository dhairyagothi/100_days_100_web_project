// ==========================================
// STATE & CONFIG
// ==========================================
const DOM = {
    screens: {
        menu: document.getElementById('menuScreen'),
        game: document.getElementById('gameScreen')
    },
    buttons: {
        start: document.getElementById('btnStart'),
        back: document.getElementById('btnBack'),
        reset: document.getElementById('btnReset'),
        playAgain: document.getElementById('btnPlayAgain')
    },
    board: document.querySelectorAll('.cell'),
    turnText: document.getElementById('turnText'),
    modal: document.getElementById('resultModal'),
    resultTitle: document.getElementById('resultTitle'),
    resultMessage: document.getElementById('resultMessage'),
    scores: {
        X: document.getElementById('scoreX'),
        O: document.getElementById('scoreO')
    }
};

const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

let state = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    isGameActive: false,
    scores: { X: 0, O: 0 }
};

// ==========================================
// EVENT LISTENERS
// ==========================================
DOM.buttons.start.addEventListener('click', startGame);
DOM.buttons.back.addEventListener('click', backToMenu);
DOM.buttons.reset.addEventListener('click', resetBoard);
DOM.buttons.playAgain.addEventListener('click', () => {
    DOM.modal.classList.add('hidden');
    resetBoard();
});

DOM.board.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

// ==========================================
// GAME FLOW CONTROLS
// ==========================================
function startGame() {
    state.scores = { X: 0, O: 0 };
    updateScores();
    switchScreen('game');
    resetBoard();
}

function switchScreen(screenName) {
    DOM.screens.menu.classList.remove('active');
    DOM.screens.game.classList.remove('active');
    DOM.screens[screenName].classList.add('active');
}

function backToMenu() {
    state.isGameActive = false;
    switchScreen('menu');
}

function resetBoard() {
    state.board = Array(9).fill('');
    state.currentPlayer = 'X';
    state.isGameActive = true;
    
    DOM.board.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell'; // reset classes
    });
    
    updateTurnIndicator();
}

function handleCellClick(cell) {
    const index = cell.getAttribute('data-index');

    // Reject click if cell is full, game is over, or it's the bot's turn
    if (state.board[index] !== '' || !state.isGameActive || state.currentPlayer === 'O') return;

    placeMark(index, 'X');
}

function placeMark(index, player) {
    state.board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    
    cell.textContent = player;
    cell.classList.add(player.toLowerCase()); // Adds .x or .o

    if (checkWin(player)) {
        endGame(false, player);
    } else if (isDraw()) {
        endGame(true);
    } else {
        // Swap turn
        state.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';
        updateTurnIndicator();
        
        // Trigger bot if it's O's turn
        if (state.currentPlayer === 'O' && state.isGameActive) {
            setTimeout(makeBotMove, 600); // 600ms delay for realism
        }
    }
}

function updateTurnIndicator() {
    if (state.currentPlayer === 'X') {
        DOM.turnText.textContent = "Your Turn";
        DOM.turnText.className = "x-text";
    } else {
        DOM.turnText.textContent = "Bot is thinking...";
        DOM.turnText.className = "o-text";
    }
}

// ==========================================
// WIN LOGIC & MODALS
// ==========================================
function checkWin(player, boardToCheck = state.board) {
    return WINNING_COMBOS.some(combo => {
        return combo.every(index => boardToCheck[index] === player);
    });
}

function isDraw(boardToCheck = state.board) {
    return boardToCheck.every(cell => cell !== '');
}

function endGame(draw, winner = null) {
    state.isGameActive = false;
    
    if (draw) {
        DOM.resultTitle.textContent = "It's a Draw!";
        DOM.resultTitle.style.color = "var(--text-main)";
        DOM.resultMessage.textContent = "You survived the AI... this time.";
    } else {
        DOM.resultTitle.textContent = winner === 'X' ? 'You Win!' : 'Bot Wins!';
        DOM.resultTitle.style.color = winner === 'X' ? 'var(--color-x)' : 'var(--color-o)';
        
        if (winner === 'O') {
            DOM.resultMessage.textContent = "The Bot's Minimax algorithm prevails.";
        } else {
            DOM.resultMessage.textContent = "Wait... how did you beat the unbreakable math?!"; 
            // Note: Minimax is mathematically unbeatable. The user will only ever draw or lose.
        }
        
        state.scores[winner]++;
        updateScores();
    }
    
    setTimeout(() => {
        DOM.modal.classList.remove('hidden');
    }, 500); 
}

function updateScores() {
    DOM.scores.X.textContent = state.scores.X;
    DOM.scores.O.textContent = state.scores.O;
}

// ==========================================
// UNBEATABLE AI (MINIMAX)
// ==========================================
function makeBotMove() {
    let bestScore = -Infinity;
    let move;

    // Evaluate the board on first move to save computing time
    // If board is empty (unlikely since X goes first, but just in case), take the center
    const emptySpots = state.board.filter(s => s === '').length;
    if (emptySpots === 9) {
        move = 4; // Center
    } else if (emptySpots === 8 && state.board[4] === '') {
        move = 4; // Always take center if X didn't
    } else {
        // Run full Minimax
        for (let i = 0; i < state.board.length; i++) {
            if (state.board[i] === '') {
                state.board[i] = 'O'; 
                let score = minimax(state.board, 0, false);
                state.board[i] = '';  
                
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
    }
    
    // Play the calculated best move
    placeMark(move, 'O');
}

const minMaxScores = {
    O: 10,
    X: -10,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    if (checkWin('O', board)) return minMaxScores.O - depth; 
    if (checkWin('X', board)) return minMaxScores.X + depth; 
    if (isDraw(board)) return minMaxScores.tie;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}