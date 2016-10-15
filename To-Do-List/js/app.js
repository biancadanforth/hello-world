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


// ---------------------------------------------------------
// !----------CUSTOM EVENT DISPATCHERS/LISTENERS ----------!
// ---------------------------------------------------------
// Add these custom event listeners to the appropriate module for cross-module notification when events fire!
document.body.addEventListener("complete", function() {
  // put code here
  console.log("complete event fired!");
  }
);

document.body.addEventListener("delete", function() {
  // put code here
  console.log("delete event fired!");
  }
);

document.body.addEventListener("undo", function() {
  // put code here
  console.log("undo event fired!");
  }
);

document.body.addEventListener("search", function() {
  // put code here
  console.log("search event fired!");
  }
);

// Add these custom event dispatchers to fire off a custom event at the appropriate time in the code
//Note: You only need the Event constructor call right before the event is dispatched. It does not need to exist where the event is listened for. This is because events are handled centrally and you are passing in a reference name (e.g. 'delete') in the Event constructor call.
//If the Undo link in the notify bar is clicked, dispatch the 'Undo' event.
var undoEvent = new Event('undo');
document.body.dispatchEvent(undoEvent);

//If a task is clicked in the search results, dispatch the 'search' event (highlight the corresponding task in the list for a few seconds).
var searchEvent = new Event('search');
document.body.dispatchEvent(searchEvent);