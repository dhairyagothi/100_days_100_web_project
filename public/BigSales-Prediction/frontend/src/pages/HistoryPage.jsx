import { useNavigate } from "react-router-dom";

export default function HistoryPage({ history }) {
  // useNavigate gives us a function to programmatically change pages
  const navigate = useNavigate();

  // Summary stats computed from history
  const total = history.length;
  const avgSales = total > 0
    ? Math.round(history.reduce((sum, h) => sum + h.sales, 0) / total)
    : 0;
  const highest = total > 0
    ? Math.round(Math.max(...history.map((h) => h.sales)))
    : 0;
  const lowest = total > 0
    ? Math.round(Math.min(...history.map((h) => h.sales)))
    : 0;

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Prediction History</h1>
          <p className="subtitle">All predictions made in this session</p>
        </div>
        <button className="btn-ghost" onClick={() => navigate("/")}>
          ← Back to Predict
        </button>
      </header>

      {/* ── Summary Stats ── */}
      {total > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-card-label">Total Predictions</span>
            <span className="stat-card-value">{total}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Average Sales</span>
            <span className="stat-card-value">
              ₹{avgSales.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Highest</span>
            <span className="stat-card-value green">
              ₹{highest.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Lowest</span>
            <span className="stat-card-value amber">
              ₹{lowest.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      {/* ── Table ── */}
      {total === 0 ? (
        <div className="empty-charts" style={{ marginTop: 24 }}>
          <span>🗂️</span>
          <p>No predictions yet. Go to <strong>Predict</strong> and run your first one!</p>
          <button className="btn-predict" style={{ marginTop: 8, width: "auto", padding: "10px 24px" }} onClick={() => navigate("/")}>
            Go to Predict →
          </button>
        </div>
      ) : (
        <div className="card" style={{ overflow: "auto", marginTop: 8 }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>Predicted Sales</th>
                <th>MRP</th>
                <th>Item Type</th>
                <th>Fat Content</th>
                <th>Outlet Type</th>
                <th>Outlet Size</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={h.id}>
                  <td className="muted">{i + 1}</td>
                  <td className="muted">{h.timestamp}</td>
                  <td className="sales-cell">
                    ₹{Math.round(h.sales).toLocaleString("en-IN")}
                  </td>
                  <td>₹{h.mrp}</td>
                  <td>{h.itemType}</td>
                  <td>
                    <span className={`badge ${h.fatContent === "Low Fat" ? "badge-green" : "badge-amber"}`}>
                      {h.fatContent}
                    </span>
                  </td>
                  <td>{h.outletType}</td>
                  <td>{h.outletSize}</td>
                  <td>{h.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
