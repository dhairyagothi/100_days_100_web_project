export default function ResultCard({ prediction, loading, error }) {
  return (
    <div className="card result-card">
      <div className="card-header">
        <h2>Prediction Result</h2>
      </div>

      <div className="result-body">
        {/* Loading state */}
        {loading && (
          <div className="result-state">
            <div className="pulse-ring" />
            <p>Running model…</p>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="result-state error-state">
            <span className="result-icon">⚠️</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {/* Success state */}
        {!loading && !error && prediction !== null && (
          <div className="result-success">
            <span className="result-label">Predicted Outlet Sales</span>
            <div className="result-amount">
              ₹{prediction.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
            <div className="result-range">
              <div className="range-item">
                <span className="range-dot low" />
                <span>Low: ₹{Math.round(prediction * 0.85).toLocaleString("en-IN")}</span>
              </div>
              <div className="range-item">
                <span className="range-dot high" />
                <span>High: ₹{Math.round(prediction * 1.15).toLocaleString("en-IN")}</span>
              </div>
            </div>
            <p className="result-note">
              ±15% estimated confidence interval
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && prediction === null && (
          <div className="result-state empty-state">
            <span className="result-icon">📦</span>
            <p>Fill in the form and hit <strong>Predict Sales</strong> to see the result here</p>
          </div>
        )}
      </div>

      {/* Stats strip — only shows after prediction */}
      {prediction !== null && !loading && (
        <div className="stats-strip">
          <div className="stat">
            <span className="stat-label">Model</span>
            <span className="stat-value">Random Forest</span>
          </div>
          <div className="stat">
            <span className="stat-label">Backend</span>
            <span className="stat-value">FastAPI</span>
          </div>
          <div className="stat">
            <span className="stat-label">Status</span>
            <span className="stat-value green">✓ Live</span>
          </div>
        </div>
      )}
    </div>
  );
}
