const lengthSlider = document.querySelector("[data-lengthSlider]");
const lengthNumber = document.querySelector("[data-lengthNumber]");
const passwordBox = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const indicator = document.querySelector("[data-indicator]");
const strengthText = document.querySelector("[data-strengthText]");
const generateBtn = document.querySelector(".generateButton");

// update slider UI
lengthSlider.addEventListener("input", () => {
  lengthNumber.textContent = lengthSlider.value;
});

// ✅ Secure random function (fixes CodeQL issue)
function secureRandom(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function generatePassword() {
  let length = parseInt(lengthSlider.value);

  let lower = "abcdefghijklmnopqrstuvwxyz";
  let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let numbers = "0123456789";
  let symbols = "!@#$%^&*()_+[]{}<>?/";

  let charset = "";

  let selectedSets = [];

  if (document.getElementById("lowercase").checked) {
    charset += lower;
    selectedSets.push(lower);
  }
  if (document.getElementById("uppercase").checked) {
    charset += upper;
    selectedSets.push(upper);
  }
  if (document.getElementById("numbers").checked) {
    charset += numbers;
    selectedSets.push(numbers);
  }
  if (document.getElementById("symbols").checked) {
    charset += symbols;
    selectedSets.push(symbols);
  }

  // ❌ FIX: prevent empty charset crash
  if (!charset) {
    passwordBox.value = "Select options!";
    indicator.style.width = "0%";
    strengthText.textContent = "Weak";
    return;
  }

  let password = "";

  // ensure at least 1 char from each selected type
  selectedSets.forEach(set => {
    password += set[secureRandom(set.length)];
  });

  // fill remaining length securely
  for (let i = password.length; i < length; i++) {
    password += charset[secureRandom(charset.length)];
  }

  // secure shuffle (Fisher-Yates)
  password = password.split("");

  for (let i = password.length - 1; i > 0; i--) {
    let j = secureRandom(i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }

  password = password.join("");

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
  if (passwordBox.value) {
    navigator.clipboard.writeText(passwordBox.value);
  }
});