// script.js
async function predict() {
    const resultDiv = document.getElementById('result');
    const predictBtn = document.querySelector('.btn-predict');
    
    // Get input values
    const glucose = document.getElementById('glucose').value.trim();
    const bmi = document.getElementById('bmi').value.trim();
    const age = document.getElementById('age').value.trim();
    const insulin = document.getElementById('insulin').value.trim();

    // Validate inputs
    if (!glucose || !bmi || !age || !insulin) {
        resultDiv.innerHTML = `
            <h3 style="color: #e67e22;">
                <i class="fas fa-exclamation-triangle"></i> Missing Information
            </h3>
            <p>Please fill in all fields before predicting.</p>
        `;
        return;
    }

    // Show loading state
    predictBtn.classList.add('loading');
    resultDiv.innerHTML = `
        <h3 style="color: #2a7faa;">
            <i class="fas fa-circle-notch fa-spin"></i> Analyzing...
        </h3>
        <p>Please wait while we process your data</p>
    `;

    try {
        const data = {
            glucose: parseFloat(glucose),
            bmi: parseFloat(bmi),
            age: parseFloat(age),
            insulin: parseFloat(insulin)
        };

        const res = await fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const result = await res.json();

        // Display result with styling
        let predictionText = result.prediction || 'No prediction available';
        let probability = result.probability !== null && result.probability !== undefined ? result.probability : null;
        
        // Determine if positive or negative
        const isPositive = predictionText.toLowerCase().includes('diabetic') || 
                          predictionText.toLowerCase().includes('positive');
        
        const riskClass = isPositive ? 'positive' : 'negative';
        const riskIcon = isPositive ? 'fa-exclamation-circle' : 'fa-check-circle';
        const riskEmoji = isPositive ? '⚠️' : '✅';
        
        let probabilityDisplay = 'N/A';
        let barWidth = 0;
        
        if (probability !== null) {
            probabilityDisplay = (probability * 100).toFixed(1) + '%';
            barWidth = Math.min(probability * 100, 100);
        }

        resultDiv.innerHTML = `
            <h3 class="${riskClass}">
                <i class="fas ${riskIcon}"></i> ${riskEmoji} ${predictionText}
            </h3>
            <p>Probability: <strong>${probabilityDisplay}</strong></p>
            ${probability !== null ? `
                <div class="probability-bar">
                    <div class="fill" style="width: ${barWidth}%;"></div>
                </div>
                <p style="font-size: 13px; opacity: 0.6; margin-top: 6px;">
                    ${isPositive ? 'High risk indicated' : 'Low risk indicated'}
                </p>
            ` : ''}
        `;

    } catch (error) {
        console.error('Prediction error:', error);
        resultDiv.innerHTML = `
            <h3 style="color: #c0392b;">
                <i class="fas fa-times-circle"></i> Error
            </h3>
            <p>Could not connect to the prediction server. Make sure the Flask server is running at <strong>http://127.0.0.1:5000</strong></p>
            <p style="font-size: 13px; opacity: 0.6; margin-top: 8px;">Error: ${error.message}</p>
        `;
    } finally {
        // Remove loading state
        predictBtn.classList.remove('loading');
    }
}

// Optional: Allow Enter key to trigger prediction
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                predict();
            }
        });
    });
});