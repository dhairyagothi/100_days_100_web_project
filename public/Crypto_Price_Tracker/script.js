const cryptoGrid = document.getElementById('cryptoGrid');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');

let cryptoData = []; // Store response globally for easy sorting/filtering

// Fetch Data from CoinGecko Public API
async function fetchCryptoPrices() {
    showLoadingSkeletons();
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false');
        if (!response.ok) throw new Error('API Rate limit reached or network error');
        
        cryptoData = await response.json();
        renderDashboard(cryptoData);
    } catch (error) {
        cryptoGrid.innerHTML = `
            <div class="error-state">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Failed to update markets. Please wait or refresh manually.</p>
            </div>`;
    }
}

// Generate Loading Skeleton Elements
function showLoadingSkeletons() {
    cryptoGrid.innerHTML = Array(12).fill(0).map(() => `
        <div class="crypto-card skeleton">
            <div class="skeleton-avatar"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
        </div>
    `).join('');
}

// Render Data Cards to DOM Dynamically 
function renderDashboard(data) {
    if (data.length === 0) {
        cryptoGrid.innerHTML = `<p class="no-results">No cryptocurrencies match your search.</p>`;
        return;
    }

    cryptoGrid.innerHTML = data.map(coin => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        const changeClass = isPositive ? 'positive' : 'negative';
        const trendIcon = isPositive ? 'fa-caret-up' : 'fa-caret-down';

        return `
            <div class="crypto-card">
                <div class="card-header">
                    <img src="${coin.image}" alt="${coin.name}" class="coin-icon">
                    <div class="coin-info">
                        <h3>${coin.name}</h3>
                        <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
                    </div>
                    <span class="rank">#${coin.market_cap_rank}</span>
                </div>
                <div class="card-body">
                    <div class="price-row">
                        <span class="price">$${coin.current_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</span>
                        <span class="price-change ${changeClass}">
                            <i class="fa-solid ${trendIcon}"></i> ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </span>
                    </div>
                    <div class="market-stats">
                        <p><span>Market Cap:</span> $${coin.market_cap.toLocaleString()}</p>
                        <p><span>24h Vol:</span> $${coin.total_volume.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Search Filter Input Listener
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredCoins = cryptoData.filter(coin => 
        coin.name.toLowerCase().includes(searchTerm) || 
        coin.symbol.toLowerCase().includes(searchTerm)
    );
    renderDashboard(filteredCoins);
});

// Manual Refresh Trigger
refreshBtn.addEventListener('click', fetchCryptoPrices);

// Initialize Dashboard & Set Auto-Polling Engine (Every 60 Seconds)
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000);