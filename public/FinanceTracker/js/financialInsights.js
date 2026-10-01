// js/financialInsights.js - Enhanced AI insights
export function generateInsights(transactions) {
    if (transactions.length === 0) {
        return "Add transactions to receive AI insights.";
    }

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction) => {
        if (transaction.type === "Income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    if (expense > income) {
        return "Your expenses are higher than your income. Try reducing unnecessary spending.";
    }

    return "Great job! Your financial health looks stable.";
}

export function getDetailedInsights(transactions) {
    if (transactions.length === 0) {
        return [];
    }

    const insights = [];
    const totalIncome = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Financial health check
    if (balance > 0) {
        insights.push({
            title: '✅ Financial Health: Positive',
            message: `You have $${balance.toFixed(2)} in surplus after all expenses.`,
            detail: `Total Income: $${totalIncome.toFixed(2)} | Total Expenses: $${totalExpense.toFixed(2)}`,
            type: 'success'
        });
    } else if (balance < 0) {
        insights.push({
            title: '⚠️ Financial Health: Negative',
            message: `Your expenses exceed income by $${Math.abs(balance).toFixed(2)}. Consider reviewing your spending.`,
            detail: `Total Income: $${totalIncome.toFixed(2)} | Total Expenses: $${totalExpense.toFixed(2)}`,
            type: 'warning'
        });
    }

    // Top spending categories
    const expensesByCategory = {};
    transactions.filter(t => t.type === 'Expense').forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
    });

    const sortedCategories = Object.entries(expensesByCategory)
        .sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
        const [topCategory, topAmount] = sortedCategories[0];
        const percentage = totalExpense > 0 ? (topAmount / totalExpense * 100).toFixed(1) : 0;
        insights.push({
            title: '💡 Top Spending Category',
            message: `${topCategory} accounts for ${percentage}% of your total expenses ($${topAmount.toFixed(2)}).`,
            detail: `Consider if you can optimize this category.`,
            type: 'info'
        });
    }

    // Savings rate
    if (totalIncome > 0) {
        const savingsRate = ((totalIncome - totalExpense) / totalIncome * 100);
        insights.push({
            title: '📊 Savings Rate',
            message: `You're saving ${savingsRate.toFixed(1)}% of your income.`,
            detail: savingsRate > 20 ? 'Excellent! Keep up the good work!' :
                savingsRate > 10 ? 'Good, but you could save more.' :
                'Consider increasing your savings rate.',
            type: savingsRate > 20 ? 'success' : savingsRate > 0 ? 'info' : 'warning'
        });
    }

    // Transaction count insight
    if (transactions.length > 30) {
        insights.push({
            title: '📈 High Transaction Volume',
            message: `You have ${transactions.length} total transactions.`,
            detail: 'Consider reviewing if all are necessary or if you can consolidate some.',
            type: 'info'
        });
    }

    // Average transaction insight
    if (transactions.length > 0) {
        const avgIncome = totalIncome / transactions.filter(t => t.type === 'Income').length || 0;
        const avgExpense = totalExpense / transactions.filter(t => t.type === 'Expense').length || 0;
        
        if (avgIncome > 0) {
            insights.push({
                title: '📊 Average Transaction',
                message: `Average income: $${avgIncome.toFixed(2)} | Average expense: $${avgExpense.toFixed(2)}`,
                detail: 'Track your average spending patterns.',
                type: 'info'
            });
        }
    }

    return insights;
}