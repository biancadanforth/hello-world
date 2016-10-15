/* Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app? app : {
  store: { 
    // The submittedTasks object is appended with a new property every time the user submits a task (by hitting 'Enter'), with key: value pairs of the form: row-x: "Task content string". Deleting or completing a task removes the corresponding property from this object.
    submittedTasks: {},
    // The completedTasks object  is appended with a new property every time the user completes a task (by clicking the checkbox), with key: value pairs of the form: row-x: "Task content string". These tasks can be viewed underneath the to do list and restored to the list.
    completedTasks: {},
    // The lastDeletedTask object only ever has one property in it for the most recently deleted task. It is of the form row-x: "Task content string".
    lastDeletedTask: {}
  }
};


//Wrap entire module in an immediately invoked function so global variables in this module don't pollute the global namespace for the application.
(function () {
  // Global variables
  var listSection = document.getElementById("list-section");
  var actionSpan = document.getElementById("action-span");
  var rectangle = document.getElementById(
  "rectangle");
  var dismissLink = document.getElementById("dismiss");
  var undoLink = document.getElementById("undo");

// Listen for when a task from the list-item module has been deleted.
document.body.addEventListener("delete", function(event) {
  console.log("delete event fired!");
  // receive the row number (rowNum) and task string (taskString) from list-item module for the most recently deleted task
  var deleteInfo = event.detail;
  console.log(deleteInfo);
  // show notification bar
  // if the user clicks undo, restore the task to the list in its original location
  // if the user clicks dismiss, hide notification bar
  }
);
  
  /* listSection.onclick = function(event) {
    var element = event.target;
    var idString = element.id;
    console.log(idString);
    // if user has clicked the fake checkbox to complete a task
    if (idString.includes("fake")) {
      // id name is of form: "fake-checkbox-x", so want 3rd element in array (indexes at 0) returned by string.split
      var rowNum = idString.split("-")[2];
      showRectangle(true);
      var listItemContainer = document.getElementById("list-item-container-" + rowNum);
      listItemContainer.style.display = "none";
      // else if the user has clicked a delete button
    } else if (idString.includes("delete")) {
      console.log(idString);
      // id name is of form: "delete-icon-wrapper-x", so want 4th element in array (indexes at 0) returned by string.split
      var rowNum = idString.split("-")[3];
      showRectangle(false);
      var listItemContainer = document.getElementById("list-item-container-" + rowNum);
      listItemContainer.style.display = "none";

    }
    undoLink.onclick = function() {
      undo(listItemContainer);
      hideRectangle();
    }
  } */

  dismiss.onclick = hideRectangle;

  function undo(elem) {
    elem.style.display = "flex";
  }

  //setTimeout needs to reset each time a task is deleted or completed
  var timerId;

  function showRectangle(flag) {
    window.clearTimeout(timerId);
    if (flag) {
      actionSpan.textContent = "completed a task!";
    } else {
      actionSpan.textContent = "deleted a task!";
    }
    rectangle.classList.remove("hidden");
    timerId = setTimeout(hideRectangle, 6000);
  }

  function hideRectangle() {
    rectangle.classList.add("hidden");
  }
}());