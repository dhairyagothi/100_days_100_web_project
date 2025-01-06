let state = {
    left: { missionaries: 3, cannibals: 3 },
    right: { missionaries: 0, cannibals: 0 },
    boat: { missionaries: 0, cannibals: 0, onLeft: true }
};

function updateUI() {
    const leftMissionaries = document.getElementById('left-missionaries');
    const leftCannibals = document.getElementById('left-cannibals');
    const rightMissionaries = document.getElementById('right-missionaries');
    const rightCannibals = document.getElementById('right-cannibals');
    const boat = document.getElementById('boat');

    leftMissionaries.innerHTML = createPeople('missionary', state.left.missionaries, 'left');
    leftCannibals.innerHTML = createPeople('cannibal', state.left.cannibals, 'left');
    rightMissionaries.innerHTML = createPeople('missionary', state.right.missionaries, 'right');
    rightCannibals.innerHTML = createPeople('cannibal', state.right.cannibals, 'right');
    boat.innerHTML = createPeople('missionary', state.boat.missionaries, 'boat') + createPeople('cannibal', state.boat.cannibals, 'boat');

    boat.style.left = state.boat.onLeft ? '20%' : '70%';
}

function createPeople(type, count, location) {
    let people = '';
    for (let i = 0; i < count; i++) {
        const id = `${location}-${type}-${i}`;
        people += `<div class="person ${type}" id="${id}" onclick="movePerson('${id}')">${type.charAt(0).toUpperCase()}</div>`;
    }
    return people;
}

function movePerson(id) {
    const [location, type] = id.split('-');
    if (location === 'boat') {
        const to = state.boat.onLeft ? state.left : state.right;
        if (type === 'missionary' && state.boat.missionaries > 0) {
            state.boat.missionaries--;
            to.missionaries++;
        } else if (type === 'cannibal' && state.boat.cannibals > 0) {
            state.boat.cannibals--;
            to.cannibals++;
        }
    } else {
        const from = state.boat.onLeft ? state.left : state.right;
        if (type === 'missionary' && from.missionaries > 0 && state.boat.missionaries + state.boat.cannibals < 2) {
            from.missionaries--;
            state.boat.missionaries++;
        } else if (type === 'cannibal' && from.cannibals > 0 && state.boat.missionaries + state.boat.cannibals < 2) {
            from.cannibals--;
            state.boat.cannibals++;
        }
    }
    checkStatus();
    updateUI();
}

function moveBoat() {
    if (state.boat.missionaries + state.boat.cannibals > 0) {
        state.boat.onLeft = !state.boat.onLeft;
        checkStatus();
        updateUI();
    } else {
        alert('Boat is empty!');
    }
}

function checkStatus() {
    const message = document.getElementById('message');
    if ((state.left.missionaries > 0 && state.left.missionaries < state.left.cannibals) || 
        (state.right.missionaries > 0 && state.right.missionaries < state.right.cannibals)) {
        alert('Game Over! Cannibals ate the missionaries.');
        resetGame();
    } else if (state.right.missionaries === 3 && state.right.cannibals === 3) {
        message.textContent = 'You Won the Game!';
    }
}

function resetGame() {
    state = {
        left: { missionaries: 3, cannibals: 3 },
        right: { missionaries: 0, cannibals: 0 },
        boat: { missionaries: 0, cannibals: 0, onLeft: true }
    };
    document.getElementById('message').textContent = '';
    updateUI();
}

window.onload = resetGame;

