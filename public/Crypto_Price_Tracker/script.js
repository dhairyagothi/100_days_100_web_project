const cryptoGrid = document.getElementById('crypto-grid');

async function fetchCrypto() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50');
        const data = await response.json();
        
        // Clear grid before rendering
        cryptoGrid.innerHTML = '';
        
        data.forEach(coin => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${coin.name} (${coin.symbol.toUpperCase()})</h3>
                <p>$${coin.current_price.toLocaleString()}</p>
            `;
            cryptoGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching crypto data:", error);
    }
}

// Fetch immediately and then every 60 seconds
fetchCrypto();
setInterval(fetchCrypto, 60000);