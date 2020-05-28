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
    tasks = retrieveTasks("allTasks");
    tasks.push(input.value);
    localStorage.setItem("allTasks", JSON.stringify(tasks));
  }
  input.value = "";
  event.preventDefault();
}

// RETRIEVE TASKS FROM LOCAL STORAGE

function retrieveTasks(taskList) {
  let tasks;
  if (localStorage.getItem(taskList) === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem(taskList));
  }
  return tasks;
}

// REMOVE SINGLE TASK FROM ARRAY
function taskSplice(e, tasks, key) {
  tasks.forEach((obj, index) => {
    if (e.target.parentElement.textContent.includes(obj)) {
      tasks.splice(index, 1);
    }
  });
  localStorage.setItem(key, JSON.stringify(tasks));
}

// SET ATTRIBUTES FOR THE LIST ITEMS
function setAttributes(data) {
  data.setAttribute("draggable", "true");
  data.setAttribute("ondragstart", "dragstart_handler(event)");
  n += 1;
  data.setAttribute("id", `item${n}`);
  data.classList.add("example");
}

// GET TASKS FROM LOCAL STORAGE

function getFromLS(key, icons, ul) {
  let tasks = JSON.parse(localStorage.getItem(key));
  for (let task of tasks) {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${task} ${icons}`;
    ul.appendChild(listItem);
    setAttributes(listItem);
  }
}

// ATTACH LOCALLY STORED TASKS TO THE DOM

window.onload = () => {
  if (localStorage.getItem("allTasks") !== null) {
    getFromLS("allTasks", icons, allUl);
  }
  if (localStorage.getItem("completeTasks") !== null) {
    getFromLS("completeTasks", icons, completeUl);
  }
  if (localStorage.getItem("todayTasks") !== null) {
    getFromLS("todayTasks", icons, todayUl);
  }
};

// DELETE TASK FUNCTION
function taskDelete(e) {
  if (e.target.className.includes("fa-trash")) {
    const listName = e.target.parentElement.parentElement.parentElement.id;
    switch (listName) {
      case "all":
        tasks = retrieveTasks("allTasks");
        taskSplice(e, tasks, "allTasks");
        e.target.parentElement.remove();
        break;
      case "today":
        tasks = retrieveTasks("todayTasks");
        taskSplice(e, tasks, "todayTasks");
        e.target.parentElement.remove();
        break;
      case "completed":
        tasks = retrieveTasks("completeTasks");
        taskSplice(e, tasks, "completeTasks");
        e.target.parentElement.remove();
        break;
    }
  }
}

// MOVE TASK TO TODAY
function taskToday(e) {
  if (e.target.className.includes("fa-calendar")) {
    e.target.parentElement.remove();
    todayUl.appendChild(e.target.parentElement);

    todayTasks = retrieveTasks("todayTasks");
    todayTasks.push(e.target.parentElement.textContent);

    localStorage.setItem("todayTasks", JSON.stringify(todayTasks));

    allTasks = retrieveTasks("allTasks");
    taskSplice(e, allTasks, "allTasks");

    completeTasks = retrieveTasks("completeTasks");
    taskSplice(e, completeTasks, "completeTasks");
  }
}

// COMPLETED TASK
function taskComplete(e) {
  if (e.target.className.includes("fa-check")) {
    const listName = e.target.parentElement.parentElement.parentElement.id;
    e.target.parentElement.remove();
    completeUl.appendChild(e.target.parentElement);

    completeTasks = retrieveTasks("completeTasks");
    completeTasks.push(e.target.parentElement.textContent);
    localStorage.setItem("completeTasks", JSON.stringify(completeTasks));

    if (listName === "all") {
      tasks = retrieveTasks("allTasks");
      taskSplice(e, tasks, "allTasks");
    } else if (listName === "today") {
      todayTasks = retrieveTasks("todayTasks");
      taskSplice(e, todayTasks, "todayTasks");
    }
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
  localStorage.removeItem("allTasks");
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
  tasks = retrieveTasks("todayTasks");
  allTasks = retrieveTasks("allTasks");
  tasks.forEach((obj) => {
    allTasks.push(obj);
    localStorage.removeItem("todayTasks", obj);
  });
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

// CLEAR ALL COMPLETED TASKS
function clearCompleted() {
  const allCompleted = completeUl.querySelectorAll("li");
  let n = allCompleted.length;
  while (n > 0) {
    n--;
    allCompleted[n].remove();
  }
  localStorage.removeItem("completeTasks");
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
