let records = JSON.parse(localStorage.getItem('budgetbuddy_data')) || [];
let currentFilter = 'All';
let currentSearchQuery = '';

const transactionForm = document.getElementById('transactionForm');
const amountInput = document.getElementById('amount');
const dateInput = document.getElementById('date');
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');
const categoryGroup = document.getElementById('categoryGroup');
const searchBar = document.getElementById('searchBar');
const themeToggleBtn = document.getElementById('themeToggle');
const accountBalanceEl = document.getElementById('accountBalance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const avgTransactionEl = document.getElementById('avgTransaction');
const savingsRateEl = document.getElementById('savingsRate');
const transactionsBody = document.getElementById('transactionsBody');
const noTransactionsMessage = document.getElementById('noTransactionsMessage');
const donutSegment = document.getElementById('donutSegment');
const highestExpensePctEl = document.getElementById('highestExpensePct');
const highestExpenseNameEl = document.getElementById('highestExpenseName');

const errorLogs = {
    amount: document.getElementById('amountError'),
    date: document.getElementById('dateError'),
    description: document.getElementById('descriptionError'),
    category: document.getElementById('categoryError')
};

document.addEventListener('DOMContentLoaded', () => {
    initializeThemeEngine();
    if (document.getElementById('date')) setDefaultDateToToday();
    setupUserInteractionEvents();
    if (document.getElementById('transactionsBody')) {
        renderHistoryTable();
    }
});
function initializeThemeEngine() {
    const savedTheme = localStorage.getItem('budgetbuddy_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

function toggleApplicationTheme() {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', targetTheme);
    localStorage.setItem('budgetbuddy_theme', targetTheme);
}

function setDefaultDateToToday() {
    const today = new Date().toLocaleDateString('en-CA'); 
    if (dateInput) {
        dateInput.max = today;
        dateInput.value = today;
    }
}

function setupUserInteractionEvents() {
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleApplicationTheme);

    document.querySelectorAll('input[name="type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (categoryGroup && categorySelect) {
                if (e.target.value === 'Income') {
                    categoryGroup.classList.add('hidden');
                    categorySelect.required = false;
                    categorySelect.value = '';
                } else {
                    categoryGroup.classList.remove('hidden');
                    categorySelect.required = true;
                }
            }
            clearFormWarnings();
        });
    });

    if (transactionsBody) {
        transactionsBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete-row')) {
                deleteItem(parseInt(e.target.dataset.id, 10));
            }
        });
    }

    if (searchBar) {
        searchBar.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase().trim();
            renderHistoryTable();
        });
    }

    const filterGroup = document.querySelector('.filter-buttons-group');
    if (filterGroup) {
        filterGroup.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-tab')) {
                document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentFilter = e.target.dataset.filter;
                renderHistoryTable();
            }
        });
    }

    const btnReset = document.getElementById('btnReset');
    if (btnReset) btnReset.addEventListener('click', clearAllStoredData);

    const btnExport = document.getElementById('btnExport');
    if (btnExport) btnExport.addEventListener('click', downloadBackupAsSpreadsheet);
}

function clearFormWarnings() {
    Object.values(errorLogs).forEach(element => { if(element) element.textContent = ''; });
}

function checkFormErrors() {
    clearFormWarnings();
    let isValid = true;
    if (amountInput) {
        const amountValue = parseFloat(amountInput.value);
        if (isNaN(amountValue) || amountValue <= 0) {
            if (errorLogs.amount) errorLogs.amount.textContent = 'Please enter a valid amount greater than 0.';
            isValid = false;
        }
    }
    if (dateInput && !dateInput.value) {
        if (errorLogs.date) errorLogs.date.textContent = 'Please select a date.';
        isValid = false;
    }else if (dateInput && dateInput.value) {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
        if (errorLogs.date) errorLogs.date.textContent = 'Future dates are not allowed.';
        isValid = false;
        }
    }

    if (descriptionInput && !descriptionInput.value.trim()) {
        if (errorLogs.description) errorLogs.description.textContent = 'Please type a short description.';
        isValid = false;
    }
    const checkedTypeNode = document.querySelector('input[name="type"]:checked');
    const checkedType = checkedTypeNode ? checkedTypeNode.value : 'Expense';
    if (checkedType === 'Expense' && categorySelect && !categorySelect.value) {
        if (errorLogs.category) errorLogs.category.textContent = 'Please pick a category for this expense.';
        isValid = false;
    }
    return isValid;
}

if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!checkFormErrors()) return;
        const checkedTypeNode = document.querySelector('input[name="type"]:checked');
        const selectedType = checkedTypeNode ? checkedTypeNode.value : 'Expense';
        const newRecord = {
            id: Date.now(),
            amount: amountInput ? parseFloat(amountInput.value) : 0,
            date: dateInput ? dateInput.value : new Date().toLocaleDateString('en-CA'),
            type: selectedType,
            category: selectedType === 'Expense' ? (categorySelect ? categorySelect.value : 'Others') : 'Income Stream',
            description: descriptionInput ? descriptionInput.value.trim() : ''
        };
        records.push(newRecord);
        saveAndReload();
        if (amountInput) amountInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        setDefaultDateToToday();
    });
}

function deleteItem(id) {
    records = records.filter(item => item.id !== id);
    saveAndReload();
}

function saveAndReload() {
    localStorage.setItem('budgetbuddy_data', JSON.stringify(records));
    calculateAndRefreshSummary();
}

function calculateAndRefreshSummary() {
    let earnedTotal = 0;
    let spentTotal = 0;
    const categoryTotals = { Food: 0, Travel: 0, Shopping: 0, Bills: 0, Others: 0 };
    records.forEach(item => {
        if (item.type === 'Income') {
            earnedTotal += item.amount;
        } else {
            spentTotal += item.amount;
            if (categoryTotals.hasOwnProperty(item.category)) {
                categoryTotals[item.category] += item.amount;
            }
        }
    });

    const currentBalance = earnedTotal - spentTotal;
    const avgAmount = records.length ? (records.reduce((sum, item) => sum + item.amount, 0) / records.length) : 0;
    const savingsPercentage = earnedTotal > 0 ? Math.max(0, (currentBalance / earnedTotal) * 100) : 0;
    const formatRupees = (num) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
    
    if (accountBalanceEl) {
        accountBalanceEl.textContent = formatRupees(currentBalance);
        accountBalanceEl.className = `stat-number ${currentBalance >= 0 ? 'text-green' : 'text-red'}`;
    }
    if (totalIncomeEl) totalIncomeEl.textContent = formatRupees(earnedTotal);
    if (totalExpenseEl) totalExpenseEl.textContent = formatRupees(spentTotal);
    if (avgTransactionEl) avgTransactionEl.textContent = formatRupees(avgAmount);
    if (savingsRateEl) savingsRateEl.textContent = `${savingsPercentage.toFixed(1)}%`;

    let topCategoryLabel = 'None';
    let topCategorySum = 0;
    Object.entries(categoryTotals).forEach(([category, total]) => {
        const valueNode = document.getElementById(`cat-${category}`);
        if (valueNode) valueNode.textContent = formatRupees(total);
        const ratioPercentage = spentTotal > 0 ? (total / spentTotal) * 100 : 0;
        const progressFillBar = document.querySelector(`.progress-bar-item[data-category="${category}"] .progress-fill`);
        if (progressFillBar) progressFillBar.style.width = `${ratioPercentage}%`;
        if (total > topCategorySum) {
            topCategorySum = total;
            topCategoryLabel = category;
        }
    });

    const topCategoryPercent = spentTotal > 0 ? Math.round((topCategorySum / spentTotal) * 100) : 0;
    if (highestExpensePctEl) highestExpensePctEl.textContent = `${topCategoryPercent}%`;
    if (highestExpenseNameEl) highestExpenseNameEl.textContent = topCategoryLabel === 'None' ? 'Top Category' : topCategoryLabel;
    if (donutSegment) donutSegment.style.strokeDasharray = `${topCategoryPercent} ${100 - topCategoryPercent}`;
    renderHistoryTable();
}

function renderHistoryTable() {
    if (!transactionsBody) return;
    const matchedRecords = records.filter(item => {
        const matchFilter = (currentFilter === 'All') || (item.type === currentFilter);
        const matchSearch = (item.description || '').toLowerCase().includes(currentSearchQuery) || 
                            (item.category || '').toLowerCase().includes(currentSearchQuery);
        return matchFilter && matchSearch;
    });

    if (!matchedRecords.length) {
        transactionsBody.innerHTML = '';
        if (noTransactionsMessage) noTransactionsMessage.style.display = 'block';
        return;
    }
    if (noTransactionsMessage) noTransactionsMessage.style.display = 'none';

    const chronologicallySorted = [...matchedRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
    transactionsBody.innerHTML = chronologicallySorted.map(item => {
        let readableDate = item.date;
        if (item.date && item.date.includes('-')) {
            const [year, month, day] = item.date.split('-');
            readableDate = new Date(year, month - 1, day).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        }
        const cashDisplayValue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.amount);
        const displayRowStyle = item.type === 'Income' ? 'row-inc' : 'row-exp';
        const operatorMathSymbol = item.type === 'Income' ? '+ ' : '- ';
        return `
            <tr>
                <td data-label="Date">${readableDate}</td>
                <td data-label="Description">${escapeScriptPayloads(item.description || '')}</td>
                <td data-label="Category"><span class="stat-title" style="font-size:0.7rem; font-weight:bold;">${item.category || ''}</span></td>
                <td data-label="Amount" class="${displayRowStyle}" style="text-align: right;">${operatorMathSymbol}${cashDisplayValue}</td>
                <td data-label="Action">
                    <button class="btn-delete-row" data-id="${item.id}">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

function escapeScriptPayloads(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function clearAllStoredData() {
    if (confirm('Are you completely sure you want to delete all entries? This cannot be undone.')) {
        records = [];
        saveAndReload();
    }
}

function downloadBackupAsSpreadsheet() {
    const currentRecords = JSON.parse(localStorage.getItem('budgetbuddy_data')) || [];
    if (currentRecords.length === 0) {
        alert('You do not have any data entries to backup yet!');
        return;
    }
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvRows = currentRecords.map(item => {
        const safeDescription = `"${String(item.description || '').replace(/"/g, '""')}"`;
        return [item.date, item.type, item.category, safeDescription, item.amount].join(',');
    });
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `ExpenseTracker_Backup_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('bg-aura')) {
        const aura = document.createElement('div');
        aura.id = 'bg-aura';
        document.body.prepend(aura);
    }
});
