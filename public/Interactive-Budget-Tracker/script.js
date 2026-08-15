let budget = 0;
let expenses = [];
let filteredExpenses = [];
let chart;

// DOM Elements
const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");
const budgetValue = document.getElementById("budgetValue");
const spentValue = document.getElementById("spentValue");
const remainingValue = document.getElementById("remainingValue");
const progressBar = document.getElementById("progressBar");
const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchExpense");
const filterCategory = document.getElementById("filterCategory");
const sortExpenses = document.getElementById("sortExpenses");
const expenseCount = document.getElementById("expenseCount");

// Load saved data
loadData();

// Set Budget
setBudgetBtn.addEventListener("click", () => {
    const value = Number(budgetInput.value);
    if (value < 0) {
        alert("Please enter a valid budget amount");
        return;
    }
    budget = value;
    budgetInput.value = "";
    saveData();
    updateUI();
});

// Add Expense
addExpenseBtn.addEventListener("click", () => {
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if (!name || amount <= 0) {
        alert("Please enter valid expense details");
        return;
    }

    // Check if we're editing
    if (addExpenseBtn.dataset.editId) {
        const id = Number(addExpenseBtn.dataset.editId);
        const index = expenses.findIndex(exp => exp.id === id);
        if (index !== -1) {
            expenses[index] = { id, name, amount, category, date: expenses[index].date };
        }
        addExpenseBtn.textContent = "Add Expense";
        addExpenseBtn.dataset.editId = "";
        addExpenseBtn.style.background = "#2563eb";
    } else {
        expenses.push({
            id: Date.now(),
            name,
            amount,
            category,
            date: new Date().toISOString()
        });
    }

    expenseName.value = "";
    expenseAmount.value = "";

    saveData();
    updateUI();
});

// Delete Expense
function deleteExpense(id) {
    if (confirm("Are you sure you want to delete this expense?")) {
        expenses = expenses.filter(exp => exp.id !== id);
        saveData();
        updateUI();
    }
}

// Edit Expense
function editExpense(id) {
    const expense = expenses.find(exp => exp.id === id);
    if (!expense) return;

    expenseName.value = expense.name;
    expenseAmount.value = expense.amount;
    expenseCategory.value = expense.category;

    addExpenseBtn.textContent = "Update Expense";
    addExpenseBtn.dataset.editId = id;
    addExpenseBtn.style.background = "#f59e0b";

    // Scroll to form
    document.querySelector(".expense-form").scrollIntoView({ behavior: "smooth" });
}

// Filter and Search Expenses
function filterAndSearchExpenses() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const categoryFilter = filterCategory.value;

    filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.name.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === "all" || exp.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Apply sorting
    const sortBy = sortExpenses.value;
    switch (sortBy) {
        case "newest":
            filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case "oldest":
            filteredExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case "highest":
            filteredExpenses.sort((a, b) => b.amount - a.amount);
            break;
        case "lowest":
            filteredExpenses.sort((a, b) => a.amount - b.amount);
            break;
        case "az":
            filteredExpenses.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case "za":
            filteredExpenses.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            break;
    }

    renderExpenses();
}

// Render Expenses
function renderExpenses() {
    expenseList.innerHTML = "";

    if (filteredExpenses.length === 0) {
        const noExpenses = document.createElement("div");
        noExpenses.className = "no-expenses";
        noExpenses.innerHTML = "📭 No expenses found";
        expenseList.appendChild(noExpenses);
        expenseCount.textContent = "0 expenses";
        return;
    }

    filteredExpenses.forEach(exp => {
        const div = document.createElement("div");
        div.className = "expense-item";

        const date = new Date(exp.date);
        const formattedDate = date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        div.innerHTML = `
            <div class="expense-info">
                <div class="expense-name">${exp.name}</div>
                <div class="expense-details">
                    <span class="expense-category">${exp.category}</span>
                    <span>•</span>
                    <span>${formattedDate}</span>
                    <span>•</span>
                    <span class="expense-amount">₹${exp.amount.toFixed(2)}</span>
                </div>
            </div>
            <div class="expense-actions">
                <button class="edit-btn" onclick="editExpense(${exp.id})">✏️ Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${exp.id})">🗑️ Delete</button>
            </div>
        `;

        expenseList.appendChild(div);
    });

    expenseCount.textContent = `${filteredExpenses.length} expense${filteredExpenses.length > 1 ? 's' : ''}`;
}

// Update UI
function updateUI() {
    const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
    const remaining = budget - totalSpent;

    budgetValue.textContent = `₹${budget.toFixed(2)}`;
    spentValue.textContent = `₹${totalSpent.toFixed(2)}`;
    remainingValue.textContent = `₹${remaining.toFixed(2)}`;

    const percentage = budget > 0 ? (totalSpent / budget) * 100 : 0;
    progressBar.style.width = Math.min(percentage, 100) + "%";

    // Change progress bar color based on usage
    if (percentage >= 90) {
        progressBar.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
    } else if (percentage >= 70) {
        progressBar.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
    } else {
        progressBar.style.background = "linear-gradient(90deg, #22c55e, #16a34a)";
    }

    // Update remaining color
    if (remaining < 0) {
        remainingValue.style.color = "#ef4444";
    } else {
        remainingValue.style.color = "#2563eb";
    }

    // Apply filters and render
    filterAndSearchExpenses();
    updateChart();
}

// Update Chart
function updateChart() {
    const categories = {};
    
    expenses.forEach(exp => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    const ctx = document.getElementById("expenseChart");

    if (chart) {
        chart.destroy();
    }

    if (labels.length === 0) {
        // Show empty chart
        chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: ["No Data"],
                datasets: [{
                    data: [1],
                    backgroundColor: ["#e5e7eb"]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
        return;
    }

    const colors = [
        "#2563eb", "#22c55e", "#f59e0b", 
        "#ef4444", "#8b5cf6", "#ec4899",
        "#14b8a6", "#f97316", "#6366f1"
    ];

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors.slice(0, labels.length),
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `₹${context.parsed.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Save Data
function saveData() {
    localStorage.setItem("budget", JSON.stringify(budget));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Load Data
function loadData() {
    budget = JSON.parse(localStorage.getItem("budget")) || 0;
    expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    
    // Add date to old expenses if missing
    expenses = expenses.map(exp => {
        if (!exp.date) {
            exp.date = new Date().toISOString();
        }
        return exp;
    });
    
    updateUI();
}

// Theme Toggle
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Search and Filter Event Listeners
searchInput.addEventListener("input", filterAndSearchExpenses);
filterCategory.addEventListener("change", filterAndSearchExpenses);
sortExpenses.addEventListener("change", filterAndSearchExpenses);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
    // Ctrl+Enter to add expense
    if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        addExpenseBtn.click();
    }
    
    // Escape to cancel edit
    if (e.key === "Escape" && addExpenseBtn.dataset.editId) {
        addExpenseBtn.textContent = "Add Expense";
        addExpenseBtn.dataset.editId = "";
        addExpenseBtn.style.background = "#2563eb";
        expenseName.value = "";
        expenseAmount.value = "";
    }
});

// Initial render
updateUI();