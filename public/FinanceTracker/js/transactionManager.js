// js/transactionManager.js

import {
    saveData,
    loadData
} from './storage.js';

let transactions =
    loadData('transactions');

export function addTransaction(transaction){

    transactions.push(transaction);

    saveData(
        'transactions',
        transactions
    );

}

export function getTransactions(){

    return transactions;

}

export function deleteTransaction(index){

    transactions.splice(index,1);

    saveData(
        'transactions',
        transactions
    );

}