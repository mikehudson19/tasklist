const input = document.querySelector('input');
const button = document.querySelector('#button');

button.addEventListener('click', addTask);

function addTask () {
  if (!input.value) {
    alert('Please enter a task!')
  } else {
  const listItem = document.createElement('li');
  listItem.innerText = input.value;
  const allUl = document.querySelectorAll('ul')[0];
  allUl.appendChild(listItem);
}
  input.value = '';
}