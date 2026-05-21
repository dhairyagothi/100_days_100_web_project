function calculateBMI() {

  let height = document.getElementById("height").value;
  let weight = parseFloat(document.getElementById("weight").value);

  let hu = document.getElementById("heightUnit").value;
  let wu = document.getElementById("weightUnit").value;

  if (!height || !weight) {
    alert("Enter values");
    return;
  }

  if (hu === "ft") {
    let p = height.split("/");
    height = (p[0] * 30.48) + (p[1] * 2.54);
  }

  if (wu === "lb") {
    weight *= 0.453592;
  }

  let bmi = weight / ((height/100) ** 2);
  bmi = bmi.toFixed(1);

  let category = getCategory(bmi);

  document.getElementById("result").innerText =
`BMI: ${bmi}
Category: ${category}
Calories: ${getCalories(weight,height,category)}
Water: ${(weight*0.033).toFixed(2)} L/day
Diet: ${getDiet(category)}
Workout: ${getWorkout(category)}`;
}

/* BMI LOGIC */
function getCategory(bmi) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getCalories(w,h,c) {
  let bmr = 10*w + 6.25*h - 5*25 + 5;
  if (c==="Underweight") return Math.round(bmr+400)+" kcal";
  if (c==="Normal") return Math.round(bmr)+" kcal";
  if (c==="Overweight") return Math.round(bmr-400)+" kcal";
  return Math.round(bmr-600)+" kcal";
}

function getDiet(c){
  if(c==="Underweight") return "High protein diet";
  if(c==="Normal") return "Balanced diet";
  if(c==="Overweight") return "Low calorie diet";
  return "Strict fat loss diet";
}

function getWorkout(c){
  if(c==="Underweight") return "Strength training";
  if(c==="Normal") return "Gym + cardio";
  if(c==="Overweight") return "Cardio daily";
  return "Walking + cardio";
}

/* ⭐ FIXED THEME SWITCH (THIS WAS THE ISSUE) */
function setTheme(theme) {

  const root = document.documentElement;

  if (theme === "dark") {
    root.style.setProperty("--bg1","#0f0c29");
    root.style.setProperty("--bg2","#302b63");
    root.style.setProperty("--card","rgba(255,255,255,0.08)");
    root.style.setProperty("--accent","#00c6ff");
    root.style.setProperty("--text","white");
  }

  if (theme === "light") {
    root.style.setProperty("--bg1","#f5f7fa");
    root.style.setProperty("--bg2","#c3cfe2");
    root.style.setProperty("--card","rgba(0,0,0,0.05)");
    root.style.setProperty("--accent","#0077ff");
    root.style.setProperty("--text","#111");
  }

  if (theme === "ocean") {
    root.style.setProperty("--bg1","#2193b0");
    root.style.setProperty("--bg2","#6dd5ed");
    root.style.setProperty("--card","rgba(255,255,255,0.15)");
    root.style.setProperty("--accent","#003c8f");
    root.style.setProperty("--text","white");
  }

  if (theme === "sunset") {
    root.style.setProperty("--bg1","#ff512f");
    root.style.setProperty("--bg2","#dd2476");
    root.style.setProperty("--card","rgba(255,255,255,0.12)");
    root.style.setProperty("--accent","#ffd166");
    root.style.setProperty("--text","white");
  }
}