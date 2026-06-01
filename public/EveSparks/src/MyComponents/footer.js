import React from "react";
import "./complete.css";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiTwitter } from "react-icons/fi";

function Footer() {
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
                </div>
              </div>
            ))}
          </div>
        </div>

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
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            Copyright &copy; <a href="#home">EveSparks</a>. All rights reserved.
          </p>
          <img src="../image/payment.png" alt="Accepted payment methods" className="payment-img" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
