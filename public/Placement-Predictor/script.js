const predictBtn = document.getElementById("predictBtn");

predictBtn.addEventListener("click", () => {

  const cgpa = parseFloat(document.getElementById("cgpa").value);
  const dsa = parseInt(document.getElementById("dsa").value);
  const projects = parseInt(document.getElementById("projects").value);

  const communication = document.getElementById("communication").value;
  const internship = document.getElementById("internship").value;
  const stack = document.getElementById("stack").value;

  if (
    isNaN(cgpa) ||
    isNaN(dsa) ||
    isNaN(projects) ||
    communication === "" ||
    internship === "" ||
    stack === ""
  ) {
    alert("Please fill all fields properly");
    return;
  }

  let score = 0;

  score += cgpa * 5;
  score += dsa * 4;
  score += projects * 3;

  if (communication === "Excellent") score += 15;
  else if (communication === "Good") score += 10;
  else if (communication === "Average") score += 5;

  if (internship === "Yes") score += 15;

  if (stack === "AI / ML") score += 10;
  else if (stack === "Web Development") score += 8;
  else if (stack === "Data Science") score += 9;

  if (score > 100) score = 100;

  let packageValue = (score / 10).toFixed(1);

  let suggestion = "";

  if (score >= 80) {
    suggestion = "You're placement ready 🚀";
  } else if (score >= 60) {
    suggestion = "Improve DSA and projects";
  } else {
    suggestion = "Focus on skills and internships";
  }

  document.getElementById("placementChance").textContent = `${score}%`;
  document.getElementById("expectedPackage").textContent = `₹${packageValue} LPA`;
  document.getElementById("suggestion").textContent = suggestion;

  document.getElementById("resultBox").style.display = "block";
});


const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("placementTheme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("placementTheme", "dark");
    themeToggle.textContent = "☀️";
  } else {
    localStorage.setItem("placementTheme", "light");
    themeToggle.textContent = "🌙";
  }

});