document.addEventListener("DOMContentLoaded", () => {
    const leftBank = document.getElementById("left-bank");
    const rightBank = document.getElementById("right-bank");
    const boat = document.getElementById("boat");
    const boatPanel = document.getElementById("boat-panel");
    const message = document.getElementById("message");
    const moveBoatBtn = document.getElementById("moveBoatBtn");
    const resetBtn = document.getElementById("resetBtn");

    const initialState = () => ({
        leftMissionaries: 3,
        leftCannibals: 3,
        rightMissionaries: 0,
        rightCannibals: 0,
        boatMissionaries: 0,
        boatCannibals: 0,
        boatSide: "left",
        gameWon: false
    });

    let state = initialState();

    const safeCounts = (missionaries, cannibals) => missionaries === 0 || missionaries >= cannibals;

    const isSafe = () => {
        if (!safeCounts(state.leftMissionaries, state.leftCannibals)) {
            return false;
        }

        if (!safeCounts(state.rightMissionaries, state.rightCannibals)) {
            return false;
        }

        return true;
    };

    const updateMessage = (text) => {
        message.textContent = text;
    };

    const resetGame = () => {
        state = initialState();
        updateMessage("Click a person on the current bank to load the boat, then move it safely across.");
        render();
    };

    const renderPerson = (container, type, label, clickable) => {
        const person = document.createElement("div");
        person.className = `person ${type}`;
        person.textContent = label;
        person.title = type === "missionary" ? "Missionary" : "Cannibal";

        if (clickable) {
            person.addEventListener("click", () => {
                if (type === "missionary") {
                    boardPerson("missionary");
                } else {
                    boardPerson("cannibal");
                }
            });
        }

        container.appendChild(person);
    };

    const renderBank = (container, bank, boardable) => {
        container.innerHTML = "";

        for (let i = 0; i < state[`${bank}Missionaries`]; i += 1) {
            renderPerson(container, "missionary", "M", boardable);
        }

        for (let i = 0; i < state[`${bank}Cannibals`]; i += 1) {
            renderPerson(container, "cannibal", "C", boardable);
        }

        if (state[`${bank}Missionaries`] === 0 && state[`${bank}Cannibals`] === 0) {
            const empty = document.createElement("div");
            empty.className = "bank-empty";
            empty.textContent = "No one here";
            container.appendChild(empty);
        }
    };

    const renderBoat = () => {
        boat.innerHTML = "";

        for (let i = 0; i < state.boatMissionaries; i += 1) {
            renderPerson(boat, "missionary", "M", true);
        }

        for (let i = 0; i < state.boatCannibals; i += 1) {
            renderPerson(boat, "cannibal", "C", true);
        }

        if (state.boatMissionaries === 0 && state.boatCannibals === 0) {
            const empty = document.createElement("div");
            empty.className = "bank-empty";
            empty.textContent = "Boat is empty";
            boat.appendChild(empty);
        }

        boatPanel.classList.remove("boat-left", "boat-right");
        boatPanel.classList.add(`boat-${state.boatSide}`);
    };

    const render = () => {
        const boardable = state.boatSide === "left";
        renderBank(leftBank, "left", boardable);
        renderBank(rightBank, "right", !boardable);
        renderBoat();

        moveBoatBtn.disabled = state.boatMissionaries + state.boatCannibals === 0 || state.gameWon;
        resetBtn.disabled = false;

        if (state.gameWon) {
            updateMessage("You saved everyone! Press Reset Game to play again.");
        }
    };

    const safeOrRevert = (applyChange, failureMessage) => {
        const previous = JSON.parse(JSON.stringify(state));
        applyChange();

        if (!isSafe()) {
            state = previous;
            updateMessage(failureMessage);
            render();
            return false;
        }

        return true;
    };

    const boardPerson = (type) => {
        if (state.gameWon) {
            return;
        }

        if (state.boatMissionaries + state.boatCannibals >= 2) {
            updateMessage("The boat is full. Move it across before loading more passengers.");
            return;
        }

        const currentBank = state.boatSide;
        const currentMissionaries = currentBank === "left" ? state.leftMissionaries : state.rightMissionaries;
        const currentCannibals = currentBank === "left" ? state.leftCannibals : state.rightCannibals;

        if (type === "missionary" && currentMissionaries === 0) {
            updateMessage("There are no missionaries on this bank to board.");
            return;
        }

        if (type === "cannibal" && currentCannibals === 0) {
            updateMessage("There are no cannibals on this bank to board.");
            return;
        }

        const success = safeOrRevert(() => {
            if (type === "missionary") {
                if (currentBank === "left") {
                    state.leftMissionaries -= 1;
                } else {
                    state.rightMissionaries -= 1;
                }
                state.boatMissionaries += 1;
            } else {
                if (currentBank === "left") {
                    state.leftCannibals -= 1;
                } else {
                    state.rightCannibals -= 1;
                }
                state.boatCannibals += 1;
            }
        }, "That move would make the bank unsafe.");

        if (success) {
            updateMessage(`Loaded a ${type}. Move the boat to continue.`);
            render();
        }
    };

    const unloadPerson = (type) => {
        if (state.gameWon) {
            return;
        }

        if (type === "missionary" && state.boatMissionaries === 0) {
            updateMessage("There is no missionary in the boat to unload.");
            return;
        }

        if (type === "cannibal" && state.boatCannibals === 0) {
            updateMessage("There is no cannibal in the boat to unload.");
            return;
        }

        const success = safeOrRevert(() => {
            if (type === "missionary") {
                state.boatMissionaries -= 1;
                if (state.boatSide === "left") {
                    state.leftMissionaries += 1;
                } else {
                    state.rightMissionaries += 1;
                }
            } else {
                state.boatCannibals -= 1;
                if (state.boatSide === "left") {
                    state.leftCannibals += 1;
                } else {
                    state.rightCannibals += 1;
                }
            }
        }, "That unload would make the bank unsafe.");

        if (success) {
            updateMessage(`Unloaded a ${type}. Choose another passenger or move the boat.`);
            render();
        }
    };

    const moveBoat = () => {
        if (state.gameWon) {
            return;
        }

        if (state.boatMissionaries + state.boatCannibals === 0) {
            updateMessage("Load at least one person before moving the boat.");
            return;
        }

        state.boatSide = state.boatSide === "left" ? "right" : "left";
        if (!isSafe()) {
            state.boatSide = state.boatSide === "left" ? "right" : "left";
            updateMessage("The boat can't be moved safely right now.");
            render();
            return;
        }

        updateMessage(`Boat moved to the ${state.boatSide} bank.`);

        if (state.rightMissionaries === 3 && state.rightCannibals === 3) {
            state.gameWon = true;
        }

        render();
    };

    boat.addEventListener("click", (event) => {
        if (event.target.classList.contains("missionary")) {
            unloadPerson("missionary");
            return;
        }

        if (event.target.classList.contains("cannibal")) {
            unloadPerson("cannibal");
        }
    });

    moveBoatBtn.addEventListener("click", moveBoat);
    resetBtn.addEventListener("click", resetGame);

    resetGame();
});