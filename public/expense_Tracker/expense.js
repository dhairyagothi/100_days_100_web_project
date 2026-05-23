// State (from localStorage) 
// NOTE: "totalincome" here acts as the CURRENT BALANCE (starts as income,
// decreases with each expense). The original income = totalincome + totalSpent.
let totalincome  = parseFloat(localStorage.getItem("totalIncome"))  || 0;
let totalSpent   = parseFloat(localStorage.getItem("totalSpent"))   || 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


function formatmoney(amount) {
    return "₹" + Math.abs(amount).toFixed(2);
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
    });
}

function saveState() {
    localStorage.setItem("totalIncome",  totalincome);
    localStorage.setItem("totalSpent",   totalSpent);
    localStorage.setItem("transactions", JSON.stringify(transactions));
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
                <span class="txn-title">${escapeHTML(t.title)}</span>
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
    const val    = parseFloat(document.getElementById("income").value) || 0;
    if (val <= 0) { showToast("Please enter a valid income amount.", "error"); return; }

    totalincome += val;
    transactions.push({
        id:     Date.now().toString(),
        title:  "Income",
        amount: val,
        type:   "income",
        date:   new Date().toISOString()
    });

    saveState();
    updateDisplay();
    renderTransactions();
    document.getElementById("income").value = "";
    showToast("₹" + val.toFixed(2) + " income added!", "success");
}

function updateSpending(categoryName) {
    const input   = document.getElementById("spending");
    const amount  = parseFloat(input.value) || 0;

    if (amount <= 0) { showToast("Please enter a valid spending amount.", "error"); return; }
    if (amount > totalincome) {
        showToast("Not enough balance! You have " + formatmoney(totalincome) + " left.", "error");
        return;
    }

    totalSpent  += amount;
    totalincome -= amount;

    transactions.push({
        id:     Date.now().toString(),
        title:  categoryName || "Spending",
        amount: amount,
        type:   "expense",
        date:   new Date().toISOString()
    });

    saveState();
    updateDisplay();
    renderTransactions();
    input.value = "";
    showToast(formatmoney(amount) + " spent on " + categoryName + ".", "success");
}

function deleteTransaction(id) {
    const txn = transactions.find((t) => t.id === id);
    if (!txn) return;

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
    showToast("Transaction removed.", "success");
}


function clearAll() {
    if (transactions.length === 0) { showToast("Nothing to clear!", "error"); return; }
    if (!confirm("Clear all transactions? This cannot be undone.")) return;

    totalincome  = 0;
    totalSpent   = 0;
    transactions = [];
    saveState();
    updateDisplay();
    renderTransactions();
    showToast("All data cleared.", "success");
}


function selectCategory(name) {
    document.getElementById("spending-panel").innerHTML = `
        <h2>${escapeHTML(name)}</h2>
        <br>
        <input type="number" id="spending" placeholder="Amount spent (₹)"
               style="width:100%; padding:10px;" min="1">
        <br><br>
        <button onclick="updateSpending('${escapeHTML(name)}')" class="submit-button">Submit</button>
    `;

   
    const inp = document.getElementById("spending");
    if (inp) inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") updateSpending(name);
    });
}


function loadIncome() {
    const mainContent = document.getElementById("main");
    mainContent.innerHTML = `
        <div class="left" style="color: white;">
            <h2 style="text-align:center;">Expense Categories</h2>
            <a href="#" onclick="loadIncome(); return false;">Income</a>
            <a href="#" id="spending-link">Spending</a>
        </div>
        <div class="right">
            <div class="income">
                <h2>Income</h2>
                <input type="text" id="income" placeholder="Enter your income"
                       style="width:100%; padding:10px;">
                <br><br>
                <button id="submit-income" class="submit-button" onclick="updatethemoney()">Submit</button>
            </div>
        </div>
    `;
    attachSpendingLink();


    const inp = document.getElementById("income");
    if (inp) inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") updatethemoney();
    });
}


function loadSpendingPanel() {
    const categories = [
        "Travel Expense", "Food", "Transport", "Utilities",
        "Personal", "EMI", "Credit Card", "Entertainment",
        "Health", "Miscellaneous"
    ];

    const mainContent = document.getElementById("main");
    mainContent.innerHTML = `
        <div class="left" style="color: white;">
            <h2 style="text-align:center;">Expense Categories</h2>
            <a href="#" onclick="loadIncome(); return false;">Income</a>
            ${categories.map(c =>
                `<a href="#" onclick="selectCategory('${c}'); return false;">${c}</a>`
            ).join("")}
        </div>
        <div class="right">
            <div class="income" id="spending-panel">
                <h2 style="color:#888;">← Select a category</h2>
            </div>
        </div>
    `;
}

function attachSpendingLink() {
    const link = document.getElementById("spending-link");
    if (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            loadSpendingPanel();
        });
    }
}


let toastTimer;
function showToast(msg, type) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className   = "toast " + (type || "success");
    void toast.offsetWidth;          // force reflow to restart transition
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}


function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}


document.addEventListener("DOMContentLoaded", function () {
    updateDisplay();
    renderTransactions();
    attachSpendingLink();

    // Enter key on the initial income input
    const incomeInput = document.getElementById("income");
    if (incomeInput) {
        incomeInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") updatethemoney();
        });
    }
});