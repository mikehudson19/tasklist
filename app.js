const input = document.querySelector("input");
const form = document.querySelector("form");
const allUl = document.querySelectorAll("ul")[0];
const todayUl = document.querySelectorAll("ul")[1];
const completeUl = document.querySelectorAll("ul")[2];
const clearBtn = document.querySelector(".btn-clear");
const moveBtn = document.querySelector(".btn-move");
const clearCompleteBtn = document.querySelector(".btn-completed");
const alert = document.querySelector('.alert');
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
  if (!input.value) { // If no task has been entered
    alert.style.display = 'block';
    alert.style.display = 'flex';
    document.querySelector('.alert-btn').addEventListener('click', () => {
    alert.style.display = 'none';
    })
  } else { // If a task has been entered
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
function taskSplice(e, key) {
  tasks = retrieveTasks(key);
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
  data.classList.add("drag");
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

// MOVE TASK FROM CURRENT LIST TO SELECTED LIST
function onMove (e, ul, key) {
  e.target.parentElement.remove();
  ul.appendChild(e.target.parentElement);
  tasks = retrieveTasks(key);
  tasks.push(e.target.parentElement.innerText);
  localStorage.setItem(key, JSON.stringify(tasks));
};

// REMOVE THE TASK ITEM FROM THE LS THAT IT CAME FROM UPON DRAGGING IT
function removeOnDrag (data, key) {
  const movedTask = document.getElementById(data).innerText;
    const allTasks = retrieveTasks(key); 
    allTasks.forEach((obj, index) => {
      if (obj === movedTask) {
        allTasks.splice(index, 1);
      } 
      localStorage.setItem(key, JSON.stringify(allTasks));
    })
}

// RETRIEVE TASKS FROM LS AND ATTACH TO THE DOM
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
    // Determine which list the selected task is in and remove from DOM and LS
    switch (listName) {
      case "all":
        taskSplice(e, "allTasks");
        e.target.parentElement.remove();
        break;
      case "today":
        taskSplice(e, "todayTasks");
        e.target.parentElement.remove();
        break;
      case "completed":
        taskSplice(e, "completeTasks");
        e.target.parentElement.remove();
        break;
    }
  }
}



// MOVE TASK TO TODAY LIST
function taskToday(e) {
  if (e.target.className.includes("fa-calendar")) {
    const listName = e.target.parentElement.parentElement.parentElement.id;
    // Move seleted task to 'today' in DOM and LS
    onMove(e, todayUl, "todayTasks");

    // Check which list the moved task came from and remove it from that LS key
    if (listName === "all") {
      taskSplice(e, "allTasks");
    } else if (listName === "completed") {
      taskSplice(e, "completeTasks");
    }
  }
}

// MOVE TASK TO COMPLETED LIST
function taskComplete(e) {
  if (e.target.className.includes("fa-check")) {
    const listName = e.target.parentElement.parentElement.parentElement.id;
     // Move seleted task to 'complete' in DOM and LS
    onMove(e, completeUl, 'completeTasks')
  
    // Check which list the moved task came from and remove it from that LS key
    if (listName === "all") {
      taskSplice(e, "allTasks");
    } else if (listName === "today") {
      taskSplice(e, "todayTasks");
    }
  }
}

// CLEAR ALL TASKS
function clearAll() {
  const allTasks = allUl.querySelectorAll("li");
  let n = allTasks.length;
  // Loop through the all tasks list and remove each task
  while (n > 0) {
    n--;
    allTasks[n].remove();
  }
  // Remove the 'allTasks' key from local storage
  localStorage.removeItem("allTasks");
}

// MOVE ALL TASKS BACK TO ALL
function moveAll() {
  const todayTasks = todayUl.querySelectorAll("li");
  let n = todayTasks.length;
  // While there are tasks in the 'today' UL, remove them an append to the 'all' UL
  while (n > 0) {
    n--;
    todayTasks[n].remove();
    allUl.appendChild(todayTasks[n]);
  }
  // Retrieve 'all' and 'today' tasks from LS
  tasks = retrieveTasks("todayTasks");
  allTasks = retrieveTasks("allTasks");
  // Add each task in 'today' to 'all' and remove from 'today'
  tasks.forEach((obj) => {
    allTasks.push(obj);
    localStorage.removeItem("todayTasks", obj);
  });
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
}

// CLEAR ALL COMPLETED TASKS
function clearCompleted() {
  const completed = completeUl.querySelectorAll("li");
  let n = completed.length;
  // While there are still tasks in 'completed', loop through and remove
  while (n > 0) { 
    n--;
    completed[n].remove();
  }
  // Remove the comeplete tasks key from LS
  localStorage.removeItem("completeTasks");
}


// ADD DRAG AND DROP FUNCTIONALITY

function dragstart_handler(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

function dragover_handler(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}

function drop_handler(e) {
  e.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = e.dataTransfer.getData("text/plain");
  e.target.appendChild(document.getElementById(data));

// NEED THE BELOW CODE TO WORK FOR EACH LIST - IT MUST DETECT WHICH LIST THE TASK CAME FROM SO THAT IT KNOWS WHICH LS KEY TO DELETE IT FROM
  
  if (e.target.parentElement.id === 'today') {
    // Move selected task to 'today' in LS
    tasks = retrieveTasks('todayTasks');
    tasks.push(document.getElementById(data).innerText);
    localStorage.setItem('todayTasks', JSON.stringify(tasks));
    // Remove the item from original list LS
    removeOnDrag(data, 'allTasks');
    removeOnDrag(data, 'completeTasks');
  }
  
  if (e.target.parentElement.id === 'completed') {
    // Move selected task to 'today' in LS
    tasks = retrieveTasks('completeTasks');
    tasks.push(document.getElementById(data).innerText);
    localStorage.setItem('completeTasks', JSON.stringify(tasks));
    // Remove the item from original list LS
    removeOnDrag(data, 'allTasks');
    removeOnDrag(data, 'todayTasks');
  }

  if (e.target.parentElement.id === 'all') {
    // Move selected task to 'today' in LS
    tasks = retrieveTasks('allTasks');
    tasks.push(document.getElementById(data).innerText);
    localStorage.setItem('allTasks', JSON.stringify(tasks));
    // Remove the item from original list LS
    removeOnDrag(data, 'completeTasks');
    removeOnDrag(data, 'todayTasks');
  }


}

window.addEventListener("mousedown", (e) => {
  let selectedTask;
  if (e.target.className.includes("drag")) {
    selectedTask = e.target;
    selectedTask.addEventListener("dragstart", dragstart_handler);
  }
});

