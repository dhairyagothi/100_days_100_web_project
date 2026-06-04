// CoinGecko public market pairs ticker resource target
const COINGECKO_TICKER_API =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,cardano,ripple,polkadot&order=market_cap_desc&per_page=10&page=1&sparkline=false&locale=en";

const marketCardsContainer = document.getElementById("marketCardsContainer");
const refreshBtn = document.getElementById("refreshBtn");
const statusIndicator = document.getElementById("statusIndicator");

// Async Engine Core pulling real-time crypto payloads
async function synchronizeCryptoMarkets() {
  // 1. Reveal live loader text across updating intervals
  statusIndicator.classList.remove("hidden");
  statusIndicator.innerText =
    "Synchronizing prices across global spot indexes...";
  statusIndicator.style.color = "var(--text-muted)";

  try {
    const response = await fetch(COINGECKO_TICKER_API);

    if (!response.ok) {
      throw new Error("API rate limitation hit or server offline.");
    }

    const coinDataset = await response.json();
    renderDashboardCards(coinDataset);

    // Hide loader upon a clean successful pass
    statusIndicator.classList.add("hidden");
  } catch (error) {
    statusIndicator.classList.remove("hidden");
    statusIndicator.innerText =
      "Failed to sync market rates. CoinGecko has a strict rate limit for free keys; please wait a moment before retrying.";
    statusIndicator.style.color = "var(--color-bearish)";
  }
}

// Convert dataset loops directly into semantic DOM components
function renderDashboardCards(coins) {
  marketCardsContainer.innerHTML = "";

  coins.forEach((coin) => {
    const isBullish = coin.price_change_percentage_24h >= 0;
    const metricsChangeClass = isBullish ? "bullish" : "bearish";
    const prefixSign = isBullish ? "+" : "";

    const cardNode = document.createElement("div");
    cardNode.className = "coin-card";

    cardNode.innerHTML = `
            <div class="coin-identity-row">
                <div class="coin-label">
                    <img src="${coin.image}" alt="${coin.name} Icon" class="coin-icon" loading="lazy">
                    <span class="coin-name">${coin.name}<span class="coin-symbol">${coin.symbol}</span></span>
                </div>
                <span class="market-cap-rank">Rank #${coin.market_cap_rank}</span>
            </div>

            <div class="price-display-row">
                <div class="coin-price">${formatCurrencyMetrics(coin.current_price)}</div>
            </div>

            <div class="metrics-box">
                <div class="metric-line">
                    <span class="label-span">24h Shift Percentage</span>
                    <span class="value-span ${metricsChangeClass}">${prefixSign}${coin.price_change_percentage_24h.toFixed(2)}%</span>
                </div>
                <div class="metric-line">
                    <span class="label-span">Total Market Cap</span>
                    <span class="value-span">${formatLargeNumbers(coin.market_cap)}</span>
                </div>
                <div class="metric-line">
                    <span class="label-span">24h High Matrix</span>
                    <span class="value-span bullish">${formatCurrencyMetrics(coin.high_24h)}</span>
                </div>
                <div class="metric-line">
                    <span class="label-span">24h Low Matrix</span>
                    <span class="value-span bearish">${formatCurrencyMetrics(coin.low_24h)}</span>
                </div>
            </div>
        `;

    marketCardsContainer.appendChild(cardNode);
  });
}

// Format numerical parameters cleanly into readable US Currency pairs
function formatCurrencyMetrics(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

// Format large integers to represent localized values clearly
function formatLargeNumbers(value) {
  return (
    "$" +
    new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "long",
    }).format(value)
  );
}

// Bind active button clicks to refresh prices manually
refreshBtn.addEventListener("click", synchronizeCryptoMarkets);

// Fire initial synchronization query upon page startup load
synchronizeCryptoMarkets();
