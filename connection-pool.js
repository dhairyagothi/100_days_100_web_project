/**
 * Connection Pool Management and Resource Optimization - Issue #8787
 * Efficient resource pooling, connection lifecycle management, and optimization
 */

class ConnectionPool {
  constructor(options = {}) {
    this.maxConnections = options.maxConnections || 10;
    this.minConnections = options.minConnections || 2;
    this.idleTimeout = options.idleTimeout || 30000;
    this.maxWaitTime = options.maxWaitTime || 5000;

    this.pool = [];
    this.waiting = [];
    this.stats = {
      created: 0,
      destroyed: 0,
      reused: 0,
      waiting: 0,
      errors: 0,
    };

    this.initializePool();
  }

  /**
   * Initialize pool with minimum connections
   */
  initializePool() {
    for (let i = 0; i < this.minConnections; i++) {
      this.createConnection();
    }
  }

  /**
   * Create a new connection
   */
  createConnection() {
    if (this.pool.length >= this.maxConnections) {
      return null;
    }

    const connection = {
      id: this.generateConnectionId(),
      createdAt: Date.now(),
      lastUsedAt: Date.now(),
      inUse: false,
      queries: 0,
      errors: 0,
      duration: 0,
    };

    this.pool.push(connection);
    this.stats.created += 1;
    return connection;
  }

  /**
   * Get available connection from pool
   */
  getConnection() {
    if (this.waiting.length >= this.maxWaitTime) {
      this.stats.errors += 1;
      throw new Error('Connection pool timeout');
    }

    const availableConnection = this.pool.find(
      (conn) => !conn.inUse && conn.createdAt + this.idleTimeout > Date.now()
    );

    if (availableConnection) {
      availableConnection.inUse = true;
      availableConnection.lastUsedAt = Date.now();
      this.stats.reused += 1;
      return availableConnection;
    }

    if (this.pool.length < this.maxConnections) {
      const newConnection = this.createConnection();
      if (newConnection) {
        newConnection.inUse = true;
        return newConnection;
      }
    }

    const waitPromise = new Promise((resolve) => {
      this.waiting.push({ resolve, timestamp: Date.now() });
    });

    return waitPromise;
  }

  /**
   * Release connection back to pool
   */
  releaseConnection(connection) {
    if (!connection) return;

    connection.inUse = false;
    connection.lastUsedAt = Date.now();

    if (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      const waitConnection = this.pool.find((c) => !c.inUse);
      if (waitConnection) {
        waitConnection.inUse = true;
        waiter.resolve(waitConnection);
      }
    }
  }

  /**
   * Execute operation with connection management
   */
  async executeQuery(operation) {
    const connection = await this.getConnection();
    const startTime = Date.now();

    try {
      connection.queries += 1;
      const result = await operation(connection);
      const duration = Date.now() - startTime;
      connection.duration += duration;
      return { success: true, result, duration };
    } catch (error) {
      connection.errors += 1;
      this.stats.errors += 1;
      throw error;
    } finally {
      this.releaseConnection(connection);
    }
  }

  /**
   * Remove idle connections
   */
  removeIdleConnections() {
    const now = Date.now();
    const removed = [];

    for (let i = this.pool.length - 1; i >= 0; i--) {
      const connection = this.pool[i];
      if (
        !connection.inUse &&
        connection.lastUsedAt + this.idleTimeout < now &&
        this.pool.length > this.minConnections
      ) {
        removed.push(connection.id);
        this.pool.splice(i, 1);
        this.stats.destroyed += 1;
      }
    }

    return removed;
  }

  /**
   * Get pool statistics
   */
  getStatistics() {
    const activeConnections = this.pool.filter((c) => c.inUse).length;
    const idleConnections = this.pool.filter((c) => !c.inUse).length;
    const avgQueryTime =
      this.stats.reused > 0
        ? (this.pool.reduce((sum, c) => sum + c.duration, 0) /
            this.pool.reduce((sum, c) => sum + c.queries, 0))
          .toFixed(2)
        : 0;

    return {
      poolSize: this.pool.length,
      maxConnections: this.maxConnections,
      minConnections: this.minConnections,
      activeConnections,
      idleConnections,
      waitingRequests: this.waiting.length,
      totalCreated: this.stats.created,
      totalDestroyed: this.stats.destroyed,
      totalReused: this.stats.reused,
      totalErrors: this.stats.errors,
      avgQueryTime,
      utilizationRate: ((activeConnections / this.maxConnections) * 100).toFixed(1),
    };
  }

  /**
   * Health check all connections
   */
  healthCheck() {
    const unhealthy = [];

    this.pool.forEach((connection) => {
      if (connection.errors > 5) {
        unhealthy.push({
          id: connection.id,
          errors: connection.errors,
          reason: 'High error count',
        });
      }

      const idleTime = Date.now() - connection.lastUsedAt;
      if (idleTime > this.idleTimeout && !connection.inUse) {
        unhealthy.push({
          id: connection.id,
          idleTime,
          reason: 'Exceeded idle timeout',
        });
      }
    });

    return {
      healthy: this.pool.length - unhealthy.length,
      unhealthy: unhealthy.length,
      issues: unhealthy,
    };
  }

  /**
   * Drain pool and close all connections
   */
  drain() {
    this.pool.forEach((connection) => {
      connection.inUse = false;
    });

    this.waiting = [];
    this.stats.destroyed += this.pool.length;
    this.pool = [];

    return { success: true, message: 'Pool drained' };
  }

  /**
   * Generate unique connection ID
   */
  generateConnectionId() {
    return `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connection details
   */
  getConnectionDetails(connectionId) {
    return this.pool.find((c) => c.id === connectionId);
  }

  /**
   * Resize pool
   */
  resizePool(newMax) {
    if (newMax < this.minConnections) {
      return { success: false, error: 'Max cannot be less than min' };
    }

    const oldMax = this.maxConnections;
    this.maxConnections = newMax;

    if (newMax < this.pool.length) {
      const toRemove = this.pool.length - newMax;
      for (let i = 0; i < toRemove; i++) {
        const idleConn = this.pool.find((c) => !c.inUse);
        if (idleConn) {
          this.pool = this.pool.filter((c) => c.id !== idleConn.id);
          this.stats.destroyed += 1;
        }
      }
    }

    return {
      success: true,
      oldMax,
      newMax,
      currentSize: this.pool.length,
    };
  }

  /**
   * Monitor pool performance
   */
  startMonitoring(interval = 10000) {
    if (this.monitoringInterval) return;

    this.monitoringInterval = setInterval(() => {
      this.removeIdleConnections();
      const stats = this.getStatistics();
      const health = this.healthCheck();

      if (health.unhealthy > 0) {
        console.warn('Unhealthy connections detected:', health.issues);
      }

      if (stats.waitingRequests > 0) {
        console.warn(`${stats.waitingRequests} requests waiting for connection`);
      }
    }, interval);

    return { monitoring: true, interval };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    return { monitoring: false };
  }
}

/**
 * Resource optimization utility
 */
class ResourceOptimizer {
  constructor(connectionPool) {
    this.pool = connectionPool;
  }

  /**
   * Optimize pool based on usage patterns
   */
  optimizePoolSize() {
    const stats = this.pool.getStatistics();
    const utilization = parseFloat(stats.utilizationRate);

    if (utilization > 80 && stats.poolSize < stats.maxConnections) {
      console.log('Increasing pool size due to high utilization');
      this.pool.createConnection();
    } else if (utilization < 20 && stats.poolSize > stats.minConnections) {
      this.pool.removeIdleConnections();
      console.log('Decreasing pool size due to low utilization');
    }

    return {
      optimized: true,
      utilization,
      action: utilization > 80 ? 'increased' : utilization < 20 ? 'decreased' : 'maintained',
    };
  }

  /**
   * Get optimization recommendations
   */
  getRecommendations() {
    const stats = this.pool.getStatistics();
    const recommendations = [];

    if (stats.waitingRequests > 0) {
      recommendations.push({
        level: 'warning',
        message: `${stats.waitingRequests} requests waiting. Consider increasing max pool size.`,
      });
    }

    if (stats.totalErrors > stats.totalReused * 0.1) {
      recommendations.push({
        level: 'error',
        message: 'High error rate detected. Check connection health.',
      });
    }

    if (parseFloat(stats.avgQueryTime) > 1000) {
      recommendations.push({
        level: 'warning',
        message: 'High average query time. Consider optimizing queries.',
      });
    }

    return recommendations;
  }

  /**
   * Generate performance report
   */
  generateReport() {
    return {
      statistics: this.pool.getStatistics(),
      health: this.pool.healthCheck(),
      recommendations: this.getRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Render pool monitoring dashboard
 */
function renderPoolMonitor(containerId, connectionPool) {
  const container = document.getElementById(containerId);
  if (!container) return;

  function updateDashboard() {
    const stats = connectionPool.getStatistics();
    const health = connectionPool.healthCheck();

    const html = `
      <div class="pool-monitor">
        <h3>Connection Pool Monitor</h3>
        <div class="monitor-grid">
          <div class="monitor-card">
            <h4>${stats.poolSize}/${stats.maxConnections}</h4>
            <p>Active Connections</p>
          </div>
          <div class="monitor-card">
            <h4>${stats.activeConnections}</h4>
            <p>In Use</p>
          </div>
          <div class="monitor-card">
            <h4>${stats.idleConnections}</h4>
            <p>Idle</p>
          </div>
          <div class="monitor-card">
            <h4>${stats.utilizationRate}%</h4>
            <p>Utilization</p>
          </div>
          <div class="monitor-card">
            <h4>${stats.totalReused}</h4>
            <p>Reused</p>
          </div>
          <div class="monitor-card">
            <h4>${stats.totalErrors}</h4>
            <p>Errors</p>
          </div>
        </div>

        <div class="health-status">
          <h4>Health Status</h4>
          <p>Healthy: ${health.healthy} | Unhealthy: ${health.unhealthy}</p>
          ${
            health.issues.length > 0
              ? `<div class="issues">${health.issues.map((i) => `<p>${i.reason}</p>`).join('')}</div>`
              : '<p>All connections healthy</p>'
          }
        </div>

        <button class="refresh-btn">Refresh</button>
      </div>
    `;

    container.innerHTML = html;
    container.querySelector('.refresh-btn').addEventListener('click', updateDashboard);
  }

  updateDashboard();
  setInterval(updateDashboard, 5000);
}

// Auto-initialize
window.connectionPool = new ConnectionPool({
  maxConnections: 20,
  minConnections: 5,
  idleTimeout: 30000,
});

window.resourceOptimizer = new ResourceOptimizer(window.connectionPool);
