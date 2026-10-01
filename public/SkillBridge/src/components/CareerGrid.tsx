"use client";

import { useState } from "react";
import { Career } from "@/types/career";
import { careersData } from "@/data/careers";
import CareerCard from "./CareerCard";
import { Search, SlidersHorizontal, EyeOff } from "lucide-react";

export default function CareerGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");

  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const filteredCareers = careersData.filter((career) => {
    const matchesSearch =
      career.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      career.skills.some((skill) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDifficulty =
      selectedDifficulty === "All" || career.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  return (
    <section id="explore-careers" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-border/50">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl" id="careers-title">
            Explore Career Tracks
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Choose a tech career path below to check the required skills, projected salary metrics, and step-by-step learning roadmaps.
          </p>
        </div>

        {/* Filter Controls (Difficulty pills) */}
        <div className="flex flex-wrap items-center gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`rounded-xl px-4 py-2 text-xs md:text-sm font-semibold transition-all duration-300 border ${
                selectedDifficulty === diff
                  ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/20"
                  : "bg-card/40 border-border text-muted-foreground hover:bg-card hover:text-white"
              }`}
              id={`filter-${diff.toLowerCase()}`}
            >
              {diff} {diff !== "All" && "Difficulty"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search career title or skill (e.g. React)..."
            className="block w-full rounded-xl border border-border bg-card/20 py-2.5 pl-10 pr-4 text-sm text-white placeholder-muted-foreground outline-none transition-all duration-300 focus:border-purple-500/50 focus:bg-card/40 focus:ring-1 focus:ring-purple-500/50"
            id="search-input"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4 text-purple-400" />
          <span>Showing {filteredCareers.length} career tracks</span>
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredCareers.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" id="careers-grid">
          {filteredCareers.map((career) => (
            <CareerCard key={career.id} career={career} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center py-12 border border-dashed border-border rounded-2xl bg-card/10">
          <EyeOff className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-bold text-white">No career paths found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting your search terms or resetting the difficulty filters.
          </p>
        </div>
      )}
    </section>
  );
}
