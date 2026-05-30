import { useState } from "react";
import axios from "axios";

// Default form values — matches your /sample endpoint
const DEFAULT_VALUES = {
  Item_Weight: 9.3,
  Item_Fat_Content: 0,
  Item_Visibility: 0.016,
  Item_Type: 0,
  Item_MRP: 249.8,
  Outlet_Identifier: 1,
  Outlet_Establishment_Year: 1999,
  Outlet_Size: 1,
  Outlet_Location_Type: 0,
  Outlet_Type: 1,
};

export default function PredictionForm({ onPrediction, setLoading, setError, loading }) {
  const [formData, setFormData] = useState(DEFAULT_VALUES);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // Convert to number since all fields are numeric
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // POST to your FastAPI backend
      const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const response = await axios.post(`${BASE_URL}/predict`, formData);
      onPrediction(response.data, formData);
    } catch (err) {
      const message =
        err.response?.data?.detail || "Could not connect to backend. Is it running?";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_VALUES);
    setError(null);
  };

  return (
    <div className="card form-card">
      <div className="card-header">
        <h2>Product Details</h2>
        <button className="btn-ghost" onClick={handleReset} type="button">
          Reset
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── Row 1 ── */}
        <div className="form-row">
          <div className="form-group">
            <label>Item Weight (kg)</label>
            <input
              type="number"
              name="Item_Weight"
              value={formData.Item_Weight}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Item MRP (₹)</label>
            <input
              type="number"
              name="Item_MRP"
              value={formData.Item_MRP}
              onChange={handleChange}
              step="0.1"
              min="0"
            />
          </div>
        </div>

        {/* ── Row 2 ── */}
        <div className="form-row">
          <div className="form-group">
            <label>Item Visibility</label>
            <input
              type="number"
              name="Item_Visibility"
              value={formData.Item_Visibility}
              onChange={handleChange}
              step="0.001"
              min="0"
              max="1"
            />
            <span className="hint">Display area fraction (0 – 1)</span>
          </div>
          <div className="form-group">
            <label>Establishment Year</label>
            <input
              type="number"
              name="Outlet_Establishment_Year"
              value={formData.Outlet_Establishment_Year}
              onChange={handleChange}
              min="1980"
              max="2020"
            />
          </div>
        </div>

        {/* ── Dropdowns ── */}
        <div className="form-row">
          <div className="form-group">
            <label>Fat Content</label>
            <select name="Item_Fat_Content" value={formData.Item_Fat_Content} onChange={handleChange}>
              <option value={0}>Low Fat</option>
              <option value={1}>Regular</option>
            </select>
          </div>
          <div className="form-group">
            <label>Item Type</label>
            <select name="Item_Type" value={formData.Item_Type} onChange={handleChange}>
              <option value={0}>Food</option>
              <option value={1}>Health &amp; Household</option>
              <option value={2}>Others</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Outlet Size</label>
            <select name="Outlet_Size" value={formData.Outlet_Size} onChange={handleChange}>
              <option value={0}>Small</option>
              <option value={1}>Medium</option>
              <option value={2}>High</option>
            </select>
          </div>
          <div className="form-group">
            <label>Outlet Location</label>
            <select name="Outlet_Location_Type" value={formData.Outlet_Location_Type} onChange={handleChange}>
              <option value={0}>Tier 1</option>
              <option value={1}>Tier 2</option>
              <option value={2}>Tier 3</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Outlet Type</label>
            <select name="Outlet_Type" value={formData.Outlet_Type} onChange={handleChange}>
              <option value={0}>Grocery Store</option>
              <option value={1}>Supermarket Type 1</option>
              <option value={2}>Supermarket Type 2</option>
              <option value={3}>Supermarket Type 3</option>
            </select>
          </div>
          <div className="form-group">
            <label>Outlet Identifier</label>
            <select name="Outlet_Identifier" value={formData.Outlet_Identifier} onChange={handleChange}>
              {[...Array(10)].map((_, i) => (
                <option key={i} value={i}>Outlet {i}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-predict" disabled={loading}>
          {loading ? (
            <><span className="spinner" /> Predicting…</>
          ) : (
            "🎯 Predict Sales"
          )}
        </button>
      </form>
    </div>
  );
}
