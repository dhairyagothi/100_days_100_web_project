/**
 * Advanced Stock Market Simulation Engine
 * Handles dynamic price movements, market trends, and events
 */

class MarketEngine {
  constructor(stocks) {
    this.stocks = stocks;
    this.marketTrend = 'neutral'; // 'bullish', 'bearish', 'neutral'
    this.trendStrength = 0; // -1 to 1
    this.volatilityMultiplier = 1;
    this.eventActive = false;
    this.eventTimer = null;
    this.marketNews = [];
    this.priceHistory = {};
    this.initializePrices();
  }

  /**
   * Initialize starting prices for all stocks
   */
  initializePrices() {
    this.stocks.forEach(stock => {
      if (!this.priceHistory[stock.symbol]) {
        this.priceHistory[stock.symbol] = [{
          price: stock.basePrice,
          timestamp: Date.now()
        }];
      }
    });
  }

  /**
   * Main price update function with advanced logic
   */
  updatePrices() {
    // Randomly change market trend
    if (Math.random() < 0.05) {
      this.updateMarketTrend();
    }

    // Randomly trigger market events
    if (Math.random() < 0.02 && !this.eventActive) {
      this.triggerMarketEvent();
    }

    // Update each stock price
    this.stocks.forEach(stock => {
      const newPrice = this.calculateNewPrice(stock);
      const history = this.priceHistory[stock.symbol];
      
      history.push({
        price: newPrice,
        timestamp: Date.now()
      });

      // Keep only last 100 price points
      if (history.length > 100) {
        history.shift();
      }
    });

    return this.getCurrentPrices();
  }

  /**
   * Calculate new price using multiple factors
   */
  calculateNewPrice(stock) {
    const currentPrice = this.getCurrentPrice(stock.symbol);
    
    // Validate current price is a valid number
    if (typeof currentPrice !== 'number' || isNaN(currentPrice) || currentPrice <= 0) {
      console.error(`Invalid current price for ${stock.symbol}:`, currentPrice);
      return stock.basePrice;
    }
    
    // Base random walk
    const randomFactor = (Math.random() - 0.5) * 2;
    
    // Market trend influence
    const trendInfluence = this.trendStrength * 0.5;
    
    // Stock-specific volatility
    const volatility = stock.volatility * this.volatilityMultiplier;
    
    // Momentum (based on recent price movement)
    const momentum = this.calculateMomentum(stock.symbol);
    
    // Mean reversion (tendency to return to base price)
    const meanReversion = (stock.basePrice - currentPrice) / stock.basePrice * 0.1;
    
    // Combine all factors
    const totalChange = (
      (randomFactor * 0.3) +
      (trendInfluence * 0.3) +
      (momentum * 0.2) +
      (meanReversion * 0.2)
    ) * volatility * currentPrice;
    
    let newPrice = currentPrice + totalChange;
    
    // Validate new price before applying bounds
    if (isNaN(newPrice) || !isFinite(newPrice)) {
      console.error(`Calculated NaN price for ${stock.symbol}, using base price`);
      return stock.basePrice;
    }
    
    // Apply bounds (50% to 200% of base price)
    const minPrice = stock.basePrice * 0.5;
    const maxPrice = stock.basePrice * 2.0;
    newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));
    
    return Math.round(newPrice * 100) / 100;
  }

  /**
   * Calculate momentum based on recent price changes
   */
  calculateMomentum(symbol) {
    const history = this.priceHistory[symbol];
    if (history.length < 5) return 0;
    
    const recent = history.slice(-5);
    const priceChanges = [];
    
    for (let i = 1; i < recent.length; i++) {
      // Validate both prices are numbers before calculating change
      const currentPrice = recent[i]?.price;
      const previousPrice = recent[i-1]?.price;
      
      if (typeof currentPrice === 'number' && typeof previousPrice === 'number' && previousPrice !== 0) {
        const change = (currentPrice - previousPrice) / previousPrice;
        priceChanges.push(change);
      }
    }
    
    if (priceChanges.length === 0) return 0;
    
    const avgChange = priceChanges.reduce((a, b) => a + b, 0) / priceChanges.length;
    return avgChange * 10; // Scale up the momentum effect
  }

  /**
   * Update market trend randomly
   */
  updateMarketTrend() {
    const trends = ['bullish', 'bearish', 'neutral'];
    const oldTrend = this.marketTrend;
    this.marketTrend = trends[Math.floor(Math.random() * trends.length)];
    
    // Set trend strength
    switch(this.marketTrend) {
      case 'bullish':
        this.trendStrength = 0.3 + Math.random() * 0.4;
        break;
      case 'bearish':
        this.trendStrength = -(0.3 + Math.random() * 0.4);
        break;
      case 'neutral':
        this.trendStrength = (Math.random() - 0.5) * 0.2;
        break;
    }

    if (oldTrend !== this.marketTrend) {
      this.addNews(`Market sentiment shifts to ${this.marketTrend.toUpperCase()}`);
    }
  }

  /**
   * Trigger random market events
   */
  triggerMarketEvent() {
    this.eventActive = true;
    
    const events = [
      {
        type: 'earnings',
        message: 'Major tech earnings beat expectations!',
        effect: 0.05,
        duration: 5000,
        affectedSector: ['AAPL', 'GOOGL', 'MSFT', 'META']
      },
      {
        type: 'recession_fear',
        message: 'Economic uncertainty causes market jitters',
        effect: -0.04,
        duration: 7000,
        affectedSector: 'all'
      },
      {
        type: 'innovation',
        message: 'Breakthrough AI announcement boosts tech stocks!',
        effect: 0.06,
        duration: 6000,
        affectedSector: ['NVDA', 'GOOGL', 'MSFT']
      },
      {
        type: 'volatility',
        message: 'High volatility detected in the market',
        effect: 0,
        duration: 8000,
        volatilityBoost: 2.5
      },
      {
        type: 'fed_rate',
        message: 'Federal Reserve signals rate change',
        effect: -0.03,
        duration: 10000,
        affectedSector: 'all'
      },
      {
        type: 'merger',
        message: 'Major acquisition announced in tech sector!',
        effect: 0.04,
        duration: 6000,
        affectedSector: ['AMZN', 'META', 'NFLX']
      }
    ];

    const event = events[Math.floor(Math.random() * events.length)];
    this.addNews(event.message);
    
    // Apply event effects
    if (event.volatilityBoost) {
      this.volatilityMultiplier = event.volatilityBoost;
    }
    
    // Apply instant price shock
    this.stocks.forEach(stock => {
      if (event.affectedSector === 'all' || event.affectedSector.includes(stock.symbol)) {
        const currentPrice = this.getCurrentPrice(stock.symbol);
        const shock = currentPrice * event.effect;
        const newPrice = currentPrice + shock;
        
        this.priceHistory[stock.symbol].push({
          price: Math.round(newPrice * 100) / 100,
          timestamp: Date.now()
        });
      }
    });

    // Clear event after duration
    this.eventTimer = setTimeout(() => {
      this.eventActive = false;
      this.volatilityMultiplier = 1;
      this.addNews('Market stabilizing after recent events');
    }, event.duration);
  }

  /**
   * Add news to the feed
   */
  addNews(message) {
    this.marketNews.unshift({
      message,
      timestamp: new Date().toLocaleTimeString(),
      id: Date.now()
    });
    
    // Keep only last 10 news items
    if (this.marketNews.length > 10) {
      this.marketNews.pop();
    }
  }

  /**
   * Get current price for a stock
   */
  getCurrentPrice(symbol) {
    const history = this.priceHistory[symbol];
    if (!history || history.length === 0) {
      console.warn(`No price history for ${symbol}, using base price`);
      const stock = this.stocks.find(s => s.symbol === symbol);
      return stock ? stock.basePrice : 0;
    }
    
    const lastEntry = history[history.length - 1];
    
    // Handle different data structures
    if (typeof lastEntry === 'object' && lastEntry !== null) {
      // Check if it has a price property (expected structure: {price: number, timestamp: number})
      if ('price' in lastEntry && typeof lastEntry.price === 'number') {
        return lastEntry.price;
      }
    }
    
    // If it's just a number (legacy support)
    if (typeof lastEntry === 'number') {
      return lastEntry;
    }
    
    // Fallback to base price
    console.warn(`Invalid price structure for ${symbol}:`, lastEntry);
    const stock = this.stocks.find(s => s.symbol === symbol);
    return stock ? stock.basePrice : 0;
  }

  /**
   * Get all current prices
   */
  getCurrentPrices() {
    const prices = {};
    this.stocks.forEach(stock => {
      prices[stock.symbol] = this.getCurrentPrice(stock.symbol);
    });
    return prices;
  }

  /**
   * Get price change over last N updates
   */
  getPriceChange(symbol, periods = 1) {
    const history = this.priceHistory[symbol];
    if (!history || history.length <= periods) return 0;
    
    const currentPrice = history[history.length - 1].price;
    const oldPrice = history[history.length - 1 - periods].price;
    
    return currentPrice - oldPrice;
  }

  /**
   * Calculate stock statistics
   */
  getStockStats(symbol) {
    const history = this.priceHistory[symbol].map(h => h.price);
    const currentPrice = history[history.length - 1];
    
    const high = Math.max(...history);
    const low = Math.min(...history);
    const avg = history.reduce((a, b) => a + b, 0) / history.length;
    
    // Calculate volatility (standard deviation)
    const variance = history.reduce((sum, price) => {
      return sum + Math.pow(price - avg, 2);
    }, 0) / history.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      current: currentPrice,
      high: high,
      low: low,
      average: avg,
      volatility: stdDev,
      trend: this.calculateTrend(history)
    };
  }

  /**
   * Calculate overall trend for a stock
   */
  calculateTrend(priceArray) {
    if (priceArray.length < 10) return 'neutral';
    
    const recent10 = priceArray.slice(-10);
    const firstHalf = recent10.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
    const secondHalf = recent10.slice(5).reduce((a, b) => a + b, 0) / 5;
    
    const change = (secondHalf - firstHalf) / firstHalf;
    
    if (change > 0.02) return 'uptrend';
    if (change < -0.02) return 'downtrend';
    return 'neutral';
  }

  /**
   * Get market summary
   */
  getMarketSummary() {
    return {
      trend: this.marketTrend,
      trendStrength: this.trendStrength,
      volatility: this.volatilityMultiplier,
      eventActive: this.eventActive,
      news: this.marketNews
    };
  }

  /**
   * Get historical data for charting
   */
  getHistoricalData(symbol, points = 20) {
    const history = this.priceHistory[symbol];
    return history.slice(-points).map(h => ({
      price: h.price,
      timestamp: h.timestamp
    }));
  }

  /**
   * Reset market to initial state
   */
  reset() {
    this.marketTrend = 'neutral';
    this.trendStrength = 0;
    this.volatilityMultiplier = 1;
    this.eventActive = false;
    this.marketNews = [];
    this.priceHistory = {};
    
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
    }
    
    this.initializePrices();
    this.addNews('Market opened for trading');
  }
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarketEngine;
}
