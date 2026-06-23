const cryptoGrid = document.getElementById('crypto-grid');
const searchInput = document.getElementById('search');

let coinsData = [];

async function fetchCrypto() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        coinsData = await response.json();
        
        // Filter and render based on current search input value
        filterAndRenderCoins();
    } catch (error) {
        console.error("Error fetching crypto data:", error);
        cryptoGrid.innerHTML = `<div class="error-message">Failed to load cryptocurrency data. Please try again later.</div>`;
    }
}

function renderCoins(coins) {
    cryptoGrid.innerHTML = '';
    
    if (coins.length === 0) {
        cryptoGrid.innerHTML = `<div class="no-results">No cryptocurrencies found matching "${searchInput.value}".</div>`;
        return;
    }
    
    coins.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const priceChange24h = coin.price_change_percentage_24h || 0;
        const isPositive = priceChange24h >= 0;
        const changeSign = isPositive ? '▲' : '▼';
        const changeClass = isPositive ? 'positive' : 'negative';
        
        card.innerHTML = `
            <div class="card-header">
                <img class="coin-icon" src="${coin.image}" alt="${coin.name}" loading="lazy">
                <div class="coin-info">
                    <span class="coin-name">${coin.name}</span>
                    <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                </div>
            </div>
            <div class="card-body">
                <span class="coin-price">$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span class="coin-change ${changeClass}">
                    <span>${changeSign}</span>
                    <span>${Math.abs(priceChange24h).toFixed(2)}%</span>
                </span>
            </div>
        `;
        cryptoGrid.appendChild(card);
    });
}

function filterAndRenderCoins() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredCoins = coinsData.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm) || 
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    renderCoins(filteredCoins);
}

// Add event listener to search input for real-time filtering
searchInput.addEventListener('input', filterAndRenderCoins);

// Fetch immediately and then every 60 seconds
fetchCrypto();
setInterval(fetchCrypto, 60000);