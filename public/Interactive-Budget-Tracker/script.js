let budget = 0;
let expenses = [];

const budgetInput = document.getElementById("budgetInput");
const setBudgetBtn = document.getElementById("setBudgetBtn");

const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");

const addExpenseBtn = document.getElementById("addExpenseBtn");

const expenseList = document.getElementById("expenseList");

const budgetValue = document.getElementById("budgetValue");
const spentValue = document.getElementById("spentValue");
const remainingValue = document.getElementById("remainingValue");

const progressBar = document.getElementById("progressBar");

const themeToggle = document.getElementById("themeToggle");

let chart;

loadData();

setBudgetBtn.addEventListener("click", () => {
    budget = Number(budgetInput.value);

    saveData();
    updateUI();
});

addExpenseBtn.addEventListener("click", () => {

    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    if(!name || amount<=0){
        alert("Enter valid data");
        return;
    }

    expenses.push({
        id:Date.now(),
        name,
        amount,
        category
    });

    expenseName.value="";
    expenseAmount.value="";

    saveData();
    updateUI();
});

function deleteExpense(id){
    expenses = expenses.filter(exp => exp.id !== id);

    saveData();
    updateUI();
}

function updateUI(){

    let totalSpent = expenses.reduce(
        (sum,item)=>sum+item.amount,0
    );

    let remaining = budget-totalSpent;

    budgetValue.textContent=`₹${budget}`;
    spentValue.textContent=`₹${totalSpent}`;
    remainingValue.textContent=`₹${remaining}`;

    let percentage =
    budget>0 ? (totalSpent/budget)*100 : 0;

    progressBar.style.width =
    Math.min(percentage,100)+"%";

    expenseList.innerHTML="";

    expenses.forEach(exp=>{

        const div=document.createElement("div");

        div.className="expense-item";

        div.innerHTML=`
        <div>
        <strong>${exp.name}</strong><br>
        ${exp.category} • ₹${exp.amount}
        </div>

        <button class="delete-btn"
        onclick="deleteExpense(${exp.id})">
        Delete
        </button>
        `;

        expenseList.appendChild(div);
    });

    updateChart();
}

function updateChart(){

    const categories={};

    expenses.forEach(exp=>{

        categories[exp.category] =
        (categories[exp.category] || 0)
        + exp.amount;
    });

    const labels = Object.keys(categories);
    const values = Object.values(categories);

    const ctx =
    document.getElementById("expenseChart");

    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx,{
        type:"pie",

        data:{
            labels:labels,
            datasets:[{
                data:values
            }]
        },

        options:{
            responsive:true
        }
    });
}

function saveData(){

    localStorage.setItem(
        "budget",
        JSON.stringify(budget)
    );

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );
}

function loadData(){

    budget =
    JSON.parse(
        localStorage.getItem("budget")
    ) || 0;

    expenses =
    JSON.parse(
        localStorage.getItem("expenses")
    ) || [];

    updateUI();
}

themeToggle.addEventListener("click",()=>{

    document.body.classList.toggle("dark");
});