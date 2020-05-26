const input = document.querySelector('input');
const button = document.querySelector('#button');
const allUl = document.querySelectorAll('ul')[0];
const todayUl = document.querySelectorAll('ul')[1];

button.addEventListener('click', taskAdd);
document.body.addEventListener('click', taskDelete);
document.body.addEventListener('click', taskToday);


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




