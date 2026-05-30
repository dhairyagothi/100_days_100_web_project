// js/financialInsights.js

export const renderInsights =
  (insights) => {

    const container =
      document.getElementById(
        "aiInsights"
      );

    if (!container) return;

    container.innerHTML = "";

    insights.forEach(
      (insight) => {

        const card =
          document.createElement(
            "div"
          );

        card.className =
          "insight-card";

        card.innerHTML = `

          <p>${insight}</p>

        `;

        container.appendChild(
          card
        );
      }
    );
};