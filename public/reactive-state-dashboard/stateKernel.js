/**
 * Advanced State Architecture Layer - GSSoC #6446 Tier Advanced
 * Centralized Reactive State Store & Stream Observer Kernel
 */
export class ReactiveStateStore {
    #state = {};
    #subscribers = new Map();

    // 1. Register subscriber component callback vectors to explicit state channels
    subscribe(channelKey, callback) {
        if (!this.#subscribers.has(channelKey)) {
            this.#subscribers.set(channelKey, []);
        }
        this.#subscribers.get(channelKey).push(callback);
    }

    // 2. Commit data updates safely and notify linked listeners synchronously
    dispatch(channelKey, newValue) {
        // Enforce basic state immutability patterns
        this.#state = {
            ...this.#state,
            [channelKey]: newValue
        };

        const channelSubscribers = this.#subscribers.get(channelKey) || [];
        
        // Notify only the observers subscribed to this specific channel
        channelSubscribers.forEach(notifySubscriberCallback => {
            notifySubscriberCallback(this.#state[channelKey]);
        });

        return channelSubscribers.length;
    }

    // Read values directly from the store shell snapshot
    getStateSnapshot(channelKey) {
        return this.#state[channelKey] !== undefined ? this.#state[channelKey] : null;
    }
}