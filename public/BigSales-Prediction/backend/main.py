# 1. IMPORTS
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
import os

# 2. CREATE THE FASTAPI APP INSTANCE
app = FastAPI(
    title="Big Sales Prediction API",
    description="Predict item outlet sales using a Random Forest Regressor",
    version="1.0.0"
)

# 3. CORS MIDDLEWARE
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. LOAD MODEL AND SCALER
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
    print("✅ Model and Scaler loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ ERROR: Could not find model files. Make sure model.pkl and scaler.pkl are in the backend/ folder.")
    print(f"   Detail: {e}")
    model = None
    scaler = None

# 5. INPUT DATA MODEL (Pydantic BaseModel)
class SalesInput(BaseModel):
    Item_Weight: float = Field(..., example=9.3, description="Weight of the product")
    Item_Fat_Content: int = Field(..., example=0, description="0 = Low Fat, 1 = Regular")
    Item_Visibility: float = Field(..., example=0.016, description="Display area % in store")
    Item_Type: int = Field(..., example=0, description="0=Food, 1=Health/Household, 2=Others")
    Item_MRP: float = Field(..., example=249.8, description="Maximum Retail Price of product")
    Outlet_Identifier: int = Field(..., example=1, description="Store ID encoded 0-9")
    Outlet_Establishment_Year: int = Field(..., example=1999, description="Year store was opened")
    Outlet_Size: int = Field(..., example=1, description="0=Small, 1=Medium, 2=High")
    Outlet_Location_Type: int = Field(..., example=0, description="0=Tier1, 1=Tier2, 2=Tier3")
    Outlet_Type: int = Field(..., example=1, description="0=Grocery, 1=Supermarket Type1, 2=Type2, 3=Type3")


# 6. HELPER FUNCTION — Preprocess Input
def preprocess_input(data: SalesInput) -> np.ndarray:
    # Step 1: Extract the 4 columns that need scaling
    cols_to_scale = np.array([[
        data.Item_Weight,
        data.Item_Visibility,
        data.Item_MRP,
        data.Outlet_Establishment_Year
    ]])

    # Step 2: Apply the saved StandardScaler
    scaled = scaler.transform(cols_to_scale)[0]

    # Step 3: Build the final feature array in the SAME ORDER as training    
    features = np.array([[
        scaled[0],                    # Item_Weight (scaled)
        data.Item_Fat_Content,        # not scaled (already encoded 0/1)
        scaled[1],                    # Item_Visibility (scaled)
        data.Item_Type,               # not scaled (already encoded 0/1/2)
        scaled[2],                    # Item_MRP (scaled)
        data.Outlet_Identifier,       # not scaled (already encoded 0-9)
        scaled[3],                    # Outlet_Establishment_Year (scaled)
        data.Outlet_Size,             # not scaled (already encoded 0/1/2)
        data.Outlet_Location_Type,    # not scaled (already encoded 0/1/2)
        data.Outlet_Type              # not scaled (already encoded 0/1/2/3)
    ]])

    return features


# 7. API ENDPOINTS
@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "Big Sales Prediction API is live 🚀",
        "model_loaded": model is not None
    }

@app.post("/predict")
def predict_sales(data: SalesInput):
    # Guard: make sure model loaded correctly
    if model is None or scaler is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Check that model.pkl and scaler.pkl exist in backend/"
        )

    try:
        # Preprocess the input
        features = preprocess_input(data)

        # Get prediction from Random Forest model
        prediction = model.predict(features)[0]

        # Round to 2 decimal places (it's a sales value in currency)
        predicted_sales = round(float(prediction), 2)

        return {
            "status": "success",
            "predicted_sales": predicted_sales,
            "currency": "INR",
            "input_received": data.dict()   # echo back what was sent (useful for debugging)
        }

    except Exception as e:
        # If anything goes wrong, return a proper error response
        raise HTTPException(status_code=400, detail=f"Prediction failed: {str(e)}")

@app.get("/sample")
def get_sample_input():
    return {
        "sample": {
            "Item_Weight": 9.3,
            "Item_Fat_Content": 0,
            "Item_Visibility": 0.016,
            "Item_Type": 0,
            "Item_MRP": 249.8,
            "Outlet_Identifier": 1,
            "Outlet_Establishment_Year": 1999,
            "Outlet_Size": 1,
            "Outlet_Location_Type": 0,
            "Outlet_Type": 1
        },
        "encoding_guide": {
            "Item_Fat_Content": {"0": "Low Fat", "1": "Regular"},
            "Item_Type": {"0": "Food", "1": "Health & Household", "2": "Others"},
            "Outlet_Size": {"0": "Small", "1": "Medium", "2": "High"},
            "Outlet_Location_Type": {"0": "Tier 1", "1": "Tier 2", "2": "Tier 3"},
            "Outlet_Type": {"0": "Grocery Store", "1": "Supermarket Type1", "2": "Supermarket Type2", "3": "Supermarket Type3"}
        }
    }
