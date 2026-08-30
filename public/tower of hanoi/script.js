// Game State
let towers = [[], [], []];
let numDisks = 4;
let selectedTowerIndex = null;
let moves = 0;
let gameWon = false;

// Disk colors for visual variety
const colors = [
    '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', 
    '#3498db', '#9b59b6', '#34495e', '#16a085'
];

// DOM Elements
const towerElements = document.querySelectorAll('.tower');
const moveCountEl = document.getElementById('moveCount');
const messageEl = document.getElementById('message');
const diskCountInput = document.getElementById('diskCount');
const restartBtn = document.getElementById('restartBtn');
const instructionModal = document.getElementById('instructionModal');
const startGameBtn = document.getElementById('startGameBtn');

// Initialize Game
function initGame() {
    numDisks = parseInt(diskCountInput.value);
    if (numDisks < 3) numDisks = 3;
    if (numDisks > 8) numDisks = 8;
    diskCountInput.value = numDisks;

    towers = [[], [], []];
    moves = 0;
    gameWon = false;
    selectedTowerIndex = null;
    
    moveCountEl.innerText = moves;
    messageEl.innerText = '';

    for (let i = numDisks; i > 0; i--) {
        towers[0].push(i);
    }

    render();
}

// Render the UI
function render() {
    towers.forEach((towerArray, index) => {
        const disksContainer = towerElements[index].querySelector('.disks');
        disksContainer.innerHTML = ''; 

        towerArray.forEach((diskSize, i) => {
            const disk = document.createElement('div');
            disk.classList.add('disk');
            
            const width = 30 + (diskSize * 25);
            disk.style.width = `${width}px`;
            disk.style.backgroundColor = colors[(diskSize - 1) % colors.length];

            // Setup interactivity only for the TOP disk of each tower
            if (i === towerArray.length - 1 && !gameWon) {
                // Click visual selection
                if (selectedTowerIndex === index) {
                    disk.classList.add('selected');
                }
                // Drag and Drop settings
                disk.setAttribute('draggable', 'true');
                disk.addEventListener('dragstart', handleDragStart);
                disk.addEventListener('dragend', handleDragEnd);
            }

            disksContainer.appendChild(disk);
        });
    });
}

// --- CORE MOVE LOGIC ---
function processMove(sourceIdx, targetIdx) {
    if (sourceIdx === targetIdx) return false;
    
    const sourceTower = towers[sourceIdx];
    const targetTower = towers[targetIdx];
    
    const movingDisk = sourceTower[sourceTower.length - 1];
    const topTargetDisk = targetTower.length > 0 ? targetTower[targetTower.length - 1] : Infinity;

    if (movingDisk < topTargetDisk) {
        targetTower.push(sourceTower.pop());
        moves++;
        moveCountEl.innerText = moves;
        checkWin();
        return true;
    } else {
        messageEl.style.color = '#e74c3c';
        messageEl.innerText = "Invalid Move! Larger disks cannot sit on smaller ones.";
        setTimeout(() => { if(messageEl.innerText.includes("Invalid")) messageEl.innerText = ''; }, 2000);
        return false;
    }
}

function checkWin() {
    // Win if ALL disks are on either Tower 2 (index 1) OR Tower 3 (index 2)
    if (towers[1].length === numDisks || towers[2].length === numDisks) {
        gameWon = true;
        messageEl.style.color = '#27ae60';
        messageEl.innerText = `You won in ${moves} moves!`;
    }
}

// --- CLICK TO MOVE LOGIC ---
function handleTowerClick(clickedIndex) {
    if (gameWon) return;

    if (selectedTowerIndex === null) {
        if (towers[clickedIndex].length > 0) {
            selectedTowerIndex = clickedIndex; 
            render();
        }
    } else {
        if (selectedTowerIndex !== clickedIndex) {
            processMove(selectedTowerIndex, clickedIndex);
        }
        selectedTowerIndex = null; 
        render();
    }
}

// --- DRAG AND DROP LOGIC ---
function handleDragStart(e) {
    selectedTowerIndex = null; // Clear click selections
    
    // Find which tower the dragged disk belongs to
    const towerIndex = parseInt(e.target.closest('.tower').dataset.index);
    e.dataTransfer.setData('text/plain', towerIndex);
    
    setTimeout(() => e.target.classList.add('dragging'), 0);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    towerElements.forEach(t => t.classList.remove('drag-over'));
}

function handleDragOver(e) {
    e.preventDefault(); // Must prevent default to allow dropping
    if (!gameWon) {
        e.currentTarget.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    if (gameWon) return;

    e.currentTarget.classList.remove('drag-over');
    const targetTowerIndex = parseInt(e.currentTarget.dataset.index);
    const sourceTowerIndex = parseInt(e.dataTransfer.getData('text/plain'));

    if (!isNaN(sourceTowerIndex) && sourceTowerIndex !== targetTowerIndex) {
        processMove(sourceTowerIndex, targetTowerIndex);
    }
    render();
}

// --- EVENT LISTENERS ---
towerElements.forEach(tower => {
    tower.addEventListener('click', () => handleTowerClick(parseInt(tower.dataset.index)));
    tower.addEventListener('dragover', handleDragOver);
    tower.addEventListener('dragleave', handleDragLeave);
    tower.addEventListener('drop', handleDrop);
});

restartBtn.addEventListener('click', initGame);

startGameBtn.addEventListener('click', () => {
    instructionModal.classList.add('hidden');
});

// Setup game initially (under the modal)
initGame();