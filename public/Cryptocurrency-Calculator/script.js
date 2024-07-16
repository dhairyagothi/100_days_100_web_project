document.getElementById('calculate').addEventListener('click', function() {
    const crypto = document.getElementById('crypto').value;
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    if (amount === '') {
        alert('Please enter an amount');
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`)
        .then(response => response.json())
        .then(data => {
            const price = data[crypto][currency];
            const result = amount * price;
            document.getElementById('result').innerText = `${amount} ${crypto} = ${result.toFixed(2)} ${currency.toUpperCase()}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert('Failed to fetch data. Please try again later.');
        });
});
