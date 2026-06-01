import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './style.css';

// Import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import v1 from './video/1.mp4';
import v2 from './video/2.mp4';
import v3 from './video/3.mp4';
import v4 from './video/4.mp4';
import v5 from './video/5.mp4';

export default function App() {
  return (
    <>
      {/* "Back to Home" Button Container */}
      <div className="home-btn-container">
        <a href="/" className="back-home-btn">
          Back to Home
        </a>
      </div>

      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <h1>Travel</h1>
          </div>
          <ul className="nav-links">
            <li><a href="#" className="nav-item">Home</a></li>
            <li><a href="#" className="nav-item">About</a></li>
            <li><a href="#" className="nav-item">Services</a></li>
            <li><a href="#" className="nav-item">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="main-wrapper">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Autoplay, Pagination, Navigation]}
          className="mySwiper"
        >
          {/* Slides must be direct descendants of Swiper to allow active transition parsing */}
          <SwiperSlide>
            <video src={v1} autoPlay muted loop playsInline></video>
            <div className="dark-overlay"></div>
            <div className="head">Wonderful Island</div>
          </SwiperSlide>
          <SwiperSlide>
            <video src={v2} autoPlay muted loop playsInline></video>
            <div className="dark-overlay"></div>
            <div className="head">Trekking</div>
          </SwiperSlide>
          <SwiperSlide>
            <video src={v3} autoPlay muted loop playsInline></video>
            <div className="dark-overlay"></div>
            <div className="head">Adventure</div>
          </SwiperSlide>
          <SwiperSlide>
            <video src={v4} autoPlay muted loop playsInline></video>
            <div className="dark-overlay"></div>
            <div className="head">Road Trip</div>
          </SwiperSlide>
          <SwiperSlide>
            <video src={v5} autoPlay muted loop playsInline></video>
            <div className="dark-overlay"></div>
            <div className="head">Site Seeing</div>
          </SwiperSlide>
        </Swiper>
      </main>

      <section className="content-section">
        <h2>Travel Website Exploration</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad itaque in ipsam rem tempore impedit qui quidem minus ut, officia nam pariatur sed? Dolorem architecto omnis totam quae? Eos, sapiente.
        </p>
      </section>
    </>
  );
}
