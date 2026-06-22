import React, { useState } from "react";
import "./complete.css";
import { FaFacebook } from "react-icons/fa6";
import { FiTwitter } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaRegHeart } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdSearch } from "react-icons/io";
import { CgMenuBoxed } from "react-icons/cg";
import { BsChatLeftDots } from "react-icons/bs";

function Header({ toggleTheme, theme }) {
  // ✅ FIX: Mobile menu toggle state (was missing — menu never opened)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header>

        {/* ===== HEADER TOP ===== */}
        <div className="header-top">
          <div className="container">

            <ul className="header-social-container">
              <li><a href="#" className="social-link"><FaFacebook /></a></li>
              <li><a href="#" className="social-link"><FiTwitter /></a></li>
              <li><a href="#" className="social-link"><FaInstagram /></a></li>
              <li><a href="#" className="social-link"><FaLinkedin /></a></li>
            </ul>

            <div className="header-alert-news">
              <p>
                <b>Organise your Event with us</b><br />
                Book your first event with us and get extra discount
              </p>
            </div>

            <div className="header-top-actions">
              <select name="language">
                <option value="en-US">English</option>
                <option value="es-ES">Hindi</option>
              </select>
            </div>

          </div>
        </div>

        {/* ===== HEADER MAIN ===== */}
        <div className="header-main">
          <div className="container">

            <a href="#" className="header-logo">
              <img src="../image/evesparks.png" alt="evesparks's logo" width="100" height="50" />
            </a>

            <div className="header-search-container">
              {/* ✅ FIX: class → className, search-input matches CSS */}
              <input type="text" className="search-field" placeholder="Search for services..." />
              <button className="search-btn">
                <IoMdSearch />
              </button>
            </div>

            <div className="header-user-actions">

              {/* Theme toggle */}
              <button className="action-btn theme-toggle-btn" onClick={toggleTheme}>
                {theme === "light" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .28 0 .57.02.85A7 7 0 0 0 20.15 12c.28 0 .57 0 .85-.01z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                )}
              </button>

              <button className="action-btn"><IoPersonCircle /></button>
              <button className="action-btn"><FaRegHeart /><span className="count">5</span></button>
              <button className="action-btn"><FiShoppingCart /><span className="count">0</span></button>

            </div>
          </div>
        </div>

        {/* ===== DESKTOP NAV ===== */}
        <nav className="desktop-navigation-menu">
          <div className="container">
            <ul className="desktop-menu-category-list">

              <li className="menu-category">
                <a href="#" className="menu-title">Home</a>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Categories</a>
                <div className="dropdown-panel">
                  <ul className="dropdown-panel-list">
                    <li className="menu-title"><a href="#">Decoration</a></li>
                    <li className="panel-list-item"><a href="#">Balloon Decoration</a></li>
                    <li className="panel-list-item"><a href="#">Flowers Decoration</a></li>
                    <li className="panel-list-item"><a href="#">Light Decoration</a></li>
                    <li className="panel-list-item"><a href="#">Complete Package</a></li>
                    <li className="panel-list-item"><a href="#">Others...</a></li>
                  </ul>
                  <ul className="dropdown-panel-list">
                    <li className="menu-title"><a href="#">Event</a></li>
                    <li className="panel-list-item"><a href="#">Wedding</a></li>
                    <li className="panel-list-item"><a href="#">Parties</a></li>
                    <li className="panel-list-item"><a href="#">Concerts</a></li>
                    <li className="panel-list-item"><a href="#">Official Events</a></li>
                    <li className="panel-list-item"><a href="#">Other</a></li>
                  </ul>
                  <ul className="dropdown-panel-list">
                    <li className="menu-title"><a href="#">Catering Services</a></li>
                    <li className="panel-list-item"><a href="#">North Indian</a></li>
                    <li className="panel-list-item"><a href="#">South Indian</a></li>
                    <li className="panel-list-item"><a href="#">Gujarati</a></li>
                    <li className="panel-list-item"><a href="#">Other</a></li>
                  </ul>
                </div>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Corporate Events</a>
                <ul className="dropdown-list">
                  <li className="dropdown-item"><a href="#">Seminars</a></li>
                  <li className="dropdown-item"><a href="#">Conferences</a></li>
                  <li className="dropdown-item"><a href="#">Other</a></li>
                </ul>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Social Events</a>
                <ul className="dropdown-list">
                  <li className="dropdown-item"><a href="#">Birthday Parties</a></li>
                  <li className="dropdown-item"><a href="#">Concert</a></li>
                  <li className="dropdown-item"><a href="#">Weddings</a></li>
                  <li className="dropdown-item"><a href="#">Other</a></li>
                </ul>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Complete Package</a>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Budget Planner</a>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Other Services</a>
              </li>

              <li className="menu-category">
                <a href="#" className="menu-title">Hot Offers</a>
              </li>

            </ul>
          </div>
        </nav>

        {/* ===== MOBILE BOTTOM NAV ===== */}
        <div className="mobile-bottom-navigation">
          {/* ✅ FIX: onClick connected to toggle state */}
          <button className="action-btn" onClick={() => setMobileMenuOpen(true)}>
            <GiHamburgerMenu />
          </button>
          <button className="action-btn"><IoPersonCircle /></button>
          <button className="action-btn"><FaRegHeart /><span className="count">5</span></button>
          <button className="action-btn"><FiShoppingCart /><span className="count">0</span></button>
          <button className="action-btn"><CgMenuBoxed /></button>
          <button className="action-btn"><BsChatLeftDots /><span className="count">1</span></button>
        </div>

        {/* ===== MOBILE SLIDE MENU ===== */}
        {/* ✅ FIX: active class is now conditionally applied via state */}
        <nav className={`mobile-navigation-menu has-scrollbar${mobileMenuOpen ? " active" : ""}`}>

          <div className="menu-top">
            <h2 className="menu-title">Menu</h2>
            <button className="menu-close-btn" onClick={() => setMobileMenuOpen(false)}>
              ✕
            </button>
          </div>

          <ul className="mobile-menu-category-list">
            <li className="menu-category"><a href="#" className="menu-title">Home</a></li>
            <li className="menu-category"><a href="#" className="menu-title">Categories</a></li>
            <li className="menu-category"><a href="#" className="menu-title">Corporate Events</a></li>
            <li className="menu-category"><a href="#" className="menu-title">Social Events</a></li>
            <li className="menu-category"><a href="#" className="menu-title">Complete Package</a></li>
            <li className="menu-category"><a href="#" className="menu-title">Budget Planner</a></li>
            <li className="menu-category"><a href="#" className="menu-title">Hot Offers</a></li>
          </ul>

          <div className="menu-bottom">
            <ul className="menu-social-container">
              <li><a href="#" className="social-link"><FaFacebook /></a></li>
              <li><a href="#" className="social-link"><FiTwitter /></a></li>
              <li><a href="#" className="social-link"><FaInstagram /></a></li>
              <li><a href="#" className="social-link"><FaLinkedin /></a></li>
            </ul>
          </div>

        </nav>

        {/* ✅ FIX: Overlay to close mobile menu when clicking outside */}
        {mobileMenuOpen && (
          <div className="overlay active" onClick={() => setMobileMenuOpen(false)}></div>
        )}

      </header>
    </>
  );
}

export default Header;
