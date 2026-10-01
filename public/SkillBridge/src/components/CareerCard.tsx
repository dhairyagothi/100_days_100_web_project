"use client";

import Link from "next/link";
import { Career } from "@/types/career";
import { Code, Server, Layers, BarChart2, Brain, Smartphone, ArrowRight, DollarSign, BookOpen } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Server,
  Layers,
  BarChart2,
  Brain,
  Smartphone,
};

interface CareerCardProps {
  career: Career;
}

export default function CareerCard({ career }: CareerCardProps) {
  const Icon = iconMap[career.iconName] || Code;

  // Set difficulty badge colors
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "border-emerald-500/20 bg-emerald-500/5 text-emerald-300";
      case "Medium":
        return "border-amber-500/20 bg-amber-500/5 text-amber-300";
      case "Hard":
      default:
        return "border-rose-500/20 bg-rose-500/5 text-rose-300";
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-card/60 hover:shadow-xl hover:shadow-purple-500/5">
      {/* Dynamic top gradient bar on hover */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Card Body */}
      <div>
        {/* Header: Icon & Difficulty */}
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 transition-all duration-300 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600">
            <Icon className="h-5.5 w-5.5" />
          </div>
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDifficultyColor(
              career.difficulty
            )}`}
          >
            {career.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="mt-5 text-xl font-bold text-white transition-colors group-hover:text-purple-300">
          {career.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {career.description}
        </p>

        {/* Metadata Details */}
        <div className="mt-6 space-y-3 border-t border-border/50 pt-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpen className="h-4 w-4 text-purple-400/80" />
              Skills Required:
            </span>
            <span className="font-semibold text-white">{career.skillsCount} Skills</span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-4 w-4 text-emerald-400/80" />
              Salary Estimate:
            </span>
            <span className="font-semibold text-emerald-300">{career.salaryEstimate}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8 pt-2">
        <Link
          href={`/career/${career.slug}`}
          className="group/btn flex w-full items-center justify-center gap-2 rounded-xl bg-secondary hover:bg-purple-600 hover:text-white px-4 py-2.5 text-sm font-semibold text-white border border-border/80 hover:border-purple-500 transition-all duration-300"
          id={`btn-view-${career.slug}`}
        >
          View Roadmap
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
