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

    const height = parseFloat(
        document.getElementById("height").value
    );

    const weight = parseFloat(
        document.getElementById("weight").value
    );

    if(!height || !weight){
        alert("Please enter valid values");
        return;
    }

    const bmi = (
        weight /
        ((height/100)*(height/100))
    ).toFixed(1);

    bmiValue.innerText = bmi;

    updateGauge(bmi);

    const minWeight = (
        18.5*((height/100)*(height/100))
    ).toFixed(1);

    const maxWeight = (
        24.9*((height/100)*(height/100))
    ).toFixed(1);

    healthyWeight.innerText =
        `${minWeight} - ${maxWeight} kg`;

    water.innerText =
        `${(weight*0.033).toFixed(1)} Litres/day`;

    dietPlan.innerHTML="";
    workoutPlan.innerHTML="";

    if(bmi < 18.5){

        category.innerText="Underweight";

        message.innerText=
        "Gain healthy weight.";

        calories.innerText=
        "2500 - 2800 kcal/day";

        addDiet([
            "Milk",
            "Eggs",
            "Nuts"
        ]);

        addWorkout([
            "Strength Training",
            "Squats",
            "Pushups"
        ]);

    }

    else if(bmi < 25){

        category.innerText="Normal";

        message.innerText=
        "Maintain your lifestyle.";

        calories.innerText=
        "2000 - 2400 kcal/day";

        addDiet([
            "Balanced Diet",
            "Fruits",
            "Vegetables"
        ]);

        addWorkout([
            "Jogging",
            "Cycling",
            "Walking"
        ]);

    }

    else if(bmi < 30){

        category.innerText="Overweight";

        message.innerText=
        "Focus on weight loss.";

        calories.innerText=
        "1700 - 2000 kcal/day";

        addDiet([
            "Salads",
            "Protein",
            "Less Sugar"
        ]);

        addWorkout([
            "Running",
            "HIIT",
            "Cardio"
        ]);

    }

    else{

        category.innerText="Obese";

        message.innerText=
        "Adopt healthier habits.";

        calories.innerText=
        "1500 - 1800 kcal/day";

        addDiet([
            "Protein Rich",
            "More Water",
            "Small Portions"
        ]);

        addWorkout([
            "Walking",
            "Swimming",
            "Cycling"
        ]);

    }

    updateChart(bmi);

});

function addDiet(items){

    items.forEach(item=>{

        const li=document.createElement("li");
        li.innerText=item;
        dietPlan.appendChild(li);

    });

}

function addWorkout(items){

    items.forEach(item=>{

        const li=document.createElement("li");
        li.innerText=item;
        workoutPlan.appendChild(li);

    });

}

function updateGauge(bmi){

    const degree=(bmi/40)*360;

    gauge.style.background=
    `conic-gradient(
        #00ff88 0deg,
        #00ff88 ${degree}deg,
        rgba(255,255,255,.2) ${degree}deg
    )`;

}

const ctx=document.getElementById("bmiChart");

const bmiChart=new Chart(ctx,{
    type:"line",
    data:{
        labels:bmiLabels,
        datasets:[{
            label:"BMI Progress",
            data:bmiData,
            borderWidth:3,
            tension:0.4
        }]
    }
});

function updateChart(bmi){

    bmiLabels.push(
        new Date().toLocaleTimeString()
    );

    bmiData.push(bmi);

    bmiChart.update();

}

function changeTheme(theme){

    document.body.className=theme;

}
