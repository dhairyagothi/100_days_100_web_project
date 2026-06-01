let isLoading = false;
const calculatebtn = document.getElementById('calculate')

calculatebtn.addEventListener('click', async function() {
    
    if(isLoading){
        return;
    }

    const crypto = document.getElementById('crypto').value;
    const amount = Number(document.getElementById('amount').value.trim());
    const currency = document.getElementById('currency').value;

    if (!Number.isFinite(amount) || amount <= 0) {
        alert('Please enter a valid positive number');
        return;
    }

    if(!navigator.onLine){
        alert(`No Internet Connection`);
        return;
    }

    try {
        isLoading = true;
        calculatebtn.disabled = true;
        calculatebtn.textContent = `Calculating...`

        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`)

        if(!response.ok){
            if(response.status === 429){
                throw new Error(`Rate limit Exceeded`);
            }
            throw new Error(`API error (${response.status})`)
        }

        const data = await response.json()
        const price = data?.[crypto]?.[currency];
        
        if(typeof price !== 'number'){
            throw new Error(`Invalid API response`)
        }

        const result = amount * price;
        document.getElementById('result').innerText = `${amount} ${crypto} = ${result.toFixed(2)} ${currency.toUpperCase()}`;

    } catch (error) {
        console.error(error);
        document.getElementById('result').innerText = error.message || `Unable to Calculate Conversion`;
    } finally{
        isLoading = false;
        calculatebtn.disabled = false;
        calculatebtn.textContent = `Calculate`
    }
});
