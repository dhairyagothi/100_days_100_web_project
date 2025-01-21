import React, { useState } from 'react';
import './Converter.css'; // Assuming you save your CSS in Convert.css

const Convert = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [result, setResult] = useState('');
  const apiKey = process.env.REACT_APP_API_KEY;

  const handleConvert = () => {
    const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${toCurrency}&tsyms=${fromCurrency}&api_key=${apiKey}`;

    
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const rate = data[fromCurrency];
        const conversionResult = amount / rate;
        setResult(`${amount} ${fromCurrency} is equal to ${conversionResult.toFixed(8)} ${toCurrency}`);
      })
      .catch(error => {
        setResult('Error: Unable to fetch exchange rate.');
        console.error(error);
      });
  };

  return (
    <div className="container">
      <div className="img-placed">
        <img src="https://i.imgur.com/YgmULQP.png" alt="" />
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <input 
          type="text" 
          name="amount" 
          id="amount" 
          placeholder="Enter Amount" 
          required 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label id="fromCurrencyName">
          {fromCurrency}
        </label>
        <div id="select-field">
          <select 
            name="fromCurrency" 
            id="fromCurrency" 
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="AUD">AUD - Australian Dollar</option>
            <option value="JPY">JPY - Japanese Yen</option>
            <option value="INR">INR - India Rupee</option>
            <option value="NZD">NZD - New Zealand Dollar</option>
            <option value="CHF">CHF - Swiss Franc</option>
            <option value="ZAR">ZAR - South African Rand</option>
            <option value="BGN">BGN - Bulgarian Lev</option>
            <option value="SGD">SGD - Singapore Dollar</option>
            <option value="HKD">HKD - Hong Kong Dollar</option>
            <option value="SEK">SEK - Swedish Krona</option>
            <option value="THB">THB - Thai Baht</option>
            <option value="HUF">HUF - Hungarian Forint</option>
            <option value="CNY">CNY - Chinese Yuan Renminbi</option>
            <option value="NOK">NOK - Norwegian Krone</option>
            <option value="MXN">MXN - Mexican Peso</option>
            <option value="GHS">GHS - Ghanians Cedi</option>
            <option value="NGN">NGN - Nigerian Naira</option>
          </select>

          <select 
            name="toCurrency" 
            id="toCurrency" 
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="USDT">Tether (USDT)</option>
            <option value="BNB">Binance Coin (BNB)</option>
            <option value="USDC">USD Coin (USDC)</option>
            <option value="XRP">XRP (XRP)</option>
            <option value="BUSD">Binance USD (BUSD)</option>
            <option value="ADA">cardano (ADA)</option>
            <option value="DOGE">Dogecoin (DOGE)</option>
            <option value="MATIC">Polygon (MATIC)</option>
            <option value="SOL">Solana (SOL)</option>
            <option value="DOT">Polkadot (DOT)</option>
            <option value="SHIB">Shiba Inu (SHIB)</option>
            <option value="LTC">Litecoin (LTC)</option>
            <option value="TRX">Tron (TRX)</option>
            <option value="AVAX">Avalanche (AVAX)</option>
          </select>
        </div>

        <br />

        <button 
          type="button" 
          id="convert" 
          className="primary-btn"
          onClick={handleConvert}
        >
          Convert
        </button>
      </form>

      <p id="result">{result}</p>
    </div>
  );
};

export default Convert;


