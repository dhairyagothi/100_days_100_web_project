import { HomeWrapper } from "@/components/sections/home-wrapper";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <HomeWrapper>
      <ProjectGrid projects={projects} />
    </HomeWrapper>
  );
}
