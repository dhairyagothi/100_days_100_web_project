import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import reactDom from 'react-dom';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import './style.css';

// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import v1 from './video/1.mp4';
import v2 from './video/2.mp4';
import v3 from './video/3.mp4';
import v4 from './video/4.mp4';
import v5 from './video/5.mp4';

export default function App() {
  
  return (
    <>
    
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <div className="swiper-content">
        <SwiperSlide ><video src={v1} autoPlay muted loop ></video>
        <div className="head">Wonderful Island</div>
        </SwiperSlide>
        <SwiperSlide><video src={v2} autoPlay muted loop></video><div className="head">Trecking</div></SwiperSlide>
        <SwiperSlide><video src={v3} autoPlay muted loop></video><div className="head">Adventure</div></SwiperSlide>
        <SwiperSlide><video src={v4} autoPlay muted loop></video><div className="head">Road Trip</div></SwiperSlide>
        <SwiperSlide><video src={v5} autoPlay muted loop></video><div className="head">SIte Seeing</div></SwiperSlide>
      </div>
      </Swiper>
      <body>
      <header className="header">
      <div className="navbar">
        <div className="logo">
          <h1>Travel</h1>
        </div>
        <div>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </header>
      </body>

      <content>
      <h1>Travel website</h1>
      <br/>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad itaque in ipsam rem tempore impedit qui quidem minus ut, officia nam pariatur sed? Dolorem architecto omnis totam quae? Eos, sapiente.
      </content>
    </>
  );
}
