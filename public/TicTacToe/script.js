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
        } else {
            tieCount++;
            draws.textContent = `Draws: ${tieCount}`;
        }
    }

    function handleCellClick(e) {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (boardState[index] !== '' || !gameActive) {
            return;
        }

        cell.textContent = currentPlayer;
        boardState[index] = currentPlayer;

        if (checkWin()) {
            gameActive = false;
            updateScoreboard(currentPlayer); // Update scoreboard based on winner
            showResult(`${currentPlayer} wins!`);
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            gameActive = false;
            updateScoreboard('draw'); // Update scoreboard for a draw
            showResult('Draw!');
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => boardState[index] === currentPlayer);
        });
    }

    function showResult(message) {
        resultMessage.textContent = message;
        modal.style.display = 'block';

        // Reset game state after displaying result
        boardState = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => cell.textContent = '');
    }

    function determineOverallWinner() {
        let winnerMessage;

        if (playerXScore > playerOScore) {
            winnerMessage = 'Player X Wins Overall!';
        } else if (playerOScore > playerXScore) {
            winnerMessage = 'Player O Wins Overall!';
        } else if (playerXScore === playerOScore && (playerXScore > 0 || playerOScore > 0)) {
            winnerMessage = 'It\'s a Tie between Player X and Player O!';
        } else {
            winnerMessage = 'It\'s a Draw Overall!';
        }

        alert(winnerMessage); // Show pop-up message with overall winner
    }

    // Event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    newGameButton.addEventListener('click', () => {
        modal.style.display = 'none';
        // Reset game state for a new game
        boardState = Array(9).fill('');
        currentPlayer = 'X';
        gameActive = true;
        cells.forEach(cell => cell.textContent = '');
    });

    const resetScoreboardButton = document.getElementById('resetScoreboard');
    resetScoreboardButton.addEventListener('click', () => {
        determineOverallWinner(); // Determine and show the overall winner before resetting
        playerXScore = 0;
        playerOScore = 0;
        tieCount = 0;

        // Update scoreboard elements directly after clicking "Reset Scoreboard"
        playerXWins.textContent = `Player X Wins: ${playerXScore}`;
        playerOWins.textContent = `Player O Wins: ${playerOScore}`;
        draws.textContent = `Draws: ${tieCount}`;
    });
});
