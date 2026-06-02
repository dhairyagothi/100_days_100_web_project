import {
    addTransaction,
    getTransactions,
    deleteTransaction
} from './transactionManager.js';

import {
    addGoal,
    getGoals,
    deleteGoal
} from './savingsManager.js';

import {
    generateInsights
} from './financialInsights.js';


const form =
    document.getElementById('transaction-form');

const transactionList =
    document.getElementById('transaction-list');

const balanceEl =
    document.getElementById('balance');

const incomeEl =
    document.getElementById('income');

const expenseEl =
    document.getElementById('expense');

const totalTransactionsEl =
    document.getElementById('total-transactions');

const insightsBox =
    document.getElementById('insights-box');

const goalForm =
    document.getElementById('goal-form');

const goalList =
    document.getElementById('goal-list');


// ADD TRANSACTION
form.addEventListener('submit',(e)=>{

    e.preventDefault();

    const description =
        document.getElementById('description').value;

    const amount =
        parseFloat(
            document.getElementById('amount').value
        );

    const type =
        document.getElementById('type').value;

    const category =
        document.getElementById('category').value;

    if(!description || isNaN(amount)){

        alert('Enter valid details');

        return;

    }

    const transaction = {

        description,
        amount,
        type,
        category,
        date:new Date().toLocaleDateString()

    };

    addTransaction(transaction);

    form.reset();

    renderTransactions();

});


// RENDER TRANSACTIONS
function renderTransactions(){

    transactionList.innerHTML = '';

    const transactions =
        getTransactions();

    let income = 0;
    let expense = 0;

    transactions.forEach((transaction,index)=>{

        if(transaction.type === "Income"){

            income += transaction.amount;

        }
        else{

            expense += transaction.amount;

        }

        const row =
            document.createElement('tr');

        row.innerHTML = `

            <td>${transaction.description}</td>
            <td>$${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td>${transaction.category}</td>
            <td>${transaction.date}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="removeTransaction(${index})"
                >
                    Delete
                </button>

            </td>

        `;

        transactionList.appendChild(row);

    });

    balanceEl.textContent =
        `$${income - expense}`;

    incomeEl.textContent =
        `$${income}`;

    expenseEl.textContent =
        `$${expense}`;

    totalTransactionsEl.textContent =
        transactions.length;

    insightsBox.textContent =
        generateInsights(transactions);

}


// DELETE TRANSACTION
window.removeTransaction = function(index){

    deleteTransaction(index);

    renderTransactions();

}


// ADD GOAL
goalForm.addEventListener('submit',(e)=>{

    e.preventDefault();

    const goalName =
        document.getElementById('goal-name').value;

    const goalAmount =
        parseFloat(
            document.getElementById('goal-amount').value
        );

    if(!goalName || isNaN(goalAmount)){

        alert('Enter valid goal');

        return;

    }

    const goal = {

        name:goalName,
        amount:goalAmount

    };

    addGoal(goal);

    goalForm.reset();

    renderGoals();

});


// RENDER GOALS
function renderGoals(){

    goalList.innerHTML = '';

    const goals =
        getGoals();

    goals.forEach((goal,index)=>{

        const row =
            document.createElement('tr');

        row.innerHTML = `

            <td>${goal.name}</td>

            <td>$${goal.amount}</td>

            <td>

                <button
                    class="delete-btn"
                    onclick="removeGoal(${index})"
                >
                    Delete
                </button>

            </td>

        `;

        goalList.appendChild(row);

    });

}


// DELETE GOAL
window.removeGoal = function(index){

    deleteGoal(index);

    renderGoals();

}


// THEME TOGGLE
const themeToggle =
    document.getElementById('theme-toggle');

themeToggle.addEventListener('click',()=>{

    document.body.classList.toggle('light-mode');

    if(document.body.classList.contains('light-mode')){

        themeToggle.textContent = '☀️';

    }
    else{

        themeToggle.textContent = '🌙';

    }

});


// INITIAL RENDER
renderTransactions();
renderGoals();