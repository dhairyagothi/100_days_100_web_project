// Initial state of the game
let state = {
    left: { missionaries: 3, cannibals: 3 },
    right: { missionaries: 0, cannibals: 0 },
    boat: { missionaries: 0, cannibals: 0, onLeft: true }
};

let moves = 0; // Move counter

// Update UI to reflect the current state
function updateUI() {
    const leftMissionaries = document.getElementById('left-missionaries');
    const leftCannibals = document.getElementById('left-cannibals');
    const rightMissionaries = document.getElementById('right-missionaries');
    const rightCannibals = document.getElementById('right-cannibals');
    const boat = document.getElementById('boat');
    const message = document.getElementById('message');
    const moveCount = document.getElementById('move-count');

    // Populate each section with the correct number of people
    leftMissionaries.innerHTML = createPeople('missionary', state.left.missionaries, 'left');
    leftCannibals.innerHTML = createPeople('cannibal', state.left.cannibals, 'left');
    rightMissionaries.innerHTML = createPeople('missionary', state.right.missionaries, 'right');
    rightCannibals.innerHTML = createPeople('cannibal', state.right.cannibals, 'right');
    boat.innerHTML = createPeople('missionary', state.boat.missionaries, 'boat') + 
                     createPeople('cannibal', state.boat.cannibals, 'boat');

    // Position the boat based on its side
    boat.style.left = state.boat.onLeft ? '20%' : '70%';

    // Display the move count
    moveCount.textContent = `Moves: ${moves}`;

    // Check game status for win/loss
    if (checkWin()) {
        message.textContent = 'Congratulations! You won!';
        disableControls();
    } else if (checkLoss()) {
        message.textContent = 'Game Over! The missionaries were eaten!';
        disableControls();
    } else {
        message.textContent = '';
    }
}

// Generate the visual representation of people
function createPeople(type, count, location) {
    let people = '';
    for (let i = 0; i < count; i++) {
        const id = `${location}-${type}-${i}`;
        people += `<div class="person ${type}" id="${id}" onclick="movePerson('${id}')">${type.charAt(0).toUpperCase()}</div>`;
    }
    return people;
}

// Handle moving a person into or out of the boat
function movePerson(id) {
    const [location, type] = id.split('-');

    if (location === 'boat') {
        // Moving from boat to bank
        const to = state.boat.onLeft ? state.left : state.right;
        if (type === 'missionary' && state.boat.missionaries > 0) {
            state.boat.missionaries--;
            to.missionaries++;
        } else if (type === 'cannibal' && state.boat.cannibals > 0) {
            state.boat.cannibals--;
            to.cannibals++;
        }
    } else {
        // Moving from bank to boat
        const from = state.boat.onLeft ? state.left : state.right;
        if (type === 'missionary' && from.missionaries > 0 && state.boat.missionaries + state.boat.cannibals < 2) {
            from.missionaries--;
            state.boat.missionaries++;
        } else if (type === 'cannibal' && from.cannibals > 0 && state.boat.missionaries + state.boat.cannibals < 2) {
            from.cannibals--;
            state.boat.cannibals++;
        }
    }
    updateUI();
}

// Move the boat to the opposite bank
function moveBoat() {
    if (state.boat.missionaries + state.boat.cannibals > 0) {
        moves++;
        state.boat.onLeft = !state.boat.onLeft;
        const from = state.boat.onLeft ? state.right : state.left;
        const to = state.boat.onLeft ? state.left : state.right;

        // Transfer people from the boat to the other side
        to.missionaries += state.boat.missionaries;
        to.cannibals += state.boat.cannibals;
        state.boat.missionaries = 0;
        state.boat.cannibals = 0;

        updateUI();
    }
}

// Check if the player has won
function checkWin() {
    return state.right.missionaries === 3 && state.right.cannibals === 3;
}

// Check if the player has lost
function checkLoss() {
    // Check left bank
    if ((state.left.cannibals > state.left.missionaries && state.left.missionaries > 0) ||
        (state.right.cannibals > state.right.missionaries && state.right.missionaries > 0)) {
        return true;
    }
    return false;
}

// Reset the game
function resetGame() {
    moves = 0;
    state = {
        left: { missionaries: 3, cannibals: 3 },
        right: { missionaries: 0, cannibals: 0 },
        boat: { missionaries: 0, cannibals: 0, onLeft: true }
    };
    enableControls();
    updateUI();
}

// Disable controls after win/loss
function disableControls() {
    document.querySelectorAll('button').forEach(button => button.disabled = true);
}

// Enable controls for reset
function enableControls() {
    document.querySelectorAll('button').forEach(button => button.disabled = false);
}

// Initialize UI
updateUI();
