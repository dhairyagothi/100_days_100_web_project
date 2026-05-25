import { useState } from "react";
import PredictionForm from "../components/PredictionForm";
import ResultCard from "../components/ResultCard";
import Charts from "../components/Charts";

export default function PredictPage({ onPrediction, history }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePrediction = (result, inputData) => {
    setPrediction(result.predicted_sales);
    onPrediction(result, inputData); // bubble up to App to store in history
  };

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Sales Prediction Dashboard</h1>
          <p className="subtitle">Enter product & outlet details to predict item outlet sales</p>
        </div>
        {prediction && (
          <div className="header-badge">
            Last: ₹{prediction.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </div>
        )}
      </header>

      {/* Form + Result side by side */}
      <div className="top-row">
        <PredictionForm
          onPrediction={handlePrediction}
          setLoading={setLoading}
          setError={setError}
          loading={loading}
        />
        <ResultCard prediction={prediction} loading={loading} error={error} />
      </div>

      {/* Charts appear after first prediction */}
      {history.length > 0 ? (
        <Charts history={history} />
      ) : (
        <div className="empty-charts">
          <span>📈</span>
          <p>Charts will appear here after your first prediction</p>
        </div>
      )}
    </>
  );
}
