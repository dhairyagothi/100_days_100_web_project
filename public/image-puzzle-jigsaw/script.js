// Game State
const gameState = {
    image: null,
    difficulty: 3,
    pieces: [],
    board: [],
    moves: 0,
    timer: 0,
    timerInterval: null,
    correctPieces: 0,
    totalPieces: 0
};

// DOM Elements
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const startGame = document.getElementById('startGame');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');
const puzzleBoard = document.getElementById('puzzleBoard');
const piecesPool = document.getElementById('piecesPool');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const progressDisplay = document.getElementById('progress');
const resetGame = document.getElementById('resetGame');
const newGame = document.getElementById('newGame');
const referenceImage = document.getElementById('referenceImage');
const victoryModal = document.getElementById('victoryModal');
const finalMoves = document.getElementById('finalMoves');
const finalTime = document.getElementById('finalTime');
const playAgain = document.getElementById('playAgain');

// Event Listeners
imageUpload.addEventListener('change', handleImageUpload);
startGame.addEventListener('click', initializeGame);
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        gameState.difficulty = parseInt(btn.dataset.level);
    });
});
resetGame.addEventListener('click', resetCurrentGame);
newGame.addEventListener('click', returnToSetup);
playAgain.addEventListener('click', returnToSetup);

// Handle window resize for responsive puzzle board
let resizeTimeout;
window.addEventListener('resize', () => {
    if (gameState.image && !setupScreen.classList.contains('hidden')) {
        return; // Don't resize during setup
    }
    if (gameState.image && setupScreen.classList.contains('hidden')) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Save current state
            const currentBoard = gameState.board.map(slot => ({
                row: slot.row,
                col: slot.col,
                pieceIndex: slot.piece ? slot.piece.index : null
            }));
            
            // Recreate puzzle with new size
            createPuzzle();
            
            // Restore pieces to their positions
            currentBoard.forEach(savedSlot => {
                if (savedSlot.pieceIndex !== null) {
                    const piece = gameState.pieces.find(p => p.index === savedSlot.pieceIndex);
                    const slot = gameState.board.find(s => s.row === savedSlot.row && s.col === savedSlot.col);
                    
                    if (piece && slot) {
                        slot.element.innerHTML = '';
                        slot.element.appendChild(piece.element);
                        piece.element.classList.add('placed');
                        slot.piece = piece;
                        
                        // Check if correct
                        if (piece.correctRow === slot.row && piece.correctCol === slot.col) {
                            slot.element.classList.add('correct');
                        }
                    }
                }
            });
            
            updateDisplay();
        }, 250);
    }
});

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                gameState.image = img;
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                startGame.disabled = false;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Initialize Game
function initializeGame() {
    if (!gameState.image) return;

    // Reset game state
    gameState.moves = 0;
    gameState.timer = 0;
    gameState.correctPieces = 0;
    gameState.totalPieces = gameState.difficulty * gameState.difficulty;
    
    // Clear intervals
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // Setup UI
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    referenceImage.src = gameState.image.src;
    
    // Create puzzle
    createPuzzle();
    
    // Start timer
    startTimer();
    
    // Update displays
    updateDisplay();
}

// Create Puzzle
function createPuzzle() {
    const difficulty = gameState.difficulty;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size (square) - responsive to screen size
    const maxSize = Math.min(
        window.innerWidth - 60,  // Account for padding
        window.innerHeight - 300, // Account for header and controls
        600 // Max size on desktop
    );
    const size = Math.max(250, maxSize); // Minimum 250px
    canvas.width = size;
    canvas.height = size;
    
    // Draw image on canvas (centered and cropped)
    const img = gameState.image;
    const scale = Math.max(size / img.width, size / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const offsetX = (size - scaledWidth) / 2;
    const offsetY = (size - scaledHeight) / 2;
    
    ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
    
    // Create pieces
    const pieceSize = size / difficulty;
    gameState.pieces = [];
    gameState.board = [];
    
    // Setup puzzle board grid
    puzzleBoard.style.gridTemplateColumns = `repeat(${difficulty}, ${pieceSize}px)`;
    puzzleBoard.style.gridTemplateRows = `repeat(${difficulty}, ${pieceSize}px)`;
    puzzleBoard.innerHTML = '';
    piecesPool.innerHTML = '';
    
    // Create pieces and slots
    for (let row = 0; row < difficulty; row++) {
        for (let col = 0; col < difficulty; col++) {
            const index = row * difficulty + col;
            
            // Create piece canvas
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = pieceSize;
            pieceCanvas.height = pieceSize;
            const pieceCtx = pieceCanvas.getContext('2d');
            
            // Draw piece
            pieceCtx.drawImage(
                canvas,
                col * pieceSize, row * pieceSize, pieceSize, pieceSize,
                0, 0, pieceSize, pieceSize
            );
            
            // Create piece element
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.style.backgroundImage = `url(${pieceCanvas.toDataURL()})`;
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;
            piece.dataset.index = index;
            piece.dataset.row = row;
            piece.dataset.col = col;
            piece.draggable = true;
            
            // Drag events
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragend', handleDragEnd);
            
            gameState.pieces.push({
                element: piece,
                correctRow: row,
                correctCol: col,
                index: index
            });
            
            // Create slot
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.row = row;
            slot.dataset.col = col;
            slot.style.width = `${pieceSize}px`;
            slot.style.height = `${pieceSize}px`;
            
            // Drop events
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDrop);
            
            gameState.board.push({
                element: slot,
                row: row,
                col: col,
                piece: null
            });
            
            puzzleBoard.appendChild(slot);
        }
    }
    
    // Shuffle and add pieces to pool
    shuffleArray(gameState.pieces);
    gameState.pieces.forEach(piece => {
        piecesPool.appendChild(piece.element);
    });
}

// Drag and Drop Handlers
let draggedPiece = null;

function handleDragStart(e) {
    draggedPiece = e.target;
    e.target.style.opacity = '0.5';
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const slot = e.currentTarget;
    slot.classList.remove('drag-over');
    
    if (!draggedPiece) return;
    
    const slotRow = parseInt(slot.dataset.row);
    const slotCol = parseInt(slot.dataset.col);
    const pieceRow = parseInt(draggedPiece.dataset.row);
    const pieceCol = parseInt(draggedPiece.dataset.col);
    
    // Find slot in board
    const boardSlot = gameState.board.find(s => s.row === slotRow && s.col === slotCol);
    
    // Track if the piece was previously placed on the board
    const wasPreviouslyCorrect = draggedPiece.parentElement.classList.contains('correct');
    const previousParent = draggedPiece.parentElement;
    
    // If piece is being moved from another slot, clear that slot
    if (previousParent.classList.contains('puzzle-slot')) {
        const prevSlot = gameState.board.find(s => s.element === previousParent);
        if (prevSlot && prevSlot.piece) {
            // Decrement correct pieces if it was in correct position
            if (prevSlot.piece.correctRow === prevSlot.row && prevSlot.piece.correctCol === prevSlot.col) {
                gameState.correctPieces--;
            }
            prevSlot.piece = null;
            previousParent.classList.remove('correct');
        }
    }
    
    // If slot already has a piece, swap them
    if (boardSlot.piece) {
        const existingPiece = boardSlot.piece.element;
        
        // If dragged piece came from board, swap positions
        if (previousParent.classList.contains('puzzle-slot')) {
            previousParent.innerHTML = '';
            previousParent.appendChild(existingPiece);
            
            // Update previous slot's piece
            const prevSlot = gameState.board.find(s => s.element === previousParent);
            const existingPieceData = gameState.pieces.find(p => p.element === existingPiece);
            prevSlot.piece = existingPieceData;
            
            // Check if existing piece is correct in new position
            if (existingPieceData.correctRow === prevSlot.row && existingPieceData.correctCol === prevSlot.col) {
                previousParent.classList.add('correct');
                gameState.correctPieces++;
            }
        } else {
            // If dragged piece came from pool, send existing piece to pool
            piecesPool.appendChild(existingPiece);
            existingPiece.classList.remove('placed');
            
            // Decrement correct pieces if existing piece was correct
            if (boardSlot.piece.correctRow === slotRow && boardSlot.piece.correctCol === slotCol) {
                gameState.correctPieces--;
            }
        }
        boardSlot.piece = null;
        slot.classList.remove('correct');
    }
    
    // Place piece in slot
    slot.innerHTML = '';
    slot.appendChild(draggedPiece);
    draggedPiece.classList.add('placed');
    
    // Update board state
    const pieceData = gameState.pieces.find(p => p.element === draggedPiece);
    boardSlot.piece = pieceData;
    
    // Increment moves
    gameState.moves++;
    
    // Check if correct
    if (pieceRow === slotRow && pieceCol === slotCol) {
        slot.classList.add('correct');
        // Keep piece draggable so user can still move it
        gameState.correctPieces++;
        
        // Check for victory
        if (gameState.correctPieces === gameState.totalPieces) {
            setTimeout(showVictory, 500);
        }
    } else {
        slot.classList.remove('correct');
    }
    
    updateDisplay();
    draggedPiece = null;
}

// Timer Functions
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        updateDisplay();
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Update Display
function updateDisplay() {
    movesDisplay.textContent = gameState.moves;
    timerDisplay.textContent = formatTime(gameState.timer);
    const progress = Math.round((gameState.correctPieces / gameState.totalPieces) * 100);
    progressDisplay.textContent = `${progress}%`;
}

// Reset Current Game
function resetCurrentGame() {
    // Clear board
    gameState.board.forEach(slot => {
        if (slot.piece) {
            const piece = slot.piece.element;
            piece.classList.remove('placed');
            piece.draggable = true;
            piecesPool.appendChild(piece);
            slot.element.innerHTML = '';
            slot.element.classList.remove('correct');
            slot.piece = null;
        }
    });
    
    // Shuffle pieces
    shuffleArray(gameState.pieces);
    piecesPool.innerHTML = '';
    gameState.pieces.forEach(piece => {
        piecesPool.appendChild(piece.element);
    });
    
    // Reset counters
    gameState.moves = 0;
    gameState.correctPieces = 0;
    gameState.timer = 0;
    
    // Clear and restart timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    startTimer();
    
    updateDisplay();
}

// Return to Setup
function returnToSetup() {
    // Clear timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Hide modals and game screen
    victoryModal.classList.add('hidden');
    gameScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
    
    // Reset image
    imagePreview.innerHTML = '';
    imageUpload.value = '';
    startGame.disabled = true;
    gameState.image = null;
}

// Show Victory
function showVictory() {
    clearInterval(gameState.timerInterval);
    finalMoves.textContent = gameState.moves;
    finalTime.textContent = formatTime(gameState.timer);
    victoryModal.classList.remove('hidden');
}

// Utility: Shuffle Array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}