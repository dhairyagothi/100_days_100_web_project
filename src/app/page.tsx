import { projects } from "@/data/projects"
import { ProjectGrid } from "@/components/ProjectGrid"
import { HomeWrapper } from "../components/sections/home-wrapper"

export default function Home() {
  return (
    <HomeWrapper>
      <ProjectGrid projects={projects} />
    </HomeWrapper>
  )
}
