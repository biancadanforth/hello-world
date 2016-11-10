/*
* Using a ternary operator to declare variable 'app' as 
* an empty object regardless of which script is run first.
* Pseudocode: If app already exists (first condition),
* then do nothing. If it doesn't, then create it as an 
* object with a nested store object.
*/
var app = app ? app : {};

/*
* Wrap entire module in an immediately invoked function so 
* global variables in this module don't pollute the global
* namespace for the application. The ! at the start of the
* line allows Javascript ASI to kick in on the previous line
* and insert any missing semicolons for you. Per AirBnB ES5
* Style Guide.
*/
!(function () {
  
  'use strict';  

  var notifyBar = document.getElementById('notify-bar');
  var dismissLink = document.getElementById('dismiss-link');
  var undoLink = document.getElementById('undo-link');
  /*
  * If user spam deletes a bunch of tasks, make sure all of
  * them -- not just the most recently deleted task -- are
  * permanently deleted (i.e. removed from the DOM). Store
  * unique task numbers of each deleted task in 
  * deletedTaskIds array.
  */
  var deletedTaskIds = [];
  /*
  * Timer for when to remove all deleted tasks from the DOM
  * after the user has stopped deleting tasks.
  */
  var deleteClickTimer;
  /*
  * The timer for how long to show the notification bar before
  * it automatically dismisses itself if it is ignored.
  */
  var notifyTimer;

  /*
  * Listen for when a task from the list-item module has
  * been deleted.
  */
  document.body.addEventListener('delete',
  function notify(event) {
    
    clearTimeout(deleteClickTimer);
    
    /*
    * Receive the unique task information from listItem
    * module for the most recently deleted task
    */
    var task = event.detail.task;
    showNotifyBar(task.id);
    
    /*
    * If the user clicks undo, hide the notification bar and
    * restore the task to the list in its original location.
    */
    undoLink.onclick = function clickToUndo() {
      undo(task);
    };

    // If the user clicks dismiss, hide the notification bar.
    dismissLink.onclick = function clickToDismiss() {
      hideNotifyBar(task.id);
    };

    /*
    * If the user spam deletes a number of tasks at once, capture
    * the task.id for each task in deletedTaskIds and remove
    * each element from the DOM.
    */
    deletedTaskIds.push(task.id);
    
    /*
    * Run clearDeleteBacklog only if no tasks have been deleted in
    * a while. The delay must exceed the delay on notifyTimer
    */
    deleteClickTimer = setTimeout(clearDeleteBacklog, 65000);
  });
  
  
  /*
  * Remove spam-deleted tasks after a certain amount of time;
  * amount of time must be longer than the amount of time the 
  * user has to interact with the most recently triggered 
  * notification bar (because they could undo the most recently
  * deleted task.
  */
  function clearDeleteBacklog() {
    for (var i = 0; i <= deletedTaskIds.length-1; i++) {
      var taskId = deletedTaskIds[i];
      removeFromDOM(taskId);
    }
    
    /*
    * After permanently removing all deleted tasks from the DOM,
    * reset deletedTaskIds.
    */
    deletedTaskIds = [];
  }
  
  /*
  * If the user clicks the 'undo' link, hide the notification bar
  * and restore the task to the list in its original location.
  * task is an object of the form:
  * { id: <Number>, complete: <Boolean>, text: <String> }
  */
  function undo(task) {
    var listNode = document.getElementById('task-container-'
     + task.id);
    listNode.classList.remove('hidden');
    hideNotifyBar(task.id);
    
    /*
    * Remove task number (task.id) from deletedTaskIds, so it
    * isn't removed from the DOM when clearDeleteBacklog is
    * executed.
    */
    var index = deletedTaskIds.indexOf(task.id);
    deletedTaskIds.splice(index, 1);
    
    /*
    * Add task back to submittedTasks object
    * in localStorage.
    */
    app.store.setTask(task.id, task);
    
    /*
    * Create custom 'undo' event and dispatch it to all
    *  modules (specifically, to the searchBar module).
    */
    var undoEvent = new Event('undo');
    document.body.dispatchEvent(undoEvent);
  }

  /*
  * When the user deletes a task, a notification bar slides 
  * down from the top. It will automatically dismiss itself
  * after a certain period of time. taskId is a number.
  */
  function showNotifyBar(taskId) {
    window.clearTimeout(notifyTimer);
    notifyBar.classList.remove('hidden');
    notifyBar.removeAttribute('aria-hidden');
    notifyTimer = setTimeout(function waitToDismiss() {
      hideNotifyBar(taskId);
    }, 60000);
  }

  /*
  * When the user clicks the 'dismiss' link, hide the 
  * notification bar. taskId is a number.
  */
  function hideNotifyBar(taskId) {
    notifyBar.classList.add('hidden');
    notifyBar.setAttribute('aria-hidden', 'true');
  }
  
  /*
  * When a user dismisses the notification bar, either by
  * clicking the 'dismiss' link or by not interacting with
  * the bar for a certain period of time, permanently delete
  * the task. taskId is a number.
  */
  function removeFromDOM(taskId) {
    listNode = document.getElementById('task-container-'
     + taskId);
    listNode.remove();
  }
  
}());
