 # 🛡️ ScamShield Lite - SMS Fraud Detector

A lightweight web-based tool that analyzes SMS messages and classifies them as Safe, Suspicious, or High Risk Scam using keyword-based risk scoring.



## 🚀 Features
- 🧠 Detects scam patterns in SMS messages
- 📊 Real-time risk score (0–100%)
- 🚨 Classification system:
  - ✅ Safe Message
  - ⚠️ Suspicious Message
  - 🚨 High Risk Scam Message
- 🏷️ Explains detection reasons (OTP, urgency, bank keywords, etc.)
- 📈 Visual risk meter bar for better UX


## 🛠️ Technologies Used
- HTML5
- CSS3
- JavaScript (Vanilla)


## ⚙️ How It Works
The system uses a rule-based scoring model:

- Each suspicious keyword has a weight (e.g., OTP = high risk)
- Total score is calculated based on detected patterns
- Score is normalized into percentage (0–100%)
- Message is classified based on thresholds:
  - 0–40% → Safe
  - 41–70% → Suspicious
  - 71–100% → High Risk Scam


## 📁 Project Structure
Day_XX_Scam_SMS_Detector/

├── screenshots
├── index.html
├── style.css
├── script.js
└── README.md



## ▶️ How to Run
1. Clone the repository
2. Navigate to the project folder
3. Open `index.html` in any web browser
4. Paste an SMS and click **Analyze**


## 🔮 Future Improvements
- 🤖 Machine Learning-based detection model
- 🧠 NLP-based message understanding
- 🌐 Real-time scam database integration
- 🔌 Browser extension version
- 📱 WhatsApp message analysis support


## 🌟 Real-World Impact
This project helps users identify phishing attempts, fraud SMS, and social engineering attacks, improving digital safety awareness.

## 👨‍💻 Author
Megha Guleria 
Linkedln https://www.linkedin.com/in/megha-guleria-89a9243a1/
