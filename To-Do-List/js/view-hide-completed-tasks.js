/* Using a ternary operator to declare variable 'app' as an empty object regardless of which script is run first. Pseudocode: If app already exists (first condition), then do nothing. If it doesn't, then create it as an object with a nested store object.
*/
var app = app? app : {
  store: { 
    // The submittedTasks object is appended with a new property every time the user submits a task (by hitting 'Enter'), with key: value pairs of the form: row-x: "Task content string". Deleting or completing a task removes the corresponding property from this object.
    submittedTasks: {},
    // The completedTasks object  is appended with a new property every time the user completes a task (by clicking the checkbox), with key: value pairs of the form: row-x: "Task content string". These tasks can be viewed underneath the to do list and restored to the list.
    completedTasks: {},
  }
};

// Listen for when a task from the list-item module has been completed
document.body.addEventListener("complete", function(event) {
   // receive the row number (rowNum) and task string (taskString) from list-item module for the most recently completed task
  var taskInfo = event.detail;
  }
);