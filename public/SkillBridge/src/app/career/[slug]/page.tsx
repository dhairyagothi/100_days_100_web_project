import Link from "next/link";
import { notFound } from "next/navigation";
import { careersData } from "@/data/careers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoadmapTimeline from "@/components/RoadmapTimeline";
import SkillBadge from "@/components/SkillBadge";
import {
  ArrowLeft,
  DollarSign,
  GraduationCap,
  ExternalLink,
  PlayCircle,
  FileText,
  BookOpen,
  FolderDot,
  Briefcase,
  Code
} from "lucide-react";

// For dynamic route generation in static export or rendering
export async function generateStaticParams() {
  return careersData.map((career) => ({
    slug: career.slug,
  }));
}

interface CareerPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CareerPage({ params }: CareerPageProps) {
  const { slug } = await params;
  const career = careersData.find((c) => c.slug === slug);

  if (!career) {
    notFound();
  }

  // Helper to get difficulty styles
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

  // Helper to map resource icons
  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <PlayCircle className="h-4 w-4 text-purple-400" />;
      case "Article":
        return <FileText className="h-4 w-4 text-indigo-400" />;
      case "Course":
        return <GraduationCap className="h-4 w-4 text-purple-400" />;
      case "Documentation":
      default:
        return <BookOpen className="h-4 w-4 text-violet-400" />;
    }
  };

  // Group projects by difficulty
  const beginnerProjects = career.projects.filter((p) => p.difficulty === "Beginner");
  const intermediateProjects = career.projects.filter((p) => p.difficulty === "Intermediate");
  const advancedProjects = career.projects.filter((p) => p.difficulty === "Advanced");

  return (
    <>
      <Navbar />
      
      <main className="flex-1 bg-background relative min-h-screen overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-indigo-500/5 blur-[100px]" />

        {/* Back navigation */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-white group"
            id="back-home-link"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Careers
          </Link>
        </div>

        {/* Hero Info Header */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card/10 p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
            {/* Soft decorative glow corner */}
            <div className="absolute -right-20 -bottom-20 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getDifficultyColor(
                      career.difficulty
                    )}`}
                  >
                    {career.difficulty} Difficulty
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Briefcase className="h-3.5 w-3.5 text-purple-400" />
                    Career Path
                  </span>
                </div>
                
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl" id="career-detail-title">
                  {career.title}
                </h1>
                
                <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
                  {career.description}
                </p>
              </div>

              {/* Quick stats panel */}
              <div className="grid grid-cols-2 lg:flex lg:flex-col gap-4 border-t lg:border-t-0 lg:border-l border-border/50 pt-6 lg:pt-0 lg:pl-10 shrink-0">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Average Salary</span>
                  <span className="text-xl md:text-2xl font-black text-emerald-400 flex items-center">
                    <DollarSign className="h-5 w-5 shrink-0" />
                    {career.salaryEstimate.replace("$", "")}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Key Milestones</span>
                  <span className="text-xl md:text-2xl font-black text-purple-300">
                    {career.roadmap.length} Stages
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout: Roadmap on the left, resources/skills on the right */}
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* Left Column: Learning Roadmap */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 pb-4">
                <GraduationCap className="h-6 w-6 text-purple-400" />
                <h2 className="text-2xl font-extrabold text-white tracking-tight" id="roadmap-heading">
                  Learning Roadmap
                </h2>
              </div>

              <RoadmapTimeline stages={career.roadmap} careerSlug={career.slug} />
            </div>

            {/* Right Column: Required Skills, Recommended Projects, Resources */}
            <div className="lg:col-span-5 space-y-12">
              
              {/* Skills section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-border/50 pb-2">
                  Required Skills List
                </h3>
                <div className="flex flex-wrap gap-2 pt-2">
                  {career.skills.map((skill) => (
                    <SkillBadge key={skill} name={skill} />
                  ))}
                </div>
              </div>

              {/* Recommended Projects section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <FolderDot className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">
                    Recommended Projects
                  </h3>
                </div>

                <div className="space-y-6 pt-2">
                  {/* Beginner tier */}
                  <div>
                    <h4 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-3">
                      Beginner Projects
                    </h4>
                    <div className="space-y-3">
                      {beginnerProjects.map((p, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-card/20 p-4 transition-all hover:bg-card/40">
                          <h5 className="font-bold text-white text-sm">{p.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {p.keySkills.map((sk) => (
                              <span key={sk} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Intermediate tier */}
                  <div>
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider mb-3">
                      Intermediate Projects
                    </h4>
                    <div className="space-y-3">
                      {intermediateProjects.map((p, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-card/20 p-4 transition-all hover:bg-card/40">
                          <h5 className="font-bold text-white text-sm">{p.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {p.keySkills.map((sk) => (
                              <span key={sk} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advanced tier */}
                  <div>
                    <h4 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider mb-3">
                      Advanced Projects
                    </h4>
                    <div className="space-y-3">
                      {advancedProjects.map((p, idx) => (
                        <div key={idx} className="rounded-xl border border-border bg-card/20 p-4 transition-all hover:bg-card/40">
                          <h5 className="font-bold text-white text-sm">{p.title}</h5>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {p.keySkills.map((sk) => (
                              <span key={sk} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Learning Resources section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-white">
                    Learning Resources
                  </h3>
                </div>

                <div className="divide-y divide-border/40 pt-2">
                  {career.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between py-3.5 transition-all hover:translate-x-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted border border-border transition-colors group-hover:bg-purple-600/10 group-hover:border-purple-500/20">
                          {getResourceIcon(res.type)}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white transition-colors group-hover:text-purple-300">
                            {res.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                            {res.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {res.isFree && (
                          <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                            Free
                          </span>
                        )}
                        <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-purple-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
