// Initialize main salary and remaining budget
let mainSalary = 0;
let remainingBudget = 0;

// Function to format currency
function formatCurrency(amount) {
    return '₹' + amount.toFixed(2);
}

// Function to update budget summary
function updateBudgetSummary() {
    document.getElementById('main-salary').textContent = formatCurrency(mainSalary);
    document.getElementById('remaining-budget').textContent = formatCurrency(remainingBudget);
}

// Function to add expense item
function addExpenseItem(description, amount) {
    // Create expense item element
    const expenseItem = document.createElement('tr');
    expenseItem.innerHTML = `
        <td>${description}</td>
        <td>${formatCurrency(amount)}</td>
        <td><button onclick="removeExpenseItem(this)">Remove</button></td>
    `;

    // Add style to remove button dynamically
    const removeButton = expenseItem.querySelector('button');
    removeButton.style.width = 'fit-content';

    // Append to expense list
    const expenseList = document.getElementById('expense-list');
    expenseList.appendChild(expenseItem);

    // Update remaining budget
    remainingBudget -= amount;
    updateBudgetSummary();
}

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Get user input values
    const salary = parseFloat(document.getElementById('input-salary').value);
    const description = document.getElementById('input-description').value.trim();
    const amount = parseFloat(document.getElementById('input-amount').value);

    // Validate inputs
    if (isNaN(salary) || salary <= 0 || description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter valid salary, description, and amount.');
        return;
    }

    // Set main salary if not already set
    if (mainSalary === 0) {
        mainSalary = salary;
        remainingBudget = mainSalary;
        updateBudgetSummary();
    }

    // Add expense item
    addExpenseItem(description, amount);

    // Reset form fields
    document.getElementById('input-description').value = '';
    document.getElementById('input-amount').value = '';
}

// Function to remove expense item
function removeExpenseItem(button) {
    const row = button.closest('tr');
    const amount = parseFloat(row.children[1].textContent.slice(1));

    // Update remaining budget
    remainingBudget += amount;
    updateBudgetSummary();

    // Remove expense item from DOM
    row.remove();
}

// Event listener for form submission
document.getElementById('budget-form').addEventListener('submit', handleFormSubmit);
