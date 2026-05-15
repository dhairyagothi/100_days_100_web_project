// Your project functionality
document.addEventListener('DOMContentLoaded', function() {
    // Your code here
     const imageUpload = document.getElementById('imageUpload');
const preview = document.getElementById('preview');
const classifyBtn = document.getElementById('classifyBtn');
const resultDiv = document.getElementById('result');

let model;

async function loadModel() {
    resultDiv.innerHTML = "<p>⏳ Loading AI Model...</p>";
    model = await mobilenet.load();
    resultDiv.innerHTML = "<p>✅ AI Model Loaded Successfully</p>";
}

loadModel();

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
        resultDiv.innerHTML = "";
    }
});

classifyBtn.addEventListener('click', async () => {

    if (!preview.src) {
        alert("Please upload an image first!");
        return;
    }

    resultDiv.innerHTML = "<p>🔍 Analyzing Image...</p>";

    const predictions = await model.classify(preview);

    resultDiv.innerHTML = `<h3>Predictions</h3>`;

    predictions.forEach(prediction => {
        const confidence = (prediction.probability * 100).toFixed(2);

        resultDiv.innerHTML += `
            <div class="prediction">
                <strong>${prediction.className}</strong>
                <p>${confidence}% Confidence</p>

                <div class="bar">
                    <div class="fill" style="width:${confidence}%"></div>
                </div>
            </div>
        `;
    });
});
});
