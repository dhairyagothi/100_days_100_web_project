import React, { useContext, useEffect, useState } from "react";
import { CoinContext } from "../../context/CoinContext";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  const { allCoins, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [input, setInput] = useState("");

  const inputHandler = (event) => {
    if (event.target.value === "") {
      setDisplayCoin(allCoins);
    }
    setInput(event.target.value);
  };

  const searchHandler = async (event) => {
    event.preventDefault();
    const filteredCoins = await allCoins.filter((coin) =>
      coin.name.toLowerCase().includes(input.toLowerCase())
    );
    setDisplayCoin(filteredCoins);
  };

  useEffect(() => {
    setDisplayCoin(allCoins);
  }, [allCoins]);

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-eyebrow">Live Market Data</div>
        <h1>
          The crypto market,<br />
          <em>beautifully</em> tracked.
        </h1>
        <p>
          Real-time prices, market caps, and 24h changes for the world's top cryptocurrencies. Stay informed, trade smarter.
        </p>
        <form onSubmit={searchHandler}>
          <input
            value={input}
            list="coinlist"
            required
            onChange={inputHandler}
            type="text"
            placeholder="Search cryptocurrency..."
          />
          <datalist id="coinlist">
            {allCoins.map((coin, index) => (
              <option key={index} value={coin.name} />
            ))}
          </datalist>
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        <div className="table-heading">
          <p>#</p>
          <p>Coin</p>
          <p style={{ textAlign: "right" }}>Price</p>
          <p style={{ textAlign: "right" }}>24h</p>
          <p style={{ textAlign: "right" }}>Market Cap</p>
        </div>

        {displayCoin.slice(0, 10).map((item, index) => (
          <Link to={`/coin/${item.id}`} className="table-layout" key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt={item.name} />
              <div className="coin-label">
                <span className="coin-name-text">{item.name}</span>
                <span className="coin-sym">{item.symbol}</span>
              </div>
            </div>
            <p className="price">
              {currency.symbol}{item.current_price?.toLocaleString() ?? 'N/A'}
            </p>
            <p className={item.price_change_percentage_24h > 0 ? "green" : "red"}>
              {item.price_change_percentage_24h > 0 ? "▲" : "▼"}{" "}
              {Math.abs(Math.floor((item.price_change_percentage_24h ?? 0) * 100) / 100)}%
            </p>
            <p className="market-cap">
              {currency.symbol}{item.market_cap?.toLocaleString() ?? 'N/A'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;