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
        cryptoGrid.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'Failed to load cryptocurrency data. Please try again later.';
        cryptoGrid.appendChild(errorDiv);
    }
}

function renderCoins(coins) {
    cryptoGrid.innerHTML = '';
    
    if (coins.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = `No cryptocurrencies found matching "${searchInput.value}".`;
        cryptoGrid.appendChild(noResults);
        return;
    }
    
    coins.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const priceChange24h = coin.price_change_percentage_24h || 0;
        const isPositive = priceChange24h >= 0;
        const changeSign = isPositive ? '▲' : '▼';
        const changeClass = isPositive ? 'positive' : 'negative';
        
        // Define a 100% static HTML template outline without any interpolated variables for absolute security
        card.innerHTML = `
            <div class="card-header">
                <img class="coin-icon" src="" alt="" loading="lazy">
                <div class="coin-info">
                    <span class="coin-name"></span>
                    <span class="coin-symbol"></span>
                </div>
            </div>
            <div class="card-body">
                <span class="coin-price"></span>
                <span class="coin-change">
                    <span class="change-icon"></span>
                    <span class="change-val"></span>
                </span>
            </div>
        `;
        
        // Populate all data programmatically using textContent and attributes
        const img = card.querySelector('.coin-icon');
        img.src = coin.image || '';
        img.alt = coin.name || '';
        
        card.querySelector('.coin-name').textContent = coin.name || '';
        card.querySelector('.coin-symbol').textContent = (coin.symbol || '').toUpperCase();
        card.querySelector('.coin-price').textContent = `$${(coin.current_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        
        // Setup change badge styling and sign programmatically
        const changeBadge = card.querySelector('.coin-change');
        changeBadge.classList.add(changeClass);
        card.querySelector('.change-icon').textContent = changeSign;
        card.querySelector('.change-val').textContent = `${Math.abs(priceChange24h).toFixed(2)}%`;
        
        cryptoGrid.appendChild(card);
    });
}

function filterAndRenderCoins() {
    const searchTerm = (searchInput.value || '').toLowerCase().trim();
    const filteredCoins = coinsData.filter(coin => 
        (coin.name || '').toLowerCase().includes(searchTerm) || 
        (coin.symbol || '').toLowerCase().includes(searchTerm)
    );
    renderCoins(filteredCoins);
}

// Add event listener to search input for real-time filtering
searchInput.addEventListener('input', filterAndRenderCoins);

// Fetch immediately and then every 60 seconds
fetchCrypto();
setInterval(fetchCrypto, 60000);