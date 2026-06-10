import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ScatterChart, Scatter, ZAxis
} from "recharts";

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const date = new Date(data.date).toLocaleDateString("en-GB");
    const type = data.type;
    const rating = data.rating;

    return (
      <div style={{
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "4px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <p style={{ margin: "0 0 5px" }}><strong>Date:</strong> {date}</p>
        <p style={{ margin: "0 0 5px" }}><strong>Rating:</strong> {rating}</p>
        <p style={{ margin: "0" }}><strong>Type:</strong> {type}</p>
      </div>
    );
  }
  return null;
};

function Home() {
  const [entries, setEntries] = useState([]);
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const CATEGORIES = ["Book", "Movie", "Poem", "Music", "Theatre Play"];

  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem("musemeter_entries")) || [];
    setEntries(savedEntries);
  }, []);

  // --- Pie chart data (count per type) ---
  const typeCounts = entries.reduce((acc, entry) => {
    acc[entry.displayType] = (acc[entry.displayType] || 0) + 1;
    return acc;
  }, {});

  const pieData = CATEGORIES.map(type => ({
    name: type,
    value: typeCounts[type] || 0,
  }));

  // --- Bar chart data (average rating per type) ---
  const ratingData = Object.values(
    entries.reduce((acc, entry) => {
      if (!acc[entry.displayType]) {
        acc[entry.displayType] = { type: entry.displayType, total: 0, count: 0 };
      }
      acc[entry.displayType].total += Number(entry.rating);
      acc[entry.displayType].count += 1;
      return acc;
    }, {})
  ).map(item => ({
    type: item.type,
    avgRating: (item.total / item.count).toFixed(2),
  }));

  // --- Scatter chart data (date vs type) ---
  const scatterData = entries.map(entry => ({
    date: new Date(entry.dateAdded).getTime(),
    type: entry.displayType,
    rating: Number(entry.rating),
  }));

  const typeToIndex = type => CATEGORIES.indexOf(type);

  const scatterPlotData = scatterData
    .filter(item => CATEGORIES.includes(item.type))
    .map(item => ({
      date: item.date,
      typeIndex: typeToIndex(item.type),
      rating: item.rating,
      type: item.type,
    }));
  
  // Note: The topFavourites logic has been removed here.

  return (
    <div style={{ padding: "1.5rem", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
        📊 MuseMeter Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateRows: "120px 350px 200px",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "1.5rem",
          height: "calc(100vh - 100px)",
        }}
      >
        {/* --- Row 1: Top Tiles --- */}
        <div
          style={{
            gridColumn: "1 / span 3",
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {CATEGORIES.map((cat, idx) => (
            <div
              key={cat}
              style={{
                flex: 1,
                background: COLORS[idx % COLORS.length],
                color: "white",
                borderRadius: "12px",
                padding: "0.8rem",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <h3 style={{ margin: "0", fontSize: "1rem" }}>{cat}</h3>
              <p style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
                {typeCounts[cat] || 0}
              </p>
            </div>
          ))}
        </div>

        {/* --- Row 2: Charts --- */}
        {/* Pie Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Entries by Type
          </h3>
          <PieChart width={280} height={280}>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Bar Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Average Rating per Type
          </h3>
          <BarChart width={280} height={280} data={ratingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Bar dataKey="avgRating" fill="#6b7280" />
          </BarChart>
        </div>

        {/* Scatter Chart */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Logging Activity Over Time
          </h3>
          <ScatterChart width={280} height={280}>
            <CartesianGrid />
            <XAxis
              dataKey="date"
              domain={["auto", "auto"]}
              name="Date"
              type="number"
              tick={false}
            />
            <YAxis
              dataKey="typeIndex"
              name="Type"
              tickFormatter={(index) => CATEGORIES[index]}
              type="number"
            />
            <ZAxis dataKey="rating" range={[50, 200]} name="Rating" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={<CustomTooltip />} />
            <Scatter name="Entries" data={scatterPlotData} fill="#f472b6" />
          </ScatterChart>
        </div>
      </div>
    </div>
  );
}

export default Home;
// Note: The topFavourites logic has been removed here.