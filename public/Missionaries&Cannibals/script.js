document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("instructions-modal");
    const closeModal = document.getElementById("close-modal");
    const instructionsBtn = document.getElementById("instructions-btn");
    
    // Results Modal Elements
    const resultsModal = document.getElementById("results-modal");
    const resultTitle = document.getElementById("result-title");
    const resultMessage = document.getElementById("result-message");
    const finalMoveCount = document.getElementById("final-move-count");
    const restartBtn = document.getElementById("restart-btn");

    let leftBank = document.getElementById("left-people");
    let rightBank = document.getElementById("right-people");
    let boat = document.getElementById("boat-people");
    let message = document.getElementById("message");
    let guidance = document.getElementById("guidance");
    let moveCountDisplay = document.getElementById("move-count");
    let startButton = document.getElementById("start-reset");
    let moveBoatButton = document.getElementById("move-boat");
    let boatElement = document.getElementById("boat");

    let state = {
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

    const MAX_BOAT_CAPACITY = 2;

    // Helper: Update status message with specific style
    const updateStatus = (msg, type = "") => {
        message.textContent = msg;
        message.className = type; // success, warning, error, victory
    };

    const showResults = (isWin) => {
        resultsModal.classList.add("show");
        resultsModal.classList.remove("win", "loss");
        resultsModal.classList.add(isWin ? "win" : "loss");
        
        finalMoveCount.textContent = state.moveCount;
        
        if (isWin) {
            resultTitle.textContent = "Victory!";
            resultMessage.textContent = "Masterfully done! You've guided everyone to safety without a single casualty.";
            restartBtn.textContent = "Play Again";
        } else {
            resultTitle.textContent = "Game Over";
            resultMessage.textContent = "Oh no! The Sheep were outnumbered. Don't give up—try a different strategy!";
            restartBtn.textContent = "Try Again";
        }
    };

    const hideResults = () => {
        resultsModal.classList.remove("show");
    };

    // Helper: Update guidance text based on state
    const updateGuidance = () => {
        if (state.isGameOver) {
            guidance.textContent = "Game ended. Click 'Start Game' to try again!";
            return;
        }

        const passengers = state.boatMissionaries + state.boatCannibals;

        if (passengers === 0) {
            guidance.textContent =
                "Select passengers and move everyone safely to the right bank.";
        } else if (passengers < MAX_BOAT_CAPACITY) {
            guidance.textContent =
                `Boat has ${passengers} passenger. Add one more or move the boat.`;
        } else {
            guidance.textContent =
                "Boat is full! Click 'Move Boat' to cross the river.";
        }
    };
    const handleHint = () => {
        if (state.hintsUsed < 3) {
            hintText.textContent = hints[state.hintsUsed];
            state.hintsUsed++;
            hintBtn.textContent = `Get Hint (${3 - state.hintsUsed} left)`;
            
            if (state.hintsUsed === 3) {
                hintBtn.disabled = true;
            }
        }
    };

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
            selectedPerson: null,
            moveCount: 0,
            hintsUsed: 0
        };
        updateStatus("Move the Sheep and Tigers to the right bank safely!", "success");
        moveCountDisplay.textContent = "0";
        hintText.textContent = "";
        hintBtn.textContent = "Get Hint (3 left)";
        hintBtn.disabled = false;
        hideResults();
        updateUI();
    };

    const canMove = (fromBank, personType) => {
        if (fromBank === 'left' && personType === 'missionary') return state.leftMissionaries > 0;
        if (fromBank === 'left' && personType === 'cannibal') return state.leftCannibals > 0;
        if (fromBank === 'right' && personType === 'missionary') return state.rightMissionaries > 0;
        if (fromBank === 'right' && personType === 'cannibal') return state.rightCannibals > 0;
        if (fromBank === 'boat' && personType === 'missionary') return state.boatMissionaries > 0;
        if (fromBank === 'boat' && personType === 'cannibal') return state.boatCannibals > 0;
        return false;
    };

    const checkGameState = () => {
        // Lose conditions on Left Bank
        if (state.leftMissionaries > 0 && state.leftMissionaries < state.leftCannibals) {
            message.textContent = "Game Over! Cannibals outnumbered Missionaries on the Left Bank ❌";
            state.isGameOver = true;
            return;
        }
        // Lose conditions on Right Bank
        if (state.rightMissionaries > 0 && state.rightMissionaries < state.rightCannibals) {
            message.textContent = "Game Over! Cannibals outnumbered Missionaries on the Right Bank ❌";
            state.isGameOver = true;
            return;
        }
        // Win condition
        if (state.rightMissionaries === 3 && state.rightCannibals === 3 && state.boatMissionaries === 0 && state.boatCannibals === 0) {
            message.textContent = "Congratulations! You safely crossed the river! 🎉";
            state.isGameOver = true;
        }
    };

    const checkGameState = () => {
        // Lose condition
        if (!isValidState()) {
            state.isGameOver = true;
            updateStatus("Game Over! Tigers outnumbered Sheep on a bank.", "error");
            showResults(false);
            return;
        }

        // Win condition
        if (
            state.rightMissionaries === 3 &&
            state.rightCannibals === 3
        ) {
            state.isGameOver = true;
            updateStatus(`Congratulations! You won in ${state.moveCount} moves!`, "victory");
            showResults(true);
        }
    };

    const updateUI = () => {
        leftBank.innerHTML = "";
        rightBank.innerHTML = "";
        boat.innerHTML = "";

        const createVisualPeople = (container, numMissionaries, numCannibals, isDraggable, bankPosition) => {
            for (let i = 0; i < numMissionaries; i++) {
                let person = document.createElement("div");
                person.classList.add("person", "missionary");
                person.textContent = "M";
                person.setAttribute("draggable", isDraggable ? "true" : "false");
                person.dataset.type = "missionary";
                person.dataset.bank = bankPosition;
                person.addEventListener("click", (e) => { e.stopPropagation(); handlePersonClick(person); });
                container.appendChild(person);
            }
            for (let i = 0; i < numCannibals; i++) {
                let person = document.createElement("div");
                person.classList.add("person", "cannibal");
                person.textContent = "C";
                person.setAttribute("draggable", isDraggable ? "true" : "false");
                person.dataset.type = "cannibal";
                person.dataset.bank = bankPosition;
                person.addEventListener("click", (e) => { e.stopPropagation(); handlePersonClick(person); });
                container.appendChild(person);
            }
        };

        const canInteractWithLeft = state.boatPosition === 'left';
        const canInteractWithRight = state.boatPosition === 'right';

        createVisualPeople(leftBank, state.leftMissionaries, state.leftCannibals, canInteractWithLeft, 'left');
        createVisualPeople(boat, state.boatMissionaries, state.boatCannibals, true, 'boat');
        createVisualPeople(rightBank, state.rightMissionaries, state.rightCannibals, canInteractWithRight, 'right');

        clearSelectedStyles();

        // Handle visual position translation of the boat within its zone
        let boatZone = document.getElementById("boat-zone");
        boatZone.style.justifyContent = state.boatPosition === 'left' ? 'flex-start' : 'flex-end';

        updateGuidance();
        checkGameState();
    };

    const handlePersonClick = (person) => {
        if (state.isGameOver) return;

        const personBank = person.dataset.bank;

        // If nothing is selected, select this element if valid
        if (!state.selectedPerson) {
            if (personBank === state.boatPosition || personBank === 'boat') {
                selectPerson(person);
            }
            return;
        }

        // Deselect if clicking the same item
        if (state.selectedPerson === person) {
            clearSelectedStyles();
            state.selectedPerson = null;
            return;
        }

        // Cross-container click shortcuts
        const fromBank = state.selectedPerson.dataset.bank;
        const toBank = personBank;
        if (fromBank !== toBank) {
            movePerson(fromBank, toBank, state.selectedPerson.dataset.type);
            clearSelectedStyles();
            state.selectedPerson = null;
        }
    };

    // Global background click targets for easier container-level selection
    const handleContainerClick = (targetBank) => {
        if (state.isGameOver || !state.selectedPerson) return;
        const fromBank = state.selectedPerson.dataset.bank;
        movePerson(fromBank, targetBank, state.selectedPerson.dataset.type);
        clearSelectedStyles();
        state.selectedPerson = null;
    };

    document.getElementById("left-bank").addEventListener("click", () => handleContainerClick("left"));
    document.getElementById("right-bank").addEventListener("click", () => handleContainerClick("right"));
    boatElement.addEventListener("click", () => handleContainerClick("boat"));

    const selectPerson = (person) => {
        clearSelectedStyles();
        person.classList.add('selected');
        state.selectedPerson = person;
    };

    const clearSelectedStyles = () => {
        document.querySelectorAll('.person').forEach(p => p.classList.remove('selected'));
    };

    const canMove = (fromBank, personType) => {
        if (state.isGameOver) return false;

        if (fromBank !== "boat" && fromBank !== state.boatPosition) {
            updateStatus("The boat is on the other side!", "warning");
            return false;
        }

        if (personType === "missionary") {
            if (
                (fromBank === "left" && state.leftMissionaries <= 0) ||
                (fromBank === "right" && state.rightMissionaries <= 0) ||
                (fromBank === "boat" && state.boatMissionaries <= 0)
            ) return false;
        }

        if (personType === "cannibal") {
            if (
                (fromBank === "left" && state.leftCannibals <= 0) ||
                (fromBank === "right" && state.rightCannibals <= 0) ||
                (fromBank === "boat" && state.boatCannibals <= 0)
            ) return false;
        }

        return true;
    };

    const movePerson = (fromBank, toBank, personType) => {
        if (!canMove(fromBank, personType)) return;

        if (toBank === "boat" && fromBank !== "boat") {
            if (fromBank !== state.boatPosition) {
                message.textContent = "The boat is on the other side!";
                return;
            }
            if ((state.boatMissionaries + state.boatCannibals) >= MAX_BOAT_CAPACITY) {
                updateStatus("The boat is full! Max 2 people.", "warning");
                return;
            }

            if (personType === "missionary") {
                if (fromBank === "left") { state.leftMissionaries--; state.boatMissionaries++; }
                else { state.rightMissionaries--; state.boatMissionaries++; }
            } else if (personType === "cannibal") {
                if (fromBank === "left") { state.leftCannibals--; state.boatCannibals++; }
                else { state.rightCannibals--; state.boatCannibals++; }
            }
        } else if (fromBank === "boat") {
            if (personType === "missionary") {
                state.boatMissionaries--;
                if (toBank === "left") state.leftMissionaries++;
                else state.rightMissionaries++;
            } else {
                state.boatCannibals--;
                if (toBank === "left") state.leftCannibals++;
                else state.rightCannibals++;
            }
        }
        updateUI();
    };

    const moveBoat = () => {
        if (state.isGameOver) return;


        if (state.boatMissionaries === 0 && state.boatCannibals === 0) {
            message.textContent = "The boat needs at least one person to row!";
            return;
        }

        state.boatPosition = state.boatPosition === 'left' ? 'right' : 'left';
        clearSelectedStyles();
        state.selectedPerson = null;
        message.textContent = `Boat crossed over to the ${state.boatPosition} bank.`;
        updateUI();
    };

    // Drag and Drop implementation
    const onDragStart = (event) => {
        if (state.isGameOver) {
            event.preventDefault();
            return;
        }
        event.dataTransfer.setData("text/plain", JSON.stringify({
            bank: event.target.dataset.bank,
            type: event.target.dataset.type
        }));
    };

    const onDrop = (event, targetBank) => {
        event.preventDefault();
        if (state.isGameOver) return;

        try {
            const data = JSON.parse(event.dataTransfer.getData("text/plain"));
            movePerson(data.bank, targetBank, data.type);
        } catch (e) {
            console.error("Drop failed parsing payloads", e);
        }
    };

    startButton.addEventListener("click", startGame);
    moveBoatButton.addEventListener("click", moveBoat);

    document.querySelectorAll('.bank, #boat').forEach(el => {
        el.addEventListener("dragstart", onDragStart);
        el.addEventListener("dragover", (e) => e.preventDefault());
    });

    document.getElementById("left-bank").addEventListener("drop", (e) => onDrop(e, "left"));
    document.getElementById("right-bank").addEventListener("drop", (e) => onDrop(e, "boat")); // dropped into middle zone targets boat
    boatElement.addEventListener("drop", (e) => onDrop(e, "boat"));
    document.getElementById("right-bank").addEventListener("drop", (e) => onDrop(e, "right"));

    startGame();
});
