/* =========================
   API
========================= */

const api = "https://api.exchangerate-api.com/v4/latest/USD";

/* =========================
   SELECTORS
========================= */

const amountInput = document.querySelector(".searchBox");

const convertBtn = document.querySelector(".convert");

const fromCurrency = document.querySelector(".from");

const toCurrency = document.querySelector(".to");

const finalValue = document.querySelector(".finalValue");

const finalAmount = document.querySelector("#finalAmount");

const loading = document.querySelector(".loading");

const swapBtn = document.querySelector("#swap");

const historyList = document.querySelector(".history-list");

const quickButtons = document.querySelectorAll(".quick-btn");

const clearHistoryBtn = document.querySelector(".clear-history");

/* =========================
   INITIAL STATE
========================= */

finalAmount.style.display = "none";

/* DEFAULT CURRENCIES */

fromCurrency.value = "USD";
toCurrency.value = "INR";

/* =========================
   EVENT LISTENERS
========================= */

convertBtn.addEventListener("click", getResults);

swapBtn.addEventListener("click", swapCurrencies);

amountInput.addEventListener("input", debounce(autoConvert, 600));

fromCurrency.addEventListener("change", autoConvert);

toCurrency.addEventListener("change", autoConvert);

clearHistoryBtn.addEventListener("click", clearHistory);

/* QUICK BUTTONS */

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    fromCurrency.value = button.dataset.from;

    toCurrency.value = button.dataset.to;

    autoConvert();
  });
});

/* =========================
   AUTO CONVERT
========================= */

function autoConvert() {
  if (
    amountInput.value.trim() !== "" &&
    fromCurrency.value &&
    toCurrency.value
  ) {
    getResults();
  }
}

/* =========================
   FETCH RESULTS
========================= */

async function getResults() {
  const amount = parseFloat(amountInput.value);

  /* VALIDATION */

  if (isNaN(amount) || amount <= 0) {
    showNotification("Please enter a valid amount.", "error");

    return;
  }

  try {
    toggleLoading(true);

    const response = await fetch(api);

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    displayResults(data, amount);
  } catch (error) {
    console.error(error);

    showNotification("Unable to fetch live exchange rates.", "error");
  } finally {
    toggleLoading(false);
  }
}

/* =========================
   DISPLAY RESULTS
========================= */

function displayResults(data, amount) {
  const fromRate = data.rates[fromCurrency.value];

  const toRate = data.rates[toCurrency.value];

  const convertedAmount = (toRate / fromRate) * amount;

  finalValue.innerHTML = `
        ${amount}
        ${fromCurrency.value}
        =
        ${convertedAmount.toFixed(2)}
        ${toCurrency.value}
        `;

  finalAmount.style.display = "block";

  saveHistory(amount, fromCurrency.value, convertedAmount, toCurrency.value);

  animateResult();
}

/* =========================
   SWAP CURRENCIES
========================= */

function swapCurrencies() {
  const temp = fromCurrency.value;

  fromCurrency.value = toCurrency.value;

  toCurrency.value = temp;

  swapBtn.style.transform = "rotate(180deg)";

  setTimeout(() => {
    swapBtn.style.transform = "rotate(0deg)";
  }, 400);

  autoConvert();
}

/* =========================
   LOADING STATE
========================= */

function toggleLoading(state) {
  loading.style.display = state ? "block" : "none";

  convertBtn.disabled = state;

  convertBtn.innerHTML = state
    ? `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Converting...
            `
    : `
            <i class="fa-solid fa-bolt"></i>
            Convert Currency
            `;
}

/* =========================
   RESET FUNCTION
========================= */

function clearVal() {
  amountInput.value = "";

  fromCurrency.value = "USD";

  toCurrency.value = "INR";

  finalAmount.style.display = "none";

  finalValue.innerHTML = "0.00";

  showNotification("Fields reset successfully.", "success");
}

/* =========================
   SAVE HISTORY
========================= */

function saveHistory(amount, from, converted, to) {
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

  const newEntry = `
        ${amount} ${from}
        → ${converted.toFixed(2)} ${to}
        `;

  /* REMOVE DUPLICATES */

  history = history.filter((item) => item !== newEntry);

  history.unshift(newEntry);

  /* KEEP LAST 6 */

  history = history.slice(0, 6);

  localStorage.setItem("conversionHistory", JSON.stringify(history));

  renderHistory();
}

/* =========================
   RENDER HISTORY
========================= */

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `
            <li>
                No recent conversions yet.
            </li>
            `;

    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <i class="fa-solid fa-clock"></i>
            ${item}
            `;

    historyList.appendChild(li);
  });
}

/* =========================
   CLEAR HISTORY
========================= */

function clearHistory() {
  localStorage.removeItem("conversionHistory");

  renderHistory();

  showNotification("History cleared.", "success");
}

/* =========================
   RESULT ANIMATION
========================= */

function animateResult() {
  finalAmount.style.animation = "none";

  setTimeout(() => {
    finalAmount.style.animation = "fadeIn 0.4s ease";
  }, 10);
}

/* =========================
   NOTIFICATION
========================= */

function showNotification(message, type) {
  const existing = document.querySelector(".custom-toast");

  if (existing) {
    existing.remove();
  }

  const toast = document.createElement("div");

  toast.className = `custom-toast ${type}`;

  toast.innerHTML = `
        <i class="fa-solid
        ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}
        "></i>

        ${message}
        `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
}

/* =========================
   DEBOUNCE
========================= */

function debounce(func, delay) {
  let timer;

  return function () {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func();
    }, delay);
  };
}

/* =========================
   INITIAL LOAD
========================= */

renderHistory();
