import React, { useState } from 'react';
import './Converter.css';

const Convert = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BTC');
  const [result, setResult] = useState('');
  // const apiKey = process.env.REACT_APP_API_KEY;
  const apiKey = import.meta.env.VITE_API_KEY;

  const handleConvert = () => {
    const apiUrl = `https://min-api.cryptocompare.com/data/price?fsym=${toCurrency}&tsyms=${fromCurrency}&api_key=${apiKey}`;
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        const rate = data[fromCurrency];
        const conversionResult = amount / rate;
        setResult(`${amount} ${fromCurrency} = ${conversionResult.toFixed(8)} ${toCurrency}`);
      })
      .catch(() => setResult('Error: Unable to fetch exchange rate.'));
  };

  return (
    <div className="converter-page">
      <div className="converter-card">
        <h2 className="converter-title">Crypto Converter</h2>
        <p className="converter-subtitle">Convert fiat currency to cryptocurrency instantly.</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="input-group">
            <label>Amount</label>
            <input
              type="text"
              placeholder="Enter amount"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="select-row">
            <div className="input-group">
              <label>From (Fiat)</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="INR">INR — Indian Rupee</option>
                <option value="CAD">CAD — Canadian Dollar</option>
                <option value="AUD">AUD — Australian Dollar</option>
                <option value="JPY">JPY — Japanese Yen</option>
                <option value="CHF">CHF — Swiss Franc</option>
                <option value="SGD">SGD — Singapore Dollar</option>
                <option value="HKD">HKD — Hong Kong Dollar</option>
                <option value="NZD">NZD — New Zealand Dollar</option>
                <option value="ZAR">ZAR — South African Rand</option>
                <option value="SEK">SEK — Swedish Krona</option>
                <option value="NOK">NOK — Norwegian Krone</option>
                <option value="MXN">MXN — Mexican Peso</option>
                <option value="CNY">CNY — Chinese Yuan</option>
                <option value="NGN">NGN — Nigerian Naira</option>
              </select>
            </div>

            <div className="select-divider">→</div>

            <div className="input-group">
              <label>To (Crypto)</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="USDT">Tether (USDT)</option>
                <option value="BNB">Binance Coin (BNB)</option>
                <option value="XRP">XRP</option>
                <option value="SOL">Solana (SOL)</option>
                <option value="ADA">Cardano (ADA)</option>
                <option value="DOGE">Dogecoin (DOGE)</option>
                <option value="DOT">Polkadot (DOT)</option>
                <option value="MATIC">Polygon (MATIC)</option>
                <option value="AVAX">Avalanche (AVAX)</option>
                <option value="LTC">Litecoin (LTC)</option>
                <option value="SHIB">Shiba Inu (SHIB)</option>
                <option value="TRX">Tron (TRX)</option>
              </select>
            </div>
          </div>

          <button type="button" className="convert-btn" onClick={handleConvert}>
            Convert
          </button>
        </form>

        {result && <div className="result-box">{result}</div>}
      </div>
    </div>
  );
};

export default Convert;