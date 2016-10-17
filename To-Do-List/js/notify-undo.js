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
  // If user spam deletes a bunch of tasks, want to make sure those are permanently deleted (i.e. removed from the DOM). Store task numbers in rowArray.
  var rowArray = [];
  // Remove spam-deleted tasks after a certain amount of time
  var deleteClickTimer;

  // Listen for when a task from the list-item module has been deleted.
  document.body.addEventListener("delete", function(event) {
    clearTimeout(deleteClickTimer);
    // receive the row number (rowNum) and task string (taskString) from list-item module for the most recently deleted task
    var taskInfo = event.detail;
    var rowNum = taskInfo.row;
    var taskString = taskInfo.task;
    // show notification bar
    showRectangle(rowNum);
    // if the user clicks undo, restore the task to the list in its original location
    undoLink.onclick = function() {
      undo(rowNum, taskString);
    }
    // if the user clicks dismiss, hide notification bar
    dismissLink.onclick = function() {
      hideRectangle(rowNum);
    };
    // If the user spam deletes a number of tasks at once, capture the rowNum for each task in rowArray and remove each element from the DOM.
    rowArray.push(rowNum);
    // Remove spam-deleted tasks after a certain amount of time; amount of time must be longer than the amount of time the user has to interact with the notification bar (because they could undo the task, which means that task shouldn't be removed from the DOM.
    // Run clearDeleteBacklog only if no tasks have been deleted in a while.
    deleteClickTimer = setTimeout(clearDeleteBacklog, 10000);
  }
  );
  
  
  // Run this function only if no tasks have been deleted in a while.
  function clearDeleteBacklog() {
    // capture the value of rowArray statically in 'arrayLength', so value doesn't change when splicing the array.
    var arrayLength = rowArray.length;
    for (var i = 0; i <= arrayLength-1; i++) {
      let taskNum = rowArray[i];
      removeFromDOM(taskNum);
    }
  }
    
  function undo(rowNum, taskString) {
    var listNode = document.getElementById("list-item-container-" + rowNum);
    listNode.classList.remove("hidden");
    hideRectangle(rowNum);
    //remove task number (rowNum) from rowArray, so it isn't removed from the DOM when clearDeleteBacklog is executed.
    var index = rowArray.indexOf(rowNum);
    rowArray.splice(index, 1);
  }

  //setTimeout needs to reset each time a task is deleted or completed
  var timerId;

  function showRectangle(rowNum) {
    window.clearTimeout(timerId);
    rectangle.classList.remove("hidden");
    timerId = setTimeout(function() {
      hideRectangle(rowNum, false)
    }, 6000);
  }

  function hideRectangle(rowNum) {
    rectangle.classList.add("hidden");
  }
  
  function removeFromDOM(rowNum) {
    listNode = document.getElementById("list-item-container-" + rowNum);
    listNode.remove();
  }
  
}());
