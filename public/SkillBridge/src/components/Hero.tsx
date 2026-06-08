"use client";

import { ArrowRight, Sparkles, Map } from "lucide-react";

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-28">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] md:h-[600px] md:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-[80px] md:blur-[140px]" />
      <div className="absolute top-12 left-1/4 -z-10 h-[150px] w-[150px] rounded-full bg-violet-600/5 blur-[50px]" />

      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/5 px-3 py-1 text-xs md:text-sm font-medium text-purple-300 backdrop-blur-sm transition-all hover:bg-purple-500/10">
          <Sparkles className="h-3.5 w-3.5 text-purple-400" />
          <span>Discover Your Tech Future</span>
        </div>

        {/* Title */}
        <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Bridge the Gap Between
          <span className="block mt-2 bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
            Learning & Career Success
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-xl text-muted-foreground leading-relaxed">
          Explore technology careers, discover required skills, and follow structured roadmaps to achieve your goals.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => scrollToSection("explore-careers")}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 font-semibold text-white shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-0.5 hover:bg-purple-500 hover:shadow-purple-500/30 active:translate-y-0"
            id="hero-cta-explore"
          >
            Explore Careers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => scrollToSection("explore-careers")}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 font-semibold text-muted-foreground transition-all hover:-translate-y-0.5 hover:bg-card hover:text-white active:translate-y-0 backdrop-blur-sm"
            id="hero-cta-roadmaps"
          >
            <Map className="h-4 w-4 text-purple-400" />
            View Roadmaps
          </button>
        </div>
      </div>
    </section>
  );
}
