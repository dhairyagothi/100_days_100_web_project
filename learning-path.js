/**
 * Learning Path System - Issue #8731
 * Organizes projects by difficulty levels and creates structured learning progressions
 * Supports: difficulty classification, prerequisites, progress tracking, skill assessment
 */

const DIFFICULTY_LEVELS = {
  beginner: { level: 1, label: "Beginner", color: "#4CAF50" },
  intermediate: { level: 2, label: "Intermediate", color: "#FF9800" },
  advanced: { level: 3, label: "Advanced", color: "#F44336" },
};

const DEFAULT_PREREQUISITES = {
  intermediate: ["beginner"],
  advanced: ["intermediate", "beginner"],
};

class LearningPath {
  constructor(projects = []) {
    this.projects = projects;
    this.userProgress = this.loadProgress();
    this.learningPaths = this.buildLearningPaths();
  }

  /**
   * Organizes projects by difficulty level
   */
  getProjectsByDifficulty(difficulty) {
    return this.projects.filter((p) => {
      const projectDifficulty = (p.difficulty || "beginner").toLowerCase();
      return projectDifficulty === difficulty.toLowerCase();
    });
  }

  /**
   * Gets recommended next projects based on current skill level
   */
  getRecommendedProjects(userLevel = "beginner", limit = 5) {
    const userLevelValue = DIFFICULTY_LEVELS[userLevel]?.level || 1;
    return this.projects
      .filter((p) => {
        const projectLevel =
          DIFFICULTY_LEVELS[(p.difficulty || "beginner").toLowerCase()]?.level || 1;
        return projectLevel === userLevelValue || projectLevel === userLevelValue + 1;
      })
      .slice(0, limit);
  }

  /**
   * Builds structured learning paths from project difficulty
   */
  buildLearningPaths() {
    const paths = {
      beginner: this.getProjectsByDifficulty("beginner"),
      intermediate: this.getProjectsByDifficulty("intermediate"),
      advanced: this.getProjectsByDifficulty("advanced"),
    };
    return paths;
  }

  /**
   * Tracks user progress through learning path
   */
  trackProjectCompletion(projectDay) {
    if (!this.userProgress.completed) {
      this.userProgress.completed = [];
    }
    if (!this.userProgress.completed.includes(projectDay)) {
      this.userProgress.completed.push(projectDay);
      this.saveProgress();
    }
  }

  /**
   * Gets user's current skill level based on completed projects
   */
  getUserSkillLevel() {
    const completed = this.userProgress.completed || [];
    const completedProjects = this.projects.filter((p) =>
      completed.includes(p.day)
    );

    const advancedCount = completedProjects.filter(
      (p) => (p.difficulty || "beginner").toLowerCase() === "advanced"
    ).length;
    const intermediateCount = completedProjects.filter(
      (p) => (p.difficulty || "beginner").toLowerCase() === "intermediate"
    ).length;

    if (advancedCount >= 3) return "advanced";
    if (intermediateCount >= 5) return "intermediate";
    return "beginner";
  }

  /**
   * Calculates progress percentage for each difficulty level
   */
  getProgressStats() {
    const completed = this.userProgress.completed || [];
    const stats = {};

    Object.keys(this.learningPaths).forEach((level) => {
      const total = this.learningPaths[level].length;
      const completedCount = this.learningPaths[level].filter((p) =>
        completed.includes(p.day)
      ).length;
      stats[level] = {
        completed: completedCount,
        total,
        percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      };
    });

    return stats;
  }

  /**
   * Persistence: Load user progress from localStorage
   */
  loadProgress() {
    try {
      const stored = localStorage.getItem("learningPathProgress");
      return stored ? JSON.parse(stored) : { completed: [] };
    } catch (e) {
      return { completed: [] };
    }
  }

  /**
   * Persistence: Save user progress to localStorage
   */
  saveProgress() {
    try {
      localStorage.setItem(
        "learningPathProgress",
        JSON.stringify(this.userProgress)
      );
    } catch (e) {
      console.warn("Failed to save learning progress:", e);
    }
  }

  /**
   * Generates learning path recommendations with prerequisites
   */
  getNextSteps() {
    const currentLevel = this.getUserSkillLevel();
    const nextLevel =
      currentLevel === "beginner"
        ? "intermediate"
        : currentLevel === "intermediate"
          ? "advanced"
          : "advanced";

    return {
      currentLevel,
      nextLevel,
      prerequisites: DEFAULT_PREREQUISITES[nextLevel] || [],
      recommendedProjects: this.getRecommendedProjects(currentLevel, 10),
      progressStats: this.getProgressStats(),
    };
  }
}

/**
 * Renders learning path UI panel
 */
function renderLearningPathPanel(learningPath) {
  const container = document.getElementById("learningPathPanel");
  if (!container) return;

  const nextSteps = learningPath.getNextSteps();
  const skillLevel = learningPath.getUserSkillLevel();
  const stats = learningPath.getProgressStats();

  const html = `
    <div class="learning-path-container">
      <h2>Your Learning Journey</h2>

      <div class="skill-level-indicator">
        <span>Current Level: <strong>${DIFFICULTY_LEVELS[skillLevel]?.label || "Beginner"}</strong></span>
        <div class="progress-bars">
          ${Object.entries(stats)
            .map(
              ([level, data]) => `
            <div class="progress-item">
              <label>${DIFFICULTY_LEVELS[level]?.label}</label>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.percentage}%; background: ${DIFFICULTY_LEVELS[level]?.color};">
                  ${data.percentage}%
                </div>
              </div>
              <span class="progress-text">${data.completed}/${data.total}</span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>

      <div class="recommended-section">
        <h3>Recommended Next Projects</h3>
        <div class="recommended-projects">
          ${nextSteps.recommendedProjects
            .slice(0, 3)
            .map(
              (p) => `
            <div class="recommended-card">
              <div class="card-day">${p.day}</div>
              <div class="card-name">${p.projectName}</div>
              <span class="difficulty-badge" style="background: ${DIFFICULTY_LEVELS[p.difficulty]?.color}">
                ${DIFFICULTY_LEVELS[p.difficulty]?.label}
              </span>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Auto-initialize when projects load
if (typeof loadProjects === "function") {
  loadProjects().then((projects) => {
    window.learningPathSystem = new LearningPath(projects);
    renderLearningPathPanel(window.learningPathSystem);
  });
}
