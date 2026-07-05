/**
 * Advanced Reactive State Store Core with Immutability and Transaction History
 */
export class StateStore {
    #state;
    #listeners = new Set();
    #history = [];
    #currentHistoryPointer = -1;

    constructor(initialState = {}) {
        this.#state = this.#deepClone(initialState);
        this.#recordSnapshot();
    }

    // Returns a read-only representation of the current state tree
    get state() {
        return Object.freeze(this.#deepClone(this.#state));
    }

    // Registers a subscriber module to capture runtime updates
    subscribe(listener) {
        this.#listeners.add(listener);
        return () => this.#listeners.delete(listener); // Unsubscribe cleanup
    }

    // Safely mutates the data ecosystem through a discrete action layer
    dispatch(mutationFn) {
        // If we were navigating history, clear forward history on new action
        if (this.#currentHistoryPointer < this.#history.length - 1) {
            this.#history = this.#history.slice(0, this.#currentHistoryPointer + 1);
        }

        const nextState = this.#deepClone(this.#state);
        mutationFn(nextState);

        this.#state = nextState;
        this.#recordSnapshot();
        this.#notifySubscribers();
    }

    // Rewinds state back by one transaction step
    undo() {
        if (this.#currentHistoryPointer > 0) {
            this.#currentHistoryPointer--;
            this.#state = this.#deepClone(this.#history[this.#currentHistoryPointer]);
            this.#notifySubscribers();
            return true;
        }
        return false;
    }

    // Steps forward through recorded time metrics
    redo() {
        if (this.#currentHistoryPointer < this.#history.length - 1) {
            this.#currentHistoryPointer++;
            this.#state = this.#deepClone(this.#history[this.#currentHistoryPointer]);
            this.#notifySubscribers();
            return true;
        }
        return false;
    }

    #recordSnapshot() {
        this.#history.push(this.#deepClone(this.#state));
        this.#currentHistoryPointer++;
    }

    #notifySubscribers() {
        const currentState = this.state;
        this.#listeners.forEach(listener => listener(currentState));
    }

    #deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}