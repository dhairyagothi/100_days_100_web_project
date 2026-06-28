const imageUpload =
    document.getElementById("imageUpload");
const preview =
    document.getElementById("preview");
const uploadContent =
    document.getElementById("uploadContent");
const classifyBtn =
    document.getElementById("classifyBtn");
const resultDiv =
    document.getElementById("result");
const predictionPanel =
    document.getElementById("predictionPanel");
const mainLayout =
    document.querySelector(".main-layout");
let model;
let isModelLoaded = false;
async function loadModel() {
    resultDiv.innerHTML = `
        <p class="loading">
            Loading AI Model...
        </p>
    `;

    try {
        model = await mobilenet.load();

        isModelLoaded = true;

        resultDiv.innerHTML = `
            <p class="loading">
                AI Model Ready
            </p>
        `;
    } catch (error) {
        console.error('Failed to load MobileNet model:', error);

        resultDiv.innerHTML = `
            <p class="loading">
                Failed to load AI Model
            </p>
        `;
    }
}
loadModel();
document.querySelector(".upload-btn")
    .addEventListener("click", () => {
        predictionPanel.classList.remove("active");
        mainLayout.classList.remove("shifted");
        resultDiv.innerHTML = "";
    });
imageUpload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        preview.src =
            URL.createObjectURL(file);
        preview.style.display = "block";
        uploadContent.style.display = "none";
    }
});
classifyBtn.addEventListener("click", async () => {
    if (!isModelLoaded) {
        alert("AI Model is still loading...");
        return;
    }
    if (!preview.src) {
        alert("Please upload an image first!");
        return;
    }
    predictionPanel.classList.add("active");
    mainLayout.classList.add("shifted");
    resultDiv.innerHTML = `
        <p class="loading">
            🔍 Analyzing...
        </p>
    `;
    try {
        const predictions =
            await model.classify(preview);
        resultDiv.innerHTML = "";
        predictions.forEach((prediction, index) => {
            const confidence = (
                prediction.probability * 100
            ).toFixed(2);

            const predictionCard =
                document.createElement("div");
            predictionCard.className = "prediction";
            predictionCard.style.animationDelay =
                `${index * 0.08}s`;

            const predictionTop =
                document.createElement("div");
            predictionTop.className = "prediction-top";

            const classNameDiv =
                document.createElement("div");
            classNameDiv.className = "class-name";
            classNameDiv.textContent =
                prediction.className;

            const confidenceDiv =
                document.createElement("div");
            confidenceDiv.className = "confidence";
            confidenceDiv.textContent =
                `${confidence}%`;

            predictionTop.appendChild(classNameDiv);
            predictionTop.appendChild(confidenceDiv);

            const bar =
                document.createElement("div");
            bar.className = "bar";

            const fill =
                document.createElement("div");
            fill.className = "fill";
            fill.style.width = `${confidence}%`;

            bar.appendChild(fill);

            predictionCard.appendChild(predictionTop);
            predictionCard.appendChild(bar);

            resultDiv.appendChild(predictionCard);
        });
    } catch (error) {
        resultDiv.innerHTML = `
            <p class="loading">
                ❌ Error analyzing image
            </p>`;
        console.error(error);
    }
});
