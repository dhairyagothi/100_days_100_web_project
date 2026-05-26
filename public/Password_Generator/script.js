const warningMsg = document.getElementById("warningMsg");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const hideTimerText = document.getElementById("hideTimer");
const eyeBtn = document.querySelector("[data-eye]");
const suggestionBox = document.getElementById("suggestionBox");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const strengthText = document.querySelector("[data-strengthText]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const historyList = document.querySelector("[data-history-list]");
const clearHistoryBtn = document.querySelector("[data-clear-history]");
const customWordCheck = document.getElementById("customWordMode");
const customWordSection = document.getElementById("customWordSection");
const customWordInput = document.getElementById("customWordInput");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let passwordHistory = loadPasswordHistory();
const PASSWORD_HISTORY_KEY = "passwordGeneratorHistory";

let password = "";
let checkCount = 0;
let hideTimeout;
let countdownInterval;
setIndicator("#ccc");
renderPasswordHistory();

let passwordLength = 10;
handleSlider();
handleCheckBoxChange();
calcStrength();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = Number(inputSlider.min);
    const max = Number(inputSlider.max);
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    if (lengthDisplay) lengthDisplay.style.color = color;
}

function loadPasswordHistory() {
    try {
        const storedHistory = localStorage.getItem(PASSWORD_HISTORY_KEY);
        if (!storedHistory) return [];
        const parsedHistory = JSON.parse(storedHistory);
        if (!Array.isArray(parsedHistory)) return [];
        return parsedHistory.filter((item) => typeof item === "string" && item.trim()).slice(0, 5);
    } catch (error) {
        return [];
    }
}

function savePasswordHistory() {
    try {
        localStorage.setItem(PASSWORD_HISTORY_KEY, JSON.stringify(passwordHistory));
    } catch (error) {
        return;
    }
}

function renderPasswordHistory() {
    historyList.innerHTML = "";
    if (passwordHistory.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "history-empty";
        emptyItem.textContent = "No recent passwords yet";
        historyList.appendChild(emptyItem);
        return;
    }
    passwordHistory.forEach((savedPassword) => {
        const historyItem = document.createElement("li");
        historyItem.className = "history-item";
        historyItem.textContent = savedPassword;
        historyList.appendChild(historyItem);
    });
}

function addPasswordToHistory(newPassword) {
    passwordHistory = [newPassword, ...passwordHistory];
    if (passwordHistory.length > 5) passwordHistory = passwordHistory.slice(0, 5);
    savePasswordHistory();
    renderPasswordHistory();
}

function clearPasswordHistory() {
    passwordHistory = [];
    savePasswordHistory();
    renderPasswordHistory();
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 10);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function generateFromCustomWord(word) {
    const leetMap = {
        'a': '@', 'e': '3', 'i': '!', 'o': '0',
        's': '$', 't': '7', 'l': '1', 'b': '8'
    };
    let result = "";
    for (let char of word.toLowerCase()) {
        if (leetMap[char] && Math.random() > 0.5) {
            result += leetMap[char];
        } else if (Math.random() > 0.5) {
            result += char.toUpperCase();
        } else {
            result += char;
        }
    }
    result += getRndInteger(10, 99);
    const extraSymbols = "!@#$%";
    result += extraSymbols[getRndInteger(0, extraSymbols.length)];
    return shufflePassword(Array.from(result));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
        strengthText.innerText = "Strong";
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
        strengthText.innerText = "Medium";
    } else {
        setIndicator("#f00");
        strengthText.innerText = "Weak";
    }
    updateSuggestions();
}

function updateSuggestions() {
    if (!suggestionBox) return;
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNum = numbersCheck.checked;
    const hasSym = symbolsCheck.checked;
    const suggestions = [];
    const strength = (strengthText && strengthText.innerText) ? strengthText.innerText : '';

    if (strength === 'Strong') {
        suggestionBox.innerText = '';
        return;
    }
    if (strength === 'Medium') {
        if (!(hasUpper && hasLower)) {
            if (!hasUpper) suggestions.push('Include uppercase letters');
            if (!hasLower) suggestions.push('Include lowercase letters');
        }
        if (!(hasNum || hasSym)) suggestions.push('Include numbers or symbols');
        if (passwordLength < 8) suggestions.push('Increase length to at least 8');
    } else {
        if (!(hasLower || hasUpper)) {
            suggestions.push('Include lowercase or uppercase letters');
        } else {
            if (!hasLower) suggestions.push('Include lowercase letters');
            if (!hasUpper) suggestions.push('Include uppercase letters');
        }
        if (!(hasNum || hasSym)) suggestions.push('Include numbers or symbols');
        if (passwordLength < 6) suggestions.push('Increase length to at least 6');
    }
    if (suggestions.length === 0) suggestionBox.innerText = '';
    else suggestionBox.innerText = 'Suggestions: ' + suggestions.join(', ');
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(password);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
        handleCheckBoxChange();
        calcStrength();
    });
});

customWordCheck.addEventListener("change", () => {
    customWordSection.style.display = customWordCheck.checked ? "block" : "none";
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = parseInt(e.target.value);
    handleSlider();
    calcStrength();
});

copyBtn.addEventListener('click', () => {
    if (password && passwordDisplay.value !== "********")
        copyContent();
});

if (eyeBtn) {
    eyeBtn.addEventListener('click', () => {
        if (!password) return;
        if (passwordDisplay.value === "********") {
            passwordDisplay.value = password;
            clearTimeout(hideTimeout);
            clearInterval(countdownInterval);
            let showLeft = 5;
            hideTimerText.innerText = `Visible for ${showLeft}s`;
            const tmpInterval = setInterval(() => {
                showLeft--;
                if (showLeft > 0) hideTimerText.innerText = `Visible for ${showLeft}s`;
                else {
                    clearInterval(tmpInterval);
                    passwordDisplay.value = "********";
                    hideTimerText.innerText = "Password hidden for security";
                }
            }, 1000);
        } else {
            passwordDisplay.value = "********";
            hideTimerText.innerText = "Password hidden for security";
            clearTimeout(hideTimeout);
            clearInterval(countdownInterval);
        }
    });
}

generateBtn.addEventListener('click', () => {
    if (customWordCheck.checked) {
        const word = customWordInput.value.trim();
        if (!word) {
            warningMsg.innerText = "Please enter a base word";
            return;
        }
        warningMsg.innerText = "";
        password = generateFromCustomWord(word);
        passwordDisplay.value = password;
        addPasswordToHistory(password);
        calcStrength();
        return;
    }

    if (checkCount == 0) {
        warningMsg.innerText = "Please select at least one option";
        return;
    }
    warningMsg.innerText = "";

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    addPasswordToHistory(password);

    clearTimeout(hideTimeout);
    clearInterval(countdownInterval);
    let timeLeft = 10;
    hideTimerText.innerText = `Password will auto-hide in ${timeLeft}s`;
    countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            hideTimerText.innerText = `Password will auto-hide in ${timeLeft}s`;
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);

    hideTimeout = setTimeout(() => {
        passwordDisplay.value = "********";
        hideTimerText.innerText = "Password hidden for security";
        clearInterval(countdownInterval);
    }, 10000);

    calcStrength();
});

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearPasswordHistory);
}
