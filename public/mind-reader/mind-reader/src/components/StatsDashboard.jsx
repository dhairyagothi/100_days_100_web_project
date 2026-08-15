import { loadStats } from "../utils/stats";

function StatsDashboard({ onBack }) {
  const stats = loadStats();

  return (
    <div>
      <h2 className="question">Player Statistics</h2>

      <p>Total Games: {stats.totalGames}</p>
      <p>Genie Wins: {stats.genieWins}</p>
      <p>Player Wins: {stats.playerWins}</p>
      <p>Total Questions: {stats.totalQuestions}</p>
      <p>Fastest Guess: {stats.fastestGuess ?? "-"}</p>
      <p>Last Played: {stats.lastPlayed ?? "-"}</p>

      <button className="btn" onClick={onBack}>
        Back
      </button>
    </div>
  );
}

export default StatsDashboard;