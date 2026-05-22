const btn = document.getElementById("calculateBtn");

const bmiValue = document.getElementById("bmiValue");
const category = document.getElementById("category");
const message = document.getElementById("message");

const calories = document.getElementById("calories");
const water = document.getElementById("water");
const healthyWeight = document.getElementById("healthyWeight");

const dietPlan = document.getElementById("dietPlan");
const workoutPlan = document.getElementById("workoutPlan");

const gauge = document.querySelector(".gauge");

let bmiData = [];
let bmiLabels = [];

btn.addEventListener("click", () => {

    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    if(!height || !weight){
        alert("Please enter valid height and weight");
        return;
    }

    const bmi = (weight / ((height/100)*(height/100))).toFixed(1);

    bmiValue.innerText = bmi;

    updateGauge(bmi);

    let categoryText = "";
    let msg = "";
    let calorieText = "";
    let waterText = `${(weight * 0.033).toFixed(1)} Litres/day`;

    const minWeight = (18.5 * ((height/100)*(height/100))).toFixed(1);
    const maxWeight = (24.9 * ((height/100)*(height/100))).toFixed(1);

    healthyWeight.innerText = `${minWeight} kg - ${maxWeight} kg`;

    dietPlan.innerHTML = "";
    workoutPlan.innerHTML = "";

    if(bmi < 18.5){

        categoryText = "Underweight";
        msg = "You should focus on gaining healthy weight with nutrient-rich meals.";

        calorieText = "2500 - 2800 kcal/day";

        addDiet([
            "High protein foods",
            "Milk, nuts and peanut butter",
            "Rice, potatoes and whole grains",
            "Smoothies and banana shakes",
            "Eggs and chicken"
        ]);

        addWorkout([
            "Strength training",
            "Push-ups and squats",
            "Weight lifting",
            "Light cardio",
            "Resistance exercises"
        ]);

    }

    else if(bmi >= 18.5 && bmi < 25){

        categoryText = "Normal Weight";
        msg = "Excellent! Maintain your healthy lifestyle.";

        calorieText = "2000 - 2400 kcal/day";

        addDiet([
            "Balanced diet",
            "Vegetables and fruits",
            "Lean protein",
            "Healthy fats",
            "Whole grains"
        ]);

        addWorkout([
            "30 min cardio",
            "Yoga and stretching",
            "Moderate gym workout",
            "Cycling or jogging",
            "Daily walking"
        ]);

    }

    else if(bmi >= 25 && bmi < 30){

        categoryText = "Overweight";
        msg = "Focus on calorie deficit and regular exercise.";

        calorieText = "1700 - 2000 kcal/day";

        addDiet([
            "Low calorie meals",
            "Avoid sugary drinks",
            "Eat more salads",
            "High fiber foods",
            "Reduce junk food"
        ]);

        addWorkout([
            "Running",
            "Cycling",
            "HIIT workouts",
            "Jump rope",
            "45 mins cardio"
        ]);

    }

    else{

        categoryText = "Obese";
        msg = "Adopt healthy habits and focus on gradual fat loss.";

        calorieText = "1500 - 1800 kcal/day";

        addDiet([
            "Strict calorie control",
            "Protein-rich meals",
            "Avoid processed food",
            "Drink more water",
            "Eat smaller portions"
        ]);

        addWorkout([
            "Daily walking",
            "Low impact cardio",
            "Swimming",
            "Cycling",
            "Light strength exercises"
        ]);
    }

    category.innerText = categoryText;
    message.innerText = msg;
    calories.innerText = calorieText;
    water.innerText = waterText;

    updateChart(bmi);

});

/* ADD DIET ITEMS */

function addDiet(items){

    items.forEach(item => {

        const li = document.createElement("li");
        li.innerText = item;
        dietPlan.appendChild(li);

    });

}

/* ADD WORKOUT ITEMS */

function addWorkout(items){

    items.forEach(item => {

        const li = document.createElement("li");
        li.innerText = item;
        workoutPlan.appendChild(li);

    });

}

/* GAUGE */

function updateGauge(bmi){

    let degree = (bmi / 40) * 360;

    gauge.style.background =
    `conic-gradient(
        #00ff88 0deg,
        #00ff88 ${degree}deg,
        rgba(255,255,255,0.15) ${degree}deg
    )`;

}

/* CHART */

const ctx = document.getElementById("bmiChart");

const bmiChart = new Chart(ctx, {

    type:'line',

    data:{
        labels:bmiLabels,
        datasets:[{
            label:'BMI Progress',
            data:bmiData,
            borderWidth:3,
            tension:0.4
        }]
    },

    options:{
        responsive:true,
        plugins:{
            legend:{
                labels:{
                    font:{
                        size:18
                    }
                }
            }
        },
        scales:{
            y:{
                beginAtZero:true
            }
        }
    }

});

/* UPDATE CHART */

function updateChart(bmi){

    bmiLabels.push(new Date().toLocaleTimeString());

    bmiData.push(bmi);

    bmiChart.update();

}

/* THEME SWITCHER */

function changeTheme(theme){

    document.body.className = theme;

}