// js/savingsManager.js

import {
  saveGoals,
} from "./storage.js";

export const renderGoals = (
  goals
) => {

  const container =
    document.getElementById(
      "goalsContainer"
    );

  if (!container) return;

  container.innerHTML = "";

  goals.forEach((goal) => {

    const percentage =
      Math.min(
        (
          goal.saved
          / goal.target
        ) * 100,
        100
      );

    const card =
      document.createElement("div");

    card.className =
      "goal-card";

    card.innerHTML = `

      <h3>${goal.name}</h3>

      <div class="goal-progress">

        <div
          class="goal-progress-fill"
          style="width:${percentage}%"
        ></div>

      </div>

      <div class="goal-meta">

        <span>
          Saved:
          $${goal.saved}
        </span>

        <span>
          Goal:
          $${goal.target}
        </span>

      </div>
    `;

    container.appendChild(card);
  });
};

export const addGoal = (
  goals,
  goal
) => {

  goals.push(goal);

  saveGoals(goals);

  return goals;
};