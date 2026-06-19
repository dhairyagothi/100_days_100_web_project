/**
 * Diagnostic Tools with Packet Analysis and Network Debugging - Issue #8788
 * Performance monitoring, network analysis, and system diagnostics
 */

class DiagnosticsEngine {
  constructor() {
    this.packetLog = [];
    this.performanceMetrics = [];
    this.networkMonitoring = false;
    this.diagnosticReports = [];
    this.maxLogSize = 1000;
  }

  /**
   * Capture network packet information
   */
  capturePacket(packet) {
    const packetRecord = {
      id: this.generatePacketId(),
      timestamp: Date.now(),
      type: packet.type || 'unknown',
      size: packet.data?.length || 0,
      duration: packet.duration || 0,
      status: packet.status || 'pending',
      url: packet.url || '',
      method: packet.method || 'GET',
      headers: packet.headers || {},
      payload: packet.data || null,
      response: packet.response || null,
      error: packet.error || null,
    };

    this.packetLog.push(packetRecord);
    if (this.packetLog.length > this.maxLogSize) {
      this.packetLog.shift();
    }

    return packetRecord;
  }

  /**
   * Analyze network traffic patterns
   */
  analyzeNetworkTraffic(timeWindow = 60000) {
    const now = Date.now();
    const recentPackets = this.packetLog.filter(
      (p) => p.timestamp > now - timeWindow
    );

    const analysis = {
      totalPackets: recentPackets.length,
      timeWindow,
      averageSize: recentPackets.length > 0
        ? (recentPackets.reduce((sum, p) => sum + p.size, 0) / recentPackets.length).toFixed(2)
        : 0,
      totalDataTransferred: recentPackets.reduce((sum, p) => sum + p.size, 0),
      averageDuration: recentPackets.length > 0
        ? (recentPackets.reduce((sum, p) => sum + p.duration, 0) / recentPackets.length).toFixed(2)
        : 0,
      packetsByType: this.groupBy(recentPackets, 'type'),
      packetsByStatus: this.groupBy(recentPackets, 'status'),
      errorCount: recentPackets.filter((p) => p.error).length,
      successRate: recentPackets.length > 0
        ? (((recentPackets.length - recentPackets.filter((p) => p.error).length) / recentPackets.length) * 100).toFixed(1)
        : 0,
    };

    return analysis;
  }

  /**
   * Measure page load performance
   */
  measurePageLoadPerformance() {
    const perfData = window.performance.timing;
    if (!perfData) return null;

    const metrics = {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.navigationStart,
      download: perfData.responseEnd - perfData.responseStart,
      dom: perfData.domComplete - perfData.domLoading,
      load: perfData.loadEventEnd - perfData.loadEventStart,
      total: perfData.loadEventEnd - perfData.navigationStart,
    };

    this.performanceMetrics.push({
      timestamp: Date.now(),
      metrics,
    });

    return metrics;
  }

  /**
   * Monitor resource loading performance
   */
  monitorResources() {
    const resources = window.performance.getEntriesByType('resource');

    return resources.map((r) => ({
      name: r.name,
      duration: r.duration.toFixed(2),
      size: r.transferSize || 0,
      type: r.initiatorType,
      cached: r.transferSize === 0,
    }));
  }

  /**
   * Detect network bottlenecks
   */
  detectBottlenecks() {
    const analysis = this.analyzeNetworkTraffic();
    const bottlenecks = [];

    if (parseFloat(analysis.averageDuration) > 1000) {
      bottlenecks.push({
        type: 'high_latency',
        severity: 'high',
        message: 'Average packet duration exceeds 1 second',
        value: analysis.averageDuration,
      });
    }

    if (analysis.errorCount > analysis.totalPackets * 0.05) {
      bottlenecks.push({
        type: 'high_error_rate',
        severity: 'medium',
        message: 'Error rate exceeds 5%',
        value: `${((analysis.errorCount / analysis.totalPackets) * 100).toFixed(1)}%`,
      });
    }

    if (parseFloat(analysis.successRate) < 90) {
      bottlenecks.push({
        type: 'low_success_rate',
        severity: 'high',
        message: 'Success rate below 90%',
        value: analysis.successRate,
      });
    }

    const resources = this.monitorResources();
    const slowResources = resources.filter((r) => parseFloat(r.duration) > 2000);
    if (slowResources.length > 0) {
      bottlenecks.push({
        type: 'slow_resources',
        severity: 'medium',
        message: `${slowResources.length} resources loading slowly (>2s)`,
        resources: slowResources,
      });
    }

    return bottlenecks;
  }

  /**
   * Generate comprehensive diagnostic report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      networkAnalysis: this.analyzeNetworkTraffic(),
      performanceMetrics: this.performanceMetrics.length > 0
        ? this.performanceMetrics[this.performanceMetrics.length - 1].metrics
        : null,
      bottlenecks: this.detectBottlenecks(),
      resources: this.monitorResources(),
      systemHealth: this.getSystemHealth(),
      recommendations: this.getRecommendations(),
    };

    this.diagnosticReports.push(report);
    return report;
  }

  /**
   * Get system health status
   */
  getSystemHealth() {
    const analysis = this.analyzeNetworkTraffic();

    return {
      overall: this.calculateHealthScore(analysis) > 70 ? 'healthy' : 'degraded',
      healthScore: this.calculateHealthScore(analysis),
      timestamp: Date.now(),
      details: {
        networkHealth: parseFloat(analysis.successRate) > 95 ? 'healthy' : 'degraded',
        performanceHealth: parseFloat(analysis.averageDuration) < 500 ? 'healthy' : 'degraded',
        resourceHealth: this.monitorResources().filter((r) => parseFloat(r.duration) > 2000).length === 0 ? 'healthy' : 'degraded',
      },
    };
  }

  /**
   * Calculate overall health score
   */
  calculateHealthScore(analysis) {
    let score = 100;

    score -= Math.min(20, parseFloat(analysis.averageDuration) / 100);
    score -= Math.min(30, parseFloat(analysis.errorCount) * 5);
    score -= Math.min(20, (100 - parseFloat(analysis.successRate)));

    return Math.max(0, score);
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations() {
    const bottlenecks = this.detectBottlenecks();
    const recommendations = [];

    bottlenecks.forEach((b) => {
      if (b.type === 'high_latency') {
        recommendations.push({
          area: 'Network',
          suggestion: 'Enable compression and consider CDN for content delivery',
          priority: 'high',
        });
      }

      if (b.type === 'slow_resources') {
        recommendations.push({
          area: 'Resources',
          suggestion: 'Optimize large assets, implement lazy loading',
          priority: 'high',
        });
      }

      if (b.type === 'high_error_rate') {
        recommendations.push({
          area: 'Network Stability',
          suggestion: 'Implement retry logic and error handling',
          priority: 'medium',
        });
      }
    });

    return recommendations;
  }

  /**
   * Export diagnostic data
   */
  exportData() {
    return {
      exportedAt: new Date().toISOString(),
      packetLog: this.packetLog,
      performanceMetrics: this.performanceMetrics,
      reports: this.diagnosticReports,
      summary: {
        totalPackets: this.packetLog.length,
        totalReports: this.diagnosticReports.length,
        timeSpan: this.packetLog.length > 0
          ? (this.packetLog[this.packetLog.length - 1].timestamp - this.packetLog[0].timestamp) / 1000
          : 0,
      },
    };
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(interval = 5000) {
    if (this.networkMonitoring) return;

    this.networkMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.generateReport();
    }, interval);

    return { monitoring: true, interval };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.networkMonitoring = false;
    }
    return { monitoring: false };
  }

  /**
   * Group items by property
   */
  groupBy(items, property) {
    return items.reduce((acc, item) => {
      const key = item[property];
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Generate packet ID
   */
  generatePacketId() {
    return `pkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.packetLog = [];
    this.performanceMetrics = [];
    return { success: true };
  }
}

/**
 * Render diagnostics dashboard
 */
function renderDiagnosticsDashboard(containerId, diagnostics) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const report = diagnostics.generateReport();
  const health = report.systemHealth;

  const html = `
    <div class="diagnostics-dashboard">
      <h2>System Diagnostics</h2>

      <div class="health-indicator">
        <h3>System Health: <span class="health-${health.overall}">${health.overall.toUpperCase()}</span></h3>
        <div class="health-score">
          <div class="score-bar">
            <div class="score-fill" style="width: ${health.healthScore}%"></div>
          </div>
          <p>${health.healthScore}/100</p>
        </div>
      </div>

      <div class="diagnostics-grid">
        <div class="panel">
          <h4>Network Analysis</h4>
          <ul>
            <li>Total Packets: ${report.networkAnalysis.totalPackets}</li>
            <li>Success Rate: ${report.networkAnalysis.successRate}%</li>
            <li>Avg Duration: ${report.networkAnalysis.averageDuration}ms</li>
            <li>Total Data: ${(report.networkAnalysis.totalDataTransferred / 1024).toFixed(2)} KB</li>
          </ul>
        </div>

        <div class="panel">
          <h4>Performance</h4>
          ${report.performanceMetrics ? `
            <ul>
              <li>Total Load: ${report.performanceMetrics.total}ms</li>
              <li>DOM Ready: ${report.performanceMetrics.dom}ms</li>
              <li>TTFB: ${report.performanceMetrics.ttfb}ms</li>
              <li>Download: ${report.performanceMetrics.download}ms</li>
            </ul>
          ` : '<p>No performance data available</p>'}
        </div>

        <div class="panel">
          <h4>Bottlenecks (${report.bottlenecks.length})</h4>
          ${report.bottlenecks.length > 0 ? `
            <ul>
              ${report.bottlenecks.map((b) => `<li class="severity-${b.severity}">${b.message}</li>`).join('')}
            </ul>
          ` : '<p>No bottlenecks detected</p>'}
        </div>

        <div class="panel">
          <h4>Recommendations</h4>
          ${report.recommendations.length > 0 ? `
            <ul>
              ${report.recommendations.map((r) => `<li><strong>${r.area}:</strong> ${r.suggestion}</li>`).join('')}
            </ul>
          ` : '<p>No recommendations at this time</p>'}
        </div>
      </div>

      <div class="dashboard-controls">
        <button class="start-monitoring">Start Monitoring</button>
        <button class="generate-report">Generate Report</button>
        <button class="export-data">Export Data</button>
        <button class="clear-logs">Clear Logs</button>
      </div>
    </div>
  `;

  container.innerHTML = html;

  container.querySelector('.start-monitoring').addEventListener('click', () => {
    diagnostics.startMonitoring();
    alert('Monitoring started');
  });

  container.querySelector('.generate-report').addEventListener('click', () => {
    const newReport = diagnostics.generateReport();
    console.log('Diagnostic Report:', newReport);
  });

  container.querySelector('.export-data').addEventListener('click', () => {
    const data = diagnostics.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-${Date.now()}.json`;
    a.click();
  });

  container.querySelector('.clear-logs').addEventListener('click', () => {
    if (confirm('Clear all diagnostic logs?')) {
      diagnostics.clearLogs();
      alert('Logs cleared');
    }
  });
}

// Auto-initialize
window.diagnostics = new DiagnosticsEngine();
