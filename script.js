function createElement(tagName, className, id) {
  const newElement = document.createElement(tagName);
  newElement.className = className;
  newElement.id = id;
  return newElement;
}

function createButton(id, src, alt) {
  const btnElement = createElement('button', '', id);
  btnElement.id = id;
  const iconElement = createElement('img', '', '');
  iconElement.src = `./assets/${src}`;
  iconElement.alt = alt;
  btnElement.appendChild(iconElement);

  return btnElement;
}

function getSavedList() {
  return localStorage.getItem('savedTasks') || '[]';
}
let taskList;

const bodyElement = document.querySelector('body');

const headerBuilder = () => {
  const headerElement = createElement('header', '', '');

  const title = createElement('h1', '', 'title');
  title.innerHTML = 'To-Do List';

  const paragraph = createElement('p', '', 'funcionamento');
  paragraph.innerText = 'Double click on a item to mark completed';

  headerElement.appendChild(title);
  headerElement.appendChild(paragraph);
  bodyElement.appendChild(headerElement);
};

headerBuilder();

function setTaskSelected(event) {
  const selected = document.querySelector('.selected')
    ? document.querySelector('.selected')
    : event.target;
  selected.classList.toggle('selected');
  event.target.classList.add('selected');
}
function setTaskCompleted(event) {
  event.target.classList.toggle('completed');
}
function createTaskElement(taskName) {
  const taskElement = createElement('li', 'task', {});
  taskElement.innerText = taskName;
  taskElement.addEventListener('click', setTaskSelected);
  taskElement.addEventListener('dblclick', setTaskCompleted);
  return taskElement;
}
function loadTasks() {
  const loadedTasks = JSON.parse(getSavedList());
  taskList = document.querySelector('#task-list');
  for (let i = 0; i < loadedTasks.length; i += 1) {
    const newTask = createTaskElement(loadedTasks[i].taskName);
    if (loadedTasks[i].completed) {
      newTask.classList.add('completed');
    }
    taskList.appendChild(newTask);
  }
}
function saveTask(string) {
  const loadAgain = JSON.parse(getSavedList());
  const save = loadAgain;
  const temporaryObj = {
    taskName: string,
    completed: false,
  };
  save.push(temporaryObj);
  localStorage.setItem('savedTasks', JSON.stringify(save));
}
const createNewTask = () => {
  const taskText = document.querySelector('#texto-tarefa');
  const newTask = createTaskElement(taskText.value);
  taskText.value = '';
  taskList.appendChild(newTask);
  saveTask(newTask.innerText);
};
function newTaskBtnBuilder() {
  const btnElement = createButton('criar-tarefa', 'addIcon.svg', 'adicionar tarefa');
  btnElement.addEventListener('click', createNewTask);

  return btnElement;
}

const handleInputKeydown = (event) => {
  if (event.key === 'Enter') {
    createNewTask();
  }
};

function taskInputBuilder() {
  const taskInputElement = createElement('input', '', 'texto-tarefa');
  taskInputElement.type = 'text';
  taskInputElement.max = '100';
  taskInputElement.placeholder = 'Type a new task';
  taskInputElement.addEventListener('keydown', handleInputKeydown);

  return taskInputElement;
}

function inputSectionBuilder() {
  const inputSection = createElement('section', 'new-task', '');
  const taskInputElement = taskInputBuilder();
  const newTaskBtn = newTaskBtnBuilder();

  inputSection.appendChild(taskInputElement);
  inputSection.appendChild(newTaskBtn);

  return inputSection;
}

const saveBoard = () => {
  const boardSatus = document.querySelectorAll('.task');
  const array = [];
  for (let i = 0; i < boardSatus.length; i += 1) {
    const temporaryObj = {
      taskName: boardSatus[i].innerText,
      completed: boardSatus[i].classList.contains('completed'),
    };
    array.push(temporaryObj);
  }
  localStorage.setItem('savedTasks', JSON.stringify(array));
};
const moverBaixo = 'move-down';
function canMove(parentList, selected, id) {
  const { firstChild, lastChild } = parentList[0];
  const moveUpBtnId = 'move-up';
  const moveDownBtnId = moverBaixo;
  const moveUp = (id === moveUpBtnId && firstChild === selected);
  const moveDown = (id === moveDownBtnId && lastChild === selected);

  return (!moveUp && !moveDown);
}

const handleMoveTask = (event) => {
  const selected = document.querySelector('.selected');
  if (!selected) return;

  const id = event.target.id || event.target.parentNode.id;
  const parentList = document.querySelectorAll('#task-list');

  if (canMove(parentList, selected, id)) {
    const sibling = id === moverBaixo
      ? selected.nextSibling.nextSibling
      : selected.previousSibling;
    parentList[0].removeChild(selected);
    parentList[0].insertBefore(selected, sibling);
  }
};

const clearTasks = () => {
  taskList.innerHTML = '';
  localStorage.removeItem('savedTasks');
};

const clearCompleted = () => {
  const completedTasks = document.querySelectorAll('.completed');
  for (let i = 0; i < completedTasks.length; i += 1) {
    completedTasks[i].outerHTML = '';
  }
};

const clearSelected = () => {
  const selected = document.querySelector('.selected');
  selected.outerHTML = '';
};

const toolbarBtnsAttributes = [
  {
    id: 'clear-board',
    icon: 'trashIcon.svg',
    alt: 'Delete all tasks',
    event: 'click',
    function: clearTasks,
  },
  {
    id: 'clear-completed',
    icon: 'magicEraser.svg',
    alt: 'Delete completed tasks',
    event: 'click',
    function: clearCompleted,
  },
  {
    id: 'save-tasks',
    icon: 'saveIcon.svg',
    alt: 'Save all tasks',
    event: 'click',
    function: saveBoard,
  },
  {
    id: 'move-up',
    icon: 'arrowIcon.svg',
    alt: 'Move selected task up',
    event: 'click',
    function: handleMoveTask,
  },
  {
    id: moverBaixo,
    icon: 'arrowIcon.svg',
    alt: 'Move selected task down',
    event: 'click',
    function: handleMoveTask,
  },
  {
    id: 'delete-selected',
    icon: 'eraser.svg',
    alt: 'Delete selected task',
    event: 'click',
    function: clearSelected,
  },
];

function toolbarBuilder() {
  const toolbarElement = createElement('div', 'toolbar', '');

  toolbarBtnsAttributes.forEach((element) => {
    const btnElement = createButton(element.id, element.icon, element.alt);
    btnElement.addEventListener('click', element.function);

    toolbarElement.appendChild(btnElement);
  });

  return toolbarElement;
}

const mainBuilder = () => {
  const mainElement = createElement('main', '', '');
  const taskInput = inputSectionBuilder();
  taskList = createElement('ol', '', 'task-list');
  const toolbar = toolbarBuilder();

  mainElement.appendChild(taskInput);
  mainElement.appendChild(toolbar);
  mainElement.appendChild(taskList);

  bodyElement.appendChild(mainElement);
};

mainBuilder();
loadTasks();
