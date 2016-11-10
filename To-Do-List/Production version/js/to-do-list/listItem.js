/*
* To Do List application by Bianca Danforth
* listItem.js module
* last edited 11/10/16
*/
var app = app ? app : {};

var storedTasksString = window.localStorage
.getItem('submittedTasks');
if (!storedTasksString) {
  var storedTasks = {};
  window.localStorage.setItem('submittedTasks', JSON
    .stringify(storedTasks));
}

/*
* localStorage API: allows the user to access their list
* on page reload
*/
app.store = {

  /*
  * Gets JSON string submittedTasks out of localStorage,
  * unserializes it & returns it as a JS object.
  * storedTasks is an object of nested objects.
  */
  getTasks: function() {
    var storedTasksString = window.localStorage
    .getItem('submittedTasks');
    var storedTasks = JSON.parse(storedTasksString);
    return storedTasks;
  },

  /*
  * Write tasks back into localStorage tasks is an object 
  * of nested objects.
  */
  setTasks: function(tasks) {
    var tasksString = JSON.stringify(tasks);
    window.localStorage.setItem('submittedTasks', tasksString);
  },

  /*
  * Retrieves an individual task object from localStorage.
  * taskId is a number, task is an object.
  */
  getTask: function(taskId) {
    var storedTasks = app.store.getTasks();
    var task = storedTasks[taskId];
    return task;
  },

  /*
  * Writes an individual task object to localStorage
  * This will update existing tasks, or create a new task in
  * localStorage if it doesn't exist. taskId is a number,
  * task is an object.
  */
  setTask: function(taskId, task) {
    var storedTasks = app.store.getTasks();
    storedTasks[taskId] = task;
    app.store.setTasks(storedTasks);
  },

  /*
  * Deletes an individual task object from localStorage.
  * taskId is a number.
  */
  deleteTask: function(taskId) {
    var storedTasks = app.store.getTasks();
    delete storedTasks[taskId];
    app.store.setTasks(storedTasks);
  },

  /* 
  * Retrieves the task counter from localStorage.
  * counter determines the unique taskId number for the next
  * task to be added to the list. counter is a number.
  */
  getTaskCounter: function() {
    var counter = window.localStorage.getItem('taskCounter');
    var storedTasks = app.store.getTasks();
    if (counter !== null && Object.keys(storedTasks).length) {
      return counter;
    } else {
      return 0;
    }
  },

  /*
  * Increments the task counter, and then updates its value
  * in localStorage
  */
  incrementTaskCounter: function() {
    var counter = app.store.getTaskCounter();
    counter++;
    window.localStorage.setItem('taskCounter', counter);
  }
};

!(function() {

  'use strict';

  var listContainer = document.getElementById('list-container');
  var existingTasks = app.store.getTasks();
  var sortable = [];

  // Transfer tasks from existingTasks object to sortable array
  for (var taskId in existingTasks) {
    if (existingTasks.hasOwnProperty(taskId)) {    
      var task = existingTasks[taskId];
      sortable.push([taskId, task]);
    }
  }

  /*
  * Iterating over the keys in an object may not come back
  * in order. Sort those tasks in ascending numerical order
  * by taskId.
  */
  sortable.sort(function sorting(a, b) {
    var firstItem = parseInt(a[0], 10);
    var secondItem = parseInt(b[0], 10);
    return firstItem - secondItem;
  });

  /*
  * Create and submit the elements for each sorted task and 
  * complete them if they were previously checked as complete
  * by the user.
  */
  for (var i = 0; i < sortable.length; i++) {
    var taskId = sortable[i][0];
    var task = sortable[i][1];
    
    assembleTaskElements(taskId);

    submitTask(task.text, taskId, true);

    if (task.complete) {
      completeTask(taskId, true);
    }
  }

  // Creates the first editable task on the screen
  addTask();
  
  /* 
  -------------------------------------------------------
  !---------- ASSEMBLING EACH TASK'S ELEMENTS ----------!
  -------------------------------------------------------
  */

  /*
  * Assembles the set of elements to form a task using a 
  * consistent taskId which may be new (from addTask(..)) 
  * or old, retrieved from localStorage. taskId is a number.
  */
  function assembleTaskElements(taskId) {

    var taskContainerElement = createtaskContainerElement(taskId);
    listContainer.appendChild(taskContainerElement);

    var realCheckbox = createRealCheckbox(taskId);
    taskContainerElement.appendChild(realCheckbox);

    var fakeCheckbox = createFakeCheckbox(taskId);
    taskContainerElement.appendChild(fakeCheckbox);

    var checkmarkIconWrapper = createCheckmarkIconWrapper(taskId);
    fakeCheckbox.appendChild(checkmarkIconWrapper);

    loadIcon('/images/to-do-list/checkmark.svg', checkmarkIconWrapper);
    
    var inputElement = createInputElement(taskId, taskContainerElement);
    taskContainerElement.appendChild(inputElement);
    inputElement.focus();

    var pElement = createPElement(taskId);
    taskContainerElement.appendChild(pElement);

    var deleteIconWrapper = createDeleteIconWrapper(taskId);
    taskContainerElement.appendChild(deleteIconWrapper);

    loadIcon('/images/to-do-list/delete-icon.svg', deleteIconWrapper);

    setTimeout(function showTaskContainer() {
      taskContainerElement.classList.remove('hidden');
      taskContainerElement.removeAttribute('aria-hidden');
    }, 50);
  }

  /* 
  -------------------------------------
  !---------- ADDING A TASK ----------!
  -------------------------------------
  */
  
  /*
  * Adds a new task container element to the bottom of the list. 
  * Used only when creating new tasks, not for recreating tasks 
  * retrieved from localStorage
  */
  function addTask() {
    autoScroll();
    var taskId = app.store.getTaskCounter();
    assembleTaskElements(taskId);
    app.store.incrementTaskCounter();
  }

  /*
  -----------------------------------------------------------------
  !---------- CREATING ELEMENTS THAT COMPRISE EACH TASK ----------!
  -----------------------------------------------------------------
  */

   /*
    * Creates a new, unique task container. taskId is a number.
    * taskContainerElement is a <div> element.
    */
  function createtaskContainerElement(taskId) {
    var taskContainerElement = document.createElement('div');
    taskContainerElement.setAttribute(
      'id', 'task-container-' + taskId);
    taskContainerElement.setAttribute(
      'class', 'task-container hidden');
    taskContainerElement.setAttribute('aria-hidden', 'true');
    return taskContainerElement;
  }

  /*
  * Creates a new, unique -real- checkbox. taskId is a number.
  * realCheckbox is an <input type='checkbox'> element.
  */
  function createRealCheckbox(taskId) {
    var realCheckbox = document.createElement('input');
    realCheckbox.setAttribute('type', 'checkbox');
    realCheckbox.setAttribute('id', 'real-checkbox-' + taskId);
    return realCheckbox;
  }

  /*
  * Creates a new, unique -fake- checkbox that the user can 
  * click to complete a task; taskId is a number. fakeCheckbox
  * is a <span> element.
  */
  function createFakeCheckbox(taskId) {
    var fakeCheckbox = document.createElement('span');
    fakeCheckbox.setAttribute('class', 'checkbox hidden');
    fakeCheckbox.setAttribute('id', 'fake-checkbox-' + taskId);
    fakeCheckbox.setAttribute('title', 'Complete task');
    fakeCheckbox.setAttribute('aria-hidden', 'true');
    fakeCheckbox.setAttribute('aria-label', 'Complete');
    fakeCheckbox.style.display = 'none';
    
    fakeCheckbox.onclick = function toggleCheckbox() {
      completeTask(taskId);
    };

    return fakeCheckbox;
  }

  /*
  * Creates a new, unique wrapper element around the checkmark icon.
  * taskId is a number. checkmarkIconWrapper is a <span> element.
  */
  function createCheckmarkIconWrapper(taskId) {
    var checkmarkIconWrapper = document.createElement('span');
    checkmarkIconWrapper.setAttribute(
      'class', 'checkmark-icon-wrapper');
    checkmarkIconWrapper.setAttribute(
      'id', 'checkmark-icon-wrapper-' + taskId);
    return checkmarkIconWrapper;
  }

  /*
  * Creates a new, unique icon, <svg>, inside the parentElement.
  * This requires obtaining the XML document containing the <svg> 
  * element from the web server. url is a string, parentElement is
  * an HTML element.
  */
  function loadIcon(url, parentElement) {
    var iconRequest = new XMLHttpRequest();
    iconRequest.open('GET', url, true);
    iconRequest.overrideMimeType('image/svg+xml');
    iconRequest.onreadystatechange = function setIcon() {
      if (iconRequest.readyState === XMLHttpRequest.DONE 
        && iconRequest.status === 200) {
        var icon = iconRequest.responseXML.documentElement;
        icon.setAttribute('aria-hidden', 'true');
        parentElement.appendChild(icon);
      }
    }
    iconRequest.send();
  }

  /*
  * Creates a new, unique input text field with which the user can
  * submit a task (by clicking away or hitting 'enter').
  * taskId is a number; inputElement is an <input type='text'> 
  * element.
  */
  function createInputElement(taskId) {
    var inputElement = document.createElement('input');
    inputElement.setAttribute('type', 'text');
    inputElement.setAttribute('id', 'list-item-input-' + taskId);
    inputElement.setAttribute('class', 'list-item');
    inputElement.setAttribute('placeholder', 'Enter task here.');
   
    /*
    * When the user hits 'enter' to submit a task, it fires
    * the inputElement.onkeyup and the inputElement.onblur event.
    * Initialize flag 'isSubmitted' to prevent calling submitTask 
    * twice. When isSubmitted is true, the 'enter' key has been hit.
    */
    var isSubmitted = false;
    document.body
    .addEventListener('submit', function setisSubmitted() {
      isSubmitted = true;
    });
   
    // Click to submit event listener
    inputElement.onblur = function clickCheckToSubmit() { 
      if(isSubmitted) {
        return;
      }
      clickToSubmit(taskId);
    };
    
    // Enter to submit event listener
    inputElement.onkeyup = function enterCheckToSubmit(event) {
      var keyCode = event.keyCode;
      var userInput = inputElement.value;
      enterToSubmit(keyCode, userInput, taskId);
    };

    return inputElement;
  }

  /*
  * Creates a new, unique paragraph element initially hidden, to
  * replace the <input> element when the task is submitted. The 
  * user can edit the task by clicking this element.
  * taskId is a number. pElement is a <p> element.
  */
  function createPElement(taskId) {
    var pElement = document.createElement('p');
    pElement.setAttribute('id', 'list-item-label-' + taskId);
    pElement.setAttribute('class', 'list-item hidden');
    pElement.setAttribute('aria-hidden', 'true');
    pElement.onclick = function toggleEditMode() {
      editTask(pElement.textContent, taskId);
    };
    return pElement;
  }

  /*
  * Creates a new, unique wrapper element initially hidden, to
  * wrap the deleteIcon svg. The user can delete a task by
  * clicking this element. taskId is a number.
  * deleteIconWrapper is an <a> element.
  */
  function createDeleteIconWrapper(taskId) {
    var deleteIconWrapper = document.createElement('a');
    deleteIconWrapper.setAttribute('class', 'hidden');
    deleteIconWrapper.setAttribute(
      'id', 'delete-icon-wrapper-' + taskId);
    deleteIconWrapper.setAttribute('title', 'Delete task');
    deleteIconWrapper.setAttribute('aria-hidden', 'true');
    deleteIconWrapper.setAttribute('aria-label', 'Delete');
    deleteIconWrapper.style.display = 'none';
    deleteIconWrapper.onclick = function removeTask() {
      deleteTask(taskId, true);
    }
    return deleteIconWrapper;
  }

  /*
  ---------------------------------------
  !---------- DELETING A TASK ----------!
  ---------------------------------------
  */

  /*
  * Deletes a task in two steps:
  * 1) collapsing the task container, taskContainerElement, with
  * a transition by adding the 'hidden' class.
  * 2) removing the task container, taskContainerElement, from the
  * DOM once the transition has taken place.
  * When flag is false, don't trigger 'delete' event to notifyBar
  * module. taskId is a number. Flag is a boolean.
  */
  function deleteTask(taskId, flag) {
    var taskContainerElement = document.getElementById(
      'task-container-' + taskId);
    taskContainerElement.classList.add('hidden');
    taskContainerElement.setAttribute('aria-hidden', 'true');
    //store value of <p> element (aka submitted task) in a string
    var taskString = document.getElementById('list-item-label-'
     + taskId).textContent.toString();
    var taskComplete = document.getElementById('real-checkbox-'
     + taskId).checked;
    // remove task key:value pair from app.store.submittedTasks object
    app.store.deleteTask(taskId);
    // If a task is deleted, dispatch the 'delete' event
    if (flag) {
      var deleteEvent = new CustomEvent('delete', { 'detail': {'task': 
        {id: taskId, complete: taskComplete, text: taskString }}});
      document.body.dispatchEvent(deleteEvent);
    }
  }

  /*
  ----------------------------------------
  !----------COMPLETING A TASK ----------!
  ----------------------------------------
  */ 
  
  /*
  * Simulates checkbox behavior on fakeCheckbox while updating the 
  * realCheckbox 'checked' state. Applies different styles to the 
  * completed task. taskId is a number. isSaved is a boolean.
  * isSaved is true if the task is coming from localStorage, 
  * otherwise it is undefined (falsy).
  */
  function completeTask(taskId, isSaved) {
    var realCheckbox = document.getElementById('real-checkbox-' 
      + taskId);
    var fakeCheckbox = document.getElementById('fake-checkbox-' 
      + taskId);
    var checkmarkIconWrapper = document.getElementById(
      'checkmark-icon-wrapper-' + taskId);
    if (realCheckbox.checked === false) {
      realCheckbox.checked = true;
      checkmarkIconWrapper.style.visibility = 'visible';
      document.getElementById('list-item-label-' + taskId)
      .classList.add('complete');
      if (!isSaved) {
        var task = app.store.getTask(taskId);
        task.complete = true;
        app.store.setTask(taskId, task)
      }
    } else {
      realCheckbox.checked = false;
      checkmarkIconWrapper.style.visibility = 'hidden';
      document.getElementById('list-item-label-' + taskId)
      .classList.remove('complete');
      if (!isSaved) {
        var task = app.store.getTask(taskId);
        task.complete = false;
        app.store.setTask(taskId, task)
      }
    }
  }

  /*
  ----------------------------------------
  !----------SUBMITTING A TASK ----------!
  ----------------------------------------
  */  
  
  /*
  * Submits a task by replacing the inputElement with the pElement
  * and displaying the fakeCheckbox and deleteIcon; userInput is a
  * string and taskId is a number. isSaved is a boolean. True if
  * the task is coming from localStorage, otherwise undefined (falsy)
  */
  function submitTask(userInput, taskId, isSaved) {
    var pElement = document.getElementById(
      'list-item-label-' + taskId);
    var inputElement = document.getElementById(
      'list-item-input-' + taskId);
    var deleteIcon = document.getElementById(
      'delete-icon-wrapper-' + taskId);
    var fakeCheckbox = document.getElementById(
      'fake-checkbox-' + taskId);
    var realCheckbox = document.getElementById(
      'real-checkbox-' + taskId);
    
    realCheckbox.setAttribute('aria-label', userInput);
    
    pElement.textContent = '';
    pElement.textContent = userInput;
    
    if (!isSaved) {
      var task = 
        {id: taskId, complete: realCheckbox.checked, text: userInput};
      app.store.setTask(taskId, task);      
    }

    deleteIcon.style.display = 'inline-block';
    fakeCheckbox.style.display = 'inline-block';
    
    setTimeout(function showOptions() {
      deleteIcon.classList.toggle('hidden');
      deleteIcon.removeAttribute('aria-hidden');
      fakeCheckbox.classList.toggle('hidden');
      fakeCheckbox.removeAttribute('aria-hidden');
    }, 25);
    pElement.classList.toggle('hidden');
    pElement.removeAttribute('aria-hidden');
    inputElement.classList.toggle('hidden');
    inputElement.setAttribute('aria-hidden', 'true');
  }

  /*
  * Listen for when user presses the 'Enter' key, if userInput has a
  * non-empty value, submitTask... If it's the last task, add a new
  * task. If the submitted task is empty, add keyframes bounce
  * animation. keyCode is a number. userInput is a string.
  * taskId is a number.
  */
  function enterToSubmit(keyCode, userInput, taskId) {
    var inputElement = document.getElementById(
      'list-item-input-' + taskId);
    if (userInput !== '' && keyCode === 13) {
      var submitEvent = new CustomEvent('submit');
      document.body.dispatchEvent(submitEvent);
      submitTask(userInput, taskId);
      var idString = listContainer.lastChild.id;
      var lastId = idString.split('-')[2];
      if (taskId.toString() === lastId) {
        addTask();
      }
    } else if (userInput === '' && keyCode === 13) {
      inputElement.classList.add('bounce');
      setTimeout(function addBounce() {
        inputElement.classList.remove('bounce');
      }, 1000);
    }
  }

  /*
  --------------------------------------
  !---------- EDITING A TASK ----------!
  --------------------------------------
  */
  
  /*
  * Edits a task by replacing the pElement with the inputElement and
  * hiding the fakeCheckbox and deleteIcon; userInput is a string
  * and taskId is a number.
  */
  function editTask(userInput, taskId) {
    var pElement = document.getElementById(
      'list-item-label-' + taskId);
    var inputElement = document.getElementById(
      'list-item-input-' + taskId);
    var deleteIcon = document.getElementById(
      'delete-icon-wrapper-' + taskId);
    var fakeCheckbox = document.getElementById(
      'fake-checkbox-' + taskId);
    var taskContainerElement = document.getElementById(
      'task-container-' + taskId);
   
    inputElement.value = userInput;
    
    deleteIcon.style.display = 'none';
    fakeCheckbox.style.display = 'none';
    
    deleteIcon.classList.toggle('hidden');
    deleteIcon.setAttribute('aria-hidden', 'true');
    fakeCheckbox.classList.toggle('hidden');
    fakeCheckbox.setAttribute('aria-hidden', 'true');
    pElement.classList.toggle('hidden');
    pElement.setAttribute('aria-hidden', 'true');
    inputElement.classList.toggle('hidden');
    inputElement.removeAttribute('aria-hidden');
    inputElement.focus();
    
    //'isSubmitted' prevents submitTask from being called twice
    var isSubmitted = false;
    document.body
    .addEventListener('submit', function setisSubmitted() {
      isSubmitted = true;
    });
   
    // Click to submit event listener for edit mode
    inputElement.onblur = function clickCheckToSubmit() { 
      if(isSubmitted) {
        return;
      }
      clickToSubmit(taskId);
    };
  }

  /*
  * Checks to add a new task (if the submitted task is the last task)
  * or remove an empty task (that isn't the last task) when the user
  * clicks away. taskId is a number.
  */
  function clickToSubmit(taskId) {
    var inputElement = document.getElementById(
      'list-item-input-' + taskId);
    var taskContainerElement = document.getElementById(
      'task-container-' + taskId);
    var userInput = inputElement.value;
      if (userInput !== '') {
        submitTask(userInput, taskId);
        var idString = listContainer.lastChild.id;
        var lastId = idString.split('-')[2];
        if (taskId.toString() === lastId) {
          addTask();
        }
      }
      if (listContainer.children.length === 1 
        || listContainer.lastChild === taskContainerElement) {
        return;
      }

      if (userInput === '' 
        && inputElement.classList.toString() === 'list-item') {
        deleteTask(taskId, false);
      }
  }

   /*
  ---------------------------------------
  !----------AUTO-SCROLL LIST ----------!
  ---------------------------------------
  */

  /* Auto scroll to bottom of list when it is extended by adding
  * a new task.
  */
  function autoScroll() {
    window.scrollTo(0,document.body.scrollHeight);
  }
    
  
}());
