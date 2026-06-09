const amountInput = document.getElementById("amount");
const baseSelect = document.getElementById("base-currency");
const targetSelect = document.getElementById("target-currency");
const loadingMsg = document.getElementById("loading-msg");
const resultDisplay = document.getElementById("result-display");
const rateText = document.getElementById("rate-text");
const convertedAmount = document.getElementById("converted-amount");

async function performConversion() {
  const amountValue = parseFloat(amountInput.value);
  const baseValue = baseSelect.value;
  const targetValue = targetSelect.value;

  // Direct client side match logic validation
  if (isNaN(amountValue) || amountValue <= 0) {
    rateText.textContent = "---";
    convertedAmount.textContent = "0.00";
    return;
  }

  if (baseValue === targetValue) {
    rateText.textContent = `1 ${baseValue} = 1.0000 ${targetValue}`;
    convertedAmount.textContent = `${amountValue.toFixed(2)} ${targetValue}`;
    return;
  }

  loadingMsg.className = "status-visible";

  try {
    // High performance public Frankfurter financial tracking engine API
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amountValue}&from=${baseValue}&to=${targetValue}`,
    );
    if (!response.ok) throw new Error();
    const data = await response.json();

    const calculatedOutput = data.rates[targetValue];
    const singleUnitRate = (calculatedOutput / amountValue).toFixed(4);

    rateText.textContent = `1 ${baseValue} = ${singleUnitRate} ${targetValue}`;
    convertedAmount.textContent = `${calculatedOutput.toFixed(2)} ${targetValue}`;
  } catch (err) {
    rateText.textContent = "Error connecting to database.";
    convertedAmount.textContent = "---";
  } finally {
    loadingMsg.className = "status-hidden";
  }
}

// Attach listeners to input changes to refresh data instantly
amountInput.addEventListener("input", performConversion);
baseSelect.addEventListener("change", performConversion);
targetSelect.addEventListener("change", performConversion);

// Initial Load execution
performConversion();
