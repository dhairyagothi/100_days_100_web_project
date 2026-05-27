const warningMsg = document.getElementById("warningMsg");
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn         = document.querySelector("[data-copy]");
const copyMsg         = document.querySelector("[data-copyMsg]");
const hideTimerText   = document.getElementById("hideTimer");
const uppercaseCheck  = document.querySelector("#uppercase");
const lowercaseCheck  = document.querySelector("#lowercase");
const numbersCheck    = document.querySelector("#numbers");
const symbolsCheck    = document.querySelector("#symbols");
const indicator       = document.querySelector("[data-indicator]");
const strengthText    = document.querySelector("[data-strengthText]");
const generateBtn     = document.querySelector(".generateButton");
const allCheckBox     = document.querySelectorAll(".check input[type=checkbox]:not(#useCustomWord)");

// Custom Word & Suggestions
const suggestionsText    = document.getElementById("suggestionsText");
const useCustomWordCheck = document.getElementById("useCustomWord");
const customWordInput    = document.getElementById("customWordInput");

// History Section
const historyContainer = document.getElementById("historyContainer");
const historyList      = document.getElementById("historyList");
const clearHistoryBtn  = document.getElementById("clearHistoryBtn");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
let hideTimeout;
let countdownInterval;
let passwordsHistory = []; 

handleSlider();
setIndicator("#ccc");
updateSuggestions();
renderHistory(); 

customWordInput.style.display = useCustomWordCheck.checked ? "block" : "none";

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 15px 5px ${color}`; 
}

function getRndInteger(min, max) { return Math.floor(Math.random() * (max - min)) + min; }
function generateRandomNumber() { return getRndInteger(0, 10).toString(); }
function generateLowerCase() { return String.fromCharCode(getRndInteger(97, 123)); }
function generateUpperCase() { return String.fromCharCode(getRndInteger(65, 91)); }
function generateSymbol() { return symbols.charAt(getRndInteger(0, symbols.length)); }

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
        setIndicator("#0f0"); strengthText.innerText = "Strong";
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); strengthText.innerText = "Medium";
    } else {
        setIndicator("#f00"); strengthText.innerText = "Weak";
    }
}

function updateSuggestions() {
    let missing = [];
    if (!uppercaseCheck.checked) missing.push("uppercase letters");
    if (!lowercaseCheck.checked) missing.push("lowercase letters");
    if (!numbersCheck.checked) missing.push("numbers");
    if (!symbolsCheck.checked) missing.push("symbols");

    if (missing.length === 0) {
        suggestionsText.innerText = "Looking good! All options selected.";
        suggestionsText.style.color = "#2dd4bf"; 
    } else {
        suggestionsText.innerText = "Suggestions: Include " + missing.join(", ");
        suggestionsText.style.color = "var(--vb-yellow)";
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
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (e) { copyMsg.innerText = "Failed"; }
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
    allCheckBox.forEach((checkbox) => { if (checkbox.checked) checkCount++; });
    if (!useCustomWordCheck.checked && passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    updateSuggestions();
}

function updateHistory(newPassword) {
    passwordsHistory.unshift(newPassword);
    if (passwordsHistory.length > 3) passwordsHistory.pop(); 
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";
    if (passwordsHistory.length === 0) {
        historyContainer.style.display = "none";
        return;
    }
    historyContainer.style.display = "flex";
    passwordsHistory.forEach(pw => {
        const div = document.createElement("div");
        div.classList.add("history-item");
        div.innerText = pw;
        historyList.appendChild(div);
    });
}

clearHistoryBtn.addEventListener("click", () => {
    passwordsHistory = [];
    renderHistory();
});

allCheckBox.forEach((checkbox) => { checkbox.addEventListener("change", handleCheckBoxChange); });

useCustomWordCheck.addEventListener("change", () => {
    customWordInput.style.display = useCustomWordCheck.checked ? "block" : "none";
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = parseInt(e.target.value);
    handleSlider();
    calcStrength();
});

copyBtn.addEventListener("click", () => { if (passwordDisplay.value) copyContent(); });

generateBtn.addEventListener("click", () => {
    let customWord = useCustomWordCheck.checked ? customWordInput.value.trim() : "";

    if (checkCount === 0 && customWord.length === 0) {
        warningMsg.innerText = "⚠️ Please select options or enter a custom word.";
        return;
    }
    warningMsg.innerText = "";
    password = "";
    
    let randomCharsNeeded = passwordLength - customWord.length;
    let randomPart = "";

    // Generate the required random characters
    if (randomCharsNeeded > 0 && checkCount > 0) {
        let funcArr = [];
        if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
        if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
        if (numbersCheck.checked)   funcArr.push(generateRandomNumber);
        if (symbolsCheck.checked)   funcArr.push(generateSymbol);

        for (let i = 0; i < randomCharsNeeded; i++) {
            randomPart += funcArr[getRndInteger(0, funcArr.length)]();
        }
    }

    let combinedString = customWord + randomPart;
    password = shufflePassword(Array.from(combinedString));

    if(password.length > passwordLength) {
        passwordLength = password.length;
        handleSlider();
    }

    passwordDisplay.value = password;
    updateHistory(password); 

    clearTimeout(hideTimeout);
    clearInterval(countdownInterval);
    let timeLeft = 10;
    if (hideTimerText) hideTimerText.innerText = `Password will auto-hide in ${timeLeft}s`;

    countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            if (hideTimerText) hideTimerText.innerText = `Password will auto-hide in ${timeLeft}s`;
        } else { clearInterval(countdownInterval); }
    }, 1000);

    hideTimeout = setTimeout(() => {
        passwordDisplay.value = "********";
        if (hideTimerText) hideTimerText.innerText = "Password hidden for security";
        clearInterval(countdownInterval);
    }, 10000);

    calcStrength();
});

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearPasswordHistory);
}
