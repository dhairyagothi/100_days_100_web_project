// js/chartManager.js

let chartInstance = null;

export const renderChart = (
  transactions
) => {

  const expenses =
    transactions.filter(
      (t) => t.type === "expense"
    );

  const categoryTotals = {};

  expenses.forEach((expense) => {

    if (
      categoryTotals[
        expense.category
      ]
    ) {

      categoryTotals[
        expense.category
      ] += expense.amount;

    } else {

      categoryTotals[
        expense.category
      ] = expense.amount;
    }
  });

  const ctx =
    document
      .getElementById("chart")
      .getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance =
    new Chart(ctx, {

      type: "doughnut",

      data: {

        labels:
          Object.keys(categoryTotals),

        datasets: [
          {

            data:
              Object.values(
                categoryTotals
              ),

            backgroundColor: [
              "#8b5cf6",
              "#06b6d4",
              "#10b981",
              "#f59e0b",
              "#ef4444",
            ],
          },
        ],
      },
    });
};