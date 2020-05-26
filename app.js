const input = document.querySelector('input');
const button = document.querySelector('#button');
const allUl = document.querySelectorAll('ul')[0];
const todayUl = document.querySelectorAll('ul')[1];
const completeUl = document.querySelectorAll('ul')[2];
const clearBtn = document.querySelector('.btn-clear');

button.addEventListener('click', taskAdd);
document.body.addEventListener('click', taskDelete);
document.body.addEventListener('click', taskToday);
document.body.addEventListener('click', taskComplete);
clearBtn.addEventListener('click', clearAll);

// ADD TASK FUNCTION 
function taskAdd () {
  if (!input.value) {
    alert('Please enter a task!')
  } else {
  const listItem = document.createElement('li');
  listItem.innerHTML = `${input.value} <i class="far fa-calendar-plus"></i> <i class="fas fa-check"></i> <i class="fas fa-trash-alt"></i> `;
  allUl.appendChild(listItem);
}
  input.value = '';
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
  // for (let i = allTasks.length - 1; i >= 0; i--) {
    
  // }
  let n = allTasks.length;
  while (n > 0) {
    n-- 
  allTasks[n].remove();
}
}





