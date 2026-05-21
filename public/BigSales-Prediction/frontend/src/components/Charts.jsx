import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from "recharts";

// Custom tooltip for a cleaner look
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
      }}>
        <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ margin: "4px 0 0", color: p.color }}>
            {p.name}: ₹{Number(p.value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Charts({ history }) {
  // Prepare data for charts
  const barData = history.map((h) => ({
    name: `#${h.id}`,
    Sales: Math.round(h.sales),
    MRP: Math.round(h.mrp),
  }));

  // Group sales by outlet type for breakdown chart
  const outletMap = {};
  history.forEach((h) => {
    if (!outletMap[h.outletType]) outletMap[h.outletType] = { total: 0, count: 0 };
    outletMap[h.outletType].total += h.sales;
    outletMap[h.outletType].count += 1;
  });
  const outletData = Object.entries(outletMap).map(([name, v]) => ({
    name,
    "Avg Sales": Math.round(v.total / v.count),
  }));

  return (
    <div className="charts-section">
      <h2 className="section-title">Prediction Analytics</h2>

      <div className="charts-grid">
        {/* Chart 1: Sales per prediction (line) */}
        <div className="card chart-card">
          <h3 className="chart-title">Sales Trend</h3>
          <p className="chart-sub">Predicted sales across all runs</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="Sales"
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ fill: "#4f46e5", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Sales vs MRP (bar) */}
        <div className="card chart-card">
          <h3 className="chart-title">Sales vs MRP</h3>
          <p className="chart-sub">Compare predicted sales with item MRP</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Sales" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="MRP" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Average sales by outlet type */}
        {outletData.length > 0 && (
          <div className="card chart-card chart-wide">
            <h3 className="chart-title">Avg Sales by Outlet Type</h3>
            <p className="chart-sub">Which outlet type generates the most predicted sales?</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={outletData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Avg Sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
