// js/savingsManager.js

import {
    saveData,
    loadData
} from './storage.js';

let savingsGoals =
    loadData('savingsGoals');

export function addGoal(goal){

    savingsGoals.push(goal);

    saveData(
        'savingsGoals',
        savingsGoals
    );

}

export function getGoals(){

    return savingsGoals;

}

export function deleteGoal(index){

    savingsGoals.splice(index,1);

    saveData(
        'savingsGoals',
        savingsGoals
    );

}