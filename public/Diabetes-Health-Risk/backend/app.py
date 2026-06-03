from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = pickle.load(open('diabetes_model.pkl', 'rb'))
scaler = pickle.load(open('diabetes_scaler.pkl', 'rb'))

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    features = [[
        float(data['glucose']),
        float(data['bmi']),
        float(data['age']),
        float(data['insulin'])
    ]]
    scaled = scaler.transform(features)
    pred = model.predict(scaled)[0]

    try:
        prob = float(model.predict_proba(scaled)[0][1])
    except:
        prob = None

    return jsonify({
        "prediction": "Diabetic" if pred == 1 else "Non-Diabetic",
        "probability": prob
    })

if __name__ == '__main__':
    app.run(debug=True)
