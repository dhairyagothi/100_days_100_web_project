const suspiciousActivity = new Map();

function logEvent(ip, type) {
  const current = suspiciousActivity.get(ip) || {
    failedRequests: 0,
    rateLimitHits: 0,
    apiErrors: 0,
    serverErrors: 0,
    riskScore: 0,
    events: [],
  };

  switch (type) {
    case "RATE_LIMIT":
      current.rateLimitHits++;
      current.riskScore += 10;
      break;

    case "INVALID_REQUEST":
      current.failedRequests++;
      current.riskScore += 5;
      break;

    case "API_ERROR":
      current.apiErrors++;
      current.riskScore += 3;
      break;

    case "SERVER_ERROR":
      current.serverErrors++;
      current.riskScore += 2;
      break;

    default:
      break;
  }

  current.events.push({
    type,
    timestamp: new Date().toISOString(),
  });

  suspiciousActivity.set(ip, current);
}

function getStats() {
  const stats = {};

  for (const [ip, data] of suspiciousActivity.entries()) {
    stats[ip] = {
      ...data,
      riskLevel:
        data.riskScore >= 50
          ? "HIGH"
          : data.riskScore >= 20
          ? "MEDIUM"
          : "LOW",
      isBlocked: data.riskScore >= 100,
    };
  }

  return stats;
}

module.exports = {
  logEvent,
  getStats,
};