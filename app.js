const input = document.querySelector('input');
const button = document.querySelector('#button');

button.addEventListener('click', taskAdd);
document.body.addEventListener('click', taskDelete)

function taskAdd () {
  if (!input.value) {
    alert('Please enter a task!')
  } else {
  const listItem = document.createElement('li');
  listItem.innerHTML = `${input.value} <i class="fas fa-check"></i> <i class="fas fa-trash-alt"></i> `;
  const allUl = document.querySelectorAll('ul')[0];
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




