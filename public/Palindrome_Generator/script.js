/**
 * Palindrome Check Logic
 * Triggered only on Button Click
 */

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputString");
  const checkBtn = document.getElementById("checkBtn");
  const resultBox = document.getElementById("resultBox");
  const resultText = document.getElementById("resultText");
  const resultIcon = document.getElementById("resultIcon");
  const clearBtn = document.getElementById("clearBtn");
  const characterContainer = document.getElementById("characterContainer");
  const processedText = document.getElementById("processedText");
  const comparisonCount = document.getElementById("comparisonCount");
  const educationalToggle = document.getElementById("educationalToggle");

  let educationalMode = true;
  educationalToggle.addEventListener("click", () => {
    educationalMode = !educationalMode;
    educationalToggle.innerText = educationalMode
      ? "Educational Mode: ON"
      : "Educational Mode: OFF";
  });

  // Action on Button Click
  checkBtn.addEventListener("click", () => {
    const val = input.value.trim();

    if (!val) {
      alert("Please enter some text first!");
      return;
    }

    // ✅ FIX: Detect if input is numeric or string
    const isNumeric = !isNaN(val) && val !== "";
    const inputType = isNumeric ? "Number" : "String";

    // ✅ FIX: Apply appropriate palindrome logic based on type
    const generatePalindrome = (str) => {
      if (!str) return "";
      if (!isNaN(str) && str !== "") {
        // Numeric palindrome logic
        const num = str.replace(/^0+/, "") || "0";
        const reversed = num.split("").reverse().join("");
        return num === reversed ? num : num + reversed.slice(1);
      }
      // String palindrome logic
      const reversed = str.split("").reverse().join("");
      return str + reversed;
    };

    const palindromeResult = generatePalindrome(val);

    const cleanedText = palindromeResult
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    processedText.innerHTML = `Processed String (Type: <strong>${inputType}</strong>): <strong>${cleanedText}</strong>`;

    characterContainer.innerHTML = "";

    let comparisons = 0;

    cleanedText.split("").forEach((char) => {
      const charBox = document.createElement("div");
      charBox.classList.add("char-box");
      charBox.innerText = char;
      characterContainer.appendChild(charBox);
    });

    const charBoxes = document.querySelectorAll(".char-box");

    let left = 0;
    let right = cleanedText.length - 1;

    const interval = setInterval(
      () => {
        if (left >= right) {
          clearInterval(interval);
          comparisonCount.innerText = `Comparisons: ${comparisons}`;
          return;
        }

        comparisons++;

        charBoxes[left].classList.add("active");
        charBoxes[right].classList.add("active");

        setTimeout(
          () => {
            if (cleanedText[left] === cleanedText[right]) {
              charBoxes[left].classList.add("match");
              charBoxes[right].classList.add("match");
            } else {
              charBoxes[left].classList.add("mismatch");
              charBoxes[right].classList.add("mismatch");
            }

            charBoxes[left].classList.remove("active");
            charBoxes[right].classList.remove("active");

            left++;
            right--;

            comparisonCount.innerText = `Comparisons: ${comparisons}`;
          },
          educationalMode ? 500 : 0,
        );
      },
      educationalMode ? 800 : 0,
    );

    // Update UI
    resultBox.className = "result-container mt-4 text-center success-bg";
    resultText.innerText = `Result: ${palindromeResult} (${inputType})`;
    resultIcon.innerText = "🎯";

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    resultBox.className = "result-container mt-4 text-center";
    resultText.innerText = "Waiting for you to click generate...";
    resultIcon.innerText = "⌨️";
    characterContainer.innerHTML = "";
    processedText.innerHTML = "";
    comparisonCount.innerText = "Comparisons: 0";
  });
});
