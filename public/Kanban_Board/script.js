/* =====================================
   STORAGE
===================================== */

const STORAGE_KEY = "advancedKanbanData";

let appData =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) ||
    {
        activeBoardId: 1,
        boards: [
            {
                id: 1,
                name: "My Board",
                tasks: []
            }
        ]
    };

function saveData() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(appData)
    );
}

/* =====================================
   DOM
===================================== */

const boardList = document.getElementById("boardList");

const currentBoardTitle =
    document.getElementById(
        "currentBoardTitle"
    );

const addBoardBtn =
    document.getElementById(
        "addBoardBtn"
    );

const renameBoardBtn =
    document.getElementById(
        "renameBoardBtn"
    );

/* Analytics */

const totalTasksEl =
    document.getElementById(
        "totalTasks"
    );

const completedTasksEl =
    document.getElementById(
        "completedTasks"
    );

const progressTasksEl =
    document.getElementById(
        "progressTasks"
    );

const pendingTasksEl =
    document.getElementById(
        "pendingTasks"
    );

const completionRateEl =
    document.getElementById(
        "completionRate"
    );

/* Modals */

const taskModal =
    document.getElementById(
        "taskModal"
    );

const taskDetailsModal =
    document.getElementById(
        "taskDetailsModal"
    );

/* Task Inputs */

const taskTitleInput =
    document.getElementById(
        "taskTitle"
    );

const taskDescriptionInput =
    document.getElementById(
        "taskDescription"
    );

const addSubtaskBtn =
    document.getElementById(
        "addSubtaskBtn"
    );

const saveTaskBtn =
    document.getElementById(
        "saveTaskBtn"
    );

const subtaskContainer =
    document.getElementById(
        "subtaskContainer"
    );

/* =====================================
   ACTIVE BOARD
===================================== */

function getActiveBoard() {
    return appData.boards.find(
        board =>
            board.id ===
            appData.activeBoardId
    );
}

/* =====================================
   BOARD RENDERING
===================================== */

function renderBoards() {

    boardList.innerHTML = "";

    appData.boards.forEach(board => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "board-item";

        if (
            board.id ===
            appData.activeBoardId
        ) {
            item.classList.add(
                "active"
            );
        }

        item.innerHTML = `
            <span>${board.name}</span>
        `;

        item.addEventListener(
            "click",
            () => {

                appData.activeBoardId =
                    board.id;

                saveData();

                renderBoards();
                renderTasks();
                updateDashboard();
            }
        );

        boardList.appendChild(item);
    });

    const activeBoard =
        getActiveBoard();

    currentBoardTitle.textContent =
        activeBoard.name;
}

/* =====================================
   ADD BOARD
===================================== */

addBoardBtn.addEventListener(
    "click",
    () => {

        const boardName =
            prompt(
                "Enter board name"
            );

        if (
            !boardName ||
            !boardName.trim()
        )
            return;

        const newBoard = {
            id: Date.now(),
            name: boardName.trim(),
            tasks: []
        };

        appData.boards.push(
            newBoard
        );

        appData.activeBoardId =
            newBoard.id;

        saveData();

        renderBoards();
        renderTasks();
        updateDashboard();
    }
);

/* =====================================
   RENAME BOARD
===================================== */

renameBoardBtn.addEventListener(
    "click",
    () => {

        const board =
            getActiveBoard();

        const newName =
            prompt(
                "Rename board",
                board.name
            );

        if (
            !newName ||
            !newName.trim()
        )
            return;

        board.name =
            newName.trim();

        saveData();

        renderBoards();
    }
);

/* =====================================
   TASK MODAL
===================================== */

let currentTaskStatus =
    "todo";

document
    .querySelectorAll(
        ".add-column-task"
    )
    .forEach(btn => {

        btn.addEventListener(
            "click",
            () => {

                currentTaskStatus =
                    btn.dataset.status;

                taskModal.classList.add(
                    "show"
                );

                taskTitleInput.value =
                    "";

                taskDescriptionInput.value =
                    "";

                subtaskContainer.innerHTML =
                    "";
            }
        );
    });

document
    .querySelector(
        ".close-modal"
    )
    .addEventListener(
        "click",
        () => {
            taskModal.classList.remove(
                "show"
            );
        }
    );

    /* =====================================
   SUBTASKS
===================================== */

addSubtaskBtn.addEventListener(
    "click",
    () => {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "subtask-item";

        wrapper.innerHTML = `
            <input
                type="text"
                class="subtask-input"
                placeholder="Subtask name"
            />

            <button
                class="remove-subtask">
                ✕
            </button>
        `;

        wrapper
            .querySelector(
                ".remove-subtask"
            )
            .addEventListener(
                "click",
                () => wrapper.remove()
            );

        subtaskContainer.appendChild(
            wrapper
        );
    }
);

/* =====================================
   CREATE TASK
===================================== */

saveTaskBtn.addEventListener(
    "click",
    () => {

        const title =
            taskTitleInput.value.trim();

        const description =
            taskDescriptionInput.value.trim();

        if (!title) {
            alert(
                "Task title is required"
            );
            return;
        }

        const subtasks = [];

        document
            .querySelectorAll(
                ".subtask-input"
            )
            .forEach(input => {

                const value =
                    input.value.trim();

                if (value) {

                    subtasks.push({
                        id: Date.now() +
                            Math.random(),
                        text: value,
                        completed: false
                    });
                }
            });

        const task = {
            id: Date.now(),

            title,

            description,

            status:
                currentTaskStatus,

            subtasks
        };

        const board =
            getActiveBoard();

        board.tasks.push(task);

        saveData();

        taskModal.classList.remove(
            "show"
        );

        renderTasks();
        updateDashboard();
    }
);

/* =====================================
   PROGRESS
===================================== */

function calculateProgress(
    task
) {

    if (
        !task.subtasks ||
        task.subtasks.length === 0
    ) {
        return 0;
    }

    const completed =
        task.subtasks.filter(
            s => s.completed
        ).length;

    return Math.round(
        (
            completed /
            task.subtasks.length
        ) * 100
    );
}

/* =====================================
   TASK CARD
===================================== */

function createTaskElement(
    task
) {

    const progress =
        calculateProgress(task);

    const div =
        document.createElement("div");

    div.className =
        "task";

    div.draggable = true;

    div.dataset.id =
        task.id;

    div.innerHTML = `

        <div class="task-title">
            ${task.title}
        </div>

        <div class="task-description">
            ${
                task.description ||
                "No description"
            }
        </div>

        <div class="task-progress">

            <div class="progress-info">
                <span>
                    Progress
                </span>

                <span>
                    ${progress}%
                </span>
            </div>

            <div class="progress-bar">
                <div
                    class="progress-fill"
                    style="
                        width:${progress}%">
                </div>
            </div>

        </div>

    `;

    div.addEventListener(
        "dragstart",
        () => {
            div.classList.add(
                "dragging"
            );
        }
    );

    div.addEventListener(
        "dragend",
        () => {
            div.classList.remove(
                "dragging"
            );
        }
    );

    div.addEventListener(
        "click",
        () => {
            openTaskDetails(task.id);
        }
    );

    return div;
}

/* =====================================
   RENDER TASKS
===================================== */

function renderTasks() {

    document
        .querySelectorAll(
            ".task-container"
        )
        .forEach(container => {
            container.innerHTML = "";
        });

    const board =
        getActiveBoard();

    board.tasks.forEach(task => {

        const column =
            document.getElementById(
                task.status
            );

        if (!column) return;

        column.appendChild(
            createTaskElement(task)
        );
    });

    document
        .querySelectorAll(
            ".task-container"
        )
        .forEach(container => {

            if (
                container.children
                    .length === 0
            ) {

                container.innerHTML =
                    `
                    <div class="empty-column">
                        No tasks yet
                    </div>
                    `;
            }
        });
}

/* =====================================
   DASHBOARD
===================================== */

function updateDashboard() {

    const board =
        getActiveBoard();

    const tasks =
        board.tasks;

    const total =
        tasks.length;

    const completed =
        tasks.filter(
            t =>
                t.status ===
                "completed"
        ).length;

    const inProgress =
        tasks.filter(
            t =>
                t.status ===
                "progress"
        ).length;

    const pending =
        tasks.filter(
            t =>
                t.status ===
                    "todo" ||
                t.status ===
                    "review"
        ).length;

    const percentage =
        total === 0
            ? 0
            : Math.round(
                  (
                      completed /
                      total
                  ) * 100
              );

    totalTasksEl.textContent =
        total;

    completedTasksEl.textContent =
        completed;

    progressTasksEl.textContent =
        inProgress;

    pendingTasksEl.textContent =
        pending;

    completionRateEl.textContent =
        percentage + "%";
}

/* =====================================
   TASK DETAILS MODAL
===================================== */

const detailTaskTitle =
    document.getElementById(
        "detailTaskTitle"
    );

const detailTaskDescription =
    document.getElementById(
        "detailTaskDescription"
    );

const detailProgressPercent =
    document.getElementById(
        "detailProgressPercent"
    );

const detailProgressFill =
    document.getElementById(
        "detailProgressFill"
    );

const detailSubtaskList =
    document.getElementById(
        "detailSubtaskList"
    );

const deleteTaskBtn =
    document.getElementById(
        "deleteTaskBtn"
    );

let selectedTaskId = null;

function openTaskDetails(
    taskId
) {

    const board =
        getActiveBoard();

    const task =
        board.tasks.find(
            t => t.id === taskId
        );

    if (!task) return;

    selectedTaskId = task.id;

    detailTaskTitle.textContent =
        task.title;

    detailTaskDescription.textContent =
        task.description ||
        "No description available";

    const progress =
        calculateProgress(task);

    detailProgressPercent.textContent =
        progress + "%";

    detailProgressFill.style.width =
        progress + "%";

    detailSubtaskList.innerHTML =
        "";

    if (
        !task.subtasks ||
        task.subtasks.length === 0
    ) {

        detailSubtaskList.innerHTML =
            `
            <div class="empty-column">
                No subtasks available
            </div>
            `;

    } else {

        task.subtasks.forEach(
            subtask => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "detail-subtask";

                if (
                    subtask.completed
                ) {
                    item.classList.add(
                        "completed"
                    );
                }

                item.innerHTML = `
                    <input
                        type="checkbox"
                        ${
                            subtask.completed
                                ? "checked"
                                : ""
                        }
                    />

                    <span>
                        ${subtask.text}
                    </span>
                `;

                const checkbox =
                    item.querySelector(
                        "input"
                    );

                checkbox.addEventListener(
                    "change",
                    () => {

                        subtask.completed =
                            checkbox.checked;

                        saveData();

                        renderTasks();

                        updateDashboard();

                        openTaskDetails(
                            task.id
                        );
                    }
                );

                detailSubtaskList.appendChild(
                    item
                );
            }
        );
    }

    taskDetailsModal.classList.add(
        "show"
    );
}

/* =====================================
   CLOSE DETAILS MODAL
===================================== */

document
    .querySelector(
        ".close-details"
    )
    .addEventListener(
        "click",
        () => {

            taskDetailsModal.classList.remove(
                "show"
            );
        }
    );

/* =====================================
   DELETE TASK
===================================== */

deleteTaskBtn.addEventListener(
    "click",
    () => {

        if (
            selectedTaskId === null
        )
            return;

        const confirmed =
            confirm(
                "Delete this task?"
            );

        if (!confirmed)
            return;

        const board =
            getActiveBoard();

        board.tasks =
            board.tasks.filter(
                task =>
                    task.id !==
                    selectedTaskId
            );

        saveData();

        taskDetailsModal.classList.remove(
            "show"
        );

        renderTasks();

        updateDashboard();
    }
);

/* =====================================
   DRAG & DROP
===================================== */

document
    .querySelectorAll(
        ".task-container"
    )
    .forEach(container => {

        container.addEventListener(
            "dragover",
            e => {
                e.preventDefault();
            }
        );

        container.addEventListener(
            "drop",
            () => {

                const dragged =
                    document.querySelector(
                        ".dragging"
                    );

                if (!dragged)
                    return;

                const taskId =
                    Number(
                        dragged.dataset.id
                    );

                const board =
                    getActiveBoard();

                const task =
                    board.tasks.find(
                        t =>
                            t.id ===
                            taskId
                    );

                if (!task)
                    return;

                task.status =
                    container.id;

                saveData();

                renderTasks();

                updateDashboard();
            }
        );
    });

/* =====================================
   THEME TOGGLE
===================================== */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

const savedTheme =
    localStorage.getItem(
        "kanbanTheme"
    );

if (
    savedTheme === "dark"
) {

    document.body.classList.add(
        "dark"
    );

    themeToggle.textContent =
        "☀️ Light Mode";
}

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        const isDark =
            document.body.classList.contains(
                "dark"
            );

        if (isDark) {

            localStorage.setItem(
                "kanbanTheme",
                "dark"
            );

            themeToggle.textContent =
                "☀️ Light Mode";

        } else {

            localStorage.setItem(
                "kanbanTheme",
                "light"
            );

            themeToggle.textContent =
                "🌙 Dark Mode";
        }
    }
);

/* =====================================
   CLOSE MODALS ON OUTSIDE CLICK
===================================== */

window.addEventListener(
    "click",
    e => {

        if (
            e.target === taskModal
        ) {

            taskModal.classList.remove(
                "show"
            );
        }

        if (
            e.target ===
            taskDetailsModal
        ) {

            taskDetailsModal.classList.remove(
                "show"
            );
        }
    }
);

/* =====================================
   INITIALIZE APP
===================================== */

renderBoards();
renderTasks();
updateDashboard();