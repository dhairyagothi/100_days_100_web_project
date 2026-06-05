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
}

  if (heightCm < 50 || heightCm > 280) {
    showError('Height seems out of range (50–280 cm).');
    return;
  }

  if (wUnit === 'lb') w *= 0.453592;

  if (w < 2 || w > 700) {
    showError('Weight seems out of range.');
    return;
  }

  // Calculates BMI
  const bmi = w / Math.pow(heightCm / 100, 2);
  const bmiRounded = Math.round(bmi * 10) / 10;
  const cat = getCategory(bmi);

  // Displays BMI + category
  document.getElementById('bmi-val').textContent = bmiRounded.toFixed(1);

  resultsEl.style.background = cat.bg;
  resultsEl.style.border = `2px solid ${cat.color}`;
  resultsEl.style.transition = 'all 0.4s ease';
  resultsEl.style.boxShadow = `0 0 20px ${cat.color}40`;

  // Healthy weight range
  const [wLow, wHigh] = calcHealthyWeight(heightCm);
  const dispUnit = wUnit === 'lb' ? 'lb' : 'kg';
  const mult = wUnit === 'lb' ? 2.20462 : 1;
  document.getElementById('healthy-range').textContent =
    `${(wLow * mult).toFixed(1)}–${(wHigh * mult).toFixed(1)} ${dispUnit}`;
  const badge = document.getElementById('cat-badge');
  const icons = {
    Underweight: '⚠️',
    'Normal weight': '✅',
    Overweight: '📈',
    'Obese (class I)': '❗',
    'Obese (class II)': '🚨',
    'Obese (class III)': '🛑',
  };

  badge.textContent = `${icons[cat.label] || ''} ${cat.label}`;
  badge.style.background = cat.bg;
  badge.style.color = cat.color;

  document.getElementById('tip-text').textContent = cat.tip;

  document
    .querySelectorAll('.bmi-table tbody tr')
    .forEach((row) => row.classList.remove('active-row'));

  const rowMap = {
    Underweight: 'underweight-row',
    'Normal weight': 'normal-row',
    Overweight: 'overweight-row',
    'Obese (class I)': 'obese1-row',
    'Obese (class II)': 'obese2-row',
    'Obese (class III)': 'obese3-row',
  };

  document.getElementById(rowMap[cat.label])?.classList.add('active-row');

  // Shows result sections
  resultsEl.classList.remove('hidden');
  resultsEl.style.display = 'grid';

  rangeVisEl.classList.remove('hidden');
  rangeVisEl.style.display = 'block';

  // Moves range pointer
  const pct = bmiToPercent(bmi);
  document.getElementById('bmi-ptr').style.left = pct + '%';

  // Updates chart data
  const time = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  bmiChart.data.labels.push(time);
  bmiChart.data.datasets[0].data.push(bmiRounded);
  bmiChart.update();

  // Save history to localStorage
  localStorage.setItem(BMI_LABELS_KEY, JSON.stringify(bmiChart.data.labels));
  localStorage.setItem(BMI_DATA_KEY, JSON.stringify(bmiChart.data.datasets[0].data));

  // ─── Body Fat % Estimate (Deurenberg formula) ───
  const age = parseFloat(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const bfSection = document.getElementById('bf-section');

  if (!isNaN(age) && age >= 2 && age <= 120) {
    const sexFactor = gender === 'male' ? 1 : 0;
    let bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
    bodyFat = Math.round(bodyFat * 10) / 10;
    bodyFat = Math.max(2, Math.min(bodyFat, 65));

    const bfCat = getBodyFatCategory(bodyFat, gender);

    const CIRCUMFERENCE = 326.73;
    const fraction = Math.min(bodyFat / 60, 1);
    const offset = CIRCUMFERENCE * (1 - fraction);
    const arc = document.getElementById('bf-arc');
    arc.style.strokeDashoffset = offset;
    arc.style.stroke = bfCat.color;

    document.getElementById('bf-pct').textContent = bodyFat.toFixed(1);

    const badge = document.getElementById('bf-badge');
    badge.textContent = bfCat.label;
    badge.style.background = bfCat.bg;
    badge.style.color = bfCat.color;

    document.getElementById('bf-desc').textContent = bfCat.tip;

    bfSection.classList.remove('hidden');
    bfSection.style.display = 'block';
  } else {
    bfSection.classList.add('hidden');
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
