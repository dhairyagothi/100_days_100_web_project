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
async function loadModel(){
    resultDiv.innerHTML = `
        <p class="loading">
            ⏳ Loading AI Model...
        </p>
    `;
    model = await mobilenet.load();
    isModelLoaded = true;
    resultDiv.innerHTML = `
        <p class="loading">
            ✅ AI Model Ready
        </p>
    `;
}
loadModel();
document.querySelector(".upload-btn")
.addEventListener("click",()=>{
    predictionPanel.classList.remove("active");
    mainLayout.classList.remove("shifted");
    resultDiv.innerHTML = "";
});
imageUpload.addEventListener("change",(event)=>{
    const file = event.target.files[0];
    if(file){
        preview.src =
        URL.createObjectURL(file);
        preview.style.display = "block";
        uploadContent.style.display = "none";
    }
});
classifyBtn.addEventListener("click", async()=>{
    if(!isModelLoaded){
        alert("AI Model is still loading...");
        return;
    }
    if(!preview.src){
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
    try{
        const predictions =
        await model.classify(preview);
        resultDiv.innerHTML = "";
        predictions.forEach((prediction,index)=>{
            const confidence =
            (prediction.probability * 100)
            .toFixed(2);
            resultDiv.innerHTML += `
            <div
            class="prediction"
            style="animation-delay:${index * 0.08}s">
                <div class="prediction-top">
                    <div class="class-name">
                        ${prediction.className}
                    </div>
                    <div class="confidence">
                        ${confidence}%
                    </div>
                </div>
                <div class="bar">
                    <div
                    class="fill"
                    style="width:${confidence}%">
                    </div>
                </div>
            </div>
            `;
        });
    }catch(error){
        resultDiv.innerHTML = `
            <p class="loading">
                ❌ Error analyzing image
            </p>`;
        console.error(error);
    }
});
