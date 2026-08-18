"use client";

import { Compass, GitMerge, Map, CodeXml } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: Compass,
      title: "Career Exploration",
      description: "Discover modern tech professions. Learn about daily tasks, market demand, and average salary scopes.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: GitMerge,
      title: "Skill Mapping",
      description: "Analyze the vital skills needed. Know what to study first, and identify dependencies across disciplines.",
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      icon: Map,
      title: "Learning Roadmaps",
      description: "Follow structural stage-by-stage timelines from zero foundation to production-ready expert concepts.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: CodeXml,
      title: "Project Recommendations",
      description: "Apply your skills with projects. Filtered across Beginner, Intermediate, and Advanced skill tiers.",
      color: "from-fuchsia-500 to-violet-500",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-t border-border/50 bg-background relative overflow-hidden">
      {/* Background soft lighting */}
      <div className="absolute right-0 top-1/4 -z-10 h-[250px] w-[250px] rounded-full bg-indigo-500/5 blur-[70px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center md:max-w-2xl md:mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to guide your path
          </h2>
          <p className="mt-4 text-muted-foreground">
            SkillBridge details the technical prerequisites, milestone paths, and direct projects for career success.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:bg-card/70 hover:shadow-2xl hover:shadow-purple-500/5"
              >
                {/* Glow backdrop on hover */}
                <div className="absolute -right-12 -top-12 -z-10 h-32 w-32 rounded-full bg-purple-500/5 blur-xl transition-all duration-300 group-hover:scale-150" />

                {/* Icon wrapper */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300">
                  <Icon className="h-6 w-6" />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-xl font-bold text-white transition-colors group-hover:text-purple-300">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
