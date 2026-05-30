// js/aiInsights.js

import {
  GROQ_API_KEY
} from "./config.js";

export const generateInsights =
  async (
    transactions,
    analytics
  ) => {

    try {

      const expenses =
        transactions.filter(
          (transaction) =>
            transaction.type === "expense"
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

      const highestCategory =
        Object.entries(
          categoryTotals
        ).sort(
          (a, b) => b[1] - a[1]
        )[0];

      const formattedTransactions =
        transactions
          .map(
            (transaction) =>

              `
${transaction.description}
| ${transaction.category}
| ${transaction.type}
| $${transaction.amount}
`
          )
          .join("\n");

      const prompt = `

You are an advanced AI financial advisor.

Analyze this financial data
and generate intelligent insights.

FINANCIAL ANALYTICS

Income:
$${analytics.income}

Expenses:
$${analytics.expense}

Savings Rate:
${analytics.savingsRate}%

Highest Expense:
$${analytics.highestExpense}

Highest Income:
$${analytics.highestIncome}

Transaction Count:
${analytics.transactionCount}

Top Spending Category:
${highestCategory
  ? highestCategory[0]
  : "None"}

TRANSACTIONS

${formattedTransactions}

TASKS

Provide:
- spending pattern analysis
- budgeting suggestions
- saving recommendations
- financial improvement advice

RULES

- Keep response concise
- Use bullet points
- Maximum 4 insights
- Professional tone
- Actionable recommendations
`;

      const response =
        await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${GROQ_API_KEY}`,
            },

            body: JSON.stringify({

              model:
                "llama-3.1-8b-instant",

              messages: [
                {

                  role: "user",

                  content: prompt,
                },
              ],

              temperature: 0.7,

              max_tokens: 300,
            }),
          }
        );

      const data =
        await response.json();

      const aiText =
        data?.choices?.[0]
          ?.message?.content;

      if (!aiText) {

        return [
          "Unable to generate AI financial insights currently."
        ];
      }

      return aiText
        .split("\n")
        .filter(
          (line) =>
            line.trim() !== ""
        );

    } catch (error) {

      console.error(error);

      return [
        "AI financial analysis is temporarily unavailable."
      ];
    }
};