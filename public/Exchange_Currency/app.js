const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";
const FALLBACK_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const chartCanvas = document.getElementById("historyChart");
let historyChart;
const swapIcon = document.querySelector(".dropdown i");
const amtInput = document.querySelector(".amount input");
const convertedAmountField = document.querySelector(".converted-amount input");
const swapIcon = document.querySelector(".dropdown i");
const resetBtn = document.querySelector(".reset-btn");

let errorTimeout;
let resetTimeout;

const showError = (message) => {
  const errorDiv = document.querySelector(".error-msg");
  errorDiv.innerText = message;
  errorDiv.style.display = "block";
  errorDiv.classList.remove("shake");
  void errorDiv.offsetWidth; // Trigger reflow to restart animation
  errorDiv.classList.add("shake");

  convertedAmountField.value = "";
  msg.innerText = "";

  if (errorTimeout) clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    errorDiv.innerText = "";
    errorDiv.style.display = "none";
    errorDiv.classList.remove("shake");
    amtInput.value = "";
    updateExchangeRate();
  }, 2000);
};

const clearError = () => {
  const errorDiv = document.querySelector(".error-msg");
  errorDiv.innerText = "";
  errorDiv.style.display = "none";
  errorDiv.classList.remove("shake");
  if (errorTimeout) clearTimeout(errorTimeout);
};

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
  updateFlag(evt.target);
  updateExchangeRate();
  loadHistoricalChart();
});
    updateFlag(evt.target);
    updateExchangeRate();
  });
}
const loadHistoricalChart = async () => {
  try {
    const today = new Date();
    const pastDate = new Date();

    // Last 7 days
    pastDate.setDate(today.getDate() - 7);

    const endDate = today.toISOString().split("T")[0];
    const startDate = pastDate.toISOString().split("T")[0];

    const historyURL =
      `https://api.frankfurter.app/${startDate}..${endDate}?from=${fromCurr.value}&to=${toCurr.value}`;

    const response = await fetch(historyURL);
    const data = await response.json();

    const labels = [];
    const values = [];

    for (let date in data.rates) {
      labels.push(date);
      values.push(data.rates[date][toCurr.value]);
    }

    // Remove old chart
    if (historyChart) {
      historyChart.destroy();
    }

    historyChart = new Chart(chartCanvas, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: `${fromCurr.value} to ${toCurr.value}`,
          data: values,
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        }],
      },
      options: {
        responsive: true,
      },
    });

  } catch (error) {
    console.error("Error loading chart:", error);
  }
};

const updateExchangeRate = async (forceDefault = false) => {
  // Clear any success/warning alert styles if we start calculations
  msg.style.color = "";
  msg.style.borderColor = "";
  msg.style.backgroundColor = "";
  msg.classList.remove("shake");

  let amtVal = amtInput.value;
  if (forceDefault && (amtVal === "" || parseFloat(amtVal) < 1)) {
    amtVal = "1";
    amtInput.value = "1";
  }

  if (amtVal === "" || isNaN(parseFloat(amtVal))) {
    convertedAmountField.value = "";
    msg.innerText = "";
    return;
  }

  let amtNum = parseFloat(amtVal);
  if (amtNum <= 0) {
    convertedAmountField.value = "";
    msg.innerText = "Please enter a valid amount";
    return;
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  const FALLBACK_API_URL = `${FALLBACK_URL}/${fromCurr.value.toLowerCase()}.json`;

  let response;
  try {
    response = await fetch(URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate from primary API.");
    }
  } catch (error) {
    console.warn(error);
    try {
      response = await fetch(FALLBACK_API_URL);
      if (!response.ok) throw new Error("Failed to fetch exchange rate from fallback API.");
    } catch (error) {
      msg.innerText = "Error: Unable to fetch exchange rate.";
      convertedAmountField.value = "";
      console.error(error);
      return;
    }
  }

  let data = await response.json();
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

  let finalAmount = amtNum * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  convertedAmountField.value = finalAmount.toFixed(2);
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};
swapIcon.addEventListener("click", () => {
  let temp = fromCurr.value;

  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateExchangeRate();
  loadHistoricalChart();
});
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
window.addEventListener("load", () => {
  updateExchangeRate(true);
});

amtInput.addEventListener("input", () => {
  let val = amtInput.value;
  if (val === "") {
    clearError();
    updateExchangeRate();
    return;
  }

  // 1. Check for negative value
  if (val.trim().startsWith("-") || parseFloat(val) < 0) {
    showError("Only positive values are allowed");
    return;
  }

  // 2. Check for invalid characters / symbols / multiple decimals
  const validNumberPattern = /^[0-9]*\.?[0-9]*$/;
  if (!validNumberPattern.test(val.trim())) {
    showError("Please enter a valid number");
    return;
  }

  clearError();
  updateExchangeRate();
  loadHistoricalChart();
});

swapIcon.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
  loadHistoricalChart();
});
// ===============================
// 📊 HISTORICAL DATA PROCESSING
// ===============================

const formatHistoricalData = (data) => {
    let labels = [];
    let values = [];

    // Convert API object → chart arrays
    for (let date in data) {
        labels.push(date);
        values.push(data[date]);
    }

    return {
        labels: labels,
        values: values
    };
};

resetBtn.addEventListener("click", () => {
  clearError();

  // Check if already reset/cleared
  if (amtInput.value === "" && fromCurr.value === "USD" && toCurr.value === "INR") {
    // Show already reset warning in red with a shake effect
    msg.innerText = "Values are already reset";
    msg.style.color = "#d32f2f";
    msg.style.borderColor = "#ffcdd2";
    msg.style.backgroundColor = "#ffebee";

    msg.classList.remove("shake");
    void msg.offsetWidth; // Trigger reflow
    msg.classList.add("shake");

    if (resetTimeout) clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => {
      if (msg.innerText === "Values are already reset") {
        msg.innerText = "";
        msg.style.color = "";
        msg.style.borderColor = "";
        msg.style.backgroundColor = "";
        msg.classList.remove("shake");
      }
    }, 2000);
    return;
  }

  amtInput.value = "";
  convertedAmountField.value = "";
  
  // Show temporary successful reset feedback in green
  msg.innerText = "Values reset successfully";
  msg.style.color = "#2e7d32";
  msg.style.borderColor = "#c8e6c9";
  msg.style.backgroundColor = "#e8f5e9";

  fromCurr.value = "USD";
  toCurr.value = "INR";
  updateFlag(fromCurr);
  updateFlag(toCurr);

  if (resetTimeout) clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    if (msg.innerText === "Values reset successfully") {
      msg.innerText = "";
      msg.style.color = "";
      msg.style.borderColor = "";
      msg.style.backgroundColor = "";
    }
  }, 2000);
});
