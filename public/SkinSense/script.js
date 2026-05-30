const form = document.getElementById("skinForm");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value;
    const skinType = document.getElementById("skinType").value;
    const concern = document.getElementById("concern").value;
    const water = Number(document.getElementById("water").value);
    const sleep = Number(document.getElementById("sleep").value);

    let score = 50;

    if(water >= 8) score += 20;
    if(sleep >= 7) score += 20;

    if(score > 100) score = 100;

    let morningRoutine = "";
    let nightRoutine = "";
    let ingredients = "";

    switch(skinType){

        case "Oily":
            morningRoutine = "Gentle Cleanser • Niacinamide Serum • Oil-Free Moisturizer • Sunscreen";
            nightRoutine = "Cleanser • Salicylic Acid • Lightweight Moisturizer";
            ingredients = "Niacinamide, Salicylic Acid, Zinc";
            break;

        case "Dry":
            morningRoutine = "Hydrating Cleanser • Hyaluronic Acid • Rich Moisturizer • Sunscreen";
            nightRoutine = "Cleanser • Ceramide Cream • Overnight Moisturizer";
            ingredients = "Hyaluronic Acid, Ceramides, Glycerin";
            break;

        case "Sensitive":
            morningRoutine = "Gentle Cleanser • Soothing Moisturizer • Mineral Sunscreen";
            nightRoutine = "Cleanser • Barrier Repair Cream";
            ingredients = "Aloe Vera, Centella, Ceramides";
            break;

        case "Combination":
            morningRoutine = "Foaming Cleanser • Niacinamide • Moisturizer • Sunscreen";
            nightRoutine = "Cleanser • Lightweight Night Cream";
            ingredients = "Niacinamide, Hyaluronic Acid";
            break;

        default:
            morningRoutine = "Cleanser • Vitamin C • Moisturizer • Sunscreen";
            nightRoutine = "Cleanser • Repair Serum • Night Cream";
            ingredients = "Vitamin C, Peptides";
    }

    let hydration =
    water >= 8
    ? "Excellent hydration level. Keep it up!"
    : "Increase water intake to 8–10 glasses daily.";

    if(concern === "Acne"){
        ingredients += " • Tea Tree Oil";
    }

    if(concern === "Dark Spots"){
        ingredients += " • Vitamin C";
    }

    if(concern === "Pigmentation"){
        ingredients += " • Alpha Arbutin";
    }

    if(concern === "Dryness"){
        ingredients += " • Shea Butter";
    }

    if(concern === "Wrinkles"){
        ingredients += " • Retinol";
    }

    if(concern === "Dullness"){
        ingredients += " • Vitamin C";
    }

    document.getElementById("greeting").innerText =
    `Hello ${name} 👋`;

    document.getElementById("scoreText").innerText =
    `${score}/100 Skin Health Score`;

    document.getElementById("morningRoutine").innerText =
    morningRoutine;

    document.getElementById("nightRoutine").innerText =
    nightRoutine;

    document.getElementById("hydration").innerText =
    hydration;

    document.getElementById("ingredients").innerText =
    ingredients;

    document.getElementById("resultSection")
    .classList.remove("hidden");

    setTimeout(() => {

        document.getElementById("progress")
        .style.width = score + "%";

    }, 300);

    document.getElementById("resultSection")
    .scrollIntoView({
        behavior:"smooth"
    });

});