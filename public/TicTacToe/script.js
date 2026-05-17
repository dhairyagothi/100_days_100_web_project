document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const modal = document.getElementById('resultModal');
    const resultMessage = document.getElementById('resultMessage');
    const closeModal = document.getElementById('closeModal');
    const newGameButton = document.getElementById('newGame');
    const playerXWins = document.getElementById('playerXWins');
    const playerOWins = document.getElementById('playerOWins');
    const draws = document.getElementById('draws');
    
    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill('');
    let playerXScore = 0;
    let playerOScore = 0;
    let tieCount = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function updateScoreboard(winner) {
        if (winner === 'X') {
            playerXScore++;
            playerXWins.textContent = `Player X Wins: ${playerXScore}`;
        } else if (winner === 'O') {
            playerOScore++;
            playerOWins.textContent = `Player O Wins: ${playerOScore}`;
        } else if (winner === 'draw') {
            tieCount++;
            draws.textContent = `Draws: ${tieCount}`;
        }
    }

    function resetGameBoard() {
        boardState = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => {
            cell.textContent = '';
            cell.removeAttribute('data-mark');
            cell.classList.remove('win', 'disabled');
        });
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => boardState[index] === currentPlayer);
        });
    }

    function showResult(message) {
        resultMessage.textContent = message;
        modal.style.display = 'block';
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (boardState[index] !== '' || !gameActive) {
            return;
        }

        // Update cell
        cell.textContent = currentPlayer;
        cell.setAttribute('data-mark', currentPlayer);
        boardState[index] = currentPlayer;

        // Check win
        if (checkWin()) {
            gameActive = false;
            updateScoreboard(currentPlayer);
            showResult(`${currentPlayer} wins!`);
            
            // Optional: Highlight winning cells
            highlightWinningCells();
            return;
        }

        // Check draw
        if (boardState.every(cell => cell !== '')) {
            gameActive = false;
            updateScoreboard('draw');
            showResult('Draw!');
            return;
        }

        // Switch player
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function highlightWinningCells() {
        const winningCombo = winningConditions.find(condition => {
            return condition.every(index => boardState[index] === currentPlayer);
        });
        
        if (winningCombo) {
            winningCombo.forEach(index => {
                cells[index].classList.add('win');
            });
        }
    }

    function determineOverallWinner() {
        let winnerMessage;
        
        if (playerXScore > playerOScore) {
            winnerMessage = `🏆 Player X Wins Overall! (${playerXScore} - ${playerOScore}) 🏆`;
        } else if (playerOScore > playerXScore) {
            winnerMessage = `🏆 Player O Wins Overall! (${playerOScore} - ${playerXScore}) 🏆`;
        } else if (playerXScore === 0 && playerOScore === 0) {
            winnerMessage = 'No games played yet!';
        } else {
            winnerMessage = `🤝 It's a Tie! (${playerXScore} - ${playerOScore}) 🤝`;
        }
        
        alert(winnerMessage);
    }

    // Event Listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        resetGameBoard();
    });
    
    newGameButton.addEventListener('click', () => {
        modal.style.display = 'none';
        resetGameBoard();
    });
    
    const resetScoreboardButton = document.getElementById('resetScoreboard');
    resetScoreboardButton.addEventListener('click', () => {
        if (playerXScore > 0 || playerOScore > 0 || tieCount > 0) {
            determineOverallWinner();
        }
        playerXScore = 0;
        playerOScore = 0;
        tieCount = 0;
        playerXWins.textContent = `Player X Wins: 0`;
        playerOWins.textContent = `Player O Wins: 0`;
        draws.textContent = `Draws: 0`;
        resetGameBoard();
    });
});