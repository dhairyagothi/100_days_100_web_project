document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // DOM ELEMENTS
    // =========================

    const input = document.getElementById("inputString");
    const checkBtn = document.getElementById("checkBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyBtn = document.getElementById("copyBtn");

    const resultBox = document.getElementById("resultBox");
    const resultText = document.getElementById("resultText");
    const resultIcon = document.getElementById("resultIcon");

    const themeSelector = document.getElementById("themeSelector");

    const processedText = document.getElementById("processedText");
    const characterContainer = document.getElementById("characterContainer");
    const comparisonCount = document.getElementById("comparisonCount");

    const educationalToggle = document.getElementById("educationalToggle");

    const historyList = document.getElementById("historyList");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    const totalChecksEl = document.getElementById("totalChecks");
    const palindromeCountEl = document.getElementById("palindromeCount");
    const generatedCountEl = document.getElementById("generatedCount");

    // =========================
    // STATE
    // =========================

    let educationalMode = true;
    let lastResult = "";

    let stats = {
        totalChecks: parseInt(localStorage.getItem("totalChecks")) || 0,
        palindromeCount: parseInt(localStorage.getItem("palindromeCount")) || 0,
        generatedCount: parseInt(localStorage.getItem("generatedCount")) || 0
    };

    let history =
        JSON.parse(localStorage.getItem("palindromeHistory")) || [];

    // =========================
    // THEME
    // =========================

    const savedTheme =
        localStorage.getItem("palindromeTheme") || "dark";

    document.documentElement.setAttribute(
        "data-theme",
        savedTheme
    );

    themeSelector.value = savedTheme;

    themeSelector.addEventListener("change", () => {

        document.documentElement.setAttribute(
            "data-theme",
            themeSelector.value
        );

        localStorage.setItem(
            "palindromeTheme",
            themeSelector.value
        );
    });

    // =========================
    // HELPERS
    // =========================

    function saveStats() {

        localStorage.setItem(
            "totalChecks",
            stats.totalChecks
        );

        localStorage.setItem(
            "palindromeCount",
            stats.palindromeCount
        );

        localStorage.setItem(
            "generatedCount",
            stats.generatedCount
        );
    }

    function updateStatsUI() {

        totalChecksEl.textContent =
            stats.totalChecks;

        palindromeCountEl.textContent =
            stats.palindromeCount;

        generatedCountEl.textContent =
            stats.generatedCount;
    }

    function saveHistory() {

        localStorage.setItem(
            "palindromeHistory",
            JSON.stringify(history)
        );
    }

    function addToHistory(inputValue, outputValue) {

        history.unshift({
            input: inputValue,
            output: outputValue,
            time: new Date().toLocaleTimeString()
        });

        if (history.length > 10) {
            history.pop();
        }

        saveHistory();
        renderHistory();
    }

    function renderHistory() {

        if (!history.length) {

            historyList.innerHTML =
                `<div class="history-placeholder">
                    No history available
                </div>`;

            return;
        }

        historyList.innerHTML = "";

        history.forEach(item => {

            const div = document.createElement("div");

            div.className = "history-item";

            div.innerHTML = `
                <strong>${item.input}</strong>
                <small>${item.time}</small>
                <p>${item.output}</p>
            `;

            historyList.appendChild(div);
        });
    }

    function cleanString(str) {

        return str
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "");
    }

    function isPalindrome(str) {

        const cleaned = cleanString(str);

        return cleaned ===
            cleaned.split("").reverse().join("");
    }

    function generateShortestPalindrome(str) {

        const reverse = s =>
            s.split("").reverse().join("");

        const check = s =>
            s === reverse(s);

        for (let i = 0; i < str.length; i++) {

            const suffix = str.slice(i);

            if (check(suffix)) {

                const prefix =
                    str.slice(0, i);

                return str + reverse(prefix);
            }
        }

        return str;
    }

    // =========================
    // VISUALIZATION
    // =========================

    async function visualize(text) {

        characterContainer.innerHTML = "";

        processedText.textContent =
            `Processed: ${text}`;

        let comparisons = 0;

        const chars = text.split("");

        chars.forEach(char => {

            const box =
                document.createElement("div");

            box.className = "char-box";

            box.textContent = char;

            characterContainer.appendChild(box);
        });

        const boxes =
            document.querySelectorAll(".char-box");

        let left = 0;
        let right = boxes.length - 1;

        while (left <= right) {

            comparisons++;

            comparisonCount.textContent =
                `Comparisons: ${comparisons}`;

            boxes[left].classList.add("active");
            boxes[right].classList.add("active");

            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );

            if (
                text[left] === text[right]
            ) {

                boxes[left].classList.add("match");
                boxes[right].classList.add("match");

            } else {

                boxes[left].classList.add("mismatch");
                boxes[right].classList.add("mismatch");
            }

            boxes[left].classList.remove("active");
            boxes[right].classList.remove("active");

            left++;
            right--;
        }
    }

    // =========================
    // RESULT UI
    // =========================

    function showResult(type, icon, text) {

        resultBox.className =
            "result-container";

        resultBox.classList.add(
            `result-${type}`
        );

        resultIcon.textContent = icon;
        resultText.textContent = text;
    }

    // =========================
    // EDUCATIONAL MODE
    // =========================

    educationalToggle.addEventListener(
        "click",
        () => {

            educationalMode =
                !educationalMode;

            educationalToggle.textContent =
                `Educational Mode: ${
                    educationalMode
                        ? "ON"
                        : "OFF"
                }`;
        }
    );

    // =========================
    // MAIN ACTION
    // =========================

    checkBtn.addEventListener(
        "click",
        async () => {

            const value =
                input.value.trim();

            if (!value) {

                alert(
                    "Please enter text first."
                );

                return;
            }

            stats.totalChecks++;

            if (isPalindrome(value)) {

                stats.palindromeCount++;

                showResult(
                    "success",
                    "✅",
                    `"${value}" is already a palindrome`
                );

                lastResult = value;

                if (
                    typeof confetti ===
                    "function"
                ) {

                    confetti({
                        particleCount: 120,
                        spread: 90
                    });
                }

                await visualize(
                    cleanString(value)
                );

                addToHistory(
                    value,
                    value
                );

            } else {

                stats.generatedCount++;

                const generated =
                    generateShortestPalindrome(
                        value
                    );

                showResult(
                    "info",
                    "✨",
                    generated
                );

                lastResult = generated;

                await visualize(
                    cleanString(generated)
                );

                addToHistory(
                    value,
                    generated
                );
            }

            saveStats();
            updateStatsUI();
        }
    );

    // =========================
    // COPY RESULT
    // =========================

    copyBtn.addEventListener(
        "click",
        async () => {

            if (!lastResult) return;

            try {

                await navigator.clipboard
                    .writeText(lastResult);

                copyBtn.textContent =
                    "Copied ✓";

                setTimeout(() => {

                    copyBtn.innerHTML =
                        `<i class="bi bi-clipboard"></i>
                        Copy Result`;

                }, 1500);

            } catch (err) {

                console.error(err);
            }
        }
    );

    // =========================
    // CLEAR
    // =========================

    clearBtn.addEventListener(
        "click",
        () => {

            input.value = "";

            lastResult = "";

            processedText.textContent = "";

            comparisonCount.textContent =
                "Comparisons: 0";

            characterContainer.innerHTML =
                "";

            resultBox.className =
                "result-container";

            resultIcon.textContent = "⌨️";

            resultText.textContent =
                "Waiting for input...";
        }
    );

    // =========================
    // CLEAR HISTORY
    // =========================

    clearHistoryBtn.addEventListener(
        "click",
        () => {

            history = [];

            localStorage.removeItem(
                "palindromeHistory"
            );

            renderHistory();
        }
    );

    // =========================
    // ENTER KEY
    // =========================

    input.addEventListener(
        "keydown",
        e => {

            if (e.key === "Enter") {
                checkBtn.click();
            }
        }
    );

    // =========================
    // INITIAL LOAD
    // =========================

    updateStatsUI();
    renderHistory();
});