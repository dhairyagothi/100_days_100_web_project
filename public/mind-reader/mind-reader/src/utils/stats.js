const defaultStats = {
  totalGames: 0,
  genieWins: 0,
  playerWins: 0,
  totalQuestions: 0,
  fastestGuess: null,
  lastPlayed: null,
};

export function loadStats() {
  const saved = localStorage.getItem("gameStats");

  if (!saved) return defaultStats;

  return JSON.parse(saved);
}

export function saveStats(stats) {
  localStorage.setItem("gameStats", JSON.stringify(stats));
}

export function updateStats(winner, questionsAsked) {
  console.log("updateStats called:", winner, questionsAsked);

  const stats = loadStats();
  console.log("Before update:", stats);

  stats.totalGames++;
  stats.totalQuestions += questionsAsked;

  if (winner === "genie") {
    stats.genieWins++;

    if (
      stats.fastestGuess === null ||
      questionsAsked < stats.fastestGuess
    ) {
      stats.fastestGuess = questionsAsked;
    }
  } else {
    stats.playerWins++;
  }

  stats.lastPlayed = new Date().toLocaleString();

  console.log("Saving stats:", stats);

  saveStats(stats);
}

export function resetStats() {
  saveStats(defaultStats);
}