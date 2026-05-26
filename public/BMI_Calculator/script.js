const imperialInputs =
document.getElementById("imperialInputs");

const metricInputs =
document.getElementById("metricInputs");

const bmiScore =
document.getElementById("bmiScore");

const bmiCategory =
document.getElementById("bmiCategory");

const healthyRange =
document.getElementById("healthyRange");

const bodyFat =
document.getElementById("bodyFat");

const historyList =
document.getElementById("historyList");

const themeBtn =
document.getElementById("themeBtn");

/* DARK MODE */

themeBtn.addEventListener("click", ()=>{

  document.body.classList.toggle("dark-mode");

  if(
    document.body.classList.contains("dark-mode")
  ){

    themeBtn.innerHTML = "☀️";
  }

  else{

    themeBtn.innerHTML = "🌙";
  }

});

/* UNIT SWITCH */

function switchUnit(unit){

  if(unit === "metric"){

    metricInputs.classList.remove("hidden");

    imperialInputs.classList.add("hidden");
  }

  else{

    imperialInputs.classList.remove("hidden");

    metricInputs.classList.add("hidden");
  }

}

/* BMI NUMBER ANIMATION */

function animateBMIValue(
  element,
  finalValue
){

  let startValue = 0;

  let duration = 1200;

  let increment =
  finalValue / (duration / 10);

  element.classList.remove("bmi-animate");

  void element.offsetWidth;

  element.classList.add("bmi-animate");

  const counter =
  setInterval(()=>{

    startValue += increment;

    if(startValue >= finalValue){

      startValue = finalValue;

      clearInterval(counter);
    }

    element.innerText =
    startValue.toFixed(1);

  },10);

}

/* BMI CALCULATION */

function calculateBMI(){

  let height;
  let weight;

  if(
    !imperialInputs.classList.contains("hidden")
  ){

    const feet =
    parseFloat(
      document.getElementById("feet").value
    );

    const inches =
    parseFloat(
      document.getElementById("inches").value
    );

    const pounds =
    parseFloat(
      document.getElementById("weightImperial").value
    );

    height =
    ((feet * 12) + inches) * 0.0254;

    weight =
    pounds * 0.453592;
  }

  else{

    const cm =
    parseFloat(
      document.getElementById("cm").value
    );

    const kg =
    parseFloat(
      document.getElementById("weightMetric").value
    );

    height = cm / 100;

    weight = kg;
  }

  const age =
  parseFloat(
    document.getElementById("age").value
  );

  const gender =
  document.getElementById("gender").value;

  if(!height || !weight || !age || !gender){

    alert("Please fill all fields");

    return;
  }

  const bmi =
  (
    weight / (height * height)
  ).toFixed(1);

  animateBMIValue(
    bmiScore,
    parseFloat(bmi)
  );

  let category = "";

  if(bmi < 18.5){

    category = "UNDERWEIGHT";
  }

  else if(bmi < 25){

    category = "NORMAL";
  }

  else if(bmi < 30){

    category = "OVERWEIGHT";
  }

  else{

    category = "OBESE";
  }

  bmiCategory.innerText = category;

  /* CATEGORY COLORS */

  if(category === "UNDERWEIGHT"){

    bmiCategory.style.background =
    "#dbeafe";

    bmiCategory.style.color =
    "#2563eb";
  }

  else if(category === "NORMAL"){

    bmiCategory.style.background =
    "#dcfce7";

    bmiCategory.style.color =
    "#15803d";
  }

  else if(category === "OVERWEIGHT"){

    bmiCategory.style.background =
    "#fef3c7";

    bmiCategory.style.color =
    "#d97706";
  }

  else{

    bmiCategory.style.background =
    "#fee2e2";

    bmiCategory.style.color =
    "#dc2626";
  }

  /* TABLE HIGHLIGHT */

  document
  .querySelectorAll("table tr")
  .forEach(row=>{

    row.classList.remove("active-bmi");

  });

  if(bmi < 18.5){

    document
    .getElementById("underweightRow")
    .classList.add("active-bmi");
  }

  else if(bmi < 25){

    document
    .getElementById("normalRow")
    .classList.add("active-bmi");
  }

  else if(bmi < 30){

    document
    .getElementById("overweightRow")
    .classList.add("active-bmi");
  }

  else{

    document
    .getElementById("obeseRow")
    .classList.add("active-bmi");
  }

  /* HEALTH TIPS */

  const healthTips =
  document.getElementById("healthTips");

  if(category === "UNDERWEIGHT"){

    healthTips.innerHTML = `

      <div class="tip-item">
        Increase healthy calorie intake.
      </div>

      <div class="tip-item">
        Add more protein-rich foods.
      </div>

      <div class="tip-item">
        Focus on strength training.
      </div>

    `;
  }

  else if(category === "NORMAL"){

    healthTips.innerHTML = `

      <div class="tip-item">
        Maintain balanced lifestyle.
      </div>

      <div class="tip-item">
        Continue regular exercise.
      </div>

      <div class="tip-item">
        Stay hydrated and sleep well.
      </div>

    `;
  }

  else if(category === "OVERWEIGHT"){

    healthTips.innerHTML = `

      <div class="tip-item">
        Regular cardio exercise recommended.
      </div>

      <div class="tip-item">
        Reduce processed food intake.
      </div>

      <div class="tip-item">
        Maintain calorie deficit carefully.
      </div>

    `;
  }

  else{

    healthTips.innerHTML = `

      <div class="tip-item">
        Consult a fitness or nutrition expert.
      </div>

      <div class="tip-item">
        Focus on long-term healthy habits.
      </div>

      <div class="tip-item">
        Monitor weight and activity regularly.
      </div>

    `;
  }

  /* HEALTHY RANGE */

  const minWeight =
  (
    18.5 * height * height
  ).toFixed(1);

  const maxWeight =
  (
    24.9 * height * height
  ).toFixed(1);

  healthyRange.innerText =
  `${minWeight} - ${maxWeight} kg`;

  /* BODY FAT */

  let fat;

  if(gender === "Male"){

    fat =
    (
      1.20 * bmi +
      0.23 * age -
      16.2
    ).toFixed(1);
  }

  else{

    fat =
    (
      1.20 * bmi +
      0.23 * age -
      5.4
    ).toFixed(1);
  }

  bodyFat.innerText = fat;

  /* FITNESS */

  const fitnessTag =
  document.getElementById("fitnessTag");

  const fitnessText =
  document.getElementById("fitnessText");

  if(fat < 14){

    fitnessTag.innerText = "ESSENTIAL";

    fitnessText.innerText =
    "Low body fat percentage.";
  }

  else if(fat < 18){

    fitnessTag.innerText = "FITNESS";

    fitnessText.innerText =
    "Healthy body composition with good muscle definition.";
  }

  else if(fat < 25){

    fitnessTag.innerText = "AVERAGE";

    fitnessText.innerText =
    "Average body fat range.";
  }

  else{

    fitnessTag.innerText = "OBESE";

    fitnessText.innerText =
    "Higher body fat percentage than recommended.";
  }

  /* BMI MARKER */

  const marker =
  document.querySelector(".marker");

  let position =
  (bmi / 40) * 100;

  if(position > 100){

    position = 100;
  }

  marker.style.left =
  `calc(${position}% - 12px)`;

  saveHistory(bmi);
}

/* RESET */

function resetFields(){

  document
  .querySelectorAll("input")
  .forEach(input=>{

    if(input.type !== "radio"){
      input.value = "";
    }

  });

  document.getElementById("gender")
  .selectedIndex = 0;

  bmiScore.innerText = "--";

  bmiCategory.innerText = "--";

  healthyRange.innerText = "--";

  bodyFat.innerText = "--";

  document.getElementById("fitnessTag")
  .innerText = "--";

  document.getElementById("fitnessText")
  .innerText =
  "Calculate BMI to view body fat analysis.";

  document.getElementById("healthTips")
  .innerHTML =
  "Calculate BMI to view personalized insights.";

  document
  .querySelectorAll("table tr")
  .forEach(row=>{

    row.classList.remove("active-bmi");

  });

  document.querySelector(".marker")
  .style.left = "40%";
}

/* HISTORY */

function saveHistory(bmi){

  const time =
  new Date().toLocaleString();

  const item =
  document.createElement("div");

  item.classList.add("history-item");

  item.innerHTML = `
    <span>${time}</span>
    <strong>BMI: ${bmi}</strong>
  `;

  historyList.prepend(item);
}

function clearHistory(){

  historyList.innerHTML = "";
}

/* ENTER KEY SUPPORT */

document.addEventListener("keydown",(e)=>{

  if(e.key === "Enter"){

    calculateBMI();
  }

});
