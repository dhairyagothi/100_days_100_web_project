document.addEventListener("DOMContentLoaded", () => {
    let leftBank = document.getElementById("left-people");
    let rightBank = document.getElementById("right-people");
    let boat = document.getElementById("boat-people");
    let message = document.getElementById("message");
    let startButton = document.getElementById("start-reset");

    let state = {
        leftMissionaries: 3,
        leftCannibals: 3,
        rightMissionaries: 0,
        rightCannibals: 0,
        boatMissionaries: 0,
        boatCannibals: 0,
        boatPosition: 'left',
        isGameOver: false,
        selectedPerson: null // Track selected person
    };

    const MAX_BOAT_CAPACITY = 2;

    const startGame = () => {
        state = {
            leftMissionaries: 3,
            leftCannibals: 3,
            rightMissionaries: 0,
            rightCannibals: 0,
            boatMissionaries: 0,
            boatCannibals: 0,
            boatPosition: 'left',
            isGameOver: false,
            selectedPerson: null
        };
        message.textContent = "Move the missionaries and cannibals to the right bank safely!";
        updateUI();
    };

    const isValidState = () => {
        if (state.leftMissionaries > 0 && 
            state.leftMissionaries < state.leftCannibals) {
            return false;
        }
        
        if (state.rightMissionaries > 0 && 
            state.rightMissionaries < state.rightCannibals) {
            return false;
        }
        
        if (state.boatMissionaries > 0 && 
            state.boatMissionaries < state.boatCannibals) {
            return false;
        }

        return true;
    };

    const updateUI = () => {
        leftBank.innerHTML = "";
        rightBank.innerHTML = "";
        boat.innerHTML = "";

        const updatePeople = (container, numMissionaries, numCannibals, isDraggable, bankPosition) => {
            for (let i = 0; i < numMissionaries; i++) {
                let person = document.createElement("div");
                person.classList.add("person", "missionary");
                if (isDraggable) {
                    person.setAttribute("draggable", "true");
                    person.dataset.type = "missionary";
                    person.dataset.bank = bankPosition;
                }
                // Add click handler
                person.addEventListener("click", () => handlePersonClick(person));
                container.appendChild(person);
            }
            for (let i = 0; i < numCannibals; i++) {
                let person = document.createElement("div");
                person.classList.add("person", "cannibal");
                if (isDraggable) {
                    person.setAttribute("draggable", "true");
                    person.dataset.type = "cannibal";
                    person.dataset.bank = bankPosition;
                }
                // Add click handler
                person.addEventListener("click", () => handlePersonClick(person));
                container.appendChild(person);
            }
        };

        const canDragFromLeft = state.boatPosition === 'left';
        const canDragFromRight = state.boatPosition === 'right';

        updatePeople(leftBank, state.leftMissionaries, state.leftCannibals, canDragFromLeft, 'left');
        updatePeople(boat, state.boatMissionaries, state.boatCannibals, true, 'boat');
        updatePeople(rightBank, state.rightMissionaries, state.rightCannibals, canDragFromRight, 'right');

        // Clear any previous selections
        clearSelectedStyles();
        
        boat.classList.remove('boat-left', 'boat-right');
        boat.classList.add(`boat-${state.boatPosition}`);

        checkGameState();
    };

    const handlePersonClick = (person) => {
        if (state.isGameOver) return;

        // If no person is selected, select this one if it's on the current boat bank
        if (!state.selectedPerson) {
            const personBank = person.dataset.bank;
            if (personBank === state.boatPosition || personBank === 'boat') {
                selectPerson(person);
            }
            return;
        }

        // If clicking the same person, deselect it
        if (state.selectedPerson === person) {
            clearSelectedStyles();
            state.selectedPerson = null;
            return;
        }

        // Handle movement based on selection
        const fromBank = state.selectedPerson.dataset.bank;
        const toBank = person.dataset.bank;
        
        // Moving to/from boat
        movePerson(fromBank, toBank, state.selectedPerson.dataset.type);
        
        // Clear selection after move
        clearSelectedStyles();
        state.selectedPerson = null;
    };

    const selectPerson = (person) => {
        clearSelectedStyles();
        person.classList.add('selected');
        state.selectedPerson = person;
    };

    const clearSelectedStyles = () => {
        document.querySelectorAll('.person').forEach(p => p.classList.remove('selected'));
    };

    const movePerson = (fromBank, toBank, personType) => {
        if (!canMove(fromBank, personType)) return;

        if (toBank === "boat" && fromBank !== "boat") {
            if ((state.boatMissionaries + state.boatCannibals) >= MAX_BOAT_CAPACITY) {
                message.textContent = "The boat is full!";
                return;
            }

            if (personType === "missionary") {
                if (fromBank === "left" && state.leftMissionaries > 0) {
                    state.leftMissionaries--;
                    state.boatMissionaries++;
                } else if (fromBank === "right" && state.rightMissionaries > 0) {
                    state.rightMissionaries--;
                    state.boatMissionaries++;
                }
            } else if (personType === "cannibal") {
                if (fromBank === "left" && state.leftCannibals > 0) {
                    state.leftCannibals--;
                    state.boatCannibals++;
                } else if (fromBank === "right" && state.rightCannibals > 0) {
                    state.rightCannibals--;
                    state.boatCannibals++;
                }
            }
        } else if (fromBank === "boat" && (toBank === "left" || toBank === "right")) {
            if (toBank !== state.boatPosition) {
                message.textContent = "Can't move to that bank! Move the boat first.";
                return;
            }

            if (personType === "missionary") {
                state.boatMissionaries--;
                if (toBank === "left") state.leftMissionaries++;
                else state.rightMissionaries++;
            } else if (personType === "cannibal") {
                state.boatCannibals--;
                if (toBank === "left") state.leftCannibals++;
                else state.rightCannibals++;
            }
        }

        updateUI();
    };

    // Keep existing drag and drop handlers...
    const onDragStart = (event) => {
        if (state.isGameOver) {
            event.preventDefault();
            return;
        }
        event.dataTransfer.setData("person", event.target.className);
    };

    const onDragOver = (event) => {
        event.preventDefault();
    };

    const onDrop = (event, bank) => {
        event.preventDefault();
        
        if (state.isGameOver) return;

        let personClass = event.dataTransfer.getData("person");
        let isMissionary = personClass.includes("missionary");
        let isCannibal = personClass.includes("cannibal");

        movePerson(
            state.boatPosition,
            bank,
            isMissionary ? "missionary" : "cannibal"
        );
    };

    const moveBoat = () => {
        if (state.isGameOver) return;
        
        if (state.boatMissionaries === 0 && state.boatCannibals === 0) {
            message.textContent = "The boat needs at least one person!";
            return;
        }

        state.boatPosition = state.boatPosition === 'left' ? 'right' : 'left';
        clearSelectedStyles();
        state.selectedPerson = null;
        message.textContent = `Boat moved to the ${state.boatPosition} bank`;
        updateUI();
    };

    // Add event listeners
    startButton.addEventListener("click", startGame);
    document.getElementById("move-boat").addEventListener("click", moveBoat);

    // Keep existing drag and drop listeners...
    leftBank.addEventListener("dragstart", onDragStart);
    rightBank.addEventListener("dragstart", onDragStart);
    boat.addEventListener("dragstart", onDragStart);

    leftBank.addEventListener("dragover", onDragOver);
    rightBank.addEventListener("dragover", onDragOver);
    boat.addEventListener("dragover", onDragOver);

    leftBank.addEventListener("drop", (e) => onDrop(e, "left"));
    rightBank.addEventListener("drop", (e) => onDrop(e, "right"));
    boat.addEventListener("drop", (e) => onDrop(e, "boat"));

    // Start the game
    startGame();
});