let totalincome = parseFloat(localStorage.getItem("totalIncome"))  || 0;
let totalSpent  = parseFloat(localStorage.getItem("totalSpent"))   || 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


function formatmoney(amount) {
    return "₹" + amount.toFixed(2);
}

function saveState() {
    localStorage.setItem("totalIncome",   totalincome);
    localStorage.setItem("totalSpent",    totalSpent);
    localStorage.setItem("transactions",  JSON.stringify(transactions));
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });
}


function updateDisplay() {
    document.getElementById("total").textContent     = formatmoney(totalincome + totalSpent);
    document.getElementById("spent").textContent     = formatmoney(totalSpent);
    document.getElementById("moneyleft").textContent = formatmoney(totalincome);
}


function renderTransactions() {
    const list     = document.getElementById("transaction-list");
    const emptyMsg = document.getElementById("empty-msg");

    if (!list) return;
    list.innerHTML = "";

    if (transactions.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

   
    [...transactions].reverse().forEach((t) => {
        const li = document.createElement("li");
        li.className = "txn-item " + t.type;
        li.innerHTML = `
            <div class="txn-info">
                <span class="txn-title">${t.title}</span>
                <span class="txn-date">${formatDate(t.date)}</span>
            </div>
            <div class="txn-right">
                <span class="txn-amount ${t.type === "income" ? "plus" : "minus"}">
                    ${t.type === "income" ? "+" : "-"}${formatmoney(t.amount)}
                </span>
                <button class="del-btn" onclick="deleteTransaction('${t.id}')">✕</button>
            </div>
        `;
        list.appendChild(li);
    });
}

function updatethemoney() {
    const val    = document.getElementById("income").value;
    const income = parseFloat(val) || 0;
    if (income <= 0) { alert("Please enter a valid income amount."); return; }

    totalincome += income;

    transactions.push({
        id:     Date.now().toString(),
        title:  "Income",
        amount: income,
        type:   "income",
        date:   new Date().toISOString()
    });

    saveState();
    updateDisplay();
    renderTransactions();

    document.getElementById("income").value = "";
}


function updateSpending(categoryName) {
    const input   = document.getElementById("spending");
    const spending = parseFloat(input.value) || 0;
    if (spending <= 0) { alert("Please enter a valid spending amount."); return; }
    if (spending > totalincome) { alert("Not enough balance!"); return; }

    totalSpent  += spending;
    totalincome -= spending;

    transactions.push({
        id:     Date.now().toString(),
        title:  categoryName || "Spending",
        amount: spending,
        type:   "expense",
        date:   new Date().toISOString()
    });

    saveState();
    updateDisplay();
    renderTransactions();

    input.value = "";
}

function deleteTransaction(id) {
    const txn = transactions.find((t) => t.id === id);
    if (!txn) return;

    // Reverse the effect on totals
    if (txn.type === "income") {
        totalincome -= txn.amount;
    } else {
        totalSpent  -= txn.amount;
        totalincome += txn.amount;
    }

    transactions = transactions.filter((t) => t.id !== id);

    saveState();
    updateDisplay();
    renderTransactions();
}

function clearAll() {
    if (transactions.length === 0) return;
    if (!confirm("Clear all transactions? This cannot be undone.")) return;

    totalincome  = 0;
    totalSpent   = 0;
    transactions = [];

    saveState();
    updateDisplay();
    renderTransactions();
}

document.addEventListener("DOMContentLoaded", function () {
    updateDisplay();
    renderTransactions();

    const spendingLink = document.getElementById("spending-link");
    const mainContent  = document.getElementById("main");

    spendingLink.addEventListener("click", function (e) {
        e.preventDefault();

        const categories = [
            "Travel Expense","Food","Transport","Utilities",
            "Personal","EMI","Credit Card","Entertainment",
            "Health","Miscellaneous"
        ];

        mainContent.innerHTML = `
            <div class="left" style="color: white;">
                <h2 style="text-align:center;">Expense Categories</h2>
                <a href="#" onclick="loadIncome()">Income</a>
                ${categories.map(c =>
                    `<a href="#" onclick="selectCategory('${c}')">${c}</a>`
                ).join("")}
            </div>
            <div class="right">
                <div class="income" id="spending-panel">
                    <h2>Select a category ←</h2>
                </div>
            </div>
        `;
    });
});


function selectCategory(name) {
    document.getElementById("spending-panel").innerHTML = `
        <h2>${name}</h2>
        <br>
        <input type="number" id="spending" placeholder="Amount spent (₹)"
               style="width:100%; padding:10px;" min="1">
        <br><br>
        <button onclick="updateSpending('${name}')" class="submit-button">Submit</button>
    `;
}

function loadIncome() {
    document.getElementById("main").innerHTML = `
        <div class="left" style="color: white;">
            <h2 style="text-align:center;">Expense Categories</h2>
            <a href="#">Income</a>
            <a href="#" id="spending-link" onclick="document.getElementById('spending-link').click()">Spending</a>
        </div>
        <div class="right">
            <div class="income">
                <h2>Income</h2>
                <input type="text" id="income" placeholder="Enter your income"
                       style="width:100%; padding:10px;">
                <br><br>
                <button id="submit-income" onclick="updatethemoney()">Submit</button>
            </div>
        </div>
    `;
}