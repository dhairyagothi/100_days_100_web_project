import React, { useContext, useState } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import arrow_icon from "../../assets/arrow_icon.png";
import { CoinContext } from "../../context/CoinContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "usd":
        setCurrency({
          name: "usd",
          symbol: "$",
        });
        break;
      case "eur":
        setCurrency({
          name: "eur",
          symbol: "€",
        });
        break;
      case "inr":
        setCurrency({
          name: "inr",
          symbol: "₹",
        });
        break;
      default:
        setCurrency({
          name: "usd",
          symbol: "$",
        });
    }
    
    // Close the menu after selecting an option
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={logo} alt="" className="logo" />
      </Link>

      <ul className={`menu ${menuOpen ? "open" : ""}`}>
        <li onClick={closeMenu}><Link to="/">Home</Link></li>
        <li onClick={closeMenu}><Link to="/news">Blog</Link></li>
        <li onClick={closeMenu}><Link to="/converter">Converter</Link></li>
      </ul>

      <div className="nav-right">
        <select name="" id="" onChange={currencyHandler}>
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="inr">INR</option>
        </select>
        <button onClick={toggleMenu}>
          Menu <img src={arrow_icon} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
