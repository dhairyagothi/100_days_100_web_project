// ── DOM Selectors ──
const warningMsg      = document.getElementById("warningMsg");
const inputSlider     = document.querySelector("[data-lengthSlider]");
const lengthDisplay   = document.querySelector("[data-lengthNumber]");
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
const allCheckBox     = document.querySelectorAll("input[type=checkbox]");
const symbols         = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

// ── State ──
let password          = "";
let passwordLength    = 10;
let checkCount        = 0;
let hideTimeout;
let countdownInterval;

// ── Init ──
handleSlider();
setIndicator("#ccc");

// ── Functions ──

function handleSlider() {
    inputSlider.value       = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 10).toString();
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    return symbols.charAt(getRndInteger(0, symbols.length));
}

function calcStrength() {
    const hasUpper = uppercaseCheck.checked;
    const hasLower = lowercaseCheck.checked;
    const hasNum   = numbersCheck.checked;
    const hasSym   = symbolsCheck.checked;

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
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => copyMsg.classList.remove("active"), 2000);
}

function shufflePassword(array) {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
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

// ── Event Listeners ──

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
    passwordLength = parseInt(e.target.value);
    handleSlider();
});

copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
    if (checkCount === 0) {
        warningMsg.innerText = "⚠️ Please select at least one option";
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
    if (numbersCheck.checked)   funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked)   funcArr.push(generateSymbol);

    // Guarantee at least one char from each selected type
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Fill remaining length
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        password += funcArr[getRndInteger(0, funcArr.length)]();
    }

    // Shuffle so guaranteed chars aren't always at the start
    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    // Auto-hide password after 10 seconds for security
    clearTimeout(hideTimeout);
    clearInterval(countdownInterval);

    let timeLeft = 10;
    if (hideTimerText) {
        hideTimerText.innerText = `Password will auto-hide in ${timeLeft}s`;
    }

    countdownInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft > 0) {
            if (hideTimerText) {
                hideTimerText.innerText = `Password will auto-hide in ${timeLeft}s`;
            }
        } else {
            clearInterval(countdownInterval);
        }
    }, 1000);

    hideTimeout = setTimeout(() => {
        passwordDisplay.value = "********";
        if (hideTimerText) {
            hideTimerText.innerText = "Password hidden for security";
        }
        clearInterval(countdownInterval);
    }, 10000);

    calcStrength();
});