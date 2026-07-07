class HftOrderBookSandbox {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.midPrice = 100.00;
        this.tickSize = 0.05;
        this.bids = [];
        this.asks = [];

        this.trades = [];
        this.lastPrice = 100.00;

        this.init();
        this.registerEvents();
        this.startMarketMakerSimulator();
        this.animate();
    }

    init() {
        this.resizeCanvas();
        this.generateInitialLiquidity();
    }

    resizeCanvas() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight - 40;
    }

    generateInitialLiquidity() {
        for (let i = 1; i <= 30; i++) {
            const bidPrice = this.midPrice - (i * this.tickSize);
            const askPrice = this.midPrice + (i * this.tickSize);
            this.bids.push({ price: parseFloat(bidPrice.toFixed(2)), volume: Math.floor(Math.random() * 40) + 10 });
            this.asks.push({ price: parseFloat(askPrice.toFixed(2)), volume: Math.floor(Math.random() * 40) + 10 });
        }
        this.sortOrderBook();
    }

    sortOrderBook() {
        this.bids.sort((a, b) => b.price - a.price);
        this.asks.sort((a, b) => a.price - b.price);
    }

    registerEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('mousedown', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clickY = e.clientY - rect.top;

            if (clickY < this.canvas.height / 2) {
                const targetedAskIdx = Math.floor(Math.random() * 10);
                this.asks[targetedAskIdx].volume += 150;
            } else {
                const targetedBidIdx = Math.floor(Math.random() * 10);
                this.bids[targetedBidIdx].volume += 150;
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.executeInstantMarketOrder();
            }
        });
    }

    executeInstantMarketOrder() {
        const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
        let remainingSize = Math.floor(Math.random() * 35) + 15;

        if (side === 'BUY' && this.asks.length > 0) {
            while (remainingSize > 0 && this.asks.length > 0) {
                let bestAsk = this.asks[0];
                let matchedVolume = Math.min(remainingSize, bestAsk.volume);

                bestAsk.volume -= matchedVolume;
                remainingSize -= matchedVolume;
                this.lastPrice = bestAsk.price;

                this.trades.push({ price: bestAsk.price, volume: matchedVolume, side: 'BUY', timer: 1.0 });
                if (bestAsk.volume <= 0) this.asks.shift();
            }
        } else if (side === 'SELL' && this.bids.length > 0) {
            while (remainingSize > 0 && this.bids.length > 0) {
                let bestBid = this.bids[0];
                let matchedVolume = Math.min(remainingSize, bestBid.volume);

                bestBid.volume -= matchedVolume;
                remainingSize -= matchedVolume;
                this.lastPrice = bestBid.price;

                this.trades.push({ price: bestBid.price, volume: matchedVolume, side: 'SELL', timer: 1.0 });
                if (bestBid.volume <= 0) this.bids.shift();
            }
        }

        this.midPrice = this.lastPrice;
        this.sortOrderBook();
        document.getElementById('lastPriceMetric').innerText = `$${this.lastPrice.toFixed(2)}`;
    }

    startMarketMakerSimulator() {
        setInterval(() => {
            if (this.bids.length === 0 || this.asks.length === 0) return;

            const spread = this.asks[0].price - this.bids[0].price;
            document.getElementById('spreadMetric').innerText = `$${spread.toFixed(2)}`;

            if (this.bids.length < 15 || this.asks.length < 15) {
                this.bids = [];
                this.asks = [];
                this.generateInitialLiquidity();
                return;
            }

            const randomBid = this.bids[Math.floor(Math.random() * this.bids.length)];
            const randomAsk = this.asks[Math.floor(Math.random() * this.asks.length)];

            randomBid.volume = Math.max(5, randomBid.volume + (Math.random() > 0.5 ? 4 : -4));
            randomAsk.volume = Math.max(5, randomAsk.volume + (Math.random() > 0.5 ? 4 : -4));
        }, 120);
    }

    animate() {
        const startPerformance = performance.now();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawBackgroundGridGrid();
        this.drawLiquidityDepthPolygons();
        this.drawHistoricalTradeFlashes();

        const cumulativeDepth = this.bids.reduce((acc, b) => acc + b.volume, 0) + this.asks.reduce((acc, a) => acc + a.volume, 0);
        document.getElementById('depthMetric').innerText = `${cumulativeDepth} Lots`;

        const loopLatencyMicroseconds = (performance.now() - startPerformance) * 1000;
        document.getElementById('latencyMetric').innerText = `${loopLatencyMicroseconds.toFixed(2)} μs`;

        requestAnimationFrame(() => this.animate());
    }

    drawBackgroundGridGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
        this.ctx.lineWidth = 1;
        const spacing = 30;

        for (let x = 0; x < this.canvas.width; x += spacing) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height); this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += spacing) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(0, this.canvas.height); this.ctx.stroke();
        }

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
    }

    drawLiquidityDepthPolygons() {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const midX = w / 2;

        this.ctx.fillStyle = 'rgba(57, 255, 20, 0.12)';
        this.ctx.strokeStyle = '#39ff14';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(midX, h);

        let currentBidX = midX;
        let cumulativeBidVol = 0;

        this.bids.forEach((bid, idx) => {
            cumulativeBidVol += bid.volume;
            const targetY = h - (idx * (h / 30));
            currentBidX = midX - Math.min(midX - 20, cumulativeBidVol * 1.2);
            this.ctx.lineTo(currentBidX, targetY);
        });
        this.ctx.lineTo(currentBidX, 0);
        this.ctx.lineTo(0, 0);
        this.ctx.lineTo(0, h);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.fillStyle = 'rgba(255, 0, 127, 0.12)';
        this.ctx.strokeStyle = '#ff007f';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(midX, 0);

        let currentAskX = midX;
        let cumulativeAskVol = 0;

        this.asks.forEach((ask, idx) => {
            cumulativeAskVol += ask.volume;
            const targetY = idx * (h / 30);
            currentAskX = midX + Math.min(midX - 20, cumulativeAskVol * 1.2);
            this.ctx.lineTo(currentAskX, targetY);
        });
        this.ctx.lineTo(currentAskX, h);
        this.ctx.lineTo(w, h);
        this.ctx.lineTo(w, 0);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    drawHistoricalTradeFlashes() {
        this.trades.forEach((trade, idx) => {
            trade.timer -= 0.02;

            this.ctx.save();
            const radius = (1 - trade.timer) * 45;
            const plotX = trade.side === 'BUY' ? this.canvas.width * 0.75 : this.canvas.width * 0.25;
            const plotY = this.canvas.height / 2 + (idx * 15) - 40;

            this.ctx.strokeStyle = trade.side === 'BUY' ? `rgba(57, 255, 20, ${trade.timer})` : `rgba(255, 0, 127, ${trade.timer})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(plotX, plotY, radius, 0, Math.PI * 2);
            this.ctx.stroke();

            this.ctx.fillStyle = `rgba(255, 255, 255, ${trade.timer})`;
            this.ctx.font = '10px monospace';
            this.ctx.fillText(`EXEC: ${trade.side} ${trade.volume} Lots @ $${trade.price.toFixed(2)}`, plotX - 70, plotY + 3);
            this.ctx.restore();
        });

        this.trades = this.trades.filter(t => t.timer > 0);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new HftOrderBookSandbox('tradingCanvas');
});
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    // Order Book Structural Parameters
    this.midPrice = 100.0;
    this.tickSize = 0.05;
    this.bids = [];
    this.asks = [];
    this.trades = [];
    this.lastPrice = 100.0;

    this.init();
    this.registerEvents();
    this.startMarketMakerSimulator();
    this.animate();
  }

  init() {
    this.resizeCanvas();
    this.generateInitialLiquidity();
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.canvas.height = this.canvas.parentElement.clientHeight - 40;
  }

  generateInitialLiquidity() {
    // Build out depth block frames around mid price configurations
    for (let i = 1; i <= 30; i++) {
      const bidPrice = this.midPrice - i * this.tickSize;
      const askPrice = this.midPrice + i * this.tickSize;
      this.bids.push({
        price: parseFloat(bidPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 40) + 10,
      });
      this.asks.push({
        price: parseFloat(askPrice.toFixed(2)),
        volume: Math.floor(Math.random() * 40) + 10,
      });
    }
    this.sortOrderBook();
  }

  sortOrderBook() {
    this.bids.sort((a, b) => b.price - a.price);
    this.asks.sort((a, b) => a.price - b.price);
  }

  registerEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickY = e.clientY - rect.top;

      // Click on top half -> Add heavy Sell Limit Order block
      if (clickY < this.canvas.height / 2) {
        const targetedAskIdx = Math.floor(Math.random() * 10);
        this.asks[targetedAskIdx].volume += 150;
      }
      // Click on bottom half -> Add concentrated Buy Support Block
      else {
        const targetedBidIdx = Math.floor(Math.random() * 10);
        this.bids[targetedBidIdx].volume += 150;
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.executeInstantMarketOrder();
      }
    });
  }

  executeInstantMarketOrder() {
    const side = Math.random() > 0.5 ? 'BUY' : 'SELL';
    let remainingSize = Math.floor(Math.random() * 35) + 15;

    if (side === 'BUY' && this.asks.length > 0) {
      // Aggressive Market Buy cross-spread execution matching
      while (remainingSize > 0 && this.asks.length > 0) {
        let bestAsk = this.asks[0];
        let matchedVolume = Math.min(remainingSize, bestAsk.volume);

        bestAsk.volume -= matchedVolume;
        remainingSize -= matchedVolume;
        this.lastPrice = bestAsk.price;

        this.trades.push({
          price: bestAsk.price,
          volume: matchedVolume,
          side: 'BUY',
          timer: 1.0,
        });
        if (bestAsk.volume <= 0) this.asks.shift();
      }
    } else if (side === 'SELL' && this.bids.length > 0) {
      // Aggressive Market Sell sweep matching
      while (remainingSize > 0 && this.bids.length > 0) {
        let bestBid = this.bids[0];
        let matchedVolume = Math.min(remainingSize, bestBid.volume);

        bestBid.volume -= matchedVolume;
        remainingSize -= matchedVolume;
        this.lastPrice = bestBid.price;

        this.trades.push({
          price: bestBid.price,
          volume: matchedVolume,
          side: 'SELL',
          timer: 1.0,
        });

        if (bestBid.volume <= 0) this.bids.shift();
      }
    }

    this.midPrice = this.lastPrice;
    this.sortOrderBook();
    document.getElementById('lastPriceMetric').innerText =
      `$${this.lastPrice.toFixed(2)}`;
  }

  startMarketMakerSimulator() {
    // Continuous high-frequency random-walk order placement and cancellation loop
    setInterval(() => {
      if (this.bids.length === 0 || this.asks.length === 0) return;

      const spread = this.asks[0].price - this.bids[0].price;
      document.getElementById('spreadMetric').innerText =
        `$${spread.toFixed(2)}`;

      // Automated liquidity adjustments to prevent starvation
      if (this.bids.length < 15 || this.asks.length < 15) {
        this.bids = [];
        this.asks = [];
        this.generateInitialLiquidity();
        return;
      }

      // Fluctuating volume updates mimicking genuine market-maker activities
      const randomBid = this.bids[Math.floor(Math.random() * this.bids.length)];
      const randomAsk = this.asks[Math.floor(Math.random() * this.asks.length)];

      randomBid.volume = Math.max(
        5,
        randomBid.volume + (Math.random() > 0.5 ? 4 : -4)
      );
      randomAsk.volume = Math.max(
        5,
        randomAsk.volume + (Math.random() > 0.5 ? 4 : -4)
      );
    }, 120);
  }

  animate() {
    const startPerformance = performance.now();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawBackgroundGridGrid();
    this.drawLiquidityDepthPolygons();
    this.drawHistoricalTradeFlashes();

    const cumulativeDepth =
      this.bids.reduce((acc, b) => acc + b.volume, 0) +
      this.asks.reduce((acc, a) => acc + a.volume, 0);

    document.getElementById('depthMetric').innerText =
      `${cumulativeDepth} Lots`;

    // Calculate microseconds computation profiles
    const loopLatencyMicroseconds =
      (performance.now() - startPerformance) * 1000;
    document.getElementById('latencyMetric').innerText =
      `${loopLatencyMicroseconds.toFixed(2)} μs`;

    requestAnimationFrame(() => this.animate());
  }

  drawBackgroundGridGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    this.ctx.lineWidth = 1;
    const spacing = 30;

    for (let x = 0; x < this.canvas.width; x += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.canvas.height; y += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawLiquidityDepthPolygons() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const midX = w / 2;

    // --- RENDER BIDS SHADING (BUY LIQUIDITY - LEFT SIDE) ---
    this.ctx.fillStyle = 'rgba(57, 255, 20, 0.12)';
    this.ctx.strokeStyle = '#39ff14';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(midX, h);

    let currentBidX = midX;
    let cumulativeBidVol = 0;

    this.bids.forEach((bid, idx) => {
      cumulativeBidVol += bid.volume;
      const targetY = h - idx * (h / 30);
      currentBidX = midX - Math.min(midX - 20, cumulativeBidVol * 1.2);
      this.ctx.lineTo(currentBidX, targetY);
    });
    this.ctx.lineTo(currentBidX, 0);
    this.ctx.lineTo(0, 0);
    this.ctx.lineTo(0, h);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // --- RENDER ASKS SHADING (SELL LIQUIDITY - RIGHT SIDE) ---
    this.ctx.fillStyle = 'rgba(255, 0, 127, 0.12)';
    this.ctx.strokeStyle = '#ff007f';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(midX, 0);

    let currentAskX = midX;
    let cumulativeAskVol = 0;

    this.asks.forEach((ask, idx) => {
      cumulativeAskVol += ask.volume;
      const targetY = idx * (h / 30);
      currentAskX = midX + Math.min(midX - 20, cumulativeAskVol * 1.2);
      this.ctx.lineTo(currentAskX, targetY);
    });
    this.ctx.lineTo(currentAskX, h);
    this.ctx.lineTo(w, h);
    this.ctx.lineTo(w, 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
  }

  drawHistoricalTradeFlashes() {
    // Iterate and decay trade flash markers to animate instant fills
    this.trades.forEach((trade, idx) => {
      trade.timer -= 0.02;

      this.ctx.save();
      const radius = (1 - trade.timer) * 45;
      const plotX =
        trade.side === 'BUY'
          ? this.canvas.width * 0.75
          : this.canvas.width * 0.25;
      const plotY = this.canvas.height / 2 + idx * 15 - 40;

      this.ctx.strokeStyle =
        trade.side === 'BUY'
          ? `rgba(57, 255, 20, ${trade.timer})`
          : `rgba(255, 0, 127, ${trade.timer})`;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(plotX, plotY, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.fillStyle = `rgba(255, 255, 255, ${trade.timer})`;
      this.ctx.font = '10px monospace';
      this.ctx.fillText(
        `EXEC: ${trade.side} ${trade.volume} Lots @ $${trade.price.toFixed(2)}`,
        plotX - 70,
        plotY + 3
      );
      this.ctx.restore();
    });

    // Filter away expired execution logs smoothly
    this.trades = this.trades.filter((t) => t.timer > 0);
  }
}

// Fire up terminal initialization as soon as DOM states are complete
window.addEventListener('DOMContentLoaded', () => {
  new HftOrderBookSandbox('tradingCanvas');
});
