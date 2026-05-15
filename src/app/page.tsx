import { projects } from "@/data/projects"
import { ProjectGrid } from "@/components/ProjectGrid"
import { getRepoStats } from "@/lib/github"
import { HomeWrapper } from "../components/sections/home-wrapper"

export default async function Home() {
  const stats = await getRepoStats()

  return (
    <HomeWrapper stats={stats}>
      <ProjectGrid projects={projects} />
    </HomeWrapper>
  )
}
