import React from "react";
import "./complete.css";
import { IoMdSearch } from "react-icons/io";
import { FaStarHalf } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Product() {
  const settings = {
<<<<<<< HEAD
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 800,
    pauseOnHover: true,
    arrows: false,
    fade: true,
  };
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
      <div>
        <div class="banner">
          <div class="container">
            <Slider {...settings}>
              <div class="slider-item">
                <img src="../image/b1.jpg" alt="banner" class="banner-img" />

                <div class="banner-content">
                  <p class="banner-subtitle">Trending Offers</p>

                  <h2 class="banner-title">Wedding Season sale</h2>

                  <p class="banner-text">
                    <b>Extra 20% off </b> On <b>complete Wedding package</b>
                  </p>

                  <a href="#" class="banner-btn">
                    Get Quote now
                  </a>
=======
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 6500,
  speed: 900,
  pauseOnHover: true,
  arrows: false,
  fade: true
};
  const heroSlides = [
    {
      video: "../image/wedding-evesparks.mp4",
      poster: "../image/b1.jpg",
      eyebrow: "Wedding stories",
      title: "Your once-in-a-lifetime day, planned beautifully",
      text:
        "From mandap styling and guest flow to catering, photography and final send-off, EveSparks brings every wedding detail into one calm plan.",
      primary: "Plan My Wedding",
      secondary: "See Packages",
      meta: ["Decor", "Catering", "Photography"]
    },
    {
      video: "../image/birthday-evesparks.mp4",
      poster: "../image/birthday.jpg",
      eyebrow: "Birthday moments",
      title: "Turn a birthday into a scene they remember",
      text:
        "Theme decor, cake table styling, food, games and photo corners arranged around your budget, age group and celebration style.",
      primary: "Design Birthday",
      secondary: "Browse Ideas",
      meta: ["Themes", "Cake Table", "Family Events"]
    },
    {
      video: "../image/concert-evesparks.mp4",
      poster: "../image/concert.jpg",
      eyebrow: "Concert nights",
      title: "Stage the energy before the first beat drops",
      text:
        "Book production-ready teams for sound, lights, artist flow, entry management and crowd-ready event operations.",
      primary: "Book Concert Team",
      secondary: "View Vendors",
      meta: ["Stage", "Lighting", "Sound"]
    }
  ];
  const eventpacks = [
  {
    img: "../image/b3.png",
    name: "Wedding Signature",
    desc: "Decor, catering, photography and planning",
    tag: "Most booked",
    price: "From Rs. 79k",
    includes:
      "A complete wedding experience with venue styling, hospitality support, photo coverage, timeline planning and vendor coordination."
  },

  {
    img: "../image/birthday.jpg",
    name: "Birthday Spark",
    desc: "Theme decor, cake table, food and moments",
    tag: "Family favorite",
    price: "From Rs. 18k",
    includes:
      "Bright theme setups for kids, teens and milestone birthdays with decoration, catering options and photo-friendly corners."
  },

  {
    img: "../image/concert.jpg",
    name: "Concert Nights",
    desc: "Stage, lighting, artist flow and crowd support",
    tag: "Live ready",
    price: "From Rs. 1.2L",
    includes:
      "Production-ready planning for performances, college fests and private shows with stage design, sound, lighting and operations."
  },

  {
    img: "../image/corporate.jpg",
    name: "Corporate Suite",
    desc: "Meetings, launches, seminars and brand events",
    tag: "Business",
    price: "From Rs. 45k",
    includes:
      "Professional event support for conferences, launches and team gatherings with branding, AV, guest flow and documentation."
  },

  {
    img: "../image/festival.jpeg",
    name: "Festival Glow",
    desc: "Community, cultural and seasonal celebrations",
    tag: "Cultural",
    price: "From Rs. 35k",
    includes:
      "Festive decor, local vendor coordination, food counters, performance planning and venue readiness for large gatherings."
  },

  {
    img: "../image/customized.jpg",
    name: "Build Your Own",
    desc: "Pick services around your budget and taste",
    tag: "Flexible",
    price: "Custom quote",
    includes:
      "Create a package from decor, catering, photography, music, planning and guest services without paying for extras you do not need."
  }
];
  const featuredVendors = [
    {
      name: "Evoke Event Management",
      area: "E-3/114, Arera Colony, Bhopal",
      action: "Contact Now",
      rating: 4.5
    },
    {
      name: "Soni Decorators",
      area: "Shop No.9-10, Bittan Market, Bhopal",
      action: "Contact Now",
      rating: 4
    },
    {
      name: "Benchmark Events & Weddings",
      area: "Shivaji Nagar, Bhopal",
      action: "Contact Now",
      rating: 4.5
    }
  ];

  const topRated = [
    {
      name: "The Wedding Rituals",
      area: "Zone-II, Maharana Pratap Nagar, Bhopal",
      action: "Package Details",
      rating: 5
    },
    {
      name: "AMG Event & Entertainment",
      area: "Near Axis Bank, Zone-I, Bhopal",
      action: "Package Details",
      rating: 4.5
    },
    {
      name: "Luxury Event Management",
      area: "M.P Nagar, Bhopal",
      action: "Package Details",
      rating: 4.5
    },
    {
      name: "Dream World Events",
      area: "Maharana Pratap Nagar, Bhopal",
      action: "Package Details",
      rating: 4.5
    }
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <>
        {Array.from({ length: fullStars }).map((_, index) => (
          <FaStar key={`full-${index}`} />
        ))}
        {hasHalfStar && <FaStarHalf />}
      </>
    );
  };

  return (
    <div className="products-page-container">
      <section className="landing-hero">
        <Slider {...settings}>
          {heroSlides.map((slide) => (
            <div className="slider-item video-hero-slide" key={slide.title}>
              <video
                className="banner-video"
                src={slide.video}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />

              <div className="banner-content">
                <p className="banner-subtitle">{slide.eyebrow}</p>
                <h1 className="banner-title">{slide.title}</h1>
                <p className="banner-text">{slide.text}</p>

                <div className="hero-actions">
                  <button type="button" className="banner-btn">{slide.primary}</button>
                  <button type="button" className="ghost-btn">{slide.secondary}</button>
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
                </div>
              </div>

<<<<<<< HEAD
              <div class="slider-item">
                <img src="../image/b2.jpg" alt="banner" class="banner-img" />

                <div class="banner-content">
                  <p class="banner-subtitle">Trending Offers</p>

                  <h2 class="banner-title">Concerts</h2>

                  <p class="banner-text">
                    Get extra <b>10% off</b>on <b>Concerts Event</b>
                  </p>

                  <a href="#" class="banner-btn">
                    Book now
                  </a>
                </div>
              </div>

              <div class="slider-item">
                <img src="../image/b3.png" alt="banner" class="banner-img" />

                <div class="banner-content">
                  <p class="banner-subtitle">
                    Organise your event in your Budget
                  </p>

                  <h2 class="banner-title">Customized Event Planner</h2>

                  <p class="banner-text">
                    Customized event pack according to your budget
                  </p>

                  <a href="#" class="banner-btn">
                    Contact now
                  </a>
                </div>
              </div>
            </Slider>
          </div>
        </div>
      </div>

      {/* <!--
      - PRODUCT
    --> */}

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
      <section className="search-section">
        <div className="section-header">
          <h2>Search Near Your Location</h2>
          <p>Showing results for Bhopal</p>
        </div>

        <div className="modern-search-bar">
          <input type="text" placeholder="Enter your location..." />

          <button>
            <IoMdSearch />
          </button>
        </div>

        <div className="horizontal-list">
          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Evoke Event Management</h3>

              <div className="rating-row">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <p>E-3/114, Arera Colony, Bhopal, Madhya Pradesh</p>
            </div>

            <button className="modern-btn">Contact Now</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Soni Decorators</h3>

              <div className="rating-row">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <p>Shop No.9-10, Bittan Market, Bhopal</p>
            </div>

            <button className="modern-btn">Contact Now</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Benchmark Events & Weddings</h3>

              <div className="rating-row">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <p>Shivaji Nagar, Bhopal, Madhya Pradesh</p>
            </div>

            <button className="modern-btn">Contact Now</button>
          </div>
        </div>
      </section>
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
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>

              <p>Zone-II, Maharana Pratap Nagar, Bhopal</p>
            </div>

            <button className="modern-btn">Package Details</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>AMG EVENT & ENTERTAINMENT</h3>

              <div className="rating-row">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <p>Near Axis Bank, Zone-I, Bhopal</p>
            </div>

            <button className="modern-btn">Package Details</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Luxury Event Management</h3>

              <div className="rating-row">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <p>M.P Nagar, Bhopal, Madhya Pradesh</p>
            </div>

            <button className="modern-btn">Package Details</button>
          </div>

          <div className="horizontal-info-card">
            <div className="info-content">
              <h3>Dream World Events</h3>

              <div className="rating-row">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>

              <p>Maharana Pratap Nagar, Bhopal</p>
            </div>

            <button className="modern-btn">Package Details</button>
          </div>
        </div>
      </section>
    </div>
  );
=======
                <div className="hero-metadata" aria-label={`${slide.eyebrow} services`}>
                  {slide.meta.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Slider>

        <div className="hero-panel">
          <div>
            <span>250+</span>
            <p>vendors listed</p>
          </div>
          <div>
            <span>4.8/5</span>
            <p>average rating</p>
          </div>
          <div>
            <span>24 hr</span>
            <p>quote support</p>
          </div>
        </div>
      </section>

      <section className="event-types-strip" aria-label="Popular event types">
        <span>Wedding</span>
        <span>Birthday</span>
        <span>Corporate</span>
        <span>Concert</span>
        <span>Festival</span>
        <span>Custom</span>
      </section>

      <section className="events-section">
        <div className="section-header">
          <span className="section-kicker">Curated packages</span>
          <h2>Choose a package, then make it yours</h2>
          <p>Clean bundles with transparent starting points, flexible add-ons and vendors matched to your event type.</p>
        </div>

        <div className="horizontal-card-grid">
          {eventpacks.map((item, index) => (
            <article className="modern-event-card" key={index}>
              <div className="modern-event-image">
                <img src={item.img} alt={item.name} />
                <span className="card-badge">{item.tag}</span>
              </div>

              <div className="modern-event-content">
                <div className="card-title-row">
                  <h3>{item.name}</h3>
                  <span className="package-price">{item.price}</span>
                </div>

                <p className="event-subtitle">{item.desc}</p>
                <p className="event-description">{item.includes}</p>

                <div className="event-card-footer">
                  <span className="price-text">Free consultation</span>
                  <button type="button" className="modern-btn">Get Quote</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="planning-steps">
        <div className="section-header compact">
          <span className="section-kicker">How it works</span>
          <h2>From idea to event day in three steps</h2>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Share your brief</h3>
            <p>Tell us the event type, date, guest count and budget.</p>
          </div>
          <div className="step-card">
            <span>02</span>
            <h3>Compare options</h3>
            <p>Review matched packages, vendors and add-ons in one place.</p>
          </div>
          <div className="step-card">
            <span>03</span>
            <h3>Confirm and celebrate</h3>
            <p>Lock your team and track the details until event day.</p>
          </div>
        </div>
      </section>
<section className="search-section">

  <div className="section-header">
    <span className="section-kicker">Local partners</span>
    <h2>Search near your location</h2>
    <p>Showing trusted results for Bhopal</p>
  </div>

  <div className="modern-search-bar">
    <input
      type="text"
      placeholder="Enter your location..."
    />

    <button type="button">
      <IoMdSearch />
    </button>
  </div>

  <div className="horizontal-list">
    {featuredVendors.map((vendor) => (
      <article className="horizontal-info-card" key={vendor.name}>
        <div className="info-content">
          <span className="vendor-label">Verified organiser</span>
          <h3>{vendor.name}</h3>
          <div className="rating-row">{renderStars(vendor.rating)}</div>
          <p>{vendor.area}</p>
        </div>
        <button type="button" className="modern-btn">{vendor.action}</button>
      </article>
    ))}

  </div>

</section>
<section className="top-rated-section">

  <div className="section-header">
    <span className="section-kicker">Top rated</span>
    <h2>Organisers with packages worth comparing</h2>
    <p>Highly rated teams around Bhopal for premium celebrations and practical budgets.</p>
  </div>

  <div className="horizontal-list">
    {topRated.map((vendor) => (
      <article className="horizontal-info-card" key={vendor.name}>
        <div className="info-content">
          <span className="vendor-label">Popular package</span>
          <h3>{vendor.name}</h3>
          <div className="rating-row">{renderStars(vendor.rating)}</div>
          <p>{vendor.area}</p>
        </div>
        <button type="button" className="modern-btn">{vendor.action}</button>
      </article>
    ))}

  </div>

</section>


        </div>
    );
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
}

export default Product;
