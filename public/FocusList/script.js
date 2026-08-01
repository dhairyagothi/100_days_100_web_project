let tasks = JSON.parse(localStorage.getItem("focusTasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// Load Tasks
render();

// Add Task
function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        done: false
    });

    taskInput.value = "";

    saveTasks();

    render();

}

// Enter Key
taskInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        addTask();

    }

});

// Toggle Complete
function toggleTask(index){

    tasks[index].done = !tasks[index].done;

    saveTasks();

    render();

}

// Delete Single Task
function deleteTask(index){

    tasks.splice(index,1);

    saveTasks();

    render();

}

// Delete All
function deleteAllTasks(){

    if(tasks.length===0){

        alert("No tasks available.");

        return;

    }

    if(confirm("Delete all tasks?")){

        tasks=[];

        saveTasks();

        render();

    }

}

// Save Local Storage
function saveTasks(){

    localStorage.setItem("focusTasks",JSON.stringify(tasks));

}

// Render
function render(){

    taskList.innerHTML="";

    let completed=0;

    if(tasks.length===0){

        taskList.innerHTML=`
            <div class="empty">
                🌟 No tasks yet.<br><br>
                Add your first task and start being productive!
            </div>
        `;

    }

    tasks.forEach((task,index)=>{

        if(task.done){

            completed++;

        }

        const li=document.createElement("li");

        li.innerHTML=`

            <div class="task-left">

                <input
                    type="checkbox"
                    ${task.done ? "checked" : ""}
                    onchange="toggleTask(${index})"
                >

                <span class="${task.done ? "completed" : ""}">
                    ${task.text}
                </span>

            </div>

            <button
                class="delete-btn"
                onclick="deleteTask(${index})">

                🗑

            </button>

        `;

        taskList.appendChild(li);

    });

    // Stats

    totalTasks.innerText=tasks.length;

    completedTasks.innerText=completed;

    pendingTasks.innerText=tasks.length-completed;

    // Progress

    let percent=0;

    if(tasks.length>0){

        percent=Math.round((completed/tasks.length)*100);

    }

    progress.style.width=percent+"%";

    progressText.innerText=percent+"%";

}
