export interface RoadmapStage {
  stage: number;
  title: string;
  description: string;
  skills: string[];
}

export interface Project {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  keySkills: string[];
}

export interface Resource {
  title: string;
  url: string;
  type: "Video" | "Article" | "Course" | "Documentation";
  isFree: boolean;
}

export interface Career {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skillsCount: number;
  salaryEstimate: string;
  iconName: string; // Maps to Lucide icons
  skills: string[];
  roadmap: RoadmapStage[];
  projects: Project[];
  resources: Resource[];
}
