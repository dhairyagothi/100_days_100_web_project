from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    with open("diabetes_model.pkl", "rb") as model_file:
        model = pickle.load(model_file)

    with open("diabetes_scaler.pkl", "rb") as scaler_file:
        scaler = pickle.load(scaler_file)

except FileNotFoundError as e:
    raise RuntimeError(
        f"Required model file missing: {e.filename}"
    )

@app.route('/predict', methods=['POST'])
def predict():

    data = request.get_json()
    if not data:
        return jsonify({
            "error": "Invalid or missing JSON body"
    }), 400

    required_fields = [
    "glucose",
    "bmi",
    "age",
    "insulin"
    ]

    missing_fields = [
    field for field in required_fields
    if field not in data
    ]

    if missing_fields:
        return jsonify({
        "error": f"Missing fields: {', '.join(missing_fields)}"
    }), 400

    try:
        features = [[
        float(data["glucose"]),
        float(data["bmi"]),
        float(data["age"]),
        float(data["insulin"])
    ]]
    except (ValueError, TypeError):
        return jsonify({
        "error": "All input values must be numeric"
    }), 400

    scaled = scaler.transform(features)
    pred = model.predict(scaled)[0]

    try:
        prob = float(model.predict_proba(scaled)[0][1])
    except (AttributeError, IndexError):
        prob = None

    return jsonify({
        "prediction": "Diabetic" if pred == 1 else "Non-Diabetic",
        "probability": prob
    })

if __name__ == '__main__':
    app.run(debug=os.getenv("FLASK_DEBUG", "False") == "True")
