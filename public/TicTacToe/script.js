document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const modal = document.getElementById('resultModal');
    const resultMessage = document.getElementById('resultMessage');
    const closeModal = document.getElementById('closeModal');
    const newGameButton = document.getElementById('newGame');
    const restartGameButton = document.getElementById('restartGame');
    const playerXWins = document.getElementById('playerXWins');
    const playerOWins = document.getElementById('playerOWins');
    const draws = document.getElementById('draws');
    const themeToggle = document.getElementById('themeToggle');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const moveSound = document.getElementById('moveSound');
    const winSound = document.getElementById('winSound');

    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill('');
    let playerXScore = 0;
    let playerOScore = 0;
    let tieCount = 0;
    let gameMode = 'pvp'; // pvp, easy, hard
    let aiPlayer = false;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Dark mode toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Load dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Game mode selection
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameMode = btn.dataset.mode;
            aiPlayer = gameMode !== 'pvp';
            restartGame();
        });
    });

    function updateScoreboard(winner) {
        if (winner === 'X') {
            playerXScore++;
            playerXWins.textContent = `Player X Wins: ${playerXScore}`;
        } else if (winner === 'O') {
            playerOScore++;
            playerOWins.textContent = `Player O Wins: ${playerOScore}`;
        } else {
            tieCount++;
            draws.textContent = `Draws: ${tieCount}`;
        }
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {}); // Suppress autoplay errors
    }

    function checkWin(player = null) {
        const playerToCheck = player || currentPlayer;
        return winningConditions.some(condition => 
            condition.every(index => boardState[index] === playerToCheck)
        );
    }

    function getEmptyCells() {
        return boardState.map((cell, idx) => cell === '' ? idx : null).filter(idx => idx !== null);
    }

    function evaluateBoard(depth = 0) {
        if (checkWin('O')) return 10 - depth;
        if (checkWin('X')) return depth - 10;
        if (getEmptyCells().length === 0) return 0;
        return null;
    }

    function minimax(depth = 0, isMaximizing = true) {
        const score = evaluateBoard(depth);
        if (score !== null) return score;

        if (isMaximizing) {
            let bestScore = -Infinity;
            getEmptyCells().forEach(idx => {
                boardState[idx] = 'O';
                bestScore = Math.max(bestScore, minimax(depth + 1, false));
                boardState[idx] = '';
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            getEmptyCells().forEach(idx => {
                boardState[idx] = 'X';
                bestScore = Math.min(bestScore, minimax(depth + 1, true));
                boardState[idx] = '';
            });
            return bestScore;
        }
    }

    function getAIMove() {
        const empty = getEmptyCells();
        
        if (gameMode === 'easy') {
            return empty[Math.floor(Math.random() * empty.length)];
        }

        let bestScore = -Infinity;
        let bestMove = empty[0];

        empty.forEach(idx => {
            boardState[idx] = 'O';
            const score = minimax(0, false);
            boardState[idx] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = idx;
            }
        });

        return bestMove;
    }

    function makeAIMove() {
        if (!aiPlayer || gameActive === false || currentPlayer !== 'O') return;

        setTimeout(() => {
            const aiMove = getAIMove();
            const cell = cells[aiMove];
            cell.textContent = 'O';
            boardState[aiMove] = 'O';
            cell.classList.add('placing');

            playSound(moveSound);

            if (checkWin()) {
                gameActive = false;
                updateScoreboard('O');
                playSound(winSound);
                showResult('🤖 AI Wins!');
                return;
            }

            if (boardState.every(cell => cell !== '')) {
                gameActive = false;
                updateScoreboard('draw');
                showResult("It's a Draw! 🤝");
                return;
            }

            currentPlayer = 'X';
        }, 500);
    }

    function handleCellClick(e) {
        const cell = e.target;
        if (cell.classList.length < 1) return; // Not a cell
        
        const index = parseInt(cell.getAttribute('data-index'));

        if (boardState[index] !== '' || !gameActive) return;
        if (aiPlayer && currentPlayer !== 'X') return;

        cell.textContent = 'X';
        boardState[index] = 'X';
        cell.classList.add('placing');

        playSound(moveSound);

        if (checkWin()) {
            gameActive = false;
            updateScoreboard('X');
            playSound(winSound);
            showResult('🎉 You Win!');
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            gameActive = false;
            updateScoreboard('draw');
            showResult("It's a Draw! 🤝");
            return;
        }

        currentPlayer = 'O';

        if (aiPlayer) {
            makeAIMove();
        }
    }

    function showResult(message) {
        resultMessage.textContent = message;
        modal.style.display = 'block';
        boardState = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('placing');
        });
    }

    function restartGame() {
        boardState = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('placing');
        });
        modal.style.display = 'none';
    }

    function determineOverallWinner() {
        let winnerMessage;
        if (playerXScore > playerOScore) {
            winnerMessage = 'Player X Wins Overall! 🏆';
        } else if (playerOScore > playerXScore) {
            winnerMessage = 'Player O Wins Overall! 🏆';
        } else if (playerXScore === playerOScore && (playerXScore > 0 || playerOScore > 0)) {
            winnerMessage = "It's a Tie between X and O! 🤝";
        } else {
            winnerMessage = "No games played yet!";
        }
        alert(winnerMessage);
    }

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    newGameButton.addEventListener('click', () => {
        modal.style.display = 'none';
        boardState = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('placing');
        });
    });

    restartGameButton.addEventListener('click', restartGame);

    const resetScoreboardButton = document.getElementById('resetScoreboard');
    resetScoreboardButton.addEventListener('click', () => {
        determineOverallWinner();
        playerXScore = 0;
        playerOScore = 0;
        tieCount = 0;
        playerXWins.textContent = `Player X Wins: 0`;
        playerOWins.textContent = `Player O Wins: 0`;
        draws.textContent = `Draws: 0`;
    });
});
