let water = 0;
let sunlight = 0;

const image = document.getElementById("image");
const data = document.getElementById("data");

function updatePlant(src, title, text) {
    image.src = src;
    image.title = title;
    data.textContent = text;
}

function waterclicked() {
    if (water < 4) {
        water++;
        changeImage();
    }
}

function sunlightclicked() {
    if (sunlight < 4) {
        sunlight++;
        changeImage();
    }
}

function changeImage() {

    if (water === 1 && sunlight === 1) {

        updatePlant(
            "images/sap3.webp",
            "Sapling",
            "Sapling"
        );

    } else if (water === 2 && sunlight === 2) {

        updatePlant(
            "images/stage-2-veretation.png",
            "Young Plant (Vegetation)",
            "Young Plant"
        );

    } else if (water === 3 && sunlight === 3) {

        updatePlant(
            "images/flowering.png",
            "Flowering Plant",
            "Flowering Plant"
        );

    } else if (water === 4 && sunlight === 4) {
        
        updatePlant(
            "images/R.png",
            "Tree",
            "Tree"
        );
    }
}