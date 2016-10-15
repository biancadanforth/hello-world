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
  var rectangle = document.getElementById(
  "rectangle");
  var dismissLink = document.getElementById("dismiss");
  var undoLink = document.getElementById("undo");

  // Listen for when a task from the list-item module has been deleted.
  document.body.addEventListener("delete", function(event) {
    console.log("delete event fired!");
    // receive the row number (rowNum) and task string (taskString) from list-item module for the most recently deleted task
    var taskInfo = event.detail;
    var rowNum = taskInfo.row;
    var taskString = taskInfo.task;
    // show notification bar
    showRectangle();
    // if the user clicks undo, restore the task to the list in its original location
    undoLink.onclick = function() {
      undo(rowNum, taskString);
    }
    // if the user clicks dismiss, hide notification bar
    dismissLink.onclick = function() {
      hideRectangle(rowNum, false);
    };
  }
  );

  function undo(rowNum, taskString) {
    var listNode = document.getElementById("list-item-container-" + rowNum);
    listNode.classList.remove("hidden");
    hideRectangle(rowNum, true);
  }

  //setTimeout needs to reset each time a task is deleted or completed
  var timerId;

  function showRectangle() {
    window.clearTimeout(timerId);
    rectangle.classList.remove("hidden");
    timerId = setTimeout(hideRectangle, 60000);
  }

  function hideRectangle(rowNum, flag) {
    rectangle.classList.add("hidden");
    //if flag is true, then the user clicked 'undo' if false, the user clicked 'dismiss'
    if (!flag) {
      listNode = document.getElementById("list-item-container-" + rowNum);
      setTimeout(function() {
        listNode.remove();
      }, 2200); 
    }
  }
  
}());