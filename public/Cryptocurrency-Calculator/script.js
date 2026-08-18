const cryptoSymbols = {
    'bitcoin': 'BTC',
    'ethereum': 'ETH',
    'tether': 'USDT',
    'binancecoin': 'BNB',
    'solana': 'SOL',
    'ripple': 'XRP',
    'dogecoin': 'DOGE',
    'cardano': 'ADA',
    'tron': 'TRX',
    'avalanche-2': 'AVAX'
};

document.getElementById('calculate').addEventListener('click', async function () {
    const cryptoSelect = document.getElementById('crypto');
    const currencySelect = document.getElementById('currency');
    const amountInput = document.getElementById('amount').value.trim();
    const resultElement = document.getElementById('result');
    const calculateButton = document.getElementById('calculate');

    const crypto = cryptoSelect.value ? cryptoSelect.value.trim().toLowerCase() : '';
    const currency = currencySelect.value ? currencySelect.value.trim().toLowerCase() : '';

    // Clear previous results/errors
    resultElement.innerHTML = '';
    resultElement.className = '';

    // Input Validation
    if (!amountInput) {
        showError('Please enter an amount.');
        return;
    }

    const amount = Number(amountInput);
    if (isNaN(amount)) {
        showError('Please enter a valid numeric amount.');
        return;
    }

    if (amount <= 0) {
        showError('Please enter a positive amount greater than 0.');
        return;
    }

    if (!crypto) {
        showError('Please select a cryptocurrency.');
        return;
    }

    if (!currency) {
        showError('Please select a target currency.');
        return;
    }

    // Set Loading State
    setLoading(true);

    try {
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network status.');
        }

        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(crypto)}&vs_currencies=${encodeURIComponent(currency)}`
        );

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please wait a moment before trying again.');
            }
            throw new Error(`Pricing API returned error status: ${response.status}`);
        }

        const data = await response.json();
        const price = data[crypto]?.[currency];

        if (price === undefined || price === null || typeof price !== 'number') {
            throw new Error('Could not retrieve a valid price for the selected currency pair.');
        }

        const convertedValue = amount * price;

        // Get symbols for cleaner formatting
        const cryptoSymbol = cryptoSymbols[crypto] || crypto.toUpperCase();
        const fiatSymbol = currency.toUpperCase();

        // Format result nicely
        const formattedAmount = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 8
        }).format(amount);

        const formattedConverted = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(convertedValue);

        showSuccess(`${formattedAmount} ${cryptoSymbol} = ${formattedConverted} ${fiatSymbol}`);

    } catch (error) {
        console.error('Conversion Error:', error);
        showError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setLoading(false);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            calculateButton.disabled = true;
            calculateButton.textContent = 'Calculating...';
            
            resultElement.innerHTML = '';
            const spinner = document.createElement('span');
            spinner.className = 'loading-spinner';
            resultElement.appendChild(spinner);
            resultElement.appendChild(document.createTextNode(' Fetching live rates...'));
            
            resultElement.className = 'loading-state';
        } else {
            calculateButton.disabled = false;
            calculateButton.textContent = 'Calculate';
        }
    }

    function showError(message) {
        resultElement.innerHTML = '';
        
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'error-icon';
        iconSpan.textContent = '⚠️';

        const textNode = document.createTextNode(' ' + message);

        errorContainer.appendChild(iconSpan);
        errorContainer.appendChild(textNode);
        
        resultElement.appendChild(errorContainer);
        resultElement.className = 'error-message';
    }

    function showSuccess(message) {
        resultElement.innerHTML = '';

        const successContainer = document.createElement('div');
        successContainer.className = 'success-container';

        const iconSpan = document.createElement('span');
        iconSpan.className = 'success-icon';
        iconSpan.textContent = '✅';

        const textNode = document.createTextNode(' ' + message);

        successContainer.appendChild(iconSpan);
        successContainer.appendChild(textNode);

        resultElement.appendChild(successContainer);
        resultElement.className = 'success-message';
    }
});
