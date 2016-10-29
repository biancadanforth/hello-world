/*
Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app? app : {
  store: { 
    /*
    The submittedTasks object is appended with a new property every time the user submits a task (by hitting 'Enter') in the list-item.js module, with key: value pairs of the form: row-x: "Task content string". Deleting or completing a task removes the corresponding property from this object.
    */
    submittedTasks: {}
  }
};

/*
Wrap entire module in an immediately invoked function so global variables in this module don't pollute the global namespace for the application.
The ! at the start of the line allows Javascript ASI to kick in on the previous line and insert any missing semicolons for you. Per AirBnB ES5 Style Guide
*/
!(function() {
  // Initializes global variables
  var row = 0;
  var listContainer = document.getElementById("list-container");

  // Creates the first editable task on the screen
  addTask();
  
  /* 
  -------------------------------------
  !----------ADDING A TASK  ----------!
  -------------------------------------
  */
  //reference: http://jsfiddle.net/g79ssyqv/12/
  function addTask() {

    // Auto scroll to bottom of list when it is extended by adding a new task
    autoScroll();
  
    /*
    Creates a new, unique id#list-item-container-x <div> inside the id#list-container <div> to wrap each task in
    */
    var listNode = createListNode(row);
    listContainer.appendChild(listNode);

    /*
    Creates a new, unique -real- checkbox, <input type="checkbox">, inside id#list-item-container-x <div>
    */
    var realCheckbox = createRealCheckbox(row);
    listNode.appendChild(realCheckbox);

    /*
    Creates a new, unique -fake- checkbox, <span>, inside id#list-item-container-x <div>
    */
    var fakeCheckbox = createFakeCheckbox(row);
    listNode.appendChild(fakeCheckbox);

    /*
    Creates a new, unique checkmark icon, <svg>, inside the fakeCheckbox, <span>. This requires obtaining the XML document containing the <svg> element from the web server.
    */
    var checkmarkIcon = loadIcon("/images/to-do-list/checkmark.svg", fakeCheckbox);
    /*
    Note: Cannot add classes/ids in JS on an external XML resource using setAttribute like the others; just target parent class and use descendant selector for styling: e.g. .parent svg {..}.
    */

    /*
    Creates a new, unique input text field, <input type="text">, inside id#list-item-container-x <div>
    */
    var inputNode = createInputNode(row, listContainer, listNode);
    listNode.appendChild(inputNode);
    inputNode.focus();

    /*
    Creates a new, unique element, <p>, initially hidden, to replace the <input> element inside id#list-item-container-x <div> when the task is submitted
    */
    var submittedTask = createSubmittedTask(row);
    listNode.appendChild(submittedTask);

    /*
    Creates a new, unique element, <a>, to wrap the deleteIcon svg inside the id#list-item-container-x <div>; this allows me to target/style the delete icon without needing to change the contents of the svg XML document.
    */
    var deleteIconWrapper = createDeleteIconWrapper(row);
    listNode.appendChild(deleteIconWrapper);

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
      listNode.classList.remove("hidden");
      listNode.removeAttribute("aria-hidden");
    }, 50);

    row++;
  }

  /*
  ------------------------------------------------------
  !----------CREATING ELEMENTS FOR EACH TASK ----------!
  ------------------------------------------------------
  */

  /*
  Creates a new, unique id#list-item-container-x div; rowNum is a number.
  */
  function createListNode(rowNum) {
    var listNode = document.createElement("div");
    listNode.setAttribute("id", "list-item-container-" + rowNum);
    listNode.setAttribute("class", "list-item-container hidden");
    listNode.setAttribute("aria-hidden", "true");
    return listNode;
  }

  //Creates a new, unique -real- checkbox; rowNum is a number.
  function createRealCheckbox(rowNum) {
    var realCheckbox = document.createElement("input");
    realCheckbox.setAttribute("type", "checkbox");
    realCheckbox.setAttribute("id", "real-checkbox-" + row);
    return realCheckbox;
  }

  /*
  Creates a new, unique -fake- checkbox that the user can click to complete a task; rowNum is a number.
  */
  function createFakeCheckbox(rowNum) {
    var fakeCheckbox = document.createElement("span");
    // user can't interact with checkbox until they've submitted a task
    fakeCheckbox.setAttribute("class", "checkbox hidden");
    fakeCheckbox.setAttribute("id", "fake-checkbox-" + row);
    fakeCheckbox.setAttribute("title", "Complete task");
    fakeCheckbox.setAttribute("aria-hidden", "true");
    fakeCheckbox.setAttribute("aria-label", "Complete");
    fakeCheckbox.style.display = "none";
    fakeCheckbox.onclick = function() {
      completeTask(rowNum);
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

  /*
  Creates a new, unique input text field, <input type="text"> with which the user can enter and submit a task, adding a new task (if the submitted task is the last task) or remove an empty task (that isn't the last task) when the user clicks away; rowNum is a number.
  */
  function createInputNode(rowNum, listContainer, listNode) {
    var inputNode = document.createElement("input");
    inputNode.setAttribute("type", "text");
    inputNode.setAttribute("id", "list-item-input-" + row);
    inputNode.setAttribute("class", "list-item");
    inputNode.setAttribute("placeholder", "Write task here. Hit 'Enter' to submit.");
   
    /* **********************
    CLICK AWAY TO SUBMIT IN CREATE MODE
    ********************************
    */
    // initialize flag 'submitFired' to prevent calling submitTask twice. When the user hits 'enter' to submit a task, it fires an event looking for the enter key AND the inputNode onblur event. When submitTask is true, the 'enter' key has been hit
    var submitFired = false;
    document.body.addEventListener('submit', function() {
      submitFired = true;
    });
   
    inputNode.onblur = function() { 
      var userInput = inputNode.value;
       /*
      If user clicks away from the field with a non-empty task, submit the task.
      */
      if (userInput !== "" && !submitFired) {
        // reset submitFired flag
        submitFired = false;
        submitTask(userInput, rowNum);
        //Need to make sure the last task is the one being submitted before adding a new task... The <div> that holds each task's elements has an id of the form "list-item-container-x". Does x = rowNum? If so, the submitted task is the last task on the list, so add a new task.
        // First get x, which is the value of 'row' at the time the <div> was created. x is the number after the last dash on the id name.
        var idString = listContainer.lastChild.id;
        //id name is of form: "list-item-container-x", so want 4th element in array (indexes at 0) returned by element.split
        var lastId = idString.split("-")[3];
        //rowNum is a number, lastId is a string
        if (rowNum.toString() === lastId) {
          addTask();
        }
      }
      if (listContainer.children.length === 1 || listContainer.lastChild === listNode) {
        return;
      }
      /*
      Removes a task if the user has not entered anything and clicks away unless the task is last on the list.
      */
      if (inputNode.value === "" && inputNode.classList.toString() === "list-item") {
        // when flag is false, don't dispatch 'delete' event inside deleteTask to show notification bar. This ensures when a user edits a field, erases the contents and clicks away, which removes the task, the notify bar doesn't trigger.
        var flag = false;
        deleteTask(rowNum, flag);
      }
    };
    
    /*
    Listen for when user presses the 'Enter' key, if input has a non-empty value, submitTask... If it's the last task, add a new task. If the submitted task is empty, add keyframes bounce animation.
    */
    inputNode.onkeyup = function(event) {
      var userInput = inputNode.value;
      if (userInput !== "" && event.keyCode === 13) {
        var submitEvent = new CustomEvent('submit');
        document.body.dispatchEvent(submitEvent);
        submitTask(userInput, rowNum);
        /*
        Need to make sure the last task is the one being submitted before adding a new task... The <div> that holds each task's elements has an id of the form "list-item-container-x". Does x = rowNum? If so, the submitted task is the last task on the list, so add a new task.
        First get x, which is the value of 'row' at the time the <div> was created. x is the number after the last dash on the id name.
        */
        var idString = listContainer.lastChild.id;
        /*
        id name is of form: "list-item-container-x", so want 4th element in array (indexes at 0) returned by element.split
        */
        var lastId = idString.split("-")[3];
        //rowNum is a number, lastId is a string
        if (rowNum.toString() === lastId) {
          addTask();
        }
      } else if (userInput === "" && event.keyCode === 13) {
        inputNode.classList.add("bounce");
        setTimeout(function() {
          /*
          remove the class so animation can occur as many times as user triggers event, delay must be longer than the animation duration and any delay.
          */
          inputNode.classList.remove("bounce");
        }, 1000);
      }
    };
    return inputNode;
  }

  /*
  Creates a new, unique element, <p>, initially hidden, to replace the <input> element when the task is submitted. The user can edit the task by clicking this element; rowNum is a number.
  */
  function createSubmittedTask(rowNum) {
    var submittedTask = document.createElement("p");
    submittedTask.setAttribute("id", "list-item-label-" + rowNum);
    submittedTask.setAttribute("class", "list-item hidden");
    submittedTask.setAttribute("aria-hidden", "true");
    /*
    grab <p> element, 'submittedTask' and replace it with <input> element 'inputNode', without removing either from the DOM.
    */
    submittedTask.onclick = function() {
      var userInput = submittedTask.textContent;
      editTask(userInput, rowNum);
    };
    return submittedTask;
  }

  /*
  Creates a new, unique element, <a>, to wrap the deleteIcon svg. The user can delete a task by clicking this element; rowNum is a number.
  */
  function createDeleteIconWrapper(rowNum) {
    var deleteIconWrapper = document.createElement("a");
    // user can't interact with delete icon until they've entered a task
    deleteIconWrapper.setAttribute("class", "hidden");
    deleteIconWrapper.setAttribute("id", "delete-icon-wrapper-" + row);
    deleteIconWrapper.setAttribute("title", "Delete task");
    deleteIconWrapper.setAttribute("aria-hidden", "true");
    deleteIconWrapper.setAttribute("aria-label", "Delete");
    deleteIconWrapper.style.display = "none";
    /*
    I have to wrap deleteTask(..) in another function so I can pass in an argument but avoid immediately executing the function at the same time.
    */
    deleteIconWrapper.onclick = function() {
      var flag = true;
      deleteTask(rowNum, flag);
    }
    return deleteIconWrapper;
  }

  /*
  --------------------------------------
  !----------DELETING A TASK ----------!
  --------------------------------------
  */

  /*
  Deletes a task in two steps: 1) collapsing the task container, listNode, with a transition by adding the "hidden" class. 2) removing the task container, listNode, from the DOM once the transition has taken place. Also stores all deleted tasks as strings in an array, so they can be accessed for an Undo feature.
  When flag is false, don't dispatch 'delete' event inside deleteTask to the notifyUndo module. This ensures when a user edits a field, erases the contents and clicks away, which removes the task, the notify bar doesn't trigger.
  idNum is a number. Flag is a boolean.
  */
  function deleteTask(idNum, flag) {
    var listContainer = document.getElementById("list-container");
    var listNode = document.getElementById("list-item-container-" + idNum);
    listNode.classList.add("hidden");
    listNode.classList.setAttribute("aria-hidden", "true");
    //store value of <p> element (aka submitted task) in a string
    var taskString = document.getElementById("list-item-label-" + idNum).textContent.toString();
    // remove task key:value pair from app.store.submittedTasks object
    delete app.store.submittedTasks["row-" + idNum];
    // If a task is deleted, dispatch the 'delete' event
    if (flag) {
      var deleteEvent = new CustomEvent('delete', { 'detail': { 'row': idNum, 'task': taskString } });
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
  */
  function completeTask(idNum) {
    var realCheckbox = document.getElementById("real-checkbox-" + idNum);
    var fakeCheckbox = document.getElementById("fake-checkbox-" + idNum);
    var checkmark = fakeCheckbox.firstChild;
    if (realCheckbox.checked === false) {
      realCheckbox.checked = true;
      checkmark.style.visibility = "visible";
      document.getElementById("list-item-label-" + idNum).classList.add("complete");
    } else {
      realCheckbox.checked = false;
      checkmark.style.visibility = "hidden";
      document.getElementById("list-item-label-" + idNum).classList.remove("complete");
    }
  }

  /*
  ----------------------------------------
  !----------SUBMITTING A TASK ----------!
  ----------------------------------------
  */  
  
  /*
  Submits a task by replacing the inputElement with the pElement and displaying the fakeCheckbox and deleteIcon; input is a string and idNum is a number.
  */
  function submitTask(input, idNum) {
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
    app.store.submittedTasks["row-" + idNum] = input;
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
    
    /* **********************
    CLICK AWAY TO SUBMIT IN EDIT MODE
    ********************************
    */
    // initialize flag 'submitFired' to prevent calling submitTask twice. When the user hits 'enter' to submit a task, it fires an event looking for the enter key AND the inputNode onblur event. When submitTask is true, the 'enter' key has been hit
    var submitFired = false;
    document.body.addEventListener('submit', function() {
      submitFired = true;
    });
   
    inputElement.onblur = function() {
      
      var userInput = inputElement.value;
       /*
      If user clicks away from the field with a non-empty task, submit the task.
      */
      if (userInput !== "" && !submitFired) {
        // reset submitFired flag
        submitFired = false;
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