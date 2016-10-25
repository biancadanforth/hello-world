/*
Notify-Undo.js module for To Do List Application
When the user deletes a task, a notification bar slides down from the top, giving them the option to undo the action or dismiss the notification. If the user clicks 'undo', the task is restored to the list in its original location. If the user clicks 'dismiss', the task is permanently removed from the DOM. If the user does not click either 'undo' or 'dismiss' within a waiting period, the notification bar automatically goes away, as if the user had clicked 'dismiss'. If the user spam deletes a number of tasks in a small period of time, only the most recently deleted task will be represented by the notification bar, however, all deleted tasks will be permanently removed from the DOM after the waiting period mentioned above.
*/

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
*/
!(function () {
  var notifyBar = document.getElementById(
  "notify-bar");
  var dismissLink = document.getElementById("dismiss-link");
  var undoLink = document.getElementById("undo-link");
  /*
  If user spam deletes a bunch of tasks, make sure all of them -- not just the most recently deleted task -- are permanently deleted (i.e. removed from the DOM). Store unique task numbers of each deleted task in deletedTaskNums array.
  */
  var deletedTaskNums = [];
  /*
  Timer for when to remove all deleted tasks from the DOM after the user has stopped deleting tasks.
  */
  var deleteClickTimer;
  /*
  The timer for how long to show the notification bar before it automatically dismisses itself if it receives no user input.
  */
  var notifyTimer;

  // Listen for when a task from the list-item module has been deleted.
  document.body.addEventListener("delete", function deleteTask(event) {
    clearTimeout(deleteClickTimer);
    
    /*
    Receive the unique task number (taskNum) and task string (taskString) from list-item module for the most recently deleted task
    */
    var taskInfo = event.detail;
    var taskNum = taskInfo.row;
    var taskString = taskInfo.task;

    showNotifyBar(taskNum);
    
    /*
    If the user clicks undo, hide the notification bar and restore the task to the list in its original location.
    */
    undoLink.onclick = function() {
      undo(taskNum, taskString);
    }
    // If the user clicks dismiss, hide the notification bar.
    dismissLink.onclick = function() {
      hideNotifyBar(taskNum);
    };
    /*
    If the user spam deletes a number of tasks at once, capture the taskNum for each task in deletedTaskNums and remove each element from the DOM.
    */
    deletedTaskNums.push(taskNum);
    
    /*
    Run clearDeleteBacklog only if no tasks have been deleted in a while. The delay must exceed the delay on notifyTimer
    */
    deleteClickTimer = setTimeout(clearDeleteBacklog, 65000);
  }
  );
  
  
  /*
  Remove spam-deleted tasks after a certain amount of time; amount of time must be longer than the amount of time the user has to interact with the most recently triggered notification bar (because they could undo the most recently deleted task.
  */
  function clearDeleteBacklog() {
    for (var i = 0; i <= deletedTaskNums.length-1; i++) {
      let taskNum = deletedTaskNums[i];
      removeFromDOM(taskNum);
    }
    /*
    after permanently removing all deleted tasks from the DOM, reset deletedTaskNums.
    */
    deletedTaskNums = [];
  }
  
  /*
  If the user clicks the 'undo' link, hide the notification bar and restore the task to the list in its original location. taskNum is a number, taskString is a string.
  */
  function undo(taskNum, taskString) {
    var listNode = document.getElementById("list-item-container-" + taskNum);
    listNode.classList.remove("hidden");
    hideNotifyBar(taskNum);
    /*
    remove task number (taskNum) from deletedTaskNums, so it isn't removed from the DOM when clearDeleteBacklog is executed.
    */
    var index = deletedTaskNums.indexOf(taskNum);
    deletedTaskNums.splice(index, 1);
    /*
    Add task back to submittedTasks object
    */
    app.store.submittedTasks["row-" + taskNum] = taskString;
    
    /* Create custom 'undo' event and dispatch it to all modules (specifically, to the searchBar module).
    */
    var undoEvent = new Event('undo');
    document.body.dispatchEvent(undoEvent);
  }

  /*
  When the user deletes a task, a notification bar slides down from the top. It will automatically dismiss itself after a certain period of time. taskNum is a number.
  */
  function showNotifyBar(taskNum) {
    window.clearTimeout(notifyTimer);
    notifyBar.classList.remove("hidden");
    notifyTimer = setTimeout(function() {
      hideNotifyBar(taskNum);
    }, 60000);
  }

  /*
  When the user clicks the 'dismiss' link, hide the notification bar. taskNum is a number.
  */
  function hideNotifyBar(taskNum) {
    notifyBar.classList.add("hidden");
  }
  
  /*
  When a user dismisses the notification bar, either by clicking the 'dismiss' link or by not interacting with the bar for a certain period of time, permanently delete the task. taskNum is a number.
  */
  function removeFromDOM(taskNum) {
    listNode = document.getElementById("list-item-container-" + taskNum);
    listNode.remove();
  }
  
}());
