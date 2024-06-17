document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = Array.from(document.querySelectorAll('.cell'));
    const restartButton = document.getElementById('restart');
    const modal = document.getElementById('resultModal');
    const resultMessage = document.getElementById('resultMessage');
    const closeModal = document.getElementById('closeModal');
    const newGameButton = document.getElementById('newGame');
    let currentPlayer = 'X';
    let gameActive = true;
    let boardState = Array(9).fill('');

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
            showResult(`${currentPlayer} wins!`);
            return;
        }

        if (boardState.every(cell => cell !== '')) {
            gameActive = false;
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
    }

    function restartGame() {
        boardState = Array(9).fill('');
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        gameActive = true;
        modal.style.display = 'none';
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    closeModal.addEventListener('click', () => { modal.style.display = 'none'; });
    newGameButton.addEventListener('click', restartGame);

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
