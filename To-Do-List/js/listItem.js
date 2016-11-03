/*
Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app ? app : {};

var storedTasksString = window.localStorage.getItem('submittedTasks');
if (!storedTasksString) {
  var storedTasks = {};
  // Serialize object and store
  window.localStorage.setItem('submittedTasks', JSON.stringify(storedTasks));
}

app.store = {

  // Gets JSON string out of localStorage, unserializes it and returns it as a JavaScript Object.
  getTasks: function() {
    // Convert string representation of object back into a javascript object
    // JSON is the standard serialization format for javascript objects.
    var storedTasksString = window.localStorage.getItem('submittedTasks');
    var storedTasks = JSON.parse(storedTasksString);
    return storedTasks;
  },

  // Write tasks back into localStorage
  // tasks is an object mapping taskId to the Task object.
  // submittedTasks object is of the form { <taskId>: Task, <taskId: Task, ...} where
  // Task object is defined as { <id>: Number, complete: Boolean, text: String }
  setTasks: function(tasks) {
    var tasksString = JSON.stringify(tasks);
    window.localStorage.setItem('submittedTasks', tasksString);
  },

  // Retrieves an individual Task object from localStorage
  getTask: function(id) {
    var storedTasks = app.store.getTasks();
    var task = storedTasks[id];
    return task;
  },

  // Writing an individual Task object to localStorage
  // This will update existing tasks, or create a new task in localStorage if
  // it doesn't exist.
  setTask: function(id, task) {
    var storedTasks = app.store.getTasks();
    storedTasks[id] = task;
    app.store.setTasks(storedTasks);
  },

  deleteTask: function(id) {
    var storedTasks = app.store.getTasks();
    delete storedTasks[id];
    app.store.setTasks(storedTasks);
  },

  getTaskCounter: function() {
    var counter = window.localStorage.getItem('taskCounter');
    var storedTasks = app.store.getTasks();
    // First condition:
    // If the taskCounter key in localStorage hasn't yet been set it will
    // return null. Check for that here. We don't use truthy/falsey here
    // because logically the counter could be 0 which is falsey.
    // Second condition:
    // If there are no tasks stored in local storage, reset counter to 0.
    // Can't just compare storedTasks object to {}, because {} is not a truly 'empty' object.
    if (counter !== null && Object.keys(storedTasks).length) {
      return counter;
    } else {
      return 0;
    }
  },

  incrementTaskCounter: function() {
    var counter = app.store.getTaskCounter();
    counter++;
    window.localStorage.setItem('taskCounter', counter);
  }
};

/*
Wrap entire module in an immediately invoked function so global variables in this module don't pollute the global namespace for the application.
The ! at the start of the line allows Javascript ASI to kick in on the previous line and insert any missing semicolons for you. Per AirBnB ES5 Style Guide
*/
!(function() {
  // Initializes global variables
  var listContainer = document.getElementById("list-container");
  var globalCheckmarkIconWrapper = createCheckmarkIconWrapper();
  var globalCheckmarkIcon = loadIcon("/images/to-do-list/checkmark.svg", globalCheckmarkIconWrapper);

  var existingTasks = app.store.getTasks();

  // Loop over each item in our existing tasks
  // sortable = [
  //  [ <taskId>, <TaskObject>],
  //  [ 13, <TaskObject>],
  //  [ 5, <TaskObject]
  // ]
  var sortable = [];
  for (let taskId in existingTasks) {
    // Don't iterate over properties that are built into the object prototype, only iterate over custom properties
    if (existingTasks.hasOwnProperty(taskId)) {    
      var task = existingTasks[taskId];
      sortable.push([taskId, task]);
    }
  }

  // sort those tasks by id
  // Iterating over the keys in an object may not come back in order.
  // In the first pass, a = sortable[0], b = sortable[1], they are compared and sortable is rearranged as appropriate
  // In the second pass, a = sortable[1], b = sortable[2], they are compared and sortable is rearranged as appropriate,
  // etc.
  sortable.sort(function(a, b) {
    // Cast to an integer in base 10 for comparison
    var firstItem = parseInt(a[0], 10);
    var secondItem = parseInt(b[0], 10);
    // negative (sort down), 0 (leave as is), positive (sort up)
    return firstItem - secondItem;
  });

  // create the elements for each sorted task
  for (var i = 0; i < sortable.length; i++) {
    var taskId = sortable[i][0];
    var task = sortable[i][1];
    
    createTaskElements(taskId);
    // mark the tasks as submitted
    submitTask(task.text, taskId, true);
    // if the task is marked as completed, complete the task
    if (task.complete) {
        // Complete the task without re-storing it in localStorage
        completeTask(taskId, true);
      }
  }

  // Creates the first editable task on the screen
  addTask();
  
  // Create task elements using a consistent taskId which may be new (from addTask) or old, retrieved from localStorage
  // reference: http://jsfiddle.net/g79ssyqv/12/
  function createTaskElements(taskId) {
    /*
    Creates a new, unique taskid#list-item-container-x <div> inside the id#list-container <div> to wrap each task in
    */
    var listElement = createListElement(taskId);
    listContainer.appendChild(listElement);

    /*
    Creates a new, unique -real- checkbox, <input type="checkbox">, inside id#list-item-container-x <div>
    */
    var realCheckbox = createRealCheckbox(taskId);
    listElement.appendChild(realCheckbox);

    /*
    Creates a new, unique -fake- checkbox, <span>, inside id#list-item-container-x <div>
    */
    var fakeCheckbox = createFakeCheckbox(taskId);
    listElement.appendChild(fakeCheckbox);

    /*
    Creates a new, unique wrapper element, <span>, inside fakeCheckbox element to wrap the checkmark icon. This enables the completeTask function to toggle the wrapper's visibility, instead of the checkmark <svg> element itself. This means that whenever the checkmark <svg> is retrieved from the web server in the loadIcon function, it will display, and there is no chance the script is attempting to access the icon before that (which the completeTask function was previously doing).
    */
    // Clone the globalCheckmarkIconWrapper node (and it's child node, the globalCheckmarkIcon <svg>) so that each clone can have a unique ID number (taskId).
    var checkmarkIconWrapper = globalCheckmarkIconWrapper.cloneNode(true);
    console.log(checkmarkIconWrapper);
    checkmarkIconWrapper.setAttribute("id", "checkmark-icon-wrapper-" + taskId);
    fakeCheckbox.appendChild(checkmarkIconWrapper);

    /*
    Creates a new, unique checkmark icon, <svg>, inside the fakeCheckbox, <span>. This requires obtaining the XML document containing the <svg> element from the web server.
    */
    // var checkmarkIcon = loadIcon("/images/to-do-list/checkmark.svg", checkmarkIconWrapper);
    // var checkmarkIcon = globalCheckmarkIcon;
    // checkmarkIconWrapper.appendChild(checkmarkIcon);
    /*
    Note: Cannot add classes/ids in JS on an external XML resource using setAttribute like the others; just target parent class and use descendant selector for styling: e.g. .parent svg {..}.
    */

    /*
    Creates a new, unique input text field, <input type="text">, inside id#list-item-container-x <div>
    */
    var inputElement = createInputElement(taskId, listContainer, listElement);
    listElement.appendChild(inputElement);
    inputElement.focus();

    /*
    Creates a new, unique element, <p>, initially hidden, to replace the <input> element inside id#list-item-container-x <div> when the task is submitted
    */
    var submittedTask = createSubmittedTask(taskId);
    listElement.appendChild(submittedTask);

    /*
    Creates a new, unique element, <a>, to wrap the deleteIcon svg inside the id#list-item-container-x <div>; this allows me to target/style the delete icon without needing to change the contents of the svg XML document.
    */
    var deleteIconWrapper = createDeleteIconWrapper(taskId);
    listElement.appendChild(deleteIconWrapper);

    /*
    Creates a new, unique delete icon, <svg>, inside the deleteIconWrapper, <a>. This requires obtaining the XML document containing the <svg> element from the web server.
    */
    var deleteIcon = loadIcon(
      "/images/to-do-list/delete-icon.svg",
      deleteIconWrapper
    );
    /*
    Note: Cannot add classes/ids in JS on an external XML resource using setAttribute like the others; just target parent class and use descendant selector for styling: e.g. .parent svg {..}.
    */

    /*
    Now that all of the elements for the "list-item-container-x" parent element have been added to the DOM, we can add a transition!
    */
    setTimeout(function() {
      listElement.classList.remove("hidden");
      listElement.removeAttribute("aria-hidden");
    }, 50);
  }

  /* 
  -------------------------------------
  !----------ADDING A TASK  ----------!
  -------------------------------------
  */
  
  // Used only when creating new tasks, not for recreating tasks retrieved from localStorage
  function addTask() {
    // Auto scroll to bottom of list when it is extended by adding a new task
    autoScroll();
    var taskId = app.store.getTaskCounter();
    createTaskElements(taskId);
    app.store.incrementTaskCounter();
  }

  /*
  ------------------------------------------------------
  !----------CREATING ELEMENTS FOR EACH TASK ----------!
  ------------------------------------------------------
  */

  /*
  Creates a new, unique id#list-item-container-x div; taskId is a number.
  */
  function createListElement(taskId) {
    var listElement = document.createElement("div");
    listElement.setAttribute("id", "list-item-container-" + taskId);
    listElement.setAttribute("class", "list-item-container hidden");
    listElement.setAttribute("aria-hidden", "true");
    return listElement;
  }

  //Creates a new, unique -real- checkbox; taskId is a number.
  function createRealCheckbox(taskId) {
    var realCheckbox = document.createElement("input");
    realCheckbox.setAttribute("type", "checkbox");
    realCheckbox.setAttribute("id", "real-checkbox-" + taskId);
    return realCheckbox;
  }

  /*
  Creates a new, unique -fake- checkbox that the user can click to complete a task; taskId is a number.
  */
  function createFakeCheckbox(taskId) {
    var fakeCheckbox = document.createElement("span");
    // user can't interact with checkbox until they've submitted a task
    fakeCheckbox.setAttribute("class", "checkbox hidden");
    fakeCheckbox.setAttribute("id", "fake-checkbox-" + taskId);
    fakeCheckbox.setAttribute("title", "Complete task");
    fakeCheckbox.setAttribute("aria-hidden", "true");
    fakeCheckbox.setAttribute("aria-label", "Complete");
    fakeCheckbox.style.display = "none";
    fakeCheckbox.onclick = function() {
      completeTask(taskId);
    };
    return fakeCheckbox;
  }

  /*
  Creates a new, unique icon, <svg>, inside the parentElement. This requires obtaining the XML document containing the <svg> element from the web server. url is a string, parentElement is an HTML element
  */
  function loadIcon(url, parentElement) {
    var iconRequest = new XMLHttpRequest();
    iconRequest.open("GET", url, true);
    iconRequest.overrideMimeType("image/svg+xml");
    iconRequest.onreadystatechange = function() {
      if (iconRequest.readyState === XMLHttpRequest.DONE && iconRequest.status === 200) {
        var icon = iconRequest.responseXML.documentElement;
        icon.setAttribute("aria-hidden", "true");
        parentElement.appendChild(icon);
      }
    }
    iconRequest.send();
  }

  function createCheckmarkIconWrapper() {
    var checkmarkIconWrapper = document.createElement("span");
    checkmarkIconWrapper.setAttribute("class", "checkmark-icon-wrapper");
    return checkmarkIconWrapper;
  }

  /*
  Creates a new, unique input text field, <input type="text"> with which the user can enter and submit a task, adding a new task (if the submitted task is the last task) or remove an empty task (that isn't the last task) when the user clicks away; taskId is a number.
  */
  function createInputElement(taskId, listContainer, listElement) {
    var inputElement = document.createElement("input");
    inputElement.setAttribute("type", "text");
    inputElement.setAttribute("id", "list-item-input-" + taskId);
    inputElement.setAttribute("class", "list-item");
    inputElement.setAttribute("placeholder", "Enter task here.");
   
   
    // Initialize flag 'submitFired' to prevent calling submitTask twice. This happens when the user hits 'enter' to submit a task: it fires the inputElement.onkeyup event AND the inputElement.onblur event. When submitFired is true, the 'enter' key has been hit, so exit the inputElement.onblur callback function.
    var submitFired = false;
    document.body.addEventListener('submit', function() {
      submitFired = true;
    });
   
    // Click away to submit, at task creation
    inputElement.onblur = function() { 
      if(submitFired) {
        return;
      }
      checkToSubmit(taskId);
    };
    
    /*
    Listen for when user presses the 'Enter' key, if input has a non-empty value, submitTask... If it's the last task, add a new task. If the submitted task is empty, add keyframes bounce animation.
    */
    inputElement.onkeyup = function(event) {
      var userInput = inputElement.value;
      if (userInput !== "" && event.keyCode === 13) {
        var submitEvent = new CustomEvent('submit');
        document.body.dispatchEvent(submitEvent);
        submitTask(userInput, taskId);
        /*
        Need to make sure the last task is the one being submitted before adding a new task... The <div> that holds each task's elements has an id of the form "list-item-container-x". Does x = taskId? If so, the submitted task is the last task on the list, so add a new task.
        First get x, which is the value of 'row' at the time the <div> was created. x is the number after the last dash on the id name.
        */
        var idString = listContainer.lastChild.id;
        /*
        id name is of form: "list-item-container-x", so want 4th element in array (indexes at 0) returned by element.split
        */
        var lastId = idString.split("-")[3];
        //taskId is a number, lastId is a string
        if (taskId.toString() === lastId) {
          addTask();
        }
      } else if (userInput === "" && event.keyCode === 13) {
        inputElement.classList.add("bounce");
        setTimeout(function() {
          /*
          remove the class so animation can occur as many times as user triggers event, delay must be longer than the animation duration and any delay.
          */
          inputElement.classList.remove("bounce");
        }, 1000);
      }
    };

    return inputElement;
  }

  /*
  Creates a new, unique element, <p>, initially hidden, to replace the <input> element when the task is submitted. The user can edit the task by clicking this element; taskId is a number.
  */
  function createSubmittedTask(taskId) {
    var submittedTask = document.createElement("p");
    submittedTask.setAttribute("id", "list-item-label-" + taskId);
    submittedTask.setAttribute("class", "list-item hidden");
    submittedTask.setAttribute("aria-hidden", "true");
    /*
    grab <p> element, 'submittedTask' and replace it with <input> element 'inputElement', without removing either from the DOM.
    */
    submittedTask.onclick = function() {
      var userInput = submittedTask.textContent;
      editTask(userInput, taskId);
    };
    return submittedTask;
  }

  /*
  Creates a new, unique element, <a>, to wrap the deleteIcon svg. The user can delete a task by clicking this element; taskId is a number.
  */
  function createDeleteIconWrapper(taskId) {
    var deleteIconWrapper = document.createElement("a");
    // user can't interact with delete icon until they've entered a task
    deleteIconWrapper.setAttribute("class", "hidden");
    deleteIconWrapper.setAttribute("id", "delete-icon-wrapper-" + taskId);
    deleteIconWrapper.setAttribute("title", "Delete task");
    deleteIconWrapper.setAttribute("aria-hidden", "true");
    deleteIconWrapper.setAttribute("aria-label", "Delete");
    deleteIconWrapper.style.display = "none";
    /*
    I have to wrap deleteTask(..) in another function so I can pass in an argument but avoid immediately executing the function at the same time.
    */
    deleteIconWrapper.onclick = function() {
      var flag = true;
      deleteTask(taskId, flag);
    }
    return deleteIconWrapper;
  }

  /*
  --------------------------------------
  !----------DELETING A TASK ----------!
  --------------------------------------
  */

  /*
  Deletes a task in two steps: 1) collapsing the task container, listElement, with a transition by adding the "hidden" class. 2) removing the task container, listElement, from the DOM once the transition has taken place. Also stores all deleted tasks as strings in an array, so they can be accessed for an Undo feature.
  When flag is false, don't dispatch 'delete' event inside deleteTask to the notifyUndo module. This ensures when a user edits a field, erases the contents and clicks away, which removes the task, the notify bar doesn't trigger.
  idNum is a number. Flag is a boolean.
  */
  function deleteTask(idNum, flag) {
    var listContainer = document.getElementById("list-container");
    var listElement = document.getElementById("list-item-container-" + idNum);
    listElement.classList.add("hidden");
    listElement.setAttribute("aria-hidden", "true");
    //store value of <p> element (aka submitted task) in a string
    var taskString = document.getElementById("list-item-label-" + idNum).textContent.toString();
    var taskComplete = document.getElementById("real-checkbox-" + idNum).checked;
    // remove task key:value pair from app.store.submittedTasks object
    app.store.deleteTask(idNum);
    // If a task is deleted, dispatch the 'delete' event
    if (flag) {
      var deleteEvent = new CustomEvent('delete', { 'detail': {'task': {id: idNum, complete: taskComplete, text: taskString }}});
      document.body.dispatchEvent(deleteEvent);
    }
  }

  /*
  ----------------------------------------
  !----------COMPLETING A TASK ----------!
  ----------------------------------------
  */ 
  
  /*
  Simulates checkbox behavior on fakeCheckbox while updating the realCheckbox 'checked' state. Applies different styles to the completed task. idNum is a number.
  skipSave is a boolean. True if the task is coming from localStorage, otherwise undefined (falsy)
  */
  function completeTask(idNum, skipSave) {
    var realCheckbox = document.getElementById("real-checkbox-" + idNum);
    var checkmarkIconWrapper = document.getElementById("checkmark-icon-wrapper-" + idNum);
    if (realCheckbox.checked === false) {
      realCheckbox.checked = true;
      checkmarkIconWrapper.style.visibility = "visible";
      document.getElementById("list-item-label-" + idNum).classList.add("complete");
      if (!skipSave) {
        var task = app.store.getTask(idNum);
        task.complete = true;
        app.store.setTask(idNum, task)
      }
    } else {
      realCheckbox.checked = false;
      checkmarkIconWrapper.style.visibility = "hidden";
      document.getElementById("list-item-label-" + idNum).classList.remove("complete");
      if (!skipSave) {
        var task = app.store.getTask(idNum);
        task.complete = false;
        app.store.setTask(idNum, task)
      }
    }
  }

  /*
  ----------------------------------------
  !----------SUBMITTING A TASK ----------!
  ----------------------------------------
  */  
  
  /*
  Submits a task by replacing the inputElement with the pElement and displaying the fakeCheckbox and deleteIcon; input is a string and idNum is a number.
  skipSave is a boolean. True if the task is coming from localStorage, otherwise undefined (falsy)
  */
  function submitTask(input, idNum, skipSave) {
    var pElement = document.getElementById("list-item-label-" + idNum);
    var inputElement = document.getElementById("list-item-input-" + idNum);
    var deleteIcon = document.getElementById("delete-icon-wrapper-" + idNum);
    var fakeCheckbox = document.getElementById("fake-checkbox-" + idNum);
    var realCheckbox = document.getElementById("real-checkbox-" + idNum);
    
    /*
    Add aria-label attribute value to the real checkbox <input type="checkbox" ...>
    */
    realCheckbox.setAttribute("aria-label", input);
    
    /*
    Keep pElement empty of text until it's visible, otherwise it stretches the container div height with the value inside the input field.
    */
    pElement.textContent = "";
    pElement.textContent = input;
    /*
    update global nested object 'app.store' to pass data between modules
    */
    if (!skipSave) {
      // Create a task object
      var task = {id: idNum, complete: realCheckbox.checked, text: input};
      app.store.setTask(idNum, task);      
    }
    deleteIcon.style.display = "inline-block";
    fakeCheckbox.style.display = "inline-block";
    /*
    allow a small amount of time for these elements to be added to the layout before triggering the transition
    */
    setTimeout(function() {
      deleteIcon.classList.toggle("hidden");
      deleteIcon.removeAttribute("aria-hidden");
      fakeCheckbox.classList.toggle("hidden");
      fakeCheckbox.removeAttribute("aria-hidden");
    }, 25);
    pElement.classList.toggle("hidden");
    pElement.removeAttribute("aria-hidden");
    inputElement.classList.toggle("hidden");
    inputElement.setAttribute("aria-hidden", "true");
  }

  // When the user clicks away from editing an input field, a few things can happen depending on context - particularly the value of the inputElement and whether or not it's the last item on the list. idNum is a number.
  function checkToSubmit(idNum) {
    var inputElement = document.getElementById("list-item-input-" + idNum);
    var listElement = document.getElementById("list-item-container-" + idNum);
    var userInput = inputElement.value;
       /*
      If user clicks away from the field with a non-empty task, submit the task.
      */
      if (userInput !== "") {
        submitTask(userInput, idNum);
        /*
        Need to make sure the last task is the one being submitted before adding a new task... The <div> that holds each task's elements has an id of the form "list-item-container-x". Does x = idNum? If so, the submitted task is the last task on the list, so add a new task.
        First get x, which is the value of 'row' at the time the <div> was created. x is the number after the last dash on the id name.
        */
        var idString = listContainer.lastChild.id;
        /*
        id name is of form: "list-item-container-x", so want 4th element in array (indexes at 0) returned by element.split
        */
        var lastId = idString.split("-")[3];
        //idNum is a number, lastId is a string
        if (idNum.toString() === lastId) {
          addTask();
        }
      }
      if (listContainer.children.length === 1 || listContainer.lastChild === listElement) {
        return;
      }

      /*
      Removes a task if the user has not entered anything and clicks away unless the task is last on the list.
      */
      if (userInput === "" && inputElement.classList.toString() === "list-item") {
        // when flag is false, don't dispatch 'delete' event inside deleteTask to show notification bar. This ensures when a user edits a field, erases the contents and clicks away, which removes the task, the notify bar doesn't trigger.
        deleteTask(idNum, false);
      }
  }


  /*
  -------------------------------------
  !----------EDITING A TASK ----------!
  -------------------------------------
  */
  
  /*
  Edits a task by replacing the pElement with the inputElement and hiding the fakeCheckbox and deleteIcon; input is a string and idNum is a number.
  */
  function editTask(input, idNum) {
    var pElement = document.getElementById("list-item-label-" + idNum);
    var inputElement = document.getElementById("list-item-input-" + idNum);
    var deleteIcon = document.getElementById("delete-icon-wrapper-" + idNum);
    var fakeCheckbox = document.getElementById("fake-checkbox-" + idNum);
    var listElement = document.getElementById("list-item-container-" + idNum);
   
    inputElement.value = input;
    deleteIcon.style.display = "none";
    fakeCheckbox.style.display = "none";
    deleteIcon.classList.toggle("hidden");
    deleteIcon.setAttribute("aria-hidden", "true");
    fakeCheckbox.classList.toggle("hidden");
    fakeCheckbox.setAttribute("aria-hidden", "true");
    pElement.classList.toggle("hidden");
    pElement.setAttribute("aria-hidden", "true");
    inputElement.classList.toggle("hidden");
    inputElement.removeAttribute("aria-hidden");
    inputElement.focus();
    
    // initialize flag 'submitFired' to prevent calling submitTask twice. This happens when the user hits 'enter' to submit a task: it fires the inputElement.onkeyup event AND the inputElement.onblur event. When submitFired is true, the 'enter' key has been hit, so exit the inputElement.onblur callback function.
    var submitFired = false;
    document.body.addEventListener('submit', function() {
      submitFired = true;
    });
   
    //Click away to submit, at task edit
    inputElement.onblur = function() {
      if(submitFired) {
        return;
      }
      checkToSubmit(idNum);
    }
  }

   /*
  ---------------------------------------
  !----------AUTO-SCROLL LIST ----------!
  ---------------------------------------
  */
  // Scroll to the bottom of the document
  function autoScroll() {
    window.scrollTo(0,document.body.scrollHeight);
  }
    
  
}());