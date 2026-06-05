import React from "react";
import "./complete.css"; // ✅ FIX: removed unused `css` variable
import { IoMdSearch } from "react-icons/io";
import { FaStarHalf } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

function Product() {
  const eventpacks = [
    {
      img: "../image/b3.png",
      name: "Wedding Event Packs",
      desc: "Complete Wedding Pack",
      includes:
        "Wedding Decor, Wedding Catering, Wedding Photography, Wedding Event Planner and many more...",
    },
    {
      img: "../image/birthday.jpg",
      name: "Birthday Event Packs",
      desc: "Complete Birthday Pack",
      includes:
        "Birthday Decor, Birthday Catering, Birthday Photography, Birthday Event Planner and many more...",
    },
    {
      img: "../image/concert.jpg",
      name: "Concert Packs",
      desc: "Complete Concert Pack",
      includes:
        "Concert Decor, Concert Catering, Concert Photography, Concert Event Planner and many more...",
    },
    {
      img: "../image/b3.png",
      name: "Corporate Event Packs",
      desc: "Complete Corporate Event Pack",
      includes:
        "Corporate Event Decor, Corporate Event Photography, Corporate Event Planner and many more...",
    },
    {
      img: "../image/festival.jpeg",
      name: "Festival Event Packs",
      desc: "Complete Festival Pack",
      includes:
        "Festival Decor, Festival Catering, Festival Photography, Festival Event Planner and many more...",
    },
    {
      img: "../image/customized.jpg",
      name: "Customized Event Packs",
      desc: "Customize Your Pack",
      includes:
        "Build your own package according to your budget and preferences.",
    },
  ];

  return (
    <div className="products-page-container">

      {/* ===== BANNER SLIDER ===== */}
      <div className="banner">
        <div className="container">
          <div className="slider-container has-scrollbar">

            <div className="slider-item">
              <img src="../image/b1.jpg" alt="banner" className="banner-img" />
              <div className="banner-content">
                <p className="banner-subtitle">Trending Offers</p>
                <h2 className="banner-title">Wedding Season Sale</h2>
                <p className="banner-text">
                  <b>Extra 20% off</b> On <b>Complete Wedding Package</b>
                </p>
                <a href="#" className="banner-btn">Get Quote Now</a>
              </div>
            </div>
          ))}
        </Slider>

            <div className="slider-item">
              <img src="../image/b2.jpg" alt="banner" className="banner-img" />
              <div className="banner-content">
                <p className="banner-subtitle">Trending Offers</p>
                <h2 className="banner-title">Concerts</h2>
                <p className="banner-text">
                  Get extra <b>10% off</b> on <b>Concert Events</b>
                </p>
                <a href="#" className="banner-btn">Book Now</a>
              </div>
            </div>

            <div className="slider-item">
              <img src="../image/b3.png" alt="banner" className="banner-img" />
              <div className="banner-content">
                <p className="banner-subtitle">Organise your event in your Budget</p>
                <h2 className="banner-title">Customized Event Planner</h2>
                <p className="banner-text">
                  Customized event pack according to your budget
                </p>
                <a href="#" className="banner-btn">Contact Now</a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===== EVENT PACKS SECTION ===== */}
      <section className="events-section">
        <div className="section-header">
          <h2>Event Packs</h2>
          <p>Choose premium event packages crafted for every occasion</p>
        </div>

        <div className="horizontal-card-grid">
          {eventpacks.map((item, index) => (
            <div className="modern-event-card" key={index}>

              <div className="modern-event-image">
                <img src={item.img} alt={item.name} />
              </div>

              <div className="modern-event-content">
                <h3>{item.name}</h3>
                <p className="event-subtitle">{item.desc}</p>
                <p className="event-description">{item.includes}</p>

                <div className="event-card-footer">
                  <span className="price-text">Find best Price</span>
                  <button className="modern-btn">GET QUOTE NOW</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ===== SEARCH NEAR LOCATION SECTION ===== */}
      <section className="search-section">

        <div className="section-header">
          <h2>Search Near Your Location</h2>
          <p>Showing results for Bhopal</p>
        </div>

        <div className="modern-search-bar">
          <input type="text" placeholder="Enter your location..." />
          <button><IoMdSearch /></button>
        </div>

        <div className="horizontal-list">

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Evoke Event Management</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              </div>
              <p>E-3/114, Arera Colony, Bhopal, Madhya Pradesh</p>
            </div>
            <button className="modern-btn">Contact Now</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Soni Decorators</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p>Shop No.9-10, Bittan Market, Bhopal</p>
            </div>
            <button className="modern-btn">Contact Now</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Benchmark Events & Weddings</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              </div>
              <p>Shivaji Nagar, Bhopal, Madhya Pradesh</p>
            </div>
            <button className="modern-btn">Contact Now</button>
          </div>

        </div>
      </section>

      {/* ===== TOP RATED SECTION ===== */}
      <section className="top-rated-section">

        <div className="section-header">
          <h2>Top Rated Organisers & Their Packages</h2>
          <p>Best Event Packages of organisers in Bhopal</p>
        </div>

        <div className="horizontal-list">

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>The Wedding Rituals</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <p>Zone-II, Maharana Pratap Nagar, Bhopal</p>
            </div>
            <button className="modern-btn">Package Details</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>AMG EVENT & ENTERTAINMENT</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              </div>
              <p>Near Axis Bank, Zone-I, Bhopal</p>
            </div>
            <button className="modern-btn">Package Details</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Luxury Event Management</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              </div>
              <p>M.P Nagar, Bhopal, Madhya Pradesh</p>
            </div>
            <button className="modern-btn">Package Details</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Dream World Events</h3>
              <div className="rating-row">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              </div>
              <p>Maharana Pratap Nagar, Bhopal</p>
            </div>
            <button className="modern-btn">Package Details</button>
          </div>

        </div>
      </section>

    </div>
  );
}

export default Product;
