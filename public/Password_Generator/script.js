const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const strengthText = document.querySelector("[data-strengthText]");
const historyContainer = document.querySelector("[data-history]");
const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 12;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

function secureRandom(max) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return array[0] % max;
}

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    inputSlider.style.backgroundSize =
        ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px ${color}`;
}

function generateRandomNumber() {
    return secureRandom(10);
}

function generateLowerCase() {
    return String.fromCharCode(97 + secureRandom(26));
}

function generateUpperCase() {
    return String.fromCharCode(65 + secureRandom(26));
}

function generateSymbol() {
    return symbols.charAt(secureRandom(symbols.length));
}

function shufflePassword(array) {
    for(let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function calcEntropy() {
    let charset = 0;

    if(uppercaseCheck.checked) charset += 26;
    if(lowercaseCheck.checked) charset += 26;
    if(numbersCheck.checked) charset += 10;
    if(symbolsCheck.checked) charset += symbols.length;

    return Math.round(passwordLength * Math.log2(charset));
}

function calcStrength() {
    const entropy = calcEntropy();

    if(entropy < 40) {
        setIndicator("#ff4d4d");
        strengthText.innerText = "Weak";
    }
    else if(entropy < 60) {
        setIndicator("#ffd633");
        strengthText.innerText = "Medium";
    }
    else if(entropy < 80) {
        setIndicator("#66ff66");
        strengthText.innerText = "Strong";
    }
    else {
        setIndicator("#00ffcc");
        strengthText.innerText = "Beast";
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function saveHistory(password) {
    let history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    history.unshift(password);

    if(history.length > 5)
        history.pop();

    localStorage.setItem("passwordHistory", JSON.stringify(history));

    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem("passwordHistory")) || [];

    historyContainer.innerHTML = "";

    history.forEach(pass => {
        const div = document.createElement("div");
        div.classList.add("history-item");
        div.innerText = pass;
        historyContainer.appendChild(div);
    });
}

function handleCheckBoxChange() {
    checkCount = 0;

    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
});

generateBtn.addEventListener('click', () => {

    if(checkCount === 0)
        return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    for(let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for(let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = secureRandom(funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();

    saveHistory(password);
});

renderHistory();