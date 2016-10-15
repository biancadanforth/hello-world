/* Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app? app : {
  store: { 
    // The submittedTasks object is appended with a new property every time the user submits a task (by hitting 'Enter'), with key: value pairs of the form: row-x: "Task content string". Deleting or completing a task removes the corresponding property from this object.
    submittedTasks: {},
    // The lastCompletedTask object only ever has one property in it for the most recently completed task. It is of the form row-x: "Task content string".
    lastCompletedTask: {},
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

  listSection.onclick = function(event) {
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
  }

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