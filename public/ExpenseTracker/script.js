/* =========================================================
   EXPENSE TRACKER - PROFESSIONAL FINAL SCRIPT
========================================================= */

/* ---------------- APP STATE ---------------- */

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let income = parseFloat(localStorage.getItem("income")) || 0;
let monthlyBudget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;

let currentFilter = "All";
let searchQuery = "";
let editingExpenseId = null;

/* ---------------- DOM ELEMENTS ---------------- */

const incomeForm = document.getElementById("income-form");
const incomeInput = document.getElementById("income-input");

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategorySelect = document.getElementById("expense-category");

const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const netBalanceEl = document.getElementById("net-balance");

const monthlyBudgetEl = document.getElementById("monthly-budget");
const budgetLeftEl = document.getElementById("budget-left");

const categoryFilterSelect = document.getElementById("category-filter");
const expenseListEl = document.getElementById("expense-list");
const noExpensesEl = document.getElementById("no-expenses");

const chartProgress = document.getElementById("chart-progress");
const expenseRatioEl = document.getElementById("expense-ratio");
const legendEl = document.getElementById("category-breakdown-legend");

const dateTextEl = document.getElementById("date-text");

const searchInput = document.getElementById("search-transaction");

const themeToggle = document.getElementById("theme-toggle");
const exportCsvBtn = document.getElementById("export-csv");

/* ---------------- CATEGORY CONFIG ---------------- */

const categories = {
    Food: {
        color: "#10b981",
        class: "cat-food",
        icon: "🍔"
    },
    Travel: {
        color: "#0ea5e9",
        class: "cat-travel",
        icon: "✈️"
    },
    Shopping: {
        color: "#8b5cf6",
        class: "cat-shopping",
        icon: "🛍️"
    },
    Bills: {
        color: "#f59e0b",
        class: "cat-bills",
        icon: "📄"
    },
    Other: {
        color: "#64748b",
        class: "cat-other",
        icon: "📦"
    }
};

/* ---------------- INIT ---------------- */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    if (income > 0) {
        incomeInput.value = income;
    }

    if (monthlyBudget > 0) {
        budgetInput.value = monthlyBudget;
    }

    displayCurrentDate();

    setupEventListeners();

    updateUI();
});

/* ---------------- EVENT LISTENERS ---------------- */

function setupEventListeners() {

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", exportExpensesToCSV);
    }

    /* Income */

    incomeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const value = parseFloat(incomeInput.value);

        if (!isNaN(value) && value >= 0) {
            income = value;

            localStorage.setItem("income", income);

            updateUI();
        }
    });

    /* Budget */

    if (budgetForm) {
        budgetForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const value = parseFloat(budgetInput.value);

            if (!isNaN(value) && value >= 0) {

                monthlyBudget = value;

                localStorage.setItem("monthlyBudget", monthlyBudget);

                updateUI();
            }
        });
    }

    /* Add Expense */

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        addExpense();
    });

    /* Filter */

    categoryFilterSelect.addEventListener("change", (e) => {

        currentFilter = e.target.value;

        renderExpenses();
    });

    /* Search */

    if (searchInput) {

        searchInput.addEventListener("input", (e) => {

            searchQuery = e.target.value.toLowerCase();

            renderExpenses();
        });
    }

    /* Theme Toggle */

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light-theme");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("light-theme")
                    ? "light"
                    : "dark"
            );
        });
    }
}

/* ---------------- THEME ---------------- */

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
}

/* ---------------- DATE ---------------- */

function displayCurrentDate() {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const today = new Date();

    dateTextEl.textContent = today.toLocaleDateString("en-US", options);
}

/* ---------------- ADD EXPENSE ---------------- */

function addExpense() {

    const name = expenseNameInput.value.trim();

    const amount = parseFloat(expenseAmountInput.value);

    const category = expenseCategorySelect.value;

    if (!name || isNaN(amount) || amount <= 0 || !category) {

        alert("Please fill all fields correctly.");

        return;
    }

    /* EDIT MODE */

    if (editingExpenseId) {

        expenses = expenses.map(exp => {

            if (exp.id === editingExpenseId) {

                return {
                    ...exp,
                    name,
                    amount,
                    category
                };
            }

            return exp;
        });

        editingExpenseId = null;

    } else {

        const newExpense = {
            id: Date.now().toString(),
            name,
            amount,
            category,
            date: Date.now()
        };

        expenses.push(newExpense);
    }

    saveExpenses();

    updateUI();

    expenseForm.reset();

    expenseCategorySelect.selectedIndex = 0;
}

/* ---------------- EDIT EXPENSE ---------------- */

function editExpense(id) {

    const expense = expenses.find(exp => exp.id === id);

    if (!expense) return;

    expenseNameInput.value = expense.name;

    expenseAmountInput.value = expense.amount;

    expenseCategorySelect.value = expense.category;

    editingExpenseId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ---------------- DELETE EXPENSE ---------------- */

function deleteExpense(id) {

    const expenseItem = document.querySelector(`[data-id="${id}"]`);

    if (expenseItem) {

        expenseItem.classList.add("deleting");

        expenseItem.addEventListener("animationend", () => {

            expenses = expenses.filter(exp => exp.id !== id);

            saveExpenses();

            updateUI();
        });

    } else {

        expenses = expenses.filter(exp => exp.id !== id);

        saveExpenses();

        updateUI();
    }
}

/* ---------------- SAVE ---------------- */

function saveExpenses() {

    localStorage.setItem("expenses", JSON.stringify(expenses));
}

/* ---------------- FORMATTERS ---------------- */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

function formatDate(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* ---------------- RENDER EXPENSES ---------------- */

function renderExpenses() {

    expenseListEl.innerHTML = "";

    let filteredExpenses = expenses;

    /* Category Filter */

    if (currentFilter !== "All") {

        filteredExpenses = filteredExpenses.filter(
            exp => exp.category === currentFilter
        );
    }

    /* Search Filter */

    if (searchQuery) {

        filteredExpenses = filteredExpenses.filter(exp =>
            exp.name.toLowerCase().includes(searchQuery)
        );
    }

    /* Sort */

    filteredExpenses.sort((a, b) => b.date - a.date);

    if (filteredExpenses.length === 0) {

        noExpensesEl.style.display = "flex";

        expenseListEl.style.display = "none";

        return;
    }

    noExpensesEl.style.display = "none";

    expenseListEl.style.display = "flex";

    filteredExpenses.forEach(exp => {

        const catConfig = categories[exp.category] || categories.Other;

        const li = document.createElement("li");

        li.className = "expense-item";

        li.setAttribute("data-id", exp.id);

        li.innerHTML = `
            <div class="item-category-icon ${catConfig.class}">
                ${catConfig.icon}
            </div>

            <div class="item-details">
                <span class="item-name">${escapeHTML(exp.name)}</span>

                <div class="item-meta">
                    <span class="item-category-label ${catConfig.class}-label">
                        ${exp.category}
                    </span>

                    <span>•</span>

                    <span>${formatDate(exp.date)}</span>
                </div>
            </div>

            <div class="item-amount">
                -${formatCurrency(exp.amount)}
            </div>

            <div class="expense-actions">

                <button class="btn-edit"
                    onclick="editExpense('${exp.id}')">
                    ✏️
                </button>

                <button class="btn-delete"
                    onclick="deleteExpense('${exp.id}')">
                    🗑️
                </button>

            </div>
        `;

        expenseListEl.appendChild(li);
    });
}

/* ---------------- UPDATE SUMMARY ---------------- */

function updateSummary() {

    const totalExpenses = expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
    );

    const balance = income - totalExpenses;

    totalIncomeEl.textContent = formatCurrency(income);

    totalExpensesEl.textContent = formatCurrency(totalExpenses);

    netBalanceEl.textContent = formatCurrency(balance);

    /* Budget */

    if (monthlyBudgetEl) {

        monthlyBudgetEl.textContent =
            formatCurrency(monthlyBudget);

        const left = monthlyBudget - totalExpenses;

        budgetLeftEl.textContent =
            formatCurrency(left);
    }

    /* Donut Chart */

    let percentage = 0;

    if (income > 0) {

        percentage = Math.round(
            (totalExpenses / income) * 100
        );

    } else if (totalExpenses > 0) {

        percentage = 100;
    }

    expenseRatioEl.textContent = `${percentage}%`;

    let strokeDashOffset = 251.2;

    if (percentage > 0) {

        const clampedPercentage = Math.min(percentage, 100);

        strokeDashOffset =
            251.2 - (clampedPercentage / 100) * 251.2;
    }

    chartProgress.style.strokeDashoffset = strokeDashOffset;

    updateLegend(totalExpenses);
}

/* ---------------- LEGEND ---------------- */

function updateLegend(totalExpenses) {

    legendEl.innerHTML = "";

    const catTotals = {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0
    };

    expenses.forEach(exp => {

        if (catTotals[exp.category] !== undefined) {

            catTotals[exp.category] += exp.amount;

        } else {

            catTotals.Other += exp.amount;
        }
    });

    const activeCategories = Object.keys(catTotals)
        .filter(cat => catTotals[cat] > 0);

    if (activeCategories.length === 0) {

        legendEl.innerHTML =
            `<div class="legend-placeholder">
                No data to display.
            </div>`;

        return;
    }

    activeCategories.forEach(cat => {

        const total = catTotals[cat];

        const percent =
            totalExpenses > 0
                ? Math.round((total / totalExpenses) * 100)
                : 0;

        const config = categories[cat];

        const legendItem = document.createElement("div");

        legendItem.className = "legend-item";

        legendItem.innerHTML = `
            <div class="legend-left">
                <span class="legend-color"
                    style="background:${config.color}">
                </span>

                <span class="legend-category">
                    ${cat}
                </span>
            </div>

            <div class="legend-right">
                <span class="legend-value">
                    ${formatCurrency(total)}
                </span>

                <span class="legend-percent">
                    ${percent}%
                </span>
            </div>
        `;

        legendEl.appendChild(legendItem);
    });
}

/* ---------------- UPDATE UI ---------------- */

function updateUI() {

    renderExpenses();

    updateSummary();
}

/* ---------------- ESCAPE HTML ---------------- */

function escapeHTML(str) {

    return str.replace(/[&<>'"]/g,

        tag => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[tag] || tag)
    );
}

function exportExpensesToCSV() {

    if (expenses.length === 0) {
        alert("No expenses to export.");
        return;
    }

    const headers = ["Name", "Amount", "Category", "Date"];

    const rows = expenses.map(exp => [
        exp.name,
        exp.amount.toFixed(2),
        exp.category,
        new Date(exp.date).toLocaleString("en-US")
    ]);

    const csvContent = "\uFEFF" + [
        headers,
        ...rows
    ]
        .map(row => row.map(escapeCSVValue).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = "spendwise-expenses.csv";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
}

function escapeCSVValue(value) {

    const stringValue = String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes("\"") ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

/* ---------------- GLOBAL ---------------- */

window.deleteExpense = deleteExpense;

window.editExpense = editExpense;
