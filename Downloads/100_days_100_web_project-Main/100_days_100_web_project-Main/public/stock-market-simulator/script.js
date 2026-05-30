/* CONFIG */
const STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", basePrice: 175, volatility: 0.02 },
  { symbol: "GOOGL", name: "Alphabet Inc.", basePrice: 142, volatility: 0.025 },
  { symbol: "TSLA", name: "Tesla Inc.", basePrice: 248, volatility: 0.04 },
  { symbol: "AMZN", name: "Amazon.com", basePrice: 168, volatility: 0.03 },
  { symbol: "MSFT", name: "Microsoft Corp.", basePrice: 420, volatility: 0.02 },
  { symbol: "META", name: "Meta Platforms", basePrice: 475, volatility: 0.035 },
  { symbol: "NVDA", name: "NVIDIA Corp.", basePrice: 720, volatility: 0.045 },
  { symbol: "NFLX", name: "Netflix Inc.", basePrice: 625, volatility: 0.03 }
];
const BASE_BALANCE = 100000;

/* INITIALIZE MARKET ENGINE */
const marketEngine = new MarketEngine(STOCKS);

/* DARK MODE */
themeToggle.onclick=()=>{
  document.body.classList.toggle("dark");
  localStorage.setItem("theme",
    document.body.classList.contains("dark")?"dark":"light"
  );
};
if(localStorage.getItem("theme")==="dark"){
  document.body.classList.add("dark");
}

/* DATA */
let balance = BASE_BALANCE;
let portfolio = {};
let history = [];
let prices = {};
let priceChanges = {};

/* LOAD SAVED */
const saved = JSON.parse(localStorage.getItem("stockSim"));
if(saved){
  balance=saved.balance;
  portfolio=saved.portfolio;
  history=saved.history;
  
  // Load saved prices into market engine if available
  if(saved.priceHistory){
    marketEngine.priceHistory = saved.priceHistory;
  }
}

// Always initialize prices from market engine
prices = marketEngine.getCurrentPrices();

// Initialize price changes for all stocks
STOCKS.forEach(stock => {
  priceChanges[stock.symbol] = 0;
});

/* LOAD MARKET */
function loadMarket(){
  // Update prices using market engine
  prices = marketEngine.updatePrices();
  
  // Calculate price changes
  STOCKS.forEach(stock => {
    priceChanges[stock.symbol] = marketEngine.getPriceChange(stock.symbol);
  });
  
  renderMarket();
  renderMarketInfo();
  renderNews();
  renderAll();
  save();
}

/* RENDER */
function renderMarket(){
  market.innerHTML="";
  STOCKS.forEach(stock=>{
    const s = stock.symbol;
    const price = prices[s];
    
    // Skip if price is not available yet (null, undefined, or 0)
    if(!price || price === null || typeof price === 'undefined') return;
    
    const change = priceChanges[s] || 0;
    const changePercent = ((change / price) * 100).toFixed(2);
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeIcon = change >= 0 ? '▲' : '▼';
    
    market.innerHTML+=`
      <tr>
        <td>
          <strong>${s}</strong>
          <br><small>${stock.name}</small>
        </td>
        <td>
          ₹${price.toFixed(2)}
          <br><small class="${changeClass}">${changeIcon} ${Math.abs(change).toFixed(2)} (${changePercent}%)</small>
        </td>
        <td>
          <button class="buy" onclick="buyStock('${s}')">Buy</button>
          <button class="sell" onclick="sellStock('${s}')">Sell</button>
        </td>
      </tr>`;
  });
}

function renderPortfolio(){
  let html="", value=0, invested=0;
  for(const s in portfolio){
    const holding = portfolio[s];
    const qty = holding.quantity;
    const avgPrice = holding.avgPrice;
    const currentPrice = prices[s] || 0;
    const holdingValue = qty * currentPrice;
    const holdingInvested = qty * avgPrice;
    const pnl = holdingValue - holdingInvested;
    const pnlPercent = ((pnl / holdingInvested) * 100).toFixed(2);
    
    value += holdingValue;
    invested += holdingInvested;
    
    const pnlClass = pnl >= 0 ? 'profit' : 'loss';
    
    html+=`
      <div class="portfolio-item">
        <div class="portfolio-info">
          <strong>${s}</strong> — ${qty} shares
          <br><small>Avg: ₹${avgPrice.toFixed(2)} | Current: ₹${currentPrice.toFixed(2)}</small>
        </div>
        <div class="portfolio-value">
          <div>₹${holdingValue.toFixed(2)}</div>
          <small class="${pnlClass}">P/L: ₹${pnl.toFixed(2)} (${pnlPercent}%)</small>
        </div>
      </div>`;
  }
  portfolioDiv.innerHTML = html || "No holdings yet";
  portfolioValue.textContent="₹" + value.toFixed(2);

  const totalPnl = value + balance - BASE_BALANCE;
  pl.textContent="₹" + totalPnl.toFixed(2);
  pl.className = totalPnl >= 0 ? "profit" : "loss";
}

function renderMarketInfo(){
  const summary = marketEngine.getMarketSummary();
  const trendElement = document.getElementById("marketTrend");
  
  if(trendElement){
    trendElement.textContent = summary.trend.toUpperCase();
    trendElement.className = "market-trend " + summary.trend;
  }
}

function renderNews(){
  const newsDiv = document.getElementById("marketNews");
  const summary = marketEngine.getMarketSummary();
  
  if(summary.news.length === 0){
    newsDiv.innerHTML = '<div class="news-item">No recent news</div>';
    return;
  }
  
  newsDiv.innerHTML = summary.news.map(news => `
    <div class="news-item">
      <span class="news-time">${news.timestamp}</span>
      <span class="news-message">${news.message}</span>
    </div>
  `).join('');
}

function renderHistory(){
  historyDiv.innerHTML = history.length
    ? history.slice(0, 10).map(h=>`<div class="history-item">${h}</div>`).join("")
    : "No transactions yet";
}

function renderAll(){
  balanceEl.textContent="₹" + balance.toFixed(2);
  renderPortfolio();
  renderHistory();
}

/* ACTIONS */
function buyStock(symbol){
  const price = prices[symbol];
  const qty = prompt(`Enter quantity to buy (Price: ₹${price.toFixed(2)}):`, "1");
  if(!qty || qty <= 0) return;
  
  const quantity = parseInt(qty);
  const totalCost = price * quantity;
  
  if(balance < totalCost) return alert("Insufficient balance!");
  
  balance -= totalCost;
  
  if(!portfolio[symbol]){
    portfolio[symbol] = { quantity: 0, avgPrice: 0 };
  }
  
  const holding = portfolio[symbol];
  const newQuantity = holding.quantity + quantity;
  const newAvgPrice = ((holding.avgPrice * holding.quantity) + (price * quantity)) / newQuantity;
  
  portfolio[symbol] = {
    quantity: newQuantity,
    avgPrice: newAvgPrice
  };
  
  const timestamp = new Date().toLocaleString();
  history.unshift(`${timestamp} - Bought ${quantity} ${symbol} @ ₹${price.toFixed(2)}`);
  
  save();
  renderAll();
  alert(`Successfully bought ${quantity} shares of ${symbol}!`);
}

function sellStock(symbol){
  if(!portfolio[symbol]) return alert("You don't own this stock!");
  
  const holding = portfolio[symbol];
  const price = prices[symbol];
  const maxQty = holding.quantity;
  
  const qty = prompt(`Enter quantity to sell (You own ${maxQty} shares at ₹${price.toFixed(2)}):`, maxQty.toString());
  if(!qty || qty <= 0) return;
  
  const quantity = parseInt(qty);
  if(quantity > maxQty) return alert("You don't have enough shares!");
  
  const totalValue = price * quantity;
  balance += totalValue;
  
  holding.quantity -= quantity;
  
  if(holding.quantity === 0){
    delete portfolio[symbol];
  }
  
  const timestamp = new Date().toLocaleString();
  history.unshift(`${timestamp} - Sold ${quantity} ${symbol} @ ₹${price.toFixed(2)}`);
  
  save();
  renderAll();
  alert(`Successfully sold ${quantity} shares of ${symbol}!`);
}

function save(){
  localStorage.setItem("stockSim",
    JSON.stringify({
      balance, 
      portfolio, 
      history, 
      priceHistory: marketEngine.priceHistory
    })
  );
}

function resetSimulator(){
  if(!confirm("Are you sure you want to reset? All data will be lost.")) return;
  localStorage.removeItem("stockSim");
  marketEngine.reset();
  location.reload();
}

/* INIT */
const balanceEl=document.getElementById("balance");
const portfolioDiv=document.getElementById("portfolio");
const portfolioValue=document.getElementById("portfolioValue");
const pl=document.getElementById("pl");
const market=document.getElementById("market");
const historyDiv=document.getElementById("history");

// Debug market engine state
console.log('Market Engine initialized:', marketEngine);
console.log('Price History:', marketEngine.priceHistory);

// Force re-initialization if prices are invalid
if(Object.values(prices).some(p => p === null || p === undefined)){
  console.warn('Invalid prices detected, re-initializing...');
  marketEngine.initializePrices();
  prices = marketEngine.getCurrentPrices();
  STOCKS.forEach(stock => {
    priceChanges[stock.symbol] = 0;
  });
}

console.log('Prices loaded:', prices);

renderMarket();
renderMarketInfo();
renderNews();
renderAll();

// Update prices every 3 seconds for realistic simulation
setInterval(loadMarket, 3000);
