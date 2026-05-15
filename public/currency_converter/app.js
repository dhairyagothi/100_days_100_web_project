const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");


// ======================
// Dropdown Populate
// ======================

for (let select of dropdowns) {

  for (let currCode in countryList) {

    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default Selected Values
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    }

    else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Flag Update
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}


// ======================
// Exchange Rate Function
// ======================

const updateExchangeRate = async () => {

  let amount = document.querySelector(".amount input");

  let amtVal = amount.value;

  // Validation
  if (amtVal === "" || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  }

  msg.innerText = "Getting exchange rate...";

  const URL = `${BASE_URL}/${fromCurr.value}`;

  try {

    let response = await fetch(URL);

    let data = await response.json();

    // Exchange Rate
    let rate = data.rates[toCurr.value];

    // Final Amount
    let finalAmount = amtVal * rate;

    // Display Result
    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;

  }

  catch (error) {

    msg.innerText = "Something went wrong!";

    console.log(error);
  }
};


// ======================
// Update Flag Function
// ======================

const updateFlag = (element) => {

  let currCode = element.value;

  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};


// ======================
// Button Click
// ======================

btn.addEventListener("click", (evt) => {

  evt.preventDefault();

  updateExchangeRate();
});


// ======================
// Load Default Rate
// ======================

window.addEventListener("load", () => {

  updateExchangeRate();
});