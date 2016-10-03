// !----------ADD A TASK----------! reference: http://jsfiddle.net/g79ssyqv/12/
var row = 0;
var addTaskContainer = document.getElementById("add-task-container");
var listContainer = document.getElementById("list-container");

addTaskContainer.addEventListener("click", addTask);

function addTask() {
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
  
  // create a new, unique input text field  inside list-item-container div
  var inputNode = document.createElement("input");
  inputNode.setAttribute("type", "text");
  inputNode.setAttribute("id", "list-item-label-" + row);
  inputNode.setAttribute("class", "list-item");
  // add node to DOM at a particular location
  containerNode.appendChild(inputNode);
  inputNode.focus();
  
  // create a new, unique anchor tag to wrap the delete icon svg inside the list-item-container div
  var svgWrapper = document.createElement("a");
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
  
// !----------DELETING A TASK----------!
  //storing the current value of row into the variable rowNum takes a snapshot of the value, so it passes in 0 the first time the delete icon is clicked, instead of 1, which would be the value of row after exiting the addTask function (and would throw an error that the element to remove was null).
  var rowNum = row;

  // I have to wrap deleteTask(..) in another function so I can pass in an argument but avoid immediately executing the function at the same time.
  svgWrapper.onclick = function() {
    deleteTask(rowNum);
  }
  
  // !----------CHECKBOX FUNCTIONALITY----------!
  fakeCheckbox.onclick = function() {
    toggleCheckbox(rowNum);
  };
  
  // !----------SUBMITTING TASK FUNCTIONALITY----------!
  // Listen for when user presses the 'Enter' key
  inputNode.onkeyup = function(event) {
    var userInput = inputNode.value;
    console.log(rowNum);
    if (event.keyCode == 13) {
      console.log("enter key pressed");
      submitTask(userInput, rowNum); 
    }
  };
  
  row++;
}

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
 function submitTask(input, idNum) {
   console.log(idNum);
   console.log(input);
   if (input === "") {
    console.log("Please enter a task into the field.");
    // disable triggering addTask()
    } else { // make a span element with the userInput value as text content
      // create a new, unique p element to replace the input element inside list-item-container div
      var submittedTask = document.createElement("p");
      submittedTask.setAttribute("id", "list-item-label-" + idNum);
      submittedTask.setAttribute("class", "list-item");
      submittedTask.textContent = input;
      // grab <input> and replace it with <p>
      var inputElement = document.getElementById("list-item-label-" + idNum);
      inputElement.parentNode.replaceChild(submittedTask, inputElement);
    }
  }
