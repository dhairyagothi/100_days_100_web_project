// Get DOM elements
const emiForm = document.getElementById('emiForm');
const loanAmountInput = document.getElementById('loanAmount');
const interestRateInput = document.getElementById('interestRate');
const loanTenureInput = document.getElementById('loanTenure');
const toggleButtons = document.querySelectorAll('.toggle-btn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('results');

// Result display elements
const monthlyEmiDisplay = document.getElementById('monthlyEmi');
const totalAmountDisplay = document.getElementById('totalAmount');
const totalInterestDisplay = document.getElementById('totalInterest');
const principalAmountDisplay = document.getElementById('principalAmount');

// Track tenure type (months or years)
let tenureType = 'months';

// Toggle button functionality
toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        toggleButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update tenure type
        tenureType = button.dataset.value;
    });
});

// Format number to Indian currency format
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0
    });
}

// Calculate EMI using the formula
function calculateEMI(principal, annualRate, tenureMonths) {
    // Convert annual rate to monthly rate and decimal
    const monthlyRate = (annualRate / 12) / 100;
    
    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N-1]
    // Where P = Principal, R = Monthly Interest Rate, N = Tenure in months
    
    if (monthlyRate === 0) {
        // If interest rate is 0, EMI is simply principal divided by tenure
        return principal / tenureMonths;
    }
    
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / 
                (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
    return emi;
}

// Handle form submission
emiForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get input values
    const loanAmount = parseFloat(loanAmountInput.value);
    const interestRate = parseFloat(interestRateInput.value);
    let tenure = parseFloat(loanTenureInput.value);
    
    // Validate inputs
    if (!loanAmount || !interestRate || !tenure) {
        alert('Please fill in all fields');
        return;
    }
    
    if (loanAmount <= 0 || interestRate < 0 || tenure <= 0) {
        alert('Please enter valid positive values');
        return;
    }
    
    // Convert tenure to months if in years
    const tenureInMonths = tenureType === 'years' ? tenure * 12 : tenure;
    
    // Calculate EMI
    const monthlyEmi = calculateEMI(loanAmount, interestRate, tenureInMonths);
    const totalAmount = monthlyEmi * tenureInMonths;
    const totalInterest = totalAmount - loanAmount;
    
    // Display results
    monthlyEmiDisplay.textContent = formatCurrency(Math.round(monthlyEmi));
    totalAmountDisplay.textContent = formatCurrency(Math.round(totalAmount));
    totalInterestDisplay.textContent = formatCurrency(Math.round(totalInterest));
    principalAmountDisplay.textContent = formatCurrency(Math.round(loanAmount));
    
    // Show results section with animation
    resultsSection.classList.add('show');
    
    // Smooth scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Reset form and hide results
resetBtn.addEventListener('click', () => {
    // Reset form
    emiForm.reset();
    
    // Hide results
    resultsSection.classList.remove('show');
    
    // Reset toggle to months
    toggleButtons.forEach(btn => btn.classList.remove('active'));
    toggleButtons[0].classList.add('active');
    tenureType = 'months';
    
    // Reset result displays
    monthlyEmiDisplay.textContent = '₹0';
    totalAmountDisplay.textContent = '₹0';
    totalInterestDisplay.textContent = '₹0';
    principalAmountDisplay.textContent = '₹0';
});

// Add input validation for better UX
loanAmountInput.addEventListener('input', (e) => {
    if (e.target.value < 0) {
        e.target.value = 0;
    }
});

interestRateInput.addEventListener('input', (e) => {
    if (e.target.value < 0) {
        e.target.value = 0;
    }
    if (e.target.value > 50) {
        e.target.value = 50;
    }
});

loanTenureInput.addEventListener('input', (e) => {
    if (e.target.value < 0) {
        e.target.value = 0;
    }
});
