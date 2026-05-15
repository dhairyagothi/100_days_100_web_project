import { projects } from "@/data/projects"
import { ProjectGrid } from "@/components/ProjectGrid"
import { RepoStats } from "@/components/sections/RepoStats"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-screen-2xl">
      <div className="flex flex-col items-center justify-center text-center mb-16 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground font-geist-sans">
            100 Days of <span className="text-muted-foreground italic">Code</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A journey through 100 days of continuous web development. Exploring new technologies, building interactive projects, and mastering the frontend ecosystem.
          </p>
        </div>

        <div className="w-full max-w-4xl">
          <RepoStats />
        </div>
      </div>

      <ProjectGrid projects={projects} />
    </div>
  )
}
