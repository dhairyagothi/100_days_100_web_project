const usageStats = {
  totalRequests: 0,
  totalErrors: 0,
};

export function logRequest() {
  usageStats.totalRequests++;
}

export function logError() {
  usageStats.totalErrors++;
}

export function getUsageStats() {
  return usageStats;
}