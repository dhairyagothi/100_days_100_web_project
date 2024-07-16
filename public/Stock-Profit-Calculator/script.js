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
    const shares = parseFloat(document.getElementById('shares').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const buyCommission = parseFloat(document.getElementById('buyCommission').value);
    const sellCommission = parseFloat(document.getElementById('sellCommission').value);
    const holdingPeriod = parseFloat(document.getElementById('holdingPeriod').value);

    const purchasedFor = (shares * purchasePrice) + buyCommission;
    const soldFor = (shares * sellPrice) - sellCommission;
    const profitAmount = soldFor - purchasedFor;

    // Calculate ROI
    const roi = ((profitAmount / purchasedFor) * 100).toFixed(2);

    // Calculate Annualized Return
    const annualizedReturn = (Math.pow((1 + profitAmount / purchasedFor), (365 / holdingPeriod)) - 1) * 100;

    // Update currency symbols
    document.getElementById('currencySymbol1').innerText = currencySymbols[currency];
    document.getElementById('currencySymbol2').innerText = currencySymbols[currency];
    document.getElementById('currencySymbol3').innerText = currencySymbols[currency];

    // Display results
    document.getElementById('purchasedFor').innerText = purchasedFor.toFixed(2);
    document.getElementById('soldFor').innerText = soldFor.toFixed(2);
    document.getElementById('profitAmount').innerText = profitAmount.toFixed(2);
    document.getElementById('roi').innerText = roi;
    document.getElementById('annualizedReturn').innerText = annualizedReturn.toFixed(2);

    // Create or update chart
    createOrUpdateChart(purchasedFor, soldFor, profitAmount, currency);
}

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

// Initialize the chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    createOrUpdateChart(0, 0, 0, 'INR');
});