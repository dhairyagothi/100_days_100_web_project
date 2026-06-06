import { RequestBatchingEngine } from './batchKernel.js';

const batcher = new RequestBatchingEngine(50); // 50ms accumulation loop threshold

const logTerminal = document.getElementById('network-log');
const triggerBtn = document.getElementById('trigger-btn');
const resultsView = document.getElementById('network-results');
const totalRequests = document.getElementById('totalRequests');
const totalBatches = document.getElementById('totalBatches');
const avgBatchSize = document.getElementById('avgBatchSize');
const savedRequests = document.getElementById('savedRequests');
const avgLatency = document.getElementById('avgLatency');
const successCount = document.getElementById('successCount');
const failureCount = document.getElementById('failureCount');
const resetAnalyticsBtn = document.getElementById('resetAnalyticsBtn');

function updateAnalyticsDashboard() {
  const stats = batcher.getAnalytics();

  totalRequests.textContent = stats.totalRequests;
  totalBatches.textContent = stats.totalBatches;
  avgBatchSize.textContent = stats.averageBatchSize;
  savedRequests.textContent = stats.requestsSaved;
  avgLatency.textContent = `${stats.averageLatency} ms`;
  successCount.textContent = stats.successCount;
  failureCount.textContent = stats.failureCount;
}

triggerBtn.addEventListener('click', async () => {
  logTerminal.textContent += `\n[UI Action Triggered] Firing 5 simultaneous separate detail requests...`;

  // Simulating 5 separate UI sections requesting data at the exact same millisecond
  const requestsToProcess = ['item_A', 'item_B', 'item_C', 'item_D', 'item_E'];

  logTerminal.textContent += `\n[Engine Core Status] Active pipeline buffer count: ${batcher.pendingQueueCount}`;

  // Map each id to the batcher, producing an array of separate Promises running concurrently
  const batchPromises = requestsToProcess.map(async (id) => {
    try {
      const data = await batcher.fetchItemDetails(id);

      const logRow = document.createElement('div');
      logRow.style.padding = '4px 0';
      logRow.textContent = `[Data Resolved] ID: ${data.fetchedId} | Status: ${data.status} | Timestamp: ${data.timestamp}`;
      resultsView.appendChild(logRow);
    } catch (err) {
      logTerminal.textContent += `\n[Network Error] Request failed for ${id}: ${err}`;
    }
  });

  // Notify the user that the engine has combined the pipeline strings
  logTerminal.textContent += `\n[Batching Pipeline Active] Requests bundled into single packet. Waiting for execution loop flush...`;

  await Promise.all(batchPromises);
  updateAnalyticsDashboard();

  logTerminal.textContent += `\n[Transaction Complete] Combined payload resolved cleanly. Operational network sockets used: 1`;
});

resetAnalyticsBtn.addEventListener('click', () => {

    batcher.resetAnalytics();

    updateAnalyticsDashboard();

    logTerminal.textContent +=
        '\n[Analytics Reset] Dashboard statistics cleared.';
});

updateAnalyticsDashboard();
