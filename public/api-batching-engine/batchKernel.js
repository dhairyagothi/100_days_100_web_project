/**
 * Critical Architecture Network Layer - GSSoC Tier Critical
 * High-Throughput Request Batching & Throttling Engine
 */
export class RequestBatchingEngine {
    #queue = [];
    #timerId = null;
    #delay;

    constructor(accumulationDelayMs = 50) {
        this.#delay = accumulationDelayMs;
    }

    // Public API: Intercepts an item request and returns an isolated Promise
    fetchItemDetails(itemId) {
        return new Promise((resolve, reject) => {
            // Push request parameters alongside its individual resolution hooks into the buffer
            this.#queue.push({ itemId, resolve, reject });

            // Trigger the accumulation timer window if not already active
            if (!this.#timerId) {
                this.#timerId = setTimeout(() => this.#flushQueue(), this.#delay);
            }
        });
    }

    // Flushes the accumulated requests in a single, combined block
    async #flushQueue() {
        const activeBatch = [...this.#queue];
        this.#queue = []; // Instantly clear the main queue buffer to prevent race conditions
        this.#timerId = null;

        const batchedIds = activeBatch.map(req => req.itemId);

        try {
            // Simulating a unified single batch API network transport call
            const simulatedResponse = await this.#simulatedBatchApiCall(batchedIds);

            // Map the unified incoming data blocks back to their original individual Promise callers
            activeBatch.forEach(request => {
                const itemData = simulatedResponse[request.itemId];
                if (itemData) {
                    request.resolve(itemData);
                } else {
                    request.reject(`Item ${request.itemId} missing from batch payload.`);
                }
            });
        } catch (error) {
            activeBatch.forEach(request => request.reject(error));
        }
    }

    // Simulated back-end network endpoint processing a bundled packet
    #simulatedBatchApiCall(itemIds) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockDatabaseResponse = {};
                itemIds.forEach(id => {
                    mockDatabaseResponse[id] = {
                        fetchedId: id,
                        timestamp: Date.now(),
                        status: "Processed_Successfully",
                        payloadSize: "128_bytes"
                    };
                });
                resolve(mockDatabaseResponse);
            }, 100); // 100ms simulated server round-trip latency
        });
    }

    get pendingQueueCount() {
        return this.#queue.length;
    }
}