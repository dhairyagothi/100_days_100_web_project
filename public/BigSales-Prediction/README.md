# 🛒 Big Sales Prediction

This project is a full-stack web application designed to predict item outlet sales using a Random Forest Regressor. It takes various product and store attributes such as item weight, maximum retail price (MRP), and outlet location typeto generate an estimated sales figure in INR. 

## 🚀 Tech Stack

*   **Frontend:** React, Vite
*   **Backend:** FastAPI, Python, Pydantic
*   **Machine Learning:** scikit-learn (RandomForestRegressor, StandardScaler), Pandas, NumPy, Joblib
*   **Deployment Config:** Render (via `render.yaml`)

## 📂 Project Structure

The project is organized into two primary directories for the frontend and backend, alongside the original machine learning script.

```text
BigSales-Prediction/
├── backend/
│   ├── main.py                # FastAPI application and endpoints
│   ├── model.pkl              # Pre-trained Random Forest model
│   ├── render.yaml            # Render deployment configuration
│   ├── requirements.txt       # Python dependencies
│   └── scaler.pkl             # StandardScaler for data preprocessing
├── frontend/
│   ├── public/                # Static assets (index.html, favicons)
│   ├── src/
│   │   ├── assets/            # Images and SVGs (hero.png, react.svg)
│   │   ├── components/        # React components (Charts, PredictionForm, ResultCard, Sidebar)
│   │   ├── pages/             # Route pages (HistoryPage, PredictPage)
│   │   ├── styles/            # CSS files (App.css, index.css)
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # React entry point
│   ├── package.json           # Node dependencies and scripts
│   └── vite.config.js         # Vite configuration
├── README.md                  # Project documentation
└── ybi_intern.py              # Original ML model training and evaluation script
```
## ⚙️ Setup and Installation

### 1. Backend Setup
The backend runs on FastAPI and requires the pre-trained `model.pkl` and `scaler.pkl` files to serve predictions.
#### Python Version Compatibility
Some contributors may encounter dependency installation issues on newer Python versions while running:

```bash
   pip install -r requirements.txt
```
If installation fails, please verify that your Python version is compatible with the package versions specified in requirements.txt.

During testing, dependency installation issues were encountered on Python 3.13, which prevented the backend dependencies from being installed successfully.
1. Navigate to the backend directory:
```bash
   cd backend
```
2. Create a virtual environment and activate it:
```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
```
3. Install the required dependencies:
```bash
   pip install -r requirements.txt
```
4. Start the FastAPI server:
```bash
   uvicorn main:app --reload
```
The API will be live at http://localhost:8000.
### 2. Frontend Setup
The frontend is built with React and Vite, configured to communicate with the backend on `localhost:8000`. The backend CORS middleware is already configured to accept requests from standard Vite ports like `http://localhost:5173`.

1. Navigate to the frontend directory:
```bash
   cd frontend
```
2. Install Node modules:
```bash
   npm install
```
3. Start the Vite development server:
```bash
   npm run dev
```
## 🔌 API Endpoints

The FastAPI backend exposes the following endpoints:

*   **`GET /`** : Health check endpoint. Returns the API status and verifies if the machine learning model loaded successfully.
*   **`GET /sample`** : Returns a sample JSON input and a helpful encoding guide for mapping categorical text (e.g., "Low Fat", "Tier 1") to their integer values.
*   **`POST /predict`** : The primary prediction endpoint. Accepts a JSON payload containing 10 specific product/store features and returns the calculated predicted sales rounded to 2 decimal places.

## 🧠 Machine Learning Model
The predictive model was built using a dataset of big sales data. Data preprocessing includes filling missing values, encoding categorical strings to integers, and standardizing features like `Item_Weight`, `Item_Visibility`, `Item_MRP`, and `Outlet_Establishment_Year` using `StandardScaler`. A Random Forest Regressor was then trained on the processed data to estimate the continuous sales variable.

## 👩‍💻 Contributor
* **Ananya Joshi** - [GitHub Profile](https://github.com/your-username-here)
