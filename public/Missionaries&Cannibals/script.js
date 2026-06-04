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
    let boatContainer = document.getElementById("boat");
    let boat = document.getElementById("boat-people");
    let message = document.getElementById("message");
    let guidance = document.getElementById("guidance");
    let moveCountDisplay = document.getElementById("move-count");
    let startButton = document.getElementById("start-reset");

    // Hint Elements
    const hintBtn = document.getElementById("hint-btn");
    const hintText = document.getElementById("hint-text");

    let state = {
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

    const hints = [
        "Try moving two cannibals first.",
        "Do not leave missionaries outnumbered.",
        "Sometimes bringing one cannibal back helps balance both banks."
    ];

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

    const isValidState = () => {
        if (state.leftMissionaries > 0 &&
            state.leftMissionaries < state.leftCannibals) {
            return false;
        }

        if (state.rightMissionaries > 0 &&
            state.rightMissionaries < state.rightCannibals) {
            return false;
        }

        return true;
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

        const updatePeople = (container, numMissionaries, numCannibals, isDraggable, bankPosition) => {
            for (let i = 0; i < numMissionaries; i++) {
                let person = document.createElement("div");
                person.classList.add("person", "missionary");
                person.textContent = "🐑"; // Missionaries as Sheep
                if (isDraggable) {
                    person.setAttribute("draggable", "true");
                    person.dataset.type = "missionary";
                    person.dataset.bank = bankPosition;
                }
                person.addEventListener("click", () => handlePersonClick(person));
                container.appendChild(person);
            }
            for (let i = 0; i < numCannibals; i++) {
                let person = document.createElement("div");
                person.classList.add("person", "cannibal");
                person.textContent = "🐯"; // Cannibals as Tigers
                if (isDraggable) {
                    person.setAttribute("draggable", "true");
                    person.dataset.type = "cannibal";
                    person.dataset.bank = bankPosition;
                }
                person.addEventListener("click", () => handlePersonClick(person));
                container.appendChild(person);
            }
        };

        const canDragFromLeft = state.boatPosition === 'left';
        const canDragFromRight = state.boatPosition === 'right';

        updatePeople(leftBank, state.leftMissionaries, state.leftCannibals, canDragFromLeft, 'left');
        updatePeople(boat, state.boatMissionaries, state.boatCannibals, true, 'boat');
        updatePeople(rightBank, state.rightMissionaries, state.rightCannibals, canDragFromRight, 'right');

        clearSelectedStyles();

        boatContainer.classList.remove('boat-left', 'boat-right');
        boatContainer.classList.add(`boat-${state.boatPosition}`);

        updateGuidance();
        checkGameState();
    };

    const handlePersonClick = (person) => {
        if (state.isGameOver) return;
        person.classList.toggle("selected");
        const personBank = person.dataset.bank;
        const personType = person.dataset.type;

    
        if (personBank === state.boatPosition) {
            movePerson(personBank, "boat", personType);
            return;
        }

        if (personBank === "boat") {
            movePerson("boat", state.boatPosition, personType);
            return;
        }
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
            if ((state.boatMissionaries + state.boatCannibals) >= MAX_BOAT_CAPACITY) {
                updateStatus("The boat is full! Max 2 people.", "warning");
                return;
            }

            if (personType === "missionary") {
                if (fromBank === "left") state.leftMissionaries--;
                else state.rightMissionaries--;
                state.boatMissionaries++;
            } else {
                if (fromBank === "left") state.leftCannibals--;
                else state.rightCannibals--;
                state.boatCannibals++;
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

    const onDragStart = (event) => {
        if (state.isGameOver) {
            event.preventDefault();
            return;
        }
        event.dataTransfer.setData("person", event.target.className);
    };

    const onDragOver = (event) => event.preventDefault();

    const onDrop = (event, bank) => {
        event.preventDefault();
        if (state.isGameOver) return;

        let personClass = event.dataTransfer.getData("person");
        let isMissionary = personClass.includes("missionary");
        let type = isMissionary ? "missionary" : "cannibal";

        if (bank === "boat") {
            movePerson(state.boatPosition, "boat", type);
        } else {
            movePerson("boat", bank, type);
        }
    };

    const moveBoat = () => {
        if (state.isGameOver) return;

        if (state.boatMissionaries === 0 && state.boatCannibals === 0) {
            updateStatus("The boat needs at least one person to sail!", "warning");
            return;
        }

        state.boatPosition = state.boatPosition === 'left' ? 'right' : 'left';
        state.moveCount++;
        moveCountDisplay.textContent = state.moveCount;
        
        updateStatus(`Boat moved to the ${state.boatPosition} bank.`, "success");
        updateUI();
    };

    startButton.addEventListener("click", startGame);
    document.getElementById("move-boat").addEventListener("click", moveBoat);
    hintBtn.addEventListener("click", handleHint);
    restartBtn.addEventListener("click", startGame);

    leftBank.addEventListener("dragstart", onDragStart);
    rightBank.addEventListener("dragstart", onDragStart);
    boat.addEventListener("dragstart", onDragStart);

    leftBank.addEventListener("dragover", onDragOver);
    rightBank.addEventListener("dragover", onDragOver);
    boat.addEventListener("dragover", onDragOver);

    leftBank.addEventListener("drop", (e) => onDrop(e, "left"));
    rightBank.addEventListener("drop", (e) => onDrop(e, "right"));
    boat.addEventListener("drop", (e) => onDrop(e, "boat"));
    const showModal = () => modal.classList.add("show");
    const hideModal = () => {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    };

    const modalStartBtn = document.getElementById("modal-start-btn");

    closeModal.addEventListener("click", () => {
        hideModal();
        startGame();
    });
    instructionsBtn.addEventListener("click", showModal);
    modalStartBtn.addEventListener("click", () => {
        modal.classList.remove("show");

        setTimeout(() => {
            document.body.style.overflow = "auto";
            startGame();
        }, 300);
    });

   window.addEventListener("click", (e) => {

        // If modal background clicked
        if (e.target === modal) {
            hideModal();
            startGame();
        }

        // Results modal
        if (e.target === resultsModal) {
            resultsModal.classList.remove("show");
        }
    });
    showModal();
    updateUI();
});
