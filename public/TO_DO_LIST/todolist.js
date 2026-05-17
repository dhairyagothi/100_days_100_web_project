let total = 0;
let done = 0;

function addTask(){
  const input = document.getElementById("taskInput");
  const priority = document.getElementById("priority").value;

  const text = input.value.trim();
  if(!text) return;

  total++;

  const div = document.createElement("div");
  div.className = "task";

  div.innerHTML = `
    <div class="left">
      <div class="title">${text}</div>
      <div class="badges">
        <span class="badge ${priority}">${priority.toUpperCase()}</span>
      </div>
    </div>

    <div class="right">
      <input type="checkbox" onchange="toggle(this)">
      <button class="btn" onclick="del(this)">Delete</button>
    </div>
  `;

  document.getElementById("taskList").appendChild(div);
  input.value = "";

  updateStats();
}

function toggle(cb){
  const task = cb.closest(".task");
  const title = task.querySelector(".title");

  if(cb.checked){
    done++;
    title.classList.add("done");
  }else{
    done--;
    title.classList.remove("done");
  }

  updateStats();
}

function del(btn){
  const task = btn.closest(".task");
  const cb = task.querySelector("input");

  if(cb.checked) done--;
  total--;

  task.remove();
  updateStats();
}

function updateStats(){
  document.getElementById("totalCard").innerText = `Total: ${total}`;
  document.getElementById("doneCard").innerText = `Done: ${done}`;

  const percent = total === 0 ? 0 : Math.round((done/total)*100);

  document.getElementById("progressText").innerText = percent + "% completed";
  document.getElementById("barFill").style.width = percent + "%";
}
