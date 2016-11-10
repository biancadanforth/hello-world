/*
* To Do List application by Bianca Danforth
* notifyUndo.js module
* last edited 11/10/16
*/

var app = app ? app : {};

!(function () {
  
  'use strict';  

  var notifyBar = document.getElementById('notify-bar');
  var dismissLink = document.getElementById('dismiss-link');
  var undoLink = document.getElementById('undo-link');
  var deletedTaskIds = [];
  var deleteClickTimer;
  var notifyTimer;

  // Receive 'delete' event from listItem.js module
  document.body.addEventListener('delete',
  function notify(event) {
    
    clearTimeout(deleteClickTimer);
  
    var task = event.detail.task;
    showNotifyBar(task.id);
    
    undoLink.onclick = function clickToUndo() {
      undo(task);
    };

    dismissLink.onclick = function clickToDismiss() {
      hideNotifyBar(task.id);
    };

    deletedTaskIds.push(task.id);
    
    // The delay must exceed the delay on notifyTimer
    deleteClickTimer = setTimeout(clearDeleteBacklog, 65000);
  });
  
  
  // Remove spam-deleted tasks
  function clearDeleteBacklog() {
    for (var i = 0; i <= deletedTaskIds.length-1; i++) {
      var taskId = deletedTaskIds[i];
      removeFromDOM(taskId);
    }
    
    deletedTaskIds = [];
  }
  
  /*
  * Hides the notification bar and restores the task to the
  * list in its original location.  task is an object.
  */
  function undo(task) {
    var listNode = document.getElementById('task-container-'
     + task.id);
    listNode.classList.remove('hidden');
    hideNotifyBar(task.id);
    
    var index = deletedTaskIds.indexOf(task.id);
    deletedTaskIds.splice(index, 1);
    
    app.store.setTask(task.id, task);
    
    // Dispatch 'undo' event to the searchBar.js module
    var undoEvent = new Event('undo');
    document.body.dispatchEvent(undoEvent);
  }

  /*
  * Displays the notification bar. The bar will
  * automatically dismiss itself after a certain period
  *  of time. taskId is a number.
  */
  function showNotifyBar(taskId) {
    window.clearTimeout(notifyTimer);
    notifyBar.classList.remove('hidden');
    notifyBar.removeAttribute('aria-hidden');
    notifyTimer = setTimeout(function waitToDismiss() {
      hideNotifyBar(taskId);
    }, 60000);
  }

  // Hides the notification bar. taskId is a number.
  function hideNotifyBar(taskId) {
    notifyBar.classList.add('hidden');
    notifyBar.setAttribute('aria-hidden', 'true');
  }
  
  /*
  * Permanently deletes a task by removing it from the DOM.
  * taskId is a number.
  */
  function removeFromDOM(taskId) {
    listNode = document.getElementById('task-container-'
     + taskId);
    listNode.remove();
  }
  
}());
