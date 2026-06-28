const lengthSlider = document.querySelector("[data-lengthSlider]");
const lengthNumber = document.querySelector("[data-lengthNumber]");
const passwordBox = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const indicator = document.querySelector("[data-indicator]");
const strengthText = document.querySelector("[data-strengthText]");
const generateBtn = document.querySelector(".generateButton");

lengthSlider.addEventListener("input", () => {
  lengthNumber.textContent = lengthSlider.value;
});

function generatePassword() {
  let length = lengthSlider.value;

  let lower = "abcdefghijklmnopqrstuvwxyz";
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";
  let symbols = "!@#$%^&*()_+[]{}<>?/";

  let charset = "";

  if (document.getElementById("lowercase").checked) charset += lower;
  if (document.getElementById("uppercase").checked) charset += upper;
  if (document.getElementById("numbers").checked) charset += numbers;
  if (document.getElementById("symbols").checked) charset += symbols;

  let password = "";

  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  passwordBox.value = password;
  checkStrength(password);
}

function checkStrength(pass) {
  let score = 0;

  if (pass.length >= 10) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  let percent = (score / 4) * 100;
  indicator.style.width = percent + "%";

  if (score <= 1) {
    indicator.style.background = "red";
    strengthText.textContent = "Weak";
  } else if (score === 2 || score === 3) {
    indicator.style.background = "orange";
    strengthText.textContent = "Medium";
  } else {
    indicator.style.background = "limegreen";
    strengthText.textContent = "Strong";
  }
}

generateBtn.addEventListener("click", generatePassword);

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(passwordBox.value);
});