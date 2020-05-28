const input = document.querySelector("input");
const form = document.querySelector("form");
const allUl = document.querySelectorAll("ul")[0];
const todayUl = document.querySelectorAll("ul")[1];
const completeUl = document.querySelectorAll("ul")[2];
const clearBtn = document.querySelector(".btn-clear");
const moveBtn = document.querySelector(".btn-move");
const clearCompleteBtn = document.querySelector(".btn-completed");
const icons =
  '<i class="far fa-calendar-plus"></i> <i class="fas fa-check"></i> <i class="fas fa-trash-alt"></i>';

form.addEventListener("submit", taskAdd);
document.body.addEventListener("click", taskDelete);
document.body.addEventListener("click", taskToday);
document.body.addEventListener("click", taskComplete);
clearBtn.addEventListener("click", clearAll);
moveBtn.addEventListener("click", moveAll);
clearCompleteBtn.addEventListener("click", clearCompleted);
// ADD TASK FUNCTION
let n = 0;
function taskAdd(event) {
  if (!input.value) {
    alert("Please enter a task!");
  } else {
    const listItem = document.createElement("li");
    setAttributes(listItem);

    listItem.innerHTML = `${input.value} ${icons}`;
    allUl.appendChild(listItem);

    let tasks;
    if (localStorage.getItem("allTasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("allTasks"));
    }
    tasks.push(input.value);
    localStorage.setItem("allTasks", JSON.stringify(tasks));
  }
  input.value = "";
  event.preventDefault();
}

// PERSIST ADDED TASKS TO LOCAL STORAGE

window.onload = () => {
  if (localStorage.getItem("allTasks") !== null) {
    let tasks = JSON.parse(localStorage.getItem("allTasks"));
    for (let task of tasks) {
      const listItem = document.createElement("li");
      setAttributes(listItem);
      listItem.innerHTML = `${task} ${icons}`;
      allUl.appendChild(listItem);
    }
  }
};

// SET ATTRIBUTES FOR THE LIST ITEMS
function setAttributes(data) {
  data.setAttribute("draggable", "true");
  data.setAttribute("ondragstart", "dragstart_handler(event)");
  n += 1;
  data.setAttribute("id", `item${n}`);
  data.classList.add("example");
}

// DELETE TASK FUNCTION
function taskDelete(e) {
  if (e.target.className.includes("fa-trash")) {
    let tasks;
    if (localStorage.getItem("allTasks") === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem("allTasks"));
    }
    // remove deleted task from local storage
    tasks.forEach((obj, index) => {
      if (e.target.parentElement.textContent.includes(obj)) {
        tasks.splice(index, 1);
      }
    });
    localStorage.setItem("allTasks", JSON.stringify(tasks));
    e.target.parentElement.remove();
  }
}

// MOVE TASK TO TODAY
function taskToday(e) {
  if (e.target.className.includes("fa-calendar")) {
    e.target.parentElement.remove();
    todayUl.appendChild(e.target.parentElement);
  }
}

// COMPLETED TASK
function taskComplete(e) {
  if (e.target.className.includes("fa-check")) {
    e.target.parentElement.remove();
    completeUl.appendChild(e.target.parentElement);
  }
}
// CLEAR ALL TASKS
function clearAll() {
  const allTasks = allUl.querySelectorAll("li");
  let n = allTasks.length;
  while (n > 0) {
    n--;
    allTasks[n].remove();
  }
  localStorage.clear();
}

// MOVE ALL TASKS BACK TO ALL
function moveAll() {
  const todayTasks = todayUl.querySelectorAll("li");
  let n = todayTasks.length;
  while (n > 0) {
    n--;
    todayTasks[n].remove();
    allUl.appendChild(todayTasks[n]);
  }
}

// CLEAR ALL COMPLETED TASKS
function clearCompleted() {
  const allCompleted = completeUl.querySelectorAll("li");
  let n = allCompleted.length;
  while (n > 0) {
    n--;
    allCompleted[n].remove();
  }
}

// ADD DRAG AND DROP FUNCTIONALITY

function dragstart_handler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text/plain");
  ev.target.appendChild(document.getElementById(data));
}

window.addEventListener("mousedown", (ev) => {
  let selectedTask;
  if (ev.target.className.includes("example")) {
    selectedTask = ev.target;
    selectedTask.addEventListener("dragstart", dragstart_handler);
  }
});
