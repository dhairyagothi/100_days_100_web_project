const addTaskbtn = document.getElementById("addTaskBtn");
const taskinput = document.getElementById("taskInput");
const todoList = document.querySelector("#todo .task-list");

addTaskbtn.addEventListener("click",function(){

    const taskText = taskinput.value;
    if (taskText == ""){
        return;
    }
    const task = document.createElement("div");
    task.classList.add("task");
    task.textContent = taskText;

    task.setAttribute("draggable","true");

    task.addEventListener("dragstart",function(){
        task.classList.add("dragging");

    });

    task.addEventListener("dragend",function(){
        task.classList.remove("dragging");
    });

    todoList.appendChild(task);
    saveTask();
    taskinput.value ="";



});

const columns = document.querySelectorAll(".task-list");

columns.forEach(function(column){
    column.addEventListener("dragover", function(e){
    e.preventDefault();
});

column.addEventListener("drop", function(){

    const draggingTask =
        document.querySelector(".dragging");

    column.appendChild(draggingTask);

    saveTask();

});
});

function saveTask(){
    const allTasks = document.querySelectorAll(".task");
    const taskData =[];
    allTasks.forEach(function(task){

        const parentColumn = task.parentElement.parentElement.id;

        taskData.push({
            text : task.textContent,
            status: parentColumn
        });
    });

    localStorage.setItem(
        "tasks",
        JSON.stringify(taskData)
    );
}

function loadTasks(){

    const savedTasks =
        JSON.parse(localStorage.getItem("tasks"));

    if(!savedTasks){
        return;
    }

    savedTasks.forEach(function(taskData){

        const task =
            document.createElement("div");

        task.classList.add("task");

        task.textContent = taskData.text;

        task.setAttribute("draggable", "true");

        task.addEventListener("dragstart", function(){

            task.classList.add("dragging");

        });

        task.addEventListener("dragend", function(){

            task.classList.remove("dragging");

        });

        const column =
            document.querySelector(
                `#${taskData.status} .task-list`
            );

        column.appendChild(task);

    });

}

loadTasks();