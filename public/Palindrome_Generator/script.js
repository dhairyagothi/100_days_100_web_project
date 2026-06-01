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

  // Helper: Check if a string is already a palindrome
  const isPalindrome = (s) => {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned === cleaned.split("").reverse().join("");
  };

  // Action on Button Click
  checkBtn.addEventListener(
    "click",
    () => {
      const val = input.value.trim();

      if (!val) {
        alert("Please enter some text first!");
        return;
      }

      // ✅ FIX: If input is already a palindrome, show feedback and stop
      if (isPalindrome(val)) {
        resultBox.className = "result-container mt-4 text-center success-bg";
        resultIcon.innerText = "✅";
        resultText.innerText = `"${val}" is already a palindrome! No need to generate.`;
        return;
      }

      // Function to find the shortest palindrome addition
      const makeShortestPalindrome = (str) => {
        const isPalin = (s) => s === s.split("").reverse().join("");

        for (let i = 0; i < str.length; i++) {
          const suffix = str.slice(i);
          if (isPalin(suffix)) {
            const prefix = str.slice(0, i);
            const neededAddition = prefix.split("").reverse().join("");
            return str + neededAddition;
          }
        }
        return str;
      };

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
