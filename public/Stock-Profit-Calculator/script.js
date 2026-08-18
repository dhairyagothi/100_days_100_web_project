let chart;
const currencySymbols = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£'
};

async function getExchangeRate(from, to) {
    // In a real application, you would call an actual API here
    // For this example, we'll use some mock exchange rates
    const mockRates = {
        'INR': 1,
        'USD': 0.012,
        'EUR': 0.011,
        'GBP': 0.0095
    };
    return mockRates[to] / mockRates[from];
}

async function calculateProfit() {
    const currency = document.getElementById('currency').value;
    const shares = parseFloat(document.getElementById('shares').value) || 0;
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const sellPrice = parseFloat(document.getElementById('sellPrice').value) || 0;
    const buyCommission = parseFloat(document.getElementById('buyCommission').value) || 0;
    const sellCommission = parseFloat(document.getElementById('sellCommission').value) || 0;
    const holdingPeriod = parseFloat(document.getElementById('holdingPeriod').value) || 0;
    const dividendPerShare = parseFloat(document.getElementById('dividendPerShare').value) || 0;
    const dividendShares = parseFloat(document.getElementById('dividendShares').value) || 0;
    const targetPrice = parseFloat(document.getElementById('targetPrice').value) || 0;

    const sharesError = document.getElementById('sharesError');
    if (shares <= 0) {
        sharesError.innerText = 'Please enter a valid number of shares greater than 0';
        return;
    } else {
        sharesError.innerText = '';
    }

    const totalInvestment = shares * purchasePrice;
    const purchasedFor = totalInvestment + buyCommission;
    const soldFor = (shares * sellPrice) - sellCommission;
    const profitAmount = soldFor - purchasedFor;
    const roi = purchasedFor ? ((profitAmount / purchasedFor) * 100).toFixed(2) : 0;
    const annualizedReturn = holdingPeriod ? (Math.pow((1 + profitAmount / purchasedFor), (365 / holdingPeriod)) - 1) * 100 : 0;
    const breakEven = shares ? (totalInvestment + buyCommission + sellCommission) / shares : 0;
    const dividendIncome = dividendPerShare * dividendShares;
    let taxRate = 0;
    if (profitAmount > 0) {
        taxRate = holdingPeriod <= 365 ? 0.15 : 0.10;
    }
    const taxAmount = profitAmount * taxRate;
    const netAfterTax = profitAmount - taxAmount;
    const expectedProfit = (targetPrice - purchasePrice) * shares - (buyCommission + sellCommission);
    const expectedROI = purchasedFor ? ((expectedProfit / purchasedFor) * 100).toFixed(2) : 0;
    const expectedTax = expectedProfit > 0 ? expectedProfit * taxRate : 0;
    const expectedNetAfterTax = expectedProfit - expectedTax;

    // Update UI fields
    document.getElementById('currencySymbol1').innerText = currencySymbols[currency];
    document.getElementById('currencySymbol2').innerText = currencySymbols[currency];
    document.getElementById('currencySymbol3').innerText = currencySymbols[currency];
    document.getElementById('purchasedFor').innerText = purchasedFor.toFixed(2);
    document.getElementById('soldFor').innerText = soldFor.toFixed(2);
    document.getElementById('profitAmount').innerText = profitAmount.toFixed(2);
    document.getElementById('roi').innerText = roi;
    document.getElementById('annualizedReturn').innerText = annualizedReturn.toFixed(2);
    document.getElementById('breakEven').innerText = breakEven.toFixed(2);
    document.getElementById('dividendIncome').innerText = dividendIncome.toFixed(2);
    document.getElementById('taxAmount').innerText = taxAmount.toFixed(2);
    document.getElementById('netAfterTax').innerText = netAfterTax.toFixed(2);
    
    document.getElementById('expectedProfit').innerText = expectedProfit.toFixed(2);
    document.getElementById('expectedROI').innerText = expectedROI;
    document.getElementById('estimatedTax').innerText = expectedTax.toFixed(2);
    document.getElementById('expectedNetAfterTax').innerText = expectedNetAfterTax.toFixed(2);

    UI.updateSummaryCards({
        totalInvestment,
        netSaleValue: soldFor,
        profitLoss: profitAmount,
        roi
    });

    createOrUpdateChart(purchasedFor, soldFor, profitAmount, currency);

    const entry = {
        date: new Date().toLocaleString(),
        currency,
        shares,
        purchasePrice,
        sellPrice,
        boughtComm: buyCommission,
        sellComm: sellCommission,
        profitAmount,
        roi,
        totalInvestment,
        soldFor
    };
    Storage.addEntry(entry);
    UI.renderHistory();
}

// -------------------- Chart --------------------
function createOrUpdateChart(purchasedFor, soldFor, profitAmount, currency) {
    const ctx = document.getElementById('profitChart').getContext('2d');
    const data = {
        labels: ['Purchased For', 'Sold For', 'Profit/Loss'],
        datasets: [{
            label: 'Stock Transaction',
            data: [purchasedFor, soldFor, profitAmount],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                profitAmount >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(75, 192, 192, 1)',
                profitAmount >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    };
    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: `Amount (${currency})`
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += currencySymbols[currency] + context.parsed.y.toFixed(2);
                        }
                        return label;
                    }
                }
            }
        }
    };
    if (chart) {
        chart.data = data;
        chart.options = options;
        chart.update();
    } else {
        chart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }
}

// -------------------- Init --------------------
document.addEventListener('DOMContentLoaded', () => {
    UI.applyTheme();

    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.addEventListener('click', UI.toggleTheme);
    }

    // Hook calculation to any input change
    document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', calculateProfit);
    });

    // Init empty chart and history
    createOrUpdateChart(0, 0, 0, 'INR');
    UI.renderHistory();

    // Export buttons
    const csvBtn = document.getElementById('exportCsvBtn');
    const pdfBtn = document.getElementById('exportPdfBtn');
    if (csvBtn) csvBtn.addEventListener('click', exportCSV);
    if (pdfBtn) pdfBtn.addEventListener('click', exportPDF);

    // Clear history
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm('Delete all history?')) {
                Storage.clearHistory();
                UI.renderHistory();
            }
        });
    }
});
/* -------------------- UI & Storage Helpers -------------------- */

// ----- Storage -----
const Storage = {
    key: 'calcHistory',
    getHistory() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    },
    addEntry(entry) {
        const history = this.getHistory();
        history.push(entry);
        localStorage.setItem(this.key, JSON.stringify(history));
    },
    clearHistory() {
        localStorage.removeItem(this.key);
    }
};

// ----- UI -----
const UI = {
    applyTheme() {
        const saved = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', saved);
    },
    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    },
    updateSummaryCards({ totalInvestment, netSaleValue, profitLoss, roi }) {
        const set = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = Number(val).toFixed(2);
        };
        set('totalInvestment', totalInvestment);
        set('netSaleValue', netSaleValue);
        set('profitLoss', profitLoss);
        set('roiPercent', roi);
        // color‑code profit/loss
        const profitEl = document.getElementById('profitLoss');
        if (profitEl) {
            profitEl.style.color = profitLoss >= 0 ? 'var(--clr-success)' : 'var(--clr-danger)';
        }
    },
    renderHistory() {
        const list = document.getElementById('historyList');
        if (!list) return;
        list.innerHTML = '';
        const history = Storage.getHistory();
        history.slice().reverse().forEach(entry => {
            const li = document.createElement('li');
            li.textContent = `${entry.date}: ${entry.shares} shares @ ${entry.purchasePrice} → ${entry.sellPrice} (${entry.currency}) – Profit: ${entry.profitAmount.toFixed(2)}`;
            list.appendChild(li);
        });
    }
};

// ----- Export -----
function exportCSV() {
    const history = Storage.getHistory();
    if (!history.length) { alert('No history to export'); return; }
    const headers = ['Date','Currency','Shares','Purchase Price','Sell Price','Buy Commission','Sell Commission','Profit','ROI','Total Investment','Sold For'];
    const rows = history.map(e => [e.date, e.currency, e.shares, e.purchasePrice, e.sellPrice, e.boughtComm, e.sellComm, e.profitAmount, e.roi, e.totalInvestment, e.soldFor]);
    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().slice(0,10);
    a.download = `stock_calculations_${ts}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportPDF() {
    if (typeof jsPDF === 'undefined') { alert('jsPDF library not loaded'); return; }
    const doc = new jsPDF();
    const history = Storage.getHistory();
    doc.text('Stock Calculation History', 10, 10);
    const startY = 20;
    history.forEach((e, i) => {
        const line = `${i+1}. ${e.date} | ${e.currency} | ${e.shares} shares | Profit: ${e.profitAmount.toFixed(2)} | ROI: ${e.roi}%`;
        doc.text(line, 10, startY + i * 7);
    });
    doc.save('stock_history.pdf');
}