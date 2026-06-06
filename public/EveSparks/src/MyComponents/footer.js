import React from "react";
<<<<<<< HEAD
import css from "./complete.css";
import { FaFacebook } from "react-icons/fa6";
=======
import "./complete.css";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
import { FiTwitter } from "react-icons/fi";

function Footer() {
<<<<<<< HEAD
  return (
    <>
      <footer>
        <div class="footer-category">
          <div class="container">
            <h2 class="footer-category-title">Categories</h2>

            <div class="footer-category-box">
              <h3 class="category-box-title"></h3>

              <a href="#" class="footer-category-link">
                Decoration
              </a>
              <a href="#" class="footer-category-link">
                Event type{" "}
              </a>
              <a href="#" class="footer-category-link">
                Catering Services
              </a>
              <a href="#" class="footer-category-link">
                Photography
              </a>
              <a href="#" class="footer-category-link">
                Videography
              </a>
              <a href="#" class="footer-category-link">
                Dj
              </a>
            </div>

            <div class="footer-category-box">
              <h3 class="category-box-title">Decoration</h3>

              <a href="#" class="footer-category-link">
                Balloon Decoration
              </a>
              <a href="#" class="footer-category-link">
                Flower Decoration
              </a>
              <a href="#" class="footer-category-link">
                Theme Decoration
              </a>
              <a href="#" class="footer-category-link">
                Stage Decoration
              </a>
              <a href="#" class="footer-category-link">
                Entrance Decoration
              </a>
            </div>

            <div class="footer-category-box">
              <h3 class="category-box-title">Catering services</h3>

              <a href="#" class="footer-category-link">
                North Indian
              </a>
              <a href="#" class="footer-category-link">
                South Indian
              </a>
              <a href="#" class="footer-category-link">
                Chinese
              </a>
              <a href="#" class="footer-category-link">
                Italian
              </a>
              <a href="#" class="footer-category-link">
                Mexican
              </a>
              <a href="#" class="footer-category-link">
                Continental
              </a>
            </div>

            <div class="footer-category-box">
              <h3 class="category-box-title">Event Type</h3>

              <a href="#" class="footer-category-link">
                Birthday Parties
              </a>
              <a href="#" class="footer-category-link">
                Wedding
              </a>
              <a href="#" class="footer-category-link">
                Corporate Events
              </a>
              <a href="#" class="footer-category-link">
                Baby Shower
              </a>
              <a href="#" class="footer-category-link">
                Anniversary
              </a>
              <a href="#" class="footer-category-link">
                Farewell
              </a>
            </div>
          </div>
        </div>

        <div class="footer-nav">
          <div class="container">
            <ul class="footer-nav-list">
              <li class="footer-nav-item">
                <h2 class="nav-title">Package</h2>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Complette event{" "}
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Decoration
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Catering
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Photography
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Videography
                </a>
              </li>
            </ul>

            <ul class="footer-nav-list">
              <li class="footer-nav-item">
                <h2 class="nav-title">Budget Planner</h2>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Low Budget
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Medium Budget
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  High Budget
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Custom Budget
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Get Quote{" "}
                </a>
              </li>
            </ul>

            <ul class="footer-nav-list">
              <li class="footer-nav-item">
                <h2 class="nav-title">Our Company</h2>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  locations
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Legal Notice
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Terms and conditions
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  About us
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Secure payment
                </a>
              </li>
            </ul>

            <ul class="footer-nav-list">
              <li class="footer-nav-item">
                <h2 class="nav-title">Services</h2>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Prices drop
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  New Services
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Best services
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Contact us
                </a>
              </li>

              <li class="footer-nav-item">
                <a href="#" class="footer-nav-link">
                  Sitemap
                </a>
              </li>
            </ul>

            <ul class="footer-nav-list">
              <li class="footer-nav-item">
                <h2 class="nav-title">Contact</h2>
              </li>

              <li class="footer-nav-item flex">
                <div class="icon-box">
                  <ion-icon name="location-outline"></ion-icon>
=======
  const categoryRows = [
    {
      title: "Popular Services",
      links: ["Decoration", "Event Type", "Catering Services", "Photography", "Videography", "DJ"]
    },
    {
      title: "Decoration",
      links: ["Balloon Decoration", "Flower Decoration", "Theme Decoration", "Stage Decoration", "Entrance Decoration"]
    },
    {
      title: "Catering Services",
      links: ["North Indian", "South Indian", "Chinese", "Italian", "Mexican", "Continental"]
    },
    {
      title: "Event Type",
      links: ["Birthday Parties", "Wedding", "Corporate Events", "Baby Shower", "Anniversary", "Farewell"]
    }
  ];

  const footerColumns = [
    {
      title: "Packages",
      links: ["Complete Event", "Decoration", "Catering", "Photography", "Videography"]
    },
    {
      title: "Budget Planner",
      links: ["Low Budget", "Medium Budget", "High Budget", "Custom Budget", "Get Quote"]
    },
    {
      title: "Company",
      links: ["Locations", "Legal Notice", "Terms and Conditions", "About Us", "Secure Payment"]
    },
    {
      title: "Services",
      links: ["Price Drops", "New Services", "Best Services", "Contact Us", "Sitemap"]
    }
  ];

  return (
    <footer className="evesparks-footer">
      <div className="footer-inner">
        <div className="footer-brand-panel">
          <div>
            <img src="../image/evesparks.png" alt="EveSparks" className="footer-logo" />
            <p>
              Event planning made simpler for weddings, birthdays, corporate functions,
              concerts and every celebration in between.
            </p>
          </div>

          <div className="footer-contact-card">
            <span>Need help planning?</span>
            <a href="tel:+919424065768">+91 94240 65768</a>
            <a href="mailto:evesparks@gmail.com">evesparks@gmail.com</a>
          </div>
        </div>

        <div className="footer-category">
          <h2 className="footer-category-title">Categories</h2>

          <div className="footer-category-grid">
            {categoryRows.map((row) => (
              <div className="footer-category-box" key={row.title}>
                <h3 className="category-box-title">{row.title}</h3>
                <div className="footer-link-wrap">
                  {row.links.map((link) => (
                    <a href="#services" className="footer-category-link" key={link}>
                      {link}
                    </a>
                  ))}
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
                </div>
              </div>
            ))}
          </div>
        </div>

<<<<<<< HEAD
                <address class="content">
                  EVESPARKS Office <br />
                  123, XYZ Road, <br />
                  Bhopal, Madhya Pradesh, <br />
                </address>
              </li>

              <li class="footer-nav-item flex">
                <div class="icon-box">
                  <ion-icon name="call-outline"></ion-icon>
=======
        <div className="footer-nav">
          <div className="footer-nav-grid">
            {footerColumns.map((column) => (
              <ul className="footer-nav-list" key={column.title}>
                <li className="footer-nav-item">
                  <h2 className="nav-title">{column.title}</h2>
                </li>
                {column.links.map((link) => (
                  <li className="footer-nav-item" key={link}>
                    <a href="#services" className="footer-nav-link">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ))}

            <ul className="footer-nav-list footer-follow-list">
              <li className="footer-nav-item">
                <h2 className="nav-title">Follow Us</h2>
              </li>
              <li className="footer-nav-item">
                <div className="footer-social-row">
                  <a href="#social" aria-label="Facebook"><FaFacebook /></a>
                  <a href="#social" aria-label="Twitter"><FiTwitter /></a>
                  <a href="#social" aria-label="LinkedIn"><FaLinkedin /></a>
                  <a href="#social" aria-label="Instagram"><FaInstagram /></a>
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
                </div>
              </li>
            </ul>
          </div>
        </div>

<<<<<<< HEAD
                <a href="tel:+919424065768" class="footer-nav-link">
                  +919424065768
                </a>
              </li>

              <li class="footer-nav-item flex">
                <div class="icon-box">
                  <ion-icon name="mail-outline"></ion-icon>
                </div>

                <a href="mailto:example@gmail.com" class="footer-nav-link">
                  evesparks@gmail.com
                </a>
              </li>
            </ul>

            <ul class="footer-nav-list">
              <li class="footer-nav-item">
                <h2 class="nav-title">Follow Us</h2>
              </li>

              <li>
                <ul class="social-link">
                  <li class="footer-nav-item">
                    <a href="#" class="footer-nav-link">
                      <ion-icon name="logo-facebook"></ion-icon>
                    </a>
                  </li>

                  <li class="footer-nav-item">
                    <a href="#" class="footer-nav-link">
                      <ion-icon name="logo-twitter"></ion-icon>
                    </a>
                  </li>

                  <li class="footer-nav-item">
                    <a href="#" class="footer-nav-link">
                      <ion-icon name="logo-linkedin"></ion-icon>
                    </a>
                  </li>

                  <li class="footer-nav-item">
                    <a href="#" class="footer-nav-link">
                      <ion-icon name="logo-instagram"></ion-icon>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="container">
            <img
              src="../image/payment.png"
              alt="payment method"
              class="payment-img"
            />

            <p class="copyright">
              Copyright &copy; <a href="#">EVESPARKS</a> all rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
=======
        <div className="footer-bottom">
          <p className="copyright">
            Copyright &copy; <a href="#home">EveSparks</a>. All rights reserved.
          </p>
          <img src="../image/payment.png" alt="Accepted payment methods" className="payment-img" />
        </div>
      </div>
    </footer>
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
  );
}

export default Footer;
