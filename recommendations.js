function normalizeTech(tech) {
  return String(tech || "").trim().toLowerCase();
}

function isSameProject(projectA, projectB) {
  if (!projectA || !projectB) return false;

  if (projectA.projectNo != null && projectB.projectNo != null) {
    return projectA.projectNo === projectB.projectNo;
  }

  if (projectA.day && projectB.day) {
    return projectA.day === projectB.day;
  }

  if (projectA.projectName && projectB.projectName) {
    return projectA.projectName === projectB.projectName;
  }

  if (projectA.name && projectB.name) {
    return projectA.name === projectB.name;
  }

  return false;
}

export function getRecommendations(currentProject, allProjects) {
  if (!currentProject || !Array.isArray(allProjects)) return [];

  const currentTechStack = Array.isArray(currentProject.techStack)
    ? currentProject.techStack.map(normalizeTech)
    : [];
  const currentTechSet = new Set(currentTechStack);

  return allProjects
    .filter((project) => !isSameProject(project, currentProject))
    .map((project) => {
      let score = 0;
      const projectTechStack = Array.isArray(project.techStack)
        ? project.techStack.map(normalizeTech)
        : [];

      // 🔥 1. Project type match (strong grouping signal)
      if (
        normalizeTech(project.projectType) ===
        normalizeTech(currentProject.projectType)
      ) {
        score += 5;
      }

      // 🔥 2. Tech stack overlap (MOST IMPORTANT)
      const sharedTech = projectTechStack.filter((tech) =>
        currentTechSet.has(tech),
      );

      score += sharedTech.length * 4;

      // 🎯 3. Difficulty match (learning path consistency)
      if (
        normalizeTech(project.difficulty) ===
        normalizeTech(currentProject.difficulty)
      ) {
        score += 2;
      }

      // ⚡ 4. Small bonus: at least some tech match
      if (sharedTech.length > 0) {
        score += 1;
      }

      return {
        ...project,
        score,
        sharedTechCount: sharedTech.length,
      };
    })
    .filter((project) => project.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

window.getRecommendations = getRecommendations;
