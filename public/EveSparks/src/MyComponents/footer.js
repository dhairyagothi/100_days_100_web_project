import React from "react";
import "./complete.css"; // ✅ FIX: removed unused `css` variable
import { FaFacebook } from "react-icons/fa6";
import { FiTwitter } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

function Footer() {
  return (
    <>
      <footer>

        {/* ===== FOOTER CATEGORIES ===== */}
        <div className="footer-category">
          <div className="container">

            <h2 className="footer-category-title">Categories</h2>

            <div className="footer-category-box">
              <h3 className="category-box-title"></h3>
              <a href="#" className="footer-category-link">Decoration</a>
              <a href="#" className="footer-category-link">Event Type</a>
              <a href="#" className="footer-category-link">Catering Services</a>
              <a href="#" className="footer-category-link">Photography</a>
              <a href="#" className="footer-category-link">Videography</a>
              <a href="#" className="footer-category-link">Dj</a>
            </div>

            <div className="footer-category-box">
              <h3 className="category-box-title">Decoration</h3>
              <a href="#" className="footer-category-link">Balloon Decoration</a>
              <a href="#" className="footer-category-link">Flower Decoration</a>
              <a href="#" className="footer-category-link">Theme Decoration</a>
              <a href="#" className="footer-category-link">Stage Decoration</a>
              <a href="#" className="footer-category-link">Entrance Decoration</a>
            </div>

            <div className="footer-category-box">
              <h3 className="category-box-title">Catering Services</h3>
              <a href="#" className="footer-category-link">North Indian</a>
              <a href="#" className="footer-category-link">South Indian</a>
              <a href="#" className="footer-category-link">Chinese</a>
              <a href="#" className="footer-category-link">Italian</a>
              <a href="#" className="footer-category-link">Mexican</a>
              <a href="#" className="footer-category-link">Continental</a>
            </div>

            <div className="footer-category-box">
              <h3 className="category-box-title">Event Type</h3>
              <a href="#" className="footer-category-link">Birthday Parties</a>
              <a href="#" className="footer-category-link">Wedding</a>
              <a href="#" className="footer-category-link">Corporate Events</a>
              <a href="#" className="footer-category-link">Baby Shower</a>
              <a href="#" className="footer-category-link">Anniversary</a>
              <a href="#" className="footer-category-link">Farewell</a>
            </div>

          </div>
        </div>

        {/* ===== FOOTER NAV ===== */}
        <div className="footer-nav">
          <div className="container">

            <ul className="footer-nav-list">
              <li className="footer-nav-item"><h2 className="nav-title">Package</h2></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Complete Event</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Decoration</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Catering</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Photography</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Videography</a></li>
            </ul>

            <ul className="footer-nav-list">
              <li className="footer-nav-item"><h2 className="nav-title">Budget Planner</h2></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Low Budget</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Medium Budget</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">High Budget</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Custom Budget</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Get Quote</a></li>
            </ul>

            <ul className="footer-nav-list">
              <li className="footer-nav-item"><h2 className="nav-title">Our Company</h2></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Locations</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Legal Notice</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Terms and Conditions</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">About Us</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Secure Payment</a></li>
            </ul>

            <ul className="footer-nav-list">
              <li className="footer-nav-item"><h2 className="nav-title">Services</h2></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Prices Drop</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">New Services</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Best Services</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Contact Us</a></li>
              <li className="footer-nav-item"><a href="#" className="footer-nav-link">Sitemap</a></li>
            </ul>

            <ul className="footer-nav-list">
              <li className="footer-nav-item"><h2 className="nav-title">Contact</h2></li>

              <li className="footer-nav-item flex">
                <div className="icon-box">
                  <ion-icon name="location-outline"></ion-icon>
                </div>
                <address className="content">
                  EVESPARKS Office<br />
                  123, XYZ Road,<br />
                  Bhopal, Madhya Pradesh
                </address>
              </li>

              <li className="footer-nav-item flex">
                <div className="icon-box">
                  <ion-icon name="call-outline"></ion-icon>
                </div>
                <a href="tel:+919424065768" className="footer-nav-link">+91 94240 65768</a>
              </li>

              <li className="footer-nav-item flex">
                <div className="icon-box">
                  <ion-icon name="mail-outline"></ion-icon>
                </div>
                <a href="mailto:evesparks@gmail.com" className="footer-nav-link">evesparks@gmail.com</a>
              </li>
            </ul>

            <ul className="footer-nav-list">
              <li className="footer-nav-item"><h2 className="nav-title">Follow Us</h2></li>
              <li>
                {/* ✅ FIX: social-link is a ul here — changed inner items to use anchor properly */}
                <ul className="social-link">
                  <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link"><ion-icon name="logo-facebook"></ion-icon></a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link"><ion-icon name="logo-twitter"></ion-icon></a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link"><ion-icon name="logo-linkedin"></ion-icon></a>
                  </li>
                  <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link"><ion-icon name="logo-instagram"></ion-icon></a>
                  </li>
                </ul>
              </li>
            </ul>

          </div>
        </div>

        {/* ===== FOOTER BOTTOM ===== */}
        <div className="footer-bottom">
          <div className="container">
            <img src="../image/payment.png" alt="payment method" className="payment-img" />
            <p className="copyright">
              Copyright &copy; <a href="#">EVESPARKS</a> all rights reserved.
            </p>
          </div>
        </div>

      </footer>
    </>
  );
}

export default Footer;
