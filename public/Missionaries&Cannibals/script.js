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

    const hintBtn = document.getElementById("hint-btn");
    const hintText = document.getElementById("hint-text");
    const hints = [
        "Hint 1: Start by sending two Cannibals across.",
        "Hint 2: Always make sure the boat has a pilot to return.",
        "Hint 3: You may need to send a mixed pair (1M, 1C) to maintain balance."
    ];

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
            resultMessage.textContent = "Oh no! The Missionaries were outnumbered. Don't give up—try a different strategy!";
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
            if (hintText) {
                hintText.textContent = hints[state.hintsUsed];
                hintText.style.display = "flex";
            }
            state.hintsUsed++;
            if (hintBtn) {
                hintBtn.textContent = `Get Hint (${3 - state.hintsUsed} left)`;
                if (state.hintsUsed === 3) {
                    hintBtn.disabled = true;
                }
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
        
        if (hintBtn) {
            hintBtn.disabled = false;
            hintBtn.textContent = "Get Hint (3 left)";
        }
        if (hintText) {
            hintText.textContent = "";
            hintText.style.display = "none";
        }
        
        updateStatus("Move the Missionaries and Cannibals to the right bank safely!", "success");
        moveCountDisplay.textContent = "0";
        hideResults();
        updateUI();
    };

    const checkGameState = () => {
        // A bank is in a losing state if missionaries are outnumbered AND the boat is not present to offer safety.
        const isLostOnLeft =
            state.leftMissionaries > 0 &&
            state.leftMissionaries < state.leftCannibals &&
            state.boatPosition !== 'left';

        const isLostOnRight =
            state.rightMissionaries > 0 &&
            state.rightMissionaries < state.rightCannibals &&
            state.boatPosition !== 'right';

        // Lose conditions
        if (isLostOnLeft || isLostOnRight) {
            state.isGameOver = true;
            updateStatus("Game Over! Cannibals outnumbered Missionaries on a bank.", "error");
            showResults(false);
            return;
        }

        // Win condition: All 6 people must be on the right bank itself.
        if (state.rightMissionaries === 3 && state.rightCannibals === 3) {
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

        state.moveCount++;
        moveCountDisplay.textContent = state.moveCount;

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
    restartBtn.addEventListener("click", startGame);
    
    if (hintBtn) {
        hintBtn.addEventListener("click", handleHint);
    }
    
    if (instructionsBtn) {
        instructionsBtn.addEventListener("click", () => modal.classList.add("show"));
    }
    if (closeModal) {
        closeModal.addEventListener("click", () => modal.classList.remove("show"));
    }
    const modalStartBtn = document.getElementById("modal-start-btn");
    if (modalStartBtn) {
        modalStartBtn.addEventListener("click", () => {
            modal.classList.remove("show");
            startGame();
        });
    }

    document.querySelectorAll('.bank, #boat').forEach(el => {
        el.addEventListener("dragstart", onDragStart);
        el.addEventListener("dragover", (e) => e.preventDefault());
    });

    document.getElementById("left-bank").addEventListener("drop", (e) => onDrop(e, "left"));
    document.getElementById("boat-zone").addEventListener("drop", (e) => onDrop(e, "boat")); // dropped into middle zone targets boat
    boatElement.addEventListener("drop", (e) => onDrop(e, "boat"));
    document.getElementById("right-bank").addEventListener("drop", (e) => onDrop(e, "right"));

    startGame();
});
