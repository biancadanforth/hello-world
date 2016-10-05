// !----------ADD A TASK----------! reference: http://jsfiddle.net/g79ssyqv/12/
var row = 0;
var addTaskContainer = document.getElementById("add-task-container");
var listContainer = document.getElementById("list-container");

addTaskContainer.addEventListener("click", addTask);

function addTask() {
  // disable addTask() until previous task's input text field has an entered value and has been submitted by hitting 'Enter'
  //checks for this by making sure the previous task exists (first condition returns truthy if the element exists in the DOM and falsy if it does not (returns null which is a falsy value)) and that the submitTask function has executed, thus there is a <p> element where there once was an <input> element that is visible.
  //The first condition, the existence check, is necessary so that the addTask function executes even in the case where the user has deleted the previous task. Without it, the second condition would throw an error: "Uncaught TypeError: Cannot read property 'nodeName' of null", and would stop executing the rest of the script.
  if (document.getElementById("list-item-label-" + (row-1)) && document.getElementById("list-item-label-" + (row-1)).classList.contains("list-item-hidden")) {
    return;
  }
  
  //create a new, unique list-item-container div
  var containerNode = document.createElement("div");
  containerNode.setAttribute("id", "list-item-container-" + row);
  containerNode.setAttribute("class", "list-item-container");
  // remove border around containerNode permanently when at least one instance of it is present.
  if (row >= 0) {
    containerNode.style.borderBottom = "0";
  }
  // put the new element in the DOM at a specific location
  listContainer.appendChild(containerNode);
  
  //create a new, unique -real- checkbox inside list-item-container div
  var realCheckbox = document.createElement("input");
  realCheckbox.setAttribute("type", "checkbox");
  realCheckbox.setAttribute("id", "real-checkbox-" + row);
  containerNode.appendChild(realCheckbox);
  
  //create a new, unique -fake- checkbox inside list-item-container div
  var fakeCheckbox = document.createElement("span");
  fakeCheckbox.setAttribute("class", "checkbox");
  fakeCheckbox.setAttribute("id", "fake-checkbox-" + row);
  // user can't interact with checkbox until they've entered a task
  fakeCheckbox.style.visibility = "hidden";
  containerNode.appendChild(fakeCheckbox);
  
  //create a new, unique checkmark icon inside fake-checkbox span
  //This requires obtaining the svg XML element from the web server
  var checkmarkIcon = new XMLHttpRequest();
  checkmarkIcon.open("GET", "/images/checkmark.svg", true);
  checkmarkIcon.overrideMimeType("image/svg+xml");
  checkmarkIcon.onreadystatechange = function() {
    if (checkmarkIcon.readyState === XMLHttpRequest.DONE && checkmarkIcon.status === 200) {
      fakeCheckbox.appendChild(checkmarkIcon.responseXML.documentElement);
    }
  }
  checkmarkIcon.send();
  //Cannot add classes/ids in JS on an external XML resource using setAttribute like the others; just target parent class and use descendant selector for styling: e.g. .parent svg {..}.
  
  // create a new, unique input text field inside list-item-container div
  var inputNode = document.createElement("input");
  inputNode.setAttribute("type", "text");
  inputNode.setAttribute("id", "list-item-input-" + row);
  inputNode.setAttribute("class", "list-item");
  // add node to DOM at a particular location
  containerNode.appendChild(inputNode);
  inputNode.focus();
  
  // create a new, unique p element, initially hidden, to replace the input element inside list-item-container div when the task is submitted
  var submittedTask = document.createElement("p");
  submittedTask.setAttribute("id", "list-item-label-" + row);
  submittedTask.setAttribute("class", "list-item list-item-hidden");
  containerNode.appendChild(submittedTask);
  
  
  // create a new, unique anchor tag to wrap the delete icon svg inside the list-item-container div; this allows me to target the delete icon without needing to change the contents of the svg XML document.
  var svgWrapper = document.createElement("a");
  svgWrapper.setAttribute("id", "delete-wrapper-" + row);
  containerNode.appendChild(svgWrapper);
  
  //create a new, unique delete icon inside anchor tag
 //This requires obtaining the svg XML element from the web server
  var deleteIcon = new XMLHttpRequest();
  deleteIcon.open("GET", "/images/delete-icon.svg", true);
  deleteIcon.overrideMimeType("image/svg+xml");
  deleteIcon.onreadystatechange = function() {
    if (deleteIcon.readyState === XMLHttpRequest.DONE && deleteIcon.status === 200) {
      svgWrapper.appendChild(deleteIcon.responseXML.documentElement);
    }
  }
  deleteIcon.send();
  //Cannot [at least easily] add classes/ids in JS on an XML resource; just target parent class and use descendant selector for styling: e.g. .parent svg {..}.
  // user can't interact with delete icon until they've entered a task
  svgWrapper.style.visibility = "hidden";
  
  //storing the current value of row into the variable rowNum takes a snapshot of the value, so it passes in 0 the first time the delete icon is clicked (or the checkbox is clicked, or a value is entered into the input field, etc...), instead of 1, which would be the value of row after exiting the addTask function (and would throw an error that the element to remove was null).
  var rowNum = row;

  // !----------DELETING A TASK----------!
  // I have to wrap deleteTask(..) in another function so I can pass in an argument but avoid immediately executing the function at the same time.
  svgWrapper.onclick = function() {
    deleteTask(rowNum);
  }
  
  // !----------CHECKBOX FUNCTIONALITY----------!
  fakeCheckbox.onclick = function() {
    toggleCheckbox(rowNum);
  };
  
  // !----------SUBMITTING TASK FUNCTIONALITY----------!
  // Listen for when user presses the 'Enter' key, if input has a non-empty value, grab the <input> element, 'inputNode' and replace it with the <p> element, 'submittedTask'.
  inputNode.onkeyup = function(event) {
    var userInput = inputNode.value;
    if (userInput != "" && event.keyCode == 13) {
      toggleSubmitEditTask(userInput, rowNum); 
      //user can't interact with delete icon or checkbox until they've entered and submitted a task
      fakeCheckbox.style.visibility = "visible";
      svgWrapper.style.visibility = "visible";
    }
  };
  
  // !----------EDITING TASK FUNCTIONALITY----------!
  // grab <p> element, 'submittedTask' and replace it with <input> element 'inputNode', without removing either from the DOM.
  submittedTask.onclick = function() {
    var userInput = submittedTask.textContent;
    toggleSubmitEditTask(userInput, rowNum);
  }
  
  row++;
}

// !----------DELETING A TASK----------!
function deleteTask(idNum) {
  document.getElementById("list-item-container-" + idNum).remove();
  };

// !----------CHECKBOX FUNCTIONALITY----------!
// Simulate checkbox behavior on fake checkbox
function toggleCheckbox(idNum) {
  var realCheckbox = document.getElementById("real-checkbox-" + idNum);
  var fakeCheckbox = document.getElementById("fake-checkbox-" + idNum);
  var checkmark = fakeCheckbox.firstChild;
  if (realCheckbox.checked == false) {
    realCheckbox.checked = true;
    checkmark.style.visibility = "visible";
  } else {
    realCheckbox.checked = false;
    checkmark.style.visibility = "hidden";
  }
}

// !----------SUBMITTING TASK FUNCTIONALITY----------!
function toggleSubmitEditTask(input, idNum) {
  var pElement = document.getElementById("list-item-label-" +idNum);
  var inputElement = document.getElementById("list-item-input-" + idNum);
  // Keep pElement empty of text until it's visible, otherwise it stretches the container div height with the value inside the input field.
  pElement.textContent = "";
  if (pElement.classList.contains("list-item-hidden")) {
    pElement.textContent = input;
  } else {
    inputElement.value = input;
    inputElement.focus();
  }
  pElement.classList.toggle("list-item-hidden");
  inputElement.classList.toggle("list-item-hidden");
}