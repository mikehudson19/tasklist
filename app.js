const input = document.querySelector('input');
const form = document.querySelector('form');
const allUl = document.querySelectorAll('ul')[0];
const todayUl = document.querySelectorAll('ul')[1];
const completeUl = document.querySelectorAll('ul')[2];
const clearBtn = document.querySelector('.btn-clear');
const moveBtn = document.querySelector('.btn-move');
const clearCompleteBtn = document.querySelector('.btn-completed')

form.addEventListener('submit', taskAdd);
document.body.addEventListener('click', taskDelete);
document.body.addEventListener('click', taskToday);
document.body.addEventListener('click', taskComplete);
clearBtn.addEventListener('click', clearAll);
moveBtn.addEventListener('click', moveAll);
clearCompleteBtn.addEventListener('click', clearCompleted);



// ADD TASK FUNCTION 
function taskAdd (event) {
  if (!input.value) {
    alert('Please enter a task!')
  } else {
    const listItem = document.createElement('li');
    listItem.setAttribute('draggable', 'true');
    listItem.setAttribute('ondragstart', 'dragstart_handler(event)');
    listItem.setAttribute('id', 'item');
    listItem.classList.add('example');
    listItem.innerHTML = `${input.value} <i class="far fa-calendar-plus"></i> <i class="fas fa-check"></i> <i class="fas fa-trash-alt"></i> `;
    allUl.appendChild(listItem);
  }
  input.value = '';
  event.preventDefault();
}



// DELETE TASK FUNCTION 
function taskDelete (e) {
  if (e.target.className.includes('fa-trash')) {
    e.target.parentElement.remove();
  } 
}

// MOVE TASK TO TODAY 
function taskToday (e) {
  if (e.target.className.includes('fa-calendar')) {
    e.target.parentElement.remove();
    todayUl.appendChild(e.target.parentElement);
  }
}

// COMPLETED TASK
function taskComplete (e) {
  if (e.target.className.includes('fa-check')) {
    e.target.parentElement.remove();
    completeUl.appendChild(e.target.parentElement);
  }
}
// CLEAR ALL TASKS 
function clearAll () {
  const allTasks = allUl.querySelectorAll('li'); 
  let n = allTasks.length;
  while (n > 0) {
    n-- 
  allTasks[n].remove();
}
}

// MOVE ALL TASKS BACK TO ALL
function moveAll () {
  const todayTasks = todayUl.querySelectorAll('li');
  let n = todayTasks.length;
  while (n > 0) {
    n-- 
    todayTasks[n].remove();
    allUl.appendChild(todayTasks[n]);
  }
}

// CLEAR ALL COMPLETED TASKS
function clearCompleted () {
  const allCompleted = completeUl.querySelectorAll('li');
  let n = allCompleted.length;
  while (n > 0) {
    n--
    allCompleted[n].remove();
  }
}

// ADD DRAG AND DROP FUNCTIONALITY

function dragstart_handler(ev) {
  ev.dataTransfer.setData("text/plain", ev.target.id);
  console.log('works');
}

function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
 }

 function drop_handler(ev) {
  ev.preventDefault();
  // Get the id of the target and add the moved element to the target's DOM
  const data = ev.dataTransfer.getData("text/plain");
  console.log(data);
  ev.target.appendChild(document.getElementById(data));
 }
 

window.addEventListener('click', (ev) => {
let selectedTask;

  if (ev.target.className.includes('example')) {
    selectedTask = ev.target;
    selectedTask.addEventListener('dragstart', dragstart_handler);
  }
}
)



