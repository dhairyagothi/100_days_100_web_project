//************ CURRENCY_CONVERTER_TASK **************************************** 
const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/eur.json"

const MAX_AMOUNT = 100000000; // Configurable maximum amount (100 Million)

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("#convert-btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector("#amount-input");
const amountError = document.querySelector("#amount-error");


for (let select of dropdowns) {
    for (currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "From" && currCode === "USD") {
            newOption.selected = "selected";
        }
        else if (select.name === "To" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    // console.log(currCode);
    // console.log(countryList[currCode]);
    let countryCode = countryList[currCode];
    let img = element.parentElement.querySelector("img");
    let url = `https://flagsapi.com/${countryCode}/flat/64.png`;
    // console.log(url);
    img.src = url;
}

const showError = (message) => {
    amountError.innerText = message;
    amountError.style.display = "block";
    amountInput.classList.add("error-input");
    amountInput.setAttribute("aria-invalid", "true");
    msg.innerText = "";
};

const clearError = () => {
    amountError.innerText = "";
    amountError.style.display = "none";
    amountInput.classList.remove("error-input");
    amountInput.setAttribute("aria-invalid", "false");
};

// Clear errors dynamically when user types
amountInput.addEventListener("input", () => {
    clearError();
});


btn.addEventListener("click", async (evt) => {
    evt.preventDefault(); //ye page reload hone se bachega becoz relload hone par jo humne dropdown chokse kare ya input daala vo sab reset bhi ho sakta hai
    
    const amtVal = amountInput.value.trim();
    
    // 1. Check if empty
    if (amtVal === "") {
        showError("Please enter a valid number.");
        return;
    }
    
    const parsedAmt = Number(amtVal);
    
    // 2. Check if valid numeric
    if (isNaN(parsedAmt) || !isFinite(parsedAmt)) {
        showError("Please enter a valid number.");
        return;
    }
    
    // 3. Reject negative and zero
    if (parsedAmt <= 0) {
        showError("Amount must be greater than zero.");
        return;
    }
    
    // 4. Enforce maximum limit
    if (parsedAmt > MAX_AMOUNT) {
        showError("Amount exceeds the maximum allowed limit.");
        return;
    }

    clearError();

    try {
        // Show loading state
        btn.disabled = true;
        btn.innerText = "Converting...";
        
        let response = await fetch(BASE_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rates.");
        }
        let data = await response.json();
        
        let fromVal = fromCurr.value.toLowerCase();
        let toVal = toCurr.value.toLowerCase();

        let target_rate = data.eur[toVal];
        let source_rate = data.eur[fromVal];

        if (target_rate === undefined || source_rate === undefined) {
            throw new Error("Selected currency not supported.");
        }

        let final_amount = (target_rate / source_rate) * parsedAmt;
        
        // Format input and results for display
        let formattedAmt = parsedAmt.toLocaleString(undefined, {
            maximumFractionDigits: 6
        });
        
        let formattedFinal = final_amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        msg.innerText = `${formattedAmt} ${fromCurr.value} = ${formattedFinal} ${toCurr.value}`;
    } catch (error) {
        console.error("Conversion Error:", error);
        msg.innerText = "Failed to get exchange rate. Please try again later.";
    } finally {
        // Restore button state
        btn.disabled = false;
        btn.innerText = "Get Exchange Rate";
    }
});