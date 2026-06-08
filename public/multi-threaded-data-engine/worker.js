/**
 * Critical Concurrency Engine Module - GSSoC #6172
 * Background Thread Core Processing Kernel
 */

let workerDataset = [];

// Event listener to capture operational message transactions from the Main UI thread
self.onmessage = function (e) {
    const { command, payload } = e.data;

    if (command === 'INITIALIZE_DATASET') {
        workerDataset = payload;
        // Reply to the main thread that memory allocation is locked and ready
        self.postMessage({ status: 'READY', count: workerDataset.length });
    }

    if (command === 'EXECUTE_QUERY') {
        const { searchTerm } = payload;

        // Performance-Heavy Operation: Scanning across 100,000 array maps
        const filteredResults = workerDataset.filter(item => {
            return item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.role.toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Broadcast the calculated results back to the presentation layer
        self.postMessage({ status: 'QUERY_COMPLETE', results: filteredResults });
    }
};