import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
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
    const filteredCoins = await allCoins.filter((coin) => {
      return coin.name.toLowerCase().includes(input.toLowerCase());
    });
    setDisplayCoin(filteredCoins);
  };

  useEffect(() => {
    setDisplayCoin(allCoins);
  }, [allCoins]);
  return (
    <div className="home">
      <div className="hero">
        <h1>
          Largest Crypto MarketPlace
        </h1>
        <p>
        Welcome to the Largest Crypto MarketPlace, your one-stop destination for real-time cryptocurrency data. Our platform provides the most accurate and up-to-date information on the top cryptocurrencies, including their current prices, market caps, and 24-hour changes. Whether you're an investor, trader, or simply curious about the crypto market, our user-friendly interface and comprehensive data make it easy to stay informed and make informed decisions. Start exploring the dynamic world of cryptocurrencies with us today!
        </p>
        <form onSubmit={searchHandler}>
          <input
            value={input}
            list="coinlist"
            required
            onChange={inputHandler}
            type="text"
            placeholder="Search crypto..."
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
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>
        {displayCoin.slice(0, 10).map((item, index) => (
          <Link to={`/coin/${item.id}`} className="table-layout" key={index}>
            <p>{item.market_cap_rank}</p>
            <div>
              <img src={item.image} alt="" />
              <p>{item.name + "-" + item.symbol}</p>
            </div>
            <p>
              {currency.symbol} {item.current_price.toLocaleString()}
            </p>
            <p
              className={item.price_change_percentage_24h > 0 ? "green" : "red"}
            >
              {Math.floor(item.price_change_percentage_24h * 100) / 100}
            </p>
            <p className="market-cap">
              {currency.symbol} {item.market_cap.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
