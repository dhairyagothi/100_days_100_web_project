"use client";
import React from "react";
import { Link } from "react-scroll/modules";
import { HiArrowDown } from "react-icons/hi";

const HeroSection = () => {
  return (
    <section id="home">
      {/* Hero Container */}
      <div className="flex flex-col text-center items-center justify-center bg-gradient-catppuccin text-mocha-text min-h-screen relative">
        {/* Image */}
        <div className="pt-40 pl-0">
          <img
            src={
              "https://image.freepik.com/free-vector/purple-genie-bring-magic-food_10045-207.jpg"
            }
            alt="Magical Recipe Genie"
            width={500}
            height={500}
            className="object-cover rounded-full border-4 border-mocha-overlay1 shadow-lg justify-item-left"
          />
        </div>

        {/* Text Content */}
        <div className="mt-90 px-6 md:px-20 text-center">
          <h1 className="font-extrabold text-5xl md:text-6xl text-mocha-lavender mb-4">
            Welcome!! To The Recipe-Genie
          </h1>
          <p className="text-lg md:text-2xl text-mocha-overlay1 font-light">
            At Recipe Genie, we believe cooking should be simple, enjoyable, and
            tailored to your needs. Whether you're a seasoned chef or a curious
            beginner, Recipe Genie is here to transform your ingredients into
            delightful dishes.
          </p>
          <div className="mt-20">
            <Link
              to="recipes"
              className="text-neutral-100 font-semibold px-6 py-3 rounded shadow hover:bg-rose-300"
              activeClass="active"
              spy={true}
              smooth={true}
              offset={-100}
              duration={500}
            >
              Recipes
            </Link>
          </div>
        </div>

        {/* Downward Arrow */}
        <div className="absolute bottom-10 flex justify-center items-center">
          <Link
            to="about"
            activeClass="active"
            spy={true}
            smooth={true}
            offset={-100}
            duration={500}
          >
            <HiArrowDown
              size={45}
              className="animate-bounce text-mocha-lavender hover:text-mocha-peach transition-colors duration-300"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
