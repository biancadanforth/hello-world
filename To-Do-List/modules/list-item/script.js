// Adding a task
var row = 0;
var addTaskContainer = document.getElementById("add-task-container");
var listContainer = document.getElementById("list-container");

addTaskContainer.addEventListener("click", addTask);

function addTask() {
  
  //create a new, unique list-item-container div
  var containerNode = document.createElement("div");
  containerNode.setAttribute("id", "list-item-container-" + row);
  containerNode.setAttribute("class", "list-item-container");
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
  var checkmarkIcon = new XMLHttpRequest();
  checkmarkIcon.open("GET", "/images/checkmark.svg", true);
  checkmarkIcon.overrideMimeType("image/svg+xml");
  checkmarkIcon.onreadystatechange = function() {
    if (checkmarkIcon.readyState === XMLHttpRequest.DONE && checkmarkIcon.status === 200) {
      fakeCheckbox.appendChild(checkmarkIcon.responseXML.documentElement);
    }
  }
  checkmarkIcon.send();
  checkmarkIcon.setAttribute("class", "checkmark-icon");
  checkmarkIcon.setAttribute("id", "checkmark-icon-" + row);
  fakeCheckbox.appendChild(checkmarkIcon);
  
  // create a new, unique input text field  inside list-item-container div
  var inputNode = document.createElement("input");
  inputNode.setAttribute("type", "text");
  inputNode.setAttribute("id", "list-item-label-" + row);
  inputNode.setAttribute("class", "list-item");
  // add node to DOM at a particular location
  containerNode.appendChild(inputNode);
  
  //create a new, unique delete icon inside list-item-container div
  var deleteIcon = document.createElement("svg");
  deleteIcon.setAttribute("class", "delete-icon");
  deleteIcon.setAttribute("id", "delete-icon-" + row);
  containerNode.appendChild(deleteIcon);
  
  row++;
}
