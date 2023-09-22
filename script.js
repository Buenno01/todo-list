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
  title.innerHTML = 'Minha Lista de Tarefas';

  const paragraph = createElement('p', '', 'funcionamento');
  paragraph.innerText = 'Clique duas vezes em um item para marcá-lo como completo';

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
  taskList = document.querySelector('#lista-tarefas');
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
  taskInputElement.placeholder = 'Digite uma nova tarefa';
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
const moverBaixo = 'mover-baixo';
function canMove(parentList, selected, id) {
  const { firstChild, lastChild } = parentList[0];
  const moveUpBtnId = 'mover-cima';
  const moveDownBtnId = moverBaixo;
  const moveUp = (id === moveUpBtnId && firstChild === selected);
  const moveDown = (id === moveDownBtnId && lastChild === selected);

  return (!moveUp && !moveDown);
}

const handleMoveTask = (event) => {
  const selected = document.querySelector('.selected');
  if (!selected) return;

  const id = event.target.id || event.target.parentNode.id;
  const parentList = document.querySelectorAll('#lista-tarefas');

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
    id: 'apaga-tudo',
    icon: 'trashIcon.svg',
    alt: 'Remove todas as tarefas',
    event: 'click',
    function: clearTasks,
  },
  {
    id: 'remover-finalizados',
    icon: 'magicEraser.svg',
    alt: 'Remove as tarefas finalizadas',
    event: 'click',
    function: clearCompleted,
  },
  {
    id: 'salvar-tarefas',
    icon: 'saveIcon.svg',
    alt: 'botão de salvar todas as tarefas',
    event: 'click',
    function: saveBoard,
  },
  {
    id: 'mover-cima',
    icon: 'arrowIcon.svg',
    alt: 'botão de mover tarefa para cima',
    event: 'click',
    function: handleMoveTask,
  },
  {
    id: moverBaixo,
    icon: 'arrowIcon.svg',
    alt: 'botão de mover tarefa para baixo',
    event: 'click',
    function: handleMoveTask,
  },
  {
    id: 'remover-selecionado',
    icon: 'eraser.svg',
    alt: 'botão de remover tarefa selecionada',
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
  taskList = createElement('ol', '', 'lista-tarefas');
  const toolbar = toolbarBuilder();

  mainElement.appendChild(taskInput);
  mainElement.appendChild(toolbar);
  mainElement.appendChild(taskList);

  bodyElement.appendChild(mainElement);
};

mainBuilder();
loadTasks();
