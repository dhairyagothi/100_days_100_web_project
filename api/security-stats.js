const { getStats } = require("./securityMonitor");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  const stats = getStats();

  return res.status(200).json({
    totalTrackedIPs: Object.keys(stats).length,
    monitoredIPs: stats,
  });
};