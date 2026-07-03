"use client";

import { useState, useEffect } from "react";
import { RoadmapStage } from "@/types/career";
import { CheckCircle2, Circle, Trophy } from "lucide-react";

interface RoadmapTimelineProps {
  stages: RoadmapStage[];
  careerSlug: string;
}

export default function RoadmapTimeline({ stages, careerSlug }: RoadmapTimelineProps) {
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem(`skillbridge_progress_${careerSlug}`);
    if (saved) {
      try {
        setCompletedStages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress from localStorage", e);
      }
    }
  }, [careerSlug]);

  const toggleStage = (stageNum: number) => {
    let updated: number[];
    if (completedStages.includes(stageNum)) {
      updated = completedStages.filter((num) => num !== stageNum);
    } else {
      updated = [...completedStages, stageNum].sort((a, b) => a - b);
    }
    setCompletedStages(updated);
    localStorage.setItem(`skillbridge_progress_${careerSlug}`, JSON.stringify(updated));
  };

  const isCompleted = (stageNum: number) => completedStages.includes(stageNum);

  // Calculate percentage progress
  const progressPercent = stages.length > 0 
    ? Math.round((completedStages.length / stages.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Progress Tracker Card */}
      <div className="rounded-2xl border border-border bg-card/20 p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Your Roadmap Progress</h3>
              <p className="text-sm text-muted-foreground">
                Mark milestones as you learn to track your career journey.
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto text-left sm:text-right">
            <span className="text-2xl font-black text-purple-300">{progressPercent}%</span>
            <span className="text-xs text-muted-foreground block">Completed</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${isHydrated ? progressPercent : 0}%` }}
          />
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative border-l-2 border-border pl-6 md:pl-8 ml-4 md:ml-6 space-y-12">
        {stages.map((stage) => {
          const done = isHydrated && isCompleted(stage.stage);
          return (
            <div key={stage.stage} className="relative group">
              {/* Connector Dot */}
              <button
                onClick={() => toggleStage(stage.stage)}
                className={`absolute -left-[35px] md:-left-[43px] top-1.5 flex h-7 w-7 items-center justify-center rounded-full border bg-background transition-all duration-300 ${
                  done
                    ? "border-purple-500 text-purple-400 shadow-md shadow-purple-500/20 hover:bg-purple-950/20"
                    : "border-border text-muted-foreground hover:border-purple-500/50 hover:text-purple-400"
                }`}
                aria-label={`Toggle stage ${stage.stage}`}
              >
                {done ? (
                  <CheckCircle2 className="h-5.5 w-5.5 fill-purple-500/20" />
                ) : (
                  <Circle className="h-4.5 w-4.5" />
                )}
              </button>

              {/* Stage Card */}
              <div
                className={`rounded-2xl border p-6 transition-all duration-300 ${
                  done
                    ? "border-purple-500/30 bg-purple-500/5"
                    : "border-border bg-card/30 hover:border-border-hover hover:bg-card/50"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-lg bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/20">
                    Stage {stage.stage}
                  </span>
                  
                  <button
                    onClick={() => toggleStage(stage.stage)}
                    className={`text-xs font-medium transition-all ${
                      done
                        ? "text-purple-400 hover:text-purple-300"
                        : "text-muted-foreground hover:text-white"
                    }`}
                  >
                    {done ? "Mark Incomplete" : "Mark as Complete"}
                  </button>
                </div>

                <h4 className="mt-3 text-lg font-bold text-white transition-colors group-hover:text-purple-300">
                  {stage.title}
                </h4>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {stage.description}
                </p>

                {/* Skills list */}
                <div className="mt-4">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">Key Skills to Learn</h5>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {stage.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs transition-colors border ${
                          done
                            ? "bg-purple-500/10 border-purple-500/20 text-purple-200"
                            : "bg-muted/40 border-border text-muted-foreground"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
