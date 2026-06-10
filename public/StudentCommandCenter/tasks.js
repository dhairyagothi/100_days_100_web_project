const taskContainer = document.getElementById("allTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks() {

    taskContainer.innerHTML = "";

    if(tasks.length === 0) {

        taskContainer.innerHTML =
            "<p>No tasks available.</p>";

        return;
    }

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span>${task}</span>
            <button onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        taskContainer.appendChild(li);
    });
}

function deleteTask(index) {

    tasks.splice(index, 1);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

    renderTasks();
}

renderTasks();