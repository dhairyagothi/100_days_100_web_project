// js/financialInsights.js

export function generateInsights(transactions){

    if(transactions.length === 0){

        return "Add transactions to receive AI insights.";

    }

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction)=>{

        if(transaction.type === "Income"){

            income += transaction.amount;

        }
        else{

            expense += transaction.amount;

        }

    });

    if(expense > income){

        return "Your expenses are higher than your income. Try reducing unnecessary spending.";

    }

    return "Great job! Your financial health looks stable.";

}