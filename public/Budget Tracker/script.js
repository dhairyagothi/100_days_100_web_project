let mainSalary = 0;
let remainingBudget = 0;
let expenses = [];
let budgetGoals = {};

function formatCurrency(amount) {
    return '₹' + amount.toFixed(2);
}

function updateBudgetSummary() {
    document.getElementById('main-salary').textContent = formatCurrency(mainSalary);
    document.getElementById('remaining-budget').textContent = formatCurrency(remainingBudget);
}

function addExpenseItem(description, amount, category) {
    const expenseItem = document.createElement('tr');
    expenseItem.innerHTML = `
        <td>${description}</td>
        <td>${formatCurrency(amount)}</td>
        <td>${category}</td>
        <td><button onclick="removeExpenseItem(this)">Remove</button></td>
    `;

    const expenseList = document.getElementById('expense-list');
    expenseList.appendChild(expenseItem);

    expenses.push({ description, amount, category });
    remainingBudget -= amount;
    updateBudgetSummary();
    updateCharts();
    checkBudgetGoals();
}

function removeExpenseItem(button) {
    const row = button.closest('tr');
    const amount = parseFloat(row.children[1].textContent.slice(1));
    const description = row.children[0].textContent;
    const category = row.children[2].textContent;

    // Remove the expense item from the UI
    row.remove();

    // Remove the expense from the expenses array
    expenses = expenses.filter(expense => !(expense.description === description && expense.amount === amount && expense.category === category));
    
    // Update remaining budget and UI
    remainingBudget += amount;
    updateBudgetSummary();
    updateCharts();
    checkBudgetGoals();
}

function updateCharts() {
    // Clear existing charts if they exist
    if (window.categoryChart) {
        categoryChart.destroy();
    }
    if (window.trendChart) {
        trendChart.destroy();
    }

    // Calculate category-wise expenses
    const categories = {};
    expenses.forEach(expense => {
        categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
    });

    // Prepare data for category pie chart
    const categoryData = {
        labels: Object.keys(categories),
        datasets: [{
            data: Object.values(categories),
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#00a8a8', '#ff9f40']
        }]
    };

    // Create category pie chart
    const categoryChartCtx = document.getElementById('category-chart').getContext('2d');
    window.categoryChart = new Chart(categoryChartCtx, {
        type: 'pie',
        data: categoryData
    });

    // Prepare data for trend bar chart
    const trendData = {
        labels: expenses.map(expense => expense.description),
        datasets: [{
            label: 'Amount (₹)',
            data: expenses.map(expense => expense.amount),
            backgroundColor: '#36a2eb'
        }]
    };

    // Create trend bar chart
    const trendChartCtx = document.getElementById('trend-chart').getContext('2d');
    window.trendChart = new Chart(trendChartCtx, {
        type: 'bar',
        data: trendData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            }
        }
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const salary = parseFloat(document.getElementById('input-salary').value);
    const description = document.getElementById('input-description').value.trim();
    const amount = parseFloat(document.getElementById('input-amount').value);
    const categorySelect = document.getElementById('input-category');
    let category = categorySelect.value;

    if (category === 'Custom') {
        category = document.getElementById('custom-category').value.trim();
    }

    if (isNaN(salary) || salary <= 0 || description === '' || isNaN(amount) || amount <= 0 || category === '') {
        alert('Please enter valid salary, description, amount, and category.');
        return;
    }

    if (mainSalary === 0) {
        mainSalary = salary;
        remainingBudget = mainSalary;
        updateBudgetSummary();
    }

    addExpenseItem(description, amount, category);

    document.getElementById('input-description').value = '';
    document.getElementById('input-amount').value = '';
    categorySelect.value = '';
    document.getElementById('custom-category').style.display = 'none';
}

function handleGoalFormSubmit(event) {
    event.preventDefault();

    const category = document.getElementById('goal-category').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);

    if (category === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid category and amount for the goal.');
        return;
    }

    budgetGoals[category] = amount;
    document.getElementById('goal-alert').textContent = `Budget goal set for ${category}: ${formatCurrency(amount)}`;
    document.getElementById('goal-alert').style.display = 'block';
}

function checkBudgetGoals() {
    for (const category in budgetGoals) {
        const goalAmount = budgetGoals[category];
        const spentAmount = expenses.filter(expense => expense.category === category).reduce((total, expense) => total + expense.amount, 0);

        if (spentAmount >= goalAmount) {
            alert(`Alert: You have reached or exceeded your budget goal for ${category}.`);
        }
    }
}

document.getElementById('budget-form').addEventListener('submit', handleFormSubmit);
document.getElementById('input-category').addEventListener('change', function() {
    const customCategoryInput = document.getElementById('custom-category');
    if (this.value === 'Custom') {
        customCategoryInput.style.display = 'block';
    } else {
        customCategoryInput.style.display = 'none';
    }
});

// Initial function call to set up the charts when the page loads
updateCharts();
