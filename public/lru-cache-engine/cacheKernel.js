/**
 * Critical Algorithmic Infrastructure Layer - GSSoC Tier Critical
 * High-Performance LRU Cache Matrix Kernel
 */
class CacheNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

export class LRUCacheEngine {
    #capacity;
    #map = new Map();
    #head = new CacheNode(0, 0); // Sentinel head node
    #tail = new CacheNode(0, 0); // Sentinel tail node

    constructor(capacity) {
        this.#capacity = capacity;
        // Establish our boundary link tracks
        this.#head.next = this.#tail;
        this.#tail.prev = this.#head;
    }

    // Structural Helper: Extracts an existing node out from its active pointer links
    #removeNode(node) {
        const previousPointer = node.prev;
        const nextPointer = node.next;
        previousPointer.next = nextPointer;
        nextPointer.prev = previousPointer;
    }

    // Structural Helper: Intercepts a node and pins it right behind the head sentinel (Most Recently Used)
    #addNodeToHead(node) {
        node.next = this.#head.next;
        node.next.prev = node;
        this.#head.next = node;
        node.prev = this.#head;
    }

    // Public API: Fetches a cached item instantly and shifts its priority rank
    get(key) {
        const existingNode = this.#map.get(key);
        if (!existingNode) return null;

        // Node was accessed; refresh its position to the head marker
        this.#removeNode(existingNode);
        this.#addNodeToHead(existingNode);
        return existingNode.value;
    }

    // Public API: Commits a payload value into memory, evicting cold data if full
    put(key, value) {
        const existingNode = this.#map.get(key);

        if (existingNode) {
            // Update value and shift node position to head
            existingNode.value = value;
            this.#removeNode(existingNode);
            this.#addNodeToHead(existingNode);
        } else {
            const newNode = new CacheNode(key, value);
            this.#map.set(key, newNode);
            this.#addNodeToHead(newNode);

            // Eviction Check: If we burst past capacity bounds, drop the element resting at the tail
            if (this.#map.size > this.#capacity) {
                const leastUsedNode = this.#tail.prev;
                this.#removeNode(leastUsedNode);
                this.#map.delete(leastUsedNode.key); // Erase from lookups
            }
        }
    }

    get activeCacheSize() {
        return this.#map.size;
    }
}