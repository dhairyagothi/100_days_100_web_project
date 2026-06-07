// js/financialInsights.js — Enhanced AI insights engine

import { getSummary, getCategoryBreakdown, getMonthlyTrend } from './analyticsEngine.js';
import { getBudgets } from './budgetManager.js';

/*
 Generate comprehensive financial insights based on transaction data.
 Returns a multi-line string with insights and recommendations.
 */
export function generateInsights() {
  const summary = getSummary();

  if (summary.transaction_count === 0) {
    return '📝 Add transactions to receive AI-powered financial insights.';
  }

  const insights = [];

  // 1. Overall health assessment
  const savingsRate = summary.total_income > 0
    ? Math.round((summary.total_savings / summary.total_income) * 100)
    : 0;

  if (summary.total_savings > 0) {
    insights.push(`✅ Great job! You're saving ${savingsRate}% of your income (${formatNum(summary.total_savings)} saved).`);
  } else if (summary.total_savings === 0) {
    insights.push('⚠️ You\'re breaking even — income equals expenses. Try to build a savings buffer.');
  } else {
    insights.push(`🚨 Warning: You're spending more than you earn! You're ${formatNum(Math.abs(summary.total_savings))} in the red.`);
  }

  // 2. Savings rate advice
  if (savingsRate > 0 && savingsRate < 20) {
    insights.push(`💡 Tip: Financial experts recommend saving at least 20% of income. You're at ${savingsRate}% — try cutting discretionary spending.`);
  } else if (savingsRate >= 20 && savingsRate < 50) {
    insights.push(`🌟 Excellent savings rate of ${savingsRate}%! You're on track for strong financial health.`);
  } else if (savingsRate >= 50) {
    insights.push(`🏆 Outstanding! A ${savingsRate}% savings rate puts you in elite territory.`);
  }

  // 3. Top spending category insight
  const breakdown = getCategoryBreakdown();
  if (breakdown.length > 0) {
    const top = breakdown[0];
    insights.push(`🏷️ Your biggest expense category is "${top.category}" at ${formatNum(top.amount)} (${top.percentage}% of all expenses).`);

    if (top.percentage > 40) {
      insights.push(`⚠️ "${top.category}" makes up over 40% of your spending. Consider diversifying or reducing this.`);
    }
  }

  // 4. Budget warnings
  const budgets = getBudgets();
  const overBudget = budgets.filter(b => b.percentage >= 90);
  if (overBudget.length > 0) {
    const names = overBudget.map(b => b.category).join(', ');
    insights.push(`🎯 Budget alert: ${names} ${overBudget.length === 1 ? 'is' : 'are'} at or near the spending limit this month.`);
  }

  // 5. Monthly trend insight
  const trend = getMonthlyTrend();
  if (trend.length >= 2) {
    const latest = trend[trend.length - 1];
    const prev = trend[trend.length - 2];
    const expenseChange = latest.expense - prev.expense;

    if (expenseChange > 0) {
      insights.push(`📈 Your expenses increased by ${formatNum(expenseChange)} compared to last month.`);
    } else if (expenseChange < 0) {
      insights.push(`📉 Your expenses decreased by ${formatNum(Math.abs(expenseChange))} compared to last month. Keep it up!`);
    }
  }

  // 6. Transaction volume
  if (summary.transaction_count >= 50) {
    insights.push(`📊 You have ${summary.transaction_count} transactions tracked — excellent record keeping!`);
  }

  return insights.join('\n\n');
}

function formatNum(n) {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}