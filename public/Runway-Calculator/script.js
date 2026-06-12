function formatCurrency(num) {
    const currency = document.getElementById("currency").value;
    let symbol = "₹";
    if (currency === "USD") symbol = "$";
    if (currency === "EUR") symbol = "€";
    return symbol + Number(num).toLocaleString();
}
function calculateRunway() {
    const cash = parseFloat(document.getElementById("cash").value);
    const burn = parseFloat(document.getElementById("burn").value);
    const result = document.getElementById("result");
    const monthsvalue = document.getElementById("months");
    const daysvalue = document.getElementById("days");
    const statusvalue = document.getElementById("status");
    if (isNaN(cash) || isNaN(burn) || cash < 0 || burn <= 0) {
        alert("Please enter valid positive numbers");
    return;
    }
    if (burn>cash){
        alert("Pay attention to you monthly burn rate!");
        return;
    }
    const months = cash / burn;
    const days = months * 30;
    result.classList.remove("hidden", "safe", "warning", "danger");
    monthsvalue.textContent = "Months : " + months.toFixed(2) ;
    daysvalue.textContent = "Days to 0 remaining : "+Math.floor(days) ;
    if (months > 6) {
        result.classList.add("safe");
        statusvalue.textContent = "Safe ✅";
    } else if (months > 3) {
        result.classList.add("warning");
        statusvalue.textContent = "Warning ⚠️";
    } else {
        result.classList.add("danger");
        statusvalue.textContent = "Danger 🚨";
    }
    if (!document.getElementById("moneyInfo")) {
        const info = document.createElement("p");
        info.id = "moneyInfo";
        result.appendChild(info);
    }

    document.getElementById("moneyInfo").textContent =
        "Cash: " + formatCurrency(cash) + " | Burn: " + formatCurrency(burn);
}