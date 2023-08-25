import './style.css';
import Goals from './modules/goalClass.js';
import DeleteCompletedTasks from './modules/updateTasks.js';
import updateCheckbox from './modules/eventStatus.js';
import syncImage from './img/synchronize.png';
import enterImage from './img/enter.png';

document.addEventListener('DOMContentLoaded', () => {
    const myList = new Goals();
    myList.displayList();
  
    const emptyMainInputText = () => {
      const $mainText = document.querySelector('.text');
      $mainText.value = '';
    };
  
    const addItemToList = () => {
      const $captureTask = document.querySelector('.text');
      const $captureId = (myList.items.length + 1);
      const $captureCompleted = false;
  
      myList.addtask($captureTask.value, $captureCompleted, $captureId.toString());
      emptyMainInputText();
    };
  
    const $mainText = document.querySelector('.text');
    $mainText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addItemToList();
        emptyMainInputText();
      }
    });
  
    const $list = document.querySelector('.list');
    $list.addEventListener('click', (event) => {
      const $delete = event.target.closest('.delete');
      if ($delete) {
        const taskIndex = Array.from($list.children).indexOf($delete.closest('.cont-task'));
        myList.deleteTask(taskIndex);
      }
    });
  
    $list.addEventListener('mouseover', (event) => {
      const $task = event.target.closest('.task');
      if ($task) {
        const $cont = $task.closest('.cont-task');
        const $dots = $cont.querySelector('.dots');
        const $delete = $cont.querySelector('.delete');
        $dots.classList.add('inactive');
        $delete.classList.add('active');
      }
    });
  
    $list.addEventListener('mouseout', (event) => {
      const $task = event.target.closest('.task');
      if ($task) {
        const $cont = $task.closest('.cont-task');
        const $dots = $cont.querySelector('.dots');
        const $delete = $cont.querySelector('.delete');
        $dots.classList.remove('inactive');
        $delete.classList.remove('active');
      }
    });
  
    $list.addEventListener('mouseover', (event) => {
      const $dots = event.target.closest('.dots');
      if ($dots) {
        const $cont = $dots.closest('.cont-task');
        const $delete = $cont.querySelector('.delete');
        $dots.classList.add('inactive');
        $delete.classList.add('active');
      }
    });
  
    $list.addEventListener('mouseout', (event) => {
      const $dots = event.target.closest('.dots');
      if ($dots) {
        const $cont = $dots.closest('.cont-task');
        const $delete = $cont.querySelector('.delete');
        $dots.classList.remove('inactive');
        $delete.classList.remove('active');
      }
    });
  
    $list.addEventListener('blur', (event) => {
      const $task = event.target.closest('.task');
      if ($task) {
        const taskIndex = Array.from($list.children).indexOf($task.closest('.cont-task'));
        const newDescription = $task.value.trim(); // Trim to remove leading/trailing spaces
  
        if (newDescription !== myList.items[taskIndex].description) {
          myList.items[taskIndex].description = newDescription;
          myList.updateLocalStorage();
        }
      }
    }, true); // Use the capture phase to ensure that blur events are captured on all child elements
  
    $list.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const $task = event.target.closest('.task');
        if ($task) {
          const taskIndex = Array.from($list.children).indexOf($task.closest('.cont-task'));
          const newDescription = $task.value;
  
          if (newDescription !== myList.items[taskIndex].description) {
            myList.items[taskIndex].description = newDescription;
            myList.updateLocalStorage();
          }
        }
      }
    });
    const $clearButton = document.querySelector('.clear');
    $clearButton.addEventListener('click', () => {
      DeleteCompletedTasks(myList);
    });
  
    updateCheckbox(myList);
    document.querySelector('.sync').src = syncImage;
    document.querySelector('.enter').src = enterImage;
  });
  
  const $list = document.querySelector('.list');
  const updateCheckbox = (myList) => {
    $list.addEventListener('click', (event) => {
      const $checkbox = event.target.closest('.completed');
      if ($checkbox) {
        const taskIndex = Array.from($list.children).indexOf($checkbox.closest('.cont-task'));
  
        // Toggle the completed status
        myList.items[taskIndex].completed = !myList.items[taskIndex].completed;
  
        myList.updateLocalStorage();
        myList.displayList(); // Refresh the displayed list to reflect the changes
      }
    });
  };
  
  export default updateCheckbox;
  
  import dotsImage from '../img/dots.png';
  import syncImage from '../img/synchronize.png';
  import enterImage from '../img/enter.png';
  import deleteImage from '../img/delete.png';
  
  const list = [];
  
  class Goals {
    constructor() {
      this.items = JSON.parse(localStorage.getItem('list')) || list;
    }
  
    addtask(description, completed, index) {
      const newItem = { description, completed, index };
      this.items.push(newItem);
      this.updateLocalStorage();
    }
  
    deleteTask(index) {
      this.items.splice(index, 1);
  
      for (let i = index; i < this.items.length; i += 1) {
        this.items[i].index = (parseInt(this.items[i].index, 10) - 1).toString();
      }
      this.updateLocalStorage();
    }
  
    displayList() {
      const $list = document.querySelector('.list');
      $list.innerHTML = '';
  
      this.items.forEach((item) => {
        const $cont = document.createElement('div');
        const $checkbox = document.createElement('input');
        $checkbox.type = 'checkbox';
        const $task = document.createElement('input');
        const $dots = document.createElement('img');
        const $delete = document.createElement('img');
  
        $cont.classList.add('cont-task');
        $checkbox.classList.add('completed');
        $task.classList.add('task');
        $dots.classList.add('dots');
        $delete.classList.add('delete');
        $checkbox.checked = item.completed;
        $task.type = 'text';
        $task.value = item.description;
        $dots.src = dotsImage;
        $dots.alt = 'dots image';
        $delete.src = deleteImage;
        $delete.alt = 'trash image';
        document.querySelector('.sync').src = syncImage;
        document.querySelector('.enter').src = enterImage;
        if (item.completed) {
          $task.classList.add('done');
        } else {
          $task.classList.remove('done');
        }
        $cont.appendChild($checkbox);
        $cont.appendChild($task);
        $cont.appendChild($dots);
        $cont.appendChild($delete);
        $list.appendChild($cont);
      });
    }
  
    updateLocalStorage() {
      localStorage.setItem('list', JSON.stringify(this.items));
      this.displayList();
    }
  }
  export default Goals;
  
  const DeleteCompletedTasks = (myList) => {
    const incompleteTasks = myList.items.filter((task) => {
      if (task.completed) {
        return false;
      }
      return true;
    });
  
    incompleteTasks.forEach((task, index) => {
      task.index = (index + 1).toString();
    });
  
    myList.items = incompleteTasks;
    myList.updateLocalStorage();
    myList.displayList();
  };
  
  export default DeleteCompletedTasks;