import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PredictPage from "./pages/PredictPage";
import HistoryPage from "./pages/HistoryPage";
import "./styles/App.css";

export default function App() {
  // history lives here so BOTH pages share the same data
  // PredictPage adds entries, HistoryPage reads them
  const [history, setHistory] = useState([]);

  const addToHistory = (result, inputData) => {
    const entry = {
      id: Date.now(),
      sales: result.predicted_sales,
      mrp: inputData.Item_MRP,
      weight: inputData.Item_Weight,
      visibility: inputData.Item_Visibility,
      fatContent: inputData.Item_Fat_Content === 0 ? "Low Fat" : "Regular",
      itemType: ["Food", "Health & Household", "Others"][inputData.Item_Type],
      outletType: ["Grocery", "Supermarket 1", "Supermarket 2", "Supermarket 3"][inputData.Outlet_Type],
      outletSize: ["Small", "Medium", "High"][inputData.Outlet_Size],
      location: ["Tier 1", "Tier 2", "Tier 3"][inputData.Outlet_Location_Type],
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString("en-IN"),
    };
    setHistory((prev) => [entry, ...prev]); // newest first
  };

  return (
    <div className="app-layout">
      {/* Sidebar always visible — passes history count for the badge */}
      <Sidebar historyCount={history.length} />

      <main className="main-content">
        {/* React Router renders the right page based on URL */}
        <Routes>
          <Route
            path="/"
            element={<PredictPage onPrediction={addToHistory} history={history} />}
          />
          <Route
            path="/history"
            element={<HistoryPage history={history} />}
          />
        </Routes>
      </main>
    </div>
  );
}
