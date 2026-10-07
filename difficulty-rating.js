/**
 * Project Difficulty Rating System - Issue #8778
 * Enables skill progression mapping with user ratings and difficulty validation
 */

class DifficultyRatingSystem {
  constructor(projects = []) {
    this.projects = projects;
    this.ratings = this.loadRatings();
    this.skillMapping = this.buildSkillMapping();
  }

  /**
   * Submit a difficulty rating for a project
   */
  rateProjectDifficulty(projectDay, userRating, actualDifficulty) {
    if (!this.ratings[projectDay]) {
      this.ratings[projectDay] = {
        userRatings: [],
        actualDifficulty,
        averageUserRating: 0,
        totalRatings: 0,
        accuracyScore: 0,
      };
    }

    const rating = {
      value: Math.min(5, Math.max(1, userRating)),
      timestamp: Date.now(),
      userSkillLevel: this.estimateUserSkillLevel(),
    };

    this.ratings[projectDay].userRatings.push(rating);
    this.updateRatingStats(projectDay);
    this.saveRatings();

    return this.getRatingFeedback(projectDay, userRating, actualDifficulty);
  }

  /**
   * Update aggregated rating statistics
   */
  updateRatingStats(projectDay) {
    const data = this.ratings[projectDay];
    if (!data.userRatings.length) return;

    data.totalRatings = data.userRatings.length;
    data.averageUserRating =
      data.userRatings.reduce((sum, r) => sum + r.value, 0) /
      data.userRatings.length;

    const expectedRating = this.getDifficultyScore(data.actualDifficulty);
    const deviation = Math.abs(data.averageUserRating - expectedRating);
    data.accuracyScore = Math.max(0, 100 - deviation * 20);
  }

  /**
   * Map difficulty levels to numeric scores for comparison
   */
  getDifficultyScore(difficulty) {
    const scores = {
      beginner: 2,
      intermediate: 3.5,
      advanced: 5,
    };
    return scores[difficulty?.toLowerCase()] || 3;
  }

  /**
   * Get feedback on difficulty rating accuracy
   */
  getRatingFeedback(projectDay, userRating, actualDifficulty) {
    const expectedScore = this.getDifficultyScore(actualDifficulty);
    const diff = Math.abs(userRating - expectedScore);

    if (diff < 0.5) {
      return {
        message: "Great assessment! Your rating matches the difficulty level.",
        accuracy: "excellent",
        points: 10,
      };
    } else if (diff < 1.5) {
      return {
        message: "Good judgment. Your rating is close to the actual difficulty.",
        accuracy: "good",
        points: 5,
      };
    } else {
      return {
        message: `The project is actually ${actualDifficulty}. Use this to calibrate future ratings.`,
        accuracy: "needs-improvement",
        points: 0,
      };
    }
  }

  /**
   * Build skill progression mapping from ratings
   */
  buildSkillMapping() {
    const mapping = {
      beginner: { projectedRating: 2, projectCount: 0, avgTime: 0 },
      intermediate: { projectedRating: 3.5, projectCount: 0, avgTime: 0 },
      advanced: { projectedRating: 5, projectCount: 0, avgTime: 0 },
    };

    this.projects.forEach((p) => {
      const difficulty = (p.difficulty || "beginner").toLowerCase();
      if (mapping[difficulty]) {
        mapping[difficulty].projectCount++;
      }
    });

    return mapping;
  }

  /**
   * Validate difficulty rating against actual project difficulty
   */
  validateDifficultyRating(projectDay, userRating) {
    const project = this.projects.find((p) => p.day === projectDay);
    if (!project) return { valid: false, message: "Project not found" };

    const actualScore = this.getDifficultyScore(project.difficulty);
    const userScore = Math.min(5, Math.max(1, userRating));
    const variance = Math.abs(userScore - actualScore);

    return {
      valid: variance < 2,
      variance,
      feedback: variance < 1 ? "Accurate" : "Consider the actual difficulty",
      projectedSkillGain: Math.max(0, 10 - variance * 5),
    };
  }

  /**
   * Get skill progression based on ratings history
   */
  getSkillProgression() {
    const progression = {};
    Object.entries(this.ratings).forEach(([day, data]) => {
      if (data.userRatings.length > 0) {
        progression[day] = {
          lastRating: data.userRatings[data.userRatings.length - 1].value,
          averageRating: data.averageUserRating,
          totalRatings: data.totalRatings,
          accuracyScore: data.accuracyScore,
          difficulty: data.actualDifficulty,
        };
      }
    });
    return progression;
  }

  /**
   * Estimate user's current skill level from rating patterns
   */
  estimateUserSkillLevel() {
    if (Object.keys(this.ratings).length === 0) return "beginner";

    const avgRatings = Object.values(this.ratings)
      .filter((r) => r.userRatings.length > 0)
      .map((r) => r.averageUserRating)
      .reduce((sum, val) => sum + val, 0) /
      Object.values(this.ratings).filter((r) => r.userRatings.length > 0)
        .length;

    if (avgRatings >= 4.5) return "advanced";
    if (avgRatings >= 3) return "intermediate";
    return "beginner";
  }

  /**
   * Get difficulty distribution across all projects
   */
  getDifficultyDistribution() {
    const distribution = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    };

    this.projects.forEach((p) => {
      const difficulty = (p.difficulty || "beginner").toLowerCase();
      if (distribution.hasOwnProperty(difficulty)) {
        distribution[difficulty]++;
      }
    });

    return distribution;
  }

  /**
   * Persistence: Load ratings from localStorage
   */
  loadRatings() {
    try {
      const stored = localStorage.getItem("difficultyRatings");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  }

  /**
   * Persistence: Save ratings to localStorage
   */
  saveRatings() {
    try {
      localStorage.setItem(
        "difficultyRatings",
        JSON.stringify(this.ratings)
      );
    } catch (e) {
      console.warn("Failed to save difficulty ratings:", e);
    }
  }
}

/**
 * Attach rating UI to project cards
 */
function attachDifficultyRatingUI(cardElement, projectDay, difficultySystem) {
  const ratingButtons = document.createElement("div");
  ratingButtons.className = "difficulty-rating-buttons";

  for (let i = 1; i <= 5; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `difficulty-btn ${i <= 3 ? "easy" : "hard"}`;
    btn.onclick = () => {
      const feedback = difficultySystem.rateProjectDifficulty(
        projectDay,
        i,
        "intermediate"
      );
      btn.classList.add("rated");
      console.log("Difficulty rated:", feedback);
    };
    ratingButtons.appendChild(btn);
  }

  cardElement.appendChild(ratingButtons);
}

// Auto-initialize when projects load
if (typeof loadProjects === "function") {
  loadProjects().then((projects) => {
    window.difficultyRatingSystem = new DifficultyRatingSystem(projects);
  });
}
