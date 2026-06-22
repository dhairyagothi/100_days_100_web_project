/**
 * Critical Algorithmic Optimization Layer - GSSoC Tier Critical
 * High-Performance Compressed Trie & Search Index Kernel
 */
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.records = []; // References to full items containing this keyword match token
    }
}

export class SearchTrieIndex {
    #root = new TrieNode();

    // 1. Tokenize text strings into independent, clean character chains
    #tokenize(text) {
        return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    }

    // 2. Insert record items into the structural Trie network matrix
    insert(searchString, fullItemRecord) {
        const words = this.#tokenize(searchString);

        for (const word of words) {
            if (!word) continue;
            let currentNode = this.#root;

            // Step through each individual character block down the tree paths
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                if (!currentNode.children[char]) {
                    currentNode.children[char] = new TrieNode();
                }
                currentNode = currentNode.children[char];
            }

            currentNode.isEndOfWord = true;
            // Attach structural tracking object map to node endpoint pointer
            currentNode.records.push(fullItemRecord);
        }
    }

    // 3. Traverses down the character links to locate prefix nodes instantly: O(K)
    searchPrefix(prefixString) {
        const cleanPrefix = prefixString.toLowerCase().trim();
        if (!cleanPrefix) return [];

        let currentNode = this.#root;
        for (let i = 0; i < cleanPrefix.length; i++) {
            const char = cleanPrefix[i];
            if (!currentNode.children[char]) {
                return []; // Prefix doesn't exist anywhere in dataset index map
            }
            currentNode = currentNode.children[char];
        }

        // Gather all nested child nodes starting from this matching point
        const collectedResults = [];
        this.#collectAllRecords(currentNode, collectedResults);

        // Use a Set to strip out duplicate items that matched multiple word tokens
        return [...new Set(collectedResults)];
    }

    // Recursive depth-first-search traversal across remaining character nodes
    #collectAllRecords(node, resultsArray) {
        if (node.isEndOfWord) {
            resultsArray.push(...node.records);
        }

        for (const char in node.children) {
            this.#collectAllRecords(node.children[char], resultsArray);
        }
    }
}